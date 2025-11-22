# PASC Region J Conference - Angular Migration

## Overview

This project migrates the PASC Region J Conference 2026 website from a traditional ColdFusion application to a modern Angular frontend while keeping ColdFusion as the backend API layer.

---

## Architecture

### Backend (ColdFusion APIs)
**Location:** `/Front_End/api/`

All ColdFusion API endpoints return JSON and are accessible via HTTP GET/POST.

### Frontend (Angular Application)
**Location:** `/Front_End/angular-app/`

Modern Angular 19 standalone components application with TypeScript.

---

## Phase 1: ColdFusion API Endpoints ✅

### Created API Files (in `/Front_End/api/`)

1. **`announcements.cfc`**
   - **Method:** `getAnnouncements()`
   - **Returns:** Active announcements with date filtering
   - **Table:** `dbo.announcements`

2. **`gallery.cfc`**
   - **Methods:**
     - `getImages(location, page, limit)` - Paginated images
     - `getCount(location)` - Total count for pagination
   - **Table:** `dbo.gallery`
   - **Locations:** 'gallery', 'about_page'

3. **`documents.cfc`**
   - **Method:** `getDocuments()`
   - **Returns:** Downloadable resources with file info
   - **Table:** `dbo.documents`

4. **`workshops.cfc`**
   - **Method:** `getForms(location)`
   - **Returns:** Workshop forms with embed codes
   - **Table:** `dbo.forms`

5. **`contact.cfc`**
   - **Methods:**
     - `submitContact(name, email, subject, message, website)` - Submit form
     - `getRecipients()` - Get email recipients (admin only)
   - **Tables:** `dbo.contact_submissions`, `dbo.contact_email_recipients`
   - **Features:** Rate limiting, honeypot, email notifications

6. **`pages.cfc`**
   - **Methods:**
     - `getConferenceInfo()` - Conference details
     - `getContent(pageName)` - Static page content
   - **Source:** Application.cfc variables

---

## Phase 2: Angular Frontend ✅

### Directory Structure

```
/angular-app/src/app/
├── components/
│   ├── home/                 - Homepage with announcements
│   ├── about/                - About page
│   ├── gallery/              - Photo gallery with lightbox
│   ├── workshops/            - Workshop forms (accordion)
│   ├── resources/            - Downloadable documents
│   ├── contact/              - Contact form
│   └── shared/
│       ├── header.component.ts   - Navigation header
│       └── footer.component.ts   - Site footer
├── services/
│   └── api.service.ts        - HTTP service for API calls
├── models/
│   └── api-models.ts         - TypeScript interfaces
├── app.routes.ts             - Routing configuration
├── app.config.ts             - App configuration
├── app.ts                    - Main app component
└── app.html                  - Main app template
```

### Components Created

#### 1. **Home Component**
- Displays hero section with video background
- Shows active announcements
- Quick links grid

#### 2. **About Component**
- Static content about PASC Region J
- Top 3 gallery images
- Call-to-action section

#### 3. **Gallery Component**
- Paginated image grid (9 images per page)
- Lightbox modal for full-size viewing
- Navigation between images

#### 4. **Workshops Component**
- Accordion-style form display
- Embedded Google Forms support
- Requirements section

#### 5. **Resources Component**
- Document grid with file icons
- Download links
- File size and type display

#### 6. **Contact Component**
- Reactive form with validation
- Honeypot spam protection
- Character counter
- Success/error messaging

---

## Features

### Design
- **Space Theme:** Purple/blue gradient background
- **Animated Starfield:** CSS-only twinkling stars
- **Video Backgrounds:** Desktop/mobile responsive
- **Responsive Design:** Mobile-first approach

### Technical Features
- **TypeScript:** Full type safety with interfaces
- **Signals:** Modern Angular reactive primitives
- **Standalone Components:** No NgModules
- **HTTP Client:** Fetch API integration
- **Form Validation:** Reactive forms with validators
- **Router:** Client-side routing with titles
- **Loading States:** Spinners and error handling

---

## API Endpoint URLs

