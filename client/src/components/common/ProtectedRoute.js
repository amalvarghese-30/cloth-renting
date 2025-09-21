// src/components/common/ProtectedRoute.js
import { useAuth } from '../../context/AuthContext.js';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;