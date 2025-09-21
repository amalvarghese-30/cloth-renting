import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Modal.css';

const LoginModal = ({ isOpen, onClose, switchToRegister }) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const { login, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate fields before submitting
        if (!credentials.email || !credentials.password) {
            alert('Please fill in all fields');
            return;
        }

        console.log('Submitting login with:', credentials);

        try {
            await login(credentials);
            onClose();
        } catch (error) {
            console.error('Login failed:', error);
            // Error is already handled by auth context
        }
    };

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Login to Your Account</h5>
                    <button type="button" className="close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="rememberMe" />
                            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
                    </form>
                    <div className="text-center mt-3">
                        <a href="#" className="text-decoration-none">Forgot password?</a>
                    </div>
                    <div className="text-center mt-3">
                        <span>Don't have an account? </span>
                        <button className="switch-btn" onClick={switchToRegister}>
                            Register here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;