// server/services/emailService.js - Final working version
const nodemailer = require('nodemailer');

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
transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ SMTP Connection Error:', error);
    } else {
        console.log('✅ Email Service SMTP Server is ready to send emails');
    }
});

const sendWelcomeEmail = async (email) => {
    try {
        console.log('📧 Attempting to send welcome email to:', email);

        const mailOptions = {
            from: `"Rentique" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Welcome to Rentique Newsletter! 👗',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
                    <div style="background: #8B7355; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-family: 'Playfair Display', serif;">Welcome to Rentique!</h1>
                    </div>
                    <div style="padding: 30px; background: white;">
                        <p>Hello there,</p>
                        <p>Thank you for subscribing to the Rentique newsletter! We're thrilled to have you join our fashion community. 🎉</p>
                        
                        <p>As a subscriber, you'll be the first to know about:</p>
                        <ul>
                            <li>✨ <strong>New product arrivals</strong> - Get early access to our latest collections</li>
                            <li>🎁 <strong>Exclusive offers</strong> - Special discounts just for subscribers</li>
                            <li>💡 <strong>Fashion tips</strong> - Style inspiration and trend updates</li>
                            <li>🌟 <strong>Special events</strong> - First invites to sales and promotions</li>
                        </ul>
                        
                        <p>We're excited to help you elevate your style with our premium fashion rentals!</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
                               style="background: #8B7355; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Browse Our Collection
                            </a>
                        </div>
                    </div>
                    <div style="text-align: center; padding: 20px; color: #666; background: white; border-radius: 0 0 10px 10px;">
                        <p>Happy shopping!<br><strong>The Rentique Team</strong></p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to: ${email}, Message ID: ${result.messageId}`);
        return result;

    } catch (error) {
        console.error(`❌ Error sending welcome email to ${email}:`, error);
        throw error;
    }
};

const sendTestEmail = async (toEmail) => {
    try {
        const mailOptions = {
            from: `"Rentique" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: 'Test Email - Rentique SMTP Configuration',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #8B7355;">✅ SMTP Test Successful!</h2>
                    <p>This is a test email from Rentique's newsletter system.</p>
                    <p>If you're receiving this, your SMTP configuration is working correctly.</p>
                    <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                </div>
            `
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
    transporter
};