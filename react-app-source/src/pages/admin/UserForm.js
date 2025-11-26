import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersService } from '../../services/admin-api';

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    role_id: 2,
    is_active: true,
    send_activation_email: true
  });

  useEffect(() => {
    loadRoles();
    if (isEditMode) {
      loadUser();
    }
  }, [id]);

  const loadRoles = async () => {
    try {
      const response = await usersService.getRoles();
      setRoles(response.data || [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Content Manager' }
      ]);
    } catch (err) {
      console.error('Error loading roles:', err);
      setRoles([
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Content Manager' }
      ]);
    }
  };

  const loadUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await usersService.getById(id);
      const data = response.data;
      setFormData({
        username: data.username || '',
        email: data.email || '',
        full_name: data.full_name || '',
        role_id: data.role_id || 2,
        is_active: data.is_active || false,
        send_activation_email: false
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load user');
      setLoading(false);
      console.error('Error loading user:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'role_id' ? parseInt(value) : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await usersService.update(id, formData);
      } else {
        await usersService.create(formData);
      }
      navigate('/admin/users');
    } catch (err) {
      setError(err.message || 'Failed to save user');
      setLoading(false);
      console.error('Error saving user:', err);
    }
  };

  const cancel = () => {
    navigate('/admin/users');
  };

  return (
    <>
      <div className="content-header">
        <h1>{isEditMode ? 'Edit User' : 'Add New User'}</h1>
        <p className="section-subtitle">
          {isEditMode ? 'Update user details' : 'Create a new admin user'}
        </p>
      </div>

      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Users
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && !formData.username && isEditMode && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading user...</p>
        </div>
      )}

      {(!loading || formData.username || !isEditMode) && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username <span className="required">*</span></label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              maxLength="50"
              required
              disabled={isEditMode}
            />
            {isEditMode && <small className="form-help">Username cannot be changed</small>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              maxLength="255"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="full_name">Full Name <span className="required">*</span></label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              className="form-control"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              maxLength="100"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role_id">Role <span className="required">*</span></label>
            <select
              id="role_id"
              name="role_id"
              className="form-control"
              value={formData.role_id}
              onChange={handleInputChange}
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            <small className="form-help">Admin has full access; Content Manager can manage content only</small>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
              <span>Active (can log in)</span>
            </label>
          </div>

          {!isEditMode && (
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="send_activation_email"
                  checked={formData.send_activation_email}
                  onChange={handleInputChange}
                />
                <span>Send activation email to user</span>
              </label>
              <small className="form-help">User will receive an email with a link to set their password</small>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={cancel} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default UserForm;
