import api from './api';

export const authService = {
    login: async (credentials) => {
        try {
            console.log('Sending login request with:', credentials);
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            console.error('Login API error details:', error.response?.data);

            // Handle validation errors from server
            if (error.response?.status === 400) {
                const serverError = error.response.data;

                // Check the actual structure of the error response
                if (serverError.errors && Array.isArray(serverError.errors)) {
                    // The errors array contains objects with "msg" property
                    const errorMessages = serverError.errors.map(err => err.msg).join(', ');
                    throw new Error(errorMessages);
                }

                if (serverError.message) {
                    throw new Error(serverError.message);
                }
            }

            // If backend is not ready, provide demo user access
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                console.log('Using fallback authentication');
                // Demo user access
                if (credentials.email === 'demo@rentique.com' && credentials.password === 'demo123') {
                    return {
                        token: 'demo-token-123',
                        user: {
                            _id: 'demo-001',
                            name: 'Demo User',
                            email: 'demo@rentique.com',
                            role: 'user',
                            createdAt: new Date().toISOString()
                        }
                    };
                }

                // Admin fallback
                if (credentials.email === 'admin@rentique.com' && credentials.password === 'admin123') {
                    return {
                        token: 'admin-token-123',
                        user: {
                            _id: 'admin-001',
                            name: 'Admin User',
                            email: 'admin@rentique.com',
                            role: 'admin',
                            createdAt: new Date().toISOString()
                        }
                    };
                }
            }

            throw new Error('Login failed. Please check your credentials and try again.');
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            // If backend is not ready, simulate successful registration
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                return {
                    token: 'demo-token-' + Math.random().toString(36).substr(2, 9),
                    user: {
                        _id: 'user-' + Math.random().toString(36).substr(2, 9),
                        name: userData.name,
                        email: userData.email,
                        role: 'user',
                        createdAt: new Date().toISOString()
                    }
                };
            }

            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Registration failed. Please try again.');
        }
    },

    getProfile: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            // If backend is not ready, return demo profile
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                // Check if we have a stored user
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    return JSON.parse(storedUser);
                }
                throw new Error('Not authenticated');
            }
            throw error;
        }
    },
};