import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementsService } from '../../services/announcements.service';
import { Announcement, AnnouncementFormData } from '../../models/announcement.model';

@Component({
  selector: 'app-announcement-form',
  standalone: false,
  templateUrl: './announcement-form.component.html',
  styleUrls: ['./announcement-form.component.css']
})
export class AnnouncementFormComponent implements OnInit {
  isEditMode = false;
  announcementId: number | null = null;
  loading = false;
  error: string | null = null;

  // Form data
  formData: AnnouncementFormData = {
    title: '',
    content: '',
    is_active: false, // Default to inactive - must be manually activated
    is_featured: false,
    publish_start: this.getTodayDate(),
    publish_end: null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private announcementsService: AnnouncementsService
  ) {}

  ngOnInit(): void {
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.announcementId = +params['id'];
        this.loadAnnouncement();
      }
    });
  }

  /**
   * Load announcement for editing
   */
  loadAnnouncement(): void {
    if (!this.announcementId) return;

    this.loading = true;
    this.error = null;

    this.announcementsService.getById(this.announcementId).subscribe({
      next: (data) => {
        this.formData = {
          title: data.title,
          content: data.content,
          is_active: data.is_active,
          is_featured: data.is_featured,
          publish_start: this.formatDateForInput(data.publish_start),
          publish_end: data.publish_end ? this.formatDateForInput(data.publish_end) : null
        };
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
   * Submit form (create or update)
   */
  onSubmit(): void {
    // Validate
    if (!this.formData.title.trim()) {
      this.error = 'Title is required';
      return;
    }
    if (!this.formData.content.trim()) {
      this.error = 'Content is required';
      return;
    }
    if (!this.formData.publish_start) {
      this.error = 'Publish start date is required';
      return;
    }

    this.loading = true;
    this.error = null;

    const operation = this.isEditMode && this.announcementId
      ? this.announcementsService.update(this.announcementId, this.formData)
      : this.announcementsService.create(this.formData);

    operation.subscribe({
      next: () => {
        // Redirect immediately to list page (like CF admin)
        this.router.navigate(['/admin/announcements']);
      },
      error: (err) => {
        this.error = err.message || 'Failed to save announcement';
        this.loading = false;
        console.error('Error saving announcement:', err);
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
   * Get today's date in YYYY-MM-DD format
   */
  private getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * Format date from API for input field
   */
  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}
