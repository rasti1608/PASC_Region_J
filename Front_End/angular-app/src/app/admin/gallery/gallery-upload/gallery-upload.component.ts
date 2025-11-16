import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryService } from '../../services/gallery.service';

@Component({
  selector: 'app-gallery-upload',
  standalone: false,
  templateUrl: './gallery-upload.component.html',
  styleUrls: ['./gallery-upload.component.css']
})
export class GalleryUploadComponent implements OnInit {
  loading = false;
  error: string | null = null;
  currentLocation: 'about_page' | 'gallery' = 'gallery';
  selectedFile: File | null = null;
  previewUrl: string | null = null;

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
      this.formData.page_location = this.currentLocation;
    });
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.error = 'Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed.';
        this.selectedFile = null;
        this.previewUrl = null;
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5242880) {
        this.error = 'File size exceeds 5MB maximum. Please choose a smaller image.';
        this.selectedFile = null;
        this.previewUrl = null;
        return;
      }

      this.selectedFile = file;
      this.error = null;

      // Generate preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Submit upload form
   */
  onSubmit(): void {
    // Validate
    if (!this.formData.title.trim()) {
      this.error = 'Image Title is required';
      return;
    }
    if (!this.selectedFile) {
      this.error = 'Image File is required';
      return;
    }

    this.loading = true;
    this.error = null;

    // Create FormData for file upload
    const uploadData = new FormData();
    uploadData.append('image_file', this.selectedFile);
    uploadData.append('title', this.formData.title);
    uploadData.append('page_location', this.formData.page_location);
    uploadData.append('is_active', this.formData.is_active ? '1' : '0');

    this.galleryService.upload(uploadData).subscribe({
      next: () => {
        // Redirect immediately to list page
        this.router.navigate(['/admin/gallery'], {
          queryParams: { location: this.formData.page_location }
        });
      },
      error: (err) => {
        this.error = err.message || 'Failed to upload image';
        this.loading = false;
        console.error('Error uploading image:', err);
      }
    });
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
