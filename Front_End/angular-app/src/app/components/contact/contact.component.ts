import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AudioService } from '../../services/audio.service';
import { ContactSubmission } from '../../models/api-models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroVideoDesktop', { static: false }) heroVideoDesktop!: ElementRef<HTMLVideoElement>;
  @ViewChild('heroVideoMobile', { static: false }) heroVideoMobile!: ElementRef<HTMLVideoElement>;

  private apiService = inject(ApiService);
  private audioService = inject(AudioService);
  private fb = inject(FormBuilder);

  contactForm!: FormGroup;
  submitting = signal(false);
  submitted = signal(false);
  successMessage = signal<string | null>(null);
  errorMessages = signal<string[]>([]);

  subjectOptions = [
    'General Inquiry',
    'Conference Registration',
    'Workshop Application',
    'Other'
  ];

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.initForm();
    this.setupAudioSubscription();
  }

  ngAfterViewInit(): void {
    // Explicitly ensure hero videos are muted
    if (this.heroVideoDesktop?.nativeElement) {
      this.heroVideoDesktop.nativeElement.muted = true;
      this.heroVideoDesktop.nativeElement.volume = 0;
    }
    if (this.heroVideoMobile?.nativeElement) {
      this.heroVideoMobile.nativeElement.muted = true;
      this.heroVideoMobile.nativeElement.volume = 0;
    }

    this.controlVideoPlayback(this.audioService.isPlaying());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupAudioSubscription(): void {
    const playingSub = this.audioService.isPlaying$.subscribe(playing => {
      this.controlVideoPlayback(playing);
    });
    this.subscriptions.push(playingSub);
  }

  private controlVideoPlayback(shouldPlay: boolean): void {
    [this.heroVideoDesktop, this.heroVideoMobile].forEach(videoRef => {
      if (videoRef && videoRef.nativeElement) {
        if (shouldPlay) {
          videoRef.nativeElement.play().catch(() => {});
        } else {
          videoRef.nativeElement.pause();
        }
      }
    });
  }

  private initForm() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      website: [''] // Honeypot field
    });
  }

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get subject() {
    return this.contactForm.get('subject');
  }

  get message() {
    return this.contactForm.get('message');
  }

  get messageCharCount(): number {
    return this.message?.value?.length || 0;
  }

  onSubmit() {
    // Reset messages
    this.errorMessages.set([]);
    this.successMessage.set(null);

    // Validate form
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      const errors: string[] = [];

      if (this.name?.hasError('required')) {
        errors.push('Name is required.');
      } else if (this.name?.hasError('minlength')) {
        errors.push('Name must be at least 2 characters.');
      }

      if (this.email?.hasError('required')) {
        errors.push('Email is required.');
      } else if (this.email?.hasError('email')) {
        errors.push('Please enter a valid email address.');
      }

      if (this.subject?.hasError('required')) {
        errors.push('Subject is required.');
      }

      if (this.message?.hasError('required')) {
        errors.push('Message is required.');
      } else if (this.message?.hasError('minlength')) {
        errors.push('Message must be at least 10 characters.');
      } else if (this.message?.hasError('maxlength')) {
        errors.push('Message must not exceed 5000 characters.');
      }

      this.errorMessages.set(errors);
      return;
    }

    // Submit form
    this.submitting.set(true);

    const submission: ContactSubmission = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message,
      website: this.contactForm.value.website
    };

    this.apiService.submitContact(submission).subscribe({
      next: (response) => {
        this.submitting.set(false);

        if (response.success) {
          this.successMessage.set(response.message || 'Thank you for your message!');
          this.submitted.set(true);
          this.contactForm.reset();
        } else {
          this.errorMessages.set(response.errors || ['An error occurred. Please try again.']);
        }
      },
      error: (err) => {
        console.error('Error submitting contact form:', err);
        this.submitting.set(false);
        this.errorMessages.set(['An error occurred while sending your message. Please try again or contact us directly at info@pascregionj.com.']);
      }
    });
  }
}
