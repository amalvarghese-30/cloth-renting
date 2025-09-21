import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        description: '',
        rentalPrice: '',
        category: '',
        size: '',
        color: '',
        material: '',
        condition: 'excellent',
        available: true,
        images: []
    });

    const [imageUrls, setImageUrls] = useState(['']);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                brand: product.brand || '',
                description: product.description || '',
                rentalPrice: product.rentalPrice || '',
                category: product.category || '',
                size: product.size || '',
                color: product.color || '',
                material: product.material || '',
                condition: product.condition || 'excellent',
                available: product.available !== undefined ? product.available : true,
                images: product.images || []
            });
            setImageUrls(product.images && product.images.length > 0
                ? [...product.images, '']
                : ['']
            );
        }
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUrlChange = (index, value) => {
        const newImageUrls = [...imageUrls];
        newImageUrls[index] = value;
        setImageUrls(newImageUrls);

        // Update form data with non-empty image URLs
        setFormData(prev => ({
            ...prev,
            images: newImageUrls.filter(url => url.trim() !== '')
        }));
    };

    const addImageField = () => {
        setImageUrls(prev => [...prev, '']);
    };

    const removeImageField = (index) => {
        if (imageUrls.length > 1) {
            const newImageUrls = imageUrls.filter((_, i) => i !== index);
            setImageUrls(newImageUrls);
            setFormData(prev => ({
                ...prev,
                images: newImageUrls.filter(url => url.trim() !== '')
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="product-form-modal">
            <div className="product-form-content">
                <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Brand *</label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Rental Price (Rs/day) *</label>
                            <input
                                type="number"
                                name="rentalPrice"
                                value={formData.rentalPrice}
                                onChange={handleInputChange}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}  // FIXED: Changed handleChange to handleInputChange
                                required
                            >
                                <option value="">Select Category</option>
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

                        <div className="form-group">
                            <label>Size *</label>
                            <select
                                name="size"
                                value={formData.size}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Size</option>
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                                <option value="One Size">One Size</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Color</label>
                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                                placeholder="e.g., Red, Blue, Black"
                            />
                        </div>

                        <div className="form-group">
                            <label>Material</label>
                            <input
                                type="text"
                                name="material"
                                value={formData.material}
                                onChange={handleInputChange}
                                placeholder="e.g., Cotton, Silk, Polyester"
                            />
                        </div>

                        <div className="form-group">
                            <label>Condition</label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleInputChange}
                            >
                                <option value="excellent">Excellent</option>
                                <option value="very-good">Very Good</option>
                                <option value="good">Good</option>
                                <option value="fair">Fair</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Image URLs</label>
                            {imageUrls.map((url, index) => (
                                <div key={index} className="image-url-input">
                                    <input
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        value={url}
                                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                    />
                                    {imageUrls.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImageField(index)}
                                            className="remove-image-btn"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addImageField}
                                className="add-image-btn"
                            >
                                + Add Another Image
                            </button>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="available"
                                    checked={formData.available}
                                    onChange={handleInputChange}
                                />
                                Available for Rent
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn btn-outline">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {product ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;