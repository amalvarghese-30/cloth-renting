// client/src/components/common/RentalModal.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import rentalService from '../../services/rentalService'; // Fixed import
import PaymentModal from './PaymentModal';
import './RentalModal.css';

const RentalModal = ({ isOpen, onClose, product, onRentalSuccess }) => {
    const { user } = useAuth();
    const [rentalData, setRentalData] = useState({
        startDate: '',
        endDate: '',
        size: 'M',
        damageProtection: false,
        deliveryAddress: '',
        paymentMethod: 'card'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [createdRental, setCreatedRental] = useState(null);

    const calculateTotalCost = () => {
        if (!rentalData.startDate || !rentalData.endDate || !product) return 0;

        const start = new Date(rentalData.startDate);
        const end = new Date(rentalData.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const baseCost = days * product.rentalPrice;
        const protectionCost = rentalData.damageProtection ? 5 : 0;

        return baseCost + protectionCost;
    };

    const handleRentalSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to rent items');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const totalCost = calculateTotalCost();
            const rental = await rentalService.create({
                productId: product._id,
                startDate: rentalData.startDate,
                endDate: rentalData.endDate,
                deliveryAddress: rentalData.deliveryAddress,
                paymentMethod: rentalData.paymentMethod,
                size: rentalData.size,
                damageProtection: rentalData.damageProtection,
                totalCost: totalCost
            });

            setCreatedRental(rental);

            if (rentalData.paymentMethod === 'card') {
                setShowPayment(true);
            } else {
                // For COD, show success immediately
                alert('Rental booked successfully! You will pay when the item is delivered.');
                if (onRentalSuccess) onRentalSuccess(rental.rental || rental);
                onClose();
            }
        } catch (error) {
            console.error('Rental failed:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to book rental. Please try again.';
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        alert('Payment successful! Rental confirmed.');
        if (onRentalSuccess && createdRental) onRentalSuccess(createdRental.rental || createdRental);
        setShowPayment(false);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRentalData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (!isOpen || !product) return null;

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content rental-modal">
                    <div className="modal-header">
                        <h5 className="modal-title">Rent {product.name}</h5>
                        <button type="button" className="close-btn" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="rental-content">
                            <div className="product-image">
                                <img
                                    src={product.images && product.images[0] ? product.images[0] : '/placeholder-image.jpg'}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
                            </div>

                            <div className="rental-details">
                                <h4>{product.name}</h4>
                                <p className="text-muted">{product.description}</p>

                                <div className="price-section">
                                    <span className="price">${product.rentalPrice}/day</span>
                                    <span className="badge available">Available</span>
                                </div>

                                {error && <div className="alert alert-danger">{error}</div>}

                                <form onSubmit={handleRentalSubmit} className="rental-form">
                                    <div className="form-group">
                                        <label className="form-label">Select Size</label>
                                        <div className="size-options">
                                            {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                                <label key={size} className="size-option">
                                                    <input
                                                        type="radio"
                                                        name="size"
                                                        value={size}
                                                        checked={rentalData.size === size}
                                                        onChange={handleChange}
                                                    />
                                                    <span>{size}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="date-row">
                                        <div className="form-group">
                                            <label htmlFor="startDate" className="form-label">Start Date</label>
                                            <input
                                                type="date"
                                                id="startDate"
                                                name="startDate"
                                                value={rentalData.startDate}
                                                onChange={handleChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="endDate" className="form-label">End Date</label>
                                            <input
                                                type="date"
                                                id="endDate"
                                                name="endDate"
                                                value={rentalData.endDate}
                                                onChange={handleChange}
                                                min={rentalData.startDate || new Date().toISOString().split('T')[0]}
                                                required
                                                className="form-control"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="deliveryAddress" className="form-label">Delivery Address</label>
                                        <textarea
                                            id="deliveryAddress"
                                            name="deliveryAddress"
                                            value={rentalData.deliveryAddress}
                                            onChange={handleChange}
                                            rows="3"
                                            required
                                            className="form-control"
                                            placeholder="Enter your complete delivery address"
                                        />
                                    </div>

                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            id="damageProtection"
                                            name="damageProtection"
                                            checked={rentalData.damageProtection}
                                            onChange={handleChange}
                                            className="form-check-input"
                                        />
                                        <label htmlFor="damageProtection" className="form-check-label">
                                            Add damage protection (+$5)
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Payment Method</label>
                                        <div className="payment-options">
                                            <label className="payment-option">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="card"
                                                    checked={rentalData.paymentMethod === 'card'}
                                                    onChange={handleChange}
                                                />
                                                <span>Pay Online</span>
                                            </label>
                                            <label className="payment-option">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="cod"
                                                    checked={rentalData.paymentMethod === 'cod'}
                                                    onChange={handleChange}
                                                />
                                                <span>Cash on Delivery</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="total-cost">
                                        <h4>Total: ${calculateTotalCost()}</h4>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Proceed to Payment'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showPayment && createdRental && (
                <PaymentModal
                    isOpen={showPayment}
                    onClose={() => setShowPayment(false)}
                    rental={createdRental}
                    totalAmount={calculateTotalCost()}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
        </>
    );
};

export default RentalModal;