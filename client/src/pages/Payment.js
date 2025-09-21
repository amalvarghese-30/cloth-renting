import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Payment.css';

const Payment = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: '',
        email: ''
    });

    const subtotal = getCartTotal();
    const deliveryFee = 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate payment processing
        setTimeout(() => {
            setLoading(false);
            clearCart();
            navigate('/payment/success');
        }, 3000);
    };

    if (cartItems.length === 0) {
        return (
            <div className="payment">
                <div className="container">
                    <div className="empty-cart">
                        <i className="fas fa-shopping-cart"></i>
                        <h2>Your cart is empty</h2>
                        <p>Add some items to your cart before proceeding to payment.</p>
                        <button onClick={() => navigate('/products')} className="btn btn-primary">
                            Browse Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment">
            <div className="container">
                <div className="payment-header">
                    <h1>Payment</h1>
                    <p>Complete your purchase</p>
                </div>

                <div className="payment-content">
                    <div className="payment-form-section">
                        <div className="payment-methods">
                            <h3>Select Payment Method</h3>
                            <div className="method-options">
                                <button
                                    className={`method-option $selectedMethod === 'card' ? 'active' : ''}`}
                                    onClick={() => setSelectedMethod('card')}
                                >
                                    <i className="fas fa-credit-card"></i>
                                    Credit/Debit Card
                                </button>
                                <button
                                    className={`method-option $selectedMethod === 'paypal' ? 'active' : ''}`}
                                    onClick={() => setSelectedMethod('paypal')}
                                >
                                    <i className="fab fa-paypal"></i>
                                    PayPal
                                </button>
                                <button
                                    className={`method-option $selectedMethod === 'apple' ? 'active' : ''}`}
                                    onClick={() => setSelectedMethod('apple')}
                                >
                                    <i className="fab fa-apple"></i>
                                    Apple Pay
                                </button>
                            </div>
                        </div>

                        {selectedMethod === 'card' && (
                            <form onSubmit={handleSubmit} className="payment-form">
                                <div className="form-group">
                                    <label>Card Number</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        placeholder="1234 5678 9012 3456"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Expiry Date</label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleChange}
                                            placeholder="MM/YY"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>CVV</label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            placeholder="123"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Name on Card</label>
                                    <input
                                        type="text"
                                        name="cardName"
                                        value={formData.cardName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email for Receipt</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary payment-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : `Pay Rs$total.toFixed(2)}`}
                                </button>
                            </form>
                        )}

                        {selectedMethod === 'paypal' && (
                            <div className="alternative-method">
                                <i className="fab fa-paypal"></i>
                                <h3>Pay with PayPal</h3>
                                <p>You will be redirected to PayPal to complete your payment.</p>
                                <button className="btn btn-paypal">
                                    Continue with PayPal
                                </button>
                            </div>
                        )}

                        {selectedMethod === 'apple' && (
                            <div className="alternative-method">
                                <i className="fab fa-apple"></i>
                                <h3>Pay with Apple Pay</h3>
                                <p>Complete your payment using Apple Pay.</p>
                                <button className="btn btn-apple">
                                    Pay with Apple Pay
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="order-items">
                            {cartItems.map(item => (
                                <div key={item._id} className="order-item">
                                    <img
                                        src={item.images && item.images[0] ? item.images[0] : '/placeholder-image.jpg'}
                                        alt={item.name}
                                    />
                                    <div className="item-details">
                                        <h4>{item.name}</h4>
                                        <p>Qty: {item.quantity}</p>
                                    </div>
                                    <div className="item-price">
                                        $(item.rentalPrice * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="summary-totals">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>$subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Delivery</span>
                                <span>$deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax</span>
                                <span>$tax.toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>$total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="security-notice">
                    <i className="fas fa-lock"></i>
                    <p>Your payment information is secure and encrypted</p>
                </div>
            </div>
        </div>
    );
};

export default Payment;