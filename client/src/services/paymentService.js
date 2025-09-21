import api from './api';

export const paymentService = {
    createPaymentIntent: async (amount, currency = 'usd') => {
        try {
            const response = await api.post('/payment/create-intent', { amount, currency });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    confirmPayment: async (paymentIntentId) => {
        try {
            const response = await api.post('/payment/confirm', { paymentIntentId });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getPaymentHistory: async () => {
        try {
            const response = await api.get('/payment/history');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};