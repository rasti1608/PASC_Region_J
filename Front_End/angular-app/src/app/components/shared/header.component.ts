import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AudioService } from '../../services/audio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="main-nav">
      <div class="nav-container">
        <div class="logo">
          <a routerLink="/home">
            <img
              src="/assets/img/logo.png"
              alt="PASC Region J"
              class="logo-img"
              id="navLogo"
              [class.rotating]="isPlaying()">
            <span class="logo-text">PASC REGION J</span>
          </a>
        </div>

        <ul class="nav-menu" [class.active]="mobileMenuOpen()">
          <li><a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobileMenu()">Home</a></li>
          <li><a routerLink="/about" routerLinkActive="active" (click)="closeMobileMenu()">About</a></li>
          <li><a routerLink="/gallery" routerLinkActive="active" (click)="closeMobileMenu()">Gallery</a></li>
          <li><a routerLink="/register" routerLinkActive="active" (click)="closeMobileMenu()">Registration</a></li>
          <li><a routerLink="/workshops" routerLinkActive="active" (click)="closeMobileMenu()">Workshops</a></li>
          <li><a routerLink="/contact" routerLinkActive="active" (click)="closeMobileMenu()">Contact</a></li>
          <li><a routerLink="/resources" routerLinkActive="active" (click)="closeMobileMenu()">Resources</a></li>
        </ul>

        <!-- Mute Toggle Button -->
        <button
          class="mute-toggle-btn"
          id="muteToggleBtn"
          (click)="togglePlayback()"
          title="Mute/Unmute"
          [class.playing]="isPlaying()"
          [class.muted]="!isPlaying()">
          <span class="mute-icon" id="muteIcon">{{ isPlaying() ? '&#128266;' : '&#128263;' }}</span>
          <span class="mute-label" id="muteLabel">{{ isPlaying() ? 'MUTE' : 'UNMUTE' }}</span>
        </button>

        <!-- Mobile menu toggle button -->
        <button class="mobile-menu-toggle" aria-label="Toggle menu" (click)="toggleMobileMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    /* All styles are in global CSS files: style.css, anthem-player.css */
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  mobileMenuOpen = signal(false);
  isPlaying = signal(false);
  isMuted = signal(false);

  private subscriptions: Subscription[] = [];

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    // Subscribe to audio playing state
    const playingSub = this.audioService.isPlaying$.subscribe(playing => {
      this.isPlaying.set(playing);
    });

    // Subscribe to audio muted state
    const mutedSub = this.audioService.isMuted$.subscribe(muted => {
      this.isMuted.set(muted);
    });

    this.subscriptions.push(playingSub, mutedSub);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(value => !value);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  togglePlayback() {
    this.audioService.toggle();
  }
}
