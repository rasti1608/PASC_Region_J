import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminRoleGuard } from './guards/admin-role.guard';

// Layout
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

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

const routes: Routes = [
  {
    path: '',
    children: [
      // Public auth routes (no layout)
      { path: 'login', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'activate', component: ActivateComponent },
      // Standalone change password (required after first login - no admin layout)
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },

      // Protected routes with admin layout
      {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent },

          // Announcements
          { path: 'announcements', component: AnnouncementListComponent },
          { path: 'announcements/add', component: AnnouncementFormComponent },
          { path: 'announcements/edit/:id', component: AnnouncementFormComponent },
          { path: 'announcements/delete/:id', component: AnnouncementDeleteComponent },

          // Forms
          { path: 'forms', component: FormListComponent },
          { path: 'forms/add', component: FormFormComponent },
          { path: 'forms/edit/:id', component: FormFormComponent },
          { path: 'forms/delete/:id', component: FormDeleteComponent },

          // Gallery
          { path: 'gallery', component: GalleryListComponent },
          { path: 'gallery/upload', component: GalleryUploadComponent },
          { path: 'gallery/edit/:id', component: GalleryEditComponent },
          { path: 'gallery/delete/:id', component: GalleryDeleteComponent },

          // Documents
          { path: 'documents', component: DocumentListComponent },
          { path: 'documents/upload', component: DocumentUploadComponent },
          { path: 'documents/edit/:id', component: DocumentEditComponent },
          { path: 'documents/delete/:id', component: DocumentDeleteComponent },

          // Schedule
          { path: 'schedule', component: ScheduleManagementComponent },

          // Contacts
          { path: 'contacts', component: ContactListComponent },
          { path: 'contacts/email-settings', component: EmailSettingsComponent },

          // Users (Admin only - role_id = 1)
          // AdminRoleGuard prevents Content Managers from accessing user management
          { path: 'users', component: UserListComponent, canActivate: [AdminRoleGuard] },
          { path: 'users/add', component: UserFormComponent, canActivate: [AdminRoleGuard] },
          { path: 'users/edit/:id', component: UserFormComponent, canActivate: [AdminRoleGuard] },
          { path: 'users/delete/:id', component: UserDeleteComponent, canActivate: [AdminRoleGuard] },

          // Profile
          { path: 'profile', component: ProfileComponent },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
