import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AudioService } from '../../services/audio.service';
import { Announcement } from '../../models/api-models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroVideoDesktop', { static: false }) heroVideoDesktop!: ElementRef<HTMLVideoElement>;
  @ViewChild('heroVideoMobile', { static: false }) heroVideoMobile!: ElementRef<HTMLVideoElement>;

  private apiService = inject(ApiService);
  private audioService = inject(AudioService);

  announcements = signal<Announcement[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.loadAnnouncements();
    this.setupAudioSubscription();
  }

  ngAfterViewInit(): void {
    // Initial video control based on current audio state
    this.controlVideoPlayback(this.audioService.isPlaying() && !this.audioService.isMuted());
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Set up subscription to audio service to control video playback
   */
  private setupAudioSubscription(): void {
    // Subscribe to both playing and muted states
    const playingSub = this.audioService.isPlaying$.subscribe(playing => {
      const isMuted = this.audioService.isMuted();
      this.controlVideoPlayback(playing && !isMuted);
    });

    const mutedSub = this.audioService.isMuted$.subscribe(muted => {
      const isPlaying = this.audioService.isPlaying();
      this.controlVideoPlayback(isPlaying && !muted);
    });

    this.subscriptions.push(playingSub, mutedSub);
  }

  /**
   * Control hero video playback
   */
  private controlVideoPlayback(shouldPlay: boolean): void {
    if (this.heroVideoDesktop && this.heroVideoDesktop.nativeElement) {
      if (shouldPlay) {
        this.heroVideoDesktop.nativeElement.play().catch(err => {
          console.log('Video autoplay prevented:', err);
        });
      } else {
        this.heroVideoDesktop.nativeElement.pause();
      }
    }

    if (this.heroVideoMobile && this.heroVideoMobile.nativeElement) {
      if (shouldPlay) {
        this.heroVideoMobile.nativeElement.play().catch(err => {
          console.log('Video autoplay prevented:', err);
        });
      } else {
        this.heroVideoMobile.nativeElement.pause();
      }
    }
  }

  private loadAnnouncements() {
    this.loading.set(true);
    this.apiService.getAnnouncements().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.announcements.set(response.data);
        } else {
          this.error.set('Failed to load announcements');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading announcements:', err);
        this.error.set('Failed to load announcements');
        this.loading.set(false);
      }
    });
  }
}
