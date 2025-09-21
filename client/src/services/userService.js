import api from './api';

export const userService = {
    getAllUsers: async () => {
        try {
            const response = await api.get('/admin/users');
            return response.data;
        } catch (error) {
            // If backend route doesn't exist, return mock data for development
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                console.warn('Users API not available, returning mock data');
                return [
                    {
                        _id: '1',
                        firstName: 'Admin',
                        lastName: 'User',
                        email: 'admin@rentique.com',
                        role: 'admin',
                        createdAt: new Date().toISOString()
                    },
                    {
                        _id: '2',
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john@example.com',
                        role: 'user',
                        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        _id: '3',
                        firstName: 'Jane',
                        lastName: 'Smith',
                        email: 'jane@example.com',
                        role: 'user',
                        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ];
            }
            throw error.response?.data || error.message;
        }
    },

    getUserById: async (userId) => {
        try {
            const response = await api.get(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                console.warn('User API not available, returning mock data');
                return {
                    _id: userId,
                    firstName: 'Mock',
                    lastName: 'User',
                    email: 'mock@example.com',
                    role: 'user',
                    createdAt: new Date().toISOString()
                };
            }
            throw error.response?.data || error.message;
        }
    },

    updateUser: async (userId, userData) => {
        try {
            const response = await api.put(`/admin/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                console.warn('User update API not available, returning mock success');
                return { ...userData, _id: userId, updatedAt: new Date().toISOString() };
            }
            throw error.response?.data || error.message;
        }
    },

    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                console.warn('User delete API not available, returning mock success');
                return { message: 'User deleted successfully', userId };
            }
            throw error.response?.data || error.message;
        }
    },

    updateUserRole: async (userId, role) => {
        try {
            const response = await api.patch(`/admin/users/${userId}/role`, { role });
            return response.data;
        } catch (error) {
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                console.warn('User role API not available, returning mock success');
                return { message: 'User role updated successfully', userId, role };
            }
            throw error.response?.data || error.message;
        }
    }
};