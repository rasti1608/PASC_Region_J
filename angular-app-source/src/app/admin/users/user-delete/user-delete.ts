import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-delete',
  standalone: false,
  templateUrl: './user-delete.html',
  styleUrls: ['./user-delete.css']
})
export class UserDeleteComponent implements OnInit {
  userId: number | null = null;
  user: User | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = parseInt(id, 10);
      this.loadUser();
    } else {
      this.router.navigate(['/admin/users']);
    }
  }

  loadUser(): void {
    if (!this.userId) return;

    this.loading = true;
    this.usersService.getById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        // Check if master admin
        if (user.username === 'admin') {
          this.error = 'The master admin account cannot be deleted.';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'User not found';
        this.loading = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.userId || this.error) return;

    this.loading = true;
    this.usersService.delete(this.userId).subscribe({
      next: () => {
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        this.error = err.message || 'Failed to delete user';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }
}
