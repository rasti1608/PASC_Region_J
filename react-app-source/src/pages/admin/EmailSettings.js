import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contactsService } from '../../services/admin-api';

function EmailSettings() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [recipients, setRecipients] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [addingRecipient, setAddingRecipient] = useState(false);

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await contactsService.getEmailRecipients();
      if (response.success) {
        setRecipients(response.data || []);
      } else {
        setError(response.message || 'Failed to load recipients');
      }
      setLoading(false);
    } catch (err) {
      setError('Error loading recipients. Please try again.');
      setLoading(false);
      console.error('Error loading recipients:', err);
    }
  };

  const addRecipient = async () => {
    if (!newEmail || !newEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setAddingRecipient(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('email', newEmail.trim());

      const response = await contactsService.addEmailRecipient(formData);
      setAddingRecipient(false);

      if (response.success) {
        setRecipients(response.data || []);
        setNewEmail('');
        setSuccess('Recipient added successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Failed to add recipient');
      }
    } catch (err) {
      setAddingRecipient(false);
      setError('Error adding recipient. Please try again.');
      console.error('Error adding recipient:', err);
    }
  };

  const toggleStatus = async (recipient) => {
    if (recipient.is_primary) {
      setError('Cannot deactivate the primary recipient');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id', recipient.id.toString());

      const response = await contactsService.toggleRecipientStatus(formData);

      if (response.success) {
        setRecipients(response.data || []);
        setSuccess('Recipient status updated successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Failed to update status');
      }
    } catch (err) {
      setError('Error updating status. Please try again.');
      console.error('Error updating status:', err);
    }
  };

  const deleteRecipient = async (recipient) => {
    if (recipient.is_primary) {
      setError('Cannot delete the primary recipient');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${recipient.email}?`)) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id', recipient.id.toString());

      const response = await contactsService.deleteEmailRecipient(formData);

      if (response.success) {
        setRecipients(response.data || []);
        setSuccess('Recipient deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Failed to delete recipient');
      }
    } catch (err) {
      setError('Error deleting recipient. Please try again.');
      console.error('Error deleting recipient:', err);
    }
  };

  const formatDate = (dateString) => {
    // Convert database timestamp to MM/DD/YYYY format
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const goBack = () => {
    navigate('/admin/contacts');
  };

  return (
    <>
      <div className="content-header">
        <h1>Email Settings</h1>
        <p>Configure email notifications for contact form submissions</p>
      </div>

      <div className="action-bar">
        <button className="btn btn-secondary" onClick={goBack}>
          ← Back to Contact Submissions
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <p>Loading email settings...</p>
        </div>
      )}

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Success Message */}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Main Content */}
      <div className="email-settings-container">
        {!loading && (
          <>
            {/* Info Box */}
            <div className="info-box">
              <div className="info-icon">ℹ️</div>
              <div className="info-content">
                <h3>How Email Notifications Work</h3>
                <p>
                  When someone submits a contact form, all <strong>active</strong> email recipients below will receive a notification.
                  The primary recipient cannot be deactivated or deleted.
                </p>
              </div>
            </div>

            {/* Add New Recipient Section */}
            <div className="section">
              <h2>Add New Recipient</h2>
              <div className="add-recipient-form">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="email-input"
                  disabled={addingRecipient}
                />
                <button
                  className="btn btn-primary"
                  onClick={addRecipient}
                  disabled={addingRecipient || !newEmail}
                >
                  {addingRecipient ? 'Adding...' : '+ Add Recipient'}
                </button>
              </div>
            </div>

            {/* Email Recipients Table */}
            <div className="section">
              <div className="section-header">
                <h2>Email Recipients ({recipients.length})</h2>
              </div>

              {recipients.length === 0 && (
                <div className="no-results">
                  <p>No email recipients configured yet.</p>
                </div>
              )}

              {recipients.length > 0 && (
                <div className="table-container">
                  <table className="data-table email-recipients-table">
                    <thead>
                      <tr>
                        <th>Email Address</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Added On</th>
                        <th className="actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipients.map(recipient => (
                        <tr key={recipient.id}>
                          <td>
                            <a href={`mailto:${recipient.email}`} className="email-link">{recipient.email}</a>
                          </td>
                          <td>
                            {recipient.is_primary ? (
                              <span className="badge badge-primary">Primary</span>
                            ) : (
                              <span className="badge badge-secondary">Secondary</span>
                            )}
                          </td>
                          <td>
                            <span className={recipient.is_active ? 'badge-active' : 'badge-inactive'}>
                              {recipient.is_active ? '✓ Active' : '✗ Inactive'}
                            </span>
                          </td>
                          <td>{formatDate(recipient.created_at)}</td>
                          <td className="actions">
                            <button
                              className="btn btn-sm btn-toggle"
                              title={recipient.is_active ? 'Deactivate' : 'Activate'}
                              onClick={() => toggleStatus(recipient)}
                              disabled={recipient.is_primary}
                            >
                              {recipient.is_active ? '🔕' : '🔔'}
                            </button>
                            <button
                              className="btn btn-sm btn-delete"
                              title="Delete"
                              onClick={() => deleteRecipient(recipient)}
                              disabled={recipient.is_primary}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default EmailSettings;
