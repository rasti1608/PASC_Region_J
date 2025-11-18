import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroVideoDesktop', { static: false }) heroVideoDesktop!: ElementRef<HTMLVideoElement>;
  @ViewChild('heroVideoMobile', { static: false }) heroVideoMobile!: ElementRef<HTMLVideoElement>;
  @ViewChild('largeLogo', { static: false }) largeLogo!: ElementRef<HTMLImageElement>;

  isPlaying = false;
  private subscriptions: Subscription[] = [];

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
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

    // Initial video control based on current audio state
    this.controlVideoPlayback(this.audioService.isPlaying());
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Set up subscription to audio service to control video playback
   */
  private setupAudioSubscription(): void {
    // Subscribe to playing state only (mute state doesn't affect video)
    const playingSub = this.audioService.isPlaying$.subscribe(playing => {
      this.isPlaying = playing;
      this.controlVideoPlayback(playing);
    });

    this.subscriptions.push(playingSub);
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
}
