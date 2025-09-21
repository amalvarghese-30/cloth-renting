import api from './api';

export const productService = {
    // Get all products with optional filtering
    getAll: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            // Add filters to params if they exist
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== '' && value !== null) {
                    params.append(key, value);
                }
            });

            const response = await api.get(`/products?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);

            // Fallback mock data for development
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                return {
                    products: [
                        {
                            _id: '1',
                            name: 'Designer Evening Gown',
                            description: 'Perfect for weddings and formal events',
                            price: 199,
                            rentalPrice: 75,
                            category: 'formal',
                            size: 'M',
                            brand: 'Designer Collection',
                            images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
                            available: true,
                            condition: 'excellent',
                            rentalCount: 12,
                            averageRating: 4.5,
                            totalRatings: 8
                        },
                        {
                            _id: '2',
                            name: 'Classic Business Suit',
                            description: 'Professional suit for business meetings',
                            price: 299,
                            rentalPrice: 95,
                            category: 'formal',
                            size: 'L',
                            brand: 'Executive Wear',
                            images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
                            available: true,
                            condition: 'excellent',
                            rentalCount: 8,
                            averageRating: 4.2,
                            totalRatings: 5
                        }
                    ],
                    totalPages: 1,
                    currentPage: 1,
                    total: 2
                };
            }
            throw error;
        }
    },

    // In getById (around line 70)
    // In productService.js getById method
    getById: async (id) => {
        try {
            console.log('Fetching product with ID:', id);
            const response = await api.get(`/products/${id}`);
            console.log('Product API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            // Add fallback for 404 or network errors
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 400) {
                console.warn('Using mock product data');
                return {
                    _id: id,
                    name: 'Mock Product',
                    description: 'This is a fallback mock product',
                    rentalPrice: 50,
                    images: ['https://via.placeholder.com/400'],
                    available: true,
                    // ADD THESE FIELDS:
                    averageRating: 0,
                    totalRatings: 0,
                    ratings: [],
                    rentalCount: 0,
                    condition: 'excellent',
                    material: 'Cotton',
                    color: 'Black',
                    brand: 'Mock Brand',
                    category: 'casual',
                    size: 'M'
                };
            }
            throw error;
        }
    },

    // Create new product (admin only)
    createProduct: async (productData) => {
        try {
            const response = await api.post('/products', productData);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    // Update product (admin only)
    updateProduct: async (id, productData) => {
        try {
            const response = await api.put(`/products/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    // Delete product (admin only)
    deleteProduct: async (id) => {
        try {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    // Add rating to product
    addRating: async (productId, ratingData) => {
        try {
            const response = await api.post(`/products/${productId}/ratings`, ratingData);
            return response.data;
        } catch (error) {
            console.error('Error adding rating:', error);
            throw error;
        }
    }
};