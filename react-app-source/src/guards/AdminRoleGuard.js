import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * AdminRoleGuard - Restricts access to Admin-only routes
 * Only users with role_id = 1 (Administrator) can access these routes
 * Content Managers (role_id = 2) and other roles will be redirected to dashboard
 */
function AdminRoleGuard({ children }) {
  const { user, loading, authCheckComplete } = useAuth();

  // Wait for auth check to complete
  if (loading || !authCheckComplete) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Check if user is Admin (role_id = 1)
  if (user && user.role_id === 1) {
    return children; // Allow access
  }

  // Not an Admin - redirect to dashboard
  console.warn('Access denied: User is not an Administrator');
  return <Navigate to="/admin/dashboard" replace />;
}

export default AdminRoleGuard;
