import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;

  // Form groups
  profileForm: FormGroup;
  passwordForm: FormGroup;

  // Success/error messages
  profileSuccess: string | null = null;
  profileError: string | null = null;
  passwordSuccess: string | null = null;
  passwordError: string | null = null;
  pictureSuccess: string | null = null;
  pictureError: string | null = null;

  // Loading states
  profileLoading = false;
  passwordLoading = false;
  pictureLoading = false;

  // Profile picture
  selectedPictureFile: File | null = null;
  picturePreviewUrl: string | null = null;

  // Password visibility toggles
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    // Initialize profile form
    this.profileForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]]
    });

    // Initialize password form
    this.passwordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/)
      ]],
      confirm_new_password: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  /**
   * Load user profile
   */
  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          full_name: user.full_name,
          email: user.email
        });
        this.loading = false;
      },
      error: (err) => {
        this.profileError = err.message || 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  /**
   * Update profile information
   */
  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.profileLoading = true;
    this.profileSuccess = null;
    this.profileError = null;

    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: (response) => {
        this.profileSuccess = response.message || 'Profile updated successfully';
        this.profileLoading = false;
        this.loadProfile(); // Reload profile
      },
      error: (err) => {
        this.profileError = err.message || 'Failed to update profile';
        this.profileLoading = false;
      }
    });
  }

  /**
   * Change password
   */
  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.passwordLoading = true;
    this.passwordSuccess = null;
    this.passwordError = null;

    this.profileService.changePassword(this.passwordForm.value).subscribe({
      next: (response) => {
        this.passwordSuccess = response.message || 'Password changed successfully';
        this.passwordForm.reset();
        this.passwordLoading = false;
      },
      error: (err) => {
        this.passwordError = err.message || 'Failed to change password';
        this.passwordLoading = false;
      }
    });
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.pictureError = 'Invalid file type. Only JPG, PNG, and GIF files are allowed.';
        input.value = '';
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5242880) {
        this.pictureError = 'File too large. Maximum file size is 5MB.';
        input.value = '';
        return;
      }

      this.selectedPictureFile = file;
      this.pictureError = null;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.picturePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Upload profile picture
   */
  uploadPicture(): void {
    if (!this.selectedPictureFile) {
      this.pictureError = 'Please select a file to upload';
      return;
    }

    this.pictureLoading = true;
    this.pictureSuccess = null;
    this.pictureError = null;

    this.profileService.uploadProfilePicture(this.selectedPictureFile).subscribe({
      next: (response) => {
        this.pictureSuccess = response.message || 'Profile picture uploaded successfully!';
        this.selectedPictureFile = null;
        this.picturePreviewUrl = null;
        this.pictureLoading = false;
        this.loadProfile(); // Reload profile to get new picture

        // Clear file input
        const fileInput = document.getElementById('profile_picture') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (err) => {
        this.pictureError = err.message || 'Failed to upload profile picture';
        this.pictureLoading = false;
      }
    });
  }

  /**
   * Remove profile picture
   */
  removePicture(): void {
    if (!confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    this.pictureLoading = true;
    this.pictureSuccess = null;
    this.pictureError = null;

    this.profileService.removeProfilePicture().subscribe({
      next: (response) => {
        this.pictureSuccess = response.message || 'Profile picture removed successfully';
        this.pictureLoading = false;
        this.loadProfile(); // Reload profile
      },
      error: (err) => {
        this.pictureError = err.message || 'Failed to remove profile picture';
        this.pictureLoading = false;
      }
    });
  }

  /**
   * Get profile picture URL
   */
  getProfilePictureUrl(): string {
    if (this.picturePreviewUrl) {
      return this.picturePreviewUrl;
    }
    if (this.user?.profile_picture) {
      return `/assets/img/profiles/${this.user.profile_picture}?v=${new Date().getTime()}`;
    }
    return '';
  }

  /**
   * Custom validator to check if passwords match
   */
  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('new_password')?.value;
    const confirmPassword = group.get('confirm_new_password')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Get password error message
   */
  getPasswordErrorMessage(): string {
    const control = this.passwordForm.get('new_password');
    if (!control?.errors) return '';

    if (control.errors['required']) return 'Password is required';
    if (control.errors['minlength']) return 'Password must be at least 8 characters';
    if (control.errors['pattern']) {
      return 'Password must contain uppercase letter, number, and special character';
    }
    return '';
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmNewPassword = !this.showConfirmNewPassword;
        break;
    }
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string | null): string {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}
