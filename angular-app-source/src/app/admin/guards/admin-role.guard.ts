import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';

/**
 * AdminRoleGuard - Restricts access to Admin-only routes
 * Only users with role_id = 1 (Administrator) can access these routes
 * Content Managers (role_id = 2) and other roles will be redirected to dashboard
 */
@Injectable({
  providedIn: 'root'
})
export class AdminRoleGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Wait for auth check to complete, then verify user is Admin
    return this.authService.authCheckComplete$.pipe(
      // Wait until auth check is complete
      filter(isComplete => isComplete),
      // Take only the first 'complete' emission
      take(1),
      // Check if user is Admin (role_id = 1)
      map(() => {
        const user = this.authService.getCurrentUser();

        // Check if user is Admin
        if (user && user.role_id === 1) {
          return true; // Allow access
        }

        // Not an Admin - redirect to dashboard
        console.warn('Access denied: User is not an Administrator');
        this.router.navigate(['/admin/dashboard']);
        return false;
      })
    );
  }
}
