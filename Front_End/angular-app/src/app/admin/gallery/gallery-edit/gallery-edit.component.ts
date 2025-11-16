import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryService } from '../../services/gallery.service';
import { GalleryImage } from '../../models/gallery.model';

@Component({
  selector: 'app-gallery-edit',
  standalone: false,
  templateUrl: './gallery-edit.component.html',
  styleUrls: ['./gallery-edit.component.css']
})
export class GalleryEditComponent implements OnInit {
  imageId: number | null = null;
  loading = false;
  error: string | null = null;
  currentLocation: 'about_page' | 'gallery' = 'gallery';
  image: GalleryImage | null = null;

  // Form data
  formData = {
    title: '',
    page_location: 'gallery' as 'about_page' | 'gallery',
    is_active: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private galleryService: GalleryService
  ) {}

  ngOnInit(): void {
    // Get location from query params
    this.route.queryParams.subscribe(params => {
      this.currentLocation = (params['location'] as 'about_page' | 'gallery') || 'gallery';
    });

    // Get image ID from route params
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.imageId = +params['id'];
        this.loadImage();
      }
    });
  }

  /**
   * Load image for editing
   */
  loadImage(): void {
    if (!this.imageId) return;

    this.loading = true;
    this.error = null;

    this.galleryService.getById(this.imageId).subscribe({
      next: (data) => {
        this.image = data;
        this.formData = {
          title: data.title,
          page_location: data.page_location,
          is_active: data.is_active
        };
        this.currentLocation = data.page_location;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load image';
        this.loading = false;
        console.error('Error loading image:', err);
      }
    });
  }

  /**
   * Get image URL
   */
  getImageUrl(): string {
    if (this.image) {
      return `/assets/img/gallery/${this.image.filename}`;
    }
    return '';
  }

  /**
   * Submit edit form
   */
  onSubmit(): void {
    // Validate
    if (!this.formData.title.trim()) {
      this.error = 'Image Title is required';
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.imageId) {
      this.galleryService.update(this.imageId, this.formData).subscribe({
        next: () => {
          // Redirect immediately to list page
          this.router.navigate(['/admin/gallery'], {
            queryParams: { location: this.formData.page_location }
          });
        },
        error: (err) => {
          this.error = err.message || 'Failed to update image';
          this.loading = false;
          console.error('Error updating image:', err);
        }
      });
    }
  }

  /**
   * Cancel and return to list
   */
  cancel(): void {
    this.router.navigate(['/admin/gallery'], {
      queryParams: { location: this.currentLocation }
    });
  }
}
