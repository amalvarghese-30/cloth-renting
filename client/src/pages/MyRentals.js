import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import rentalService from '../services/rentalService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './MyRentals.css';

const MyRentals = () => {
    const { user } = useAuth();
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchRentals = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const rentalsData = await rentalService.getMyRentals();
                setRentals(rentalsData);
            } catch (error) {
                setError('Failed to load rentals');
                console.error('Error fetching rentals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRentals();
    }, [user]);

    const handleCancelRental = async (rentalId) => {
        if (!window.confirm('Are you sure you want to cancel this rental?')) {
            return;
        }

        try {
            await rentalService.updateStatus(rentalId, 'cancelled');
            // Update the specific rental in state instead of refetching all
            setRentals(prevRentals =>
                prevRentals.map(rental =>
                    rental._id === rentalId
                        ? { ...rental, status: 'cancelled' }
                        : rental
                )
            );
        } catch (error) {
            console.error('Error cancelling rental:', error);
            alert('Failed to cancel rental. Please try again.');
        }
    };

    const handleRequestReturn = async (rentalId) => {
        try {
            await rentalService.updateStatus(rentalId, 'return_requested');
            setRentals(prevRentals =>
                prevRentals.map(rental =>
                    rental._id === rentalId
                        ? { ...rental, status: 'return_requested' }
                        : rental
                )
            );
            alert('Return request submitted successfully!');
        } catch (error) {
            console.error('Error requesting return:', error);
            alert('Failed to request return. Please try again.');
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'badge-warning',
            confirmed: 'badge-info',
            shipped: 'badge-primary',
            delivered: 'badge-success',
            returned: 'badge-secondary',
            cancelled: 'badge-danger',
            return_requested: 'badge-info'
        };

        return `badge ${statusClasses[status] || 'badge-secondary'}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format currency in Indian Rupees
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const filterRentals = (status) => {
        setFilter(status);
    };

    const filteredRentals = filter === 'all'
        ? rentals
        : rentals.filter(rental => rental.status === filter);

    if (!user) {
        return (
            <div className="my-rentals">
                <div className="container">
                    <div className="not-logged-in">
                        <h2>Please log in to view your rentals</h2>
                        <p>You need to be logged in to see your rental history.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="my-rentals">
            <div className="container">
                <div className="page-header">
                    <h1>My Rentals</h1>
                    <p>Manage your current and past rentals</p>
                </div>

                {rentals.length > 0 && (
                    <div className="rental-filters">
                        <button
                            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
                            onClick={() => filterRentals('all')}
                        >
                            All Rentals
                        </button>
                        <button
                            className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
                            onClick={() => filterRentals('pending')}
                        >
                            Pending
                        </button>
                        <button
                            className={filter === 'active' ? 'filter-btn active' : 'filter-btn'}
                            onClick={() => filterRentals('active')}
                        >
                            Active
                        </button>
                    </div>
                )}

                {filteredRentals.length === 0 ? (
                    <div className="no-rentals">
                        <h3>No rentals found</h3>
                        <p>You haven't rented any items yet. Start browsing our collection!</p>
                    </div>
                ) : (
                    <div className="rentals-list">
                        {filteredRentals.map(rental => {
                            // Add null checks for product data
                            const product = rental.product || {};
                            const productName = product.name || 'Unknown Product';
                            const productImages = product.images || [];
                            const imageUrl = productImages[0] || '/placeholder-image.jpg';

                            return (
                                <div key={rental._id} className="rental-card">
                                    <div className="rental-image">
                                        <img
                                            src={imageUrl}
                                            alt={productName}
                                            onError={(e) => {
                                                e.target.src = '/placeholder-image.jpg';
                                            }}
                                        />
                                    </div>

                                    <div className="rental-details">
                                        <h3>{productName}</h3>
                                        <p className="rental-period">
                                            {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                                        </p>
                                        <p className="total-cost">Total: {formatCurrency(rental.totalCost)}</p>

                                        <div className="rental-status">
                                            <span className={getStatusBadge(rental.status)}>
                                                {rental.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rental-actions">
                                        {rental.status === 'pending' && (
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleCancelRental(rental._id)}
                                            >
                                                Cancel Rental
                                            </button>
                                        )}

                                        {rental.status === 'delivered' && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleRequestReturn(rental._id)}
                                            >
                                                Request Return
                                            </button>
                                        )}

                                        {rental.status === 'return_requested' && (
                                            <span className="return-pending">Return requested - awaiting confirmation</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRentals;