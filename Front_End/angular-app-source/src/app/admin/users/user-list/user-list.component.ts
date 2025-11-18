import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User, Role } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  roles: Role[] = [];
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Filters
  searchQuery = '';
  statusFilter = 'all';  // all, active, inactive
  roleFilter = 'all';    // all, 1 (Admin), 2 (Content Manager)

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.usersService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  loadRoles(): void {
    this.usersService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Error loading roles:', err);
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

  onRoleFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.users];

    // Apply status filter
    if (this.statusFilter === 'active') {
      filtered = filtered.filter(user => user.is_active);
    } else if (this.statusFilter === 'inactive') {
      filtered = filtered.filter(user => !user.is_active);
    }

    // Apply role filter
    if (this.roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role_id.toString() === this.roleFilter);
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(query) ||
        user.full_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }

    this.filteredUsers = filtered;
  }

  // Pagination methods
  getPaginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  getPageStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getPageEnd(): number {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredUsers.length);
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

  toggleUserActive(user: User): void {
    this.usersService.toggleActive(user.id).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.applyFilters();
      },
      error: (err) => {
        this.error = err.message || 'Failed to update user status';
        setTimeout(() => this.error = null, 5000);
      }
    });
  }

  getProfilePicturePath(user: User): string {
    if (user.profile_picture) {
      return `/assets/img/profiles/${user.profile_picture}`;
    }
    return '';
  }

  hasProfilePicture(user: User): boolean {
    return !!user.profile_picture;
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'badge badge-success' : 'badge badge-inactive';
  }

  formatDateTime(dateTimeString: string): { date: string, time: string } {
    if (!dateTimeString) return { date: '', time: '' };

    const dt = new Date(dateTimeString);
    const date = dt.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const time = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return { date, time };
  }

  isMasterAdmin(user: User): boolean {
    return user.username === 'admin';
  }
}
