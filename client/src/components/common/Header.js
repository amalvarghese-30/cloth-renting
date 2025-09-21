// client/src/components/common/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = ({ onLoginClick, onRegisterClick }) => {
    const { user, logout } = useAuth();
    const { items: cartItems } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const cartItemsCount = (cartItems || []).reduce((total, item) => total + (item.quantity || 0), 0);

    return (
        <header className="header">
            <div className="container">
                <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
                    <h2>Rentique</h2>
                </Link>

                <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>Browse</Link>
                    <Link to="/how-it-works" className="nav-link" onClick={() => setIsMenuOpen(false)}>How It Works</Link>
                    <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link>
                    <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>

                    {user && (
                        <>
                            <Link to="/my-rentals" className="nav-link" onClick={() => setIsMenuOpen(false)}>My Rentals</Link>
                            <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)}>Admin</Link>
                            )}
                        </>
                    )}
                </nav>

                <div className="header-actions">
                    {user ? (
                        <div className="user-menu">
                            <div className="user-profile">
                                <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                                <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
                            </div>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <button onClick={onLoginClick} className="nav-btn login-btn">Login</button>
                            <button onClick={onRegisterClick} className="nav-btn register-btn">Register</button>
                        </div>
                    )}

                    <Link to="/cart" className="cart-icon" onClick={() => setIsMenuOpen(false)}>
                        <i className="fas fa-shopping-bag"></i>
                        {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
                    </Link>
                </div>

                <button className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                    <span />
                    <span />
                    <span />
                </button>
            </div>
        </header>
    );
};

export default Header;