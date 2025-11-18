import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
   * Create a new user
   */
  create(user: CreateUserRequest): Observable<User> {
    const params = new URLSearchParams({
      method: 'createUser',
      username: user.username,
      password: user.password,
      full_name: user.full_name,
      email: user.email,
      role_id: user.role_id.toString(),
      is_active: user.is_active ? '1' : '0'
    });
    return this.http.get<{ data: User }>(`${this.apiUrl}?${params.toString()}`)
      .pipe(
        map(response => response.data),
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
    return this.http.get<{ data: User }>(`${this.apiUrl}?${params.toString()}`)
      .pipe(
        map(response => response.data),
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
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('UsersService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
