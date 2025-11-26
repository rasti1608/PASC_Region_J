import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-column">
            <h3>PASC Region J</h3>
            <p>Pennsylvania Association of Student Councils - Region J</p>
            <p className="footer-tagline">Reach for the Stars, Lead Beyond Limits</p>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/register">Registration</Link></li>
              <li><Link to="/workshops">Workshops</Link></li>
              <li><Link to="/schedule">Schedule</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/resources">Downloads</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Conference Info</h4>
            <p><strong>Date:</strong> February 13, 2026</p>
            <p><strong>Location:</strong> Neshaminy High School, Langhorne, PA 19047</p>
            <p><strong>Email: </strong><a href="mailto:info@pascregionj.com">info@pascregionj.com</a></p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Region J Conference presented by Neshaminy High School Student Council</p>
          <p>&copy; 2025-2026 Created by Rastislav & Oliver Toscak <Link to="/admin" className="admin-link" title="Admin Login">admin</Link></p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
