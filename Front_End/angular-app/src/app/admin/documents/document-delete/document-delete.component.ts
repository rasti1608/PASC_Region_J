import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentsService } from '../../services/documents.service';
import { Document } from '../../models/document.model';

@Component({
  selector: 'app-document-delete',
  standalone: false,
  templateUrl: './document-delete.component.html',
  styleUrls: ['./document-delete.component.css']
})
export class DocumentDeleteComponent implements OnInit {
  documentId: number | null = null;
  document: Document | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentsService: DocumentsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.documentId = parseInt(id, 10);
      this.loadDocument();
    } else {
      this.router.navigate(['/admin/documents']);
    }
  }

  loadDocument(): void {
    if (!this.documentId) return;

    this.loading = true;
    this.documentsService.getById(this.documentId).subscribe({
      next: (document) => {
        this.document = document;
        this.loading = false;
      },
      error: () => {
        this.error = 'Document not found';
        this.loading = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.documentId || this.error) return;

    this.loading = true;
    this.documentsService.delete(this.documentId).subscribe({
      next: () => {
        this.router.navigate(['/admin/documents']);
      },
      error: (err) => {
        this.error = err.message || 'Failed to delete document';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/documents']);
  }
}
