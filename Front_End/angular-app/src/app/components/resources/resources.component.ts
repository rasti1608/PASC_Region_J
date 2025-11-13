import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AudioService } from '../../services/audio.service';
import { Document, PageContent } from '../../models/api-models';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroVideoDesktop', { static: false }) heroVideoDesktop!: ElementRef<HTMLVideoElement>;
  @ViewChild('heroVideoMobile', { static: false }) heroVideoMobile!: ElementRef<HTMLVideoElement>;
  @ViewChild('anthemAudio', { static: false }) anthemAudio!: ElementRef<HTMLAudioElement>;
  @ViewChild('anthemSectionVideo', { static: false }) anthemSectionVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('anthemPlayerVideo', { static: false}) anthemPlayerVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('cinemaSpaceBg', { static: false }) cinemaSpaceBg!: ElementRef<HTMLVideoElement>;
  @ViewChild('progressBar', { static: false }) progressBar!: ElementRef<HTMLDivElement>;

  private apiService = inject(ApiService);
  private audioService = inject(AudioService);

  documents = signal<Document[]>([]);
  pageContent = signal<PageContent | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // Anthem player state
  isAnthemPlaying = signal(false);
  anthemProgress = signal(0);
  anthemCurrentTime = signal(0);
  anthemDuration = signal(0);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.loadPageContent();
    this.loadDocuments();
    this.setupAudioSubscription();
  }

  ngAfterViewInit(): void {
    // Explicitly ensure hero videos are muted
    if (this.heroVideoDesktop?.nativeElement) {
      this.heroVideoDesktop.nativeElement.muted = true;
      this.heroVideoDesktop.nativeElement.volume = 0;
    }
    if (this.heroVideoMobile?.nativeElement) {
      this.heroVideoMobile.nativeElement.muted = true;
      this.heroVideoMobile.nativeElement.volume = 0;
    }

    // Mute cinema background video
    if (this.cinemaSpaceBg?.nativeElement) {
      this.cinemaSpaceBg.nativeElement.muted = true;
      this.cinemaSpaceBg.nativeElement.volume = 0;
    }

    // Explicitly ensure anthem videos are muted
    if (this.anthemSectionVideo?.nativeElement) {
      this.anthemSectionVideo.nativeElement.muted = true;
      this.anthemSectionVideo.nativeElement.volume = 0;
    }
    if (this.anthemPlayerVideo?.nativeElement) {
      this.anthemPlayerVideo.nativeElement.muted = true;
      this.anthemPlayerVideo.nativeElement.volume = 0;
    }

    this.controlVideoPlayback(this.audioService.isPlaying());
    this.setupAnthemPlayerListeners();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    // Stop anthem if playing
    if (this.anthemAudio && !this.anthemAudio.nativeElement.paused) {
      this.anthemAudio.nativeElement.pause();
    }
  }

  private setupAudioSubscription(): void {
    const playingSub = this.audioService.isPlaying$.subscribe(playing => {
      this.controlVideoPlayback(playing);
    });
    this.subscriptions.push(playingSub);
  }

  private controlVideoPlayback(shouldPlay: boolean): void {
    [this.heroVideoDesktop, this.heroVideoMobile].forEach(videoRef => {
      if (videoRef && videoRef.nativeElement) {
        if (shouldPlay) {
          videoRef.nativeElement.play().catch(() => {});
        } else {
          videoRef.nativeElement.pause();
        }
      }
    });
  }

  private setupAnthemPlayerListeners(): void {
    if (!this.anthemAudio) return;

    const audio = this.anthemAudio.nativeElement;

    // Update progress bar and time
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        this.anthemProgress.set(progress);
        this.anthemCurrentTime.set(audio.currentTime);
      }
    });

    // Set duration when metadata loads
    audio.addEventListener('loadedmetadata', () => {
      this.anthemDuration.set(audio.duration);
    });

    // Update playing state
    audio.addEventListener('play', () => {
      this.isAnthemPlaying.set(true);
      // Pause global background music
      if (this.audioService.isPlaying()) {
        this.audioService.pause();
      }
      // Play anthem videos
      if (this.anthemSectionVideo) {
        this.anthemSectionVideo.nativeElement.play().catch(() => {});
      }
      if (this.anthemPlayerVideo) {
        this.anthemPlayerVideo.nativeElement.play().catch(() => {});
      }
    });

    audio.addEventListener('pause', () => {
      this.isAnthemPlaying.set(false);
      // Pause anthem videos
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
    });
  }

  toggleAnthemPlayback(): void {
    if (!this.anthemAudio) return;

    const audio = this.anthemAudio.nativeElement;
    if (audio.paused) {
      audio.play().catch(err => console.log('Anthem audio play failed:', err));
    } else {
      audio.pause();
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

  private loadPageContent() {
    this.apiService.getPageContent('resources').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.pageContent.set(response.data);
        }
      },
      error: (err) => {
        console.error('Error loading page content:', err);
      }
    });
  }

  private loadDocuments() {
    this.loading.set(true);
    this.apiService.getDocuments().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.documents.set(response.data);
        } else {
          this.error.set('Failed to load documents');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading documents:', err);
        this.error.set('Failed to load documents');
        this.loading.set(false);
      }
    });
  }
}
