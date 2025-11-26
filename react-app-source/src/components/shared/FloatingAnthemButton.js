import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAudio } from '../../contexts/AudioContext';

const STORAGE_KEY = 'pasc_anthem_position';

function FloatingAnthemButton() {
  const location = useLocation();
  const { isPlaying: isBackgroundPlaying, pause: pauseBackground, play: playBackground } = useAudio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnthemPlaying, setIsAnthemPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const cinemaSpaceBgRef = useRef(null);
  const anthemSectionVideoRef = useRef(null);
  const anthemPlayerVideoRef = useRef(null);
  const progressBarRef = useRef(null);
  const wasBackgroundPlayingRef = useRef(false);
  const lastPlaybackPositionRef = useRef(0);

  // Check if anthem button should be shown
  const shouldShow = typeof window !== 'undefined' && window.SHOW_ANTHEM_BUTTON === 1;

  // Hide on intro/pre-intro/admin pages
  const hideRoutes = ['/pre-intro', '/intro', '/admin'];
  const isHiddenRoute = hideRoutes.some(route => location.pathname.startsWith(route));

  // Load playback position on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem(STORAGE_KEY);
    if (savedPosition) {
      lastPlaybackPositionRef.current = parseFloat(savedPosition);
    }
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  };

  const playAllVideos = useCallback(() => {
    [cinemaSpaceBgRef, anthemSectionVideoRef, anthemPlayerVideoRef].forEach(ref => {
      if (ref.current) {
        ref.current.muted = true;
        ref.current.volume = 0;
        ref.current.play().catch(() => {});
      }
    });
  }, []);

  const pauseAllVideos = useCallback(() => {
    [cinemaSpaceBgRef, anthemSectionVideoRef, anthemPlayerVideoRef].forEach(ref => {
      if (ref.current) ref.current.pause();
    });
  }, []);

  const openModal = () => {
    setIsModalOpen(true);

    // Store background music state and pause it
    wasBackgroundPlayingRef.current = isBackgroundPlaying;
    if (isBackgroundPlaying) {
      pauseBackground();
    }

    // Start videos and audio after a short delay
    setTimeout(() => {
      playAllVideos();

      if (audioRef.current) {
        // Resume from last position
        if (lastPlaybackPositionRef.current > 0) {
          audioRef.current.currentTime = lastPlaybackPositionRef.current;
        }
        audioRef.current.play()
          .then(() => setIsAnthemPlaying(true))
          .catch(err => console.log('Anthem auto-play failed:', err));
      }
    }, 100);
  };

  const closeModal = () => {
    setIsModalOpen(false);

    // Save playback position
    if (audioRef.current) {
      lastPlaybackPositionRef.current = audioRef.current.currentTime;
      localStorage.setItem(STORAGE_KEY, lastPlaybackPositionRef.current.toString());
      audioRef.current.pause();
    }

    pauseAllVideos();
    setIsAnthemPlaying(false);

    // Resume background music if it was playing
    if (wasBackgroundPlayingRef.current) {
      playBackground();
      wasBackgroundPlayingRef.current = false;
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
      setIsAnthemPlaying(true);
      playAllVideos();
    } else {
      audioRef.current.pause();
      setIsAnthemPlaying(false);
      pauseAllVideos();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const prog = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(prog);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsAnthemPlaying(false);
    setProgress(0);
    lastPlaybackPositionRef.current = 0;
    localStorage.removeItem(STORAGE_KEY);
  };

  const seekAudio = (e) => {
    if (!audioRef.current || !progressBarRef.current) return;
    // Don't seek if duration is not available
    if (!audioRef.current.duration || isNaN(audioRef.current.duration)) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * audioRef.current.duration;
    if (isFinite(seekTime)) {
      audioRef.current.currentTime = seekTime;
    }
  };

  if (!shouldShow || isHiddenRoute) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        className="floating-anthem-btn"
        onClick={openModal}
        title="Conference Anthem"
      >
        <span className="anthem-icon">&#127925;</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <>
          {/* Overlay - NO click handler, only X button closes modal */}
          <div className="anthem-modal-overlay"></div>

          {/* Modal Container */}
          <div className="anthem-modal-container">
            {/* Close Button */}
            <button className="anthem-modal-close" onClick={closeModal} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Cinema Theater Wrapper */}
            <div className="cinema-theater-wrapper">
              {/* Static Space Background */}
              <video
                ref={cinemaSpaceBgRef}
                className="cinema-space-bg"
                muted
                loop
                playsInline
                autoPlay
              >
                <source src="/assets/video/intro-space-background.mp4" type="video/mp4" />
              </video>

              {/* Dark Vignette */}
              <div className="cinema-vignette"></div>

              <section className="anthem-section">
                {/* Section Background Video */}
                <video
                  ref={anthemSectionVideoRef}
                  className="anthem-section-video"
                  muted
                  loop
                  playsInline
                >
                  <source src="/assets/video/resources-background.mp4" type="video/mp4" />
                </video>

                <div className="container">
                  {/* Cinema Screen Frame */}
                  <div className="cinema-screen-frame">
                    <div className="anthem-featured">
                      {/* Singer Background Video */}
                      <video
                        ref={anthemPlayerVideoRef}
                        className="anthem-player-video"
                        muted
                        loop
                        playsInline
                      >
                        <source src="/assets/video/conference-anthem-background.mp4" type="video/mp4" />
                      </video>

                      <div className="anthem-header">
                        <h2>Conference Anthem</h2>
                        <div className="anthem-info">
                          <h3 className="song-title">One Orbit</h3>
                          <p className="song-artist">by IronRUST</p>
                          <p className="song-description">
                            Official theme song for PASC Region J Conference 2026:
                            Reach for the stars, lead beyond limits!
                          </p>
                        </div>
                      </div>

                      {/* Audio Player */}
                      <div className="custom-audio-player">
                        <audio
                          ref={audioRef}
                          preload="metadata"
                          loop
                          onTimeUpdate={handleTimeUpdate}
                          onLoadedMetadata={handleLoadedMetadata}
                          onEnded={handleEnded}
                          onPlay={() => setIsAnthemPlaying(true)}
                          onPause={() => setIsAnthemPlaying(false)}
                        >
                          <source src="/assets/audio/one-orbit-anthem.mp3" type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>

                        <div className="player-controls">
                          <button
                            className="play-pause-btn"
                            aria-label="Play/Pause"
                            onClick={togglePlayback}
                          >
                            {!isAnthemPlaying ? (
                              <svg className="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            ) : (
                              <svg className="pause-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                              </svg>
                            )}
                          </button>

                          <div className="player-info">
                            <div className="progress-container">
                              <div
                                className="progress-bar"
                                ref={progressBarRef}
                                onClick={seekAudio}
                              >
                                <div
                                  className="progress-fill"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="time-display">
                              <span>{formatTime(currentTime)}</span>
                              <span className="time-separator">/</span>
                              <span>{formatTime(duration)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Download Links */}
                        <div className="anthem-download-links">
                          <a
                            href="/assets/audio/one-orbit-anthem-full.mp3"
                            download="one-orbit-anthem-full.mp3"
                            className="download-link"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            <span>Download MP3</span>
                          </a>
                          <span className="download-separator">&bull;</span>
                          <a
                            href="/assets/audio/instrumental_background.mp3"
                            download="instrumental_background.mp3"
                            className="download-link"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            <span>Download Instrumental</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default FloatingAnthemButton;
