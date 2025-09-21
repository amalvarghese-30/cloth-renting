import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();

    // Safe handling of potentially undefined values
    const safeCartItems = cartItems || [];
    const safeGetCartTotal = getCartTotal || (() => 0);

    const subtotal = safeGetCartTotal();
    const deliveryFee = 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    const handleQuantityChange = (productId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

    if (!safeCartItems || safeCartItems.length === 0) {
        return (
            <div className="cart">
                <div className="container">
                    <div className="cart-header">
                        <h1>Shopping Cart</h1>
                    </div>
                    <div className="empty-cart">
                        <i className="fas fa-shopping-cart"></i>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any items to your cart yet.</p>
                        <Link to="/products" className="btn btn-primary">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart">
            <div className="container">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <button onClick={clearCart} className="btn btn-outline">
                        Clear Cart
                    </button>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {safeCartItems.map(item => (
                            <div key={item._id || item.id} className="cart-item">
                                <img
                                    src={item.images && item.images[0] ? item.images[0] : '/placeholder-image.jpg'}
                                    alt={item.name || 'Product'}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-details">
                                    <h3>{item.name || 'Unnamed Product'}</h3>
                                    <p className="cart-item-brand">{item.brand || 'No Brand'}</p>
                                    <p className="cart-item-price">$(item.rentalPrice || item.price || 0).toFixed(2)}/day</p>
                                </div>
                                <div className="cart-item-controls">
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => handleQuantityChange(item._id || item.id, item.quantity || 1, -1)}
                                            className="quantity-btn"
                                        >
                                            -
                                        </button>
                                        <span className="quantity">{item.quantity || 1}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item._id || item.id, item.quantity || 1, 1)}
                                            className="quantity-btn"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item._id || item.id)}
                                        className="remove-btn"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                                <div className="cart-item-total">
                                    $((item.rentalPrice || item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>$subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Fee</span>
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
                        <Link to="/checkout" className="btn btn-primary checkout-btn">
                            Proceed to Checkout
                        </Link>
                        <Link to="/products" className="continue-shopping">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;