import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsService } from '../../services/forms.service';
import { Form } from '../../models/form.model';

@Component({
  selector: 'app-form-list',
  standalone: false,
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.css']
})
export class FormListComponent implements OnInit {
  forms: Form[] = [];
  filteredForms: Form[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  statusFilter = 'all';
  currentLocation: 'Workshops' | 'Registration' = 'Workshops';

  // Tab counts
  workshopsCount = 0;
  registrationCount = 0;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private formsService: FormsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get location from query params (default to Workshops)
    this.route.queryParams.subscribe(params => {
      this.currentLocation = (params['location'] as 'Workshops' | 'Registration') || 'Workshops';
      this.loadForms();
      this.loadTabCounts();
    });
  }

  /**
   * Load all forms for current location from API
   */
  loadForms(): void {
    this.loading = true;
    this.error = null;

    this.formsService.getAll(this.currentLocation).subscribe({
      next: (data) => {
        this.forms = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load forms';
        this.loading = false;
        console.error('Error loading forms:', err);
      }
    });
  }

  /**
   * Load counts for both tabs
   */
  loadTabCounts(): void {
    // Load Workshops count
    this.formsService.getAll('Workshops').subscribe({
      next: (data) => {
        this.workshopsCount = data.length;
      },
      error: (err) => {
        console.error('Error loading workshops count:', err);
      }
    });

    // Load Registration count
    this.formsService.getAll('Registration').subscribe({
      next: (data) => {
        this.registrationCount = data.length;
      },
      error: (err) => {
        console.error('Error loading registration count:', err);
      }
    });
  }

  /**
   * Switch to a different location tab
   */
  switchTab(location: 'Workshops' | 'Registration'): void {
    this.currentLocation = location;
    this.currentPage = 1;
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.router.navigate(['/admin/forms'], { queryParams: { location } });
  }

  /**
   * Apply search and status filters
   */
  applyFilters(): void {
    let filtered = [...this.forms];

    // Apply status filter
    if (this.statusFilter === 'active') {
      filtered = filtered.filter(f => f.is_active);
    } else if (this.statusFilter === 'inactive') {
      filtered = filtered.filter(f => !f.is_active);
    }

    // Apply search filter (case-insensitive)
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.form_name.toLowerCase().includes(query) ||
        (f.form_description && f.form_description.toLowerCase().includes(query))
      );
    }

    this.filteredForms = filtered;
  }

  /**
   * Handle search input
   */
  onSearch(): void {
    this.currentPage = 1; // Reset to page 1 on search
    this.applyFilters();
  }

  /**
   * Handle status filter change
   */
  onStatusFilterChange(): void {
    this.currentPage = 1; // Reset to page 1 on filter change
    this.applyFilters();
  }

  /**
   * Navigate to add page
   */
  addNew(): void {
    this.router.navigate(['/admin/forms/add'], {
      queryParams: { location: this.currentLocation }
    });
  }

  /**
   * Navigate to edit page
   */
  edit(id: number): void {
    this.router.navigate(['/admin/forms/edit', id], {
      queryParams: { location: this.currentLocation }
    });
  }

  /**
   * Toggle active status
   */
  toggleActive(form: Form): void {
    this.formsService.toggleActive(form.id).subscribe({
      next: (updated) => {
        // Update local data
        const index = this.forms.findIndex(f => f.id === form.id);
        if (index !== -1) {
          this.forms[index] = updated;
        }

        // Update filtered list
        const filteredIndex = this.filteredForms.findIndex(f => f.id === form.id);
        if (filteredIndex !== -1) {
          this.filteredForms[filteredIndex] = updated;
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
  deleteForm(form: Form): void {
    this.router.navigate(['/admin/forms/delete', form.id]);
  }

  /**
   * Update display order
   */
  updateDisplayOrder(form: Form, newOrder: number): void {
    this.formsService.updateOrder(form.id, newOrder, this.currentLocation).subscribe({
      next: () => {
        this.loadForms(); // Reload to get updated order
        this.loadTabCounts(); // Update tab counts
      },
      error: (err) => {
        this.error = 'Failed to update order';
        console.error('Error updating order:', err);
      }
    });
  }

  /**
   * Get paginated forms for current page
   */
  getPaginatedForms(): Form[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredForms.slice(startIndex, endIndex);
  }

  /**
   * Get total number of pages
   */
  getTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredForms.length / this.itemsPerPage));
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

  /**
   * Get start index for current page (for display)
   */
  getPageStart(): number {
    if (this.filteredForms.length === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  /**
   * Get end index for current page (for display)
   */
  getPageEnd(): number {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredForms.length);
  }

  /**
   * Go to specific page
   */
  goToPage(page: number): void {
    this.currentPage = page;
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }
}
