import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ForgotPassword() {
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await requestPasswordReset(email.trim());
      console.log('Password reset API response:', response);
      setLoading(false);

      if (response.success) {
        setEmailSent(true);
      } else {
        console.warn('Password reset returned unsuccessful:', response.message);
        // Always show success to prevent email enumeration
        setEmailSent(true);
      }
    } catch (error) {
      console.error('Password reset API error:', error);
      setLoading(false);
      // Always show success to prevent email enumeration
      setEmailSent(true);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-box">
        <div className="login-header">
          <div className="logo">
            <img src={`${process.env.PUBLIC_URL}/assets/img/logo.png`} alt="PASC Region J" className="logo-img" />
          </div>
          <h1>Reset Password</h1>
          <p>PASC Region J Conference 2026</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert-error">
            {errorMessage}
          </div>
        )}

        {/* Reset Form */}
        {!emailSent && (
          <form onSubmit={handleSubmit} className="login-form">
            <p className="form-instructions">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter your email"
                autoComplete="email"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn btn-login"
              disabled={loading || !email}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {/* Success state - show after email sent */}
        {emailSent && (
          <div className="login-form">
            <div className="success-box">
              <div className="success-icon">✓</div>
              <h3>Check Your Email</h3>
              <p>If an account exists with that email address, you will receive a password reset link shortly.</p>
              <p>Please check your email and follow the instructions to reset your password.</p>
              <p className="note">The link will expire in 1 hour.</p>
            </div>
          </div>
        )}

        <div className="login-footer">
          <Link to="/admin" className="btn btn-back">← Back to Login</Link>
        </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
