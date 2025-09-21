import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import rentalService from '../services/rentalService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRentals: 0,
        activeRentals: 0,
        totalSpent: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rentalsData = await rentalService.getMyRentals();
                setRentals(rentalsData.slice(0, 3));

                const totalRentals = rentalsData.length;
                const activeRentals = rentalsData.filter(r =>
                    ['pending', 'confirmed', 'shipped', 'delivered'].includes(r.status)
                ).length;
                const totalSpent = rentalsData.reduce((sum, rental) => sum + rental.totalCost, 0);

                setStats({ totalRentals, activeRentals, totalSpent });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <h1>Welcome back, {user?.firstName}!</h1>
                    <p>Here's your rental activity at a glance</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="fas fa-calendar-check"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.totalRentals}</h3>
                            <p>Total Rentals</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="fas fa-truck-moving"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.activeRentals}</h3>
                            <p>Active Rentals</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="fas fa-dollar-sign"></i>
                        </div>
                        <div className="stat-info">
                            <h3>Rs{stats.totalSpent}</h3>
                            <p>Total Spent</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-content">
                    <div className="recent-activity">
                        <div className="section-header">
                            <h2>Recent Rentals</h2>
                            <Link to="/my-rentals" className="view-all">View All</Link>
                        </div>

                        {rentals.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-box-open"></i>
                                <h3>No rentals yet</h3>
                                <p>Start browsing our collection to find your perfect outfit!</p>
                                <Link to="/products" className="btn btn-primary">
                                    Browse Collection
                                </Link>
                            </div>
                        ) : (
                            <div className="rentals-list">
                                {rentals.map(rental => (
                                    <div key={rental._id} className="rental-item">
                                        <img
                                            src={rental.product?.images?.[0] || '/placeholder-image.jpg'}
                                            alt={rental.product?.name}
                                            className="rental-image"
                                        />
                                        <div className="rental-details">
                                            <h4>{rental.product?.name || 'Unknown Product'}</h4>
                                            <p className="rental-period">
                                                {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                                            </p>
                                            <span className={`status-badge status-${rental.status}`}>
                                                {rental.status}
                                            </span>
                                        </div>
                                        <div className="rental-cost">
                                            Rs{rental.totalCost}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="quick-actions">
                        <h2>Quick Actions</h2>
                        <div className="action-cards">
                            <Link to="/products" className="action-card">
                                <i className="fas fa-search"></i>
                                <h3>Browse Items</h3>
                                <p>Explore our collection</p>
                            </Link>
                            <Link to="/my-rentals" className="action-card">
                                <i className="fas fa-history"></i>
                                <h3>Rental History</h3>
                                <p>View past rentals</p>
                            </Link>
                            <Link to="/profile" className="action-card">
                                <i className="fas fa-user-cog"></i>
                                <h3>Profile Settings</h3>
                                <p>Update your information</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;