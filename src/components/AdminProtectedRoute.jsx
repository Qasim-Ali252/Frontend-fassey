import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../hooks/useUserAuth';
import AuthLoading from './AuthLoading';

const AdminProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, user } = useUserAuth();
    const location = useLocation();

    // 1. Get the token directly for immediate sync check
    const adminToken = localStorage.getItem('access_token');

    // 2. Show loading only if we have a token but are still fetching user details
    if (isLoading && adminToken) {
        return <AuthLoading message="Verifying Admin Session..." />;
    }

    // 3. If no token exists at all, redirect to login
    if (!adminToken && !isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 4. Optional: Check if the logged-in user actually has Admin privileges
    // If your backend user object has a role field:
    // if (user && user.role !== 'admin') {
    //    return <Navigate to="/unauthorized" replace />;
    // }

    return children;
};

export default AdminProtectedRoute;