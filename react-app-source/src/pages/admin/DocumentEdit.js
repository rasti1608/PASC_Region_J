import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentsService } from '../../services/admin-api';

function DocumentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [document, setDocument] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_type: '',
    is_active: true
  });

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await documentsService.getById(id);
      const data = response.data;
      setDocument(data);
      setFormData({
        title: String(data.title || ''),
        description: data.description || '',
        document_type: data.document_type || '',
        is_active: data.is_active || false
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load document');
      setLoading(false);
      console.error('Error loading document:', err);
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

    const title = String(formData.title || '').trim();
    if (!title) {
      setError('Document Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await documentsService.update(id, formData);
      navigate('/admin/documents');
    } catch (err) {
      setError(err.message || 'Failed to update document');
      setLoading(false);
      console.error('Error updating document:', err);
    }
  };

  const cancel = () => {
    navigate('/admin/documents');
  };

  const getDocumentIcon = (extension) => {
    if (!extension) return '📁';
    const ext = extension.toLowerCase().replace('.', '');
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'ppt':
      case 'pptx': return '📽️';
      default: return '📁';
    }
  };

  const getDocIconClass = (extension) => {
    if (!extension) return 'doc-icon';
    const ext = extension.toLowerCase().replace('.', '');
    return `doc-icon ${ext}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    const mb = kb / 1024;
    return mb.toFixed(2) + ' MB';
  };

  return (
    <>
      {/* Content Header */}
      <div className="content-header">
        <h1>Edit Document</h1>
        <p className="section-subtitle">Update document details</p>
      </div>

      {/* Back Button */}
      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Documents
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading State */}
      {loading && !formData.title && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading document...</p>
        </div>
      )}

      {/* Edit Form */}
      {(!loading || formData.title) && document && (
        <form className="admin-form" onSubmit={handleSubmit}>
          {/* Current Document Info */}
          <div className="form-group">
            <label>Current Document</label>
            <div className="document-info">
              <div className={getDocIconClass(document.file_extension)}>
                {getDocumentIcon(document.file_extension)}
              </div>
              <div>
                <div><strong>{document.original_filename}</strong></div>
                <div className="file-info">{formatFileSize(document.file_size)}</div>
              </div>
            </div>
          </div>

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
              {loading ? 'Saving...' : 'Update Document'}
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

export default DocumentEdit;
