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
        const productData = await productService.getById(id);
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleRentClick = () => {
    if (product) onRentClick(product);
  };

  const handleAddReview = async (reviewData) => {
    try {
      const updatedProduct = await productService.addRating(product._id, reviewData);
      setProduct(updatedProduct); // ✅ update reviews immediately
    } catch (err) {
      console.error('Error adding review:', err);
      alert('Failed to add review');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  // Safe defaults
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
    images: [],
    ...product
  };

  const mainImage =
    safeProduct.images && safeProduct.images.length > 0
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
                onError={(e) => (e.target.src = '/placeholder-image.jpg')}
              />
            </div>

            {safeProduct.images.length > 1 && (
              <div className="image-thumbnails">
                {safeProduct.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${safeProduct.name} ${idx + 1}`}
                    className={selectedImage === idx ? 'active' : ''}
                    onClick={() => setSelectedImage(idx)}
                    onError={(e) => (e.target.src = '/placeholder-image.jpg')}
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
                  <span className="spec-value">{safeProduct.rentalCount}</span>
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

        {/* Reviews Section */}
        <div className="reviews-section">
          <h3>Reviews ({safeProduct.ratings.length})</h3>
          {safeProduct.ratings.length > 0 ? (
            safeProduct.ratings.map((r) => (
              <div key={r._id} className="review-item">
                <StarRating value={r.rating} readOnly />
                <p>{r.comment}</p>
                <small>by {r.userName}</small>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}

          {/* Add review form */}
          {user && (
            <ProductReviews
              product={safeProduct}
              onAddReview={handleAddReview}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
