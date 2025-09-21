// client/src/pages/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/product/StarRating';
import ProductReviews from '../components/product/ProductReviews';
import './ProductDetail.css';

const ProductDetail = ({ onRentClick }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                console.log('Fetching product with ID:', id);
                const productData = await productService.getById(id);
                console.log('Product data received:', productData);
                setProduct(productData);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError('Product not found');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleRentClick = () => {
        onRentClick(product);
    };

    const handleAddReview = async (reviewData) => {
        try {
            const updatedProduct = await productService.addRating(product._id, reviewData);
            setProduct(updatedProduct);
        } catch (error) {
            console.error('Error adding review:', error);
            alert('Failed to add review');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-message">{error}</div>;
    if (!product) return <div className="error-message">Product not found</div>;

    // Add safe defaults for product properties
    const safeProduct = {
        averageRating: 0,
        totalRatings: 0,
        ratings: [],
        rentalCount: 0,
        condition: 'excellent',
        material: '',
        color: '',
        brand: '',
        category: '',
        size: '',
        description: '',
        name: 'Unknown Product',
        rentalPrice: 0,
        available: false,
        images: [], // Ensure images is always an array
        ...product
    };

    // Get the main image safely
    const mainImage = safeProduct.images && safeProduct.images.length > 0
        ? safeProduct.images[selectedImage]
        : '/placeholder-image.jpg';

    return (
        <div className="product-detail">
            <div className="container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                <div className="product-content">
                    <div className="product-images">
                        <div className="main-image">
                            <img
                                src={mainImage}
                                alt={safeProduct.name}
                                onError={(e) => {
                                    e.target.src = '/placeholder-image.jpg';
                                }}
                            />
                        </div>
                        {safeProduct.images && safeProduct.images.length > 1 && (
                            <div className="image-thumbnails">
                                {safeProduct.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${safeProduct.name} ${index + 1}`}
                                        className={selectedImage === index ? 'active' : ''}
                                        onClick={() => setSelectedImage(index)}
                                        onError={(e) => {
                                            e.target.src = '/placeholder-image.jpg';
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="product-info">
                        <h1>{safeProduct.name}</h1>
                        <p className="brand">{safeProduct.brand}</p>
                        <p className="category">{safeProduct.category}</p>

                        <div className="price-section">
                            <span className="rental-price">Rs{safeProduct.rentalPrice}/day</span>
                            <span className={`availability ${safeProduct.available ? 'available' : 'unavailable'}`}>
                                {safeProduct.available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>

                        <div className="product-details">
                            <h3>Description</h3>
                            <p>{safeProduct.description}</p>

                            <div className="specs">
                                <div className="spec">
                                    <span className="spec-label">Size:</span>
                                    <span className="spec-value">{safeProduct.size}</span>
                                </div>
                                <div className="spec">
                                    <span className="spec-label">Material:</span>
                                    <span className="spec-value">{safeProduct.material || 'Not specified'}</span>
                                </div>
                                <div className="spec">
                                    <span className="spec-label">Color:</span>
                                    <span className="spec-value">{safeProduct.color || 'Not specified'}</span>
                                </div>
                                <div className="spec">
                                    <span className="spec-label">Condition:</span>
                                    <span className="spec-value">{safeProduct.condition}</span>
                                </div>
                                <div className="spec">
                                    <span className="spec-label">Times Rented:</span>
                                    <span className="spec-value">{safeProduct.rentalCount || 0}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary rent-btn"
                            onClick={handleRentClick}
                            disabled={!safeProduct.available}
                        >
                            {safeProduct.available ? 'Rent Now' : 'Not Available'}
                        </button>
                    </div>
                </div>

                <ProductReviews
                    product={safeProduct}
                    onAddReview={handleAddReview}
                />
            </div>
        </div>
    );
};

export default ProductDetail;