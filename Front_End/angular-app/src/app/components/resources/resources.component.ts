import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Document, PageContent } from '../../models/api-models';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent implements OnInit {
  private apiService = inject(ApiService);

  documents = signal<Document[]>([]);
  pageContent = signal<PageContent | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadPageContent();
    this.loadDocuments();
  }

  private loadPageContent() {
    this.apiService.getPageContent('resources').subscribe({
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

  private loadDocuments() {
    this.loading.set(true);
    this.apiService.getDocuments().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.documents.set(response.data);
        } else {
          this.error.set('Failed to load documents');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading documents:', err);
        this.error.set('Failed to load documents');
        this.loading.set(false);
      }
    });
  }

  getFileIconClass(fileIcon: string): string {
    const iconMap: { [key: string]: string } = {
      'file-pdf': '📄',
      'file-word': '📝',
      'file-excel': '📊',
      'file-powerpoint': '📽️',
      'file-archive': '🗜️',
      'file-image': '🖼️',
      'file': '📁'
    };
    return iconMap[fileIcon] || '📁';
  }
}
