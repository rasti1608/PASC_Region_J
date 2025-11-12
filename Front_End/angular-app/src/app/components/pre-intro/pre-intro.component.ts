import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pre-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pre-intro.component.html',
  styleUrl: './pre-intro.component.css'
})
export class PreIntroComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if user has already seen the intro sequence
    const introSeen = sessionStorage.getItem('introSeen');

    if (introSeen === 'true') {
      // Skip directly to home page
      this.router.navigate(['/home']);
    }
  }

  /**
   * Handle "Launch Site" button click
   */
  onLaunchClick(): void {
    // Navigate to intro page
    this.router.navigate(['/intro']);
  }
}
