import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formsService } from '../../services/admin-api';

function FormDelete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadForm();
    } else {
      setError('No form ID provided');
    }
  }, [id]);

  const loadForm = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await formsService.getById(id);
      setForm(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load form. It may have been deleted or does not exist.');
      setLoading(false);
      console.error('Error loading form:', err);
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await formsService.delete(id);
      navigate('/admin/forms');
    } catch (err) {
      setError('Failed to delete form');
      setLoading(false);
      console.error('Error deleting form:', err);
    }
  };

  const cancel = () => {
    navigate('/admin/forms');
  };

  const getDescriptionPreview = (description) => {
    if (!description) return 'No description';
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  };

  return (
    <>
      {/* Content Header */}
      <div className="content-header">
        <h1>Delete Form</h1>
        <p className="section-subtitle">Permanently remove form from the website</p>
      </div>

      {/* Back Button */}
      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Forms
        </button>
      </div>

      <div className="section">
        {/* Loading State */}
        {loading && !form && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading form...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-error">
            {error}
            <div style={{ marginTop: '20px' }}>
              <Link to="/admin/forms" className="btn btn-secondary">← Back to Forms</Link>
              {form && (
                <Link to={`/admin/forms/edit/${id}`} className="btn btn-primary" style={{ marginLeft: '10px' }}>
                  Edit Form Instead
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {form && !error && (
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
                    You are about to permanently delete this form. This action cannot be undone.
                    The form will be removed from the website immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Details */}
            <div className="admin-form">
              <h3 style={{ marginBottom: '20px', color: '#2d3561' }}>Form Details:</h3>

              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{form.form_name}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Description:</span>
                <span className="info-value">{getDescriptionPreview(form.form_description)}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Location:</span>
                <span className="info-value">{form.page_location} Page</span>
              </div>

              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className="info-value">
                  {form.is_active ? (
                    <span className="badge badge-success">✓ Active</span>
                  ) : (
                    <span className="badge badge-inactive">Inactive</span>
                  )}
                </span>
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
                    Are you absolutely sure you want to delete this form?
                  </p>
                </div>

                <div className="form-actions" style={{ margin: 0, padding: 0, border: 'none' }}>
                  <button
                    onClick={confirmDelete}
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    🗑️ {loading ? 'Deleting...' : 'Yes, Delete Form'}
                  </button>
                  <button
                    onClick={cancel}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <Link to={`/admin/forms/edit/${id}`} className="btn btn-primary">
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

export default FormDelete;
