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
    documenttype: 'General',
    is_active: true
  });

  const documentTypes = ['General', 'Conference Materials', 'Registration', 'Guidelines', 'Resources'];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
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
      setError('Please select a document to upload');
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
      uploadData.append('description', formData.description);
      uploadData.append('documenttype', formData.documenttype);
      uploadData.append('is_active', formData.is_active);

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
      <div className="content-header">
        <h1>Upload Document</h1>
        <p className="section-subtitle">Add a new downloadable document</p>
      </div>

      <div className="action-bar">
        <button className="btn btn-secondary" onClick={cancel}>
          ← Back to Documents
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file">Document File <span className="required">*</span></label>
          <input
            type="file"
            id="file"
            className="form-control"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            onChange={handleFileChange}
            required
          />
          <small className="form-help">Supported formats: PDF, Word, Excel, PowerPoint</small>
          {selectedFile && (
            <p className="file-selected">Selected: {selectedFile.name}</p>
          )}
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
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={cancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default DocumentUpload;
