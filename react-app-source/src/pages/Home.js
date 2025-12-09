import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAnnouncements } from '../services/api';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';

function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroVideoDesktopRef = useRef(null);
  const heroVideoMobileRef = useRef(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  useEffect(() => {
    // Video should always autoplay (muted) - independent of audio state
    const desktopVideo = heroVideoDesktopRef.current;
    const mobileVideo = heroVideoMobileRef.current;
    const isMobile = window.innerWidth <= 768;

    const activeVideo = isMobile ? mobileVideo : desktopVideo;

    if (activeVideo) {
      activeVideo.muted = true;
      activeVideo.loop = true;
      activeVideo.play().catch(err => {
        console.log('Video autoplay prevented:', err);
        // Try to play on user interaction
        document.addEventListener('click', () => {
          activeVideo.play();
        }, { once: true });
      });
    }
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await getAnnouncements();
      if (response.success && response.data) {
        setAnnouncements(response.data);
      } else {
        setError('Failed to load announcements');
      }
    } catch (err) {
      console.error('Error loading announcements:', err);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero">
        {/* Video Background - Desktop */}
        <video
          ref={heroVideoDesktopRef}
          id="heroVideo"
          className="hero-video hero-video-desktop"
          muted
          loop
          playsInline
        >
          <source src={`${process.env.PUBLIC_URL}/assets/video/space-background.mp4`} type="video/mp4" />
        </video>

        {/* Video Background - Mobile */}
        <video
          ref={heroVideoMobileRef}
          id="heroVideoMobile"
          className="hero-video hero-video-mobile"
          muted
          loop
          playsInline
        >
          <source src={`${process.env.PUBLIC_URL}/assets/video/space-background_M.mp4`} type="video/mp4" />
        </video>

        <div className="hero-content">
          <div className="stars-background"></div>
          <div className="hero-text">
            <h1 className="hero-title" id="heroTitle">PASC REGION J CONFERENCE 2026</h1>
            <p className="hero-subtitle" id="heroSubtitle">Reach for the Stars, Lead Beyond Limits - February 13, 2026</p>

            <div className="hero-buttons">
              <Link to="/workshops" className="btn btn-primary">Register Now</Link>
              <Link to="/about" className="btn btn-secondary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="announcements-section">
        <div className="container">
          <h2 className="section-title">Latest Announcements</h2>

          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading announcements...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && announcements.length === 0 && (
            <p className="no-announcements">No announcements at this time. Check back soon!</p>
          )}

          {!loading && announcements.length > 0 && (
            <div className="announcements-grid">
              {announcements.map(announcement => (
                <div
                  key={announcement.id}
                  className={`announcement-card ${announcement.isfeatured ? 'featured' : ''}`}
                >
                  {announcement.isfeatured ? (
                    <span className="featured-badge">&#11088; Featured</span>
                  ) : null}
                  <h3>{announcement.title}</h3>
                  <p>{announcement.content}</p>
                  <span className="announcement-date">{formatDate(announcement.publishstart)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="quick-info">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">&#128197;</div>
              <h3>Event Date</h3>
              <p>February 13, 2026</p>
            </div>

            <div className="info-card">
              <div className="info-icon">&#127891;</div>
              <h3>Who Can Attend</h3>
              <p>Student Council Members within Region J or by invitation</p>
            </div>

            <div className="info-card">
              <div className="info-icon">&#128640;</div>
              <h3>Theme</h3>
              <p>Navigating the Stars</p>
            </div>

            <div className="info-card">
              <div className="info-icon">&#128203;</div>
              <h3>Registration</h3>
              <p>January 5-23, 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Reach for the Stars, Lead Beyond Limits?</h2>
          <p>Join us for an inspiring day of leadership, workshops, and networking!</p>
          <div className="cta-buttons">
            <Link to="/workshops" className="btn btn-large btn-primary">Register for the Conference</Link>
            <Link to="/workshops" className="btn btn-large btn-outline">Apply to Present a Workshop</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
