import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AdminUser } from '../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: false,
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {
  @Input() isMobileOpen = false;
  currentUser: AdminUser | null = null;
  imageLoadError = false;
  profilePictureUrl = ''; // Cache the profile picture URL to prevent infinite loading

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.imageLoadError = false; // Reset error flag when user changes
      // Update profile picture URL when user changes (prevents infinite loading)
      this.updateProfilePictureUrl();
    });
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  /**
   * Update profile picture URL - called only when user changes
   * This prevents infinite loading by not generating new URLs on every change detection cycle
   */
  updateProfilePictureUrl(): void {
    if (this.imageLoadError || !this.currentUser?.profile_picture) {
      this.profilePictureUrl = '';
    } else {
      // Add timestamp only once when user changes, not on every template check
      this.profilePictureUrl = `/assets/img/profiles/${this.currentUser.profile_picture}?v=${Date.now()}`;
    }
  }

  getProfilePictureUrl(): string {
    return this.profilePictureUrl;
  }

  onImageError(): void {
    this.imageLoadError = true;
    this.profilePictureUrl = ''; // Clear URL on error
  }

  /**
   * Check if current user is Admin (role_id = 1)
   * Only Admins should see User Management
   */
  isAdmin(): boolean {
    return this.currentUser?.role_id === 1;
  }
}
