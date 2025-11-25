/**
 * TypeScript interfaces for ColdFusion API responses
 * PASC Region J Conference 2026
 */

// Base API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
  detail?: string;
  errors?: string[];
}

// Announcements
export interface Announcement {
  id: number;
  title: string;
  content: string;
  publishstart: string;
  publishend: string | null;
  isfeatured: boolean;
  displayorder: number;
}

// Gallery
export interface GalleryImage {
  id: number;
  title: string;
  filename: string;
  fileextension: string;
  displayorder: number;
  fullpath: string;
}

export interface GalleryResponse extends ApiResponse<GalleryImage[]> {
  page?: number;
  limit?: number;
  location?: string;
}

export interface GalleryCountResponse extends ApiResponse<never> {
  totalcount: number;
  location?: string;
}

// Documents
export interface Document {  id: number;  title: string;  description: string;  filename: string;  originalfilename: string;  fileextension: string;  filesize: number;  filesizeformatted: string;  documenttype: string;  displayorder: number;  fileicon: string;  downloadpath: string;}

// Workshops/Forms
export interface WorkshopForm {
  id: number;
  formname: string;
  formdescription: string;
  embedcode: string;
  displayorder: number;
}

// Contact
export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string; // honeypot
}

export interface ContactResponse extends ApiResponse<never> {
  errors?: string[];
}

// Pages/Conference Info
export interface ConferenceInfo {
  appName: string;
  version: string;
  conferenceDate: string;
  conferenceLocation: string;
  conferenceTheme: string;
  siteName: string;
  siteTagline: string;
  fromEmail: string;
  adminEmail: string;
  supportEmail: string;
}

export interface PageSection {
  title: string;
  content: string;
}

export interface PageContent {
  title: string;
  subtitle: string;
  mission?: string;
  description?: string;
  sections?: PageSection[];
  categories?: any[];
  requirements?: string[];
}

// Schedule
export interface ScheduleItem {
  schedule_id?: number;
  event_time: string;
  end_time?: string;
  event_icon?: string;
  event_name: string;
  event_description?: string;
  display_order: number;
  is_active?: boolean;
}
