import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
      setError('Failed to load image');
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

  return (
    <>
      <div className="content-header">
        <h1>Delete Image</h1>
        <p className="section-subtitle">Confirm deletion of this image</p>
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
        <div className="delete-confirmation">
          <div className="warning-box">
            <div className="warning-icon">⚠️</div>
            <h2>Are you sure you want to delete this image?</h2>
            <p>This action cannot be undone. The image file will be permanently removed.</p>
          </div>

          <div className="item-preview">
            <h3>Image Details:</h3>
            <div className="image-preview">
              <img
                src={`/assets/img/gallery/${image.filename}`}
                alt={image.title}
                style={{ maxWidth: '300px', maxHeight: '200px' }}
              />
            </div>
            <div className="preview-field">
              <strong>Title:</strong>
              <span>{image.title}</span>
            </div>
            <div className="preview-field">
              <strong>Location:</strong>
              <span>{image.page_location === 'gallery' ? 'Gallery Page' : 'About Page'}</span>
            </div>
            <div className="preview-field">
              <strong>Status:</strong>
              <span>{image.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-danger" onClick={confirmDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Yes, Delete Image'}
            </button>
            <button className="btn btn-secondary" onClick={cancel} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default GalleryDelete;
