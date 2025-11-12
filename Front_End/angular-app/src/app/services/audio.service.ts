import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement;
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private isMutedSubject = new BehaviorSubject<boolean>(false);
  private keepAliveInterval: any;

  // Observable streams for components to subscribe to
  public isPlaying$: Observable<boolean> = this.isPlayingSubject.asObservable();
  public isMuted$: Observable<boolean> = this.isMutedSubject.asObservable();

  constructor() {
    // Initialize audio element
    this.audio = new Audio('/assets/audio/instrumental_background.mp3');
    this.audio.loop = true;
    this.audio.preload = 'auto';

    // Restore state from sessionStorage
    this.restoreState();

    // Set up event listeners
    this.setupEventListeners();

    // Set up keep-alive mechanism (check every 2 seconds)
    this.keepAliveInterval = setInterval(() => this.keepAlive(), 2000);

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
  }

  /**
   * Restore audio state from sessionStorage
   */
  private restoreState(): void {
    const anthemPlaying = sessionStorage.getItem('anthemPlaying') === 'true';
    const anthemPosition = parseFloat(sessionStorage.getItem('anthemPosition') || '0');
    const musicMuted = sessionStorage.getItem('musicMuted') === 'true';

    // Restore playback position
    if (anthemPosition > 0) {
      this.audio.currentTime = anthemPosition;
    }

    // Restore muted state
    this.audio.muted = musicMuted;
    this.isMutedSubject.next(musicMuted);

    // Restore playing state (but don't auto-play, wait for user interaction)
    if (anthemPlaying) {
      // Mark as "should be playing" but actual play() will happen on user interaction
      this.isPlayingSubject.next(true);
    }
  }

  /**
   * Set up audio event listeners
   */
  private setupEventListeners(): void {
    // Update state when audio starts playing
    this.audio.addEventListener('play', () => {
      this.isPlayingSubject.next(true);
      sessionStorage.setItem('anthemPlaying', 'true');
    });

    // Update state when audio is paused
    this.audio.addEventListener('pause', () => {
      this.isPlayingSubject.next(false);
      sessionStorage.setItem('anthemPlaying', 'false');
    });

    // Save position periodically
    this.audio.addEventListener('timeupdate', () => {
      sessionStorage.setItem('anthemPosition', this.audio.currentTime.toString());
    });

    // Handle audio ending (shouldn't happen with loop=true, but just in case)
    this.audio.addEventListener('ended', () => {
      this.isPlayingSubject.next(false);
      sessionStorage.setItem('anthemPlaying', 'false');
    });

    // Handle errors
    this.audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      this.isPlayingSubject.next(false);
      sessionStorage.setItem('anthemPlaying', 'false');
    });
  }

  /**
   * Keep-alive mechanism to ensure audio keeps playing
   */
  private keepAlive(): void {
    const shouldBePlaying = sessionStorage.getItem('anthemPlaying') === 'true';
    const isPaused = this.audio.paused;

    // If it should be playing but is paused, try to resume
    if (shouldBePlaying && isPaused) {
      this.audio.play().catch(err => {
        // Silently handle autoplay restrictions
        console.log('Audio autoplay prevented:', err);
      });
    }
  }

  /**
   * Handle page visibility changes
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      // Page is hidden, save state
      sessionStorage.setItem('anthemPosition', this.audio.currentTime.toString());
      sessionStorage.setItem('anthemPlaying', (!this.audio.paused).toString());
    } else {
      // Page is visible again, restore playback if needed
      const shouldBePlaying = sessionStorage.getItem('anthemPlaying') === 'true';
      if (shouldBePlaying && this.audio.paused) {
        this.audio.play().catch(err => {
          console.log('Audio resume prevented:', err);
        });
      }
    }
  }

  /**
   * Play the background music
   */
  public play(): Promise<void> {
    return this.audio.play().then(() => {
      this.isPlayingSubject.next(true);
      sessionStorage.setItem('anthemPlaying', 'true');
    }).catch(err => {
      console.error('Failed to play audio:', err);
      throw err;
    });
  }

  /**
   * Pause the background music
   */
  public pause(): void {
    this.audio.pause();
    this.isPlayingSubject.next(false);
    sessionStorage.setItem('anthemPlaying', 'false');
  }

  /**
   * Toggle play/pause
   */
  public toggle(): Promise<void> | void {
    if (this.audio.paused) {
      return this.play();
    } else {
      this.pause();
    }
  }

  /**
   * Mute/unmute the audio
   */
  public setMuted(muted: boolean): void {
    this.audio.muted = muted;
    this.isMutedSubject.next(muted);
    sessionStorage.setItem('musicMuted', muted.toString());
  }

  /**
   * Toggle mute state
   */
  public toggleMute(): void {
    this.setMuted(!this.audio.muted);
  }

  /**
   * Get current playing state (synchronous)
   */
  public isPlaying(): boolean {
    return !this.audio.paused;
  }

  /**
   * Get current muted state (synchronous)
   */
  public isMuted(): boolean {
    return this.audio.muted;
  }

  /**
   * Get current playback time
   */
  public getCurrentTime(): number {
    return this.audio.currentTime;
  }

  /**
   * Set playback time
   */
  public setCurrentTime(time: number): void {
    this.audio.currentTime = time;
    sessionStorage.setItem('anthemPosition', time.toString());
  }

  /**
   * Get audio duration
   */
  public getDuration(): number {
    return this.audio.duration;
  }

  /**
   * Clean up on service destruction
   */
  public ngOnDestroy(): void {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }
    this.audio.pause();
    this.audio.src = '';
  }
}
