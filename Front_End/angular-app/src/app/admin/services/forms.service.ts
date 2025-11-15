import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Form, FormFormData } from '../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  private apiUrl = '/api/forms.cfc';

  constructor(private http: HttpClient) {}

  /**
   * Get all forms for a specific location (for admin panel)
   */
  getAll(location: string): Observable<Form[]> {
    return this.http.get<{ data: Form[] }>(`${this.apiUrl}?method=getFormsAdmin&location=${location}`)
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }

  /**
   * Get a single form by ID
   */
  getById(id: number): Observable<Form> {
    return this.http.get<{ data: Form }>(`${this.apiUrl}?method=getForm&id=${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Create a new form
   */
  create(data: FormFormData): Observable<Form> {
    return this.http.post<{ data: Form }>(`${this.apiUrl}?method=saveForm`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing form
   */
  update(id: number, data: FormFormData): Observable<Form> {
    const dataWithId = { ...data, id };
    return this.http.post<{ data: Form }>(`${this.apiUrl}?method=saveForm`, dataWithId)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Delete a form
   */
  delete(id: number): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}?method=deleteForm&id=${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Toggle active status of a form
   */
  toggleActive(id: number): Observable<Form> {
    return this.http.get<{ data: Form }>(`${this.apiUrl}?method=toggleActive&id=${id}`)
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

    console.error('FormsService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
