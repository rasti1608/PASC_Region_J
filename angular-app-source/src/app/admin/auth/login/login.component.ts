import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;
  returnUrl = '/admin/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // NOTE: Do not auto-redirect here. Allow users to see login page
    // even if they have a lingering session. This prevents security issues
    // where users navigating from error pages (activate/reset) get logged
    // in automatically. The ngOnInit will handle proper redirect logic.

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';

    // Check if user is already authenticated
    // Only redirect if they're authenticated AND not coming from an auth error page
    const fromActivate = this.route.snapshot.queryParams['from'] === 'activate';
    const fromReset = this.route.snapshot.queryParams['from'] === 'reset';

    if (this.authService.isAuthenticated() && !fromActivate && !fromReset) {
      // User is already logged in and not coming from error page, redirect to dashboard
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials = {
      username: this.loginForm.value.username.trim(),
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response.success) {
          // Check if user must change password
          if (response.user?.must_change_password) {
            this.router.navigate(['/admin/change-password']);
          } else {
            // Redirect to return URL or dashboard
            this.router.navigate([this.returnUrl]);
          }
        } else {
          this.errorMessage = response.message || 'Login failed. Please try again.';
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Login failed. Please check your credentials and try again.';
        this.loading = false;
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}
