// HowItWorks.js - Minor text correction
import React from 'react';
import { Link } from 'react-router-dom';
import './HowItWorks.css';

const HowItWorks = () => {
    return (
        <div className="how-it-works-page">
            <div className="container">
                <div className="page-header">
                    <h1>How It Works</h1>
                    <p>Rent clothes in three simple steps</p>
                </div>

                <div className="steps-section">
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Browse & Select</h3>
                                <p>Explore our collection and choose the items you want to rent. Use filters to find exactly what you need.</p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Choose Rental Period</h3>
                                <p>Select your rental duration and schedule delivery. We offer flexible rental periods to suit your needs.</p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Wear & Return</h3>
                                <p>Wear your rented items, then schedule a pickup for return. We handle cleaning and maintenance.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="faq-section">
                    <h2>Frequently Asked Questions</h2>

                    <div className="faq-list">
                        <div className="faq-item">
                            <h4>How does the rental process work?</h4>
                            <p>Our rental process is simple: browse our collection, select your rental period, complete your order, and we'll deliver the items to your doorstep. After your rental period, we'll schedule a pickup for the return.</p>
                        </div>

                        <div className="faq-item">
                            <h4>What if I damage the clothing?</h4>
                            <p>We understand that accidents happen. We offer damage protection plans that you can add to your rental. For minor damages, we typically handle them without additional charges. For significant damages, fees will be based on the extent of damage and the item's value.</p>
                        </div>

                        <div className="faq-item">
                            <h4>How do you ensure hygiene?</h4>
                            <p>All items are professionally cleaned and sanitized after each rental using industry-standard methods. We follow strict hygiene protocols to ensure every item you receive is fresh and ready to wear.</p>
                        </div>

                        <div className="faq-item">
                            <h4>What is your cancellation policy?</h4>
                            <p>You can cancel your rental up to 24 hours before the scheduled delivery date for a full refund. Cancellations made less than 24 hours in advance may incur a small processing fee.</p>
                        </div>
                    </div>
                </div>

                <div className="cta-section">
                    <h2>Ready to Get Started?</h2>
                    <p>Join thousands of satisfied customers who enjoy premium fashion without the commitment.</p>
                    <Link to="/products" className="btn-accent">
                        Start Renting
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;