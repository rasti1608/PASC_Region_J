import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { galleryService } from '../../services/admin-api';

function GalleryList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentLocation, setCurrentLocation] = useState(searchParams.get('location') || 'gallery');

  // Tab counts
  const [galleryCount, setGalleryCount] = useState(0);
  const [aboutPageCount, setAboutPageCount] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Image preview modal
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  useEffect(() => {
    loadImages();
    loadTabCounts();
  }, [currentLocation]);

  useEffect(() => {
    applyFilters();
  }, [images, searchQuery, statusFilter]);

  const loadImages = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await galleryService.getAll(currentLocation);
      setImages(response.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load images');
      setLoading(false);
      console.error('Error loading images:', err);
    }
  };

  const loadTabCounts = async () => {
    try {
      const [aboutRes, galleryRes] = await Promise.all([
        galleryService.getAll('about_page'),
        galleryService.getAll('gallery')
      ]);
      setAboutPageCount((aboutRes.data || []).length);
      setGalleryCount((galleryRes.data || []).length);
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
    let filtered = [...images];

    // Apply status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(img => img.is_active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(img => !img.is_active);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(img =>
        img.title?.toLowerCase().includes(query) ||
        img.original_filename?.toLowerCase().includes(query)
      );
    }

    setFilteredImages(filtered);
  };

  const onSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const onStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const uploadNew = () => {
    navigate('/admin/gallery/upload', { state: { location: currentLocation } });
  };

  const edit = (id) => {
    navigate(`/admin/gallery/edit/${id}`, { state: { location: currentLocation } });
  };

  const toggleActive = async (image) => {
    try {
      const response = await galleryService.toggleActive(image.id);
      const updated = response.data;

      // Smooth single-row update instead of reloading entire list
      setImages(prev => prev.map(img =>
        img.id === image.id ? { ...img, ...updated } : img
      ));
    } catch (err) {
      setError('Failed to toggle status');
      console.error('Error toggling status:', err);
    }
  };

  const deleteImage = (image) => {
    navigate(`/admin/gallery/delete/${image.id}`);
  };

  const updateDisplayOrder = async (image, newOrder) => {
    try {
      await galleryService.updateOrder(image.id, parseInt(newOrder), currentLocation);
      loadImages(); // Reload to get updated order
      loadTabCounts(); // Update tab counts
    } catch (err) {
      setError('Failed to update order');
      console.error('Error updating order:', err);
    }
  };

  const getImageUrl = (filename) => `/assets/img/gallery/${filename}`;

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const openImageModal = (filename) => {
    setModalImageUrl(getImageUrl(filename));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImageUrl('');
  };

  // Pagination helpers
  const getPaginatedImages = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredImages.slice(startIndex, endIndex);
  };

  const getTotalPages = () => Math.max(1, Math.ceil(filteredImages.length / itemsPerPage));

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
    if (filteredImages.length === 0) return 0;
    return (currentPage - 1) * itemsPerPage + 1;
  };

  const getPageEnd = () => {
    const end = currentPage * itemsPerPage;
    return Math.min(end, filteredImages.length);
  };

  const goToPage = (page) => setCurrentPage(page);
  const previousPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const nextPage = () => { if (currentPage < getTotalPages()) setCurrentPage(p => p + 1); };

  return (
    <>
      {/* Content Header */}
      <div className="content-header">
        <h1>Gallery Management</h1>
        <p>Manage images for About Page and Gallery</p>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs">
        <button
          className={`tab ${currentLocation === 'gallery' ? 'active' : ''}`}
          onClick={() => switchTab('gallery')}
        >
          Gallery
          <span className="tab-badge">{galleryCount}</span>
        </button>
        <button
          className={`tab ${currentLocation === 'about_page' ? 'active' : ''}`}
          onClick={() => switchTab('about_page')}
        >
          About Page
          <span className="tab-badge">{aboutPageCount}</span>
        </button>
      </div>

      <div className="section">
        {/* Section Header with Upload Button */}
        <div className="section-header">
          <h2>{currentLocation === 'about_page' ? 'About Page' : 'Gallery'} Images ({images.length})</h2>
          <button className="btn btn-primary" onClick={uploadNew}>
            + Upload New Image
          </button>
        </div>

        {/* Search and Filter */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or filename..."
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
              {filteredImages.length} result{filteredImages.length !== 1 ? 's' : ''} found
            </span>
          )}
        </div>

        {/* Error Message */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading images...</p>
          </div>
        )}

        {/* Pagination Info (Top) */}
        {!loading && filteredImages.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {getPageStart()}-{getPageEnd()} of {filteredImages.length} total
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

        {/* Images Table */}
        {!loading && (
          <div className="table-container">
            <table className="data-table" id="gallery-table">
              <thead>
                <tr>
                  <th style={{ width: '8%' }}>Order</th>
                  <th style={{ width: '12%' }}>Preview</th>
                  <th style={{ width: '45%' }}>Image Details</th>
                  <th style={{ width: '15%' }}>Status</th>
                  <th style={{ width: '20%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Empty State */}
                {filteredImages.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <div className="empty-state">
                        {searchQuery || statusFilter !== 'all' ? (
                          <p>No images match your filters</p>
                        ) : (
                          <>
                            <p>No {currentLocation === 'about_page' ? 'About Page' : 'Gallery'} images found.</p>
                            <button className="btn btn-primary btn-sm" onClick={uploadNew}>
                              Upload Your First Image
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Data Rows */}
                {getPaginatedImages().map(image => (
                  <tr key={image.id}>
                    {/* Display Order Dropdown */}
                    <td data-label="ORDER" className="text-center">
                      <select
                        className="order-select"
                        value={image.display_order || 1}
                        onChange={(e) => updateDisplayOrder(image, e.target.value)}
                      >
                        {Array.from({ length: images.length }, (_, idx) => (
                          <option key={idx + 1} value={idx + 1}>
                            {idx + 1}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Image Preview */}
                    <td data-label="PREVIEW">
                      <img
                        src={getImageUrl(image.filename)}
                        alt={image.title}
                        className="image-thumbnail"
                        onClick={() => openImageModal(image.filename)}
                        style={{ cursor: 'pointer' }}
                        title="Click to preview full size"
                      />
                    </td>

                    {/* Image Details */}
                    <td data-label="IMAGE DETAILS">
                      <strong>{image.title}</strong>
                      <br />
                      <small className="text-muted">
                        {image.original_filename} ({formatFileSize(image.file_size)})
                      </small>
                    </td>

                    {/* Status Badge */}
                    <td data-label="STATUS">
                      {image.is_active ? (
                        <span className="badge badge-success">✓ Active</span>
                      ) : (
                        <span className="badge badge-inactive">Inactive</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td data-label="ACTIONS" className="actions">
                      <button className="btn btn-sm btn-edit" onClick={() => edit(image.id)} title="Edit">
                        ✏️
                      </button>
                      <button className="btn btn-sm btn-toggle" onClick={() => toggleActive(image)} title="Toggle Active/Inactive">
                        {image.is_active ? '👁️' : '🚫'}
                      </button>
                      <button className="btn btn-sm btn-delete" onClick={() => deleteImage(image)} title="Delete">
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
        {!loading && filteredImages.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {getPageStart()}-{getPageEnd()} of {filteredImages.length} total
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

      {/* Image Preview Modal */}
      {showModal && (
        <div className="image-modal-overlay" onClick={closeModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            <img src={modalImageUrl} alt="Full size preview" />
          </div>
        </div>
      )}
    </>
  );
}

export default GalleryList;
