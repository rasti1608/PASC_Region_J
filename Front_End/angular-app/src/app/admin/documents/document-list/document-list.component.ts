import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentsService } from '../../services/documents.service';
import { Document } from '../../models/document.model';

@Component({
  selector: 'app-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  statusFilter = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private documentsService: DocumentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  /**
   * Load all documents from API
   */
  loadDocuments(): void {
    this.loading = true;
    this.error = null;

    this.documentsService.getAll().subscribe({
      next: (data) => {
        this.documents = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load documents';
        this.loading = false;
        console.error('Error loading documents:', err);
      }
    });
  }

  /**
   * Apply search and status filters
   */
  applyFilters(): void {
    let filtered = [...this.documents];

    // Apply status filter
    if (this.statusFilter === 'active') {
      filtered = filtered.filter(doc => doc.is_active);
    } else if (this.statusFilter === 'inactive') {
      filtered = filtered.filter(doc => !doc.is_active);
    }

    // Apply search filter (case-insensitive)
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(query) ||
        (doc.description && doc.description.toLowerCase().includes(query)) ||
        doc.original_filename.toLowerCase().includes(query)
      );
    }

    this.filteredDocuments = filtered;
  }

  /**
   * Handle search input
   */
  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  /**
   * Handle status filter change
   */
  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  /**
   * Navigate to upload page
   */
  uploadNew(): void {
    this.router.navigate(['/admin/documents/upload']);
  }

  /**
   * Navigate to edit page
   */
  edit(id: number): void {
    this.router.navigate(['/admin/documents/edit', id]);
  }

  /**
   * Toggle active status
   */
  toggleActive(document: Document): void {
    this.documentsService.toggleActive(document.id).subscribe({
      next: (updated) => {
        const index = this.documents.findIndex(doc => doc.id === document.id);
        if (index !== -1) {
          this.documents[index] = updated;
        }

        const filteredIndex = this.filteredDocuments.findIndex(doc => doc.id === document.id);
        if (filteredIndex !== -1) {
          this.filteredDocuments[filteredIndex] = updated;
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
  deleteDocument(document: Document): void {
    this.router.navigate(['/admin/documents/delete', document.id]);
  }

  /**
   * Update display order
   */
  updateDisplayOrder(document: Document, newOrder: number): void {
    this.documentsService.updateOrder(document.id, newOrder).subscribe({
      next: () => {
        this.loadDocuments();
      },
      error: (err) => {
        this.error = 'Failed to update order';
        console.error('Error updating order:', err);
      }
    });
  }

  /**
   * Get document icon based on file extension
   */
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

  /**
   * Get document icon CSS class
   */
  getDocIconClass(extension: string): string {
    const ext = extension.toLowerCase().replace('.', '');
    return `doc-icon ${ext}`;
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    const mb = kb / 1024;
    return mb.toFixed(2) + ' MB';
  }

  /**
   * Get paginated documents for current page
   */
  getPaginatedDocuments(): Document[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredDocuments.slice(startIndex, endIndex);
  }

  /**
   * Get total number of pages
   */
  getTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredDocuments.length / this.itemsPerPage));
  }

  /**
   * Get page numbers to display
   */
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getPageStart(): number {
    if (this.filteredDocuments.length === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getPageEnd(): number {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredDocuments.length);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }
}
