import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

// Layout
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

// Auth Components
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';

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

// Documents
import { DocumentListComponent } from './documents/document-list/document-list.component';
import { DocumentUploadComponent } from './documents/document-upload/document-upload.component';
import { DocumentEditComponent } from './documents/document-edit/document-edit.component';

// Contacts
import { ContactListComponent } from './contacts/contact-list/contact-list.component';

// Users
import { UserListComponent } from './users/user-list/user-list.component';
import { UserFormComponent } from './users/user-form/user-form.component';

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

      // Protected routes with admin layout
      // TODO: Re-enable AuthGuard in Phase 2 when authentication API is connected
      {
        path: '',
        component: AdminLayoutComponent,
        // canActivate: [AuthGuard],  // Temporarily disabled for Phase 1 development
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent },

          // Change password (required after first login)
          { path: 'change-password', component: ChangePasswordComponent },

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

          // Documents
          { path: 'documents', component: DocumentListComponent },
          { path: 'documents/upload', component: DocumentUploadComponent },
          { path: 'documents/edit/:id', component: DocumentEditComponent },

          // Contacts
          { path: 'contacts', component: ContactListComponent },

          // Users (admin only)
          { path: 'users', component: UserListComponent },
          { path: 'users/add', component: UserFormComponent },
          { path: 'users/edit/:id', component: UserFormComponent },

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
