import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { WorkshopsComponent } from './components/workshops/workshops.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home - PASC Region J Conference 2026' },
  { path: 'about', component: AboutComponent, title: 'About - PASC Region J' },
  { path: 'gallery', component: GalleryComponent, title: 'Gallery - PASC Region J' },
  { path: 'workshops', component: WorkshopsComponent, title: 'Workshops - PASC Region J' },
  { path: 'resources', component: ResourcesComponent, title: 'Resources - PASC Region J' },
  { path: 'contact', component: ContactComponent, title: 'Contact - PASC Region J' },
  { path: '**', redirectTo: '', pathMatch: 'full' } // 404 redirect to home
];
