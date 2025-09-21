import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useProducts = (filteRs = {}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await productService.getAll(filteRs);

                // Ensure we always have an array, even if data.products is undefined
                setProducts(data?.products || []);

            } catch (error) {
                console.error('Error fetching products:', error);
                setError(error.response?.data?.message || 'Failed to fetch products');
                setProducts([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filteRs]);

    return { products, loading, error };
};