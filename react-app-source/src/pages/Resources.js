import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { getDocuments, getPageContent, getSchedule } from '../services/api';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';

function Resources() {
  const { isPlaying } = useAudio();
  const [documents, setDocuments] = useState([]);
  const [pageContent, setPageContent] = useState(null);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroVideoDesktopRef = useRef(null);
  const heroVideoMobileRef = useRef(null);

  useEffect(() => {
    loadPageContent();
    loadDocuments();
    loadSchedule();
  }, []);

  useEffect(() => {
    [heroVideoDesktopRef, heroVideoMobileRef].forEach(ref => {
      const video = ref.current;
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

  const loadPageContent = async () => {
    try {
      const response = await getPageContent('resources');
      if (response.success && response.data) {
        setPageContent(response.data);
      }
    } catch (err) {
      console.error('Error loading page content:', err);
    }
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await getDocuments();
      if (response.success && response.data) {
        setDocuments(response.data);
      } else {
        setError('Failed to load documents');
      }
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const loadSchedule = async () => {
    try {
      const response = await getSchedule();
      if (response.success && response.data) {
        setScheduleItems(response.data);
      }
    } catch (err) {
      console.error('Error loading schedule:', err);
    }
  };

  const getDownloadUrl = (filename) => {
    return `/assets/documents/${filename}`;
  };

  const getFileIcon = (extension) => {
    switch (extension?.toLowerCase()) {
      case 'pdf':
        return <span className="icon-pdf">&#128196;</span>;
      case 'doc':
      case 'docx':
        return <span className="icon-word">&#128216;</span>;
      case 'xls':
      case 'xlsx':
        return <span className="icon-excel">&#128202;</span>;
      case 'ppt':
      case 'pptx':
        return <span className="icon-powerpoint">&#128217;</span>;
      default:
        return <span className="icon-generic">&#128195;</span>;
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="page-hero">
        <video ref={heroVideoDesktopRef} id="resourcesVideo" className="hero-video hero-video-desktop" muted loop playsInline>
          <source src="/assets/video/space-background.mp4" type="video/mp4" />
        </video>
        <video ref={heroVideoMobileRef} id="resourcesVideoMobile" className="hero-video hero-video-mobile" muted loop playsInline>
          <source src="/assets/video/space-background.mp4" type="video/mp4" />
        </video>

        <div className="container">
          <h1 className="hero-title" id="resourcesTitle">Resources</h1>
          <p className="hero-subtitle" id="resourcesSubtitle">Conference Materials & Media</p>
        </div>
      </section>

      {/* Document Library Section */}
      <section className="documents-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title-orange">Resource Library</h2>
            <p className="section-description">Browse and download conference materials, guides, and resources</p>
          </div>

          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading resources...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && documents.length > 0 && (
            <div className="documents-grid">
              {documents.map(doc => (
                <div key={doc.id} className="document-card">
                  {/* File Type Icon */}
                  <div className="document-icon">
                    {getFileIcon(doc.fileextension)}
                  </div>

                  {/* Document Title */}
                  <h3 className="document-title">{doc.title}</h3>

                  {/* Description (if exists) */}
                  {doc.description && (
                    <p className="document-description">{doc.description}</p>
                  )}

                  {/* Category Badge (if exists) */}
                  {doc.documenttype && (
                    <span className="document-badge">{doc.documenttype}</span>
                  )}

                  {/* File Size */}
                  <p className="document-size">{doc.filesizeformatted}</p>

                  {/* Download Button */}
                  <a
                    href={getDownloadUrl(doc.filename)}
                    download={`${doc.title}.${doc.fileextension}`}
                    className="btn btn-download-doc"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && documents.length === 0 && (
            <div className="no-documents">
              <p>No resources available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Resources;
