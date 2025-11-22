import { Component, OnInit } from '@angular/core';
import { AnnouncementsService } from '../services/announcements.service';
import { FormsService } from '../services/forms.service';
import { GalleryService } from '../services/gallery.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    activeAnnouncements: 0,
    activeForms: 0,
    activeGallery: 0,
    activeSessions: 1 // Default to 1 (current user)
  };

  loading = true;
  error: string | null = null;

  constructor(
    private announcementsService: AnnouncementsService,
    private formsService: FormsService,
    private galleryService: GalleryService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    forkJoin({
      announcements: this.announcementsService.getAll(),
      formsWorkshops: this.formsService.getAll('Workshops'),
      formsRegistration: this.formsService.getAll('Registration'),
      galleryAbout: this.galleryService.getAll('about_page'),
      galleryMain: this.galleryService.getAll('gallery')
    }).subscribe({
      next: (results) => {
        this.stats.activeAnnouncements = results.announcements.filter(a => a.is_active).length;

        // Combine forms from all locations
        const allForms = [...results.formsWorkshops, ...results.formsRegistration];
        this.stats.activeForms = allForms.filter(f => f.is_active).length;

        // Combine gallery from all locations
        const allGallery = [...results.galleryAbout, ...results.galleryMain];
        this.stats.activeGallery = allGallery.filter(g => g.is_active).length;

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
        this.error = 'Failed to load dashboard statistics';
        this.loading = false;
      }
    });
  }
}
