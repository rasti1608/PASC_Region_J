import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { GalleryImage } from '../../models/api-models';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  private apiService = inject(ApiService);

  images = signal<GalleryImage[]>([]);
  totalCount = signal(0);
  currentPage = signal(1);
  imagesPerPage = 9;
  loading = signal(true);
  error = signal<string | null>(null);

  // Lightbox
  lightboxOpen = signal(false);
  lightboxImage = signal<GalleryImage | null>(null);
  lightboxIndex = signal(0);

  ngOnInit() {
    this.loadGalleryCount();
    this.loadGalleryImages();
  }

  private loadGalleryCount() {
    this.apiService.getGalleryCount('gallery').subscribe({
      next: (response) => {
        if (response.success) {
          this.totalCount.set(response.totalCount);
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
    return Math.ceil(this.totalCount() / this.imagesPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage.set(page);
      this.loadGalleryImages();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openLightbox(image: GalleryImage, index: number) {
    this.lightboxImage.set(image);
    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
    this.lightboxImage.set(null);
  }

  nextImage() {
    const currentImages = this.images();
    const currentIndex = this.lightboxIndex();
    if (currentIndex < currentImages.length - 1) {
      this.lightboxIndex.set(currentIndex + 1);
      this.lightboxImage.set(currentImages[currentIndex + 1]);
    }
  }

  prevImage() {
    const currentIndex = this.lightboxIndex();
    if (currentIndex > 0) {
      this.lightboxIndex.set(currentIndex - 1);
      this.lightboxImage.set(this.images()[currentIndex - 1]);
    }
  }
}
