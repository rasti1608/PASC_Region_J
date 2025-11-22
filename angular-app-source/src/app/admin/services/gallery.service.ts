import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GalleryImage, GalleryImageFormData } from '../models/gallery.model';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private apiUrl = '/api/gallery.cfc';

  constructor(private http: HttpClient) {}

  /**
   * Get all images for a specific location (for admin panel)
   */
  getAll(location: string): Observable<GalleryImage[]> {
    return this.http.get<{ data: GalleryImage[] }>(`${this.apiUrl}?method=getImagesAdmin&location=${location}`)
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }

  /**
   * Get a single image by ID
   */
  getById(id: number): Observable<GalleryImage> {
    return this.http.get<{ data: GalleryImage }>(`${this.apiUrl}?method=getImage&id=${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Upload a new image
   */
  upload(formData: FormData): Observable<GalleryImage> {
    return this.http.post<{ data: GalleryImage }>(`${this.apiUrl}?method=uploadImage`, formData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing image
   */
  update(id: number, data: GalleryImageFormData): Observable<GalleryImage> {
    const params = new URLSearchParams({
      method: 'updateImage',
      id: id.toString(),
      title: data.title,
      page_location: data.page_location,
      is_active: data.is_active.toString()
    });
    return this.http.get<{ data: GalleryImage }>(`${this.apiUrl}?${params.toString()}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Delete an image
   */
  delete(id: number): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}?method=deleteImage&id=${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Toggle active status of an image
   */
  toggleActive(id: number): Observable<GalleryImage> {
    return this.http.get<{ data: GalleryImage }>(`${this.apiUrl}?method=toggleActive&id=${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update display order
   */
  updateOrder(id: number, newOrder: number, location: string): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}?method=updateOrder&id=${id}&newOrder=${newOrder}&location=${location}`)
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

    console.error('GalleryService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
