// client/src/components/common/PaymentModal.js
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import rentalService from '../../services/rentalService';
import './PaymentModal.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ rental, totalAmount, onPaymentSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        try {
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                rental.clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: rental.user?.name || 'Customer',
                            email: rental.user?.email || '',
                        },
                    },
                }
            );

            if (stripeError) {
                setError(stripeError.message);
                setLoading(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // Confirm payment with backend
                await rentalService.confirmPayment(rental.rental._id);
                onPaymentSuccess();
            }
        } catch (err) {
            setError('Payment failed. Please try again.');
            console.error('Payment error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-modal-content">
            <h3>Pay with Card</h3>
            <p className="total-amount">Total: ${totalAmount}</p>

            <form onSubmit={handleSubmit} className="payment-form">
                <div className="card-element-container">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                            },
                        }}
                    />
                </div>

                {error && <div className="payment-error">{error}</div>}

                <div className="payment-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!stripe || loading}
                    >
                        {loading ? 'Processing...' : `Pay $${totalAmount}`}
                    </button>
                </div>
            </form>
        </div>
    );
};

const PaymentModal = ({ isOpen, onClose, rental, totalAmount, onPaymentSuccess }) => {
    const [selectedMethod, setSelectedMethod] = useState('card');

    const handleCODPayment = async () => {
        try {
            // For COD, we just confirm the payment
            await rentalService.confirmPayment(rental.rental._id);
            onPaymentSuccess();
        } catch (error) {
            console.error('COD payment error:', error);
            alert('Failed to confirm COD order. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay payment-modal-overlay">
            <div className="modal-content payment-modal">
                <div className="modal-header">
                    <h3>Complete Payment</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="payment-methods">
                    <label className="payment-method">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={selectedMethod === 'card'}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                        />
                        <span>Credit/Debit Card</span>
                    </label>

                    <label className="payment-method">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={selectedMethod === 'cod'}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                        />
                        <span>Cash on Delivery (COD)</span>
                    </label>
                </div>

                {selectedMethod === 'card' ? (
                    <Elements stripe={stripePromise}>
                        <CheckoutForm
                            rental={rental}
                            totalAmount={totalAmount}
                            onPaymentSuccess={onPaymentSuccess}
                            onClose={onClose}
                        />
                    </Elements>
                ) : (
                    <div className="cod-content">
                        <p>You'll pay ${totalAmount} when the product is delivered.</p>
                        <div className="payment-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleCODPayment}
                            >
                                Confirm COD Order
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;