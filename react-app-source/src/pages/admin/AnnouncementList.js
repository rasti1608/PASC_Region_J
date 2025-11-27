import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { announcementsService } from '../../services/admin-api';

function AnnouncementList() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadAnnouncements();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [announcements, searchQuery, statusFilter]);

  const loadAnnouncements = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await announcementsService.getAll();
      const data = response.data || [];
      setAnnouncements(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load announcements');
      setLoading(false);
      console.error('Error loading announcements:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...announcements];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.computed_status === statusFilter);
    }

    // Apply search filter (case-insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title?.toLowerCase().includes(query) ||
        a.content?.toLowerCase().includes(query)
      );
    }

    setFilteredAnnouncements(filtered);
  };

  const onSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const onStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const addNew = () => {
    navigate('/admin/announcements/add');
  };

  const edit = (id) => {
    navigate(`/admin/announcements/edit/${id}`);
  };

  const toggleActive = async (announcement) => {
    try {
      const response = await announcementsService.toggleActive(announcement.id);
      const updated = response.data;

      setAnnouncements(prev => prev.map(a =>
        a.id === announcement.id
          ? { ...updated, computed_status: computeStatus(updated) }
          : a
      ));
    } catch (err) {
      setError('Failed to toggle status');
      console.error('Error toggling status:', err);
    }
  };

  const computeStatus = (announcement) => {
    if (!announcement.is_active) return 'inactive';

    const now = new Date();
    const startDate = new Date(announcement.publish_start);
    const endDate = announcement.publish_end ? new Date(announcement.publish_end) : null;

    if (startDate > now) return 'future';
    if (endDate && endDate < now) return 'expired';
    return 'live';
  };

  const deleteAnnouncement = (announcement) => {
    navigate(`/admin/announcements/delete/${announcement.id}`);
  };

  const updateDisplayOrder = async (announcement, newOrder) => {
    try {
      await announcementsService.updateOrder(announcement.id, parseInt(newOrder));
      loadAnnouncements();
    } catch (err) {
      setError('Failed to update order');
      console.error('Error updating order:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No end date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Pagination helpers
  const getPaginatedAnnouncements = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAnnouncements.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.max(1, Math.ceil(filteredAnnouncements.length / itemsPerPage));
  };

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
    if (filteredAnnouncements.length === 0) return 0;
    return (currentPage - 1) * itemsPerPage + 1;
  };

  const getPageEnd = () => {
    const end = currentPage * itemsPerPage;
    return Math.min(end, filteredAnnouncements.length);
  };

  return (
    <>
      {/* Content Header */}
      <div className="content-header">
        <h1>Manage Announcements</h1>
        <p>Create and manage homepage announcements</p>
      </div>

      <div className="section">
        {/* Section Header with Add Button */}
        <div className="section-header">
          <h2>All Announcements ({announcements.length})</h2>
          <button className="btn btn-primary" onClick={addNew}>
            + Add New Announcement
          </button>
        </div>

        {/* Search and Filter */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or content..."
            value={searchQuery}
            onChange={onSearch}
          />

          <select className="status-filter" value={statusFilter} onChange={onStatusFilterChange}>
            <option value="all">All Statuses</option>
            <option value="inactive">Inactive</option>
            <option value="live">Live</option>
            <option value="future">Future</option>
            <option value="expired">Expired</option>
          </select>

          <span className="search-results">
            Showing {filteredAnnouncements.length} of {announcements.length} total
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading announcements...</p>
          </div>
        )}

        {/* Pagination Info (Top) */}
        {!loading && filteredAnnouncements.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {getPageStart()}-{getPageEnd()} of {filteredAnnouncements.length} total
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
              >
                « Previous
              </button>

              {getPageNumbers()[0] > 1 && (
                <button className="pagination-btn" onClick={() => setCurrentPage(1)}>1</button>
              )}
              {getPageNumbers()[0] > 2 && <span style={{ padding: '0 8px', color: '#666' }}>...</span>}

              {getPageNumbers().map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                  disabled={page === currentPage && getTotalPages() === 1}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              {getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1 && (
                <span style={{ padding: '0 8px', color: '#666' }}>...</span>
              )}
              {getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() && (
                <button className="pagination-btn" onClick={() => setCurrentPage(getTotalPages())}>
                  {getTotalPages()}
                </button>
              )}

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

        {/* Announcements Table */}
        {!loading && (
          <div className="table-container">
            <table className="data-table" id="announcements-table">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Order</th>
                  <th style={{ width: '45%' }}>Title</th>
                  <th style={{ width: '15%' }}>Status</th>
                  <th style={{ width: '15%' }}>Publish Date</th>
                  <th style={{ width: '15%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Empty State */}
                {filteredAnnouncements.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <div className="empty-state">
                        <p>{searchQuery || statusFilter !== 'all' ? 'No announcements match your filters' : 'No announcements yet'}</p>
                        {!searchQuery && statusFilter === 'all' && (
                          <button className="btn btn-primary btn-sm" onClick={addNew}>
                            Create First Announcement
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Data Rows */}
                {getPaginatedAnnouncements().map(announcement => (
                  <tr key={announcement.id}>
                    {/* Display Order Dropdown */}
                    <td>
                      <select
                        className="order-select"
                        value={announcement.display_order || 1}
                        onChange={(e) => updateDisplayOrder(announcement, e.target.value)}
                      >
                        {Array.from({ length: announcements.length }, (_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </td>

                    {/* Title with Content Preview */}
                    <td data-label="TITLE">
                      <strong>{announcement.title}</strong>
                      {announcement.is_featured ? (
                        <span className="badge" style={{ background: '#fff9c4', color: '#f57f17', fontSize: '0.75rem', marginLeft: '8px' }}>⭐ Featured</span>
                      ) : null}
                      <br />
                      <small className="text-muted">
                        {announcement.content?.length > 100
                          ? announcement.content.substring(0, 100) + '...'
                          : announcement.content}
                      </small>
                    </td>

                    {/* Status Badge */}
                    <td data-label="STATUS" className="col-status">
                      {announcement.computed_status === 'inactive' && (
                        <span className="badge badge-inactive">Inactive</span>
                      )}
                      {announcement.computed_status === 'expired' && (
                        <span className="badge" style={{ background: '#ffebee', color: '#c62828' }}>Expired</span>
                      )}
                      {announcement.computed_status === 'future' && (
                        <span className="badge" style={{ background: '#e3f2fd', color: '#1565c0' }}>📅 Future</span>
                      )}
                      {announcement.computed_status === 'live' && (
                        <span className="badge badge-success">✓ Live</span>
                      )}
                    </td>

                    {/* Publish Dates */}
                    <td data-label="PUBLISH DATE">
                      {formatDate(announcement.publish_start)}
                      {announcement.publish_end && (
                        <>
                          <br />
                          <small className="text-muted">
                            to {formatDate(announcement.publish_end)}
                          </small>
                        </>
                      )}
                    </td>

                    {/* Actions */}
                    <td data-label="ACTIONS" className="actions">
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => edit(announcement.id)}
                        title="Edit"
                      >
                        ✏️
                      </button>

                      <button
                        className="btn btn-sm btn-toggle"
                        onClick={() => toggleActive(announcement)}
                        title="Toggle Active/Inactive"
                      >
                        {announcement.is_active ? '👁️' : '🚫'}
                      </button>

                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => deleteAnnouncement(announcement)}
                        title="Delete"
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

        {/* Pagination (Bottom) */}
        {!loading && filteredAnnouncements.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {getPageStart()}-{getPageEnd()} of {filteredAnnouncements.length} total
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
              >
                « Previous
              </button>

              {getPageNumbers()[0] > 1 && (
                <button className="pagination-btn" onClick={() => setCurrentPage(1)}>1</button>
              )}
              {getPageNumbers()[0] > 2 && <span style={{ padding: '0 8px', color: '#666' }}>...</span>}

              {getPageNumbers().map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                  disabled={page === currentPage && getTotalPages() === 1}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              {getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1 && (
                <span style={{ padding: '0 8px', color: '#666' }}>...</span>
              )}
              {getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() && (
                <button className="pagination-btn" onClick={() => setCurrentPage(getTotalPages())}>
                  {getTotalPages()}
                </button>
              )}

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
    </>
  );
}

export default AnnouncementList;
