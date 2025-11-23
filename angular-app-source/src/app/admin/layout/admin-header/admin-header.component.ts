import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AuthService, AdminUser } from '../../services/auth.service';

@Component({
  selector: 'app-admin-header',
  standalone: false,
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  @Output() toggleMobileMenu = new EventEmitter<void>();
  currentUser: AdminUser | null = null;
  imageLoadError = false;
  profilePictureUrl = ''; // Cache the profile picture URL to prevent infinite loading

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.imageLoadError = false; // Reset error flag when user changes
      // Update profile picture URL when user changes (prevents infinite loading)
      this.updateProfilePictureUrl();
    });
  }

  toggleMenu(): void {
    this.toggleMobileMenu.emit();
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
}
