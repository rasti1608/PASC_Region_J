import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { getSchedule } from '../services/api';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';

function Schedule() {
  const { isPlaying } = useAudio();
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroVideoDesktopRef = useRef(null);
  const heroVideoMobileRef = useRef(null);

  useEffect(() => {
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

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const response = await getSchedule();
      if (response.success && response.data) {
        setScheduleItems(response.data);
      } else {
        setError('Failed to load schedule');
      }
    } catch (err) {
      console.error('Error loading schedule:', err);
      setError('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    window.location.href = '/api/schedule-pdf.cfm';
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="page-hero">
        <video ref={heroVideoDesktopRef} id="scheduleVideo" className="hero-video hero-video-desktop" muted loop playsInline>
          <source src={`${process.env.PUBLIC_URL}/assets/video/space-background.mp4`} type="video/mp4" />
        </video>
        <video ref={heroVideoMobileRef} id="scheduleVideoMobile" className="hero-video hero-video-mobile" muted loop playsInline>
          <source src={`${process.env.PUBLIC_URL}/assets/video/space-background.mp4`} type="video/mp4" />
        </video>

        <div className="container">
          <h1 className="hero-title" id="scheduleTitle">Conference Schedule</h1>
          <p className="hero-subtitle" id="scheduleSubtitle">Plan your day of leadership and learning</p>
        </div>
      </section>

      {/* Schedule Timeline Section */}
      <section className="schedule-timeline-section">
        <div className="container">
          <h2 className="section-title">Schedule Timeline</h2>
          <p className="section-description">
            View the complete conference schedule below.
            <button className="btn-download-pdf" onClick={downloadPDF} title="Download Schedule PDF">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </button>
          </p>

          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading schedule...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && scheduleItems.length > 0 && (
            <div className="timeline">
              {scheduleItems.map((item, index) => (
                <div key={item.schedule_id || index} className="timeline-item">
                  <div className="timeline-connector"></div>
                  <div className="timeline-content">
                    <div className="time-range">
                      {item.event_time}{item.end_time && ` - ${item.end_time}`}
                    </div>
                    <div className="event-details">
                      <div className="event-header">
                        {item.event_icon && (
                          <span className="event-icon">{item.event_icon}</span>
                        )}
                        <h3 className="event-name">{item.event_name}</h3>
                      </div>
                      {item.event_description && (
                        <p className="event-description">{item.event_description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && scheduleItems.length === 0 && (
            <div className="no-schedule">
              <div className="message-icon">&#128197;</div>
              <h3>Schedule Coming Soon</h3>
              <p>Our conference schedule will be available shortly. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Workshop Rotation Explanation Section */}
      <section className="rotation-section">
        <div className="container">
          <h2 className="section-title">Workshop Rotation Groups</h2>
          <p className="section-description">
            Conference attendees will be assigned to rotation groups for the workshop sessions.
            Each group follows a different sequence to ensure optimal learning experiences.
          </p>

          <div className="rotation-grid">
            <div className="rotation-card">
              <div className="rotation-header group-a">
                <h3>Group A</h3>
              </div>
              <div className="rotation-sequence">
                <div className="sequence-item">
                  <div className="sequence-number">1</div>
                  <div className="sequence-text">Workshop 1</div>
                </div>
                <div className="sequence-arrow">&rarr;</div>
                <div className="sequence-item">
                  <div className="sequence-number">2</div>
                  <div className="sequence-text">Lunch</div>
                </div>
                <div className="sequence-arrow">&rarr;</div>
                <div className="sequence-item">
                  <div className="sequence-number">3</div>
                  <div className="sequence-text">Workshop 2</div>
                </div>
              </div>
            </div>

            <div className="rotation-card">
              <div className="rotation-header group-b">
                <h3>Group B</h3>
              </div>
              <div className="rotation-sequence">
                <div className="sequence-item">
                  <div className="sequence-number">1</div>
                  <div className="sequence-text">Workshop 1</div>
                </div>
                <div className="sequence-arrow">&rarr;</div>
                <div className="sequence-item">
                  <div className="sequence-number">2</div>
                  <div className="sequence-text">Workshop 2</div>
                </div>
                <div className="sequence-arrow">&rarr;</div>
                <div className="sequence-item">
                  <div className="sequence-number">3</div>
                  <div className="sequence-text">Lunch</div>
                </div>
              </div>
            </div>

            <div className="rotation-card">
              <div className="rotation-header group-c">
                <h3>Group C</h3>
              </div>
              <div className="rotation-sequence">
                <div className="sequence-item">
                  <div className="sequence-number">1</div>
                  <div className="sequence-text">Lunch</div>
                </div>
                <div className="sequence-arrow">&rarr;</div>
                <div className="sequence-item">
                  <div className="sequence-number">2</div>
                  <div className="sequence-text">Workshop 1</div>
                </div>
                <div className="sequence-arrow">&rarr;</div>
                <div className="sequence-item">
                  <div className="sequence-number">3</div>
                  <div className="sequence-text">Workshop 2</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rotation-note">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <p>Your rotation group will be assigned during registration. Please follow your group's schedule for the best experience.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Schedule;
