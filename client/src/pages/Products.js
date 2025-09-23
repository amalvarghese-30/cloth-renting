// Products.js - Updated with consistent styling
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Products.css';

const Products = ({ onRentClick }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        size: searchParams.get('size') || '',
        brand: searchParams.get('brand') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || ''
    });

    const { products, loading, error } = useProducts(filters);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        // Update URL search params
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        setSearchParams(params);
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            size: '',
            brand: '',
            minPrice: '',
            maxPrice: ''
        });
        setSearchParams({});
    };

    // Safe products array to prevent undefined errors
    const safeProducts = products || [];

    return (
        <div className="products-page">
            <div className="container">
                <div className="page-header">
                    <h1>Browse Our Collection</h1>
                    <p>Find the perfect outfit for any occasion</p>
                </div>

                <div className="filter-section">
                    <h3>Find Your Perfect Style</h3>
                    <div className="filter-grid">
                        <div className="filter-group">
                            <label>Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="formal">Formal Wear</option>
                                <option value="casual">Casual Wear</option>
                                <option value="party">Party Wear</option>
                                <option value="traditional">Traditional</option>
                                <option value="accessories">Accessories</option>
                                <option value="pants">Pants</option>
                                <option value="shirts">Shirts</option>
                                <option value="dresses">Dresses</option>
                                <option value="suits">Suits</option>
                                <option value="jackets">Jackets</option>
                                <option value="shoes">Shoes</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Size</label>
                            <select
                                value={filters.size}
                                onChange={(e) => handleFilterChange('size', e.target.value)}
                            >
                                <option value="">All Sizes</option>
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Brand</label>
                            <input
                                type="text"
                                placeholder="Search brands..."
                                value={filters.brand}
                                onChange={(e) => handleFilterChange('brand', e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label>Price Range ($)</label>
                            <div className="price-range">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    min="0"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        <button className="clear-filters" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <LoadingSpinner />
                        <p>Loading our finest collection...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        Error loading products: {error}
                    </div>
                ) : (
                    <>
                        <div className="products-count">
                            {safeProducts.length} product{safeProducts.length !== 1 ? 's' : ''} found
                            {Object.values(filters).some(filter => filter) && ' matching your criteria'}
                        </div>

                        <div className="products-grid">
                            {safeProducts.map(product => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onRentClick={onRentClick}
                                />
                            ))}
                        </div>

                        {safeProducts.length === 0 && (
                            <div className="no-products">
                                <h3>No products found</h3>
                                <p>Try adjusting your filters to see more results.</p>
                                <button
                                    className="clear-filters"
                                    onClick={clearFilters}
                                    style={{ marginTop: '1rem' }}
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Products;