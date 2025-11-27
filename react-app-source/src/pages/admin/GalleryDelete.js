import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { galleryService } from '../../services/admin-api';

function GalleryDelete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadImage();
    } else {
      setError('No image ID provided');
    }
  }, [id]);

  const loadImage = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await galleryService.getById(id);
      setImage(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load image. It may have been deleted or does not exist.');
      setLoading(false);
      console.error('Error loading image:', err);
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await galleryService.delete(id);
      navigate('/admin/gallery');
    } catch (err) {
      setError('Failed to delete image');
      setLoading(false);
      console.error('Error deleting image:', err);
    }
  };

  const cancel = () => {
    navigate('/admin/gallery');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <>
      {/* Content Header */}
      <div className="content-header">
        <h1>Delete Image</h1>
        <p className="section-subtitle">Permanently remove image from the gallery</p>
      </div>

      {/* Back Button */}
      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Gallery
        </button>
      </div>

      <div className="section">
        {/* Loading State */}
        {loading && !image && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading image...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-error">
            {error}
            <div style={{ marginTop: '20px' }}>
              <Link to="/admin/gallery" className="btn btn-secondary">← Back to Gallery</Link>
              {image && (
                <Link to={`/admin/gallery/edit/${id}`} className="btn btn-primary" style={{ marginLeft: '10px' }}>
                  Edit Image Instead
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {image && !error && (
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
                    You are about to permanently delete this gallery image. This action cannot be undone.
                    The image file will be removed from the server.
                  </p>
                </div>
              </div>
            </div>

            {/* Image Details */}
            <div className="admin-form">
              <h3 style={{ marginBottom: '20px', color: '#2d3561' }}>Image Details:</h3>

              {/* Image Preview */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img
                  src={`/assets/img/gallery/${image.filename}`}
                  alt={image.title}
                  style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                />
              </div>

              <div className="info-row">
                <span className="info-label">Title:</span>
                <span className="info-value">{image.title}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Filename:</span>
                <span className="info-value">{image.original_filename || image.filename}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Location:</span>
                <span className="info-value">{image.page_location === 'gallery' ? 'Gallery Page' : 'About Page'}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className="info-value">
                  {image.is_active ? (
                    <span className="badge badge-success">✓ Active</span>
                  ) : (
                    <span className="badge badge-inactive">Inactive</span>
                  )}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Uploaded:</span>
                <span className="info-value">{formatDate(image.uploaded_at)}</span>
              </div>

              {/* Confirmation Section */}
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                <div style={{
                  background: '#ffebee',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <p style={{ margin: 0, color: '#c62828', fontWeight: '600' }}>
                    Are you absolutely sure you want to delete this image?
                  </p>
                </div>

                <div className="form-actions" style={{ margin: 0, padding: 0, border: 'none' }}>
                  <button
                    onClick={confirmDelete}
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    🗑️ {loading ? 'Deleting...' : 'Yes, Delete Image'}
                  </button>
                  <button
                    onClick={cancel}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <Link to={`/admin/gallery/edit/${id}`} className="btn btn-primary">
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

export default GalleryDelete;
