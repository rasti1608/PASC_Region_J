import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if user is authenticated
    if (this.authService.isAuthenticated()) {
      // Check if user must change password
      const user = this.authService.getCurrentUser();
      if (user?.must_change_password) {
        // Allow access to change-password page
        if (state.url === '/admin/change-password') {
          return true;
        }
        // Redirect to change-password for any other page
        this.router.navigate(['/admin/change-password']);
        return false;
      }
      return true;
    }

    // Not authenticated, redirect to login with return URL
    this.router.navigate(['/admin/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
