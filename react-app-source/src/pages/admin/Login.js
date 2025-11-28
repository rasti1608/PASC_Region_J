import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const returnUrl = searchParams.get('returnUrl') || '/admin/dashboard';

  useEffect(() => {
    // Check if user is already authenticated
    // Only redirect if they're authenticated AND not coming from an auth error page
    const fromActivate = searchParams.get('from') === 'activate';
    const fromReset = searchParams.get('from') === 'reset';

    if (isAuthenticated && !fromActivate && !fromReset) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, searchParams, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await login({
        username: formData.username.trim(),
        password: formData.password
      });

      if (response.success) {
        // Check if user must change password
        if (response.user?.must_change_password) {
          navigate('/admin/change-password');
        } else {
          navigate(returnUrl);
        }
      } else {
        setErrorMessage(response.message || 'Login failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Login failed. Please check your credentials and try again.');
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-box">
        <div className="login-header">
          <div className="logo">
            <img src={`${process.env.PUBLIC_URL}/assets/img/logo.png`} alt="PASC Region J" className="logo-img" />
          </div>
          <h1>Admin Panel</h1>
          <p>PASC Region J Conference 2026</p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert-error">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-control"
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-control"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePassword}
                aria-label="Toggle password visibility"
              >
                <span className="toggle-icon">{showPassword ? '🙈' : '👁️'}</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-login"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="forgot-password-link">
            <Link to="/admin/forgot-password">Forgot Password?</Link>
          </div>
        </form>

        <div className="login-footer">
          <p><small>Please change default password after first login</small></p>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
