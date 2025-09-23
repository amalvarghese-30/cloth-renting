const nodemailer = require('nodemailer');
const Subscriber = require('../models/Subscriber');

// Create SMTP transporter using your environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false // For local development, remove in production if you have proper SSL
    }
});

// Verify SMTP connection on startup
transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP Connection Error:', error);
    } else {
        console.log('✅ SMTP Server is ready to send emails');
    }
});

// Send new product notification to all subscribers
const sendNewProductNotification = async (product) => {
    try {
        // Get all active subscribers
        const subscribers = await Subscriber.find({ isActive: true });

        if (subscribers.length === 0) {
            console.log('No active subscribers to notify');
            return { success: true, message: 'No active subscribers' };
        }

        console.log(`📧 Sending new product notification to ${subscribers.length} subscribers`);

        let successCount = 0;
        let errorCount = 0;

        // Send email to each subscriber with rate limiting
        for (const [index, subscriber] of subscribers.entries()) {
            try {
                const mailOptions = {
                    from: `"Rentique" <${process.env.SMTP_USER}>`,
                    to: subscriber.email,
                    subject: `🎉 New Arrival: ${product.name} - Rentique Fashion`,
                    html: generateNewProductEmail(product, subscriber.email)
                };

                await transporter.sendMail(mailOptions);
                successCount++;
                console.log(`✅ Notification sent to: ${subscriber.email}`);

                // Update last notified timestamp
                subscriber.lastNotified = new Date();
                await subscriber.save();

                // Add delay to avoid hitting rate limits (100ms between emails)
                if (index < subscribers.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

            } catch (error) {
                errorCount++;
                console.error(`❌ Failed to send email to ${subscriber.email}:`, error.message);
                // Continue with other emails even if one fails
            }
        }

        console.log(`📊 Newsletter results: ${successCount} successful, ${errorCount} failed`);
        return {
            success: true,
            total: subscribers.length,
            successCount,
            errorCount
        };

    } catch (error) {
        console.error('❌ Error in sendNewProductNotification:', error);
        throw error;
    }
};

// Generate HTML email template for new product notification
const generateNewProductEmail = (product, subscriberEmail) => {
    const productImage = product.images && product.images.length > 0
        ? product.images[0]
        : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const unsubscribeUrl = `${frontendUrl}/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`;

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Arrival at Rentique!</title>
            <style>
                body { 
                    font-family: 'Arial', sans-serif; 
                    line-height: 1.6; 
                    color: #2c2c2c; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: #f5f5f5;
                }
                .container { 
                    background: white; 
                    border-radius: 10px; 
                    overflow: hidden; 
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
                    margin: 20px;
                }
                .header { 
                    background: #8B7355; 
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                }
                .header h1 { 
                    margin: 0; 
                    font-size: 28px; 
                    font-family: 'Playfair Display', serif;
                }
                .content { 
                    padding: 30px; 
                }
                .product-card { 
                    background: #f8f8f8; 
                    border-radius: 8px; 
                    padding: 20px; 
                    margin: 20px 0; 
                    border-left: 4px solid #8B7355;
                }
                .product-image { 
                    max-width: 100%; 
                    height: 250px; 
                    object-fit: cover; 
                    border-radius: 8px; 
                    margin-bottom: 15px;
                }
                .btn { 
                    display: inline-block; 
                    background: #8B7355; 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 10px 0; 
                    font-weight: bold;
                    text-align: center;
                }
                .btn:hover {
                    background: #6d5a41;
                }
                .footer { 
                    text-align: center; 
                    padding: 20px; 
                    color: #666; 
                    font-size: 14px; 
                    background: #f9f9f9;
                    border-top: 1px solid #eee;
                }
                .unsubscribe { 
                    color: #8B7355; 
                    text-decoration: none; 
                    font-size: 12px;
                }
                @media (max-width: 600px) {
                    .content { padding: 20px; }
                    .header { padding: 20px; }
                    .header h1 { font-size: 24px; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Arrival at Rentique! 🎉</h1>
                    <p>We thought you'd love to see our latest addition</p>
                </div>
                
                <div class="content">
                    <p>Hello fashion enthusiast,</p>
                    <p>We're excited to announce a stunning new addition to our collection that we think you'll love!</p>
                    
                    <div class="product-card">
                        <img src="${productImage}" alt="${product.name}" class="product-image">
                        <h2 style="color: #8B7355; margin-top: 0;">${product.name}</h2>
                        <p><strong>Brand:</strong> ${product.brand}</p>
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p><strong>Size:</strong> ${product.size}</p>
                        <p><strong>Rental Price:</strong> <span style="color: #8B7355; font-weight: bold;">Rs${product.rentalPrice}/day</span></p>
                        <p>${product.description || 'This exquisite piece is perfect for your next special occasion. Elevate your style effortlessly!'}</p>
                        
                        <a href="${frontendUrl}/products/${product._id}" class="btn">
                            👗 View This Product
                        </a>
                    </div>
                    
                    <p>As a valued subscriber, you're among the first to see our new arrivals!</p>
                    
                    <p>Happy styling,<br>The Rentique Team</p>
                </div>
                
                <div class="footer">
                    <p><strong>Rentique - Premium Fashion Rentals</strong></p>
                    <p>123 Fashion Street, New York, NY 10001</p>
                    <p>
                        <a href="${unsubscribeUrl}" class="unsubscribe">
                            Unsubscribe from these notifications
                        </a>
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Send welcome email to new subscribers
const sendWelcomeEmail = async (email) => {
    try {
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

        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to: ${email}`);

    } catch (error) {
        console.error(`❌ Error sending welcome email to ${email}:`, error);
        throw error;
    }
};

// Test email function (for debugging)
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

        await transporter.sendMail(mailOptions);
        console.log(`✅ Test email sent to: ${toEmail}`);
        return { success: true, message: 'Test email sent successfully' };

    } catch (error) {
        console.error('❌ Test email failed:', error);
        throw error;
    }
};

module.exports = {
    sendNewProductNotification,
    sendWelcomeEmail,
    sendTestEmail,
    transporter
};