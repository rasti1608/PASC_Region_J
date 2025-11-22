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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.imageLoadError = false; // Reset error flag when user changes
    });
  }

  toggleMenu(): void {
    this.toggleMobileMenu.emit();
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  getProfilePictureUrl(): string {
    if (this.imageLoadError || !this.currentUser?.profile_picture) {
      return '';
    }
    return `/assets/img/profiles/${this.currentUser.profile_picture}?v=${new Date().getTime()}`;
  }

  onImageError(): void {
    this.imageLoadError = true;
  }
}
