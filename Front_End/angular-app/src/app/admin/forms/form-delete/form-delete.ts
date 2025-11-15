import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsService } from '../../services/forms.service';
import { Form } from '../../models/form.model';

@Component({
  selector: 'app-form-delete',
  standalone: false,
  templateUrl: './form-delete.html',
  styleUrls: ['./form-delete.css']
})
export class FormDeleteComponent implements OnInit {
  form: Form | null = null;
  loading = false;
  error: string | null = null;
  formId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formsService: FormsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.formId = +params['id'];
        this.loadForm();
      } else {
        this.error = 'No form ID provided';
      }
    });
  }

  /**
   * Load form details for confirmation display
   */
  loadForm(): void {
    if (!this.formId) return;

    this.loading = true;
    this.error = null;

    this.formsService.getById(this.formId).subscribe({
      next: (data) => {
        this.form = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load form';
        this.loading = false;
        console.error('Error loading form:', err);
      }
    });
  }

  /**
   * Confirm and delete the form
   */
  confirmDelete(): void {
    if (!this.formId || !this.form) return;

    this.loading = true;
    this.error = null;

    this.formsService.delete(this.formId).subscribe({
      next: () => {
        // Redirect back to list with the same location filter
        this.router.navigate(['/admin/forms'], {
          queryParams: { location: this.form!.page_location }
        });
      },
      error: (err) => {
        this.error = 'Failed to delete form';
        this.loading = false;
        console.error('Error deleting form:', err);
      }
    });
  }

  /**
   * Cancel and return to list
   */
  cancel(): void {
    if (this.form) {
      this.router.navigate(['/admin/forms'], {
        queryParams: { location: this.form.page_location }
      });
    } else {
      this.router.navigate(['/admin/forms']);
    }
  }
}
