import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/shared/header.component';
import { FooterComponent } from './components/shared/footer.component';
import { FaviconService } from './core/services/favicon.service';
import { AudioService } from './services/audio.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  showHeaderFooter = signal(true);

  constructor(
    private router: Router,
    private faviconService: FaviconService,
    private audioService: AudioService
  ) {}

  ngOnInit(): void {
    // Initialize favicon service
    this.faviconService.initialize();

    // Pause music when navigating to admin routes
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: any) => {
        const url = event.url;

        // Pause audio when navigating to admin pages
        if (url.startsWith('/admin')) {
          this.audioService.pause();
        }
      });

    // Listen to router events to determine if we should show header/footer
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;

        // Hide header/footer on intro pages and admin pages
        const hideRoutes = ['/pre-intro', '/intro', '/admin'];
        this.showHeaderFooter.set(!hideRoutes.some(route => url.startsWith(route)));
      });
  }
}
