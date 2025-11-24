import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AdminRoutingModule } from './admin-routing.module';
import { SecureJsonInterceptor } from './interceptors/secure-json.interceptor';

// Layout Components
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AdminSidebarComponent } from './layout/admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from './layout/admin-header/admin-header.component';

// Auth Components
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ActivateComponent } from './auth/activate/activate.component';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';

// Announcements
import { AnnouncementListComponent } from './announcements/announcement-list/announcement-list.component';
import { AnnouncementFormComponent } from './announcements/announcement-form/announcement-form.component';
import { AnnouncementDeleteComponent } from './announcements/announcement-delete/announcement-delete.component';

// Forms
import { FormListComponent } from './forms/form-list/form-list.component';
import { FormFormComponent } from './forms/form-form/form-form.component';
import { FormDeleteComponent } from './forms/form-delete/form-delete';

// Gallery
import { GalleryListComponent } from './gallery/gallery-list/gallery-list.component';
import { GalleryUploadComponent } from './gallery/gallery-upload/gallery-upload.component';
import { GalleryEditComponent } from './gallery/gallery-edit/gallery-edit.component';
import { GalleryDeleteComponent } from './gallery/gallery-delete/gallery-delete.component';

// Documents
import { DocumentListComponent } from './documents/document-list/document-list.component';
import { DocumentUploadComponent } from './documents/document-upload/document-upload.component';
import { DocumentEditComponent } from './documents/document-edit/document-edit.component';
import { DocumentDeleteComponent } from './documents/document-delete/document-delete.component';

// Schedule
import { ScheduleManagementComponent } from './schedule/schedule-management/schedule-management.component';

// Contacts
import { ContactListComponent } from './contacts/contact-list/contact-list';
import { EmailSettingsComponent } from './contacts/email-settings/email-settings.component';

// Users
import { UserListComponent } from './users/user-list/user-list.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { UserDeleteComponent } from './users/user-delete/user-delete';

// Profile
import { ProfileComponent } from './profile/profile.component';

// Shared Components
import { DataTableComponent } from './shared/data-table/data-table.component';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { SearchFilterComponent } from './shared/search-filter/search-filter.component';
import { StatusBadgeComponent } from './shared/status-badge/status-badge.component';
import { StatsCardComponent } from './shared/stats-card/stats-card.component';
import { ModalComponent } from './shared/modal/modal.component';
import { EmptyStateComponent } from './shared/empty-state/empty-state.component';

@NgModule({
  declarations: [
    // Layout
    AdminLayoutComponent,
    AdminSidebarComponent,
    AdminHeaderComponent,

    // Auth
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    ActivateComponent,

    // Dashboard
    DashboardComponent,

    // Announcements
    AnnouncementListComponent,
    AnnouncementFormComponent,
    AnnouncementDeleteComponent,

    // Forms
    FormListComponent,
    FormFormComponent,
    FormDeleteComponent,

    // Gallery
    GalleryListComponent,
    GalleryUploadComponent,
    GalleryEditComponent,
    GalleryDeleteComponent,

    // Documents
    DocumentListComponent,
    DocumentUploadComponent,
    DocumentEditComponent,
    DocumentDeleteComponent,

    // Schedule
    ScheduleManagementComponent,

    // Contacts
    ContactListComponent,
    EmailSettingsComponent,

    // Users
    UserListComponent,
    UserFormComponent,
    UserDeleteComponent,

    // Profile
    ProfileComponent,

    // Shared
    DataTableComponent,
    PaginationComponent,
    SearchFilterComponent,
    StatusBadgeComponent,
    StatsCardComponent,
    ModalComponent,
    EmptyStateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecureJsonInterceptor,
      multi: true
    }
  ]
})
export class AdminModule { }
