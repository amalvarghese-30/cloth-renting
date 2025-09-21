import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
    return (
        <div className="about">
            <div className="container">
                <div className="about-header">
                    <h1>About Rentique</h1>
                    <p>Redefining fashion through sustainable rental</p>
                </div>

                <div className="about-hero">
                    <div className="hero-content">
                        <h2>Our Story</h2>
                        <p>
                            Rentique emerges as an innovative digital platform addressing the modern consumer's
                            need for sustainable fashion solutions. Founded in 2023, our venture represents a
                            paradigm shift in how people approach their wardrobe choices, moving from ownership
                            to access-based fashion consumption.
                        </p>
                        <p>
                            We noticed that people were buying clothes for special occasions only to wear them
                            once or twice, contributing to fashion waste and unnecessary consumption. Our platform
                            allows you to rent premium fashion items for a fraction of the retail price, giving you
                            access to endless style possibilities without the commitment of ownership.
                        </p>
                    </div>
                    <div className="hero-image">
                        <img
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Fashion rental concept"
                        />
                    </div>
                </div>

                <div className="mission-section">
                    <h2>Our Mission</h2>
                    <div className="mission-cards">
                        <div className="mission-card">
                            <div className="mission-icon">
                                <i className="fas fa-leaf"></i>
                            </div>
                            <h3>Sustainability</h3>
                            <p>
                                Reduce fashion waste by promoting clothing reuse and extending
                                the lifecycle of garments through our rental model. We contribute
                                to the circular economy by keeping clothes in use longer.
                            </p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-icon">
                                <i className="fas fa-tshirt"></i>
                            </div>
                            <h3>Accessibility</h3>
                            <p>
                                Make high-quality fashion accessible to everyone, regardless of
                                budget, by offering affordable rental options. Experience premium
                                fashion without the premium price tag.
                            </p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-icon">
                                <i className="fas fa-heart"></i>
                            </div>
                            <h3>Community</h3>
                            <p>
                                Build a community of fashion enthusiasts who value style,
                                sustainability, and smart consumption. Join a movement that
                                celebrates fashion without waste.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="values-section">
                    <h2>Our Values</h2>
                    <div className="values-content">
                        <div className="value-item">
                            <h3>Quality First</h3>
                            <p>
                                We meticulously curate our collection and maintain each item to
                                ensure you receive only the best quality garments. Every piece is
                                professionally cleaned and inspected before each rental.
                            </p>
                        </div>
                        <div className="value-item">
                            <h3>Customer Centric</h3>
                            <p>
                                Your satisfaction is our priority. We offer flexible rental periods,
                                easy returns, and exceptional customer service. We're here to make
                                your rental experience seamless.
                            </p>
                        </div>
                        <div className="value-item">
                            <h3>Innovation Driven</h3>
                            <p>
                                We continuously improve our platform and services to provide
                                the best possible rental experience. Our technology ensures
                                a smooth, intuitive process from browse to return.
                            </p>
                        </div>
                        <div className="value-item">
                            <h3>Ethically Minded</h3>
                            <p>
                                We partner with brands that share our commitment to ethical
                                production and sustainable practices. Together, we're changing
                                the fashion industry for the better.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="how-it-works-section">
                    <h2>How Rentique Works</h2>
                    <div className="process-steps">
                        <div className="process-step">
                            <div className="step-number">1</div>
                            <h3>Browse & Select</h3>
                            <p>Explore our curated collection of fashion items for every occasion. Use filters to find exactly what you need.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">2</div>
                            <h3>Choose Rental Period</h3>
                            <p>Select your rental dates and add damage protection if desired. Our system calculates the total cost transparently.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">3</div>
                            <h3>Checkout Securely</h3>
                            <p>Pay online with our secure payment gateway or choose cash on delivery. Receive instant confirmation.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">4</div>
                            <h3>Wear & Return</h3>
                            <p>Enjoy your rental! Return items using our simple process. We handle cleaning and maintenance.</p>
                        </div>
                    </div>
                </div>

                <div className="cta-section">
                    <h2>Join the Fashion Revolution</h2>
                    <p>
                        Ready to experience fashion in a whole new way? Start renting today
                        and be part of the movement towards sustainable fashion. Reduce waste,
                        refresh your style, and redefine your relationship with clothing.
                    </p>
                    <Link to="/products" className="btn btn-primary">
                        Explore Our Collection
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;