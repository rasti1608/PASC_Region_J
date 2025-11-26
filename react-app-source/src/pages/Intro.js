import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../contexts/AudioContext';

function Intro() {
  const navigate = useNavigate();
  const { play } = useAudio();
  const introVideoDesktopRef = useRef(null);
  const introVideoMobileRef = useRef(null);
  const introTimeoutRef = useRef(null);
  const starsRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const completeIntro = useCallback(() => {
    // Clear timeout
    if (introTimeoutRef.current) {
      clearTimeout(introTimeoutRef.current);
    }

    // Stop intro video audio
    const desktopVideo = introVideoDesktopRef.current;
    const mobileVideo = introVideoMobileRef.current;

    if (desktopVideo) {
      desktopVideo.pause();
      desktopVideo.muted = true;
    }
    if (mobileVideo) {
      mobileVideo.pause();
      mobileVideo.muted = true;
    }

    // Mark intro as seen
    sessionStorage.setItem('introSeen', 'true');

    // Start background music
    play().catch(err => {
      console.log('Audio autoplay prevented:', err);
    });

    // Navigate to home page
    navigate('/home');
  }, [navigate, play]);

  useEffect(() => {
    // Generate stars
    const starsContainer = starsRef.current;
    if (starsContainer && starsContainer.children.length === 0) {
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starsContainer.appendChild(star);
      }
    }

    // Start intro sequence
    const isMobile = window.innerWidth <= 768;
    const activeVideo = isMobile ? introVideoMobileRef.current : introVideoDesktopRef.current;

    if (activeVideo) {
      // First try unmuted (for audio)
      activeVideo.muted = false;
      activeVideo.play().then(() => {
        setIsLoaded(true);
      }).catch(err => {
        console.log('Video autoplay with audio prevented:', err);
        // Fallback to muted
        activeVideo.muted = true;
        activeVideo.play().then(() => {
          setIsLoaded(true);
        });
      });
    } else {
      // No video, show content anyway
      setIsLoaded(true);
    }

    // Auto-complete intro after 10 seconds
    introTimeoutRef.current = setTimeout(() => {
      completeIntro();
    }, 10000);

    return () => {
      if (introTimeoutRef.current) {
        clearTimeout(introTimeoutRef.current);
      }
    };
  }, [completeIntro]);

  const handleSkipClick = () => {
    completeIntro();
  };

  return (
    <div id="intro-splash" className={isLoaded ? 'loaded' : ''}>
      {/* Intro Video Backgrounds WITH AUDIO */}
      <video
        ref={introVideoDesktopRef}
        id="introVideoDesktop"
        className="intro-video intro-video-desktop"
        muted
        loop
        playsInline
      >
        <source src="/assets/video/intro-space-background.mp4" type="video/mp4" />
      </video>

      <video
        ref={introVideoMobileRef}
        id="introVideoMobile"
        className="intro-video intro-video-mobile"
        muted
        loop
        playsInline
      >
        <source src="/assets/video/intro-space-background_M.mp4" type="video/mp4" />
      </video>

      <div className="stars" id="stars" ref={starsRef}></div>

      <div className="planet-container">
        <div className="orbit orbit-1">
          <div className="planet planet-1">
            <img src="/assets/img/orbit-planet-1.png" alt="Moon" />
          </div>
        </div>
        <div className="orbit orbit-2">
          <div className="planet planet-2">
            <img src="/assets/img/orbit-planet-2.png" alt="Earth" />
          </div>
        </div>
        <div className="orbit orbit-3">
          <div className="planet planet-3">
            <img src="/assets/img/orbit-planet-3.png" alt="Mars" />
          </div>
        </div>
        <div className="orbit orbit-4">
          <div className="planet planet-4">
            <img src="/assets/img/orbit-planet-4.png" alt="Saturn" />
          </div>
        </div>
        <div className="center-logo"></div>
      </div>

      <div className="intro-text">
        <h1 className="intro-title">PASC REGION <span className="special-j">J</span></h1>
        <p className="intro-subtitle">Reach for the Stars, Lead Beyond Limits</p>
        <p className="intro-date">February 13, 2026</p>
        <p className="intro-date" style={{ marginTop: '10px', fontSize: '1rem', color: '#FF8C00' }}>
          Hosted by Neshaminy High School
        </p>
      </div>

      <button className="skip-btn" onClick={handleSkipClick}>Skip Intro &rarr;</button>
    </div>
  );
}

export default Intro;
