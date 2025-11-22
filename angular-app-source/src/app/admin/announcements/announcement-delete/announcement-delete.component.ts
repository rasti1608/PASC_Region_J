import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementsService } from '../../services/announcements.service';
import { Announcement } from '../../models/announcement.model';

@Component({
  selector: 'app-announcement-delete',
  standalone: false,
  templateUrl: './announcement-delete.component.html',
  styleUrls: ['./announcement-delete.component.css']
})
export class AnnouncementDeleteComponent implements OnInit {
  announcement: Announcement | null = null;
  loading = false;
  error: string | null = null;
  announcementId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private announcementsService: AnnouncementsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.announcementId = +params['id'];
        this.loadAnnouncement();
      } else {
        this.error = 'No announcement ID provided';
      }
    });
  }

  /**
   * Load announcement details for confirmation display
   */
  loadAnnouncement(): void {
    if (!this.announcementId) return;

    this.loading = true;
    this.error = null;

    this.announcementsService.getById(this.announcementId).subscribe({
      next: (data) => {
        this.announcement = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load announcement';
        this.loading = false;
        console.error('Error loading announcement:', err);
      }
    });
  }

  /**
   * Confirm and delete the announcement
   */
  confirmDelete(): void {
    if (!this.announcementId) return;

    this.loading = true;
    this.error = null;

    this.announcementsService.delete(this.announcementId).subscribe({
      next: () => {
        // Redirect back to list
        this.router.navigate(['/admin/announcements']);
      },
      error: (err) => {
        this.error = 'Failed to delete announcement';
        this.loading = false;
        console.error('Error deleting announcement:', err);
      }
    });
  }

  /**
   * Cancel and return to list
   */
  cancel(): void {
    this.router.navigate(['/admin/announcements']);
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
