import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User, Role, CreateUserRequest, UpdateUserRequest } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userId: number | null = null;
  isEditMode = false;
  user: User | null = null;
  roles: Role[] = [];
  loading = false;
  error: string | null = null;
  tempPassword: string | null = null;
  successMessage: string | null = null;

  // Form fields
  username = '';
  password = '';
  confirmPassword = '';
  fullName = '';
  email = '';
  roleId = 0;
  isActive = true;

  // Edit mode only
  changePassword = false;
  newPassword = '';
  confirmNewPassword = '';

  // Password visibility toggles
  showPassword = false;
  showConfirmPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = parseInt(id, 10);
      this.isEditMode = true;
      this.loadUser();
    }
    this.loadRoles();
  }

  loadUser(): void {
    if (!this.userId) return;

    this.loading = true;
    this.usersService.getById(this.userId).subscribe({
      next: (user) => {
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
      case 'password':
        this.showPassword = !this.showPassword;
        break;
      case 'confirmPassword':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
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
      // Add mode - validate password
      if (!this.username || !this.password) {
        this.error = 'Username and password are required';
        return;
      }

      if (this.password.length < 8) {
        this.error = 'Password must be at least 8 characters long';
        return;
      }

      if (!/[A-Z]/.test(this.password)) {
        this.error = 'Password must contain at least one uppercase letter (A-Z)';
        return;
      }

      if (!/[0-9]/.test(this.password)) {
        this.error = 'Password must contain at least one number (0-9)';
        return;
      }

      if (!/[^a-zA-Z0-9]/.test(this.password)) {
        this.error = 'Password must contain at least one special character (e.g., !@#$%^&*)';
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
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
      password: this.password,
      full_name: this.fullName,
      email: this.email,
      role_id: this.roleId,
      is_active: this.isActive
    };

    this.loading = true;
    this.usersService.create(newUser).subscribe({
      next: () => {
        this.tempPassword = this.password;
        this.successMessage = 'User created successfully!';
        this.loading = false;
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
        this.successMessage = 'User updated successfully';
        this.changePassword = false;
        this.newPassword = '';
        this.confirmNewPassword = '';
        this.loadUser(); // Reload user data
        this.loading = false;
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

  addAnotherUser(): void {
    // Reset form for new user
    this.successMessage = null;
    this.tempPassword = null;
    this.error = null;
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.fullName = '';
    this.email = '';
    this.isActive = true;
    // Keep the selected role
  }
}
