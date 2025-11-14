import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Announcement, AnnouncementFormData } from '../models/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {
  // TODO: Update this URL to match your API endpoint in Phase 2
  // For now using placeholder - will need to point to ColdFusion API
  private apiUrl = '/api/announcements.cfc';

  constructor(private http: HttpClient) {}

  /**
   * Get all announcements (for admin panel - includes inactive)
   */
  getAll(): Observable<Announcement[]> {
    return this.http.get<{ data: Announcement[] }>(`${this.apiUrl}?method=getAnnouncementsAdmin`)
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }

  /**
   * Get a single announcement by ID
   */
  getById(id: number): Observable<Announcement> {
    return this.http.get<{ data: Announcement }>(`${this.apiUrl}?method=getAnnouncement&id=${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Create a new announcement
   */
  create(data: AnnouncementFormData): Observable<Announcement> {
    return this.http.post<{ data: Announcement }>(`${this.apiUrl}?method=saveAnnouncement`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing announcement
   * Note: CFC uses saveAnnouncement for both create and update (detects ID)
   */
  update(id: number, data: AnnouncementFormData): Observable<Announcement> {
    // Include ID in the data object for the CFC to detect it's an update
    const dataWithId = { ...data, id };
    return this.http.post<{ data: Announcement }>(`${this.apiUrl}?method=saveAnnouncement`, dataWithId)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Delete an announcement
   */
  delete(id: number): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}?method=deleteAnnouncement&id=${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Toggle active status of an announcement
   */
  toggleActive(id: number): Observable<Announcement> {
    return this.http.get<{ data: Announcement }>(`${this.apiUrl}?method=toggleActive&id=${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update display order
   */
  updateOrder(id: number, newOrder: number): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}?method=updateOrder&id=${id}&newOrder=${newOrder}`)
      .pipe(
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

    console.error('AnnouncementsService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
