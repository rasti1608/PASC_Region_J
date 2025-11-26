import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentsService } from '../../services/admin-api';

function DocumentList() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [documents, searchQuery]);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await documentsService.getAll();
      setDocuments(response.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
      setLoading(false);
      console.error('Error loading documents:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...documents];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title?.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query)
      );
    }

    setFilteredDocuments(filtered);
  };

  const onSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const uploadNew = () => {
    navigate('/admin/documents/upload');
  };

  const edit = (id) => {
    navigate(`/admin/documents/edit/${id}`);
  };

  const toggleActive = async (doc) => {
    try {
      await documentsService.toggleActive(doc.id);
      loadDocuments();
    } catch (err) {
      setError('Failed to toggle status');
      console.error('Error toggling status:', err);
    }
  };

  const deleteDocument = (doc) => {
    navigate(`/admin/documents/delete/${doc.id}`);
  };

  const getFileIcon = (extension) => {
    switch (extension?.toLowerCase()) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'ppt':
      case 'pptx': return '📑';
      default: return '📁';
    }
  };

  const getPaginatedDocuments = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDocuments.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = () => Math.max(1, Math.ceil(filteredDocuments.length / itemsPerPage));
  const getPageStart = () => filteredDocuments.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const getPageEnd = () => Math.min(currentPage * itemsPerPage, filteredDocuments.length);

  return (
    <>
      <div className="content-header">
        <h1>Manage Documents</h1>
        <p>Upload and manage downloadable documents</p>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>All Documents ({documents.length})</h2>
          <button className="btn btn-primary" onClick={uploadNew}>
            + Upload New Document
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={onSearch}
          />
          <span className="search-results">
            Showing {filteredDocuments.length} of {documents.length} total
          </span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading documents...</p>
          </div>
        )}

        {!loading && filteredDocuments.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {getPageStart()}-{getPageEnd()} of {filteredDocuments.length} total
            </div>
          </div>
        )}

        {!loading && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>Type</th>
                  <th style={{ width: '35%' }}>Title</th>
                  <th style={{ width: '20%' }}>Category</th>
                  <th style={{ width: '10%' }}>Size</th>
                  <th style={{ width: '10%' }}>Status</th>
                  <th style={{ width: '15%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <div className="empty-state">
                        <p>{searchQuery ? 'No documents match your search' : 'No documents yet'}</p>
                        {!searchQuery && (
                          <button className="btn btn-primary btn-sm" onClick={uploadNew}>
                            Upload First Document
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {getPaginatedDocuments().map(doc => (
                  <tr key={doc.id}>
                    <td>{getFileIcon(doc.fileextension)}</td>
                    <td data-label="TITLE">
                      <strong>{doc.title}</strong>
                      {doc.description && (
                        <>
                          <br />
                          <small className="text-muted">{doc.description}</small>
                        </>
                      )}
                    </td>
                    <td data-label="CATEGORY">{doc.documenttype || 'General'}</td>
                    <td data-label="SIZE">{doc.filesizeformatted}</td>
                    <td data-label="STATUS">
                      {doc.is_active ? (
                        <span className="badge badge-success">✓ Active</span>
                      ) : (
                        <span className="badge badge-inactive">Inactive</span>
                      )}
                    </td>
                    <td data-label="ACTIONS" className="actions">
                      <button className="btn btn-sm btn-edit" onClick={() => edit(doc.id)} title="Edit">✏️</button>
                      <button className="btn btn-sm btn-toggle" onClick={() => toggleActive(doc)} title="Toggle">
                        {doc.is_active ? '👁️' : '🚫'}
                      </button>
                      <button className="btn btn-sm btn-delete" onClick={() => deleteDocument(doc)} title="Delete">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredDocuments.length > itemsPerPage && (
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

export default DocumentList;
