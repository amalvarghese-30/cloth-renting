// ProductCard.js - Fixed layout version
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onRentClick, onFavoriteClick }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Check if product exists and provide fallback values
    if (!product) {
        return (
            <div className="product-card error">
                <div className="product-image">
                    <img
                        src="/placeholder-image.jpg"
                        alt="Product not available"
                        onLoad={() => setImageLoaded(true)}
                    />
                    <div className="availability-badge unavailable">Unavailable</div>
                </div>
                <div className="product-info">
                    <h3>Product Not Available</h3>
                    <p className="brand">Unknown Brand</p>
                    <span className="category">Unavailable</span>

                    <div className="price-container">
                        <div className="price-info">
                            <div className="price-label">Rental Price</div>
                            <div className="rental-price">Rs0/day</div>
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
        images = [],
        rating = 0,
        reviewCount = 0,
        discount = 0
    } = product;

    // Get the first image or use a placeholder
    const imageUrl = (images && images.length > 0 && !imageError)
        ? images[0]
        : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

    const handleRentClick = (e) => {
        e.preventDefault();
        if (onRentClick && available) {
            onRentClick(product);
        }
    };

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        if (onFavoriteClick) {
            onFavoriteClick(product, !isFavorite);
        }
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        // Implement quick view functionality
        console.log('Quick view:', product);
    };

    const handleImageError = (e) => {
        setImageError(true);
        e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const renderRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<i key={i} className="fas fa-star"></i>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
            } else {
                stars.push(<i key={i} className="far fa-star"></i>);
            }
        }
        return stars;
    };

    return (
        <div className="product-card">
            <div className="product-image">
                {!imageLoaded && !imageError && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: '#f8f8f8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 0
                    }}>
                        <i className="fas fa-spinner fa-spin" style={{ color: '#8B7355' }}></i>
                    </div>
                )}

                <img
                    src={imageUrl}
                    alt={name}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                    }}
                />

                {/* Availability Badge */}
                <div className={`availability-badge ${available ? 'available' : 'unavailable'}`}>
                    {available ? 'Available' : 'Rented'}
                </div>

                {/* Favorite Icon */}
                <button
                    className={`favorite-icon ${isFavorite ? 'active' : ''}`}
                    onClick={handleFavoriteClick}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <i className={`fas ${isFavorite ? 'fa-heart' : 'fa-heart'}`}></i>
                </button>

                {/* Discount Badge */}
                {discount > 0 && (
                    <div className="discount-badge">
                        -{discount}%
                    </div>
                )}

                {/* Quick View Overlay */}
                <div className="quick-view-overlay">
                    <button className="quick-view-btn" onClick={handleQuickView}>
                        Quick View
                    </button>
                </div>
            </div>

            <div className="product-info">
                <h3>{name}</h3>
                <p className="brand">{brand}</p>

                {/* Rating */}
                {(rating > 0 || reviewCount > 0) && (
                    <div className="rating">
                        <div className="rating-stars">
                            {renderRatingStars(rating)}
                        </div>
                        <span className="rating-count">({reviewCount})</span>
                    </div>
                )}

                <span className="category">{category}</span>

                <div className="price-container">
                    <div className="price-info">
                        <div className="price-label">Rental Price</div>
                        <div className="rental-price">
                            Rs{rentalPrice}/day
                            {discount > 0 && (
                                <span className="original-price">
                                    Rs{Math.round(rentalPrice * (1 + discount / 100))}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="product-actions">
                        <Link to={`/products/${_id}`} className="btn btn-outline">
                            Details
                        </Link>
                        <button
                            className="btn btn-primary"
                            onClick={handleRentClick}
                            disabled={!available}
                            aria-label={available ? `Rent ${name}` : 'Product not available'}
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