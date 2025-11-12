import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { PageContent, GalleryImage } from '../../models/api-models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  private apiService = inject(ApiService);

  pageContent = signal<PageContent | null>(null);
  galleryImages = signal<GalleryImage[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadPageContent();
    this.loadGalleryImages();
  }

  private loadPageContent() {
    this.apiService.getPageContent('about').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.pageContent.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading page content:', err);
        this.error.set('Failed to load page content');
        this.loading.set(false);
      }
    });
  }

  private loadGalleryImages() {
    // Load top 3 images for about page
    this.apiService.getGalleryImages('about_page', 1, 3).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.galleryImages.set(response.data);
        }
      },
      error: (err) => {
        console.error('Error loading gallery images:', err);
      }
    });
  }
}
