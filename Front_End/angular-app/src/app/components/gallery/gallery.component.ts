import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AudioService } from '../../services/audio.service';
import { GalleryImage } from '../../models/api-models';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroVideoDesktop', { static: false }) heroVideoDesktop!: ElementRef<HTMLVideoElement>;
  @ViewChild('heroVideoMobile', { static: false }) heroVideoMobile!: ElementRef<HTMLVideoElement>;

  private apiService = inject(ApiService);
  private audioService = inject(AudioService);

  images = signal<GalleryImage[]>([]);
  totalImages = signal(0);
  currentPage = signal(1);
  imagesPerPage = 9;
  loading = signal(true);
  error = signal<string | null>(null);

  // Modal
  modalOpen = signal(false);
  modalIndex = signal(0);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.loadGalleryCount();
    this.loadGalleryImages();
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

  private loadGalleryCount() {
    this.apiService.getGalleryCount('gallery').subscribe({
      next: (response) => {
        if (response.success) {
          this.totalImages.set(response.totalCount);
        }
      },
      error: (err) => {
        console.error('Error loading gallery count:', err);
      }
    });
  }

  private loadGalleryImages() {
    this.loading.set(true);
    this.apiService.getGalleryImages('gallery', this.currentPage(), this.imagesPerPage).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.images.set(response.data);
        } else {
          this.error.set('Failed to load gallery images');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading gallery images:', err);
        this.error.set('Failed to load gallery images');
        this.loading.set(false);
      }
    });
  }

  getTotalPages(): number {
    return Math.ceil(this.totalImages() / this.imagesPerPage);
  }

  getStartPhoto(): number {
    return (this.currentPage() - 1) * this.imagesPerPage + 1;
  }

  getEndPhoto(): number {
    return Math.min(this.currentPage() * this.imagesPerPage, this.totalImages());
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage.set(page);
      this.loadGalleryImages();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  handlePageInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const page = parseInt(input.value, 10);
    if (!isNaN(page)) {
      this.goToPage(page);
    }
  }

  openModal(index: number) {
    this.modalIndex.set(index);
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
  }

  nextModalImage(event: Event) {
    event.stopPropagation();
    const currentIndex = this.modalIndex();
    if (currentIndex < this.images().length - 1) {
      this.modalIndex.set(currentIndex + 1);
    }
  }

  previousModalImage(event: Event) {
    event.stopPropagation();
    const currentIndex = this.modalIndex();
    if (currentIndex > 0) {
      this.modalIndex.set(currentIndex - 1);
    }
  }
}
