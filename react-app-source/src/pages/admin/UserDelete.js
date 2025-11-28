import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usersService } from '../../services/admin-api';

function UserDelete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadUser();
    } else {
      setError('No user ID provided');
    }
  }, [id]);

  const loadUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await usersService.getById(id);
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load user. It may have been deleted or does not exist.');
      setLoading(false);
      console.error('Error loading user:', err);
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await usersService.delete(id);
      navigate('/admin/users');
    } catch (err) {
      setError('Failed to delete user');
      setLoading(false);
      console.error('Error deleting user:', err);
    }
  };

  const cancel = () => {
    navigate('/admin/users');
  };

  return (
    <>
      {/* Content Header */}
      <div className="content-header">
        <h1>Delete User</h1>
        <p className="section-subtitle">Permanently remove user account from the system</p>
      </div>

      {/* Back Button */}
      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to User Management
        </button>
      </div>

      <div className="section">
        {/* Loading State */}
        {loading && !user && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading user...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-error">
            {error}
            <div style={{ marginTop: '20px' }}>
              <Link to="/admin/users" className="btn btn-secondary">← Back to User Management</Link>
              {user && (
                <Link to={`/admin/users/edit/${id}`} className="btn btn-primary" style={{ marginLeft: '10px' }}>
                  Edit User Instead
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {user && !error && (
          <div style={{ maxWidth: '700px' }}>
            {/* Warning Box */}
            <div style={{
              background: '#fff3cd',
              borderLeft: '4px solid #ffc107',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ fontSize: '2rem' }}>⚠️</div>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>Warning: Permanent Deletion</h3>
                  <p style={{ margin: 0, color: '#856404', lineHeight: '1.6' }}>
                    You are about to permanently delete this user account. This action cannot be undone.
                    All user data will be permanently removed from the system.
                  </p>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="admin-form">
              <h3 style={{ marginBottom: '20px', color: '#2d3561' }}>User Details:</h3>

              <div className="info-row">
                <span className="info-label">Username:</span>
                <span className="info-value">{user.username}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Full Name:</span>
                <span className="info-value">{user.full_name}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Role:</span>
                <span className="info-value">
                  {user.role_name ? (
                    <span>{user.role_name}</span>
                  ) : (
                    <span style={{ color: '#999' }}>No Role Assigned</span>
                  )}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className="info-value">
                  {user.is_active ? (
                    <span className="badge badge-success">✓ Active</span>
                  ) : (
                    <span className="badge badge-inactive">Inactive</span>
                  )}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Last Login:</span>
                <span className="info-value">
                  {user.last_login || 'Never logged in'}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Created:</span>
                <span className="info-value">{user.created_at}</span>
              </div>

              {/* Confirmation Section */}
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                <div style={{
                  background: '#ffebee',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <p style={{ margin: 0, color: '#c62828', fontWeight: '600' }}>
                    Are you absolutely sure you want to delete this user?
                  </p>
                </div>

                <div className="form-actions" style={{ margin: 0, padding: 0, border: 'none' }}>
                  <button
                    onClick={confirmDelete}
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Yes, Delete User'}
                  </button>
                  <button
                    onClick={cancel}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <Link to={`/admin/users/edit/${id}`} className="btn btn-primary">
                    Edit Instead
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserDelete;
