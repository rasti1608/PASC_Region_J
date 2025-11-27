import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usersService } from '../../services/admin-api';

function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchQuery, statusFilter, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await usersService.getAll();
      setUsers(response.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load users');
      setLoading(false);
      console.error('Error loading users:', err);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await usersService.getRoles();
      setRoles(response.data || []);
    } catch (err) {
      console.error('Error loading roles:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Apply status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(user => user.is_active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(user => !user.is_active);
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role_id?.toString() === roleFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.username?.toLowerCase().includes(query) ||
        user.full_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  };

  const onSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const onStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const onRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const toggleUserActive = async (user) => {
    try {
      const response = await usersService.toggleActive(user.id);
      const updatedUser = response.data;

      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, ...updatedUser } : u
      ));
    } catch (err) {
      setError(err.message || 'Failed to update user status');
      setTimeout(() => setError(null), 5000);
    }
  };

  const getProfilePicturePath = (user) => {
    if (user.profile_picture) {
      return `/assets/img/profiles/${user.profile_picture}`;
    }
    return '';
  };

  const hasProfilePicture = (user) => !!user.profile_picture;

  const getStatusBadgeClass = (isActive) => {
    return isActive ? 'badge badge-success' : 'badge badge-inactive';
  };

  const isMasterAdmin = (user) => user.username === 'admin';

  // Pagination helpers
  const getPaginatedUsers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const getTotalPages = () => Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

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
    if (filteredUsers.length === 0) return 0;
    return (currentPage - 1) * itemsPerPage + 1;
  };

  const getPageEnd = () => {
    const end = currentPage * itemsPerPage;
    return Math.min(end, filteredUsers.length);
  };

  const goToPage = (page) => setCurrentPage(page);
  const previousPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const nextPage = () => { if (currentPage < getTotalPages()) setCurrentPage(p => p + 1); };

  return (
    <>
      <div className="content-header">
        <h1>User Management</h1>
        <p>Manage admin users and their roles</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {/* Main Content */}
      {!loading && (
        <div className="section">
          {/* Section Header with Add User Button */}
          <div className="section-header">
            <h2>Users ({filteredUsers.length})</h2>
            <Link to="/admin/users/add" className="btn btn-primary">+ Add New User</Link>
          </div>

          {/* Filters and Search */}
          <div className="filters-container">
            <div className="filter-group">
              <label htmlFor="statusFilter">Filter by Status:</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={onStatusFilterChange}
                className="form-select"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="roleFilter">Filter by Role:</label>
              <select
                id="roleFilter"
                value={roleFilter}
                onChange={onRoleFilterChange}
                className="form-select"
              >
                <option value="all">All Roles</option>
                <option value="1">Admin</option>
                <option value="2">Content Manager</option>
              </select>
            </div>

            <div className="filter-group search-group">
              <label htmlFor="searchInput">Search:</label>
              <input
                type="text"
                id="searchInput"
                value={searchQuery}
                onChange={onSearch}
                placeholder="Search by username, name, or email..."
                className="search-input"
              />
            </div>
          </div>

          {/* No Results Message */}
          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <p>No users found matching your criteria.</p>
              <Link to="/admin/users/add" className="btn btn-primary">Add First User</Link>
            </div>
          )}

          {/* Pagination (Top) */}
          {filteredUsers.length > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {getPageStart()}-{getPageEnd()} of {filteredUsers.length} total
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

          {/* Users Table */}
          {filteredUsers.length > 0 && (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '8%' }}>Picture</th>
                    <th style={{ width: '15%' }}>Username</th>
                    <th style={{ width: '20%' }}>Full Name</th>
                    <th style={{ width: '22%' }}>Email</th>
                    <th style={{ width: '12%' }}>Role</th>
                    <th style={{ width: '10%' }}>Status</th>
                    <th style={{ width: '13%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedUsers().map(user => (
                    <tr key={user.id}>
                      <td data-label="PICTURE" className="text-center">
                        {hasProfilePicture(user) ? (
                          <img
                            src={getProfilePicturePath(user)}
                            alt={user.full_name}
                            className="table-profile-pic"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="table-profile-placeholder">👤</div>';
                            }}
                          />
                        ) : (
                          <div className="table-profile-placeholder">👤</div>
                        )}
                      </td>
                      <td data-label="USERNAME">
                        <strong>{user.username}</strong>
                      </td>
                      <td data-label="FULL NAME">{user.full_name}</td>
                      <td data-label="EMAIL">
                        <a href={`mailto:${user.email}`} className="email-link">{user.email}</a>
                      </td>
                      <td data-label="ROLE">
                        {user.role_name ? (
                          <span className="role-badge">{user.role_name}</span>
                        ) : (
                          <span className="text-muted">No Role</span>
                        )}
                      </td>
                      <td data-label="STATUS">
                        <span className={getStatusBadgeClass(user.is_active)}>
                          {user.is_active ? '✓ Active' : 'Inactive'}
                        </span>
                      </td>
                      <td data-label="ACTIONS" className="actions">
                        {isMasterAdmin(user) ? (
                          <span title="Master Admin - Cannot be modified" className="locked-icon">🔒</span>
                        ) : (
                          <>
                            <Link to={`/admin/users/edit/${user.id}`} className="btn btn-sm btn-edit" title="Edit User">
                              ✏️
                            </Link>
                            <button
                              onClick={() => toggleUserActive(user)}
                              className="btn btn-sm btn-toggle"
                              title={user.is_active ? 'Deactivate User' : 'Activate User'}
                            >
                              {user.is_active ? '👁️' : '🚫'}
                            </button>
                            <Link to={`/admin/users/delete/${user.id}`} className="btn btn-sm btn-delete" title="Delete User">
                              🗑️
                            </Link>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination (Bottom) */}
          {filteredUsers.length > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {getPageStart()}-{getPageEnd()} of {filteredUsers.length} total
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
      )}
    </>
  );
}

export default UserList;
