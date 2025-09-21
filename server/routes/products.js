// server/routes/products.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/products - Get all products with filtering
router.get('/', async (req, res) => {
    try {
        console.log('GET /api/products query:', req.query);

        const { category, size, brand, minPrice, maxPrice, occasion, page = 1, limit = 12, search } = req.query;

        const query = { available: true };

        // Add filters
        if (category) query.category = category;
        if (size) query.size = size;
        if (brand) query.brand = new RegExp(brand, 'i');
        if (occasion) query.occasion = occasion;

        // Search functionality
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { brand: new RegExp(search, 'i') }
            ];
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.rentalPrice = {};
            if (minPrice) query.rentalPrice.$gte = Number(minPrice);
            if (maxPrice) query.rentalPrice.$lte = Number(maxPrice);
        }

        const perPage = Math.min(Number(limit) || 12, 50); // Max 50 items per page
        const currentPage = Math.max(1, Number(page) || 1);
        const skip = (currentPage - 1) * perPage;

        // Get products with pagination
        const products = await Product.find(query)
            .limit(perPage)
            .skip(skip)
            .sort({ createdAt: -1 });

        // Get total count for pagination
        const total = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(total / perPage),
            currentPage,
            total,
            hasNext: currentPage < Math.ceil(total / perPage),
            hasPrev: currentPage > 1
        });
    } catch (error) {
        console.error('Products GET error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
    try {
        console.log('GET /api/products/:id', req.params.id);

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/products - Create product (admin only)
router.post('/', [auth, adminAuth], [
    check('name', 'Name is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('price', 'Price is required').isNumeric(),
    check('rentalPrice', 'Rental price is required').isNumeric(),
    check('category', 'Category is required').notEmpty(),
    check('size', 'Size is required').notEmpty(),
    check('brand', 'Brand is required').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
        }

        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', [auth, adminAuth], async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/products/:id/ratings - Add rating to product
router.post('/:id/ratings', auth, [
    check('rating', 'Rating is required and must be between 1-5').isInt({ min: 1, max: 5 }),
    check('comment', 'Comment must be less than 500 characters').optional().isLength({ max: 500 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { rating, comment } = req.body;

        // Add rating
        const newRating = {
            user: req.user._id,
            userName: req.user.name,
            rating,
            comment: comment || '',
            createdAt: new Date()
        };

        product.ratings.push(newRating);
        await product.save();

        res.json({ message: 'Rating added successfully', product });
    } catch (error) {
        console.error('Error adding rating:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;