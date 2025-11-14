import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css'
})
export class IntroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('introVideoDesktop', { static: false }) introVideoDesktop!: ElementRef<HTMLVideoElement>;
  @ViewChild('introVideoMobile', { static: false }) introVideoMobile!: ElementRef<HTMLVideoElement>;

  private introTimeout: any;

  constructor(
    private router: Router,
    private audioService: AudioService
  ) {}

  ngOnInit(): void {
    // Generate stars
    this.generateStars();
  }

  ngAfterViewInit(): void {
    // Start the intro sequence after view initialization
    this.startIntroSequence();
  }

  /**
   * Generate twinkling stars background
   */
  private generateStars(): void {
    const starsContainer = document.getElementById('stars');
    if (starsContainer) {
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
  }

  /**
   * Start the intro sequence
   */
  private startIntroSequence(): void {
    // Determine which video to use (desktop vs mobile)
    const isMobile = window.innerWidth <= 768;
    const activeVideo = isMobile ? this.introVideoMobile : this.introVideoDesktop;

    if (activeVideo && activeVideo.nativeElement) {
      // UNMUTE the video to play audio
      activeVideo.nativeElement.muted = false;

      // Play intro video with audio
      activeVideo.nativeElement.play().catch(err => {
        console.log('Video autoplay prevented:', err);
        // If autoplay fails, mute and try again
        activeVideo.nativeElement.muted = true;
        activeVideo.nativeElement.play();
      });
    }

    // Auto-complete intro after 10 seconds
    this.introTimeout = setTimeout(() => {
      this.completeIntro();
    }, 10000);
  }

  /**
   * Complete intro and navigate to home
   */
  private completeIntro(): void {
    // Clear timeout
    if (this.introTimeout) {
      clearTimeout(this.introTimeout);
    }

    // Stop intro video audio BEFORE navigating
    const desktopVideo = this.introVideoDesktop?.nativeElement;
    const mobileVideo = this.introVideoMobile?.nativeElement;

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

    // Start background music (instrumental loop)
    this.audioService.play().catch(err => {
      console.log('Audio autoplay prevented:', err);
    });

    // Navigate to home page
    this.router.navigate(['/home']);
  }

  /**
   * Handle "Skip" button click
   */
  onSkipClick(): void {
    this.completeIntro();
  }

  ngOnDestroy(): void {
    // Clean up timeout
    if (this.introTimeout) {
      clearTimeout(this.introTimeout);
    }
  }
}
