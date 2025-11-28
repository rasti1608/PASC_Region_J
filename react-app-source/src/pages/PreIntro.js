import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function PreIntro() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    // Check if user has already seen the intro sequence
    const introSeen = sessionStorage.getItem('introSeen');
    if (introSeen === 'true') {
      navigate('/home');
      return;
    }

    // Force video to play
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.autoplay = true;
      video.loop = true;

      video.play().catch(error => {
        console.error('Video autoplay failed:', error);
        // Try again after user interaction
        document.addEventListener('click', () => {
          video.play();
        }, { once: true });
      });
    }
  }, [navigate]);

  const handleLaunchClick = () => {
    navigate('/intro');
  };

  return (
    <div id="pre-intro-splash">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="pre-intro-bg-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={`${process.env.PUBLIC_URL}/assets/video/intro-space-background.mp4`} type="video/mp4" />
      </video>

      <div className="pre-intro-content">
        <img src={`${process.env.PUBLIC_URL}/assets/img/logo.png`} alt="PASC Region J" className="pre-intro-logo" />
        <h1 className="pre-intro-title">PASC REGION <span className="special-j">J</span></h1>
        <p className="pre-intro-subtitle">Leadership Conference 2026</p>
        <p className="pre-intro-date">Reach for the Stars, Lead Beyond Limits - February 13, 2026</p>

        <button className="launch-button" onClick={handleLaunchClick}>
          <span className="rocket-icon">&#128640;</span>
          <span>LAUNCH SITE</span>
        </button>
      </div>
    </div>
  );
}

export default PreIntro;
