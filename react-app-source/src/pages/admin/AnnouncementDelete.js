import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
      setError('Failed to load announcement');
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
    if (!dateString) return 'No end date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <>
      {/* Content Header */}
      <div className="content-header">
        <h1>Delete Announcement</h1>
        <p className="section-subtitle">Confirm deletion of this announcement</p>
      </div>

      {/* Back Button */}
      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Announcements
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !announcement && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading announcement...</p>
        </div>
      )}

      {/* Delete Confirmation */}
      {announcement && (
        <div className="delete-confirmation">
          <div className="warning-box">
            <div className="warning-icon">⚠️</div>
            <h2>Are you sure you want to delete this announcement?</h2>
            <p>This action cannot be undone.</p>
          </div>

          <div className="item-preview">
            <h3>Announcement Details:</h3>
            <div className="preview-field">
              <strong>Title:</strong>
              <span>{announcement.title}</span>
            </div>
            <div className="preview-field">
              <strong>Content:</strong>
              <span>{announcement.content}</span>
            </div>
            <div className="preview-field">
              <strong>Publish Start:</strong>
              <span>{formatDate(announcement.publish_start)}</span>
            </div>
            <div className="preview-field">
              <strong>Publish End:</strong>
              <span>{formatDate(announcement.publish_end)}</span>
            </div>
            <div className="preview-field">
              <strong>Status:</strong>
              <span>{announcement.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn btn-danger"
              onClick={confirmDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Yes, Delete Announcement'}
            </button>

            <button
              className="btn btn-secondary"
              onClick={cancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AnnouncementDelete;
