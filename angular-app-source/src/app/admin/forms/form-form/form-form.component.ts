import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsService } from '../../services/forms.service';
import { Form, FormFormData } from '../../models/form.model';

@Component({
  selector: 'app-form-form',
  standalone: false,
  templateUrl: './form-form.component.html',
  styleUrls: ['./form-form.component.css']
})
export class FormFormComponent implements OnInit {
  isEditMode = false;
  formId: number | null = null;
  loading = false;
  error: string | null = null;
  currentLocation: 'Workshops' | 'Registration' = 'Workshops';

  // Form data
  formData: FormFormData = {
    form_name: '',
    form_description: null,
    embed_code: '',
    page_location: 'Workshops',
    is_active: false // Default to inactive - must be manually activated
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formsService: FormsService
  ) {}

  ngOnInit(): void {
    // Get location from query params
    this.route.queryParams.subscribe(params => {
      this.currentLocation = (params['location'] as 'Workshops' | 'Registration') || 'Workshops';
      this.formData.page_location = this.currentLocation;
    });

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.formId = +params['id'];
        this.loadForm();
      }
    });
  }

  /**
   * Load form for editing
   */
  loadForm(): void {
    if (!this.formId) return;

    this.loading = true;
    this.error = null;

    this.formsService.getById(this.formId).subscribe({
      next: (data) => {
        this.formData = {
          form_name: data.form_name,
          form_description: data.form_description,
          embed_code: data.embed_code,
          page_location: data.page_location,
          is_active: data.is_active
        };
        this.currentLocation = data.page_location;
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
   * Submit form (create or update)
   */
  onSubmit(): void {
    // Validate
    if (!this.formData.form_name.trim()) {
      this.error = 'Form Name is required';
      return;
    }
    if (!this.formData.embed_code.trim()) {
      this.error = 'Google Form Embed Code is required';
      return;
    }
    if (!this.formData.page_location) {
      this.error = 'Page Location is required';
      return;
    }

    this.loading = true;
    this.error = null;

    const operation = this.isEditMode && this.formId
      ? this.formsService.update(this.formId, this.formData)
      : this.formsService.create(this.formData);

    operation.subscribe({
      next: () => {
        // Redirect immediately to list page (like CF admin)
        this.router.navigate(['/admin/forms'], {
          queryParams: { location: this.formData.page_location }
        });
      },
      error: (err) => {
        this.error = err.message || 'Failed to save form';
        this.loading = false;
        console.error('Error saving form:', err);
      }
    });
  }

  /**
   * Cancel and return to list
   */
  cancel(): void {
    this.router.navigate(['/admin/forms'], {
      queryParams: { location: this.currentLocation }
    });
  }
}
