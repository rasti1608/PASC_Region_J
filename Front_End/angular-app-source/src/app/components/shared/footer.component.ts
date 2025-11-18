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
              <li><a routerLink="/about">About</a></li>
              <li><a routerLink="/gallery">Gallery</a></li>
              <li><a routerLink="/workshops">Workshops</a></li>
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
            <h4>Conference 2026</h4>
            <p><strong>Date:</strong> February 13, 2026</p>
            <p><strong>Location:</strong> Neshaminy High School, Langhorne, PA</p>
            <p><strong>Email:</strong> <a href="mailto:info@pascregionj.com">info@pascregionj.com</a></p>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} PASC Region J. All rights reserved.</p>
          <p class="footer-credit">Powered by Angular & ColdFusion</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
      color: #e0e0e0;
      padding: 60px 20px 20px;
      border-top: 1px solid rgba(79, 195, 247, 0.3);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      margin-bottom: 40px;
    }

    .footer-column h3 {
      color: #4fc3f7;
      margin-bottom: 15px;
      font-size: 1.5rem;
    }

    .footer-column h4 {
      color: #4fc3f7;
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
      color: #4fc3f7;
    }

    .footer-bottom {
      text-align: center;
      padding-top: 30px;
      border-top: 1px solid rgba(79, 195, 247, 0.2);
    }

    .footer-bottom p {
      margin: 5px 0;
      color: #888;
      font-size: 0.9rem;
    }

    .footer-credit {
      font-size: 0.85rem;
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
