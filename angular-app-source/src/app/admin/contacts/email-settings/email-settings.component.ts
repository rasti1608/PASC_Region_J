import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface EmailRecipient {
  id: number;
  email: string;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-email-settings',
  standalone: false,
  templateUrl: './email-settings.component.html',
  styleUrls: ['./email-settings.component.css']
})
export class EmailSettingsComponent implements OnInit {
  loading = false;
  error = '';
  success = '';

  recipients: EmailRecipient[] = [];
  newEmail = '';
  addingRecipient = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecipients();
  }

  loadRecipients(): void {
    this.loading = true;
    this.error = '';

    this.http.get<any>('/api/contacts-admin.cfc?method=getEmailRecipients')
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.recipients = response.data;
          } else {
            this.error = response.message || 'Failed to load recipients';
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error loading recipients. Please try again.';
          console.error('Error loading recipients:', err);
        }
      });
  }

  addRecipient(): void {
    if (!this.newEmail || !this.newEmail.trim()) {
      this.error = 'Please enter an email address';
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newEmail.trim())) {
      this.error = 'Please enter a valid email address';
      return;
    }

    this.addingRecipient = true;
    this.error = '';
    this.success = '';

    const formData = new FormData();
    formData.append('email', this.newEmail.trim());

    this.http.post<any>('/api/contacts-admin.cfc?method=addEmailRecipient', formData)
      .subscribe({
        next: (response) => {
          this.addingRecipient = false;
          if (response.success) {
            this.recipients = response.data;
            this.newEmail = '';
            this.success = 'Recipient added successfully';
            setTimeout(() => this.success = '', 3000);
          } else {
            this.error = response.message || 'Failed to add recipient';
          }
        },
        error: (err) => {
          this.addingRecipient = false;
          this.error = 'Error adding recipient. Please try again.';
          console.error('Error adding recipient:', err);
        }
      });
  }

  toggleStatus(recipient: EmailRecipient): void {
    if (recipient.is_primary) {
      this.error = 'Cannot deactivate the primary recipient';
      setTimeout(() => this.error = '', 3000);
      return;
    }

    const formData = new FormData();
    formData.append('id', recipient.id.toString());

    this.http.post<any>('/api/contacts-admin.cfc?method=toggleRecipientStatus', formData)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.recipients = response.data;
            this.success = 'Recipient status updated successfully';
            setTimeout(() => this.success = '', 3000);
          } else {
            this.error = response.message || 'Failed to update status';
          }
        },
        error: (err) => {
          this.error = 'Error updating status. Please try again.';
          console.error('Error updating status:', err);
        }
      });
  }

  deleteRecipient(recipient: EmailRecipient): void {
    if (recipient.is_primary) {
      this.error = 'Cannot delete the primary recipient';
      setTimeout(() => this.error = '', 3000);
      return;
    }

    if (!confirm(`Are you sure you want to delete ${recipient.email}?`)) {
      return;
    }

    const formData = new FormData();
    formData.append('id', recipient.id.toString());

    this.http.post<any>('/api/contacts-admin.cfc?method=deleteEmailRecipient', formData)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.recipients = response.data;
            this.success = 'Recipient deleted successfully';
            setTimeout(() => this.success = '', 3000);
          } else {
            this.error = response.message || 'Failed to delete recipient';
          }
        },
        error: (err) => {
          this.error = 'Error deleting recipient. Please try again.';
          console.error('Error deleting recipient:', err);
        }
      });
  }

  formatDate(dateString: string): string {
    // Convert database timestamp to MM/DD/YYYY format
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  goBack(): void {
    this.router.navigate(['/admin/contacts']);
  }
}
