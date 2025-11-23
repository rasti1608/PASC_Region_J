import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-activate',
  standalone: false,
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {
  activateForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  token: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  // Password strength indicator
  passwordStrength = 0;
  strengthLabel = '';
  strengthColor = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.activateForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });

    // Subscribe to password changes for strength indicator
    this.activateForm.get('newPassword')?.valueChanges.subscribe(value => {
      this.calculatePasswordStrength(value);
    });
  }

  ngOnInit(): void {
    // Get token from query parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
      if (!this.token) {
        this.errorMessage = 'Invalid activation link. Please contact the administrator.';
      }
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

  onSubmit(): void {
    if (this.activateForm.invalid || !this.token) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const { newPassword, confirmPassword } = this.activateForm.value;

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

    this.authService.activateAccount(this.token, newPassword).subscribe({
      next: (response) => {
        if (response.success) {
          // Backend now auto-logs user in after successful activation
          // Update the current user in AuthService so the app knows user is logged in
          if (response.user) {
            // The authService will update currentUserSubject through the API response
            // Just need to trigger a re-check to get the session
            this.authService.checkAuthStatus().subscribe();
          }

          this.successMessage = 'Account activated successfully! You are now logged in. Redirecting to dashboard...';
          setTimeout(() => {
            // Redirect to dashboard since user is now logged in
            this.router.navigate(['/admin/dashboard']);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Failed to activate account.';
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to activate account. Please try again or contact the administrator.';
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
    return this.activateForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.activateForm.get('confirmPassword');
  }
}
