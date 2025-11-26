import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAudio } from '../contexts/AudioContext';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';

function About() {
  const { isPlaying } = useAudio();
  const heroVideoDesktopRef = useRef(null);
  const heroVideoMobileRef = useRef(null);

  useEffect(() => {
    const desktopVideo = heroVideoDesktopRef.current;
    const mobileVideo = heroVideoMobileRef.current;

    if (desktopVideo) {
      desktopVideo.muted = true;
      desktopVideo.volume = 0;
      if (isPlaying) {
        desktopVideo.play().catch(err => console.log('Video autoplay prevented:', err));
      } else {
        desktopVideo.pause();
      }
    }

    if (mobileVideo) {
      mobileVideo.muted = true;
      mobileVideo.volume = 0;
      if (isPlaying) {
        mobileVideo.play().catch(err => console.log('Video autoplay prevented:', err));
      } else {
        mobileVideo.pause();
      }
    }
  }, [isPlaying]);

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="page-hero">
        <video ref={heroVideoDesktopRef} id="aboutVideo" className="hero-video hero-video-desktop" muted loop playsInline>
          <source src="/assets/video/space-background.mp4" type="video/mp4" />
        </video>
        <video ref={heroVideoMobileRef} id="aboutVideoMobile" className="hero-video hero-video-mobile" muted loop playsInline>
          <source src="/assets/video/space-background.mp4" type="video/mp4" />
        </video>

        <div className="container">
          <h1 className="hero-title" id="aboutTitle">About PASC Region J</h1>
          <p className="hero-subtitle" id="aboutSubtitle">Celebrating Leadership Since 1932</p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="about-intro">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Who We Are</h2>
              <p>PASC Region J represents Districts 11 and 12, proudly serving student councils across <strong>Philadelphia, Delaware, Bucks, Montgomery, and Chester Counties</strong>.</p>

              <p>Since 1932, the Pennsylvania Association of Student Councils has been dedicated to developing, engaging, and celebrating leaders across our state. PASC helps students improve their lives while learning to lead through service, collaboration, and participation.</p>

              <p>Our region is part of a statewide network that empowers and equips students to develop and strengthen their leadership skills through conferences, events, recognition programs, and networking opportunities.</p>
            </div>
            <div className="about-logo">
              <img src="/assets/img/logo.png" alt="PASC Region J Logo" className={`large-logo ${isPlaying ? 'rotating' : ''}`} />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-box">
              <h2>Mission</h2>
              <p>The Pennsylvania Association of Student Councils develops and elevates leaders by providing opportunities, training, networking, civic engagement, recognition, and resources necessary for students and advisors to engage in their schools, communities, and world.</p>
            </div>
            <div className="vision-box">
              <h2>Vision</h2>
              <p>The Pennsylvania Association of Student Councils envisions leaders being inspired, confident, and empowered to use their voices and put their skills into action for good in their schools, communities, and world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="what-we-do">
        <div className="container">
          <h2 className="section-title">What We Do</h2>
          <p className="section-intro">PASC Region J provides year-round opportunities for students and advisors to develop and apply leadership skills in order to improve themselves, their schools, and their communities.</p>

          <div className="activities-grid">
            <div className="activity-card">
              <img src="/assets/img/gallery/f2.jpg" alt="Students holding PASC sign" />
              <h3>Conferences & Events</h3>
              <p>We host regional conferences that bring together student leaders from across Districts 11 and 12. Our annual conference features inspiring keynote speakers, interactive workshops, and networking opportunities.</p>
            </div>

            <div className="activity-card">
              <img src="/assets/img/gallery/f3.jpg" alt="Students at registration" />
              <h3>Leadership Development</h3>
              <p>Through workshops, training sessions, and hands-on activities, we help students develop essential leadership skills including communication, collaboration, problem-solving, and civic engagement.</p>
            </div>

            <div className="activity-card">
              <img src="/assets/img/gallery/f1.jpg" alt="Students collaborating" />
              <h3>Networking & Connection</h3>
              <p>Connect with fellow student leaders, share ideas, and build lasting relationships. Our events provide forums and opportunities for students and advisors to collaborate and learn from one another.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Reach for the Stars, Lead Beyond Limits?</h2>
          <p>Join us for an inspiring day of leadership, workshops, and networking!</p>
          <div className="cta-buttons">
            <Link to="/workshops" className="btn btn-primary">View Workshops</Link>
            <Link to="/gallery" className="btn btn-secondary">View Gallery</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;
