import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formsService } from '../../services/admin-api';

function FormForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    form_name: '',
    form_description: '',
    embed_code: '',
    page_location: 'Workshops',
    is_active: false
  });

  useEffect(() => {
    if (isEditMode) {
      loadForm();
    }
  }, [id]);

  const loadForm = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await formsService.getById(id);
      const data = response.data;
      setFormData({
        form_name: data.form_name || '',
        form_description: data.form_description || '',
        embed_code: data.embed_code || '',
        page_location: data.page_location || 'Workshops',
        is_active: data.is_active || false
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load form');
      setLoading(false);
      console.error('Error loading form:', err);
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

    if (!formData.form_name.trim()) {
      setError('Form name is required');
      return;
    }
    if (!formData.embed_code.trim()) {
      setError('Embed code is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await formsService.update(id, formData);
      } else {
        await formsService.create(formData);
      }
      navigate('/admin/forms');
    } catch (err) {
      setError(err.message || 'Failed to save form');
      setLoading(false);
      console.error('Error saving form:', err);
    }
  };

  const cancel = () => {
    navigate('/admin/forms');
  };

  return (
    <>
      <div className="content-header">
        <h1>{isEditMode ? 'Edit Form' : 'Add New Form'}</h1>
        <p className="section-subtitle">
          {isEditMode ? 'Update form details' : 'Add a new Google Form embed'}
        </p>
      </div>

      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Forms
        </button>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {loading && !formData.form_name && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading form...</p>
        </div>
      )}

      {(!loading || formData.form_name) && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="form_name">Form Name <span className="required">*</span></label>
            <input
              type="text"
              id="form_name"
              name="form_name"
              className="form-control"
              value={formData.form_name}
              onChange={handleInputChange}
              placeholder="Enter form name"
              maxLength="255"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="form_description">Description</label>
            <textarea
              id="form_description"
              name="form_description"
              className="form-control"
              value={formData.form_description}
              onChange={handleInputChange}
              placeholder="Enter form description (optional)"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="page_location">Form Location <span className="required">*</span></label>
            <select
              id="page_location"
              name="page_location"
              className="form-control"
              value={formData.page_location}
              onChange={handleInputChange}
            >
              <option value="Workshops">Workshops Page</option>
              <option value="Registration">Registration Page</option>
            </select>
            <small className="form-help">Where this form will be displayed</small>
          </div>

          <div className="form-group">
            <label htmlFor="embed_code">Embed Code <span className="required">*</span></label>
            <textarea
              id="embed_code"
              name="embed_code"
              className="form-control"
              value={formData.embed_code}
              onChange={handleInputChange}
              placeholder="Paste Google Form embed code here"
              rows="8"
              required
            ></textarea>
            <small className="form-help">Copy the iframe embed code from Google Forms</small>
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
              {loading ? 'Saving...' : (isEditMode ? 'Update Form' : 'Create Form')}
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

export default FormForm;
