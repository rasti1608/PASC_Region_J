import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  private sanitizer = inject(DomSanitizer);

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

  /**
   * Sanitize embed code HTML to allow iframe rendering
   */
  getSafeEmbedCode(embedCode: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(embedCode);
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
