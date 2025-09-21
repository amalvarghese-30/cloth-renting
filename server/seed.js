const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        await Product.create({
            _id: new mongoose.Types.ObjectId('68ce4cc454d168d09c059181'),
            name: 'Test Dress',
            description: 'Test product',
            price: 100,
            rentalPrice: 50,
            category: 'dresses',
            size: 'M',
            brand: 'Test Brand',
            images: ['https://example.com/image.jpg'],
            available: true
        });
        console.log('Product seeded');
        process.exit();
    }).catch(err => {
        console.error('Error seeding product:', err);
        process.exit(1);
    });