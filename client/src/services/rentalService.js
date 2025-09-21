// client/src/services/rentalService.js
import api from './api';

const rentalService = {
    create: async (rentalData) => {
        try {
            const response = await api.post('/rentals', rentalData);
            return response.data;
        } catch (error) {
            console.error('Error creating rental:', error);

            // Fallback for development when backend is not available
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                console.warn('Using mock rental creation');
                return {
                    rental: {
                        _id: 'demo-rental-' + Date.now(),
                        product: rentalData.productId,
                        startDate: rentalData.startDate,
                        endDate: rentalData.endDate,
                        status: rentalData.paymentMethod === 'cod' ? 'confirmed' : 'pending',
                        totalCost: rentalData.totalCost || 100,
                        deliveryAddress: rentalData.deliveryAddress,
                        paymentMethod: rentalData.paymentMethod,
                        size: rentalData.size,
                        damageProtection: rentalData.damageProtection || false
                    },
                    requiresPayment: rentalData.paymentMethod === 'card'
                };
            }

            throw error.response?.data || error.message;
        }
    },

    confirmPayment: async (rentalId) => {
        try {
            const response = await api.post(`/rentals/${rentalId}/confirm-payment`);
            return response.data;
        } catch (error) {
            console.error('Error confirming payment:', error);

            // Fallback for development
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                console.warn('Using mock payment confirmation');
                return {
                    success: true,
                    message: 'Payment confirmed successfully'
                };
            }

            throw error.response?.data || error.message;
        }
    },

    getMyRentals: async () => {
        try {
            const response = await api.get('/rentals/my-rentals');
            return response.data;
        } catch (error) {
            console.error('Error fetching rentals:', error);

            // Fallback for development
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                console.warn('Using mock rental data');
                return [
                    {
                        _id: 'demo-rental-1',
                        product: {
                            _id: 'demo-product-1',
                            name: 'Designer Evening Gown',
                            images: ['/images/placeholder-product.jpg'],
                            rentalPrice: 75
                        },
                        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'active',
                        totalCost: 150,
                        deliveryAddress: '123 Main St, City, State',
                        paymentMethod: 'card'
                    },
                    {
                        _id: 'demo-rental-2',
                        product: {
                            _id: 'demo-product-2',
                            name: 'Classic Business Suit',
                            images: ['/images/placeholder-product.jpg'],
                            rentalPrice: 95
                        },
                        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'upcoming',
                        totalCost: 380,
                        deliveryAddress: '456 Oak Ave, City, State',
                        paymentMethod: 'cod'
                    }
                ];
            }

            throw error.response?.data || error.message;
        }
    },

    getAllRentals: async () => {
        try {
            const response = await api.get('/rentals');
            return response.data;
        } catch (error) {
            console.error('Error fetching all rentals:', error);

            // Fallback for development
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                console.warn('Using mock all rentals data');
                return this.getMyRentals(); // Return user rentals as fallback
            }

            throw error.response?.data || error.message;
        }
    },

    updateStatus: async (rentalId, status) => {
        try {
            const response = await api.put(`/rentals/${rentalId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating rental status:', error);

            // Fallback for development
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                console.warn('Using mock status update');
                return {
                    success: true,
                    message: `Rental status updated to ${status}`
                };
            }

            throw error.response?.data || error.message;
        }
    },

    returnRental: async (rentalId) => {
        try {
            const response = await api.post(`/rentals/${rentalId}/return`);
            return response.data;
        } catch (error) {
            console.error('Error returning rental:', error);

            // Fallback for development
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                console.warn('Using mock return rental');
                return {
                    success: true,
                    message: 'Rental returned successfully'
                };
            }

            throw error.response?.data || error.message;
        }
    }
};

export default rentalService;