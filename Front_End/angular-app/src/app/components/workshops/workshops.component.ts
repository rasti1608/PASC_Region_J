import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AudioService } from '../../services/audio.service';
import { WorkshopForm, PageContent } from '../../models/api-models';

@Component({
  selector: 'app-workshops',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workshops.component.html',
  styleUrl: './workshops.component.css'
})
export class WorkshopsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroVideoDesktop', { static: false }) heroVideoDesktop!: ElementRef<HTMLVideoElement>;
  @ViewChild('heroVideoMobile', { static: false }) heroVideoMobile!: ElementRef<HTMLVideoElement>;

  private apiService = inject(ApiService);
  private audioService = inject(AudioService);

  forms = signal<WorkshopForm[]>([]);
  pageContent = signal<PageContent | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  activeFormIndex = signal<number | null>(null);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.loadPageContent();
    this.loadWorkshopForms();
    this.setupAudioSubscription();
  }

  ngAfterViewInit(): void {
    this.controlVideoPlayback(this.audioService.isPlaying() && !this.audioService.isMuted());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupAudioSubscription(): void {
    const playingSub = this.audioService.isPlaying$.subscribe(playing => {
      this.controlVideoPlayback(playing && !this.audioService.isMuted());
    });
    const mutedSub = this.audioService.isMuted$.subscribe(muted => {
      this.controlVideoPlayback(this.audioService.isPlaying() && !muted);
    });
    this.subscriptions.push(playingSub, mutedSub);
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

  private loadPageContent() {
    this.apiService.getPageContent('workshops').subscribe({
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

  private loadWorkshopForms() {
    this.loading.set(true);
    this.apiService.getWorkshopForms('Workshops').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.forms.set(response.data);
          // Auto-open first form
          if (response.data.length > 0) {
            this.activeFormIndex.set(0);
          }
        } else {
          this.error.set('Failed to load workshop forms');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading workshop forms:', err);
        this.error.set('Failed to load workshop forms');
        this.loading.set(false);
      }
    });
  }

  toggleForm(index: number) {
    this.activeFormIndex.set(this.activeFormIndex() === index ? null : index);
  }
}
