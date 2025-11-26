import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ChangePassword() {
  const navigate = useNavigate();
  const { user, changeRequiredPassword, logout } = useAuth();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');
  const [strengthColor, setStrengthColor] = useState('');

  useEffect(() => {
    // Check if user needs to change password
    if (user && !user.must_change_password) {
      // User doesn't need to change password, redirect to dashboard
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    calculatePasswordStrength(formData.newPassword);
  }, [formData.newPassword]);

  const calculatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0);
      setStrengthLabel('');
      setStrengthColor('');
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
      setStrengthLabel('Weak');
      setStrengthColor('#dc3545');
    } else if (finalStrength < 40) {
      setStrengthLabel('Fair');
      setStrengthColor('#fd7e14');
    } else if (finalStrength < 60) {
      setStrengthLabel('Medium');
      setStrengthColor('#ffc107');
    } else if (finalStrength < 80) {
      setStrengthLabel('Good');
      setStrengthColor('#90EE90');
    } else {
      setStrengthLabel('Strong');
      setStrengthColor('#28a745');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const { newPassword, confirmPassword } = formData;

    // Check passwords match
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Validate password requirements
    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setErrorMessage('Password must contain at least one uppercase letter.');
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setErrorMessage('Password must contain at least one number.');
      return;
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword)) {
      setErrorMessage('Password must contain at least one special character.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await changeRequiredPassword(newPassword);

      if (response.success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMessage(response.message || 'Failed to change password.');
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to change password. Please try again.');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(prev => !prev);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(prev => !prev);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-box">
        <div className="login-header">
          <div className="logo">
            <img src="/assets/img/logo.png" alt="PASC Region J" className="logo-img" />
          </div>
          <h1>Change Password</h1>
          <p>PASC Region J Conference 2026</p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert-error">
            {errorMessage}
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <p className="form-instructions">
            For security reasons, you must change your password before continuing.
          </p>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('password')}
                aria-label="Toggle password visibility"
              >
                <span className="toggle-icon">{showPassword ? '🙈' : '👁️'}</span>
              </button>
            </div>
            {/* Password Strength Indicator */}
            {passwordStrength > 0 && (
              <div className="password-strength">
                <div className="strength-bar-container">
                  <div
                    className="strength-bar"
                    style={{ width: `${passwordStrength}%`, background: strengthColor }}
                  ></div>
                </div>
                <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                aria-label="Toggle password visibility"
              >
                <span className="toggle-icon">{showConfirmPassword ? '🙈' : '👁️'}</span>
              </button>
            </div>
          </div>

          {/* Password Requirements Info */}
          <div className="password-requirements">
            <strong className="requirements-title">Password Requirements:</strong>
            <ul className="requirements-list">
              <li>Minimum 8 characters</li>
              <li>At least one uppercase letter (A-Z)</li>
              <li>At least one number (0-9)</li>
              <li>At least one special character (e.g., !@#$%^&*)</li>
              <li>Cannot reuse your current password</li>
            </ul>
          </div>

          <button
            type="submit"
            className="btn btn-login"
            disabled={loading || !formData.newPassword || !formData.confirmPassword}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>

        {/* Logout Link */}
        <div className="logout-link-container">
          <button type="button" onClick={handleLogout} className="logout-link">
            Logout and return later
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
