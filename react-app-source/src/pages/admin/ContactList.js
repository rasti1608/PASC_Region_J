import React, { useState, useEffect } from 'react';
import { contactsService } from '../../services/admin-api';

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contacts, searchQuery, statusFilter]);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await contactsService.getAll();
      setContacts(response.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      setLoading(false);
      console.error('Error loading contacts:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...contacts];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.subject?.toLowerCase().includes(query)
      );
    }

    setFilteredContacts(filtered);
  };

  const onSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const onStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const updateStatus = async (contact, newStatus) => {
    try {
      await contactsService.updateStatus(contact.id, newStatus);
      loadContacts();
    } catch (err) {
      setError('Failed to update status');
      console.error('Error updating status:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="badge" style={{ background: '#e3f2fd', color: '#1565c0' }}>New</span>;
      case 'in_progress':
        return <span className="badge" style={{ background: '#fff3e0', color: '#ef6c00' }}>In Progress</span>;
      case 'resolved':
        return <span className="badge badge-success">Resolved</span>;
      default:
        return <span className="badge badge-inactive">{status}</span>;
    }
  };

  const getPaginatedContacts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredContacts.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = () => Math.max(1, Math.ceil(filteredContacts.length / itemsPerPage));

  return (
    <>
      <div className="content-header">
        <h1>Contact Submissions</h1>
        <p>View and manage contact form submissions</p>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>All Submissions ({contacts.length})</h2>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or subject..."
            value={searchQuery}
            onChange={onSearch}
          />

          <select className="status-filter" value={statusFilter} onChange={onStatusFilterChange}>
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <span className="search-results">
            Showing {filteredContacts.length} of {contacts.length} total
          </span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading contacts...</p>
          </div>
        )}

        {!loading && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Name</th>
                  <th style={{ width: '20%' }}>Email</th>
                  <th style={{ width: '20%' }}>Subject</th>
                  <th style={{ width: '15%' }}>Date</th>
                  <th style={{ width: '10%' }}>Status</th>
                  <th style={{ width: '15%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <div className="empty-state">
                        <p>{searchQuery || statusFilter !== 'all' ? 'No contacts match your filters' : 'No contact submissions yet'}</p>
                      </div>
                    </td>
                  </tr>
                )}

                {getPaginatedContacts().map(contact => (
                  <tr key={contact.id}>
                    <td data-label="NAME"><strong>{contact.name}</strong></td>
                    <td data-label="EMAIL">
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </td>
                    <td data-label="SUBJECT">{contact.subject}</td>
                    <td data-label="DATE">{formatDate(contact.created_at)}</td>
                    <td data-label="STATUS">{getStatusBadge(contact.status)}</td>
                    <td data-label="ACTIONS" className="actions">
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => setSelectedContact(contact)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <select
                        className="status-select"
                        value={contact.status}
                        onChange={(e) => updateStatus(contact, e.target.value)}
                        style={{ fontSize: '0.8rem', padding: '4px' }}
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredContacts.length > itemsPerPage && (
          <div className="pagination-container">
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
              >
                « Previous
              </button>
              <span style={{ padding: '0 16px' }}>Page {currentPage} of {getTotalPages()}</span>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === getTotalPages()}
              >
                Next »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="modal-overlay" onClick={() => setSelectedContact(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Contact Details</h3>
              <button className="modal-close" onClick={() => setSelectedContact(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Name:</strong> {selectedContact.name}
              </div>
              <div className="detail-row">
                <strong>Email:</strong> <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
              </div>
              <div className="detail-row">
                <strong>Subject:</strong> {selectedContact.subject}
              </div>
              <div className="detail-row">
                <strong>Date:</strong> {formatDate(selectedContact.created_at)}
              </div>
              <div className="detail-row">
                <strong>Status:</strong> {getStatusBadge(selectedContact.status)}
              </div>
              <div className="detail-row">
                <strong>Message:</strong>
                <p style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{selectedContact.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ContactList;
