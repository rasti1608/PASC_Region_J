import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAudio } from '../contexts/AudioContext';
import { getWorkshopForms, getPageContent } from '../services/api';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';

function Workshops() {
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
    loadWorkshopForms();
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
      const response = await getPageContent('workshops');
      if (response.success && response.data) {
        setPageContent(response.data);
      }
    } catch (err) {
      console.error('Error loading page content:', err);
    }
  };

  const loadWorkshopForms = async () => {
    try {
      setLoading(true);
      const response = await getWorkshopForms('Workshops');
      if (response.success && response.data) {
        setForms(response.data);
        // Auto-expand if only 1 form
        if (response.data.length === 1) {
          setActiveFormIndex(0);
        }
      } else {
        setError('Failed to load workshop forms');
      }
    } catch (err) {
      console.error('Error loading workshop forms:', err);
      setError('Failed to load workshop forms');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = (index) => {
    // Disable toggle if only one form
    if (forms.length === 1) {
      return;
    }
    setActiveFormIndex(activeFormIndex === index ? null : index);
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="page-hero">
        <video ref={heroVideoDesktopRef} id="workshopsVideo" className="hero-video hero-video-desktop" muted loop playsInline>
          <source src={`${process.env.PUBLIC_URL}/assets/video/space-background.mp4`} type="video/mp4" />
        </video>
        <video ref={heroVideoMobileRef} id="workshopsVideoMobile" className="hero-video hero-video-mobile" muted loop playsInline>
          <source src={`${process.env.PUBLIC_URL}/assets/video/space-background.mp4`} type="video/mp4" />
        </video>

        <div className="container">
          <h1 className="hero-title" id="workshopsTitle">Workshop Application</h1>
          <p className="hero-subtitle" id="workshopsSubtitle">Share Your Leadership Expertise</p>
        </div>
      </section>

      {/* Workshop Info & Application Form Section */}
      <section className="workshop-forms-section">
        <div className="container">
          <div className="intro-content">
            <h2>Present at Our Conference</h2>
            <p>We're looking for passionate leaders to share their knowledge and experience at the PASC Region J Conference 2026. Whether you're a student leader, advisor, or expert in student leadership, we want to hear from you!</p>
          </div>

          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading workshop forms...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && forms.length > 1 && (
            <div className="form-intro">
              <h2>Conference Forms</h2>
              <p className="form-description">Select a form below to begin your submission.</p>
            </div>
          )}

          {!loading && !error && forms.length > 0 && (
            <div className="accordion" id="workshopFormsAccordion">
              {forms.map((form, index) => (
                <div key={form.id} className="accordion-item">
                  <h2 className="accordion-header" id={`heading${form.id}`}>
                    <button
                      className={`accordion-button ${activeFormIndex !== index ? 'collapsed' : ''} ${forms.length === 1 ? 'single-form-locked' : ''}`}
                      type="button"
                      aria-expanded={activeFormIndex === index}
                      aria-controls={`collapse${form.id}`}
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
                    aria-labelledby={`heading${form.id}`}
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
              <h2>Applications Opening Soon</h2>
              <p>Workshop presenter applications are not currently open. Please check back soon or contact us for more information.</p>
              <Link to="/home" className="btn btn-primary">Return Home</Link>
            </div>
          )}
        </div>
      </section>

      {/* Workshop Guidelines Section */}
      <section className="guidelines-section">
        <div className="container">
          <h2>Workshop Guidelines</h2>

          <div className="guidelines-grid">
            <div className="guideline-card">
              <h3>&#128218; Workshop Topics</h3>
              <p>Leadership skills, team building, communication, civic engagement, project planning, creativity, and student council best practices.</p>
            </div>

            <div className="guideline-card">
              <h3>&#9201;&#65039; Session Length</h3>
              <p>Workshops are 30 minutes. Plan your content to fit within this time frame for maximum engagement.</p>
            </div>

            <div className="guideline-card">
              <h3>&#128101; Target Audience</h3>
              <p>Workshops are designed for student council members. We encourage interactive and engaging sessions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Questions About Presenting?</h2>
          <p>We're here to help! Reach out if you have any questions about the application process.</p>
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

export default Workshops;
