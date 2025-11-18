# Angular Proxy Configuration for ColdFusion Backend

## Overview
This Angular app is configured to proxy API requests to a ColdFusion backend server during development.

---

## Configuration Files

### 1. `proxy.conf.json`
Located in the angular-app root directory.

```json
{
  "/api": {
    "target": "http://localhost",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  },
  "/assets": {
    "target": "http://localhost",
    "secure": false,
    "changeOrigin": true
  }
}
```

**What it does:**
- Forwards `/api/*` requests → `http://localhost/api/*` (ColdFusion APIs)
- Forwards `/assets/*` requests → `http://localhost/assets/*` (videos, images, documents)

### 2. `angular.json`
Updated to reference the proxy configuration in the "serve" section:

```json
"serve": {
  "builder": "@angular/build:dev-server",
  "options": {
    "proxyConfig": "proxy.conf.json"  // ← Proxy configuration
  },
  ...
}
```

---

## How It Works

### Without Proxy (BROKEN ❌)
```
Browser → localhost:4200/api/announcements.cfc
         ↓
Angular Dev Server (returns index.html - ERROR!)
```

### With Proxy (WORKING ✅)
```
Browser → localhost:4200/api/announcements.cfc
         ↓
Angular Dev Server (proxies request)
         ↓
http://localhost/api/announcements.cfc (ColdFusion)
         ↓
Returns JSON data ✅
```

---

## Running the Development Server

### Start Angular with Proxy
```bash
cd angular-app
ng serve
```

The proxy will automatically:
1. Forward API calls to ColdFusion
2. Show debug logs in console:
   ```
   [HPM] GET /api/announcements.cfc?method=getAnnouncements -> http://localhost
   ```

### Verify Proxy is Working
Open browser console and check Network tab:
- ✅ API calls return JSON (not HTML)
- ✅ Status code: 200 OK
- ✅ Content-Type: application/json

---

## Prerequisites

### ColdFusion Server Must Be Running
Before starting Angular dev server, ensure:
1. ColdFusion server is running on `http://localhost` (port 80)
2. Can access APIs directly in browser:
   - `http://localhost/api/announcements.cfc?method=getAnnouncements`
   - Should return JSON, not 404

### If ColdFusion is on a Different Port
Update `proxy.conf.json`:
```json
{
  "/api": {
    "target": "http://localhost:8500",  // ← Change port
    ...
  }
}
```

---

## Troubleshooting

### Issue: Still getting HTML instead of JSON
**Cause:** ColdFusion server not running or wrong port

**Fix:**
1. Check ColdFusion is running: `http://localhost/api/announcements.cfc?method=getAnnouncements`
2. If on different port, update `proxy.conf.json`
3. Restart `ng serve`

### Issue: 404 Not Found
**Cause:** API files don't exist in `/Front_End/api/`

**Fix:**
1. Verify files exist:
   - `/Front_End/api/announcements.cfc`
   - `/Front_End/api/gallery.cfc`
   - etc.
2. Check ColdFusion can access them directly

### Issue: CORS Errors
**Cause:** Proxy configuration missing `changeOrigin: true`

**Fix:** Already configured in `proxy.conf.json` ✅

---

## Production Deployment

### Important: Proxy Only for Development
The proxy configuration **only works during development** (`ng serve`).

For production:
1. **Option A: Serve Angular from ColdFusion**
   ```bash
   ng build --configuration production
   # Copy dist/angular-app/browser/* to /Front_End/angular/
   # Serve from ColdFusion server
   ```

2. **Option B: Separate Hosting**
   - Host Angular build on static hosting (Netlify, Vercel, etc.)
   - Add CORS headers to ColdFusion APIs
   - Update API base URL in production build

---

## API Service Configuration

The API service uses relative paths (already configured ✅):

```typescript
// src/app/services/api.service.ts
private baseUrl = '/api';  // Relative path - perfect for proxy!
```

All API calls:
- `GET /api/announcements.cfc?method=getAnnouncements`
- `GET /api/gallery.cfc?method=getImages&location=gallery`
- `POST /api/contact.cfc?method=submitContact`
- etc.

---

## Debug Mode

The proxy is configured with `"logLevel": "debug"` which shows all proxied requests in the terminal where you run `ng serve`:

```
[HPM] GET /api/announcements.cfc?method=getAnnouncements -> http://localhost
[HPM] GET /api/gallery.cfc?method=getImages&location=about_page -> http://localhost
[HPM] GET /assets/video/intro-space-background.mp4 -> http://localhost
```

To disable debug logs, change in `proxy.conf.json`:
```json
"logLevel": "info"  // Less verbose
```

---

## Quick Reference

| What | Where | Purpose |
|------|-------|---------|
| `proxy.conf.json` | `/angular-app/` | Proxy rules for API & assets |
| `angular.json` | `/angular-app/` | Angular CLI configuration |
| API Service | `/src/app/services/api.service.ts` | HTTP client for API calls |
| ColdFusion APIs | `/Front_End/api/*.cfc` | Backend JSON endpoints |

---

**Last Updated:** November 11, 2025
