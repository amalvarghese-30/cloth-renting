import React from 'react';
import './StarRating.css';

const StarRating = ({ rating = 0, onRatingChange, editable = false, size = 'medium' }) => {
    const handleClick = (newRating) => {
        if (editable && onRatingChange) {
            onRatingChange(newRating);
        }
    };

    return (
        <div className={`star-rating ${size}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`star ${star <= rating ? 'filled' : ''} ${editable ? 'editable' : ''}`}
                    onClick={() => handleClick(star)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRating;
