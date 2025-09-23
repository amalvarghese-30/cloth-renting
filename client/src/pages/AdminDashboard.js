import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { productService } from '../services/productService';
import rentalService from '../services/rentalService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductForm from '../components/admin/ProductForm';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalRentals: 0,
        activeRentals: 0,
        revenue: 0
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAllData();
    }, []);

    // In AdminDashboard.js, around line 38
    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('Fetching admin data...');

            // FIX: Use the correct method names from productService
            const [usersData, productsData, rentalsData] = await Promise.all([
                userService.getAllUsers(),
                productService.getAll(), // Changed from getAllProducts() to getAll()
                rentalService.getAllRentals()
            ]);

            console.log('Data fetched:', { usersData, productsData, rentalsData });

            // Ensure we have arrays even if API calls fail
            const safeUsers = Array.isArray(usersData) ? usersData : [];
            const safeProducts = Array.isArray(productsData?.products) ? productsData.products : (Array.isArray(productsData) ? productsData : []);
            const safeRentals = Array.isArray(rentalsData) ? rentalsData : [];

            const revenue = safeRentals.reduce((sum, rental) => sum + (rental.totalCost || 0), 0);
            const activeRentals = safeRentals.filter(r =>
                ['confirmed', 'shipped', 'delivered'].includes(r.status)
            ).length;

            setStats({
                totalUsers: safeUsers.length,
                totalProducts: safeProducts.length,
                totalRentals: safeRentals.length,
                activeRentals: activeRentals,
                revenue: revenue
            });

            setUsers(safeUsers);
            setProducts(safeProducts);
            setRentals(safeRentals);

        } catch (error) {
            console.error('Error fetching admin data:', error);
            setError('Failed to load data. Using demo data instead.');
            // ... rest of your fallback code
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setShowProductForm(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                console.log('Deleting product:', productId);
                const result = await productService.deleteProduct(productId);
                console.log('Delete result:', result);

                if (result && result.message) {
                    setProducts(products.filter(p => p._id !== productId));
                    setStats(prev => ({
                        ...prev,
                        totalProducts: prev.totalProducts - 1
                    }));
                    alert('Product deleted successfully');
                } else {
                    throw new Error('Delete operation failed');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert(`Failed to delete product: ${error.message || 'Please check if backend is running'}`);
            }
        }
    };

    const handleSaveProduct = async (productData) => {
        try {
            console.log('Saving product:', productData);

            // Ensure price is properly formatted
            const formattedData = {
                ...productData,
                price: parseFloat(productData.price) || 0,
                rentalPrice: parseFloat(productData.rentalPrice) || 0
            };

            let result;

            if (editingProduct) {
                // Update existing product
                result = await productService.updateProduct(editingProduct._id, formattedData);
                setProducts(products.map(p => p._id === editingProduct._id ? result : p));
            } else {
                // Create new product
                result = await productService.createProduct(formattedData);
                setProducts([...products, result]);
                setStats(prev => ({
                    ...prev,
                    totalProducts: prev.totalProducts + 1
                }));
            }

            console.log('Save result:', result);
            setShowProductForm(false);
            setEditingProduct(null);
            alert('Product saved successfully');

        } catch (error) {
            console.error('Error saving product:', error);
            alert(`Failed to save product: ${error.message || 'Please check if backend is running'}`);
        }
    };

    const handleCancelForm = () => {
        setShowProductForm(false);
        setEditingProduct(null);
    };

    const handleReturnProduct = async (rentalId) => {
        try {
            await rentalService.returnRental(rentalId);
            // Refresh data
            fetchAllData();
            alert('Product returned successfully');
        } catch (error) {
            console.error('Error returning product:', error);
            alert('Failed to return product');
        }
    };

    const handleForceReturn = async (productId) => {
        try {
            await productService.forceReturn(productId);
            // Refresh data
            fetchAllData();
            alert('Product force returned successfully');
        } catch (error) {
            console.error('Error force returning product:', error);
            alert('Failed to force return product');
        }
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="admin-dashboard">
                <div className="container">
                    <div className="access-denied">
                        <h2>Access Denied</h2>
                        <p>You need administrator privileges to access this page.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-dashboard">
            <div className="container">
                {error && (
                    <div className="error-banner">
                        <i className="fas fa-exclamation-triangle"></i>
                        {error}
                    </div>
                )}

                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage your clothing rental business</p>
                </div>

                <div className="admin-tabs">
                    <button
                        className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        Products
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'rentals' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rentals')}
                    >
                        Rentals
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <>
                        <div className="admin-stats-grid">
                            <div className="admin-stat-card">
                                <div className="admin-stat-icon">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="admin-stat-info">
                                    <h3>{stats.totalUsers}</h3>
                                    <p>Total Users</p>
                                </div>
                            </div>

                            <div className="admin-stat-card">
                                <div className="admin-stat-icon">
                                    <i className="fas fa-tshirt"></i>
                                </div>
                                <div className="admin-stat-info">
                                    <h3>{stats.totalProducts}</h3>
                                    <p>Total Products</p>
                                </div>
                            </div>

                            <div className="admin-stat-card">
                                <div className="admin-stat-icon">
                                    <i className="fas fa-calendar-check"></i>
                                </div>
                                <div className="admin-stat-info">
                                    <h3>{stats.totalRentals}</h3>
                                    <p>Total Rentals</p>
                                </div>
                            </div>

                            <div className="admin-stat-card">
                                <div className="admin-stat-icon">
                                    <i className="fas fa-truck"></i>
                                </div>
                                <div className="admin-stat-info">
                                    <h3>{stats.activeRentals}</h3>
                                    <p>Active Rentals</p>
                                </div>
                            </div>

                            <div className="admin-stat-card">
                                <div className="admin-stat-icon">
                                    <i className="fas fa-dollar-sign"></i>
                                </div>
                                <div className="admin-stat-info">
                                    <h3>${stats.revenue}</h3>
                                    <p>Total Revenue</p>
                                </div>
                            </div>
                        </div>

                        <div className="admin-content">
                            <div className="recent-section">
                                <h2>Recent Rentals</h2>
                                <div className="recent-list">
                                    {rentals.slice(0, 5).map(rental => (
                                        <div key={rental._id} className="recent-item">
                                            <div className="item-info">
                                                <h4>{rental.user?.name || 'Unknown User'}</h4>
                                                <p>{rental.product?.name || 'Unknown Product'}</p>
                                                <span className={`status-badge status-${rental.status || 'pending'}`}>
                                                    {rental.status || 'pending'}
                                                </span>
                                            </div>
                                            <div className="item-details">
                                                <p>${rental.totalCost || 0}</p>
                                                <small>{new Date(rental.createdAt).toLocaleDateString()}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="recent-section">
                                <h2>Recent Users</h2>
                                <div className="recent-list">
                                    {users.slice(0, 5).map(user => (
                                        <div key={user._id} className="recent-item">
                                            <div className="item-info">
                                                <h4>{user.firstName} {user.lastName}</h4>
                                                <p>{user.email}</p>
                                                <span className="role-badge">
                                                    {user.role || 'user'}
                                                </span>
                                            </div>
                                            <div className="item-details">
                                                <small>Joined: {new Date(user.createdAt).toLocaleDateString()}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="admin-actions">
                            <h2>Quick Actions</h2>
                            <div className="action-buttons">
                                <button className="btn btn-primary" onClick={handleAddProduct}>
                                    <i className="fas fa-plus"></i> Add Product
                                </button>
                                <button className="btn btn-secondary" onClick={() => setActiveTab('users')}>
                                    <i className="fas fa-cog"></i> Manage Users
                                </button>
                                <button className="btn btn-accent">
                                    <i className="fas fa-chart-bar"></i> View Reports
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'products' && (
                    <div className="admin-section">
                        <div className="section-header">
                            <h2>Product Management ({products.length} products)</h2>
                            <button className="btn btn-primary" onClick={handleAddProduct}>
                                <i className="fas fa-plus"></i> Add New Product
                            </button>
                        </div>

                        <div className="products-list">
                            {products.map(product => (
                                <div key={product._id} className="product-item">
                                    <img
                                        src={product.images && product.images[0] ? product.images[0] : '/placeholder-image.jpg'}
                                        alt={product.name}
                                        className="product-image"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-image.jpg';
                                        }}
                                    />
                                    <div className="product-info">
                                        <h4>{product.name}</h4>
                                        <p className="product-brand">{product.brand || 'No brand'}</p>
                                        <p className="product-price">Rs{product.rentalPrice}/day</p>
                                        <span className={`availability ${product.available ? 'available' : 'unavailable'}`}>
                                            {product.available ? 'Available' : 'Rented'}
                                        </span>
                                        {!product.available && product.rentedBy && (
                                            <p className="rented-info">
                                                Rented by: {product.rentedBy.name || 'Unknown user'}
                                                <br />
                                                Return date: {new Date(product.rentalEndDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <div className="product-actions">
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => handleEditProduct(product)}
                                        >
                                            <i className="fas fa-edit"></i> Edit
                                        </button>
                                        {!product.available && (
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={() => handleForceReturn(product._id)}
                                            >
                                                <i className="fas fa-undo"></i> Force Return
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteProduct(product._id)}
                                        >
                                            <i className="fas fa-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'rentals' && (
                    <div className="admin-section">
                        <h2>Rental Management</h2>

                        <div className="rental-tabs">
                            <button className="rental-tab active">Active Rentals</button>
                            <button className="rental-tab">All Rentals</button>
                        </div>

                        <div className="rentals-list">
                            {rentals.filter(r => ['confirmed', 'shipped', 'delivered'].includes(r.status)).map(rental => (
                                <div key={rental._id} className="rental-item">
                                    <img
                                        src={rental.product?.images?.[0] || '/placeholder-image.jpg'}
                                        alt={rental.product?.name}
                                        className="rental-image"
                                    />
                                    <div className="rental-info">
                                        <h4>{rental.product?.name}</h4>
                                        <p>Rented by: {rental.user?.name} ({rental.user?.email})</p>
                                        <p>Period: {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}</p>
                                        <p>Total: ${rental.totalCost}</p>
                                        <p>Status: <span className={`status-badge status-${rental.status}`}>{rental.status}</span></p>
                                    </div>
                                    <div className="rental-actions">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleReturnProduct(rental._id)}
                                        >
                                            <i className="fas fa-check"></i> Mark Returned
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="admin-section">
                        <h2>User Management ({users.length} users)</h2>

                        <div className="users-list">
                            {users.map(user => (
                                <div key={user._id} className="user-item">
                                    <div className="user-info">
                                        <h4>{user.firstName} {user.lastName}</h4>
                                        <p>{user.email}</p>
                                        <span className={`role-badge ${user.role}`}>
                                            {user.role}
                                        </span>
                                        <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="user-actions">
                                        <button className="btn btn-sm btn-outline">
                                            <i className="fas fa-edit"></i> Edit
                                        </button>
                                        {user.role !== 'admin' && (
                                            <button className="btn btn-sm btn-warning">
                                                <i className="fas fa-user-shield"></i> Make Admin
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showProductForm && (
                <ProductForm
                    product={editingProduct}
                    onSave={handleSaveProduct}
                    onCancel={handleCancelForm}
                />
            )}
        </div>
    );
};

export default AdminDashboard;