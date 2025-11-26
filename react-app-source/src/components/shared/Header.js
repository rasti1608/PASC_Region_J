import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAudio } from '../../contexts/AudioContext';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isPlaying, toggle } = useAudio();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleTogglePlayback = () => {
    // toggle() may return a promise, handle it gracefully
    const result = toggle();
    if (result && typeof result.catch === 'function') {
      result.catch(err => {
        console.log('Audio toggle prevented:', err);
      });
    }
  };

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="logo">
          <Link to="/home">
            <img
              src="/assets/img/logo.png"
              alt="PASC Region J"
              className={`logo-img ${isPlaying ? 'rotating' : ''}`}
              id="navLogo"
            />
            <span className="logo-text">PASC REGION J</span>
          </Link>
        </div>

        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>
              Registration
            </NavLink>
          </li>
          <li>
            <NavLink to="/workshops" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>
              Workshops
            </NavLink>
          </li>
          <li>
            <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>
              Schedule
            </NavLink>
          </li>
          <li>
            <NavLink to="/gallery" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>
              Gallery
            </NavLink>
          </li>
          <li>
            <NavLink to="/resources" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>
              Resources
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Mute Toggle Button */}
        <button
          className={`mute-toggle-btn ${isPlaying ? 'playing' : 'muted'}`}
          id="muteToggleBtn"
          onClick={handleTogglePlayback}
          title="Mute/Unmute"
        >
          <span className="mute-icon" id="muteIcon" dangerouslySetInnerHTML={{ __html: isPlaying ? '&#128266;' : '&#128263;' }} />
          <span className="mute-label" id="muteLabel">
            {isPlaying ? 'MUTE' : 'UNMUTE'}
          </span>
        </button>

        {/* Mobile menu toggle button */}
        <button
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          aria-label="Toggle menu"
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Header;
