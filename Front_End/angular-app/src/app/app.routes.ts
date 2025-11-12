import { Routes } from '@angular/router';
import { PreIntroComponent } from './components/pre-intro/pre-intro.component';
import { IntroComponent } from './components/intro/intro.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { Register } from './components/register/register';
import { WorkshopsComponent } from './components/workshops/workshops.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pre-intro', pathMatch: 'full' },
  { path: 'pre-intro', component: PreIntroComponent, title: 'PASC Region J Conference 2026' },
  { path: 'intro', component: IntroComponent, title: 'Welcome - PASC Region J' },
  { path: 'home', component: HomeComponent, title: 'Home - PASC Region J Conference 2026' },
  { path: 'about', component: AboutComponent, title: 'About - PASC Region J' },
  { path: 'gallery', component: GalleryComponent, title: 'Gallery - PASC Region J' },
  { path: 'register', component: Register, title: 'Registration - PASC Region J' },
  { path: 'workshops', component: WorkshopsComponent, title: 'Workshops - PASC Region J' },
  { path: 'resources', component: ResourcesComponent, title: 'Resources - PASC Region J' },
  { path: 'contact', component: ContactComponent, title: 'Contact - PASC Region J' },
  { path: '**', redirectTo: 'pre-intro', pathMatch: 'full' } // 404 redirect to pre-intro
];
