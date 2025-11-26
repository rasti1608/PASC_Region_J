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
    formname: '',
    formdescription: '',
    embedcode: '',
    formtype: 'Workshops',
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
        formname: data.formname || '',
        formdescription: data.formdescription || '',
        embedcode: data.embedcode || '',
        formtype: data.formtype || 'Workshops',
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

    if (!formData.formname.trim()) {
      setError('Form name is required');
      return;
    }
    if (!formData.embedcode.trim()) {
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

      {loading && !formData.formname && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading form...</p>
        </div>
      )}

      {(!loading || formData.formname) && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="formname">Form Name <span className="required">*</span></label>
            <input
              type="text"
              id="formname"
              name="formname"
              className="form-control"
              value={formData.formname}
              onChange={handleInputChange}
              placeholder="Enter form name"
              maxLength="255"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="formdescription">Description</label>
            <textarea
              id="formdescription"
              name="formdescription"
              className="form-control"
              value={formData.formdescription}
              onChange={handleInputChange}
              placeholder="Enter form description (optional)"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="formtype">Form Location <span className="required">*</span></label>
            <select
              id="formtype"
              name="formtype"
              className="form-control"
              value={formData.formtype}
              onChange={handleInputChange}
            >
              <option value="Workshops">Workshops Page</option>
              <option value="Registration">Registration Page</option>
            </select>
            <small className="form-help">Where this form will be displayed</small>
          </div>

          <div className="form-group">
            <label htmlFor="embedcode">Embed Code <span className="required">*</span></label>
            <textarea
              id="embedcode"
              name="embedcode"
              className="form-control"
              value={formData.embedcode}
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
