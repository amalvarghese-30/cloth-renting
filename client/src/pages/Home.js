// client/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { productService } from '../services/productService';
import './Home.css';

const Home = ({ onRentClick }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAll({ limit: 8 });

                let productsArray = [];
                if (data && data.products) {
                    productsArray = data.products;
                } else if (Array.isArray(data)) {
                    productsArray = data;
                }

                setProducts(productsArray);
                setError(null);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const bannerInterval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % 6);
        }, 5000);

        return () => clearInterval(bannerInterval);
    }, []);

    return (
        <div className="home">
            {/* Hero Section with Rotating Banner */}
            <section className="hero">
                <div
                    className={`hero-banner ${currentBanner === 0 ? 'active' : ''}`}
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}
                ></div>
                <div
                    className={`hero-banner ${currentBanner === 1 ? 'active' : ''}`}
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}
                ></div>
                <div
                    className={`hero-banner ${currentBanner === 2 ? 'active' : ''}`}
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}
                ></div>
                <div
                    className={`hero-banner ${currentBanner === 3 ? 'active' : ''}`}
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}
                ></div>
                <div
                    className={`hero-banner ${currentBanner === 4 ? 'active' : ''}`}
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}
                ></div>
                <div
                    className={`hero-banner ${currentBanner === 5 ? 'active' : ''}`}
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}
                ></div>

                <div className="container">
                    <div className="hero-content">
                        <h1>Elevate Your Style with Premium Fashion Rentals</h1>
                        <p>Discover designer pieces for every occasion without the commitment. Refresh your wardrobe sustainably with our curated collection.</p>
                        <div className="hero-buttons">
                            <Link to="/products" className="btn btn-primary">Explore Collection</Link>
                            <Link to="/how-it-works" className="btn btn-outline">How It Works</Link>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="scroll-indicator">
                    <div className="scroll-arrow"></div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat">
                            <div className="stat-icon">👗</div>
                            <h3>500+</h3>
                            <p>Designer Pieces</p>
                        </div>
                        <div className="stat">
                            <div className="stat-icon">⭐</div>
                            <h3>98%</h3>
                            <p>Customer Satisfaction</p>
                        </div>
                        <div className="stat">
                            <div className="stat-icon">🚚</div>
                            <h3>24h</h3>
                            <p>Delivery Available</p>
                        </div>
                        <div className="stat">
                            <div className="stat-icon">✅</div>
                            <h3>100%</h3>
                            <p>Quality Guaranteed</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="featured-products">
                <div className="container">
                    <div className="section-header">
                        <h2>Curated Collection</h2>
                        <p>Handpicked pieces that define elegance and style</p>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <LoadingSpinner />
                            <p>Loading our finest collection...</p>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <p>Unable to load featured items. {products.length > 0 ? 'Showing cached products.' : 'Please try again later.'}</p>
                            {products.length > 0 && (
                                <div className="products-grid">
                                    {products.map(product => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            onRentClick={onRentClick}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {products.length > 0 ? (
                                <>
                                    <div className="products-grid">
                                        {products.map(product => (
                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                                onRentClick={onRentClick}
                                            />
                                        ))}
                                    </div>
                                    <div className="view-all-container">
                                        <Link to="/products" className="btn btn-outline">
                                            View All Items
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="no-products">
                                    <p>No products available at the moment.</p>
                                    <Link to="/products" className="btn btn-primary">
                                        Browse All
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <div className="container">
                    <div className="section-header">
                        <h2>How It Works</h2>
                        <p>Rent premium fashion in three simple steps</p>
                    </div>
                    <div className="steps">
                        <div className="step">
                            <div className="step-icon">①</div>
                            <div className="step-content">
                                <h3>Browse & Select</h3>
                                <p>Explore our collection and choose items you want to rent for your special occasion.</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-icon">②</div>
                            <div className="step-content">
                                <h3>Choose Rental Period</h3>
                                <p>Select your rental duration and schedule delivery at your convenience.</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-icon">③</div>
                            <div className="step-content">
                                <h3>Wear & Return</h3>
                                <p>Wear your rented items with confidence, then schedule a pickup for return.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Elevate Your Style?</h2>
                        <p>Join thousands of fashion enthusiasts who rent smart and look exceptional</p>
                        <div className="cta-buttons">
                            <Link to="/signup" className="btn btn-primary">Get Started</Link>
                            <Link to="/products" className="btn btn-outline">Browse Collection</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;