// server/routes/rentals.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const Rental = require('../models/Rental');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Create rental with payment - SINGLE IMPLEMENTATION
router.post('/', auth, [
    check('productId', 'Product ID is required').not().isEmpty(),
    check('startDate', 'Start date is required').isISO8601(),
    check('endDate', 'End date is required').isISO8601(),
    check('deliveryAddress', 'Delivery address is required').not().isEmpty(),
    check('paymentMethod', 'Payment method is required').isIn(['cod', 'card'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { productId, startDate, endDate, deliveryAddress, paymentMethod, size, damageProtection } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (!product.available) return res.status(400).json({ message: 'Product is not available for rental' });

        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        const baseCost = days * product.rentalPrice;
        const protectionCost = damageProtection ? 5 : 0;
        const totalCost = baseCost + protectionCost;

        // Set status based on payment method
        let status = 'pending';
        let paymentStatus = 'pending';

        if (paymentMethod === 'cod') {
            status = 'confirmed';
            paymentStatus = 'pending';
        }

        const rental = new Rental({
            user: req.user._id,
            product: productId,
            startDate: start,
            endDate: end,
            totalCost,
            deliveryAddress,
            size: size || 'M',
            damageProtection: damageProtection || false,
            status,
            paymentMethod,
            paymentStatus
        });

        await rental.save();

        // If COD, mark product as rented immediately
        if (paymentMethod === 'cod') {
            product.available = false;
            product.rentedBy = req.user._id;
            product.rentalEndDate = end;
            product.rentalCount += 1;
            await product.save();

            return res.status(201).json({
                rental,
                requiresPayment: false
            });
        }

        // If card payment, create Stripe payment intent
        if (paymentMethod === 'card') {
            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: Math.round(totalCost * 100), // Convert to cents
                    currency: 'usd',
                    metadata: {
                        rentalId: rental._id.toString(),
                        userId: req.user._id.toString(),
                        productId: productId
                    }
                });

                return res.status(201).json({
                    rental,
                    clientSecret: paymentIntent.client_secret,
                    requiresPayment: true
                });
            } catch (stripeError) {
                console.error('Stripe error:', stripeError);
                // Delete the rental if Stripe fails
                await Rental.findByIdAndDelete(rental._id);
                return res.status(500).json({ message: 'Payment processing failed' });
            }
        }

    } catch (e) {
        console.error('Rental creation error:', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// Confirm payment and update rental status
router.post('/:id/confirm-payment', auth, async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).json({ message: 'Rental not found' });

        // Check if user owns this rental
        if (rental.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        rental.status = 'confirmed';
        rental.paymentStatus = 'completed';
        await rental.save();

        // Mark product as rented
        const product = await Product.findById(rental.product);
        if (product) {
            product.available = false;
            product.rentedBy = req.user._id;
            product.rentalEndDate = rental.endDate;
            product.rentalCount += 1;
            await product.save();
        }

        res.json({ message: 'Payment confirmed successfully', rental });
    } catch (e) {
        console.error('Payment confirmation error:', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// My rentals
router.get('/my-rentals', auth, async (req, res) => {
    try {
        const rentals = await Rental.find({ user: req.user._id })
            .populate('product', 'name images rentalPrice brand category')
            .sort({ createdAt: -1 });
        res.json(rentals);
    } catch (e) {
        console.error('Get my rentals error:', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// All rentals (admin)
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
        const rentals = await Rental.find()
            .populate('user', 'name email')
            .populate('product', 'name brand category images')
            .sort({ createdAt: -1 });
        res.json(rentals);
    } catch (e) {
        console.error('Get all rentals error:', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update rental status
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const rental = await Rental.findById(req.params.id).populate('product');
        if (!rental) return res.status(404).json({ message: 'Rental not found' });

        const isOwner = req.user._id.toString() === rental.user.toString();
        if (req.user.role !== 'admin' && !isOwner) {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (req.user.role !== 'admin' && status !== 'cancelled') {
            return res.status(403).json({ message: 'You can only cancel rentals' });
        }

        // If returning, mark product as available
        if (status === 'returned' && rental.product) {
            rental.product.available = true;
            rental.product.rentedBy = null;
            rental.product.rentalEndDate = null;
            await rental.product.save();
        }

        rental.status = status;
        await rental.save();
        res.json(rental);
    } catch (e) {
        console.error('Update rental status error:', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// Return product
router.post('/:id/return', auth, async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id)
            .populate('product')
            .populate('user');

        if (!rental) return res.status(404).json({ message: 'Rental not found' });

        // Check if user owns this rental or is admin
        const isOwner = req.user._id.toString() === rental.user._id.toString();
        if (req.user.role !== 'admin' && !isOwner) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Mark product as available again
        if (rental.product) {
            rental.product.available = true;
            rental.product.rentedBy = null;
            rental.product.rentalEndDate = null;
            await rental.product.save();
        }

        // Update rental status
        rental.status = 'returned';
        await rental.save();

        res.json({ message: 'Product returned successfully', rental });
    } catch (e) {
        console.error('Return rental error:', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get rental by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id)
            .populate('user', 'name email')
            .populate('product', 'name brand images rentalPrice');

        if (!rental) return res.status(404).json({ message: 'Rental not found' });

        // Check if user owns this rental or is admin
        const isOwner = req.user._id.toString() === rental.user._id.toString();
        if (req.user.role !== 'admin' && !isOwner) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(rental);
    } catch (e) {
        console.error('Get rental by ID error:', e);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;