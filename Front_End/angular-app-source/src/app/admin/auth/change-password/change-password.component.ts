import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  // Password strength indicator
  passwordStrength = 0;
  strengthLabel = '';
  strengthColor = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });

    // Subscribe to password changes for strength indicator
    this.passwordForm.get('newPassword')?.valueChanges.subscribe(value => {
      this.calculatePasswordStrength(value);
    });
  }

  calculatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 0;
      this.strengthLabel = '';
      this.strengthColor = '';
      return;
    }

    let strength = 0;

    // Length checks
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (password.length >= 16) strength += 10;

    // Character type checks
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 20;

    // Bonus for variety
    const types = [/[a-z]/, /[A-Z]/, /[0-9]/, /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/];
    const typeCount = types.filter(regex => regex.test(password)).length;
    if (typeCount >= 4) strength += 10;

    // Cap at 100
    this.passwordStrength = Math.min(strength, 100);

    // Set label and color based on strength
    if (this.passwordStrength < 20) {
      this.strengthLabel = 'Weak';
      this.strengthColor = '#dc3545'; // Red
    } else if (this.passwordStrength < 40) {
      this.strengthLabel = 'Fair';
      this.strengthColor = '#fd7e14'; // Orange
    } else if (this.passwordStrength < 60) {
      this.strengthLabel = 'Medium';
      this.strengthColor = '#ffc107'; // Yellow
    } else if (this.passwordStrength < 80) {
      this.strengthLabel = 'Good';
      this.strengthColor = '#90EE90'; // Light Green
    } else {
      this.strengthLabel = 'Strong';
      this.strengthColor = '#28a745'; // Dark Green
    }
  }

  logout(): void {
    // Subscribe to the Observable to trigger the logout API call
    // The auth service handles navigation in its tap/catchError
    this.authService.logout().subscribe();
  }

  ngOnInit(): void {
    // Check if user needs to change password
    const user = this.authService.getCurrentUser();
    if (user && !user.must_change_password) {
      // User doesn't need to change password, redirect to dashboard
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.value;

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

    this.authService.changeRequiredPassword(newPassword).subscribe({
      next: (response) => {
        if (response.success) {
          // Redirect to dashboard
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = response.message || 'Failed to change password.';
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to change password. Please try again.';
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
    return this.passwordForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.passwordForm.get('confirmPassword');
  }
}
