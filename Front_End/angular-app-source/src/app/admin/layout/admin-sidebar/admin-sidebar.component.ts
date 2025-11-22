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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.imageLoadError = false; // Reset error flag when user changes
    });
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
