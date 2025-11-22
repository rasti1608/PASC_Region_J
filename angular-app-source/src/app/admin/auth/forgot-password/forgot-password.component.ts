import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  resetForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.resetForm.value.email.trim();

    this.authService.requestPasswordReset(email).subscribe({
      next: (response) => {
        console.log('Password reset API response:', response);
        this.loading = false;
        if (response.success) {
          this.emailSent = true;
          //this.successMessage = 'Password reset link sent successfully!';
        } else {
          console.warn('Password reset returned unsuccessful:', response.message);
          // Always show success to prevent email enumeration
          this.emailSent = true;
        }
      },
      error: (error) => {
        console.error('Password reset API error:', error);
        this.loading = false;
        // Always show success to prevent email enumeration
        this.emailSent = true;
      }
    });
  }

  get emailControl() {
    return this.resetForm.get('email');
  }
}
