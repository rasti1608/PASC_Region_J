import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ContactSubmission, StatusCounts } from '../models/contact-submission.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private apiUrl = '/api/contacts-admin.cfc';

  constructor(private http: HttpClient) {}

  /**
   * Get all contact submissions (for admin panel)
   */
  getAll(): Observable<ContactSubmission[]> {
    return this.http.get<{ data: ContactSubmission[] }>(`${this.apiUrl}?method=getSubmissionsAdmin`)
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }

  /**
   * Get a single submission by ID
   */
  getById(id: number): Observable<ContactSubmission> {
    return this.http.get<{ data: ContactSubmission }>(`${this.apiUrl}?method=getSubmission&id=${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update submission status
   */
  updateStatus(id: number, status: string): Observable<ContactSubmission> {
    const params = new URLSearchParams({
      method: 'updateStatus',
      id: id.toString(),
      status: status
    });
    return this.http.get<{ data: ContactSubmission }>(`${this.apiUrl}?${params.toString()}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update admin notes
   */
  updateAdminNotes(id: number, adminNotes: string): Observable<ContactSubmission> {
    const params = new URLSearchParams({
      method: 'updateAdminNotes',
      id: id.toString(),
      admin_notes: adminNotes
    });
    return this.http.get<{ data: ContactSubmission }>(`${this.apiUrl}?${params.toString()}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get status counts
   */
  getStatusCounts(): Observable<StatusCounts> {
    return this.http.get<{ data: StatusCounts }>(`${this.apiUrl}?method=getStatusCounts`)
      .pipe(
        map(response => response.data),
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

    console.error('ContactsService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
