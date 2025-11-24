import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  Announcement,
  GalleryImage,
  GalleryResponse,
  GalleryCountResponse,
  Document,
  WorkshopForm,
  ContactSubmission,
  ContactResponse,
  ConferenceInfo,
  PageContent,
  ScheduleItem
} from '../models/api-models';

/**
 * API Service for interacting with ColdFusion backend
 * All endpoints are in /api/*.cfc
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api';

  // ==================== ANNOUNCEMENTS ====================

  /**
   * Get all active announcements
   */
  getAnnouncements(): Observable<ApiResponse<Announcement[]>> {
    return this.http.get<ApiResponse<Announcement[]>>(
      `${this.baseUrl}/announcements.cfc?method=getAnnouncements`
    );
  }

  // ==================== GALLERY ====================

  /**
   * Get gallery images with pagination
   * @param location - 'gallery' or 'about_page'
   * @param page - page number (default: 1)
   * @param limit - images per page (default: 9)
   */
  getGalleryImages(location: string = 'gallery', page: number = 1, limit: number = 9): Observable<GalleryResponse> {
    const params = new HttpParams()
      .set('method', 'getImages')
      .set('location', location)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<GalleryResponse>(
      `${this.baseUrl}/gallery.cfc`,
      { params }
    );
  }

  /**
   * Get total count of gallery images
   * @param location - 'gallery' or 'about_page'
   */
  getGalleryCount(location: string = 'gallery'): Observable<GalleryCountResponse> {
    const params = new HttpParams()
      .set('method', 'getCount')
      .set('location', location);

    return this.http.get<GalleryCountResponse>(
      `${this.baseUrl}/gallery.cfc`,
      { params }
    );
  }

  // ==================== DOCUMENTS ====================

  /**
   * Get all active documents/resources
   */
  getDocuments(): Observable<ApiResponse<Document[]>> {
    return this.http.get<ApiResponse<Document[]>>(
      `${this.baseUrl}/documents.cfc?method=getDocuments`
    );
  }

  // ==================== WORKSHOPS ====================

  /**
   * Get workshop forms
   * @param location - page location (default: 'Workshops')
   */
  getWorkshopForms(location: string = 'Workshops'): Observable<ApiResponse<WorkshopForm[]>> {
    const params = new HttpParams()
      .set('method', 'getForms')
      .set('location', location);

    return this.http.get<ApiResponse<WorkshopForm[]>>(
      `${this.baseUrl}/workshops.cfc`,
      { params }
    );
  }

  // ==================== CONTACT ====================

  /**
   * Submit contact form
   * @param submission - contact form data
   */
  submitContact(submission: ContactSubmission): Observable<ContactResponse> {
    const params = new HttpParams()
      .set('method', 'submitContact')
      .set('name', submission.name)
      .set('email', submission.email)
      .set('subject', submission.subject)
      .set('message', submission.message)
      .set('website', submission.website || '');

    return this.http.post<ContactResponse>(
      `${this.baseUrl}/contact.cfc`,
      null,
      { params }
    );
  }

  // ==================== PAGES ====================

  /**
   * Get conference information
   */
  getConferenceInfo(): Observable<ApiResponse<ConferenceInfo>> {
    return this.http.get<ApiResponse<ConferenceInfo>>(
      `${this.baseUrl}/pages.cfc?method=getConferenceInfo`
    );
  }

  /**
   * Get page content
   * @param pageName - name of the page ('about', 'resources', etc.)
   */
  getPageContent(pageName: string): Observable<ApiResponse<PageContent>> {
    const params = new HttpParams()
      .set('method', 'getContent')
      .set('pageName', pageName);

    return this.http.get<ApiResponse<PageContent>>(
      `${this.baseUrl}/pages.cfc`,
      { params }
    );
  }

  // ==================== SCHEDULE ====================

  /**
   * Get conference schedule (public)
   */
  getSchedule(): Observable<ApiResponse<ScheduleItem[]>> {
    return this.http.get<ApiResponse<ScheduleItem[]>>(
      `${this.baseUrl}/schedule.cfc?method=getSchedule`
    );
  }

  /**
   * Get conference schedule for admin
   */
  getScheduleAdmin(): Observable<ApiResponse<ScheduleItem[]>> {
    return this.http.get<ApiResponse<ScheduleItem[]>>(
      `${this.baseUrl}/schedule.cfc?method=getScheduleAdmin`
    );
  }

  /**
   * Save entire schedule (batch operation)
   * @param scheduleItems - array of schedule items
   */
  saveSchedule(scheduleItems: ScheduleItem[]): Observable<ApiResponse<ScheduleItem[]>> {
    const params = new HttpParams()
      .set('method', 'saveSchedule')
      .set('scheduleData', JSON.stringify(scheduleItems));

    return this.http.post<ApiResponse<ScheduleItem[]>>(
      `${this.baseUrl}/schedule.cfc`,
      null,
      { params }
    );
  }
}
