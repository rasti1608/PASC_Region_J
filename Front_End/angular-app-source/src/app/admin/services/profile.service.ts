import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, UpdateProfileRequest, ChangePasswordRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = '/admin_api/profile_api.cfm';

  constructor(private http: HttpClient) {}

  /**
   * Get current user's profile
   */
  getProfile(): Observable<User> {
    return this.http.get<{ data: User }>(`${this.apiUrl}?method=getProfile`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update profile information (name, email)
   */
  updateProfile(data: UpdateProfileRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}?method=updateProfile`,
      data
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Change password
   */
  changePassword(data: ChangePasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}?method=changePassword`,
      data
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Upload profile picture
   */
  uploadProfilePicture(file: File): Observable<{ message: string; filename: string }> {
    const formData = new FormData();
    formData.append('profile_picture', file);

    return this.http.post<{ message: string; filename: string }>(
      `${this.apiUrl}?method=uploadProfilePicture`,
      formData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Remove profile picture
   */
  removeProfilePicture(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}?method=removeProfilePicture`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => ({ message: errorMessage }));
  }
}
