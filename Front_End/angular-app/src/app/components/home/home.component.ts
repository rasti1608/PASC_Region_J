import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Announcement } from '../../models/api-models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);

  announcements = signal<Announcement[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadAnnouncements();
  }

  private loadAnnouncements() {
    this.loading.set(true);
    this.apiService.getAnnouncements().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.announcements.set(response.data);
        } else {
          this.error.set('Failed to load announcements');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading announcements:', err);
        this.error.set('Failed to load announcements');
        this.loading.set(false);
      }
    });
  }
}
