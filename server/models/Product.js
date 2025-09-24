// server/models/Product.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500, trim: true },
    userName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    rentalPrice: { type: Number, required: true, min: 0 },
    category: {
        type: String,
        required: true,
        enum: ['formal', 'casual', 'party', 'traditional', 'accessories', 'pants', 'shirts', 'dresses', 'suits', 'jackets', 'shoes']
    },
<<<<<<< HEAD
    size: { type: String, required: true, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'] },
=======
    size: { type: String, required: true, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL','One Size'] },
>>>>>>> 464cc768c83d12c7adfab3f0f2b3f29fea8a753f
    brand: { type: String, required: true },
    images: [{ type: String, required: true }],
    available: { type: Boolean, default: true },
    rentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    rentalEndDate: { type: Date, default: null },
    occasion: { type: String, enum: ['wedding', 'party', 'formal', 'casual', 'festive'] },
    material: { type: String },
    color: { type: String },
    condition: { type: String, enum: ['new', 'excellent', 'good', 'fair'], default: 'excellent' },
    rentalCount: { type: Number, default: 0 },
    ratings: [ratingSchema],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 }
}, { timestamps: true });

// ... rest of your schema methods

module.exports = mongoose.model('Product', productSchema);

productSchema.pre('save', function (next) {
    if (this.ratings?.length) {
        const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
        this.averageRating = total / this.ratings.length;
        this.totalRatings = this.ratings.length;
    } else {
        this.averageRating = 0;
        this.totalRatings = 0;
    }
    next();
});

productSchema.statics.addRating = async function (productId, userId, userName, rating, comment) {
    const product = await this.findById(productId);
    if (!product) return null;

    const idx = product.ratings.findIndex(r => r.user.toString() === userId.toString());
    if (idx >= 0) {
        product.ratings[idx].rating = rating;
        product.ratings[idx].comment = comment;
        product.ratings[idx].createdAt = new Date();
    } else {
        product.ratings.push({ user: userId, userName, rating, comment });
    }
    return await product.save();
};

module.exports = mongoose.model('Product', productSchema);
