const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Check if it's a mock token for development
        if (token === 'admin-token-123') {
            req.user = {
                _id: '507f1f77bcf86cd799439011',
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@rentique.com',
                role: 'admin'
            };
            return next();
        }

        if (token.startsWith('demo-token-')) {
            req.user = {
                _id: '507f1f77bcf86cd799439012',
                firstName: 'Demo',
                lastName: 'User',
                email: 'demo@rentique.com',
                role: 'user'
            };
            return next();
        }

        // Verify actual JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const adminAuth = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

module.exports = { auth, adminAuth };