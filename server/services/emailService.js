// server/services/emailService.js
const nodemailer = require('nodemailer');
const Subscriber = require('../models/Subscriber');

// Debug: Check environment variables
console.log('🔍 Email Service - SMTP Configuration:');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS length:', process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 'MISSING');

// Create SMTP transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify SMTP connection
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP Connection Error:', error);
    } else {
        console.log('✅ Email Service SMTP Server is ready to send emails');
    }
});

// Send welcome email
const sendWelcomeEmail = async (email) => {
    try {
        const mailOptions = {
            from: `"Rentique" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Welcome to Rentique Newsletter! 👗',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; border-radius: 10px;">
                <div style="background: #8B7355; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1>Welcome to Rentique!</h1>
                </div>
                <div style="padding: 30px; background: white;">
                    <p>Hello,</p>
                    <p>Thank you for subscribing to Rentique! 🎉</p>
                    <ul>
                        <li>✨ <strong>New arrivals</strong> – Be the first to know</li>
                        <li>🎁 <strong>Exclusive offers</strong> – Special discounts</li>
                        <li>💡 <strong>Fashion tips</strong> – Style inspiration</li>
                        <li>🌟 <strong>Special events</strong> – First invites to sales</li>
                    </ul>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
                           style="background: #8B7355; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Browse Collection</a>
                    </div>
                </div>
                <div style="text-align: center; padding: 20px; color: #666; background: white; border-radius: 0 0 10px 10px;">
                    <p>Happy shopping!<br><strong>The Rentique Team</strong></p>
                </div>
            </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${email}, ID: ${result.messageId}`);
        return result;
    } catch (error) {
        console.error(`❌ Error sending welcome email to ${email}:`, error);
        throw error;
    }
};

// Send new product or price drop notification
const sendNewProductNotification = async (product, type = 'new', extra = {}) => {
    try {
        const subscribers = await Subscriber.find({ isActive: true });
        if (!subscribers.length) return;

        for (const sub of subscribers) {
            let subject = '';
            let html = '';

            if (type === 'new') {
                subject = `🎉 New Product Alert: ${product.name}`;
                html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; border-radius: 10px;">
                    <div style="background: #8B7355; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1>New Arrival!</h1>
                    </div>
                    <div style="padding: 30px; background: white;">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p><strong>Rental Price:</strong> ₹${product.rentalPrice}</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products/${product._id}" 
                               style="background: #8B7355; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">View Product</a>
                        </div>
                    </div>
                    <div style="text-align: center; padding: 20px; color: #666; background: white; border-radius: 0 0 10px 10px;">
                        <p>Happy shopping!<br><strong>The Rentique Team</strong></p>
                    </div>
                </div>
                `;
            } else if (type === 'priceDrop') {
                const oldPrice = extra.oldPrice || product.price;
                const oldRentalPrice = extra.oldRentalPrice || product.rentalPrice;

                subject = `💰 Price Drop Alert: ${product.name}`;
                html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff7e6; padding: 20px; border-radius: 10px;">
                    <div style="background: #ff9800; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1>Price Drop Alert!</h1>
                    </div>
                    <div style="padding: 30px; background: white;">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <p><strong>Old Price:</strong> <del>₹${oldPrice}</del></p>
                        <p><strong>New Price:</strong> ₹${product.price}</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products/${product._id}" 
                               style="background: #ff9800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Grab the Deal</a>
                        </div>
                    </div>
                    <div style="text-align: center; padding: 20px; color: #666; background: white; border-radius: 0 0 10px 10px;">
                        <p>Don't miss out!<br><strong>The Rentique Team</strong></p>
                    </div>
                </div>
                `;
            }

            const mailOptions = {
                from: `"Rentique" <${process.env.SMTP_USER}>`,
                to: sub.email,
                subject,
                html
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log(`✅ Email sent to ${sub.email} for ${type}`);
                sub.lastNotified = new Date();
                await sub.save();
            } catch (err) {
                console.error(`❌ Failed to send email to ${sub.email}:`, err);
            }
        }
    } catch (err) {
        console.error('❌ Error sending product notifications:', err);
        throw err;
    }
};

// Send test email
const sendTestEmail = async (toEmail) => {
    try {
        const mailOptions = {
            from: `"Rentique" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: 'Test Email - Rentique SMTP Configuration',
            html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #8B7355;">✅ SMTP Test Successful!</h2>
                <p>This is a test email from Rentique's newsletter system.</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            </div>`
        };
        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Test email sent to: ${toEmail}, Message ID: ${result.messageId}`);
        return { success: true, message: 'Test email sent successfully', messageId: result.messageId };
    } catch (error) {
        console.error('❌ Test email failed:', error);
        throw error;
    }
};

module.exports = {
    sendWelcomeEmail,
    sendTestEmail,
    sendNewProductNotification,
    transporter
};
