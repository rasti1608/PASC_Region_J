import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usersService } from '../../services/admin-api';

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState(null);

  // Username validation
  const [usernameCheckInProgress, setUsernameCheckInProgress] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  // Password change (edit mode)
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    role_id: 0,
    is_active: true
  });

  useEffect(() => {
    loadRoles();
    if (isEditMode) {
      loadUser();
    }
  }, [id]);

  // Debounced username check
  useEffect(() => {
    if (!isEditMode && formData.username && !hasSpaces(formData.username)) {
      const timer = setTimeout(() => {
        checkUsernameAvailability(formData.username);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.username, isEditMode]);

  const loadRoles = async () => {
    try {
      const response = await usersService.getRoles();
      const loadedRoles = response.data || [
        { id: 1, role_name: 'Admin' },
        { id: 2, role_name: 'Content Manager' }
      ];
      setRoles(loadedRoles);
      // Set default role to first role (Admin) in add mode
      if (!isEditMode && loadedRoles.length > 0) {
        setFormData(prev => ({ ...prev, role_id: loadedRoles[0].id }));
      }
    } catch (err) {
      console.error('Error loading roles:', err);
      const fallbackRoles = [
        { id: 1, role_name: 'Admin' },
        { id: 2, role_name: 'Content Manager' }
      ];
      setRoles(fallbackRoles);
      if (!isEditMode) {
        setFormData(prev => ({ ...prev, role_id: fallbackRoles[0].id }));
      }
    }
  };

  const loadUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await usersService.getById(id);
      const data = response.data;
      setUser(data);
      setFormData({
        username: data.username || '',
        email: data.email || '',
        full_name: data.full_name || '',
        role_id: data.role_id || 2,
        is_active: data.is_active || false
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load user');
      setLoading(false);
      console.error('Error loading user:', err);
    }
  };

  const checkUsernameAvailability = async (username) => {
    if (!username || hasSpaces(username)) {
      setUsernameAvailable(null);
      return;
    }

    setUsernameCheckInProgress(true);
    try {
      const response = await usersService.checkUsername(username);
      // API returns { available: boolean, message: string } directly
      setUsernameAvailable(response.available === true);
    } catch (err) {
      console.error('Error checking username:', err);
      setUsernameAvailable(null);
    }
    setUsernameCheckInProgress(false);
  };

  const hasSpaces = (str) => /\s/.test(str);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'role_id' ? parseInt(value) : value)
    }));

    // Reset username availability when typing
    if (name === 'username') {
      setUsernameAvailable(null);
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthLabel = (strength) => {
    if (strength < 25) return 'Weak';
    if (strength < 50) return 'Fair';
    if (strength < 75) return 'Good';
    return 'Strong';
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 25) return '#dc3545';
    if (strength < 50) return '#ffc107';
    if (strength < 75) return '#17a2b8';
    return '#28a745';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    if (hasSpaces(formData.username)) {
      setError('Username cannot contain spaces');
      return;
    }
    if (!isEditMode && usernameAvailable === false) {
      setError('Username is already taken');
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

    // Password validation for edit mode
    if (isEditMode && changePassword) {
      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const submitData = { ...formData };
      if (isEditMode && changePassword && newPassword) {
        submitData.password = newPassword;
      }

      if (isEditMode) {
        await usersService.update(id, submitData);
      } else {
        await usersService.create(submitData);
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

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <>
      <div className="content-header">
        <h1>{isEditMode ? 'Edit User' : 'Add New User'}</h1>
        <p className="section-subtitle">
          {isEditMode ? 'Update user account details' : 'Create a new admin user account'}
        </p>
      </div>

      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to User Management
        </button>
      </div>

      <div className="section">
        {error && <div className="alert alert-error">{error}</div>}

        {loading && !formData.username && isEditMode && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading user...</p>
          </div>
        )}

        {(!loading || formData.username || !isEditMode) && (
          <form className="admin-form" onSubmit={handleSubmit}>
            {/* Username (Add Mode) */}
            {!isEditMode && (
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    maxLength="50"
                    autoComplete="off"
                    required
                    className={hasSpaces(formData.username) ? 'error' : ''}
                    style={{ paddingRight: '40px' }}
                  />
                  {/* Username availability indicator */}
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>
                    {usernameCheckInProgress && <span>⏳</span>}
                    {!usernameCheckInProgress && usernameAvailable === true && <span style={{ color: '#28a745' }}>✓</span>}
                    {!usernameCheckInProgress && usernameAvailable === false && <span style={{ color: '#dc3545' }}>✗</span>}
                  </span>
                </div>
                <small>Username for logging into the admin panel. Must be unique and cannot contain spaces.</small>
                {formData.username && hasSpaces(formData.username) && (
                  <div style={{ color: '#dc3545', marginTop: '5px' }}>
                    ⚠ Username cannot contain spaces
                  </div>
                )}
                {!usernameCheckInProgress && usernameAvailable === true && (
                  <div style={{ color: '#28a745', marginTop: '5px', fontSize: '0.9em' }}>
                    ✓ Username is available
                  </div>
                )}
                {!usernameCheckInProgress && usernameAvailable === false && formData.username && !hasSpaces(formData.username) && (
                  <div style={{ color: '#dc3545', marginTop: '5px', fontSize: '0.9em' }}>
                    ✗ Username is already taken
                  </div>
                )}
              </div>
            )}

            {/* Username (Edit Mode - Read Only) */}
            {isEditMode && (
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  readOnly
                  style={{ backgroundColor: '#f5f7fa', cursor: 'not-allowed' }}
                />
                <small>Username cannot be changed.</small>
              </div>
            )}

            {/* Password Notice (Add Mode Only) */}
            {!isEditMode && (
              <div style={{ background: '#e3f2fd', borderLeft: '4px solid #2196f3', padding: '15px', margin: '20px 0', borderRadius: '4px' }}>
                <p style={{ margin: 0, color: '#1565c0', fontSize: '14px' }}>
                  <strong>🔐 Automatic Password Generation</strong>
                </p>
                <p style={{ margin: '8px 0 0 0', color: '#1565c0', fontSize: '14px' }}>
                  A secure password will be automatically generated for this user.
                  An activation email will be sent to the user's email address where they can set their own password.
                </p>
              </div>
            )}

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="full_name">Full Name *</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                maxLength="100"
                required
              />
              <small>User's full name (displayed in admin panel).</small>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                maxLength="100"
                required
              />
              <small>Valid email address for notifications and password reset.</small>
            </div>

            {/* Role */}
            <div className="form-group">
              <label htmlFor="role_id">Role *</label>
              <select
                id="role_id"
                name="role_id"
                value={formData.role_id}
                onChange={handleInputChange}
                required
              >
                <option value={0} disabled>-- Select Role --</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.role_name || role.name}</option>
                ))}
              </select>
              <small>
                <strong>Admin:</strong> Full access including user management. | <strong>Content Manager:</strong> Can manage all content sections.
              </small>
            </div>

            {/* Active Status */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                <span>Active</span>
              </label>
              <small>If checked, user can log in immediately. Uncheck to create inactive user.</small>
            </div>

            {/* Password Change Section (Edit Mode Only) */}
            {isEditMode && (
              <div style={{ margin: '30px 0', padding: '20px', background: '#f5f7fa', borderRadius: '8px' }}>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={changePassword}
                      onChange={(e) => {
                        setChangePassword(e.target.checked);
                        if (!e.target.checked) {
                          setNewPassword('');
                          setConfirmNewPassword('');
                        }
                      }}
                    />
                    <span>Change Password</span>
                  </label>
                  <small>Check this box if you want to reset the user's password.</small>
                </div>

                {changePassword && (
                  <>
                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          minLength="8"
                          required={changePassword}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                      {/* Password Strength Indicator */}
                      {newPassword && (
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ width: '100%', height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${passwordStrength}%`,
                              height: '100%',
                              background: getPasswordStrengthColor(passwordStrength),
                              transition: 'width 0.3s ease, background 0.3s ease'
                            }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: getPasswordStrengthColor(passwordStrength), marginTop: '4px', display: 'inline-block' }}>
                            {getPasswordStrengthLabel(passwordStrength)}
                          </span>
                        </div>
                      )}
                      <small>Must be at least 8 characters with one uppercase letter (A-Z), one number (0-9), and one special character.</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmNewPassword">Confirm New Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showConfirmNewPassword ? 'text' : 'password'}
                          id="confirmNewPassword"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          minLength="8"
                          required={changePassword}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        >
                          {showConfirmNewPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                      {confirmNewPassword && newPassword !== confirmNewPassword && (
                        <div style={{ color: '#dc3545', marginTop: '5px', fontSize: '0.9em' }}>
                          ✗ Passwords do not match
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Account Information (Edit Mode Only) */}
            {isEditMode && user && (
              <div style={{ margin: '30px 0', padding: '20px', background: '#f5f7fa', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#2d3561' }}>Account Information</h3>

                <div className="info-row">
                  <span className="info-label">Last Login:</span>
                  <span className="info-value">
                    {user.last_login || 'Never logged in'}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Account Created:</span>
                  <span className="info-value">{user.created_at}</span>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update User' : 'Create User')}
              </button>
              <Link to="/admin/users" className="btn btn-secondary">Cancel</Link>
              {isEditMode && id && (
                <Link to={`/admin/users/delete/${id}`} className="btn btn-danger" style={{ marginLeft: 'auto' }}>
                  Delete User
                </Link>
              )}
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default UserForm;
