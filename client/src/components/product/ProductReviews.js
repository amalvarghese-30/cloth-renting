import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import StarRating from './StarRating';
import './ProductReviews.css';

const ProductReviews = ({ product, onAddReview }) => {
    const { user } = useAuth();
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');

    // Add safe defaults for product properties
    const safeProduct = {
        averageRating: 0,
        totalRatings: 0,
        ratings: [],
        ...product
    };

const handleSubmitReview = async () => {
    if (reviewRating > 0) {
        try {
            await onAddReview({
                rating: reviewRating,
                comment: reviewComment
            });
            setReviewRating(0);
            setReviewComment('');
            setShowReviewForm(false);
        } catch (error) {
            console.error('Failed to submit review', error);
        }
    }
};


    return (
        <div className="product-reviews">
            <h3>Customer Reviews</h3>

            <div className="reviews-summary">
                <div className="average-rating">
                    {/* FIX: Use safeProduct.averageRating with fallback */}
                    <span className="rating-number">
                        {safeProduct.averageRating?.toFixed(1) || '0.0'}
                    </span>
                    <StarRating rating={safeProduct.averageRating || 0} size="large" />
                    <span className="total-ratings">
                        ({safeProduct.totalRatings || 0} reviews)
                    </span>
                </div>
            </div>

            {user && !showReviewForm && (
                <button
                    className="btn btn-primary"
                    onClick={() => setShowReviewForm(true)}
                >
                    Write a Review
                </button>
            )}

            {showReviewForm && (
                <div className="review-form">
                    <h4>Write Your Review</h4>
                    <div className="form-group">
                        <label>Rating</label>
                        <StarRating
                            rating={reviewRating}
                            onRatingChange={setReviewRating}
                            editable={true}
                        />
                    </div>
                    <div className="form-group">
                        <label>Comment (Optional)</label>
                        <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows="3"
                            placeholder="Share your experience with this product..."
                        />
                    </div>
                    <div className="form-actions">
                        <button
                            className="btn btn-outline"
                            onClick={() => setShowReviewForm(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmitReview}
                            disabled={reviewRating === 0}
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            )}

            <div className="reviews-list">
{product.ratings && product.ratings.length > 0 ? (
    product.ratings.map((review, index) => ( 
                        <div key={index} className="review-item">
                            <div className="review-header">
                                <StarRating rating={review.rating} size="small" />
                                <span className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            {review.comment && (
                                <p className="review-comment">{review.comment}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No reviews yet. Be the first to review!</p>
                )}
            </div>
        </div>
    );
};
export default ProductReviews;
