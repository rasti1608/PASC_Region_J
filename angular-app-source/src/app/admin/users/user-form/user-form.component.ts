import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { User, Role, CreateUserRequest, UpdateUserRequest } from '../../models/user.model';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnDestroy {
  userId: number | null = null;
  isEditMode = false;
  user: User | null = null;
  roles: Role[] = [];
  loading = false;
  error: string | null = null;

  // Username availability checker (like GitHub's username field)
  usernameCheck$ = new Subject<string>();
  usernameCheckSubscription: Subscription | null = null;
  usernameAvailable: boolean | null = null;  // null = not checked, true = available, false = taken
  usernameCheckInProgress = false;

  // Form fields
  username = '';
  fullName = '';
  email = '';
  roleId = 0;
  isActive = true;

  // Edit mode only
  changePassword = false;
  newPassword = '';
  confirmNewPassword = '';

  // Password visibility toggles (edit mode only)
  showNewPassword = false;
  showConfirmNewPassword = false;

  // Password strength indicators (for edit mode)
  newPasswordStrength = 0;
  newPasswordStrengthLabel = '';
  newPasswordStrengthColor = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = parseInt(id, 10);
      this.isEditMode = true;
      this.loadUser();
    }
    this.loadRoles();

    // Setup real-time username availability checker with 500ms debounce
    // This prevents API spam while user is typing
    this.usernameCheckSubscription = this.usernameCheck$.pipe(
      debounceTime(500),  // Wait 500ms after user stops typing
      distinctUntilChanged(),  // Only check if username actually changed
      switchMap(username => {
        // Don't check empty usernames
        if (!username || username.trim().length === 0) {
          this.usernameAvailable = null;
          this.usernameCheckInProgress = false;
          return [];
        }

        // Don't check usernames with spaces
        if (/\s/.test(username)) {
          this.usernameAvailable = false;
          this.usernameCheckInProgress = false;
          return [];
        }

        // Start checking
        this.usernameCheckInProgress = true;

        // Call API to check availability
        return this.usersService.checkUsernameAvailability(username, this.userId || undefined);
      })
    ).subscribe({
      next: (result: any) => {
        // Update availability status
        this.usernameAvailable = result.available;
        this.usernameCheckInProgress = false;
      },
      error: () => {
        // On error, assume not available
        this.usernameAvailable = false;
        this.usernameCheckInProgress = false;
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.usernameCheckSubscription) {
      this.usernameCheckSubscription.unsubscribe();
    }
  }

  loadUser(): void {
    if (!this.userId) return;

    this.loading = true;
    this.usersService.getById(this.userId).subscribe({
      next: (user) => {
        // Security check: Prevent non-admin users from editing the admin account
        const currentUser = this.authService.getCurrentUser();
        if (user.username === 'admin' && currentUser?.username !== 'admin') {
          this.error = 'Admin account can only be edited by admin';
          this.loading = false;
          // Redirect back to user list after showing error
          setTimeout(() => {
            this.router.navigate(['/admin/users']);
          }, 2000);
          return;
        }

        this.user = user;
        this.username = user.username;
        this.fullName = user.full_name;
        this.email = user.email;
        this.roleId = user.role_id;
        this.isActive = user.is_active;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadRoles(): void {
    this.usersService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        if (!this.isEditMode && roles.length > 0) {
          this.roleId = roles[0].id;
        }
      },
      error: (err) => {
        console.error('Error loading roles:', err);
      }
    });
  }

  togglePasswordVisibility(field: string): void {
    const passwordField = document.getElementById(field) as HTMLInputElement;
    if (!passwordField) return;

    switch (field) {
      case 'newPassword':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirmNewPassword':
        this.showConfirmNewPassword = !this.showConfirmNewPassword;
        break;
    }

    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
  }

  onChangePasswordToggle(): void {
    if (!this.changePassword) {
      this.newPassword = '';
      this.confirmNewPassword = '';
    }
  }

  onSubmit(): void {
    this.error = null;

    // Validation
    if (!this.fullName || !this.email || !this.roleId) {
      this.error = 'Please fill in all required fields';
      return;
    }

    if (!this.isEditMode) {
      // Add mode - validate username only (password will be auto-generated)
      if (!this.username) {
        this.error = 'Username is required';
        return;
      }

      // Validate username - no spaces allowed
      if (/\s/.test(this.username)) {
        this.error = 'Username cannot contain spaces';
        return;
      }

      this.createUser();
    } else {
      // Edit mode - validate password if changing
      if (this.changePassword) {
        if (!this.newPassword) {
          this.error = 'New password is required when "Change Password" is checked';
          return;
        }

        if (this.newPassword.length < 8) {
          this.error = 'Password must be at least 8 characters long';
          return;
        }

        if (!/[A-Z]/.test(this.newPassword)) {
          this.error = 'Password must contain at least one uppercase letter (A-Z)';
          return;
        }

        if (!/[0-9]/.test(this.newPassword)) {
          this.error = 'Password must contain at least one number (0-9)';
          return;
        }

        if (!/[^a-zA-Z0-9]/.test(this.newPassword)) {
          this.error = 'Password must contain at least one special character (e.g., !@#$%^&*)';
          return;
        }

        if (this.newPassword !== this.confirmNewPassword) {
          this.error = 'Passwords do not match';
          return;
        }
      }

      this.updateUser();
    }
  }

  createUser(): void {
    const newUser: CreateUserRequest = {
      username: this.username,
      full_name: this.fullName,
      email: this.email,
      role_id: this.roleId,
      is_active: this.isActive
    };

    this.loading = true;
    this.usersService.create(newUser).subscribe({
      next: (response: any) => {
        // Double-check that the API returned success (service should have already validated this)
        if (response.success === true) {
          // Redirect back to user list
          this.router.navigate(['/admin/users']);
        } else {
          // This shouldn't happen (service should throw error), but handle it just in case
          this.error = response.message || 'Failed to create user';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = err.message || 'Failed to create user';
        this.loading = false;
      }
    });
  }

  updateUser(): void {
    if (!this.userId) return;

    const updatedUser: any = {
      id: this.userId,
      full_name: this.fullName,
      email: this.email,
      role_id: this.roleId,
      is_active: this.isActive
    };

    // Add password if changing
    if (this.changePassword && this.newPassword) {
      updatedUser.password = this.newPassword;
    }

    this.loading = true;
    this.usersService.update(updatedUser).subscribe({
      next: () => {
        // Redirect back to user list
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        this.error = err.message || 'Failed to update user';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }

  /**
   * Triggered when username field changes
   * Emits the username to the debounced checker
   */
  onUsernameChange(): void {
    // Only check in add mode (not when editing existing user)
    if (!this.isEditMode) {
      this.usernameCheck$.next(this.username);
    }
  }

  onNewPasswordChange(): void {
    this.calculatePasswordStrength(this.newPassword, 'edit');
  }

  hasSpaces(value: string): boolean {
    return /\s/.test(value);
  }

  calculatePasswordStrength(password: string, mode: 'edit'): void {
    if (!password) {
      this.newPasswordStrength = 0;
      this.newPasswordStrengthLabel = '';
      this.newPasswordStrengthColor = '';
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
    strength = Math.min(strength, 100);

    // Set label and color based on strength
    let label = '';
    let color = '';

    if (strength < 20) {
      label = 'Weak';
      color = '#dc3545'; // Red
    } else if (strength < 40) {
      label = 'Fair';
      color = '#fd7e14'; // Orange
    } else if (strength < 60) {
      label = 'Medium';
      color = '#ffc107'; // Yellow
    } else if (strength < 80) {
      label = 'Good';
      color = '#90EE90'; // Light Green
    } else {
      label = 'Strong';
      color = '#28a745'; // Dark Green
    }

    this.newPasswordStrength = strength;
    this.newPasswordStrengthLabel = label;
    this.newPasswordStrengthColor = color;
  }
}
