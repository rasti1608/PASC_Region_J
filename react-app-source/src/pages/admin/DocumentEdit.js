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
    documenttype: 'General',
    is_active: true
  });

  const documentTypes = ['General', 'Conference Materials', 'Registration', 'Guidelines', 'Resources'];

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
        title: data.title || '',
        description: data.description || '',
        documenttype: data.documenttype || 'General',
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

    if (!formData.title.trim()) {
      setError('Title is required');
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

  return (
    <>
      <div className="content-header">
        <h1>Edit Document</h1>
        <p className="section-subtitle">Update document details</p>
      </div>

      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Documents
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && !document && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading document...</p>
        </div>
      )}

      {document && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current File</label>
            <div className="file-info">
              <strong>{document.filename}</strong>
              <span className="text-muted"> ({document.filesizeformatted})</span>
            </div>
            <small className="form-help">To change the file, delete this document and upload a new one</small>
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
              placeholder="Enter document title"
              maxLength="255"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter document description (optional)"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="documenttype">Category <span className="required">*</span></label>
            <select
              id="documenttype"
              name="documenttype"
              className="form-control"
              value={formData.documenttype}
              onChange={handleInputChange}
            >
              {documentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
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
              <span>Active (available for download)</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Update Document'}
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

export default DocumentEdit;
