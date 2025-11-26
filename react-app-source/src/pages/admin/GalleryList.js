import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { galleryService } from '../../services/admin-api';

function GalleryList() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [images, searchQuery, locationFilter]);

  const loadImages = async () => {
    setLoading(true);
    setError(null);

    try {
      const [aboutRes, galleryRes] = await Promise.all([
        galleryService.getAll('about_page'),
        galleryService.getAll('gallery')
      ]);

      const aboutImages = (aboutRes.data || []).map(img => ({ ...img, page_location: 'about_page' }));
      const galleryImages = (galleryRes.data || []).map(img => ({ ...img, page_location: 'gallery' }));

      setImages([...aboutImages, ...galleryImages]);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load images');
      setLoading(false);
      console.error('Error loading images:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...images];

    if (locationFilter !== 'all') {
      filtered = filtered.filter(img => img.page_location === locationFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(img =>
        img.title?.toLowerCase().includes(query)
      );
    }

    setFilteredImages(filtered);
  };

  const onSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const onLocationFilterChange = (e) => {
    setLocationFilter(e.target.value);
    setCurrentPage(1);
  };

  const uploadNew = () => {
    navigate('/admin/gallery/upload');
  };

  const edit = (id) => {
    navigate(`/admin/gallery/edit/${id}`);
  };

  const toggleActive = async (image) => {
    try {
      await galleryService.toggleActive(image.id);
      loadImages();
    } catch (err) {
      setError('Failed to toggle status');
      console.error('Error toggling status:', err);
    }
  };

  const deleteImage = (image) => {
    navigate(`/admin/gallery/delete/${image.id}`);
  };

  const getPaginatedImages = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredImages.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = () => Math.max(1, Math.ceil(filteredImages.length / itemsPerPage));

  return (
    <>
      <div className="content-header">
        <h1>Manage Gallery</h1>
        <p>Upload and manage gallery images</p>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>All Images ({images.length})</h2>
          <button className="btn btn-primary" onClick={uploadNew}>
            + Upload New Image
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={onSearch}
          />

          <select className="status-filter" value={locationFilter} onChange={onLocationFilterChange}>
            <option value="all">All Locations</option>
            <option value="gallery">Gallery Page</option>
            <option value="about_page">About Page</option>
          </select>

          <span className="search-results">
            Showing {filteredImages.length} of {images.length} total
          </span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading images...</p>
          </div>
        )}

        {!loading && (
          <div className="gallery-grid">
            {filteredImages.length === 0 && (
              <div className="empty-state">
                <p>{searchQuery || locationFilter !== 'all' ? 'No images match your filters' : 'No images yet'}</p>
                {!searchQuery && locationFilter === 'all' && (
                  <button className="btn btn-primary btn-sm" onClick={uploadNew}>
                    Upload First Image
                  </button>
                )}
              </div>
            )}

            {getPaginatedImages().map(image => (
              <div key={image.id} className="gallery-card">
                <div className="gallery-image-wrapper">
                  <img
                    src={`/assets/img/gallery/${image.filename}`}
                    alt={image.title}
                    className="gallery-thumbnail"
                  />
                  {!image.is_active && <div className="inactive-overlay">Inactive</div>}
                </div>
                <div className="gallery-info">
                  <h4>{image.title}</h4>
                  <span className="badge" style={{
                    background: image.page_location === 'gallery' ? '#e3f2fd' : '#f3e5f5',
                    color: image.page_location === 'gallery' ? '#1565c0' : '#7b1fa2'
                  }}>
                    {image.page_location === 'gallery' ? 'Gallery' : 'About Page'}
                  </span>
                </div>
                <div className="gallery-actions">
                  <button className="btn btn-sm btn-edit" onClick={() => edit(image.id)} title="Edit">✏️</button>
                  <button className="btn btn-sm btn-toggle" onClick={() => toggleActive(image)} title="Toggle">
                    {image.is_active ? '👁️' : '🚫'}
                  </button>
                  <button className="btn btn-sm btn-delete" onClick={() => deleteImage(image)} title="Delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredImages.length > itemsPerPage && (
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

export default GalleryList;
