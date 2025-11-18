import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../../services/contacts.service';
import { ContactSubmission, StatusCounts } from '../../models/contact-submission.model';

@Component({
  selector: 'app-contact-list',
  standalone: false,
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.css']
})
export class ContactListComponent implements OnInit {
  submissions: ContactSubmission[] = [];
  filteredSubmissions: ContactSubmission[] = [];
  loading = false;
  error: string | null = null;

  // Status counts
  statusCounts: StatusCounts = {
    new: 0,
    read: 0,
    replied: 0,
    archived: 0
  };

  // Filters
  searchQuery = '';
  statusFilter = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  // Modal
  selectedSubmission: ContactSubmission | null = null;
  showModal = false;
  modalLoading = false;
  modalError: string | null = null;

  // Form data for modal
  modalFormData = {
    status: '',
    admin_notes: ''
  };

  constructor(private contactsService: ContactsService) {}

  ngOnInit(): void {
    this.loadSubmissions();
    this.loadStatusCounts();
  }

  loadSubmissions(): void {
    this.loading = true;
    this.error = null;

    this.contactsService.getAll().subscribe({
      next: (data) => {
        this.submissions = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load contact submissions';
        this.loading = false;
        console.error('Error loading submissions:', err);
      }
    });
  }

  loadStatusCounts(): void {
    this.contactsService.getStatusCounts().subscribe({
      next: (data) => {
        this.statusCounts = data;
      },
      error: (err) => {
        console.error('Error loading status counts:', err);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.submissions];

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === this.statusFilter);
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(sub =>
        sub.name.toLowerCase().includes(query) ||
        sub.email.toLowerCase().includes(query) ||
        sub.subject.toLowerCase().includes(query) ||
        sub.message.toLowerCase().includes(query)
      );
    }

    this.filteredSubmissions = filtered;
  }

  // Pagination methods
  getPaginatedSubmissions(): ContactSubmission[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredSubmissions.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredSubmissions.length / this.itemsPerPage);
  }

  getPageStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getPageEnd(): number {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredSubmissions.length);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const maxPagesToShow = 5;
    const pages: number[] = [];

    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
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

  // Modal methods
  viewSubmission(submission: ContactSubmission): void {
    this.selectedSubmission = submission;
    this.modalFormData = {
      status: submission.status,
      admin_notes: submission.admin_notes || ''
    };
    this.showModal = true;
    this.modalError = null;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedSubmission = null;
    this.modalError = null;
  }

  updateStatus(): void {
    if (!this.selectedSubmission) return;

    this.modalLoading = true;
    this.modalError = null;

    this.contactsService.updateStatus(this.selectedSubmission.id, this.modalFormData.status).subscribe({
      next: (updatedSubmission) => {
        // Update the submission in the list
        const index = this.submissions.findIndex(s => s.id === updatedSubmission.id);
        if (index !== -1) {
          this.submissions[index] = updatedSubmission;
        }
        this.selectedSubmission = updatedSubmission;
        this.modalFormData.status = updatedSubmission.status;
        this.modalLoading = false;
        this.applyFilters();
        this.loadStatusCounts();
      },
      error: (err) => {
        this.modalError = err.message || 'Failed to update status';
        this.modalLoading = false;
      }
    });
  }

  saveAdminNotes(): void {
    if (!this.selectedSubmission) return;

    this.modalLoading = true;
    this.modalError = null;

    this.contactsService.updateAdminNotes(this.selectedSubmission.id, this.modalFormData.admin_notes).subscribe({
      next: (updatedSubmission) => {
        // Update the submission in the list
        const index = this.submissions.findIndex(s => s.id === updatedSubmission.id);
        if (index !== -1) {
          this.submissions[index] = updatedSubmission;
        }
        this.selectedSubmission = updatedSubmission;
        this.modalFormData.admin_notes = updatedSubmission.admin_notes || '';
        this.modalLoading = false;
      },
      error: (err) => {
        this.modalError = err.message || 'Failed to save admin notes';
        this.modalLoading = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    return `badge badge-${status}`;
  }

  formatDateTime(dateTimeString: string): { date: string, time: string } {
    if (!dateTimeString) return { date: '', time: '' };

    const dt = new Date(dateTimeString);
    const date = dt.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const time = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return { date, time };
  }

  getMessagePreview(message: string): string {
    const maxLength = 100;
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  }
}
