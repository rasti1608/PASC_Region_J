import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAudio } from '../contexts/AudioContext';
import { getGalleryImages, getGalleryCount } from '../services/api';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';

function Gallery() {
  const { isPlaying } = useAudio();
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const imagesPerPage = 9;
  const heroVideoDesktopRef = useRef(null);
  const heroVideoMobileRef = useRef(null);

  useEffect(() => {
    loadGalleryCount();
  }, []);

  useEffect(() => {
    loadGalleryImages();
  }, [currentPage]);

  useEffect(() => {
    const desktopVideo = heroVideoDesktopRef.current;
    const mobileVideo = heroVideoMobileRef.current;

    [desktopVideo, mobileVideo].forEach(video => {
      if (video) {
        video.muted = true;
        video.volume = 0;
        if (isPlaying) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [isPlaying]);

  const loadGalleryCount = async () => {
    try {
      const response = await getGalleryCount('gallery');
      if (response.success) {
        setTotalImages(response.totalcount);
      }
    } catch (err) {
      console.error('Error loading gallery count:', err);
    }
  };

  const loadGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await getGalleryImages('gallery', currentPage, imagesPerPage);
      if (response.success && response.data) {
        setImages(response.data);
      } else {
        setError('Failed to load gallery images');
      }
    } catch (err) {
      console.error('Error loading gallery images:', err);
      setError('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const getTotalPages = () => Math.ceil(totalImages / imagesPerPage);
  const getStartPhoto = () => (currentPage - 1) * imagesPerPage + 1;
  const getEndPhoto = () => Math.min(currentPage * imagesPerPage, totalImages);

  const goToPage = (page) => {
    if (page >= 1 && page <= getTotalPages()) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageInput = (e) => {
    const page = parseInt(e.target.value, 10);
    if (!isNaN(page)) {
      goToPage(page);
    }
  };

  const openModal = (index) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextModalImage = (e) => {
    e.stopPropagation();
    if (modalIndex < images.length - 1) {
      setModalIndex(modalIndex + 1);
    }
  };

  const previousModalImage = (e) => {
    e.stopPropagation();
    if (modalIndex > 0) {
      setModalIndex(modalIndex - 1);
    }
  };

  const PaginationControls = ({ suffix = '' }) => (
    <div className="controls">
      <div className="page-info">
        Page <span id={`currentPage${suffix}`}>{currentPage}</span> of <span id={`totalPages${suffix}`}>{getTotalPages()}</span>
        {' '}(Photos <span id={`startPhoto${suffix}`}>{getStartPhoto()}</span>-<span id={`endPhoto${suffix}`}>{getEndPhoto()}</span> of <span id={`totalPhotos${suffix}`}>{totalImages}</span>)
      </div>
      <div className="nav-buttons">
        <button className="nav-button" onClick={() => goToPage(1)} disabled={currentPage === 1}>&#9198; First</button>
        <button className="nav-button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>&#9664; Previous</button>
        <input
          type="number"
          className="page-input"
          min="1"
          max={getTotalPages()}
          value={currentPage}
          onChange={handlePageInput}
        />
        <button className="nav-button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === getTotalPages()}>Next &#9654;</button>
        <button className="nav-button" onClick={() => goToPage(getTotalPages())} disabled={currentPage === getTotalPages()}>Last &#9197;</button>
      </div>
    </div>
  );

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="page-hero">
        <video ref={heroVideoDesktopRef} id="galleryVideo" className="hero-video hero-video-desktop" muted loop playsInline>
          <source src={`${process.env.PUBLIC_URL}/assets/video/space-background.mp4`} type="video/mp4" />
        </video>
        <video ref={heroVideoMobileRef} id="galleryVideoMobile" className="hero-video hero-video-mobile" muted loop playsInline>
          <source src={`${process.env.PUBLIC_URL}/assets/video/space-background.mp4`} type="video/mp4" />
        </video>

        <div className="container">
          <h1 className="hero-title" id="galleryTitle">Photo Gallery</h1>
          <p className="hero-subtitle" id="gallerySubtitle">Conference Memories & Highlights</p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading gallery...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && images.length === 0 && (
            <div className="gallery-empty">
              <div className="gallery-empty-icon">&#128248;</div>
              <h2>No Photos Yet</h2>
              <p>Gallery photos will be added soon. Check back later!</p>
              <Link to="/home" className="btn btn-primary">Return Home</Link>
            </div>
          )}

          {!loading && images.length > 0 && (
            <>
              <PaginationControls />

              <div className="gallery-grid">
                {images.map((image, index) => (
                  <div key={image.id} className="gallery-item">
                    <img
                      src={image.fullpath}
                      alt={image.title || `Photo ${index + 1}`}
                      onClick={() => openModal(index)}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              <PaginationControls suffix="Bottom" />
            </>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {modalOpen && (
        <div id="imageModal" className="modal" onClick={closeModal}>
          <span className="close" onClick={closeModal}>&times;</span>
          <img
            className="modal-content"
            id="modalImage"
            src={images[modalIndex]?.fullpath}
            alt=""
            onClick={(e) => e.stopPropagation()}
          />

          <div className="modal-arrows">
            <button className="arrow-left" onClick={previousModalImage} disabled={modalIndex === 0}>&#9664;</button>
            <button className="arrow-right" onClick={nextModalImage} disabled={modalIndex === images.length - 1}>&#9654;</button>
          </div>

          <div className="modal-info" id="modalInfo">Photo {modalIndex + 1} of {images.length}</div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Gallery;
