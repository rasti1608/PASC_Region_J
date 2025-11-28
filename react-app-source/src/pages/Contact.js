import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAudio } from '../contexts/AudioContext';
import { submitContact } from '../services/api';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';

function Contact() {
  const { isPlaying } = useAudio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '' // Honeypot
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);

  const heroVideoDesktopRef = useRef(null);
  const heroVideoMobileRef = useRef(null);

  const subjectOptions = [
    'General Inquiry',
    'Conference Registration',
    'Workshop Application',
    'Other'
  ];

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push('Name is required.');
    } else if (formData.name.length < 2) {
      errors.push('Name must be at least 2 characters.');
    }

    if (!formData.email.trim()) {
      errors.push('Email is required.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address.');
    }

    if (!formData.subject) {
      errors.push('Subject is required.');
    }

    if (!formData.message.trim()) {
      errors.push('Message is required.');
    } else if (formData.message.length < 10) {
      errors.push('Message must be at least 10 characters.');
    } else if (formData.message.length > 5000) {
      errors.push('Message must not exceed 5000 characters.');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]);
    setSuccessMessage(null);

    const errors = validateForm();
    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await submitContact(formData);

      if (response.success) {
        setSuccessMessage(response.message || 'Thank you for your message!');
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      } else {
        setErrorMessages(response.errors || ['An error occurred. Please try again.']);
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setErrorMessages(['An error occurred while sending your message. Please try again or contact us directly at info@pascregionj.com.']);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="page-hero">
        <video ref={heroVideoDesktopRef} id="contactVideo" className="hero-video hero-video-desktop" muted loop playsInline>
          <source src={`${process.env.PUBLIC_URL}/assets/video/space-background.mp4`} type="video/mp4" />
        </video>
        <video ref={heroVideoMobileRef} id="contactVideoMobile" className="hero-video hero-video-mobile" muted loop playsInline>
          <source src={`${process.env.PUBLIC_URL}/assets/video/space-background.mp4`} type="video/mp4" />
        </video>

        <div className="container">
          <h1 className="hero-title" id="contactTitle">Contact Us</h1>
          <p className="hero-subtitle" id="contactSubtitle">We're Here to Help</p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-intro">
            <h2>Get in Touch</h2>
            <p>Have questions about the PASC Region J Conference 2026? We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="alert alert-success">
              <div className="alert-icon">&#9989;</div>
              <div className="alert-content">
                <h3>Message Sent Successfully!</h3>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {errorMessages.length > 0 && (
            <div className="alert alert-error">
              <div className="alert-icon">&#9888;&#65039;</div>
              <div className="alert-content">
                <h3>Please Correct the Following Errors:</h3>
                <ul>
                  {errorMessages.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!submitted ? (
            <div className="contact-layout">
              {/* Left Column: Contact Form */}
              <div className="contact-form-column">
                <div className="form-card">
                  <h3>Send Us a Message</h3>

                  <form onSubmit={handleSubmit}>
                    {/* Honeypot field (hidden) */}
                    <div className="honeypot-field">
                      <label htmlFor="website">Website</label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        tabIndex="-1"
                        autoComplete="off"
                      />
                    </div>

                    {/* Name Field */}
                    <div className="form-group">
                      <label htmlFor="contactName" className="form-label">
                        Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Your full name"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="form-group">
                      <label htmlFor="contactEmail" className="form-label">
                        Email Address <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Subject Field */}
                    <div className="form-group">
                      <label htmlFor="contactSubject" className="form-label">
                        Subject <span className="required">*</span>
                      </label>
                      <select
                        id="contactSubject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="">-- Please Select --</option>
                        {subjectOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message Field */}
                    <div className="form-group">
                      <label htmlFor="contactMessage" className="form-label">
                        Message <span className="required">*</span>
                      </label>
                      <textarea
                        id="contactMessage"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="form-textarea"
                        rows="6"
                        placeholder="Please provide details about your inquiry..."
                      />
                      <div className="char-counter">
                        <span>{formData.message.length}</span> / 5000 characters
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary btn-submit" disabled={submitting}>
                        {submitting ? (
                          <>
                            <span className="btn-spinner"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <span className="btn-icon">&#128231;</span>
                            Send Message
                          </>
                        )}
                      </button>
                    </div>

                    <p className="form-note">
                      <span className="required">*</span> Required fields
                    </p>
                  </form>
                </div>
              </div>

              {/* Right Column: Contact Information */}
              <div className="contact-info-column">
                <div className="info-card">
                  <h3>Contact Information</h3>

                  <div className="info-item">
                    <div className="info-icon">&#128231;</div>
                    <div className="info-content">
                      <h4>Email</h4>
                      <p><a href="mailto:info@pascregionj.com">info@pascregionj.com</a></p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">&#128197;</div>
                    <div className="info-content">
                      <h4>Conference Date</h4>
                      <p>February 13, 2026</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">&#128205;</div>
                    <div className="info-content">
                      <h4>Location</h4>
                      <p>Neshaminy High School<br />Langhorne, PA</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">&#9200;</div>
                    <div className="info-content">
                      <h4>Response Time</h4>
                      <p>We typically respond within 24-48 hours during business days.</p>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Quick Links</h3>
                  <ul className="quick-links">
                    <li><Link to="/workshops">Workshop Applications</Link></li>
                    <li><Link to="/about">About PASC Region J</Link></li>
                    <li><Link to="/resources">Resources & Downloads</Link></li>
                    <li><Link to="/gallery">Photo Gallery</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="form-actions">
              <Link to="/" className="btn btn-primary">Return Home</Link>
              <Link to="/about" className="btn btn-secondary">Learn More About PASC Region J</Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Contact;
