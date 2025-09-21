// client/src/context/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return {
                ...state,
                items: action.payload || []
            };

        case 'ADD_TO_CART': {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: (item.quantity || 0) + 1 }
                            : item
                    )
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }]
            };
        }

        case 'REMOVE_FROM_CART':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };

        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };

        case 'CLEAR_CART':
            return {
                ...state,
                items: []
            };

        default:
            return state;
    }
};

const initialState = {
    items: []
};

export const CartProvider = ({ children }) => {
    const [cartState, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) dispatch({ type: 'SET_CART', payload: JSON.parse(savedCart) });
        } catch (error) {
            console.error('Failed to load cart from localStorage:', error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartState.items));
        } catch (error) {
            console.error('Failed to save cart to localStorage:', error);
        }
    }, [cartState.items]);

    const addToCart = (product) => dispatch({ type: 'ADD_TO_CART', payload: product });
    const removeFromCart = (productId) => dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    const updateQuantity = (productId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const getCartTotal = () => (cartState.items || []).reduce((total, item) => total + ((item.price || item.rentalPrice || 0) * (item.quantity || 1)), 0);
    const getCartItemsCount = () => (cartState.items || []).reduce((count, item) => count + (item.quantity || 0), 0);

    return (
        <CartContext.Provider value={{
            items: cartState.items || [],
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartItemsCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
