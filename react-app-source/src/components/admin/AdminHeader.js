import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function AdminHeader({ onToggleMobileMenu }) {
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

  return (
    <header className="admin-header">
      {/* Mobile Hamburger Menu Button */}
      <button className="hamburger-menu" onClick={onToggleMobileMenu}>
        <span>☰</span>
      </button>

      {/* Header Right Section */}
      <div className="header-right">
        {/* Profile Link with Avatar and Settings Icon */}
        <Link to="/admin/profile" className="header-profile-link" title="Profile & Settings">
          {/* Profile Avatar (Dynamic) */}
          {profilePictureUrl ? (
            <img
              src={profilePictureUrl}
              alt="Profile"
              onError={onImageError}
              className="header-avatar-img"
            />
          ) : (
            <span className="header-avatar">👤</span>
          )}
          {/* Settings Gear Icon */}
          <span className="header-settings-icon">⚙️</span>
        </Link>

        {/* Logout Button */}
        <button onClick={handleLogout} className="header-logout-link" title="Logout">
          <span>🚪</span>
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
