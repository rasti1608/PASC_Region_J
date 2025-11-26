import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
      setError('Failed to load user');
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
      <div className="content-header">
        <h1>Delete User</h1>
        <p className="section-subtitle">Confirm deletion of this user</p>
      </div>

      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Users
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && !user && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading user...</p>
        </div>
      )}

      {user && (
        <div className="delete-confirmation">
          <div className="warning-box">
            <div className="warning-icon">⚠️</div>
            <h2>Are you sure you want to delete this user?</h2>
            <p>This action cannot be undone. The user will lose all access to the admin panel.</p>
          </div>

          <div className="item-preview">
            <h3>User Details:</h3>
            <div className="preview-field">
              <strong>Username:</strong>
              <span>{user.username}</span>
            </div>
            <div className="preview-field">
              <strong>Full Name:</strong>
              <span>{user.full_name}</span>
            </div>
            <div className="preview-field">
              <strong>Email:</strong>
              <span>{user.email}</span>
            </div>
            <div className="preview-field">
              <strong>Role:</strong>
              <span>{user.role_name || (user.role_id === 1 ? 'Admin' : 'Content Manager')}</span>
            </div>
            <div className="preview-field">
              <strong>Status:</strong>
              <span>{user.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-danger" onClick={confirmDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Yes, Delete User'}
            </button>
            <button className="btn btn-secondary" onClick={cancel} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserDelete;
