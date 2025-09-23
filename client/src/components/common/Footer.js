// Footer.js - Final working version
import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!email) {
            setSubscriptionStatus('Please enter your email address');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setSubscriptionStatus('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setSubscriptionStatus('');

        try {
            const response = await fetch('http://localhost:5000/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    if (data.alreadySubscribed) {
                        setSubscriptionStatus('already-subscribed');
                    } else {
                        setSubscriptionStatus('success');
                    }
                    setEmail('');
                    setTimeout(() => setSubscriptionStatus(''), 5000);
                } else {
                    setSubscriptionStatus(data.message || 'Subscription failed. Please try again.');
                }
            } else {
                setSubscriptionStatus(data.message || 'Subscription failed. Please try again.');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            setSubscriptionStatus('Network error. Please check if the server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4 className="footer-logo">Rentique</h4>
                        <p>Rent premium fashion for every occasion without the commitment of buying.</p>
                        <div className="social-icons">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-pinterest-p"></i></a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h5>Quick Links</h5>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/products">Browse</a></li>
                            <li><a href="/how-it-works">How It Works</a></li>
                            <li><a href="/about">About</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h5>Categories</h5>
                        <ul>
                            <li><a href="/products?category=formal">Formal Wear</a></li>
                            <li><a href="/products?category=party">Party Wear</a></li>
                            <li><a href="/products?category=casual">Casual Wear</a></li>
                            <li><a href="/products?category=accessories">Accessories</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h5>Newsletter</h5>
                        <p>Subscribe to get updates on new arrivals and special offers.</p>
                        <form onSubmit={handleSubscribe} className="newsletter-form">
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={isLoading}>
                                {isLoading ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>

                        {subscriptionStatus && (
                            <div className={`subscription-message ${subscriptionStatus === 'success' || subscriptionStatus === 'already-subscribed'
                                ? 'success'
                                : 'error'
                                }`}>
                                {subscriptionStatus === 'success'
                                    ? '🎉 Thank you for subscribing! You\'ll receive a welcome email shortly.'
                                    : subscriptionStatus === 'already-subscribed'
                                        ? '✅ You are already subscribed to our newsletter!'
                                        : subscriptionStatus
                                }
                            </div>
                        )}
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <div className="copyright">
                        <p>&copy; {new Date().getFullYear()} Rentique. All rights reserved.</p>
                    </div>
                    <div className="footer-links">
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/terms">Terms of Service</a>
                        <a href="/contact">Contact Us</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;