import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function AdminSidebar({ isMobileOpen }) {
  const { user, logout } = useAuth();
  const [imageLoadError, setImageLoadError] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  useEffect(() => {
    setImageLoadError(false);
    updateProfilePictureUrl();
  }, [user]);

  const updateProfilePictureUrl = () => {
    if (imageLoadError || !user?.profile_picture) {
      setProfilePictureUrl('');
    } else {
      setProfilePictureUrl(`/assets/img/profiles/${user.profile_picture}?v=${Date.now()}`);
    }
  };

  const onImageError = () => {
    setImageLoadError(true);
    setProfilePictureUrl('');
  };

  const handleLogout = () => {
    logout();
  };

  const isAdmin = () => {
    return user?.role_id === 1;
  };

  return (
    <aside className={`admin-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Logo Header */}
      <div className="sidebar-header">
        <img src={`${process.env.PUBLIC_URL}/assets/img/logo.png`} alt="PASC Region J" className="sidebar-logo" />
        <h2>Admin Panel</h2>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </NavLink>

        <NavLink to="/admin/announcements" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📢</span>
          <span className="nav-text">Announcements</span>
        </NavLink>

        <NavLink to="/admin/forms" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📝</span>
          <span className="nav-text">Forms</span>
        </NavLink>

        <NavLink to="/admin/gallery" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📷</span>
          <span className="nav-text">Gallery</span>
        </NavLink>

        <NavLink to="/admin/documents" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📁</span>
          <span className="nav-text">Documents</span>
        </NavLink>

        <NavLink to="/admin/schedule" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📅</span>
          <span className="nav-text">Schedule</span>
        </NavLink>

        <NavLink to="/admin/contacts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📧</span>
          <span className="nav-text">Contact Submissions</span>
        </NavLink>

        {/* User Management (Admin Only - role_id = 1) */}
        {isAdmin() && (
          <>
            <div className="nav-divider"></div>

            <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">👥</span>
              <span className="nav-text">User Management</span>
            </NavLink>

            <div className="nav-divider"></div>
          </>
        )}

        {/* External Links */}
        <a href="/" target="_blank" rel="noopener noreferrer" className="nav-item">
          <span className="nav-icon">🌐</span>
          <span className="nav-text">View Website</span>
        </a>

        <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="nav-item">
          <span className="nav-icon">📈</span>
          <span className="nav-text">Analytics</span>
        </a>

        <button onClick={handleLogout} className="nav-item nav-logout">
          <span className="nav-icon">🚪</span>
          <span className="nav-text">Logout</span>
        </button>
      </nav>

      {/* Sidebar Footer (User Info) */}
      <div className="sidebar-footer">
        <div className="user-info">
          {/* Profile Picture or Placeholder (40px for sidebar) */}
          {profilePictureUrl ? (
            <img
              src={profilePictureUrl}
              alt="Profile"
              onError={onImageError}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                margin: '0 auto 10px auto',
                display: 'block',
                border: '2px solid #4fc3f7'
              }}
            />
          ) : (
            <div
              className="profile-placeholder"
              style={{
                width: '40px',
                height: '40px',
                fontSize: '20px',
                margin: '0 auto 10px auto'
              }}
            >
              👤
            </div>
          )}
          <strong>{user?.full_name || 'Admin User'}</strong><br />
          <small style={{ color: '#b0b8d4' }}>{user?.role_name || 'Administrator'}</small>
        </div>

        {/* My Profile Link */}
        <div style={{ marginTop: '15px' }}>
          <NavLink to="/admin/profile" className="nav-item" style={{ padding: '8px 15px' }}>
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">My Profile</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
