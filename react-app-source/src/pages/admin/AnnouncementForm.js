import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { announcementsService } from '../../services/admin-api';

function AnnouncementForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_active: false,
    is_featured: false,
    publish_start: getTodayDate(),
    publish_end: ''
  });

  useEffect(() => {
    if (isEditMode) {
      loadAnnouncement();
    }
  }, [id]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const loadAnnouncement = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await announcementsService.getById(id);
      const data = response.data;
      setFormData({
        title: data.title || '',
        content: data.content || '',
        is_active: data.is_active || false,
        is_featured: data.is_featured || false,
        publish_start: formatDateForInput(data.publish_start),
        publish_end: data.publish_end ? formatDateForInput(data.publish_end) : ''
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load announcement');
      setLoading(false);
      console.error('Error loading announcement:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    if (!formData.publish_start) {
      setError('Publish start date is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        publish_end: formData.publish_end || null
      };

      if (isEditMode) {
        await announcementsService.update(id, dataToSend);
      } else {
        await announcementsService.create(dataToSend);
      }
      navigate('/admin/announcements');
    } catch (err) {
      setError(err.message || 'Failed to save announcement');
      setLoading(false);
      console.error('Error saving announcement:', err);
    }
  };

  const cancel = () => {
    navigate('/admin/announcements');
  };

  return (
    <>
      {/* Content Header */}
      <div className="content-header">
        <h1>{isEditMode ? 'Edit Announcement' : 'Add New Announcement'}</h1>
        <p className="section-subtitle">
          {isEditMode ? 'Update announcement details' : 'Create a new announcement for the homepage'}
        </p>
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
      {loading && !formData.title && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading announcement...</p>
        </div>
      )}

      {/* Form */}
      {(!loading || formData.title) && (
        <form className="admin-form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title <span className="required">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter announcement title"
              maxLength="255"
              required
            />
            <small className="form-help">Keep it short and clear (max 255 characters)</small>
          </div>

          {/* Content */}
          <div className="form-group">
            <label htmlFor="content">Content <span className="required">*</span></label>
            <textarea
              id="content"
              name="content"
              className="form-control"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Enter announcement content"
              rows="6"
              required
            ></textarea>
            <small className="form-help">This will appear on the homepage</small>
          </div>

          {/* Publish Start Date */}
          <div className="form-group">
            <label htmlFor="publish_start">Publish Start Date <span className="required">*</span></label>
            <input
              type="date"
              id="publish_start"
              name="publish_start"
              className="form-control"
              value={formData.publish_start}
              onChange={handleInputChange}
              required
            />
            <small className="form-help">Announcement will appear on homepage starting this date</small>
          </div>

          {/* Publish End Date */}
          <div className="form-group">
            <label htmlFor="publish_end">Publish End Date</label>
            <div className="date-input-wrapper">
              <input
                type="date"
                id="publish_end"
                name="publish_end"
                className="form-control"
                value={formData.publish_end}
                onChange={handleInputChange}
              />
              {formData.publish_end && (
                <button
                  type="button"
                  className="btn-clear-date"
                  onClick={() => setFormData(prev => ({ ...prev, publish_end: '' }))}
                  title="Clear date"
                >
                  ×
                </button>
              )}
            </div>
            <small className="form-help">Leave empty for no end date</small>
          </div>

          {/* Is Featured Checkbox */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
              />
              <span>Featured announcement (highlighted on homepage)</span>
            </label>
          </div>

          {/* Is Active Checkbox */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
              <span>Active (ready to publish)</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEditMode ? 'Update Announcement' : 'Create Announcement')}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default AnnouncementForm;
