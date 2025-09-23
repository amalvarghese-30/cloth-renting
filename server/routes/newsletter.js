// server/routes/newsletter.js - Final working version
const express = require('express');
const { check, validationResult } = require('express-validator');
const Subscriber = require('../models/Subscriber');
const { sendWelcomeEmail, sendTestEmail } = require('../services/emailService');

const router = express.Router();

// POST /api/newsletter/subscribe - Subscribe to newsletter
router.post('/subscribe', [
    check('email', 'Please include a valid email').isEmail().normalizeEmail()
], async (req, res) => {
    try {
        console.log('📧 Newsletter subscription request received:', req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address',
                errors: errors.array()
            });
        }

        const { email } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        // Check if already subscribed
        let subscriber = await Subscriber.findOne({ email: normalizedEmail });

        if (subscriber) {
            if (subscriber.isActive) {
                return res.status(200).json({
                    success: true,
                    message: 'You are already subscribed to our newsletter!',
                    alreadySubscribed: true,
                    email: subscriber.email
                });
            } else {
                // Reactivate inactive subscriber
                subscriber.isActive = true;
                subscriber.subscribedAt = new Date();
                await subscriber.save();
            }
        } else {
            // Create new subscriber
            subscriber = new Subscriber({
                email: normalizedEmail,
                subscribedAt: new Date()
            });
            await subscriber.save();
        }

        // Send welcome email (non-blocking)
        try {
            await sendWelcomeEmail(normalizedEmail);
            console.log('✅ Welcome email sent to:', normalizedEmail);
        } catch (emailError) {
            console.error('❌ Error sending welcome email:', emailError);
            // Don't fail the subscription if email fails
        }

        res.status(200).json({
            success: true,
            message: 'Successfully subscribed to our newsletter! You will receive a welcome email shortly.',
            email: subscriber.email,
            subscribedAt: subscriber.subscribedAt
        });

    } catch (error) {
        console.error('❌ Newsletter subscription error:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            const existingSubscriber = await Subscriber.findOne({ email: req.body.email.toLowerCase().trim() });
            return res.status(200).json({
                success: true,
                message: 'You are already subscribed to our newsletter!',
                alreadySubscribed: true,
                email: existingSubscriber.email
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during subscription. Please try again.'
        });
    }
});

// GET /api/newsletter/status
router.get('/status', (req, res) => {
    res.json({
        service: 'Newsletter API',
        status: 'Running',
        timestamp: new Date().toISOString(),
        smtpConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASS)
    });
});

// GET /api/newsletter/test
router.get('/test', async (req, res) => {
    try {
        const testEmail = process.env.SMTP_USER;
        if (!testEmail) {
            return res.status(500).json({
                success: false,
                message: 'SMTP_USER not configured'
            });
        }

        const result = await sendTestEmail(testEmail);
        res.json({
            success: true,
            message: 'Test email sent successfully',
            details: result
        });
    } catch (error) {
        console.error('❌ Test email failed:', error);
        res.status(500).json({
            success: false,
            message: 'Test email failed: ' + error.message
        });
    }
});

// GET /api/newsletter/subscribers
router.get('/subscribers', async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
        res.json({
            success: true,
            total: subscribers.length,
            active: subscribers.filter(s => s.isActive).length,
            subscribers: subscribers.map(s => ({
                email: s.email,
                isActive: s.isActive,
                subscribedAt: s.subscribedAt,
                subscriptionSource: s.subscriptionSource
            }))
        });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subscribers'
        });
    }
});

module.exports = router;