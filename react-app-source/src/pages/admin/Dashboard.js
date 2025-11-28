import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { announcementsService, formsService, galleryService } from '../../services/admin-api';

function Dashboard() {
  const [stats, setStats] = useState({
    activeAnnouncements: 0,
    activeForms: 0,
    activeGallery: 0,
    activeSessions: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    try {
      const [announcementsRes, formsWorkshopsRes, formsRegistrationRes, galleryAboutRes, galleryMainRes] = await Promise.all([
        announcementsService.getAll(),
        formsService.getAll('Workshops'),
        formsService.getAll('Registration'),
        galleryService.getAll('about_page'),
        galleryService.getAll('gallery')
      ]);

      const announcements = announcementsRes.data || [];
      const formsWorkshops = formsWorkshopsRes.data || [];
      const formsRegistration = formsRegistrationRes.data || [];
      const galleryAbout = galleryAboutRes.data || [];
      const galleryMain = galleryMainRes.data || [];

      const allForms = [...formsWorkshops, ...formsRegistration];
      const allGallery = [...galleryAbout, ...galleryMain];

      setStats({
        activeAnnouncements: announcements.filter(a => a.is_active).length,
        activeForms: allForms.filter(f => f.is_active).length,
        activeGallery: allGallery.filter(g => g.is_active).length,
        activeSessions: 1
      });

      setLoading(false);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Failed to load dashboard statistics');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="content-header">
        <h1>Dashboard</h1>
        <p className="welcome-message">Welcome back, Admin User!</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📢</div>
          <div className="stat-info">
            <h3>{stats.activeAnnouncements}</h3>
            <p>Active Announcements</p>
          </div>
          <Link to="/admin/announcements" className="stat-link">Manage →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>{stats.activeForms}</h3>
            <p>Active Forms</p>
          </div>
          <Link to="/admin/forms" className="stat-link">Manage →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📷</div>
          <div className="stat-info">
            <h3>{stats.activeGallery}</h3>
            <p>Active Gallery Images</p>
          </div>
          <Link to="/admin/gallery" className="stat-link">Manage →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.activeSessions}</h3>
            <p>Active Sessions</p>
            <small style={{ color: '#999', fontSize: '0.85rem', display: 'block', marginTop: '4px' }}>Currently online</small>
          </div>
          <Link to="/admin/users" className="stat-link">Manage →</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/admin/announcements/add" className="action-card">
            <div className="action-icon">➕</div>
            <h3>New Announcement</h3>
            <p>Create a new homepage announcement</p>
          </Link>

          <Link to="/admin/forms/add" className="action-card">
            <div className="action-icon">📋</div>
            <h3>Add Form</h3>
            <p>Add a new Google Form embed</p>
          </Link>

          <Link to="/admin/gallery/upload" className="action-card">
            <div className="action-icon">📷</div>
            <h3>Add Image</h3>
            <p>Upload a new gallery image</p>
          </Link>

          <a href="/" target="_blank" rel="noopener noreferrer" className="action-card">
            <div className="action-icon">🌐</div>
            <h3>View Website</h3>
            <p>Open public website in new tab</p>
          </a>
        </div>
      </div>

      {/* System Information */}
      <div className="section">
        <h2>System Information</h2>
        <div className="info-box">
          <div className="info-row">
            <span className="info-label">Conference Date:</span>
            <span className="info-value">February 13, 2026</span>
          </div>
          <div className="info-row">
            <span className="info-label">Conference Theme:</span>
            <span className="info-value">Reach for the Stars, Lead Beyond Limits</span>
          </div>
          <div className="info-row">
            <span className="info-label">Website Version:</span>
            <span className="info-value">React-app v1.0</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
