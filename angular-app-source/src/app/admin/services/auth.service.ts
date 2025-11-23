import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AdminUser {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role_id: number;
  role_name: string;
  is_active: boolean;
  profile_picture?: string;
  must_change_password?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: AdminUser;
}

export interface AuthCheckResponse {
  success: boolean;
  authenticated: boolean;
  user?: AdminUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth.cfc';
  private currentUserSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Track if initial auth check is complete (used by AuthGuard to prevent race condition)
  private authCheckComplete = new BehaviorSubject<boolean>(false);
  public authCheckComplete$ = this.authCheckComplete.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check authentication status on service initialization
    // Subscribe to trigger the auth check (we don't need the result here)
    this.checkAuthStatus().subscribe();
  }

  /**
   * Check current authentication status with backend
   * Returns an Observable that completes when the check is done
   */
  checkAuthStatus(): Observable<boolean> {
    return this.http.get<AuthCheckResponse>(`${this.apiUrl}?method=checkAuth`, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.success && response.authenticated && response.user) {
            this.currentUserSubject.next(response.user);
          } else {
            this.currentUserSubject.next(null);
          }
          // Mark auth check as complete
          this.authCheckComplete.next(true);
        }),
        catchError(() => {
          this.currentUserSubject.next(null);
          // Mark auth check as complete even on error
          this.authCheckComplete.next(true);
          return of(false);
        }),
        map(() => this.currentUserSubject.value !== null)
      );
  }

  /**
   * Login with username and password
   */
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}?method=login`,
      credentials,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError(error => {
        const errorMessage = error.error?.message || 'Login failed. Please try again.';
        return throwError(() => ({
          success: false,
          message: errorMessage
        }));
      })
    );
  }

  /**
   * Logout current user
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}?method=logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        this.router.navigate(['/admin/login']);
      }),
      catchError(() => {
        // Even if API call fails, clear local state and redirect
        this.currentUserSubject.next(null);
        this.router.navigate(['/admin/login']);
        return of({ success: true });
      })
    );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Get current user value
   */
  getCurrentUser(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current user value (alias for compatibility)
   */
  public get currentUserValue(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Request password reset email
   */
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}?method=requestPasswordReset`,
      { email },
      { withCredentials: true }
    ).pipe(
      catchError(error => {
        return throwError(() => ({
          success: false,
          message: error.error?.message || 'Failed to send reset email.'
        }));
      })
    );
  }

  /**
   * Reset password using token from email
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}?method=resetPassword`,
      { token, newPassword },
      { withCredentials: true }
    ).pipe(
      catchError(error => {
        return throwError(() => ({
          success: false,
          message: error.error?.message || 'Failed to reset password.'
        }));
      })
    );
  }

  /**
   * Change required password (first-time login)
   */
  changeRequiredPassword(newPassword: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}?method=changeRequiredPassword`,
      { newPassword },
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.success && this.currentUserSubject.value) {
          // Update user to clear must_change_password flag
          const updatedUser = { ...this.currentUserSubject.value, must_change_password: false };
          this.currentUserSubject.next(updatedUser);
        }
      }),
      catchError(error => {
        return throwError(() => ({
          success: false,
          message: error.error?.message || 'Failed to change password.'
        }));
      })
    );
  }

  /**
   * Activate account using token from email
   */
  activateAccount(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}?method=activateAccountWithToken`,
      { token, newPassword },
      { withCredentials: true }
    ).pipe(
      catchError(error => {
        return throwError(() => ({
          success: false,
          message: error.error?.message || 'Failed to activate account.'
        }));
      })
    );
  }
}
