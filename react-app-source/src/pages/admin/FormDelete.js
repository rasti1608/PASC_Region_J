import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
      setError('Failed to load form');
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

  return (
    <>
      <div className="content-header">
        <h1>Delete Form</h1>
        <p className="section-subtitle">Confirm deletion of this form</p>
      </div>

      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Forms
        </button>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {loading && !form && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading form...</p>
        </div>
      )}

      {form && (
        <div className="delete-confirmation">
          <div className="warning-box">
            <div className="warning-icon">⚠️</div>
            <h2>Are you sure you want to delete this form?</h2>
            <p>This action cannot be undone.</p>
          </div>

          <div className="item-preview">
            <h3>Form Details:</h3>
            <div className="preview-field">
              <strong>Name:</strong>
              <span>{form.formname}</span>
            </div>
            <div className="preview-field">
              <strong>Location:</strong>
              <span>{form.formtype}</span>
            </div>
            <div className="preview-field">
              <strong>Status:</strong>
              <span>{form.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-danger" onClick={confirmDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Yes, Delete Form'}
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

export default FormDelete;
