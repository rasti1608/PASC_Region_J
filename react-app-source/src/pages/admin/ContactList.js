import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contactsService } from '../../services/admin-api';

function ContactList() {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Status counts
  const [statusCounts, setStatusCounts] = useState({
    new: 0,
    read: 0,
    replied: 0,
    archived: 0
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [modalFormData, setModalFormData] = useState({ status: '', admin_notes: '' });

  useEffect(() => {
    loadSubmissions();
    loadStatusCounts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [submissions, searchQuery, statusFilter]);

  const loadSubmissions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await contactsService.getAll();
      setSubmissions(response.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load contact submissions');
      setLoading(false);
      console.error('Error loading submissions:', err);
    }
  };

  const loadStatusCounts = async () => {
    try {
      const response = await contactsService.getStatusCounts();
      setStatusCounts(response.data || { new: 0, read: 0, replied: 0, archived: 0 });
    } catch (err) {
      console.error('Error loading status counts:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...submissions];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sub =>
        sub.name?.toLowerCase().includes(query) ||
        sub.email?.toLowerCase().includes(query) ||
        sub.subject?.toLowerCase().includes(query) ||
        sub.message?.toLowerCase().includes(query)
      );
    }

    setFilteredSubmissions(filtered);
  };

  const onSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const onStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Modal methods
  const viewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setModalFormData({
      status: submission.status,
      admin_notes: submission.admin_notes || ''
    });
    setShowModal(true);
    setModalError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
    setModalError(null);
  };

  const updateStatus = async () => {
    if (!selectedSubmission) return;

    setModalLoading(true);
    setModalError(null);

    try {
      const response = await contactsService.updateStatus(selectedSubmission.id, modalFormData.status);
      const updatedSubmission = response.data;

      setSubmissions(prev => prev.map(s =>
        s.id === updatedSubmission.id ? updatedSubmission : s
      ));
      setSelectedSubmission(updatedSubmission);
      setModalFormData(prev => ({ ...prev, status: updatedSubmission.status }));
      setModalLoading(false);
      loadStatusCounts();
    } catch (err) {
      setModalError(err.message || 'Failed to update status');
      setModalLoading(false);
    }
  };

  const saveAdminNotes = async () => {
    if (!selectedSubmission) return;

    setModalLoading(true);
    setModalError(null);

    try {
      const response = await contactsService.updateAdminNotes(selectedSubmission.id, modalFormData.admin_notes);
      const updatedSubmission = response.data;

      setSubmissions(prev => prev.map(s =>
        s.id === updatedSubmission.id ? updatedSubmission : s
      ));
      setSelectedSubmission(updatedSubmission);
      setModalFormData(prev => ({ ...prev, admin_notes: updatedSubmission.admin_notes || '' }));
      setModalLoading(false);
    } catch (err) {
      setModalError(err.message || 'Failed to save admin notes');
      setModalLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => `badge badge-${status}`;

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: '', time: '' };
    const dt = new Date(dateTimeString);
    const date = dt.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const time = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return { date, time };
  };

  const getMessagePreview = (message) => {
    const maxLength = 100;
    if (!message) return '';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  // Pagination helpers
  const getPaginatedSubmissions = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSubmissions.slice(startIndex, endIndex);
  };

  const getTotalPages = () => Math.max(1, Math.ceil(filteredSubmissions.length / itemsPerPage));

  const getPageNumbers = () => {
    const totalPages = getTotalPages();
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const getPageStart = () => {
    if (filteredSubmissions.length === 0) return 0;
    return (currentPage - 1) * itemsPerPage + 1;
  };

  const getPageEnd = () => {
    const end = currentPage * itemsPerPage;
    return Math.min(end, filteredSubmissions.length);
  };

  const goToPage = (page) => setCurrentPage(page);
  const previousPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const nextPage = () => { if (currentPage < getTotalPages()) setCurrentPage(p => p + 1); };

  return (
    <>
      <div className="content-header">
        <h1>Contact Submissions</h1>
        <p>View and manage contact form submissions</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading submissions...</p>
        </div>
      )}

      {/* Error State */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* Stats Summary */}
          <div className="stats-summary">
            <div className="stat-box stat-new">
              <div className="stat-value">{statusCounts.new}</div>
              <div className="stat-label">New</div>
            </div>
            <div className="stat-box stat-read">
              <div className="stat-value">{statusCounts.read}</div>
              <div className="stat-label">Read</div>
            </div>
            <div className="stat-box stat-replied">
              <div className="stat-value">{statusCounts.replied}</div>
              <div className="stat-label">Replied</div>
            </div>
            <div className="stat-box stat-archived">
              <div className="stat-value">{statusCounts.archived}</div>
              <div className="stat-label">Archived</div>
            </div>
          </div>

          <div className="section">
            {/* Section Header with Email Settings Button */}
            <div className="section-header">
              <h2>All Submissions ({filteredSubmissions.length})</h2>
              <Link to="/admin/contacts/email-settings" className="btn btn-primary">
                ⚙️ Email Settings
              </Link>
            </div>

            {/* Search and Filter Controls */}
            <div className="search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={onSearch}
                placeholder="Search by name, email, subject, or message..."
                className="search-input"
              />
              <select
                value={statusFilter}
                onChange={onStatusFilterChange}
                className="status-filter"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
              {searchQuery && (
                <span className="search-results">
                  {filteredSubmissions.length} result{filteredSubmissions.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>

            {/* No Results Message */}
            {filteredSubmissions.length === 0 && (
              <div className="empty-state">
                <p>No contact submissions found matching your criteria.</p>
              </div>
            )}

            {/* Pagination (Top) */}
            {filteredSubmissions.length > 0 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Showing {getPageStart()}-{getPageEnd()} of {filteredSubmissions.length} total
                </div>
                <div className="pagination-controls">
                  <button className="pagination-btn" onClick={previousPage} disabled={currentPage === 1}>
                    « Previous
                  </button>

                  {getPageNumbers().map(page => (
                    <button
                      key={page}
                      className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button className="pagination-btn" onClick={nextPage} disabled={currentPage === getTotalPages()}>
                    Next »
                  </button>
                </div>
              </div>
            )}

            {/* Submissions Table */}
            {filteredSubmissions.length > 0 && (
              <div className="table-container">
                <table className="data-table contact-submissions-table">
                  <thead>
                    <tr>
                      <th style={{ width: '10%' }}>Status</th>
                      <th style={{ width: '12%' }}>Date & Time</th>
                      <th style={{ width: '15%' }}>Name</th>
                      <th style={{ width: '18%' }}>Email</th>
                      <th style={{ width: '15%' }}>Subject</th>
                      <th style={{ width: '22%' }}>Preview</th>
                      <th style={{ width: '8%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPaginatedSubmissions().map(submission => (
                      <tr key={submission.id}>
                        <td data-label="STATUS">
                          <span className={getStatusBadgeClass(submission.status)}>
                            {submission.status?.toUpperCase()}
                          </span>
                        </td>
                        <td data-label="DATE & TIME" className="datetime-cell">
                          <div className="date">{formatDateTime(submission.submitted_at).date}</div>
                          <div className="time">{formatDateTime(submission.submitted_at).time}</div>
                        </td>
                        <td data-label="NAME">{submission.name}</td>
                        <td data-label="EMAIL">
                          <a href={`mailto:${submission.email}`} className="email-link">{submission.email}</a>
                        </td>
                        <td data-label="SUBJECT">{submission.subject}</td>
                        <td data-label="PREVIEW" className="message-preview">
                          {getMessagePreview(submission.message)}
                        </td>
                        <td data-label="ACTIONS" className="actions">
                          <button
                            className="btn btn-sm btn-edit"
                            title="Edit Details"
                            onClick={() => viewSubmission(submission)}
                          >
                            ✏️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination (Bottom) */}
            {filteredSubmissions.length > 0 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Showing {getPageStart()}-{getPageEnd()} of {filteredSubmissions.length} total
                </div>
                <div className="pagination-controls">
                  <button className="pagination-btn" onClick={previousPage} disabled={currentPage === 1}>
                    « Previous
                  </button>

                  {getPageNumbers().map(page => (
                    <button
                      key={page}
                      className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button className="pagination-btn" onClick={nextPage} disabled={currentPage === getTotalPages()}>
                    Next »
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal for Viewing Submission Details */}
      {showModal && selectedSubmission && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Submission Details</h2>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>

            {modalError && <div className="alert alert-error">{modalError}</div>}

            <div className="modal-body">
              {/* Submission Information */}
              <div className="info-section">
                <h3>Submission Information</h3>
                <div className="info-row">
                  <label>Submitted:</label>
                  <span>{formatDateTime(selectedSubmission.submitted_at).date} at {formatDateTime(selectedSubmission.submitted_at).time}</span>
                </div>
                <div className="info-row">
                  <label>IP Address:</label>
                  <span>{selectedSubmission.ip_address}</span>
                </div>
                <div className="info-row">
                  <label>Current Status:</label>
                  <span className={getStatusBadgeClass(selectedSubmission.status)}>
                    {selectedSubmission.status?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="info-section">
                <h3>Contact Information</h3>
                <div className="info-row">
                  <label>Name:</label>
                  <span>{selectedSubmission.name}</span>
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <span><a href={`mailto:${selectedSubmission.email}`}>{selectedSubmission.email}</a></span>
                </div>
                <div className="info-row">
                  <label>Subject:</label>
                  <span>{selectedSubmission.subject}</span>
                </div>
              </div>

              {/* Message */}
              <div className="info-section">
                <h3>Message</h3>
                <div className="message-full">{selectedSubmission.message}</div>
              </div>

              {/* Status Update */}
              <div className="info-section">
                <h3>Update Status</h3>
                <div className="form-group inline-form">
                  <label htmlFor="statusSelect">Status:</label>
                  <select
                    id="statusSelect"
                    value={modalFormData.status}
                    onChange={(e) => setModalFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="form-control"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button
                    className="btn btn-primary"
                    onClick={updateStatus}
                    disabled={modalLoading || modalFormData.status === selectedSubmission.status}
                  >
                    {modalLoading ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="info-section">
                <h3>Admin Notes</h3>
                <div className="form-group">
                  <textarea
                    value={modalFormData.admin_notes}
                    onChange={(e) => setModalFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
                    className="form-control admin-notes-textarea"
                    rows="5"
                    placeholder="Add internal notes about this submission..."
                  />
                  <button
                    className="btn btn-primary"
                    onClick={saveAdminNotes}
                    disabled={modalLoading}
                  >
                    {modalLoading ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ContactList;
