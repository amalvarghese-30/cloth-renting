// Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
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
                            <li><a href="/testimonials">Testimonials</a></li>
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
                        <div className="newsletter-form">
                            <input type="email" placeholder="Your email address" />
                            <button type="button">Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <div className="copyright">
                        <p>&copy; 2023 Rentique. All rights reserved.</p>
                    </div>
                    <div className="footer-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Contact Us</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;