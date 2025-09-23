const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastNotified: Date,
    subscriptionSource: {
        type: String,
        default: 'website'
    }
});

// Index for better query performance
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ isActive: 1, lastNotified: 1 });

module.exports = mongoose.model('Subscriber', subscriberSchema);