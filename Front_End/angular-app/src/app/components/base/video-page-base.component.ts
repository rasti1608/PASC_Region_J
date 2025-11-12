import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AudioService } from '../../services/audio.service';

/**
 * Base component for pages with hero videos that should be controlled
 * by the background music state
 */
@Component({
  template: '',
  standalone: true
})
export abstract class VideoPageBaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroVideoDesktop', { static: false }) heroVideoDesktop!: ElementRef<HTMLVideoElement>;
  @ViewChild('heroVideoMobile', { static: false }) heroVideoMobile!: ElementRef<HTMLVideoElement>;

  protected audioService = inject(AudioService);
  protected subscriptions: Subscription[] = [];

  ngAfterViewInit(): void {
    // Initial video control based on current audio state
    this.controlVideoPlayback(this.audioService.isPlaying() && !this.audioService.isMuted());

    // Set up subscription to audio service
    this.setupAudioSubscription();
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
  protected controlVideoPlayback(shouldPlay: boolean): void {
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
}
