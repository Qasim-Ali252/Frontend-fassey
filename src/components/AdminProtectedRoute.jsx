import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Check if admin is authenticated (using localStorage token for now)
  const adminToken = localStorage.getItem('access_token');
  const isAuthenticated = !!adminToken;

  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;