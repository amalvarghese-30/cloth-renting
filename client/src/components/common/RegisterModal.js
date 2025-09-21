import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Modal.css';

const RegisterModal = ({ isOpen, onClose, switchToLogin }) => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const { register, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.password !== userData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        try {
            await register(userData);
            onClose();
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Create an Account</h5>
                    <button type="button" className="close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="fiRstName" className="form-label">FiRst Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                name="phone"
                                value={userData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={userData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={userData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="termsAgree" required />
                            <label className="form-check-label" htmlFor="termsAgree">
                                I agree to the Terms & Conditions
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mt-3">Register</button>
                    </form>
                    <div className="text-center mt-3">
                        <span>Already have an account? </span>
                        <button className="switch-btn" onClick={switchToLogin}>
                            Login here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;