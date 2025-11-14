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
    this.applyFilters();
  }

  /**
   * Handle status filter change
   */
  onStatusFilterChange(): void {
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
        // Update local data
        const index = this.announcements.findIndex(a => a.id === announcement.id);
        if (index !== -1) {
          this.announcements[index] = updated;
          this.applyFilters();
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
}
