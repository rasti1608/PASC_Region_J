import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AudioService } from '../../services/audio.service';
import { ScheduleItem } from '../../models/api-models';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroVideoDesktop', { static: false }) heroVideoDesktop!: ElementRef<HTMLVideoElement>;
  @ViewChild('heroVideoMobile', { static: false }) heroVideoMobile!: ElementRef<HTMLVideoElement>;

  private apiService = inject(ApiService);
  private audioService = inject(AudioService);

  scheduleItems = signal<ScheduleItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.loadSchedule();
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

    this.controlVideoPlayback(this.audioService.isPlaying());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

  private loadSchedule() {
    this.loading.set(true);
    this.apiService.getSchedule().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.scheduleItems.set(response.data);
        } else {
          this.error.set('Failed to load schedule');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading schedule:', err);
        this.error.set('Failed to load schedule');
        this.loading.set(false);
      }
    });
  }

  downloadPDF() {
    // Trigger direct download of PDF
    window.location.href = '/api/schedule-pdf.cfm';
  }
}
