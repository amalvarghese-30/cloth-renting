import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onRentClick }) => {
    // Check if product exists and provide fallback values
    if (!product) {
        return (
            <div className="product-card error">
                <div className="product-image">
                    <img
                        src="/placeholder-image.jpg"
                        alt="Product not available"
                    />
                </div>
                <div className="product-info">
                    <h3>Product Not Available</h3>
                    <p className="brand">Unknown Brand</p>
                    <span className="category">Unavailable</span>

                    <div className="price-container">
                        <div>
                            <div className="price-label">Rental Price</div>
                            <div className="rental-price">$0/day</div>
                        </div>
                        <div className="product-actions">
                            <button className="btn btn-outline" disabled>
                                Details
                            </button>
                            <button className="btn btn-primary" disabled>
                                Not Available
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Safely extract properties with fallbacks
    const {
        _id = 'unknown',
        name = 'Unnamed Product',
        brand = 'Unknown Brand',
        category = 'Uncategorized',
        rentalPrice = 0,
        available = false,
        images = []
    } = product;

    // Get the first image or use a placeholder
    const imageUrl = images && images.length > 0
        ? images[0]
        : '/placeholder-image.jpg';

    const handleRentClick = (e) => {
        e.preventDefault();
        if (onRentClick) {
            onRentClick(product);
        }
    };

    return (
        <div className="product-card">
            <div className="product-image">
                <img
                    src={imageUrl}
                    alt={name}
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                    }}
                />
            </div>
            <div className="product-info">
                <h3>{name}</h3>
                <p className="brand">{brand}</p>
                <span className="category">{category}</span>

                <div className="price-container">
                    <div>
                        <div className="price-label">Rental Price</div>
                        <div className="rental-price">Rs{rentalPrice}/day</div>
                    </div>
                    <div className="product-actions">
                        <Link to={`/products/${_id}`} className="btn btn-outline">
                            Details
                        </Link>
                        <button
                            className="btn btn-primary"
                            onClick={handleRentClick}
                            disabled={!available}
                        >
                            {available ? 'Rent Now' : 'Not Available'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;