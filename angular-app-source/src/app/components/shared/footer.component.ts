import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-column">
            <h3>PASC Region J</h3>
            <p>Pennsylvania Association of Student Councils - Region J</p>
            <p class="footer-tagline">Reach for the Stars, Lead Beyond Limits</p>
          </div>

          <div class="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/register">Registration</a></li>
              <li><a routerLink="/workshops">Workshops</a></li>
              <li><a routerLink="/schedule">Schedule</a></li>
            </ul>
          </div>

          <div class="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a routerLink="/resources">Downloads</a></li>
              <li><a routerLink="/contact">Contact Us</a></li>
            </ul>
          </div>

          <div class="footer-column">
            <h4>Conference Info</h4>
            <p><strong>Date:</strong> February 13, 2026</p>
            <p><strong>Location:</strong> Neshaminy High School, Langhorne, PA 19047</p>
            <p><strong>Email: </strong><a href="mailto:info@pascregionj.com">info@pascregionj.com</a></p>
          </div>
        </div>

        <div class="footer-bottom">
          <p>Region J Conference presented by Neshaminy High School Student Council</p>
          <p>&copy; 2025-2026 Created by Rastislav & Oliver Toscak <a routerLink="/admin" class="admin-link" title="Admin Login">admin</a></p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
      color: #e0e0e0;
      padding: 60px 20px 20px;
      border-top: 1px solid rgba(255, 140, 0, 0.3);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      margin-bottom: 40px;
    }

    .footer-column h3 {
      color: #FF8C00;
      margin-bottom: 15px;
      font-size: 1.5rem;
    }

    .footer-column h4 {
      color: #FF8C00;
      margin-bottom: 15px;
      font-size: 1.1rem;
    }

    .footer-column p {
      margin: 8px 0;
      line-height: 1.6;
      color: #b0b0b0;
    }

    .footer-tagline {
      font-style: italic;
      color: #ffd700;
    }

    .footer-column ul {
      list-style: none;
      padding: 0;
    }

    .footer-column ul li {
      margin-bottom: 10px;
    }

    .footer-column a {
      color: #e0e0e0;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-column a:hover {
      color: #FF8C00;
    }

    .footer-bottom {
      text-align: center;
      padding-top: 30px;
      border-top: 1px solid rgba(255, 140, 0, 0.2);
    }

    .footer-bottom p {
      margin: 5px 0;
      color: #aaa;
      font-size: 0.9rem;
    }

    .admin-link {
      font-size: 0.8em;
      color: #666;
      margin-left: 1rem;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .admin-link:hover {
      color: #FF8C00;
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 30px;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
