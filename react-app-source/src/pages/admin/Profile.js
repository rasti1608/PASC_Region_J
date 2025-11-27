import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/admin-api';

function Profile() {
  const { user, checkAuthStatus } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    email: '',
    full_name: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  });

  // Success/error messages for each section
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [pictureSuccess, setPictureSuccess] = useState(null);
  const [pictureError, setPictureError] = useState(null);

  // Loading states
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [pictureLoading, setPictureLoading] = useState(false);

  // Profile picture
  const [selectedPictureFile, setSelectedPictureFile] = useState(null);
  const [picturePreviewUrl, setPicturePreviewUrl] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordStrengthLabel, setPasswordStrengthLabel] = useState('');
  const [passwordStrengthColor, setPasswordStrengthColor] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    calculatePasswordStrength(passwordData.new_password);
  }, [passwordData.new_password]);

  const loadProfile = async () => {
    setLoading(true);
    setImageLoadError(false);
    try {
      const response = await profileService.getProfile();
      if (response.success && response.data) {
        setProfileData({
          email: response.data.email || '',
          full_name: response.data.full_name || ''
        });
      }
      setLoading(false);
    } catch (err) {
      setProfileError(err.message || 'Failed to load profile');
      setLoading(false);
    }
  };

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
    setProfileSuccess(null);
    setProfileError(null);

    if (!profileData.full_name.trim()) {
      setProfileError('Full name is required');
      return;
    }
    if (!profileData.email.trim()) {
      setProfileError('Email is required');
      return;
    }

    setProfileLoading(true);

    try {
      const response = await profileService.updateProfile(profileData);
      if (response.success) {
        setProfileSuccess(response.message || 'Profile updated successfully');
        checkAuthStatus();
        loadProfile();
      } else {
        setProfileError(response.message || 'Failed to update profile');
      }
      setProfileLoading(false);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!passwordData.current_password) {
      setPasswordError('Current password is required');
      return;
    }
    if (!passwordData.new_password) {
      setPasswordError('New password is required');
      return;
    }
    if (passwordData.new_password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(passwordData.new_password)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[0-9]/.test(passwordData.new_password)) {
      setPasswordError('Password must contain at least one number');
      return;
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(passwordData.new_password)) {
      setPasswordError('Password must contain at least one special character');
      return;
    }
    if (passwordData.new_password !== passwordData.confirm_new_password) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await profileService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      if (response.success) {
        setPasswordSuccess(response.message || 'Password changed successfully');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_new_password: ''
        });
      } else {
        setPasswordError(response.message || 'Failed to change password');
      }
      setPasswordLoading(false);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password');
      setPasswordLoading(false);
    }
  };

  const onFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setPictureError('Invalid file type. Only JPG, PNG, and GIF files are allowed.');
      e.target.value = '';
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      setPictureError('File too large. Maximum file size is 5MB.');
      e.target.value = '';
      return;
    }

    setSelectedPictureFile(file);
    setPictureError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPicturePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadPicture = async () => {
    if (!selectedPictureFile) {
      setPictureError('Please select a file to upload');
      return;
    }

    setPictureLoading(true);
    setPictureSuccess(null);
    setPictureError(null);

    try {
      const formData = new FormData();
      formData.append('profile_picture', selectedPictureFile);

      const response = await profileService.uploadProfilePicture(formData);
      if (response.success) {
        setPictureSuccess(response.message || 'Profile picture uploaded successfully!');
        setSelectedPictureFile(null);
        setPicturePreviewUrl(null);
        loadProfile();
        checkAuthStatus();

        // Clear file input
        const fileInput = document.getElementById('profile_picture');
        if (fileInput) fileInput.value = '';
      } else {
        setPictureError(response.message || 'Failed to upload profile picture');
      }
      setPictureLoading(false);
    } catch (err) {
      setPictureError(err.message || 'Failed to upload profile picture');
      setPictureLoading(false);
    }
  };

  const removePicture = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    setPictureLoading(true);
    setPictureSuccess(null);
    setPictureError(null);

    try {
      const response = await profileService.removeProfilePicture();
      if (response.success) {
        setPictureSuccess(response.message || 'Profile picture removed successfully');
        loadProfile();
        checkAuthStatus();
      } else {
        setPictureError(response.message || 'Failed to remove profile picture');
      }
      setPictureLoading(false);
    } catch (err) {
      setPictureError(err.message || 'Failed to remove profile picture');
      setPictureLoading(false);
    }
  };

  const getProfilePictureUrl = () => {
    if (imageLoadError) return '';
    if (picturePreviewUrl) return picturePreviewUrl;
    if (user?.profile_picture) {
      return `/assets/img/profiles/${user.profile_picture}?v=${Date.now()}`;
    }
    return '';
  };

  const onImageError = () => {
    setImageLoadError(true);
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmNewPassword(!showConfirmNewPassword);
        break;
      default:
        break;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordStrengthLabel('');
      setPasswordStrengthColor('');
      return;
    }

    let strength = 0;

    // Length checks
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (password.length >= 16) strength += 10;

    // Character type checks
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength += 20;

    // Bonus for variety
    const types = [/[a-z]/, /[A-Z]/, /[0-9]/, /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/];
    const typeCount = types.filter(regex => regex.test(password)).length;
    if (typeCount >= 4) strength += 10;

    // Cap at 100
    const finalStrength = Math.min(strength, 100);
    setPasswordStrength(finalStrength);

    // Set label and color based on strength
    if (finalStrength < 20) {
      setPasswordStrengthLabel('Weak');
      setPasswordStrengthColor('#dc3545');
    } else if (finalStrength < 40) {
      setPasswordStrengthLabel('Fair');
      setPasswordStrengthColor('#fd7e14');
    } else if (finalStrength < 60) {
      setPasswordStrengthLabel('Medium');
      setPasswordStrengthColor('#ffc107');
    } else if (finalStrength < 80) {
      setPasswordStrengthLabel('Good');
      setPasswordStrengthColor('#90EE90');
    } else {
      setPasswordStrengthLabel('Strong');
      setPasswordStrengthColor('#28a745');
    }
  };

  if (loading) {
    return (
      <>
        <div className="content-header">
          <h1>My Profile</h1>
          <p>Manage your personal information and account settings</p>
        </div>
        <div className="loading-container">Loading profile...</div>
      </>
    );
  }

  return (
    <>
      <div className="content-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account settings</p>
      </div>

      {/* Personal Information Section */}
      <div className="section">
        <h2>Personal Information</h2>

        {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}
        {profileError && <div className="alert alert-error">{profileError}</div>}

        <form className="admin-form profile-form" onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">Full Name *</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={profileData.full_name}
              onChange={handleProfileChange}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              maxLength={100}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={profileLoading}>
              {profileLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Profile Picture Section */}
      <div className="section">
        <h2>Profile Picture</h2>

        {pictureSuccess && <div className="alert alert-success">{pictureSuccess}</div>}
        {pictureError && <div className="alert alert-error">{pictureError}</div>}

        <div className="admin-form profile-form">
          {/* Display Current Picture */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            {getProfilePictureUrl() ? (
              <img
                src={getProfilePictureUrl()}
                alt="Profile Picture"
                className="profile-picture-preview"
                onError={onImageError}
              />
            ) : (
              <div className="profile-placeholder">👤</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="profile_picture">Choose New Picture</label>
            <input
              type="file"
              id="profile_picture"
              onChange={onFileSelected}
              accept=".jpg,.jpeg,.png,.gif"
            />
            <small>Maximum file size: 5MB. Allowed types: JPG, PNG, GIF</small>
          </div>

          <div className="form-actions" style={{ justifyContent: 'center' }}>
            <button
              type="button"
              onClick={uploadPicture}
              className="btn btn-primary"
              disabled={pictureLoading || !selectedPictureFile}
            >
              {pictureLoading ? 'Uploading...' : 'Upload Picture'}
            </button>
            {user?.profile_picture && (
              <button
                type="button"
                onClick={removePicture}
                className="btn btn-secondary"
                style={{ background: '#dc3545', color: 'white' }}
                disabled={pictureLoading}
              >
                Remove Picture
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="section">
        <h2>Change Password</h2>

        {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}
        {passwordError && <div className="alert alert-error">{passwordError}</div>}

        <form className="admin-form profile-form" onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="current_password">Current Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="current_password"
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                autoComplete="current-password"
              />
              <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility('current')}>
                <span className="toggle-icon">{showCurrentPassword ? '🙈' : '👁️'}</span>
              </button>
            </div>
            <small>Enter your current password for security verification.</small>
          </div>

          <div className="form-group">
            <label htmlFor="new_password">New Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="new_password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                autoComplete="new-password"
              />
              <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility('new')}>
                <span className="toggle-icon">{showNewPassword ? '🙈' : '👁️'}</span>
              </button>
            </div>
            {/* Password Strength Indicator */}
            {passwordStrength > 0 && (
              <div className="password-strength" style={{ marginTop: '8px' }}>
                <div className="strength-bar-container" style={{ width: '100%', height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div className="strength-bar" style={{ width: `${passwordStrength}%`, background: passwordStrengthColor, height: '100%', transition: 'width 0.3s ease, background 0.3s ease' }}></div>
                </div>
                <span className="strength-label" style={{ color: passwordStrengthColor, fontSize: '12px', fontWeight: '600', marginTop: '4px', display: 'inline-block' }}>{passwordStrengthLabel}</span>
              </div>
            )}
            <small>Must be at least 8 characters with one uppercase letter (A-Z), one number (0-9), and one special character (e.g., !@#$%^&*).</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirm_new_password">Confirm New Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmNewPassword ? 'text' : 'password'}
                id="confirm_new_password"
                name="confirm_new_password"
                value={passwordData.confirm_new_password}
                onChange={handlePasswordChange}
                autoComplete="new-password"
              />
              <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility('confirm')}>
                <span className="toggle-icon">{showConfirmNewPassword ? '🙈' : '👁️'}</span>
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Account Information Section (Read-Only) */}
      <div className="section">
        <h2>Account Information</h2>

        <div className="admin-form profile-form">
          <div className="info-row">
            <span className="info-label">Username:</span>
            <span className="info-value">{user?.username}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Role:</span>
            <span className="info-value">
              <strong style={{ color: '#2d3561' }}>{user?.role_name || (user?.role_id === 1 ? 'Admin' : 'Content Manager')}</strong>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Account Status:</span>
            <span className="info-value">
              {user?.is_active ? (
                <span className="badge badge-success">✓ Active</span>
              ) : (
                <span className="badge badge-inactive">Inactive</span>
              )}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Last Login:</span>
            <span className="info-value">{formatDate(user?.last_login)}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Account Created:</span>
            <span className="info-value">{formatDate(user?.created_at)}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Password Last Changed:</span>
            <span className="info-value">{formatDate(user?.password_changed_at)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
