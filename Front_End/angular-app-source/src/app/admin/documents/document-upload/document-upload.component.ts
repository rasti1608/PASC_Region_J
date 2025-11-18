import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentsService } from '../../services/documents.service';

@Component({
  selector: 'app-document-upload',
  standalone: false,
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css']
})
export class DocumentUploadComponent {
  loading = false;
  error: string | null = null;
  selectedFile: File | null = null;

  formData = {
    title: '',
    description: '',
    document_type: '',
    is_active: false
  };

  constructor(
    private router: Router,
    private documentsService: DocumentsService
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];

      if (!validTypes.includes(file.type)) {
        this.error = 'Invalid file type. Only PDF, Word, Excel, and PowerPoint files are allowed.';
        this.selectedFile = null;
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10485760) {
        this.error = 'File size exceeds 10MB maximum. Please choose a smaller document.';
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
      this.error = null;
    }
  }

  onSubmit(): void {
    if (!this.formData.title.trim()) {
      this.error = 'Document Title is required';
      return;
    }
    if (!this.selectedFile) {
      this.error = 'Document File is required';
      return;
    }

    this.loading = true;
    this.error = null;

    const uploadData = new FormData();
    uploadData.append('document_file', this.selectedFile);
    uploadData.append('title', this.formData.title);
    uploadData.append('description', this.formData.description || '');
    uploadData.append('document_type', this.formData.document_type || '');
    uploadData.append('is_active', this.formData.is_active ? '1' : '0');

    this.documentsService.upload(uploadData).subscribe({
      next: () => {
        this.router.navigate(['/admin/documents']);
      },
      error: (err) => {
        this.error = err.message || 'Failed to upload document';
        this.loading = false;
        console.error('Error uploading document:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/documents']);
  }
}
