import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/shared/header.component';
import { FooterComponent } from './components/shared/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  showHeaderFooter = signal(true);

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Listen to router events to determine if we should show header/footer
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;

        // Hide header/footer on intro pages
        const hideRoutes = ['/pre-intro', '/intro'];
        this.showHeaderFooter.set(!hideRoutes.some(route => url.startsWith(route)));
      });
  }
}
