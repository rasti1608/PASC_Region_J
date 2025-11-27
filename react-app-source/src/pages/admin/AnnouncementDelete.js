import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { announcementsService } from '../../services/admin-api';

function AnnouncementDelete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadAnnouncement();
    } else {
      setError('No announcement ID provided');
    }
  }, [id]);

  const loadAnnouncement = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await announcementsService.getById(id);
      setAnnouncement(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load announcement. It may have been deleted or does not exist.');
      setLoading(false);
      console.error('Error loading announcement:', err);
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await announcementsService.delete(id);
      navigate('/admin/announcements');
    } catch (err) {
      setError('Failed to delete announcement');
      setLoading(false);
      console.error('Error deleting announcement:', err);
    }
  };

  const cancel = () => {
    navigate('/admin/announcements');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getComputedStatus = (ann) => {
    if (!ann) return 'inactive';
    if (!ann.is_active) return 'inactive';

    const now = new Date();
    const startDate = ann.publish_start ? new Date(ann.publish_start) : null;
    const endDate = ann.publish_end ? new Date(ann.publish_end) : null;

    if (endDate && endDate < now) return 'expired';
    if (startDate && startDate > now) return 'future';
    return 'live';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'live':
        return <span className="badge badge-success">✓ Live</span>;
      case 'inactive':
        return <span className="badge badge-inactive">Inactive</span>;
      case 'future':
        return <span className="badge" style={{ background: '#e3f2fd', color: '#1565c0' }}>📅 Future</span>;
      case 'expired':
        return <span className="badge" style={{ background: '#ffebee', color: '#c62828' }}>Expired</span>;
      default:
        return <span className="badge badge-inactive">Unknown</span>;
    }
  };

  const getContentPreview = (content) => {
    if (!content) return '';
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  return (
    <>
      {/* Content Header */}
      <div className="content-header">
        <h1>Delete Announcement</h1>
        <p className="section-subtitle">Permanently remove announcement from the website</p>
      </div>

      {/* Back Button */}
      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Announcements
        </button>
      </div>

      <div className="section">
        {/* Loading State */}
        {loading && !announcement && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading announcement...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-error">
            {error}
            <div style={{ marginTop: '20px' }}>
              <Link to="/admin/announcements" className="btn btn-secondary">← Back to Announcements</Link>
              {announcement && (
                <Link to={`/admin/announcements/edit/${id}`} className="btn btn-primary" style={{ marginLeft: '10px' }}>
                  Edit Announcement Instead
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {announcement && !error && (
          <div style={{ maxWidth: '700px' }}>
            {/* Warning Box */}
            <div style={{
              background: '#fff3cd',
              borderLeft: '4px solid #ffc107',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ fontSize: '2rem' }}>⚠️</div>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>Warning: Permanent Deletion</h3>
                  <p style={{ margin: 0, color: '#856404', lineHeight: '1.6' }}>
                    You are about to permanently delete this announcement. This action cannot be undone.
                    The announcement will be removed from the website immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Announcement Details */}
            <div className="admin-form">
              <h3 style={{ marginBottom: '20px', color: '#2d3561' }}>Announcement Details:</h3>

              <div className="info-row">
                <span className="info-label">Title:</span>
                <span className="info-value">{announcement.title}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Content:</span>
                <span className="info-value">{getContentPreview(announcement.content)}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className="info-value">
                  {getStatusBadge(getComputedStatus(announcement))}
                </span>
              </div>

              {announcement.is_featured ? (
                <div className="info-row">
                  <span className="info-label">Featured:</span>
                  <span className="info-value">⭐ Yes</span>
                </div>
              ) : null}

              <div className="info-row">
                <span className="info-label">Publish Start:</span>
                <span className="info-value">{formatDate(announcement.publish_start)}</span>
              </div>

              {announcement.publish_end && (
                <div className="info-row">
                  <span className="info-label">Publish End:</span>
                  <span className="info-value">{formatDate(announcement.publish_end)}</span>
                </div>
              )}

              {/* Confirmation Section */}
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                <div style={{
                  background: '#ffebee',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <p style={{ margin: 0, color: '#c62828', fontWeight: '600' }}>
                    Are you absolutely sure you want to delete this announcement?
                  </p>
                </div>

                <div className="form-actions" style={{ margin: 0, padding: 0, border: 'none' }}>
                  <button
                    onClick={confirmDelete}
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    🗑️ {loading ? 'Deleting...' : 'Yes, Delete Announcement'}
                  </button>
                  <button
                    onClick={cancel}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <Link to={`/admin/announcements/edit/${id}`} className="btn btn-primary">
                    Edit Instead
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AnnouncementDelete;
