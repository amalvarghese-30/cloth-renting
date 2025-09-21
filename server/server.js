// server.js - Complete with SMTP email functionality
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Load environment variables
dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    'https://rentique-frontend.onrender.com',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ADD THIS
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // ADD THIS
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'is set' : 'is NOT set');
        process.exit(1); // Exit if DB connection fails
    });
// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log('Error with SMTP configuration:', error);
    } else {
        console.log('SMTP server is ready to take our messages');
    }
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const rentalRoutes = require('./routes/rentals');
const adminUsersRoutes = require('./routes/adminUsers');

// Use routes with proper prefixes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/products', productRoutes);
app.use('/api/rentals', rentalRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Stripe test endpoint
app.get('/api/test-stripe', async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000, // $10.00
            currency: 'usd',
            metadata: { test: 'true' }
        });
        res.json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Contact form endpoint with SMTP email
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Email options for admin notification
        const mailOptions = {
            from: email,
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            subject: `Contact Form: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <hr>
                <p>This email was sent from the contact form on your website.</p>
            `,
        };

        // Send email to admin
        await transporter.sendMail(mailOptions);

        // Send confirmation email to user
        const userMailOptions = {
            from: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            to: email,
            subject: 'Thank you for contacting us',
            html: `
                <h2>Thank you for your message, ${name}!</h2>
                <p>We have received your inquiry and will get back to you within 24 hours.</p>
                <p><strong>Your message:</strong></p>
                <p>${message}</p>
                <hr>
                <p>Best regards,<br/>The FashionRent Team</p>
            `,
        };

        await transporter.sendMail(userMailOptions);

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Handle undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
