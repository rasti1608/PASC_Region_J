import {
  ActivatedRoute,
  BehaviorSubject,
  CheckboxControlValueAccessor,
  CommonModule,
  Component,
  DefaultValueAccessor,
  EventEmitter,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  HTTP_INTERCEPTORS,
  HttpClient,
  Injectable,
  Input,
  MaxLengthValidator,
  MinLengthValidator,
  NgClass,
  NgControlStatus,
  NgControlStatusGroup,
  NgForOf,
  NgForm,
  NgIf,
  NgModel,
  NgModule,
  NgSelectOption,
  Output,
  ReactiveFormsModule,
  RequiredValidator,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
  SecureJsonInterceptor,
  SelectControlValueAccessor,
  UpperCasePipe,
  Validators,
  __spreadProps,
  __spreadValues,
  catchError,
  forkJoin,
  map,
  of,
  setClassMetadata,
  tap,
  throwError,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-PUIKMTFI.js";

// src/app/admin/services/auth.service.ts
var AuthService = class _AuthService {
  http;
  router;
  apiUrl = "/api/auth.cfc";
  currentUserSubject = new BehaviorSubject(null);
  currentUser$ = this.currentUserSubject.asObservable();
  constructor(http, router) {
    this.http = http;
    this.router = router;
    this.checkAuthStatus();
  }
  /**
   * Check current authentication status with backend
   */
  checkAuthStatus() {
    this.http.get(`${this.apiUrl}?method=checkAuth`, { withCredentials: true }).subscribe({
      next: (response) => {
        if (response.success && response.authenticated && response.user) {
          this.currentUserSubject.next(response.user);
        } else {
          this.currentUserSubject.next(null);
        }
      },
      error: () => {
        this.currentUserSubject.next(null);
      }
    });
  }
  /**
   * Login with username and password
   */
  login(credentials) {
    return this.http.post(`${this.apiUrl}?method=login`, credentials, { withCredentials: true }).pipe(tap((response) => {
      if (response.success && response.user) {
        this.currentUserSubject.next(response.user);
      }
    }), catchError((error) => {
      const errorMessage = error.error?.message || "Login failed. Please try again.";
      return throwError(() => ({
        success: false,
        message: errorMessage
      }));
    }));
  }
  /**
   * Logout current user
   */
  logout() {
    return this.http.post(`${this.apiUrl}?method=logout`, {}, { withCredentials: true }).pipe(tap(() => {
      this.currentUserSubject.next(null);
      this.router.navigate(["/admin/login"]);
    }), catchError(() => {
      this.currentUserSubject.next(null);
      this.router.navigate(["/admin/login"]);
      return of({ success: true });
    }));
  }
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.currentUserSubject.value !== null;
  }
  /**
   * Get current user value
   */
  getCurrentUser() {
    return this.currentUserSubject.value;
  }
  /**
   * Get current user value (alias for compatibility)
   */
  get currentUserValue() {
    return this.currentUserSubject.value;
  }
  /**
   * Request password reset email
   */
  requestPasswordReset(email) {
    return this.http.post(`${this.apiUrl}?method=requestPasswordReset`, { email }, { withCredentials: true }).pipe(catchError((error) => {
      return throwError(() => ({
        success: false,
        message: error.error?.message || "Failed to send reset email."
      }));
    }));
  }
  /**
   * Reset password using token from email
   */
  resetPassword(token, newPassword) {
    return this.http.post(`${this.apiUrl}?method=resetPassword`, { token, newPassword }, { withCredentials: true }).pipe(catchError((error) => {
      return throwError(() => ({
        success: false,
        message: error.error?.message || "Failed to reset password."
      }));
    }));
  }
  /**
   * Change required password (first-time login)
   */
  changeRequiredPassword(newPassword) {
    return this.http.post(`${this.apiUrl}?method=changeRequiredPassword`, { newPassword }, { withCredentials: true }).pipe(tap((response) => {
      if (response.success && this.currentUserSubject.value) {
        const updatedUser = __spreadProps(__spreadValues({}, this.currentUserSubject.value), { must_change_password: false });
        this.currentUserSubject.next(updatedUser);
      }
    }), catchError((error) => {
      return throwError(() => ({
        success: false,
        message: error.error?.message || "Failed to change password."
      }));
    }));
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(Router));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }, { type: Router }], null);
})();

// src/app/admin/guards/auth.guard.ts
var AuthGuard = class _AuthGuard {
  router;
  authService;
  constructor(router, authService) {
    this.router = router;
    this.authService = authService;
  }
  canActivate(route, state) {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      if (user?.must_change_password) {
        if (state.url === "/admin/change-password") {
          return true;
        }
        this.router.navigate(["/admin/change-password"]);
        return false;
      }
      return true;
    }
    this.router.navigate(["/admin/login"], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
  static \u0275fac = function AuthGuard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthGuard)(\u0275\u0275inject(Router), \u0275\u0275inject(AuthService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthGuard, factory: _AuthGuard.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthGuard, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: Router }, { type: AuthService }], null);
})();

// src/app/admin/layout/admin-sidebar/admin-sidebar.component.ts
function AdminSidebarComponent_img_60_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 24);
    \u0275\u0275listener("error", function AdminSidebarComponent_img_60_Template_img_error_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onImageError());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("src", ctx_r1.getProfilePictureUrl(), \u0275\u0275sanitizeUrl);
  }
}
function AdminSidebarComponent_div_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275text(1, " \u{1F464} ");
    \u0275\u0275elementEnd();
  }
}
var AdminSidebarComponent = class _AdminSidebarComponent {
  authService;
  router;
  isMobileOpen = false;
  currentUser = null;
  imageLoadError = false;
  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
  }
  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.imageLoadError = false;
    });
  }
  logout() {
    this.authService.logout().subscribe();
  }
  getProfilePictureUrl() {
    if (this.imageLoadError || !this.currentUser?.profile_picture) {
      return "";
    }
    return `/assets/img/profiles/${this.currentUser.profile_picture}?v=${(/* @__PURE__ */ new Date()).getTime()}`;
  }
  onImageError() {
    this.imageLoadError = true;
  }
  static \u0275fac = function AdminSidebarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminSidebarComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminSidebarComponent, selectors: [["app-admin-sidebar"]], inputs: { isMobileOpen: "isMobileOpen" }, standalone: false, decls: 73, vars: 6, consts: [[1, "admin-sidebar"], [1, "sidebar-header"], ["src", "/assets/img/logo.png", "alt", "PASC Region J", 1, "sidebar-logo"], [1, "sidebar-nav"], ["routerLink", "/admin/dashboard", "routerLinkActive", "active", 1, "nav-item"], [1, "nav-icon"], [1, "nav-text"], ["routerLink", "/admin/announcements", "routerLinkActive", "active", 1, "nav-item"], ["routerLink", "/admin/forms", "routerLinkActive", "active", 1, "nav-item"], ["routerLink", "/admin/gallery", "routerLinkActive", "active", 1, "nav-item"], ["routerLink", "/admin/documents", "routerLinkActive", "active", 1, "nav-item"], ["routerLink", "/admin/contacts", "routerLinkActive", "active", 1, "nav-item"], [1, "nav-divider"], ["routerLink", "/admin/users", "routerLinkActive", "active", 1, "nav-item"], ["href", "/", "target", "_blank", 1, "nav-item"], ["href", "https://analytics.google.com", "target", "_blank", 1, "nav-item"], [1, "nav-item", "nav-logout", 3, "click"], [1, "sidebar-footer"], [1, "user-info"], ["alt", "Profile", "style", "width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin: 0 auto 10px auto; display: block; border: 2px solid #4fc3f7;", 3, "src", "error", 4, "ngIf"], ["class", "profile-placeholder", "style", "width: 40px; height: 40px; font-size: 20px; margin: 0 auto 10px auto;", 4, "ngIf"], [2, "color", "#b0b8d4"], [2, "margin-top", "15px"], ["routerLink", "/admin/profile", 1, "nav-item", 2, "padding", "8px 15px"], ["alt", "Profile", 2, "width", "40px", "height", "40px", "border-radius", "50%", "object-fit", "cover", "margin", "0 auto 10px auto", "display", "block", "border", "2px solid #4fc3f7", 3, "error", "src"], [1, "profile-placeholder", 2, "width", "40px", "height", "40px", "font-size", "20px", "margin", "0 auto 10px auto"]], template: function AdminSidebarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "aside", 0)(1, "div", 1);
      \u0275\u0275element(2, "img", 2);
      \u0275\u0275elementStart(3, "h2");
      \u0275\u0275text(4, "Admin Panel");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "nav", 3)(6, "a", 4)(7, "span", 5);
      \u0275\u0275text(8, "\u{1F4CA}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "span", 6);
      \u0275\u0275text(10, "Dashboard");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "a", 7)(12, "span", 5);
      \u0275\u0275text(13, "\u{1F4E2}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "span", 6);
      \u0275\u0275text(15, "Announcements");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "a", 8)(17, "span", 5);
      \u0275\u0275text(18, "\u{1F4DD}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "span", 6);
      \u0275\u0275text(20, "Forms");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "a", 9)(22, "span", 5);
      \u0275\u0275text(23, "\u{1F4F7}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "span", 6);
      \u0275\u0275text(25, "Gallery");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "a", 10)(27, "span", 5);
      \u0275\u0275text(28, "\u{1F4C1}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "span", 6);
      \u0275\u0275text(30, "Documents");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "a", 11)(32, "span", 5);
      \u0275\u0275text(33, "\u{1F4E7}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "span", 6);
      \u0275\u0275text(35, "Contact Submissions");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(36, "div", 12);
      \u0275\u0275elementStart(37, "a", 13)(38, "span", 5);
      \u0275\u0275text(39, "\u{1F465}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "span", 6);
      \u0275\u0275text(41, "User Management");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(42, "div", 12);
      \u0275\u0275elementStart(43, "a", 14)(44, "span", 5);
      \u0275\u0275text(45, "\u{1F310}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "span", 6);
      \u0275\u0275text(47, "View Website");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(48, "a", 15)(49, "span", 5);
      \u0275\u0275text(50, "\u{1F4C8}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "span", 6);
      \u0275\u0275text(52, "Analytics");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(53, "a", 16);
      \u0275\u0275listener("click", function AdminSidebarComponent_Template_a_click_53_listener() {
        return ctx.logout();
      });
      \u0275\u0275elementStart(54, "span", 5);
      \u0275\u0275text(55, "\u{1F6AA}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "span", 6);
      \u0275\u0275text(57, "Logout");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(58, "div", 17)(59, "div", 18);
      \u0275\u0275template(60, AdminSidebarComponent_img_60_Template, 1, 1, "img", 19)(61, AdminSidebarComponent_div_61_Template, 2, 0, "div", 20);
      \u0275\u0275elementStart(62, "strong");
      \u0275\u0275text(63);
      \u0275\u0275elementEnd();
      \u0275\u0275element(64, "br");
      \u0275\u0275elementStart(65, "small", 21);
      \u0275\u0275text(66);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(67, "div", 22)(68, "a", 23)(69, "span", 5);
      \u0275\u0275text(70, "\u2699\uFE0F");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "span", 6);
      \u0275\u0275text(72, "My Profile");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("mobile-open", ctx.isMobileOpen);
      \u0275\u0275advance(60);
      \u0275\u0275property("ngIf", ctx.getProfilePictureUrl());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.getProfilePictureUrl());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate((ctx.currentUser == null ? null : ctx.currentUser.full_name) || "Admin User");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate((ctx.currentUser == null ? null : ctx.currentUser.role_name) || "Administrator");
    }
  }, dependencies: [NgIf, RouterLink, RouterLinkActive], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminSidebarComponent, [{
    type: Component,
    args: [{ selector: "app-admin-sidebar", standalone: false, template: `<aside class="admin-sidebar" [class.mobile-open]="isMobileOpen">
  <!-- Logo Header -->
  <div class="sidebar-header">
    <img src="/assets/img/logo.png" alt="PASC Region J" class="sidebar-logo">
    <h2>Admin Panel</h2>
  </div>

  <!-- Navigation Menu -->
  <nav class="sidebar-nav">
    <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
      <span class="nav-icon">\u{1F4CA}</span>
      <span class="nav-text">Dashboard</span>
    </a>

    <a routerLink="/admin/announcements" routerLinkActive="active" class="nav-item">
      <span class="nav-icon">\u{1F4E2}</span>
      <span class="nav-text">Announcements</span>
    </a>

    <a routerLink="/admin/forms" routerLinkActive="active" class="nav-item">
      <span class="nav-icon">\u{1F4DD}</span>
      <span class="nav-text">Forms</span>
    </a>

    <a routerLink="/admin/gallery" routerLinkActive="active" class="nav-item">
      <span class="nav-icon">\u{1F4F7}</span>
      <span class="nav-text">Gallery</span>
    </a>

    <a routerLink="/admin/documents" routerLinkActive="active" class="nav-item">
      <span class="nav-icon">\u{1F4C1}</span>
      <span class="nav-text">Documents</span>
    </a>

    <a routerLink="/admin/contacts" routerLinkActive="active" class="nav-item">
      <span class="nav-icon">\u{1F4E7}</span>
      <span class="nav-text">Contact Submissions</span>
      <!-- TODO: Add badge for new contacts in Phase 2 -->
    </a>

    <!-- Divider -->
    <div class="nav-divider"></div>

    <!-- User Management (Admin Only) -->
    <!-- TODO: Add permission check in Phase 2 -->
    <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
      <span class="nav-icon">\u{1F465}</span>
      <span class="nav-text">User Management</span>
    </a>

    <!-- Divider -->
    <div class="nav-divider"></div>

    <!-- External Links -->
    <a href="/" target="_blank" class="nav-item">
      <span class="nav-icon">\u{1F310}</span>
      <span class="nav-text">View Website</span>
    </a>

    <a href="https://analytics.google.com" target="_blank" class="nav-item">
      <span class="nav-icon">\u{1F4C8}</span>
      <span class="nav-text">Analytics</span>
    </a>

    <a (click)="logout()" class="nav-item nav-logout">
      <span class="nav-icon">\u{1F6AA}</span>
      <span class="nav-text">Logout</span>
    </a>
  </nav>

  <!-- Sidebar Footer (User Info) -->
  <div class="sidebar-footer">
    <div class="user-info">
      <!-- Profile Picture or Placeholder (40px for sidebar) -->
      <img *ngIf="getProfilePictureUrl()"
           [src]="getProfilePictureUrl()"
           alt="Profile"
           (error)="onImageError()"
           style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin: 0 auto 10px auto; display: block; border: 2px solid #4fc3f7;">
      <div *ngIf="!getProfilePictureUrl()" class="profile-placeholder" style="width: 40px; height: 40px; font-size: 20px; margin: 0 auto 10px auto;">
        \u{1F464}
      </div>
      <strong>{{ currentUser?.full_name || 'Admin User' }}</strong><br>
      <small style="color: #b0b8d4;">{{ currentUser?.role_name || 'Administrator' }}</small>
    </div>

    <!-- My Profile Link -->
    <div style="margin-top: 15px;">
      <a routerLink="/admin/profile" class="nav-item" style="padding: 8px 15px;">
        <span class="nav-icon">\u2699\uFE0F</span>
        <span class="nav-text">My Profile</span>
      </a>
    </div>
  </div>
</aside>
` }]
  }], () => [{ type: AuthService }, { type: Router }], { isMobileOpen: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminSidebarComponent, { className: "AdminSidebarComponent", filePath: "src/app/admin/layout/admin-sidebar/admin-sidebar.component.ts", lineNumber: 11 });
})();

// src/app/admin/layout/admin-header/admin-header.component.ts
function AdminHeaderComponent_img_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 8);
    \u0275\u0275listener("error", function AdminHeaderComponent_img_6_Template_img_error_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onImageError());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("src", ctx_r1.getProfilePictureUrl(), \u0275\u0275sanitizeUrl);
  }
}
function AdminHeaderComponent_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 9);
    \u0275\u0275text(1, "\u{1F464}");
    \u0275\u0275elementEnd();
  }
}
var AdminHeaderComponent = class _AdminHeaderComponent {
  authService;
  toggleMobileMenu = new EventEmitter();
  currentUser = null;
  imageLoadError = false;
  constructor(authService) {
    this.authService = authService;
  }
  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.imageLoadError = false;
    });
  }
  toggleMenu() {
    this.toggleMobileMenu.emit();
  }
  logout() {
    this.authService.logout().subscribe();
  }
  getProfilePictureUrl() {
    if (this.imageLoadError || !this.currentUser?.profile_picture) {
      return "";
    }
    return `/assets/img/profiles/${this.currentUser.profile_picture}?v=${(/* @__PURE__ */ new Date()).getTime()}`;
  }
  onImageError() {
    this.imageLoadError = true;
  }
  static \u0275fac = function AdminHeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminHeaderComponent)(\u0275\u0275directiveInject(AuthService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminHeaderComponent, selectors: [["app-admin-header"]], outputs: { toggleMobileMenu: "toggleMobileMenu" }, standalone: false, decls: 13, vars: 2, consts: [[1, "admin-header"], [1, "hamburger-menu", 3, "click"], [1, "header-right"], ["routerLink", "/admin/profile", "title", "Profile & Settings", 1, "header-profile-link"], ["alt", "Profile", "class", "header-avatar-img", 3, "src", "error", 4, "ngIf"], ["class", "header-avatar", 4, "ngIf"], [1, "header-settings-icon"], ["title", "Logout", 1, "header-logout-link", 3, "click"], ["alt", "Profile", 1, "header-avatar-img", 3, "error", "src"], [1, "header-avatar"]], template: function AdminHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 0)(1, "button", 1);
      \u0275\u0275listener("click", function AdminHeaderComponent_Template_button_click_1_listener() {
        return ctx.toggleMenu();
      });
      \u0275\u0275elementStart(2, "span");
      \u0275\u0275text(3, "\u2630");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "div", 2)(5, "a", 3);
      \u0275\u0275template(6, AdminHeaderComponent_img_6_Template, 1, 1, "img", 4)(7, AdminHeaderComponent_span_7_Template, 2, 0, "span", 5);
      \u0275\u0275elementStart(8, "span", 6);
      \u0275\u0275text(9, "\u2699\uFE0F");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "a", 7);
      \u0275\u0275listener("click", function AdminHeaderComponent_Template_a_click_10_listener() {
        return ctx.logout();
      });
      \u0275\u0275elementStart(11, "span");
      \u0275\u0275text(12, "\u{1F6AA}");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("ngIf", ctx.getProfilePictureUrl());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.getProfilePictureUrl());
    }
  }, dependencies: [NgIf, RouterLink], styles: ["\n\n.header-avatar-img[_ngcontent-%COMP%] {\n  width: 35px;\n  height: 35px;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 2px solid #4fc3f7;\n  display: inline-block;\n}\n/*# sourceMappingURL=admin-header.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminHeaderComponent, [{
    type: Component,
    args: [{ selector: "app-admin-header", standalone: false, template: '<header class="admin-header">\n  <!-- Mobile Hamburger Menu Button -->\n  <button class="hamburger-menu" (click)="toggleMenu()">\n    <span>\u2630</span>\n  </button>\n\n  <!-- Header Right Section -->\n  <div class="header-right">\n    <!-- Profile Link with Avatar and Settings Icon -->\n    <a routerLink="/admin/profile" class="header-profile-link" title="Profile & Settings">\n      <!-- Profile Avatar (Dynamic) -->\n      <img *ngIf="getProfilePictureUrl()"\n           [src]="getProfilePictureUrl()"\n           alt="Profile"\n           (error)="onImageError()"\n           class="header-avatar-img">\n      <span *ngIf="!getProfilePictureUrl()" class="header-avatar">\u{1F464}</span>\n      <!-- Settings Gear Icon -->\n      <span class="header-settings-icon">\u2699\uFE0F</span>\n    </a>\n\n    <!-- Logout Button -->\n    <a (click)="logout()" class="header-logout-link" title="Logout">\n      <span>\u{1F6AA}</span>\n    </a>\n  </div>\n</header>\n', styles: ["/* src/app/admin/layout/admin-header/admin-header.component.css */\n.header-avatar-img {\n  width: 35px;\n  height: 35px;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 2px solid #4fc3f7;\n  display: inline-block;\n}\n/*# sourceMappingURL=admin-header.component.css.map */\n"] }]
  }], () => [{ type: AuthService }], { toggleMobileMenu: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminHeaderComponent, { className: "AdminHeaderComponent", filePath: "src/app/admin/layout/admin-header/admin-header.component.ts", lineNumber: 10 });
})();

// src/app/admin/layout/admin-layout/admin-layout.component.ts
var AdminLayoutComponent = class _AdminLayoutComponent {
  isMobileMenuOpen = false;
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
  }
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.classList.remove("mobile-menu-open");
  }
  static \u0275fac = function AdminLayoutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminLayoutComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminLayoutComponent, selectors: [["app-admin-layout"]], standalone: false, decls: 6, vars: 3, consts: [[1, "admin-wrapper"], [3, "isMobileOpen"], [1, "mobile-overlay", 3, "click"], [1, "admin-content"], [3, "toggleMobileMenu"]], template: function AdminLayoutComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "app-admin-sidebar", 1);
      \u0275\u0275elementStart(2, "div", 2);
      \u0275\u0275listener("click", function AdminLayoutComponent_Template_div_click_2_listener() {
        return ctx.closeMobileMenu();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "main", 3)(4, "app-admin-header", 4);
      \u0275\u0275listener("toggleMobileMenu", function AdminLayoutComponent_Template_app_admin_header_toggleMobileMenu_4_listener() {
        return ctx.toggleMobileMenu();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(5, "router-outlet");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("isMobileOpen", ctx.isMobileMenuOpen);
      \u0275\u0275advance();
      \u0275\u0275classProp("active", ctx.isMobileMenuOpen);
    }
  }, dependencies: [RouterOutlet, AdminSidebarComponent, AdminHeaderComponent], styles: ["\n\n/*# sourceMappingURL=admin-layout.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminLayoutComponent, [{
    type: Component,
    args: [{ selector: "app-admin-layout", standalone: false, template: '<div class="admin-wrapper">\n  <!-- Sidebar Navigation -->\n  <app-admin-sidebar [isMobileOpen]="isMobileMenuOpen"></app-admin-sidebar>\n\n  <!-- Mobile Overlay (for closing sidebar when clicking outside) -->\n  <div class="mobile-overlay" [class.active]="isMobileMenuOpen" (click)="closeMobileMenu()"></div>\n\n  <!-- Main Content Area -->\n  <main class="admin-content">\n    <!-- Fixed Header Bar -->\n    <app-admin-header (toggleMobileMenu)="toggleMobileMenu()"></app-admin-header>\n\n    <!-- Router outlet for admin pages -->\n    <router-outlet></router-outlet>\n  </main>\n</div>\n', styles: ["/* src/app/admin/layout/admin-layout/admin-layout.component.css */\n/*# sourceMappingURL=admin-layout.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminLayoutComponent, { className: "AdminLayoutComponent", filePath: "src/app/admin/layout/admin-layout/admin-layout.component.ts", lineNumber: 9 });
})();

// src/app/admin/auth/login/login.component.ts
function LoginComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage, " ");
  }
}
function LoginComponent_span_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Sign In");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_span_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Signing In...");
    \u0275\u0275elementEnd();
  }
}
var LoginComponent = class _LoginComponent {
  fb;
  authService;
  router;
  route;
  loginForm;
  loading = false;
  errorMessage = "";
  showPassword = false;
  returnUrl = "/admin/dashboard";
  constructor(fb, authService, router, route) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;
    this.route = route;
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/admin/dashboard"]);
    }
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/admin/dashboard";
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = "Please enter both username and password.";
      return;
    }
    this.loading = true;
    this.errorMessage = "";
    const credentials = {
      username: this.loginForm.value.username.trim(),
      password: this.loginForm.value.password
    };
    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response.success) {
          if (response.user?.must_change_password) {
            this.router.navigate(["/admin/change-password"]);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        } else {
          this.errorMessage = response.message || "Login failed. Please try again.";
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.message || "Login failed. Please check your credentials and try again.";
        this.loading = false;
      }
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  get usernameControl() {
    return this.loginForm.get("username");
  }
  get passwordControl() {
    return this.loginForm.get("password");
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], standalone: false, decls: 36, vars: 11, consts: [[1, "login-container"], [1, "login-box"], [1, "login-header"], [1, "logo"], ["src", "/assets/img/logo.png", "alt", "PASC Region J", 1, "logo-img"], ["class", "alert alert-error", 4, "ngIf"], [1, "login-form", 3, "ngSubmit", "formGroup"], [1, "form-group"], ["for", "username"], ["type", "text", "id", "username", "formControlName", "username", "autocomplete", "username", "autofocus", "", 1, "form-control"], ["for", "password"], [1, "password-input-wrapper"], ["id", "password", "formControlName", "password", "autocomplete", "current-password", 1, "form-control", 3, "type"], ["type", "button", "aria-label", "Toggle password visibility", 1, "password-toggle", 3, "click"], [1, "toggle-icon"], ["type", "submit", 1, "btn", "btn-login", 3, "disabled"], [4, "ngIf"], [1, "forgot-password-link"], ["routerLink", "/admin/forgot-password"], [1, "login-footer"], [1, "alert", "alert-error"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275element(4, "img", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "h1");
      \u0275\u0275text(6, "Admin Panel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p");
      \u0275\u0275text(8, "PASC Region J Conference 2026");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(9, LoginComponent_div_9_Template, 2, 1, "div", 5);
      \u0275\u0275elementStart(10, "form", 6);
      \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_10_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(11, "div", 7)(12, "label", 8);
      \u0275\u0275text(13, "Username");
      \u0275\u0275elementEnd();
      \u0275\u0275element(14, "input", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 7)(16, "label", 10);
      \u0275\u0275text(17, "Password");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 11);
      \u0275\u0275element(19, "input", 12);
      \u0275\u0275elementStart(20, "button", 13);
      \u0275\u0275listener("click", function LoginComponent_Template_button_click_20_listener() {
        return ctx.togglePassword();
      });
      \u0275\u0275elementStart(21, "span", 14);
      \u0275\u0275text(22);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(23, "button", 15);
      \u0275\u0275template(24, LoginComponent_span_24_Template, 2, 0, "span", 16)(25, LoginComponent_span_25_Template, 2, 0, "span", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "div", 17)(27, "a", 18);
      \u0275\u0275text(28, "Forgot Password?");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(29, "div", 19)(30, "p")(31, "small");
      \u0275\u0275text(32, "Default credentials: devadmin / Welcome01!");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "p")(34, "small");
      \u0275\u0275text(35, "Please change default password after first login");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.loginForm);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("error", (ctx.usernameControl == null ? null : ctx.usernameControl.invalid) && (ctx.usernameControl == null ? null : ctx.usernameControl.touched));
      \u0275\u0275advance(5);
      \u0275\u0275classProp("error", (ctx.passwordControl == null ? null : ctx.passwordControl.invalid) && (ctx.passwordControl == null ? null : ctx.passwordControl.touched));
      \u0275\u0275property("type", ctx.showPassword ? "text" : "password");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.showPassword ? "\u{1F648}" : "\u{1F441}\uFE0F");
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading);
    }
  }, dependencies: [NgIf, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  background-image: url(/assets/img/intro-background.png);\n  background-size: cover;\n  background-position: center;\n  background-attachment: fixed;\n  background-color: #0a0e27;\n}\n.login-container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 450px;\n  min-height: 100vh;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  padding: 20px;\n  margin: 0 auto;\n}\n.login-box[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.98);\n  border-radius: 20px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n  width: 100%;\n}\n.login-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1a1f3a 0%,\n      #2d3561 100%);\n  padding: 40px 30px;\n  text-align: center;\n  color: #ffffff;\n}\n.login-header[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  display: flex;\n  justify-content: center;\n}\n.login-header[_ngcontent-%COMP%]   .logo-img[_ngcontent-%COMP%] {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  border: 3px solid #4fc3f7;\n  box-shadow: 0 0 20px rgba(79, 195, 247, 0.5);\n}\n.login-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  margin-bottom: 5px;\n  color: #4fc3f7;\n}\n.login-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  color: #b0b8d4;\n}\n.login-form[_ngcontent-%COMP%] {\n  padding: 40px 30px;\n}\n.form-group[_ngcontent-%COMP%] {\n  margin-bottom: 25px;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #2d3561;\n  font-size: 0.95rem;\n}\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.form-control[_ngcontent-%COMP%] {\n  width: 100% !important;\n  padding: 12px 15px !important;\n  border: 2px solid #e0e0e0 !important;\n  border-radius: 8px !important;\n  font-size: 1rem !important;\n  transition: all 0.3s ease !important;\n  background: #ffffff !important;\n}\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.form-control[_ngcontent-%COMP%]:focus {\n  outline: none !important;\n  border-color: #4fc3f7 !important;\n  box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1) !important;\n}\n.password-input-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n}\n.password-input-wrapper[_ngcontent-%COMP%]   input[type=password][_ngcontent-%COMP%], \n.password-input-wrapper[_ngcontent-%COMP%]   input[type=text][_ngcontent-%COMP%] {\n  padding-right: 50px !important;\n}\n.password-toggle[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: transparent !important;\n  border: none !important;\n  cursor: pointer;\n  font-size: 1.2rem;\n  padding: 8px;\n  color: #666;\n  transition: color 0.2s ease;\n  min-width: 40px;\n  min-height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.password-toggle[_ngcontent-%COMP%]:hover {\n  color: #4fc3f7;\n}\n.password-toggle[_ngcontent-%COMP%]:focus {\n  outline: 2px solid #4fc3f7;\n  outline-offset: 2px;\n  border-radius: 4px;\n}\n.password-toggle[_ngcontent-%COMP%]   .toggle-icon[_ngcontent-%COMP%] {\n  display: inline-block;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.btn-login[_ngcontent-%COMP%] {\n  width: 100% !important;\n  padding: 14px !important;\n  background:\n    linear-gradient(\n      135deg,\n      #4fc3f7 0%,\n      #2196f3 100%) !important;\n  color: #ffffff !important;\n  border: none !important;\n  border-radius: 8px !important;\n  font-size: 1.1rem !important;\n  font-weight: 600 !important;\n  cursor: pointer !important;\n  transition: all 0.3s ease !important;\n  box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3) !important;\n}\n.btn-login[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px) scale(1.02) !important;\n  box-shadow: 0 8px 20px rgba(79, 195, 247, 0.5) !important;\n  background:\n    linear-gradient(\n      135deg,\n      #4fc3f7 0%,\n      #2196f3 100%) !important;\n}\n.btn-login[_ngcontent-%COMP%]:active {\n  transform: translateY(0) !important;\n}\n.btn-login[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6 !important;\n  cursor: not-allowed !important;\n  transform: none !important;\n}\n.forgot-password-link[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 20px;\n}\n.forgot-password-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #2196f3;\n  text-decoration: none;\n  font-size: 0.95rem;\n  transition: color 0.2s ease;\n}\n.forgot-password-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  color: #4fc3f7;\n  text-decoration: underline;\n}\n.alert[_ngcontent-%COMP%] {\n  padding: 15px 20px;\n  border-radius: 8px;\n  margin: 0 30px 20px 30px;\n  font-size: 0.95rem;\n  line-height: 1.5;\n}\n.alert-error[_ngcontent-%COMP%] {\n  background: #ffebee !important;\n  color: #c62828 !important;\n  border-left: 4px solid #c62828 !important;\n}\n.alert-success[_ngcontent-%COMP%] {\n  background: #e8f5e9 !important;\n  color: #2e7d32 !important;\n  border-left: 4px solid #2e7d32 !important;\n}\n.login-footer[_ngcontent-%COMP%] {\n  background: #f5f5f5;\n  padding: 20px 30px;\n  text-align: center;\n  border-top: 1px solid #e0e0e0;\n}\n.login-footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 5px 0;\n  color: #666;\n}\n.login-footer[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n}\n@media (max-width: 480px) {\n  .login-container[_ngcontent-%COMP%] {\n    padding: 10px;\n  }\n  .login-header[_ngcontent-%COMP%] {\n    padding: 30px 20px;\n  }\n  .login-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .login-form[_ngcontent-%COMP%] {\n    padding: 30px 20px;\n  }\n  .alert[_ngcontent-%COMP%] {\n    margin: 0 20px 15px 20px;\n  }\n  .login-footer[_ngcontent-%COMP%] {\n    padding: 15px 20px;\n  }\n}\n*[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #4fc3f7;\n  outline-offset: 2px;\n}\n/*# sourceMappingURL=login.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{ selector: "app-login", standalone: false, template: `<div class="login-container">\r
  <div class="login-box">\r
    <div class="login-header">\r
      <div class="logo">\r
        <img src="/assets/img/logo.png" alt="PASC Region J" class="logo-img">\r
      </div>\r
      <h1>Admin Panel</h1>\r
      <p>PASC Region J Conference 2026</p>\r
    </div>\r
\r
    <!-- Error Message -->\r
    <div *ngIf="errorMessage" class="alert alert-error">\r
      {{ errorMessage }}\r
    </div>\r
\r
    <!-- Login Form -->\r
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">\r
      <div class="form-group">\r
        <label for="username">Username</label>\r
        <input\r
          type="text"\r
          id="username"\r
          formControlName="username"\r
          class="form-control"\r
          autocomplete="username"\r
          autofocus\r
          [class.error]="usernameControl?.invalid && usernameControl?.touched">\r
      </div>\r
\r
      <div class="form-group">\r
        <label for="password">Password</label>\r
        <div class="password-input-wrapper">\r
          <input\r
            [type]="showPassword ? 'text' : 'password'"\r
            id="password"\r
            formControlName="password"\r
            class="form-control"\r
            autocomplete="current-password"\r
            [class.error]="passwordControl?.invalid && passwordControl?.touched">\r
          <button\r
            type="button"\r
            class="password-toggle"\r
            (click)="togglePassword()"\r
            aria-label="Toggle password visibility">\r
            <span class="toggle-icon">{{ showPassword ? '\u{1F648}' : '\u{1F441}\uFE0F' }}</span>\r
          </button>\r
        </div>\r
      </div>\r
\r
      <button\r
        type="submit"\r
        class="btn btn-login"\r
        [disabled]="loading">\r
        <span *ngIf="!loading">Sign In</span>\r
        <span *ngIf="loading">Signing In...</span>\r
      </button>\r
\r
      <div class="forgot-password-link">\r
        <a routerLink="/admin/forgot-password">Forgot Password?</a>\r
      </div>\r
    </form>\r
\r
    <div class="login-footer">\r
      <p><small>Default credentials: devadmin / Welcome01!</small></p>\r
      <p><small>Please change default password after first login</small></p>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/admin/auth/login/login.component.css */\n:host {\n  display: block;\n  min-height: 100vh;\n  background-image: url(/assets/img/intro-background.png);\n  background-size: cover;\n  background-position: center;\n  background-attachment: fixed;\n  background-color: #0a0e27;\n}\n.login-container {\n  width: 100%;\n  max-width: 450px;\n  min-height: 100vh;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  padding: 20px;\n  margin: 0 auto;\n}\n.login-box {\n  background: rgba(255, 255, 255, 0.98);\n  border-radius: 20px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n  width: 100%;\n}\n.login-header {\n  background:\n    linear-gradient(\n      135deg,\n      #1a1f3a 0%,\n      #2d3561 100%);\n  padding: 40px 30px;\n  text-align: center;\n  color: #ffffff;\n}\n.login-header .logo {\n  margin-bottom: 20px;\n  display: flex;\n  justify-content: center;\n}\n.login-header .logo-img {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  border: 3px solid #4fc3f7;\n  box-shadow: 0 0 20px rgba(79, 195, 247, 0.5);\n}\n.login-header h1 {\n  font-size: 1.8rem;\n  margin-bottom: 5px;\n  color: #4fc3f7;\n}\n.login-header p {\n  font-size: 0.95rem;\n  color: #b0b8d4;\n}\n.login-form {\n  padding: 40px 30px;\n}\n.form-group {\n  margin-bottom: 25px;\n}\n.form-group label {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #2d3561;\n  font-size: 0.95rem;\n}\n.form-group input,\n.form-control {\n  width: 100% !important;\n  padding: 12px 15px !important;\n  border: 2px solid #e0e0e0 !important;\n  border-radius: 8px !important;\n  font-size: 1rem !important;\n  transition: all 0.3s ease !important;\n  background: #ffffff !important;\n}\n.form-group input:focus,\n.form-control:focus {\n  outline: none !important;\n  border-color: #4fc3f7 !important;\n  box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1) !important;\n}\n.password-input-wrapper {\n  position: relative;\n}\n.password-input-wrapper input[type=password],\n.password-input-wrapper input[type=text] {\n  padding-right: 50px !important;\n}\n.password-toggle {\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: transparent !important;\n  border: none !important;\n  cursor: pointer;\n  font-size: 1.2rem;\n  padding: 8px;\n  color: #666;\n  transition: color 0.2s ease;\n  min-width: 40px;\n  min-height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.password-toggle:hover {\n  color: #4fc3f7;\n}\n.password-toggle:focus {\n  outline: 2px solid #4fc3f7;\n  outline-offset: 2px;\n  border-radius: 4px;\n}\n.password-toggle .toggle-icon {\n  display: inline-block;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.btn-login {\n  width: 100% !important;\n  padding: 14px !important;\n  background:\n    linear-gradient(\n      135deg,\n      #4fc3f7 0%,\n      #2196f3 100%) !important;\n  color: #ffffff !important;\n  border: none !important;\n  border-radius: 8px !important;\n  font-size: 1.1rem !important;\n  font-weight: 600 !important;\n  cursor: pointer !important;\n  transition: all 0.3s ease !important;\n  box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3) !important;\n}\n.btn-login:hover {\n  transform: translateY(-2px) scale(1.02) !important;\n  box-shadow: 0 8px 20px rgba(79, 195, 247, 0.5) !important;\n  background:\n    linear-gradient(\n      135deg,\n      #4fc3f7 0%,\n      #2196f3 100%) !important;\n}\n.btn-login:active {\n  transform: translateY(0) !important;\n}\n.btn-login:disabled {\n  opacity: 0.6 !important;\n  cursor: not-allowed !important;\n  transform: none !important;\n}\n.forgot-password-link {\n  text-align: center;\n  margin-top: 20px;\n}\n.forgot-password-link a {\n  color: #2196f3;\n  text-decoration: none;\n  font-size: 0.95rem;\n  transition: color 0.2s ease;\n}\n.forgot-password-link a:hover {\n  color: #4fc3f7;\n  text-decoration: underline;\n}\n.alert {\n  padding: 15px 20px;\n  border-radius: 8px;\n  margin: 0 30px 20px 30px;\n  font-size: 0.95rem;\n  line-height: 1.5;\n}\n.alert-error {\n  background: #ffebee !important;\n  color: #c62828 !important;\n  border-left: 4px solid #c62828 !important;\n}\n.alert-success {\n  background: #e8f5e9 !important;\n  color: #2e7d32 !important;\n  border-left: 4px solid #2e7d32 !important;\n}\n.login-footer {\n  background: #f5f5f5;\n  padding: 20px 30px;\n  text-align: center;\n  border-top: 1px solid #e0e0e0;\n}\n.login-footer p {\n  margin: 5px 0;\n  color: #666;\n}\n.login-footer small {\n  font-size: 0.85rem;\n}\n@media (max-width: 480px) {\n  .login-container {\n    padding: 10px;\n  }\n  .login-header {\n    padding: 30px 20px;\n  }\n  .login-header h1 {\n    font-size: 1.5rem;\n  }\n  .login-form {\n    padding: 30px 20px;\n  }\n  .alert {\n    margin: 0 20px 15px 20px;\n  }\n  .login-footer {\n    padding: 15px 20px;\n  }\n}\n*:focus-visible {\n  outline: 2px solid #4fc3f7;\n  outline-offset: 2px;\n}\n/*# sourceMappingURL=login.component.css.map */\n"] }]
  }], () => [{ type: FormBuilder }, { type: AuthService }, { type: Router }, { type: ActivatedRoute }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/admin/auth/login/login.component.ts", lineNumber: 12 });
})();

// src/app/admin/auth/forgot-password/forgot-password.component.ts
function ForgotPasswordComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.successMessage, " ");
  }
}
function ForgotPasswordComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage, " ");
  }
}
function ForgotPasswordComponent_form_11_span_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Send Reset Link");
    \u0275\u0275elementEnd();
  }
}
function ForgotPasswordComponent_form_11_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Sending...");
    \u0275\u0275elementEnd();
  }
}
function ForgotPasswordComponent_form_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 13);
    \u0275\u0275listener("ngSubmit", function ForgotPasswordComponent_form_11_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmit());
    });
    \u0275\u0275elementStart(1, "p", 14);
    \u0275\u0275text(2, " Enter your email address and we'll send you a link to reset your password. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 15)(4, "label", 16);
    \u0275\u0275text(5, "Email Address");
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "input", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 18);
    \u0275\u0275template(8, ForgotPasswordComponent_form_11_span_8_Template, 2, 0, "span", 19)(9, ForgotPasswordComponent_form_11_span_9_Template, 2, 0, "span", 19);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r0.resetForm);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("error", (ctx_r0.emailControl == null ? null : ctx_r0.emailControl.invalid) && (ctx_r0.emailControl == null ? null : ctx_r0.emailControl.touched));
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.loading || ctx_r0.resetForm.invalid);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.loading);
  }
}
function ForgotPasswordComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "div", 21)(2, "div", 22);
    \u0275\u0275text(3, "\u2713");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h3");
    \u0275\u0275text(5, "Check Your Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7, "If an account exists with that email address, you will receive a password reset link shortly.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p");
    \u0275\u0275text(9, "Please check your email and follow the instructions to reset your password.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 23);
    \u0275\u0275text(11, "The link will expire in 1 hour.");
    \u0275\u0275elementEnd()()();
  }
}
var ForgotPasswordComponent = class _ForgotPasswordComponent {
  fb;
  authService;
  resetForm;
  loading = false;
  errorMessage = "";
  successMessage = "";
  emailSent = false;
  constructor(fb, authService) {
    this.fb = fb;
    this.authService = authService;
    this.resetForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }
  onSubmit() {
    if (this.resetForm.invalid) {
      this.errorMessage = "Please enter a valid email address.";
      return;
    }
    this.loading = true;
    this.errorMessage = "";
    this.successMessage = "";
    const email = this.resetForm.value.email.trim();
    this.authService.requestPasswordReset(email).subscribe({
      next: (response) => {
        console.log("Password reset API response:", response);
        this.loading = false;
        if (response.success) {
          this.emailSent = true;
        } else {
          console.warn("Password reset returned unsuccessful:", response.message);
          this.emailSent = true;
        }
      },
      error: (error) => {
        console.error("Password reset API error:", error);
        this.loading = false;
        this.emailSent = true;
      }
    });
  }
  get emailControl() {
    return this.resetForm.get("email");
  }
  static \u0275fac = function ForgotPasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ForgotPasswordComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ForgotPasswordComponent, selectors: [["app-forgot-password"]], standalone: false, decls: 16, vars: 4, consts: [[1, "login-container"], [1, "login-box"], [1, "login-header"], [1, "logo"], ["src", "/assets/img/logo.png", "alt", "PASC Region J", 1, "logo-img"], ["class", "alert alert-success", 4, "ngIf"], ["class", "alert alert-error", 4, "ngIf"], ["class", "login-form", 3, "formGroup", "ngSubmit", 4, "ngIf"], ["class", "login-form", 4, "ngIf"], [1, "login-footer"], ["routerLink", "/admin", 1, "btn", "btn-back"], [1, "alert", "alert-success"], [1, "alert", "alert-error"], [1, "login-form", 3, "ngSubmit", "formGroup"], [1, "form-instructions"], [1, "form-group"], ["for", "email"], ["type", "email", "id", "email", "formControlName", "email", "placeholder", "Enter your email", "autocomplete", "email", "autofocus", "", 1, "form-control"], ["type", "submit", 1, "btn", "btn-login", 3, "disabled"], [4, "ngIf"], [1, "login-form"], [1, "success-box"], [1, "success-icon"], [1, "note"]], template: function ForgotPasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275element(4, "img", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "h1");
      \u0275\u0275text(6, "Reset Password");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p");
      \u0275\u0275text(8, "PASC Region J Conference 2026");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(9, ForgotPasswordComponent_div_9_Template, 2, 1, "div", 5)(10, ForgotPasswordComponent_div_10_Template, 2, 1, "div", 6)(11, ForgotPasswordComponent_form_11_Template, 10, 6, "form", 7)(12, ForgotPasswordComponent_div_12_Template, 12, 0, "div", 8);
      \u0275\u0275elementStart(13, "div", 9)(14, "a", 10);
      \u0275\u0275text(15, "\u2190 Back to Login");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("ngIf", ctx.successMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.emailSent);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.emailSent);
    }
  }, dependencies: [NgIf, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  background-image: url(/assets/img/intro-background.png);\n  background-size: cover;\n  background-position: center;\n  background-attachment: fixed;\n  background-color: #0a0e27;\n}\n.login-container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 450px;\n  min-height: 100vh;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  padding: 20px;\n  margin: 0 auto;\n}\n.login-box[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.98);\n  border-radius: 20px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n  width: 100%;\n}\n.login-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1a1f3a 0%,\n      #2d3561 100%);\n  padding: 40px 30px;\n  text-align: center;\n  color: #ffffff;\n}\n.login-header[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  display: flex;\n  justify-content: center;\n}\n.login-header[_ngcontent-%COMP%]   .logo-img[_ngcontent-%COMP%] {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  border: 3px solid #4fc3f7;\n  box-shadow: 0 0 20px rgba(79, 195, 247, 0.5);\n}\n.login-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  margin-bottom: 5px;\n  color: #4fc3f7;\n}\n.login-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  color: #b0b8d4;\n}\n.login-form[_ngcontent-%COMP%] {\n  padding: 40px 30px;\n}\n.form-instructions[_ngcontent-%COMP%] {\n  color: #666;\n  margin-bottom: 25px;\n  line-height: 1.5;\n}\n.success-instructions[_ngcontent-%COMP%] {\n  color: #2e7d32;\n  margin-bottom: 15px;\n  line-height: 1.5;\n}\n.success-state[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.success-box[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 20px;\n  background: #e8f5e9;\n  border-radius: 12px;\n  border: 1px solid #c8e6c9;\n}\n.success-icon[_ngcontent-%COMP%] {\n  width: 60px;\n  height: 60px;\n  margin: 0 auto 15px;\n  background: #4caf50;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 2rem;\n  color: #ffffff;\n  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);\n}\n.success-box[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #2e7d32;\n  font-size: 1.3rem;\n  margin-bottom: 15px;\n}\n.success-box[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #555;\n  line-height: 1.6;\n  margin-bottom: 10px;\n}\n.success-box[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.success-box[_ngcontent-%COMP%]   .note[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: #666;\n  font-style: italic;\n  margin-top: 15px;\n  padding-top: 15px;\n  border-top: 1px solid #c8e6c9;\n}\n.form-group[_ngcontent-%COMP%] {\n  margin-bottom: 25px;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #2d3561;\n  font-size: 0.95rem;\n}\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.form-control[_ngcontent-%COMP%] {\n  width: 100% !important;\n  padding: 12px 15px !important;\n  border: 2px solid #e0e0e0 !important;\n  border-radius: 8px !important;\n  font-size: 1rem !important;\n  transition: all 0.3s ease !important;\n  background: #ffffff !important;\n}\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.form-control[_ngcontent-%COMP%]:focus {\n  outline: none !important;\n  border-color: #4fc3f7 !important;\n  box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1) !important;\n}\n.btn-login[_ngcontent-%COMP%] {\n  width: 100% !important;\n  padding: 14px !important;\n  background:\n    linear-gradient(\n      135deg,\n      #4fc3f7 0%,\n      #2196f3 100%) !important;\n  color: #ffffff !important;\n  border: none !important;\n  border-radius: 8px !important;\n  font-size: 1.1rem !important;\n  font-weight: 600 !important;\n  cursor: pointer !important;\n  transition: all 0.3s ease !important;\n  box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3) !important;\n}\n.btn-login[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px) scale(1.02) !important;\n  box-shadow: 0 8px 20px rgba(79, 195, 247, 0.5) !important;\n}\n.btn-login[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6 !important;\n  cursor: not-allowed !important;\n  transform: none !important;\n}\n.alert[_ngcontent-%COMP%] {\n  padding: 15px 20px;\n  border-radius: 8px;\n  margin: 0 30px 20px 30px;\n  font-size: 0.95rem;\n  line-height: 1.5;\n}\n.alert-error[_ngcontent-%COMP%] {\n  background: #ffebee !important;\n  color: #c62828 !important;\n  border-left: 4px solid #c62828 !important;\n}\n.alert-success[_ngcontent-%COMP%] {\n  background: #e8f5e9 !important;\n  color: #2e7d32 !important;\n  border-left: 4px solid #2e7d32 !important;\n}\n.login-footer[_ngcontent-%COMP%] {\n  background: #f5f5f5;\n  padding: 20px 30px;\n  text-align: center;\n  border-top: 1px solid #e0e0e0;\n}\n.btn-back[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 10px 20px;\n  background: #6c757d;\n  color: #ffffff !important;\n  border: none;\n  border-radius: 6px;\n  font-size: 0.95rem;\n  font-weight: 500;\n  text-decoration: none;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.btn-back[_ngcontent-%COMP%]:hover {\n  background: #5a6268;\n  transform: translateY(-1px);\n}\n@media (max-width: 480px) {\n  .login-container[_ngcontent-%COMP%] {\n    padding: 10px;\n  }\n  .login-header[_ngcontent-%COMP%] {\n    padding: 30px 20px;\n  }\n  .login-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .login-form[_ngcontent-%COMP%] {\n    padding: 30px 20px;\n  }\n  .alert[_ngcontent-%COMP%] {\n    margin: 0 20px 15px 20px;\n  }\n  .login-footer[_ngcontent-%COMP%] {\n    padding: 15px 20px;\n  }\n}\n/*# sourceMappingURL=forgot-password.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ForgotPasswordComponent, [{
    type: Component,
    args: [{ selector: "app-forgot-password", standalone: false, template: `<div class="login-container">\r
  <div class="login-box">\r
    <div class="login-header">\r
      <div class="logo">\r
        <img src="/assets/img/logo.png" alt="PASC Region J" class="logo-img">\r
      </div>\r
      <h1>Reset Password</h1>\r
      <p>PASC Region J Conference 2026</p>\r
    </div>\r
\r
    <!-- Success Message -->\r
    <div *ngIf="successMessage" class="alert alert-success">\r
      {{ successMessage }}\r
    </div>\r
\r
    <!-- Error Message -->\r
    <div *ngIf="errorMessage" class="alert alert-error">\r
      {{ errorMessage }}\r
    </div>\r
\r
    <!-- Reset Form -->\r
    <form *ngIf="!emailSent" [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="login-form">\r
      <p class="form-instructions">\r
        Enter your email address and we'll send you a link to reset your password.\r
      </p>\r
\r
      <div class="form-group">\r
        <label for="email">Email Address</label>\r
        <input\r
          type="email"\r
          id="email"\r
          formControlName="email"\r
          class="form-control"\r
          placeholder="Enter your email"\r
          autocomplete="email"\r
          autofocus\r
          [class.error]="emailControl?.invalid && emailControl?.touched">\r
      </div>\r
\r
      <button\r
        type="submit"\r
        class="btn btn-login"\r
        [disabled]="loading || resetForm.invalid">\r
        <span *ngIf="!loading">Send Reset Link</span>\r
        <span *ngIf="loading">Sending...</span>\r
      </button>\r
    </form>\r
\r
    <!-- Success state - show after email sent -->\r
    <div *ngIf="emailSent" class="login-form">\r
      <div class="success-box">\r
        <div class="success-icon">\u2713</div>\r
        <h3>Check Your Email</h3>\r
        <p>If an account exists with that email address, you will receive a password reset link shortly.</p>\r
        <p>Please check your email and follow the instructions to reset your password.</p>\r
        <p class="note">The link will expire in 1 hour.</p>\r
      </div>\r
    </div>\r
\r
    <div class="login-footer">\r
      <a routerLink="/admin" class="btn btn-back">\u2190 Back to Login</a>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/admin/auth/forgot-password/forgot-password.component.css */\n:host {\n  display: block;\n  min-height: 100vh;\n  background-image: url(/assets/img/intro-background.png);\n  background-size: cover;\n  background-position: center;\n  background-attachment: fixed;\n  background-color: #0a0e27;\n}\n.login-container {\n  width: 100%;\n  max-width: 450px;\n  min-height: 100vh;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  padding: 20px;\n  margin: 0 auto;\n}\n.login-box {\n  background: rgba(255, 255, 255, 0.98);\n  border-radius: 20px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n  width: 100%;\n}\n.login-header {\n  background:\n    linear-gradient(\n      135deg,\n      #1a1f3a 0%,\n      #2d3561 100%);\n  padding: 40px 30px;\n  text-align: center;\n  color: #ffffff;\n}\n.login-header .logo {\n  margin-bottom: 20px;\n  display: flex;\n  justify-content: center;\n}\n.login-header .logo-img {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  border: 3px solid #4fc3f7;\n  box-shadow: 0 0 20px rgba(79, 195, 247, 0.5);\n}\n.login-header h1 {\n  font-size: 1.8rem;\n  margin-bottom: 5px;\n  color: #4fc3f7;\n}\n.login-header p {\n  font-size: 0.95rem;\n  color: #b0b8d4;\n}\n.login-form {\n  padding: 40px 30px;\n}\n.form-instructions {\n  color: #666;\n  margin-bottom: 25px;\n  line-height: 1.5;\n}\n.success-instructions {\n  color: #2e7d32;\n  margin-bottom: 15px;\n  line-height: 1.5;\n}\n.success-state {\n  text-align: center;\n}\n.success-box {\n  text-align: center;\n  padding: 20px;\n  background: #e8f5e9;\n  border-radius: 12px;\n  border: 1px solid #c8e6c9;\n}\n.success-icon {\n  width: 60px;\n  height: 60px;\n  margin: 0 auto 15px;\n  background: #4caf50;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 2rem;\n  color: #ffffff;\n  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);\n}\n.success-box h3 {\n  color: #2e7d32;\n  font-size: 1.3rem;\n  margin-bottom: 15px;\n}\n.success-box p {\n  color: #555;\n  line-height: 1.6;\n  margin-bottom: 10px;\n}\n.success-box p:last-child {\n  margin-bottom: 0;\n}\n.success-box .note {\n  font-size: 0.9rem;\n  color: #666;\n  font-style: italic;\n  margin-top: 15px;\n  padding-top: 15px;\n  border-top: 1px solid #c8e6c9;\n}\n.form-group {\n  margin-bottom: 25px;\n}\n.form-group label {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #2d3561;\n  font-size: 0.95rem;\n}\n.form-group input,\n.form-control {\n  width: 100% !important;\n  padding: 12px 15px !important;\n  border: 2px solid #e0e0e0 !important;\n  border-radius: 8px !important;\n  font-size: 1rem !important;\n  transition: all 0.3s ease !important;\n  background: #ffffff !important;\n}\n.form-group input:focus,\n.form-control:focus {\n  outline: none !important;\n  border-color: #4fc3f7 !important;\n  box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1) !important;\n}\n.btn-login {\n  width: 100% !important;\n  padding: 14px !important;\n  background:\n    linear-gradient(\n      135deg,\n      #4fc3f7 0%,\n      #2196f3 100%) !important;\n  color: #ffffff !important;\n  border: none !important;\n  border-radius: 8px !important;\n  font-size: 1.1rem !important;\n  font-weight: 600 !important;\n  cursor: pointer !important;\n  transition: all 0.3s ease !important;\n  box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3) !important;\n}\n.btn-login:hover {\n  transform: translateY(-2px) scale(1.02) !important;\n  box-shadow: 0 8px 20px rgba(79, 195, 247, 0.5) !important;\n}\n.btn-login:disabled {\n  opacity: 0.6 !important;\n  cursor: not-allowed !important;\n  transform: none !important;\n}\n.alert {\n  padding: 15px 20px;\n  border-radius: 8px;\n  margin: 0 30px 20px 30px;\n  font-size: 0.95rem;\n  line-height: 1.5;\n}\n.alert-error {\n  background: #ffebee !important;\n  color: #c62828 !important;\n  border-left: 4px solid #c62828 !important;\n}\n.alert-success {\n  background: #e8f5e9 !important;\n  color: #2e7d32 !important;\n  border-left: 4px solid #2e7d32 !important;\n}\n.login-footer {\n  background: #f5f5f5;\n  padding: 20px 30px;\n  text-align: center;\n  border-top: 1px solid #e0e0e0;\n}\n.btn-back {\n  display: inline-block;\n  padding: 10px 20px;\n  background: #6c757d;\n  color: #ffffff !important;\n  border: none;\n  border-radius: 6px;\n  font-size: 0.95rem;\n  font-weight: 500;\n  text-decoration: none;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.btn-back:hover {\n  background: #5a6268;\n  transform: translateY(-1px);\n}\n@media (max-width: 480px) {\n  .login-container {\n    padding: 10px;\n  }\n  .login-header {\n    padding: 30px 20px;\n  }\n  .login-header h1 {\n    font-size: 1.5rem;\n  }\n  .login-form {\n    padding: 30px 20px;\n  }\n  .alert {\n    margin: 0 20px 15px 20px;\n  }\n  .login-footer {\n    padding: 15px 20px;\n  }\n}\n/*# sourceMappingURL=forgot-password.component.css.map */\n"] }]
  }], () => [{ type: FormBuilder }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ForgotPasswordComponent, { className: "ForgotPasswordComponent", filePath: "src/app/admin/auth/forgot-password/forgot-password.component.ts", lineNumber: 11 });
})();

// src/app/admin/auth/reset-password/reset-password.component.ts
function ResetPasswordComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.successMessage, " ");
  }
}
function ResetPasswordComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage, " ");
  }
}
function ResetPasswordComponent_form_11_span_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Reset Password");
    \u0275\u0275elementEnd();
  }
}
function ResetPasswordComponent_form_11_span_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Resetting...");
    \u0275\u0275elementEnd();
  }
}
function ResetPasswordComponent_form_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 12);
    \u0275\u0275listener("ngSubmit", function ResetPasswordComponent_form_11_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmit());
    });
    \u0275\u0275elementStart(1, "p", 13);
    \u0275\u0275text(2, " Enter your new password below. Make sure it meets all requirements. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 14)(4, "label", 15);
    \u0275\u0275text(5, "New Password");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 16);
    \u0275\u0275element(7, "input", 17);
    \u0275\u0275elementStart(8, "button", 18);
    \u0275\u0275listener("click", function ResetPasswordComponent_form_11_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.togglePasswordVisibility("password"));
    });
    \u0275\u0275elementStart(9, "span", 19);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(11, "div", 14)(12, "label", 20);
    \u0275\u0275text(13, "Confirm Password");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 16);
    \u0275\u0275element(15, "input", 21);
    \u0275\u0275elementStart(16, "button", 18);
    \u0275\u0275listener("click", function ResetPasswordComponent_form_11_Template_button_click_16_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.togglePasswordVisibility("confirmPassword"));
    });
    \u0275\u0275elementStart(17, "span", 19);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(19, "div", 22)(20, "strong");
    \u0275\u0275text(21, "Password Requirements:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "ul")(23, "li");
    \u0275\u0275text(24, "Minimum 8 characters");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "li");
    \u0275\u0275text(26, "At least one uppercase letter (A-Z)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "li");
    \u0275\u0275text(28, "At least one number (0-9)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "li");
    \u0275\u0275text(30, "At least one special character (e.g., !@#$%^&*)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(31, "button", 23);
    \u0275\u0275template(32, ResetPasswordComponent_form_11_span_32_Template, 2, 0, "span", 24)(33, ResetPasswordComponent_form_11_span_33_Template, 2, 0, "span", 24);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r0.resetForm);
    \u0275\u0275advance(7);
    \u0275\u0275classProp("error", (ctx_r0.newPasswordControl == null ? null : ctx_r0.newPasswordControl.invalid) && (ctx_r0.newPasswordControl == null ? null : ctx_r0.newPasswordControl.touched));
    \u0275\u0275property("type", ctx_r0.showPassword ? "text" : "password");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.showPassword ? "\u{1F648}" : "\u{1F441}\uFE0F");
    \u0275\u0275advance(5);
    \u0275\u0275classProp("error", (ctx_r0.confirmPasswordControl == null ? null : ctx_r0.confirmPasswordControl.invalid) && (ctx_r0.confirmPasswordControl == null ? null : ctx_r0.confirmPasswordControl.touched));
    \u0275\u0275property("type", ctx_r0.showConfirmPassword ? "text" : "password");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.showConfirmPassword ? "\u{1F648}" : "\u{1F441}\uFE0F");
    \u0275\u0275advance(13);
    \u0275\u0275property("disabled", ctx_r0.loading || ctx_r0.resetForm.invalid);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.loading);
  }
}
var ResetPasswordComponent = class _ResetPasswordComponent {
  fb;
  authService;
  router;
  route;
  resetForm;
  loading = false;
  errorMessage = "";
  successMessage = "";
  token = null;
  showPassword = false;
  showConfirmPassword = false;
  constructor(fb, authService, router, route) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;
    this.route = route;
    this.resetForm = this.fb.group({
      newPassword: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", [Validators.required]]
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params["token"] || null;
      if (!this.token) {
        this.errorMessage = "Invalid reset link. Please request a new password reset.";
      }
    });
  }
  onSubmit() {
    if (this.resetForm.invalid || !this.token) {
      this.errorMessage = "Please fill in all required fields.";
      return;
    }
    const { newPassword, confirmPassword } = this.resetForm.value;
    if (newPassword !== confirmPassword) {
      this.errorMessage = "Passwords do not match.";
      return;
    }
    if (newPassword.length < 8) {
      this.errorMessage = "Password must be at least 8 characters.";
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      this.errorMessage = "Password must contain at least one uppercase letter.";
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      this.errorMessage = "Password must contain at least one number.";
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      this.errorMessage = "Password must contain at least one special character.";
      return;
    }
    this.loading = true;
    this.errorMessage = "";
    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = "Password reset successfully! Redirecting to login...";
          setTimeout(() => {
            this.router.navigate(["/admin/login"]);
          }, 2e3);
        } else {
          this.errorMessage = response.message || "Failed to reset password.";
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.message || "Failed to reset password. Please try again.";
        this.loading = false;
      }
    });
  }
  togglePasswordVisibility(field) {
    if (field === "password") {
      this.showPassword = !this.showPassword;
    } else if (field === "confirmPassword") {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  get newPasswordControl() {
    return this.resetForm.get("newPassword");
  }
  get confirmPasswordControl() {
    return this.resetForm.get("confirmPassword");
  }
  static \u0275fac = function ResetPasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ResetPasswordComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ResetPasswordComponent, selectors: [["app-reset-password"]], standalone: false, decls: 15, vars: 3, consts: [[1, "login-container"], [1, "login-box"], [1, "login-header"], [1, "logo"], ["src", "/assets/img/logo.png", "alt", "PASC Region J", 1, "logo-img"], ["class", "alert alert-success", 4, "ngIf"], ["class", "alert alert-error", 4, "ngIf"], ["class", "login-form", 3, "formGroup", "ngSubmit", 4, "ngIf"], [1, "login-footer"], ["routerLink", "/admin/login", 1, "btn", "btn-back"], [1, "alert", "alert-success"], [1, "alert", "alert-error"], [1, "login-form", 3, "ngSubmit", "formGroup"], [1, "form-instructions"], [1, "form-group"], ["for", "newPassword"], [1, "password-input-wrapper"], ["id", "newPassword", "formControlName", "newPassword", "placeholder", "Enter new password", "autocomplete", "new-password", "autofocus", "", 1, "form-control", 3, "type"], ["type", "button", "aria-label", "Toggle password visibility", 1, "password-toggle", 3, "click"], [1, "toggle-icon"], ["for", "confirmPassword"], ["id", "confirmPassword", "formControlName", "confirmPassword", "placeholder", "Confirm new password", "autocomplete", "new-password", 1, "form-control", 3, "type"], [1, "password-requirements"], ["type", "submit", 1, "btn", "btn-login", 3, "disabled"], [4, "ngIf"]], template: function ResetPasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275element(4, "img", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "h1");
      \u0275\u0275text(6, "Reset Your Password");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p");
      \u0275\u0275text(8, "PASC Region J Conference 2026");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(9, ResetPasswordComponent_div_9_Template, 2, 1, "div", 5)(10, ResetPasswordComponent_div_10_Template, 2, 1, "div", 6)(11, ResetPasswordComponent_form_11_Template, 34, 12, "form", 7);
      \u0275\u0275elementStart(12, "div", 8)(13, "a", 9);
      \u0275\u0275text(14, "\u2190 Back to Login");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("ngIf", ctx.successMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.successMessage && ctx.token);
    }
  }, dependencies: [NgIf, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  background-image: url(/assets/img/intro-background.png);\n  background-size: cover;\n  background-position: center;\n  background-attachment: fixed;\n  background-color: #0a0e27;\n}\n.login-container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 450px;\n  min-height: 100vh;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  padding: 20px;\n  margin: 0 auto;\n}\n.login-box[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.98);\n  border-radius: 20px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n  width: 100%;\n}\n.login-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1a1f3a 0%,\n      #2d3561 100%);\n  padding: 40px 30px;\n  text-align: center;\n  color: #ffffff;\n}\n.login-header[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  display: flex;\n  justify-content: center;\n}\n.login-header[_ngcontent-%COMP%]   .logo-img[_ngcontent-%COMP%] {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  border: 3px solid #4fc3f7;\n  box-shadow: 0 0 20px rgba(79, 195, 247, 0.5);\n}\n.login-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  margin-bottom: 5px;\n  color: #4fc3f7;\n}\n.login-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  color: #b0b8d4;\n}\n.login-form[_ngcontent-%COMP%] {\n  padding: 40px 30px;\n}\n.form-instructions[_ngcontent-%COMP%] {\n  color: #666;\n  margin-bottom: 25px;\n  line-height: 1.5;\n}\n.form-group[_ngcontent-%COMP%] {\n  margin-bottom: 25px;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #2d3561;\n  font-size: 0.95rem;\n}\n.password-input-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.password-input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  flex: 1;\n  padding-right: 45px !important;\n}\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.form-control[_ngcontent-%COMP%] {\n  width: 100% !important;\n  padding: 12px 15px !important;\n  border: 2px solid #e0e0e0 !important;\n  border-radius: 8px !important;\n  font-size: 1rem !important;\n  transition: all 0.3s ease !important;\n  background: #ffffff !important;\n}\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.form-control[_ngcontent-%COMP%]:focus {\n  outline: none !important;\n  border-color: #4fc3f7 !important;\n  box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1) !important;\n}\n.form-group[_ngcontent-%COMP%]   input.error[_ngcontent-%COMP%], \n.form-control.error[_ngcontent-%COMP%] {\n  border-color: #c62828 !important;\n}\n.password-toggle[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 10px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  padding: 5px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: opacity 0.2s ease;\n}\n.password-toggle[_ngcontent-%COMP%]:hover {\n  opacity: 0.7;\n}\n.toggle-icon[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  display: flex;\n  align-items: center;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.password-requirements[_ngcontent-%COMP%] {\n  background: #e3f2fd;\n  border-left: 4px solid #2196f3;\n  border-radius: 6px;\n  padding: 15px 20px;\n  margin-bottom: 25px;\n  font-size: 0.9rem;\n}\n.password-requirements[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #1976d2;\n  display: block;\n  margin-bottom: 10px;\n}\n.password-requirements[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  margin: 0;\n  padding-left: 20px;\n  color: #555;\n}\n.password-requirements[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-bottom: 5px;\n  line-height: 1.5;\n}\n.password-requirements[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.btn-login[_ngcontent-%COMP%] {\n  width: 100% !important;\n  padding: 14px !important;\n  background:\n    linear-gradient(\n      135deg,\n      #4fc3f7 0%,\n      #2196f3 100%) !important;\n  color: #ffffff !important;\n  border: none !important;\n  border-radius: 8px !important;\n  font-size: 1.1rem !important;\n  font-weight: 600 !important;\n  cursor: pointer !important;\n  transition: all 0.3s ease !important;\n  box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3) !important;\n}\n.btn-login[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px) scale(1.02) !important;\n  box-shadow: 0 8px 20px rgba(79, 195, 247, 0.5) !important;\n}\n.btn-login[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6 !important;\n  cursor: not-allowed !important;\n  transform: none !important;\n}\n.alert[_ngcontent-%COMP%] {\n  padding: 15px 20px;\n  border-radius: 8px;\n  margin: 0 30px 20px 30px;\n  font-size: 0.95rem;\n  line-height: 1.5;\n}\n.alert-error[_ngcontent-%COMP%] {\n  background: #ffebee !important;\n  color: #c62828 !important;\n  border-left: 4px solid #c62828 !important;\n}\n.alert-success[_ngcontent-%COMP%] {\n  background: #e8f5e9 !important;\n  color: #2e7d32 !important;\n  border-left: 4px solid #2e7d32 !important;\n}\n.login-footer[_ngcontent-%COMP%] {\n  background: #f5f5f5;\n  padding: 20px 30px;\n  text-align: center;\n  border-top: 1px solid #e0e0e0;\n}\n.btn-back[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 10px 20px;\n  background: #6c757d;\n  color: #ffffff !important;\n  border: none;\n  border-radius: 6px;\n  font-size: 0.95rem;\n  font-weight: 500;\n  text-decoration: none;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.btn-back[_ngcontent-%COMP%]:hover {\n  background: #5a6268;\n  transform: translateY(-1px);\n}\n@media (max-width: 480px) {\n  .login-container[_ngcontent-%COMP%] {\n    padding: 10px;\n  }\n  .login-header[_ngcontent-%COMP%] {\n    padding: 30px 20px;\n  }\n  .login-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .login-form[_ngcontent-%COMP%] {\n    padding: 30px 20px;\n  }\n  .alert[_ngcontent-%COMP%] {\n    margin: 0 20px 15px 20px;\n  }\n  .password-requirements[_ngcontent-%COMP%] {\n    font-size: 0.85rem;\n    padding: 12px 15px;\n  }\n  .login-footer[_ngcontent-%COMP%] {\n    padding: 15px 20px;\n  }\n}\n/*# sourceMappingURL=reset-password.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResetPasswordComponent, [{
    type: Component,
    args: [{ selector: "app-reset-password", standalone: false, template: `<div class="login-container">\r
  <div class="login-box">\r
    <div class="login-header">\r
      <div class="logo">\r
        <img src="/assets/img/logo.png" alt="PASC Region J" class="logo-img">\r
      </div>\r
      <h1>Reset Your Password</h1>\r
      <p>PASC Region J Conference 2026</p>\r
    </div>\r
\r
    <!-- Success Message -->\r
    <div *ngIf="successMessage" class="alert alert-success">\r
      {{ successMessage }}\r
    </div>\r
\r
    <!-- Error Message -->\r
    <div *ngIf="errorMessage" class="alert alert-error">\r
      {{ errorMessage }}\r
    </div>\r
\r
    <!-- Reset Form -->\r
    <form *ngIf="!successMessage && token" [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="login-form">\r
      <p class="form-instructions">\r
        Enter your new password below. Make sure it meets all requirements.\r
      </p>\r
\r
      <div class="form-group">\r
        <label for="newPassword">New Password</label>\r
        <div class="password-input-wrapper">\r
          <input\r
            [type]="showPassword ? 'text' : 'password'"\r
            id="newPassword"\r
            formControlName="newPassword"\r
            class="form-control"\r
            placeholder="Enter new password"\r
            autocomplete="new-password"\r
            autofocus\r
            [class.error]="newPasswordControl?.invalid && newPasswordControl?.touched">\r
          <button\r
            type="button"\r
            class="password-toggle"\r
            (click)="togglePasswordVisibility('password')"\r
            aria-label="Toggle password visibility">\r
            <span class="toggle-icon">{{ showPassword ? '\u{1F648}' : '\u{1F441}\uFE0F' }}</span>\r
          </button>\r
        </div>\r
      </div>\r
\r
      <div class="form-group">\r
        <label for="confirmPassword">Confirm Password</label>\r
        <div class="password-input-wrapper">\r
          <input\r
            [type]="showConfirmPassword ? 'text' : 'password'"\r
            id="confirmPassword"\r
            formControlName="confirmPassword"\r
            class="form-control"\r
            placeholder="Confirm new password"\r
            autocomplete="new-password"\r
            [class.error]="confirmPasswordControl?.invalid && confirmPasswordControl?.touched">\r
          <button\r
            type="button"\r
            class="password-toggle"\r
            (click)="togglePasswordVisibility('confirmPassword')"\r
            aria-label="Toggle password visibility">\r
            <span class="toggle-icon">{{ showConfirmPassword ? '\u{1F648}' : '\u{1F441}\uFE0F' }}</span>\r
          </button>\r
        </div>\r
      </div>\r
\r
      <!-- Password Requirements -->\r
      <div class="password-requirements">\r
        <strong>Password Requirements:</strong>\r
        <ul>\r
          <li>Minimum 8 characters</li>\r
          <li>At least one uppercase letter (A-Z)</li>\r
          <li>At least one number (0-9)</li>\r
          <li>At least one special character (e.g., !@#$%^&*)</li>\r
        </ul>\r
      </div>\r
\r
      <button\r
        type="submit"\r
        class="btn btn-login"\r
        [disabled]="loading || resetForm.invalid">\r
        <span *ngIf="!loading">Reset Password</span>\r
        <span *ngIf="loading">Resetting...</span>\r
      </button>\r
    </form>\r
\r
    <div class="login-footer">\r
      <a routerLink="/admin/login" class="btn btn-back">\u2190 Back to Login</a>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/admin/auth/reset-password/reset-password.component.css */\n:host {\n  display: block;\n  min-height: 100vh;\n  background-image: url(/assets/img/intro-background.png);\n  background-size: cover;\n  background-position: center;\n  background-attachment: fixed;\n  background-color: #0a0e27;\n}\n.login-container {\n  width: 100%;\n  max-width: 450px;\n  min-height: 100vh;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  padding: 20px;\n  margin: 0 auto;\n}\n.login-box {\n  background: rgba(255, 255, 255, 0.98);\n  border-radius: 20px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n  width: 100%;\n}\n.login-header {\n  background:\n    linear-gradient(\n      135deg,\n      #1a1f3a 0%,\n      #2d3561 100%);\n  padding: 40px 30px;\n  text-align: center;\n  color: #ffffff;\n}\n.login-header .logo {\n  margin-bottom: 20px;\n  display: flex;\n  justify-content: center;\n}\n.login-header .logo-img {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  border: 3px solid #4fc3f7;\n  box-shadow: 0 0 20px rgba(79, 195, 247, 0.5);\n}\n.login-header h1 {\n  font-size: 1.8rem;\n  margin-bottom: 5px;\n  color: #4fc3f7;\n}\n.login-header p {\n  font-size: 0.95rem;\n  color: #b0b8d4;\n}\n.login-form {\n  padding: 40px 30px;\n}\n.form-instructions {\n  color: #666;\n  margin-bottom: 25px;\n  line-height: 1.5;\n}\n.form-group {\n  margin-bottom: 25px;\n}\n.form-group label {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #2d3561;\n  font-size: 0.95rem;\n}\n.password-input-wrapper {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.password-input-wrapper input {\n  flex: 1;\n  padding-right: 45px !important;\n}\n.form-group input,\n.form-control {\n  width: 100% !important;\n  padding: 12px 15px !important;\n  border: 2px solid #e0e0e0 !important;\n  border-radius: 8px !important;\n  font-size: 1rem !important;\n  transition: all 0.3s ease !important;\n  background: #ffffff !important;\n}\n.form-group input:focus,\n.form-control:focus {\n  outline: none !important;\n  border-color: #4fc3f7 !important;\n  box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1) !important;\n}\n.form-group input.error,\n.form-control.error {\n  border-color: #c62828 !important;\n}\n.password-toggle {\n  position: absolute;\n  right: 10px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  padding: 5px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: opacity 0.2s ease;\n}\n.password-toggle:hover {\n  opacity: 0.7;\n}\n.toggle-icon {\n  font-size: 1.2rem;\n  display: flex;\n  align-items: center;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.password-requirements {\n  background: #e3f2fd;\n  border-left: 4px solid #2196f3;\n  border-radius: 6px;\n  padding: 15px 20px;\n  margin-bottom: 25px;\n  font-size: 0.9rem;\n}\n.password-requirements strong {\n  color: #1976d2;\n  display: block;\n  margin-bottom: 10px;\n}\n.password-requirements ul {\n  margin: 0;\n  padding-left: 20px;\n  color: #555;\n}\n.password-requirements li {\n  margin-bottom: 5px;\n  line-height: 1.5;\n}\n.password-requirements li:last-child {\n  margin-bottom: 0;\n}\n.btn-login {\n  width: 100% !important;\n  padding: 14px !important;\n  background:\n    linear-gradient(\n      135deg,\n      #4fc3f7 0%,\n      #2196f3 100%) !important;\n  color: #ffffff !important;\n  border: none !important;\n  border-radius: 8px !important;\n  font-size: 1.1rem !important;\n  font-weight: 600 !important;\n  cursor: pointer !important;\n  transition: all 0.3s ease !important;\n  box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3) !important;\n}\n.btn-login:hover {\n  transform: translateY(-2px) scale(1.02) !important;\n  box-shadow: 0 8px 20px rgba(79, 195, 247, 0.5) !important;\n}\n.btn-login:disabled {\n  opacity: 0.6 !important;\n  cursor: not-allowed !important;\n  transform: none !important;\n}\n.alert {\n  padding: 15px 20px;\n  border-radius: 8px;\n  margin: 0 30px 20px 30px;\n  font-size: 0.95rem;\n  line-height: 1.5;\n}\n.alert-error {\n  background: #ffebee !important;\n  color: #c62828 !important;\n  border-left: 4px solid #c62828 !important;\n}\n.alert-success {\n  background: #e8f5e9 !important;\n  color: #2e7d32 !important;\n  border-left: 4px solid #2e7d32 !important;\n}\n.login-footer {\n  background: #f5f5f5;\n  padding: 20px 30px;\n  text-align: center;\n  border-top: 1px solid #e0e0e0;\n}\n.btn-back {\n  display: inline-block;\n  padding: 10px 20px;\n  background: #6c757d;\n  color: #ffffff !important;\n  border: none;\n  border-radius: 6px;\n  font-size: 0.95rem;\n  font-weight: 500;\n  text-decoration: none;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.btn-back:hover {\n  background: #5a6268;\n  transform: translateY(-1px);\n}\n@media (max-width: 480px) {\n  .login-container {\n    padding: 10px;\n  }\n  .login-header {\n    padding: 30px 20px;\n  }\n  .login-header h1 {\n    font-size: 1.5rem;\n  }\n  .login-form {\n    padding: 30px 20px;\n  }\n  .alert {\n    margin: 0 20px 15px 20px;\n  }\n  .password-requirements {\n    font-size: 0.85rem;\n    padding: 12px 15px;\n  }\n  .login-footer {\n    padding: 15px 20px;\n  }\n}\n/*# sourceMappingURL=reset-password.component.css.map */\n"] }]
  }], () => [{ type: FormBuilder }, { type: AuthService }, { type: Router }, { type: ActivatedRoute }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ResetPasswordComponent, { className: "ResetPasswordComponent", filePath: "src/app/admin/auth/reset-password/reset-password.component.ts", lineNumber: 12 });
})();

// src/app/admin/auth/change-password/change-password.component.ts
function ChangePasswordComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage, " ");
  }
}
function ChangePasswordComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25)(1, "div", 26);
    \u0275\u0275element(2, "div", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 28);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r0.passwordStrength, "%")("background", ctx_r0.strengthColor);
    \u0275\u0275advance();
    \u0275\u0275styleProp("color", ctx_r0.strengthColor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.strengthLabel);
  }
}
function ChangePasswordComponent_span_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Change Password");
    \u0275\u0275elementEnd();
  }
}
function ChangePasswordComponent_span_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Changing...");
    \u0275\u0275elementEnd();
  }
}
var ChangePasswordComponent = class _ChangePasswordComponent {
  fb;
  authService;
  router;
  passwordForm;
  loading = false;
  errorMessage = "";
  showPassword = false;
  showConfirmPassword = false;
  // Password strength indicator
  passwordStrength = 0;
  strengthLabel = "";
  strengthColor = "";
  constructor(fb, authService, router) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;
    this.passwordForm = this.fb.group({
      newPassword: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", [Validators.required]]
    });
    this.passwordForm.get("newPassword")?.valueChanges.subscribe((value) => {
      this.calculatePasswordStrength(value);
    });
  }
  calculatePasswordStrength(password) {
    if (!password) {
      this.passwordStrength = 0;
      this.strengthLabel = "";
      this.strengthColor = "";
      return;
    }
    let strength = 0;
    if (password.length >= 8)
      strength += 20;
    if (password.length >= 12)
      strength += 10;
    if (password.length >= 16)
      strength += 10;
    if (/[a-z]/.test(password))
      strength += 10;
    if (/[A-Z]/.test(password))
      strength += 15;
    if (/[0-9]/.test(password))
      strength += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      strength += 20;
    const types = [/[a-z]/, /[A-Z]/, /[0-9]/, /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/];
    const typeCount = types.filter((regex) => regex.test(password)).length;
    if (typeCount >= 4)
      strength += 10;
    this.passwordStrength = Math.min(strength, 100);
    if (this.passwordStrength < 20) {
      this.strengthLabel = "Weak";
      this.strengthColor = "#dc3545";
    } else if (this.passwordStrength < 40) {
      this.strengthLabel = "Fair";
      this.strengthColor = "#fd7e14";
    } else if (this.passwordStrength < 60) {
      this.strengthLabel = "Medium";
      this.strengthColor = "#ffc107";
    } else if (this.passwordStrength < 80) {
      this.strengthLabel = "Good";
      this.strengthColor = "#90EE90";
    } else {
      this.strengthLabel = "Strong";
      this.strengthColor = "#28a745";
    }
  }
  logout() {
    this.authService.logout().subscribe();
  }
  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user && !user.must_change_password) {
      this.router.navigate(["/admin/dashboard"]);
    }
  }
  onSubmit() {
    if (this.passwordForm.invalid) {
      this.errorMessage = "Please fill in all required fields.";
      return;
    }
    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.errorMessage = "Passwords do not match.";
      return;
    }
    if (newPassword.length < 8) {
      this.errorMessage = "Password must be at least 8 characters.";
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      this.errorMessage = "Password must contain at least one uppercase letter.";
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      this.errorMessage = "Password must contain at least one number.";
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      this.errorMessage = "Password must contain at least one special character.";
      return;
    }
    this.loading = true;
    this.errorMessage = "";
    this.authService.changeRequiredPassword(newPassword).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(["/admin/dashboard"]);
        } else {
          this.errorMessage = response.message || "Failed to change password.";
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.message || "Failed to change password. Please try again.";
        this.loading = false;
      }
    });
  }
  togglePasswordVisibility(field) {
    if (field === "password") {
      this.showPassword = !this.showPassword;
    } else if (field === "confirmPassword") {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  get newPasswordControl() {
    return this.passwordForm.get("newPassword");
  }
  get confirmPasswordControl() {
    return this.passwordForm.get("confirmPassword");
  }
  static \u0275fac = function ChangePasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChangePasswordComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChangePasswordComponent, selectors: [["app-change-password"]], standalone: false, decls: 50, vars: 14, consts: [[1, "login-container"], [1, "login-box"], [1, "login-header"], [1, "logo"], ["src", "/assets/img/logo.png", "alt", "PASC Region J", 1, "logo-img"], ["class", "alert alert-error", 4, "ngIf"], [1, "login-form", 3, "ngSubmit", "formGroup"], [1, "form-instructions"], [1, "form-group"], ["for", "newPassword"], [1, "password-input-wrapper"], ["id", "newPassword", "formControlName", "newPassword", "placeholder", "Enter new password", "autocomplete", "new-password", 1, "form-control", 3, "type"], ["type", "button", "aria-label", "Toggle password visibility", 1, "password-toggle", 3, "click"], [1, "toggle-icon"], ["class", "password-strength", 4, "ngIf"], ["for", "confirmPassword"], ["id", "confirmPassword", "formControlName", "confirmPassword", "placeholder", "Confirm new password", "autocomplete", "new-password", 1, "form-control", 3, "type"], [1, "password-requirements"], [1, "requirements-title"], [1, "requirements-list"], ["type", "submit", 1, "btn", "btn-login", 3, "disabled"], [4, "ngIf"], [1, "logout-link-container"], ["type", "button", 1, "logout-link", 3, "click"], [1, "alert", "alert-error"], [1, "password-strength"], [1, "strength-bar-container"], [1, "strength-bar"], [1, "strength-label"]], template: function ChangePasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275element(4, "img", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "h1");
      \u0275\u0275text(6, "Change Password");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p");
      \u0275\u0275text(8, "PASC Region J Conference 2026");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(9, ChangePasswordComponent_div_9_Template, 2, 1, "div", 5);
      \u0275\u0275elementStart(10, "form", 6);
      \u0275\u0275listener("ngSubmit", function ChangePasswordComponent_Template_form_ngSubmit_10_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(11, "p", 7);
      \u0275\u0275text(12, " For security reasons, you must change your password before continuing. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 8)(14, "label", 9);
      \u0275\u0275text(15, "New Password");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "div", 10);
      \u0275\u0275element(17, "input", 11);
      \u0275\u0275elementStart(18, "button", 12);
      \u0275\u0275listener("click", function ChangePasswordComponent_Template_button_click_18_listener() {
        return ctx.togglePasswordVisibility("password");
      });
      \u0275\u0275elementStart(19, "span", 13);
      \u0275\u0275text(20);
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(21, ChangePasswordComponent_div_21_Template, 5, 7, "div", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "div", 8)(23, "label", 15);
      \u0275\u0275text(24, "Confirm New Password");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "div", 10);
      \u0275\u0275element(26, "input", 16);
      \u0275\u0275elementStart(27, "button", 12);
      \u0275\u0275listener("click", function ChangePasswordComponent_Template_button_click_27_listener() {
        return ctx.togglePasswordVisibility("confirmPassword");
      });
      \u0275\u0275elementStart(28, "span", 13);
      \u0275\u0275text(29);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(30, "div", 17)(31, "strong", 18);
      \u0275\u0275text(32, "Password Requirements:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "ul", 19)(34, "li");
      \u0275\u0275text(35, "Minimum 8 characters");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "li");
      \u0275\u0275text(37, "At least one uppercase letter (A-Z)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "li");
      \u0275\u0275text(39, "At least one number (0-9)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "li");
      \u0275\u0275text(41, "At least one special character (e.g., !@#$%^&*)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "li");
      \u0275\u0275text(43, "Cannot reuse your current password");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(44, "button", 20);
      \u0275\u0275template(45, ChangePasswordComponent_span_45_Template, 2, 0, "span", 21)(46, ChangePasswordComponent_span_46_Template, 2, 0, "span", 21);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(47, "div", 22)(48, "button", 23);
      \u0275\u0275listener("click", function ChangePasswordComponent_Template_button_click_48_listener() {
        return ctx.logout();
      });
      \u0275\u0275text(49, " Logout and return later ");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.passwordForm);
      \u0275\u0275advance(7);
      \u0275\u0275classProp("error", (ctx.newPasswordControl == null ? null : ctx.newPasswordControl.invalid) && (ctx.newPasswordControl == null ? null : ctx.newPasswordControl.touched));
      \u0275\u0275property("type", ctx.showPassword ? "text" : "password");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.showPassword ? "\u{1F648}" : "\u{1F441}\uFE0F");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.passwordStrength > 0);
      \u0275\u0275advance(5);
      \u0275\u0275classProp("error", (ctx.confirmPasswordControl == null ? null : ctx.confirmPasswordControl.invalid) && (ctx.confirmPasswordControl == null ? null : ctx.confirmPasswordControl.touched));
      \u0275\u0275property("type", ctx.showConfirmPassword ? "text" : "password");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.showConfirmPassword ? "\u{1F648}" : "\u{1F441}\uFE0F");
      \u0275\u0275advance(15);
      \u0275\u0275property("disabled", ctx.loading || ctx.passwordForm.invalid);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading);
    }
  }, dependencies: [NgIf, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  background-image: url(/assets/img/intro-background.png);\n  background-size: cover;\n  background-position: center;\n  background-attachment: fixed;\n  background-color: #0a0e27;\n}\n.login-container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 450px;\n  min-height: 100vh;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  padding: 20px;\n  margin: 0 auto;\n}\n.login-box[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.98);\n  border-radius: 20px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n  width: 100%;\n}\n.login-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1a1f3a 0%,\n      #2d3561 100%);\n  padding: 40px 30px;\n  text-align: center;\n  color: #ffffff;\n}\n.login-header[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  display: flex;\n  justify-content: center;\n}\n.login-header[_ngcontent-%COMP%]   .logo-img[_ngcontent-%COMP%] {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  border: 3px solid #4fc3f7;\n  box-shadow: 0 0 20px rgba(79, 195, 247, 0.5);\n}\n.login-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  margin-bottom: 5px;\n  color: #4fc3f7;\n}\n.login-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  color: #b0b8d4;\n}\n.login-form[_ngcontent-%COMP%] {\n  padding: 40px 30px;\n}\n.form-instructions[_ngcontent-%COMP%] {\n  color: #666;\n  margin-bottom: 25px;\n  line-height: 1.5;\n  text-align: center;\n}\n.form-group[_ngcontent-%COMP%] {\n  margin-bottom: 25px;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #2d3561;\n  font-size: 0.95rem;\n}\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.form-control[_ngcontent-%COMP%] {\n  width: 100% !important;\n  padding: 12px 15px !important;\n  border: 2px solid #e0e0e0 !important;\n  border-radius: 8px !important;\n  font-size: 1rem !important;\n  transition: all 0.3s ease !important;\n  background: #ffffff !important;\n}\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.form-control[_ngcontent-%COMP%]:focus {\n  outline: none !important;\n  border-color: #4fc3f7 !important;\n  box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1) !important;\n}\n.password-input-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n}\n.password-input-wrapper[_ngcontent-%COMP%]   input[type=password][_ngcontent-%COMP%], \n.password-input-wrapper[_ngcontent-%COMP%]   input[type=text][_ngcontent-%COMP%] {\n  padding-right: 50px !important;\n}\n.password-toggle[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: transparent !important;\n  border: none !important;\n  cursor: pointer;\n  font-size: 1.2rem;\n  padding: 8px;\n  color: #666;\n  transition: color 0.2s ease;\n  min-width: 40px;\n  min-height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.password-toggle[_ngcontent-%COMP%]:hover {\n  color: #4fc3f7;\n}\n.password-toggle[_ngcontent-%COMP%]:focus {\n  outline: 2px solid #4fc3f7;\n  outline-offset: 2px;\n  border-radius: 4px;\n}\n.toggle-icon[_ngcontent-%COMP%] {\n  display: inline-block;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.password-strength[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-top: 8px;\n}\n.strength-bar-container[_ngcontent-%COMP%] {\n  flex: 1;\n  height: 6px;\n  background: #e0e0e0;\n  border-radius: 3px;\n  overflow: hidden;\n}\n.strength-bar[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: 3px;\n  transition: width 0.3s ease, background 0.3s ease;\n}\n.strength-label[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: 600;\n  min-width: 60px;\n  text-align: right;\n}\n.password-requirements[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  padding: 12px 15px;\n  background: #f8f9fa;\n  border-radius: 8px;\n  border-left: 3px solid #4fc3f7;\n}\n.requirements-title[_ngcontent-%COMP%] {\n  display: block;\n  color: #2d3561;\n  font-size: 0.9rem;\n  margin-bottom: 8px;\n}\n.requirements-list[_ngcontent-%COMP%] {\n  margin: 0;\n  padding-left: 20px;\n  list-style-type: disc;\n}\n.requirements-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.85rem;\n  line-height: 1.6;\n  margin-bottom: 2px;\n}\n.requirements-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.logout-link-container[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 15px 30px 20px;\n  border-top: 1px solid #e0e0e0;\n  margin-top: 0;\n}\n.logout-link[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: #666;\n  font-size: 0.9rem;\n  text-decoration: none;\n  transition: color 0.2s ease;\n  cursor: pointer;\n  padding: 0;\n  font-family: inherit;\n}\n.logout-link[_ngcontent-%COMP%]:hover {\n  color: #4fc3f7;\n  text-decoration: underline;\n}\n.logout-link[_ngcontent-%COMP%]:focus {\n  outline: none;\n}\n.btn-login[_ngcontent-%COMP%] {\n  width: 100% !important;\n  padding: 14px !important;\n  background:\n    linear-gradient(\n      135deg,\n      #4fc3f7 0%,\n      #2196f3 100%) !important;\n  color: #ffffff !important;\n  border: none !important;\n  border-radius: 8px !important;\n  font-size: 1.1rem !important;\n  font-weight: 600 !important;\n  cursor: pointer !important;\n  transition: all 0.3s ease !important;\n  box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3) !important;\n}\n.btn-login[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px) scale(1.02) !important;\n  box-shadow: 0 8px 20px rgba(79, 195, 247, 0.5) !important;\n}\n.btn-login[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6 !important;\n  cursor: not-allowed !important;\n  transform: none !important;\n}\n.alert[_ngcontent-%COMP%] {\n  padding: 15px 20px;\n  border-radius: 8px;\n  margin: 0 30px 20px 30px;\n  font-size: 0.95rem;\n  line-height: 1.5;\n}\n.alert-error[_ngcontent-%COMP%] {\n  background: #ffebee !important;\n  color: #c62828 !important;\n  border-left: 4px solid #c62828 !important;\n}\ninput.error[_ngcontent-%COMP%] {\n  border-color: #c62828 !important;\n}\n@media (max-width: 480px) {\n  .login-container[_ngcontent-%COMP%] {\n    padding: 10px;\n  }\n  .login-header[_ngcontent-%COMP%] {\n    padding: 30px 20px;\n  }\n  .login-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .login-form[_ngcontent-%COMP%] {\n    padding: 30px 20px;\n  }\n  .alert[_ngcontent-%COMP%] {\n    margin: 0 20px 15px 20px;\n  }\n}\n/*# sourceMappingURL=change-password.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChangePasswordComponent, [{
    type: Component,
    args: [{ selector: "app-change-password", standalone: false, template: `<div class="login-container">\r
  <div class="login-box">\r
    <div class="login-header">\r
      <div class="logo">\r
        <img src="/assets/img/logo.png" alt="PASC Region J" class="logo-img">\r
      </div>\r
      <h1>Change Password</h1>\r
      <p>PASC Region J Conference 2026</p>\r
    </div>\r
\r
    <!-- Error Message -->\r
    <div *ngIf="errorMessage" class="alert alert-error">\r
      {{ errorMessage }}\r
    </div>\r
\r
    <!-- Password Form -->\r
    <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="login-form">\r
      <p class="form-instructions">\r
        For security reasons, you must change your password before continuing.\r
      </p>\r
\r
      <div class="form-group">\r
        <label for="newPassword">New Password</label>\r
        <div class="password-input-wrapper">\r
          <input\r
            [type]="showPassword ? 'text' : 'password'"\r
            id="newPassword"\r
            formControlName="newPassword"\r
            class="form-control"\r
            placeholder="Enter new password"\r
            autocomplete="new-password"\r
            [class.error]="newPasswordControl?.invalid && newPasswordControl?.touched">\r
          <button\r
            type="button"\r
            class="password-toggle"\r
            (click)="togglePasswordVisibility('password')"\r
            aria-label="Toggle password visibility">\r
            <span class="toggle-icon">{{ showPassword ? '\u{1F648}' : '\u{1F441}\uFE0F' }}</span>\r
          </button>\r
        </div>\r
        <!-- Password Strength Indicator -->\r
        <div *ngIf="passwordStrength > 0" class="password-strength">\r
          <div class="strength-bar-container">\r
            <div class="strength-bar" [style.width.%]="passwordStrength" [style.background]="strengthColor"></div>\r
          </div>\r
          <span class="strength-label" [style.color]="strengthColor">{{ strengthLabel }}</span>\r
        </div>\r
      </div>\r
\r
      <div class="form-group">\r
        <label for="confirmPassword">Confirm New Password</label>\r
        <div class="password-input-wrapper">\r
          <input\r
            [type]="showConfirmPassword ? 'text' : 'password'"\r
            id="confirmPassword"\r
            formControlName="confirmPassword"\r
            class="form-control"\r
            placeholder="Confirm new password"\r
            autocomplete="new-password"\r
            [class.error]="confirmPasswordControl?.invalid && confirmPasswordControl?.touched">\r
          <button\r
            type="button"\r
            class="password-toggle"\r
            (click)="togglePasswordVisibility('confirmPassword')"\r
            aria-label="Toggle password visibility">\r
            <span class="toggle-icon">{{ showConfirmPassword ? '\u{1F648}' : '\u{1F441}\uFE0F' }}</span>\r
          </button>\r
        </div>\r
      </div>\r
\r
      <!-- Password Requirements Info -->\r
      <div class="password-requirements">\r
        <strong class="requirements-title">Password Requirements:</strong>\r
        <ul class="requirements-list">\r
          <li>Minimum 8 characters</li>\r
          <li>At least one uppercase letter (A-Z)</li>\r
          <li>At least one number (0-9)</li>\r
          <li>At least one special character (e.g., !@#$%^&*)</li>\r
          <li>Cannot reuse your current password</li>\r
        </ul>\r
      </div>\r
\r
      <button\r
        type="submit"\r
        class="btn btn-login"\r
        [disabled]="loading || passwordForm.invalid">\r
        <span *ngIf="!loading">Change Password</span>\r
        <span *ngIf="loading">Changing...</span>\r
      </button>\r
    </form>\r
\r
    <!-- Logout Link -->\r
    <div class="logout-link-container">\r
      <button type="button" (click)="logout()" class="logout-link">\r
        Logout and return later\r
      </button>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/admin/auth/change-password/change-password.component.css */\n:host {\n  display: block;\n  min-height: 100vh;\n  background-image: url(/assets/img/intro-background.png);\n  background-size: cover;\n  background-position: center;\n  background-attachment: fixed;\n  background-color: #0a0e27;\n}\n.login-container {\n  width: 100%;\n  max-width: 450px;\n  min-height: 100vh;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  padding: 20px;\n  margin: 0 auto;\n}\n.login-box {\n  background: rgba(255, 255, 255, 0.98);\n  border-radius: 20px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n  width: 100%;\n}\n.login-header {\n  background:\n    linear-gradient(\n      135deg,\n      #1a1f3a 0%,\n      #2d3561 100%);\n  padding: 40px 30px;\n  text-align: center;\n  color: #ffffff;\n}\n.login-header .logo {\n  margin-bottom: 20px;\n  display: flex;\n  justify-content: center;\n}\n.login-header .logo-img {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  border: 3px solid #4fc3f7;\n  box-shadow: 0 0 20px rgba(79, 195, 247, 0.5);\n}\n.login-header h1 {\n  font-size: 1.8rem;\n  margin-bottom: 5px;\n  color: #4fc3f7;\n}\n.login-header p {\n  font-size: 0.95rem;\n  color: #b0b8d4;\n}\n.login-form {\n  padding: 40px 30px;\n}\n.form-instructions {\n  color: #666;\n  margin-bottom: 25px;\n  line-height: 1.5;\n  text-align: center;\n}\n.form-group {\n  margin-bottom: 25px;\n}\n.form-group label {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #2d3561;\n  font-size: 0.95rem;\n}\n.form-group input,\n.form-control {\n  width: 100% !important;\n  padding: 12px 15px !important;\n  border: 2px solid #e0e0e0 !important;\n  border-radius: 8px !important;\n  font-size: 1rem !important;\n  transition: all 0.3s ease !important;\n  background: #ffffff !important;\n}\n.form-group input:focus,\n.form-control:focus {\n  outline: none !important;\n  border-color: #4fc3f7 !important;\n  box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1) !important;\n}\n.password-input-wrapper {\n  position: relative;\n}\n.password-input-wrapper input[type=password],\n.password-input-wrapper input[type=text] {\n  padding-right: 50px !important;\n}\n.password-toggle {\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: transparent !important;\n  border: none !important;\n  cursor: pointer;\n  font-size: 1.2rem;\n  padding: 8px;\n  color: #666;\n  transition: color 0.2s ease;\n  min-width: 40px;\n  min-height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.password-toggle:hover {\n  color: #4fc3f7;\n}\n.password-toggle:focus {\n  outline: 2px solid #4fc3f7;\n  outline-offset: 2px;\n  border-radius: 4px;\n}\n.toggle-icon {\n  display: inline-block;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.password-strength {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-top: 8px;\n}\n.strength-bar-container {\n  flex: 1;\n  height: 6px;\n  background: #e0e0e0;\n  border-radius: 3px;\n  overflow: hidden;\n}\n.strength-bar {\n  height: 100%;\n  border-radius: 3px;\n  transition: width 0.3s ease, background 0.3s ease;\n}\n.strength-label {\n  font-size: 0.85rem;\n  font-weight: 600;\n  min-width: 60px;\n  text-align: right;\n}\n.password-requirements {\n  margin-bottom: 20px;\n  padding: 12px 15px;\n  background: #f8f9fa;\n  border-radius: 8px;\n  border-left: 3px solid #4fc3f7;\n}\n.requirements-title {\n  display: block;\n  color: #2d3561;\n  font-size: 0.9rem;\n  margin-bottom: 8px;\n}\n.requirements-list {\n  margin: 0;\n  padding-left: 20px;\n  list-style-type: disc;\n}\n.requirements-list li {\n  color: #666;\n  font-size: 0.85rem;\n  line-height: 1.6;\n  margin-bottom: 2px;\n}\n.requirements-list li:last-child {\n  margin-bottom: 0;\n}\n.logout-link-container {\n  text-align: center;\n  padding: 15px 30px 20px;\n  border-top: 1px solid #e0e0e0;\n  margin-top: 0;\n}\n.logout-link {\n  background: none;\n  border: none;\n  color: #666;\n  font-size: 0.9rem;\n  text-decoration: none;\n  transition: color 0.2s ease;\n  cursor: pointer;\n  padding: 0;\n  font-family: inherit;\n}\n.logout-link:hover {\n  color: #4fc3f7;\n  text-decoration: underline;\n}\n.logout-link:focus {\n  outline: none;\n}\n.btn-login {\n  width: 100% !important;\n  padding: 14px !important;\n  background:\n    linear-gradient(\n      135deg,\n      #4fc3f7 0%,\n      #2196f3 100%) !important;\n  color: #ffffff !important;\n  border: none !important;\n  border-radius: 8px !important;\n  font-size: 1.1rem !important;\n  font-weight: 600 !important;\n  cursor: pointer !important;\n  transition: all 0.3s ease !important;\n  box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3) !important;\n}\n.btn-login:hover {\n  transform: translateY(-2px) scale(1.02) !important;\n  box-shadow: 0 8px 20px rgba(79, 195, 247, 0.5) !important;\n}\n.btn-login:disabled {\n  opacity: 0.6 !important;\n  cursor: not-allowed !important;\n  transform: none !important;\n}\n.alert {\n  padding: 15px 20px;\n  border-radius: 8px;\n  margin: 0 30px 20px 30px;\n  font-size: 0.95rem;\n  line-height: 1.5;\n}\n.alert-error {\n  background: #ffebee !important;\n  color: #c62828 !important;\n  border-left: 4px solid #c62828 !important;\n}\ninput.error {\n  border-color: #c62828 !important;\n}\n@media (max-width: 480px) {\n  .login-container {\n    padding: 10px;\n  }\n  .login-header {\n    padding: 30px 20px;\n  }\n  .login-header h1 {\n    font-size: 1.5rem;\n  }\n  .login-form {\n    padding: 30px 20px;\n  }\n  .alert {\n    margin: 0 20px 15px 20px;\n  }\n}\n/*# sourceMappingURL=change-password.component.css.map */\n"] }]
  }], () => [{ type: FormBuilder }, { type: AuthService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChangePasswordComponent, { className: "ChangePasswordComponent", filePath: "src/app/admin/auth/change-password/change-password.component.ts", lineNumber: 12 });
})();

// src/app/admin/services/announcements.service.ts
var AnnouncementsService = class _AnnouncementsService {
  http;
  // TODO: Update this URL to match your API endpoint in Phase 2
  // For now using placeholder - will need to point to ColdFusion API
  apiUrl = "/api/announcements.cfc";
  constructor(http) {
    this.http = http;
  }
  /**
   * Get all announcements (for admin panel - includes inactive)
   */
  getAll() {
    return this.http.get(`${this.apiUrl}?method=getAnnouncementsAdmin`).pipe(map((response) => response.data || []), catchError(this.handleError));
  }
  /**
   * Get a single announcement by ID
   */
  getById(id) {
    return this.http.get(`${this.apiUrl}?method=getAnnouncement&id=${id}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Create a new announcement
   */
  create(data) {
    return this.http.post(`${this.apiUrl}?method=saveAnnouncement`, data).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Update an existing announcement
   * Note: CFC uses saveAnnouncement for both create and update (detects ID)
   */
  update(id, data) {
    const dataWithId = __spreadProps(__spreadValues({}, data), { id });
    return this.http.post(`${this.apiUrl}?method=saveAnnouncement`, dataWithId).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Delete an announcement
   */
  delete(id) {
    return this.http.get(`${this.apiUrl}?method=deleteAnnouncement&id=${id}`).pipe(catchError(this.handleError));
  }
  /**
   * Toggle active status of an announcement
   */
  toggleActive(id) {
    return this.http.get(`${this.apiUrl}?method=toggleActive&id=${id}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Update display order
   */
  updateOrder(id, newOrder) {
    return this.http.get(`${this.apiUrl}?method=updateOrder&id=${id}&newOrder=${newOrder}`).pipe(catchError(this.handleError));
  }
  /**
   * Handle HTTP errors
   */
  handleError(error) {
    let errorMessage = "An error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}
Message: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    console.error("AnnouncementsService Error:", errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  static \u0275fac = function AnnouncementsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AnnouncementsService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AnnouncementsService, factory: _AnnouncementsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnnouncementsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/admin/services/forms.service.ts
var FormsService = class _FormsService {
  http;
  apiUrl = "/api/forms.cfc";
  constructor(http) {
    this.http = http;
  }
  /**
   * Get all forms for a specific location (for admin panel)
   */
  getAll(location) {
    return this.http.get(`${this.apiUrl}?method=getFormsAdmin&location=${location}`).pipe(map((response) => response.data || []), catchError(this.handleError));
  }
  /**
   * Get a single form by ID
   */
  getById(id) {
    return this.http.get(`${this.apiUrl}?method=getForm&id=${id}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Create a new form
   */
  create(data) {
    return this.http.post(`${this.apiUrl}?method=saveForm`, data).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Update an existing form
   */
  update(id, data) {
    const dataWithId = __spreadProps(__spreadValues({}, data), { id });
    return this.http.post(`${this.apiUrl}?method=saveForm`, dataWithId).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Delete a form
   */
  delete(id) {
    return this.http.get(`${this.apiUrl}?method=deleteForm&id=${id}`).pipe(catchError(this.handleError));
  }
  /**
   * Toggle active status of a form
   */
  toggleActive(id) {
    return this.http.get(`${this.apiUrl}?method=toggleActive&id=${id}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Update display order
   */
  updateOrder(id, newOrder, location) {
    return this.http.get(`${this.apiUrl}?method=updateOrder&id=${id}&newOrder=${newOrder}&location=${location}`).pipe(catchError(this.handleError));
  }
  /**
   * Handle HTTP errors
   */
  handleError(error) {
    let errorMessage = "An error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}
Message: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    console.error("FormsService Error:", errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  static \u0275fac = function FormsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormsService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FormsService, factory: _FormsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/admin/services/gallery.service.ts
var GalleryService = class _GalleryService {
  http;
  apiUrl = "/api/gallery.cfc";
  constructor(http) {
    this.http = http;
  }
  /**
   * Get all images for a specific location (for admin panel)
   */
  getAll(location) {
    return this.http.get(`${this.apiUrl}?method=getImagesAdmin&location=${location}`).pipe(map((response) => response.data || []), catchError(this.handleError));
  }
  /**
   * Get a single image by ID
   */
  getById(id) {
    return this.http.get(`${this.apiUrl}?method=getImage&id=${id}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Upload a new image
   */
  upload(formData) {
    return this.http.post(`${this.apiUrl}?method=uploadImage`, formData).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Update an existing image
   */
  update(id, data) {
    const params = new URLSearchParams({
      method: "updateImage",
      id: id.toString(),
      title: data.title,
      page_location: data.page_location,
      is_active: data.is_active.toString()
    });
    return this.http.get(`${this.apiUrl}?${params.toString()}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Delete an image
   */
  delete(id) {
    return this.http.get(`${this.apiUrl}?method=deleteImage&id=${id}`).pipe(catchError(this.handleError));
  }
  /**
   * Toggle active status of an image
   */
  toggleActive(id) {
    return this.http.get(`${this.apiUrl}?method=toggleActive&id=${id}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Update display order
   */
  updateOrder(id, newOrder, location) {
    return this.http.get(`${this.apiUrl}?method=updateOrder&id=${id}&newOrder=${newOrder}&location=${location}`).pipe(catchError(this.handleError));
  }
  /**
   * Handle HTTP errors
   */
  handleError(error) {
    let errorMessage = "An error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}
Message: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    console.error("GalleryService Error:", errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  static \u0275fac = function GalleryService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GalleryService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _GalleryService, factory: _GalleryService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GalleryService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/admin/dashboard/dashboard.component.ts
var DashboardComponent = class _DashboardComponent {
  announcementsService;
  formsService;
  galleryService;
  stats = {
    activeAnnouncements: 0,
    activeForms: 0,
    activeGallery: 0,
    activeSessions: 1
    // Default to 1 (current user)
  };
  loading = true;
  error = null;
  constructor(announcementsService, formsService, galleryService) {
    this.announcementsService = announcementsService;
    this.formsService = formsService;
    this.galleryService = galleryService;
  }
  ngOnInit() {
    this.loadStats();
  }
  loadStats() {
    this.loading = true;
    forkJoin({
      announcements: this.announcementsService.getAll(),
      formsWorkshops: this.formsService.getAll("Workshops"),
      formsRegistration: this.formsService.getAll("Registration"),
      galleryAbout: this.galleryService.getAll("about_page"),
      galleryMain: this.galleryService.getAll("gallery")
    }).subscribe({
      next: (results) => {
        this.stats.activeAnnouncements = results.announcements.filter((a) => a.is_active).length;
        const allForms = [...results.formsWorkshops, ...results.formsRegistration];
        this.stats.activeForms = allForms.filter((f) => f.is_active).length;
        const allGallery = [...results.galleryAbout, ...results.galleryMain];
        this.stats.activeGallery = allGallery.filter((g) => g.is_active).length;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading dashboard stats:", err);
        this.error = "Failed to load dashboard statistics";
        this.loading = false;
      }
    });
  }
  static \u0275fac = function DashboardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardComponent)(\u0275\u0275directiveInject(AnnouncementsService), \u0275\u0275directiveInject(FormsService), \u0275\u0275directiveInject(GalleryService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], standalone: false, decls: 99, vars: 4, consts: [[1, "content-header"], [1, "welcome-message"], [1, "stats-grid"], [1, "stat-card"], [1, "stat-icon"], [1, "stat-info"], ["routerLink", "/admin/announcements", 1, "stat-link"], ["routerLink", "/admin/forms", 1, "stat-link"], ["routerLink", "/admin/gallery", 1, "stat-link"], [2, "color", "#999", "font-size", "0.85rem", "display", "block", "margin-top", "4px"], ["routerLink", "/admin/users", 1, "stat-link"], [1, "section"], [1, "action-grid"], ["routerLink", "/admin/announcements/add", 1, "action-card"], [1, "action-icon"], ["routerLink", "/admin/forms/add", 1, "action-card"], ["routerLink", "/admin/gallery/upload", 1, "action-card"], ["href", "/", "target", "_blank", 1, "action-card"], [1, "info-box"], [1, "info-row"], [1, "info-label"], [1, "info-value"]], template: function DashboardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Dashboard");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 1);
      \u0275\u0275text(4, "Welcome back, Admin User!");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2)(6, "div", 3)(7, "div", 4);
      \u0275\u0275text(8, "\u{1F4E2}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div", 5)(10, "h3");
      \u0275\u0275text(11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "p");
      \u0275\u0275text(13, "Active Announcements");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "a", 6);
      \u0275\u0275text(15, "Manage \u2192");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 3)(17, "div", 4);
      \u0275\u0275text(18, "\u{1F4DD}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 5)(20, "h3");
      \u0275\u0275text(21);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "p");
      \u0275\u0275text(23, "Active Forms");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "a", 7);
      \u0275\u0275text(25, "Manage \u2192");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "div", 3)(27, "div", 4);
      \u0275\u0275text(28, "\u{1F4F7}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "div", 5)(30, "h3");
      \u0275\u0275text(31);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "p");
      \u0275\u0275text(33, "Active Gallery Images");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(34, "a", 8);
      \u0275\u0275text(35, "Manage \u2192");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(36, "div", 3)(37, "div", 4);
      \u0275\u0275text(38, "\u{1F465}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "div", 5)(40, "h3");
      \u0275\u0275text(41);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "p");
      \u0275\u0275text(43, "Active Sessions");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "small", 9);
      \u0275\u0275text(45, "Currently online");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(46, "a", 10);
      \u0275\u0275text(47, "Manage \u2192");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(48, "div", 11)(49, "h2");
      \u0275\u0275text(50, "Quick Actions");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "div", 12)(52, "a", 13)(53, "div", 14);
      \u0275\u0275text(54, "\u2795");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "h3");
      \u0275\u0275text(56, "New Announcement");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "p");
      \u0275\u0275text(58, "Create a new homepage announcement");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(59, "a", 15)(60, "div", 14);
      \u0275\u0275text(61, "\u{1F4CB}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "h3");
      \u0275\u0275text(63, "Add Form");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "p");
      \u0275\u0275text(65, "Add a new Google Form embed");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(66, "a", 16)(67, "div", 14);
      \u0275\u0275text(68, "\u{1F4F7}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(69, "h3");
      \u0275\u0275text(70, "Add Image");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "p");
      \u0275\u0275text(72, "Upload a new gallery image");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(73, "a", 17)(74, "div", 14);
      \u0275\u0275text(75, "\u{1F310}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(76, "h3");
      \u0275\u0275text(77, "View Website");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(78, "p");
      \u0275\u0275text(79, "Open public website in new tab");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(80, "div", 11)(81, "h2");
      \u0275\u0275text(82, "System Information");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(83, "div", 18)(84, "div", 19)(85, "span", 20);
      \u0275\u0275text(86, "Conference Date:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(87, "span", 21);
      \u0275\u0275text(88, "February 13, 2026");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(89, "div", 19)(90, "span", 20);
      \u0275\u0275text(91, "Conference Theme:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(92, "span", 21);
      \u0275\u0275text(93, "Reach for the Stars, Lead Beyond Limits");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(94, "div", 19)(95, "span", 20);
      \u0275\u0275text(96, "Website Version:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(97, "span", 21);
      \u0275\u0275text(98, "1.0.0 MVP");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(11);
      \u0275\u0275textInterpolate(ctx.stats.activeAnnouncements);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.stats.activeForms);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.stats.activeGallery);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.stats.activeSessions);
    }
  }, dependencies: [RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DashboardComponent, [{
    type: Component,
    args: [{ selector: "app-dashboard", standalone: false, template: '<div class="content-header">\r\n  <h1>Dashboard</h1>\r\n  <p class="welcome-message">Welcome back, Admin User!</p>\r\n</div>\r\n\r\n<!-- Statistics Cards -->\r\n<div class="stats-grid">\r\n  <div class="stat-card">\r\n    <div class="stat-icon">\u{1F4E2}</div>\r\n    <div class="stat-info">\r\n      <h3>{{ stats.activeAnnouncements }}</h3>\r\n      <p>Active Announcements</p>\r\n    </div>\r\n    <a routerLink="/admin/announcements" class="stat-link">Manage \u2192</a>\r\n  </div>\r\n\r\n  <div class="stat-card">\r\n    <div class="stat-icon">\u{1F4DD}</div>\r\n    <div class="stat-info">\r\n      <h3>{{ stats.activeForms }}</h3>\r\n      <p>Active Forms</p>\r\n    </div>\r\n    <a routerLink="/admin/forms" class="stat-link">Manage \u2192</a>\r\n  </div>\r\n\r\n  <div class="stat-card">\r\n    <div class="stat-icon">\u{1F4F7}</div>\r\n    <div class="stat-info">\r\n      <h3>{{ stats.activeGallery }}</h3>\r\n      <p>Active Gallery Images</p>\r\n    </div>\r\n    <a routerLink="/admin/gallery" class="stat-link">Manage \u2192</a>\r\n  </div>\r\n\r\n  <div class="stat-card">\r\n    <div class="stat-icon">\u{1F465}</div>\r\n    <div class="stat-info">\r\n      <h3>{{ stats.activeSessions }}</h3>\r\n      <p>Active Sessions</p>\r\n      <small style="color: #999; font-size: 0.85rem; display: block; margin-top: 4px;">Currently online</small>\r\n    </div>\r\n    <a routerLink="/admin/users" class="stat-link">Manage \u2192</a>\r\n  </div>\r\n</div>\r\n\r\n<!-- Quick Actions -->\r\n<div class="section">\r\n  <h2>Quick Actions</h2>\r\n  <div class="action-grid">\r\n    <a routerLink="/admin/announcements/add" class="action-card">\r\n      <div class="action-icon">\u2795</div>\r\n      <h3>New Announcement</h3>\r\n      <p>Create a new homepage announcement</p>\r\n    </a>\r\n\r\n    <a routerLink="/admin/forms/add" class="action-card">\r\n      <div class="action-icon">\u{1F4CB}</div>\r\n      <h3>Add Form</h3>\r\n      <p>Add a new Google Form embed</p>\r\n    </a>\r\n\r\n    <a routerLink="/admin/gallery/upload" class="action-card">\r\n      <div class="action-icon">\u{1F4F7}</div>\r\n      <h3>Add Image</h3>\r\n      <p>Upload a new gallery image</p>\r\n    </a>\r\n\r\n    <a href="/" target="_blank" class="action-card">\r\n      <div class="action-icon">\u{1F310}</div>\r\n      <h3>View Website</h3>\r\n      <p>Open public website in new tab</p>\r\n    </a>\r\n  </div>\r\n</div>\r\n\r\n<!-- System Information -->\r\n<div class="section">\r\n  <h2>System Information</h2>\r\n  <div class="info-box">\r\n    <div class="info-row">\r\n      <span class="info-label">Conference Date:</span>\r\n      <span class="info-value">February 13, 2026</span>\r\n    </div>\r\n    <div class="info-row">\r\n      <span class="info-label">Conference Theme:</span>\r\n      <span class="info-value">Reach for the Stars, Lead Beyond Limits</span>\r\n    </div>\r\n    <div class="info-row">\r\n      <span class="info-label">Website Version:</span>\r\n      <span class="info-value">1.0.0 MVP</span>\r\n    </div>\r\n  </div>\r\n</div>\r\n' }]
  }], () => [{ type: AnnouncementsService }, { type: FormsService }, { type: GalleryService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src/app/admin/dashboard/dashboard.component.ts", lineNumber: 13 });
})();

// src/app/admin/announcements/announcement-list/announcement-list.component.ts
var _c0 = () => [];
function AnnouncementListComponent_div_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, " ");
  }
}
function AnnouncementListComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275element(1, "div", 19);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Loading announcements...");
    \u0275\u0275elementEnd()();
  }
}
function AnnouncementListComponent_div_28_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function AnnouncementListComponent_div_28_button_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(1));
    });
    \u0275\u0275text(1, "1");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementListComponent_div_28_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementListComponent_div_28_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function AnnouncementListComponent_div_28_button_8_Template_button_click_0_listener() {
      const page_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(page_r5));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", page_r5 === ctx_r0.currentPage);
    \u0275\u0275property("disabled", page_r5 === ctx_r0.currentPage && ctx_r0.getTotalPages() === 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r5, " ");
  }
}
function AnnouncementListComponent_div_28_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementListComponent_div_28_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function AnnouncementListComponent_div_28_button_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.getTotalPages()));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getTotalPages());
  }
}
function AnnouncementListComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "div", 21);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 22)(4, "button", 23);
    \u0275\u0275listener("click", function AnnouncementListComponent_div_28_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.previousPage());
    });
    \u0275\u0275text(5, "\xAB Previous");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, AnnouncementListComponent_div_28_button_6_Template, 2, 0, "button", 24)(7, AnnouncementListComponent_div_28_span_7_Template, 2, 0, "span", 25)(8, AnnouncementListComponent_div_28_button_8_Template, 2, 4, "button", 26)(9, AnnouncementListComponent_div_28_span_9_Template, 2, 0, "span", 25)(10, AnnouncementListComponent_div_28_button_10_Template, 2, 1, "button", 24);
    \u0275\u0275elementStart(11, "button", 23);
    \u0275\u0275listener("click", function AnnouncementListComponent_div_28_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.nextPage());
    });
    \u0275\u0275text(12, "Next \xBB");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" Showing ", ctx_r0.getPageStart(), "-", ctx_r0.getPageEnd(), " of ", ctx_r0.filteredAnnouncements.length, " total ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.getPageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages() - 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage === ctx_r0.getTotalPages());
  }
}
function AnnouncementListComponent_div_29_tr_15_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 39);
    \u0275\u0275listener("click", function AnnouncementListComponent_div_29_tr_15_button_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.addNew());
    });
    \u0275\u0275text(1, " Create First Announcement ");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementListComponent_div_29_tr_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 36)(2, "div", 37)(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, AnnouncementListComponent_div_29_tr_15_button_5_Template, 2, 0, "button", 38);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.searchQuery || ctx_r0.statusFilter !== "all" ? "No announcements match your filters" : "No announcements yet");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.searchQuery && ctx_r0.statusFilter === "all");
  }
}
function AnnouncementListComponent_div_29_tr_16_option_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 56);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const idx_r10 = ctx.index;
    const announcement_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", idx_r10 + 1)("selected", announcement_r9.display_order === idx_r10 + 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", idx_r10 + 1, " ");
  }
}
function AnnouncementListComponent_div_29_tr_16_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 57);
    \u0275\u0275text(1, "\u2B50 Featured");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementListComponent_div_29_tr_16_span_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 58);
    \u0275\u0275text(1, "Inactive");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementListComponent_div_29_tr_16_span_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 59);
    \u0275\u0275text(1, "Expired");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementListComponent_div_29_tr_16_span_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 60);
    \u0275\u0275text(1, "\u{1F4C5} Future");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementListComponent_div_29_tr_16_span_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 61);
    \u0275\u0275text(1, "\u2713 Live");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementListComponent_div_29_tr_16_br_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "br");
  }
}
function AnnouncementListComponent_div_29_tr_16_small_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 44);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const announcement_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" to ", ctx_r0.formatDate(announcement_r9.publish_end), " ");
  }
}
function AnnouncementListComponent_div_29_tr_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "select", 40);
    \u0275\u0275listener("change", function AnnouncementListComponent_div_29_tr_16_Template_select_change_2_listener($event) {
      const announcement_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.updateDisplayOrder(announcement_r9, $event.target.value));
    });
    \u0275\u0275template(3, AnnouncementListComponent_div_29_tr_16_option_3_Template, 2, 3, "option", 41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 42)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, AnnouncementListComponent_div_29_tr_16_span_7_Template, 2, 0, "span", 43);
    \u0275\u0275element(8, "br");
    \u0275\u0275elementStart(9, "small", 44);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td", 45);
    \u0275\u0275template(12, AnnouncementListComponent_div_29_tr_16_span_12_Template, 2, 0, "span", 46)(13, AnnouncementListComponent_div_29_tr_16_span_13_Template, 2, 0, "span", 47)(14, AnnouncementListComponent_div_29_tr_16_span_14_Template, 2, 0, "span", 48)(15, AnnouncementListComponent_div_29_tr_16_span_15_Template, 2, 0, "span", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 50);
    \u0275\u0275text(17);
    \u0275\u0275template(18, AnnouncementListComponent_div_29_tr_16_br_18_Template, 1, 0, "br", 34)(19, AnnouncementListComponent_div_29_tr_16_small_19_Template, 2, 1, "small", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td", 52)(21, "button", 53);
    \u0275\u0275listener("click", function AnnouncementListComponent_div_29_tr_16_Template_button_click_21_listener() {
      const announcement_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.edit(announcement_r9.id));
    });
    \u0275\u0275text(22, " \u270F\uFE0F ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "button", 54);
    \u0275\u0275listener("click", function AnnouncementListComponent_div_29_tr_16_Template_button_click_23_listener() {
      const announcement_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleActive(announcement_r9));
    });
    \u0275\u0275text(24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "button", 55);
    \u0275\u0275listener("click", function AnnouncementListComponent_div_29_tr_16_Template_button_click_25_listener() {
      const announcement_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.deleteAnnouncement(announcement_r9));
    });
    \u0275\u0275text(26, " \u{1F5D1}\uFE0F ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const announcement_r9 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", \u0275\u0275pureFunction0(13, _c0).constructor(ctx_r0.announcements.length));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(announcement_r9.title);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", announcement_r9.is_featured);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", announcement_r9.content.length > 100 ? announcement_r9.content.substring(0, 100) + "..." : announcement_r9.content, " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", announcement_r9.computed_status === "inactive");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", announcement_r9.computed_status === "expired");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", announcement_r9.computed_status === "future");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", announcement_r9.computed_status === "live");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatDate(announcement_r9.publish_start), " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", announcement_r9.publish_end);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", announcement_r9.publish_end);
    \u0275\u0275advance(4);
    \u0275\u0275property("title", announcement_r9.is_active ? "Toggle Active/Inactive" : "Toggle Active/Inactive");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", announcement_r9.is_active ? "\u{1F441}\uFE0F" : "\u{1F6AB}", " ");
  }
}
function AnnouncementListComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29)(1, "table", 30)(2, "thead")(3, "tr")(4, "th", 31);
    \u0275\u0275text(5, "Order");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 32);
    \u0275\u0275text(7, "Title");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 33);
    \u0275\u0275text(9, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 33);
    \u0275\u0275text(11, "Publish Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 33);
    \u0275\u0275text(13, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody");
    \u0275\u0275template(15, AnnouncementListComponent_div_29_tr_15_Template, 6, 2, "tr", 34)(16, AnnouncementListComponent_div_29_tr_16_Template, 27, 14, "tr", 35);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(15);
    \u0275\u0275property("ngIf", ctx_r0.filteredAnnouncements.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.getPaginatedAnnouncements());
  }
}
function AnnouncementListComponent_div_30_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function AnnouncementListComponent_div_30_button_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(1));
    });
    \u0275\u0275text(1, "1");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementListComponent_div_30_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementListComponent_div_30_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function AnnouncementListComponent_div_30_button_8_Template_button_click_0_listener() {
      const page_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(page_r14));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r14 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", page_r14 === ctx_r0.currentPage);
    \u0275\u0275property("disabled", page_r14 === ctx_r0.currentPage && ctx_r0.getTotalPages() === 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r14, " ");
  }
}
function AnnouncementListComponent_div_30_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementListComponent_div_30_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function AnnouncementListComponent_div_30_button_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.getTotalPages()));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getTotalPages());
  }
}
function AnnouncementListComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "div", 21);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 22)(4, "button", 23);
    \u0275\u0275listener("click", function AnnouncementListComponent_div_30_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.previousPage());
    });
    \u0275\u0275text(5, "\xAB Previous");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, AnnouncementListComponent_div_30_button_6_Template, 2, 0, "button", 24)(7, AnnouncementListComponent_div_30_span_7_Template, 2, 0, "span", 25)(8, AnnouncementListComponent_div_30_button_8_Template, 2, 4, "button", 26)(9, AnnouncementListComponent_div_30_span_9_Template, 2, 0, "span", 25)(10, AnnouncementListComponent_div_30_button_10_Template, 2, 1, "button", 24);
    \u0275\u0275elementStart(11, "button", 23);
    \u0275\u0275listener("click", function AnnouncementListComponent_div_30_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.nextPage());
    });
    \u0275\u0275text(12, "Next \xBB");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" Showing ", ctx_r0.getPageStart(), "-", ctx_r0.getPageEnd(), " of ", ctx_r0.filteredAnnouncements.length, " total ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.getPageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages() - 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage === ctx_r0.getTotalPages());
  }
}
var AnnouncementListComponent = class _AnnouncementListComponent {
  announcementsService;
  router;
  announcements = [];
  filteredAnnouncements = [];
  loading = false;
  error = null;
  searchQuery = "";
  statusFilter = "all";
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  constructor(announcementsService, router) {
    this.announcementsService = announcementsService;
    this.router = router;
  }
  ngOnInit() {
    this.loadAnnouncements();
  }
  /**
   * Load all announcements from API
   */
  loadAnnouncements() {
    this.loading = true;
    this.error = null;
    this.announcementsService.getAll().subscribe({
      next: (data) => {
        this.announcements = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || "Failed to load announcements";
        this.loading = false;
        console.error("Error loading announcements:", err);
      }
    });
  }
  /**
   * Apply search and status filters
   */
  applyFilters() {
    let filtered = [...this.announcements];
    if (this.statusFilter !== "all") {
      filtered = filtered.filter((a) => a.computed_status === this.statusFilter);
    }
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((a) => a.title.toLowerCase().includes(query) || a.content.toLowerCase().includes(query));
    }
    this.filteredAnnouncements = filtered;
  }
  /**
   * Handle search input
   */
  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }
  /**
   * Handle status filter change
   */
  onStatusFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }
  /**
   * Navigate to add page
   */
  addNew() {
    this.router.navigate(["/admin/announcements/add"]);
  }
  /**
   * Navigate to edit page
   */
  edit(id) {
    this.router.navigate(["/admin/announcements/edit", id]);
  }
  /**
   * Toggle active status
   */
  toggleActive(announcement) {
    this.announcementsService.toggleActive(announcement.id).subscribe({
      next: (updated) => {
        const index = this.announcements.findIndex((a) => a.id === announcement.id);
        if (index !== -1) {
          this.announcements[index] = __spreadProps(__spreadValues({}, updated), {
            computed_status: this.computeStatus(updated)
          });
        }
        const filteredIndex = this.filteredAnnouncements.findIndex((a) => a.id === announcement.id);
        if (filteredIndex !== -1) {
          this.filteredAnnouncements[filteredIndex] = this.announcements[index];
        }
      },
      error: (err) => {
        this.error = "Failed to toggle status";
        console.error("Error toggling status:", err);
      }
    });
  }
  /**
   * Compute status based on dates and is_active flag
   */
  computeStatus(announcement) {
    if (!announcement.is_active)
      return "inactive";
    const now = /* @__PURE__ */ new Date();
    const startDate = new Date(announcement.publish_start);
    const endDate = announcement.publish_end ? new Date(announcement.publish_end) : null;
    if (startDate > now)
      return "future";
    if (endDate && endDate < now)
      return "expired";
    return "live";
  }
  /**
   * Navigate to delete confirmation page
   */
  deleteAnnouncement(announcement) {
    this.router.navigate(["/admin/announcements/delete", announcement.id]);
  }
  /**
   * Update display order
   */
  updateDisplayOrder(announcement, newOrder) {
    this.announcementsService.updateOrder(announcement.id, newOrder).subscribe({
      next: () => {
        this.loadAnnouncements();
      },
      error: (err) => {
        this.error = "Failed to update order";
        console.error("Error updating order:", err);
      }
    });
  }
  /**
   * Format date for display
   */
  formatDate(dateString) {
    if (!dateString)
      return "No end date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  /**
   * Get paginated announcements for current page
   */
  getPaginatedAnnouncements() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredAnnouncements.slice(startIndex, endIndex);
  }
  /**
   * Get total number of pages
   */
  getTotalPages() {
    return Math.max(1, Math.ceil(this.filteredAnnouncements.length / this.itemsPerPage));
  }
  /**
   * Get page numbers to display
   */
  getPageNumbers() {
    const totalPages = this.getTotalPages();
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  /**
   * Get start index for current page (for display)
   */
  getPageStart() {
    if (this.filteredAnnouncements.length === 0)
      return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  /**
   * Get end index for current page (for display)
   */
  getPageEnd() {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredAnnouncements.length);
  }
  /**
   * Go to specific page
   */
  goToPage(page) {
    this.currentPage = page;
  }
  /**
   * Go to previous page
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  /**
   * Go to next page
   */
  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }
  static \u0275fac = function AnnouncementListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AnnouncementListComponent)(\u0275\u0275directiveInject(AnnouncementsService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AnnouncementListComponent, selectors: [["app-announcement-list"]], standalone: false, decls: 31, vars: 10, consts: [[1, "content-header"], [1, "section"], [1, "section-header"], [1, "btn", "btn-primary", 3, "click"], [1, "search-container"], ["type", "text", "placeholder", "Search by title or content...", 1, "search-input", 3, "ngModelChange", "input", "ngModel"], [1, "status-filter", 3, "ngModelChange", "change", "ngModel"], ["value", "all"], ["value", "inactive"], ["value", "live"], ["value", "future"], ["value", "expired"], [1, "search-results"], ["class", "alert alert-error", 4, "ngIf"], ["class", "loading-container", 4, "ngIf"], ["class", "pagination-container", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], [1, "alert", "alert-error"], [1, "loading-container"], [1, "spinner"], [1, "pagination-container"], [1, "pagination-info"], [1, "pagination-controls"], [1, "pagination-btn", 3, "click", "disabled"], ["class", "pagination-btn", 3, "click", 4, "ngIf"], ["style", "padding: 0 8px; color: #666;", 4, "ngIf"], ["class", "pagination-btn", 3, "active", "disabled", "click", 4, "ngFor", "ngForOf"], [1, "pagination-btn", 3, "click"], [2, "padding", "0 8px", "color", "#666"], [1, "table-container"], ["id", "announcements-table", 1, "data-table"], [2, "width", "10%"], [2, "width", "45%"], [2, "width", "15%"], [4, "ngIf"], [4, "ngFor", "ngForOf"], ["colspan", "5", 1, "text-center"], [1, "empty-state"], ["class", "btn btn-primary btn-sm", 3, "click", 4, "ngIf"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], [1, "order-select", 3, "change"], [3, "value", "selected", 4, "ngFor", "ngForOf"], ["data-label", "TITLE"], ["class", "badge", "style", "background: #fff9c4; color: #f57f17; font-size: 0.75rem;", 4, "ngIf"], [1, "text-muted"], ["data-label", "STATUS", 1, "col-status"], ["class", "badge badge-inactive", 4, "ngIf"], ["class", "badge", "style", "background: #ffebee; color: #c62828;", 4, "ngIf"], ["class", "badge", "style", "background: #e3f2fd; color: #1565c0;", 4, "ngIf"], ["class", "badge badge-success", 4, "ngIf"], ["data-label", "PUBLISH DATE"], ["class", "text-muted", 4, "ngIf"], ["data-label", "ACTIONS", 1, "actions"], ["title", "Edit", 1, "btn", "btn-sm", "btn-edit", 3, "click"], [1, "btn", "btn-sm", "btn-toggle", 3, "click", "title"], ["title", "Delete", 1, "btn", "btn-sm", "btn-delete", 3, "click"], [3, "value", "selected"], [1, "badge", 2, "background", "#fff9c4", "color", "#f57f17", "font-size", "0.75rem"], [1, "badge", "badge-inactive"], [1, "badge", 2, "background", "#ffebee", "color", "#c62828"], [1, "badge", 2, "background", "#e3f2fd", "color", "#1565c0"], [1, "badge", "badge-success"]], template: function AnnouncementListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Manage Announcements");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4, "Create and manage homepage announcements");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 1)(6, "div", 2)(7, "h2");
      \u0275\u0275text(8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "button", 3);
      \u0275\u0275listener("click", function AnnouncementListComponent_Template_button_click_9_listener() {
        return ctx.addNew();
      });
      \u0275\u0275text(10, " + Add New Announcement ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 4)(12, "input", 5);
      \u0275\u0275twoWayListener("ngModelChange", function AnnouncementListComponent_Template_input_ngModelChange_12_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
        return $event;
      });
      \u0275\u0275listener("input", function AnnouncementListComponent_Template_input_input_12_listener() {
        return ctx.onSearch();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "select", 6);
      \u0275\u0275twoWayListener("ngModelChange", function AnnouncementListComponent_Template_select_ngModelChange_13_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.statusFilter, $event) || (ctx.statusFilter = $event);
        return $event;
      });
      \u0275\u0275listener("change", function AnnouncementListComponent_Template_select_change_13_listener() {
        return ctx.onStatusFilterChange();
      });
      \u0275\u0275elementStart(14, "option", 7);
      \u0275\u0275text(15, "All Statuses");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "option", 8);
      \u0275\u0275text(17, "Inactive");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "option", 9);
      \u0275\u0275text(19, "Live");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "option", 10);
      \u0275\u0275text(21, "Future");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "option", 11);
      \u0275\u0275text(23, "Expired");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "span", 12);
      \u0275\u0275text(25);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(26, AnnouncementListComponent_div_26_Template, 2, 1, "div", 13)(27, AnnouncementListComponent_div_27_Template, 4, 0, "div", 14)(28, AnnouncementListComponent_div_28_Template, 13, 10, "div", 15)(29, AnnouncementListComponent_div_29_Template, 17, 2, "div", 16)(30, AnnouncementListComponent_div_30_Template, 13, 10, "div", 15);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate1("All Announcements (", ctx.announcements.length, ")");
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("ngModel", ctx.statusFilter);
      \u0275\u0275advance(12);
      \u0275\u0275textInterpolate2(" Showing ", ctx.filteredAnnouncements.length, " of ", ctx.announcements.length, " total ");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.filteredAnnouncements.length > 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.filteredAnnouncements.length > 0);
    }
  }, dependencies: [NgForOf, NgIf, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel], styles: ["\n\n.search-container[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  display: flex;\n  gap: 15px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.search-input[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 250px;\n  max-width: 400px;\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.search-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.status-filter[_ngcontent-%COMP%] {\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  background: #ffffff;\n  color: #333;\n  font-size: 0.95rem;\n  cursor: pointer;\n  min-width: 150px;\n}\n.status-filter[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.search-results[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 20px;\n  padding: 20px 0;\n  border-top: 1px solid #e0e0e0;\n}\n.pagination-info[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-controls[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n}\n.pagination-btn[_ngcontent-%COMP%] {\n  padding: 8px 12px;\n  border: 1px solid #ddd;\n  background: #ffffff;\n  color: #333;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n}\n.pagination-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #f5f5f5;\n  border-color: #4a90e2;\n}\n.pagination-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination-btn.active[_ngcontent-%COMP%] {\n  background: #4a90e2;\n  color: #ffffff;\n  border-color: #4a90e2;\n}\n/*# sourceMappingURL=announcement-list.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnnouncementListComponent, [{
    type: Component,
    args: [{ selector: "app-announcement-list", standalone: false, template: `<!-- Content Header -->\r
<div class="content-header">\r
  <h1>Manage Announcements</h1>\r
  <p>Create and manage homepage announcements</p>\r
</div>\r
\r
<div class="section">\r
  <!-- Section Header with Add Button -->\r
  <div class="section-header">\r
    <h2>All Announcements ({{ announcements.length }})</h2>\r
    <button class="btn btn-primary" (click)="addNew()">\r
      + Add New Announcement\r
    </button>\r
  </div>\r
\r
  <!-- Search and Filter -->\r
  <div class="search-container">\r
    <input\r
      type="text"\r
      class="search-input"\r
      placeholder="Search by title or content..."\r
      [(ngModel)]="searchQuery"\r
      (input)="onSearch()"\r
    />\r
\r
    <select class="status-filter" [(ngModel)]="statusFilter" (change)="onStatusFilterChange()">\r
      <option value="all">All Statuses</option>\r
      <option value="inactive">Inactive</option>\r
      <option value="live">Live</option>\r
      <option value="future">Future</option>\r
      <option value="expired">Expired</option>\r
    </select>\r
\r
    <span class="search-results">\r
      Showing {{ filteredAnnouncements.length }} of {{ announcements.length }} total\r
    </span>\r
  </div>\r
\r
  <!-- Error Message -->\r
  <div class="alert alert-error" *ngIf="error">\r
    {{ error }}\r
  </div>\r
\r
  <!-- Loading State -->\r
  <div class="loading-container" *ngIf="loading">\r
    <div class="spinner"></div>\r
    <p>Loading announcements...</p>\r
  </div>\r
\r
  <!-- Pagination Info (Top) -->\r
  <div class="pagination-container" *ngIf="!loading && filteredAnnouncements.length > 0">\r
    <div class="pagination-info">\r
      Showing {{ getPageStart() }}-{{ getPageEnd() }} of {{ filteredAnnouncements.length }} total\r
    </div>\r
    <div class="pagination-controls">\r
      <button class="pagination-btn" (click)="previousPage()" [disabled]="currentPage === 1">\xAB Previous</button>\r
\r
      <button class="pagination-btn" (click)="goToPage(1)" *ngIf="getPageNumbers()[0] > 1">1</button>\r
      <span *ngIf="getPageNumbers()[0] > 2" style="padding: 0 8px; color: #666;">...</span>\r
\r
      <button\r
        *ngFor="let page of getPageNumbers()"\r
        class="pagination-btn"\r
        [class.active]="page === currentPage"\r
        [disabled]="page === currentPage && getTotalPages() === 1"\r
        (click)="goToPage(page)">\r
        {{ page }}\r
      </button>\r
\r
      <span *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1" style="padding: 0 8px; color: #666;">...</span>\r
      <button class="pagination-btn" (click)="goToPage(getTotalPages())" *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages()">{{ getTotalPages() }}</button>\r
\r
      <button class="pagination-btn" (click)="nextPage()" [disabled]="currentPage === getTotalPages()">Next \xBB</button>\r
    </div>\r
  </div>\r
\r
  <!-- Announcements Table -->\r
  <div class="table-container" *ngIf="!loading">\r
  <table class="data-table" id="announcements-table">\r
    <thead>\r
      <tr>\r
        <th style="width: 10%;">Order</th>\r
        <th style="width: 45%;">Title</th>\r
        <th style="width: 15%;">Status</th>\r
        <th style="width: 15%;">Publish Date</th>\r
        <th style="width: 15%;">Actions</th>\r
      </tr>\r
    </thead>\r
    <tbody>\r
      <!-- Empty State -->\r
      <tr *ngIf="filteredAnnouncements.length === 0">\r
        <td colspan="5" class="text-center">\r
          <div class="empty-state">\r
            <p>{{ searchQuery || statusFilter !== 'all' ? 'No announcements match your filters' : 'No announcements yet' }}</p>\r
            <button class="btn btn-primary btn-sm" (click)="addNew()" *ngIf="!searchQuery && statusFilter === 'all'">\r
              Create First Announcement\r
            </button>\r
          </div>\r
        </td>\r
      </tr>\r
\r
      <!-- Data Rows -->\r
      <tr *ngFor="let announcement of getPaginatedAnnouncements()">\r
        <!-- Display Order Dropdown -->\r
        <td>\r
          <select\r
            class="order-select"\r
            (change)="updateDisplayOrder(announcement, $any($event.target).value)"\r
          >\r
            <option\r
              *ngFor="let i of [].constructor(announcements.length); let idx = index"\r
              [value]="idx + 1"\r
              [selected]="announcement.display_order === (idx + 1)">\r
              {{ idx + 1 }}\r
            </option>\r
          </select>\r
        </td>\r
\r
        <!-- Title with Content Preview -->\r
        <td data-label="TITLE">\r
          <strong>{{ announcement.title }}</strong>\r
          <span class="badge" *ngIf="announcement.is_featured" style="background: #fff9c4; color: #f57f17; font-size: 0.75rem;">\u2B50 Featured</span>\r
          <br>\r
          <small class="text-muted">\r
            {{ announcement.content.length > 100 ? announcement.content.substring(0, 100) + '...' : announcement.content }}\r
          </small>\r
        </td>\r
\r
        <!-- Status Badge -->\r
        <td data-label="STATUS" class="col-status">\r
          <span class="badge badge-inactive" *ngIf="announcement.computed_status === 'inactive'">Inactive</span>\r
          <span class="badge" style="background: #ffebee; color: #c62828;" *ngIf="announcement.computed_status === 'expired'">Expired</span>\r
          <span class="badge" style="background: #e3f2fd; color: #1565c0;" *ngIf="announcement.computed_status === 'future'">\u{1F4C5} Future</span>\r
          <span class="badge badge-success" *ngIf="announcement.computed_status === 'live'">\u2713 Live</span>\r
        </td>\r
\r
        <!-- Publish Dates -->\r
        <td data-label="PUBLISH DATE">\r
          {{ formatDate(announcement.publish_start) }}\r
          <br *ngIf="announcement.publish_end">\r
          <small class="text-muted" *ngIf="announcement.publish_end">\r
            to {{ formatDate(announcement.publish_end) }}\r
          </small>\r
        </td>\r
\r
        <!-- Actions -->\r
        <td data-label="ACTIONS" class="actions">\r
          <button\r
            class="btn btn-sm btn-edit"\r
            (click)="edit(announcement.id)"\r
            title="Edit"\r
          >\r
            \u270F\uFE0F\r
          </button>\r
\r
          <button\r
            class="btn btn-sm btn-toggle"\r
            (click)="toggleActive(announcement)"\r
            [title]="announcement.is_active ? 'Toggle Active/Inactive' : 'Toggle Active/Inactive'"\r
          >\r
            {{ announcement.is_active ? '\u{1F441}\uFE0F' : '\u{1F6AB}' }}\r
          </button>\r
\r
          <button\r
            class="btn btn-sm btn-delete"\r
            (click)="deleteAnnouncement(announcement)"\r
            title="Delete"\r
          >\r
            \u{1F5D1}\uFE0F\r
          </button>\r
        </td>\r
      </tr>\r
    </tbody>\r
  </table>\r
  </div>\r
\r
  <!-- Pagination (Bottom) -->\r
  <div class="pagination-container" *ngIf="!loading && filteredAnnouncements.length > 0">\r
    <div class="pagination-info">\r
      Showing {{ getPageStart() }}-{{ getPageEnd() }} of {{ filteredAnnouncements.length }} total\r
    </div>\r
    <div class="pagination-controls">\r
      <button class="pagination-btn" (click)="previousPage()" [disabled]="currentPage === 1">\xAB Previous</button>\r
\r
      <button class="pagination-btn" (click)="goToPage(1)" *ngIf="getPageNumbers()[0] > 1">1</button>\r
      <span *ngIf="getPageNumbers()[0] > 2" style="padding: 0 8px; color: #666;">...</span>\r
\r
      <button\r
        *ngFor="let page of getPageNumbers()"\r
        class="pagination-btn"\r
        [class.active]="page === currentPage"\r
        [disabled]="page === currentPage && getTotalPages() === 1"\r
        (click)="goToPage(page)">\r
        {{ page }}\r
      </button>\r
\r
      <span *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1" style="padding: 0 8px; color: #666;">...</span>\r
      <button class="pagination-btn" (click)="goToPage(getTotalPages())" *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages()">{{ getTotalPages() }}</button>\r
\r
      <button class="pagination-btn" (click)="nextPage()" [disabled]="currentPage === getTotalPages()">Next \xBB</button>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/admin/announcements/announcement-list/announcement-list.component.css */\n.search-container {\n  margin-bottom: 20px;\n  display: flex;\n  gap: 15px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.search-input {\n  flex: 1;\n  min-width: 250px;\n  max-width: 400px;\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.search-input:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.status-filter {\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  background: #ffffff;\n  color: #333;\n  font-size: 0.95rem;\n  cursor: pointer;\n  min-width: 150px;\n}\n.status-filter:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.search-results {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 20px;\n  padding: 20px 0;\n  border-top: 1px solid #e0e0e0;\n}\n.pagination-info {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-controls {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n}\n.pagination-btn {\n  padding: 8px 12px;\n  border: 1px solid #ddd;\n  background: #ffffff;\n  color: #333;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n}\n.pagination-btn:hover:not(:disabled) {\n  background: #f5f5f5;\n  border-color: #4a90e2;\n}\n.pagination-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination-btn.active {\n  background: #4a90e2;\n  color: #ffffff;\n  border-color: #4a90e2;\n}\n/*# sourceMappingURL=announcement-list.component.css.map */\n"] }]
  }], () => [{ type: AnnouncementsService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AnnouncementListComponent, { className: "AnnouncementListComponent", filePath: "src/app/admin/announcements/announcement-list/announcement-list.component.ts", lineNumber: 12 });
})();

// src/app/admin/announcements/announcement-form/announcement-form.component.ts
function AnnouncementFormComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, "\n");
  }
}
function AnnouncementFormComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "div", 9);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Loading announcement...");
    \u0275\u0275elementEnd()();
  }
}
function AnnouncementFormComponent_form_10_button_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function AnnouncementFormComponent_form_10_button_30_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.formData.publish_end = "");
    });
    \u0275\u0275text(1, " \xD7 ");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementFormComponent_form_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 10);
    \u0275\u0275listener("ngSubmit", function AnnouncementFormComponent_form_10_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmit());
    });
    \u0275\u0275elementStart(1, "div", 11)(2, "label", 12);
    \u0275\u0275text(3, "Title ");
    \u0275\u0275elementStart(4, "span", 13);
    \u0275\u0275text(5, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "input", 14);
    \u0275\u0275twoWayListener("ngModelChange", function AnnouncementFormComponent_form_10_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.title, $event) || (ctx_r0.formData.title = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "small", 15);
    \u0275\u0275text(8, "Keep it short and clear (max 255 characters)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 11)(10, "label", 16);
    \u0275\u0275text(11, "Content ");
    \u0275\u0275elementStart(12, "span", 13);
    \u0275\u0275text(13, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "textarea", 17);
    \u0275\u0275twoWayListener("ngModelChange", function AnnouncementFormComponent_form_10_Template_textarea_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.content, $event) || (ctx_r0.formData.content = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "small", 15);
    \u0275\u0275text(16, "This will appear on the homepage");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 11)(18, "label", 18);
    \u0275\u0275text(19, "Publish Start Date ");
    \u0275\u0275elementStart(20, "span", 13);
    \u0275\u0275text(21, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "input", 19);
    \u0275\u0275twoWayListener("ngModelChange", function AnnouncementFormComponent_form_10_Template_input_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.publish_start, $event) || (ctx_r0.formData.publish_start = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "small", 15);
    \u0275\u0275text(24, "Announcement will appear on homepage starting this date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 11)(26, "label", 20);
    \u0275\u0275text(27, "Publish End Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 21)(29, "input", 22);
    \u0275\u0275twoWayListener("ngModelChange", function AnnouncementFormComponent_form_10_Template_input_ngModelChange_29_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.publish_end, $event) || (ctx_r0.formData.publish_end = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(30, AnnouncementFormComponent_form_10_button_30_Template, 2, 0, "button", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "small", 15);
    \u0275\u0275text(32, "Leave empty for no end date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div", 11)(34, "label", 24)(35, "input", 25);
    \u0275\u0275twoWayListener("ngModelChange", function AnnouncementFormComponent_form_10_Template_input_ngModelChange_35_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.is_featured, $event) || (ctx_r0.formData.is_featured = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "span");
    \u0275\u0275text(37, "Featured announcement (highlighted on homepage)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "div", 11)(39, "label", 24)(40, "input", 26);
    \u0275\u0275twoWayListener("ngModelChange", function AnnouncementFormComponent_form_10_Template_input_ngModelChange_40_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.is_active, $event) || (ctx_r0.formData.is_active = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "span");
    \u0275\u0275text(42, "Active (ready to publish)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(43, "div", 27)(44, "button", 28);
    \u0275\u0275text(45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "button", 29);
    \u0275\u0275listener("click", function AnnouncementFormComponent_form_10_Template_button_click_46_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cancel());
    });
    \u0275\u0275text(47, " Cancel ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.title);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.content);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.publish_start);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.publish_end);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.formData.publish_end);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.is_featured);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.is_active);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.loading ? "Saving..." : ctx_r0.isEditMode ? "Update Announcement" : "Create Announcement", " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.loading);
  }
}
var AnnouncementFormComponent = class _AnnouncementFormComponent {
  route;
  router;
  announcementsService;
  isEditMode = false;
  announcementId = null;
  loading = false;
  error = null;
  // Form data
  formData = {
    title: "",
    content: "",
    is_active: false,
    // Default to inactive - must be manually activated
    is_featured: false,
    publish_start: this.getTodayDate(),
    publish_end: null
  };
  constructor(route, router, announcementsService) {
    this.route = route;
    this.router = router;
    this.announcementsService = announcementsService;
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.announcementId = +params["id"];
        this.loadAnnouncement();
      }
    });
  }
  /**
   * Load announcement for editing
   */
  loadAnnouncement() {
    if (!this.announcementId)
      return;
    this.loading = true;
    this.error = null;
    this.announcementsService.getById(this.announcementId).subscribe({
      next: (data) => {
        this.formData = {
          title: data.title,
          content: data.content,
          is_active: data.is_active,
          is_featured: data.is_featured,
          publish_start: this.formatDateForInput(data.publish_start),
          publish_end: data.publish_end ? this.formatDateForInput(data.publish_end) : null
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load announcement";
        this.loading = false;
        console.error("Error loading announcement:", err);
      }
    });
  }
  /**
   * Submit form (create or update)
   */
  onSubmit() {
    if (!this.formData.title.trim()) {
      this.error = "Title is required";
      return;
    }
    if (!this.formData.content.trim()) {
      this.error = "Content is required";
      return;
    }
    if (!this.formData.publish_start) {
      this.error = "Publish start date is required";
      return;
    }
    this.loading = true;
    this.error = null;
    const operation = this.isEditMode && this.announcementId ? this.announcementsService.update(this.announcementId, this.formData) : this.announcementsService.create(this.formData);
    operation.subscribe({
      next: () => {
        this.router.navigate(["/admin/announcements"]);
      },
      error: (err) => {
        this.error = err.message || "Failed to save announcement";
        this.loading = false;
        console.error("Error saving announcement:", err);
      }
    });
  }
  /**
   * Cancel and return to list
   */
  cancel() {
    this.router.navigate(["/admin/announcements"]);
  }
  /**
   * Get today's date in YYYY-MM-DD format
   */
  getTodayDate() {
    const today = /* @__PURE__ */ new Date();
    return today.toISOString().split("T")[0];
  }
  /**
   * Format date from API for input field
   */
  formatDateForInput(dateString) {
    if (!dateString)
      return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }
  static \u0275fac = function AnnouncementFormComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AnnouncementFormComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AnnouncementsService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AnnouncementFormComponent, selectors: [["app-announcement-form"]], standalone: false, decls: 11, vars: 5, consts: [[1, "content-header"], [1, "section-subtitle"], [1, "action-bar"], [1, "btn", "btn-secondary", 3, "click"], ["class", "alert alert-error", 4, "ngIf"], ["class", "loading-container", 4, "ngIf"], ["class", "admin-form", 3, "ngSubmit", 4, "ngIf"], [1, "alert", "alert-error"], [1, "loading-container"], [1, "spinner"], [1, "admin-form", 3, "ngSubmit"], [1, "form-group"], ["for", "title"], [1, "required"], ["type", "text", "id", "title", "name", "title", "placeholder", "Enter announcement title", "maxlength", "255", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-help"], ["for", "content"], ["id", "content", "name", "content", "placeholder", "Enter announcement content", "rows", "6", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "publish_start"], ["type", "date", "id", "publish_start", "name", "publish_start", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "publish_end"], [1, "date-input-wrapper"], ["type", "date", "id", "publish_end", "name", "publish_end", 1, "form-control", 3, "ngModelChange", "ngModel"], ["type", "button", "class", "btn-clear-date", "title", "Clear date", 3, "click", 4, "ngIf"], [1, "checkbox-label"], ["type", "checkbox", "name", "is_featured", 3, "ngModelChange", "ngModel"], ["type", "checkbox", "name", "is_active", 3, "ngModelChange", "ngModel"], [1, "form-actions"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 1, "btn", "btn-secondary", 3, "click", "disabled"], ["type", "button", "title", "Clear date", 1, "btn-clear-date", 3, "click"]], template: function AnnouncementFormComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 1);
      \u0275\u0275text(4);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
      \u0275\u0275listener("click", function AnnouncementFormComponent_Template_button_click_6_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(7, " \u2190 Back to Announcements ");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(8, AnnouncementFormComponent_div_8_Template, 2, 1, "div", 4)(9, AnnouncementFormComponent_div_9_Template, 4, 0, "div", 5)(10, AnnouncementFormComponent_form_10_Template, 48, 10, "form", 6);
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.isEditMode ? "Edit Announcement" : "Add New Announcement");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.isEditMode ? "Update announcement details" : "Create a new announcement for the homepage");
      \u0275\u0275advance(4);
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading && !ctx.formData.title);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading || ctx.formData.title);
    }
  }, dependencies: [NgIf, \u0275NgNoValidate, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, NgModel, NgForm], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnnouncementFormComponent, [{
    type: Component,
    args: [{ selector: "app-announcement-form", standalone: false, template: `<!-- Content Header -->\r
<div class="content-header">\r
  <h1>{{ isEditMode ? 'Edit Announcement' : 'Add New Announcement' }}</h1>\r
  <p class="section-subtitle">{{ isEditMode ? 'Update announcement details' : 'Create a new announcement for the homepage' }}</p>\r
</div>\r
\r
<!-- Back Button -->\r
<div class="action-bar">\r
  <button class="btn btn-secondary" (click)="cancel()">\r
    \u2190 Back to Announcements\r
  </button>\r
</div>\r
\r
<!-- Error Message -->\r
<div class="alert alert-error" *ngIf="error">\r
  {{ error }}\r
</div>\r
\r
<!-- Loading State -->\r
<div class="loading-container" *ngIf="loading && !formData.title">\r
  <div class="spinner"></div>\r
  <p>Loading announcement...</p>\r
</div>\r
\r
<!-- Form -->\r
<form class="admin-form" (ngSubmit)="onSubmit()" *ngIf="!loading || formData.title">\r
  <!-- Title -->\r
  <div class="form-group">\r
    <label for="title">Title <span class="required">*</span></label>\r
    <input\r
      type="text"\r
      id="title"\r
      name="title"\r
      class="form-control"\r
      [(ngModel)]="formData.title"\r
      placeholder="Enter announcement title"\r
      maxlength="255"\r
      required\r
    />\r
    <small class="form-help">Keep it short and clear (max 255 characters)</small>\r
  </div>\r
\r
  <!-- Content -->\r
  <div class="form-group">\r
    <label for="content">Content <span class="required">*</span></label>\r
    <textarea\r
      id="content"\r
      name="content"\r
      class="form-control"\r
      [(ngModel)]="formData.content"\r
      placeholder="Enter announcement content"\r
      rows="6"\r
      required\r
    ></textarea>\r
    <small class="form-help">This will appear on the homepage</small>\r
  </div>\r
\r
  <!-- Publish Start Date -->\r
  <div class="form-group">\r
    <label for="publish_start">Publish Start Date <span class="required">*</span></label>\r
    <input\r
      type="date"\r
      id="publish_start"\r
      name="publish_start"\r
      class="form-control"\r
      [(ngModel)]="formData.publish_start"\r
      required\r
    />\r
    <small class="form-help">Announcement will appear on homepage starting this date</small>\r
  </div>\r
\r
  <!-- Publish End Date -->\r
  <div class="form-group">\r
    <label for="publish_end">Publish End Date</label>\r
    <div class="date-input-wrapper">\r
      <input\r
        type="date"\r
        id="publish_end"\r
        name="publish_end"\r
        class="form-control"\r
        [(ngModel)]="formData.publish_end"\r
      />\r
      <button\r
        type="button"\r
        class="btn-clear-date"\r
        *ngIf="formData.publish_end"\r
        (click)="formData.publish_end = ''"\r
        title="Clear date"\r
      >\r
        \xD7\r
      </button>\r
    </div>\r
    <small class="form-help">Leave empty for no end date</small>\r
  </div>\r
\r
  <!-- Is Featured Checkbox -->\r
  <div class="form-group">\r
    <label class="checkbox-label">\r
      <input\r
        type="checkbox"\r
        name="is_featured"\r
        [(ngModel)]="formData.is_featured"\r
      />\r
      <span>Featured announcement (highlighted on homepage)</span>\r
    </label>\r
  </div>\r
\r
  <!-- Is Active Checkbox -->\r
  <div class="form-group">\r
    <label class="checkbox-label">\r
      <input\r
        type="checkbox"\r
        name="is_active"\r
        [(ngModel)]="formData.is_active"\r
      />\r
      <span>Active (ready to publish)</span>\r
    </label>\r
  </div>\r
\r
  <!-- Form Actions -->\r
  <div class="form-actions">\r
    <button\r
      type="submit"\r
      class="btn btn-primary"\r
      [disabled]="loading"\r
    >\r
      {{ loading ? 'Saving...' : (isEditMode ? 'Update Announcement' : 'Create Announcement') }}\r
    </button>\r
\r
    <button\r
      type="button"\r
      class="btn btn-secondary"\r
      (click)="cancel()"\r
      [disabled]="loading"\r
    >\r
      Cancel\r
    </button>\r
  </div>\r
</form>\r
` }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: AnnouncementsService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AnnouncementFormComponent, { className: "AnnouncementFormComponent", filePath: "src/app/admin/announcements/announcement-form/announcement-form.component.ts", lineNumber: 12 });
})();

// src/app/admin/announcements/announcement-delete/announcement-delete.component.ts
var _c02 = (a0) => ["/admin/announcements/edit", a0];
function AnnouncementDeleteComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1, "Loading...");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementDeleteComponent_div_10_a_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 13);
    \u0275\u0275text(1, "Edit Announcement Instead");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c02, ctx_r0.announcementId));
  }
}
function AnnouncementDeleteComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "div", 10)(3, "a", 11);
    \u0275\u0275text(4, "\u2190 Back to Announcements");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, AnnouncementDeleteComponent_div_10_a_5_Template, 2, 3, "a", 12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.announcement);
  }
}
function AnnouncementDeleteComponent_div_11_span_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275text(1, "\u2713 Live");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementDeleteComponent_div_11_span_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 36);
    \u0275\u0275text(1, "Inactive");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementDeleteComponent_div_11_span_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 37);
    \u0275\u0275text(1, "\u{1F4C5} Future");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementDeleteComponent_div_11_span_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 38);
    \u0275\u0275text(1, "Expired");
    \u0275\u0275elementEnd();
  }
}
function AnnouncementDeleteComponent_div_11_div_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "span", 23);
    \u0275\u0275text(2, "Featured:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 24);
    \u0275\u0275text(4, "\u2B50 Yes");
    \u0275\u0275elementEnd()();
  }
}
function AnnouncementDeleteComponent_div_11_div_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "span", 23);
    \u0275\u0275text(2, "Publish End:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 24);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.formatDate(ctx_r0.announcement.publish_end));
  }
}
function AnnouncementDeleteComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 15)(2, "div", 16)(3, "div", 17);
    \u0275\u0275text(4, "\u26A0\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div")(6, "h3", 18);
    \u0275\u0275text(7, "Warning: Permanent Deletion");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 19);
    \u0275\u0275text(9, " You are about to permanently delete this announcement. This action cannot be undone. The announcement will be removed from the website immediately. ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(10, "div", 20)(11, "h3", 21);
    \u0275\u0275text(12, "Announcement Details:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 22)(14, "span", 23);
    \u0275\u0275text(15, "Title:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 24);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 22)(19, "span", 23);
    \u0275\u0275text(20, "Content:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 24);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 22)(24, "span", 23);
    \u0275\u0275text(25, "Status:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span", 24);
    \u0275\u0275template(27, AnnouncementDeleteComponent_div_11_span_27_Template, 2, 0, "span", 25)(28, AnnouncementDeleteComponent_div_11_span_28_Template, 2, 0, "span", 26)(29, AnnouncementDeleteComponent_div_11_span_29_Template, 2, 0, "span", 27)(30, AnnouncementDeleteComponent_div_11_span_30_Template, 2, 0, "span", 28);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(31, AnnouncementDeleteComponent_div_11_div_31_Template, 5, 0, "div", 29);
    \u0275\u0275elementStart(32, "div", 22)(33, "span", 23);
    \u0275\u0275text(34, "Publish Start:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "span", 24);
    \u0275\u0275text(36);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(37, AnnouncementDeleteComponent_div_11_div_37_Template, 5, 1, "div", 29);
    \u0275\u0275elementStart(38, "div", 30)(39, "div", 31)(40, "p", 32);
    \u0275\u0275text(41, " Are you absolutely sure you want to delete this announcement? ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 33)(43, "button", 34);
    \u0275\u0275listener("click", function AnnouncementDeleteComponent_div_11_Template_button_click_43_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.confirmDelete());
    });
    \u0275\u0275text(44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "button", 3);
    \u0275\u0275listener("click", function AnnouncementDeleteComponent_div_11_Template_button_click_45_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cancel());
    });
    \u0275\u0275text(46, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "a", 13);
    \u0275\u0275text(48, "Edit Instead");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(17);
    \u0275\u0275textInterpolate(ctx_r0.announcement.title);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.announcement.content.length > 100 ? ctx_r0.announcement.content.substring(0, 100) + "..." : ctx_r0.announcement.content);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r0.announcement.computed_status === "live");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.announcement.computed_status === "inactive");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.announcement.computed_status === "future");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.announcement.computed_status === "expired");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.announcement.is_featured);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.formatDate(ctx_r0.announcement.publish_start));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.announcement.publish_end);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u{1F5D1}\uFE0F ", ctx_r0.loading ? "Deleting..." : "Yes, Delete Announcement", " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(12, _c02, ctx_r0.announcementId));
  }
}
var AnnouncementDeleteComponent = class _AnnouncementDeleteComponent {
  route;
  router;
  announcementsService;
  announcement = null;
  loading = false;
  error = null;
  announcementId = null;
  constructor(route, router, announcementsService) {
    this.route = route;
    this.router = router;
    this.announcementsService = announcementsService;
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.announcementId = +params["id"];
        this.loadAnnouncement();
      } else {
        this.error = "No announcement ID provided";
      }
    });
  }
  /**
   * Load announcement details for confirmation display
   */
  loadAnnouncement() {
    if (!this.announcementId)
      return;
    this.loading = true;
    this.error = null;
    this.announcementsService.getById(this.announcementId).subscribe({
      next: (data) => {
        this.announcement = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load announcement";
        this.loading = false;
        console.error("Error loading announcement:", err);
      }
    });
  }
  /**
   * Confirm and delete the announcement
   */
  confirmDelete() {
    if (!this.announcementId)
      return;
    this.loading = true;
    this.error = null;
    this.announcementsService.delete(this.announcementId).subscribe({
      next: () => {
        this.router.navigate(["/admin/announcements"]);
      },
      error: (err) => {
        this.error = "Failed to delete announcement";
        this.loading = false;
        console.error("Error deleting announcement:", err);
      }
    });
  }
  /**
   * Cancel and return to list
   */
  cancel() {
    this.router.navigate(["/admin/announcements"]);
  }
  /**
   * Format date for display
   */
  formatDate(dateString) {
    if (!dateString)
      return "No end date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  static \u0275fac = function AnnouncementDeleteComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AnnouncementDeleteComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AnnouncementsService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AnnouncementDeleteComponent, selectors: [["app-announcement-delete"]], standalone: false, decls: 12, vars: 3, consts: [[1, "content-header"], [1, "section-subtitle"], [1, "action-bar"], [1, "btn", "btn-secondary", 3, "click"], [1, "section"], ["class", "loading-container", 4, "ngIf"], ["class", "alert alert-error", 4, "ngIf"], ["style", "max-width: 700px;", 4, "ngIf"], [1, "loading-container"], [1, "alert", "alert-error"], [2, "margin-top", "20px"], ["routerLink", "/admin/announcements", 1, "btn", "btn-secondary"], ["class", "btn btn-primary", 3, "routerLink", 4, "ngIf"], [1, "btn", "btn-primary", 3, "routerLink"], [2, "max-width", "700px"], [2, "background", "#fff3cd", "border-left", "4px solid #ffc107", "padding", "20px", "border-radius", "8px", "margin-bottom", "30px"], [2, "display", "flex", "align-items", "flex-start", "gap", "15px"], [2, "font-size", "2rem"], [2, "margin", "0 0 10px 0", "color", "#856404"], [2, "margin", "0", "color", "#856404", "line-height", "1.6"], [1, "admin-form"], [2, "margin-bottom", "20px", "color", "#2d3561"], [1, "info-row"], [1, "info-label"], [1, "info-value"], ["class", "badge badge-success", 4, "ngIf"], ["class", "badge badge-inactive", 4, "ngIf"], ["class", "badge", "style", "background: #e3f2fd; color: #1565c0;", 4, "ngIf"], ["class", "badge", "style", "background: #ffebee; color: #c62828;", 4, "ngIf"], ["class", "info-row", 4, "ngIf"], [2, "margin-top", "30px", "padding-top", "20px", "border-top", "1px solid #e0e0e0"], [2, "background", "#ffebee", "padding", "15px", "border-radius", "8px", "margin-bottom", "20px"], [2, "margin", "0", "color", "#c62828", "font-weight", "600"], [1, "form-actions", 2, "margin", "0", "padding", "0", "border", "none"], [1, "btn", "btn-danger", 3, "click", "disabled"], [1, "badge", "badge-success"], [1, "badge", "badge-inactive"], [1, "badge", 2, "background", "#e3f2fd", "color", "#1565c0"], [1, "badge", 2, "background", "#ffebee", "color", "#c62828"]], template: function AnnouncementDeleteComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Delete Announcement");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 1);
      \u0275\u0275text(4, "Permanently remove announcement from the website");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
      \u0275\u0275listener("click", function AnnouncementDeleteComponent_Template_button_click_6_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(7, " \u2190 Back to Announcements ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 4);
      \u0275\u0275template(9, AnnouncementDeleteComponent_div_9_Template, 2, 0, "div", 5)(10, AnnouncementDeleteComponent_div_10_Template, 6, 2, "div", 6)(11, AnnouncementDeleteComponent_div_11_Template, 49, 14, "div", 7);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.announcement && !ctx.error);
    }
  }, dependencies: [NgIf, RouterLink], styles: ["\n\n.delete-confirmation[_ngcontent-%COMP%] {\n  max-width: 600px;\n  margin: 60px auto;\n  background: white;\n  border-radius: 12px;\n  padding: 40px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n}\n.delete-icon[_ngcontent-%COMP%] {\n  width: 80px;\n  height: 80px;\n  background: #fff3cd;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 40px;\n  margin: 0 auto 30px;\n}\n.delete-confirmation[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #2c3e50;\n  margin-bottom: 20px;\n  font-size: 28px;\n}\n.delete-confirmation[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #666;\n  margin-bottom: 30px;\n  font-size: 16px;\n}\n.announcement-details[_ngcontent-%COMP%] {\n  background: #f8f9fa;\n  border-left: 4px solid #dc3545;\n  padding: 20px;\n  margin: 30px 0;\n  border-radius: 4px;\n}\n.announcement-details[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 10px 0;\n  color: #2c3e50;\n  font-size: 18px;\n}\n.announcement-details[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 5px 0;\n  color: #666;\n  text-align: left;\n  font-size: 14px;\n}\n.announcement-details[_ngcontent-%COMP%]   .meta[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 20px;\n  margin-top: 10px;\n  flex-wrap: wrap;\n}\n.warning-note[_ngcontent-%COMP%] {\n  background: #fff3cd;\n  border: 1px solid #ffc107;\n  border-radius: 6px;\n  padding: 15px;\n  margin: 20px 0;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.warning-note[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #856404;\n}\n.warning-note[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #856404;\n  text-align: left;\n}\n.delete-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 15px;\n  justify-content: center;\n  margin-top: 30px;\n}\n.btn-confirm-delete[_ngcontent-%COMP%] {\n  background: #dc3545;\n  color: white;\n  padding: 12px 30px;\n  border: none;\n  border-radius: 6px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  text-decoration: none;\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  transition: background 0.3s;\n}\n.btn-confirm-delete[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #c82333;\n}\n.btn-confirm-delete[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-cancel[_ngcontent-%COMP%] {\n  background: #6c757d;\n  color: white;\n  padding: 12px 30px;\n  border: none;\n  border-radius: 6px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  text-decoration: none;\n  transition: background 0.3s;\n}\n.btn-cancel[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #5a6268;\n}\n.btn-cancel[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=announcement-delete.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnnouncementDeleteComponent, [{
    type: Component,
    args: [{ selector: "app-announcement-delete", standalone: false, template: `<div class="content-header">\r
  <h1>Delete Announcement</h1>\r
  <p class="section-subtitle">Permanently remove announcement from the website</p>\r
</div>\r
\r
<div class="action-bar">\r
  <button class="btn btn-secondary" (click)="cancel()">\r
    \u2190 Back to Announcements\r
  </button>\r
</div>\r
\r
<div class="section">\r
  <div *ngIf="loading" class="loading-container">Loading...</div>\r
\r
  <div *ngIf="error" class="alert alert-error">\r
    {{ error }}\r
    <div style="margin-top: 20px;">\r
      <a routerLink="/admin/announcements" class="btn btn-secondary">\u2190 Back to Announcements</a>\r
      <a *ngIf="announcement" [routerLink]="['/admin/announcements/edit', announcementId]" class="btn btn-primary">Edit Announcement Instead</a>\r
    </div>\r
  </div>\r
\r
  <div *ngIf="announcement && !error" style="max-width: 700px;">\r
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 8px; margin-bottom: 30px;">\r
      <div style="display: flex; align-items: flex-start; gap: 15px;">\r
        <div style="font-size: 2rem;">\u26A0\uFE0F</div>\r
        <div>\r
          <h3 style="margin: 0 0 10px 0; color: #856404;">Warning: Permanent Deletion</h3>\r
          <p style="margin: 0; color: #856404; line-height: 1.6;">\r
            You are about to permanently delete this announcement. This action cannot be undone.\r
            The announcement will be removed from the website immediately.\r
          </p>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <div class="admin-form">\r
      <h3 style="margin-bottom: 20px; color: #2d3561;">Announcement Details:</h3>\r
\r
      <div class="info-row">\r
        <span class="info-label">Title:</span>\r
        <span class="info-value">{{ announcement.title }}</span>\r
      </div>\r
\r
      <div class="info-row">\r
        <span class="info-label">Content:</span>\r
        <span class="info-value">{{ announcement.content.length > 100 ? announcement.content.substring(0, 100) + '...' : announcement.content }}</span>\r
      </div>\r
\r
      <div class="info-row">\r
        <span class="info-label">Status:</span>\r
        <span class="info-value">\r
          <span *ngIf="announcement.computed_status === 'live'" class="badge badge-success">\u2713 Live</span>\r
          <span *ngIf="announcement.computed_status === 'inactive'" class="badge badge-inactive">Inactive</span>\r
          <span *ngIf="announcement.computed_status === 'future'" class="badge" style="background: #e3f2fd; color: #1565c0;">\u{1F4C5} Future</span>\r
          <span *ngIf="announcement.computed_status === 'expired'" class="badge" style="background: #ffebee; color: #c62828;">Expired</span>\r
        </span>\r
      </div>\r
\r
      <div class="info-row" *ngIf="announcement.is_featured">\r
        <span class="info-label">Featured:</span>\r
        <span class="info-value">\u2B50 Yes</span>\r
      </div>\r
\r
      <div class="info-row">\r
        <span class="info-label">Publish Start:</span>\r
        <span class="info-value">{{ formatDate(announcement.publish_start) }}</span>\r
      </div>\r
\r
      <div class="info-row" *ngIf="announcement.publish_end">\r
        <span class="info-label">Publish End:</span>\r
        <span class="info-value">{{ formatDate(announcement.publish_end) }}</span>\r
      </div>\r
\r
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">\r
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin-bottom: 20px;">\r
          <p style="margin: 0; color: #c62828; font-weight: 600;">\r
            Are you absolutely sure you want to delete this announcement?\r
          </p>\r
        </div>\r
\r
        <div class="form-actions" style="margin: 0; padding: 0; border: none;">\r
          <button (click)="confirmDelete()" class="btn btn-danger" [disabled]="loading">\r
            \u{1F5D1}\uFE0F {{ loading ? 'Deleting...' : 'Yes, Delete Announcement' }}\r
          </button>\r
          <button (click)="cancel()" class="btn btn-secondary">Cancel</button>\r
          <a [routerLink]="['/admin/announcements/edit', announcementId]" class="btn btn-primary">Edit Instead</a>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/admin/announcements/announcement-delete/announcement-delete.component.css */\n.delete-confirmation {\n  max-width: 600px;\n  margin: 60px auto;\n  background: white;\n  border-radius: 12px;\n  padding: 40px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n}\n.delete-icon {\n  width: 80px;\n  height: 80px;\n  background: #fff3cd;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 40px;\n  margin: 0 auto 30px;\n}\n.delete-confirmation h1 {\n  text-align: center;\n  color: #2c3e50;\n  margin-bottom: 20px;\n  font-size: 28px;\n}\n.delete-confirmation p {\n  text-align: center;\n  color: #666;\n  margin-bottom: 30px;\n  font-size: 16px;\n}\n.announcement-details {\n  background: #f8f9fa;\n  border-left: 4px solid #dc3545;\n  padding: 20px;\n  margin: 30px 0;\n  border-radius: 4px;\n}\n.announcement-details h3 {\n  margin: 0 0 10px 0;\n  color: #2c3e50;\n  font-size: 18px;\n}\n.announcement-details p {\n  margin: 5px 0;\n  color: #666;\n  text-align: left;\n  font-size: 14px;\n}\n.announcement-details .meta {\n  display: flex;\n  gap: 20px;\n  margin-top: 10px;\n  flex-wrap: wrap;\n}\n.warning-note {\n  background: #fff3cd;\n  border: 1px solid #ffc107;\n  border-radius: 6px;\n  padding: 15px;\n  margin: 20px 0;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.warning-note strong {\n  color: #856404;\n}\n.warning-note p {\n  margin: 0;\n  color: #856404;\n  text-align: left;\n}\n.delete-actions {\n  display: flex;\n  gap: 15px;\n  justify-content: center;\n  margin-top: 30px;\n}\n.btn-confirm-delete {\n  background: #dc3545;\n  color: white;\n  padding: 12px 30px;\n  border: none;\n  border-radius: 6px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  text-decoration: none;\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  transition: background 0.3s;\n}\n.btn-confirm-delete:hover:not(:disabled) {\n  background: #c82333;\n}\n.btn-confirm-delete:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-cancel {\n  background: #6c757d;\n  color: white;\n  padding: 12px 30px;\n  border: none;\n  border-radius: 6px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  text-decoration: none;\n  transition: background 0.3s;\n}\n.btn-cancel:hover:not(:disabled) {\n  background: #5a6268;\n}\n.btn-cancel:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=announcement-delete.component.css.map */\n"] }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: AnnouncementsService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AnnouncementDeleteComponent, { className: "AnnouncementDeleteComponent", filePath: "src/app/admin/announcements/announcement-delete/announcement-delete.component.ts", lineNumber: 12 });
})();

// src/app/admin/forms/form-list/form-list.component.ts
var _c03 = () => [];
function FormListComponent_span_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.filteredForms.length, " result", ctx_r0.filteredForms.length !== 1 ? "s" : "", " found ");
  }
}
function FormListComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, " ");
  }
}
function FormListComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "div", 21);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Loading forms...");
    \u0275\u0275elementEnd()();
  }
}
function FormListComponent_div_32_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function FormListComponent_div_32_button_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(1));
    });
    \u0275\u0275text(1, "1");
    \u0275\u0275elementEnd();
  }
}
function FormListComponent_div_32_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function FormListComponent_div_32_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 25);
    \u0275\u0275listener("click", function FormListComponent_div_32_button_8_Template_button_click_0_listener() {
      const page_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(page_r5));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", page_r5 === ctx_r0.currentPage);
    \u0275\u0275property("disabled", page_r5 === ctx_r0.currentPage && ctx_r0.getTotalPages() === 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r5, " ");
  }
}
function FormListComponent_div_32_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function FormListComponent_div_32_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function FormListComponent_div_32_button_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.getTotalPages()));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getTotalPages());
  }
}
function FormListComponent_div_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 23);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 24)(4, "button", 25);
    \u0275\u0275listener("click", function FormListComponent_div_32_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.previousPage());
    });
    \u0275\u0275text(5, "\xAB Previous");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, FormListComponent_div_32_button_6_Template, 2, 0, "button", 26)(7, FormListComponent_div_32_span_7_Template, 2, 0, "span", 27)(8, FormListComponent_div_32_button_8_Template, 2, 4, "button", 28)(9, FormListComponent_div_32_span_9_Template, 2, 0, "span", 27)(10, FormListComponent_div_32_button_10_Template, 2, 1, "button", 26);
    \u0275\u0275elementStart(11, "button", 25);
    \u0275\u0275listener("click", function FormListComponent_div_32_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.nextPage());
    });
    \u0275\u0275text(12, "Next \xBB");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" Showing ", ctx_r0.getPageStart(), "-", ctx_r0.getPageEnd(), " of ", ctx_r0.filteredForms.length, " total ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.getPageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages() - 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage === ctx_r0.getTotalPages());
  }
}
function FormListComponent_div_33_tr_13_p_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No forms match your filters");
    \u0275\u0275elementEnd();
  }
}
function FormListComponent_div_33_tr_13_p_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("No ", ctx_r0.currentLocation.toLowerCase(), " forms found.");
  }
}
function FormListComponent_div_33_tr_13_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 40);
    \u0275\u0275listener("click", function FormListComponent_div_33_tr_13_button_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.addNew());
    });
    \u0275\u0275text(1, " Create Your First Form ");
    \u0275\u0275elementEnd();
  }
}
function FormListComponent_div_33_tr_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 37)(2, "div", 38);
    \u0275\u0275template(3, FormListComponent_div_33_tr_13_p_3_Template, 2, 0, "p", 35)(4, FormListComponent_div_33_tr_13_p_4_Template, 2, 1, "p", 35)(5, FormListComponent_div_33_tr_13_button_5_Template, 2, 0, "button", 39);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r0.searchQuery || ctx_r0.statusFilter !== "all");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.searchQuery && ctx_r0.statusFilter === "all");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.searchQuery && ctx_r0.statusFilter === "all");
  }
}
function FormListComponent_div_33_tr_14_option_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 53);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const idx_r10 = ctx.index;
    const form_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", idx_r10 + 1)("selected", form_r9.display_order === idx_r10 + 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", idx_r10 + 1, " ");
  }
}
function FormListComponent_div_33_tr_14_br_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "br");
  }
}
function FormListComponent_div_33_tr_14_small_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const form_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", form_r9.form_description.length > 100 ? form_r9.form_description.substring(0, 100) + "..." : form_r9.form_description, " ");
  }
}
function FormListComponent_div_33_tr_14_span_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 55);
    \u0275\u0275text(1, "\u2713 Active");
    \u0275\u0275elementEnd();
  }
}
function FormListComponent_div_33_tr_14_span_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 56);
    \u0275\u0275text(1, "Inactive");
    \u0275\u0275elementEnd();
  }
}
function FormListComponent_div_33_tr_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 41)(2, "select", 42);
    \u0275\u0275listener("change", function FormListComponent_div_33_tr_14_Template_select_change_2_listener($event) {
      const form_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.updateDisplayOrder(form_r9, $event.target.value));
    });
    \u0275\u0275template(3, FormListComponent_div_33_tr_14_option_3_Template, 2, 3, "option", 43);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 44)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, FormListComponent_div_33_tr_14_br_7_Template, 1, 0, "br", 35)(8, FormListComponent_div_33_tr_14_small_8_Template, 2, 1, "small", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 46);
    \u0275\u0275template(10, FormListComponent_div_33_tr_14_span_10_Template, 2, 0, "span", 47)(11, FormListComponent_div_33_tr_14_span_11_Template, 2, 0, "span", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td", 49)(13, "button", 50);
    \u0275\u0275listener("click", function FormListComponent_div_33_tr_14_Template_button_click_13_listener() {
      const form_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.edit(form_r9.id));
    });
    \u0275\u0275text(14, " \u270F\uFE0F ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 51);
    \u0275\u0275listener("click", function FormListComponent_div_33_tr_14_Template_button_click_15_listener() {
      const form_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleActive(form_r9));
    });
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 52);
    \u0275\u0275listener("click", function FormListComponent_div_33_tr_14_Template_button_click_17_listener() {
      const form_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.deleteForm(form_r9));
    });
    \u0275\u0275text(18, " \u{1F5D1}\uFE0F ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const form_r9 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", \u0275\u0275pureFunction0(8, _c03).constructor(ctx_r0.forms.length));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(form_r9.form_name);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", form_r9.form_description);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", form_r9.form_description);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", form_r9.is_active);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !form_r9.is_active);
    \u0275\u0275advance(4);
    \u0275\u0275property("title", form_r9.is_active ? "Toggle Active/Inactive" : "Toggle Active/Inactive");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", form_r9.is_active ? "\u{1F441}\uFE0F" : "\u{1F6AB}", " ");
  }
}
function FormListComponent_div_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31)(1, "table", 32)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Order");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Form Details");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 33);
    \u0275\u0275text(9, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 34);
    \u0275\u0275text(11, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "tbody");
    \u0275\u0275template(13, FormListComponent_div_33_tr_13_Template, 6, 3, "tr", 35)(14, FormListComponent_div_33_tr_14_Template, 19, 9, "tr", 36);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(13);
    \u0275\u0275property("ngIf", ctx_r0.filteredForms.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.getPaginatedForms());
  }
}
function FormListComponent_div_34_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function FormListComponent_div_34_button_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(1));
    });
    \u0275\u0275text(1, "1");
    \u0275\u0275elementEnd();
  }
}
function FormListComponent_div_34_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function FormListComponent_div_34_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 25);
    \u0275\u0275listener("click", function FormListComponent_div_34_button_8_Template_button_click_0_listener() {
      const page_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(page_r14));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r14 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", page_r14 === ctx_r0.currentPage);
    \u0275\u0275property("disabled", page_r14 === ctx_r0.currentPage && ctx_r0.getTotalPages() === 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r14, " ");
  }
}
function FormListComponent_div_34_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function FormListComponent_div_34_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function FormListComponent_div_34_button_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.getTotalPages()));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getTotalPages());
  }
}
function FormListComponent_div_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 23);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 24)(4, "button", 25);
    \u0275\u0275listener("click", function FormListComponent_div_34_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.previousPage());
    });
    \u0275\u0275text(5, "\xAB Previous");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, FormListComponent_div_34_button_6_Template, 2, 0, "button", 26)(7, FormListComponent_div_34_span_7_Template, 2, 0, "span", 27)(8, FormListComponent_div_34_button_8_Template, 2, 4, "button", 28)(9, FormListComponent_div_34_span_9_Template, 2, 0, "span", 27)(10, FormListComponent_div_34_button_10_Template, 2, 1, "button", 26);
    \u0275\u0275elementStart(11, "button", 25);
    \u0275\u0275listener("click", function FormListComponent_div_34_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.nextPage());
    });
    \u0275\u0275text(12, "Next \xBB");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" Showing ", ctx_r0.getPageStart(), "-", ctx_r0.getPageEnd(), " of ", ctx_r0.filteredForms.length, " total ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.getPageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages() - 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage === ctx_r0.getTotalPages());
  }
}
var FormListComponent = class _FormListComponent {
  formsService;
  router;
  route;
  forms = [];
  filteredForms = [];
  loading = false;
  error = null;
  searchQuery = "";
  statusFilter = "all";
  currentLocation = "Workshops";
  // Tab counts
  workshopsCount = 0;
  registrationCount = 0;
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  constructor(formsService, router, route) {
    this.formsService = formsService;
    this.router = router;
    this.route = route;
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.currentLocation = params["location"] || "Workshops";
      this.loadForms();
      this.loadTabCounts();
    });
  }
  /**
   * Load all forms for current location from API
   */
  loadForms() {
    this.loading = true;
    this.error = null;
    this.formsService.getAll(this.currentLocation).subscribe({
      next: (data) => {
        this.forms = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || "Failed to load forms";
        this.loading = false;
        console.error("Error loading forms:", err);
      }
    });
  }
  /**
   * Load counts for both tabs
   */
  loadTabCounts() {
    this.formsService.getAll("Workshops").subscribe({
      next: (data) => {
        this.workshopsCount = data.length;
      },
      error: (err) => {
        console.error("Error loading workshops count:", err);
      }
    });
    this.formsService.getAll("Registration").subscribe({
      next: (data) => {
        this.registrationCount = data.length;
      },
      error: (err) => {
        console.error("Error loading registration count:", err);
      }
    });
  }
  /**
   * Switch to a different location tab
   */
  switchTab(location) {
    this.currentLocation = location;
    this.currentPage = 1;
    this.searchQuery = "";
    this.statusFilter = "all";
    this.router.navigate(["/admin/forms"], { queryParams: { location } });
  }
  /**
   * Apply search and status filters
   */
  applyFilters() {
    let filtered = [...this.forms];
    if (this.statusFilter === "active") {
      filtered = filtered.filter((f) => f.is_active);
    } else if (this.statusFilter === "inactive") {
      filtered = filtered.filter((f) => !f.is_active);
    }
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((f) => f.form_name.toLowerCase().includes(query) || f.form_description && f.form_description.toLowerCase().includes(query));
    }
    this.filteredForms = filtered;
  }
  /**
   * Handle search input
   */
  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }
  /**
   * Handle status filter change
   */
  onStatusFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }
  /**
   * Navigate to add page
   */
  addNew() {
    this.router.navigate(["/admin/forms/add"], {
      queryParams: { location: this.currentLocation }
    });
  }
  /**
   * Navigate to edit page
   */
  edit(id) {
    this.router.navigate(["/admin/forms/edit", id], {
      queryParams: { location: this.currentLocation }
    });
  }
  /**
   * Toggle active status
   */
  toggleActive(form) {
    this.formsService.toggleActive(form.id).subscribe({
      next: (updated) => {
        const index = this.forms.findIndex((f) => f.id === form.id);
        if (index !== -1) {
          this.forms[index] = updated;
        }
        const filteredIndex = this.filteredForms.findIndex((f) => f.id === form.id);
        if (filteredIndex !== -1) {
          this.filteredForms[filteredIndex] = updated;
        }
      },
      error: (err) => {
        this.error = "Failed to toggle status";
        console.error("Error toggling status:", err);
      }
    });
  }
  /**
   * Navigate to delete confirmation page
   */
  deleteForm(form) {
    this.router.navigate(["/admin/forms/delete", form.id]);
  }
  /**
   * Update display order
   */
  updateDisplayOrder(form, newOrder) {
    this.formsService.updateOrder(form.id, newOrder, this.currentLocation).subscribe({
      next: () => {
        this.loadForms();
        this.loadTabCounts();
      },
      error: (err) => {
        this.error = "Failed to update order";
        console.error("Error updating order:", err);
      }
    });
  }
  /**
   * Get paginated forms for current page
   */
  getPaginatedForms() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredForms.slice(startIndex, endIndex);
  }
  /**
   * Get total number of pages
   */
  getTotalPages() {
    return Math.max(1, Math.ceil(this.filteredForms.length / this.itemsPerPage));
  }
  /**
   * Get page numbers to display
   */
  getPageNumbers() {
    const totalPages = this.getTotalPages();
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  /**
   * Get start index for current page (for display)
   */
  getPageStart() {
    if (this.filteredForms.length === 0)
      return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  /**
   * Get end index for current page (for display)
   */
  getPageEnd() {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredForms.length);
  }
  /**
   * Go to specific page
   */
  goToPage(page) {
    this.currentPage = page;
  }
  /**
   * Go to previous page
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  /**
   * Go to next page
   */
  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }
  static \u0275fac = function FormListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormListComponent)(\u0275\u0275directiveInject(FormsService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormListComponent, selectors: [["app-form-list"]], standalone: false, decls: 35, vars: 16, consts: [[1, "content-header"], [1, "tabs"], [1, "tab", 3, "click"], [1, "tab-badge"], [1, "section"], [1, "section-header"], [1, "btn", "btn-primary", 3, "click"], [1, "search-container"], ["type", "text", "placeholder", "Search by form name or description...", 1, "search-input", 3, "ngModelChange", "input", "ngModel"], [1, "status-filter", 3, "ngModelChange", "change", "ngModel"], ["value", "all"], ["value", "active"], ["value", "inactive"], ["class", "search-results", 4, "ngIf"], ["class", "alert alert-error", 4, "ngIf"], ["class", "loading-container", 4, "ngIf"], ["class", "pagination-container", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], [1, "search-results"], [1, "alert", "alert-error"], [1, "loading-container"], [1, "spinner"], [1, "pagination-container"], [1, "pagination-info"], [1, "pagination-controls"], [1, "pagination-btn", 3, "click", "disabled"], ["class", "pagination-btn", 3, "click", 4, "ngIf"], ["style", "padding: 0 8px; color: #666;", 4, "ngIf"], ["class", "pagination-btn", 3, "active", "disabled", "click", 4, "ngFor", "ngForOf"], [1, "pagination-btn", 3, "click"], [2, "padding", "0 8px", "color", "#666"], [1, "table-container"], ["id", "forms-table", 1, "data-table"], [1, "col-status"], [1, "actions"], [4, "ngIf"], [4, "ngFor", "ngForOf"], ["colspan", "4", 1, "text-center"], [1, "empty-state"], ["class", "btn btn-primary btn-sm", 3, "click", 4, "ngIf"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], ["data-label", "ORDER", 1, "text-center"], [1, "order-select", 3, "change"], [3, "value", "selected", 4, "ngFor", "ngForOf"], ["data-label", "FORM NAME"], ["class", "text-muted", 4, "ngIf"], ["data-label", "STATUS", 1, "col-status"], ["class", "badge badge-success", 4, "ngIf"], ["class", "badge badge-inactive", 4, "ngIf"], ["data-label", "ACTIONS", 1, "actions"], ["title", "Edit", 1, "btn", "btn-sm", "btn-edit", 3, "click"], [1, "btn", "btn-sm", "btn-toggle", 3, "click", "title"], ["title", "Delete", 1, "btn", "btn-sm", "btn-delete", 3, "click"], [3, "value", "selected"], [1, "text-muted"], [1, "badge", "badge-success"], [1, "badge", "badge-inactive"]], template: function FormListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Forms Management");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4, "Manage Google Forms for workshops and registration");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 1)(6, "button", 2);
      \u0275\u0275listener("click", function FormListComponent_Template_button_click_6_listener() {
        return ctx.switchTab("Workshops");
      });
      \u0275\u0275text(7, " \u{1F4DD} Workshops ");
      \u0275\u0275elementStart(8, "span", 3);
      \u0275\u0275text(9);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "button", 2);
      \u0275\u0275listener("click", function FormListComponent_Template_button_click_10_listener() {
        return ctx.switchTab("Registration");
      });
      \u0275\u0275text(11, " \u{1F465} Registration ");
      \u0275\u0275elementStart(12, "span", 3);
      \u0275\u0275text(13);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(14, "div", 4)(15, "div", 5)(16, "h2");
      \u0275\u0275text(17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "button", 6);
      \u0275\u0275listener("click", function FormListComponent_Template_button_click_18_listener() {
        return ctx.addNew();
      });
      \u0275\u0275text(19, " + Add New Form ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 7)(21, "input", 8);
      \u0275\u0275twoWayListener("ngModelChange", function FormListComponent_Template_input_ngModelChange_21_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
        return $event;
      });
      \u0275\u0275listener("input", function FormListComponent_Template_input_input_21_listener() {
        return ctx.onSearch();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "select", 9);
      \u0275\u0275twoWayListener("ngModelChange", function FormListComponent_Template_select_ngModelChange_22_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.statusFilter, $event) || (ctx.statusFilter = $event);
        return $event;
      });
      \u0275\u0275listener("change", function FormListComponent_Template_select_change_22_listener() {
        return ctx.onStatusFilterChange();
      });
      \u0275\u0275elementStart(23, "option", 10);
      \u0275\u0275text(24, "All Statuses");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "option", 11);
      \u0275\u0275text(26, "Active");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "option", 12);
      \u0275\u0275text(28, "Inactive");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(29, FormListComponent_span_29_Template, 2, 2, "span", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275template(30, FormListComponent_div_30_Template, 2, 1, "div", 14)(31, FormListComponent_div_31_Template, 4, 0, "div", 15)(32, FormListComponent_div_32_Template, 13, 10, "div", 16)(33, FormListComponent_div_33_Template, 15, 2, "div", 17)(34, FormListComponent_div_34_Template, 13, 10, "div", 16);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275classProp("active", ctx.currentLocation === "Workshops");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.workshopsCount);
      \u0275\u0275advance();
      \u0275\u0275classProp("active", ctx.currentLocation === "Registration");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.registrationCount);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate2("", ctx.currentLocation, " Forms (", ctx.forms.length, ")");
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("ngModel", ctx.statusFilter);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ctx.searchQuery || ctx.statusFilter !== "all");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.filteredForms.length > 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.filteredForms.length > 0);
    }
  }, dependencies: [NgForOf, NgIf, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel], styles: ["\n\n.tabs[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 30px;\n  border-bottom: 2px solid #e0e0e0;\n}\n.tab[_ngcontent-%COMP%] {\n  padding: 12px 24px;\n  background: none;\n  border: none;\n  border-bottom: 3px solid transparent;\n  cursor: pointer;\n  font-size: 16px;\n  font-weight: 500;\n  color: #666;\n  transition: all 0.3s;\n  text-decoration: none;\n  display: inline-block;\n}\n.tab[_ngcontent-%COMP%]:hover {\n  color: #4a90e2;\n  background: rgba(74, 144, 226, 0.05);\n}\n.tab.active[_ngcontent-%COMP%] {\n  color: #4a90e2;\n  border-bottom-color: #4a90e2;\n  font-weight: 600;\n}\n.tab-badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  background: #e0e0e0;\n  color: #666;\n  padding: 2px 8px;\n  border-radius: 12px;\n  font-size: 12px;\n  margin-left: 6px;\n  font-weight: 600;\n}\n.tab.active[_ngcontent-%COMP%]   .tab-badge[_ngcontent-%COMP%] {\n  background: #4a90e2;\n  color: white;\n}\n.search-container[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  display: flex;\n  gap: 15px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.search-input[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 250px;\n  max-width: 400px;\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.search-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.status-filter[_ngcontent-%COMP%] {\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  background: #ffffff;\n  color: #333;\n  font-size: 0.95rem;\n  cursor: pointer;\n  min-width: 150px;\n}\n.status-filter[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.search-results[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 20px;\n  padding: 20px 0;\n  border-top: 1px solid #e0e0e0;\n}\n.pagination-info[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-controls[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n}\n.pagination-btn[_ngcontent-%COMP%] {\n  padding: 8px 12px;\n  border: 1px solid #ddd;\n  background: #ffffff;\n  color: #333;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n}\n.pagination-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #f5f5f5;\n  border-color: #4a90e2;\n}\n.pagination-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination-btn.active[_ngcontent-%COMP%] {\n  background: #4a90e2;\n  color: #ffffff;\n  border-color: #4a90e2;\n}\n.order-select[_ngcontent-%COMP%] {\n  padding: 5px 8px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  font-size: 14px;\n  cursor: pointer;\n}\n.order-select[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n}\n/*# sourceMappingURL=form-list.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormListComponent, [{
    type: Component,
    args: [{ selector: "app-form-list", standalone: false, template: `<!-- Content Header -->\r
<div class="content-header">\r
  <h1>Forms Management</h1>\r
  <p>Manage Google Forms for workshops and registration</p>\r
</div>\r
\r
<!-- Tabs Navigation -->\r
<div class="tabs">\r
  <button\r
    class="tab"\r
    [class.active]="currentLocation === 'Workshops'"\r
    (click)="switchTab('Workshops')"\r
  >\r
    \u{1F4DD} Workshops\r
    <span class="tab-badge">{{ workshopsCount }}</span>\r
  </button>\r
  <button\r
    class="tab"\r
    [class.active]="currentLocation === 'Registration'"\r
    (click)="switchTab('Registration')"\r
  >\r
    \u{1F465} Registration\r
    <span class="tab-badge">{{ registrationCount }}</span>\r
  </button>\r
</div>\r
\r
<div class="section">\r
  <!-- Section Header with Add Button -->\r
  <div class="section-header">\r
    <h2>{{ currentLocation }} Forms ({{ forms.length }})</h2>\r
    <button class="btn btn-primary" (click)="addNew()">\r
      + Add New Form\r
    </button>\r
  </div>\r
\r
  <!-- Search and Filter -->\r
  <div class="search-container">\r
    <input\r
      type="text"\r
      class="search-input"\r
      placeholder="Search by form name or description..."\r
      [(ngModel)]="searchQuery"\r
      (input)="onSearch()"\r
    />\r
\r
    <select class="status-filter" [(ngModel)]="statusFilter" (change)="onStatusFilterChange()">\r
      <option value="all">All Statuses</option>\r
      <option value="active">Active</option>\r
      <option value="inactive">Inactive</option>\r
    </select>\r
\r
    <span class="search-results" *ngIf="searchQuery || statusFilter !== 'all'">\r
      {{ filteredForms.length }} result{{ filteredForms.length !== 1 ? 's' : '' }} found\r
    </span>\r
  </div>\r
\r
  <!-- Error Message -->\r
  <div class="alert alert-error" *ngIf="error">\r
    {{ error }}\r
  </div>\r
\r
  <!-- Loading State -->\r
  <div class="loading-container" *ngIf="loading">\r
    <div class="spinner"></div>\r
    <p>Loading forms...</p>\r
  </div>\r
\r
  <!-- Pagination Info (Top) -->\r
  <div class="pagination-container" *ngIf="!loading && filteredForms.length > 0">\r
    <div class="pagination-info">\r
      Showing {{ getPageStart() }}-{{ getPageEnd() }} of {{ filteredForms.length }} total\r
    </div>\r
    <div class="pagination-controls">\r
      <button class="pagination-btn" (click)="previousPage()" [disabled]="currentPage === 1">\xAB Previous</button>\r
\r
      <button class="pagination-btn" (click)="goToPage(1)" *ngIf="getPageNumbers()[0] > 1">1</button>\r
      <span *ngIf="getPageNumbers()[0] > 2" style="padding: 0 8px; color: #666;">...</span>\r
\r
      <button\r
        *ngFor="let page of getPageNumbers()"\r
        class="pagination-btn"\r
        [class.active]="page === currentPage"\r
        [disabled]="page === currentPage && getTotalPages() === 1"\r
        (click)="goToPage(page)">\r
        {{ page }}\r
      </button>\r
\r
      <span *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1" style="padding: 0 8px; color: #666;">...</span>\r
      <button class="pagination-btn" (click)="goToPage(getTotalPages())" *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages()">{{ getTotalPages() }}</button>\r
\r
      <button class="pagination-btn" (click)="nextPage()" [disabled]="currentPage === getTotalPages()">Next \xBB</button>\r
    </div>\r
  </div>\r
\r
  <!-- Forms Table -->\r
  <div class="table-container" *ngIf="!loading">\r
    <table class="data-table" id="forms-table">\r
      <thead>\r
        <tr>\r
          <th>Order</th>\r
          <th>Form Details</th>\r
          <th class="col-status">Status</th>\r
          <th class="actions">Actions</th>\r
        </tr>\r
      </thead>\r
      <tbody>\r
        <!-- Empty State -->\r
        <tr *ngIf="filteredForms.length === 0">\r
          <td colspan="4" class="text-center">\r
            <div class="empty-state">\r
              <p *ngIf="searchQuery || statusFilter !== 'all'">No forms match your filters</p>\r
              <p *ngIf="!searchQuery && statusFilter === 'all'">No {{ currentLocation.toLowerCase() }} forms found.</p>\r
              <button class="btn btn-primary btn-sm" (click)="addNew()" *ngIf="!searchQuery && statusFilter === 'all'">\r
                Create Your First Form\r
              </button>\r
            </div>\r
          </td>\r
        </tr>\r
\r
        <!-- Data Rows -->\r
        <tr *ngFor="let form of getPaginatedForms()">\r
          <!-- Display Order Dropdown -->\r
          <td data-label="ORDER" class="text-center">\r
            <select\r
              class="order-select"\r
              (change)="updateDisplayOrder(form, $any($event.target).value)"\r
            >\r
              <option\r
                *ngFor="let i of [].constructor(forms.length); let idx = index"\r
                [value]="idx + 1"\r
                [selected]="form.display_order === (idx + 1)">\r
                {{ idx + 1 }}\r
              </option>\r
            </select>\r
          </td>\r
\r
          <!-- Form Name and Description -->\r
          <td data-label="FORM NAME">\r
            <strong>{{ form.form_name }}</strong>\r
            <br *ngIf="form.form_description">\r
            <small class="text-muted" *ngIf="form.form_description">\r
              {{ form.form_description.length > 100 ? form.form_description.substring(0, 100) + '...' : form.form_description }}\r
            </small>\r
          </td>\r
\r
          <!-- Status Badge -->\r
          <td data-label="STATUS" class="col-status">\r
            <span class="badge badge-success" *ngIf="form.is_active">\u2713 Active</span>\r
            <span class="badge badge-inactive" *ngIf="!form.is_active">Inactive</span>\r
          </td>\r
\r
          <!-- Actions -->\r
          <td data-label="ACTIONS" class="actions">\r
            <button\r
              class="btn btn-sm btn-edit"\r
              (click)="edit(form.id)"\r
              title="Edit"\r
            >\r
              \u270F\uFE0F\r
            </button>\r
\r
            <button\r
              class="btn btn-sm btn-toggle"\r
              (click)="toggleActive(form)"\r
              [title]="form.is_active ? 'Toggle Active/Inactive' : 'Toggle Active/Inactive'"\r
            >\r
              {{ form.is_active ? '\u{1F441}\uFE0F' : '\u{1F6AB}' }}\r
            </button>\r
\r
            <button\r
              class="btn btn-sm btn-delete"\r
              (click)="deleteForm(form)"\r
              title="Delete"\r
            >\r
              \u{1F5D1}\uFE0F\r
            </button>\r
          </td>\r
        </tr>\r
      </tbody>\r
    </table>\r
  </div>\r
\r
  <!-- Pagination (Bottom) -->\r
  <div class="pagination-container" *ngIf="!loading && filteredForms.length > 0">\r
    <div class="pagination-info">\r
      Showing {{ getPageStart() }}-{{ getPageEnd() }} of {{ filteredForms.length }} total\r
    </div>\r
    <div class="pagination-controls">\r
      <button class="pagination-btn" (click)="previousPage()" [disabled]="currentPage === 1">\xAB Previous</button>\r
\r
      <button class="pagination-btn" (click)="goToPage(1)" *ngIf="getPageNumbers()[0] > 1">1</button>\r
      <span *ngIf="getPageNumbers()[0] > 2" style="padding: 0 8px; color: #666;">...</span>\r
\r
      <button\r
        *ngFor="let page of getPageNumbers()"\r
        class="pagination-btn"\r
        [class.active]="page === currentPage"\r
        [disabled]="page === currentPage && getTotalPages() === 1"\r
        (click)="goToPage(page)">\r
        {{ page }}\r
      </button>\r
\r
      <span *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1" style="padding: 0 8px; color: #666;">...</span>\r
      <button class="pagination-btn" (click)="goToPage(getTotalPages())" *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages()">{{ getTotalPages() }}</button>\r
\r
      <button class="pagination-btn" (click)="nextPage()" [disabled]="currentPage === getTotalPages()">Next \xBB</button>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/admin/forms/form-list/form-list.component.css */\n.tabs {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 30px;\n  border-bottom: 2px solid #e0e0e0;\n}\n.tab {\n  padding: 12px 24px;\n  background: none;\n  border: none;\n  border-bottom: 3px solid transparent;\n  cursor: pointer;\n  font-size: 16px;\n  font-weight: 500;\n  color: #666;\n  transition: all 0.3s;\n  text-decoration: none;\n  display: inline-block;\n}\n.tab:hover {\n  color: #4a90e2;\n  background: rgba(74, 144, 226, 0.05);\n}\n.tab.active {\n  color: #4a90e2;\n  border-bottom-color: #4a90e2;\n  font-weight: 600;\n}\n.tab-badge {\n  display: inline-block;\n  background: #e0e0e0;\n  color: #666;\n  padding: 2px 8px;\n  border-radius: 12px;\n  font-size: 12px;\n  margin-left: 6px;\n  font-weight: 600;\n}\n.tab.active .tab-badge {\n  background: #4a90e2;\n  color: white;\n}\n.search-container {\n  margin-bottom: 20px;\n  display: flex;\n  gap: 15px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.search-input {\n  flex: 1;\n  min-width: 250px;\n  max-width: 400px;\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.search-input:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.status-filter {\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  background: #ffffff;\n  color: #333;\n  font-size: 0.95rem;\n  cursor: pointer;\n  min-width: 150px;\n}\n.status-filter:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.search-results {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 20px;\n  padding: 20px 0;\n  border-top: 1px solid #e0e0e0;\n}\n.pagination-info {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-controls {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n}\n.pagination-btn {\n  padding: 8px 12px;\n  border: 1px solid #ddd;\n  background: #ffffff;\n  color: #333;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n}\n.pagination-btn:hover:not(:disabled) {\n  background: #f5f5f5;\n  border-color: #4a90e2;\n}\n.pagination-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination-btn.active {\n  background: #4a90e2;\n  color: #ffffff;\n  border-color: #4a90e2;\n}\n.order-select {\n  padding: 5px 8px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  font-size: 14px;\n  cursor: pointer;\n}\n.order-select:focus {\n  outline: none;\n  border-color: #4a90e2;\n}\n/*# sourceMappingURL=form-list.component.css.map */\n"] }]
  }], () => [{ type: FormsService }, { type: Router }, { type: ActivatedRoute }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormListComponent, { className: "FormListComponent", filePath: "src/app/admin/forms/form-list/form-list.component.ts", lineNumber: 12 });
})();

// src/app/admin/forms/form-form/form-form.component.ts
function FormFormComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, "\n");
  }
}
function FormFormComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "div", 9);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Loading form...");
    \u0275\u0275elementEnd()();
  }
}
function FormFormComponent_form_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 10);
    \u0275\u0275listener("ngSubmit", function FormFormComponent_form_10_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmit());
    });
    \u0275\u0275elementStart(1, "div", 11)(2, "label", 12);
    \u0275\u0275text(3, "Form Name ");
    \u0275\u0275elementStart(4, "span", 13);
    \u0275\u0275text(5, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "input", 14);
    \u0275\u0275twoWayListener("ngModelChange", function FormFormComponent_form_10_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.form_name, $event) || (ctx_r0.formData.form_name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "small", 15);
    \u0275\u0275text(8, "This name will be displayed on the website");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 11)(10, "label", 16);
    \u0275\u0275text(11, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "textarea", 17);
    \u0275\u0275twoWayListener("ngModelChange", function FormFormComponent_form_10_Template_textarea_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.form_description, $event) || (ctx_r0.formData.form_description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "small", 15);
    \u0275\u0275text(14, "Optional description shown below the form name");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 11)(16, "label", 18);
    \u0275\u0275text(17, "Google Form Embed Code ");
    \u0275\u0275elementStart(18, "span", 13);
    \u0275\u0275text(19, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "textarea", 19);
    \u0275\u0275twoWayListener("ngModelChange", function FormFormComponent_form_10_Template_textarea_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.embed_code, $event) || (ctx_r0.formData.embed_code = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "small", 15);
    \u0275\u0275text(22, "Paste the complete iframe embed code from Google Forms");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 11)(24, "label", 20);
    \u0275\u0275text(25, "Page Location ");
    \u0275\u0275elementStart(26, "span", 13);
    \u0275\u0275text(27, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "select", 21);
    \u0275\u0275twoWayListener("ngModelChange", function FormFormComponent_form_10_Template_select_ngModelChange_28_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.page_location, $event) || (ctx_r0.formData.page_location = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(29, "option", 22);
    \u0275\u0275text(30, "Workshops");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "option", 23);
    \u0275\u0275text(32, "Registration");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "small", 15);
    \u0275\u0275text(34, "Where should this form appear on the website?");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 11)(36, "label", 24)(37, "input", 25);
    \u0275\u0275twoWayListener("ngModelChange", function FormFormComponent_form_10_Template_input_ngModelChange_37_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.is_active, $event) || (ctx_r0.formData.is_active = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "span");
    \u0275\u0275text(39, "Active (visible on website)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(40, "div", 26)(41, "button", 27);
    \u0275\u0275text(42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "button", 28);
    \u0275\u0275listener("click", function FormFormComponent_form_10_Template_button_click_43_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cancel());
    });
    \u0275\u0275text(44, " Cancel ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.form_name);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.form_description);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.embed_code);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.page_location);
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.is_active);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.loading ? "Saving..." : ctx_r0.isEditMode ? "Update Form" : "Create Form", " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.loading);
  }
}
var FormFormComponent = class _FormFormComponent {
  route;
  router;
  formsService;
  isEditMode = false;
  formId = null;
  loading = false;
  error = null;
  currentLocation = "Workshops";
  // Form data
  formData = {
    form_name: "",
    form_description: null,
    embed_code: "",
    page_location: "Workshops",
    is_active: false
    // Default to inactive - must be manually activated
  };
  constructor(route, router, formsService) {
    this.route = route;
    this.router = router;
    this.formsService = formsService;
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.currentLocation = params["location"] || "Workshops";
      this.formData.page_location = this.currentLocation;
    });
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.formId = +params["id"];
        this.loadForm();
      }
    });
  }
  /**
   * Load form for editing
   */
  loadForm() {
    if (!this.formId)
      return;
    this.loading = true;
    this.error = null;
    this.formsService.getById(this.formId).subscribe({
      next: (data) => {
        this.formData = {
          form_name: data.form_name,
          form_description: data.form_description,
          embed_code: data.embed_code,
          page_location: data.page_location,
          is_active: data.is_active
        };
        this.currentLocation = data.page_location;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load form";
        this.loading = false;
        console.error("Error loading form:", err);
      }
    });
  }
  /**
   * Submit form (create or update)
   */
  onSubmit() {
    if (!this.formData.form_name.trim()) {
      this.error = "Form Name is required";
      return;
    }
    if (!this.formData.embed_code.trim()) {
      this.error = "Google Form Embed Code is required";
      return;
    }
    if (!this.formData.page_location) {
      this.error = "Page Location is required";
      return;
    }
    this.loading = true;
    this.error = null;
    const operation = this.isEditMode && this.formId ? this.formsService.update(this.formId, this.formData) : this.formsService.create(this.formData);
    operation.subscribe({
      next: () => {
        this.router.navigate(["/admin/forms"], {
          queryParams: { location: this.formData.page_location }
        });
      },
      error: (err) => {
        this.error = err.message || "Failed to save form";
        this.loading = false;
        console.error("Error saving form:", err);
      }
    });
  }
  /**
   * Cancel and return to list
   */
  cancel() {
    this.router.navigate(["/admin/forms"], {
      queryParams: { location: this.currentLocation }
    });
  }
  static \u0275fac = function FormFormComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormFormComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(FormsService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormFormComponent, selectors: [["app-form-form"]], standalone: false, decls: 11, vars: 5, consts: [[1, "content-header"], [1, "section-subtitle"], [1, "action-bar"], [1, "btn", "btn-secondary", 3, "click"], ["class", "alert alert-error", 4, "ngIf"], ["class", "loading-container", 4, "ngIf"], ["class", "admin-form", 3, "ngSubmit", 4, "ngIf"], [1, "alert", "alert-error"], [1, "loading-container"], [1, "spinner"], [1, "admin-form", 3, "ngSubmit"], [1, "form-group"], ["for", "form_name"], [1, "required"], ["type", "text", "id", "form_name", "name", "form_name", "placeholder", "e.g., Workshop Application", "maxlength", "255", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-help"], ["for", "form_description"], ["id", "form_description", "name", "form_description", "placeholder", "Brief description of this form", "rows", "3", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "embed_code"], ["id", "embed_code", "name", "embed_code", "placeholder", '<iframe src="https://docs.google.com/forms/d/e/..." width="640" height="800" frameborder="0"></iframe>', "rows", "5", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "page_location"], ["id", "page_location", "name", "page_location", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["value", "Workshops"], ["value", "Registration"], [1, "checkbox-label"], ["type", "checkbox", "name", "is_active", 3, "ngModelChange", "ngModel"], [1, "form-actions"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 1, "btn", "btn-secondary", 3, "click", "disabled"]], template: function FormFormComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 1);
      \u0275\u0275text(4);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
      \u0275\u0275listener("click", function FormFormComponent_Template_button_click_6_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(7, " \u2190 Back to Forms ");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(8, FormFormComponent_div_8_Template, 2, 1, "div", 4)(9, FormFormComponent_div_9_Template, 4, 0, "div", 5)(10, FormFormComponent_form_10_Template, 45, 8, "form", 6);
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.isEditMode ? "Edit Form" : "Add New Form");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.isEditMode ? "Update form details" : "Create a new Google Form for " + ctx.currentLocation.toLowerCase());
      \u0275\u0275advance(4);
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading && !ctx.formData.form_name);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading || ctx.formData.form_name);
    }
  }, dependencies: [NgIf, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, NgModel, NgForm], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormFormComponent, [{
    type: Component,
    args: [{ selector: "app-form-form", standalone: false, template: `<!-- Content Header -->\r
<div class="content-header">\r
  <h1>{{ isEditMode ? 'Edit Form' : 'Add New Form' }}</h1>\r
  <p class="section-subtitle">{{ isEditMode ? 'Update form details' : 'Create a new Google Form for ' + currentLocation.toLowerCase() }}</p>\r
</div>\r
\r
<!-- Back Button -->\r
<div class="action-bar">\r
  <button class="btn btn-secondary" (click)="cancel()">\r
    \u2190 Back to Forms\r
  </button>\r
</div>\r
\r
<!-- Error Message -->\r
<div class="alert alert-error" *ngIf="error">\r
  {{ error }}\r
</div>\r
\r
<!-- Loading State -->\r
<div class="loading-container" *ngIf="loading && !formData.form_name">\r
  <div class="spinner"></div>\r
  <p>Loading form...</p>\r
</div>\r
\r
<!-- Form -->\r
<form class="admin-form" (ngSubmit)="onSubmit()" *ngIf="!loading || formData.form_name">\r
  <!-- Form Name -->\r
  <div class="form-group">\r
    <label for="form_name">Form Name <span class="required">*</span></label>\r
    <input\r
      type="text"\r
      id="form_name"\r
      name="form_name"\r
      class="form-control"\r
      [(ngModel)]="formData.form_name"\r
      placeholder="e.g., Workshop Application"\r
      maxlength="255"\r
      required\r
    />\r
    <small class="form-help">This name will be displayed on the website</small>\r
  </div>\r
\r
  <!-- Form Description -->\r
  <div class="form-group">\r
    <label for="form_description">Description</label>\r
    <textarea\r
      id="form_description"\r
      name="form_description"\r
      class="form-control"\r
      [(ngModel)]="formData.form_description"\r
      placeholder="Brief description of this form"\r
      rows="3"\r
    ></textarea>\r
    <small class="form-help">Optional description shown below the form name</small>\r
  </div>\r
\r
  <!-- Google Form Embed Code -->\r
  <div class="form-group">\r
    <label for="embed_code">Google Form Embed Code <span class="required">*</span></label>\r
    <textarea\r
      id="embed_code"\r
      name="embed_code"\r
      class="form-control"\r
      [(ngModel)]="formData.embed_code"\r
      placeholder='<iframe src="https://docs.google.com/forms/d/e/..." width="640" height="800" frameborder="0"></iframe>'\r
      rows="5"\r
      required\r
    ></textarea>\r
    <small class="form-help">Paste the complete iframe embed code from Google Forms</small>\r
  </div>\r
\r
  <!-- Page Location -->\r
  <div class="form-group">\r
    <label for="page_location">Page Location <span class="required">*</span></label>\r
    <select\r
      id="page_location"\r
      name="page_location"\r
      class="form-control"\r
      [(ngModel)]="formData.page_location"\r
      required\r
    >\r
      <option value="Workshops">Workshops</option>\r
      <option value="Registration">Registration</option>\r
    </select>\r
    <small class="form-help">Where should this form appear on the website?</small>\r
  </div>\r
\r
  <!-- Is Active Checkbox -->\r
  <div class="form-group">\r
    <label class="checkbox-label">\r
      <input\r
        type="checkbox"\r
        name="is_active"\r
        [(ngModel)]="formData.is_active"\r
      />\r
      <span>Active (visible on website)</span>\r
    </label>\r
  </div>\r
\r
  <!-- Form Actions -->\r
  <div class="form-actions">\r
    <button\r
      type="submit"\r
      class="btn btn-primary"\r
      [disabled]="loading"\r
    >\r
      {{ loading ? 'Saving...' : (isEditMode ? 'Update Form' : 'Create Form') }}\r
    </button>\r
\r
    <button\r
      type="button"\r
      class="btn btn-secondary"\r
      (click)="cancel()"\r
      [disabled]="loading"\r
    >\r
      Cancel\r
    </button>\r
  </div>\r
</form>\r
` }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: FormsService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormFormComponent, { className: "FormFormComponent", filePath: "src/app/admin/forms/form-form/form-form.component.ts", lineNumber: 12 });
})();

// src/app/admin/forms/form-delete/form-delete.ts
var _c04 = (a0) => ["/admin/forms/edit", a0];
function FormDeleteComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1, "Loading...");
    \u0275\u0275elementEnd();
  }
}
function FormDeleteComponent_div_10_a_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 13);
    \u0275\u0275text(1, "Edit Form Instead");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c04, ctx_r0.formId));
  }
}
function FormDeleteComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "div", 10)(3, "a", 11);
    \u0275\u0275text(4, "\u2190 Back to Forms");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, FormDeleteComponent_div_10_a_5_Template, 2, 3, "a", 12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.form);
  }
}
function FormDeleteComponent_div_11_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "span", 23);
    \u0275\u0275text(2, "Description:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 24);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.form.form_description.length > 100 ? ctx_r0.form.form_description.substring(0, 100) + "..." : ctx_r0.form.form_description);
  }
}
function FormDeleteComponent_div_11_span_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 33);
    \u0275\u0275text(1, "\u2713 Active");
    \u0275\u0275elementEnd();
  }
}
function FormDeleteComponent_div_11_span_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1, "Inactive");
    \u0275\u0275elementEnd();
  }
}
function FormDeleteComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 15)(2, "div", 16)(3, "div", 17);
    \u0275\u0275text(4, "\u26A0\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div")(6, "h3", 18);
    \u0275\u0275text(7, "Warning: Permanent Deletion");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 19);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(10, "div", 20)(11, "h3", 21);
    \u0275\u0275text(12, "Form Details:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 22)(14, "span", 23);
    \u0275\u0275text(15, "Form Name:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 24);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(18, FormDeleteComponent_div_11_div_18_Template, 5, 1, "div", 25);
    \u0275\u0275elementStart(19, "div", 22)(20, "span", 23);
    \u0275\u0275text(21, "Page Location:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 24);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 22)(25, "span", 23);
    \u0275\u0275text(26, "Status:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span", 24);
    \u0275\u0275template(28, FormDeleteComponent_div_11_span_28_Template, 2, 0, "span", 26)(29, FormDeleteComponent_div_11_span_29_Template, 2, 0, "span", 27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 28)(31, "div", 29)(32, "p", 30);
    \u0275\u0275text(33, " Are you absolutely sure you want to delete this form? ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "div", 31)(35, "button", 32);
    \u0275\u0275listener("click", function FormDeleteComponent_div_11_Template_button_click_35_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.confirmDelete());
    });
    \u0275\u0275text(36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "button", 3);
    \u0275\u0275listener("click", function FormDeleteComponent_div_11_Template_button_click_37_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cancel());
    });
    \u0275\u0275text(38, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "a", 13);
    \u0275\u0275text(40, "Edit Instead");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1(" You are about to permanently delete this form. This action cannot be undone. The form will be removed from the ", ctx_r0.form.page_location, " page immediately. ");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.form.form_name);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.form.form_description);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.form.page_location);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r0.form.is_active);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.form.is_active);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u{1F5D1}\uFE0F ", ctx_r0.loading ? "Deleting..." : "Yes, Delete Form", " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(9, _c04, ctx_r0.formId));
  }
}
var FormDeleteComponent = class _FormDeleteComponent {
  route;
  router;
  formsService;
  form = null;
  loading = false;
  error = null;
  formId = null;
  constructor(route, router, formsService) {
    this.route = route;
    this.router = router;
    this.formsService = formsService;
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.formId = +params["id"];
        this.loadForm();
      } else {
        this.error = "No form ID provided";
      }
    });
  }
  /**
   * Load form details for confirmation display
   */
  loadForm() {
    if (!this.formId)
      return;
    this.loading = true;
    this.error = null;
    this.formsService.getById(this.formId).subscribe({
      next: (data) => {
        this.form = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load form";
        this.loading = false;
        console.error("Error loading form:", err);
      }
    });
  }
  /**
   * Confirm and delete the form
   */
  confirmDelete() {
    if (!this.formId || !this.form)
      return;
    this.loading = true;
    this.error = null;
    this.formsService.delete(this.formId).subscribe({
      next: () => {
        this.router.navigate(["/admin/forms"], {
          queryParams: { location: this.form.page_location }
        });
      },
      error: (err) => {
        this.error = "Failed to delete form";
        this.loading = false;
        console.error("Error deleting form:", err);
      }
    });
  }
  /**
   * Cancel and return to list
   */
  cancel() {
    if (this.form) {
      this.router.navigate(["/admin/forms"], {
        queryParams: { location: this.form.page_location }
      });
    } else {
      this.router.navigate(["/admin/forms"]);
    }
  }
  static \u0275fac = function FormDeleteComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormDeleteComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(FormsService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormDeleteComponent, selectors: [["app-form-delete"]], standalone: false, decls: 12, vars: 3, consts: [[1, "content-header"], [1, "section-subtitle"], [1, "action-bar"], [1, "btn", "btn-secondary", 3, "click"], [1, "section"], ["class", "loading-container", 4, "ngIf"], ["class", "alert alert-error", 4, "ngIf"], ["style", "max-width: 700px;", 4, "ngIf"], [1, "loading-container"], [1, "alert", "alert-error"], [2, "margin-top", "20px"], ["routerLink", "/admin/forms", 1, "btn", "btn-secondary"], ["class", "btn btn-primary", 3, "routerLink", 4, "ngIf"], [1, "btn", "btn-primary", 3, "routerLink"], [2, "max-width", "700px"], [2, "background", "#fff3cd", "border-left", "4px solid #ffc107", "padding", "20px", "border-radius", "8px", "margin-bottom", "30px"], [2, "display", "flex", "align-items", "flex-start", "gap", "15px"], [2, "font-size", "2rem"], [2, "margin", "0 0 10px 0", "color", "#856404"], [2, "margin", "0", "color", "#856404", "line-height", "1.6"], [1, "admin-form"], [2, "margin-bottom", "20px", "color", "#2d3561"], [1, "info-row"], [1, "info-label"], [1, "info-value"], ["class", "info-row", 4, "ngIf"], ["class", "badge badge-success", 4, "ngIf"], ["class", "badge badge-inactive", 4, "ngIf"], [2, "margin-top", "30px", "padding-top", "20px", "border-top", "1px solid #e0e0e0"], [2, "background", "#ffebee", "padding", "15px", "border-radius", "8px", "margin-bottom", "20px"], [2, "margin", "0", "color", "#c62828", "font-weight", "600"], [1, "form-actions", 2, "margin", "0", "padding", "0", "border", "none"], [1, "btn", "btn-danger", 3, "click", "disabled"], [1, "badge", "badge-success"], [1, "badge", "badge-inactive"]], template: function FormDeleteComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Delete Form");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 1);
      \u0275\u0275text(4, "Permanently remove form from the website");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
      \u0275\u0275listener("click", function FormDeleteComponent_Template_button_click_6_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(7, " \u2190 Back to Forms ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 4);
      \u0275\u0275template(9, FormDeleteComponent_div_9_Template, 2, 0, "div", 5)(10, FormDeleteComponent_div_10_Template, 6, 2, "div", 6)(11, FormDeleteComponent_div_11_Template, 41, 11, "div", 7);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.form && !ctx.error);
    }
  }, dependencies: [NgIf, RouterLink], styles: ["\n\n.delete-confirmation[_ngcontent-%COMP%] {\n  max-width: 600px;\n  margin: 60px auto;\n  background: white;\n  border-radius: 12px;\n  padding: 40px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n}\n.delete-icon[_ngcontent-%COMP%] {\n  width: 80px;\n  height: 80px;\n  background: #fff3cd;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 40px;\n  margin: 0 auto 30px;\n}\n.delete-confirmation[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #2c3e50;\n  margin-bottom: 20px;\n  font-size: 28px;\n}\n.delete-confirmation[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #666;\n  margin-bottom: 30px;\n  font-size: 16px;\n}\n.form-details[_ngcontent-%COMP%] {\n  background: #f8f9fa;\n  border-left: 4px solid #dc3545;\n  padding: 20px;\n  margin: 30px 0;\n  border-radius: 4px;\n}\n.form-details[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 10px 0;\n  color: #2c3e50;\n  font-size: 18px;\n}\n.form-details[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 5px 0;\n  color: #666;\n  text-align: left;\n  font-size: 14px;\n}\n.form-details[_ngcontent-%COMP%]   .meta[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 20px;\n  margin-top: 10px;\n  flex-wrap: wrap;\n}\n.warning-note[_ngcontent-%COMP%] {\n  background: #fff3cd;\n  border: 1px solid #ffc107;\n  border-radius: 6px;\n  padding: 15px;\n  margin: 20px 0;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.warning-note[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #856404;\n}\n.warning-note[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #856404;\n  text-align: left;\n}\n.delete-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 15px;\n  justify-content: center;\n  margin-top: 30px;\n}\n.btn-confirm-delete[_ngcontent-%COMP%] {\n  background: #dc3545;\n  color: white;\n  padding: 12px 30px;\n  border: none;\n  border-radius: 6px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  text-decoration: none;\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  transition: background 0.3s;\n}\n.btn-confirm-delete[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #c82333;\n}\n.btn-confirm-delete[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-cancel[_ngcontent-%COMP%] {\n  background: #6c757d;\n  color: white;\n  padding: 12px 30px;\n  border: none;\n  border-radius: 6px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  text-decoration: none;\n  transition: background 0.3s;\n}\n.btn-cancel[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #5a6268;\n}\n.btn-cancel[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=form-delete.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormDeleteComponent, [{
    type: Component,
    args: [{ selector: "app-form-delete", standalone: false, template: `<div class="content-header">\r
  <h1>Delete Form</h1>\r
  <p class="section-subtitle">Permanently remove form from the website</p>\r
</div>\r
\r
<div class="action-bar">\r
  <button class="btn btn-secondary" (click)="cancel()">\r
    \u2190 Back to Forms\r
  </button>\r
</div>\r
\r
<div class="section">\r
  <div *ngIf="loading" class="loading-container">Loading...</div>\r
\r
  <div *ngIf="error" class="alert alert-error">\r
    {{ error }}\r
    <div style="margin-top: 20px;">\r
      <a routerLink="/admin/forms" class="btn btn-secondary">\u2190 Back to Forms</a>\r
      <a *ngIf="form" [routerLink]="['/admin/forms/edit', formId]" class="btn btn-primary">Edit Form Instead</a>\r
    </div>\r
  </div>\r
\r
  <div *ngIf="form && !error" style="max-width: 700px;">\r
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 8px; margin-bottom: 30px;">\r
      <div style="display: flex; align-items: flex-start; gap: 15px;">\r
        <div style="font-size: 2rem;">\u26A0\uFE0F</div>\r
        <div>\r
          <h3 style="margin: 0 0 10px 0; color: #856404;">Warning: Permanent Deletion</h3>\r
          <p style="margin: 0; color: #856404; line-height: 1.6;">\r
            You are about to permanently delete this form. This action cannot be undone.\r
            The form will be removed from the {{ form.page_location }} page immediately.\r
          </p>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <div class="admin-form">\r
      <h3 style="margin-bottom: 20px; color: #2d3561;">Form Details:</h3>\r
\r
      <div class="info-row">\r
        <span class="info-label">Form Name:</span>\r
        <span class="info-value">{{ form.form_name }}</span>\r
      </div>\r
\r
      <div class="info-row" *ngIf="form.form_description">\r
        <span class="info-label">Description:</span>\r
        <span class="info-value">{{ form.form_description.length > 100 ? form.form_description.substring(0, 100) + '...' : form.form_description }}</span>\r
      </div>\r
\r
      <div class="info-row">\r
        <span class="info-label">Page Location:</span>\r
        <span class="info-value">{{ form.page_location }}</span>\r
      </div>\r
\r
      <div class="info-row">\r
        <span class="info-label">Status:</span>\r
        <span class="info-value">\r
          <span *ngIf="form.is_active" class="badge badge-success">\u2713 Active</span>\r
          <span *ngIf="!form.is_active" class="badge badge-inactive">Inactive</span>\r
        </span>\r
      </div>\r
\r
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">\r
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin-bottom: 20px;">\r
          <p style="margin: 0; color: #c62828; font-weight: 600;">\r
            Are you absolutely sure you want to delete this form?\r
          </p>\r
        </div>\r
\r
        <div class="form-actions" style="margin: 0; padding: 0; border: none;">\r
          <button (click)="confirmDelete()" class="btn btn-danger" [disabled]="loading">\r
            \u{1F5D1}\uFE0F {{ loading ? 'Deleting...' : 'Yes, Delete Form' }}\r
          </button>\r
          <button (click)="cancel()" class="btn btn-secondary">Cancel</button>\r
          <a [routerLink]="['/admin/forms/edit', formId]" class="btn btn-primary">Edit Instead</a>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/admin/forms/form-delete/form-delete.css */\n.delete-confirmation {\n  max-width: 600px;\n  margin: 60px auto;\n  background: white;\n  border-radius: 12px;\n  padding: 40px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n}\n.delete-icon {\n  width: 80px;\n  height: 80px;\n  background: #fff3cd;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 40px;\n  margin: 0 auto 30px;\n}\n.delete-confirmation h1 {\n  text-align: center;\n  color: #2c3e50;\n  margin-bottom: 20px;\n  font-size: 28px;\n}\n.delete-confirmation p {\n  text-align: center;\n  color: #666;\n  margin-bottom: 30px;\n  font-size: 16px;\n}\n.form-details {\n  background: #f8f9fa;\n  border-left: 4px solid #dc3545;\n  padding: 20px;\n  margin: 30px 0;\n  border-radius: 4px;\n}\n.form-details h3 {\n  margin: 0 0 10px 0;\n  color: #2c3e50;\n  font-size: 18px;\n}\n.form-details p {\n  margin: 5px 0;\n  color: #666;\n  text-align: left;\n  font-size: 14px;\n}\n.form-details .meta {\n  display: flex;\n  gap: 20px;\n  margin-top: 10px;\n  flex-wrap: wrap;\n}\n.warning-note {\n  background: #fff3cd;\n  border: 1px solid #ffc107;\n  border-radius: 6px;\n  padding: 15px;\n  margin: 20px 0;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.warning-note strong {\n  color: #856404;\n}\n.warning-note p {\n  margin: 0;\n  color: #856404;\n  text-align: left;\n}\n.delete-actions {\n  display: flex;\n  gap: 15px;\n  justify-content: center;\n  margin-top: 30px;\n}\n.btn-confirm-delete {\n  background: #dc3545;\n  color: white;\n  padding: 12px 30px;\n  border: none;\n  border-radius: 6px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  text-decoration: none;\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  transition: background 0.3s;\n}\n.btn-confirm-delete:hover:not(:disabled) {\n  background: #c82333;\n}\n.btn-confirm-delete:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-cancel {\n  background: #6c757d;\n  color: white;\n  padding: 12px 30px;\n  border: none;\n  border-radius: 6px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  text-decoration: none;\n  transition: background 0.3s;\n}\n.btn-cancel:hover:not(:disabled) {\n  background: #5a6268;\n}\n.btn-cancel:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=form-delete.css.map */\n"] }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: FormsService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormDeleteComponent, { className: "FormDeleteComponent", filePath: "src/app/admin/forms/form-delete/form-delete.ts", lineNumber: 12 });
})();

// src/app/admin/gallery/gallery-list/gallery-list.component.ts
var _c05 = () => [];
function GalleryListComponent_span_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.filteredImages.length, " result", ctx_r0.filteredImages.length !== 1 ? "s" : "", " found ");
  }
}
function GalleryListComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, " ");
  }
}
function GalleryListComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275element(1, "div", 22);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Loading images...");
    \u0275\u0275elementEnd()();
  }
}
function GalleryListComponent_div_32_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function GalleryListComponent_div_32_button_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(1));
    });
    \u0275\u0275text(1, "1");
    \u0275\u0275elementEnd();
  }
}
function GalleryListComponent_div_32_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function GalleryListComponent_div_32_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function GalleryListComponent_div_32_button_8_Template_button_click_0_listener() {
      const page_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(page_r5));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", page_r5 === ctx_r0.currentPage);
    \u0275\u0275property("disabled", page_r5 === ctx_r0.currentPage && ctx_r0.getTotalPages() === 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r5, " ");
  }
}
function GalleryListComponent_div_32_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function GalleryListComponent_div_32_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function GalleryListComponent_div_32_button_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.getTotalPages()));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getTotalPages());
  }
}
function GalleryListComponent_div_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 24);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 25)(4, "button", 26);
    \u0275\u0275listener("click", function GalleryListComponent_div_32_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.previousPage());
    });
    \u0275\u0275text(5, "\xAB Previous");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, GalleryListComponent_div_32_button_6_Template, 2, 0, "button", 27)(7, GalleryListComponent_div_32_span_7_Template, 2, 0, "span", 28)(8, GalleryListComponent_div_32_button_8_Template, 2, 4, "button", 29)(9, GalleryListComponent_div_32_span_9_Template, 2, 0, "span", 28)(10, GalleryListComponent_div_32_button_10_Template, 2, 1, "button", 27);
    \u0275\u0275elementStart(11, "button", 26);
    \u0275\u0275listener("click", function GalleryListComponent_div_32_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.nextPage());
    });
    \u0275\u0275text(12, "Next \xBB");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" Showing ", ctx_r0.getPageStart(), "-", ctx_r0.getPageEnd(), " of ", ctx_r0.filteredImages.length, " total ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.getPageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages() - 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage === ctx_r0.getTotalPages());
  }
}
function GalleryListComponent_div_33_tr_15_p_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No images match your filters");
    \u0275\u0275elementEnd();
  }
}
function GalleryListComponent_div_33_tr_15_p_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("No ", ctx_r0.currentLocation === "about_page" ? "About Page" : "Gallery", " images found.");
  }
}
function GalleryListComponent_div_33_tr_15_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 41);
    \u0275\u0275listener("click", function GalleryListComponent_div_33_tr_15_button_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.uploadNew());
    });
    \u0275\u0275text(1, " Upload Your First Image ");
    \u0275\u0275elementEnd();
  }
}
function GalleryListComponent_div_33_tr_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 38)(2, "div", 39);
    \u0275\u0275template(3, GalleryListComponent_div_33_tr_15_p_3_Template, 2, 0, "p", 36)(4, GalleryListComponent_div_33_tr_15_p_4_Template, 2, 1, "p", 36)(5, GalleryListComponent_div_33_tr_15_button_5_Template, 2, 0, "button", 40);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r0.searchQuery || ctx_r0.statusFilter !== "all");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.searchQuery && ctx_r0.statusFilter === "all");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.searchQuery && ctx_r0.statusFilter === "all");
  }
}
function GalleryListComponent_div_33_tr_16_option_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 56);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const idx_r10 = ctx.index;
    const image_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", idx_r10 + 1)("selected", image_r9.display_order === idx_r10 + 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", idx_r10 + 1, " ");
  }
}
function GalleryListComponent_div_33_tr_16_span_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 57);
    \u0275\u0275text(1, "\u2713 Active");
    \u0275\u0275elementEnd();
  }
}
function GalleryListComponent_div_33_tr_16_span_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 58);
    \u0275\u0275text(1, "Inactive");
    \u0275\u0275elementEnd();
  }
}
function GalleryListComponent_div_33_tr_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 42)(2, "select", 43);
    \u0275\u0275listener("change", function GalleryListComponent_div_33_tr_16_Template_select_change_2_listener($event) {
      const image_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.updateDisplayOrder(image_r9, $event.target.value));
    });
    \u0275\u0275template(3, GalleryListComponent_div_33_tr_16_option_3_Template, 2, 3, "option", 44);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 45)(5, "img", 46);
    \u0275\u0275listener("click", function GalleryListComponent_div_33_tr_16_Template_img_click_5_listener() {
      const image_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openImageModal(image_r9.filename));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td", 47)(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "br");
    \u0275\u0275elementStart(10, "small", 48);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td", 49);
    \u0275\u0275template(13, GalleryListComponent_div_33_tr_16_span_13_Template, 2, 0, "span", 50)(14, GalleryListComponent_div_33_tr_16_span_14_Template, 2, 0, "span", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 52)(16, "button", 53);
    \u0275\u0275listener("click", function GalleryListComponent_div_33_tr_16_Template_button_click_16_listener() {
      const image_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.edit(image_r9.id));
    });
    \u0275\u0275text(17, " \u270F\uFE0F ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 54);
    \u0275\u0275listener("click", function GalleryListComponent_div_33_tr_16_Template_button_click_18_listener() {
      const image_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleActive(image_r9));
    });
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "button", 55);
    \u0275\u0275listener("click", function GalleryListComponent_div_33_tr_16_Template_button_click_20_listener() {
      const image_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.deleteImage(image_r9));
    });
    \u0275\u0275text(21, " \u{1F5D1}\uFE0F ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const image_r9 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", \u0275\u0275pureFunction0(10, _c05).constructor(ctx_r0.images.length));
    \u0275\u0275advance(2);
    \u0275\u0275property("src", ctx_r0.getImageUrl(image_r9.filename), \u0275\u0275sanitizeUrl)("alt", image_r9.title);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(image_r9.title);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", image_r9.original_filename, " (", ctx_r0.formatFileSize(image_r9.file_size), ") ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", image_r9.is_active);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !image_r9.is_active);
    \u0275\u0275advance(4);
    \u0275\u0275property("title", image_r9.is_active ? "Toggle Active/Inactive" : "Toggle Active/Inactive");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", image_r9.is_active ? "\u{1F441}\uFE0F" : "\u{1F6AB}", " ");
  }
}
function GalleryListComponent_div_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "table", 33)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Order");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Preview");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Image Details");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 34);
    \u0275\u0275text(11, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 35);
    \u0275\u0275text(13, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody");
    \u0275\u0275template(15, GalleryListComponent_div_33_tr_15_Template, 6, 3, "tr", 36)(16, GalleryListComponent_div_33_tr_16_Template, 22, 11, "tr", 37);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(15);
    \u0275\u0275property("ngIf", ctx_r0.filteredImages.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.getPaginatedImages());
  }
}
function GalleryListComponent_div_34_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function GalleryListComponent_div_34_button_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(1));
    });
    \u0275\u0275text(1, "1");
    \u0275\u0275elementEnd();
  }
}
function GalleryListComponent_div_34_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function GalleryListComponent_div_34_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function GalleryListComponent_div_34_button_8_Template_button_click_0_listener() {
      const page_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(page_r14));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r14 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", page_r14 === ctx_r0.currentPage);
    \u0275\u0275property("disabled", page_r14 === ctx_r0.currentPage && ctx_r0.getTotalPages() === 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r14, " ");
  }
}
function GalleryListComponent_div_34_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function GalleryListComponent_div_34_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function GalleryListComponent_div_34_button_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.getTotalPages()));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getTotalPages());
  }
}
function GalleryListComponent_div_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 24);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 25)(4, "button", 26);
    \u0275\u0275listener("click", function GalleryListComponent_div_34_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.previousPage());
    });
    \u0275\u0275text(5, "\xAB Previous");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, GalleryListComponent_div_34_button_6_Template, 2, 0, "button", 27)(7, GalleryListComponent_div_34_span_7_Template, 2, 0, "span", 28)(8, GalleryListComponent_div_34_button_8_Template, 2, 4, "button", 29)(9, GalleryListComponent_div_34_span_9_Template, 2, 0, "span", 28)(10, GalleryListComponent_div_34_button_10_Template, 2, 1, "button", 27);
    \u0275\u0275elementStart(11, "button", 26);
    \u0275\u0275listener("click", function GalleryListComponent_div_34_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.nextPage());
    });
    \u0275\u0275text(12, "Next \xBB");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" Showing ", ctx_r0.getPageStart(), "-", ctx_r0.getPageEnd(), " of ", ctx_r0.filteredImages.length, " total ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.getPageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages() - 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage === ctx_r0.getTotalPages());
  }
}
function GalleryListComponent_div_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 59);
    \u0275\u0275listener("click", function GalleryListComponent_div_35_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeModal());
    });
    \u0275\u0275elementStart(1, "div", 60);
    \u0275\u0275listener("click", function GalleryListComponent_div_35_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r16);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "button", 61);
    \u0275\u0275listener("click", function GalleryListComponent_div_35_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeModal());
    });
    \u0275\u0275text(3, "\xD7");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "img", 62);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("src", ctx_r0.modalImageUrl, \u0275\u0275sanitizeUrl);
  }
}
var GalleryListComponent = class _GalleryListComponent {
  galleryService;
  router;
  route;
  images = [];
  filteredImages = [];
  loading = false;
  error = null;
  searchQuery = "";
  statusFilter = "all";
  currentLocation = "gallery";
  // Tab counts
  aboutPageCount = 0;
  galleryCount = 0;
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  // Image preview modal
  showModal = false;
  modalImageUrl = "";
  constructor(galleryService, router, route) {
    this.galleryService = galleryService;
    this.router = router;
    this.route = route;
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.currentLocation = params["location"] || "gallery";
      this.loadImages();
      this.loadTabCounts();
    });
  }
  /**
   * Load all images for current location from API
   */
  loadImages() {
    this.loading = true;
    this.error = null;
    this.galleryService.getAll(this.currentLocation).subscribe({
      next: (data) => {
        this.images = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || "Failed to load images";
        this.loading = false;
        console.error("Error loading images:", err);
      }
    });
  }
  /**
   * Load counts for both tabs
   */
  loadTabCounts() {
    this.galleryService.getAll("about_page").subscribe({
      next: (data) => {
        this.aboutPageCount = data.length;
      },
      error: (err) => {
        console.error("Error loading about page count:", err);
      }
    });
    this.galleryService.getAll("gallery").subscribe({
      next: (data) => {
        this.galleryCount = data.length;
      },
      error: (err) => {
        console.error("Error loading gallery count:", err);
      }
    });
  }
  /**
   * Switch to a different location tab
   */
  switchTab(location) {
    this.currentLocation = location;
    this.currentPage = 1;
    this.searchQuery = "";
    this.statusFilter = "all";
    this.router.navigate(["/admin/gallery"], { queryParams: { location } });
  }
  /**
   * Apply search and status filters
   */
  applyFilters() {
    let filtered = [...this.images];
    if (this.statusFilter === "active") {
      filtered = filtered.filter((img) => img.is_active);
    } else if (this.statusFilter === "inactive") {
      filtered = filtered.filter((img) => !img.is_active);
    }
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((img) => img.title.toLowerCase().includes(query) || img.original_filename.toLowerCase().includes(query));
    }
    this.filteredImages = filtered;
  }
  /**
   * Handle search input
   */
  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }
  /**
   * Handle status filter change
   */
  onStatusFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }
  /**
   * Navigate to upload page
   */
  uploadNew() {
    this.router.navigate(["/admin/gallery/upload"], {
      queryParams: { location: this.currentLocation }
    });
  }
  /**
   * Navigate to edit page
   */
  edit(id) {
    this.router.navigate(["/admin/gallery/edit", id], {
      queryParams: { location: this.currentLocation }
    });
  }
  /**
   * Toggle active status
   */
  toggleActive(image) {
    this.galleryService.toggleActive(image.id).subscribe({
      next: (updated) => {
        const index = this.images.findIndex((img) => img.id === image.id);
        if (index !== -1) {
          this.images[index] = updated;
        }
        const filteredIndex = this.filteredImages.findIndex((img) => img.id === image.id);
        if (filteredIndex !== -1) {
          this.filteredImages[filteredIndex] = updated;
        }
      },
      error: (err) => {
        this.error = "Failed to toggle status";
        console.error("Error toggling status:", err);
      }
    });
  }
  /**
   * Navigate to delete confirmation page
   */
  deleteImage(image) {
    this.router.navigate(["/admin/gallery/delete", image.id]);
  }
  /**
   * Update display order
   */
  updateDisplayOrder(image, newOrder) {
    this.galleryService.updateOrder(image.id, newOrder, this.currentLocation).subscribe({
      next: () => {
        this.loadImages();
        this.loadTabCounts();
      },
      error: (err) => {
        this.error = "Failed to update order";
        console.error("Error updating order:", err);
      }
    });
  }
  /**
   * Get image URL
   */
  getImageUrl(filename) {
    return `/assets/img/gallery/${filename}`;
  }
  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (bytes < 1024)
      return bytes + " B";
    if (bytes < 1024 * 1024)
      return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }
  /**
   * Get paginated images for current page
   */
  getPaginatedImages() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredImages.slice(startIndex, endIndex);
  }
  /**
   * Get total number of pages
   */
  getTotalPages() {
    return Math.max(1, Math.ceil(this.filteredImages.length / this.itemsPerPage));
  }
  /**
   * Get page numbers to display
   */
  getPageNumbers() {
    const totalPages = this.getTotalPages();
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  /**
   * Get start index for current page (for display)
   */
  getPageStart() {
    if (this.filteredImages.length === 0)
      return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  /**
   * Get end index for current page (for display)
   */
  getPageEnd() {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredImages.length);
  }
  /**
   * Go to specific page
   */
  goToPage(page) {
    this.currentPage = page;
  }
  /**
   * Go to previous page
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  /**
   * Go to next page
   */
  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }
  /**
   * Open image preview modal
   */
  openImageModal(filename) {
    this.modalImageUrl = this.getImageUrl(filename);
    this.showModal = true;
  }
  /**
   * Close image preview modal
   */
  closeModal() {
    this.showModal = false;
    this.modalImageUrl = "";
  }
  static \u0275fac = function GalleryListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GalleryListComponent)(\u0275\u0275directiveInject(GalleryService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GalleryListComponent, selectors: [["app-gallery-list"]], standalone: false, decls: 36, vars: 17, consts: [[1, "content-header"], [1, "tabs"], [1, "tab", 3, "click"], [1, "tab-badge"], [1, "section"], [1, "section-header"], [1, "btn", "btn-primary", 3, "click"], [1, "search-container"], ["type", "text", "placeholder", "Search by title or filename...", 1, "search-input", 3, "ngModelChange", "input", "ngModel"], [1, "status-filter", 3, "ngModelChange", "change", "ngModel"], ["value", "all"], ["value", "active"], ["value", "inactive"], ["class", "search-results", 4, "ngIf"], ["class", "alert alert-error", 4, "ngIf"], ["class", "loading-container", 4, "ngIf"], ["class", "pagination-container", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], ["class", "image-modal-overlay", 3, "click", 4, "ngIf"], [1, "search-results"], [1, "alert", "alert-error"], [1, "loading-container"], [1, "spinner"], [1, "pagination-container"], [1, "pagination-info"], [1, "pagination-controls"], [1, "pagination-btn", 3, "click", "disabled"], ["class", "pagination-btn", 3, "click", 4, "ngIf"], ["style", "padding: 0 8px; color: #666;", 4, "ngIf"], ["class", "pagination-btn", 3, "active", "disabled", "click", 4, "ngFor", "ngForOf"], [1, "pagination-btn", 3, "click"], [2, "padding", "0 8px", "color", "#666"], [1, "table-container"], ["id", "gallery-table", 1, "data-table"], [1, "col-status"], [1, "actions"], [4, "ngIf"], [4, "ngFor", "ngForOf"], ["colspan", "5", 1, "text-center"], [1, "empty-state"], ["class", "btn btn-primary btn-sm", 3, "click", 4, "ngIf"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], ["data-label", "ORDER", 1, "text-center"], [1, "order-select", 3, "change"], [3, "value", "selected", 4, "ngFor", "ngForOf"], ["data-label", "PREVIEW"], ["title", "Click to preview full size", 1, "image-thumbnail", 2, "cursor", "pointer", 3, "click", "src", "alt"], ["data-label", "IMAGE DETAILS"], [1, "text-muted"], ["data-label", "STATUS", 1, "col-status"], ["class", "badge badge-success", 4, "ngIf"], ["class", "badge badge-inactive", 4, "ngIf"], ["data-label", "ACTIONS", 1, "actions"], ["title", "Edit", 1, "btn", "btn-sm", "btn-edit", 3, "click"], [1, "btn", "btn-sm", "btn-toggle", 3, "click", "title"], ["title", "Delete", 1, "btn", "btn-sm", "btn-delete", 3, "click"], [3, "value", "selected"], [1, "badge", "badge-success"], [1, "badge", "badge-inactive"], [1, "image-modal-overlay", 3, "click"], [1, "image-modal-content", 3, "click"], [1, "modal-close-btn", 3, "click"], ["alt", "Full size preview", 3, "src"]], template: function GalleryListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Gallery Management");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4, "Manage images for About Page and Gallery");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 1)(6, "button", 2);
      \u0275\u0275listener("click", function GalleryListComponent_Template_button_click_6_listener() {
        return ctx.switchTab("about_page");
      });
      \u0275\u0275text(7, " \u{1F4C4} About Page ");
      \u0275\u0275elementStart(8, "span", 3);
      \u0275\u0275text(9);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "button", 2);
      \u0275\u0275listener("click", function GalleryListComponent_Template_button_click_10_listener() {
        return ctx.switchTab("gallery");
      });
      \u0275\u0275text(11, " \u{1F5BC}\uFE0F Gallery ");
      \u0275\u0275elementStart(12, "span", 3);
      \u0275\u0275text(13);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(14, "div", 4)(15, "div", 5)(16, "h2");
      \u0275\u0275text(17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "button", 6);
      \u0275\u0275listener("click", function GalleryListComponent_Template_button_click_18_listener() {
        return ctx.uploadNew();
      });
      \u0275\u0275text(19, " + Upload New Image ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 7)(21, "input", 8);
      \u0275\u0275twoWayListener("ngModelChange", function GalleryListComponent_Template_input_ngModelChange_21_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
        return $event;
      });
      \u0275\u0275listener("input", function GalleryListComponent_Template_input_input_21_listener() {
        return ctx.onSearch();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "select", 9);
      \u0275\u0275twoWayListener("ngModelChange", function GalleryListComponent_Template_select_ngModelChange_22_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.statusFilter, $event) || (ctx.statusFilter = $event);
        return $event;
      });
      \u0275\u0275listener("change", function GalleryListComponent_Template_select_change_22_listener() {
        return ctx.onStatusFilterChange();
      });
      \u0275\u0275elementStart(23, "option", 10);
      \u0275\u0275text(24, "All Statuses");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "option", 11);
      \u0275\u0275text(26, "Active");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "option", 12);
      \u0275\u0275text(28, "Inactive");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(29, GalleryListComponent_span_29_Template, 2, 2, "span", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275template(30, GalleryListComponent_div_30_Template, 2, 1, "div", 14)(31, GalleryListComponent_div_31_Template, 4, 0, "div", 15)(32, GalleryListComponent_div_32_Template, 13, 10, "div", 16)(33, GalleryListComponent_div_33_Template, 17, 2, "div", 17)(34, GalleryListComponent_div_34_Template, 13, 10, "div", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275template(35, GalleryListComponent_div_35_Template, 5, 1, "div", 18);
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275classProp("active", ctx.currentLocation === "about_page");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.aboutPageCount);
      \u0275\u0275advance();
      \u0275\u0275classProp("active", ctx.currentLocation === "gallery");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.galleryCount);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate2("", ctx.currentLocation === "about_page" ? "About Page" : "Gallery", " Images (", ctx.images.length, ")");
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("ngModel", ctx.statusFilter);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ctx.searchQuery || ctx.statusFilter !== "all");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.filteredImages.length > 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.filteredImages.length > 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.showModal);
    }
  }, dependencies: [NgForOf, NgIf, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel], styles: ["\n\n.tabs[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 30px;\n  border-bottom: 2px solid #e0e0e0;\n}\n.tab[_ngcontent-%COMP%] {\n  padding: 12px 24px;\n  background: none;\n  border: none;\n  border-bottom: 3px solid transparent;\n  cursor: pointer;\n  font-size: 16px;\n  font-weight: 500;\n  color: #666;\n  transition: all 0.3s;\n  text-decoration: none;\n  display: inline-block;\n}\n.tab[_ngcontent-%COMP%]:hover {\n  color: #4a90e2;\n  background: rgba(74, 144, 226, 0.05);\n}\n.tab.active[_ngcontent-%COMP%] {\n  color: #4a90e2;\n  border-bottom-color: #4a90e2;\n  font-weight: 600;\n}\n.tab-badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  background: #e0e0e0;\n  color: #666;\n  padding: 2px 8px;\n  border-radius: 12px;\n  font-size: 12px;\n  margin-left: 6px;\n  font-weight: 600;\n}\n.tab.active[_ngcontent-%COMP%]   .tab-badge[_ngcontent-%COMP%] {\n  background: #4a90e2;\n  color: white;\n}\n.search-container[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  display: flex;\n  gap: 15px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.search-input[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 250px;\n  max-width: 400px;\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.search-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.status-filter[_ngcontent-%COMP%] {\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  background: #ffffff;\n  color: #333;\n  font-size: 0.95rem;\n  cursor: pointer;\n  min-width: 150px;\n}\n.status-filter[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.search-results[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 20px;\n  padding: 20px 0;\n  border-top: 1px solid #e0e0e0;\n}\n.pagination-info[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-controls[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n}\n.pagination-btn[_ngcontent-%COMP%] {\n  padding: 8px 12px;\n  border: 1px solid #ddd;\n  background: #ffffff;\n  color: #333;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n}\n.pagination-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #f5f5f5;\n  border-color: #4a90e2;\n}\n.pagination-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination-btn.active[_ngcontent-%COMP%] {\n  background: #4a90e2;\n  color: #ffffff;\n  border-color: #4a90e2;\n}\n.image-thumbnail[_ngcontent-%COMP%] {\n  width: 80px;\n  height: 80px;\n  object-fit: cover;\n  border-radius: 6px;\n  border: 2px solid #e0e0e0;\n}\n.order-select[_ngcontent-%COMP%] {\n  padding: 5px 8px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  font-size: 14px;\n  cursor: pointer;\n}\n.order-select[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n}\n.image-modal-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.8);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 10000;\n  cursor: pointer;\n}\n.image-modal-content[_ngcontent-%COMP%] {\n  position: relative;\n  max-width: 90%;\n  max-height: 90%;\n  cursor: default;\n}\n.image-modal-content[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 100%;\n  max-height: 90vh;\n  object-fit: contain;\n  border-radius: 8px;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);\n}\n.modal-close-btn[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -15px;\n  right: -15px;\n  width: 40px;\n  height: 40px;\n  background: #ffffff;\n  border: none;\n  border-radius: 50%;\n  font-size: 28px;\n  line-height: 1;\n  cursor: pointer;\n  color: #333;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n  transition: all 0.2s;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.modal-close-btn[_ngcontent-%COMP%]:hover {\n  background: #f5f5f5;\n  transform: scale(1.1);\n}\n/*# sourceMappingURL=gallery-list.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GalleryListComponent, [{
    type: Component,
    args: [{ selector: "app-gallery-list", standalone: false, template: `<!-- Content Header -->\r
<div class="content-header">\r
  <h1>Gallery Management</h1>\r
  <p>Manage images for About Page and Gallery</p>\r
</div>\r
\r
<!-- Tabs Navigation -->\r
<div class="tabs">\r
  <button\r
    class="tab"\r
    [class.active]="currentLocation === 'about_page'"\r
    (click)="switchTab('about_page')"\r
  >\r
    \u{1F4C4} About Page\r
    <span class="tab-badge">{{ aboutPageCount }}</span>\r
  </button>\r
  <button\r
    class="tab"\r
    [class.active]="currentLocation === 'gallery'"\r
    (click)="switchTab('gallery')"\r
  >\r
    \u{1F5BC}\uFE0F Gallery\r
    <span class="tab-badge">{{ galleryCount }}</span>\r
  </button>\r
</div>\r
\r
<div class="section">\r
  <!-- Section Header with Upload Button -->\r
  <div class="section-header">\r
    <h2>{{ currentLocation === 'about_page' ? 'About Page' : 'Gallery' }} Images ({{ images.length }})</h2>\r
    <button class="btn btn-primary" (click)="uploadNew()">\r
      + Upload New Image\r
    </button>\r
  </div>\r
\r
  <!-- Search and Filter -->\r
  <div class="search-container">\r
    <input\r
      type="text"\r
      class="search-input"\r
      placeholder="Search by title or filename..."\r
      [(ngModel)]="searchQuery"\r
      (input)="onSearch()"\r
    />\r
\r
    <select class="status-filter" [(ngModel)]="statusFilter" (change)="onStatusFilterChange()">\r
      <option value="all">All Statuses</option>\r
      <option value="active">Active</option>\r
      <option value="inactive">Inactive</option>\r
    </select>\r
\r
    <span class="search-results" *ngIf="searchQuery || statusFilter !== 'all'">\r
      {{ filteredImages.length }} result{{ filteredImages.length !== 1 ? 's' : '' }} found\r
    </span>\r
  </div>\r
\r
  <!-- Error Message -->\r
  <div class="alert alert-error" *ngIf="error">\r
    {{ error }}\r
  </div>\r
\r
  <!-- Loading State -->\r
  <div class="loading-container" *ngIf="loading">\r
    <div class="spinner"></div>\r
    <p>Loading images...</p>\r
  </div>\r
\r
  <!-- Pagination Info (Top) -->\r
  <div class="pagination-container" *ngIf="!loading && filteredImages.length > 0">\r
    <div class="pagination-info">\r
      Showing {{ getPageStart() }}-{{ getPageEnd() }} of {{ filteredImages.length }} total\r
    </div>\r
    <div class="pagination-controls">\r
      <button class="pagination-btn" (click)="previousPage()" [disabled]="currentPage === 1">\xAB Previous</button>\r
\r
      <button class="pagination-btn" (click)="goToPage(1)" *ngIf="getPageNumbers()[0] > 1">1</button>\r
      <span *ngIf="getPageNumbers()[0] > 2" style="padding: 0 8px; color: #666;">...</span>\r
\r
      <button\r
        *ngFor="let page of getPageNumbers()"\r
        class="pagination-btn"\r
        [class.active]="page === currentPage"\r
        [disabled]="page === currentPage && getTotalPages() === 1"\r
        (click)="goToPage(page)">\r
        {{ page }}\r
      </button>\r
\r
      <span *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1" style="padding: 0 8px; color: #666;">...</span>\r
      <button class="pagination-btn" (click)="goToPage(getTotalPages())" *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages()">{{ getTotalPages() }}</button>\r
\r
      <button class="pagination-btn" (click)="nextPage()" [disabled]="currentPage === getTotalPages()">Next \xBB</button>\r
    </div>\r
  </div>\r
\r
  <!-- Images Table -->\r
  <div class="table-container" *ngIf="!loading">\r
    <table class="data-table" id="gallery-table">\r
      <thead>\r
        <tr>\r
          <th>Order</th>\r
          <th>Preview</th>\r
          <th>Image Details</th>\r
          <th class="col-status">Status</th>\r
          <th class="actions">Actions</th>\r
        </tr>\r
      </thead>\r
      <tbody>\r
        <!-- Empty State -->\r
        <tr *ngIf="filteredImages.length === 0">\r
          <td colspan="5" class="text-center">\r
            <div class="empty-state">\r
              <p *ngIf="searchQuery || statusFilter !== 'all'">No images match your filters</p>\r
              <p *ngIf="!searchQuery && statusFilter === 'all'">No {{ currentLocation === 'about_page' ? 'About Page' : 'Gallery' }} images found.</p>\r
              <button class="btn btn-primary btn-sm" (click)="uploadNew()" *ngIf="!searchQuery && statusFilter === 'all'">\r
                Upload Your First Image\r
              </button>\r
            </div>\r
          </td>\r
        </tr>\r
\r
        <!-- Data Rows -->\r
        <tr *ngFor="let image of getPaginatedImages()">\r
          <!-- Display Order Dropdown -->\r
          <td data-label="ORDER" class="text-center">\r
            <select\r
              class="order-select"\r
              (change)="updateDisplayOrder(image, $any($event.target).value)"\r
            >\r
              <option\r
                *ngFor="let i of [].constructor(images.length); let idx = index"\r
                [value]="idx + 1"\r
                [selected]="image.display_order === (idx + 1)">\r
                {{ idx + 1 }}\r
              </option>\r
            </select>\r
          </td>\r
\r
          <!-- Image Preview -->\r
          <td data-label="PREVIEW">\r
            <img\r
              [src]="getImageUrl(image.filename)"\r
              [alt]="image.title"\r
              class="image-thumbnail"\r
              (click)="openImageModal(image.filename)"\r
              style="cursor: pointer;"\r
              title="Click to preview full size">\r
          </td>\r
\r
          <!-- Image Details -->\r
          <td data-label="IMAGE DETAILS">\r
            <strong>{{ image.title }}</strong>\r
            <br>\r
            <small class="text-muted">\r
              {{ image.original_filename }} ({{ formatFileSize(image.file_size) }})\r
            </small>\r
          </td>\r
\r
          <!-- Status Badge -->\r
          <td data-label="STATUS" class="col-status">\r
            <span class="badge badge-success" *ngIf="image.is_active">\u2713 Active</span>\r
            <span class="badge badge-inactive" *ngIf="!image.is_active">Inactive</span>\r
          </td>\r
\r
          <!-- Actions -->\r
          <td data-label="ACTIONS" class="actions">\r
            <button\r
              class="btn btn-sm btn-edit"\r
              (click)="edit(image.id)"\r
              title="Edit"\r
            >\r
              \u270F\uFE0F\r
            </button>\r
\r
            <button\r
              class="btn btn-sm btn-toggle"\r
              (click)="toggleActive(image)"\r
              [title]="image.is_active ? 'Toggle Active/Inactive' : 'Toggle Active/Inactive'"\r
            >\r
              {{ image.is_active ? '\u{1F441}\uFE0F' : '\u{1F6AB}' }}\r
            </button>\r
\r
            <button\r
              class="btn btn-sm btn-delete"\r
              (click)="deleteImage(image)"\r
              title="Delete"\r
            >\r
              \u{1F5D1}\uFE0F\r
            </button>\r
          </td>\r
        </tr>\r
      </tbody>\r
    </table>\r
  </div>\r
\r
  <!-- Pagination (Bottom) -->\r
  <div class="pagination-container" *ngIf="!loading && filteredImages.length > 0">\r
    <div class="pagination-info">\r
      Showing {{ getPageStart() }}-{{ getPageEnd() }} of {{ filteredImages.length }} total\r
    </div>\r
    <div class="pagination-controls">\r
      <button class="pagination-btn" (click)="previousPage()" [disabled]="currentPage === 1">\xAB Previous</button>\r
\r
      <button class="pagination-btn" (click)="goToPage(1)" *ngIf="getPageNumbers()[0] > 1">1</button>\r
      <span *ngIf="getPageNumbers()[0] > 2" style="padding: 0 8px; color: #666;">...</span>\r
\r
      <button\r
        *ngFor="let page of getPageNumbers()"\r
        class="pagination-btn"\r
        [class.active]="page === currentPage"\r
        [disabled]="page === currentPage && getTotalPages() === 1"\r
        (click)="goToPage(page)">\r
        {{ page }}\r
      </button>\r
\r
      <span *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1" style="padding: 0 8px; color: #666;">...</span>\r
      <button class="pagination-btn" (click)="goToPage(getTotalPages())" *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages()">{{ getTotalPages() }}</button>\r
\r
      <button class="pagination-btn" (click)="nextPage()" [disabled]="currentPage === getTotalPages()">Next \xBB</button>\r
    </div>\r
  </div>\r
</div>\r
\r
<!-- Image Preview Modal -->\r
<div class="image-modal-overlay" *ngIf="showModal" (click)="closeModal()">\r
  <div class="image-modal-content" (click)="$event.stopPropagation()">\r
    <button class="modal-close-btn" (click)="closeModal()">&times;</button>\r
    <img [src]="modalImageUrl" alt="Full size preview">\r
  </div>\r
</div>\r
`, styles: ["/* src/app/admin/gallery/gallery-list/gallery-list.component.css */\n.tabs {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 30px;\n  border-bottom: 2px solid #e0e0e0;\n}\n.tab {\n  padding: 12px 24px;\n  background: none;\n  border: none;\n  border-bottom: 3px solid transparent;\n  cursor: pointer;\n  font-size: 16px;\n  font-weight: 500;\n  color: #666;\n  transition: all 0.3s;\n  text-decoration: none;\n  display: inline-block;\n}\n.tab:hover {\n  color: #4a90e2;\n  background: rgba(74, 144, 226, 0.05);\n}\n.tab.active {\n  color: #4a90e2;\n  border-bottom-color: #4a90e2;\n  font-weight: 600;\n}\n.tab-badge {\n  display: inline-block;\n  background: #e0e0e0;\n  color: #666;\n  padding: 2px 8px;\n  border-radius: 12px;\n  font-size: 12px;\n  margin-left: 6px;\n  font-weight: 600;\n}\n.tab.active .tab-badge {\n  background: #4a90e2;\n  color: white;\n}\n.search-container {\n  margin-bottom: 20px;\n  display: flex;\n  gap: 15px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.search-input {\n  flex: 1;\n  min-width: 250px;\n  max-width: 400px;\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.search-input:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.status-filter {\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  background: #ffffff;\n  color: #333;\n  font-size: 0.95rem;\n  cursor: pointer;\n  min-width: 150px;\n}\n.status-filter:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.search-results {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 20px;\n  padding: 20px 0;\n  border-top: 1px solid #e0e0e0;\n}\n.pagination-info {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-controls {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n}\n.pagination-btn {\n  padding: 8px 12px;\n  border: 1px solid #ddd;\n  background: #ffffff;\n  color: #333;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n}\n.pagination-btn:hover:not(:disabled) {\n  background: #f5f5f5;\n  border-color: #4a90e2;\n}\n.pagination-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination-btn.active {\n  background: #4a90e2;\n  color: #ffffff;\n  border-color: #4a90e2;\n}\n.image-thumbnail {\n  width: 80px;\n  height: 80px;\n  object-fit: cover;\n  border-radius: 6px;\n  border: 2px solid #e0e0e0;\n}\n.order-select {\n  padding: 5px 8px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  font-size: 14px;\n  cursor: pointer;\n}\n.order-select:focus {\n  outline: none;\n  border-color: #4a90e2;\n}\n.image-modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.8);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 10000;\n  cursor: pointer;\n}\n.image-modal-content {\n  position: relative;\n  max-width: 90%;\n  max-height: 90%;\n  cursor: default;\n}\n.image-modal-content img {\n  max-width: 100%;\n  max-height: 90vh;\n  object-fit: contain;\n  border-radius: 8px;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);\n}\n.modal-close-btn {\n  position: absolute;\n  top: -15px;\n  right: -15px;\n  width: 40px;\n  height: 40px;\n  background: #ffffff;\n  border: none;\n  border-radius: 50%;\n  font-size: 28px;\n  line-height: 1;\n  cursor: pointer;\n  color: #333;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n  transition: all 0.2s;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.modal-close-btn:hover {\n  background: #f5f5f5;\n  transform: scale(1.1);\n}\n/*# sourceMappingURL=gallery-list.component.css.map */\n"] }]
  }], () => [{ type: GalleryService }, { type: Router }, { type: ActivatedRoute }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GalleryListComponent, { className: "GalleryListComponent", filePath: "src/app/admin/gallery/gallery-list/gallery-list.component.ts", lineNumber: 12 });
})();

// src/app/admin/gallery/gallery-upload/gallery-upload.component.ts
function GalleryUploadComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, "\n");
  }
}
function GalleryUploadComponent_div_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6)(1, "label");
    \u0275\u0275text(2, "Preview");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 24);
    \u0275\u0275element(4, "img", 25);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("src", ctx_r0.previewUrl, \u0275\u0275sanitizeUrl);
  }
}
var GalleryUploadComponent = class _GalleryUploadComponent {
  route;
  router;
  galleryService;
  loading = false;
  error = null;
  currentLocation = "gallery";
  selectedFile = null;
  previewUrl = null;
  // Form data
  formData = {
    title: "",
    page_location: "gallery",
    is_active: false
  };
  constructor(route, router, galleryService) {
    this.route = route;
    this.router = router;
    this.galleryService = galleryService;
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.currentLocation = params["location"] || "gallery";
      this.formData.page_location = this.currentLocation;
    });
  }
  /**
   * Handle file selection
   */
  onFileSelected(event) {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        this.error = "Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed.";
        this.selectedFile = null;
        this.previewUrl = null;
        return;
      }
      if (file.size > 5242880) {
        this.error = "File size exceeds 5MB maximum. Please choose a smaller image.";
        this.selectedFile = null;
        this.previewUrl = null;
        return;
      }
      this.selectedFile = file;
      this.error = null;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  /**
   * Submit upload form
   */
  onSubmit() {
    if (!this.formData.title.trim()) {
      this.error = "Image Title is required";
      return;
    }
    if (!this.selectedFile) {
      this.error = "Image File is required";
      return;
    }
    this.loading = true;
    this.error = null;
    const uploadData = new FormData();
    uploadData.append("image_file", this.selectedFile);
    uploadData.append("title", this.formData.title);
    uploadData.append("page_location", this.formData.page_location);
    uploadData.append("is_active", this.formData.is_active ? "1" : "0");
    this.galleryService.upload(uploadData).subscribe({
      next: () => {
        this.router.navigate(["/admin/gallery"], {
          queryParams: { location: this.formData.page_location }
        });
      },
      error: (err) => {
        this.error = err.message || "Failed to upload image";
        this.loading = false;
        console.error("Error uploading image:", err);
      }
    });
  }
  /**
   * Cancel and return to list
   */
  cancel() {
    this.router.navigate(["/admin/gallery"], {
      queryParams: { location: this.currentLocation }
    });
  }
  static \u0275fac = function GalleryUploadComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GalleryUploadComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(GalleryService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GalleryUploadComponent, selectors: [["app-gallery-upload"]], standalone: false, decls: 49, vars: 9, consts: [[1, "content-header"], [1, "section-subtitle"], [1, "action-bar"], [1, "btn", "btn-secondary", 3, "click"], ["class", "alert alert-error", 4, "ngIf"], [1, "admin-form", 3, "ngSubmit"], [1, "form-group"], ["for", "title"], [1, "required"], ["type", "text", "id", "title", "name", "title", "placeholder", "Enter image title", "maxlength", "255", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-help"], ["for", "page_location"], ["id", "page_location", "name", "page_location", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["value", "about_page"], ["value", "gallery"], ["for", "image_file"], ["type", "file", "id", "image_file", "name", "image_file", "accept", "image/jpeg,image/jpg,image/png,image/gif,image/webp", "required", "", 1, "form-control", 3, "change"], ["class", "form-group", 4, "ngIf"], [1, "checkbox-label"], ["type", "checkbox", "name", "is_active", 3, "ngModelChange", "ngModel"], [1, "form-actions"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 1, "btn", "btn-secondary", 3, "click", "disabled"], [1, "alert", "alert-error"], [1, "image-preview"], ["alt", "Preview", 3, "src"]], template: function GalleryUploadComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Upload New Image");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 1);
      \u0275\u0275text(4);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
      \u0275\u0275listener("click", function GalleryUploadComponent_Template_button_click_6_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(7, " \u2190 Back to Gallery ");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(8, GalleryUploadComponent_div_8_Template, 2, 1, "div", 4);
      \u0275\u0275elementStart(9, "form", 5);
      \u0275\u0275listener("ngSubmit", function GalleryUploadComponent_Template_form_ngSubmit_9_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(10, "div", 6)(11, "label", 7);
      \u0275\u0275text(12, "Image Title ");
      \u0275\u0275elementStart(13, "span", 8);
      \u0275\u0275text(14, "*");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "input", 9);
      \u0275\u0275twoWayListener("ngModelChange", function GalleryUploadComponent_Template_input_ngModelChange_15_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.formData.title, $event) || (ctx.formData.title = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "small", 10);
      \u0275\u0275text(17, "This title will be displayed with the image");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 6)(19, "label", 11);
      \u0275\u0275text(20, "Page Location ");
      \u0275\u0275elementStart(21, "span", 8);
      \u0275\u0275text(22, "*");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "select", 12);
      \u0275\u0275twoWayListener("ngModelChange", function GalleryUploadComponent_Template_select_ngModelChange_23_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.formData.page_location, $event) || (ctx.formData.page_location = $event);
        return $event;
      });
      \u0275\u0275elementStart(24, "option", 13);
      \u0275\u0275text(25, "About Page");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "option", 14);
      \u0275\u0275text(27, "Gallery");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "small", 10);
      \u0275\u0275text(29, "Where should this image appear on the website?");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(30, "div", 6)(31, "label", 15);
      \u0275\u0275text(32, "Image File ");
      \u0275\u0275elementStart(33, "span", 8);
      \u0275\u0275text(34, "*");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "input", 16);
      \u0275\u0275listener("change", function GalleryUploadComponent_Template_input_change_35_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "small", 10);
      \u0275\u0275text(37, "Supported formats: JPG, PNG, GIF, WebP (Max 5MB)");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(38, GalleryUploadComponent_div_38_Template, 5, 1, "div", 17);
      \u0275\u0275elementStart(39, "div", 6)(40, "label", 18)(41, "input", 19);
      \u0275\u0275twoWayListener("ngModelChange", function GalleryUploadComponent_Template_input_ngModelChange_41_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.formData.is_active, $event) || (ctx.formData.is_active = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "span");
      \u0275\u0275text(43, "Active (visible on website)");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(44, "div", 20)(45, "button", 21);
      \u0275\u0275text(46);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "button", 22);
      \u0275\u0275listener("click", function GalleryUploadComponent_Template_button_click_47_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(48, " Cancel ");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1("Add a new image to ", ctx.currentLocation === "about_page" ? "About Page" : "Gallery");
      \u0275\u0275advance(4);
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.title);
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.page_location);
      \u0275\u0275advance(15);
      \u0275\u0275property("ngIf", ctx.previewUrl);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.is_active);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.loading ? "Uploading..." : "Upload Image", " ");
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.loading);
    }
  }, dependencies: [NgIf, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, NgModel, NgForm], styles: ["\n\n.image-preview[_ngcontent-%COMP%] {\n  margin-top: 15px;\n  padding: 20px;\n  background: #f8f9fa;\n  border-radius: 8px;\n  border: 2px solid #e0e0e0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.image-preview[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 100%;\n  max-height: 400px;\n  object-fit: contain;\n  border-radius: 6px;\n}\n/*# sourceMappingURL=gallery-upload.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GalleryUploadComponent, [{
    type: Component,
    args: [{ selector: "app-gallery-upload", standalone: false, template: `<!-- Content Header -->\r
<div class="content-header">\r
  <h1>Upload New Image</h1>\r
  <p class="section-subtitle">Add a new image to {{ currentLocation === 'about_page' ? 'About Page' : 'Gallery' }}</p>\r
</div>\r
\r
<!-- Back Button -->\r
<div class="action-bar">\r
  <button class="btn btn-secondary" (click)="cancel()">\r
    \u2190 Back to Gallery\r
  </button>\r
</div>\r
\r
<!-- Error Message -->\r
<div class="alert alert-error" *ngIf="error">\r
  {{ error }}\r
</div>\r
\r
<!-- Upload Form -->\r
<form class="admin-form" (ngSubmit)="onSubmit()">\r
  <!-- Image Title -->\r
  <div class="form-group">\r
    <label for="title">Image Title <span class="required">*</span></label>\r
    <input\r
      type="text"\r
      id="title"\r
      name="title"\r
      class="form-control"\r
      [(ngModel)]="formData.title"\r
      placeholder="Enter image title"\r
      maxlength="255"\r
      required\r
    />\r
    <small class="form-help">This title will be displayed with the image</small>\r
  </div>\r
\r
  <!-- Page Location -->\r
  <div class="form-group">\r
    <label for="page_location">Page Location <span class="required">*</span></label>\r
    <select\r
      id="page_location"\r
      name="page_location"\r
      class="form-control"\r
      [(ngModel)]="formData.page_location"\r
      required\r
    >\r
      <option value="about_page">About Page</option>\r
      <option value="gallery">Gallery</option>\r
    </select>\r
    <small class="form-help">Where should this image appear on the website?</small>\r
  </div>\r
\r
  <!-- Image File Upload -->\r
  <div class="form-group">\r
    <label for="image_file">Image File <span class="required">*</span></label>\r
    <input\r
      type="file"\r
      id="image_file"\r
      name="image_file"\r
      class="form-control"\r
      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"\r
      (change)="onFileSelected($event)"\r
      required\r
    />\r
    <small class="form-help">Supported formats: JPG, PNG, GIF, WebP (Max 5MB)</small>\r
  </div>\r
\r
  <!-- Image Preview -->\r
  <div class="form-group" *ngIf="previewUrl">\r
    <label>Preview</label>\r
    <div class="image-preview">\r
      <img [src]="previewUrl" alt="Preview">\r
    </div>\r
  </div>\r
\r
  <!-- Is Active Checkbox -->\r
  <div class="form-group">\r
    <label class="checkbox-label">\r
      <input\r
        type="checkbox"\r
        name="is_active"\r
        [(ngModel)]="formData.is_active"\r
      />\r
      <span>Active (visible on website)</span>\r
    </label>\r
  </div>\r
\r
  <!-- Form Actions -->\r
  <div class="form-actions">\r
    <button\r
      type="submit"\r
      class="btn btn-primary"\r
      [disabled]="loading"\r
    >\r
      {{ loading ? 'Uploading...' : 'Upload Image' }}\r
    </button>\r
\r
    <button\r
      type="button"\r
      class="btn btn-secondary"\r
      (click)="cancel()"\r
      [disabled]="loading"\r
    >\r
      Cancel\r
    </button>\r
  </div>\r
</form>\r
`, styles: ["/* src/app/admin/gallery/gallery-upload/gallery-upload.component.css */\n.image-preview {\n  margin-top: 15px;\n  padding: 20px;\n  background: #f8f9fa;\n  border-radius: 8px;\n  border: 2px solid #e0e0e0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.image-preview img {\n  max-width: 100%;\n  max-height: 400px;\n  object-fit: contain;\n  border-radius: 6px;\n}\n/*# sourceMappingURL=gallery-upload.component.css.map */\n"] }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: GalleryService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GalleryUploadComponent, { className: "GalleryUploadComponent", filePath: "src/app/admin/gallery/gallery-upload/gallery-upload.component.ts", lineNumber: 11 });
})();

// src/app/admin/gallery/gallery-edit/gallery-edit.component.ts
function GalleryEditComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, "\n");
  }
}
function GalleryEditComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "div", 9);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Loading image...");
    \u0275\u0275elementEnd()();
  }
}
function GalleryEditComponent_form_10_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "label");
    \u0275\u0275text(2, "Current Image");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 26);
    \u0275\u0275element(4, "img", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small", 16);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275property("src", ctx_r0.getImageUrl(), \u0275\u0275sanitizeUrl)("alt", ctx_r0.image.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r0.image.original_filename, " (", ctx_r0.image.file_size, " bytes)");
  }
}
function GalleryEditComponent_form_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 10);
    \u0275\u0275listener("ngSubmit", function GalleryEditComponent_form_10_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmit());
    });
    \u0275\u0275template(1, GalleryEditComponent_form_10_div_1_Template, 7, 4, "div", 11);
    \u0275\u0275elementStart(2, "div", 12)(3, "label", 13);
    \u0275\u0275text(4, "Image Title ");
    \u0275\u0275elementStart(5, "span", 14);
    \u0275\u0275text(6, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "input", 15);
    \u0275\u0275twoWayListener("ngModelChange", function GalleryEditComponent_form_10_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.title, $event) || (ctx_r0.formData.title = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "small", 16);
    \u0275\u0275text(9, "This title will be displayed with the image");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 12)(11, "label", 17);
    \u0275\u0275text(12, "Page Location ");
    \u0275\u0275elementStart(13, "span", 14);
    \u0275\u0275text(14, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "select", 18);
    \u0275\u0275twoWayListener("ngModelChange", function GalleryEditComponent_form_10_Template_select_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.page_location, $event) || (ctx_r0.formData.page_location = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(16, "option", 19);
    \u0275\u0275text(17, "About Page");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "option", 20);
    \u0275\u0275text(19, "Gallery");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "small", 16);
    \u0275\u0275text(21, "Where should this image appear on the website?");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 12)(23, "label", 21)(24, "input", 22);
    \u0275\u0275twoWayListener("ngModelChange", function GalleryEditComponent_form_10_Template_input_ngModelChange_24_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.is_active, $event) || (ctx_r0.formData.is_active = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "span");
    \u0275\u0275text(26, "Active (visible on website)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "div", 23)(28, "button", 24);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "button", 25);
    \u0275\u0275listener("click", function GalleryEditComponent_form_10_Template_button_click_30_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cancel());
    });
    \u0275\u0275text(31, " Cancel ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.image);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.title);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.page_location);
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.is_active);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.loading ? "Saving..." : "Update Image", " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.loading);
  }
}
var GalleryEditComponent = class _GalleryEditComponent {
  route;
  router;
  galleryService;
  imageId = null;
  loading = false;
  error = null;
  currentLocation = "gallery";
  image = null;
  // Form data
  formData = {
    title: "",
    page_location: "gallery",
    is_active: false
  };
  constructor(route, router, galleryService) {
    this.route = route;
    this.router = router;
    this.galleryService = galleryService;
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.currentLocation = params["location"] || "gallery";
    });
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.imageId = +params["id"];
        this.loadImage();
      }
    });
  }
  /**
   * Load image for editing
   */
  loadImage() {
    if (!this.imageId)
      return;
    this.loading = true;
    this.error = null;
    this.galleryService.getById(this.imageId).subscribe({
      next: (data) => {
        this.image = data;
        this.formData = {
          title: data.title,
          page_location: data.page_location,
          is_active: data.is_active
        };
        this.currentLocation = data.page_location;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load image";
        this.loading = false;
        console.error("Error loading image:", err);
      }
    });
  }
  /**
   * Get image URL
   */
  getImageUrl() {
    if (this.image) {
      return `/assets/img/gallery/${this.image.filename}`;
    }
    return "";
  }
  /**
   * Submit edit form
   */
  onSubmit() {
    if (!this.formData.title.trim()) {
      this.error = "Image Title is required";
      return;
    }
    this.loading = true;
    this.error = null;
    if (this.imageId) {
      this.galleryService.update(this.imageId, this.formData).subscribe({
        next: () => {
          this.router.navigate(["/admin/gallery"], {
            queryParams: { location: this.formData.page_location }
          });
        },
        error: (err) => {
          this.error = err.message || "Failed to update image";
          this.loading = false;
          console.error("Error updating image:", err);
        }
      });
    }
  }
  /**
   * Cancel and return to list
   */
  cancel() {
    this.router.navigate(["/admin/gallery"], {
      queryParams: { location: this.currentLocation }
    });
  }
  static \u0275fac = function GalleryEditComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GalleryEditComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(GalleryService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GalleryEditComponent, selectors: [["app-gallery-edit"]], standalone: false, decls: 11, vars: 3, consts: [[1, "content-header"], [1, "section-subtitle"], [1, "action-bar"], [1, "btn", "btn-secondary", 3, "click"], ["class", "alert alert-error", 4, "ngIf"], ["class", "loading-container", 4, "ngIf"], ["class", "admin-form", 3, "ngSubmit", 4, "ngIf"], [1, "alert", "alert-error"], [1, "loading-container"], [1, "spinner"], [1, "admin-form", 3, "ngSubmit"], ["class", "form-group", 4, "ngIf"], [1, "form-group"], ["for", "title"], [1, "required"], ["type", "text", "id", "title", "name", "title", "placeholder", "Enter image title", "maxlength", "255", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-help"], ["for", "page_location"], ["id", "page_location", "name", "page_location", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["value", "about_page"], ["value", "gallery"], [1, "checkbox-label"], ["type", "checkbox", "name", "is_active", 3, "ngModelChange", "ngModel"], [1, "form-actions"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 1, "btn", "btn-secondary", 3, "click", "disabled"], [1, "image-preview"], [3, "src", "alt"]], template: function GalleryEditComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Edit Image");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 1);
      \u0275\u0275text(4, "Update image details");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
      \u0275\u0275listener("click", function GalleryEditComponent_Template_button_click_6_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(7, " \u2190 Back to Gallery ");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(8, GalleryEditComponent_div_8_Template, 2, 1, "div", 4)(9, GalleryEditComponent_div_9_Template, 4, 0, "div", 5)(10, GalleryEditComponent_form_10_Template, 32, 7, "form", 6);
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading && !ctx.formData.title);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading || ctx.formData.title);
    }
  }, dependencies: [NgIf, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, NgModel, NgForm], styles: ["\n\n.image-preview[_ngcontent-%COMP%] {\n  margin-top: 15px;\n  padding: 20px;\n  background: #f8f9fa;\n  border-radius: 8px;\n  border: 2px solid #e0e0e0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.image-preview[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 100%;\n  max-height: 400px;\n  object-fit: contain;\n  border-radius: 6px;\n}\n/*# sourceMappingURL=gallery-edit.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GalleryEditComponent, [{
    type: Component,
    args: [{ selector: "app-gallery-edit", standalone: false, template: `<!-- Content Header -->\r
<div class="content-header">\r
  <h1>Edit Image</h1>\r
  <p class="section-subtitle">Update image details</p>\r
</div>\r
\r
<!-- Back Button -->\r
<div class="action-bar">\r
  <button class="btn btn-secondary" (click)="cancel()">\r
    \u2190 Back to Gallery\r
  </button>\r
</div>\r
\r
<!-- Error Message -->\r
<div class="alert alert-error" *ngIf="error">\r
  {{ error }}\r
</div>\r
\r
<!-- Loading State -->\r
<div class="loading-container" *ngIf="loading && !formData.title">\r
  <div class="spinner"></div>\r
  <p>Loading image...</p>\r
</div>\r
\r
<!-- Edit Form -->\r
<form class="admin-form" (ngSubmit)="onSubmit()" *ngIf="!loading || formData.title">\r
  <!-- Current Image Preview -->\r
  <div class="form-group" *ngIf="image">\r
    <label>Current Image</label>\r
    <div class="image-preview">\r
      <img [src]="getImageUrl()" [alt]="image.title">\r
    </div>\r
    <small class="form-help">{{ image.original_filename }} ({{ image.file_size }} bytes)</small>\r
  </div>\r
\r
  <!-- Image Title -->\r
  <div class="form-group">\r
    <label for="title">Image Title <span class="required">*</span></label>\r
    <input\r
      type="text"\r
      id="title"\r
      name="title"\r
      class="form-control"\r
      [(ngModel)]="formData.title"\r
      placeholder="Enter image title"\r
      maxlength="255"\r
      required\r
    />\r
    <small class="form-help">This title will be displayed with the image</small>\r
  </div>\r
\r
  <!-- Page Location -->\r
  <div class="form-group">\r
    <label for="page_location">Page Location <span class="required">*</span></label>\r
    <select\r
      id="page_location"\r
      name="page_location"\r
      class="form-control"\r
      [(ngModel)]="formData.page_location"\r
      required\r
    >\r
      <option value="about_page">About Page</option>\r
      <option value="gallery">Gallery</option>\r
    </select>\r
    <small class="form-help">Where should this image appear on the website?</small>\r
  </div>\r
\r
  <!-- Is Active Checkbox -->\r
  <div class="form-group">\r
    <label class="checkbox-label">\r
      <input\r
        type="checkbox"\r
        name="is_active"\r
        [(ngModel)]="formData.is_active"\r
      />\r
      <span>Active (visible on website)</span>\r
    </label>\r
  </div>\r
\r
  <!-- Form Actions -->\r
  <div class="form-actions">\r
    <button\r
      type="submit"\r
      class="btn btn-primary"\r
      [disabled]="loading"\r
    >\r
      {{ loading ? 'Saving...' : 'Update Image' }}\r
    </button>\r
\r
    <button\r
      type="button"\r
      class="btn btn-secondary"\r
      (click)="cancel()"\r
      [disabled]="loading"\r
    >\r
      Cancel\r
    </button>\r
  </div>\r
</form>\r
`, styles: ["/* src/app/admin/gallery/gallery-edit/gallery-edit.component.css */\n.image-preview {\n  margin-top: 15px;\n  padding: 20px;\n  background: #f8f9fa;\n  border-radius: 8px;\n  border: 2px solid #e0e0e0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.image-preview img {\n  max-width: 100%;\n  max-height: 400px;\n  object-fit: contain;\n  border-radius: 6px;\n}\n/*# sourceMappingURL=gallery-edit.component.css.map */\n"] }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: GalleryService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GalleryEditComponent, { className: "GalleryEditComponent", filePath: "src/app/admin/gallery/gallery-edit/gallery-edit.component.ts", lineNumber: 12 });
})();

// src/app/admin/gallery/gallery-delete/gallery-delete.component.ts
var _c06 = (a0) => ["/admin/gallery/edit", a0];
function GalleryDeleteComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1, "Loading...");
    \u0275\u0275elementEnd();
  }
}
function GalleryDeleteComponent_div_10_a_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 13);
    \u0275\u0275text(1, "Edit Image Instead");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c06, ctx_r0.imageId));
  }
}
function GalleryDeleteComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "div", 10)(3, "a", 11);
    \u0275\u0275text(4, "\u2190 Back to Gallery");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, GalleryDeleteComponent_div_10_a_5_Template, 2, 3, "a", 12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.image);
  }
}
function GalleryDeleteComponent_div_11_span_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1, "\u2713 Active");
    \u0275\u0275elementEnd();
  }
}
function GalleryDeleteComponent_div_11_span_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275text(1, "Inactive");
    \u0275\u0275elementEnd();
  }
}
function GalleryDeleteComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 15)(2, "div", 16)(3, "div", 17);
    \u0275\u0275text(4, "\u26A0\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div")(6, "h3", 18);
    \u0275\u0275text(7, "Warning: Permanent Deletion");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 19);
    \u0275\u0275text(9, " You are about to permanently delete this gallery image. This action cannot be undone. The image file will be removed from the server. ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(10, "div", 20)(11, "h3", 21);
    \u0275\u0275text(12, "Image Details:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 22);
    \u0275\u0275element(14, "img", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 24)(16, "span", 25);
    \u0275\u0275text(17, "Title:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 26);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 24)(21, "span", 25);
    \u0275\u0275text(22, "Filename:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span", 26);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 24)(26, "span", 25);
    \u0275\u0275text(27, "Location:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "span", 26);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 24)(31, "span", 25);
    \u0275\u0275text(32, "Status:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 26);
    \u0275\u0275template(34, GalleryDeleteComponent_div_11_span_34_Template, 2, 0, "span", 27)(35, GalleryDeleteComponent_div_11_span_35_Template, 2, 0, "span", 28);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div", 24)(37, "span", 25);
    \u0275\u0275text(38, "Uploaded:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "span", 26);
    \u0275\u0275text(40);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div", 29)(42, "div", 30)(43, "p", 31);
    \u0275\u0275text(44, " Are you absolutely sure you want to delete this image? ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(45, "div", 32)(46, "button", 33);
    \u0275\u0275listener("click", function GalleryDeleteComponent_div_11_Template_button_click_46_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.confirmDelete());
    });
    \u0275\u0275text(47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "button", 3);
    \u0275\u0275listener("click", function GalleryDeleteComponent_div_11_Template_button_click_48_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cancel());
    });
    \u0275\u0275text(49, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "a", 13);
    \u0275\u0275text(51, "Edit Instead");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(14);
    \u0275\u0275property("src", "/assets/img/gallery/" + ctx_r0.image.filename, \u0275\u0275sanitizeUrl)("alt", ctx_r0.image.title);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.image.title);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.image.original_filename);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.image.page_location === "gallery" ? "Gallery Page" : "About Page");
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r0.image.is_active);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.image.is_active);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.image.uploaded_at);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u{1F5D1}\uFE0F ", ctx_r0.loading ? "Deleting..." : "Yes, Delete Image", " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(11, _c06, ctx_r0.imageId));
  }
}
var GalleryDeleteComponent = class _GalleryDeleteComponent {
  route;
  router;
  galleryService;
  imageId = null;
  image = null;
  loading = false;
  error = null;
  constructor(route, router, galleryService) {
    this.route = route;
    this.router = router;
    this.galleryService = galleryService;
  }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.imageId = parseInt(id, 10);
      this.loadImage();
    } else {
      this.router.navigate(["/admin/gallery"]);
    }
  }
  loadImage() {
    if (!this.imageId)
      return;
    this.loading = true;
    this.galleryService.getById(this.imageId).subscribe({
      next: (image) => {
        this.image = image;
        this.loading = false;
      },
      error: () => {
        this.error = "Gallery image not found";
        this.loading = false;
      }
    });
  }
  confirmDelete() {
    if (!this.imageId || this.error)
      return;
    this.loading = true;
    this.galleryService.delete(this.imageId).subscribe({
      next: () => {
        this.router.navigate(["/admin/gallery"]);
      },
      error: (err) => {
        this.error = err.message || "Failed to delete gallery image";
        this.loading = false;
      }
    });
  }
  cancel() {
    this.router.navigate(["/admin/gallery"]);
  }
  static \u0275fac = function GalleryDeleteComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GalleryDeleteComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(GalleryService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GalleryDeleteComponent, selectors: [["app-gallery-delete"]], standalone: false, decls: 12, vars: 3, consts: [[1, "content-header"], [1, "section-subtitle"], [1, "action-bar"], [1, "btn", "btn-secondary", 3, "click"], [1, "section"], ["class", "loading-container", 4, "ngIf"], ["class", "alert alert-error", 4, "ngIf"], ["style", "max-width: 700px;", 4, "ngIf"], [1, "loading-container"], [1, "alert", "alert-error"], [2, "margin-top", "20px"], ["routerLink", "/admin/gallery", 1, "btn", "btn-secondary"], ["class", "btn btn-primary", 3, "routerLink", 4, "ngIf"], [1, "btn", "btn-primary", 3, "routerLink"], [2, "max-width", "700px"], [2, "background", "#fff3cd", "border-left", "4px solid #ffc107", "padding", "20px", "border-radius", "8px", "margin-bottom", "30px"], [2, "display", "flex", "align-items", "flex-start", "gap", "15px"], [2, "font-size", "2rem"], [2, "margin", "0 0 10px 0", "color", "#856404"], [2, "margin", "0", "color", "#856404", "line-height", "1.6"], [1, "admin-form"], [2, "margin-bottom", "20px", "color", "#2d3561"], [2, "text-align", "center", "margin-bottom", "20px"], [2, "max-width", "300px", "max-height", "300px", "border-radius", "8px", "box-shadow", "0 2px 8px rgba(0,0,0,0.1)", 3, "src", "alt"], [1, "info-row"], [1, "info-label"], [1, "info-value"], ["class", "badge badge-success", 4, "ngIf"], ["class", "badge badge-inactive", 4, "ngIf"], [2, "margin-top", "30px", "padding-top", "20px", "border-top", "1px solid #e0e0e0"], [2, "background", "#ffebee", "padding", "15px", "border-radius", "8px", "margin-bottom", "20px"], [2, "margin", "0", "color", "#c62828", "font-weight", "600"], [1, "form-actions", 2, "margin", "0", "padding", "0", "border", "none"], [1, "btn", "btn-danger", 3, "click", "disabled"], [1, "badge", "badge-success"], [1, "badge", "badge-inactive"]], template: function GalleryDeleteComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Delete Gallery Image");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 1);
      \u0275\u0275text(4, "Permanently remove image from the gallery");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
      \u0275\u0275listener("click", function GalleryDeleteComponent_Template_button_click_6_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(7, " \u2190 Back to Gallery ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 4);
      \u0275\u0275template(9, GalleryDeleteComponent_div_9_Template, 2, 0, "div", 5)(10, GalleryDeleteComponent_div_10_Template, 6, 2, "div", 6)(11, GalleryDeleteComponent_div_11_Template, 52, 13, "div", 7);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.image && !ctx.error);
    }
  }, dependencies: [NgIf, RouterLink], styles: ["\n\n/*# sourceMappingURL=gallery-delete.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GalleryDeleteComponent, [{
    type: Component,
    args: [{ selector: "app-gallery-delete", standalone: false, template: `<div class="content-header">
  <h1>Delete Gallery Image</h1>
  <p class="section-subtitle">Permanently remove image from the gallery</p>
</div>

<div class="action-bar">
  <button class="btn btn-secondary" (click)="cancel()">
    \u2190 Back to Gallery
  </button>
</div>

<div class="section">
  <div *ngIf="loading" class="loading-container">Loading...</div>

  <div *ngIf="error" class="alert alert-error">
    {{ error }}
    <div style="margin-top: 20px;">
      <a routerLink="/admin/gallery" class="btn btn-secondary">\u2190 Back to Gallery</a>
      <a *ngIf="image" [routerLink]="['/admin/gallery/edit', imageId]" class="btn btn-primary">Edit Image Instead</a>
    </div>
  </div>

  <div *ngIf="image && !error" style="max-width: 700px;">
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <div style="display: flex; align-items: flex-start; gap: 15px;">
        <div style="font-size: 2rem;">\u26A0\uFE0F</div>
        <div>
          <h3 style="margin: 0 0 10px 0; color: #856404;">Warning: Permanent Deletion</h3>
          <p style="margin: 0; color: #856404; line-height: 1.6;">
            You are about to permanently delete this gallery image. This action cannot be undone.
            The image file will be removed from the server.
          </p>
        </div>
      </div>
    </div>

    <div class="admin-form">
      <h3 style="margin-bottom: 20px; color: #2d3561;">Image Details:</h3>

      <!-- Image Preview -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img [src]="'/assets/img/gallery/' + image.filename"
             [alt]="image.title"
             style="max-width: 300px; max-height: 300px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      </div>

      <div class="info-row">
        <span class="info-label">Title:</span>
        <span class="info-value">{{ image.title }}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Filename:</span>
        <span class="info-value">{{ image.original_filename }}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Location:</span>
        <span class="info-value">{{ image.page_location === 'gallery' ? 'Gallery Page' : 'About Page' }}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Status:</span>
        <span class="info-value">
          <span *ngIf="image.is_active" class="badge badge-success">\u2713 Active</span>
          <span *ngIf="!image.is_active" class="badge badge-inactive">Inactive</span>
        </span>
      </div>

      <div class="info-row">
        <span class="info-label">Uploaded:</span>
        <span class="info-value">{{ image.uploaded_at }}</span>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #c62828; font-weight: 600;">
            Are you absolutely sure you want to delete this image?
          </p>
        </div>

        <div class="form-actions" style="margin: 0; padding: 0; border: none;">
          <button (click)="confirmDelete()" class="btn btn-danger" [disabled]="loading">
            \u{1F5D1}\uFE0F {{ loading ? 'Deleting...' : 'Yes, Delete Image' }}
          </button>
          <button (click)="cancel()" class="btn btn-secondary">Cancel</button>
          <a [routerLink]="['/admin/gallery/edit', imageId]" class="btn btn-primary">Edit Instead</a>
        </div>
      </div>
    </div>
  </div>
</div>
`, styles: ["/* src/app/admin/gallery/gallery-delete/gallery-delete.component.css */\n/*# sourceMappingURL=gallery-delete.component.css.map */\n"] }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: GalleryService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GalleryDeleteComponent, { className: "GalleryDeleteComponent", filePath: "src/app/admin/gallery/gallery-delete/gallery-delete.component.ts", lineNumber: 12 });
})();

// src/app/admin/services/documents.service.ts
var DocumentsService = class _DocumentsService {
  http;
  apiUrl = "/api/documents.cfc";
  constructor(http) {
    this.http = http;
  }
  /**
   * Get all documents (for admin panel)
   */
  getAll() {
    return this.http.get(`${this.apiUrl}?method=getDocumentsAdmin`).pipe(map((response) => response.data || []), catchError(this.handleError));
  }
  /**
   * Get a single document by ID
   */
  getById(id) {
    return this.http.get(`${this.apiUrl}?method=getDocument&id=${id}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Upload a new document
   */
  upload(formData) {
    return this.http.post(`${this.apiUrl}?method=uploadDocument`, formData).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Update an existing document
   */
  update(id, data) {
    const params = new URLSearchParams({
      method: "updateDocument",
      id: id.toString(),
      title: data.title,
      description: data.description || "",
      document_type: data.document_type || "",
      is_active: data.is_active.toString()
    });
    return this.http.get(`${this.apiUrl}?${params.toString()}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Delete a document
   */
  delete(id) {
    return this.http.get(`${this.apiUrl}?method=deleteDocument&id=${id}`).pipe(catchError(this.handleError));
  }
  /**
   * Toggle active status of a document
   */
  toggleActive(id) {
    return this.http.get(`${this.apiUrl}?method=toggleActive&id=${id}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Update display order
   */
  updateOrder(id, newOrder) {
    return this.http.get(`${this.apiUrl}?method=updateOrder&id=${id}&newOrder=${newOrder}`).pipe(catchError(this.handleError));
  }
  /**
   * Handle HTTP errors
   */
  handleError(error) {
    let errorMessage = "An error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}
Message: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    console.error("DocumentsService Error:", errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  static \u0275fac = function DocumentsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentsService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DocumentsService, factory: _DocumentsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DocumentsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/admin/documents/document-list/document-list.component.ts
var _c07 = () => [];
function DocumentListComponent_span_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.filteredDocuments.length, " result", ctx_r0.filteredDocuments.length !== 1 ? "s" : "", " found ");
  }
}
function DocumentListComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, " ");
  }
}
function DocumentListComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275element(1, "div", 18);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Loading documents...");
    \u0275\u0275elementEnd()();
  }
}
function DocumentListComponent_div_23_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function DocumentListComponent_div_23_button_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(1));
    });
    \u0275\u0275text(1, "1");
    \u0275\u0275elementEnd();
  }
}
function DocumentListComponent_div_23_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function DocumentListComponent_div_23_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 22);
    \u0275\u0275listener("click", function DocumentListComponent_div_23_button_8_Template_button_click_0_listener() {
      const page_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(page_r5));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", page_r5 === ctx_r0.currentPage);
    \u0275\u0275property("disabled", page_r5 === ctx_r0.currentPage && ctx_r0.getTotalPages() === 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r5, " ");
  }
}
function DocumentListComponent_div_23_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function DocumentListComponent_div_23_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function DocumentListComponent_div_23_button_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.getTotalPages()));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getTotalPages());
  }
}
function DocumentListComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 20);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 21)(4, "button", 22);
    \u0275\u0275listener("click", function DocumentListComponent_div_23_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.previousPage());
    });
    \u0275\u0275text(5, "\xAB Previous");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, DocumentListComponent_div_23_button_6_Template, 2, 0, "button", 23)(7, DocumentListComponent_div_23_span_7_Template, 2, 0, "span", 24)(8, DocumentListComponent_div_23_button_8_Template, 2, 4, "button", 25)(9, DocumentListComponent_div_23_span_9_Template, 2, 0, "span", 24)(10, DocumentListComponent_div_23_button_10_Template, 2, 1, "button", 23);
    \u0275\u0275elementStart(11, "button", 22);
    \u0275\u0275listener("click", function DocumentListComponent_div_23_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.nextPage());
    });
    \u0275\u0275text(12, "Next \xBB");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" Showing ", ctx_r0.getPageStart(), "-", ctx_r0.getPageEnd(), " of ", ctx_r0.filteredDocuments.length, " total ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.getPageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages() - 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage === ctx_r0.getTotalPages());
  }
}
function DocumentListComponent_div_24_tr_15_p_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No documents match your filters");
    \u0275\u0275elementEnd();
  }
}
function DocumentListComponent_div_24_tr_15_p_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No documents found.");
    \u0275\u0275elementEnd();
  }
}
function DocumentListComponent_div_24_tr_15_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 37);
    \u0275\u0275listener("click", function DocumentListComponent_div_24_tr_15_button_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.uploadNew());
    });
    \u0275\u0275text(1, " Upload Your First Document ");
    \u0275\u0275elementEnd();
  }
}
function DocumentListComponent_div_24_tr_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 34)(2, "div", 35);
    \u0275\u0275template(3, DocumentListComponent_div_24_tr_15_p_3_Template, 2, 0, "p", 32)(4, DocumentListComponent_div_24_tr_15_p_4_Template, 2, 0, "p", 32)(5, DocumentListComponent_div_24_tr_15_button_5_Template, 2, 0, "button", 36);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r0.searchQuery || ctx_r0.statusFilter !== "all");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.searchQuery && ctx_r0.statusFilter === "all");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.searchQuery && ctx_r0.statusFilter === "all");
  }
}
function DocumentListComponent_div_24_tr_16_option_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const idx_r10 = ctx.index;
    const document_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", idx_r10 + 1)("selected", document_r9.display_order === idx_r10 + 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", idx_r10 + 1, " ");
  }
}
function DocumentListComponent_div_24_tr_16_br_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "br");
  }
}
function DocumentListComponent_div_24_tr_16_small_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 53);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const document_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", document_r9.description.length > 100 ? document_r9.description.substring(0, 100) + "..." : document_r9.description, " ");
  }
}
function DocumentListComponent_div_24_tr_16_span_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const document_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u2022 ", document_r9.document_type);
  }
}
function DocumentListComponent_div_24_tr_16_span_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1, "\u2713 Active");
    \u0275\u0275elementEnd();
  }
}
function DocumentListComponent_div_24_tr_16_span_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 55);
    \u0275\u0275text(1, "Inactive");
    \u0275\u0275elementEnd();
  }
}
function DocumentListComponent_div_24_tr_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 38)(2, "select", 39);
    \u0275\u0275listener("change", function DocumentListComponent_div_24_tr_16_Template_select_change_2_listener($event) {
      const document_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.updateDisplayOrder(document_r9, $event.target.value));
    });
    \u0275\u0275template(3, DocumentListComponent_div_24_tr_16_option_3_Template, 2, 3, "option", 40);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 41)(5, "div");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td", 42)(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275template(10, DocumentListComponent_div_24_tr_16_br_10_Template, 1, 0, "br", 32)(11, DocumentListComponent_div_24_tr_16_small_11_Template, 2, 1, "small", 43);
    \u0275\u0275element(12, "br");
    \u0275\u0275elementStart(13, "small", 44);
    \u0275\u0275text(14);
    \u0275\u0275template(15, DocumentListComponent_div_24_tr_16_span_15_Template, 2, 1, "span", 32);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td", 45);
    \u0275\u0275template(17, DocumentListComponent_div_24_tr_16_span_17_Template, 2, 0, "span", 46)(18, DocumentListComponent_div_24_tr_16_span_18_Template, 2, 0, "span", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td", 48)(20, "button", 49);
    \u0275\u0275listener("click", function DocumentListComponent_div_24_tr_16_Template_button_click_20_listener() {
      const document_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.edit(document_r9.id));
    });
    \u0275\u0275text(21, " \u270F\uFE0F ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "button", 50);
    \u0275\u0275listener("click", function DocumentListComponent_div_24_tr_16_Template_button_click_22_listener() {
      const document_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleActive(document_r9));
    });
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "button", 51);
    \u0275\u0275listener("click", function DocumentListComponent_div_24_tr_16_Template_button_click_24_listener() {
      const document_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.deleteDocument(document_r9));
    });
    \u0275\u0275text(25, " \u{1F5D1}\uFE0F ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const document_r9 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", \u0275\u0275pureFunction0(14, _c07).constructor(ctx_r0.documents.length));
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r0.getDocIconClass(document_r9.file_extension));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getDocumentIcon(document_r9.file_extension), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(document_r9.title);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", document_r9.description);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", document_r9.description);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", document_r9.original_filename, " (", ctx_r0.formatFileSize(document_r9.file_size), ") ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", document_r9.document_type);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", document_r9.is_active);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !document_r9.is_active);
    \u0275\u0275advance(4);
    \u0275\u0275property("title", document_r9.is_active ? "Toggle Active/Inactive" : "Toggle Active/Inactive");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", document_r9.is_active ? "\u{1F441}\uFE0F" : "\u{1F6AB}", " ");
  }
}
function DocumentListComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "table", 29)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Order");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Icon");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Document Details");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 30);
    \u0275\u0275text(11, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 31);
    \u0275\u0275text(13, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody");
    \u0275\u0275template(15, DocumentListComponent_div_24_tr_15_Template, 6, 3, "tr", 32)(16, DocumentListComponent_div_24_tr_16_Template, 26, 15, "tr", 33);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(15);
    \u0275\u0275property("ngIf", ctx_r0.filteredDocuments.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.getPaginatedDocuments());
  }
}
function DocumentListComponent_div_25_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function DocumentListComponent_div_25_button_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(1));
    });
    \u0275\u0275text(1, "1");
    \u0275\u0275elementEnd();
  }
}
function DocumentListComponent_div_25_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function DocumentListComponent_div_25_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 22);
    \u0275\u0275listener("click", function DocumentListComponent_div_25_button_8_Template_button_click_0_listener() {
      const page_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(page_r14));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r14 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", page_r14 === ctx_r0.currentPage);
    \u0275\u0275property("disabled", page_r14 === ctx_r0.currentPage && ctx_r0.getTotalPages() === 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r14, " ");
  }
}
function DocumentListComponent_div_25_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function DocumentListComponent_div_25_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function DocumentListComponent_div_25_button_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.getTotalPages()));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getTotalPages());
  }
}
function DocumentListComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 20);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 21)(4, "button", 22);
    \u0275\u0275listener("click", function DocumentListComponent_div_25_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.previousPage());
    });
    \u0275\u0275text(5, "\xAB Previous");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, DocumentListComponent_div_25_button_6_Template, 2, 0, "button", 23)(7, DocumentListComponent_div_25_span_7_Template, 2, 0, "span", 24)(8, DocumentListComponent_div_25_button_8_Template, 2, 4, "button", 25)(9, DocumentListComponent_div_25_span_9_Template, 2, 0, "span", 24)(10, DocumentListComponent_div_25_button_10_Template, 2, 1, "button", 23);
    \u0275\u0275elementStart(11, "button", 22);
    \u0275\u0275listener("click", function DocumentListComponent_div_25_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.nextPage());
    });
    \u0275\u0275text(12, "Next \xBB");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" Showing ", ctx_r0.getPageStart(), "-", ctx_r0.getPageEnd(), " of ", ctx_r0.filteredDocuments.length, " total ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.getPageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages() - 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage === ctx_r0.getTotalPages());
  }
}
var DocumentListComponent = class _DocumentListComponent {
  documentsService;
  router;
  documents = [];
  filteredDocuments = [];
  loading = false;
  error = null;
  searchQuery = "";
  statusFilter = "all";
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  constructor(documentsService, router) {
    this.documentsService = documentsService;
    this.router = router;
  }
  ngOnInit() {
    this.loadDocuments();
  }
  /**
   * Load all documents from API
   */
  loadDocuments() {
    this.loading = true;
    this.error = null;
    this.documentsService.getAll().subscribe({
      next: (data) => {
        this.documents = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || "Failed to load documents";
        this.loading = false;
        console.error("Error loading documents:", err);
      }
    });
  }
  /**
   * Apply search and status filters
   */
  applyFilters() {
    let filtered = [...this.documents];
    if (this.statusFilter === "active") {
      filtered = filtered.filter((doc) => doc.is_active);
    } else if (this.statusFilter === "inactive") {
      filtered = filtered.filter((doc) => !doc.is_active);
    }
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((doc) => doc.title.toLowerCase().includes(query) || doc.description && doc.description.toLowerCase().includes(query) || doc.original_filename.toLowerCase().includes(query));
    }
    this.filteredDocuments = filtered;
  }
  /**
   * Handle search input
   */
  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }
  /**
   * Handle status filter change
   */
  onStatusFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }
  /**
   * Navigate to upload page
   */
  uploadNew() {
    this.router.navigate(["/admin/documents/upload"]);
  }
  /**
   * Navigate to edit page
   */
  edit(id) {
    this.router.navigate(["/admin/documents/edit", id]);
  }
  /**
   * Toggle active status
   */
  toggleActive(document2) {
    this.documentsService.toggleActive(document2.id).subscribe({
      next: (updated) => {
        const index = this.documents.findIndex((doc) => doc.id === document2.id);
        if (index !== -1) {
          this.documents[index] = updated;
        }
        const filteredIndex = this.filteredDocuments.findIndex((doc) => doc.id === document2.id);
        if (filteredIndex !== -1) {
          this.filteredDocuments[filteredIndex] = updated;
        }
      },
      error: (err) => {
        this.error = "Failed to toggle status";
        console.error("Error toggling status:", err);
      }
    });
  }
  /**
   * Navigate to delete confirmation page
   */
  deleteDocument(document2) {
    this.router.navigate(["/admin/documents/delete", document2.id]);
  }
  /**
   * Update display order
   */
  updateDisplayOrder(document2, newOrder) {
    this.documentsService.updateOrder(document2.id, newOrder).subscribe({
      next: () => {
        this.loadDocuments();
      },
      error: (err) => {
        this.error = "Failed to update order";
        console.error("Error updating order:", err);
      }
    });
  }
  /**
   * Get document icon based on file extension
   */
  getDocumentIcon(extension) {
    const ext = extension.toLowerCase().replace(".", "");
    switch (ext) {
      case "pdf":
        return "\u{1F4C4}";
      case "doc":
      case "docx":
        return "\u{1F4DD}";
      case "xls":
      case "xlsx":
        return "\u{1F4CA}";
      case "ppt":
      case "pptx":
        return "\u{1F4FD}\uFE0F";
      default:
        return "\u{1F4C1}";
    }
  }
  /**
   * Get document icon CSS class
   */
  getDocIconClass(extension) {
    const ext = extension.toLowerCase().replace(".", "");
    return `doc-icon ${ext}`;
  }
  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (bytes < 1024)
      return bytes + " B";
    const kb = bytes / 1024;
    if (kb < 1024)
      return kb.toFixed(1) + " KB";
    const mb = kb / 1024;
    return mb.toFixed(2) + " MB";
  }
  /**
   * Get paginated documents for current page
   */
  getPaginatedDocuments() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredDocuments.slice(startIndex, endIndex);
  }
  /**
   * Get total number of pages
   */
  getTotalPages() {
    return Math.max(1, Math.ceil(this.filteredDocuments.length / this.itemsPerPage));
  }
  /**
   * Get page numbers to display
   */
  getPageNumbers() {
    const totalPages = this.getTotalPages();
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  getPageStart() {
    if (this.filteredDocuments.length === 0)
      return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  getPageEnd() {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredDocuments.length);
  }
  goToPage(page) {
    this.currentPage = page;
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }
  static \u0275fac = function DocumentListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentListComponent)(\u0275\u0275directiveInject(DocumentsService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DocumentListComponent, selectors: [["app-document-list"]], standalone: false, decls: 26, vars: 9, consts: [[1, "content-header"], [1, "section"], [1, "section-header"], [1, "btn", "btn-primary", 3, "click"], [1, "search-container"], ["type", "text", "placeholder", "Search by title, description, or filename...", 1, "search-input", 3, "ngModelChange", "input", "ngModel"], [1, "status-filter", 3, "ngModelChange", "change", "ngModel"], ["value", "all"], ["value", "active"], ["value", "inactive"], ["class", "search-results", 4, "ngIf"], ["class", "alert alert-error", 4, "ngIf"], ["class", "loading-container", 4, "ngIf"], ["class", "pagination-container", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], [1, "search-results"], [1, "alert", "alert-error"], [1, "loading-container"], [1, "spinner"], [1, "pagination-container"], [1, "pagination-info"], [1, "pagination-controls"], [1, "pagination-btn", 3, "click", "disabled"], ["class", "pagination-btn", 3, "click", 4, "ngIf"], ["style", "padding: 0 8px; color: #666;", 4, "ngIf"], ["class", "pagination-btn", 3, "active", "disabled", "click", 4, "ngFor", "ngForOf"], [1, "pagination-btn", 3, "click"], [2, "padding", "0 8px", "color", "#666"], [1, "table-container"], ["id", "documents-table", 1, "data-table"], [1, "col-status"], [1, "actions"], [4, "ngIf"], [4, "ngFor", "ngForOf"], ["colspan", "5", 1, "text-center"], [1, "empty-state"], ["class", "btn btn-primary btn-sm", 3, "click", 4, "ngIf"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], ["data-label", "ORDER", 1, "text-center"], [1, "order-select", 3, "change"], [3, "value", "selected", 4, "ngFor", "ngForOf"], ["data-label", "ICON"], ["data-label", "DOCUMENT DETAILS"], ["class", "doc-description", 4, "ngIf"], [1, "file-info"], ["data-label", "STATUS", 1, "col-status"], ["class", "badge badge-success", 4, "ngIf"], ["class", "badge badge-inactive", 4, "ngIf"], ["data-label", "ACTIONS", 1, "actions"], ["title", "Edit", 1, "btn", "btn-sm", "btn-edit", 3, "click"], [1, "btn", "btn-sm", "btn-toggle", 3, "click", "title"], ["title", "Delete", 1, "btn", "btn-sm", "btn-delete", 3, "click"], [3, "value", "selected"], [1, "doc-description"], [1, "badge", "badge-success"], [1, "badge", "badge-inactive"]], template: function DocumentListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Documents Management");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4, "Manage downloadable resources and documents");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 1)(6, "div", 2)(7, "h2");
      \u0275\u0275text(8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "button", 3);
      \u0275\u0275listener("click", function DocumentListComponent_Template_button_click_9_listener() {
        return ctx.uploadNew();
      });
      \u0275\u0275text(10, " + Upload New Document ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 4)(12, "input", 5);
      \u0275\u0275twoWayListener("ngModelChange", function DocumentListComponent_Template_input_ngModelChange_12_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
        return $event;
      });
      \u0275\u0275listener("input", function DocumentListComponent_Template_input_input_12_listener() {
        return ctx.onSearch();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "select", 6);
      \u0275\u0275twoWayListener("ngModelChange", function DocumentListComponent_Template_select_ngModelChange_13_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.statusFilter, $event) || (ctx.statusFilter = $event);
        return $event;
      });
      \u0275\u0275listener("change", function DocumentListComponent_Template_select_change_13_listener() {
        return ctx.onStatusFilterChange();
      });
      \u0275\u0275elementStart(14, "option", 7);
      \u0275\u0275text(15, "All Statuses");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "option", 8);
      \u0275\u0275text(17, "Active");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "option", 9);
      \u0275\u0275text(19, "Inactive");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(20, DocumentListComponent_span_20_Template, 2, 2, "span", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275template(21, DocumentListComponent_div_21_Template, 2, 1, "div", 11)(22, DocumentListComponent_div_22_Template, 4, 0, "div", 12)(23, DocumentListComponent_div_23_Template, 13, 10, "div", 13)(24, DocumentListComponent_div_24_Template, 17, 2, "div", 14)(25, DocumentListComponent_div_25_Template, 13, 10, "div", 13);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate1("All Documents (", ctx.documents.length, ")");
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("ngModel", ctx.statusFilter);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ctx.searchQuery || ctx.statusFilter !== "all");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.filteredDocuments.length > 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.filteredDocuments.length > 0);
    }
  }, dependencies: [NgForOf, NgIf, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel], styles: ["\n\n.search-container[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  display: flex;\n  gap: 15px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.search-input[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 250px;\n  max-width: 400px;\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.search-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.status-filter[_ngcontent-%COMP%] {\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  background: #ffffff;\n  color: #333;\n  font-size: 0.95rem;\n  cursor: pointer;\n  min-width: 150px;\n}\n.status-filter[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.search-results[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 20px;\n  padding: 20px 0;\n  border-top: 1px solid #e0e0e0;\n}\n.pagination-info[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-controls[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n}\n.pagination-btn[_ngcontent-%COMP%] {\n  padding: 8px 12px;\n  border: 1px solid #ddd;\n  background: #ffffff;\n  color: #333;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n}\n.pagination-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #f5f5f5;\n  border-color: #4a90e2;\n}\n.pagination-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination-btn.active[_ngcontent-%COMP%] {\n  background: #4a90e2;\n  color: #ffffff;\n  border-color: #4a90e2;\n}\n.doc-icon[_ngcontent-%COMP%] {\n  width: 50px;\n  height: 50px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #f0f0f0;\n  border-radius: 6px;\n  font-size: 24px;\n  border: 2px solid #e0e0e0;\n}\n.doc-icon.pdf[_ngcontent-%COMP%] {\n  background: #ffebee;\n  border-color: #ef5350;\n}\n.doc-icon.doc[_ngcontent-%COMP%], \n.doc-icon.docx[_ngcontent-%COMP%] {\n  background: #e3f2fd;\n  border-color: #42a5f5;\n}\n.doc-icon.xls[_ngcontent-%COMP%], \n.doc-icon.xlsx[_ngcontent-%COMP%] {\n  background: #e8f5e9;\n  border-color: #66bb6a;\n}\n.doc-icon.ppt[_ngcontent-%COMP%], \n.doc-icon.pptx[_ngcontent-%COMP%] {\n  background: #fff3e0;\n  border-color: #ff9800;\n}\n.file-info[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #999;\n}\n.doc-description[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #666;\n  margin-top: 4px;\n}\n.order-select[_ngcontent-%COMP%] {\n  padding: 5px 8px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  font-size: 14px;\n  cursor: pointer;\n}\n.order-select[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n}\n/*# sourceMappingURL=document-list.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DocumentListComponent, [{
    type: Component,
    args: [{ selector: "app-document-list", standalone: false, template: `<!-- Content Header -->\r
<div class="content-header">\r
  <h1>Documents Management</h1>\r
  <p>Manage downloadable resources and documents</p>\r
</div>\r
\r
<div class="section">\r
  <!-- Section Header with Upload Button -->\r
  <div class="section-header">\r
    <h2>All Documents ({{ documents.length }})</h2>\r
    <button class="btn btn-primary" (click)="uploadNew()">\r
      + Upload New Document\r
    </button>\r
  </div>\r
\r
  <!-- Search and Filter -->\r
  <div class="search-container">\r
    <input\r
      type="text"\r
      class="search-input"\r
      placeholder="Search by title, description, or filename..."\r
      [(ngModel)]="searchQuery"\r
      (input)="onSearch()"\r
    />\r
\r
    <select class="status-filter" [(ngModel)]="statusFilter" (change)="onStatusFilterChange()">\r
      <option value="all">All Statuses</option>\r
      <option value="active">Active</option>\r
      <option value="inactive">Inactive</option>\r
    </select>\r
\r
    <span class="search-results" *ngIf="searchQuery || statusFilter !== 'all'">\r
      {{ filteredDocuments.length }} result{{ filteredDocuments.length !== 1 ? 's' : '' }} found\r
    </span>\r
  </div>\r
\r
  <!-- Error Message -->\r
  <div class="alert alert-error" *ngIf="error">\r
    {{ error }}\r
  </div>\r
\r
  <!-- Loading State -->\r
  <div class="loading-container" *ngIf="loading">\r
    <div class="spinner"></div>\r
    <p>Loading documents...</p>\r
  </div>\r
\r
  <!-- Pagination Info (Top) -->\r
  <div class="pagination-container" *ngIf="!loading && filteredDocuments.length > 0">\r
    <div class="pagination-info">\r
      Showing {{ getPageStart() }}-{{ getPageEnd() }} of {{ filteredDocuments.length }} total\r
    </div>\r
    <div class="pagination-controls">\r
      <button class="pagination-btn" (click)="previousPage()" [disabled]="currentPage === 1">\xAB Previous</button>\r
\r
      <button class="pagination-btn" (click)="goToPage(1)" *ngIf="getPageNumbers()[0] > 1">1</button>\r
      <span *ngIf="getPageNumbers()[0] > 2" style="padding: 0 8px; color: #666;">...</span>\r
\r
      <button\r
        *ngFor="let page of getPageNumbers()"\r
        class="pagination-btn"\r
        [class.active]="page === currentPage"\r
        [disabled]="page === currentPage && getTotalPages() === 1"\r
        (click)="goToPage(page)">\r
        {{ page }}\r
      </button>\r
\r
      <span *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1" style="padding: 0 8px; color: #666;">...</span>\r
      <button class="pagination-btn" (click)="goToPage(getTotalPages())" *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages()">{{ getTotalPages() }}</button>\r
\r
      <button class="pagination-btn" (click)="nextPage()" [disabled]="currentPage === getTotalPages()">Next \xBB</button>\r
    </div>\r
  </div>\r
\r
  <!-- Documents Table -->\r
  <div class="table-container" *ngIf="!loading">\r
    <table class="data-table" id="documents-table">\r
      <thead>\r
        <tr>\r
          <th>Order</th>\r
          <th>Icon</th>\r
          <th>Document Details</th>\r
          <th class="col-status">Status</th>\r
          <th class="actions">Actions</th>\r
        </tr>\r
      </thead>\r
      <tbody>\r
        <!-- Empty State -->\r
        <tr *ngIf="filteredDocuments.length === 0">\r
          <td colspan="5" class="text-center">\r
            <div class="empty-state">\r
              <p *ngIf="searchQuery || statusFilter !== 'all'">No documents match your filters</p>\r
              <p *ngIf="!searchQuery && statusFilter === 'all'">No documents found.</p>\r
              <button class="btn btn-primary btn-sm" (click)="uploadNew()" *ngIf="!searchQuery && statusFilter === 'all'">\r
                Upload Your First Document\r
              </button>\r
            </div>\r
          </td>\r
        </tr>\r
\r
        <!-- Data Rows -->\r
        <tr *ngFor="let document of getPaginatedDocuments()">\r
          <!-- Display Order Dropdown -->\r
          <td data-label="ORDER" class="text-center">\r
            <select\r
              class="order-select"\r
              (change)="updateDisplayOrder(document, $any($event.target).value)"\r
            >\r
              <option\r
                *ngFor="let i of [].constructor(documents.length); let idx = index"\r
                [value]="idx + 1"\r
                [selected]="document.display_order === (idx + 1)">\r
                {{ idx + 1 }}\r
              </option>\r
            </select>\r
          </td>\r
\r
          <!-- Document Icon -->\r
          <td data-label="ICON">\r
            <div [class]="getDocIconClass(document.file_extension)">\r
              {{ getDocumentIcon(document.file_extension) }}\r
            </div>\r
          </td>\r
\r
          <!-- Document Details -->\r
          <td data-label="DOCUMENT DETAILS">\r
            <strong>{{ document.title }}</strong>\r
            <br *ngIf="document.description">\r
            <small class="doc-description" *ngIf="document.description">\r
              {{ document.description.length > 100 ? document.description.substring(0, 100) + '...' : document.description }}\r
            </small>\r
            <br>\r
            <small class="file-info">\r
              {{ document.original_filename }} ({{ formatFileSize(document.file_size) }})\r
              <span *ngIf="document.document_type"> \u2022 {{ document.document_type }}</span>\r
            </small>\r
          </td>\r
\r
          <!-- Status Badge -->\r
          <td data-label="STATUS" class="col-status">\r
            <span class="badge badge-success" *ngIf="document.is_active">\u2713 Active</span>\r
            <span class="badge badge-inactive" *ngIf="!document.is_active">Inactive</span>\r
          </td>\r
\r
          <!-- Actions -->\r
          <td data-label="ACTIONS" class="actions">\r
            <button\r
              class="btn btn-sm btn-edit"\r
              (click)="edit(document.id)"\r
              title="Edit"\r
            >\r
              \u270F\uFE0F\r
            </button>\r
\r
            <button\r
              class="btn btn-sm btn-toggle"\r
              (click)="toggleActive(document)"\r
              [title]="document.is_active ? 'Toggle Active/Inactive' : 'Toggle Active/Inactive'"\r
            >\r
              {{ document.is_active ? '\u{1F441}\uFE0F' : '\u{1F6AB}' }}\r
            </button>\r
\r
            <button\r
              class="btn btn-sm btn-delete"\r
              (click)="deleteDocument(document)"\r
              title="Delete"\r
            >\r
              \u{1F5D1}\uFE0F\r
            </button>\r
          </td>\r
        </tr>\r
      </tbody>\r
    </table>\r
  </div>\r
\r
  <!-- Pagination (Bottom) -->\r
  <div class="pagination-container" *ngIf="!loading && filteredDocuments.length > 0">\r
    <div class="pagination-info">\r
      Showing {{ getPageStart() }}-{{ getPageEnd() }} of {{ filteredDocuments.length }} total\r
    </div>\r
    <div class="pagination-controls">\r
      <button class="pagination-btn" (click)="previousPage()" [disabled]="currentPage === 1">\xAB Previous</button>\r
\r
      <button class="pagination-btn" (click)="goToPage(1)" *ngIf="getPageNumbers()[0] > 1">1</button>\r
      <span *ngIf="getPageNumbers()[0] > 2" style="padding: 0 8px; color: #666;">...</span>\r
\r
      <button\r
        *ngFor="let page of getPageNumbers()"\r
        class="pagination-btn"\r
        [class.active]="page === currentPage"\r
        [disabled]="page === currentPage && getTotalPages() === 1"\r
        (click)="goToPage(page)">\r
        {{ page }}\r
      </button>\r
\r
      <span *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1" style="padding: 0 8px; color: #666;">...</span>\r
      <button class="pagination-btn" (click)="goToPage(getTotalPages())" *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages()">{{ getTotalPages() }}</button>\r
\r
      <button class="pagination-btn" (click)="nextPage()" [disabled]="currentPage === getTotalPages()">Next \xBB</button>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/admin/documents/document-list/document-list.component.css */\n.search-container {\n  margin-bottom: 20px;\n  display: flex;\n  gap: 15px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.search-input {\n  flex: 1;\n  min-width: 250px;\n  max-width: 400px;\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.search-input:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.status-filter {\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  background: #ffffff;\n  color: #333;\n  font-size: 0.95rem;\n  cursor: pointer;\n  min-width: 150px;\n}\n.status-filter:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.search-results {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 20px;\n  padding: 20px 0;\n  border-top: 1px solid #e0e0e0;\n}\n.pagination-info {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-controls {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n}\n.pagination-btn {\n  padding: 8px 12px;\n  border: 1px solid #ddd;\n  background: #ffffff;\n  color: #333;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n}\n.pagination-btn:hover:not(:disabled) {\n  background: #f5f5f5;\n  border-color: #4a90e2;\n}\n.pagination-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination-btn.active {\n  background: #4a90e2;\n  color: #ffffff;\n  border-color: #4a90e2;\n}\n.doc-icon {\n  width: 50px;\n  height: 50px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #f0f0f0;\n  border-radius: 6px;\n  font-size: 24px;\n  border: 2px solid #e0e0e0;\n}\n.doc-icon.pdf {\n  background: #ffebee;\n  border-color: #ef5350;\n}\n.doc-icon.doc,\n.doc-icon.docx {\n  background: #e3f2fd;\n  border-color: #42a5f5;\n}\n.doc-icon.xls,\n.doc-icon.xlsx {\n  background: #e8f5e9;\n  border-color: #66bb6a;\n}\n.doc-icon.ppt,\n.doc-icon.pptx {\n  background: #fff3e0;\n  border-color: #ff9800;\n}\n.file-info {\n  font-size: 12px;\n  color: #999;\n}\n.doc-description {\n  font-size: 13px;\n  color: #666;\n  margin-top: 4px;\n}\n.order-select {\n  padding: 5px 8px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  font-size: 14px;\n  cursor: pointer;\n}\n.order-select:focus {\n  outline: none;\n  border-color: #4a90e2;\n}\n/*# sourceMappingURL=document-list.component.css.map */\n"] }]
  }], () => [{ type: DocumentsService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DocumentListComponent, { className: "DocumentListComponent", filePath: "src/app/admin/documents/document-list/document-list.component.ts", lineNumber: 12 });
})();

// src/app/admin/documents/document-upload/document-upload.component.ts
function DocumentUploadComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, "\n");
  }
}
var DocumentUploadComponent = class _DocumentUploadComponent {
  router;
  documentsService;
  loading = false;
  error = null;
  selectedFile = null;
  formData = {
    title: "",
    description: "",
    document_type: "",
    is_active: false
  };
  constructor(router, documentsService) {
    this.router = router;
    this.documentsService = documentsService;
  }
  onFileSelected(event) {
    const file = event.target.files[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ];
      if (!validTypes.includes(file.type)) {
        this.error = "Invalid file type. Only PDF, Word, Excel, and PowerPoint files are allowed.";
        this.selectedFile = null;
        return;
      }
      if (file.size > 10485760) {
        this.error = "File size exceeds 10MB maximum. Please choose a smaller document.";
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
      this.error = null;
    }
  }
  onSubmit() {
    if (!this.formData.title.trim()) {
      this.error = "Document Title is required";
      return;
    }
    if (!this.selectedFile) {
      this.error = "Document File is required";
      return;
    }
    this.loading = true;
    this.error = null;
    const uploadData = new FormData();
    uploadData.append("document_file", this.selectedFile);
    uploadData.append("title", this.formData.title);
    uploadData.append("description", this.formData.description || "");
    uploadData.append("document_type", this.formData.document_type || "");
    uploadData.append("is_active", this.formData.is_active ? "1" : "0");
    this.documentsService.upload(uploadData).subscribe({
      next: () => {
        this.router.navigate(["/admin/documents"]);
      },
      error: (err) => {
        this.error = err.message || "Failed to upload document";
        this.loading = false;
        console.error("Error uploading document:", err);
      }
    });
  }
  cancel() {
    this.router.navigate(["/admin/documents"]);
  }
  static \u0275fac = function DocumentUploadComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentUploadComponent)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(DocumentsService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DocumentUploadComponent, selectors: [["app-document-upload"]], standalone: false, decls: 48, vars: 8, consts: [[1, "content-header"], [1, "section-subtitle"], [1, "action-bar"], [1, "btn", "btn-secondary", 3, "click"], ["class", "alert alert-error", 4, "ngIf"], [1, "admin-form", 3, "ngSubmit"], [1, "form-group"], ["for", "title"], [1, "required"], ["type", "text", "id", "title", "name", "title", "placeholder", "Enter document title", "maxlength", "255", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-help"], ["for", "description"], ["id", "description", "name", "description", "placeholder", "Brief description of this document", "rows", "3", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "document_file"], ["type", "file", "id", "document_file", "name", "document_file", "accept", ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx", "required", "", 1, "form-control", 3, "change"], ["for", "document_type"], ["type", "text", "id", "document_type", "name", "document_type", "placeholder", "e.g., Workshop Materials, Registration Form, etc.", "maxlength", "100", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "checkbox-label"], ["type", "checkbox", "name", "is_active", 3, "ngModelChange", "ngModel"], [1, "form-actions"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 1, "btn", "btn-secondary", 3, "click", "disabled"], [1, "alert", "alert-error"]], template: function DocumentUploadComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Upload New Document");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 1);
      \u0275\u0275text(4, "Add a new document to resources");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
      \u0275\u0275listener("click", function DocumentUploadComponent_Template_button_click_6_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(7, " \u2190 Back to Documents ");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(8, DocumentUploadComponent_div_8_Template, 2, 1, "div", 4);
      \u0275\u0275elementStart(9, "form", 5);
      \u0275\u0275listener("ngSubmit", function DocumentUploadComponent_Template_form_ngSubmit_9_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(10, "div", 6)(11, "label", 7);
      \u0275\u0275text(12, "Document Title ");
      \u0275\u0275elementStart(13, "span", 8);
      \u0275\u0275text(14, "*");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "input", 9);
      \u0275\u0275twoWayListener("ngModelChange", function DocumentUploadComponent_Template_input_ngModelChange_15_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.formData.title, $event) || (ctx.formData.title = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "small", 10);
      \u0275\u0275text(17, "This title will be displayed on the website");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 6)(19, "label", 11);
      \u0275\u0275text(20, "Description");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "textarea", 12);
      \u0275\u0275twoWayListener("ngModelChange", function DocumentUploadComponent_Template_textarea_ngModelChange_21_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.formData.description, $event) || (ctx.formData.description = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "small", 10);
      \u0275\u0275text(23, "Optional description shown with the document");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "div", 6)(25, "label", 13);
      \u0275\u0275text(26, "Document File ");
      \u0275\u0275elementStart(27, "span", 8);
      \u0275\u0275text(28, "*");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "input", 14);
      \u0275\u0275listener("change", function DocumentUploadComponent_Template_input_change_29_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "small", 10);
      \u0275\u0275text(31, "Supported formats: PDF, Word, Excel, PowerPoint (Max 10MB)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "div", 6)(33, "label", 15);
      \u0275\u0275text(34, "Document Type");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "input", 16);
      \u0275\u0275twoWayListener("ngModelChange", function DocumentUploadComponent_Template_input_ngModelChange_35_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.formData.document_type, $event) || (ctx.formData.document_type = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "small", 10);
      \u0275\u0275text(37, "Optional category or type for this document");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(38, "div", 6)(39, "label", 17)(40, "input", 18);
      \u0275\u0275twoWayListener("ngModelChange", function DocumentUploadComponent_Template_input_ngModelChange_40_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.formData.is_active, $event) || (ctx.formData.is_active = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "span");
      \u0275\u0275text(42, "Active (visible on website)");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(43, "div", 19)(44, "button", 20);
      \u0275\u0275text(45);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "button", 21);
      \u0275\u0275listener("click", function DocumentUploadComponent_Template_button_click_46_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(47, " Cancel ");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.title);
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.description);
      \u0275\u0275advance(14);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.document_type);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.is_active);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.loading ? "Uploading..." : "Upload Document", " ");
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.loading);
    }
  }, dependencies: [NgIf, \u0275NgNoValidate, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, NgModel, NgForm], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DocumentUploadComponent, [{
    type: Component,
    args: [{ selector: "app-document-upload", standalone: false, template: `<!-- Content Header -->\r
<div class="content-header">\r
  <h1>Upload New Document</h1>\r
  <p class="section-subtitle">Add a new document to resources</p>\r
</div>\r
\r
<!-- Back Button -->\r
<div class="action-bar">\r
  <button class="btn btn-secondary" (click)="cancel()">\r
    \u2190 Back to Documents\r
  </button>\r
</div>\r
\r
<!-- Error Message -->\r
<div class="alert alert-error" *ngIf="error">\r
  {{ error }}\r
</div>\r
\r
<!-- Upload Form -->\r
<form class="admin-form" (ngSubmit)="onSubmit()">\r
  <!-- Document Title -->\r
  <div class="form-group">\r
    <label for="title">Document Title <span class="required">*</span></label>\r
    <input\r
      type="text"\r
      id="title"\r
      name="title"\r
      class="form-control"\r
      [(ngModel)]="formData.title"\r
      placeholder="Enter document title"\r
      maxlength="255"\r
      required\r
    />\r
    <small class="form-help">This title will be displayed on the website</small>\r
  </div>\r
\r
  <!-- Description -->\r
  <div class="form-group">\r
    <label for="description">Description</label>\r
    <textarea\r
      id="description"\r
      name="description"\r
      class="form-control"\r
      [(ngModel)]="formData.description"\r
      placeholder="Brief description of this document"\r
      rows="3"\r
    ></textarea>\r
    <small class="form-help">Optional description shown with the document</small>\r
  </div>\r
\r
  <!-- Document File Upload -->\r
  <div class="form-group">\r
    <label for="document_file">Document File <span class="required">*</span></label>\r
    <input\r
      type="file"\r
      id="document_file"\r
      name="document_file"\r
      class="form-control"\r
      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"\r
      (change)="onFileSelected($event)"\r
      required\r
    />\r
    <small class="form-help">Supported formats: PDF, Word, Excel, PowerPoint (Max 10MB)</small>\r
  </div>\r
\r
  <!-- Document Type -->\r
  <div class="form-group">\r
    <label for="document_type">Document Type</label>\r
    <input\r
      type="text"\r
      id="document_type"\r
      name="document_type"\r
      class="form-control"\r
      [(ngModel)]="formData.document_type"\r
      placeholder="e.g., Workshop Materials, Registration Form, etc."\r
      maxlength="100"\r
    />\r
    <small class="form-help">Optional category or type for this document</small>\r
  </div>\r
\r
  <!-- Is Active Checkbox -->\r
  <div class="form-group">\r
    <label class="checkbox-label">\r
      <input\r
        type="checkbox"\r
        name="is_active"\r
        [(ngModel)]="formData.is_active"\r
      />\r
      <span>Active (visible on website)</span>\r
    </label>\r
  </div>\r
\r
  <!-- Form Actions -->\r
  <div class="form-actions">\r
    <button\r
      type="submit"\r
      class="btn btn-primary"\r
      [disabled]="loading"\r
    >\r
      {{ loading ? 'Uploading...' : 'Upload Document' }}\r
    </button>\r
\r
    <button\r
      type="button"\r
      class="btn btn-secondary"\r
      (click)="cancel()"\r
      [disabled]="loading"\r
    >\r
      Cancel\r
    </button>\r
  </div>\r
</form>\r
` }]
  }], () => [{ type: Router }, { type: DocumentsService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DocumentUploadComponent, { className: "DocumentUploadComponent", filePath: "src/app/admin/documents/document-upload/document-upload.component.ts", lineNumber: 11 });
})();

// src/app/admin/documents/document-edit/document-edit.component.ts
function DocumentEditComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, "\n");
  }
}
function DocumentEditComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "div", 9);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Loading document...");
    \u0275\u0275elementEnd()();
  }
}
function DocumentEditComponent_form_10_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "label");
    \u0275\u0275text(2, "Current Document");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 26)(4, "div");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div")(7, "div")(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 27);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx_r0.getDocIconClass(ctx_r0.document.file_extension));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getDocumentIcon(ctx_r0.document.file_extension), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.document.original_filename);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatFileSize(ctx_r0.document.file_size));
  }
}
function DocumentEditComponent_form_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 10);
    \u0275\u0275listener("ngSubmit", function DocumentEditComponent_form_10_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmit());
    });
    \u0275\u0275template(1, DocumentEditComponent_form_10_div_1_Template, 12, 5, "div", 11);
    \u0275\u0275elementStart(2, "div", 12)(3, "label", 13);
    \u0275\u0275text(4, "Document Title ");
    \u0275\u0275elementStart(5, "span", 14);
    \u0275\u0275text(6, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "input", 15);
    \u0275\u0275twoWayListener("ngModelChange", function DocumentEditComponent_form_10_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.title, $event) || (ctx_r0.formData.title = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "small", 16);
    \u0275\u0275text(9, "This title will be displayed on the website");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 12)(11, "label", 17);
    \u0275\u0275text(12, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "textarea", 18);
    \u0275\u0275twoWayListener("ngModelChange", function DocumentEditComponent_form_10_Template_textarea_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.description, $event) || (ctx_r0.formData.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "small", 16);
    \u0275\u0275text(15, "Optional description shown with the document");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 12)(17, "label", 19);
    \u0275\u0275text(18, "Document Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "input", 20);
    \u0275\u0275twoWayListener("ngModelChange", function DocumentEditComponent_form_10_Template_input_ngModelChange_19_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.document_type, $event) || (ctx_r0.formData.document_type = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "small", 16);
    \u0275\u0275text(21, "Optional category or type for this document");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 12)(23, "label", 21)(24, "input", 22);
    \u0275\u0275twoWayListener("ngModelChange", function DocumentEditComponent_form_10_Template_input_ngModelChange_24_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.is_active, $event) || (ctx_r0.formData.is_active = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "span");
    \u0275\u0275text(26, "Active (visible on website)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "div", 23)(28, "button", 24);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "button", 25);
    \u0275\u0275listener("click", function DocumentEditComponent_form_10_Template_button_click_30_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cancel());
    });
    \u0275\u0275text(31, " Cancel ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.document);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.title);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.description);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.document_type);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.is_active);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.loading ? "Saving..." : "Update Document", " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.loading);
  }
}
var DocumentEditComponent = class _DocumentEditComponent {
  route;
  router;
  documentsService;
  documentId = null;
  loading = false;
  error = null;
  document = null;
  formData = {
    title: "",
    description: "",
    document_type: "",
    is_active: false
  };
  constructor(route, router, documentsService) {
    this.route = route;
    this.router = router;
    this.documentsService = documentsService;
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.documentId = +params["id"];
        this.loadDocument();
      }
    });
  }
  loadDocument() {
    if (!this.documentId)
      return;
    this.loading = true;
    this.error = null;
    this.documentsService.getById(this.documentId).subscribe({
      next: (data) => {
        this.document = data;
        this.formData = {
          title: data.title,
          description: data.description || "",
          document_type: data.document_type || "",
          is_active: data.is_active
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load document";
        this.loading = false;
        console.error("Error loading document:", err);
      }
    });
  }
  onSubmit() {
    if (!this.formData.title.trim()) {
      this.error = "Document Title is required";
      return;
    }
    this.loading = true;
    this.error = null;
    if (this.documentId) {
      this.documentsService.update(this.documentId, this.formData).subscribe({
        next: () => {
          this.router.navigate(["/admin/documents"]);
        },
        error: (err) => {
          this.error = err.message || "Failed to update document";
          this.loading = false;
          console.error("Error updating document:", err);
        }
      });
    }
  }
  cancel() {
    this.router.navigate(["/admin/documents"]);
  }
  getDocumentIcon(extension) {
    const ext = extension.toLowerCase().replace(".", "");
    switch (ext) {
      case "pdf":
        return "\u{1F4C4}";
      case "doc":
      case "docx":
        return "\u{1F4DD}";
      case "xls":
      case "xlsx":
        return "\u{1F4CA}";
      case "ppt":
      case "pptx":
        return "\u{1F4FD}\uFE0F";
      default:
        return "\u{1F4C1}";
    }
  }
  getDocIconClass(extension) {
    const ext = extension.toLowerCase().replace(".", "");
    return `doc-icon ${ext}`;
  }
  formatFileSize(bytes) {
    if (bytes < 1024)
      return bytes + " B";
    const kb = bytes / 1024;
    if (kb < 1024)
      return kb.toFixed(1) + " KB";
    const mb = kb / 1024;
    return mb.toFixed(2) + " MB";
  }
  static \u0275fac = function DocumentEditComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentEditComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(DocumentsService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DocumentEditComponent, selectors: [["app-document-edit"]], standalone: false, decls: 11, vars: 3, consts: [[1, "content-header"], [1, "section-subtitle"], [1, "action-bar"], [1, "btn", "btn-secondary", 3, "click"], ["class", "alert alert-error", 4, "ngIf"], ["class", "loading-container", 4, "ngIf"], ["class", "admin-form", 3, "ngSubmit", 4, "ngIf"], [1, "alert", "alert-error"], [1, "loading-container"], [1, "spinner"], [1, "admin-form", 3, "ngSubmit"], ["class", "form-group", 4, "ngIf"], [1, "form-group"], ["for", "title"], [1, "required"], ["type", "text", "id", "title", "name", "title", "placeholder", "Enter document title", "maxlength", "255", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-help"], ["for", "description"], ["id", "description", "name", "description", "placeholder", "Brief description of this document", "rows", "3", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "document_type"], ["type", "text", "id", "document_type", "name", "document_type", "placeholder", "e.g., Workshop Materials, Registration Form, etc.", "maxlength", "100", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "checkbox-label"], ["type", "checkbox", "name", "is_active", 3, "ngModelChange", "ngModel"], [1, "form-actions"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 1, "btn", "btn-secondary", 3, "click", "disabled"], [1, "document-info"], [1, "file-info"]], template: function DocumentEditComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Edit Document");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 1);
      \u0275\u0275text(4, "Update document details");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
      \u0275\u0275listener("click", function DocumentEditComponent_Template_button_click_6_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(7, " \u2190 Back to Documents ");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(8, DocumentEditComponent_div_8_Template, 2, 1, "div", 4)(9, DocumentEditComponent_div_9_Template, 4, 0, "div", 5)(10, DocumentEditComponent_form_10_Template, 32, 8, "form", 6);
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading && !ctx.formData.title);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading || ctx.formData.title);
    }
  }, dependencies: [NgIf, \u0275NgNoValidate, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, NgModel, NgForm], styles: ["\n\n.document-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  padding: 15px;\n  background: #f8f9fa;\n  border-radius: 8px;\n  border: 2px solid #e0e0e0;\n}\n.doc-icon[_ngcontent-%COMP%] {\n  width: 60px;\n  height: 60px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #f0f0f0;\n  border-radius: 6px;\n  font-size: 28px;\n  border: 2px solid #e0e0e0;\n  flex-shrink: 0;\n}\n.doc-icon.pdf[_ngcontent-%COMP%] {\n  background: #ffebee;\n  border-color: #ef5350;\n}\n.doc-icon.doc[_ngcontent-%COMP%], \n.doc-icon.docx[_ngcontent-%COMP%] {\n  background: #e3f2fd;\n  border-color: #42a5f5;\n}\n.doc-icon.xls[_ngcontent-%COMP%], \n.doc-icon.xlsx[_ngcontent-%COMP%] {\n  background: #e8f5e9;\n  border-color: #66bb6a;\n}\n.doc-icon.ppt[_ngcontent-%COMP%], \n.doc-icon.pptx[_ngcontent-%COMP%] {\n  background: #fff3e0;\n  border-color: #ff9800;\n}\n.file-info[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #999;\n}\n/*# sourceMappingURL=document-edit.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DocumentEditComponent, [{
    type: Component,
    args: [{ selector: "app-document-edit", standalone: false, template: `<!-- Content Header -->\r
<div class="content-header">\r
  <h1>Edit Document</h1>\r
  <p class="section-subtitle">Update document details</p>\r
</div>\r
\r
<!-- Back Button -->\r
<div class="action-bar">\r
  <button class="btn btn-secondary" (click)="cancel()">\r
    \u2190 Back to Documents\r
  </button>\r
</div>\r
\r
<!-- Error Message -->\r
<div class="alert alert-error" *ngIf="error">\r
  {{ error }}\r
</div>\r
\r
<!-- Loading State -->\r
<div class="loading-container" *ngIf="loading && !formData.title">\r
  <div class="spinner"></div>\r
  <p>Loading document...</p>\r
</div>\r
\r
<!-- Edit Form -->\r
<form class="admin-form" (ngSubmit)="onSubmit()" *ngIf="!loading || formData.title">\r
  <!-- Current Document Info -->\r
  <div class="form-group" *ngIf="document">\r
    <label>Current Document</label>\r
    <div class="document-info">\r
      <div [class]="getDocIconClass(document.file_extension)">\r
        {{ getDocumentIcon(document.file_extension) }}\r
      </div>\r
      <div>\r
        <div><strong>{{ document.original_filename }}</strong></div>\r
        <div class="file-info">{{ formatFileSize(document.file_size) }}</div>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Document Title -->\r
  <div class="form-group">\r
    <label for="title">Document Title <span class="required">*</span></label>\r
    <input\r
      type="text"\r
      id="title"\r
      name="title"\r
      class="form-control"\r
      [(ngModel)]="formData.title"\r
      placeholder="Enter document title"\r
      maxlength="255"\r
      required\r
    />\r
    <small class="form-help">This title will be displayed on the website</small>\r
  </div>\r
\r
  <!-- Description -->\r
  <div class="form-group">\r
    <label for="description">Description</label>\r
    <textarea\r
      id="description"\r
      name="description"\r
      class="form-control"\r
      [(ngModel)]="formData.description"\r
      placeholder="Brief description of this document"\r
      rows="3"\r
    ></textarea>\r
    <small class="form-help">Optional description shown with the document</small>\r
  </div>\r
\r
  <!-- Document Type -->\r
  <div class="form-group">\r
    <label for="document_type">Document Type</label>\r
    <input\r
      type="text"\r
      id="document_type"\r
      name="document_type"\r
      class="form-control"\r
      [(ngModel)]="formData.document_type"\r
      placeholder="e.g., Workshop Materials, Registration Form, etc."\r
      maxlength="100"\r
    />\r
    <small class="form-help">Optional category or type for this document</small>\r
  </div>\r
\r
  <!-- Is Active Checkbox -->\r
  <div class="form-group">\r
    <label class="checkbox-label">\r
      <input\r
        type="checkbox"\r
        name="is_active"\r
        [(ngModel)]="formData.is_active"\r
      />\r
      <span>Active (visible on website)</span>\r
    </label>\r
  </div>\r
\r
  <!-- Form Actions -->\r
  <div class="form-actions">\r
    <button\r
      type="submit"\r
      class="btn btn-primary"\r
      [disabled]="loading"\r
    >\r
      {{ loading ? 'Saving...' : 'Update Document' }}\r
    </button>\r
\r
    <button\r
      type="button"\r
      class="btn btn-secondary"\r
      (click)="cancel()"\r
      [disabled]="loading"\r
    >\r
      Cancel\r
    </button>\r
  </div>\r
</form>\r
`, styles: ["/* src/app/admin/documents/document-edit/document-edit.component.css */\n.document-info {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  padding: 15px;\n  background: #f8f9fa;\n  border-radius: 8px;\n  border: 2px solid #e0e0e0;\n}\n.doc-icon {\n  width: 60px;\n  height: 60px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #f0f0f0;\n  border-radius: 6px;\n  font-size: 28px;\n  border: 2px solid #e0e0e0;\n  flex-shrink: 0;\n}\n.doc-icon.pdf {\n  background: #ffebee;\n  border-color: #ef5350;\n}\n.doc-icon.doc,\n.doc-icon.docx {\n  background: #e3f2fd;\n  border-color: #42a5f5;\n}\n.doc-icon.xls,\n.doc-icon.xlsx {\n  background: #e8f5e9;\n  border-color: #66bb6a;\n}\n.doc-icon.ppt,\n.doc-icon.pptx {\n  background: #fff3e0;\n  border-color: #ff9800;\n}\n.file-info {\n  font-size: 12px;\n  color: #999;\n}\n/*# sourceMappingURL=document-edit.component.css.map */\n"] }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: DocumentsService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DocumentEditComponent, { className: "DocumentEditComponent", filePath: "src/app/admin/documents/document-edit/document-edit.component.ts", lineNumber: 12 });
})();

// src/app/admin/documents/document-delete/document-delete.component.ts
var _c08 = (a0) => ["/admin/documents/edit", a0];
function DocumentDeleteComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1, "Loading...");
    \u0275\u0275elementEnd();
  }
}
function DocumentDeleteComponent_div_10_a_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 13);
    \u0275\u0275text(1, "Edit Document Instead");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c08, ctx_r0.documentId));
  }
}
function DocumentDeleteComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "div", 10)(3, "a", 11);
    \u0275\u0275text(4, "\u2190 Back to Documents");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, DocumentDeleteComponent_div_10_a_5_Template, 2, 3, "a", 12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.document);
  }
}
function DocumentDeleteComponent_div_11_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "span", 23);
    \u0275\u0275text(2, "Description:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 24);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.document.description);
  }
}
function DocumentDeleteComponent_div_11_div_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "span", 23);
    \u0275\u0275text(2, "Document Type:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 24);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.document.document_type);
  }
}
function DocumentDeleteComponent_div_11_span_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 33);
    \u0275\u0275text(1, "\u2713 Active");
    \u0275\u0275elementEnd();
  }
}
function DocumentDeleteComponent_div_11_span_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1, "Inactive");
    \u0275\u0275elementEnd();
  }
}
function DocumentDeleteComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 15)(2, "div", 16)(3, "div", 17);
    \u0275\u0275text(4, "\u26A0\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div")(6, "h3", 18);
    \u0275\u0275text(7, "Warning: Permanent Deletion");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 19);
    \u0275\u0275text(9, " You are about to permanently delete this document. This action cannot be undone. The document file will be removed from the server. ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(10, "div", 20)(11, "h3", 21);
    \u0275\u0275text(12, "Document Details:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 22)(14, "span", 23);
    \u0275\u0275text(15, "Title:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 24);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(18, DocumentDeleteComponent_div_11_div_18_Template, 5, 1, "div", 25);
    \u0275\u0275elementStart(19, "div", 22)(20, "span", 23);
    \u0275\u0275text(21, "Filename:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 24);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 22)(25, "span", 23);
    \u0275\u0275text(26, "File Type:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span", 24);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(29, DocumentDeleteComponent_div_11_div_29_Template, 5, 1, "div", 25);
    \u0275\u0275elementStart(30, "div", 22)(31, "span", 23);
    \u0275\u0275text(32, "File Size:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 24);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 22)(36, "span", 23);
    \u0275\u0275text(37, "Status:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "span", 24);
    \u0275\u0275template(39, DocumentDeleteComponent_div_11_span_39_Template, 2, 0, "span", 26)(40, DocumentDeleteComponent_div_11_span_40_Template, 2, 0, "span", 27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div", 22)(42, "span", 23);
    \u0275\u0275text(43, "Uploaded:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "span", 24);
    \u0275\u0275text(45);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 28)(47, "div", 29)(48, "p", 30);
    \u0275\u0275text(49, " Are you absolutely sure you want to delete this document? ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "div", 31)(51, "button", 32);
    \u0275\u0275listener("click", function DocumentDeleteComponent_div_11_Template_button_click_51_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.confirmDelete());
    });
    \u0275\u0275text(52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "button", 3);
    \u0275\u0275listener("click", function DocumentDeleteComponent_div_11_Template_button_click_53_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cancel());
    });
    \u0275\u0275text(54, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "a", 13);
    \u0275\u0275text(56, "Edit Instead");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(17);
    \u0275\u0275textInterpolate(ctx_r0.document.title);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.document.description);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.document.original_filename);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.document.file_extension.toUpperCase());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.document.document_type);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", (ctx_r0.document.file_size / 1024).toFixed(2), " KB");
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r0.document.is_active);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.document.is_active);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.document.uploaded_at);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u{1F5D1}\uFE0F ", ctx_r0.loading ? "Deleting..." : "Yes, Delete Document", " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(12, _c08, ctx_r0.documentId));
  }
}
var DocumentDeleteComponent = class _DocumentDeleteComponent {
  route;
  router;
  documentsService;
  documentId = null;
  document = null;
  loading = false;
  error = null;
  constructor(route, router, documentsService) {
    this.route = route;
    this.router = router;
    this.documentsService = documentsService;
  }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.documentId = parseInt(id, 10);
      this.loadDocument();
    } else {
      this.router.navigate(["/admin/documents"]);
    }
  }
  loadDocument() {
    if (!this.documentId)
      return;
    this.loading = true;
    this.documentsService.getById(this.documentId).subscribe({
      next: (document2) => {
        this.document = document2;
        this.loading = false;
      },
      error: () => {
        this.error = "Document not found";
        this.loading = false;
      }
    });
  }
  confirmDelete() {
    if (!this.documentId || this.error)
      return;
    this.loading = true;
    this.documentsService.delete(this.documentId).subscribe({
      next: () => {
        this.router.navigate(["/admin/documents"]);
      },
      error: (err) => {
        this.error = err.message || "Failed to delete document";
        this.loading = false;
      }
    });
  }
  cancel() {
    this.router.navigate(["/admin/documents"]);
  }
  static \u0275fac = function DocumentDeleteComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentDeleteComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(DocumentsService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DocumentDeleteComponent, selectors: [["app-document-delete"]], standalone: false, decls: 12, vars: 3, consts: [[1, "content-header"], [1, "section-subtitle"], [1, "action-bar"], [1, "btn", "btn-secondary", 3, "click"], [1, "section"], ["class", "loading-container", 4, "ngIf"], ["class", "alert alert-error", 4, "ngIf"], ["style", "max-width: 700px;", 4, "ngIf"], [1, "loading-container"], [1, "alert", "alert-error"], [2, "margin-top", "20px"], ["routerLink", "/admin/documents", 1, "btn", "btn-secondary"], ["class", "btn btn-primary", 3, "routerLink", 4, "ngIf"], [1, "btn", "btn-primary", 3, "routerLink"], [2, "max-width", "700px"], [2, "background", "#fff3cd", "border-left", "4px solid #ffc107", "padding", "20px", "border-radius", "8px", "margin-bottom", "30px"], [2, "display", "flex", "align-items", "flex-start", "gap", "15px"], [2, "font-size", "2rem"], [2, "margin", "0 0 10px 0", "color", "#856404"], [2, "margin", "0", "color", "#856404", "line-height", "1.6"], [1, "admin-form"], [2, "margin-bottom", "20px", "color", "#2d3561"], [1, "info-row"], [1, "info-label"], [1, "info-value"], ["class", "info-row", 4, "ngIf"], ["class", "badge badge-success", 4, "ngIf"], ["class", "badge badge-inactive", 4, "ngIf"], [2, "margin-top", "30px", "padding-top", "20px", "border-top", "1px solid #e0e0e0"], [2, "background", "#ffebee", "padding", "15px", "border-radius", "8px", "margin-bottom", "20px"], [2, "margin", "0", "color", "#c62828", "font-weight", "600"], [1, "form-actions", 2, "margin", "0", "padding", "0", "border", "none"], [1, "btn", "btn-danger", 3, "click", "disabled"], [1, "badge", "badge-success"], [1, "badge", "badge-inactive"]], template: function DocumentDeleteComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Delete Document");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 1);
      \u0275\u0275text(4, "Permanently remove document from the website");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
      \u0275\u0275listener("click", function DocumentDeleteComponent_Template_button_click_6_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(7, " \u2190 Back to Documents ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 4);
      \u0275\u0275template(9, DocumentDeleteComponent_div_9_Template, 2, 0, "div", 5)(10, DocumentDeleteComponent_div_10_Template, 6, 2, "div", 6)(11, DocumentDeleteComponent_div_11_Template, 57, 14, "div", 7);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.document && !ctx.error);
    }
  }, dependencies: [NgIf, RouterLink], styles: ["\n\n/*# sourceMappingURL=document-delete.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DocumentDeleteComponent, [{
    type: Component,
    args: [{ selector: "app-document-delete", standalone: false, template: `<div class="content-header">
  <h1>Delete Document</h1>
  <p class="section-subtitle">Permanently remove document from the website</p>
</div>

<div class="action-bar">
  <button class="btn btn-secondary" (click)="cancel()">
    \u2190 Back to Documents
  </button>
</div>

<div class="section">
  <div *ngIf="loading" class="loading-container">Loading...</div>

  <div *ngIf="error" class="alert alert-error">
    {{ error }}
    <div style="margin-top: 20px;">
      <a routerLink="/admin/documents" class="btn btn-secondary">\u2190 Back to Documents</a>
      <a *ngIf="document" [routerLink]="['/admin/documents/edit', documentId]" class="btn btn-primary">Edit Document Instead</a>
    </div>
  </div>

  <div *ngIf="document && !error" style="max-width: 700px;">
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <div style="display: flex; align-items: flex-start; gap: 15px;">
        <div style="font-size: 2rem;">\u26A0\uFE0F</div>
        <div>
          <h3 style="margin: 0 0 10px 0; color: #856404;">Warning: Permanent Deletion</h3>
          <p style="margin: 0; color: #856404; line-height: 1.6;">
            You are about to permanently delete this document. This action cannot be undone.
            The document file will be removed from the server.
          </p>
        </div>
      </div>
    </div>

    <div class="admin-form">
      <h3 style="margin-bottom: 20px; color: #2d3561;">Document Details:</h3>

      <div class="info-row">
        <span class="info-label">Title:</span>
        <span class="info-value">{{ document.title }}</span>
      </div>

      <div class="info-row" *ngIf="document.description">
        <span class="info-label">Description:</span>
        <span class="info-value">{{ document.description }}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Filename:</span>
        <span class="info-value">{{ document.original_filename }}</span>
      </div>

      <div class="info-row">
        <span class="info-label">File Type:</span>
        <span class="info-value">{{ document.file_extension.toUpperCase() }}</span>
      </div>

      <div class="info-row" *ngIf="document.document_type">
        <span class="info-label">Document Type:</span>
        <span class="info-value">{{ document.document_type }}</span>
      </div>

      <div class="info-row">
        <span class="info-label">File Size:</span>
        <span class="info-value">{{ (document.file_size / 1024).toFixed(2) }} KB</span>
      </div>

      <div class="info-row">
        <span class="info-label">Status:</span>
        <span class="info-value">
          <span *ngIf="document.is_active" class="badge badge-success">\u2713 Active</span>
          <span *ngIf="!document.is_active" class="badge badge-inactive">Inactive</span>
        </span>
      </div>

      <div class="info-row">
        <span class="info-label">Uploaded:</span>
        <span class="info-value">{{ document.uploaded_at }}</span>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #c62828; font-weight: 600;">
            Are you absolutely sure you want to delete this document?
          </p>
        </div>

        <div class="form-actions" style="margin: 0; padding: 0; border: none;">
          <button (click)="confirmDelete()" class="btn btn-danger" [disabled]="loading">
            \u{1F5D1}\uFE0F {{ loading ? 'Deleting...' : 'Yes, Delete Document' }}
          </button>
          <button (click)="cancel()" class="btn btn-secondary">Cancel</button>
          <a [routerLink]="['/admin/documents/edit', documentId]" class="btn btn-primary">Edit Instead</a>
        </div>
      </div>
    </div>
  </div>
</div>
`, styles: ["/* src/app/admin/documents/document-delete/document-delete.component.css */\n/*# sourceMappingURL=document-delete.component.css.map */\n"] }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: DocumentsService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DocumentDeleteComponent, { className: "DocumentDeleteComponent", filePath: "src/app/admin/documents/document-delete/document-delete.component.ts", lineNumber: 12 });
})();

// src/app/admin/services/contacts.service.ts
var ContactsService = class _ContactsService {
  http;
  apiUrl = "/api/contacts-admin.cfc";
  constructor(http) {
    this.http = http;
  }
  /**
   * Get all contact submissions (for admin panel)
   */
  getAll() {
    return this.http.get(`${this.apiUrl}?method=getSubmissionsAdmin`).pipe(map((response) => response.data || []), catchError(this.handleError));
  }
  /**
   * Get a single submission by ID
   */
  getById(id) {
    return this.http.get(`${this.apiUrl}?method=getSubmission&id=${id}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Update submission status
   */
  updateStatus(id, status) {
    const params = new URLSearchParams({
      method: "updateStatus",
      id: id.toString(),
      status
    });
    return this.http.get(`${this.apiUrl}?${params.toString()}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Update admin notes
   */
  updateAdminNotes(id, adminNotes) {
    const params = new URLSearchParams({
      method: "updateAdminNotes",
      id: id.toString(),
      admin_notes: adminNotes
    });
    return this.http.get(`${this.apiUrl}?${params.toString()}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Get status counts
   */
  getStatusCounts() {
    return this.http.get(`${this.apiUrl}?method=getStatusCounts`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Handle HTTP errors
   */
  handleError(error) {
    let errorMessage = "An error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}
Message: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    console.error("ContactsService Error:", errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  static \u0275fac = function ContactsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ContactsService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ContactsService, factory: _ContactsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContactsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/admin/contacts/contact-list/contact-list.ts
function ContactListComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "p");
    \u0275\u0275text(2, "Loading submissions...");
    \u0275\u0275elementEnd()();
  }
}
function ContactListComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, "\n");
  }
}
function ContactListComponent_div_7_span_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.filteredSubmissions.length, " result", ctx_r0.filteredSubmissions.length !== 1 ? "s" : "", " found ");
  }
}
function ContactListComponent_div_7_div_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "p");
    \u0275\u0275text(2, "No contact submissions found matching your criteria.");
    \u0275\u0275elementEnd()();
  }
}
function ContactListComponent_div_7_button_49_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 35);
    \u0275\u0275listener("click", function ContactListComponent_div_7_button_49_Template_button_click_0_listener() {
      const page_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(page_r4));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r4 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", page_r4 === ctx_r0.currentPage);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r4, " ");
  }
}
function ContactListComponent_div_7_div_52_tr_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 40);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "uppercase");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "td", 41)(6, "div", 42);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 43);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td")(13, "a", 44);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 45);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td", 38)(20, "button", 46);
    \u0275\u0275listener("click", function ContactListComponent_div_7_div_52_tr_19_Template_button_click_20_listener() {
      const submission_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.viewSubmission(submission_r6));
    });
    \u0275\u0275text(21, " \u270F\uFE0F ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const submission_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r0.getStatusBadgeClass(submission_r6.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 9, submission_r6.status), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.formatDateTime(submission_r6.submitted_at).date);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatDateTime(submission_r6.submitted_at).time);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(submission_r6.name);
    \u0275\u0275advance(2);
    \u0275\u0275property("href", "mailto:" + submission_r6.email, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(submission_r6.email);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(submission_r6.subject);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.getMessagePreview(submission_r6.message));
  }
}
function ContactListComponent_div_7_div_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "table", 37)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Date & Time");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Subject");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Preview");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 38);
    \u0275\u0275text(17, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275template(19, ContactListComponent_div_7_div_52_tr_19_Template, 22, 11, "tr", 39);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(19);
    \u0275\u0275property("ngForOf", ctx_r0.getPaginatedSubmissions());
  }
}
function ContactListComponent_div_7_button_59_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 35);
    \u0275\u0275listener("click", function ContactListComponent_div_7_button_59_Template_button_click_0_listener() {
      const page_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.goToPage(page_r8));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r8 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", page_r8 === ctx_r0.currentPage);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r8, " ");
  }
}
function ContactListComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 7)(2, "div", 8)(3, "div", 9);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 10);
    \u0275\u0275text(6, "New");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 11)(8, "div", 9);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 10);
    \u0275\u0275text(11, "Read");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 12)(13, "div", 9);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 10);
    \u0275\u0275text(16, "Replied");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 13)(18, "div", 9);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 10);
    \u0275\u0275text(21, "Archived");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 14)(23, "div", 15)(24, "h2");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "a", 16);
    \u0275\u0275text(27, "\u2699\uFE0F Email Settings");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 17)(29, "input", 18);
    \u0275\u0275twoWayListener("ngModelChange", function ContactListComponent_div_7_Template_input_ngModelChange_29_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.searchQuery, $event) || (ctx_r0.searchQuery = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function ContactListComponent_div_7_Template_input_input_29_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSearch());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function ContactListComponent_div_7_Template_select_ngModelChange_30_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.statusFilter, $event) || (ctx_r0.statusFilter = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ContactListComponent_div_7_Template_select_change_30_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onStatusFilterChange());
    });
    \u0275\u0275elementStart(31, "option", 20);
    \u0275\u0275text(32, "All Statuses");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "option", 21);
    \u0275\u0275text(34, "New");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "option", 22);
    \u0275\u0275text(36, "Read");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "option", 23);
    \u0275\u0275text(38, "Replied");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "option", 24);
    \u0275\u0275text(40, "Archived");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(41, ContactListComponent_div_7_span_41_Template, 2, 2, "span", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275template(42, ContactListComponent_div_7_div_42_Template, 3, 0, "div", 26);
    \u0275\u0275elementStart(43, "div", 27)(44, "div", 28);
    \u0275\u0275text(45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 29)(47, "button", 30);
    \u0275\u0275listener("click", function ContactListComponent_div_7_Template_button_click_47_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.previousPage());
    });
    \u0275\u0275text(48, " \xAB Previous ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(49, ContactListComponent_div_7_button_49_Template, 2, 3, "button", 31);
    \u0275\u0275elementStart(50, "button", 30);
    \u0275\u0275listener("click", function ContactListComponent_div_7_Template_button_click_50_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.nextPage());
    });
    \u0275\u0275text(51, " Next \xBB ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(52, ContactListComponent_div_7_div_52_Template, 20, 1, "div", 32);
    \u0275\u0275elementStart(53, "div", 27)(54, "div", 28);
    \u0275\u0275text(55);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "div", 29)(57, "button", 30);
    \u0275\u0275listener("click", function ContactListComponent_div_7_Template_button_click_57_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.previousPage());
    });
    \u0275\u0275text(58, " \xAB Previous ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(59, ContactListComponent_div_7_button_59_Template, 2, 3, "button", 31);
    \u0275\u0275elementStart(60, "button", 30);
    \u0275\u0275listener("click", function ContactListComponent_div_7_Template_button_click_60_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.nextPage());
    });
    \u0275\u0275text(61, " Next \xBB ");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.statusCounts.new);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.statusCounts.read);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.statusCounts.replied);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.statusCounts.archived);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("All Submissions (", ctx_r0.filteredSubmissions.length, ")");
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.searchQuery);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.statusFilter);
    \u0275\u0275advance(11);
    \u0275\u0275property("ngIf", ctx_r0.searchQuery);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.filteredSubmissions.length === 0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.filteredSubmissions.length > 0 ? "Showing " + ctx_r0.getPageStart() + "-" + ctx_r0.getPageEnd() + " of " + ctx_r0.filteredSubmissions.length + " total" : "No results found", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.getPageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage === ctx_r0.getTotalPages());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.filteredSubmissions.length > 0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.filteredSubmissions.length > 0 ? "Showing " + ctx_r0.getPageStart() + "-" + ctx_r0.getPageEnd() + " of " + ctx_r0.filteredSubmissions.length + " total" : "No results found", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.getPageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage === ctx_r0.getTotalPages());
  }
}
function ContactListComponent_div_8_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.modalError, " ");
  }
}
function ContactListComponent_div_8_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 54)(1, "div", 55)(2, "h3");
    \u0275\u0275text(3, "Submission Information");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 56)(5, "label");
    \u0275\u0275text(6, "Submitted:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 56)(10, "label");
    \u0275\u0275text(11, "IP Address:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 56)(15, "label");
    \u0275\u0275text(16, "Current Status:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 40);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "uppercase");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "div", 55)(21, "h3");
    \u0275\u0275text(22, "Contact Information");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "div", 56)(24, "label");
    \u0275\u0275text(25, "Name:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 56)(29, "label");
    \u0275\u0275text(30, "Email:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span")(32, "a", 57);
    \u0275\u0275text(33);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(34, "div", 56)(35, "label");
    \u0275\u0275text(36, "Subject:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "span");
    \u0275\u0275text(38);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(39, "div", 55)(40, "h3");
    \u0275\u0275text(41, "Message");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "div", 58);
    \u0275\u0275text(43);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "div", 55)(45, "h3");
    \u0275\u0275text(46, "Update Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "div", 59)(48, "label", 60);
    \u0275\u0275text(49, "Status:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "select", 61);
    \u0275\u0275twoWayListener("ngModelChange", function ContactListComponent_div_8_div_8_Template_select_ngModelChange_50_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.modalFormData.status, $event) || (ctx_r0.modalFormData.status = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(51, "option", 21);
    \u0275\u0275text(52, "New");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "option", 22);
    \u0275\u0275text(54, "Read");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "option", 23);
    \u0275\u0275text(56, "Replied");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "option", 24);
    \u0275\u0275text(58, "Archived");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(59, "button", 62);
    \u0275\u0275listener("click", function ContactListComponent_div_8_div_8_Template_button_click_59_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.updateStatus());
    });
    \u0275\u0275text(60);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(61, "div", 55)(62, "h3");
    \u0275\u0275text(63, "Admin Notes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "div", 59)(65, "textarea", 63);
    \u0275\u0275twoWayListener("ngModelChange", function ContactListComponent_div_8_div_8_Template_textarea_ngModelChange_65_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.modalFormData.admin_notes, $event) || (ctx_r0.modalFormData.admin_notes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "button", 62);
    \u0275\u0275listener("click", function ContactListComponent_div_8_div_8_Template_button_click_66_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.saveAdminNotes());
    });
    \u0275\u0275text(67);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate2("", ctx_r0.formatDateTime(ctx_r0.selectedSubmission.submitted_at).date, " at ", ctx_r0.formatDateTime(ctx_r0.selectedSubmission.submitted_at).time);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.selectedSubmission.ip_address);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngClass", ctx_r0.getStatusBadgeClass(ctx_r0.selectedSubmission.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(19, 16, ctx_r0.selectedSubmission.status), " ");
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r0.selectedSubmission.name);
    \u0275\u0275advance(5);
    \u0275\u0275property("href", "mailto:" + ctx_r0.selectedSubmission.email, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.selectedSubmission.email);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.selectedSubmission.subject);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.selectedSubmission.message);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.modalFormData.status);
    \u0275\u0275advance(9);
    \u0275\u0275property("disabled", ctx_r0.modalLoading || ctx_r0.modalFormData.status === ctx_r0.selectedSubmission.status);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.modalLoading ? "Updating..." : "Update Status", " ");
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.modalFormData.admin_notes);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.modalLoading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.modalLoading ? "Saving..." : "Save Notes", " ");
  }
}
function ContactListComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275listener("click", function ContactListComponent_div_8_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeModal());
    });
    \u0275\u0275elementStart(1, "div", 48);
    \u0275\u0275listener("click", function ContactListComponent_div_8_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r9);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 49)(3, "h2");
    \u0275\u0275text(4, "Contact Submission Details");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 50);
    \u0275\u0275listener("click", function ContactListComponent_div_8_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeModal());
    });
    \u0275\u0275text(6, "\xD7");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(7, ContactListComponent_div_8_div_7_Template, 2, 1, "div", 2)(8, ContactListComponent_div_8_div_8_Template, 68, 18, "div", 51);
    \u0275\u0275elementStart(9, "div", 52)(10, "button", 53);
    \u0275\u0275listener("click", function ContactListComponent_div_8_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeModal());
    });
    \u0275\u0275text(11, "Close");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275property("ngIf", ctx_r0.modalError);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedSubmission);
  }
}
var ContactListComponent = class _ContactListComponent {
  contactsService;
  submissions = [];
  filteredSubmissions = [];
  loading = false;
  error = null;
  // Status counts
  statusCounts = {
    new: 0,
    read: 0,
    replied: 0,
    archived: 0
  };
  // Filters
  searchQuery = "";
  statusFilter = "all";
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  // Modal
  selectedSubmission = null;
  showModal = false;
  modalLoading = false;
  modalError = null;
  // Form data for modal
  modalFormData = {
    status: "",
    admin_notes: ""
  };
  constructor(contactsService) {
    this.contactsService = contactsService;
  }
  ngOnInit() {
    this.loadSubmissions();
    this.loadStatusCounts();
  }
  loadSubmissions() {
    this.loading = true;
    this.error = null;
    this.contactsService.getAll().subscribe({
      next: (data) => {
        this.submissions = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load contact submissions";
        this.loading = false;
        console.error("Error loading submissions:", err);
      }
    });
  }
  loadStatusCounts() {
    this.contactsService.getStatusCounts().subscribe({
      next: (data) => {
        this.statusCounts = data;
      },
      error: (err) => {
        console.error("Error loading status counts:", err);
      }
    });
  }
  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }
  onStatusFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }
  applyFilters() {
    let filtered = [...this.submissions];
    if (this.statusFilter !== "all") {
      filtered = filtered.filter((sub) => sub.status === this.statusFilter);
    }
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((sub) => sub.name.toLowerCase().includes(query) || sub.email.toLowerCase().includes(query) || sub.subject.toLowerCase().includes(query) || sub.message.toLowerCase().includes(query));
    }
    this.filteredSubmissions = filtered;
  }
  // Pagination methods
  getPaginatedSubmissions() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredSubmissions.slice(startIndex, endIndex);
  }
  getTotalPages() {
    return Math.ceil(this.filteredSubmissions.length / this.itemsPerPage);
  }
  getPageStart() {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  getPageEnd() {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredSubmissions.length);
  }
  getPageNumbers() {
    const totalPages = this.getTotalPages();
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  goToPage(page) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }
  // Modal methods
  viewSubmission(submission) {
    this.selectedSubmission = submission;
    this.modalFormData = {
      status: submission.status,
      admin_notes: submission.admin_notes || ""
    };
    this.showModal = true;
    this.modalError = null;
  }
  closeModal() {
    this.showModal = false;
    this.selectedSubmission = null;
    this.modalError = null;
  }
  updateStatus() {
    if (!this.selectedSubmission)
      return;
    this.modalLoading = true;
    this.modalError = null;
    this.contactsService.updateStatus(this.selectedSubmission.id, this.modalFormData.status).subscribe({
      next: (updatedSubmission) => {
        const index = this.submissions.findIndex((s) => s.id === updatedSubmission.id);
        if (index !== -1) {
          this.submissions[index] = updatedSubmission;
        }
        this.selectedSubmission = updatedSubmission;
        this.modalFormData.status = updatedSubmission.status;
        this.modalLoading = false;
        this.applyFilters();
        this.loadStatusCounts();
      },
      error: (err) => {
        this.modalError = err.message || "Failed to update status";
        this.modalLoading = false;
      }
    });
  }
  saveAdminNotes() {
    if (!this.selectedSubmission)
      return;
    this.modalLoading = true;
    this.modalError = null;
    this.contactsService.updateAdminNotes(this.selectedSubmission.id, this.modalFormData.admin_notes).subscribe({
      next: (updatedSubmission) => {
        const index = this.submissions.findIndex((s) => s.id === updatedSubmission.id);
        if (index !== -1) {
          this.submissions[index] = updatedSubmission;
        }
        this.selectedSubmission = updatedSubmission;
        this.modalFormData.admin_notes = updatedSubmission.admin_notes || "";
        this.modalLoading = false;
      },
      error: (err) => {
        this.modalError = err.message || "Failed to save admin notes";
        this.modalLoading = false;
      }
    });
  }
  getStatusBadgeClass(status) {
    return `badge badge-${status}`;
  }
  formatDateTime(dateTimeString) {
    if (!dateTimeString)
      return { date: "", time: "" };
    const dt = new Date(dateTimeString);
    const date = dt.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    const time = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    return { date, time };
  }
  getMessagePreview(message) {
    const maxLength = 100;
    if (message.length <= maxLength)
      return message;
    return message.substring(0, maxLength) + "...";
  }
  static \u0275fac = function ContactListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ContactListComponent)(\u0275\u0275directiveInject(ContactsService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ContactListComponent, selectors: [["app-contact-list"]], standalone: false, decls: 9, vars: 4, consts: [[1, "content-header"], ["class", "loading-container", 4, "ngIf"], ["class", "alert alert-danger", 4, "ngIf"], [4, "ngIf"], ["class", "modal-overlay", 3, "click", 4, "ngIf"], [1, "loading-container"], [1, "alert", "alert-danger"], [1, "stats-summary"], [1, "stat-box", "stat-new"], [1, "stat-value"], [1, "stat-label"], [1, "stat-box", "stat-read"], [1, "stat-box", "stat-replied"], [1, "stat-box", "stat-archived"], [1, "section"], [1, "section-header"], ["routerLink", "/admin/contacts/email-settings", 1, "btn", "btn-primary"], [1, "search-container"], ["type", "text", "placeholder", "Search by name, email, subject, or message...", 1, "search-input", 3, "ngModelChange", "input", "ngModel"], ["id", "statusFilter", 1, "status-filter", 3, "ngModelChange", "change", "ngModel"], ["value", "all"], ["value", "new"], ["value", "read"], ["value", "replied"], ["value", "archived"], ["class", "search-results", 4, "ngIf"], ["class", "no-results", 4, "ngIf"], [1, "pagination-container"], [1, "pagination-info"], [1, "pagination-controls"], [1, "pagination-btn", 3, "click", "disabled"], ["class", "pagination-btn", 3, "active", "click", 4, "ngFor", "ngForOf"], ["class", "table-container", 4, "ngIf"], [1, "search-results"], [1, "no-results"], [1, "pagination-btn", 3, "click"], [1, "table-container"], [1, "data-table", "contact-submissions-table"], [1, "actions"], [4, "ngFor", "ngForOf"], [3, "ngClass"], [1, "datetime-cell"], [1, "date"], [1, "time"], [1, "email-link", 3, "href"], [1, "message-preview"], ["title", "Edit Details", 1, "btn", "btn-sm", "btn-edit", 3, "click"], [1, "modal-overlay", 3, "click"], [1, "modal-content", 3, "click"], [1, "modal-header"], [1, "close-btn", 3, "click"], ["class", "modal-body", 4, "ngIf"], [1, "modal-footer"], [1, "btn", "btn-secondary", 3, "click"], [1, "modal-body"], [1, "info-section"], [1, "info-row"], [3, "href"], [1, "message-full"], [1, "form-group"], ["for", "statusSelect"], ["id", "statusSelect", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["rows", "5", "placeholder", "Add internal notes about this submission...", 1, "form-control", "admin-notes-textarea", 3, "ngModelChange", "ngModel"]], template: function ContactListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Contact Submissions");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4, "View and manage contact form submissions");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(5, ContactListComponent_div_5_Template, 3, 0, "div", 1)(6, ContactListComponent_div_6_Template, 2, 1, "div", 2)(7, ContactListComponent_div_7_Template, 62, 18, "div", 3)(8, ContactListComponent_div_8_Template, 12, 2, "div", 4);
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && !ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.showModal);
    }
  }, dependencies: [NgClass, NgForOf, NgIf, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, RouterLink, UpperCasePipe], styles: ["\n\n.content-header[_ngcontent-%COMP%] {\n  margin-bottom: 30px;\n}\n.content-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 28px;\n  font-weight: 600;\n  color: #333;\n  margin: 0 0 8px 0;\n}\n.content-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #666;\n  font-size: 14px;\n}\n.section[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-radius: 8px;\n  padding: 25px;\n  margin-bottom: 30px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n}\n.section-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n  padding-bottom: 20px;\n  border-bottom: 2px solid #f0f0f0;\n}\n.section-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 600;\n  color: #1a1f3a;\n}\n.loading-container[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px;\n  font-size: 18px;\n  color: #666;\n}\n.alert[_ngcontent-%COMP%] {\n  padding: 12px 20px;\n  margin-bottom: 20px;\n  border-radius: 4px;\n}\n.alert-danger[_ngcontent-%COMP%] {\n  background-color: #f8d7da;\n  border: 1px solid #f5c6cb;\n  color: #721c24;\n}\n.stats-summary[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 20px;\n  margin-bottom: 30px;\n}\n.stat-box[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 8px;\n  padding: 20px;\n  text-align: center;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  transition: transform 0.2s;\n}\n.stat-box[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);\n}\n.stat-value[_ngcontent-%COMP%] {\n  font-size: 36px;\n  font-weight: 700;\n  margin-bottom: 8px;\n}\n.stat-label[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 500;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  color: #666;\n}\n.stat-new[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  color: #007bff;\n}\n.stat-read[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  color: #6c757d;\n}\n.stat-replied[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  color: #28a745;\n}\n.stat-archived[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  color: #dc3545;\n}\n.search-container[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  display: flex;\n  gap: 15px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.search-input[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 250px;\n  max-width: 400px;\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.search-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.status-filter[_ngcontent-%COMP%] {\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  background: #ffffff;\n  color: #333;\n  font-size: 0.95rem;\n  cursor: pointer;\n  min-width: 150px;\n}\n.status-filter[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.search-results[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.9rem;\n}\n.no-results[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px;\n  color: #666;\n  font-size: 16px;\n}\n.pagination-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 20px;\n  padding: 20px 0;\n  border-top: 1px solid #e0e0e0;\n}\n.pagination-info[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-controls[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n}\n.pagination-btn[_ngcontent-%COMP%] {\n  padding: 8px 12px;\n  border: 1px solid #ddd;\n  background: #ffffff;\n  color: #333;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n}\n.pagination-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #f5f5f5;\n  border-color: #4a90e2;\n}\n.pagination-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination-btn.active[_ngcontent-%COMP%] {\n  background: #4a90e2;\n  color: #ffffff;\n  border-color: #4a90e2;\n}\n.table-container[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  margin: 20px 0;\n}\n.submissions-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n}\n.submissions-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%] {\n  background: #f8f9fa;\n}\n.submissions-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 12px 15px;\n  text-align: left;\n  font-weight: 600;\n  font-size: 13px;\n  color: #495057;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  border-bottom: 2px solid #dee2e6;\n}\n.submissions-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 12px 15px;\n  border-bottom: 1px solid #dee2e6;\n  font-size: 14px;\n  color: #333;\n}\n.submissions-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: #f8f9fa;\n}\n.datetime-cell[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: #333;\n}\n.datetime-cell[_ngcontent-%COMP%]   .time[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #666;\n  margin-top: 2px;\n}\n.email-link[_ngcontent-%COMP%] {\n  color: #4a90e2;\n  text-decoration: none;\n}\n.email-link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.message-preview[_ngcontent-%COMP%] {\n  max-width: 300px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: #666;\n  font-size: 13px;\n}\n.badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.badge-new[_ngcontent-%COMP%] {\n  background: #fff3e0;\n  color: #e65100;\n}\n.badge-read[_ngcontent-%COMP%] {\n  background: #e3f2fd;\n  color: #1565c0;\n}\n.badge-replied[_ngcontent-%COMP%] {\n  background: #e8f5e9;\n  color: #2e7d32;\n}\n.badge-archived[_ngcontent-%COMP%] {\n  background: #fafafa;\n  color: #666;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 8px 16px;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 14px;\n  font-weight: 500;\n  transition: all 0.3s;\n  text-decoration: none;\n  display: inline-block;\n}\n.btn-sm[_ngcontent-%COMP%] {\n  padding: 6px 12px;\n  font-size: 13px;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background: #4a90e2;\n  color: white;\n}\n.btn-primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #357abd;\n}\n.btn-primary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  background: #6c757d;\n  color: white;\n}\n.btn-secondary[_ngcontent-%COMP%]:hover {\n  background: #545b62;\n}\n.btn-edit[_ngcontent-%COMP%] {\n  padding: 6px 12px;\n  background: #4a90e2;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 16px;\n  transition: all 0.3s;\n}\n.btn-edit[_ngcontent-%COMP%]:hover {\n  background: #357abd;\n  transform: scale(1.05);\n}\n.modal-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n  padding: 20px;\n}\n.modal-content[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 8px;\n  width: 100%;\n  max-width: 800px;\n  max-height: 90vh;\n  overflow-y: auto;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n}\n.modal-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px;\n  border-bottom: 1px solid #dee2e6;\n}\n.modal-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 24px;\n  font-weight: 600;\n  color: #333;\n}\n.close-btn[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  font-size: 32px;\n  color: #999;\n  cursor: pointer;\n  padding: 0;\n  width: 32px;\n  height: 32px;\n  line-height: 1;\n  transition: color 0.2s;\n}\n.close-btn[_ngcontent-%COMP%]:hover {\n  color: #333;\n}\n.modal-body[_ngcontent-%COMP%] {\n  padding: 20px;\n}\n.modal-footer[_ngcontent-%COMP%] {\n  padding: 20px;\n  border-top: 1px solid #dee2e6;\n  text-align: right;\n}\n.info-section[_ngcontent-%COMP%] {\n  margin-bottom: 25px;\n  padding-bottom: 20px;\n  border-bottom: 1px solid #dee2e6;\n}\n.info-section[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n  padding-bottom: 0;\n  margin-bottom: 0;\n}\n.info-section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 600;\n  color: #333;\n  margin-bottom: 15px;\n}\n.info-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 150px 1fr;\n  gap: 15px;\n  margin-bottom: 10px;\n}\n.info-row[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #495057;\n}\n.info-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #333;\n}\n.info-row[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #007bff;\n  text-decoration: none;\n}\n.info-row[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.message-full[_ngcontent-%COMP%] {\n  background: #f8f9fa;\n  padding: 15px;\n  border-radius: 4px;\n  border: 1px solid #dee2e6;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n  line-height: 1.6;\n  color: #333;\n}\n.form-group[_ngcontent-%COMP%] {\n  margin-top: 10px;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 500;\n  color: #495057;\n}\n.form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.form-group[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-bottom: 10px;\n}\n.admin-notes-textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n  min-height: 100px;\n  font-family: inherit;\n}\n@media (max-width: 1200px) {\n  .stats-summary[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 768px) {\n  .stats-summary[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .search-container[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .filter-box[_ngcontent-%COMP%] {\n    justify-content: space-between;\n  }\n  .table-container[_ngcontent-%COMP%] {\n    overflow-x: auto;\n  }\n  .submissions-table[_ngcontent-%COMP%] {\n    min-width: 800px;\n  }\n  .info-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 5px;\n  }\n  .modal-content[_ngcontent-%COMP%] {\n    max-width: 100%;\n  }\n}\n/*# sourceMappingURL=contact-list.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContactListComponent, [{
    type: Component,
    args: [{ selector: "app-contact-list", standalone: false, template: `<div class="content-header">\r
  <h1>Contact Submissions</h1>\r
  <p>View and manage contact form submissions</p>\r
</div>\r
\r
<!-- Loading State -->\r
<div *ngIf="loading" class="loading-container">\r
  <p>Loading submissions...</p>\r
</div>\r
\r
<!-- Error State -->\r
<div *ngIf="error" class="alert alert-danger">\r
  {{ error }}\r
</div>\r
\r
<!-- Main Content -->\r
<div *ngIf="!loading && !error">\r
  <!-- Stats Summary -->\r
  <div class="stats-summary">\r
    <div class="stat-box stat-new">\r
      <div class="stat-value">{{ statusCounts.new }}</div>\r
      <div class="stat-label">New</div>\r
    </div>\r
    <div class="stat-box stat-read">\r
      <div class="stat-value">{{ statusCounts.read }}</div>\r
      <div class="stat-label">Read</div>\r
    </div>\r
    <div class="stat-box stat-replied">\r
      <div class="stat-value">{{ statusCounts.replied }}</div>\r
      <div class="stat-label">Replied</div>\r
    </div>\r
    <div class="stat-box stat-archived">\r
      <div class="stat-value">{{ statusCounts.archived }}</div>\r
      <div class="stat-label">Archived</div>\r
    </div>\r
  </div>\r
\r
  <div class="section">\r
    <!-- Section Header with Email Settings Button -->\r
    <div class="section-header">\r
      <h2>All Submissions ({{ filteredSubmissions.length }})</h2>\r
      <a routerLink="/admin/contacts/email-settings" class="btn btn-primary">\u2699\uFE0F Email Settings</a>\r
    </div>\r
\r
    <!-- Search and Filter Controls -->\r
    <div class="search-container">\r
      <input\r
        type="text"\r
        [(ngModel)]="searchQuery"\r
        (input)="onSearch()"\r
        placeholder="Search by name, email, subject, or message..."\r
        class="search-input">\r
      <select\r
        id="statusFilter"\r
        [(ngModel)]="statusFilter"\r
        (change)="onStatusFilterChange()"\r
        class="status-filter">\r
        <option value="all">All Statuses</option>\r
        <option value="new">New</option>\r
        <option value="read">Read</option>\r
        <option value="replied">Replied</option>\r
        <option value="archived">Archived</option>\r
      </select>\r
      <span class="search-results" *ngIf="searchQuery">\r
        {{ filteredSubmissions.length }} result{{ filteredSubmissions.length !== 1 ? 's' : '' }} found\r
      </span>\r
    </div>\r
\r
    <!-- No Results Message -->\r
    <div *ngIf="filteredSubmissions.length === 0" class="no-results">\r
      <p>No contact submissions found matching your criteria.</p>\r
    </div>\r
\r
    <!-- Pagination (Top) -->\r
    <div class="pagination-container">\r
      <div class="pagination-info">\r
        {{ filteredSubmissions.length > 0 ? 'Showing ' + getPageStart() + '-' + getPageEnd() + ' of ' + filteredSubmissions.length + ' total' : 'No results found' }}\r
      </div>\r
      <div class="pagination-controls">\r
        <button\r
          class="pagination-btn"\r
          (click)="previousPage()"\r
          [disabled]="currentPage === 1">\r
          &laquo; Previous\r
        </button>\r
\r
        <button\r
          *ngFor="let page of getPageNumbers()"\r
          class="pagination-btn"\r
          [class.active]="page === currentPage"\r
          (click)="goToPage(page)">\r
          {{ page }}\r
        </button>\r
\r
        <button\r
          class="pagination-btn"\r
          (click)="nextPage()"\r
          [disabled]="currentPage === getTotalPages()">\r
          Next &raquo;\r
        </button>\r
      </div>\r
    </div>\r
\r
    <!-- Submissions Table -->\r
    <div class="table-container" *ngIf="filteredSubmissions.length > 0">\r
      <table class="data-table contact-submissions-table">\r
        <thead>\r
          <tr>\r
            <th>Status</th>\r
            <th>Date & Time</th>\r
            <th>Name</th>\r
            <th>Email</th>\r
            <th>Subject</th>\r
            <th>Preview</th>\r
            <th class="actions">Actions</th>\r
          </tr>\r
        </thead>\r
        <tbody>\r
          <tr *ngFor="let submission of getPaginatedSubmissions()">\r
            <td>\r
              <span [ngClass]="getStatusBadgeClass(submission.status)">\r
                {{ submission.status | uppercase }}\r
              </span>\r
            </td>\r
            <td class="datetime-cell">\r
              <div class="date">{{ formatDateTime(submission.submitted_at).date }}</div>\r
              <div class="time">{{ formatDateTime(submission.submitted_at).time }}</div>\r
            </td>\r
            <td>{{ submission.name }}</td>\r
            <td>\r
              <a [href]="'mailto:' + submission.email" class="email-link">{{ submission.email }}</a>\r
            </td>\r
            <td>{{ submission.subject }}</td>\r
            <td class="message-preview">{{ getMessagePreview(submission.message) }}</td>\r
            <td class="actions">\r
              <button\r
                class="btn btn-sm btn-edit"\r
                title="Edit Details"\r
                (click)="viewSubmission(submission)">\r
                \u270F\uFE0F\r
              </button>\r
            </td>\r
          </tr>\r
        </tbody>\r
      </table>\r
    </div>\r
\r
    <!-- Pagination (Bottom) -->\r
    <div class="pagination-container">\r
      <div class="pagination-info">\r
        {{ filteredSubmissions.length > 0 ? 'Showing ' + getPageStart() + '-' + getPageEnd() + ' of ' + filteredSubmissions.length + ' total' : 'No results found' }}\r
      </div>\r
      <div class="pagination-controls">\r
        <button\r
          class="pagination-btn"\r
          (click)="previousPage()"\r
          [disabled]="currentPage === 1">\r
          &laquo; Previous\r
        </button>\r
\r
        <button\r
          *ngFor="let page of getPageNumbers()"\r
          class="pagination-btn"\r
          [class.active]="page === currentPage"\r
          (click)="goToPage(page)">\r
          {{ page }}\r
        </button>\r
\r
        <button\r
          class="pagination-btn"\r
          (click)="nextPage()"\r
          [disabled]="currentPage === getTotalPages()">\r
          Next &raquo;\r
        </button>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
\r
<!-- Modal for Viewing Submission Details -->\r
<div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">\r
  <div class="modal-content" (click)="$event.stopPropagation()">\r
    <div class="modal-header">\r
      <h2>Contact Submission Details</h2>\r
      <button class="close-btn" (click)="closeModal()">&times;</button>\r
    </div>\r
\r
    <div *ngIf="modalError" class="alert alert-danger">\r
      {{ modalError }}\r
    </div>\r
\r
    <div class="modal-body" *ngIf="selectedSubmission">\r
      <!-- Submission Information -->\r
      <div class="info-section">\r
        <h3>Submission Information</h3>\r
        <div class="info-row">\r
          <label>Submitted:</label>\r
          <span>{{ formatDateTime(selectedSubmission.submitted_at).date }} at {{ formatDateTime(selectedSubmission.submitted_at).time }}</span>\r
        </div>\r
        <div class="info-row">\r
          <label>IP Address:</label>\r
          <span>{{ selectedSubmission.ip_address }}</span>\r
        </div>\r
        <div class="info-row">\r
          <label>Current Status:</label>\r
          <span [ngClass]="getStatusBadgeClass(selectedSubmission.status)">\r
            {{ selectedSubmission.status | uppercase }}\r
          </span>\r
        </div>\r
      </div>\r
\r
      <!-- Contact Information -->\r
      <div class="info-section">\r
        <h3>Contact Information</h3>\r
        <div class="info-row">\r
          <label>Name:</label>\r
          <span>{{ selectedSubmission.name }}</span>\r
        </div>\r
        <div class="info-row">\r
          <label>Email:</label>\r
          <span><a [href]="'mailto:' + selectedSubmission.email">{{ selectedSubmission.email }}</a></span>\r
        </div>\r
        <div class="info-row">\r
          <label>Subject:</label>\r
          <span>{{ selectedSubmission.subject }}</span>\r
        </div>\r
      </div>\r
\r
      <!-- Message -->\r
      <div class="info-section">\r
        <h3>Message</h3>\r
        <div class="message-full">{{ selectedSubmission.message }}</div>\r
      </div>\r
\r
      <!-- Status Update -->\r
      <div class="info-section">\r
        <h3>Update Status</h3>\r
        <div class="form-group">\r
          <label for="statusSelect">Status:</label>\r
          <select\r
            id="statusSelect"\r
            [(ngModel)]="modalFormData.status"\r
            class="form-control">\r
            <option value="new">New</option>\r
            <option value="read">Read</option>\r
            <option value="replied">Replied</option>\r
            <option value="archived">Archived</option>\r
          </select>\r
          <button\r
            class="btn btn-primary"\r
            (click)="updateStatus()"\r
            [disabled]="modalLoading || modalFormData.status === selectedSubmission.status">\r
            {{ modalLoading ? 'Updating...' : 'Update Status' }}\r
          </button>\r
        </div>\r
      </div>\r
\r
      <!-- Admin Notes -->\r
      <div class="info-section">\r
        <h3>Admin Notes</h3>\r
        <div class="form-group">\r
          <textarea\r
            [(ngModel)]="modalFormData.admin_notes"\r
            class="form-control admin-notes-textarea"\r
            rows="5"\r
            placeholder="Add internal notes about this submission..."></textarea>\r
          <button\r
            class="btn btn-primary"\r
            (click)="saveAdminNotes()"\r
            [disabled]="modalLoading">\r
            {{ modalLoading ? 'Saving...' : 'Save Notes' }}\r
          </button>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <div class="modal-footer">\r
      <button class="btn btn-secondary" (click)="closeModal()">Close</button>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/admin/contacts/contact-list/contact-list.css */\n.content-header {\n  margin-bottom: 30px;\n}\n.content-header h1 {\n  font-size: 28px;\n  font-weight: 600;\n  color: #333;\n  margin: 0 0 8px 0;\n}\n.content-header p {\n  margin: 0;\n  color: #666;\n  font-size: 14px;\n}\n.section {\n  background: #ffffff;\n  border-radius: 8px;\n  padding: 25px;\n  margin-bottom: 30px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n}\n.section-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n  padding-bottom: 20px;\n  border-bottom: 2px solid #f0f0f0;\n}\n.section-header h2 {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 600;\n  color: #1a1f3a;\n}\n.loading-container {\n  text-align: center;\n  padding: 40px;\n  font-size: 18px;\n  color: #666;\n}\n.alert {\n  padding: 12px 20px;\n  margin-bottom: 20px;\n  border-radius: 4px;\n}\n.alert-danger {\n  background-color: #f8d7da;\n  border: 1px solid #f5c6cb;\n  color: #721c24;\n}\n.stats-summary {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 20px;\n  margin-bottom: 30px;\n}\n.stat-box {\n  background: white;\n  border-radius: 8px;\n  padding: 20px;\n  text-align: center;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  transition: transform 0.2s;\n}\n.stat-box:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);\n}\n.stat-value {\n  font-size: 36px;\n  font-weight: 700;\n  margin-bottom: 8px;\n}\n.stat-label {\n  font-size: 14px;\n  font-weight: 500;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  color: #666;\n}\n.stat-new .stat-value {\n  color: #007bff;\n}\n.stat-read .stat-value {\n  color: #6c757d;\n}\n.stat-replied .stat-value {\n  color: #28a745;\n}\n.stat-archived .stat-value {\n  color: #dc3545;\n}\n.search-container {\n  margin-bottom: 20px;\n  display: flex;\n  gap: 15px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.search-input {\n  flex: 1;\n  min-width: 250px;\n  max-width: 400px;\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.search-input:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.status-filter {\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  background: #ffffff;\n  color: #333;\n  font-size: 0.95rem;\n  cursor: pointer;\n  min-width: 150px;\n}\n.status-filter:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.search-results {\n  color: #666;\n  font-size: 0.9rem;\n}\n.no-results {\n  text-align: center;\n  padding: 40px;\n  color: #666;\n  font-size: 16px;\n}\n.pagination-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 20px;\n  padding: 20px 0;\n  border-top: 1px solid #e0e0e0;\n}\n.pagination-info {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-controls {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n}\n.pagination-btn {\n  padding: 8px 12px;\n  border: 1px solid #ddd;\n  background: #ffffff;\n  color: #333;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n}\n.pagination-btn:hover:not(:disabled) {\n  background: #f5f5f5;\n  border-color: #4a90e2;\n}\n.pagination-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination-btn.active {\n  background: #4a90e2;\n  color: #ffffff;\n  border-color: #4a90e2;\n}\n.table-container {\n  overflow-x: auto;\n  margin: 20px 0;\n}\n.submissions-table {\n  width: 100%;\n  border-collapse: collapse;\n}\n.submissions-table thead {\n  background: #f8f9fa;\n}\n.submissions-table th {\n  padding: 12px 15px;\n  text-align: left;\n  font-weight: 600;\n  font-size: 13px;\n  color: #495057;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  border-bottom: 2px solid #dee2e6;\n}\n.submissions-table td {\n  padding: 12px 15px;\n  border-bottom: 1px solid #dee2e6;\n  font-size: 14px;\n  color: #333;\n}\n.submissions-table tbody tr:hover {\n  background: #f8f9fa;\n}\n.datetime-cell .date {\n  font-weight: 500;\n  color: #333;\n}\n.datetime-cell .time {\n  font-size: 12px;\n  color: #666;\n  margin-top: 2px;\n}\n.email-link {\n  color: #4a90e2;\n  text-decoration: none;\n}\n.email-link:hover {\n  text-decoration: underline;\n}\n.message-preview {\n  max-width: 300px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: #666;\n  font-size: 13px;\n}\n.badge {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.badge-new {\n  background: #fff3e0;\n  color: #e65100;\n}\n.badge-read {\n  background: #e3f2fd;\n  color: #1565c0;\n}\n.badge-replied {\n  background: #e8f5e9;\n  color: #2e7d32;\n}\n.badge-archived {\n  background: #fafafa;\n  color: #666;\n}\n.btn {\n  padding: 8px 16px;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 14px;\n  font-weight: 500;\n  transition: all 0.3s;\n  text-decoration: none;\n  display: inline-block;\n}\n.btn-sm {\n  padding: 6px 12px;\n  font-size: 13px;\n}\n.btn-primary {\n  background: #4a90e2;\n  color: white;\n}\n.btn-primary:hover:not(:disabled) {\n  background: #357abd;\n}\n.btn-primary:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-secondary {\n  background: #6c757d;\n  color: white;\n}\n.btn-secondary:hover {\n  background: #545b62;\n}\n.btn-edit {\n  padding: 6px 12px;\n  background: #4a90e2;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 16px;\n  transition: all 0.3s;\n}\n.btn-edit:hover {\n  background: #357abd;\n  transform: scale(1.05);\n}\n.modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n  padding: 20px;\n}\n.modal-content {\n  background: white;\n  border-radius: 8px;\n  width: 100%;\n  max-width: 800px;\n  max-height: 90vh;\n  overflow-y: auto;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n}\n.modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px;\n  border-bottom: 1px solid #dee2e6;\n}\n.modal-header h2 {\n  margin: 0;\n  font-size: 24px;\n  font-weight: 600;\n  color: #333;\n}\n.close-btn {\n  background: none;\n  border: none;\n  font-size: 32px;\n  color: #999;\n  cursor: pointer;\n  padding: 0;\n  width: 32px;\n  height: 32px;\n  line-height: 1;\n  transition: color 0.2s;\n}\n.close-btn:hover {\n  color: #333;\n}\n.modal-body {\n  padding: 20px;\n}\n.modal-footer {\n  padding: 20px;\n  border-top: 1px solid #dee2e6;\n  text-align: right;\n}\n.info-section {\n  margin-bottom: 25px;\n  padding-bottom: 20px;\n  border-bottom: 1px solid #dee2e6;\n}\n.info-section:last-child {\n  border-bottom: none;\n  padding-bottom: 0;\n  margin-bottom: 0;\n}\n.info-section h3 {\n  font-size: 18px;\n  font-weight: 600;\n  color: #333;\n  margin-bottom: 15px;\n}\n.info-row {\n  display: grid;\n  grid-template-columns: 150px 1fr;\n  gap: 15px;\n  margin-bottom: 10px;\n}\n.info-row label {\n  font-weight: 600;\n  color: #495057;\n}\n.info-row span {\n  color: #333;\n}\n.info-row a {\n  color: #007bff;\n  text-decoration: none;\n}\n.info-row a:hover {\n  text-decoration: underline;\n}\n.message-full {\n  background: #f8f9fa;\n  padding: 15px;\n  border-radius: 4px;\n  border: 1px solid #dee2e6;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n  line-height: 1.6;\n  color: #333;\n}\n.form-group {\n  margin-top: 10px;\n}\n.form-group label {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 500;\n  color: #495057;\n}\n.form-group select,\n.form-group textarea {\n  width: 100%;\n  margin-bottom: 10px;\n}\n.admin-notes-textarea {\n  resize: vertical;\n  min-height: 100px;\n  font-family: inherit;\n}\n@media (max-width: 1200px) {\n  .stats-summary {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 768px) {\n  .stats-summary {\n    grid-template-columns: 1fr;\n  }\n  .search-container {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .filter-box {\n    justify-content: space-between;\n  }\n  .table-container {\n    overflow-x: auto;\n  }\n  .submissions-table {\n    min-width: 800px;\n  }\n  .info-row {\n    grid-template-columns: 1fr;\n    gap: 5px;\n  }\n  .modal-content {\n    max-width: 100%;\n  }\n}\n/*# sourceMappingURL=contact-list.css.map */\n"] }]
  }], () => [{ type: ContactsService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ContactListComponent, { className: "ContactListComponent", filePath: "src/app/admin/contacts/contact-list/contact-list.ts", lineNumber: 11 });
})();

// src/app/admin/contacts/email-settings/email-settings.component.ts
function EmailSettingsComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "p");
    \u0275\u0275text(2, "Loading email settings...");
    \u0275\u0275elementEnd()();
  }
}
function EmailSettingsComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, "\n");
  }
}
function EmailSettingsComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.success, "\n");
  }
}
function EmailSettingsComponent_div_12_div_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "p");
    \u0275\u0275text(2, "No email recipients configured yet.");
    \u0275\u0275elementEnd()();
  }
}
function EmailSettingsComponent_div_12_div_24_tr_15_span_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 32);
    \u0275\u0275text(1, "Primary");
    \u0275\u0275elementEnd();
  }
}
function EmailSettingsComponent_div_12_div_24_tr_15_span_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 33);
    \u0275\u0275text(1, "Secondary");
    \u0275\u0275elementEnd();
  }
}
function EmailSettingsComponent_div_12_div_24_tr_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "a", 26);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275template(5, EmailSettingsComponent_div_12_div_24_tr_15_span_5_Template, 2, 0, "span", 27)(6, EmailSettingsComponent_div_12_div_24_tr_15_span_6_Template, 2, 0, "span", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td")(8, "span", 29);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td", 24)(13, "button", 30);
    \u0275\u0275listener("click", function EmailSettingsComponent_div_12_div_24_tr_15_Template_button_click_13_listener() {
      const recipient_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.toggleStatus(recipient_r4));
    });
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 31);
    \u0275\u0275listener("click", function EmailSettingsComponent_div_12_div_24_tr_15_Template_button_click_15_listener() {
      const recipient_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.deleteRecipient(recipient_r4));
    });
    \u0275\u0275text(16, " \u{1F5D1}\uFE0F ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const recipient_r4 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("href", "mailto:" + recipient_r4.email, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(recipient_r4.email);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", recipient_r4.is_primary);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !recipient_r4.is_primary);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", recipient_r4.is_active ? "badge-active" : "badge-inactive");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", recipient_r4.is_active ? "\u2713 Active" : "\u2717 Inactive", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatDate(recipient_r4.created_at));
    \u0275\u0275advance(2);
    \u0275\u0275property("title", recipient_r4.is_active ? "Deactivate" : "Activate")("disabled", recipient_r4.is_primary);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", recipient_r4.is_active ? "\u{1F515}" : "\u{1F514}", " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", recipient_r4.is_primary);
  }
}
function EmailSettingsComponent_div_12_div_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "table", 23)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Email Address");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Added On");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 24);
    \u0275\u0275text(13, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody");
    \u0275\u0275template(15, EmailSettingsComponent_div_12_div_24_tr_15_Template, 17, 11, "tr", 25);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(15);
    \u0275\u0275property("ngForOf", ctx_r0.recipients);
  }
}
function EmailSettingsComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 11)(2, "div", 12);
    \u0275\u0275text(3, "\u2139\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 13)(5, "h3");
    \u0275\u0275text(6, "How Email Notifications Work");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8, " When someone submits a contact form, all ");
    \u0275\u0275elementStart(9, "strong");
    \u0275\u0275text(10, "active");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, " email recipients below will receive a notification. The primary recipient cannot be deactivated or deleted. ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 14)(13, "h2");
    \u0275\u0275text(14, "Add New Recipient");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 15)(16, "input", 16);
    \u0275\u0275twoWayListener("ngModelChange", function EmailSettingsComponent_div_12_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.newEmail, $event) || (ctx_r0.newEmail = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 17);
    \u0275\u0275listener("click", function EmailSettingsComponent_div_12_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.addRecipient());
    });
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 14)(20, "div", 18)(21, "h2");
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(23, EmailSettingsComponent_div_12_div_23_Template, 3, 0, "div", 19)(24, EmailSettingsComponent_div_12_div_24_Template, 16, 1, "div", 20);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(16);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newEmail);
    \u0275\u0275property("disabled", ctx_r0.addingRecipient);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.addingRecipient || !ctx_r0.newEmail);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.addingRecipient ? "Adding..." : "+ Add Recipient", " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Email Recipients (", ctx_r0.recipients.length, ")");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.recipients.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.recipients.length > 0);
  }
}
var EmailSettingsComponent = class _EmailSettingsComponent {
  http;
  router;
  loading = false;
  error = "";
  success = "";
  recipients = [];
  newEmail = "";
  addingRecipient = false;
  constructor(http, router) {
    this.http = http;
    this.router = router;
  }
  ngOnInit() {
    this.loadRecipients();
  }
  loadRecipients() {
    this.loading = true;
    this.error = "";
    this.http.get("/api/contacts-admin.cfc?method=getEmailRecipients").subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.recipients = response.data;
        } else {
          this.error = response.message || "Failed to load recipients";
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = "Error loading recipients. Please try again.";
        console.error("Error loading recipients:", err);
      }
    });
  }
  addRecipient() {
    if (!this.newEmail || !this.newEmail.trim()) {
      this.error = "Please enter an email address";
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newEmail.trim())) {
      this.error = "Please enter a valid email address";
      return;
    }
    this.addingRecipient = true;
    this.error = "";
    this.success = "";
    const formData = new FormData();
    formData.append("email", this.newEmail.trim());
    this.http.post("/api/contacts-admin.cfc?method=addEmailRecipient", formData).subscribe({
      next: (response) => {
        this.addingRecipient = false;
        if (response.success) {
          this.recipients = response.data;
          this.newEmail = "";
          this.success = "Recipient added successfully";
          setTimeout(() => this.success = "", 3e3);
        } else {
          this.error = response.message || "Failed to add recipient";
        }
      },
      error: (err) => {
        this.addingRecipient = false;
        this.error = "Error adding recipient. Please try again.";
        console.error("Error adding recipient:", err);
      }
    });
  }
  toggleStatus(recipient) {
    if (recipient.is_primary) {
      this.error = "Cannot deactivate the primary recipient";
      setTimeout(() => this.error = "", 3e3);
      return;
    }
    const formData = new FormData();
    formData.append("id", recipient.id.toString());
    this.http.post("/api/contacts-admin.cfc?method=toggleRecipientStatus", formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.recipients = response.data;
          this.success = "Recipient status updated successfully";
          setTimeout(() => this.success = "", 3e3);
        } else {
          this.error = response.message || "Failed to update status";
        }
      },
      error: (err) => {
        this.error = "Error updating status. Please try again.";
        console.error("Error updating status:", err);
      }
    });
  }
  deleteRecipient(recipient) {
    if (recipient.is_primary) {
      this.error = "Cannot delete the primary recipient";
      setTimeout(() => this.error = "", 3e3);
      return;
    }
    if (!confirm(`Are you sure you want to delete ${recipient.email}?`)) {
      return;
    }
    const formData = new FormData();
    formData.append("id", recipient.id.toString());
    this.http.post("/api/contacts-admin.cfc?method=deleteEmailRecipient", formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.recipients = response.data;
          this.success = "Recipient deleted successfully";
          setTimeout(() => this.success = "", 3e3);
        } else {
          this.error = response.message || "Failed to delete recipient";
        }
      },
      error: (err) => {
        this.error = "Error deleting recipient. Please try again.";
        console.error("Error deleting recipient:", err);
      }
    });
  }
  formatDate(dateString) {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
  goBack() {
    this.router.navigate(["/admin/contacts"]);
  }
  static \u0275fac = function EmailSettingsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EmailSettingsComponent)(\u0275\u0275directiveInject(HttpClient), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EmailSettingsComponent, selectors: [["app-email-settings"]], standalone: false, decls: 13, vars: 4, consts: [[1, "content-header"], [1, "action-bar"], [1, "btn", "btn-secondary", 3, "click"], ["class", "loading-container", 4, "ngIf"], ["class", "alert alert-danger", 4, "ngIf"], ["class", "alert alert-success", 4, "ngIf"], [1, "email-settings-container"], [4, "ngIf"], [1, "loading-container"], [1, "alert", "alert-danger"], [1, "alert", "alert-success"], [1, "info-box"], [1, "info-icon"], [1, "info-content"], [1, "section"], [1, "add-recipient-form"], ["type", "email", "placeholder", "Enter email address...", 1, "email-input", 3, "ngModelChange", "ngModel", "disabled"], [1, "btn", "btn-primary", 3, "click", "disabled"], [1, "section-header"], ["class", "no-results", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], [1, "no-results"], [1, "table-container"], [1, "data-table", "email-recipients-table"], [1, "actions"], [4, "ngFor", "ngForOf"], [1, "email-link", 3, "href"], ["class", "badge badge-primary", 4, "ngIf"], ["class", "badge badge-secondary", 4, "ngIf"], [3, "ngClass"], [1, "btn", "btn-sm", "btn-toggle", 3, "click", "title", "disabled"], ["title", "Delete", 1, "btn", "btn-sm", "btn-delete", 3, "click", "disabled"], [1, "badge", "badge-primary"], [1, "badge", "badge-secondary"]], template: function EmailSettingsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Email Settings");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4, "Configure email notifications for contact form submissions");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 1)(6, "button", 2);
      \u0275\u0275listener("click", function EmailSettingsComponent_Template_button_click_6_listener() {
        return ctx.goBack();
      });
      \u0275\u0275text(7, " \u2190 Back to Contact Submissions ");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(8, EmailSettingsComponent_div_8_Template, 3, 0, "div", 3)(9, EmailSettingsComponent_div_9_Template, 2, 1, "div", 4)(10, EmailSettingsComponent_div_10_Template, 2, 1, "div", 5);
      \u0275\u0275elementStart(11, "div", 6);
      \u0275\u0275template(12, EmailSettingsComponent_div_12_Template, 25, 7, "div", 7);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.success);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", !ctx.loading);
    }
  }, dependencies: [NgClass, NgForOf, NgIf, DefaultValueAccessor, NgControlStatus, NgModel], styles: ["\n\n.info-box[_ngcontent-%COMP%] {\n  background: #e3f2fd;\n  border-left: 4px solid #2196f3;\n  padding: 20px;\n  border-radius: 8px;\n  margin-bottom: 30px;\n  display: flex;\n  gap: 15px;\n  align-items: flex-start;\n}\n.info-icon[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  flex-shrink: 0;\n}\n.info-content[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 10px 0;\n  color: #1565c0;\n  font-size: 1.1rem;\n}\n.info-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #0d47a1;\n  line-height: 1.6;\n}\n.add-recipient-form[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 15px;\n  align-items: center;\n  margin-top: 15px;\n}\n.email-input[_ngcontent-%COMP%] {\n  flex: 1;\n  max-width: 400px;\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.email-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.email-input[_ngcontent-%COMP%]:disabled {\n  background: #f5f5f5;\n  cursor: not-allowed;\n}\n.badge[_ngcontent-%COMP%] {\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.badge-primary[_ngcontent-%COMP%] {\n  background: #e3f2fd;\n  color: #1976d2;\n}\n.badge-secondary[_ngcontent-%COMP%] {\n  background: #f5f5f5;\n  color: #666;\n}\n.badge-active[_ngcontent-%COMP%] {\n  background: #e8f5e9;\n  color: #2e7d32;\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n}\n.badge-inactive[_ngcontent-%COMP%] {\n  background: #ffebee;\n  color: #c62828;\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n}\n.email-link[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n  text-decoration: none;\n}\n.email-link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.actions[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.3;\n  cursor: not-allowed;\n}\n.email-recipients-table[_ngcontent-%COMP%] {\n  table-layout: fixed;\n  width: 100%;\n}\n.email-recipients-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:nth-child(1), \n.email-recipients-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:nth-child(1) {\n  width: 33%;\n}\n.email-recipients-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:nth-child(2), \n.email-recipients-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:nth-child(2) {\n  width: 13%;\n}\n.email-recipients-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:nth-child(3), \n.email-recipients-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:nth-child(3) {\n  width: 13%;\n}\n.email-recipients-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:nth-child(4), \n.email-recipients-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:nth-child(4) {\n  width: 23%;\n}\n.email-recipients-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:nth-child(5), \n.email-recipients-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:nth-child(5) {\n  width: 18%;\n  text-align: center;\n}\n/*# sourceMappingURL=email-settings.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmailSettingsComponent, [{
    type: Component,
    args: [{ selector: "app-email-settings", standalone: false, template: `<div class="content-header">
  <h1>Email Settings</h1>
  <p>Configure email notifications for contact form submissions</p>
</div>

<div class="action-bar">
  <button class="btn btn-secondary" (click)="goBack()">
    \u2190 Back to Contact Submissions
  </button>
</div>

<!-- Loading State -->
<div *ngIf="loading" class="loading-container">
  <p>Loading email settings...</p>
</div>

<!-- Error Message -->
<div *ngIf="error" class="alert alert-danger">
  {{ error }}
</div>

<!-- Success Message -->
<div *ngIf="success" class="alert alert-success">
  {{ success }}
</div>

<!-- Main Content -->
<div class="email-settings-container">
<div *ngIf="!loading">
  <!-- Info Box -->
  <div class="info-box">
    <div class="info-icon">\u2139\uFE0F</div>
    <div class="info-content">
      <h3>How Email Notifications Work</h3>
      <p>
        When someone submits a contact form, all <strong>active</strong> email recipients below will receive a notification.
        The primary recipient cannot be deactivated or deleted.
      </p>
    </div>
  </div>

  <!-- Add New Recipient Section -->
  <div class="section">
    <h2>Add New Recipient</h2>
    <div class="add-recipient-form">
      <input
        type="email"
        [(ngModel)]="newEmail"
        placeholder="Enter email address..."
        class="email-input"
        [disabled]="addingRecipient">
      <button
        class="btn btn-primary"
        (click)="addRecipient()"
        [disabled]="addingRecipient || !newEmail">
        {{ addingRecipient ? 'Adding...' : '+ Add Recipient' }}
      </button>
    </div>
  </div>

  <!-- Email Recipients Table -->
  <div class="section">
    <div class="section-header">
      <h2>Email Recipients ({{ recipients.length }})</h2>
    </div>

    <div *ngIf="recipients.length === 0" class="no-results">
      <p>No email recipients configured yet.</p>
    </div>

    <div class="table-container" *ngIf="recipients.length > 0">
      <table class="data-table email-recipients-table">
        <thead>
          <tr>
            <th>Email Address</th>
            <th>Type</th>
            <th>Status</th>
            <th>Added On</th>
            <th class="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let recipient of recipients">
            <td>
              <a [href]="'mailto:' + recipient.email" class="email-link">{{ recipient.email }}</a>
            </td>
            <td>
              <span *ngIf="recipient.is_primary" class="badge badge-primary">Primary</span>
              <span *ngIf="!recipient.is_primary" class="badge badge-secondary">Secondary</span>
            </td>
            <td>
              <span [ngClass]="recipient.is_active ? 'badge-active' : 'badge-inactive'">
                {{ recipient.is_active ? '\u2713 Active' : '\u2717 Inactive' }}
              </span>
            </td>
            <td>{{ formatDate(recipient.created_at) }}</td>
            <td class="actions">
              <button
                class="btn btn-sm btn-toggle"
                [title]="recipient.is_active ? 'Deactivate' : 'Activate'"
                (click)="toggleStatus(recipient)"
                [disabled]="recipient.is_primary">
                {{ recipient.is_active ? '\u{1F515}' : '\u{1F514}' }}
              </button>
              <button
                class="btn btn-sm btn-delete"
                title="Delete"
                (click)="deleteRecipient(recipient)"
                [disabled]="recipient.is_primary">
                \u{1F5D1}\uFE0F
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</div>
`, styles: ["/* src/app/admin/contacts/email-settings/email-settings.component.css */\n.info-box {\n  background: #e3f2fd;\n  border-left: 4px solid #2196f3;\n  padding: 20px;\n  border-radius: 8px;\n  margin-bottom: 30px;\n  display: flex;\n  gap: 15px;\n  align-items: flex-start;\n}\n.info-icon {\n  font-size: 2rem;\n  flex-shrink: 0;\n}\n.info-content h3 {\n  margin: 0 0 10px 0;\n  color: #1565c0;\n  font-size: 1.1rem;\n}\n.info-content p {\n  margin: 0;\n  color: #0d47a1;\n  line-height: 1.6;\n}\n.add-recipient-form {\n  display: flex;\n  gap: 15px;\n  align-items: center;\n  margin-top: 15px;\n}\n.email-input {\n  flex: 1;\n  max-width: 400px;\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  font-size: 0.95rem;\n}\n.email-input:focus {\n  outline: none;\n  border-color: #4a90e2;\n  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);\n}\n.email-input:disabled {\n  background: #f5f5f5;\n  cursor: not-allowed;\n}\n.badge {\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.badge-primary {\n  background: #e3f2fd;\n  color: #1976d2;\n}\n.badge-secondary {\n  background: #f5f5f5;\n  color: #666;\n}\n.badge-active {\n  background: #e8f5e9;\n  color: #2e7d32;\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n}\n.badge-inactive {\n  background: #ffebee;\n  color: #c62828;\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n}\n.email-link {\n  color: #4fc3f7;\n  text-decoration: none;\n}\n.email-link:hover {\n  text-decoration: underline;\n}\n.actions .btn:disabled {\n  opacity: 0.3;\n  cursor: not-allowed;\n}\n.email-recipients-table {\n  table-layout: fixed;\n  width: 100%;\n}\n.email-recipients-table th:nth-child(1),\n.email-recipients-table td:nth-child(1) {\n  width: 33%;\n}\n.email-recipients-table th:nth-child(2),\n.email-recipients-table td:nth-child(2) {\n  width: 13%;\n}\n.email-recipients-table th:nth-child(3),\n.email-recipients-table td:nth-child(3) {\n  width: 13%;\n}\n.email-recipients-table th:nth-child(4),\n.email-recipients-table td:nth-child(4) {\n  width: 23%;\n}\n.email-recipients-table th:nth-child(5),\n.email-recipients-table td:nth-child(5) {\n  width: 18%;\n  text-align: center;\n}\n/*# sourceMappingURL=email-settings.component.css.map */\n"] }]
  }], () => [{ type: HttpClient }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EmailSettingsComponent, { className: "EmailSettingsComponent", filePath: "src/app/admin/contacts/email-settings/email-settings.component.ts", lineNumber: 19 });
})();

// src/app/admin/services/users.service.ts
var UsersService = class _UsersService {
  http;
  apiUrl = "/api/users-admin.cfc";
  constructor(http) {
    this.http = http;
  }
  /**
   * Get all users (for admin panel)
   */
  getAll() {
    return this.http.get(`${this.apiUrl}?method=getUsersAdmin`).pipe(map((response) => response.data || []), catchError(this.handleError));
  }
  /**
   * Get a single user by ID
   */
  getById(id) {
    return this.http.get(`${this.apiUrl}?method=getUser&id=${id}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Create a new user
   */
  create(user) {
    const params = new URLSearchParams({
      method: "createUser",
      username: user.username,
      password: user.password,
      full_name: user.full_name,
      email: user.email,
      role_id: user.role_id.toString(),
      is_active: user.is_active ? "1" : "0"
    });
    return this.http.get(`${this.apiUrl}?${params.toString()}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Update an existing user
   */
  update(user) {
    const params = new URLSearchParams({
      method: "updateUser",
      id: user.id.toString(),
      full_name: user.full_name,
      email: user.email,
      role_id: user.role_id.toString(),
      is_active: user.is_active ? "1" : "0"
    });
    if (user.password) {
      params.append("password", user.password);
    }
    return this.http.get(`${this.apiUrl}?${params.toString()}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Delete a user
   */
  delete(id) {
    return this.http.get(`${this.apiUrl}?method=deleteUser&id=${id}`).pipe(map(() => void 0), catchError(this.handleError));
  }
  /**
   * Toggle user active status
   */
  toggleActive(id) {
    return this.http.get(`${this.apiUrl}?method=toggleActive&id=${id}`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Get all available roles
   */
  getRoles() {
    return this.http.get(`${this.apiUrl}?method=getRoles`).pipe(map((response) => response.data || []), catchError(this.handleError));
  }
  /**
   * Handle HTTP errors
   */
  handleError(error) {
    let errorMessage = "An error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}
Message: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    console.error("UsersService Error:", errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  static \u0275fac = function UsersService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UsersService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UsersService, factory: _UsersService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UsersService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/admin/users/user-list/user-list.component.ts
var _c09 = (a0) => ["/admin/users/edit", a0];
var _c1 = (a0) => ["/admin/users/delete", a0];
function UserListComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "p");
    \u0275\u0275text(2, "Loading users...");
    \u0275\u0275elementEnd()();
  }
}
function UserListComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.successMessage, "\n");
  }
}
function UserListComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, "\n");
  }
}
function UserListComponent_div_8_div_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "p");
    \u0275\u0275text(2, "No users found matching your criteria.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "a", 12);
    \u0275\u0275text(4, "Add First User");
    \u0275\u0275elementEnd()();
  }
}
function UserListComponent_div_8_div_33_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function UserListComponent_div_8_div_33_button_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.goToPage(1));
    });
    \u0275\u0275text(1, "1");
    \u0275\u0275elementEnd();
  }
}
function UserListComponent_div_8_div_33_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function UserListComponent_div_8_div_33_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("click", function UserListComponent_div_8_div_33_button_8_Template_button_click_0_listener() {
      const page_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.goToPage(page_r6));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("active", page_r6 === ctx_r0.currentPage);
    \u0275\u0275property("disabled", page_r6 === ctx_r0.currentPage && ctx_r0.getTotalPages() === 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r6, " ");
  }
}
function UserListComponent_div_8_div_33_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function UserListComponent_div_8_div_33_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function UserListComponent_div_8_div_33_button_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.getTotalPages()));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getTotalPages());
  }
}
function UserListComponent_div_8_div_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 31)(1, "div", 32);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 33)(4, "button", 34);
    \u0275\u0275listener("click", function UserListComponent_div_8_div_33_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.previousPage());
    });
    \u0275\u0275text(5, "\xAB Previous");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, UserListComponent_div_8_div_33_button_6_Template, 2, 0, "button", 35)(7, UserListComponent_div_8_div_33_span_7_Template, 2, 0, "span", 36)(8, UserListComponent_div_8_div_33_button_8_Template, 2, 4, "button", 37)(9, UserListComponent_div_8_div_33_span_9_Template, 2, 0, "span", 36)(10, UserListComponent_div_8_div_33_button_10_Template, 2, 1, "button", 35);
    \u0275\u0275elementStart(11, "button", 34);
    \u0275\u0275listener("click", function UserListComponent_div_8_div_33_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.nextPage());
    });
    \u0275\u0275text(12, "Next \xBB");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" Showing ", ctx_r0.getPageStart(), "-", ctx_r0.getPageEnd(), " of ", ctx_r0.filteredUsers.length, " total ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.getPageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages() - 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage === ctx_r0.getTotalPages());
  }
}
function UserListComponent_div_8_div_34_tr_19_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "img", 51);
    \u0275\u0275listener("error", function UserListComponent_div_8_div_34_tr_19_ng_container_2_Template_img_error_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      $event.target.style.display = "none";
      return \u0275\u0275resetView($event.target.parentElement.innerHTML = "<div class='table-profile-placeholder'>\u{1F464}</div>");
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const user_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r0.getProfilePicturePath(user_r9), \u0275\u0275sanitizeUrl)("alt", user_r9.full_name);
  }
}
function UserListComponent_div_8_div_34_tr_19_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52);
    \u0275\u0275text(1, "\u{1F464}");
    \u0275\u0275elementEnd();
  }
}
function UserListComponent_div_8_div_34_tr_19_span_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(user_r9.role_name);
  }
}
function UserListComponent_div_8_div_34_tr_19_span_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1, "No Role");
    \u0275\u0275elementEnd();
  }
}
function UserListComponent_div_8_div_34_tr_19_ng_container_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "span", 55);
    \u0275\u0275text(2, "\u{1F512}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
}
function UserListComponent_div_8_div_34_tr_19_ng_template_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 56);
    \u0275\u0275text(1, "\u270F\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 57);
    \u0275\u0275listener("click", function UserListComponent_div_8_div_34_tr_19_ng_template_21_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r10);
      const user_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.toggleUserActive(user_r9));
    });
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "a", 58);
    \u0275\u0275text(5, "\u{1F5D1}\uFE0F");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(4, _c09, user_r9.id));
    \u0275\u0275advance(2);
    \u0275\u0275property("title", user_r9.is_active ? "Deactivate User" : "Activate User");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", user_r9.is_active ? "\u{1F441}\uFE0F" : "\u{1F6AB}", " ");
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(6, _c1, user_r9.id));
  }
}
function UserListComponent_div_8_div_34_tr_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 42);
    \u0275\u0275template(2, UserListComponent_div_8_div_34_tr_19_ng_container_2_Template, 2, 2, "ng-container", 46)(3, UserListComponent_div_8_div_34_tr_19_ng_template_3_Template, 2, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td")(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td")(11, "a", 47);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275template(14, UserListComponent_div_8_div_34_tr_19_span_14_Template, 2, 1, "span", 48)(15, UserListComponent_div_8_div_34_tr_19_span_15_Template, 2, 0, "span", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 43)(17, "span", 50);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td", 44);
    \u0275\u0275template(20, UserListComponent_div_8_div_34_tr_19_ng_container_20_Template, 3, 0, "ng-container", 46)(21, UserListComponent_div_8_div_34_tr_19_ng_template_21_Template, 6, 8, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const user_r9 = ctx.$implicit;
    const avatarPlaceholder_r11 = \u0275\u0275reference(4);
    const normalActions_r12 = \u0275\u0275reference(22);
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.hasProfilePicture(user_r9))("ngIfElse", avatarPlaceholder_r11);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(user_r9.username);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r9.full_name);
    \u0275\u0275advance(2);
    \u0275\u0275property("href", "mailto:" + user_r9.email, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(user_r9.email);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", user_r9.role_name);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !user_r9.role_name);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r0.getStatusBadgeClass(user_r9.is_active));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", user_r9.is_active ? "\u2713 Active" : "Inactive", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.isMasterAdmin(user_r9))("ngIfElse", normalActions_r12);
  }
}
function UserListComponent_div_8_div_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40)(1, "table", 41)(2, "thead")(3, "tr")(4, "th", 42);
    \u0275\u0275text(5, "Picture");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Username");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Full Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Role");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 43);
    \u0275\u0275text(15, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 44);
    \u0275\u0275text(17, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275template(19, UserListComponent_div_8_div_34_tr_19_Template, 23, 12, "tr", 45);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(19);
    \u0275\u0275property("ngForOf", ctx_r0.getPaginatedUsers());
  }
}
function UserListComponent_div_8_div_35_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function UserListComponent_div_8_div_35_button_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.goToPage(1));
    });
    \u0275\u0275text(1, "1");
    \u0275\u0275elementEnd();
  }
}
function UserListComponent_div_8_div_35_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function UserListComponent_div_8_div_35_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("click", function UserListComponent_div_8_div_35_button_8_Template_button_click_0_listener() {
      const page_r16 = \u0275\u0275restoreView(_r15).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.goToPage(page_r16));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r16 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("active", page_r16 === ctx_r0.currentPage);
    \u0275\u0275property("disabled", page_r16 === ctx_r0.currentPage && ctx_r0.getTotalPages() === 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r16, " ");
  }
}
function UserListComponent_div_8_div_35_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function UserListComponent_div_8_div_35_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function UserListComponent_div_8_div_35_button_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.getTotalPages()));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getTotalPages());
  }
}
function UserListComponent_div_8_div_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 31)(1, "div", 32);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 33)(4, "button", 34);
    \u0275\u0275listener("click", function UserListComponent_div_8_div_35_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.previousPage());
    });
    \u0275\u0275text(5, "\xAB Previous");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, UserListComponent_div_8_div_35_button_6_Template, 2, 0, "button", 35)(7, UserListComponent_div_8_div_35_span_7_Template, 2, 0, "span", 36)(8, UserListComponent_div_8_div_35_button_8_Template, 2, 4, "button", 37)(9, UserListComponent_div_8_div_35_span_9_Template, 2, 0, "span", 36)(10, UserListComponent_div_8_div_35_button_10_Template, 2, 1, "button", 35);
    \u0275\u0275elementStart(11, "button", 34);
    \u0275\u0275listener("click", function UserListComponent_div_8_div_35_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.nextPage());
    });
    \u0275\u0275text(12, "Next \xBB");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" Showing ", ctx_r0.getPageStart(), "-", ctx_r0.getPageEnd(), " of ", ctx_r0.filteredUsers.length, " total ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[0] > 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.getPageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages() - 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getPageNumbers()[ctx_r0.getPageNumbers().length - 1] < ctx_r0.getTotalPages());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage === ctx_r0.getTotalPages());
  }
}
function UserListComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 10)(2, "div", 11)(3, "h2");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "a", 12);
    \u0275\u0275text(6, "+ Add New User");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 13)(8, "div", 14)(9, "label", 15);
    \u0275\u0275text(10, "Filter by Status:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "select", 16);
    \u0275\u0275twoWayListener("ngModelChange", function UserListComponent_div_8_Template_select_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.statusFilter, $event) || (ctx_r0.statusFilter = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function UserListComponent_div_8_Template_select_change_11_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onStatusFilterChange());
    });
    \u0275\u0275elementStart(12, "option", 17);
    \u0275\u0275text(13, "All Statuses");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "option", 18);
    \u0275\u0275text(15, "Active");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "option", 19);
    \u0275\u0275text(17, "Inactive");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 14)(19, "label", 20);
    \u0275\u0275text(20, "Filter by Role:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "select", 21);
    \u0275\u0275twoWayListener("ngModelChange", function UserListComponent_div_8_Template_select_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.roleFilter, $event) || (ctx_r0.roleFilter = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function UserListComponent_div_8_Template_select_change_21_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onRoleFilterChange());
    });
    \u0275\u0275elementStart(22, "option", 17);
    \u0275\u0275text(23, "All Roles");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "option", 22);
    \u0275\u0275text(25, "Admin");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "option", 23);
    \u0275\u0275text(27, "Content Manager");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "div", 24)(29, "label", 25);
    \u0275\u0275text(30, "Search:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "input", 26);
    \u0275\u0275twoWayListener("ngModelChange", function UserListComponent_div_8_Template_input_ngModelChange_31_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.searchQuery, $event) || (ctx_r0.searchQuery = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function UserListComponent_div_8_Template_input_input_31_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSearch());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(32, UserListComponent_div_8_div_32_Template, 5, 0, "div", 27)(33, UserListComponent_div_8_div_33_Template, 13, 10, "div", 28)(34, UserListComponent_div_8_div_34_Template, 20, 1, "div", 29)(35, UserListComponent_div_8_div_35_Template, 13, 10, "div", 28);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Users (", ctx_r0.filteredUsers.length, ")");
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.statusFilter);
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.roleFilter);
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.searchQuery);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.filteredUsers.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.filteredUsers.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.filteredUsers.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.filteredUsers.length > 0);
  }
}
var UserListComponent = class _UserListComponent {
  usersService;
  users = [];
  filteredUsers = [];
  roles = [];
  loading = false;
  error = null;
  successMessage = null;
  // Filters
  searchQuery = "";
  statusFilter = "all";
  // all, active, inactive
  roleFilter = "all";
  // all, 1 (Admin), 2 (Content Manager)
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  constructor(usersService) {
    this.usersService = usersService;
  }
  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }
  loadUsers() {
    this.loading = true;
    this.error = null;
    this.usersService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load users";
        this.loading = false;
        console.error("Error loading users:", err);
      }
    });
  }
  loadRoles() {
    this.usersService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error("Error loading roles:", err);
      }
    });
  }
  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }
  onStatusFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }
  onRoleFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }
  applyFilters() {
    let filtered = [...this.users];
    if (this.statusFilter === "active") {
      filtered = filtered.filter((user) => user.is_active);
    } else if (this.statusFilter === "inactive") {
      filtered = filtered.filter((user) => !user.is_active);
    }
    if (this.roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role_id.toString() === this.roleFilter);
    }
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((user) => user.username.toLowerCase().includes(query) || user.full_name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query));
    }
    this.filteredUsers = filtered;
  }
  // Pagination methods
  getPaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }
  getTotalPages() {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }
  getPageStart() {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  getPageEnd() {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredUsers.length);
  }
  getPageNumbers() {
    const totalPages = this.getTotalPages();
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  goToPage(page) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }
  toggleUserActive(user) {
    this.usersService.toggleActive(user.id).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.applyFilters();
      },
      error: (err) => {
        this.error = err.message || "Failed to update user status";
        setTimeout(() => this.error = null, 5e3);
      }
    });
  }
  getProfilePicturePath(user) {
    if (user.profile_picture) {
      return `/assets/img/profiles/${user.profile_picture}`;
    }
    return "";
  }
  hasProfilePicture(user) {
    return !!user.profile_picture;
  }
  getStatusBadgeClass(isActive) {
    return isActive ? "badge badge-success" : "badge badge-inactive";
  }
  formatDateTime(dateTimeString) {
    if (!dateTimeString)
      return { date: "", time: "" };
    const dt = new Date(dateTimeString);
    const date = dt.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    const time = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    return { date, time };
  }
  isMasterAdmin(user) {
    return user.username === "admin";
  }
  static \u0275fac = function UserListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserListComponent)(\u0275\u0275directiveInject(UsersService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UserListComponent, selectors: [["app-user-list"]], standalone: false, decls: 9, vars: 4, consts: [["avatarPlaceholder", ""], ["normalActions", ""], [1, "content-header"], ["class", "loading-container", 4, "ngIf"], ["class", "alert alert-success", 4, "ngIf"], ["class", "alert alert-danger", 4, "ngIf"], [4, "ngIf"], [1, "loading-container"], [1, "alert", "alert-success"], [1, "alert", "alert-danger"], [1, "section"], [1, "section-header"], ["routerLink", "/admin/users/add", 1, "btn", "btn-primary"], [1, "filters-container"], [1, "filter-group"], ["for", "statusFilter"], ["id", "statusFilter", 1, "form-select", 3, "ngModelChange", "change", "ngModel"], ["value", "all"], ["value", "active"], ["value", "inactive"], ["for", "roleFilter"], ["id", "roleFilter", 1, "form-select", 3, "ngModelChange", "change", "ngModel"], ["value", "1"], ["value", "2"], [1, "filter-group", "search-group"], ["for", "searchInput"], ["type", "text", "id", "searchInput", "placeholder", "Search by username, name, or email...", 1, "search-input", 3, "ngModelChange", "input", "ngModel"], ["class", "empty-state", 4, "ngIf"], ["class", "pagination-container", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], [1, "empty-state"], [1, "pagination-container"], [1, "pagination-info"], [1, "pagination-controls"], [1, "pagination-btn", 3, "click", "disabled"], ["class", "pagination-btn", 3, "click", 4, "ngIf"], ["style", "padding: 0 8px; color: #666;", 4, "ngIf"], ["class", "pagination-btn", 3, "active", "disabled", "click", 4, "ngFor", "ngForOf"], [1, "pagination-btn", 3, "click"], [2, "padding", "0 8px", "color", "#666"], [1, "table-container"], [1, "data-table"], [1, "col-picture"], [1, "col-status"], [1, "actions"], [4, "ngFor", "ngForOf"], [4, "ngIf", "ngIfElse"], [1, "email-link", 3, "href"], ["class", "role-badge", 4, "ngIf"], ["class", "text-muted", 4, "ngIf"], [3, "ngClass"], [1, "table-profile-pic", 3, "error", "src", "alt"], [1, "table-profile-placeholder"], [1, "role-badge"], [1, "text-muted"], ["title", "Master Admin - Cannot be modified", 1, "locked-icon"], ["title", "Edit User", 1, "btn", "btn-sm", "btn-edit", 3, "routerLink"], [1, "btn", "btn-sm", "btn-toggle", 3, "click", "title"], ["title", "Delete User", 1, "btn", "btn-sm", "btn-delete", 3, "routerLink"]], template: function UserListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 2)(1, "h1");
      \u0275\u0275text(2, "User Management");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4, "Manage admin users and their roles");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(5, UserListComponent_div_5_Template, 3, 0, "div", 3)(6, UserListComponent_div_6_Template, 2, 1, "div", 4)(7, UserListComponent_div_7_Template, 2, 1, "div", 5)(8, UserListComponent_div_8_Template, 36, 8, "div", 6);
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.successMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading);
    }
  }, dependencies: [NgClass, NgForOf, NgIf, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, RouterLink], styles: ["\n\n.filters-container[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 15px;\n  margin-bottom: 20px;\n  flex-wrap: wrap;\n}\n.filter-group[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 200px;\n}\n.filter-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 5px;\n  font-weight: 600;\n  color: #2d3561;\n  font-size: 14px;\n}\n.form-select[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 8px;\n  border-radius: 8px;\n  border: 2px solid #e0e0e0;\n  font-size: 14px;\n}\n.search-group[_ngcontent-%COMP%] {\n  min-width: 250px;\n}\n.search-input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 8px;\n  border-radius: 8px;\n  border: 2px solid #e0e0e0;\n  font-size: 14px;\n}\n.search-input[_ngcontent-%COMP%]:focus, \n.form-select[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4a90e2;\n}\n.col-picture[_ngcontent-%COMP%] {\n  width: 60px;\n  text-align: center;\n}\n.table-profile-pic[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  object-fit: cover;\n}\n.table-profile-placeholder[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background: #f0f0f0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 20px;\n  margin: 0 auto;\n}\n.role-badge[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #2d3561;\n}\n.text-muted[_ngcontent-%COMP%] {\n  color: #999;\n}\n.locked-icon[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  color: #999;\n  cursor: not-allowed;\n}\n.email-link[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n  text-decoration: none;\n}\n.email-link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.badge-success[_ngcontent-%COMP%] {\n  background: #e8f5e9;\n  color: #2e7d32;\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.badge-inactive[_ngcontent-%COMP%] {\n  background: #fafafa;\n  color: #666;\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.btn-toggle[_ngcontent-%COMP%] {\n  background: transparent;\n  border: 1px solid #ddd;\n  padding: 6px 12px;\n  cursor: pointer;\n  border-radius: 6px;\n  font-size: 16px;\n  transition: all 0.3s;\n}\n.btn-toggle[_ngcontent-%COMP%]:hover {\n  background: #f5f5f5;\n  border-color: #4a90e2;\n}\n.btn-delete[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #dc3545;\n  border: 1px solid #ddd;\n  padding: 6px 12px;\n  cursor: pointer;\n  border-radius: 6px;\n  font-size: 16px;\n  transition: all 0.3s;\n  text-decoration: none;\n  display: inline-block;\n}\n.btn-delete[_ngcontent-%COMP%]:hover {\n  background: #dc3545;\n  color: white;\n  border-color: #dc3545;\n}\n.pagination-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 20px;\n  padding: 20px 0;\n  border-top: 1px solid #e0e0e0;\n}\n.pagination-info[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-controls[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n}\n.pagination-btn[_ngcontent-%COMP%] {\n  padding: 8px 12px;\n  border: 1px solid #ddd;\n  background: #ffffff;\n  color: #333;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n}\n.pagination-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #f5f5f5;\n  border-color: #4a90e2;\n}\n.pagination-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination-btn.active[_ngcontent-%COMP%] {\n  background: #4a90e2;\n  color: #ffffff;\n  border-color: #4a90e2;\n}\n/*# sourceMappingURL=user-list.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserListComponent, [{
    type: Component,
    args: [{ selector: "app-user-list", standalone: false, template: `<div class="content-header">\r
  <h1>User Management</h1>\r
  <p>Manage admin users and their roles</p>\r
</div>\r
\r
<!-- Loading State -->\r
<div *ngIf="loading" class="loading-container">\r
  <p>Loading users...</p>\r
</div>\r
\r
<!-- Success Message -->\r
<div *ngIf="successMessage" class="alert alert-success">\r
  {{ successMessage }}\r
</div>\r
\r
<!-- Error State -->\r
<div *ngIf="error" class="alert alert-danger">\r
  {{ error }}\r
</div>\r
\r
<!-- Main Content -->\r
<div *ngIf="!loading">\r
  <div class="section">\r
    <!-- Section Header with Add User Button -->\r
    <div class="section-header">\r
      <h2>Users ({{ filteredUsers.length }})</h2>\r
      <a routerLink="/admin/users/add" class="btn btn-primary">+ Add New User</a>\r
    </div>\r
\r
    <!-- Filters and Search -->\r
    <div class="filters-container">\r
      <div class="filter-group">\r
        <label for="statusFilter">Filter by Status:</label>\r
        <select\r
          id="statusFilter"\r
          [(ngModel)]="statusFilter"\r
          (change)="onStatusFilterChange()"\r
          class="form-select">\r
          <option value="all">All Statuses</option>\r
          <option value="active">Active</option>\r
          <option value="inactive">Inactive</option>\r
        </select>\r
      </div>\r
\r
      <div class="filter-group">\r
        <label for="roleFilter">Filter by Role:</label>\r
        <select\r
          id="roleFilter"\r
          [(ngModel)]="roleFilter"\r
          (change)="onRoleFilterChange()"\r
          class="form-select">\r
          <option value="all">All Roles</option>\r
          <option value="1">Admin</option>\r
          <option value="2">Content Manager</option>\r
        </select>\r
      </div>\r
\r
      <div class="filter-group search-group">\r
        <label for="searchInput">Search:</label>\r
        <input\r
          type="text"\r
          id="searchInput"\r
          [(ngModel)]="searchQuery"\r
          (input)="onSearch()"\r
          placeholder="Search by username, name, or email..."\r
          class="search-input">\r
      </div>\r
    </div>\r
\r
    <!-- No Results Message -->\r
    <div *ngIf="filteredUsers.length === 0" class="empty-state">\r
      <p>No users found matching your criteria.</p>\r
      <a routerLink="/admin/users/add" class="btn btn-primary">Add First User</a>\r
    </div>\r
\r
    <!-- Pagination (Top) -->\r
    <div class="pagination-container" *ngIf="filteredUsers.length > 0">\r
      <div class="pagination-info">\r
        Showing {{ getPageStart() }}-{{ getPageEnd() }} of {{ filteredUsers.length }} total\r
      </div>\r
      <div class="pagination-controls">\r
        <button class="pagination-btn" (click)="previousPage()" [disabled]="currentPage === 1">\xAB Previous</button>\r
\r
        <button class="pagination-btn" (click)="goToPage(1)" *ngIf="getPageNumbers()[0] > 1">1</button>\r
        <span *ngIf="getPageNumbers()[0] > 2" style="padding: 0 8px; color: #666;">...</span>\r
\r
        <button\r
          *ngFor="let page of getPageNumbers()"\r
          class="pagination-btn"\r
          [class.active]="page === currentPage"\r
          [disabled]="page === currentPage && getTotalPages() === 1"\r
          (click)="goToPage(page)">\r
          {{ page }}\r
        </button>\r
\r
        <span *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1" style="padding: 0 8px; color: #666;">...</span>\r
        <button class="pagination-btn" (click)="goToPage(getTotalPages())" *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages()">{{ getTotalPages() }}</button>\r
\r
        <button class="pagination-btn" (click)="nextPage()" [disabled]="currentPage === getTotalPages()">Next \xBB</button>\r
      </div>\r
    </div>\r
\r
    <!-- Users Table -->\r
    <div class="table-container" *ngIf="filteredUsers.length > 0">\r
      <table class="data-table">\r
        <thead>\r
          <tr>\r
            <th class="col-picture">Picture</th>\r
            <th>Username</th>\r
            <th>Full Name</th>\r
            <th>Email</th>\r
            <th>Role</th>\r
            <th class="col-status">Status</th>\r
            <th class="actions">Actions</th>\r
          </tr>\r
        </thead>\r
        <tbody>\r
          <tr *ngFor="let user of getPaginatedUsers()">\r
            <td class="col-picture">\r
              <ng-container *ngIf="hasProfilePicture(user); else avatarPlaceholder">\r
                <img [src]="getProfilePicturePath(user)"\r
                     [alt]="user.full_name"\r
                     class="table-profile-pic"\r
                     (error)="$any($event.target).style.display='none'; $any($event.target).parentElement.innerHTML='<div class=\\'table-profile-placeholder\\'>\u{1F464}</div>'">\r
              </ng-container>\r
              <ng-template #avatarPlaceholder>\r
                <div class="table-profile-placeholder">\u{1F464}</div>\r
              </ng-template>\r
            </td>\r
            <td>\r
              <strong>{{ user.username }}</strong>\r
            </td>\r
            <td>{{ user.full_name }}</td>\r
            <td>\r
              <a [href]="'mailto:' + user.email" class="email-link">{{ user.email }}</a>\r
            </td>\r
            <td>\r
              <span *ngIf="user.role_name" class="role-badge">{{ user.role_name }}</span>\r
              <span *ngIf="!user.role_name" class="text-muted">No Role</span>\r
            </td>\r
            <td class="col-status">\r
              <span [ngClass]="getStatusBadgeClass(user.is_active)">\r
                {{ user.is_active ? '\u2713 Active' : 'Inactive' }}\r
              </span>\r
            </td>\r
            <td class="actions">\r
              <ng-container *ngIf="isMasterAdmin(user); else normalActions">\r
                <span title="Master Admin - Cannot be modified" class="locked-icon">\u{1F512}</span>\r
              </ng-container>\r
              <ng-template #normalActions>\r
                <a [routerLink]="['/admin/users/edit', user.id]" class="btn btn-sm btn-edit" title="Edit User">\u270F\uFE0F</a>\r
                <button\r
                  (click)="toggleUserActive(user)"\r
                  class="btn btn-sm btn-toggle"\r
                  [title]="user.is_active ? 'Deactivate User' : 'Activate User'">\r
                  {{ user.is_active ? '\u{1F441}\uFE0F' : '\u{1F6AB}' }}\r
                </button>\r
                <a [routerLink]="['/admin/users/delete', user.id]" class="btn btn-sm btn-delete" title="Delete User">\u{1F5D1}\uFE0F</a>\r
              </ng-template>\r
            </td>\r
          </tr>\r
        </tbody>\r
      </table>\r
    </div>\r
\r
    <!-- Pagination (Bottom) -->\r
    <div class="pagination-container" *ngIf="filteredUsers.length > 0">\r
      <div class="pagination-info">\r
        Showing {{ getPageStart() }}-{{ getPageEnd() }} of {{ filteredUsers.length }} total\r
      </div>\r
      <div class="pagination-controls">\r
        <button class="pagination-btn" (click)="previousPage()" [disabled]="currentPage === 1">\xAB Previous</button>\r
\r
        <button class="pagination-btn" (click)="goToPage(1)" *ngIf="getPageNumbers()[0] > 1">1</button>\r
        <span *ngIf="getPageNumbers()[0] > 2" style="padding: 0 8px; color: #666;">...</span>\r
\r
        <button\r
          *ngFor="let page of getPageNumbers()"\r
          class="pagination-btn"\r
          [class.active]="page === currentPage"\r
          [disabled]="page === currentPage && getTotalPages() === 1"\r
          (click)="goToPage(page)">\r
          {{ page }}\r
        </button>\r
\r
        <span *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1" style="padding: 0 8px; color: #666;">...</span>\r
        <button class="pagination-btn" (click)="goToPage(getTotalPages())" *ngIf="getPageNumbers()[getPageNumbers().length - 1] < getTotalPages()">{{ getTotalPages() }}</button>\r
\r
        <button class="pagination-btn" (click)="nextPage()" [disabled]="currentPage === getTotalPages()">Next \xBB</button>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/admin/users/user-list/user-list.component.css */\n.filters-container {\n  display: flex;\n  gap: 15px;\n  margin-bottom: 20px;\n  flex-wrap: wrap;\n}\n.filter-group {\n  flex: 1;\n  min-width: 200px;\n}\n.filter-group label {\n  display: block;\n  margin-bottom: 5px;\n  font-weight: 600;\n  color: #2d3561;\n  font-size: 14px;\n}\n.form-select {\n  width: 100%;\n  padding: 8px;\n  border-radius: 8px;\n  border: 2px solid #e0e0e0;\n  font-size: 14px;\n}\n.search-group {\n  min-width: 250px;\n}\n.search-input {\n  width: 100%;\n  padding: 8px;\n  border-radius: 8px;\n  border: 2px solid #e0e0e0;\n  font-size: 14px;\n}\n.search-input:focus,\n.form-select:focus {\n  outline: none;\n  border-color: #4a90e2;\n}\n.col-picture {\n  width: 60px;\n  text-align: center;\n}\n.table-profile-pic {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  object-fit: cover;\n}\n.table-profile-placeholder {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background: #f0f0f0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 20px;\n  margin: 0 auto;\n}\n.role-badge {\n  font-weight: 600;\n  color: #2d3561;\n}\n.text-muted {\n  color: #999;\n}\n.locked-icon {\n  font-size: 1.2rem;\n  color: #999;\n  cursor: not-allowed;\n}\n.email-link {\n  color: #4fc3f7;\n  text-decoration: none;\n}\n.email-link:hover {\n  text-decoration: underline;\n}\n.badge-success {\n  background: #e8f5e9;\n  color: #2e7d32;\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.badge-inactive {\n  background: #fafafa;\n  color: #666;\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.btn-toggle {\n  background: transparent;\n  border: 1px solid #ddd;\n  padding: 6px 12px;\n  cursor: pointer;\n  border-radius: 6px;\n  font-size: 16px;\n  transition: all 0.3s;\n}\n.btn-toggle:hover {\n  background: #f5f5f5;\n  border-color: #4a90e2;\n}\n.btn-delete {\n  background: transparent;\n  color: #dc3545;\n  border: 1px solid #ddd;\n  padding: 6px 12px;\n  cursor: pointer;\n  border-radius: 6px;\n  font-size: 16px;\n  transition: all 0.3s;\n  text-decoration: none;\n  display: inline-block;\n}\n.btn-delete:hover {\n  background: #dc3545;\n  color: white;\n  border-color: #dc3545;\n}\n.pagination-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 20px;\n  padding: 20px 0;\n  border-top: 1px solid #e0e0e0;\n}\n.pagination-info {\n  color: #666;\n  font-size: 0.9rem;\n}\n.pagination-controls {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n}\n.pagination-btn {\n  padding: 8px 12px;\n  border: 1px solid #ddd;\n  background: #ffffff;\n  color: #333;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n}\n.pagination-btn:hover:not(:disabled) {\n  background: #f5f5f5;\n  border-color: #4a90e2;\n}\n.pagination-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination-btn.active {\n  background: #4a90e2;\n  color: #ffffff;\n  border-color: #4a90e2;\n}\n/*# sourceMappingURL=user-list.component.css.map */\n"] }]
  }], () => [{ type: UsersService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UserListComponent, { className: "UserListComponent", filePath: "src/app/admin/users/user-list/user-list.component.ts", lineNumber: 11 });
})();

// src/app/admin/users/user-form/user-form.component.ts
var _c010 = (a0) => ["/admin/users/delete", a0];
function UserFormComponent_div_9_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "strong", 14);
    \u0275\u0275text(2, "Temporary Password:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "code", 15);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 16);
    \u0275\u0275text(6, " \u26A0\uFE0F ");
    \u0275\u0275elementStart(7, "strong");
    \u0275\u0275text(8, "Important:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, " Share this password securely with the user. They will be required to change it upon first login. ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.tempPassword);
  }
}
function UserFormComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 9)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, UserFormComponent_div_9_div_4_Template, 10, 1, "div", 10);
    \u0275\u0275elementStart(5, "div", 11)(6, "button", 12);
    \u0275\u0275listener("click", function UserFormComponent_div_9_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addAnotherUser());
    });
    \u0275\u0275text(7, "Add Another User");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("\u2713 ", ctx_r1.successMessage);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.tempPassword);
  }
}
function UserFormComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error);
  }
}
function UserFormComponent_form_11_div_1_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39);
    \u0275\u0275text(1, " \u26A0 Username cannot contain spaces ");
    \u0275\u0275elementEnd();
  }
}
function UserFormComponent_form_11_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "label", 36);
    \u0275\u0275text(2, "Username *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 37);
    \u0275\u0275twoWayListener("ngModelChange", function UserFormComponent_form_11_div_1_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.username, $event) || (ctx_r1.username = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "small");
    \u0275\u0275text(5, "Username for logging into the admin panel. Must be unique and cannot contain spaces.");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, UserFormComponent_form_11_div_1_div_6_Template, 2, 0, "div", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("error", ctx_r1.username && ctx_r1.hasSpaces(ctx_r1.username));
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.username);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.username && ctx_r1.hasSpaces(ctx_r1.username));
  }
}
function UserFormComponent_form_11_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "label");
    \u0275\u0275text(2, "Username");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 40);
    \u0275\u0275elementStart(4, "small");
    \u0275\u0275text(5, "Username cannot be changed.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx_r1.username);
  }
}
function UserFormComponent_form_11_div_3_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "div", 48);
    \u0275\u0275element(2, "div", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 50);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r1.passwordStrength, "%")("background", ctx_r1.passwordStrengthColor);
    \u0275\u0275advance();
    \u0275\u0275styleProp("color", ctx_r1.passwordStrengthColor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.passwordStrengthLabel);
  }
}
function UserFormComponent_form_11_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "label", 41);
    \u0275\u0275text(2, "Password *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 42)(4, "input", 43);
    \u0275\u0275twoWayListener("ngModelChange", function UserFormComponent_form_11_div_3_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.password, $event) || (ctx_r1.password = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function UserFormComponent_form_11_div_3_Template_input_ngModelChange_4_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onPasswordChange());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 44);
    \u0275\u0275listener("click", function UserFormComponent_form_11_div_3_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.togglePasswordVisibility("password"));
    });
    \u0275\u0275elementStart(6, "span", 45);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(8, UserFormComponent_form_11_div_3_div_8_Template, 5, 7, "div", 46);
    \u0275\u0275elementStart(9, "small");
    \u0275\u0275text(10, "Must be at least 8 characters with one uppercase letter (A-Z), one number (0-9), and one special character (e.g., !@#$%^&*). User will be required to change this on first login.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.password);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.showPassword ? "\u{1F648}" : "\u{1F441}\uFE0F");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.passwordStrength > 0);
  }
}
function UserFormComponent_form_11_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "label", 51);
    \u0275\u0275text(2, "Confirm Password *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 42)(4, "input", 52);
    \u0275\u0275twoWayListener("ngModelChange", function UserFormComponent_form_11_div_4_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.confirmPassword, $event) || (ctx_r1.confirmPassword = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 44);
    \u0275\u0275listener("click", function UserFormComponent_form_11_div_4_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.togglePasswordVisibility("confirmPassword"));
    });
    \u0275\u0275elementStart(6, "span", 45);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "small");
    \u0275\u0275text(9, "Re-enter the password to confirm.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.confirmPassword);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.showConfirmPassword ? "\u{1F648}" : "\u{1F441}\uFE0F");
  }
}
function UserFormComponent_form_11_option_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 53);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const role_r7 = ctx.$implicit;
    \u0275\u0275property("value", role_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(role_r7.role_name);
  }
}
function UserFormComponent_form_11_div_37_div_7_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "div", 48);
    \u0275\u0275element(2, "div", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 50);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r1.newPasswordStrength, "%")("background", ctx_r1.newPasswordStrengthColor);
    \u0275\u0275advance();
    \u0275\u0275styleProp("color", ctx_r1.newPasswordStrengthColor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.newPasswordStrengthLabel);
  }
}
function UserFormComponent_form_11_div_37_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 20)(2, "label", 57);
    \u0275\u0275text(3, "New Password");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 42)(5, "input", 58);
    \u0275\u0275twoWayListener("ngModelChange", function UserFormComponent_form_11_div_37_div_7_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r1.newPassword, $event) || (ctx_r1.newPassword = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function UserFormComponent_form_11_div_37_div_7_Template_input_ngModelChange_5_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onNewPasswordChange());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 44);
    \u0275\u0275listener("click", function UserFormComponent_form_11_div_37_div_7_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.togglePasswordVisibility("newPassword"));
    });
    \u0275\u0275elementStart(7, "span", 45);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(9, UserFormComponent_form_11_div_37_div_7_div_9_Template, 5, 7, "div", 46);
    \u0275\u0275elementStart(10, "small");
    \u0275\u0275text(11, "Must be at least 8 characters with one uppercase letter (A-Z), one number (0-9), and one special character (e.g., !@#$%^&*). User will NOT be required to change this password.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 20)(13, "label", 59);
    \u0275\u0275text(14, "Confirm New Password");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 42)(16, "input", 60);
    \u0275\u0275twoWayListener("ngModelChange", function UserFormComponent_form_11_div_37_div_7_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r1.confirmNewPassword, $event) || (ctx_r1.confirmNewPassword = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 44);
    \u0275\u0275listener("click", function UserFormComponent_form_11_div_37_div_7_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.togglePasswordVisibility("confirmNewPassword"));
    });
    \u0275\u0275elementStart(18, "span", 45);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newPassword);
    \u0275\u0275property("required", ctx_r1.changePassword);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.showNewPassword ? "\u{1F648}" : "\u{1F441}\uFE0F");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.newPasswordStrength > 0);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.confirmNewPassword);
    \u0275\u0275property("required", ctx_r1.changePassword);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.showConfirmNewPassword ? "\u{1F648}" : "\u{1F441}\uFE0F");
  }
}
function UserFormComponent_form_11_div_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 54)(1, "div", 20)(2, "label", 29)(3, "input", 55);
    \u0275\u0275twoWayListener("ngModelChange", function UserFormComponent_form_11_div_37_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.changePassword, $event) || (ctx_r1.changePassword = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function UserFormComponent_form_11_div_37_Template_input_change_3_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onChangePasswordToggle());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Change Password ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6, "Check this box if you want to reset the user's password.");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(7, UserFormComponent_form_11_div_37_div_7_Template, 20, 7, "div", 56);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.changePassword);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r1.changePassword);
  }
}
function UserFormComponent_form_11_div_38_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.user.last_login);
  }
}
function UserFormComponent_form_11_div_38_span_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Never logged in");
    \u0275\u0275elementEnd();
  }
}
function UserFormComponent_form_11_div_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54)(1, "h3", 61);
    \u0275\u0275text(2, "Account Information");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 62)(4, "span", 63);
    \u0275\u0275text(5, "Last Login:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 64);
    \u0275\u0275template(7, UserFormComponent_form_11_div_38_span_7_Template, 2, 1, "span", 56)(8, UserFormComponent_form_11_div_38_span_8_Template, 2, 0, "span", 56);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 62)(10, "span", 63);
    \u0275\u0275text(11, "Account Created:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 64);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275property("ngIf", ctx_r1.user.last_login);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.user.last_login);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.user.created_at);
  }
}
function UserFormComponent_form_11_a_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 65);
    \u0275\u0275text(1, "Delete User");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c010, ctx_r1.userId));
  }
}
function UserFormComponent_form_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 18);
    \u0275\u0275listener("ngSubmit", function UserFormComponent_form_11_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSubmit());
    });
    \u0275\u0275template(1, UserFormComponent_form_11_div_1_Template, 7, 4, "div", 19)(2, UserFormComponent_form_11_div_2_Template, 6, 1, "div", 19)(3, UserFormComponent_form_11_div_3_Template, 11, 3, "div", 19)(4, UserFormComponent_form_11_div_4_Template, 10, 2, "div", 19);
    \u0275\u0275elementStart(5, "div", 20)(6, "label", 21);
    \u0275\u0275text(7, "Full Name *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 22);
    \u0275\u0275twoWayListener("ngModelChange", function UserFormComponent_form_11_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.fullName, $event) || (ctx_r1.fullName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "small");
    \u0275\u0275text(10, "User's full name (displayed in admin panel).");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 20)(12, "label", 23);
    \u0275\u0275text(13, "Email Address *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 24);
    \u0275\u0275twoWayListener("ngModelChange", function UserFormComponent_form_11_Template_input_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.email, $event) || (ctx_r1.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "small");
    \u0275\u0275text(16, "Valid email address for notifications and password reset.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 20)(18, "label", 25);
    \u0275\u0275text(19, "Role *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "select", 26);
    \u0275\u0275twoWayListener("ngModelChange", function UserFormComponent_form_11_Template_select_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.roleId, $event) || (ctx_r1.roleId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(21, "option", 27);
    \u0275\u0275text(22, "-- Select Role --");
    \u0275\u0275elementEnd();
    \u0275\u0275template(23, UserFormComponent_form_11_option_23_Template, 2, 2, "option", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "small")(25, "strong");
    \u0275\u0275text(26, "Admin:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(27, " Full access including user management. | ");
    \u0275\u0275elementStart(28, "strong");
    \u0275\u0275text(29, "Content Manager:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(30, " Can manage all content sections. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div", 20)(32, "label", 29)(33, "input", 30);
    \u0275\u0275twoWayListener("ngModelChange", function UserFormComponent_form_11_Template_input_ngModelChange_33_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.isActive, $event) || (ctx_r1.isActive = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(34, " Active ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "small");
    \u0275\u0275text(36, "If checked, user can log in immediately. Uncheck to create inactive user.");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(37, UserFormComponent_form_11_div_37_Template, 8, 2, "div", 31)(38, UserFormComponent_form_11_div_38_Template, 14, 3, "div", 31);
    \u0275\u0275elementStart(39, "div", 32)(40, "button", 33);
    \u0275\u0275text(41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "a", 34);
    \u0275\u0275text(43, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275template(44, UserFormComponent_form_11_a_44_Template, 2, 3, "a", 35);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isEditMode);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isEditMode);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isEditMode);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isEditMode);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.fullName);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.email);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.roleId);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.roles);
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.isActive);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r1.isEditMode);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isEditMode && ctx_r1.user);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.loading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.loading ? ctx_r1.isEditMode ? "Updating..." : "Creating..." : ctx_r1.isEditMode ? "Update User" : "Create User", " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.isEditMode && ctx_r1.userId);
  }
}
var UserFormComponent = class _UserFormComponent {
  route;
  router;
  usersService;
  userId = null;
  isEditMode = false;
  user = null;
  roles = [];
  loading = false;
  error = null;
  tempPassword = null;
  successMessage = null;
  // Form fields
  username = "";
  password = "";
  confirmPassword = "";
  fullName = "";
  email = "";
  roleId = 0;
  isActive = true;
  // Edit mode only
  changePassword = false;
  newPassword = "";
  confirmNewPassword = "";
  // Password visibility toggles
  showPassword = false;
  showConfirmPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;
  // Password strength indicators (for create mode)
  passwordStrength = 0;
  passwordStrengthLabel = "";
  passwordStrengthColor = "";
  // Password strength indicators (for edit mode)
  newPasswordStrength = 0;
  newPasswordStrengthLabel = "";
  newPasswordStrengthColor = "";
  constructor(route, router, usersService) {
    this.route = route;
    this.router = router;
    this.usersService = usersService;
  }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.userId = parseInt(id, 10);
      this.isEditMode = true;
      this.loadUser();
    }
    this.loadRoles();
  }
  loadUser() {
    if (!this.userId)
      return;
    this.loading = true;
    this.usersService.getById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.username = user.username;
        this.fullName = user.full_name;
        this.email = user.email;
        this.roleId = user.role_id;
        this.isActive = user.is_active;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load user";
        this.loading = false;
        console.error(err);
      }
    });
  }
  loadRoles() {
    this.usersService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        if (!this.isEditMode && roles.length > 0) {
          this.roleId = roles[0].id;
        }
      },
      error: (err) => {
        console.error("Error loading roles:", err);
      }
    });
  }
  togglePasswordVisibility(field) {
    const passwordField = document.getElementById(field);
    if (!passwordField)
      return;
    switch (field) {
      case "password":
        this.showPassword = !this.showPassword;
        break;
      case "confirmPassword":
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
      case "newPassword":
        this.showNewPassword = !this.showNewPassword;
        break;
      case "confirmNewPassword":
        this.showConfirmNewPassword = !this.showConfirmNewPassword;
        break;
    }
    passwordField.type = passwordField.type === "password" ? "text" : "password";
  }
  onChangePasswordToggle() {
    if (!this.changePassword) {
      this.newPassword = "";
      this.confirmNewPassword = "";
    }
  }
  onSubmit() {
    this.error = null;
    if (!this.fullName || !this.email || !this.roleId) {
      this.error = "Please fill in all required fields";
      return;
    }
    if (!this.isEditMode) {
      if (!this.username || !this.password) {
        this.error = "Username and password are required";
        return;
      }
      if (/\s/.test(this.username)) {
        this.error = "Username cannot contain spaces";
        return;
      }
      if (this.password.length < 8) {
        this.error = "Password must be at least 8 characters long";
        return;
      }
      if (!/[A-Z]/.test(this.password)) {
        this.error = "Password must contain at least one uppercase letter (A-Z)";
        return;
      }
      if (!/[0-9]/.test(this.password)) {
        this.error = "Password must contain at least one number (0-9)";
        return;
      }
      if (!/[^a-zA-Z0-9]/.test(this.password)) {
        this.error = "Password must contain at least one special character (e.g., !@#$%^&*)";
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords do not match";
        return;
      }
      this.createUser();
    } else {
      if (this.changePassword) {
        if (!this.newPassword) {
          this.error = 'New password is required when "Change Password" is checked';
          return;
        }
        if (this.newPassword.length < 8) {
          this.error = "Password must be at least 8 characters long";
          return;
        }
        if (!/[A-Z]/.test(this.newPassword)) {
          this.error = "Password must contain at least one uppercase letter (A-Z)";
          return;
        }
        if (!/[0-9]/.test(this.newPassword)) {
          this.error = "Password must contain at least one number (0-9)";
          return;
        }
        if (!/[^a-zA-Z0-9]/.test(this.newPassword)) {
          this.error = "Password must contain at least one special character (e.g., !@#$%^&*)";
          return;
        }
        if (this.newPassword !== this.confirmNewPassword) {
          this.error = "Passwords do not match";
          return;
        }
      }
      this.updateUser();
    }
  }
  createUser() {
    const newUser = {
      username: this.username,
      password: this.password,
      full_name: this.fullName,
      email: this.email,
      role_id: this.roleId,
      is_active: this.isActive
    };
    this.loading = true;
    this.usersService.create(newUser).subscribe({
      next: () => {
        this.tempPassword = this.password;
        this.successMessage = "User created successfully!";
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || "Failed to create user";
        this.loading = false;
      }
    });
  }
  updateUser() {
    if (!this.userId)
      return;
    const updatedUser = {
      id: this.userId,
      full_name: this.fullName,
      email: this.email,
      role_id: this.roleId,
      is_active: this.isActive
    };
    if (this.changePassword && this.newPassword) {
      updatedUser.password = this.newPassword;
    }
    this.loading = true;
    this.usersService.update(updatedUser).subscribe({
      next: () => {
        this.successMessage = "User updated successfully";
        this.changePassword = false;
        this.newPassword = "";
        this.confirmNewPassword = "";
        this.loadUser();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || "Failed to update user";
        this.loading = false;
      }
    });
  }
  cancel() {
    this.router.navigate(["/admin/users"]);
  }
  addAnotherUser() {
    this.successMessage = null;
    this.tempPassword = null;
    this.error = null;
    this.username = "";
    this.password = "";
    this.confirmPassword = "";
    this.fullName = "";
    this.email = "";
    this.isActive = true;
  }
  onPasswordChange() {
    this.calculatePasswordStrength(this.password, "create");
  }
  onNewPasswordChange() {
    this.calculatePasswordStrength(this.newPassword, "edit");
  }
  hasSpaces(value) {
    return /\s/.test(value);
  }
  calculatePasswordStrength(password, mode) {
    if (!password) {
      if (mode === "create") {
        this.passwordStrength = 0;
        this.passwordStrengthLabel = "";
        this.passwordStrengthColor = "";
      } else {
        this.newPasswordStrength = 0;
        this.newPasswordStrengthLabel = "";
        this.newPasswordStrengthColor = "";
      }
      return;
    }
    let strength = 0;
    if (password.length >= 8)
      strength += 20;
    if (password.length >= 12)
      strength += 10;
    if (password.length >= 16)
      strength += 10;
    if (/[a-z]/.test(password))
      strength += 10;
    if (/[A-Z]/.test(password))
      strength += 15;
    if (/[0-9]/.test(password))
      strength += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      strength += 20;
    const types = [/[a-z]/, /[A-Z]/, /[0-9]/, /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/];
    const typeCount = types.filter((regex) => regex.test(password)).length;
    if (typeCount >= 4)
      strength += 10;
    strength = Math.min(strength, 100);
    let label = "";
    let color = "";
    if (strength < 20) {
      label = "Weak";
      color = "#dc3545";
    } else if (strength < 40) {
      label = "Fair";
      color = "#fd7e14";
    } else if (strength < 60) {
      label = "Medium";
      color = "#ffc107";
    } else if (strength < 80) {
      label = "Good";
      color = "#90EE90";
    } else {
      label = "Strong";
      color = "#28a745";
    }
    if (mode === "create") {
      this.passwordStrength = strength;
      this.passwordStrengthLabel = label;
      this.passwordStrengthColor = color;
    } else {
      this.newPasswordStrength = strength;
      this.newPasswordStrengthLabel = label;
      this.newPasswordStrengthColor = color;
    }
  }
  static \u0275fac = function UserFormComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserFormComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(UsersService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UserFormComponent, selectors: [["app-user-form"]], standalone: false, decls: 12, vars: 5, consts: [[1, "content-header"], [1, "section-subtitle"], [1, "action-bar"], [1, "btn", "btn-secondary", 3, "click"], [1, "section"], ["class", "success-container", 4, "ngIf"], ["class", "alert alert-error", 4, "ngIf"], ["class", "admin-form", 3, "ngSubmit", 4, "ngIf"], [1, "success-container"], [1, "alert", "alert-success"], ["class", "temp-password-box", 4, "ngIf"], [1, "success-actions"], ["type", "button", 1, "btn", "btn-primary", 3, "click"], [1, "temp-password-box"], [1, "temp-password-label"], [1, "temp-password-code"], [1, "temp-password-warning"], [1, "alert", "alert-error"], [1, "admin-form", 3, "ngSubmit"], ["class", "form-group", 4, "ngIf"], [1, "form-group"], ["for", "fullName"], ["type", "text", "id", "fullName", "name", "fullName", "required", "", "maxlength", "100", 3, "ngModelChange", "ngModel"], ["for", "email"], ["type", "email", "id", "email", "name", "email", "required", "", "maxlength", "100", 3, "ngModelChange", "ngModel"], ["for", "roleId"], ["id", "roleId", "name", "roleId", "required", "", 3, "ngModelChange", "ngModel"], ["disabled", "", 3, "value"], [3, "value", 4, "ngFor", "ngForOf"], [1, "checkbox-label"], ["type", "checkbox", "name", "isActive", 3, "ngModelChange", "ngModel"], ["style", "margin: 30px 0; padding: 20px; background: #f5f7fa; border-radius: 8px;", 4, "ngIf"], [1, "form-actions"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["routerLink", "/admin/users", 1, "btn", "btn-secondary"], ["class", "btn btn-danger btn-delete-right", 3, "routerLink", 4, "ngIf"], ["for", "username"], ["type", "text", "id", "username", "name", "username", "required", "", "maxlength", "50", "autocomplete", "off", 3, "ngModelChange", "ngModel"], ["class", "error-message", "style", "color: #dc3545; margin-top: 5px;", 4, "ngIf"], [1, "error-message", 2, "color", "#dc3545", "margin-top", "5px"], ["type", "text", "readonly", "", 2, "background-color", "#f5f7fa", "cursor", "not-allowed", 3, "value"], ["for", "password"], [1, "password-input-wrapper"], ["type", "password", "id", "password", "name", "password", "required", "", "minlength", "8", "autocomplete", "new-password", 3, "ngModelChange", "ngModel"], ["type", "button", "aria-label", "Toggle password visibility", 1, "password-toggle", 3, "click"], [1, "toggle-icon"], ["class", "password-strength", "style", "margin-top: 8px;", 4, "ngIf"], [1, "password-strength", 2, "margin-top", "8px"], [1, "strength-bar-container", 2, "width", "100%", "height", "6px", "background", "#e0e0e0", "border-radius", "3px", "overflow", "hidden"], [1, "strength-bar", 2, "height", "100%", "transition", "width 0.3s ease, background 0.3s ease"], [1, "strength-label", 2, "font-size", "12px", "font-weight", "600", "margin-top", "4px", "display", "inline-block"], ["for", "confirmPassword"], ["type", "password", "id", "confirmPassword", "name", "confirmPassword", "required", "", "minlength", "8", "autocomplete", "new-password", 3, "ngModelChange", "ngModel"], [3, "value"], [2, "margin", "30px 0", "padding", "20px", "background", "#f5f7fa", "border-radius", "8px"], ["type", "checkbox", "id", "changePasswordCheck", "name", "changePassword", 3, "ngModelChange", "change", "ngModel"], [4, "ngIf"], ["for", "newPassword"], ["type", "password", "id", "newPassword", "name", "newPassword", "minlength", "8", "autocomplete", "new-password", 3, "ngModelChange", "ngModel", "required"], ["for", "confirmNewPassword"], ["type", "password", "id", "confirmNewPassword", "name", "confirmNewPassword", "minlength", "8", "autocomplete", "new-password", 3, "ngModelChange", "ngModel", "required"], [2, "margin-bottom", "15px", "color", "#2d3561"], [1, "info-row"], [1, "info-label"], [1, "info-value"], [1, "btn", "btn-danger", "btn-delete-right", 3, "routerLink"]], template: function UserFormComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 1);
      \u0275\u0275text(4);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
      \u0275\u0275listener("click", function UserFormComponent_Template_button_click_6_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(7, " \u2190 Back to User Management ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 4);
      \u0275\u0275template(9, UserFormComponent_div_9_Template, 8, 2, "div", 5)(10, UserFormComponent_div_10_Template, 2, 1, "div", 6)(11, UserFormComponent_form_11_Template, 45, 15, "form", 7);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.isEditMode ? "Edit User" : "Add New User");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.isEditMode ? "Update user account details" : "Create a new admin user account");
      \u0275\u0275advance(5);
      \u0275\u0275property("ngIf", ctx.successMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.successMessage);
    }
  }, dependencies: [NgForOf, NgIf, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, MaxLengthValidator, NgModel, NgForm, RouterLink], styles: ['\n\n.password-input-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.password-input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  flex: 1;\n  padding-right: 45px;\n}\n.password-toggle[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: transparent !important;\n  border: none !important;\n  color: #666;\n  cursor: pointer;\n  font-size: 18px;\n  padding: 5px 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: color 0.3s ease;\n  outline: none;\n}\n.password-toggle[_ngcontent-%COMP%]:hover {\n  color: #4fc3f7;\n}\n.password-toggle[_ngcontent-%COMP%]:focus {\n  outline: none;\n}\n.toggle-icon[_ngcontent-%COMP%] {\n  display: inline-block;\n  line-height: 1;\n}\n.info-row[_ngcontent-%COMP%] {\n  display: flex;\n  padding: 12px 0;\n  border-bottom: 1px solid #e0e0e0;\n}\n.info-row[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.info-label[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #2d3561;\n  min-width: 150px;\n  flex-shrink: 0;\n}\n.info-value[_ngcontent-%COMP%] {\n  color: #666;\n  flex: 1;\n}\n.badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.badge-success[_ngcontent-%COMP%] {\n  background: #e8f5e9;\n  color: #2e7d32;\n}\n.badge-inactive[_ngcontent-%COMP%] {\n  background: #fafafa;\n  color: #666;\n}\n.success-container[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 30px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n  max-width: 800px;\n}\n.success-container[_ngcontent-%COMP%]   .alert[_ngcontent-%COMP%] {\n  margin: 0 0 20px 0;\n}\n.temp-password-box[_ngcontent-%COMP%] {\n  padding: 20px;\n  background: #f8f9fa;\n  border-left: 4px solid #4fc3f7;\n  border-radius: 6px;\n  margin-bottom: 20px;\n}\n.temp-password-label[_ngcontent-%COMP%] {\n  color: #2d3561;\n  font-size: 1rem;\n}\n.temp-password-code[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 12px;\n  padding: 12px 15px;\n  background: #ffffff;\n  border-radius: 6px;\n  font-size: 1.2rem;\n  font-family:\n    "Courier New",\n    Courier,\n    monospace;\n  color: #2d3561;\n  letter-spacing: 0.5px;\n  border: 1px solid #e0e0e0;\n}\n.temp-password-warning[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  margin-bottom: 0;\n  color: #666;\n  font-size: 0.9rem;\n  line-height: 1.5;\n}\n.success-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding-top: 20px;\n  border-top: 1px solid #e0e0e0;\n}\n.success-actions[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  width: 50%;\n  max-width: 300px;\n  text-align: center;\n}\n.success-actions[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px) scale(1.02);\n  box-shadow: 0 4px 12px rgba(79, 195, 247, 0.3);\n}\n/*# sourceMappingURL=user-form.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserFormComponent, [{
    type: Component,
    args: [{ selector: "app-user-form", standalone: false, template: `<div class="content-header">\r
  <h1>{{ isEditMode ? 'Edit User' : 'Add New User' }}</h1>\r
  <p class="section-subtitle">{{ isEditMode ? 'Update user account details' : 'Create a new admin user account' }}</p>\r
</div>\r
\r
<div class="action-bar">\r
  <button class="btn btn-secondary" (click)="cancel()">\r
    \u2190 Back to User Management\r
  </button>\r
</div>\r
\r
<div class="section">\r
  <!-- Success Message with Temp Password -->\r
  <div *ngIf="successMessage" class="success-container">\r
    <div class="alert alert-success">\r
      <strong>\u2713 {{ successMessage }}</strong>\r
    </div>\r
\r
    <div *ngIf="tempPassword" class="temp-password-box">\r
      <strong class="temp-password-label">Temporary Password:</strong>\r
      <code class="temp-password-code">{{ tempPassword }}</code>\r
      <p class="temp-password-warning">\r
        \u26A0\uFE0F <strong>Important:</strong> Share this password securely with the user.\r
        They will be required to change it upon first login.\r
      </p>\r
    </div>\r
\r
    <div class="success-actions">\r
      <button type="button" class="btn btn-primary" (click)="addAnotherUser()">Add Another User</button>\r
    </div>\r
  </div>\r
\r
  <!-- Error Message -->\r
  <div *ngIf="error" class="alert alert-error">{{ error }}</div>\r
\r
  <!-- User Form -->\r
  <form *ngIf="!successMessage" (ngSubmit)="onSubmit()" class="admin-form">\r
    <!-- Username (Add Mode Only) -->\r
    <div class="form-group" *ngIf="!isEditMode">\r
      <label for="username">Username *</label>\r
      <input type="text" id="username" [(ngModel)]="username" name="username" required maxlength="50" autocomplete="off" [class.error]="username && hasSpaces(username)">\r
      <small>Username for logging into the admin panel. Must be unique and cannot contain spaces.</small>\r
      <div *ngIf="username && hasSpaces(username)" class="error-message" style="color: #dc3545; margin-top: 5px;">\r
        \u26A0 Username cannot contain spaces\r
      </div>\r
    </div>\r
\r
    <!-- Username (Edit Mode - Read Only) -->\r
    <div class="form-group" *ngIf="isEditMode">\r
      <label>Username</label>\r
      <input type="text" [value]="username" readonly style="background-color: #f5f7fa; cursor: not-allowed;">\r
      <small>Username cannot be changed.</small>\r
    </div>\r
\r
    <!-- Password (Add Mode Only) -->\r
    <div class="form-group" *ngIf="!isEditMode">\r
      <label for="password">Password *</label>\r
      <div class="password-input-wrapper">\r
        <input type="password" id="password" [(ngModel)]="password" name="password" required minlength="8" autocomplete="new-password" (ngModelChange)="onPasswordChange()">\r
        <button type="button" class="password-toggle" (click)="togglePasswordVisibility('password')" aria-label="Toggle password visibility">\r
          <span class="toggle-icon">{{ showPassword ? '\u{1F648}' : '\u{1F441}\uFE0F' }}</span>\r
        </button>\r
      </div>\r
      <!-- Password Strength Indicator -->\r
      <div *ngIf="passwordStrength > 0" class="password-strength" style="margin-top: 8px;">\r
        <div class="strength-bar-container" style="width: 100%; height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden;">\r
          <div class="strength-bar" [style.width.%]="passwordStrength" [style.background]="passwordStrengthColor" style="height: 100%; transition: width 0.3s ease, background 0.3s ease;"></div>\r
        </div>\r
        <span class="strength-label" [style.color]="passwordStrengthColor" style="font-size: 12px; font-weight: 600; margin-top: 4px; display: inline-block;">{{ passwordStrengthLabel }}</span>\r
      </div>\r
      <small>Must be at least 8 characters with one uppercase letter (A-Z), one number (0-9), and one special character (e.g., !@#$%^&*). User will be required to change this on first login.</small>\r
    </div>\r
\r
    <!-- Confirm Password (Add Mode Only) -->\r
    <div class="form-group" *ngIf="!isEditMode">\r
      <label for="confirmPassword">Confirm Password *</label>\r
      <div class="password-input-wrapper">\r
        <input type="password" id="confirmPassword" [(ngModel)]="confirmPassword" name="confirmPassword" required minlength="8" autocomplete="new-password">\r
        <button type="button" class="password-toggle" (click)="togglePasswordVisibility('confirmPassword')" aria-label="Toggle password visibility">\r
          <span class="toggle-icon">{{ showConfirmPassword ? '\u{1F648}' : '\u{1F441}\uFE0F' }}</span>\r
        </button>\r
      </div>\r
      <small>Re-enter the password to confirm.</small>\r
    </div>\r
\r
    <!-- Full Name -->\r
    <div class="form-group">\r
      <label for="fullName">Full Name *</label>\r
      <input type="text" id="fullName" [(ngModel)]="fullName" name="fullName" required maxlength="100">\r
      <small>User's full name (displayed in admin panel).</small>\r
    </div>\r
\r
    <!-- Email -->\r
    <div class="form-group">\r
      <label for="email">Email Address *</label>\r
      <input type="email" id="email" [(ngModel)]="email" name="email" required maxlength="100">\r
      <small>Valid email address for notifications and password reset.</small>\r
    </div>\r
\r
    <!-- Role -->\r
    <div class="form-group">\r
      <label for="roleId">Role *</label>\r
      <select id="roleId" [(ngModel)]="roleId" name="roleId" required>\r
        <option [value]="0" disabled>-- Select Role --</option>\r
        <option *ngFor="let role of roles" [value]="role.id">{{ role.role_name }}</option>\r
      </select>\r
      <small>\r
        <strong>Admin:</strong> Full access including user management. |\r
        <strong>Content Manager:</strong> Can manage all content sections.\r
      </small>\r
    </div>\r
\r
    <!-- Active Status -->\r
    <div class="form-group">\r
      <label class="checkbox-label">\r
        <input type="checkbox" [(ngModel)]="isActive" name="isActive">\r
        Active\r
      </label>\r
      <small>If checked, user can log in immediately. Uncheck to create inactive user.</small>\r
    </div>\r
\r
    <!-- Password Change Section (Edit Mode Only) -->\r
    <div *ngIf="isEditMode" style="margin: 30px 0; padding: 20px; background: #f5f7fa; border-radius: 8px;">\r
      <div class="form-group">\r
        <label class="checkbox-label">\r
          <input type="checkbox" id="changePasswordCheck" [(ngModel)]="changePassword" name="changePassword" (change)="onChangePasswordToggle()">\r
          Change Password\r
        </label>\r
        <small>Check this box if you want to reset the user's password.</small>\r
      </div>\r
\r
      <div *ngIf="changePassword">\r
        <div class="form-group">\r
          <label for="newPassword">New Password</label>\r
          <div class="password-input-wrapper">\r
            <input type="password" id="newPassword" [(ngModel)]="newPassword" name="newPassword" minlength="8" [required]="changePassword" autocomplete="new-password" (ngModelChange)="onNewPasswordChange()">\r
            <button type="button" class="password-toggle" (click)="togglePasswordVisibility('newPassword')" aria-label="Toggle password visibility">\r
              <span class="toggle-icon">{{ showNewPassword ? '\u{1F648}' : '\u{1F441}\uFE0F' }}</span>\r
            </button>\r
          </div>\r
          <!-- Password Strength Indicator -->\r
          <div *ngIf="newPasswordStrength > 0" class="password-strength" style="margin-top: 8px;">\r
            <div class="strength-bar-container" style="width: 100%; height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden;">\r
              <div class="strength-bar" [style.width.%]="newPasswordStrength" [style.background]="newPasswordStrengthColor" style="height: 100%; transition: width 0.3s ease, background 0.3s ease;"></div>\r
            </div>\r
            <span class="strength-label" [style.color]="newPasswordStrengthColor" style="font-size: 12px; font-weight: 600; margin-top: 4px; display: inline-block;">{{ newPasswordStrengthLabel }}</span>\r
          </div>\r
          <small>Must be at least 8 characters with one uppercase letter (A-Z), one number (0-9), and one special character (e.g., !@#$%^&*). User will NOT be required to change this password.</small>\r
        </div>\r
\r
        <div class="form-group">\r
          <label for="confirmNewPassword">Confirm New Password</label>\r
          <div class="password-input-wrapper">\r
            <input type="password" id="confirmNewPassword" [(ngModel)]="confirmNewPassword" name="confirmNewPassword" minlength="8" [required]="changePassword" autocomplete="new-password">\r
            <button type="button" class="password-toggle" (click)="togglePasswordVisibility('confirmNewPassword')" aria-label="Toggle password visibility">\r
              <span class="toggle-icon">{{ showConfirmNewPassword ? '\u{1F648}' : '\u{1F441}\uFE0F' }}</span>\r
            </button>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- Read-Only Information (Edit Mode Only) -->\r
    <div *ngIf="isEditMode && user" style="margin: 30px 0; padding: 20px; background: #f5f7fa; border-radius: 8px;">\r
      <h3 style="margin-bottom: 15px; color: #2d3561;">Account Information</h3>\r
\r
      <div class="info-row">\r
        <span class="info-label">Last Login:</span>\r
        <span class="info-value">\r
          <span *ngIf="user.last_login">{{ user.last_login }}</span>\r
          <span *ngIf="!user.last_login">Never logged in</span>\r
        </span>\r
      </div>\r
\r
      <div class="info-row">\r
        <span class="info-label">Account Created:</span>\r
        <span class="info-value">{{ user.created_at }}</span>\r
      </div>\r
    </div>\r
\r
    <!-- Form Actions -->\r
    <div class="form-actions">\r
      <button type="submit" class="btn btn-primary" [disabled]="loading">\r
        {{ loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update User' : 'Create User') }}\r
      </button>\r
      <a routerLink="/admin/users" class="btn btn-secondary">Cancel</a>\r
      <a *ngIf="isEditMode && userId" [routerLink]="['/admin/users/delete', userId]" class="btn btn-danger btn-delete-right">Delete User</a>\r
    </div>\r
  </form>\r
</div>\r
`, styles: ['/* src/app/admin/users/user-form/user-form.component.css */\n.password-input-wrapper {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.password-input-wrapper input {\n  flex: 1;\n  padding-right: 45px;\n}\n.password-toggle {\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: transparent !important;\n  border: none !important;\n  color: #666;\n  cursor: pointer;\n  font-size: 18px;\n  padding: 5px 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: color 0.3s ease;\n  outline: none;\n}\n.password-toggle:hover {\n  color: #4fc3f7;\n}\n.password-toggle:focus {\n  outline: none;\n}\n.toggle-icon {\n  display: inline-block;\n  line-height: 1;\n}\n.info-row {\n  display: flex;\n  padding: 12px 0;\n  border-bottom: 1px solid #e0e0e0;\n}\n.info-row:last-child {\n  border-bottom: none;\n}\n.info-label {\n  font-weight: 600;\n  color: #2d3561;\n  min-width: 150px;\n  flex-shrink: 0;\n}\n.info-value {\n  color: #666;\n  flex: 1;\n}\n.badge {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.badge-success {\n  background: #e8f5e9;\n  color: #2e7d32;\n}\n.badge-inactive {\n  background: #fafafa;\n  color: #666;\n}\n.success-container {\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 30px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n  max-width: 800px;\n}\n.success-container .alert {\n  margin: 0 0 20px 0;\n}\n.temp-password-box {\n  padding: 20px;\n  background: #f8f9fa;\n  border-left: 4px solid #4fc3f7;\n  border-radius: 6px;\n  margin-bottom: 20px;\n}\n.temp-password-label {\n  color: #2d3561;\n  font-size: 1rem;\n}\n.temp-password-code {\n  display: block;\n  margin-top: 12px;\n  padding: 12px 15px;\n  background: #ffffff;\n  border-radius: 6px;\n  font-size: 1.2rem;\n  font-family:\n    "Courier New",\n    Courier,\n    monospace;\n  color: #2d3561;\n  letter-spacing: 0.5px;\n  border: 1px solid #e0e0e0;\n}\n.temp-password-warning {\n  margin-top: 12px;\n  margin-bottom: 0;\n  color: #666;\n  font-size: 0.9rem;\n  line-height: 1.5;\n}\n.success-actions {\n  display: flex;\n  justify-content: center;\n  padding-top: 20px;\n  border-top: 1px solid #e0e0e0;\n}\n.success-actions .btn {\n  width: 50%;\n  max-width: 300px;\n  text-align: center;\n}\n.success-actions .btn:hover {\n  transform: translateY(-2px) scale(1.02);\n  box-shadow: 0 4px 12px rgba(79, 195, 247, 0.3);\n}\n/*# sourceMappingURL=user-form.component.css.map */\n'] }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: UsersService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UserFormComponent, { className: "UserFormComponent", filePath: "src/app/admin/users/user-form/user-form.component.ts", lineNumber: 12 });
})();

// src/app/admin/users/user-delete/user-delete.ts
var _c011 = (a0) => ["/admin/users/edit", a0];
function UserDeleteComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1, "Loading...");
    \u0275\u0275elementEnd();
  }
}
function UserDeleteComponent_div_10_a_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 13);
    \u0275\u0275text(1, "Edit User Instead");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c011, ctx_r0.userId));
  }
}
function UserDeleteComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "div", 10)(3, "a", 11);
    \u0275\u0275text(4, "\u2190 Back to User Management");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, UserDeleteComponent_div_10_a_5_Template, 2, 3, "a", 12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.user);
  }
}
function UserDeleteComponent_div_11_span_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.user.role_name);
  }
}
function UserDeleteComponent_div_11_span_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1, "No Role Assigned");
    \u0275\u0275elementEnd();
  }
}
function UserDeleteComponent_div_11_span_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275text(1, "\u2713 Active");
    \u0275\u0275elementEnd();
  }
}
function UserDeleteComponent_div_11_span_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 36);
    \u0275\u0275text(1, "Inactive");
    \u0275\u0275elementEnd();
  }
}
function UserDeleteComponent_div_11_span_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.user.last_login);
  }
}
function UserDeleteComponent_div_11_span_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Never logged in");
    \u0275\u0275elementEnd();
  }
}
function UserDeleteComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 15)(2, "div", 16)(3, "div", 17);
    \u0275\u0275text(4, "\u26A0\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div")(6, "h3", 18);
    \u0275\u0275text(7, "Warning: Permanent Deletion");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 19);
    \u0275\u0275text(9, " You are about to permanently delete this user account. This action cannot be undone. All user data will be permanently removed from the system. ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(10, "div", 20)(11, "h3", 21);
    \u0275\u0275text(12, "User Details:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 22)(14, "span", 23);
    \u0275\u0275text(15, "Username:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 24);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 22)(19, "span", 23);
    \u0275\u0275text(20, "Full Name:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 24);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 22)(24, "span", 23);
    \u0275\u0275text(25, "Email:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span", 24);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 22)(29, "span", 23);
    \u0275\u0275text(30, "Role:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span", 24);
    \u0275\u0275template(32, UserDeleteComponent_div_11_span_32_Template, 2, 1, "span", 25)(33, UserDeleteComponent_div_11_span_33_Template, 2, 0, "span", 26);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "div", 22)(35, "span", 23);
    \u0275\u0275text(36, "Status:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "span", 24);
    \u0275\u0275template(38, UserDeleteComponent_div_11_span_38_Template, 2, 0, "span", 27)(39, UserDeleteComponent_div_11_span_39_Template, 2, 0, "span", 28);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "div", 22)(41, "span", 23);
    \u0275\u0275text(42, "Last Login:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "span", 24);
    \u0275\u0275template(44, UserDeleteComponent_div_11_span_44_Template, 2, 1, "span", 25)(45, UserDeleteComponent_div_11_span_45_Template, 2, 0, "span", 25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 22)(47, "span", 23);
    \u0275\u0275text(48, "Created:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "span", 24);
    \u0275\u0275text(50);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(51, "div", 29)(52, "div", 30)(53, "p", 31);
    \u0275\u0275text(54, " Are you absolutely sure you want to delete this user? ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(55, "div", 32)(56, "button", 33);
    \u0275\u0275listener("click", function UserDeleteComponent_div_11_Template_button_click_56_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.confirmDelete());
    });
    \u0275\u0275text(57);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "button", 3);
    \u0275\u0275listener("click", function UserDeleteComponent_div_11_Template_button_click_58_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cancel());
    });
    \u0275\u0275text(59, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "a", 13);
    \u0275\u0275text(61, "Edit Instead");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(17);
    \u0275\u0275textInterpolate(ctx_r0.user.username);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.user.full_name);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.user.email);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r0.user.role_name);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.user.role_name);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r0.user.is_active);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.user.is_active);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r0.user.last_login);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.user.last_login);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.user.created_at);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u{1F5D1}\uFE0F ", ctx_r0.loading ? "Deleting..." : "Yes, Delete User", " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(13, _c011, ctx_r0.userId));
  }
}
var UserDeleteComponent = class _UserDeleteComponent {
  route;
  router;
  usersService;
  userId = null;
  user = null;
  loading = false;
  error = null;
  constructor(route, router, usersService) {
    this.route = route;
    this.router = router;
    this.usersService = usersService;
  }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.userId = parseInt(id, 10);
      this.loadUser();
    } else {
      this.router.navigate(["/admin/users"]);
    }
  }
  loadUser() {
    if (!this.userId)
      return;
    this.loading = true;
    this.usersService.getById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        if (user.username === "admin") {
          this.error = "The master admin account cannot be deleted.";
        }
        this.loading = false;
      },
      error: () => {
        this.error = "User not found";
        this.loading = false;
      }
    });
  }
  confirmDelete() {
    if (!this.userId || this.error)
      return;
    this.loading = true;
    this.usersService.delete(this.userId).subscribe({
      next: () => {
        this.router.navigate(["/admin/users"]);
      },
      error: (err) => {
        this.error = err.message || "Failed to delete user";
        this.loading = false;
      }
    });
  }
  cancel() {
    this.router.navigate(["/admin/users"]);
  }
  static \u0275fac = function UserDeleteComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserDeleteComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(UsersService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UserDeleteComponent, selectors: [["app-user-delete"]], standalone: false, decls: 12, vars: 3, consts: [[1, "content-header"], [1, "section-subtitle"], [1, "action-bar"], [1, "btn", "btn-secondary", 3, "click"], [1, "section"], ["class", "loading-container", 4, "ngIf"], ["class", "alert alert-error", 4, "ngIf"], ["style", "max-width: 700px;", 4, "ngIf"], [1, "loading-container"], [1, "alert", "alert-error"], [2, "margin-top", "20px"], ["routerLink", "/admin/users", 1, "btn", "btn-secondary"], ["class", "btn btn-primary", 3, "routerLink", 4, "ngIf"], [1, "btn", "btn-primary", 3, "routerLink"], [2, "max-width", "700px"], [2, "background", "#fff3cd", "border-left", "4px solid #ffc107", "padding", "20px", "border-radius", "8px", "margin-bottom", "30px"], [2, "display", "flex", "align-items", "flex-start", "gap", "15px"], [2, "font-size", "2rem"], [2, "margin", "0 0 10px 0", "color", "#856404"], [2, "margin", "0", "color", "#856404", "line-height", "1.6"], [1, "admin-form"], [2, "margin-bottom", "20px", "color", "#2d3561"], [1, "info-row"], [1, "info-label"], [1, "info-value"], [4, "ngIf"], ["style", "color: #999;", 4, "ngIf"], ["class", "badge badge-success", 4, "ngIf"], ["class", "badge badge-inactive", 4, "ngIf"], [2, "margin-top", "30px", "padding-top", "20px", "border-top", "1px solid #e0e0e0"], [2, "background", "#ffebee", "padding", "15px", "border-radius", "8px", "margin-bottom", "20px"], [2, "margin", "0", "color", "#c62828", "font-weight", "600"], [1, "form-actions", 2, "margin", "0", "padding", "0", "border", "none"], [1, "btn", "btn-danger", 3, "click", "disabled"], [2, "color", "#999"], [1, "badge", "badge-success"], [1, "badge", "badge-inactive"]], template: function UserDeleteComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Delete User");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 1);
      \u0275\u0275text(4, "Permanently remove user account from the system");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
      \u0275\u0275listener("click", function UserDeleteComponent_Template_button_click_6_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(7, " \u2190 Back to User Management ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 4);
      \u0275\u0275template(9, UserDeleteComponent_div_9_Template, 2, 0, "div", 5)(10, UserDeleteComponent_div_10_Template, 6, 2, "div", 6)(11, UserDeleteComponent_div_11_Template, 62, 15, "div", 7);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.user && !ctx.error);
    }
  }, dependencies: [NgIf, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserDeleteComponent, [{
    type: Component,
    args: [{ selector: "app-user-delete", standalone: false, template: `<div class="content-header">\r
  <h1>Delete User</h1>\r
  <p class="section-subtitle">Permanently remove user account from the system</p>\r
</div>\r
\r
<div class="action-bar">\r
  <button class="btn btn-secondary" (click)="cancel()">\r
    \u2190 Back to User Management\r
  </button>\r
</div>\r
\r
<div class="section">\r
  <div *ngIf="loading" class="loading-container">Loading...</div>\r
\r
  <div *ngIf="error" class="alert alert-error">\r
    {{ error }}\r
    <div style="margin-top: 20px;">\r
      <a routerLink="/admin/users" class="btn btn-secondary">\u2190 Back to User Management</a>\r
      <a *ngIf="user" [routerLink]="['/admin/users/edit', userId]" class="btn btn-primary">Edit User Instead</a>\r
    </div>\r
  </div>\r
\r
  <div *ngIf="user && !error" style="max-width: 700px;">\r
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 8px; margin-bottom: 30px;">\r
      <div style="display: flex; align-items: flex-start; gap: 15px;">\r
        <div style="font-size: 2rem;">\u26A0\uFE0F</div>\r
        <div>\r
          <h3 style="margin: 0 0 10px 0; color: #856404;">Warning: Permanent Deletion</h3>\r
          <p style="margin: 0; color: #856404; line-height: 1.6;">\r
            You are about to permanently delete this user account. This action cannot be undone.\r
            All user data will be permanently removed from the system.\r
          </p>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <div class="admin-form">\r
      <h3 style="margin-bottom: 20px; color: #2d3561;">User Details:</h3>\r
\r
      <div class="info-row">\r
        <span class="info-label">Username:</span>\r
        <span class="info-value">{{ user.username }}</span>\r
      </div>\r
\r
      <div class="info-row">\r
        <span class="info-label">Full Name:</span>\r
        <span class="info-value">{{ user.full_name }}</span>\r
      </div>\r
\r
      <div class="info-row">\r
        <span class="info-label">Email:</span>\r
        <span class="info-value">{{ user.email }}</span>\r
      </div>\r
\r
      <div class="info-row">\r
        <span class="info-label">Role:</span>\r
        <span class="info-value">\r
          <span *ngIf="user.role_name">{{ user.role_name }}</span>\r
          <span *ngIf="!user.role_name" style="color: #999;">No Role Assigned</span>\r
        </span>\r
      </div>\r
\r
      <div class="info-row">\r
        <span class="info-label">Status:</span>\r
        <span class="info-value">\r
          <span *ngIf="user.is_active" class="badge badge-success">\u2713 Active</span>\r
          <span *ngIf="!user.is_active" class="badge badge-inactive">Inactive</span>\r
        </span>\r
      </div>\r
\r
      <div class="info-row">\r
        <span class="info-label">Last Login:</span>\r
        <span class="info-value">\r
          <span *ngIf="user.last_login">{{ user.last_login }}</span>\r
          <span *ngIf="!user.last_login">Never logged in</span>\r
        </span>\r
      </div>\r
\r
      <div class="info-row">\r
        <span class="info-label">Created:</span>\r
        <span class="info-value">{{ user.created_at }}</span>\r
      </div>\r
\r
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">\r
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin-bottom: 20px;">\r
          <p style="margin: 0; color: #c62828; font-weight: 600;">\r
            Are you absolutely sure you want to delete this user?\r
          </p>\r
        </div>\r
\r
        <div class="form-actions" style="margin: 0; padding: 0; border: none;">\r
          <button (click)="confirmDelete()" class="btn btn-danger" [disabled]="loading">\r
            \u{1F5D1}\uFE0F {{ loading ? 'Deleting...' : 'Yes, Delete User' }}\r
          </button>\r
          <button (click)="cancel()" class="btn btn-secondary">Cancel</button>\r
          <a [routerLink]="['/admin/users/edit', userId]" class="btn btn-primary">Edit Instead</a>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
` }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: UsersService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UserDeleteComponent, { className: "UserDeleteComponent", filePath: "src/app/admin/users/user-delete/user-delete.ts", lineNumber: 12 });
})();

// src/app/admin/services/profile.service.ts
var ProfileService = class _ProfileService {
  http;
  apiUrl = "/api/profile.cfc";
  constructor(http) {
    this.http = http;
  }
  /**
   * Get current user's profile
   */
  getProfile() {
    return this.http.get(`${this.apiUrl}?method=getProfile`).pipe(map((response) => response.data), catchError(this.handleError));
  }
  /**
   * Update profile information (name, email)
   */
  updateProfile(data) {
    return this.http.post(`${this.apiUrl}?method=updateProfile`, data).pipe(catchError(this.handleError));
  }
  /**
   * Change password
   */
  changePassword(data) {
    return this.http.post(`${this.apiUrl}?method=updatePassword`, data).pipe(catchError(this.handleError));
  }
  /**
   * Upload profile picture
   */
  uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append("profile_picture", file);
    return this.http.post(`${this.apiUrl}?method=uploadProfilePicture`, formData).pipe(catchError(this.handleError));
  }
  /**
   * Remove profile picture
   */
  removeProfilePicture() {
    return this.http.post(`${this.apiUrl}?method=removeProfilePicture`, {}).pipe(catchError(this.handleError));
  }
  /**
   * Handle HTTP errors
   */
  handleError(error) {
    let errorMessage = "An error occurred";
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => ({ message: errorMessage }));
  }
  static \u0275fac = function ProfileService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfileService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ProfileService, factory: _ProfileService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/admin/profile/profile.component.ts
function ProfileComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275text(1, "Loading profile...");
    \u0275\u0275elementEnd();
  }
}
function ProfileComponent_div_6_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.profileSuccess, " ");
  }
}
function ProfileComponent_div_6_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.profileError, " ");
  }
}
function ProfileComponent_div_6_div_10_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Full name is required");
    \u0275\u0275elementEnd();
  }
}
function ProfileComponent_div_6_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275template(1, ProfileComponent_div_6_div_10_span_1_Template, 2, 0, "span", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_2_0 = ctx_r1.profileForm.get("full_name")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["required"]);
  }
}
function ProfileComponent_div_6_div_15_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Email is required");
    \u0275\u0275elementEnd();
  }
}
function ProfileComponent_div_6_div_15_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Please enter a valid email address");
    \u0275\u0275elementEnd();
  }
}
function ProfileComponent_div_6_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275template(1, ProfileComponent_div_6_div_15_span_1_Template, 2, 0, "span", 19)(2, ProfileComponent_div_6_div_15_span_2_Template, 2, 0, "span", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_2_0 = ctx_r1.profileForm.get("email")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["required"]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_3_0 = ctx_r1.profileForm.get("email")) == null ? null : tmp_3_0.errors == null ? null : tmp_3_0.errors["email"]);
  }
}
function ProfileComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "h2");
    \u0275\u0275text(2, "Personal Information");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ProfileComponent_div_6_div_3_Template, 2, 1, "div", 5)(4, ProfileComponent_div_6_div_4_Template, 2, 1, "div", 6);
    \u0275\u0275elementStart(5, "form", 7);
    \u0275\u0275listener("ngSubmit", function ProfileComponent_div_6_Template_form_ngSubmit_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.updateProfile());
    });
    \u0275\u0275elementStart(6, "div", 8)(7, "label", 9);
    \u0275\u0275text(8, "Full Name *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "input", 10);
    \u0275\u0275template(10, ProfileComponent_div_6_div_10_Template, 2, 1, "div", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 8)(12, "label", 12);
    \u0275\u0275text(13, "Email Address *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "input", 13);
    \u0275\u0275template(15, ProfileComponent_div_6_div_15_Template, 3, 2, "div", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 14)(17, "button", 15);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.profileSuccess);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.profileError);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.profileForm);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("error", ((tmp_4_0 = ctx_r1.profileForm.get("full_name")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r1.profileForm.get("full_name")) == null ? null : tmp_4_0.touched));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_5_0 = ctx_r1.profileForm.get("full_name")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx_r1.profileForm.get("full_name")) == null ? null : tmp_5_0.touched));
    \u0275\u0275advance(4);
    \u0275\u0275classProp("error", ((tmp_6_0 = ctx_r1.profileForm.get("email")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx_r1.profileForm.get("email")) == null ? null : tmp_6_0.touched));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_7_0 = ctx_r1.profileForm.get("email")) == null ? null : tmp_7_0.invalid) && ((tmp_7_0 = ctx_r1.profileForm.get("email")) == null ? null : tmp_7_0.touched));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.profileLoading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.profileLoading ? "Updating..." : "Update Profile", " ");
  }
}
function ProfileComponent_div_7_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.pictureSuccess, " ");
  }
}
function ProfileComponent_div_7_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.pictureError, " ");
  }
}
function ProfileComponent_div_7_img_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 29);
    \u0275\u0275listener("error", function ProfileComponent_div_7_img_7_Template_img_error_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onImageError());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", ctx_r1.getProfilePictureUrl(), \u0275\u0275sanitizeUrl);
  }
}
function ProfileComponent_div_7_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275text(1, " \u{1F464} ");
    \u0275\u0275elementEnd();
  }
}
function ProfileComponent_div_7_button_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 31);
    \u0275\u0275listener("click", function ProfileComponent_div_7_button_18_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removePicture());
    });
    \u0275\u0275text(1, " Remove Picture ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.pictureLoading);
  }
}
function ProfileComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "h2");
    \u0275\u0275text(2, "Profile Picture");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ProfileComponent_div_7_div_3_Template, 2, 1, "div", 5)(4, ProfileComponent_div_7_div_4_Template, 2, 1, "div", 6);
    \u0275\u0275elementStart(5, "form", 20)(6, "div", 21);
    \u0275\u0275template(7, ProfileComponent_div_7_img_7_Template, 1, 1, "img", 22)(8, ProfileComponent_div_7_div_8_Template, 2, 0, "div", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 8)(10, "label", 24);
    \u0275\u0275text(11, "Choose New Picture");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "input", 25);
    \u0275\u0275listener("change", function ProfileComponent_div_7_Template_input_change_12_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFileSelected($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "small");
    \u0275\u0275text(14, "Maximum file size: 5MB. Allowed types: JPG, PNG, GIF");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 26)(16, "button", 27);
    \u0275\u0275listener("click", function ProfileComponent_div_7_Template_button_click_16_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.uploadPicture());
    });
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275template(18, ProfileComponent_div_7_button_18_Template, 2, 1, "button", 28);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.pictureSuccess);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.pictureError);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.getProfilePictureUrl());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.getProfilePictureUrl());
    \u0275\u0275advance(8);
    \u0275\u0275property("disabled", ctx_r1.pictureLoading || !ctx_r1.selectedPictureFile);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.pictureLoading ? "Uploading..." : "Upload Picture", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.user.profile_picture);
  }
}
function ProfileComponent_div_8_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.passwordSuccess, " ");
  }
}
function ProfileComponent_div_8_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.passwordError, " ");
  }
}
function ProfileComponent_div_8_div_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "div", 43);
    \u0275\u0275element(2, "div", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 45);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r1.passwordStrength, "%")("background", ctx_r1.passwordStrengthColor);
    \u0275\u0275advance();
    \u0275\u0275styleProp("color", ctx_r1.passwordStrengthColor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.passwordStrengthLabel);
  }
}
function ProfileComponent_div_8_div_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getPasswordErrorMessage(), " ");
  }
}
function ProfileComponent_div_8_div_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275text(1, " Passwords do not match ");
    \u0275\u0275elementEnd();
  }
}
function ProfileComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "h2");
    \u0275\u0275text(2, "Change Password");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ProfileComponent_div_8_div_3_Template, 2, 1, "div", 5)(4, ProfileComponent_div_8_div_4_Template, 2, 1, "div", 6);
    \u0275\u0275elementStart(5, "form", 7);
    \u0275\u0275listener("ngSubmit", function ProfileComponent_div_8_Template_form_ngSubmit_5_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.changePassword());
    });
    \u0275\u0275elementStart(6, "div", 8)(7, "label", 32);
    \u0275\u0275text(8, "Current Password *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 33);
    \u0275\u0275element(10, "input", 34);
    \u0275\u0275elementStart(11, "button", 35);
    \u0275\u0275listener("click", function ProfileComponent_div_8_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.togglePasswordVisibility("current"));
    });
    \u0275\u0275elementStart(12, "span", 36);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "small");
    \u0275\u0275text(15, "Enter your current password for security verification.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 8)(17, "label", 37);
    \u0275\u0275text(18, "New Password *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 33);
    \u0275\u0275element(20, "input", 38);
    \u0275\u0275elementStart(21, "button", 35);
    \u0275\u0275listener("click", function ProfileComponent_div_8_Template_button_click_21_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.togglePasswordVisibility("new"));
    });
    \u0275\u0275elementStart(22, "span", 36);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(24, ProfileComponent_div_8_div_24_Template, 5, 7, "div", 39);
    \u0275\u0275elementStart(25, "small");
    \u0275\u0275text(26, "Must be at least 8 characters with one uppercase letter (A-Z), one number (0-9), and one special character (e.g., !@#$%^&*).");
    \u0275\u0275elementEnd();
    \u0275\u0275template(27, ProfileComponent_div_8_div_27_Template, 2, 1, "div", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 8)(29, "label", 40);
    \u0275\u0275text(30, "Confirm New Password *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 33);
    \u0275\u0275element(32, "input", 41);
    \u0275\u0275elementStart(33, "button", 35);
    \u0275\u0275listener("click", function ProfileComponent_div_8_Template_button_click_33_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.togglePasswordVisibility("confirm"));
    });
    \u0275\u0275elementStart(34, "span", 36);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(36, ProfileComponent_div_8_div_36_Template, 2, 0, "div", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "div", 14)(38, "button", 15);
    \u0275\u0275text(39);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_7_0;
    let tmp_11_0;
    let tmp_12_0;
    let tmp_15_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.passwordSuccess);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.passwordError);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.passwordForm);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("error", ((tmp_4_0 = ctx_r1.passwordForm.get("current_password")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r1.passwordForm.get("current_password")) == null ? null : tmp_4_0.touched));
    \u0275\u0275property("type", ctx_r1.showCurrentPassword ? "text" : "password");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.showCurrentPassword ? "\u{1F648}" : "\u{1F441}\uFE0F");
    \u0275\u0275advance(7);
    \u0275\u0275classProp("error", ((tmp_7_0 = ctx_r1.passwordForm.get("new_password")) == null ? null : tmp_7_0.invalid) && ((tmp_7_0 = ctx_r1.passwordForm.get("new_password")) == null ? null : tmp_7_0.touched));
    \u0275\u0275property("type", ctx_r1.showNewPassword ? "text" : "password");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.showNewPassword ? "\u{1F648}" : "\u{1F441}\uFE0F");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.passwordStrength > 0);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ((tmp_11_0 = ctx_r1.passwordForm.get("new_password")) == null ? null : tmp_11_0.invalid) && ((tmp_11_0 = ctx_r1.passwordForm.get("new_password")) == null ? null : tmp_11_0.touched));
    \u0275\u0275advance(5);
    \u0275\u0275classProp("error", ((tmp_12_0 = ctx_r1.passwordForm.get("confirm_new_password")) == null ? null : tmp_12_0.invalid) && ((tmp_12_0 = ctx_r1.passwordForm.get("confirm_new_password")) == null ? null : tmp_12_0.touched));
    \u0275\u0275property("type", ctx_r1.showConfirmNewPassword ? "text" : "password");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.showConfirmNewPassword ? "\u{1F648}" : "\u{1F441}\uFE0F");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r1.passwordForm.errors == null ? null : ctx_r1.passwordForm.errors["passwordMismatch"]) && ((tmp_15_0 = ctx_r1.passwordForm.get("confirm_new_password")) == null ? null : tmp_15_0.touched));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.passwordLoading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.passwordLoading ? "Changing..." : "Change Password", " ");
  }
}
function ProfileComponent_div_9_span_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 52);
    \u0275\u0275text(1, "\u2713 Active");
    \u0275\u0275elementEnd();
  }
}
function ProfileComponent_div_9_span_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Inactive");
    \u0275\u0275elementEnd();
  }
}
function ProfileComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "h2");
    \u0275\u0275text(2, "Account Information");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 20)(4, "div", 46)(5, "span", 47);
    \u0275\u0275text(6, "Username:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 48);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 46)(10, "span", 47);
    \u0275\u0275text(11, "Role:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 48)(13, "strong", 49);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(15, "div", 46)(16, "span", 47);
    \u0275\u0275text(17, "Account Status:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 48);
    \u0275\u0275template(19, ProfileComponent_div_9_span_19_Template, 2, 0, "span", 50)(20, ProfileComponent_div_9_span_20_Template, 2, 0, "span", 51);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 46)(22, "span", 47);
    \u0275\u0275text(23, "Last Login:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span", 48);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 46)(27, "span", 47);
    \u0275\u0275text(28, "Account Created:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span", 48);
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div", 46)(32, "span", 47);
    \u0275\u0275text(33, "Password Last Changed:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span", 48);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.user.username);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.user.role_name);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r1.user.is_active);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.user.is_active);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(ctx_r1.user.last_login));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(ctx_r1.user.created_at));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(ctx_r1.user.password_changed_at));
  }
}
var ProfileComponent = class _ProfileComponent {
  fb;
  profileService;
  authService;
  user = null;
  loading = true;
  // Form groups
  profileForm;
  passwordForm;
  // Success/error messages
  profileSuccess = null;
  profileError = null;
  passwordSuccess = null;
  passwordError = null;
  pictureSuccess = null;
  pictureError = null;
  // Loading states
  profileLoading = false;
  passwordLoading = false;
  pictureLoading = false;
  // Profile picture
  selectedPictureFile = null;
  picturePreviewUrl = null;
  imageLoadError = false;
  // Password visibility toggles
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;
  // Password strength indicator
  passwordStrength = 0;
  passwordStrengthLabel = "";
  passwordStrengthColor = "";
  constructor(fb, profileService, authService) {
    this.fb = fb;
    this.profileService = profileService;
    this.authService = authService;
    this.profileForm = this.fb.group({
      full_name: ["", [Validators.required, Validators.maxLength(100)]],
      email: ["", [Validators.required, Validators.email, Validators.maxLength(100)]]
    });
    this.passwordForm = this.fb.group({
      current_password: ["", Validators.required],
      new_password: ["", [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/)
      ]],
      confirm_new_password: ["", Validators.required]
    }, { validators: this.passwordMatchValidator });
    this.passwordForm.get("new_password")?.valueChanges.subscribe((value) => {
      this.calculatePasswordStrength(value);
    });
  }
  ngOnInit() {
    this.loadProfile();
  }
  /**
   * Load user profile
   */
  loadProfile() {
    this.loading = true;
    this.imageLoadError = false;
    this.profileService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          full_name: user.full_name,
          email: user.email
        });
        this.loading = false;
      },
      error: (err) => {
        this.profileError = err.message || "Failed to load profile";
        this.loading = false;
      }
    });
  }
  /**
   * Update profile information
   */
  updateProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.profileLoading = true;
    this.profileSuccess = null;
    this.profileError = null;
    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: (response) => {
        this.profileSuccess = response.message || "Profile updated successfully";
        this.profileLoading = false;
        this.loadProfile();
      },
      error: (err) => {
        this.profileError = err.message || "Failed to update profile";
        this.profileLoading = false;
      }
    });
  }
  /**
   * Change password
   */
  changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.passwordLoading = true;
    this.passwordSuccess = null;
    this.passwordError = null;
    this.profileService.changePassword(this.passwordForm.value).subscribe({
      next: (response) => {
        this.passwordSuccess = response.message || "Password changed successfully";
        this.passwordForm.reset();
        this.passwordLoading = false;
      },
      error: (err) => {
        this.passwordError = err.message || "Failed to change password";
        this.passwordLoading = false;
      }
    });
  }
  /**
   * Handle file selection
   */
  onFileSelected(event) {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        this.pictureError = "Invalid file type. Only JPG, PNG, and GIF files are allowed.";
        input.value = "";
        return;
      }
      if (file.size > 5242880) {
        this.pictureError = "File too large. Maximum file size is 5MB.";
        input.value = "";
        return;
      }
      this.selectedPictureFile = file;
      this.pictureError = null;
      const reader = new FileReader();
      reader.onload = () => {
        this.picturePreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  /**
   * Upload profile picture
   */
  uploadPicture() {
    if (!this.selectedPictureFile) {
      this.pictureError = "Please select a file to upload";
      return;
    }
    this.pictureLoading = true;
    this.pictureSuccess = null;
    this.pictureError = null;
    this.profileService.uploadProfilePicture(this.selectedPictureFile).subscribe({
      next: (response) => {
        this.pictureSuccess = response.message || "Profile picture uploaded successfully!";
        this.selectedPictureFile = null;
        this.picturePreviewUrl = null;
        this.pictureLoading = false;
        this.loadProfile();
        this.authService.checkAuthStatus();
        const fileInput = document.getElementById("profile_picture");
        if (fileInput)
          fileInput.value = "";
      },
      error: (err) => {
        this.pictureError = err.message || "Failed to upload profile picture";
        this.pictureLoading = false;
      }
    });
  }
  /**
   * Remove profile picture
   */
  removePicture() {
    if (!confirm("Are you sure you want to remove your profile picture?")) {
      return;
    }
    this.pictureLoading = true;
    this.pictureSuccess = null;
    this.pictureError = null;
    this.profileService.removeProfilePicture().subscribe({
      next: (response) => {
        this.pictureSuccess = response.message || "Profile picture removed successfully";
        this.pictureLoading = false;
        this.loadProfile();
        this.authService.checkAuthStatus();
      },
      error: (err) => {
        this.pictureError = err.message || "Failed to remove profile picture";
        this.pictureLoading = false;
      }
    });
  }
  /**
   * Get profile picture URL
   */
  getProfilePictureUrl() {
    if (this.imageLoadError) {
      return "";
    }
    if (this.picturePreviewUrl) {
      return this.picturePreviewUrl;
    }
    if (this.user?.profile_picture) {
      return `/assets/img/profiles/${this.user.profile_picture}?v=${(/* @__PURE__ */ new Date()).getTime()}`;
    }
    return "";
  }
  /**
   * Handle image load error
   */
  onImageError() {
    this.imageLoadError = true;
  }
  /**
   * Custom validator to check if passwords match
   */
  passwordMatchValidator(group) {
    const newPassword = group.get("new_password")?.value;
    const confirmPassword = group.get("confirm_new_password")?.value;
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
  /**
   * Get password error message
   */
  getPasswordErrorMessage() {
    const control = this.passwordForm.get("new_password");
    if (!control?.errors)
      return "";
    if (control.errors["required"])
      return "Password is required";
    if (control.errors["minlength"])
      return "Password must be at least 8 characters";
    if (control.errors["pattern"]) {
      return "Password must contain uppercase letter, number, and special character";
    }
    return "";
  }
  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(field) {
    switch (field) {
      case "current":
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case "new":
        this.showNewPassword = !this.showNewPassword;
        break;
      case "confirm":
        this.showConfirmNewPassword = !this.showConfirmNewPassword;
        break;
    }
  }
  /**
   * Format date for display
   */
  formatDate(dateString) {
    if (!dateString)
      return "Never";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  }
  /**
   * Calculate password strength
   */
  calculatePasswordStrength(password) {
    if (!password) {
      this.passwordStrength = 0;
      this.passwordStrengthLabel = "";
      this.passwordStrengthColor = "";
      return;
    }
    let strength = 0;
    if (password.length >= 8)
      strength += 20;
    if (password.length >= 12)
      strength += 10;
    if (password.length >= 16)
      strength += 10;
    if (/[a-z]/.test(password))
      strength += 10;
    if (/[A-Z]/.test(password))
      strength += 15;
    if (/[0-9]/.test(password))
      strength += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      strength += 20;
    const types = [/[a-z]/, /[A-Z]/, /[0-9]/, /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/];
    const typeCount = types.filter((regex) => regex.test(password)).length;
    if (typeCount >= 4)
      strength += 10;
    this.passwordStrength = Math.min(strength, 100);
    if (this.passwordStrength < 20) {
      this.passwordStrengthLabel = "Weak";
      this.passwordStrengthColor = "#dc3545";
    } else if (this.passwordStrength < 40) {
      this.passwordStrengthLabel = "Fair";
      this.passwordStrengthColor = "#fd7e14";
    } else if (this.passwordStrength < 60) {
      this.passwordStrengthLabel = "Medium";
      this.passwordStrengthColor = "#ffc107";
    } else if (this.passwordStrength < 80) {
      this.passwordStrengthLabel = "Good";
      this.passwordStrengthColor = "#90EE90";
    } else {
      this.passwordStrengthLabel = "Strong";
      this.passwordStrengthColor = "#28a745";
    }
  }
  static \u0275fac = function ProfileComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfileComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(ProfileService), \u0275\u0275directiveInject(AuthService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileComponent, selectors: [["app-profile"]], standalone: false, decls: 10, vars: 5, consts: [[1, "content-header"], ["class", "loading-container", 4, "ngIf"], ["class", "section", 4, "ngIf"], [1, "loading-container"], [1, "section"], ["class", "alert alert-success", 4, "ngIf"], ["class", "alert alert-error", 4, "ngIf"], [1, "admin-form", "profile-form", 3, "ngSubmit", "formGroup"], [1, "form-group"], ["for", "full_name"], ["type", "text", "id", "full_name", "formControlName", "full_name", "maxlength", "100"], ["class", "error-message", 4, "ngIf"], ["for", "email"], ["type", "email", "id", "email", "formControlName", "email", "maxlength", "100"], [1, "form-actions"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], [1, "alert", "alert-success"], [1, "alert", "alert-error"], [1, "error-message"], [4, "ngIf"], [1, "admin-form", "profile-form"], [2, "text-align", "center", "margin-bottom", "30px"], ["alt", "Profile Picture", "class", "profile-picture-preview", 3, "src", "error", 4, "ngIf"], ["class", "profile-placeholder", 4, "ngIf"], ["for", "profile_picture"], ["type", "file", "id", "profile_picture", "accept", ".jpg,.jpeg,.png,.gif", 3, "change"], [1, "form-actions", 2, "justify-content", "center"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"], ["type", "button", "class", "btn btn-secondary", "style", "background: #dc3545; color: white;", 3, "disabled", "click", 4, "ngIf"], ["alt", "Profile Picture", 1, "profile-picture-preview", 3, "error", "src"], [1, "profile-placeholder"], ["type", "button", 1, "btn", "btn-secondary", 2, "background", "#dc3545", "color", "white", 3, "click", "disabled"], ["for", "current_password"], [1, "password-input-wrapper"], ["id", "current_password", "formControlName", "current_password", "autocomplete", "current-password", 3, "type"], ["type", "button", 1, "password-toggle", 3, "click"], [1, "toggle-icon"], ["for", "new_password"], ["id", "new_password", "formControlName", "new_password", "autocomplete", "new-password", 3, "type"], ["class", "password-strength", "style", "margin-top: 8px;", 4, "ngIf"], ["for", "confirm_new_password"], ["id", "confirm_new_password", "formControlName", "confirm_new_password", "autocomplete", "new-password", 3, "type"], [1, "password-strength", 2, "margin-top", "8px"], [1, "strength-bar-container", 2, "width", "100%", "height", "6px", "background", "#e0e0e0", "border-radius", "3px", "overflow", "hidden"], [1, "strength-bar", 2, "height", "100%", "transition", "width 0.3s ease, background 0.3s ease"], [1, "strength-label", 2, "font-size", "12px", "font-weight", "600", "margin-top", "4px", "display", "inline-block"], [1, "info-row"], [1, "info-label"], [1, "info-value"], [2, "color", "#2d3561"], ["class", "badge badge-success", 4, "ngIf"], ["class", "badge badge-inactive", 4, "ngIf"], [1, "badge", "badge-success"], [1, "badge", "badge-inactive"]], template: function ProfileComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "My Profile");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4, "Manage your personal information and account settings");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(5, ProfileComponent_div_5_Template, 2, 0, "div", 1)(6, ProfileComponent_div_6_Template, 19, 11, "div", 2)(7, ProfileComponent_div_7_Template, 19, 7, "div", 2)(8, ProfileComponent_div_8_Template, 40, 20, "div", 2)(9, ProfileComponent_div_9_Template, 36, 7, "div", 2);
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.user);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.user);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.user);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.user);
    }
  }, dependencies: [NgIf, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, FormGroupDirective, FormControlName, NgForm], styles: ["\n\n.password-input-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.password-input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  flex: 1;\n  padding-right: 45px;\n}\n.password-toggle[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: transparent !important;\n  border: none !important;\n  color: #666;\n  cursor: pointer;\n  font-size: 18px;\n  padding: 5px 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: color 0.3s ease;\n  outline: none;\n}\n.password-toggle[_ngcontent-%COMP%]:hover {\n  color: #4fc3f7;\n}\n.password-toggle[_ngcontent-%COMP%]:focus {\n  outline: none;\n}\n.toggle-icon[_ngcontent-%COMP%] {\n  display: inline-block;\n  line-height: 1;\n}\n.info-row[_ngcontent-%COMP%] {\n  display: flex;\n  padding: 12px 0;\n  border-bottom: 1px solid #e0e0e0;\n}\n.info-row[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.info-label[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #2d3561;\n  min-width: 150px;\n  flex-shrink: 0;\n}\n.info-value[_ngcontent-%COMP%] {\n  color: #666;\n  flex: 1;\n}\n.badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.badge-success[_ngcontent-%COMP%] {\n  background: #e8f5e9;\n  color: #2e7d32;\n}\n.badge-inactive[_ngcontent-%COMP%] {\n  background: #fafafa;\n  color: #666;\n}\n.profile-picture-preview[_ngcontent-%COMP%] {\n  width: 150px;\n  height: 150px;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 3px solid #4fc3f7;\n  margin: 10px auto;\n  display: block;\n}\n.profile-placeholder[_ngcontent-%COMP%] {\n  width: 150px;\n  height: 150px;\n  border-radius: 50%;\n  background: #f0f0f0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 60px;\n  margin: 10px auto;\n  color: #999;\n  border: 3px solid #ddd;\n}\n/*# sourceMappingURL=profile.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileComponent, [{
    type: Component,
    args: [{ selector: "app-profile", standalone: false, template: `<div class="content-header">\r
  <h1>My Profile</h1>\r
  <p>Manage your personal information and account settings</p>\r
</div>\r
\r
<!-- Loading State -->\r
<div *ngIf="loading" class="loading-container">Loading profile...</div>\r
\r
<!-- Personal Information Section -->\r
<div *ngIf="!loading && user" class="section">\r
  <h2>Personal Information</h2>\r
\r
  <div *ngIf="profileSuccess" class="alert alert-success">\r
    {{ profileSuccess }}\r
  </div>\r
\r
  <div *ngIf="profileError" class="alert alert-error">\r
    {{ profileError }}\r
  </div>\r
\r
  <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="admin-form profile-form">\r
    <div class="form-group">\r
      <label for="full_name">Full Name *</label>\r
      <input type="text"\r
             id="full_name"\r
             formControlName="full_name"\r
             [class.error]="profileForm.get('full_name')?.invalid && profileForm.get('full_name')?.touched"\r
             maxlength="100">\r
      <div *ngIf="profileForm.get('full_name')?.invalid && profileForm.get('full_name')?.touched" class="error-message">\r
        <span *ngIf="profileForm.get('full_name')?.errors?.['required']">Full name is required</span>\r
      </div>\r
    </div>\r
\r
    <div class="form-group">\r
      <label for="email">Email Address *</label>\r
      <input type="email"\r
             id="email"\r
             formControlName="email"\r
             [class.error]="profileForm.get('email')?.invalid && profileForm.get('email')?.touched"\r
             maxlength="100">\r
      <div *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched" class="error-message">\r
        <span *ngIf="profileForm.get('email')?.errors?.['required']">Email is required</span>\r
        <span *ngIf="profileForm.get('email')?.errors?.['email']">Please enter a valid email address</span>\r
      </div>\r
    </div>\r
\r
    <div class="form-actions">\r
      <button type="submit" class="btn btn-primary" [disabled]="profileLoading">\r
        {{ profileLoading ? 'Updating...' : 'Update Profile' }}\r
      </button>\r
    </div>\r
  </form>\r
</div>\r
\r
<!-- Profile Picture Section -->\r
<div *ngIf="!loading && user" class="section">\r
  <h2>Profile Picture</h2>\r
\r
  <div *ngIf="pictureSuccess" class="alert alert-success">\r
    {{ pictureSuccess }}\r
  </div>\r
\r
  <div *ngIf="pictureError" class="alert alert-error">\r
    {{ pictureError }}\r
  </div>\r
\r
  <form class="admin-form profile-form">\r
    <!-- Display Current Picture -->\r
    <div style="text-align: center; margin-bottom: 30px;">\r
      <img *ngIf="getProfilePictureUrl()"\r
           [src]="getProfilePictureUrl()"\r
           alt="Profile Picture"\r
           class="profile-picture-preview"\r
           (error)="onImageError()">\r
      <div *ngIf="!getProfilePictureUrl()" class="profile-placeholder">\r
        \u{1F464}\r
      </div>\r
    </div>\r
\r
    <div class="form-group">\r
      <label for="profile_picture">Choose New Picture</label>\r
      <input type="file"\r
             id="profile_picture"\r
             (change)="onFileSelected($event)"\r
             accept=".jpg,.jpeg,.png,.gif">\r
      <small>Maximum file size: 5MB. Allowed types: JPG, PNG, GIF</small>\r
    </div>\r
\r
    <div class="form-actions" style="justify-content: center;">\r
      <button type="button"\r
              (click)="uploadPicture()"\r
              class="btn btn-primary"\r
              [disabled]="pictureLoading || !selectedPictureFile">\r
        {{ pictureLoading ? 'Uploading...' : 'Upload Picture' }}\r
      </button>\r
      <button *ngIf="user.profile_picture"\r
              type="button"\r
              (click)="removePicture()"\r
              class="btn btn-secondary"\r
              style="background: #dc3545; color: white;"\r
              [disabled]="pictureLoading">\r
        Remove Picture\r
      </button>\r
    </div>\r
  </form>\r
</div>\r
\r
<!-- Change Password Section -->\r
<div *ngIf="!loading && user" class="section">\r
  <h2>Change Password</h2>\r
\r
  <div *ngIf="passwordSuccess" class="alert alert-success">\r
    {{ passwordSuccess }}\r
  </div>\r
\r
  <div *ngIf="passwordError" class="alert alert-error">\r
    {{ passwordError }}\r
  </div>\r
\r
  <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="admin-form profile-form">\r
    <div class="form-group">\r
      <label for="current_password">Current Password *</label>\r
      <div class="password-input-wrapper">\r
        <input [type]="showCurrentPassword ? 'text' : 'password'"\r
               id="current_password"\r
               formControlName="current_password"\r
               [class.error]="passwordForm.get('current_password')?.invalid && passwordForm.get('current_password')?.touched"\r
               autocomplete="current-password">\r
        <button type="button" class="password-toggle" (click)="togglePasswordVisibility('current')">\r
          <span class="toggle-icon">{{ showCurrentPassword ? '\u{1F648}' : '\u{1F441}\uFE0F' }}</span>\r
        </button>\r
      </div>\r
      <small>Enter your current password for security verification.</small>\r
    </div>\r
\r
    <div class="form-group">\r
      <label for="new_password">New Password *</label>\r
      <div class="password-input-wrapper">\r
        <input [type]="showNewPassword ? 'text' : 'password'"\r
               id="new_password"\r
               formControlName="new_password"\r
               [class.error]="passwordForm.get('new_password')?.invalid && passwordForm.get('new_password')?.touched"\r
               autocomplete="new-password">\r
        <button type="button" class="password-toggle" (click)="togglePasswordVisibility('new')">\r
          <span class="toggle-icon">{{ showNewPassword ? '\u{1F648}' : '\u{1F441}\uFE0F' }}</span>\r
        </button>\r
      </div>\r
      <!-- Password Strength Indicator -->\r
      <div *ngIf="passwordStrength > 0" class="password-strength" style="margin-top: 8px;">\r
        <div class="strength-bar-container" style="width: 100%; height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden;">\r
          <div class="strength-bar" [style.width.%]="passwordStrength" [style.background]="passwordStrengthColor" style="height: 100%; transition: width 0.3s ease, background 0.3s ease;"></div>\r
        </div>\r
        <span class="strength-label" [style.color]="passwordStrengthColor" style="font-size: 12px; font-weight: 600; margin-top: 4px; display: inline-block;">{{ passwordStrengthLabel }}</span>\r
      </div>\r
      <small>Must be at least 8 characters with one uppercase letter (A-Z), one number (0-9), and one special character (e.g., !@#$%^&*).</small>\r
      <div *ngIf="passwordForm.get('new_password')?.invalid && passwordForm.get('new_password')?.touched" class="error-message">\r
        {{ getPasswordErrorMessage() }}\r
      </div>\r
    </div>\r
\r
    <div class="form-group">\r
      <label for="confirm_new_password">Confirm New Password *</label>\r
      <div class="password-input-wrapper">\r
        <input [type]="showConfirmNewPassword ? 'text' : 'password'"\r
               id="confirm_new_password"\r
               formControlName="confirm_new_password"\r
               [class.error]="passwordForm.get('confirm_new_password')?.invalid && passwordForm.get('confirm_new_password')?.touched"\r
               autocomplete="new-password">\r
        <button type="button" class="password-toggle" (click)="togglePasswordVisibility('confirm')">\r
          <span class="toggle-icon">{{ showConfirmNewPassword ? '\u{1F648}' : '\u{1F441}\uFE0F' }}</span>\r
        </button>\r
      </div>\r
      <div *ngIf="passwordForm.errors?.['passwordMismatch'] && passwordForm.get('confirm_new_password')?.touched" class="error-message">\r
        Passwords do not match\r
      </div>\r
    </div>\r
\r
    <div class="form-actions">\r
      <button type="submit" class="btn btn-primary" [disabled]="passwordLoading">\r
        {{ passwordLoading ? 'Changing...' : 'Change Password' }}\r
      </button>\r
    </div>\r
  </form>\r
</div>\r
\r
<!-- Account Information Section (Read-Only) -->\r
<div *ngIf="!loading && user" class="section">\r
  <h2>Account Information</h2>\r
\r
  <div class="admin-form profile-form">\r
    <div class="info-row">\r
      <span class="info-label">Username:</span>\r
      <span class="info-value">{{ user.username }}</span>\r
    </div>\r
\r
    <div class="info-row">\r
      <span class="info-label">Role:</span>\r
      <span class="info-value">\r
        <strong style="color: #2d3561;">{{ user.role_name }}</strong>\r
      </span>\r
    </div>\r
\r
    <div class="info-row">\r
      <span class="info-label">Account Status:</span>\r
      <span class="info-value">\r
        <span *ngIf="user.is_active" class="badge badge-success">\u2713 Active</span>\r
        <span *ngIf="!user.is_active" class="badge badge-inactive">Inactive</span>\r
      </span>\r
    </div>\r
\r
    <div class="info-row">\r
      <span class="info-label">Last Login:</span>\r
      <span class="info-value">{{ formatDate(user.last_login) }}</span>\r
    </div>\r
\r
    <div class="info-row">\r
      <span class="info-label">Account Created:</span>\r
      <span class="info-value">{{ formatDate(user.created_at) }}</span>\r
    </div>\r
\r
    <div class="info-row">\r
      <span class="info-label">Password Last Changed:</span>\r
      <span class="info-value">{{ formatDate(user.password_changed_at) }}</span>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/admin/profile/profile.component.css */\n.password-input-wrapper {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.password-input-wrapper input {\n  flex: 1;\n  padding-right: 45px;\n}\n.password-toggle {\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: transparent !important;\n  border: none !important;\n  color: #666;\n  cursor: pointer;\n  font-size: 18px;\n  padding: 5px 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: color 0.3s ease;\n  outline: none;\n}\n.password-toggle:hover {\n  color: #4fc3f7;\n}\n.password-toggle:focus {\n  outline: none;\n}\n.toggle-icon {\n  display: inline-block;\n  line-height: 1;\n}\n.info-row {\n  display: flex;\n  padding: 12px 0;\n  border-bottom: 1px solid #e0e0e0;\n}\n.info-row:last-child {\n  border-bottom: none;\n}\n.info-label {\n  font-weight: 600;\n  color: #2d3561;\n  min-width: 150px;\n  flex-shrink: 0;\n}\n.info-value {\n  color: #666;\n  flex: 1;\n}\n.badge {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.badge-success {\n  background: #e8f5e9;\n  color: #2e7d32;\n}\n.badge-inactive {\n  background: #fafafa;\n  color: #666;\n}\n.profile-picture-preview {\n  width: 150px;\n  height: 150px;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 3px solid #4fc3f7;\n  margin: 10px auto;\n  display: block;\n}\n.profile-placeholder {\n  width: 150px;\n  height: 150px;\n  border-radius: 50%;\n  background: #f0f0f0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 60px;\n  margin: 10px auto;\n  color: #999;\n  border: 3px solid #ddd;\n}\n/*# sourceMappingURL=profile.component.css.map */\n"] }]
  }], () => [{ type: FormBuilder }, { type: ProfileService }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileComponent, { className: "ProfileComponent", filePath: "src/app/admin/profile/profile.component.ts", lineNumber: 13 });
})();

// src/app/admin/admin-routing.module.ts
var routes = [
  {
    path: "",
    children: [
      // Public auth routes (no layout)
      { path: "login", component: LoginComponent },
      { path: "forgot-password", component: ForgotPasswordComponent },
      { path: "reset-password", component: ResetPasswordComponent },
      // Standalone change password (required after first login - no admin layout)
      { path: "change-password", component: ChangePasswordComponent, canActivate: [AuthGuard] },
      // Protected routes with admin layout
      {
        path: "",
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          { path: "", redirectTo: "dashboard", pathMatch: "full" },
          { path: "dashboard", component: DashboardComponent },
          // Announcements
          { path: "announcements", component: AnnouncementListComponent },
          { path: "announcements/add", component: AnnouncementFormComponent },
          { path: "announcements/edit/:id", component: AnnouncementFormComponent },
          { path: "announcements/delete/:id", component: AnnouncementDeleteComponent },
          // Forms
          { path: "forms", component: FormListComponent },
          { path: "forms/add", component: FormFormComponent },
          { path: "forms/edit/:id", component: FormFormComponent },
          { path: "forms/delete/:id", component: FormDeleteComponent },
          // Gallery
          { path: "gallery", component: GalleryListComponent },
          { path: "gallery/upload", component: GalleryUploadComponent },
          { path: "gallery/edit/:id", component: GalleryEditComponent },
          { path: "gallery/delete/:id", component: GalleryDeleteComponent },
          // Documents
          { path: "documents", component: DocumentListComponent },
          { path: "documents/upload", component: DocumentUploadComponent },
          { path: "documents/edit/:id", component: DocumentEditComponent },
          { path: "documents/delete/:id", component: DocumentDeleteComponent },
          // Contacts
          { path: "contacts", component: ContactListComponent },
          { path: "contacts/email-settings", component: EmailSettingsComponent },
          // Users (admin only)
          { path: "users", component: UserListComponent },
          { path: "users/add", component: UserFormComponent },
          { path: "users/edit/:id", component: UserFormComponent },
          { path: "users/delete/:id", component: UserDeleteComponent },
          // Profile
          { path: "profile", component: ProfileComponent }
        ]
      }
    ]
  }
];
var AdminRoutingModule = class _AdminRoutingModule {
  static \u0275fac = function AdminRoutingModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminRoutingModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AdminRoutingModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forChild(routes), RouterModule] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminRoutingModule, [{
    type: NgModule,
    args: [{
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
    }]
  }], null, null);
})();

// src/app/admin/shared/data-table/data-table.component.ts
var DataTableComponent = class _DataTableComponent {
  static \u0275fac = function DataTableComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DataTableComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DataTableComponent, selectors: [["app-data-table"]], standalone: false, decls: 2, vars: 0, template: function DataTableComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "p");
      \u0275\u0275text(1, "data-table works!");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableComponent, [{
    type: Component,
    args: [{ selector: "app-data-table", standalone: false, template: "<p>data-table works!</p>\r\n" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DataTableComponent, { className: "DataTableComponent", filePath: "src/app/admin/shared/data-table/data-table.component.ts", lineNumber: 9 });
})();

// src/app/admin/shared/pagination/pagination.component.ts
var PaginationComponent = class _PaginationComponent {
  static \u0275fac = function PaginationComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PaginationComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PaginationComponent, selectors: [["app-pagination"]], standalone: false, decls: 2, vars: 0, template: function PaginationComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "p");
      \u0275\u0275text(1, "pagination works!");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaginationComponent, [{
    type: Component,
    args: [{ selector: "app-pagination", standalone: false, template: "<p>pagination works!</p>\r\n" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PaginationComponent, { className: "PaginationComponent", filePath: "src/app/admin/shared/pagination/pagination.component.ts", lineNumber: 9 });
})();

// src/app/admin/shared/search-filter/search-filter.component.ts
var SearchFilterComponent = class _SearchFilterComponent {
  static \u0275fac = function SearchFilterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SearchFilterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SearchFilterComponent, selectors: [["app-search-filter"]], standalone: false, decls: 2, vars: 0, template: function SearchFilterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "p");
      \u0275\u0275text(1, "search-filter works!");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SearchFilterComponent, [{
    type: Component,
    args: [{ selector: "app-search-filter", standalone: false, template: "<p>search-filter works!</p>\r\n" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SearchFilterComponent, { className: "SearchFilterComponent", filePath: "src/app/admin/shared/search-filter/search-filter.component.ts", lineNumber: 9 });
})();

// src/app/admin/shared/status-badge/status-badge.component.ts
var StatusBadgeComponent = class _StatusBadgeComponent {
  static \u0275fac = function StatusBadgeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StatusBadgeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _StatusBadgeComponent, selectors: [["app-status-badge"]], standalone: false, decls: 2, vars: 0, template: function StatusBadgeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "p");
      \u0275\u0275text(1, "status-badge works!");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StatusBadgeComponent, [{
    type: Component,
    args: [{ selector: "app-status-badge", standalone: false, template: "<p>status-badge works!</p>\r\n" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(StatusBadgeComponent, { className: "StatusBadgeComponent", filePath: "src/app/admin/shared/status-badge/status-badge.component.ts", lineNumber: 9 });
})();

// src/app/admin/shared/stats-card/stats-card.component.ts
var StatsCardComponent = class _StatsCardComponent {
  static \u0275fac = function StatsCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StatsCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _StatsCardComponent, selectors: [["app-stats-card"]], standalone: false, decls: 2, vars: 0, template: function StatsCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "p");
      \u0275\u0275text(1, "stats-card works!");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StatsCardComponent, [{
    type: Component,
    args: [{ selector: "app-stats-card", standalone: false, template: "<p>stats-card works!</p>\r\n" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(StatsCardComponent, { className: "StatsCardComponent", filePath: "src/app/admin/shared/stats-card/stats-card.component.ts", lineNumber: 9 });
})();

// src/app/admin/shared/modal/modal.component.ts
var ModalComponent = class _ModalComponent {
  static \u0275fac = function ModalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ModalComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ModalComponent, selectors: [["app-modal"]], standalone: false, decls: 2, vars: 0, template: function ModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "p");
      \u0275\u0275text(1, "modal works!");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModalComponent, [{
    type: Component,
    args: [{ selector: "app-modal", standalone: false, template: "<p>modal works!</p>\r\n" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ModalComponent, { className: "ModalComponent", filePath: "src/app/admin/shared/modal/modal.component.ts", lineNumber: 9 });
})();

// src/app/admin/shared/empty-state/empty-state.component.ts
var EmptyStateComponent = class _EmptyStateComponent {
  static \u0275fac = function EmptyStateComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EmptyStateComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EmptyStateComponent, selectors: [["app-empty-state"]], standalone: false, decls: 2, vars: 0, template: function EmptyStateComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "p");
      \u0275\u0275text(1, "empty-state works!");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmptyStateComponent, [{
    type: Component,
    args: [{ selector: "app-empty-state", standalone: false, template: "<p>empty-state works!</p>\r\n" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EmptyStateComponent, { className: "EmptyStateComponent", filePath: "src/app/admin/shared/empty-state/empty-state.component.ts", lineNumber: 9 });
})();

// src/app/admin/admin.module.ts
var AdminModule = class _AdminModule {
  static \u0275fac = function AdminModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AdminModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecureJsonInterceptor,
      multi: true
    }
  ], imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminModule, [{
    type: NgModule,
    args: [{
      declarations: [
        // Layout
        AdminLayoutComponent,
        AdminSidebarComponent,
        AdminHeaderComponent,
        // Auth
        LoginComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        ChangePasswordComponent,
        // Dashboard
        DashboardComponent,
        // Announcements
        AnnouncementListComponent,
        AnnouncementFormComponent,
        AnnouncementDeleteComponent,
        // Forms
        FormListComponent,
        FormFormComponent,
        FormDeleteComponent,
        // Gallery
        GalleryListComponent,
        GalleryUploadComponent,
        GalleryEditComponent,
        GalleryDeleteComponent,
        // Documents
        DocumentListComponent,
        DocumentUploadComponent,
        DocumentEditComponent,
        DocumentDeleteComponent,
        // Contacts
        ContactListComponent,
        EmailSettingsComponent,
        // Users
        UserListComponent,
        UserFormComponent,
        UserDeleteComponent,
        // Profile
        ProfileComponent,
        // Shared
        DataTableComponent,
        PaginationComponent,
        SearchFilterComponent,
        StatusBadgeComponent,
        StatsCardComponent,
        ModalComponent,
        EmptyStateComponent
      ],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AdminRoutingModule
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: SecureJsonInterceptor,
          multi: true
        }
      ]
    }]
  }], null, null);
})();
export {
  AdminModule
};
//# sourceMappingURL=chunk-LYPMDU36.js.map
