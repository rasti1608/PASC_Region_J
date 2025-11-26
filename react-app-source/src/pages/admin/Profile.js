import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/admin-api';

function Profile() {
  const { user, checkAuthStatus } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    email: '',
    full_name: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        email: user.email || '',
        full_name: user.full_name || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!profileData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!profileData.full_name.trim()) {
      setError('Full name is required');
      return;
    }

    setLoading(true);

    try {
      const response = await profileService.updateProfile(profileData);
      if (response.success) {
        setSuccessMessage('Profile updated successfully');
        checkAuthStatus();
      } else {
        setError(response.message || 'Failed to update profile');
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!passwordData.current_password) {
      setError('Current password is required');
      return;
    }
    if (!passwordData.new_password) {
      setError('New password is required');
      return;
    }
    if (passwordData.new_password.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await profileService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      if (response.success) {
        setSuccessMessage('Password changed successfully');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        setError(response.message || 'Failed to change password');
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to change password');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="content-header">
        <h1>My Profile</h1>
        <p>Manage your account settings</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => { setActiveTab('profile'); setError(null); setSuccessMessage(null); }}
        >
          Profile Information
        </button>
        <button
          className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => { setActiveTab('password'); setError(null); setSuccessMessage(null); }}
        >
          Change Password
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="section">
          <form className="admin-form" onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={user?.username || ''}
                disabled
              />
              <small className="form-help">Username cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email <span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={profileData.email}
                onChange={handleProfileChange}
                placeholder="Enter email"
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
                value={profileData.full_name}
                onChange={handleProfileChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                className="form-control"
                value={user?.role_name || (user?.role_id === 1 ? 'Admin' : 'Content Manager')}
                disabled
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="section">
          <form className="admin-form" onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="current_password">Current Password <span className="required">*</span></label>
              <div className="password-input-wrapper">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="current_password"
                  name="current_password"
                  className="form-control"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="new_password">New Password <span className="required">*</span></label>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="new_password"
                  name="new_password"
                  className="form-control"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <small className="form-help">Minimum 8 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password">Confirm New Password <span className="required">*</span></label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm_password"
                  name="confirm_password"
                  className="form-control"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Profile;
