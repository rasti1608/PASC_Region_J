import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AdminUser {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  profilePicture?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<AdminUser | null>;
  public currentUser: Observable<AdminUser | null>;

  constructor(private router: Router) {
    // Load user from localStorage if exists
    const storedUser = localStorage.getItem('adminUser');
    this.currentUserSubject = new BehaviorSubject<AdminUser | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Get current user value
   */
  public get currentUserValue(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Login method (placeholder - will connect to API in Phase 2)
   */
  login(username: string, password: string): Observable<AdminUser> {
    // TODO: Connect to API endpoint in Phase 2
    // For now, return mock data
    throw new Error('Login API not yet implemented - Phase 2');
  }

  /**
   * Logout method
   */
  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('adminUser');
    this.currentUserSubject.next(null);

    // Navigate to login
    this.router.navigate(['/admin/login']);
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    // TODO: Implement permission checking in Phase 2
    return true;
  }

  /**
   * Set current user (used after login)
   */
  setCurrentUser(user: AdminUser): void {
    localStorage.setItem('adminUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
