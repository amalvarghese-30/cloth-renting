import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitted(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setError(data.message || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            setError('Network error. Please check your connection and try again.');
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact">
            <div className="container">
                <div className="contact-header">
                    <h1>Contact Us</h1>
                    <p>We'd love to hear from you. Get in touch with us!</p>
                </div>

                <div className="contact-content">
                    <div className="contact-info">
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <div className="info-content">
                                <h3>Visit Us</h3>
                                <p>123 Fashion Street<br />New York, NY 10001</p>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-phone"></i>
                            </div>
                            <div className="info-content">
                                <h3>Call Us</h3>
                                <p>+1 (555) 123-4567<br />Mon-Fri, 9AM-6PM EST</p>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <div className="info-content">
                                <h3>Email Us</h3>
                                <p>support@fashionrent.com<br />info@fashionrent.com</p>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="info-content">
                                <h3>Business Hours</h3>
                                <p>Monday - Friday: 9AM - 6PM<br />Saturday: 10AM - 4PM<br />Sunday: Closed</p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-section">
                        <div className="form-card">
                            <h2>Send us a Message</h2>
                            {submitted ? (
                                <div className="success-message">
                                    <i className="fas fa-check-circle"></i>
                                    <h3>Thank you for your message!</h3>
                                    <p>We'll get back to you within 24 hours.</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="btn btn-primary"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form">
                                    {error && <div className="error-message">{error}</div>}

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Your Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter your email address"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder="What is this regarding?"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Message</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="5"
                                            placeholder="Tell us how we can help you..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary submit-btn"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i> Sending...
                                            </>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;