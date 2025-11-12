import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pre-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pre-intro.component.html',
  styleUrl: './pre-intro.component.css'
})
export class PreIntroComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Check if user has already seen the intro sequence
    const introSeen = sessionStorage.getItem('introSeen');

    if (introSeen === 'true') {
      // Skip directly to home page
      this.router.navigate(['/home']);
    }
  }

  ngAfterViewInit(): void {
    // Force video to play with multiple attempts
    setTimeout(() => {
      const video = this.elementRef.nativeElement.querySelector('.pre-intro-bg-video') as HTMLVideoElement;
      
      if (video) {
        console.log('Found video element:', video);
        console.log('Video readyState:', video.readyState);
        console.log('Video paused:', video.paused);
        
        // Set all properties explicitly
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        
        // Try to play
        video.play()
          .then(() => {
            console.log('Video playing successfully!');
          })
          .catch(error => {
            console.error('Video autoplay failed:', error);
            
            // Try again after user interaction
            document.addEventListener('click', () => {
              video.play();
            }, { once: true });
          });
      } else {
        console.error('Video element not found!');
      }
    }, 100);
  }

  /**
   * Handle "Launch Site" button click
   */
  onLaunchClick(): void {
    // Navigate to intro page
    this.router.navigate(['/intro']);
  }
}