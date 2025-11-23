import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';

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
  ): Observable<boolean> {
    // Wait for the initial auth check to complete before making a decision
    // This prevents the race condition where the guard runs before checkAuthStatus() finishes
    return this.authService.authCheckComplete$.pipe(
      // Wait until auth check is complete
      filter(isComplete => isComplete),
      // Take only the first 'complete' emission
      take(1),
      // Now check the current user status
      map(() => {
        const user = this.authService.getCurrentUser();

        // Check if user is authenticated (user exists and is not null)
        if (user) {
          // Check if user must change password
          if (user.must_change_password) {
            // Allow access to change-password page
            if (state.url === '/admin/change-password') {
              return true;
            }
            // Redirect to change-password for any other page
            this.router.navigate(['/admin/change-password']);
            return false;
          }
          // User is authenticated and doesn't need to change password
          return true;
        }

        // Not authenticated, redirect to login with return URL
        this.router.navigate(['/admin/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      })
    );
  }
}
