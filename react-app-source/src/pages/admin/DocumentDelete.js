import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
      setError('Failed to load document. It may have been deleted or does not exist.');
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

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    return kb.toFixed(2) + ' KB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dateString;
  };

  return (
    <>
      {/* Content Header */}
      <div className="content-header">
        <h1>Delete Document</h1>
        <p className="section-subtitle">Permanently remove document from the website</p>
      </div>

      {/* Back Button */}
      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Documents
        </button>
      </div>

      <div className="section">
        {/* Loading State */}
        {loading && !document && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading document...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-error">
            {error}
            <div style={{ marginTop: '20px' }}>
              <Link to="/admin/documents" className="btn btn-secondary">← Back to Documents</Link>
              {document && (
                <Link to={`/admin/documents/edit/${id}`} className="btn btn-primary" style={{ marginLeft: '10px' }}>
                  Edit Document Instead
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {document && !error && (
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
                    You are about to permanently delete this document. This action cannot be undone.
                    The document file will be removed from the server.
                  </p>
                </div>
              </div>
            </div>

            {/* Document Details */}
            <div className="admin-form">
              <h3 style={{ marginBottom: '20px', color: '#2d3561' }}>Document Details:</h3>

              <div className="info-row">
                <span className="info-label">Title:</span>
                <span className="info-value">{document.title}</span>
              </div>

              {document.description && (
                <div className="info-row">
                  <span className="info-label">Description:</span>
                  <span className="info-value">{document.description}</span>
                </div>
              )}

              <div className="info-row">
                <span className="info-label">Filename:</span>
                <span className="info-value">{document.original_filename}</span>
              </div>

              <div className="info-row">
                <span className="info-label">File Type:</span>
                <span className="info-value">{document.file_extension ? document.file_extension.toUpperCase() : 'N/A'}</span>
              </div>

              {document.document_type && (
                <div className="info-row">
                  <span className="info-label">Document Type:</span>
                  <span className="info-value">{document.document_type}</span>
                </div>
              )}

              <div className="info-row">
                <span className="info-label">File Size:</span>
                <span className="info-value">{formatFileSize(document.file_size)}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className="info-value">
                  {document.is_active ? (
                    <span className="badge badge-success">✓ Active</span>
                  ) : (
                    <span className="badge badge-inactive">Inactive</span>
                  )}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Uploaded:</span>
                <span className="info-value">{formatDate(document.uploaded_at)}</span>
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
                    Are you absolutely sure you want to delete this document?
                  </p>
                </div>

                <div className="form-actions" style={{ margin: 0, padding: 0, border: 'none' }}>
                  <button
                    onClick={confirmDelete}
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Yes, Delete Document'}
                  </button>
                  <button
                    onClick={cancel}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <Link to={`/admin/documents/edit/${id}`} className="btn btn-primary">
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

export default DocumentDelete;
