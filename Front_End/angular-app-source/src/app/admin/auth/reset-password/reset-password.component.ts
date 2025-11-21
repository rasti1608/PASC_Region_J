import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  token: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Get token from query parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
      if (!this.token) {
        this.errorMessage = 'Invalid reset link. Please request a new password reset.';
      }
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const { newPassword, confirmPassword } = this.resetForm.value;

    // Check passwords match
    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    // Validate password requirements
    if (newPassword.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters.';
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      this.errorMessage = 'Password must contain at least one uppercase letter.';
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      this.errorMessage = 'Password must contain at least one number.';
      return;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      this.errorMessage = 'Password must contain at least one special character.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Password reset successfully! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/admin/login']);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Failed to reset password.';
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to reset password. Please try again.';
        this.loading = false;
      }
    });
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  get newPasswordControl() {
    return this.resetForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.resetForm.get('confirmPassword');
  }
}
