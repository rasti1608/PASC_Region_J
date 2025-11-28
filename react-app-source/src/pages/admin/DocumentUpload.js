import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentsService } from '../../services/admin-api';

function DocumentUpload() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_type: '',
    is_active: false
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];

      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Only PDF, Word, Excel, and PowerPoint files are allowed.');
        setSelectedFile(null);
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10485760) {
        setError('File size exceeds 10MB maximum. Please choose a smaller document.');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError(null);
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
      setError('Document Title is required');
      return;
    }
    if (!selectedFile) {
      setError('Document File is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const uploadData = new FormData();
      uploadData.append('document_file', selectedFile);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description || '');
      uploadData.append('document_type', formData.document_type || '');
      uploadData.append('is_active', formData.is_active ? '1' : '0');

      await documentsService.upload(uploadData);
      navigate('/admin/documents');
    } catch (err) {
      setError(err.message || 'Failed to upload document');
      setLoading(false);
      console.error('Error uploading document:', err);
    }
  };

  const cancel = () => {
    navigate('/admin/documents');
  };

  return (
    <>
      {/* Content Header */}
      <div className="content-header">
        <h1>Upload New Document</h1>
        <p className="section-subtitle">Add a new document to resources</p>
      </div>

      {/* Back Button */}
      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Documents
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Upload Form */}
      <form className="admin-form" onSubmit={handleSubmit}>
        {/* Document Title */}
        <div className="form-group">
          <label htmlFor="title">Document Title <span className="required">*</span></label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter document title"
            maxLength="255"
            required
          />
          <small className="form-help">This title will be displayed on the website</small>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of this document"
            rows="3"
          ></textarea>
          <small className="form-help">Optional description shown with the document</small>
        </div>

        {/* Document File Upload */}
        <div className="form-group">
          <label htmlFor="document_file">Document File <span className="required">*</span></label>
          <input
            type="file"
            id="document_file"
            name="document_file"
            className="form-control"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            onChange={handleFileChange}
            required
          />
          <small className="form-help">Supported formats: PDF, Word, Excel, PowerPoint (Max 10MB)</small>
        </div>

        {/* Document Type */}
        <div className="form-group">
          <label htmlFor="document_type">Document Type</label>
          <input
            type="text"
            id="document_type"
            name="document_type"
            className="form-control"
            value={formData.document_type}
            onChange={handleInputChange}
            placeholder="e.g., Workshop Materials, Registration Form, etc."
            maxLength="100"
          />
          <small className="form-help">Optional category or type for this document</small>
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
            <span>Active (visible on website)</span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Document'}
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
    </>
  );
}

export default DocumentUpload;
