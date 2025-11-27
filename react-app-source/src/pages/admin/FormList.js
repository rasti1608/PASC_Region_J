import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { formsService } from '../../services/admin-api';

function FormList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentLocation, setCurrentLocation] = useState(searchParams.get('location') || 'Workshops');

  // Tab counts
  const [workshopsCount, setWorkshopsCount] = useState(0);
  const [registrationCount, setRegistrationCount] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadForms();
    loadTabCounts();
  }, [currentLocation]);

  useEffect(() => {
    applyFilters();
  }, [forms, searchQuery, statusFilter]);

  const loadForms = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await formsService.getAll(currentLocation);
      setForms(response.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load forms');
      setLoading(false);
      console.error('Error loading forms:', err);
    }
  };

  const loadTabCounts = async () => {
    try {
      const [workshopsRes, registrationRes] = await Promise.all([
        formsService.getAll('Workshops'),
        formsService.getAll('Registration')
      ]);
      setWorkshopsCount((workshopsRes.data || []).length);
      setRegistrationCount((registrationRes.data || []).length);
    } catch (err) {
      console.error('Error loading tab counts:', err);
    }
  };

  const switchTab = (location) => {
    setCurrentLocation(location);
    setCurrentPage(1);
    setSearchQuery('');
    setStatusFilter('all');
    setSearchParams({ location });
  };

  const applyFilters = () => {
    let filtered = [...forms];

    // Apply status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(f => f.is_active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(f => !f.is_active);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.form_name?.toLowerCase().includes(query) ||
        f.form_description?.toLowerCase().includes(query)
      );
    }

    setFilteredForms(filtered);
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
    navigate('/admin/forms/add', { state: { location: currentLocation } });
  };

  const edit = (id) => {
    navigate(`/admin/forms/edit/${id}`, { state: { location: currentLocation } });
  };

  const toggleActive = async (form) => {
    try {
      const response = await formsService.toggleActive(form.id);
      const updated = response.data;

      // Smooth single-row update instead of reloading entire list
      setForms(prev => prev.map(f =>
        f.id === form.id ? { ...f, ...updated } : f
      ));
    } catch (err) {
      setError('Failed to toggle status');
      console.error('Error toggling status:', err);
    }
  };

  const deleteForm = (form) => {
    navigate(`/admin/forms/delete/${form.id}`);
  };

  const updateDisplayOrder = async (form, newOrder) => {
    try {
      await formsService.updateOrder(form.id, parseInt(newOrder), currentLocation);
      loadForms(); // Reload to get updated order
      loadTabCounts(); // Update tab counts
    } catch (err) {
      setError('Failed to update order');
      console.error('Error updating order:', err);
    }
  };

  // Pagination helpers
  const getPaginatedForms = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredForms.slice(startIndex, endIndex);
  };

  const getTotalPages = () => Math.max(1, Math.ceil(filteredForms.length / itemsPerPage));

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
    if (filteredForms.length === 0) return 0;
    return (currentPage - 1) * itemsPerPage + 1;
  };

  const getPageEnd = () => {
    const end = currentPage * itemsPerPage;
    return Math.min(end, filteredForms.length);
  };

  const goToPage = (page) => setCurrentPage(page);
  const previousPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const nextPage = () => { if (currentPage < getTotalPages()) setCurrentPage(p => p + 1); };

  return (
    <>
      {/* Content Header */}
      <div className="content-header">
        <h1>Forms Management</h1>
        <p>Manage Google Forms for workshops and registration</p>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs">
        <button
          className={`tab ${currentLocation === 'Workshops' ? 'active' : ''}`}
          onClick={() => switchTab('Workshops')}
        >
          Workshops
          <span className="tab-badge">{workshopsCount}</span>
        </button>
        <button
          className={`tab ${currentLocation === 'Registration' ? 'active' : ''}`}
          onClick={() => switchTab('Registration')}
        >
          Registration
          <span className="tab-badge">{registrationCount}</span>
        </button>
      </div>

      <div className="section">
        {/* Section Header with Add Button */}
        <div className="section-header">
          <h2>{currentLocation} Forms ({forms.length})</h2>
          <button className="btn btn-primary" onClick={addNew}>
            + Add New Form
          </button>
        </div>

        {/* Search and Filter */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by form name or description..."
            value={searchQuery}
            onChange={onSearch}
          />

          <select className="status-filter" value={statusFilter} onChange={onStatusFilterChange}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {(searchQuery || statusFilter !== 'all') && (
            <span className="search-results">
              {filteredForms.length} result{filteredForms.length !== 1 ? 's' : ''} found
            </span>
          )}
        </div>

        {/* Error Message */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading forms...</p>
          </div>
        )}

        {/* Pagination Info (Top) */}
        {!loading && filteredForms.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {getPageStart()}-{getPageEnd()} of {filteredForms.length} total
            </div>
            <div className="pagination-controls">
              <button className="pagination-btn" onClick={previousPage} disabled={currentPage === 1}>
                « Previous
              </button>

              {getPageNumbers()[0] > 1 && (
                <button className="pagination-btn" onClick={() => goToPage(1)}>1</button>
              )}
              {getPageNumbers()[0] > 2 && (
                <span style={{ padding: '0 8px', color: '#666' }}>...</span>
              )}

              {getPageNumbers().map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                  disabled={page === currentPage && getTotalPages() === 1}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}

              {getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1 && (
                <span style={{ padding: '0 8px', color: '#666' }}>...</span>
              )}
              {getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() && (
                <button className="pagination-btn" onClick={() => goToPage(getTotalPages())}>
                  {getTotalPages()}
                </button>
              )}

              <button className="pagination-btn" onClick={nextPage} disabled={currentPage === getTotalPages()}>
                Next »
              </button>
            </div>
          </div>
        )}

        {/* Forms Table */}
        {!loading && (
          <div className="table-container">
            <table className="data-table" id="forms-table">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Order</th>
                  <th style={{ width: '55%' }}>Form Details</th>
                  <th style={{ width: '15%' }}>Status</th>
                  <th style={{ width: '20%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Empty State */}
                {filteredForms.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <div className="empty-state">
                        {searchQuery || statusFilter !== 'all' ? (
                          <p>No forms match your filters</p>
                        ) : (
                          <>
                            <p>No {currentLocation.toLowerCase()} forms found.</p>
                            <button className="btn btn-primary btn-sm" onClick={addNew}>
                              Create Your First Form
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Data Rows */}
                {getPaginatedForms().map(form => (
                  <tr key={form.id}>
                    {/* Display Order Dropdown */}
                    <td data-label="ORDER" className="text-center">
                      <select
                        className="order-select"
                        value={form.display_order || 1}
                        onChange={(e) => updateDisplayOrder(form, e.target.value)}
                      >
                        {Array.from({ length: forms.length }, (_, idx) => (
                          <option key={idx + 1} value={idx + 1}>
                            {idx + 1}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Form Name and Description */}
                    <td data-label="FORM DETAILS">
                      <strong>{form.form_name}</strong>
                      {form.form_description && (
                        <>
                          <br />
                          <small className="text-muted">
                            {form.form_description.length > 100
                              ? form.form_description.substring(0, 100) + '...'
                              : form.form_description}
                          </small>
                        </>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td data-label="STATUS">
                      {form.is_active ? (
                        <span className="badge badge-success">✓ Active</span>
                      ) : (
                        <span className="badge badge-inactive">Inactive</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td data-label="ACTIONS" className="actions">
                      <button className="btn btn-sm btn-edit" onClick={() => edit(form.id)} title="Edit">
                        ✏️
                      </button>
                      <button className="btn btn-sm btn-toggle" onClick={() => toggleActive(form)} title="Toggle Active/Inactive">
                        {form.is_active ? '👁️' : '🚫'}
                      </button>
                      <button className="btn btn-sm btn-delete" onClick={() => deleteForm(form)} title="Delete">
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
        {!loading && filteredForms.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {getPageStart()}-{getPageEnd()} of {filteredForms.length} total
            </div>
            <div className="pagination-controls">
              <button className="pagination-btn" onClick={previousPage} disabled={currentPage === 1}>
                « Previous
              </button>

              {getPageNumbers()[0] > 1 && (
                <button className="pagination-btn" onClick={() => goToPage(1)}>1</button>
              )}
              {getPageNumbers()[0] > 2 && (
                <span style={{ padding: '0 8px', color: '#666' }}>...</span>
              )}

              {getPageNumbers().map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                  disabled={page === currentPage && getTotalPages() === 1}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}

              {getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1 && (
                <span style={{ padding: '0 8px', color: '#666' }}>...</span>
              )}
              {getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() && (
                <button className="pagination-btn" onClick={() => goToPage(getTotalPages())}>
                  {getTotalPages()}
                </button>
              )}

              <button className="pagination-btn" onClick={nextPage} disabled={currentPage === getTotalPages()}>
                Next »
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FormList;
