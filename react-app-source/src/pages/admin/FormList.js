import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formsService } from '../../services/admin-api';

function FormList() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [forms, searchQuery, locationFilter]);

  const loadForms = async () => {
    setLoading(true);
    setError(null);

    try {
      const [workshopsRes, registrationRes] = await Promise.all([
        formsService.getAll('Workshops'),
        formsService.getAll('Registration')
      ]);

      const workshopForms = (workshopsRes.data || []).map(f => ({ ...f, formtype: 'Workshops' }));
      const registrationForms = (registrationRes.data || []).map(f => ({ ...f, formtype: 'Registration' }));

      const allForms = [...workshopForms, ...registrationForms];
      setForms(allForms);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load forms');
      setLoading(false);
      console.error('Error loading forms:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...forms];

    // Apply location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(f => f.formtype === locationFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.formname?.toLowerCase().includes(query) ||
        f.formdescription?.toLowerCase().includes(query)
      );
    }

    setFilteredForms(filtered);
  };

  const onSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const onLocationFilterChange = (e) => {
    setLocationFilter(e.target.value);
    setCurrentPage(1);
  };

  const addNew = () => {
    navigate('/admin/forms/add');
  };

  const edit = (id) => {
    navigate(`/admin/forms/edit/${id}`);
  };

  const toggleActive = async (form) => {
    try {
      await formsService.toggleActive(form.id);
      loadForms();
    } catch (err) {
      setError('Failed to toggle status');
      console.error('Error toggling status:', err);
    }
  };

  const deleteForm = (form) => {
    navigate(`/admin/forms/delete/${form.id}`);
  };

  // Pagination helpers
  const getPaginatedForms = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredForms.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.max(1, Math.ceil(filteredForms.length / itemsPerPage));
  };

  const getPageStart = () => {
    if (filteredForms.length === 0) return 0;
    return (currentPage - 1) * itemsPerPage + 1;
  };

  const getPageEnd = () => {
    const end = currentPage * itemsPerPage;
    return Math.min(end, filteredForms.length);
  };

  return (
    <>
      {/* Content Header */}
      <div className="content-header">
        <h1>Manage Forms</h1>
        <p>Create and manage registration and workshop forms</p>
      </div>

      <div className="section">
        {/* Section Header */}
        <div className="section-header">
          <h2>All Forms ({forms.length})</h2>
          <button className="btn btn-primary" onClick={addNew}>
            + Add New Form
          </button>
        </div>

        {/* Search and Filter */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={onSearch}
          />

          <select className="status-filter" value={locationFilter} onChange={onLocationFilterChange}>
            <option value="all">All Locations</option>
            <option value="Workshops">Workshops</option>
            <option value="Registration">Registration</option>
          </select>

          <span className="search-results">
            Showing {filteredForms.length} of {forms.length} total
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading forms...</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredForms.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {getPageStart()}-{getPageEnd()} of {filteredForms.length} total
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
              >
                « Previous
              </button>
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

        {/* Forms Table */}
        {!loading && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Form Name</th>
                  <th style={{ width: '20%' }}>Location</th>
                  <th style={{ width: '15%' }}>Status</th>
                  <th style={{ width: '15%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredForms.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <div className="empty-state">
                        <p>{searchQuery || locationFilter !== 'all' ? 'No forms match your filters' : 'No forms yet'}</p>
                        {!searchQuery && locationFilter === 'all' && (
                          <button className="btn btn-primary btn-sm" onClick={addNew}>
                            Create First Form
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {getPaginatedForms().map(form => (
                  <tr key={form.id}>
                    <td data-label="FORM NAME">
                      <strong>{form.formname}</strong>
                      {form.formdescription && (
                        <>
                          <br />
                          <small className="text-muted">{form.formdescription}</small>
                        </>
                      )}
                    </td>
                    <td data-label="LOCATION">
                      <span className="badge" style={{
                        background: form.formtype === 'Workshops' ? '#e3f2fd' : '#f3e5f5',
                        color: form.formtype === 'Workshops' ? '#1565c0' : '#7b1fa2'
                      }}>
                        {form.formtype}
                      </span>
                    </td>
                    <td data-label="STATUS">
                      {form.is_active ? (
                        <span className="badge badge-success">✓ Active</span>
                      ) : (
                        <span className="badge badge-inactive">Inactive</span>
                      )}
                    </td>
                    <td data-label="ACTIONS" className="actions">
                      <button className="btn btn-sm btn-edit" onClick={() => edit(form.id)} title="Edit">✏️</button>
                      <button className="btn btn-sm btn-toggle" onClick={() => toggleActive(form)} title="Toggle">
                        {form.is_active ? '👁️' : '🚫'}
                      </button>
                      <button className="btn btn-sm btn-delete" onClick={() => deleteForm(form)} title="Delete">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default FormList;
