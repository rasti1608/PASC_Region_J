import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentsService } from '../../services/admin-api';

function DocumentDelete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadDocument();
    } else {
      setError('No document ID provided');
    }
  }, [id]);

  const loadDocument = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await documentsService.getById(id);
      setDocument(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load document');
      setLoading(false);
      console.error('Error loading document:', err);
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await documentsService.delete(id);
      navigate('/admin/documents');
    } catch (err) {
      setError('Failed to delete document');
      setLoading(false);
      console.error('Error deleting document:', err);
    }
  };

  const cancel = () => {
    navigate('/admin/documents');
  };

  return (
    <>
      <div className="content-header">
        <h1>Delete Document</h1>
        <p className="section-subtitle">Confirm deletion of this document</p>
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
        <div className="delete-confirmation">
          <div className="warning-box">
            <div className="warning-icon">⚠️</div>
            <h2>Are you sure you want to delete this document?</h2>
            <p>This action cannot be undone. The file will be permanently removed.</p>
          </div>

          <div className="item-preview">
            <h3>Document Details:</h3>
            <div className="preview-field">
              <strong>Title:</strong>
              <span>{document.title}</span>
            </div>
            <div className="preview-field">
              <strong>File:</strong>
              <span>{document.filename}</span>
            </div>
            <div className="preview-field">
              <strong>Category:</strong>
              <span>{document.documenttype}</span>
            </div>
            <div className="preview-field">
              <strong>Size:</strong>
              <span>{document.filesizeformatted}</span>
            </div>
            <div className="preview-field">
              <strong>Status:</strong>
              <span>{document.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-danger" onClick={confirmDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Yes, Delete Document'}
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

export default DocumentDelete;
