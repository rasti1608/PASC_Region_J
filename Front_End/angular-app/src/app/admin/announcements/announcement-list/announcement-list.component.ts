import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnouncementsService } from '../../services/announcements.service';
import { Announcement } from '../../models/announcement.model';

@Component({
  selector: 'app-announcement-list',
  standalone: false,
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.css']
})
export class AnnouncementListComponent implements OnInit {
  announcements: Announcement[] = [];
  filteredAnnouncements: Announcement[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  statusFilter = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private announcementsService: AnnouncementsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  /**
   * Load all announcements from API
   */
  loadAnnouncements(): void {
    this.loading = true;
    this.error = null;

    this.announcementsService.getAll().subscribe({
      next: (data) => {
        this.announcements = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load announcements';
        this.loading = false;
        console.error('Error loading announcements:', err);
      }
    });
  }

  /**
   * Apply search and status filters
   */
  applyFilters(): void {
    let filtered = [...this.announcements];

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(a => a.computed_status === this.statusFilter);
    }

    // Apply search filter (case-insensitive)
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query)
      );
    }

    this.filteredAnnouncements = filtered;
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
   * Navigate to add page
   */
  addNew(): void {
    this.router.navigate(['/admin/announcements/add']);
  }

  /**
   * Navigate to edit page
   */
  edit(id: number): void {
    this.router.navigate(['/admin/announcements/edit', id]);
  }

  /**
   * Toggle active status
   */
  toggleActive(announcement: Announcement): void {
    this.announcementsService.toggleActive(announcement.id).subscribe({
      next: (updated) => {
        // Update local data with computed_status
        const index = this.announcements.findIndex(a => a.id === announcement.id);
        if (index !== -1) {
          this.announcements[index] = {
            ...updated,
            computed_status: this.computeStatus(updated)
          };
        }

        // Update filtered list
        const filteredIndex = this.filteredAnnouncements.findIndex(a => a.id === announcement.id);
        if (filteredIndex !== -1) {
          this.filteredAnnouncements[filteredIndex] = this.announcements[index];
        }
      },
      error: (err) => {
        this.error = 'Failed to toggle status';
        console.error('Error toggling status:', err);
      }
    });
  }

  /**
   * Compute status based on dates and is_active flag
   */
  private computeStatus(announcement: Announcement): 'live' | 'inactive' | 'expired' | 'future' {
    if (!announcement.is_active) return 'inactive';

    const now = new Date();
    const startDate = new Date(announcement.publish_start);
    const endDate = announcement.publish_end ? new Date(announcement.publish_end) : null;

    if (startDate > now) return 'future';
    if (endDate && endDate < now) return 'expired';
    return 'live';
  }

  /**
   * Navigate to delete confirmation page
   */
  deleteAnnouncement(announcement: Announcement): void {
    this.router.navigate(['/admin/announcements/delete', announcement.id]);
  }

  /**
   * Update display order
   */
  updateDisplayOrder(announcement: Announcement, newOrder: number): void {
    this.announcementsService.updateOrder(announcement.id, newOrder).subscribe({
      next: () => {
        this.loadAnnouncements(); // Reload to get updated order
      },
      error: (err) => {
        this.error = 'Failed to update order';
        console.error('Error updating order:', err);
      }
    });
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string | null): string {
    if (!dateString) return 'No end date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /**
   * Get paginated announcements for current page
   */
  getPaginatedAnnouncements(): Announcement[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredAnnouncements.slice(startIndex, endIndex);
  }

  /**
   * Get total number of pages
   */
  getTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAnnouncements.length / this.itemsPerPage));
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
    if (this.filteredAnnouncements.length === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  /**
   * Get end index for current page (for display)
   */
  getPageEnd(): number {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredAnnouncements.length);
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
}
