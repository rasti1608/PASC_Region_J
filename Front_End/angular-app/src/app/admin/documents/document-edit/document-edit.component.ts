import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentsService } from '../../services/documents.service';
import { Document } from '../../models/document.model';

@Component({
  selector: 'app-document-edit',
  standalone: false,
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  documentId: number | null = null;
  loading = false;
  error: string | null = null;
  document: Document | null = null;

  formData = {
    title: '',
    description: '',
    document_type: '',
    is_active: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentsService: DocumentsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.documentId = +params['id'];
        this.loadDocument();
      }
    });
  }

  loadDocument(): void {
    if (!this.documentId) return;

    this.loading = true;
    this.error = null;

    this.documentsService.getById(this.documentId).subscribe({
      next: (data) => {
        this.document = data;
        this.formData = {
          title: data.title,
          description: data.description || '',
          document_type: data.document_type || '',
          is_active: data.is_active
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load document';
        this.loading = false;
        console.error('Error loading document:', err);
      }
    });
  }

  onSubmit(): void {
    if (!this.formData.title.trim()) {
      this.error = 'Document Title is required';
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.documentId) {
      this.documentsService.update(this.documentId, this.formData).subscribe({
        next: () => {
          this.router.navigate(['/admin/documents']);
        },
        error: (err) => {
          this.error = err.message || 'Failed to update document';
          this.loading = false;
          console.error('Error updating document:', err);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/documents']);
  }

  getDocumentIcon(extension: string): string {
    const ext = extension.toLowerCase().replace('.', '');
    switch(ext) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'ppt':
      case 'pptx': return '📽️';
      default: return '📁';
    }
  }

  getDocIconClass(extension: string): string {
    const ext = extension.toLowerCase().replace('.', '');
    return `doc-icon ${ext}`;
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    const mb = kb / 1024;
    return mb.toFixed(2) + ' MB';
  }
}
