import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Document, DocumentFormData } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private apiUrl = '/api/documents.cfc';

  constructor(private http: HttpClient) {}

  /**
   * Get all documents (for admin panel)
   */
  getAll(): Observable<Document[]> {
    return this.http.get<{ data: Document[] }>(`${this.apiUrl}?method=getDocumentsAdmin`)
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }

  /**
   * Get a single document by ID
   */
  getById(id: number): Observable<Document> {
    return this.http.get<{ data: Document }>(`${this.apiUrl}?method=getDocument&id=${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Upload a new document
   */
  upload(formData: FormData): Observable<Document> {
    return this.http.post<{ data: Document }>(`${this.apiUrl}?method=uploadDocument`, formData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing document
   */
  update(id: number, data: DocumentFormData): Observable<Document> {
    const params = new URLSearchParams({
      method: 'updateDocument',
      id: id.toString(),
      title: data.title,
      description: data.description || '',
      document_type: data.document_type || '',
      is_active: data.is_active.toString()
    });
    return this.http.get<{ data: Document }>(`${this.apiUrl}?${params.toString()}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Delete a document
   */
  delete(id: number): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}?method=deleteDocument&id=${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Toggle active status of a document
   */
  toggleActive(id: number): Observable<Document> {
    return this.http.get<{ data: Document }>(`${this.apiUrl}?method=toggleActive&id=${id}`)
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

    console.error('DocumentsService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
