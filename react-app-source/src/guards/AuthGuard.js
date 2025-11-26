import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * AuthGuard - Protects routes that require authentication
 * Redirects to login if not authenticated
 * Redirects to change-password if user must change password
 */
function AuthGuard({ children }) {
  const { user, loading, authCheckComplete } = useAuth();
  const location = useLocation();

  // Wait for auth check to complete before making a decision
  if (loading || !authCheckComplete) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    // Not authenticated, redirect to login with return URL
    return <Navigate to="/admin/login" state={{ returnUrl: location.pathname }} replace />;
  }

  // Check if user must change password
  if (user.must_change_password) {
    // Allow access to change-password page
    if (location.pathname === '/admin/change-password') {
      return children;
    }
    // Redirect to change-password for any other page
    return <Navigate to="/admin/change-password" replace />;
  }

  // User is authenticated and doesn't need to change password
  return children;
}

export default AuthGuard;
