import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { galleryService } from '../../services/admin-api';

function GalleryUpload() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    page_location: 'gallery',
    is_active: true
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
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

    if (!selectedFile) {
      setError('Please select an image to upload');
      return;
    }
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);
      uploadData.append('title', formData.title);
      uploadData.append('page_location', formData.page_location);
      uploadData.append('is_active', formData.is_active);

      await galleryService.upload(uploadData);
      navigate('/admin/gallery');
    } catch (err) {
      setError(err.message || 'Failed to upload image');
      setLoading(false);
      console.error('Error uploading image:', err);
    }
  };

  const cancel = () => {
    navigate('/admin/gallery');
  };

  return (
    <>
      <div className="content-header">
        <h1>Upload Image</h1>
        <p className="section-subtitle">Add a new image to the gallery</p>
      </div>

      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Gallery
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file">Image File <span className="required">*</span></label>
          <input
            type="file"
            id="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          <small className="form-help">Supported formats: JPG, PNG, GIF, WebP</small>
        </div>

        {preview && (
          <div className="form-group">
            <label>Preview</label>
            <div className="image-preview">
              <img src={preview} alt="Preview" style={{ maxWidth: '300px', maxHeight: '200px' }} />
            </div>
          </div>
        )}

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
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={cancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default GalleryUpload;
