import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="site-header">
      <nav class="navbar">
        <div class="container nav-container">
          <a routerLink="/" class="logo">
            <span class="logo-text">PASC Region J</span>
            <span class="logo-subtitle">Conference 2026</span>
          </a>

          <button class="nav-toggle" (click)="toggleMobileMenu()" [attr.aria-expanded]="mobileMenuOpen()">
            <span class="hamburger"></span>
          </button>

          <ul class="nav-menu" [class.active]="mobileMenuOpen()">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobileMenu()">Home</a></li>
            <li><a routerLink="/about" routerLinkActive="active" (click)="closeMobileMenu()">About</a></li>
            <li><a routerLink="/gallery" routerLinkActive="active" (click)="closeMobileMenu()">Gallery</a></li>
            <li><a routerLink="/workshops" routerLinkActive="active" (click)="closeMobileMenu()">Workshops</a></li>
            <li><a routerLink="/resources" routerLinkActive="active" (click)="closeMobileMenu()">Resources</a></li>
            <li><a routerLink="/contact" routerLinkActive="active" (click)="closeMobileMenu()">Contact</a></li>
          </ul>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .site-header {
      background: linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%);
      border-bottom: 1px solid rgba(79, 195, 247, 0.3);
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }

    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
    }

    .logo {
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: #fff;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #4fc3f7;
    }

    .logo-subtitle {
      font-size: 0.75rem;
      color: #b0b0b0;
      margin-top: -5px;
    }

    .nav-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 10px;
    }

    .hamburger {
      display: block;
      width: 25px;
      height: 2px;
      background: #fff;
      position: relative;
      transition: background 0.3s ease;
    }

    .hamburger::before,
    .hamburger::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      background: #fff;
      transition: all 0.3s ease;
    }

    .hamburger::before {
      top: -8px;
    }

    .hamburger::after {
      bottom: -8px;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 10px;
    }

    .nav-menu li a {
      display: block;
      padding: 10px 20px;
      color: #e0e0e0;
      text-decoration: none;
      border-radius: 5px;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .nav-menu li a:hover {
      background: rgba(79, 195, 247, 0.2);
      color: #4fc3f7;
    }

    .nav-menu li a.active {
      background: #4fc3f7;
      color: #0a0e27;
    }

    @media (max-width: 768px) {
      .nav-toggle {
        display: block;
      }

      .nav-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: rgba(10, 14, 39, 0.98);
        border-top: 1px solid rgba(79, 195, 247, 0.3);
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }

      .nav-menu.active {
        max-height: 500px;
      }

      .nav-menu li a {
        border-radius: 0;
        border-bottom: 1px solid rgba(79, 195, 247, 0.1);
      }
    }
  `]
})
export class HeaderComponent {
  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(value => !value);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
