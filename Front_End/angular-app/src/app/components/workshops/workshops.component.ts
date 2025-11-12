import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { WorkshopForm, PageContent } from '../../models/api-models';

@Component({
  selector: 'app-workshops',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workshops.component.html',
  styleUrl: './workshops.component.css'
})
export class WorkshopsComponent implements OnInit {
  private apiService = inject(ApiService);

  forms = signal<WorkshopForm[]>([]);
  pageContent = signal<PageContent | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  activeFormIndex = signal<number | null>(null);

  ngOnInit() {
    this.loadPageContent();
    this.loadWorkshopForms();
  }

  private loadPageContent() {
    this.apiService.getPageContent('workshops').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.pageContent.set(response.data);
        }
      },
      error: (err) => {
        console.error('Error loading page content:', err);
      }
    });
  }

  private loadWorkshopForms() {
    this.loading.set(true);
    this.apiService.getWorkshopForms('Workshops').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.forms.set(response.data);
          // Auto-open first form
          if (response.data.length > 0) {
            this.activeFormIndex.set(0);
          }
        } else {
          this.error.set('Failed to load workshop forms');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading workshop forms:', err);
        this.error.set('Failed to load workshop forms');
        this.loading.set(false);
      }
    });
  }

  toggleForm(index: number) {
    this.activeFormIndex.set(this.activeFormIndex() === index ? null : index);
  }
}
