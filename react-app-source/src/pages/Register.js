import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAudio } from '../contexts/AudioContext';
import { getWorkshopForms, getPageContent } from '../services/api';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';

function Register() {
  const { isPlaying } = useAudio();
  const [forms, setForms] = useState([]);
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFormIndex, setActiveFormIndex] = useState(null);

  const heroVideoDesktopRef = useRef(null);
  const heroVideoMobileRef = useRef(null);

  useEffect(() => {
    loadPageContent();
    loadRegistrationForms();
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
      const response = await getPageContent('register');
      if (response.success && response.data) {
        setPageContent(response.data);
      }
    } catch (err) {
      console.error('Error loading page content:', err);
    }
  };

  const loadRegistrationForms = async () => {
    try {
      setLoading(true);
      const response = await getWorkshopForms('Registration');
      if (response.success && response.data) {
        setForms(response.data);
        if (response.data.length === 1) {
          setActiveFormIndex(0);
        }
      } else {
        setError('Failed to load registration forms');
      }
    } catch (err) {
      console.error('Error loading registration forms:', err);
      setError('Failed to load registration forms');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = (index) => {
    if (forms.length === 1) return;
    setActiveFormIndex(activeFormIndex === index ? null : index);
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="page-hero">
        <video ref={heroVideoDesktopRef} id="registerVideo" className="hero-video hero-video-desktop" muted loop playsInline>
          <source src={`${process.env.PUBLIC_URL}/assets/video/space-background.mp4`} type="video/mp4" />
        </video>
        <video ref={heroVideoMobileRef} id="registerVideoMobile" className="hero-video hero-video-mobile" muted loop playsInline>
          <source src={`${process.env.PUBLIC_URL}/assets/video/space-background.mp4`} type="video/mp4" />
        </video>

        <div className="container">
          <h1 className="hero-title" id="registerTitle">Conference Registration</h1>
          <p className="hero-subtitle" id="registerSubtitle">Your Journey to Leadership Starts Here</p>
        </div>
      </section>

      {/* Registration Info & Forms Section */}
      <section className="registration-forms-section">
        <div className="container">
          <div className="intro-content">
            <h2>Welcome, Student Leaders!</h2>
            <p>This is your chance to connect with fellow student council members from across the region. Join us for a day of leadership development, inspiration, and building lasting friendships at the PASC Region J Conference 2026!</p>
          </div>

          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading registration forms...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && forms.length > 1 && (
            <div className="form-intro">
              <h2>Registration Forms</h2>
              <p className="form-description">Select a form below to begin your registration.</p>
            </div>
          )}

          {!loading && !error && forms.length > 0 && (
            <div className="accordion" id="registrationFormsAccordion">
              {forms.map((form, index) => (
                <div key={form.id} className="accordion-item">
                  <h2 className="accordion-header" id={`heading${form.id}`}>
                    <button
                      className={`accordion-button ${activeFormIndex !== index ? 'collapsed' : ''} ${forms.length === 1 ? 'single-form-locked' : ''}`}
                      type="button"
                      aria-expanded={activeFormIndex === index}
                      onClick={() => toggleForm(index)}
                    >
                      <div className="accordion-header-content">
                        <div className="form-title">{form.formname}</div>
                        {form.formdescription && form.formdescription.trim() && (
                          <div className="form-description-preview">{form.formdescription}</div>
                        )}
                      </div>
                    </button>
                  </h2>
                  <div
                    id={`collapse${form.id}`}
                    className={`accordion-collapse collapse ${activeFormIndex === index ? 'show' : ''}`}
                  >
                    <div className="accordion-body">
                      <div
                        className="form-container"
                        dangerouslySetInnerHTML={{ __html: form.embedcode }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && forms.length === 0 && (
            <div className="no-form-message">
              <div className="message-icon">&#128203;</div>
              <h2>Registration Closed</h2>
              <p>Registration is currently closed. Please check back when registration opens <strong>January 5-23, 2026</strong>.</p>
              <Link to="/home" className="btn btn-primary">Return Home</Link>
            </div>
          )}
        </div>
      </section>

      {/* Conference Details Section */}
      <section className="details-section">
        <div className="container">
          <h2>Conference Details</h2>

          <div className="details-grid">
            <div className="detail-card">
              <h3>&#128197; Conference Date</h3>
              <p>February 13, 2026</p>
            </div>

            <div className="detail-card">
              <h3>&#128221; Registration Period</h3>
              <p>January 5-23, 2026</p>
            </div>

            <div className="detail-card">
              <h3>&#127775; Theme</h3>
              <p>Reach for the Stars, Lead Beyond Limits</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Questions About Registration?</h2>
          <p>We're here to help! Reach out if you have any questions about the registration process.</p>
          <div className="cta-buttons">
            <Link to="/about" className="btn btn-primary">Learn More About PASC Region J</Link>
            <Link to="/home" className="btn btn-secondary">Return Home</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Register;
