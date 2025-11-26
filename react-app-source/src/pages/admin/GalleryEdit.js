import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { galleryService } from '../../services/admin-api';

function GalleryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    page_location: 'gallery',
    is_active: true
  });

  useEffect(() => {
    loadImage();
  }, [id]);

  const loadImage = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await galleryService.getById(id);
      const data = response.data;
      setImage(data);
      setFormData({
        title: data.title || '',
        page_location: data.page_location || 'gallery',
        is_active: data.is_active || false
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load image');
      setLoading(false);
      console.error('Error loading image:', err);
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

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await galleryService.update(id, formData);
      navigate('/admin/gallery');
    } catch (err) {
      setError(err.message || 'Failed to update image');
      setLoading(false);
      console.error('Error updating image:', err);
    }
  };

  const cancel = () => {
    navigate('/admin/gallery');
  };

  return (
    <>
      <div className="content-header">
        <h1>Edit Image</h1>
        <p className="section-subtitle">Update image details</p>
      </div>

      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Gallery
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && !image && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading image...</p>
        </div>
      )}

      {image && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Image</label>
            <div className="image-preview">
              <img
                src={`/assets/img/gallery/${image.filename}`}
                alt={image.title}
                style={{ maxWidth: '300px', maxHeight: '200px' }}
              />
            </div>
            <small className="form-help">To change the image, delete this one and upload a new one</small>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title <span className="required">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter image title"
              maxLength="255"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="page_location">Page Location <span className="required">*</span></label>
            <select
              id="page_location"
              name="page_location"
              className="form-control"
              value={formData.page_location}
              onChange={handleInputChange}
            >
              <option value="gallery">Gallery Page</option>
              <option value="about_page">About Page</option>
            </select>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
              <span>Active (visible on website)</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Update Image'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={cancel} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default GalleryEdit;
