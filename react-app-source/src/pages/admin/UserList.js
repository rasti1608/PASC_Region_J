import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersService } from '../../services/admin-api';

function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchQuery, statusFilter]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await usersService.getAll();
      setUsers(response.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load users');
      setLoading(false);
      console.error('Error loading users:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(u => u.is_active === isActive);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u =>
        u.username?.toLowerCase().includes(query) ||
        u.full_name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query)
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

  const addNew = () => {
    navigate('/admin/users/add');
  };

  const edit = (id) => {
    navigate(`/admin/users/edit/${id}`);
  };

  const toggleActive = async (user) => {
    try {
      await usersService.toggleActive(user.id);
      loadUsers();
    } catch (err) {
      setError('Failed to toggle status');
      console.error('Error toggling status:', err);
    }
  };

  const deleteUser = (user) => {
    navigate(`/admin/users/delete/${user.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getPaginatedUsers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = () => Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

  return (
    <>
      <div className="content-header">
        <h1>User Management</h1>
        <p>Manage admin users and their permissions</p>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>All Users ({users.length})</h2>
          <button className="btn btn-primary" onClick={addNew}>
            + Add New User
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by username, name, or email..."
            value={searchQuery}
            onChange={onSearch}
          />

          <select className="status-filter" value={statusFilter} onChange={onStatusFilterChange}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <span className="search-results">
            Showing {filteredUsers.length} of {users.length} total
          </span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        )}

        {!loading && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Username</th>
                  <th style={{ width: '25%' }}>Full Name</th>
                  <th style={{ width: '20%' }}>Email</th>
                  <th style={{ width: '10%' }}>Role</th>
                  <th style={{ width: '10%' }}>Status</th>
                  <th style={{ width: '15%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <div className="empty-state">
                        <p>{searchQuery || statusFilter !== 'all' ? 'No users match your filters' : 'No users yet'}</p>
                        {!searchQuery && statusFilter === 'all' && (
                          <button className="btn btn-primary btn-sm" onClick={addNew}>
                            Create First User
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {getPaginatedUsers().map(user => (
                  <tr key={user.id}>
                    <td data-label="USERNAME">
                      <strong>{user.username}</strong>
                      {user.must_change_password && (
                        <span className="badge" style={{ background: '#fff3e0', color: '#ef6c00', marginLeft: '8px' }}>
                          Password Change Required
                        </span>
                      )}
                    </td>
                    <td data-label="FULL NAME">{user.full_name}</td>
                    <td data-label="EMAIL">
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td data-label="ROLE">
                      <span className="badge" style={{
                        background: user.role_id === 1 ? '#ffebee' : '#e8f5e9',
                        color: user.role_id === 1 ? '#c62828' : '#2e7d32'
                      }}>
                        {user.role_name || (user.role_id === 1 ? 'Admin' : 'Content Manager')}
                      </span>
                    </td>
                    <td data-label="STATUS">
                      {user.is_active ? (
                        <span className="badge badge-success">✓ Active</span>
                      ) : (
                        <span className="badge badge-inactive">Inactive</span>
                      )}
                    </td>
                    <td data-label="ACTIONS" className="actions">
                      <button className="btn btn-sm btn-edit" onClick={() => edit(user.id)} title="Edit">✏️</button>
                      <button className="btn btn-sm btn-toggle" onClick={() => toggleActive(user)} title="Toggle">
                        {user.is_active ? '👁️' : '🚫'}
                      </button>
                      <button className="btn btn-sm btn-delete" onClick={() => deleteUser(user)} title="Delete">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredUsers.length > itemsPerPage && (
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
    </>
  );
}

export default UserList;
