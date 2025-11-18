import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GalleryService } from '../../services/gallery.service';
import { GalleryImage } from '../../models/gallery.model';

@Component({
  selector: 'app-gallery-list',
  standalone: false,
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css']
})
export class GalleryListComponent implements OnInit {
  images: GalleryImage[] = [];
  filteredImages: GalleryImage[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  statusFilter = 'all';
  currentLocation: 'about_page' | 'gallery' = 'gallery';

  // Tab counts
  aboutPageCount = 0;
  galleryCount = 0;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  // Image preview modal
  showModal = false;
  modalImageUrl = '';

  constructor(
    private galleryService: GalleryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get location from query params (default to gallery)
    this.route.queryParams.subscribe(params => {
      this.currentLocation = (params['location'] as 'about_page' | 'gallery') || 'gallery';
      this.loadImages();
      this.loadTabCounts();
    });
  }

  /**
   * Load all images for current location from API
   */
  loadImages(): void {
    this.loading = true;
    this.error = null;

    this.galleryService.getAll(this.currentLocation).subscribe({
      next: (data) => {
        this.images = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load images';
        this.loading = false;
        console.error('Error loading images:', err);
      }
    });
  }

  /**
   * Load counts for both tabs
   */
  loadTabCounts(): void {
    // Load About Page count
    this.galleryService.getAll('about_page').subscribe({
      next: (data) => {
        this.aboutPageCount = data.length;
      },
      error: (err) => {
        console.error('Error loading about page count:', err);
      }
    });

    // Load Gallery count
    this.galleryService.getAll('gallery').subscribe({
      next: (data) => {
        this.galleryCount = data.length;
      },
      error: (err) => {
        console.error('Error loading gallery count:', err);
      }
    });
  }

  /**
   * Switch to a different location tab
   */
  switchTab(location: 'about_page' | 'gallery'): void {
    this.currentLocation = location;
    this.currentPage = 1;
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.router.navigate(['/admin/gallery'], { queryParams: { location } });
  }

  /**
   * Apply search and status filters
   */
  applyFilters(): void {
    let filtered = [...this.images];

    // Apply status filter
    if (this.statusFilter === 'active') {
      filtered = filtered.filter(img => img.is_active);
    } else if (this.statusFilter === 'inactive') {
      filtered = filtered.filter(img => !img.is_active);
    }

    // Apply search filter (case-insensitive)
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(img =>
        img.title.toLowerCase().includes(query) ||
        img.original_filename.toLowerCase().includes(query)
      );
    }

    this.filteredImages = filtered;
  }

  /**
   * Handle search input
   */
  onSearch(): void {
    this.currentPage = 1; // Reset to page 1 on search
    this.applyFilters();
  }

  /**
   * Handle status filter change
   */
  onStatusFilterChange(): void {
    this.currentPage = 1; // Reset to page 1 on filter change
    this.applyFilters();
  }

  /**
   * Navigate to upload page
   */
  uploadNew(): void {
    this.router.navigate(['/admin/gallery/upload'], {
      queryParams: { location: this.currentLocation }
    });
  }

  /**
   * Navigate to edit page
   */
  edit(id: number): void {
    this.router.navigate(['/admin/gallery/edit', id], {
      queryParams: { location: this.currentLocation }
    });
  }

  /**
   * Toggle active status
   */
  toggleActive(image: GalleryImage): void {
    this.galleryService.toggleActive(image.id).subscribe({
      next: (updated) => {
        // Update local data
        const index = this.images.findIndex(img => img.id === image.id);
        if (index !== -1) {
          this.images[index] = updated;
        }

        // Update filtered list
        const filteredIndex = this.filteredImages.findIndex(img => img.id === image.id);
        if (filteredIndex !== -1) {
          this.filteredImages[filteredIndex] = updated;
        }
      },
      error: (err) => {
        this.error = 'Failed to toggle status';
        console.error('Error toggling status:', err);
      }
    });
  }

  /**
   * Navigate to delete confirmation page
   */
  deleteImage(image: GalleryImage): void {
    this.router.navigate(['/admin/gallery/delete', image.id]);
  }

  /**
   * Update display order
   */
  updateDisplayOrder(image: GalleryImage, newOrder: number): void {
    this.galleryService.updateOrder(image.id, newOrder, this.currentLocation).subscribe({
      next: () => {
        this.loadImages(); // Reload to get updated order
        this.loadTabCounts(); // Update tab counts
      },
      error: (err) => {
        this.error = 'Failed to update order';
        console.error('Error updating order:', err);
      }
    });
  }

  /**
   * Get image URL
   */
  getImageUrl(filename: string): string {
    return `/assets/img/gallery/${filename}`;
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /**
   * Get paginated images for current page
   */
  getPaginatedImages(): GalleryImage[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredImages.slice(startIndex, endIndex);
  }

  /**
   * Get total number of pages
   */
  getTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredImages.length / this.itemsPerPage));
  }

  /**
   * Get page numbers to display
   */
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  /**
   * Get start index for current page (for display)
   */
  getPageStart(): number {
    if (this.filteredImages.length === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  /**
   * Get end index for current page (for display)
   */
  getPageEnd(): number {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredImages.length);
  }

  /**
   * Go to specific page
   */
  goToPage(page: number): void {
    this.currentPage = page;
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  /**
   * Open image preview modal
   */
  openImageModal(filename: string): void {
    this.modalImageUrl = this.getImageUrl(filename);
    this.showModal = true;
  }

  /**
   * Close image preview modal
   */
  closeModal(): void {
    this.showModal = false;
    this.modalImageUrl = '';
  }
}
