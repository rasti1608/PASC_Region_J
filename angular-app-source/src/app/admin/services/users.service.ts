import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, Role, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = '/api/users-admin.cfc';

  constructor(private http: HttpClient) {}

  /**
   * Get all users (for admin panel)
   */
  getAll(): Observable<User[]> {
    return this.http.get<{ data: User[] }>(`${this.apiUrl}?method=getUsersAdmin`)
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }

  /**
   * Get a single user by ID
   */
  getById(id: number): Observable<User> {
    return this.http.get<{ data: User }>(`${this.apiUrl}?method=getUser&id=${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Create a new user (password will be auto-generated)
   */
  create(user: CreateUserRequest): Observable<any> {
    const params = new URLSearchParams({
      method: 'createUser',
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      role_id: user.role_id.toString(),
      is_active: user.is_active ? '1' : '0'
    });
    return this.http.get<any>(`${this.apiUrl}?${params.toString()}`)
      .pipe(
        map(response => {
          // Check if API returned success:false (e.g., duplicate username/email)
          if (response.success === false) {
            throw new Error(response.message || 'Failed to create user');
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing user
   */
  update(user: UpdateUserRequest): Observable<User> {
    const params = new URLSearchParams({
      method: 'updateUser',
      id: user.id.toString(),
      full_name: user.full_name,
      email: user.email,
      role_id: user.role_id.toString(),
      is_active: user.is_active ? '1' : '0'
    });

    // Add password if provided
    if (user.password) {
      params.append('password', user.password);
    }

    return this.http.get<any>(`${this.apiUrl}?${params.toString()}`)
      .pipe(
        map(response => {
          // Check if API returned success:false (e.g., duplicate email)
          if (response.success === false) {
            throw new Error(response.message || 'Failed to update user');
          }
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Delete a user
   */
  delete(id: number): Observable<void> {
    return this.http.get<{ success: boolean }>(`${this.apiUrl}?method=deleteUser&id=${id}`)
      .pipe(
        map(() => undefined),
        catchError(this.handleError)
      );
  }

  /**
   * Toggle user active status
   */
  toggleActive(id: number): Observable<User> {
    return this.http.get<{ data: User }>(`${this.apiUrl}?method=toggleActive&id=${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get all available roles
   */
  getRoles(): Observable<Role[]> {
    return this.http.get<{ data: Role[] }>(`${this.apiUrl}?method=getRoles`)
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }

  /**
   * Check if username is available (for real-time validation)
   */
  checkUsernameAvailability(username: string, excludeUserId?: number): Observable<{available: boolean, message: string}> {
    let url = `${this.apiUrl}?method=checkUsernameAvailability&username=${encodeURIComponent(username)}`;
    if (excludeUserId) {
      url += `&excludeUserId=${excludeUserId}`;
    }
    return this.http.get<any>(url)
      .pipe(
        map(response => ({
          available: response.available || false,
          message: response.message || ''
        })),
        catchError(() => {
          // On error, assume not available to be safe
          return of({ available: false, message: 'Error checking availability' });
        })
      );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      // Server returned an error with a message (e.g., duplicate username/email)
      errorMessage = error.error.message;
    } else if (error.message) {
      // Error object with message (e.g., from thrown errors in map operators)
      errorMessage = error.message;
    } else if (error.status) {
      // HTTP error with status code
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('UsersService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