All endpoints are called from Angular via `/api/*.cfc`:

- `GET /api/announcements.cfc?method=getAnnouncements`
- `GET /api/gallery.cfc?method=getImages&location=gallery&page=1&limit=9`
- `GET /api/gallery.cfc?method=getCount&location=gallery`
- `GET /api/documents.cfc?method=getDocuments`
- `GET /api/workshops.cfc?method=getForms&location=Workshops`
- `POST /api/contact.cfc?method=submitContact&name=...&email=...`
- `GET /api/pages.cfc?method=getConferenceInfo`
- `GET /api/pages.cfc?method=getContent&pageName=about`

---

## Database Tables Used

### Existing Tables (No modifications made)
- `dbo.announcements` - Conference announcements
- `dbo.gallery` - Photo gallery images
- `dbo.forms` - Embedded workshop forms
- `dbo.documents` - Downloadable resources
- `dbo.contact_submissions` - Contact form submissions
- `dbo.contact_email_recipients` - Email notification recipients

---

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 19+
- ColdFusion server (Lucee/Adobe CF)
- Database: SQL Server (pasc_regionj datasource)

### Running Angular Development Server

```bash
cd /Front_End/angular-app
npm install
ng serve
```

Navigate to `http://localhost:4200/`

### Building for Production

```bash
cd /Front_End/angular-app
ng build --configuration production
```

Output will be in `/angular-app/dist/angular-app/`

---

## Deployment

### Option 1: Serve Angular from ColdFusion
1. Build Angular app: `ng build --prod`
2. Copy `dist/angular-app/browser/*` to `/Front_End/angular/`
3. Configure web server to serve Angular files
4. Ensure `/api/` routes to ColdFusion CFCs

### Option 2: Separate Hosting
1. Host Angular build on static hosting (Netlify, Vercel, etc.)
2. Keep ColdFusion APIs on existing server
3. Configure CORS headers in ColdFusion
4. Update API service base URL in Angular

---

## Important Notes

### What Was NOT Modified
✅ No changes to existing `.cfm` files
✅ No database schema changes
✅ No modifications to Application.cfc
✅ All original ColdFusion site remains intact

### What Was Created
✅ New `/api/` directory with 6 CFC files
✅ Complete Angular application in `/angular-app/`
✅ TypeScript models and interfaces
✅ HTTP service for API communication

---

## Routes

| Path | Component | Title |
|------|-----------|-------|
| `/` | HomeComponent | Home - PASC Region J Conference 2026 |
| `/about` | AboutComponent | About - PASC Region J |
| `/gallery` | GalleryComponent | Gallery - PASC Region J |
| `/workshops` | WorkshopsComponent | Workshops - PASC Region J |
| `/resources` | ResourcesComponent | Resources - PASC Region J |
| `/contact` | ContactComponent | Contact - PASC Region J |

---

## Next Steps

1. **Test API Endpoints:**
   - Verify all CFC files return proper JSON
   - Test database connectivity
   - Check email functionality in contact.cfc

2. **Configure Production Build:**
   - Set up production API base URL
   - Configure CORS if needed
   - Optimize build for deployment

3. **Testing:**
   - Test all forms and submissions
   - Verify file uploads/downloads
   - Test pagination in gallery
   - Check responsive design on mobile

4. **SEO & Performance:**
   - Add meta tags for SEO
   - Implement lazy loading for images
   - Add service worker for caching
   - Configure analytics

---

## Technology Stack

**Frontend:**
- Angular 19
- TypeScript 5.x
- RxJS
- Standalone Components
- Signals

**Backend:**
- ColdFusion (Lucee/Adobe CF)
- SQL Server
- JSON API endpoints

**Styling:**
- Pure CSS3
- CSS Grid & Flexbox
- CSS Animations
- Responsive Design

---

## Support

For questions or issues:
- Email: info@pascregionj.com
- Original .cfm files remain unchanged for reference

---

**Generated:** November 11, 2025
**Version:** 1.0
**Author:** Auto-generated for Angular migration
