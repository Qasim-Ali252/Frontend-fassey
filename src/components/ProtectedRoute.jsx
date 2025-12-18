import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../hooks/useUserAuth';
import AuthLoading from './AuthLoading';
import BackendUnavailable from './BackendUnavailable';

const ProtectedRoute = ({ children, requireAuth = true, redirectTo = '/user/login' }) => {
  const { isAuthenticated, isLoading, hasConnectionError, refetch } = useUserAuth();
  const location = useLocation();

  // Show loading while checking auth status (but not if there's a connection error)
  if (isLoading && !hasConnectionError) {
    return <AuthLoading message="Checking authentication..." />;
  }

  // If there's a connection error and route requires auth, show backend unavailable
  if (hasConnectionError && requireAuth) {
    return <BackendUnavailable onRetry={refetch} />;
  }

  // If route requires auth but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If route requires no auth (like login page) but user is authenticated
  if (!requireAuth && isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};

export default ProtectedRoute;