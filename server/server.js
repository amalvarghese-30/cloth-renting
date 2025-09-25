// server.js - Keep contact form functionality, fix newsletter imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Load environment variables FIRST
dotenv.config();

// Add this at the top of server.js after dotenv.config()
console.log('🔍 DEBUG - Environment Variables:');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET');
console.log('SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET');
console.log('SMTP_USER:', process.env.SMTP_USER || 'NOT SET');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET (' + process.env.SMTP_PASS.length + ' chars)' : 'NOT SET');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'SET (' + process.env.STRIPE_SECRET_KEY.substring(0, 10) + '...)' : 'NOT SET');
console.log('Current directory:', __dirname);

// Initialize Stripe AFTER environment variables are loaded
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
const corsOptions = {
    origin: [
        'https://rentique-frontend.onrender.com',
        'http://localhost:3000',
        'http://localhost:3001'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
    secure: false,
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
const newsletterRoutes = require('./routes/newsletter');

// Use routes with proper prefixes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin/users', adminUsersRoutes);
app.use('/products', productRoutes);
app.use('/rentals', rentalRoutes);
app.use('/newsletter', newsletterRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Contact form endpoint with SMTP email (KEEP THIS)
app.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Email options for admin notification
        const mailOptions = {
            from: `"Contact Form" <${process.env.SMTP_USER}>`, // Fixed from field
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            subject: `Contact Form: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #8B7355;">New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
                    <hr>
                    <p><em>This email was sent from the contact form on your website.</em></p>
                </div>
            `,
        };

        // Send email to admin
        await transporter.sendMail(mailOptions);

        // Send confirmation email to user
        const userMailOptions = {
            from: `"Rentique Support" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Thank you for contacting Rentique',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #8B7355;">Thank you for your message, ${name}!</h2>
                    <p>We have received your inquiry and will get back to you within 24 hours.</p>
                    
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>Your message:</strong></p>
                        <p>${message}</p>
                    </div>
                    
                    <p><strong>Our business hours:</strong><br>
                    Monday - Friday: 9AM - 6PM EST<br>
                    Saturday: 10AM - 4PM EST</p>
                    
                    <hr>
                    <p>Best regards,<br><strong>The Rentique Team</strong></p>
                </div>
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
