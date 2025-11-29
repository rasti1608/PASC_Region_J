# PASC Region J Conference 2026 - React Implementation

**Live Site:** [pascregionj.com/react-app/](https://pascregionj.com/react-app/)

## 🚀 Conversion Summary

**Converted from:** Angular implementation  
**Conversion time:** ~15 hours total  
**Completed:** November 28, 2025

### Conversion Timeline
- **Session 1 (~6 hours):** Initial React setup, all public pages converted, basic admin structure
- **Session 2 (~5 hours):** Admin panel completion, API integration, fixing edit/delete pages
- **Session 3 (~4 hours):** Production deployment, routing fixes, final polish

## 🎯 What Was Converted

### Public Frontend (100% Complete)
- Intro/Pre-intro splash screens with video backgrounds
- Home page with announcements
- About, Registration, Workshops, Schedule pages
- Photo Gallery with lightbox
- Resources and Contact pages
- Background music/anthem player
- Fully responsive design

### Admin Panel (100% Complete)
- Dashboard with stats
- Announcements management (list/add/edit/delete)
- Forms management
- Gallery management with image upload
- Documents management
- Contact submissions with email settings
- User management
- Schedule editor
- Profile settings

## 🛠 Technical Details

**Built With:**
- React 19.2
- React Router DOM 7.9
- ColdFusion backend APIs (shared with Angular)
- Microsoft SQL Server database

**Key Configuration:**
- `homepage: "/react-app"` in package.json
- `basename="/react-app"` for React Router (production only)
- `web.config` for IIS URL rewriting

## 📁 Project Structure

```
react-app-source/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/
│   │   ├── public/     # Public-facing pages
│   │   └── admin/      # Admin panel pages
│   ├── services/       # API services
│   ├── assets/         # Images, CSS
│   └── App.js          # Main router
├── public/             # Static assets
└── package.json
```

## 🏃 Running Locally

```bash
cd react-app-source
npm install
npm start
```

Opens at: http://localhost:3000

## 🏗 Building for Production

```bash
npm run build
```

Copy contents of `build/` to `Front_End/react-app/`

## 🔧 Key Challenges Solved

1. **Asset paths in subdirectory** - Fixed with `homepage` in package.json
2. **React Router in subdirectory** - Conditional `basename` for production
3. **IIS routing for SPA** - `web.config` rewrite rules
4. **Gallery image paths** - Moved to public folder for proper serving
5. **Music stopping on admin entry** - Event listener on route change

## 📝 Comparison to Angular

| Aspect | Angular | React |
|--------|---------|-------|
| Conversion time | ~35 hours (7 days, ~5 hrs/day) | ~15 hours (3 sessions) |
| Bundle size | Similar | Similar |
| Performance | Fast | Fast |
| Code structure | Modules | Components |

## 👨‍💻 Author

**Rastislav Toscak**  
Converted from Angular as a framework comparison project

---

*Last Updated: November 28, 2025*
