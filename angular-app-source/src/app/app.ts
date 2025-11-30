import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/shared/header.component';
import { FooterComponent } from './components/shared/footer.component';
import { AiChatComponent } from './components/ai-chat/ai-chat.component';
import { FaviconService } from './core/services/favicon.service';
import { AudioService } from './services/audio.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, AiChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('anthemAudio', { static: false }) anthemAudio!: ElementRef<HTMLAudioElement>;
  @ViewChild('anthemSectionVideo', { static: false }) anthemSectionVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('anthemPlayerVideo', { static: false}) anthemPlayerVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('cinemaSpaceBg', { static: false }) cinemaSpaceBg!: ElementRef<HTMLVideoElement>;
  @ViewChild('progressBar', { static: false }) progressBar!: ElementRef<HTMLDivElement>;

  showHeaderFooter = signal(true);

  // Check if anthem button should be shown (reads from window flag)
  get shouldShowAnthemButton(): boolean {
    return typeof window !== 'undefined' && (window as any).SHOW_ANTHEM_BUTTON === 1;
  }

  // Anthem player state
  isAnthemPlaying = signal(false);
  anthemProgress = signal(0);
  anthemCurrentTime = signal(0);
  anthemDuration = signal(0);
  isAnthemModalOpen = signal(false);

  // Store audio state before modal opens
  private wasBackgroundMusicPlaying = false;

  // Store last playback position for resume
  private lastPlaybackPosition = 0;

  // localStorage key for playback position
  private readonly STORAGE_KEY = 'pasc_anthem_position';

  constructor(
    private router: Router,
    private faviconService: FaviconService,
    private audioService: AudioService
  ) {}

  // Bound event handler for anthem modal custom event
  private anthemModalHandler = () => this.openAnthemModal();

  ngOnInit(): void {
    // Initialize favicon service
    this.faviconService.initialize();

    // Load playback position from localStorage
    this.loadPlaybackPosition();

    // Listen for custom event from AI chat to open anthem modal
    window.addEventListener('openAnthemModal', this.anthemModalHandler);

    // Pause music when navigating to admin routes
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: any) => {
        const url = event.url;

        // Pause audio when navigating to admin pages
        if (url.startsWith('/admin')) {
          this.audioService.pause();
        }
      });

    // Listen to router events to determine if we should show header/footer
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;

        // CRITICAL: Force INSTANT scroll to absolute top on every navigation
        // Use { behavior: 'auto' } to override CSS scroll-behavior: smooth
        // This ensures immediate jump to top before component renders / CORRECTED
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;

        // Hide header/footer on intro pages and admin pages
        const hideRoutes = ['/pre-intro', '/intro', '/admin'];
        this.showHeaderFooter.set(!hideRoutes.some(route => url.startsWith(route)));
      });
  }

  ngAfterViewInit(): void {
    // Anthem player listeners are set up when modal opens
  }

  ngOnDestroy(): void {
    // Stop anthem if playing
    if (this.anthemAudio && !this.anthemAudio.nativeElement.paused) {
      this.anthemAudio.nativeElement.pause();
    }

    // Remove custom event listener
    window.removeEventListener('openAnthemModal', this.anthemModalHandler);
  }

  private loadPlaybackPosition(): void {
    // Load last playback position from localStorage
    const savedPosition = localStorage.getItem(this.STORAGE_KEY);
    if (savedPosition) {
      this.lastPlaybackPosition = parseFloat(savedPosition);
    }
  }

  private setupAnthemPlayerListeners(): void {
    if (!this.anthemAudio) return;

    const audio = this.anthemAudio.nativeElement;

    // Update progress bar and time
    audio.addEventListener('timeupdate', () => {
      if (audio.duration && !isNaN(audio.duration)) {
        const progress = (audio.currentTime / audio.duration) * 100;
        this.anthemProgress.set(progress);
        this.anthemCurrentTime.set(audio.currentTime);

        // Ensure duration is set (in case metadata loaded during playback)
        if (this.anthemDuration() === 0) {
          this.anthemDuration.set(audio.duration);
        }
      }
    });

    // Set duration when metadata loads
    audio.addEventListener('loadedmetadata', () => {
      this.anthemDuration.set(audio.duration);
    });

    // Check if duration is already available (metadata already loaded)
    if (audio.duration && !isNaN(audio.duration)) {
      this.anthemDuration.set(audio.duration);
    }

    // Update playing state
    audio.addEventListener('play', () => {
      this.isAnthemPlaying.set(true);
      // Pause global background music
      if (this.audioService.isPlaying()) {
        this.audioService.pause();
      }
      // Play all background videos
      if (this.cinemaSpaceBg) {
        this.cinemaSpaceBg.nativeElement.play().catch(() => {});
      }
      if (this.anthemSectionVideo) {
        this.anthemSectionVideo.nativeElement.play().catch(() => {});
      }
      if (this.anthemPlayerVideo) {
        this.anthemPlayerVideo.nativeElement.play().catch(() => {});
      }
    });

    audio.addEventListener('pause', () => {
      this.isAnthemPlaying.set(false);
      // Pause all background videos
      if (this.cinemaSpaceBg) {
        this.cinemaSpaceBg.nativeElement.pause();
      }
      if (this.anthemSectionVideo) {
        this.anthemSectionVideo.nativeElement.pause();
      }
      if (this.anthemPlayerVideo) {
        this.anthemPlayerVideo.nativeElement.pause();
      }
    });

    // Reset on end (for looping, this shouldn't trigger often)
    audio.addEventListener('ended', () => {
      this.isAnthemPlaying.set(false);
      this.anthemProgress.set(0);
      this.lastPlaybackPosition = 0; // Reset so next open starts from beginning
      localStorage.removeItem(this.STORAGE_KEY); // Clear saved position
    });
  }

  toggleAnthemPlayback(): void {
    if (!this.anthemAudio) return;

    const audio = this.anthemAudio.nativeElement;
    if (audio.paused) {
      // PLAY: Resume audio and all background videos
      audio.play().catch(err => console.log('Anthem audio play failed:', err));
      this.isAnthemPlaying.set(true);

      // Resume all background videos
      if (this.cinemaSpaceBg?.nativeElement) {
        this.cinemaSpaceBg.nativeElement.play().catch(() => {});
      }
      if (this.anthemSectionVideo?.nativeElement) {
        this.anthemSectionVideo.nativeElement.play().catch(() => {});
      }
      if (this.anthemPlayerVideo?.nativeElement) {
        this.anthemPlayerVideo.nativeElement.play().catch(() => {});
      }
    } else {
      // PAUSE: Stop audio and freeze all background videos
      audio.pause();
      this.isAnthemPlaying.set(false);

      // Freeze all background videos
      if (this.cinemaSpaceBg?.nativeElement) {
        this.cinemaSpaceBg.nativeElement.pause();
      }
      if (this.anthemSectionVideo?.nativeElement) {
        this.anthemSectionVideo.nativeElement.pause();
      }
      if (this.anthemPlayerVideo?.nativeElement) {
        this.anthemPlayerVideo.nativeElement.pause();
      }
    }
  }

  seekAnthemAudio(event: MouseEvent): void {
    if (!this.anthemAudio || !this.progressBar) return;

    const audio = this.anthemAudio.nativeElement;
    const progressBarEl = this.progressBar.nativeElement;
    const clickX = event.offsetX;
    const width = progressBarEl.offsetWidth;
    const seekTime = (clickX / width) * audio.duration;
    audio.currentTime = seekTime;
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  openAnthemModal(): void {
    this.isAnthemModalOpen.set(true);

    // Store background music state and pause it
    this.wasBackgroundMusicPlaying = this.audioService.isPlaying();
    if (this.wasBackgroundMusicPlaying) {
      this.audioService.pause();
    }

    // Stop/mute any intro or pre-intro audio
    const introAudio = document.querySelector('#introAudio, #preIntroAudio, audio[src*="intro"]') as HTMLAudioElement;
    if (introAudio && !introAudio.paused) {
      introAudio.pause();
      introAudio.currentTime = 0;
    }

    // Start modal animations and audio after a short delay
    setTimeout(() => {
      // Set up anthem player listeners every time modal opens
      // (audio element is recreated each time, so listeners must be reattached)
      this.setupAnthemPlayerListeners();

      // Ensure ALL background videos are completely muted
      if (this.cinemaSpaceBg?.nativeElement) {
        this.cinemaSpaceBg.nativeElement.muted = true;
        this.cinemaSpaceBg.nativeElement.volume = 0;
        this.cinemaSpaceBg.nativeElement.play().catch(() => {});
      }
      if (this.anthemSectionVideo?.nativeElement) {
        this.anthemSectionVideo.nativeElement.muted = true;
        this.anthemSectionVideo.nativeElement.volume = 0;
        this.anthemSectionVideo.nativeElement.play().catch(() => {});
      }
      if (this.anthemPlayerVideo?.nativeElement) {
        this.anthemPlayerVideo.nativeElement.muted = true;
        this.anthemPlayerVideo.nativeElement.volume = 0;
        this.anthemPlayerVideo.nativeElement.play().catch(() => {});
      }

      // Auto-play anthem audio (ONLY audio source that should have sound)
      if (this.anthemAudio?.nativeElement && this.anthemAudio.nativeElement.paused) {
        const audio = this.anthemAudio.nativeElement;

        // Ensure duration is set if metadata is already loaded
        if (audio.duration && !isNaN(audio.duration) && this.anthemDuration() === 0) {
          this.anthemDuration.set(audio.duration);
        }

        // Resume from last playback position
        if (this.lastPlaybackPosition > 0) {
          audio.currentTime = this.lastPlaybackPosition;
        }

        audio.play()
          .then(() => {
            // Explicitly set playing state when audio starts
            this.isAnthemPlaying.set(true);
            // Double-check duration is set after play starts
            if (audio.duration && !isNaN(audio.duration) && this.anthemDuration() === 0) {
              this.anthemDuration.set(audio.duration);
            }
          })
          .catch(err => {
            console.log('Anthem auto-play failed:', err);
            this.isAnthemPlaying.set(false);
          });
      }
    }, 100);
  }

  closeAnthemModal(): void {
    this.isAnthemModalOpen.set(false);

    // Save current playback position for resume (both memory and localStorage)
    if (this.anthemAudio?.nativeElement) {
      this.lastPlaybackPosition = this.anthemAudio.nativeElement.currentTime;
      // Persist to localStorage for cross-navigation resume
      localStorage.setItem(this.STORAGE_KEY, this.lastPlaybackPosition.toString());
    }

    // Pause anthem audio
    if (this.anthemAudio && !this.anthemAudio.nativeElement.paused) {
      this.anthemAudio.nativeElement.pause();
    }

    // Pause all background videos for performance
    if (this.cinemaSpaceBg?.nativeElement) {
      this.cinemaSpaceBg.nativeElement.pause();
    }
    if (this.anthemSectionVideo?.nativeElement) {
      this.anthemSectionVideo.nativeElement.pause();
    }
    if (this.anthemPlayerVideo?.nativeElement) {
      this.anthemPlayerVideo.nativeElement.pause();
    }

    // Resume background music if it was playing before
    if (this.wasBackgroundMusicPlaying) {
      this.audioService.play();
      this.wasBackgroundMusicPlaying = false;
    }
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    if (this.isAnthemModalOpen()) {
      this.closeAnthemModal();
    }
  }
}
