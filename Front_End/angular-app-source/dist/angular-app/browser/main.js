import {
  BehaviorSubject,
  CommonModule,
  Component,
  DOCUMENT,
  DefaultValueAccessor,
  DomSanitizer,
  ElementRef,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpParams,
  Inject,
  Injectable,
  NavigationEnd,
  NavigationStart,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  ReactiveFormsModule,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
  SecureJsonInterceptor,
  SelectControlValueAccessor,
  Validators,
  ViewChild,
  __spreadProps,
  __spreadValues,
  bootstrapApplication,
  filter,
  inject,
  provideBrowserGlobalErrorListeners,
  provideHttpClient,
  provideRouter,
  provideZoneChangeDetection,
  setClassMetadata,
  signal,
  withFetch,
  withInterceptorsFromDi,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵviewQuery
} from "./chunk-PUIKMTFI.js";

// src/app/components/pre-intro/pre-intro.component.ts
var PreIntroComponent = class _PreIntroComponent {
  router;
  elementRef;
  constructor(router, elementRef) {
    this.router = router;
    this.elementRef = elementRef;
  }
  ngOnInit() {
    const introSeen = sessionStorage.getItem("introSeen");
    if (introSeen === "true") {
      this.router.navigate(["/home"]);
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      const video = this.elementRef.nativeElement.querySelector(".pre-intro-bg-video");
      if (video) {
        console.log("Found video element:", video);
        console.log("Video readyState:", video.readyState);
        console.log("Video paused:", video.paused);
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.play().then(() => {
          console.log("Video playing successfully!");
        }).catch((error) => {
          console.error("Video autoplay failed:", error);
          document.addEventListener("click", () => {
            video.play();
          }, { once: true });
        });
      } else {
        console.error("Video element not found!");
      }
    }, 100);
  }
  /**
   * Handle "Launch Site" button click
   */
  onLaunchClick() {
    this.router.navigate(["/intro"]);
  }
  static \u0275fac = function PreIntroComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PreIntroComponent)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ElementRef));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PreIntroComponent, selectors: [["app-pre-intro"]], decls: 18, vars: 0, consts: [["id", "pre-intro-splash"], ["autoplay", "", "muted", "", "loop", "", "playsinline", "", 1, "pre-intro-bg-video"], ["src", "/assets/video/intro-space-background.mp4", "type", "video/mp4"], [1, "pre-intro-content"], ["src", "/assets/img/logo.png", "alt", "PASC Region J", 1, "pre-intro-logo"], [1, "pre-intro-title"], [1, "special-j"], [1, "pre-intro-subtitle"], [1, "pre-intro-date"], [1, "launch-button", 3, "click"], [1, "rocket-icon"]], template: function PreIntroComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "video", 1);
      \u0275\u0275domElement(2, "source", 2);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "div", 3);
      \u0275\u0275domElement(4, "img", 4);
      \u0275\u0275domElementStart(5, "h1", 5);
      \u0275\u0275text(6, "PASC REGION ");
      \u0275\u0275domElementStart(7, "span", 6);
      \u0275\u0275text(8, "J");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(9, "p", 7);
      \u0275\u0275text(10, "Leadership Conference 2026");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(11, "p", 8);
      \u0275\u0275text(12, "Reach for the Stars, Lead Beyond Limits \xB7 February 13, 2026");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(13, "button", 9);
      \u0275\u0275domListener("click", function PreIntroComponent_Template_button_click_13_listener() {
        return ctx.onLaunchClick();
      });
      \u0275\u0275domElementStart(14, "span", 10);
      \u0275\u0275text(15, "\u{1F680}");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(16, "span");
      \u0275\u0275text(17, "LAUNCH SITE");
      \u0275\u0275domElementEnd()()()();
    }
  }, dependencies: [CommonModule], styles: ['\n\n#pre-intro-splash[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background:\n    linear-gradient(\n      135deg,\n      #0a0e27 0%,\n      #1a1f3a 50%,\n      #2d3561 100%);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n  opacity: 1;\n  transition: opacity 0.8s ease;\n}\n#pre-intro-splash.fade-out[_ngcontent-%COMP%] {\n  opacity: 0;\n  pointer-events: none;\n}\n.pre-intro-bg-video[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  opacity: 0.4;\n  z-index: -1;\n}\n.pre-intro-content[_ngcontent-%COMP%] {\n  text-align: center;\n  z-index: 2;\n  animation: _ngcontent-%COMP%_fadeInUp 1s ease;\n}\n.pre-intro-logo[_ngcontent-%COMP%] {\n  width: 120px;\n  height: 120px;\n  margin-bottom: 30px;\n  animation: _ngcontent-%COMP%_pulse 2s infinite;\n}\n.pre-intro-title[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  font-weight: 700;\n  color: #ffffff;\n  margin-bottom: 15px;\n  text-shadow: 0 0 30px rgba(79, 195, 247, 0.5);\n  letter-spacing: 2px;\n}\n.pre-intro-title[_ngcontent-%COMP%]   .special-j[_ngcontent-%COMP%] {\n  font-size: 5rem;\n  font-weight: 900;\n  font-family:\n    "Century Schoolbook",\n    "Century Schoolbook Bold",\n    "Georgia",\n    serif;\n  color: #FF9800;\n  display: inline-block;\n  font-style: italic;\n  transform: rotate(8deg) scaleX(1.3);\n  animation: _ngcontent-%COMP%_glowJ 2s ease-in-out infinite;\n  -webkit-text-stroke: 2px #FF9800;\n  text-stroke: 2px #FF9800;\n  letter-spacing: 2px;\n}\n@keyframes _ngcontent-%COMP%_glowJ {\n  0%, 100% {\n    text-shadow: 0 0 20px rgba(255, 152, 0, 0.8);\n  }\n  50% {\n    text-shadow: 0 0 40px rgba(255, 152, 0, 1), 0 0 60px rgba(255, 152, 0, 0.6);\n  }\n}\n.pre-intro-subtitle[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  color: #FF9800;\n  margin-bottom: 10px;\n  font-weight: 300;\n}\n.pre-intro-date[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  color: #b0b8d4;\n  margin-bottom: 50px;\n}\n.launch-button[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #4fc3f7 0%,\n      #2196f3 100%);\n  color: #ffffff;\n  font-size: 1.3rem;\n  font-weight: 700;\n  padding: 20px 60px;\n  border: none;\n  border-radius: 50px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  box-shadow: 0 10px 30px rgba(79, 195, 247, 0.4);\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  text-transform: uppercase;\n  letter-spacing: 2px;\n  margin: 0 auto;\n}\n.launch-button[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 15px 40px rgba(79, 195, 247, 0.6);\n  background:\n    linear-gradient(\n      135deg,\n      #2196f3 0%,\n      #1976d2 100%);\n}\n.launch-button[_ngcontent-%COMP%]:active {\n  transform: translateY(-1px);\n}\n.rocket-icon[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  animation: _ngcontent-%COMP%_rocketBounce 1s infinite;\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(1.05);\n  }\n}\n@keyframes _ngcontent-%COMP%_rocketBounce {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-5px);\n  }\n}\n@media (max-width: 768px) {\n  .pre-intro-title[_ngcontent-%COMP%] {\n    font-size: 2rem;\n  }\n  .pre-intro-title[_ngcontent-%COMP%]   .special-j[_ngcontent-%COMP%] {\n    font-size: 3.2rem;\n  }\n  .pre-intro-subtitle[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n  .pre-intro-date[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n  .launch-button[_ngcontent-%COMP%] {\n    font-size: 1.1rem;\n    padding: 18px 40px;\n  }\n  .pre-intro-logo[_ngcontent-%COMP%] {\n    width: 80px;\n    height: 80px;\n  }\n}\n/*# sourceMappingURL=pre-intro.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PreIntroComponent, [{
    type: Component,
    args: [{ selector: "app-pre-intro", standalone: true, imports: [CommonModule], template: '<div id="pre-intro-splash">\n  <!-- Background Video -->\n  <video class="pre-intro-bg-video" autoplay muted loop playsinline>\n    <source src="/assets/video/intro-space-background.mp4" type="video/mp4">\n  </video>\n\n  <div class="pre-intro-content">\n    <img src="/assets/img/logo.png" alt="PASC Region J" class="pre-intro-logo">\n    <h1 class="pre-intro-title">PASC REGION <span class="special-j">J</span></h1>\n    <p class="pre-intro-subtitle">Leadership Conference 2026</p>\n    <p class="pre-intro-date">Reach for the Stars, Lead Beyond Limits \xB7 February 13, 2026</p>\n\n    <button class="launch-button" (click)="onLaunchClick()">\n      <span class="rocket-icon">\u{1F680}</span>\n      <span>LAUNCH SITE</span>\n    </button>\n  </div>\n</div>\n', styles: ['/* src/app/components/pre-intro/pre-intro.component.css */\n#pre-intro-splash {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background:\n    linear-gradient(\n      135deg,\n      #0a0e27 0%,\n      #1a1f3a 50%,\n      #2d3561 100%);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n  opacity: 1;\n  transition: opacity 0.8s ease;\n}\n#pre-intro-splash.fade-out {\n  opacity: 0;\n  pointer-events: none;\n}\n.pre-intro-bg-video {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  opacity: 0.4;\n  z-index: -1;\n}\n.pre-intro-content {\n  text-align: center;\n  z-index: 2;\n  animation: fadeInUp 1s ease;\n}\n.pre-intro-logo {\n  width: 120px;\n  height: 120px;\n  margin-bottom: 30px;\n  animation: pulse 2s infinite;\n}\n.pre-intro-title {\n  font-size: 3rem;\n  font-weight: 700;\n  color: #ffffff;\n  margin-bottom: 15px;\n  text-shadow: 0 0 30px rgba(79, 195, 247, 0.5);\n  letter-spacing: 2px;\n}\n.pre-intro-title .special-j {\n  font-size: 5rem;\n  font-weight: 900;\n  font-family:\n    "Century Schoolbook",\n    "Century Schoolbook Bold",\n    "Georgia",\n    serif;\n  color: #FF9800;\n  display: inline-block;\n  font-style: italic;\n  transform: rotate(8deg) scaleX(1.3);\n  animation: glowJ 2s ease-in-out infinite;\n  -webkit-text-stroke: 2px #FF9800;\n  text-stroke: 2px #FF9800;\n  letter-spacing: 2px;\n}\n@keyframes glowJ {\n  0%, 100% {\n    text-shadow: 0 0 20px rgba(255, 152, 0, 0.8);\n  }\n  50% {\n    text-shadow: 0 0 40px rgba(255, 152, 0, 1), 0 0 60px rgba(255, 152, 0, 0.6);\n  }\n}\n.pre-intro-subtitle {\n  font-size: 1.5rem;\n  color: #FF9800;\n  margin-bottom: 10px;\n  font-weight: 300;\n}\n.pre-intro-date {\n  font-size: 1.1rem;\n  color: #b0b8d4;\n  margin-bottom: 50px;\n}\n.launch-button {\n  background:\n    linear-gradient(\n      135deg,\n      #4fc3f7 0%,\n      #2196f3 100%);\n  color: #ffffff;\n  font-size: 1.3rem;\n  font-weight: 700;\n  padding: 20px 60px;\n  border: none;\n  border-radius: 50px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  box-shadow: 0 10px 30px rgba(79, 195, 247, 0.4);\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  text-transform: uppercase;\n  letter-spacing: 2px;\n  margin: 0 auto;\n}\n.launch-button:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 15px 40px rgba(79, 195, 247, 0.6);\n  background:\n    linear-gradient(\n      135deg,\n      #2196f3 0%,\n      #1976d2 100%);\n}\n.launch-button:active {\n  transform: translateY(-1px);\n}\n.rocket-icon {\n  font-size: 1.5rem;\n  animation: rocketBounce 1s infinite;\n}\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes pulse {\n  0%, 100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(1.05);\n  }\n}\n@keyframes rocketBounce {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-5px);\n  }\n}\n@media (max-width: 768px) {\n  .pre-intro-title {\n    font-size: 2rem;\n  }\n  .pre-intro-title .special-j {\n    font-size: 3.2rem;\n  }\n  .pre-intro-subtitle {\n    font-size: 1.2rem;\n  }\n  .pre-intro-date {\n    font-size: 1rem;\n  }\n  .launch-button {\n    font-size: 1.1rem;\n    padding: 18px 40px;\n  }\n  .pre-intro-logo {\n    width: 80px;\n    height: 80px;\n  }\n}\n/*# sourceMappingURL=pre-intro.component.css.map */\n'] }]
  }], () => [{ type: Router }, { type: ElementRef }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PreIntroComponent, { className: "PreIntroComponent", filePath: "src/app/components/pre-intro/pre-intro.component.ts", lineNumber: 12 });
})();

// src/app/services/audio.service.ts
var AudioService = class _AudioService {
  audio;
  isPlayingSubject = new BehaviorSubject(false);
  isMutedSubject = new BehaviorSubject(false);
  keepAliveInterval;
  // Observable streams for components to subscribe to
  isPlaying$ = this.isPlayingSubject.asObservable();
  isMuted$ = this.isMutedSubject.asObservable();
  constructor() {
    this.audio = new Audio("/assets/audio/instrumental_background.mp3");
    this.audio.loop = true;
    this.audio.preload = "auto";
    this.restoreState();
    this.setupEventListeners();
    this.keepAliveInterval = setInterval(() => this.keepAlive(), 2e3);
    document.addEventListener("visibilitychange", () => this.handleVisibilityChange());
  }
  /**
   * Restore audio state from sessionStorage
   */
  restoreState() {
    const anthemPlaying = sessionStorage.getItem("anthemPlaying") === "true";
    const anthemPosition = parseFloat(sessionStorage.getItem("anthemPosition") || "0");
    const musicMuted = sessionStorage.getItem("musicMuted") === "true";
    if (anthemPosition > 0) {
      this.audio.currentTime = anthemPosition;
    }
    this.audio.muted = musicMuted;
    this.isMutedSubject.next(musicMuted);
    if (anthemPlaying) {
      this.audio.play().then(() => {
        this.isPlayingSubject.next(true);
      }).catch((err) => {
        console.log("Audio autoplay prevented:", err);
        this.isPlayingSubject.next(false);
      });
    }
  }
  /**
   * Set up audio event listeners
   */
  setupEventListeners() {
    this.audio.addEventListener("play", () => {
      this.isPlayingSubject.next(true);
      sessionStorage.setItem("anthemPlaying", "true");
    });
    this.audio.addEventListener("pause", () => {
      this.isPlayingSubject.next(false);
      sessionStorage.setItem("anthemPlaying", "false");
    });
    this.audio.addEventListener("timeupdate", () => {
      sessionStorage.setItem("anthemPosition", this.audio.currentTime.toString());
    });
    this.audio.addEventListener("ended", () => {
      this.isPlayingSubject.next(false);
      sessionStorage.setItem("anthemPlaying", "false");
    });
    this.audio.addEventListener("error", (e) => {
      console.error("Audio playback error:", e);
      this.isPlayingSubject.next(false);
      sessionStorage.setItem("anthemPlaying", "false");
    });
  }
  /**
   * Keep-alive mechanism to ensure audio keeps playing
   */
  keepAlive() {
    const shouldBePlaying = sessionStorage.getItem("anthemPlaying") === "true";
    const isPaused = this.audio.paused;
    if (shouldBePlaying && isPaused) {
      this.audio.play().catch((err) => {
        console.log("Audio autoplay prevented:", err);
      });
    }
  }
  /**
   * Handle page visibility changes
   */
  handleVisibilityChange() {
    if (document.hidden) {
      sessionStorage.setItem("anthemPosition", this.audio.currentTime.toString());
      sessionStorage.setItem("anthemPlaying", (!this.audio.paused).toString());
    } else {
      const shouldBePlaying = sessionStorage.getItem("anthemPlaying") === "true";
      if (shouldBePlaying && this.audio.paused) {
        this.audio.play().catch((err) => {
          console.log("Audio resume prevented:", err);
        });
      }
    }
  }
  /**
   * Play the background music
   */
  play() {
    return this.audio.play().then(() => {
      this.isPlayingSubject.next(true);
      sessionStorage.setItem("anthemPlaying", "true");
    }).catch((err) => {
      console.error("Failed to play audio:", err);
      throw err;
    });
  }
  /**
   * Pause the background music
   */
  pause() {
    this.audio.pause();
    this.isPlayingSubject.next(false);
    sessionStorage.setItem("anthemPlaying", "false");
  }
  /**
   * Toggle play/pause
   */
  toggle() {
    if (this.audio.paused) {
      return this.play();
    } else {
      this.pause();
    }
  }
  /**
   * Mute/unmute the audio
   */
  setMuted(muted) {
    this.audio.muted = muted;
    this.isMutedSubject.next(muted);
    sessionStorage.setItem("musicMuted", muted.toString());
  }
  /**
   * Toggle mute state
   */
  toggleMute() {
    this.setMuted(!this.audio.muted);
  }
  /**
   * Get current playing state (synchronous)
   */
  isPlaying() {
    return !this.audio.paused;
  }
  /**
   * Get current muted state (synchronous)
   */
  isMuted() {
    return this.audio.muted;
  }
  /**
   * Get current playback time
   */
  getCurrentTime() {
    return this.audio.currentTime;
  }
  /**
   * Set playback time
   */
  setCurrentTime(time) {
    this.audio.currentTime = time;
    sessionStorage.setItem("anthemPosition", time.toString());
  }
  /**
   * Get audio duration
   */
  getDuration() {
    return this.audio.duration;
  }
  /**
   * Clean up on service destruction
   */
  ngOnDestroy() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }
    this.audio.pause();
    this.audio.src = "";
  }
  static \u0275fac = function AudioService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AudioService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AudioService, factory: _AudioService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AudioService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/components/intro/intro.component.ts
var _c0 = ["introVideoDesktop"];
var _c1 = ["introVideoMobile"];
var IntroComponent = class _IntroComponent {
  router;
  audioService;
  introVideoDesktop;
  introVideoMobile;
  introTimeout;
  constructor(router, audioService) {
    this.router = router;
    this.audioService = audioService;
  }
  ngOnInit() {
    this.generateStars();
  }
  ngAfterViewInit() {
    this.startIntroSequence();
  }
  /**
   * Generate twinkling stars background
   */
  generateStars() {
    const starsContainer = document.getElementById("stars");
    if (starsContainer) {
      for (let i = 0; i < 100; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starsContainer.appendChild(star);
      }
    }
  }
  /**
   * Start the intro sequence
   */
  startIntroSequence() {
    const isMobile = window.innerWidth <= 768;
    const activeVideo = isMobile ? this.introVideoMobile : this.introVideoDesktop;
    if (activeVideo && activeVideo.nativeElement) {
      activeVideo.nativeElement.muted = false;
      activeVideo.nativeElement.play().catch((err) => {
        console.log("Video autoplay prevented:", err);
        activeVideo.nativeElement.muted = true;
        activeVideo.nativeElement.play();
      });
    }
    this.introTimeout = setTimeout(() => {
      this.completeIntro();
    }, 1e4);
  }
  /**
   * Complete intro and navigate to home
   */
  completeIntro() {
    if (this.introTimeout) {
      clearTimeout(this.introTimeout);
    }
    const desktopVideo = this.introVideoDesktop?.nativeElement;
    const mobileVideo = this.introVideoMobile?.nativeElement;
    if (desktopVideo) {
      desktopVideo.pause();
      desktopVideo.muted = true;
    }
    if (mobileVideo) {
      mobileVideo.pause();
      mobileVideo.muted = true;
    }
    sessionStorage.setItem("introSeen", "true");
    this.audioService.play().catch((err) => {
      console.log("Audio autoplay prevented:", err);
    });
    this.router.navigate(["/home"]);
  }
  /**
   * Handle "Skip" button click
   */
  onSkipClick() {
    this.completeIntro();
  }
  ngOnDestroy() {
    if (this.introTimeout) {
      clearTimeout(this.introTimeout);
    }
  }
  static \u0275fac = function IntroComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _IntroComponent)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AudioService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _IntroComponent, selectors: [["app-intro"]], viewQuery: function IntroComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
      \u0275\u0275viewQuery(_c1, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.introVideoDesktop = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.introVideoMobile = _t.first);
    }
  }, decls: 35, vars: 0, consts: [["introVideoDesktop", ""], ["introVideoMobile", ""], ["id", "intro-splash"], ["id", "introVideoDesktop", "muted", "", "loop", "", "playsinline", "", 1, "intro-video", "intro-video-desktop"], ["src", "/assets/video/intro-space-background.mp4", "type", "video/mp4"], ["id", "introVideoMobile", "muted", "", "loop", "", "playsinline", "", 1, "intro-video", "intro-video-mobile"], ["src", "/assets/video/intro-space-background_M.mp4", "type", "video/mp4"], ["id", "stars", 1, "stars"], [1, "planet-container"], [1, "orbit", "orbit-1"], [1, "planet", "planet-1"], ["src", "/assets/img/orbit-planet-1.png", "alt", "Moon"], [1, "orbit", "orbit-2"], [1, "planet", "planet-2"], ["src", "/assets/img/orbit-planet-2.png", "alt", "Earth"], [1, "orbit", "orbit-3"], [1, "planet", "planet-3"], ["src", "/assets/img/orbit-planet-3.png", "alt", "Mars"], [1, "orbit", "orbit-4"], [1, "planet", "planet-4"], ["src", "/assets/img/orbit-planet-4.png", "alt", "Saturn"], [1, "center-logo"], [1, "intro-text"], [1, "intro-title"], [1, "special-j"], [1, "intro-subtitle"], [1, "intro-date"], [1, "intro-date", 2, "margin-top", "10px", "font-size", "1rem", "color", "#FFB300"], [1, "skip-btn", 3, "click"]], template: function IntroComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275domElementStart(0, "div", 2)(1, "video", 3, 0);
      \u0275\u0275domElement(3, "source", 4);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(4, "video", 5, 1);
      \u0275\u0275domElement(6, "source", 6);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElement(7, "div", 7);
      \u0275\u0275domElementStart(8, "div", 8)(9, "div", 9)(10, "div", 10);
      \u0275\u0275domElement(11, "img", 11);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(12, "div", 12)(13, "div", 13);
      \u0275\u0275domElement(14, "img", 14);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(15, "div", 15)(16, "div", 16);
      \u0275\u0275domElement(17, "img", 17);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(18, "div", 18)(19, "div", 19);
      \u0275\u0275domElement(20, "img", 20);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElement(21, "div", 21);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(22, "div", 22)(23, "h1", 23);
      \u0275\u0275text(24, "PASC REGION ");
      \u0275\u0275domElementStart(25, "span", 24);
      \u0275\u0275text(26, "J");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(27, "p", 25);
      \u0275\u0275text(28, "Reach for the Stars, Lead Beyond Limits");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(29, "p", 26);
      \u0275\u0275text(30, "February 13, 2026");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(31, "p", 27);
      \u0275\u0275text(32, "Hosted by Neshaminy High School");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(33, "button", 28);
      \u0275\u0275domListener("click", function IntroComponent_Template_button_click_33_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onSkipClick());
      });
      \u0275\u0275text(34, "Skip Intro \u2192");
      \u0275\u0275domElementEnd()();
    }
  }, dependencies: [CommonModule], styles: ['\n\nbody[_ngcontent-%COMP%] {\n  overflow-x: hidden;\n}\n#intro-splash[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100vh;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  z-index: 9999;\n  transition: opacity 0.8s ease-in-out;\n  overflow: hidden;\n  opacity: 1;\n  background:\n    linear-gradient(\n      135deg,\n      #1a0033 0%,\n      #2d1b4e 50%,\n      #1a0033 100%);\n}\n#intro-splash.loaded[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.intro-video[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  z-index: -1;\n}\n.intro-video-desktop[_ngcontent-%COMP%] {\n  display: block;\n}\n.intro-video-mobile[_ngcontent-%COMP%] {\n  display: none;\n}\n#intro-splash.fade-out[_ngcontent-%COMP%] {\n  opacity: 0;\n  pointer-events: none;\n}\n.stars[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.star[_ngcontent-%COMP%] {\n  position: absolute;\n  background: white;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_twinkle 3s infinite;\n}\n@keyframes _ngcontent-%COMP%_twinkle {\n  0%, 100% {\n    opacity: 0.3;\n  }\n  50% {\n    opacity: 1;\n  }\n}\n.planet-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: 640px;\n  height: 640px;\n  margin-bottom: 40px;\n}\n#intro-splash[_ngcontent-%COMP%]   .planet-container[_ngcontent-%COMP%] {\n  position: absolute !important;\n  top: 50% !important;\n  left: 50% !important;\n  transform: translate(-50%, -50%) !important;\n}\n.orbit[_ngcontent-%COMP%] {\n  position: absolute;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 50%;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n.orbit-1[_ngcontent-%COMP%] {\n  width: 260px;\n  height: 260px;\n  animation: _ngcontent-%COMP%_rotate 8s linear infinite;\n  animation-delay: 0s;\n}\n.orbit-2[_ngcontent-%COMP%] {\n  width: 380px;\n  height: 380px;\n  animation: _ngcontent-%COMP%_rotate 12s linear infinite reverse;\n  animation-delay: -9s;\n}\n.orbit-3[_ngcontent-%COMP%] {\n  width: 500px;\n  height: 500px;\n  animation: _ngcontent-%COMP%_rotate 16s linear infinite;\n  animation-delay: -4s;\n}\n.orbit-4[_ngcontent-%COMP%] {\n  width: 620px;\n  height: 620px;\n  animation: _ngcontent-%COMP%_rotate 20s linear infinite reverse;\n  animation-delay: -15s;\n}\n@keyframes _ngcontent-%COMP%_rotate {\n  from {\n    transform: translate(-50%, -50%) rotate(0deg);\n  }\n  to {\n    transform: translate(-50%, -50%) rotate(360deg);\n  }\n}\n.planet[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_introPulse 1s ease-in-out infinite;\n  position: absolute;\n  top: 0;\n  left: 50%;\n  transform: translateX(-50%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.planet[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.4));\n}\n.planet-1[_ngcontent-%COMP%] {\n  width: 35px;\n  height: 35px;\n}\n.planet-2[_ngcontent-%COMP%] {\n  width: 55px;\n  height: 55px;\n}\n.planet-3[_ngcontent-%COMP%] {\n  width: 45px;\n  height: 45px;\n}\n.planet-4[_ngcontent-%COMP%] {\n  width: 65px;\n  height: 65px;\n}\n.center-logo[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 150px;\n  height: 150px;\n  background-image: url(/assets/img/logo.png);\n  background-size: contain;\n  background-position: center;\n  background-repeat: no-repeat;\n  border-radius: 50%;\n  box-shadow: 0 0 10px rgba(255, 152, 0, 0.4);\n  animation:\n    _ngcontent-%COMP%_pulse 2s ease-in-out infinite,\n    _ngcontent-%COMP%_rotate360 20s linear infinite,\n    _ngcontent-%COMP%_introPulse 2s ease-in-out infinite;\n}\n@keyframes _ngcontent-%COMP%_rotate360 {\n  from {\n    transform: translate(-50%, -50%) rotate(0deg);\n  }\n  to {\n    transform: translate(-50%, -50%) rotate(360deg);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    box-shadow: 0 0 10px rgba(255, 152, 0, 0.4);\n    filter: brightness(1);\n  }\n  50% {\n    box-shadow: 0 0 20px rgba(255, 152, 0, 0.5);\n    filter: brightness(1.15);\n  }\n}\n.intro-text[_ngcontent-%COMP%] {\n  text-align: center;\n  color: white;\n  z-index: 10;\n}\n.intro-title[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  font-weight: bold;\n  margin-bottom: 20px;\n  opacity: 0;\n  animation: _ngcontent-%COMP%_fadeInUp 1s ease-out 0.5s forwards;\n  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);\n}\n.intro-title[_ngcontent-%COMP%]   .special-j[_ngcontent-%COMP%] {\n  font-size: 5rem;\n  font-weight: 900;\n  font-family:\n    "Century Schoolbook",\n    "Century Schoolbook Bold",\n    "Georgia",\n    serif;\n  color: #FF9800;\n  display: inline-block;\n  font-style: italic;\n  transform: rotate(8deg) scaleX(1.3);\n  animation: _ngcontent-%COMP%_glowJ 2s ease-in-out infinite;\n  -webkit-text-stroke: 2px #FF9800;\n  text-stroke: 2px #FF9800;\n  letter-spacing: 2px;\n}\n@keyframes _ngcontent-%COMP%_glowJ {\n  0%, 100% {\n    text-shadow: 0 0 20px rgba(255, 152, 0, 0.8);\n  }\n  50% {\n    text-shadow: 0 0 40px rgba(255, 152, 0, 1), 0 0 60px rgba(255, 152, 0, 0.6);\n  }\n}\n.intro-subtitle[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  color: #FFB300;\n  opacity: 0;\n  animation: _ngcontent-%COMP%_fadeInUp 1s ease-out 1.5s forwards;\n  text-shadow: 0 0 10px rgba(255, 179, 0, 0.6);\n}\n.intro-date[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  color: #FFB300;\n  margin-top: 10px;\n  opacity: 0;\n  animation: _ngcontent-%COMP%_fadeInUp 1s ease-out 2s forwards;\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.skip-btn[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 40px;\n  right: 40px;\n  padding: 12px 30px;\n  background: rgba(255, 255, 255, 0.1);\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  color: white;\n  font-size: 1rem;\n  border-radius: 30px;\n  cursor: pointer;\n  transition: all 0.3s;\n  opacity: 0;\n  animation: _ngcontent-%COMP%_fadeIn 0.5s ease-out 3s forwards;\n}\n.skip-btn[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.2);\n  border-color: rgba(255, 255, 255, 0.6);\n  transform: scale(1.05);\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  to {\n    opacity: 1;\n  }\n}\n@media (max-width: 768px) {\n  .intro-video-desktop[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .intro-video-mobile[_ngcontent-%COMP%] {\n    display: block;\n  }\n  .planet-container[_ngcontent-%COMP%] {\n    width: 420px;\n    height: 420px;\n    margin-bottom: 30px;\n  }\n  .orbit-1[_ngcontent-%COMP%] {\n    width: 170px;\n    height: 170px;\n    animation-delay: 0s;\n  }\n  .orbit-2[_ngcontent-%COMP%] {\n    width: 250px;\n    height: 250px;\n    animation-delay: -9s;\n  }\n  .orbit-3[_ngcontent-%COMP%] {\n    width: 330px;\n    height: 330px;\n    animation-delay: -4s;\n  }\n  .orbit-4[_ngcontent-%COMP%] {\n    width: 410px;\n    height: 410px;\n    animation-delay: -15s;\n  }\n  .center-logo[_ngcontent-%COMP%] {\n    width: 100px;\n    height: 100px;\n  }\n  .planet-1[_ngcontent-%COMP%] {\n    width: 28px;\n    height: 28px;\n  }\n  .planet-2[_ngcontent-%COMP%] {\n    width: 44px;\n    height: 44px;\n  }\n  .planet-3[_ngcontent-%COMP%] {\n    width: 36px;\n    height: 36px;\n  }\n  .planet-4[_ngcontent-%COMP%] {\n    width: 52px;\n    height: 52px;\n  }\n  .intro-title[_ngcontent-%COMP%] {\n    font-size: 1.8rem;\n  }\n  .intro-title[_ngcontent-%COMP%]   .special-j[_ngcontent-%COMP%] {\n    font-size: 3.2rem;\n  }\n  .intro-subtitle[_ngcontent-%COMP%] {\n    font-size: 1.1rem;\n  }\n  .intro-date[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n  .skip-btn[_ngcontent-%COMP%] {\n    bottom: 20px;\n    right: 20px;\n    padding: 10px 20px;\n    font-size: 0.9rem;\n  }\n}\n@keyframes _ngcontent-%COMP%_introPulse {\n  0%, 100% {\n    scale: 1;\n  }\n  50% {\n    scale: 1.1;\n  }\n}\n/*# sourceMappingURL=intro.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IntroComponent, [{
    type: Component,
    args: [{ selector: "app-intro", standalone: true, imports: [CommonModule], template: '<div id="intro-splash">\r\n  <!-- Intro Video Backgrounds WITH AUDIO -->\r\n  <video #introVideoDesktop id="introVideoDesktop" class="intro-video intro-video-desktop" muted loop playsinline>\r\n    <source src="/assets/video/intro-space-background.mp4" type="video/mp4">\r\n  </video>\r\n\r\n  <video #introVideoMobile id="introVideoMobile" class="intro-video intro-video-mobile" muted loop playsinline>\r\n    <source src="/assets/video/intro-space-background_M.mp4" type="video/mp4">\r\n  </video>\r\n\r\n  <div class="stars" id="stars"></div>\r\n\r\n  <div class="planet-container">\r\n    <div class="orbit orbit-1">\r\n      <div class="planet planet-1">\r\n        <img src="/assets/img/orbit-planet-1.png" alt="Moon">\r\n      </div>\r\n    </div>\r\n    <div class="orbit orbit-2">\r\n      <div class="planet planet-2">\r\n        <img src="/assets/img/orbit-planet-2.png" alt="Earth">\r\n      </div>\r\n    </div>\r\n    <div class="orbit orbit-3">\r\n      <div class="planet planet-3">\r\n        <img src="/assets/img/orbit-planet-3.png" alt="Mars">\r\n      </div>\r\n    </div>\r\n    <div class="orbit orbit-4">\r\n      <div class="planet planet-4">\r\n        <img src="/assets/img/orbit-planet-4.png" alt="Saturn">\r\n      </div>\r\n    </div>\r\n    <div class="center-logo"></div>\r\n  </div>\r\n\r\n  <div class="intro-text">\r\n    <h1 class="intro-title">PASC REGION <span class="special-j">J</span></h1>\r\n    <p class="intro-subtitle">Reach for the Stars, Lead Beyond Limits</p>\r\n    <p class="intro-date">February 13, 2026</p>\r\n    <p class="intro-date" style="margin-top: 10px; font-size: 1rem; color: #FFB300;">Hosted by Neshaminy High School</p>\r\n  </div>\r\n\r\n  <button class="skip-btn" (click)="onSkipClick()">Skip Intro \u2192</button>\r\n</div>\r\n', styles: ['/* src/app/components/intro/intro.component.css */\nbody {\n  overflow-x: hidden;\n}\n#intro-splash {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100vh;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  z-index: 9999;\n  transition: opacity 0.8s ease-in-out;\n  overflow: hidden;\n  opacity: 1;\n  background:\n    linear-gradient(\n      135deg,\n      #1a0033 0%,\n      #2d1b4e 50%,\n      #1a0033 100%);\n}\n#intro-splash.loaded {\n  opacity: 1;\n}\n.intro-video {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  z-index: -1;\n}\n.intro-video-desktop {\n  display: block;\n}\n.intro-video-mobile {\n  display: none;\n}\n#intro-splash.fade-out {\n  opacity: 0;\n  pointer-events: none;\n}\n.stars {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.star {\n  position: absolute;\n  background: white;\n  border-radius: 50%;\n  animation: twinkle 3s infinite;\n}\n@keyframes twinkle {\n  0%, 100% {\n    opacity: 0.3;\n  }\n  50% {\n    opacity: 1;\n  }\n}\n.planet-container {\n  position: relative;\n  width: 640px;\n  height: 640px;\n  margin-bottom: 40px;\n}\n#intro-splash .planet-container {\n  position: absolute !important;\n  top: 50% !important;\n  left: 50% !important;\n  transform: translate(-50%, -50%) !important;\n}\n.orbit {\n  position: absolute;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 50%;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n.orbit-1 {\n  width: 260px;\n  height: 260px;\n  animation: rotate 8s linear infinite;\n  animation-delay: 0s;\n}\n.orbit-2 {\n  width: 380px;\n  height: 380px;\n  animation: rotate 12s linear infinite reverse;\n  animation-delay: -9s;\n}\n.orbit-3 {\n  width: 500px;\n  height: 500px;\n  animation: rotate 16s linear infinite;\n  animation-delay: -4s;\n}\n.orbit-4 {\n  width: 620px;\n  height: 620px;\n  animation: rotate 20s linear infinite reverse;\n  animation-delay: -15s;\n}\n@keyframes rotate {\n  from {\n    transform: translate(-50%, -50%) rotate(0deg);\n  }\n  to {\n    transform: translate(-50%, -50%) rotate(360deg);\n  }\n}\n.planet {\n  animation: introPulse 1s ease-in-out infinite;\n  position: absolute;\n  top: 0;\n  left: 50%;\n  transform: translateX(-50%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.planet img {\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.4));\n}\n.planet-1 {\n  width: 35px;\n  height: 35px;\n}\n.planet-2 {\n  width: 55px;\n  height: 55px;\n}\n.planet-3 {\n  width: 45px;\n  height: 45px;\n}\n.planet-4 {\n  width: 65px;\n  height: 65px;\n}\n.center-logo {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 150px;\n  height: 150px;\n  background-image: url(/assets/img/logo.png);\n  background-size: contain;\n  background-position: center;\n  background-repeat: no-repeat;\n  border-radius: 50%;\n  box-shadow: 0 0 10px rgba(255, 152, 0, 0.4);\n  animation:\n    pulse 2s ease-in-out infinite,\n    rotate360 20s linear infinite,\n    introPulse 2s ease-in-out infinite;\n}\n@keyframes rotate360 {\n  from {\n    transform: translate(-50%, -50%) rotate(0deg);\n  }\n  to {\n    transform: translate(-50%, -50%) rotate(360deg);\n  }\n}\n@keyframes pulse {\n  0%, 100% {\n    box-shadow: 0 0 10px rgba(255, 152, 0, 0.4);\n    filter: brightness(1);\n  }\n  50% {\n    box-shadow: 0 0 20px rgba(255, 152, 0, 0.5);\n    filter: brightness(1.15);\n  }\n}\n.intro-text {\n  text-align: center;\n  color: white;\n  z-index: 10;\n}\n.intro-title {\n  font-size: 3rem;\n  font-weight: bold;\n  margin-bottom: 20px;\n  opacity: 0;\n  animation: fadeInUp 1s ease-out 0.5s forwards;\n  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);\n}\n.intro-title .special-j {\n  font-size: 5rem;\n  font-weight: 900;\n  font-family:\n    "Century Schoolbook",\n    "Century Schoolbook Bold",\n    "Georgia",\n    serif;\n  color: #FF9800;\n  display: inline-block;\n  font-style: italic;\n  transform: rotate(8deg) scaleX(1.3);\n  animation: glowJ 2s ease-in-out infinite;\n  -webkit-text-stroke: 2px #FF9800;\n  text-stroke: 2px #FF9800;\n  letter-spacing: 2px;\n}\n@keyframes glowJ {\n  0%, 100% {\n    text-shadow: 0 0 20px rgba(255, 152, 0, 0.8);\n  }\n  50% {\n    text-shadow: 0 0 40px rgba(255, 152, 0, 1), 0 0 60px rgba(255, 152, 0, 0.6);\n  }\n}\n.intro-subtitle {\n  font-size: 1.5rem;\n  color: #FFB300;\n  opacity: 0;\n  animation: fadeInUp 1s ease-out 1.5s forwards;\n  text-shadow: 0 0 10px rgba(255, 179, 0, 0.6);\n}\n.intro-date {\n  font-size: 1.2rem;\n  color: #FFB300;\n  margin-top: 10px;\n  opacity: 0;\n  animation: fadeInUp 1s ease-out 2s forwards;\n}\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.skip-btn {\n  position: absolute;\n  bottom: 40px;\n  right: 40px;\n  padding: 12px 30px;\n  background: rgba(255, 255, 255, 0.1);\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  color: white;\n  font-size: 1rem;\n  border-radius: 30px;\n  cursor: pointer;\n  transition: all 0.3s;\n  opacity: 0;\n  animation: fadeIn 0.5s ease-out 3s forwards;\n}\n.skip-btn:hover {\n  background: rgba(255, 255, 255, 0.2);\n  border-color: rgba(255, 255, 255, 0.6);\n  transform: scale(1.05);\n}\n@keyframes fadeIn {\n  to {\n    opacity: 1;\n  }\n}\n@media (max-width: 768px) {\n  .intro-video-desktop {\n    display: none;\n  }\n  .intro-video-mobile {\n    display: block;\n  }\n  .planet-container {\n    width: 420px;\n    height: 420px;\n    margin-bottom: 30px;\n  }\n  .orbit-1 {\n    width: 170px;\n    height: 170px;\n    animation-delay: 0s;\n  }\n  .orbit-2 {\n    width: 250px;\n    height: 250px;\n    animation-delay: -9s;\n  }\n  .orbit-3 {\n    width: 330px;\n    height: 330px;\n    animation-delay: -4s;\n  }\n  .orbit-4 {\n    width: 410px;\n    height: 410px;\n    animation-delay: -15s;\n  }\n  .center-logo {\n    width: 100px;\n    height: 100px;\n  }\n  .planet-1 {\n    width: 28px;\n    height: 28px;\n  }\n  .planet-2 {\n    width: 44px;\n    height: 44px;\n  }\n  .planet-3 {\n    width: 36px;\n    height: 36px;\n  }\n  .planet-4 {\n    width: 52px;\n    height: 52px;\n  }\n  .intro-title {\n    font-size: 1.8rem;\n  }\n  .intro-title .special-j {\n    font-size: 3.2rem;\n  }\n  .intro-subtitle {\n    font-size: 1.1rem;\n  }\n  .intro-date {\n    font-size: 1rem;\n  }\n  .skip-btn {\n    bottom: 20px;\n    right: 20px;\n    padding: 10px 20px;\n    font-size: 0.9rem;\n  }\n}\n@keyframes introPulse {\n  0%, 100% {\n    scale: 1;\n  }\n  50% {\n    scale: 1.1;\n  }\n}\n/*# sourceMappingURL=intro.component.css.map */\n'] }]
  }], () => [{ type: Router }, { type: AudioService }], { introVideoDesktop: [{
    type: ViewChild,
    args: ["introVideoDesktop", { static: false }]
  }], introVideoMobile: [{
    type: ViewChild,
    args: ["introVideoMobile", { static: false }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(IntroComponent, { className: "IntroComponent", filePath: "src/app/components/intro/intro.component.ts", lineNumber: 13 });
})();

// src/app/services/api.service.ts
var ApiService = class _ApiService {
  http = inject(HttpClient);
  baseUrl = "/api";
  // ==================== ANNOUNCEMENTS ====================
  /**
   * Get all active announcements
   */
  getAnnouncements() {
    return this.http.get(`${this.baseUrl}/announcements.cfc?method=getAnnouncements`);
  }
  // ==================== GALLERY ====================
  /**
   * Get gallery images with pagination
   * @param location - 'gallery' or 'about_page'
   * @param page - page number (default: 1)
   * @param limit - images per page (default: 9)
   */
  getGalleryImages(location = "gallery", page = 1, limit = 9) {
    const params = new HttpParams().set("method", "getImages").set("location", location).set("page", page.toString()).set("limit", limit.toString());
    return this.http.get(`${this.baseUrl}/gallery.cfc`, { params });
  }
  /**
   * Get total count of gallery images
   * @param location - 'gallery' or 'about_page'
   */
  getGalleryCount(location = "gallery") {
    const params = new HttpParams().set("method", "getCount").set("location", location);
    return this.http.get(`${this.baseUrl}/gallery.cfc`, { params });
  }
  // ==================== DOCUMENTS ====================
  /**
   * Get all active documents/resources
   */
  getDocuments() {
    return this.http.get(`${this.baseUrl}/documents.cfc?method=getDocuments`);
  }
  // ==================== WORKSHOPS ====================
  /**
   * Get workshop forms
   * @param location - page location (default: 'Workshops')
   */
  getWorkshopForms(location = "Workshops") {
    const params = new HttpParams().set("method", "getForms").set("location", location);
    return this.http.get(`${this.baseUrl}/workshops.cfc`, { params });
  }
  // ==================== CONTACT ====================
  /**
   * Submit contact form
   * @param submission - contact form data
   */
  submitContact(submission) {
    const params = new HttpParams().set("method", "submitContact").set("name", submission.name).set("email", submission.email).set("subject", submission.subject).set("message", submission.message).set("website", submission.website || "");
    return this.http.post(`${this.baseUrl}/contact.cfc`, null, { params });
  }
  // ==================== PAGES ====================
  /**
   * Get conference information
   */
  getConferenceInfo() {
    return this.http.get(`${this.baseUrl}/pages.cfc?method=getConferenceInfo`);
  }
  /**
   * Get page content
   * @param pageName - name of the page ('about', 'resources', etc.)
   */
  getPageContent(pageName) {
    const params = new HttpParams().set("method", "getContent").set("pageName", pageName);
    return this.http.get(`${this.baseUrl}/pages.cfc`, { params });
  }
  static \u0275fac = function ApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ApiService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ApiService, factory: _ApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ApiService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/components/home/home.component.ts
var _c02 = ["heroVideoDesktop"];
var _c12 = ["heroVideoMobile"];
var _forTrack0 = ($index, $item) => $item.id;
function HomeComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275element(1, "div", 30);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Loading announcements...");
    \u0275\u0275elementEnd()();
  }
}
function HomeComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function HomeComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 20);
    \u0275\u0275text(1, "No announcements at this time. Check back soon!");
    \u0275\u0275elementEnd();
  }
}
function HomeComponent_Conditional_26_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 33);
    \u0275\u0275text(1, "\u2B50 Featured");
    \u0275\u0275elementEnd();
  }
}
function HomeComponent_Conditional_26_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275conditionalCreate(1, HomeComponent_Conditional_26_For_2_Conditional_1_Template, 2, 0, "span", 33);
    \u0275\u0275elementStart(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 34);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const announcement_r2 = ctx.$implicit;
    \u0275\u0275classProp("featured", announcement_r2.isfeatured);
    \u0275\u0275advance();
    \u0275\u0275conditional(announcement_r2.isfeatured ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(announcement_r2.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(announcement_r2.content);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(announcement_r2.publishstart);
  }
}
function HomeComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275repeaterCreate(1, HomeComponent_Conditional_26_For_2_Template, 8, 6, "div", 31, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.announcements());
  }
}
var HomeComponent = class _HomeComponent {
  heroVideoDesktop;
  heroVideoMobile;
  apiService = inject(ApiService);
  audioService = inject(AudioService);
  announcements = signal([], ...ngDevMode ? [{ debugName: "announcements" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  subscriptions = [];
  ngOnInit() {
    this.loadAnnouncements();
    this.setupAudioSubscription();
  }
  ngAfterViewInit() {
    if (this.heroVideoDesktop?.nativeElement) {
      this.heroVideoDesktop.nativeElement.muted = true;
      this.heroVideoDesktop.nativeElement.volume = 0;
    }
    if (this.heroVideoMobile?.nativeElement) {
      this.heroVideoMobile.nativeElement.muted = true;
      this.heroVideoMobile.nativeElement.volume = 0;
    }
    this.controlVideoPlayback(this.audioService.isPlaying());
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  /**
   * Set up subscription to audio service to control video playback
   */
  setupAudioSubscription() {
    const playingSub = this.audioService.isPlaying$.subscribe((playing) => {
      this.controlVideoPlayback(playing);
    });
    this.subscriptions.push(playingSub);
  }
  /**
   * Control hero video playback
   */
  controlVideoPlayback(shouldPlay) {
    if (this.heroVideoDesktop && this.heroVideoDesktop.nativeElement) {
      if (shouldPlay) {
        this.heroVideoDesktop.nativeElement.play().catch((err) => {
          console.log("Video autoplay prevented:", err);
        });
      } else {
        this.heroVideoDesktop.nativeElement.pause();
      }
    }
    if (this.heroVideoMobile && this.heroVideoMobile.nativeElement) {
      if (shouldPlay) {
        this.heroVideoMobile.nativeElement.play().catch((err) => {
          console.log("Video autoplay prevented:", err);
        });
      } else {
        this.heroVideoMobile.nativeElement.pause();
      }
    }
  }
  loadAnnouncements() {
    this.loading.set(true);
    this.apiService.getAnnouncements().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.announcements.set(response.data);
        } else {
          this.error.set("Failed to load announcements");
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Error loading announcements:", err);
        this.error.set("Failed to load announcements");
        this.loading.set(false);
      }
    });
  }
  static \u0275fac = function HomeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HomeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HomeComponent, selectors: [["app-home"]], viewQuery: function HomeComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c02, 5);
      \u0275\u0275viewQuery(_c12, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.heroVideoDesktop = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.heroVideoMobile = _t.first);
    }
  }, decls: 69, vars: 4, consts: [["heroVideoDesktop", ""], ["heroVideoMobile", ""], [1, "hero"], ["id", "heroVideo", "muted", "", "loop", "", "playsinline", "", 1, "hero-video", "hero-video-desktop"], ["src", "/assets/video/space-background.mp4", "type", "video/mp4"], ["id", "heroVideoMobile", "muted", "", "loop", "", "playsinline", "", 1, "hero-video", "hero-video-mobile"], ["src", "/assets/video/space-background_M.mp4", "type", "video/mp4"], [1, "hero-content"], [1, "stars-background"], [1, "hero-text"], ["id", "heroTitle", 1, "hero-title"], ["id", "heroSubtitle", 1, "hero-subtitle"], [1, "hero-buttons"], ["routerLink", "/workshops", 1, "btn", "btn-primary"], ["routerLink", "/about", 1, "btn", "btn-secondary"], [1, "announcements-section"], [1, "container"], [1, "section-title"], [1, "loading-spinner"], [1, "alert", "alert-error"], [1, "no-announcements"], [1, "announcements-grid"], [1, "quick-info"], [1, "info-grid"], [1, "info-card"], [1, "info-icon"], [1, "cta-section"], [1, "cta-buttons"], ["routerLink", "/workshops", 1, "btn", "btn-large", "btn-primary"], ["routerLink", "/workshops", 1, "btn", "btn-large", "btn-outline"], [1, "spinner"], [1, "announcement-card", 3, "featured"], [1, "announcement-card"], [1, "featured-badge"], [1, "announcement-date"]], template: function HomeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 2)(1, "video", 3, 0);
      \u0275\u0275element(3, "source", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "video", 5, 1);
      \u0275\u0275element(6, "source", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 7);
      \u0275\u0275element(8, "div", 8);
      \u0275\u0275elementStart(9, "div", 9)(10, "h1", 10);
      \u0275\u0275text(11, "PASC REGION J CONFERENCE 2026");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "p", 11);
      \u0275\u0275text(13, "Reach for the Stars, Lead Beyond Limits - February 13, 2026");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 12)(15, "a", 13);
      \u0275\u0275text(16, "Register Now");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "a", 14);
      \u0275\u0275text(18, "Learn More");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(19, "section", 15)(20, "div", 16)(21, "h2", 17);
      \u0275\u0275text(22, "Latest Announcements");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(23, HomeComponent_Conditional_23_Template, 4, 0, "div", 18);
      \u0275\u0275conditionalCreate(24, HomeComponent_Conditional_24_Template, 3, 1, "div", 19);
      \u0275\u0275conditionalCreate(25, HomeComponent_Conditional_25_Template, 2, 0, "p", 20);
      \u0275\u0275conditionalCreate(26, HomeComponent_Conditional_26_Template, 3, 0, "div", 21);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "section", 22)(28, "div", 16)(29, "div", 23)(30, "div", 24)(31, "div", 25);
      \u0275\u0275text(32, "\u{1F4C6}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "h3");
      \u0275\u0275text(34, "Event Date");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "p");
      \u0275\u0275text(36, "February 13, 2026");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(37, "div", 24)(38, "div", 25);
      \u0275\u0275text(39, "\u{1F393}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "h3");
      \u0275\u0275text(41, "Who Can Attend");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "p");
      \u0275\u0275text(43, "Student Council Members within Region J");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(44, "div", 24)(45, "div", 25);
      \u0275\u0275text(46, "\u{1F680}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "h3");
      \u0275\u0275text(48, "Theme");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "p");
      \u0275\u0275text(50, "Navigating the Stars");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(51, "div", 24)(52, "div", 25);
      \u0275\u0275text(53, "\u{1F4CB}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "h3");
      \u0275\u0275text(55, "Registration");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "p");
      \u0275\u0275text(57, "January 5-23, 2026");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(58, "section", 26)(59, "div", 16)(60, "h2");
      \u0275\u0275text(61, "Ready to Reach for the Stars, Lead Beyond Limits?");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "p");
      \u0275\u0275text(63, "Join us for an inspiring day of leadership, workshops, and networking!");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "div", 27)(65, "a", 28);
      \u0275\u0275text(66, "Register for the Conference");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(67, "a", 29);
      \u0275\u0275text(68, "Apply to Present a Workshop");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(23);
      \u0275\u0275conditional(ctx.loading() ? 23 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 24 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.loading() && !ctx.error() && ctx.announcements().length === 0 ? 25 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.loading() && ctx.announcements().length > 0 ? 26 : -1);
    }
  }, dependencies: [CommonModule, RouterModule, RouterLink], styles: ["\n\n.loading-spinner[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px;\n}\n.spinner[_ngcontent-%COMP%] {\n  border: 4px solid rgba(255, 255, 255, 0.1);\n  border-top: 4px solid #4fc3f7;\n  border-radius: 50%;\n  width: 50px;\n  height: 50px;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n  margin: 0 auto 20px;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.no-announcements[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px;\n  color: #aaa;\n}\n.announcement-card.featured[_ngcontent-%COMP%] {\n  border: 2px solid #ffd700;\n}\n.featured-badge[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #ffd700 0%,\n      #ffb300 100%);\n  color: #000;\n  padding: 5px 15px;\n  border-radius: 20px;\n  font-size: 0.85rem;\n  font-weight: bold;\n  display: inline-block;\n  margin-bottom: 10px;\n}\n/*# sourceMappingURL=home.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HomeComponent, [{
    type: Component,
    args: [{ selector: "app-home", standalone: true, imports: [CommonModule, RouterModule], template: '<!-- Hero Section -->\n<section class="hero">\n  <!-- Video Background - Desktop -->\n  <video #heroVideoDesktop id="heroVideo" class="hero-video hero-video-desktop" muted loop playsinline>\n    <source src="/assets/video/space-background.mp4" type="video/mp4">\n  </video>\n\n  <!-- Video Background - Mobile -->\n  <video #heroVideoMobile id="heroVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>\n    <source src="/assets/video/space-background_M.mp4" type="video/mp4">\n  </video>\n\n  <div class="hero-content">\n    <div class="stars-background"></div>\n    <div class="hero-text">\n      <h1 class="hero-title" id="heroTitle">PASC REGION J CONFERENCE 2026</h1>\n      <p class="hero-subtitle" id="heroSubtitle">Reach for the Stars, Lead Beyond Limits - February 13, 2026</p>\n\n      <div class="hero-buttons">\n        <a routerLink="/workshops" class="btn btn-primary">Register Now</a>\n        <a routerLink="/about" class="btn btn-secondary">Learn More</a>\n      </div>\n    </div>\n  </div>\n</section>\n\n<!-- Announcements Section -->\n<section class="announcements-section">\n  <div class="container">\n    <h2 class="section-title">Latest Announcements</h2>\n\n    @if (loading()) {\n      <div class="loading-spinner">\n        <div class="spinner"></div>\n        <p>Loading announcements...</p>\n      </div>\n    }\n\n    @if (error()) {\n      <div class="alert alert-error">\n        <p>{{ error() }}</p>\n      </div>\n    }\n\n    @if (!loading() && !error() && announcements().length === 0) {\n      <p class="no-announcements">No announcements at this time. Check back soon!</p>\n    }\n\n    @if (!loading() && announcements().length > 0) {\n      <div class="announcements-grid">\n        @for (announcement of announcements(); track announcement.id) {\n          <div class="announcement-card" [class.featured]="announcement.isfeatured">\n            @if (announcement.isfeatured) {\n              <span class="featured-badge">\u2B50 Featured</span>\n            }\n            <h3>{{ announcement.title }}</h3>\n            <p>{{ announcement.content }}</p>\n            <span class="announcement-date">{{ announcement.publishstart }}</span>\n          </div>\n        }\n      </div>\n    }\n  </div>\n</section>\n\n<!-- Quick Info Section -->\n<section class="quick-info">\n  <div class="container">\n    <div class="info-grid">\n      <div class="info-card">\n        <div class="info-icon">\u{1F4C6}</div>\n        <h3>Event Date</h3>\n        <p>February 13, 2026</p>\n      </div>\n\n      <div class="info-card">\n        <div class="info-icon">\u{1F393}</div>\n        <h3>Who Can Attend</h3>\n        <p>Student Council Members within Region J</p>\n      </div>\n\n      <div class="info-card">\n        <div class="info-icon">\u{1F680}</div>\n        <h3>Theme</h3>\n        <p>Navigating the Stars</p>\n      </div>\n\n      <div class="info-card">\n        <div class="info-icon">\u{1F4CB}</div>\n        <h3>Registration</h3>\n        <p>January 5-23, 2026</p>\n      </div>\n    </div>\n  </div>\n</section>\n\n<!-- Call to Action Section -->\n<section class="cta-section">\n  <div class="container">\n    <h2>Ready to Reach for the Stars, Lead Beyond Limits?</h2>\n    <p>Join us for an inspiring day of leadership, workshops, and networking!</p>\n    <div class="cta-buttons">\n      <a routerLink="/workshops" class="btn btn-large btn-primary">Register for the Conference</a>\n      <a routerLink="/workshops" class="btn btn-large btn-outline">Apply to Present a Workshop</a>\n    </div>\n  </div>\n</section>\n', styles: ["/* src/app/components/home/home.component.css */\n.loading-spinner {\n  text-align: center;\n  padding: 40px;\n}\n.spinner {\n  border: 4px solid rgba(255, 255, 255, 0.1);\n  border-top: 4px solid #4fc3f7;\n  border-radius: 50%;\n  width: 50px;\n  height: 50px;\n  animation: spin 1s linear infinite;\n  margin: 0 auto 20px;\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.no-announcements {\n  text-align: center;\n  padding: 40px;\n  color: #aaa;\n}\n.announcement-card.featured {\n  border: 2px solid #ffd700;\n}\n.featured-badge {\n  background:\n    linear-gradient(\n      135deg,\n      #ffd700 0%,\n      #ffb300 100%);\n  color: #000;\n  padding: 5px 15px;\n  border-radius: 20px;\n  font-size: 0.85rem;\n  font-weight: bold;\n  display: inline-block;\n  margin-bottom: 10px;\n}\n/*# sourceMappingURL=home.component.css.map */\n"] }]
  }], null, { heroVideoDesktop: [{
    type: ViewChild,
    args: ["heroVideoDesktop", { static: false }]
  }], heroVideoMobile: [{
    type: ViewChild,
    args: ["heroVideoMobile", { static: false }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HomeComponent, { className: "HomeComponent", filePath: "src/app/components/home/home.component.ts", lineNumber: 16 });
})();

// src/app/components/about/about.component.ts
var _c03 = ["heroVideoDesktop"];
var _c13 = ["heroVideoMobile"];
var _c2 = ["largeLogo"];
var AboutComponent = class _AboutComponent {
  audioService;
  heroVideoDesktop;
  heroVideoMobile;
  largeLogo;
  isPlaying = false;
  subscriptions = [];
  constructor(audioService) {
    this.audioService = audioService;
  }
  ngOnInit() {
    this.setupAudioSubscription();
  }
  ngAfterViewInit() {
    if (this.heroVideoDesktop?.nativeElement) {
      this.heroVideoDesktop.nativeElement.muted = true;
      this.heroVideoDesktop.nativeElement.volume = 0;
    }
    if (this.heroVideoMobile?.nativeElement) {
      this.heroVideoMobile.nativeElement.muted = true;
      this.heroVideoMobile.nativeElement.volume = 0;
    }
    this.controlVideoPlayback(this.audioService.isPlaying());
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  /**
   * Set up subscription to audio service to control video playback
   */
  setupAudioSubscription() {
    const playingSub = this.audioService.isPlaying$.subscribe((playing) => {
      this.isPlaying = playing;
      this.controlVideoPlayback(playing);
    });
    this.subscriptions.push(playingSub);
  }
  /**
   * Control hero video playback
   */
  controlVideoPlayback(shouldPlay) {
    if (this.heroVideoDesktop && this.heroVideoDesktop.nativeElement) {
      if (shouldPlay) {
        this.heroVideoDesktop.nativeElement.play().catch((err) => {
          console.log("Video autoplay prevented:", err);
        });
      } else {
        this.heroVideoDesktop.nativeElement.pause();
      }
    }
    if (this.heroVideoMobile && this.heroVideoMobile.nativeElement) {
      if (shouldPlay) {
        this.heroVideoMobile.nativeElement.play().catch((err) => {
          console.log("Video autoplay prevented:", err);
        });
      } else {
        this.heroVideoMobile.nativeElement.pause();
      }
    }
  }
  static \u0275fac = function AboutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AboutComponent)(\u0275\u0275directiveInject(AudioService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AboutComponent, selectors: [["app-about"]], viewQuery: function AboutComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c03, 5);
      \u0275\u0275viewQuery(_c13, 5);
      \u0275\u0275viewQuery(_c2, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.heroVideoDesktop = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.heroVideoMobile = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.largeLogo = _t.first);
    }
  }, decls: 134, vars: 2, consts: [["heroVideoDesktop", ""], ["heroVideoMobile", ""], ["largeLogo", ""], [1, "page-hero"], ["id", "aboutVideo", "muted", "", "loop", "", "playsinline", "", 1, "hero-video", "hero-video-desktop"], ["src", "/assets/video/space-background.mp4", "type", "video/mp4"], ["id", "aboutVideoMobile", "muted", "", "loop", "", "playsinline", "", 1, "hero-video", "hero-video-mobile"], [1, "container"], ["id", "aboutTitle", 1, "hero-title"], ["id", "aboutSubtitle", 1, "hero-subtitle"], [1, "about-intro"], [1, "about-grid"], [1, "about-text"], [1, "about-logo"], ["src", "/assets/img/logo.png", "alt", "PASC Region J Logo", 1, "large-logo"], [1, "mission-vision"], [1, "mission-vision-grid"], [1, "mission-box"], [1, "vision-box"], [1, "what-we-do"], [1, "section-title"], [1, "section-intro"], [1, "activities-grid"], [1, "activity-card"], ["src", "/assets/img/gallery/f2.jpg", "alt", "Students holding PASC sign"], ["src", "/assets/img/gallery/f3.jpg", "alt", "Students at registration"], ["src", "/assets/img/gallery/f1.jpg", "alt", "Students collaborating"], [1, "why-join"], [1, "benefits-grid"], [1, "benefit-item"], [1, "benefit-icon"], [1, "cta-section"], [1, "cta-buttons"], ["routerLink", "/workshops", 1, "btn", "btn-primary"], ["routerLink", "/gallery", 1, "btn", "btn-secondary"]], template: function AboutComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 3)(1, "video", 4, 0);
      \u0275\u0275element(3, "source", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "video", 6, 1);
      \u0275\u0275element(6, "source", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 7)(8, "h1", 8);
      \u0275\u0275text(9, "About PASC Region J");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "p", 9);
      \u0275\u0275text(11, "Celebrating Leadership Since 1932");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(12, "section", 10)(13, "div", 7)(14, "div", 11)(15, "div", 12)(16, "h2");
      \u0275\u0275text(17, "Who We Are");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "p");
      \u0275\u0275text(19, "PASC Region J represents Districts 11 and 12, proudly serving student councils across ");
      \u0275\u0275elementStart(20, "strong");
      \u0275\u0275text(21, "Philadelphia, Delaware, Bucks, Montgomery, and Chester Counties");
      \u0275\u0275elementEnd();
      \u0275\u0275text(22, ".");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "p");
      \u0275\u0275text(24, "Since 1932, the Pennsylvania Association of Student Councils has been dedicated to developing, engaging, and celebrating leaders across our state. PASC helps students improve their lives while learning to lead through service, collaboration, and participation.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "p");
      \u0275\u0275text(26, "Our region is part of a statewide network that empowers and equips students to develop and strengthen their leadership skills through conferences, events, recognition programs, and networking opportunities.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "div", 13);
      \u0275\u0275element(28, "img", 14, 2);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(30, "section", 15)(31, "div", 7)(32, "div", 16)(33, "div", 17)(34, "h2");
      \u0275\u0275text(35, "Mission");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "p");
      \u0275\u0275text(37, "The Pennsylvania Association of Student Councils develops and elevates leaders by providing opportunities, training, networking, civic engagement, recognition, and resources necessary for students and advisors to engage in their schools, communities, and world.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(38, "div", 18)(39, "h2");
      \u0275\u0275text(40, "Vision");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "p");
      \u0275\u0275text(42, "The Pennsylvania Association of Student Councils envisions leaders being inspired, confident, and empowered to use their voices and put their skills into action for good in their schools, communities, and world.");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(43, "section", 19)(44, "div", 7)(45, "h2", 20);
      \u0275\u0275text(46, "What We Do");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "p", 21);
      \u0275\u0275text(48, "PASC Region J provides year-round opportunities for students and advisors to develop and apply leadership skills in order to improve themselves, their schools, and their communities.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "div", 22)(50, "div", 23);
      \u0275\u0275element(51, "img", 24);
      \u0275\u0275elementStart(52, "h3");
      \u0275\u0275text(53, "Conferences & Events");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "p");
      \u0275\u0275text(55, "We host regional conferences that bring together student leaders from across Districts 11 and 12. Our annual conference features inspiring keynote speakers, interactive workshops, and networking opportunities.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(56, "div", 23);
      \u0275\u0275element(57, "img", 25);
      \u0275\u0275elementStart(58, "h3");
      \u0275\u0275text(59, "Leadership Development");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "p");
      \u0275\u0275text(61, "Through workshops, training sessions, and hands-on activities, we help students develop essential leadership skills including communication, collaboration, problem-solving, and civic engagement.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(62, "div", 23);
      \u0275\u0275element(63, "img", 26);
      \u0275\u0275elementStart(64, "h3");
      \u0275\u0275text(65, "Networking & Connection");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "p");
      \u0275\u0275text(67, "Connect with fellow student leaders, share ideas, and build lasting relationships. Our events provide forums and opportunities for students and advisors to collaborate and learn from one another.");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(68, "section", 27)(69, "div", 7)(70, "h2", 20);
      \u0275\u0275text(71, "About PASC Region J");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(72, "div", 21)(73, "p");
      \u0275\u0275text(74, "PASC Region J serves student councils across ");
      \u0275\u0275elementStart(75, "strong");
      \u0275\u0275text(76, "Districts 11 and 12");
      \u0275\u0275elementEnd();
      \u0275\u0275text(77, ", covering Philadelphia, Delaware, Bucks, Montgomery, and Chester Counties in southeastern Pennsylvania. Each year, a different school within our region has the honor of hosting the annual Regional Leadership Conference.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(78, "p");
      \u0275\u0275text(79, "As a member school in Region J, your student council automatically has access to all the benefits and opportunities below:");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(80, "div", 28)(81, "div", 29)(82, "div", 30);
      \u0275\u0275text(83, "\u{1F3AF}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(84, "h3");
      \u0275\u0275text(85, "Leadership Training");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(86, "p");
      \u0275\u0275text(87, "Access to state-of-the-art leadership programs, conferences, and workshops designed to develop your skills.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(88, "div", 29)(89, "div", 30);
      \u0275\u0275text(90, "\u{1F91D}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(91, "h3");
      \u0275\u0275text(92, "Networking Opportunities");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(93, "p");
      \u0275\u0275text(94, "Connect with student leaders from across the region and build relationships that last beyond high school.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(95, "div", 29)(96, "div", 30);
      \u0275\u0275text(97, "\u{1F3C6}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(98, "h3");
      \u0275\u0275text(99, "Recognition & Awards");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(100, "p");
      \u0275\u0275text(101, "Eligibility for PASC awards, scholarships, and recognition programs celebrating your leadership achievements.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(102, "div", 29)(103, "div", 30);
      \u0275\u0275text(104, "\u{1F4DA}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(105, "h3");
      \u0275\u0275text(106, "Resources & Support");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(107, "p");
      \u0275\u0275text(108, "Access to advisors, training materials, best practices, and guidance from regional and state officers.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(109, "div", 29)(110, "div", 30);
      \u0275\u0275text(111, "\u{1F3A4}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(112, "h3");
      \u0275\u0275text(113, "Leadership Positions");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(114, "p");
      \u0275\u0275text(115, "Opportunities to run for regional and state leadership positions, developing your skills at the highest level.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(116, "div", 29)(117, "div", 30);
      \u0275\u0275text(118, "\u{1F31F}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(119, "h3");
      \u0275\u0275text(120, "Make a Difference");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(121, "p");
      \u0275\u0275text(122, "Use your voice to create positive change in your school, community, and beyond through service and advocacy.");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(123, "section", 31)(124, "div", 7)(125, "h2");
      \u0275\u0275text(126, "Ready to Reach for the Stars, Lead Beyond Limits?");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(127, "p");
      \u0275\u0275text(128, "Join us for an inspiring day of leadership, workshops, and networking!");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(129, "div", 32)(130, "a", 33);
      \u0275\u0275text(131, "View Workshops");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(132, "a", 34);
      \u0275\u0275text(133, "View Gallery");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(28);
      \u0275\u0275classProp("rotating", ctx.isPlaying);
    }
  }, dependencies: [CommonModule, RouterModule, RouterLink], styles: ["\n\n.mission-statement[_ngcontent-%COMP%] {\n  text-align: center;\n  margin: 40px auto;\n  max-width: 800px;\n}\n.mission-statement[_ngcontent-%COMP%]   .lead[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  line-height: 1.8;\n  color: #e0e0e0;\n}\n.content-sections[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 30px;\n  margin: 40px 0;\n}\n.content-card[_ngcontent-%COMP%] {\n  background: rgba(26, 31, 58, 0.6);\n  padding: 30px;\n  border-radius: 10px;\n  border-left: 4px solid #4fc3f7;\n}\n.content-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n  margin-bottom: 15px;\n}\n.about-gallery[_ngcontent-%COMP%] {\n  margin: 60px 0;\n}\n.about-gallery[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 30px;\n  color: #fff;\n}\n.gallery-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n}\n.gallery-item[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  border-radius: 10px;\n}\n.gallery-item[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 250px;\n  object-fit: cover;\n  transition: transform 0.3s ease;\n}\n.gallery-item[_ngcontent-%COMP%]:hover   img[_ngcontent-%COMP%] {\n  transform: scale(1.05);\n}\n.gallery-caption[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background:\n    linear-gradient(\n      to top,\n      rgba(0, 0, 0, 0.8),\n      transparent);\n  color: #fff;\n  padding: 20px 15px 10px;\n  font-size: 0.9rem;\n}\n.cta-section[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 80px 20px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(10, 14, 39, 0.8) 0%,\n      rgba(26, 31, 58, 0.8) 100%);\n}\n.cta-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  margin-bottom: 15px;\n}\n.cta-section[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  margin-bottom: 30px;\n  color: #b0b0b0;\n}\n.cta-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 20px;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n/*# sourceMappingURL=about.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AboutComponent, [{
    type: Component,
    args: [{ selector: "app-about", standalone: true, imports: [CommonModule, RouterModule], template: '<!-- Hero Section -->\n<section class="page-hero">\n    <!-- Video Background - Desktop -->\n    <video #heroVideoDesktop id="aboutVideo" class="hero-video hero-video-desktop" muted loop playsinline>\n        <source src="/assets/video/space-background.mp4" type="video/mp4">\n    </video>\n\n    <!-- Video Background - Mobile -->\n    <video #heroVideoMobile id="aboutVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>\n        <source src="/assets/video/space-background.mp4" type="video/mp4">\n    </video>\n\n    <div class="container">\n        <h1 class="hero-title" id="aboutTitle">About PASC Region J</h1>\n        <p class="hero-subtitle" id="aboutSubtitle">Celebrating Leadership Since 1932</p>\n    </div>\n</section>\n\n<!-- Who We Are Section -->\n<section class="about-intro">\n    <div class="container">\n        <div class="about-grid">\n            <div class="about-text">\n                <h2>Who We Are</h2>\n                <p>PASC Region J represents Districts 11 and 12, proudly serving student councils across <strong>Philadelphia, Delaware, Bucks, Montgomery, and Chester Counties</strong>.</p>\n\n                <p>Since 1932, the Pennsylvania Association of Student Councils has been dedicated to developing, engaging, and celebrating leaders across our state. PASC helps students improve their lives while learning to lead through service, collaboration, and participation.</p>\n\n                <p>Our region is part of a statewide network that empowers and equips students to develop and strengthen their leadership skills through conferences, events, recognition programs, and networking opportunities.</p>\n\n            </div>\n            <div class="about-logo">\n                <img #largeLogo src="/assets/img/logo.png" alt="PASC Region J Logo" class="large-logo" [class.rotating]="isPlaying">\n            </div>\n        </div>\n    </div>\n</section>\n\n<!-- Mission & Vision Section -->\n<section class="mission-vision">\n    <div class="container">\n        <div class="mission-vision-grid">\n            <div class="mission-box">\n                <h2>Mission</h2>\n                <p>The Pennsylvania Association of Student Councils develops and elevates leaders by providing opportunities, training, networking, civic engagement, recognition, and resources necessary for students and advisors to engage in their schools, communities, and world.</p>\n            </div>\n            <div class="vision-box">\n                <h2>Vision</h2>\n                <p>The Pennsylvania Association of Student Councils envisions leaders being inspired, confident, and empowered to use their voices and put their skills into action for good in their schools, communities, and world.</p>\n            </div>\n        </div>\n    </div>\n</section>\n\n<!-- What We Do Section with Photos -->\n<section class="what-we-do">\n    <div class="container">\n        <h2 class="section-title">What We Do</h2>\n        <p class="section-intro">PASC Region J provides year-round opportunities for students and advisors to develop and apply leadership skills in order to improve themselves, their schools, and their communities.</p>\n\n        <div class="activities-grid">\n            <!-- Card 1: Conferences & Events -->\n            <div class="activity-card">\n                <img src="/assets/img/gallery/f2.jpg" alt="Students holding PASC sign">\n                <h3>Conferences & Events</h3>\n                <p>We host regional conferences that bring together student leaders from across Districts 11 and 12. Our annual conference features inspiring keynote speakers, interactive workshops, and networking opportunities.</p>\n            </div>\n\n            <!-- Card 2: Leadership Development -->\n            <div class="activity-card">\n                <img src="/assets/img/gallery/f3.jpg" alt="Students at registration">\n                <h3>Leadership Development</h3>\n                <p>Through workshops, training sessions, and hands-on activities, we help students develop essential leadership skills including communication, collaboration, problem-solving, and civic engagement.</p>\n            </div>\n\n            <!-- Card 3: Networking & Connection -->\n            <div class="activity-card">\n                <img src="/assets/img/gallery/f1.jpg" alt="Students collaborating">\n                <h3>Networking & Connection</h3>\n                <p>Connect with fellow student leaders, share ideas, and build lasting relationships. Our events provide forums and opportunities for students and advisors to collaborate and learn from one another.</p>\n            </div>\n        </div>\n    </div>\n</section>\n\n<!-- Why Join Section -->\n<section class="why-join">\n    <div class="container">\n        <h2 class="section-title">About PASC Region J</h2>\n\n\n        <div class="section-intro">\n            <p>PASC Region J serves student councils across <strong>Districts 11 and 12</strong>, covering Philadelphia, Delaware, Bucks, Montgomery, and Chester Counties in southeastern Pennsylvania. Each year, a different school within our region has the honor of hosting the annual Regional Leadership Conference.</p>\n\n            <p>As a member school in Region J, your student council automatically has access to all the benefits and opportunities below:</p>\n        </div>\n\n        <div class="benefits-grid">\n            <div class="benefit-item">\n                <div class="benefit-icon">\u{1F3AF}</div>\n                <h3>Leadership Training</h3>\n                <p>Access to state-of-the-art leadership programs, conferences, and workshops designed to develop your skills.</p>\n            </div>\n\n            <div class="benefit-item">\n                <div class="benefit-icon">\u{1F91D}</div>\n                <h3>Networking Opportunities</h3>\n                <p>Connect with student leaders from across the region and build relationships that last beyond high school.</p>\n            </div>\n\n            <div class="benefit-item">\n                <div class="benefit-icon">\u{1F3C6}</div>\n                <h3>Recognition & Awards</h3>\n                <p>Eligibility for PASC awards, scholarships, and recognition programs celebrating your leadership achievements.</p>\n            </div>\n\n            <div class="benefit-item">\n                <div class="benefit-icon">\u{1F4DA}</div>\n                <h3>Resources & Support</h3>\n                <p>Access to advisors, training materials, best practices, and guidance from regional and state officers.</p>\n            </div>\n\n            <div class="benefit-item">\n                <div class="benefit-icon">\u{1F3A4}</div>\n                <h3>Leadership Positions</h3>\n                <p>Opportunities to run for regional and state leadership positions, developing your skills at the highest level.</p>\n            </div>\n\n            <div class="benefit-item">\n                <div class="benefit-icon">\u{1F31F}</div>\n                <h3>Make a Difference</h3>\n                <p>Use your voice to create positive change in your school, community, and beyond through service and advocacy.</p>\n            </div>\n        </div>\n    </div>\n</section>\n\n<!-- CTA Section -->\n<section class="cta-section">\n    <div class="container">\n        <h2>Ready to Reach for the Stars, Lead Beyond Limits?</h2>\n        <p>Join us for an inspiring day of leadership, workshops, and networking!</p>\n        <div class="cta-buttons">\n            <a routerLink="/workshops" class="btn btn-primary">View Workshops</a>\n            <a routerLink="/gallery" class="btn btn-secondary">View Gallery</a>\n        </div>\n    </div>\n</section>\n', styles: ["/* src/app/components/about/about.component.css */\n.mission-statement {\n  text-align: center;\n  margin: 40px auto;\n  max-width: 800px;\n}\n.mission-statement .lead {\n  font-size: 1.25rem;\n  line-height: 1.8;\n  color: #e0e0e0;\n}\n.content-sections {\n  display: grid;\n  gap: 30px;\n  margin: 40px 0;\n}\n.content-card {\n  background: rgba(26, 31, 58, 0.6);\n  padding: 30px;\n  border-radius: 10px;\n  border-left: 4px solid #4fc3f7;\n}\n.content-card h2 {\n  color: #4fc3f7;\n  margin-bottom: 15px;\n}\n.about-gallery {\n  margin: 60px 0;\n}\n.about-gallery h2 {\n  text-align: center;\n  margin-bottom: 30px;\n  color: #fff;\n}\n.gallery-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n}\n.gallery-item {\n  position: relative;\n  overflow: hidden;\n  border-radius: 10px;\n}\n.gallery-item img {\n  width: 100%;\n  height: 250px;\n  object-fit: cover;\n  transition: transform 0.3s ease;\n}\n.gallery-item:hover img {\n  transform: scale(1.05);\n}\n.gallery-caption {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background:\n    linear-gradient(\n      to top,\n      rgba(0, 0, 0, 0.8),\n      transparent);\n  color: #fff;\n  padding: 20px 15px 10px;\n  font-size: 0.9rem;\n}\n.cta-section {\n  text-align: center;\n  padding: 80px 20px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(10, 14, 39, 0.8) 0%,\n      rgba(26, 31, 58, 0.8) 100%);\n}\n.cta-section h2 {\n  font-size: 2.5rem;\n  margin-bottom: 15px;\n}\n.cta-section p {\n  font-size: 1.2rem;\n  margin-bottom: 30px;\n  color: #b0b0b0;\n}\n.cta-buttons {\n  display: flex;\n  gap: 20px;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n/*# sourceMappingURL=about.component.css.map */\n"] }]
  }], () => [{ type: AudioService }], { heroVideoDesktop: [{
    type: ViewChild,
    args: ["heroVideoDesktop", { static: false }]
  }], heroVideoMobile: [{
    type: ViewChild,
    args: ["heroVideoMobile", { static: false }]
  }], largeLogo: [{
    type: ViewChild,
    args: ["largeLogo", { static: false }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AboutComponent, { className: "AboutComponent", filePath: "src/app/components/about/about.component.ts", lineNumber: 14 });
})();

// src/app/components/gallery/gallery.component.ts
var _c04 = ["heroVideoDesktop"];
var _c14 = ["heroVideoMobile"];
var _forTrack02 = ($index, $item) => $item.id;
function GalleryComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "div", 14);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Loading gallery...");
    \u0275\u0275elementEnd()();
  }
}
function GalleryComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function GalleryComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 15);
    \u0275\u0275text(2, "\u{1F4F8}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2");
    \u0275\u0275text(4, "No Photos Yet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "Gallery photos will be added soon. Check back later!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "a", 16);
    \u0275\u0275text(8, "Return Home");
    \u0275\u0275elementEnd()();
  }
}
function GalleryComponent_Conditional_17_For_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 31)(1, "img", 42);
    \u0275\u0275listener("click", function GalleryComponent_Conditional_17_For_30_Template_img_click_1_listener() {
      const \u0275$index_96_r4 = \u0275\u0275restoreView(_r3).$index;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openModal(\u0275$index_96_r4));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 43)(3, "div", 44);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const image_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", image_r5.fullpath, \u0275\u0275sanitizeUrl)("alt", image_r5.title);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(image_r5.title);
  }
}
function GalleryComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 18);
    \u0275\u0275text(2, " Page ");
    \u0275\u0275elementStart(3, "span", 19);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " of ");
    \u0275\u0275elementStart(6, "span", 20);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275text(8, " (Photos ");
    \u0275\u0275elementStart(9, "span", 21);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, "-");
    \u0275\u0275elementStart(12, "span", 22);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275text(14, " of ");
    \u0275\u0275elementStart(15, "span", 23);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275text(17, ") ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 24)(19, "button", 25);
    \u0275\u0275listener("click", function GalleryComponent_Conditional_17_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.goToPage(1));
    });
    \u0275\u0275text(20, "\u23EE First");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 26);
    \u0275\u0275listener("click", function GalleryComponent_Conditional_17_Template_button_click_21_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.currentPage() - 1));
    });
    \u0275\u0275text(22, "\u25C0 Previous");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "input", 27);
    \u0275\u0275listener("change", function GalleryComponent_Conditional_17_Template_input_change_23_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.handlePageInput($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "button", 28);
    \u0275\u0275listener("click", function GalleryComponent_Conditional_17_Template_button_click_24_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.currentPage() + 1));
    });
    \u0275\u0275text(25, "Next \u25B6");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "button", 29);
    \u0275\u0275listener("click", function GalleryComponent_Conditional_17_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.getTotalPages()));
    });
    \u0275\u0275text(27, "Last \u23ED");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "div", 30);
    \u0275\u0275repeaterCreate(29, GalleryComponent_Conditional_17_For_30_Template, 5, 3, "div", 31, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 17)(32, "div", 18);
    \u0275\u0275text(33, " Page ");
    \u0275\u0275elementStart(34, "span", 32);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd();
    \u0275\u0275text(36, " of ");
    \u0275\u0275elementStart(37, "span", 33);
    \u0275\u0275text(38);
    \u0275\u0275elementEnd();
    \u0275\u0275text(39, " (Photos ");
    \u0275\u0275elementStart(40, "span", 34);
    \u0275\u0275text(41);
    \u0275\u0275elementEnd();
    \u0275\u0275text(42, "-");
    \u0275\u0275elementStart(43, "span", 35);
    \u0275\u0275text(44);
    \u0275\u0275elementEnd();
    \u0275\u0275text(45, " of ");
    \u0275\u0275elementStart(46, "span", 36);
    \u0275\u0275text(47);
    \u0275\u0275elementEnd();
    \u0275\u0275text(48, ") ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "div", 24)(50, "button", 37);
    \u0275\u0275listener("click", function GalleryComponent_Conditional_17_Template_button_click_50_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.goToPage(1));
    });
    \u0275\u0275text(51, "\u23EE First");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "button", 38);
    \u0275\u0275listener("click", function GalleryComponent_Conditional_17_Template_button_click_52_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.currentPage() - 1));
    });
    \u0275\u0275text(53, "\u25C0 Previous");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "input", 39);
    \u0275\u0275listener("change", function GalleryComponent_Conditional_17_Template_input_change_54_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.handlePageInput($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "button", 40);
    \u0275\u0275listener("click", function GalleryComponent_Conditional_17_Template_button_click_55_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.currentPage() + 1));
    });
    \u0275\u0275text(56, "Next \u25B6");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "button", 41);
    \u0275\u0275listener("click", function GalleryComponent_Conditional_17_Template_button_click_57_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.goToPage(ctx_r0.getTotalPages()));
    });
    \u0275\u0275text(58, "Last \u23ED");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.currentPage());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.getTotalPages());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.getStartPhoto());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.getEndPhoto());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.totalImages());
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r0.currentPage() === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage() === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("min", 1)("max", ctx_r0.getTotalPages())("value", ctx_r0.currentPage());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage() === ctx_r0.getTotalPages());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage() === ctx_r0.getTotalPages());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.images());
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.currentPage());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.getTotalPages());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.getStartPhoto());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.getEndPhoto());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.totalImages());
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r0.currentPage() === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage() === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("min", 1)("max", ctx_r0.getTotalPages())("value", ctx_r0.currentPage());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage() === ctx_r0.getTotalPages());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage() === ctx_r0.getTotalPages());
  }
}
function GalleryComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275listener("click", function GalleryComponent_Conditional_18_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeModal());
    });
    \u0275\u0275elementStart(1, "span", 46);
    \u0275\u0275listener("click", function GalleryComponent_Conditional_18_Template_span_click_1_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeModal());
    });
    \u0275\u0275text(2, "\xD7");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "img", 47);
    \u0275\u0275listener("click", function GalleryComponent_Conditional_18_Template_img_click_3_listener($event) {
      \u0275\u0275restoreView(_r6);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 48)(5, "button", 49);
    \u0275\u0275listener("click", function GalleryComponent_Conditional_18_Template_button_click_5_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.previousModalImage($event));
    });
    \u0275\u0275text(6, "\u25C0");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 50);
    \u0275\u0275listener("click", function GalleryComponent_Conditional_18_Template_button_click_7_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.nextModalImage($event));
    });
    \u0275\u0275text(8, "\u25B6");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 51);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("src", (tmp_3_0 = ctx_r0.images()[ctx_r0.modalIndex()]) == null ? null : tmp_3_0.fullpath, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.modalIndex() === 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.modalIndex() === ctx_r0.images().length - 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("Photo ", ctx_r0.modalIndex() + 1, " of ", ctx_r0.images().length);
  }
}
var GalleryComponent = class _GalleryComponent {
  heroVideoDesktop;
  heroVideoMobile;
  apiService = inject(ApiService);
  audioService = inject(AudioService);
  images = signal([], ...ngDevMode ? [{ debugName: "images" }] : []);
  totalImages = signal(0, ...ngDevMode ? [{ debugName: "totalImages" }] : []);
  currentPage = signal(1, ...ngDevMode ? [{ debugName: "currentPage" }] : []);
  imagesPerPage = 9;
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  // Modal
  modalOpen = signal(false, ...ngDevMode ? [{ debugName: "modalOpen" }] : []);
  modalIndex = signal(0, ...ngDevMode ? [{ debugName: "modalIndex" }] : []);
  subscriptions = [];
  ngOnInit() {
    this.loadGalleryCount();
    this.loadGalleryImages();
    this.setupAudioSubscription();
  }
  ngAfterViewInit() {
    if (this.heroVideoDesktop?.nativeElement) {
      this.heroVideoDesktop.nativeElement.muted = true;
      this.heroVideoDesktop.nativeElement.volume = 0;
    }
    if (this.heroVideoMobile?.nativeElement) {
      this.heroVideoMobile.nativeElement.muted = true;
      this.heroVideoMobile.nativeElement.volume = 0;
    }
    this.controlVideoPlayback(this.audioService.isPlaying());
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  setupAudioSubscription() {
    const playingSub = this.audioService.isPlaying$.subscribe((playing) => {
      this.controlVideoPlayback(playing);
    });
    this.subscriptions.push(playingSub);
  }
  controlVideoPlayback(shouldPlay) {
    [this.heroVideoDesktop, this.heroVideoMobile].forEach((videoRef) => {
      if (videoRef && videoRef.nativeElement) {
        if (shouldPlay) {
          videoRef.nativeElement.play().catch(() => {
          });
        } else {
          videoRef.nativeElement.pause();
        }
      }
    });
  }
  loadGalleryCount() {
    this.apiService.getGalleryCount("gallery").subscribe({
      next: (response) => {
        if (response.success) {
          this.totalImages.set(response.totalcount);
        }
      },
      error: (err) => {
        console.error("Error loading gallery count:", err);
      }
    });
  }
  loadGalleryImages() {
    this.loading.set(true);
    this.apiService.getGalleryImages("gallery", this.currentPage(), this.imagesPerPage).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.images.set(response.data);
        } else {
          this.error.set("Failed to load gallery images");
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Error loading gallery images:", err);
        this.error.set("Failed to load gallery images");
        this.loading.set(false);
      }
    });
  }
  getTotalPages() {
    return Math.ceil(this.totalImages() / this.imagesPerPage);
  }
  getStartPhoto() {
    return (this.currentPage() - 1) * this.imagesPerPage + 1;
  }
  getEndPhoto() {
    return Math.min(this.currentPage() * this.imagesPerPage, this.totalImages());
  }
  goToPage(page) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage.set(page);
      this.loadGalleryImages();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  handlePageInput(event) {
    const input = event.target;
    const page = parseInt(input.value, 10);
    if (!isNaN(page)) {
      this.goToPage(page);
    }
  }
  openModal(index) {
    this.modalIndex.set(index);
    this.modalOpen.set(true);
  }
  closeModal() {
    this.modalOpen.set(false);
  }
  nextModalImage(event) {
    event.stopPropagation();
    const currentIndex = this.modalIndex();
    if (currentIndex < this.images().length - 1) {
      this.modalIndex.set(currentIndex + 1);
    }
  }
  previousModalImage(event) {
    event.stopPropagation();
    const currentIndex = this.modalIndex();
    if (currentIndex > 0) {
      this.modalIndex.set(currentIndex - 1);
    }
  }
  static \u0275fac = function GalleryComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GalleryComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GalleryComponent, selectors: [["app-gallery"]], viewQuery: function GalleryComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c04, 5);
      \u0275\u0275viewQuery(_c14, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.heroVideoDesktop = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.heroVideoMobile = _t.first);
    }
  }, decls: 19, vars: 5, consts: [["heroVideoDesktop", ""], ["heroVideoMobile", ""], [1, "page-hero"], ["id", "galleryVideo", "muted", "", "loop", "", "playsinline", "", 1, "hero-video", "hero-video-desktop"], ["src", "/assets/video/space-background.mp4", "type", "video/mp4"], ["id", "galleryVideoMobile", "muted", "", "loop", "", "playsinline", "", 1, "hero-video", "hero-video-mobile"], [1, "container"], ["id", "galleryTitle", 1, "hero-title"], ["id", "gallerySubtitle", 1, "hero-subtitle"], [1, "gallery-section"], [1, "loading-spinner"], [1, "alert", "alert-error"], [1, "gallery-empty"], ["id", "imageModal", 1, "modal"], [1, "spinner"], [1, "gallery-empty-icon"], ["routerLink", "/home", 1, "btn", "btn-primary"], [1, "controls"], [1, "page-info"], ["id", "currentPage"], ["id", "totalPages"], ["id", "startPhoto"], ["id", "endPhoto"], ["id", "totalPhotos"], [1, "nav-buttons"], ["id", "firstButton", 1, "nav-button", 3, "click", "disabled"], ["id", "prevButton", 1, "nav-button", 3, "click", "disabled"], ["type", "number", "id", "pageInput", 1, "page-input", 3, "change", "min", "max", "value"], ["id", "nextButton", 1, "nav-button", 3, "click", "disabled"], ["id", "lastButton", 1, "nav-button", 3, "click", "disabled"], [1, "gallery-grid"], [1, "gallery-item"], ["id", "currentPageBottom"], ["id", "totalPagesBottom"], ["id", "startPhotoBottom"], ["id", "endPhotoBottom"], ["id", "totalPhotosBottom"], ["id", "firstButtonBottom", 1, "nav-button", 3, "click", "disabled"], ["id", "prevButtonBottom", 1, "nav-button", 3, "click", "disabled"], ["type", "number", "id", "pageInputBottom", 1, "page-input", 3, "change", "min", "max", "value"], ["id", "nextButtonBottom", 1, "nav-button", 3, "click", "disabled"], ["id", "lastButtonBottom", 1, "nav-button", 3, "click", "disabled"], ["loading", "lazy", 3, "click", "src", "alt"], [1, "info"], [1, "date"], ["id", "imageModal", 1, "modal", 3, "click"], [1, "close", 3, "click"], ["id", "modalImage", 1, "modal-content", 3, "click", "src"], [1, "modal-arrows"], ["id", "prevModalBtn", 1, "arrow-left", 3, "click", "disabled"], ["id", "nextModalBtn", 1, "arrow-right", 3, "click", "disabled"], ["id", "modalInfo", 1, "modal-info"]], template: function GalleryComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 2)(1, "video", 3, 0);
      \u0275\u0275element(3, "source", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "video", 5, 1);
      \u0275\u0275element(6, "source", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 6)(8, "h1", 7);
      \u0275\u0275text(9, "Photo Gallery");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "p", 8);
      \u0275\u0275text(11, "Conference Memories & Highlights");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(12, "section", 9)(13, "div", 6);
      \u0275\u0275conditionalCreate(14, GalleryComponent_Conditional_14_Template, 4, 0, "div", 10);
      \u0275\u0275conditionalCreate(15, GalleryComponent_Conditional_15_Template, 3, 1, "div", 11);
      \u0275\u0275conditionalCreate(16, GalleryComponent_Conditional_16_Template, 9, 0, "div", 12);
      \u0275\u0275conditionalCreate(17, GalleryComponent_Conditional_17_Template, 59, 24);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(18, GalleryComponent_Conditional_18_Template, 11, 5, "div", 13);
    }
    if (rf & 2) {
      \u0275\u0275advance(14);
      \u0275\u0275conditional(ctx.loading() ? 14 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 15 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.loading() && !ctx.error() && ctx.images().length === 0 ? 16 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.loading() && ctx.images().length > 0 ? 17 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.modalOpen() ? 18 : -1);
    }
  }, dependencies: [CommonModule, RouterModule, RouterLink], styles: ["\n\n.gallery-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  gap: 20px;\n  margin: 40px 0;\n}\n.gallery-item[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  border-radius: 10px;\n  cursor: pointer;\n  aspect-ratio: 4/3;\n}\n.gallery-item[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.3s ease;\n}\n.gallery-item[_ngcontent-%COMP%]:hover   img[_ngcontent-%COMP%] {\n  transform: scale(1.1);\n}\n.gallery-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background:\n    linear-gradient(\n      to top,\n      rgba(0, 0, 0, 0.8),\n      transparent);\n  padding: 20px 15px 10px;\n  opacity: 0;\n  transition: opacity 0.3s ease;\n}\n.gallery-item[_ngcontent-%COMP%]:hover   .gallery-overlay[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.gallery-title[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 0.95rem;\n  font-weight: 500;\n}\n.no-images[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 20px;\n  color: #aaa;\n}\n.pagination[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 10px;\n  margin: 40px 0;\n  flex-wrap: wrap;\n}\n.btn-page[_ngcontent-%COMP%] {\n  padding: 10px 15px;\n  background: rgba(26, 31, 58, 0.6);\n  color: #fff;\n  border: 1px solid #4fc3f7;\n  border-radius: 5px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.btn-page[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #4fc3f7;\n  color: #0a0e27;\n}\n.btn-page.active[_ngcontent-%COMP%] {\n  background: #4fc3f7;\n  color: #0a0e27;\n  font-weight: bold;\n}\n.btn-page[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.lightbox-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.95);\n  z-index: 9999;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n}\n.lightbox-container[_ngcontent-%COMP%] {\n  position: relative;\n  max-width: 1200px;\n  max-height: 90vh;\n  width: 100%;\n}\n.lightbox-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: auto;\n  max-height: 85vh;\n  object-fit: contain;\n  border-radius: 10px;\n}\n.lightbox-close[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -40px;\n  right: 0;\n  background: transparent;\n  border: none;\n  color: #fff;\n  font-size: 40px;\n  cursor: pointer;\n  padding: 10px;\n  line-height: 1;\n  transition: color 0.3s ease;\n}\n.lightbox-close[_ngcontent-%COMP%]:hover {\n  color: #4fc3f7;\n}\n.lightbox-prev[_ngcontent-%COMP%], \n.lightbox-next[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  background: rgba(255, 255, 255, 0.2);\n  border: none;\n  color: #fff;\n  font-size: 50px;\n  padding: 20px;\n  cursor: pointer;\n  border-radius: 5px;\n  transition: background 0.3s ease;\n}\n.lightbox-prev[_ngcontent-%COMP%]:hover, \n.lightbox-next[_ngcontent-%COMP%]:hover {\n  background: rgba(79, 195, 247, 0.5);\n}\n.lightbox-prev[_ngcontent-%COMP%] {\n  left: 10px;\n}\n.lightbox-next[_ngcontent-%COMP%] {\n  right: 10px;\n}\n.lightbox-caption[_ngcontent-%COMP%] {\n  color: #fff;\n  text-align: center;\n  margin-top: 15px;\n  font-size: 1.1rem;\n}\n@media (max-width: 768px) {\n  .gallery-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));\n  }\n  .lightbox-prev[_ngcontent-%COMP%], \n   .lightbox-next[_ngcontent-%COMP%] {\n    font-size: 30px;\n    padding: 15px;\n  }\n}\n/*# sourceMappingURL=gallery.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GalleryComponent, [{
    type: Component,
    args: [{ selector: "app-gallery", standalone: true, imports: [CommonModule, RouterModule], template: '<!-- Hero Section -->\n<section class="page-hero">\n    <!-- Video Background - Desktop -->\n    <video #heroVideoDesktop id="galleryVideo" class="hero-video hero-video-desktop" muted loop playsinline>\n        <source src="/assets/video/space-background.mp4" type="video/mp4">\n    </video>\n\n    <!-- Video Background - Mobile -->\n    <video #heroVideoMobile id="galleryVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>\n        <source src="/assets/video/space-background.mp4" type="video/mp4">\n    </video>\n\n    <div class="container">\n        <h1 class="hero-title" id="galleryTitle">Photo Gallery</h1>\n        <p class="hero-subtitle" id="gallerySubtitle">Conference Memories & Highlights</p>\n    </div>\n</section>\n\n<!-- Gallery Section -->\n<section class="gallery-section">\n    <div class="container">\n        @if (loading()) {\n            <div class="loading-spinner">\n                <div class="spinner"></div>\n                <p>Loading gallery...</p>\n            </div>\n        }\n\n        @if (error()) {\n            <div class="alert alert-error">\n                <p>{{ error() }}</p>\n            </div>\n        }\n\n        @if (!loading() && !error() && images().length === 0) {\n            <!-- Empty Gallery State -->\n            <div class="gallery-empty">\n                <div class="gallery-empty-icon">\u{1F4F8}</div>\n                <h2>No Photos Yet</h2>\n                <p>Gallery photos will be added soon. Check back later!</p>\n                <a routerLink="/home" class="btn btn-primary">Return Home</a>\n            </div>\n        }\n\n        @if (!loading() && images().length > 0) {\n            <!-- TOP PAGINATION CONTROLS -->\n            <div class="controls">\n                <div class="page-info">\n                    Page <span id="currentPage">{{ currentPage() }}</span> of <span id="totalPages">{{ getTotalPages() }}</span>\n                    (Photos <span id="startPhoto">{{ getStartPhoto() }}</span>-<span id="endPhoto">{{ getEndPhoto() }}</span> of <span id="totalPhotos">{{ totalImages() }}</span>)\n                </div>\n                <div class="nav-buttons">\n                    <button class="nav-button" id="firstButton" (click)="goToPage(1)" [disabled]="currentPage() === 1">\u23EE First</button>\n                    <button class="nav-button" id="prevButton" (click)="goToPage(currentPage() - 1)" [disabled]="currentPage() === 1">\u25C0 Previous</button>\n                    <input type="number"\n                           class="page-input"\n                           id="pageInput"\n                           [min]="1"\n                           [max]="getTotalPages()"\n                           [value]="currentPage()"\n                           (change)="handlePageInput($event)">\n                    <button class="nav-button" id="nextButton" (click)="goToPage(currentPage() + 1)" [disabled]="currentPage() === getTotalPages()">Next \u25B6</button>\n                    <button class="nav-button" id="lastButton" (click)="goToPage(getTotalPages())" [disabled]="currentPage() === getTotalPages()">Last \u23ED</button>\n                </div>\n            </div>\n\n            <!-- Gallery Grid -->\n            <div class="gallery-grid">\n                @for (image of images(); track image.id; let i = $index) {\n                    <div class="gallery-item">\n                        <img [src]="image.fullpath"\n                             [alt]="image.title"\n                             (click)="openModal(i)"\n                             loading="lazy">\n                        <div class="info">\n                            <div class="date">{{ image.title }}</div>\n                        </div>\n                    </div>\n                }\n            </div>\n\n            <!-- BOTTOM PAGINATION CONTROLS (IDENTICAL TO TOP) -->\n            <div class="controls">\n                <div class="page-info">\n                    Page <span id="currentPageBottom">{{ currentPage() }}</span> of <span id="totalPagesBottom">{{ getTotalPages() }}</span>\n                    (Photos <span id="startPhotoBottom">{{ getStartPhoto() }}</span>-<span id="endPhotoBottom">{{ getEndPhoto() }}</span> of <span id="totalPhotosBottom">{{ totalImages() }}</span>)\n                </div>\n                <div class="nav-buttons">\n                    <button class="nav-button" id="firstButtonBottom" (click)="goToPage(1)" [disabled]="currentPage() === 1">\u23EE First</button>\n                    <button class="nav-button" id="prevButtonBottom" (click)="goToPage(currentPage() - 1)" [disabled]="currentPage() === 1">\u25C0 Previous</button>\n                    <input type="number"\n                           class="page-input"\n                           id="pageInputBottom"\n                           [min]="1"\n                           [max]="getTotalPages()"\n                           [value]="currentPage()"\n                           (change)="handlePageInput($event)">\n                    <button class="nav-button" id="nextButtonBottom" (click)="goToPage(currentPage() + 1)" [disabled]="currentPage() === getTotalPages()">Next \u25B6</button>\n                    <button class="nav-button" id="lastButtonBottom" (click)="goToPage(getTotalPages())" [disabled]="currentPage() === getTotalPages()">Last \u23ED</button>\n                </div>\n            </div>\n        }\n    </div>\n</section>\n\n<!-- Lightbox Modal -->\n@if (modalOpen()) {\n    <div id="imageModal" class="modal" (click)="closeModal()">\n        <span class="close" (click)="closeModal()">&times;</span>\n        <img class="modal-content" id="modalImage" [src]="images()[modalIndex()]?.fullpath" (click)="$event.stopPropagation()">\n\n        <div class="modal-arrows">\n            <button class="arrow-left" id="prevModalBtn" (click)="previousModalImage($event)" [disabled]="modalIndex() === 0">\u25C0</button>\n            <button class="arrow-right" id="nextModalBtn" (click)="nextModalImage($event)" [disabled]="modalIndex() === images().length - 1">\u25B6</button>\n        </div>\n\n        <div class="modal-info" id="modalInfo">Photo {{ modalIndex() + 1 }} of {{ images().length }}</div>\n    </div>\n}\n', styles: ["/* src/app/components/gallery/gallery.component.css */\n.gallery-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  gap: 20px;\n  margin: 40px 0;\n}\n.gallery-item {\n  position: relative;\n  overflow: hidden;\n  border-radius: 10px;\n  cursor: pointer;\n  aspect-ratio: 4/3;\n}\n.gallery-item img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.3s ease;\n}\n.gallery-item:hover img {\n  transform: scale(1.1);\n}\n.gallery-overlay {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background:\n    linear-gradient(\n      to top,\n      rgba(0, 0, 0, 0.8),\n      transparent);\n  padding: 20px 15px 10px;\n  opacity: 0;\n  transition: opacity 0.3s ease;\n}\n.gallery-item:hover .gallery-overlay {\n  opacity: 1;\n}\n.gallery-title {\n  color: #fff;\n  font-size: 0.95rem;\n  font-weight: 500;\n}\n.no-images {\n  text-align: center;\n  padding: 60px 20px;\n  color: #aaa;\n}\n.pagination {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 10px;\n  margin: 40px 0;\n  flex-wrap: wrap;\n}\n.btn-page {\n  padding: 10px 15px;\n  background: rgba(26, 31, 58, 0.6);\n  color: #fff;\n  border: 1px solid #4fc3f7;\n  border-radius: 5px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.btn-page:hover:not(:disabled) {\n  background: #4fc3f7;\n  color: #0a0e27;\n}\n.btn-page.active {\n  background: #4fc3f7;\n  color: #0a0e27;\n  font-weight: bold;\n}\n.btn-page:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.lightbox-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.95);\n  z-index: 9999;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n}\n.lightbox-container {\n  position: relative;\n  max-width: 1200px;\n  max-height: 90vh;\n  width: 100%;\n}\n.lightbox-container img {\n  width: 100%;\n  height: auto;\n  max-height: 85vh;\n  object-fit: contain;\n  border-radius: 10px;\n}\n.lightbox-close {\n  position: absolute;\n  top: -40px;\n  right: 0;\n  background: transparent;\n  border: none;\n  color: #fff;\n  font-size: 40px;\n  cursor: pointer;\n  padding: 10px;\n  line-height: 1;\n  transition: color 0.3s ease;\n}\n.lightbox-close:hover {\n  color: #4fc3f7;\n}\n.lightbox-prev,\n.lightbox-next {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  background: rgba(255, 255, 255, 0.2);\n  border: none;\n  color: #fff;\n  font-size: 50px;\n  padding: 20px;\n  cursor: pointer;\n  border-radius: 5px;\n  transition: background 0.3s ease;\n}\n.lightbox-prev:hover,\n.lightbox-next:hover {\n  background: rgba(79, 195, 247, 0.5);\n}\n.lightbox-prev {\n  left: 10px;\n}\n.lightbox-next {\n  right: 10px;\n}\n.lightbox-caption {\n  color: #fff;\n  text-align: center;\n  margin-top: 15px;\n  font-size: 1.1rem;\n}\n@media (max-width: 768px) {\n  .gallery-grid {\n    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));\n  }\n  .lightbox-prev,\n  .lightbox-next {\n    font-size: 30px;\n    padding: 15px;\n  }\n}\n/*# sourceMappingURL=gallery.component.css.map */\n"] }]
  }], null, { heroVideoDesktop: [{
    type: ViewChild,
    args: ["heroVideoDesktop", { static: false }]
  }], heroVideoMobile: [{
    type: ViewChild,
    args: ["heroVideoMobile", { static: false }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GalleryComponent, { className: "GalleryComponent", filePath: "src/app/components/gallery/gallery.component.ts", lineNumber: 16 });
})();

// src/app/components/register/register.ts
var _c05 = ["heroVideoDesktop"];
var _c15 = ["heroVideoMobile"];
var Register = class _Register {
  audioService;
  heroVideoDesktop;
  heroVideoMobile;
  subscriptions = [];
  constructor(audioService) {
    this.audioService = audioService;
  }
  ngOnInit() {
    this.setupAudioSubscription();
  }
  ngAfterViewInit() {
    if (this.heroVideoDesktop?.nativeElement) {
      this.heroVideoDesktop.nativeElement.muted = true;
      this.heroVideoDesktop.nativeElement.volume = 0;
    }
    if (this.heroVideoMobile?.nativeElement) {
      this.heroVideoMobile.nativeElement.muted = true;
      this.heroVideoMobile.nativeElement.volume = 0;
    }
    this.controlVideoPlayback(this.audioService.isPlaying());
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  /**
   * Set up subscription to audio service to control video playback
   */
  setupAudioSubscription() {
    const playingSub = this.audioService.isPlaying$.subscribe((playing) => {
      this.controlVideoPlayback(playing);
    });
    this.subscriptions.push(playingSub);
  }
  /**
   * Control hero video playback
   */
  controlVideoPlayback(shouldPlay) {
    if (this.heroVideoDesktop && this.heroVideoDesktop.nativeElement) {
      if (shouldPlay) {
        this.heroVideoDesktop.nativeElement.play().catch((err) => {
          console.log("Video autoplay prevented:", err);
        });
      } else {
        this.heroVideoDesktop.nativeElement.pause();
      }
    }
    if (this.heroVideoMobile && this.heroVideoMobile.nativeElement) {
      if (shouldPlay) {
        this.heroVideoMobile.nativeElement.play().catch((err) => {
          console.log("Video autoplay prevented:", err);
        });
      } else {
        this.heroVideoMobile.nativeElement.pause();
      }
    }
  }
  static \u0275fac = function Register_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Register)(\u0275\u0275directiveInject(AudioService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Register, selectors: [["app-register"]], viewQuery: function Register_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c05, 5);
      \u0275\u0275viewQuery(_c15, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.heroVideoDesktop = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.heroVideoMobile = _t.first);
    }
  }, decls: 49, vars: 0, consts: [["heroVideoDesktop", ""], ["heroVideoMobile", ""], [1, "page-hero"], ["id", "registerVideo", "muted", "", "loop", "", "playsinline", "", 1, "hero-video", "hero-video-desktop"], ["src", "/assets/video/space-background.mp4", "type", "video/mp4"], ["id", "registerVideoMobile", "muted", "", "loop", "", "playsinline", "", 1, "hero-video", "hero-video-mobile"], [1, "container"], ["id", "registerTitle", 1, "hero-title"], ["id", "registerSubtitle", 1, "hero-subtitle"], [1, "coming-soon-section"], [1, "coming-soon-content"], [1, "coming-soon-icon"], ["width", "120", "height", "120", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z", "stroke", "#4fc3f7", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M16 2V6", "stroke", "#4fc3f7", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M8 2V6", "stroke", "#4fc3f7", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M3 10H21", "stroke", "#4fc3f7", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], [1, "coming-soon-text"], [1, "coming-soon-details"], [1, "detail-item"], [1, "cta-buttons"], ["routerLink", "/home", 1, "btn", "btn-primary"], ["routerLink", "/about", 1, "btn", "btn-secondary"]], template: function Register_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 2)(1, "video", 3, 0);
      \u0275\u0275element(3, "source", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "video", 5, 1);
      \u0275\u0275element(6, "source", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 6)(8, "h1", 7);
      \u0275\u0275text(9, "Conference Registration");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "p", 8);
      \u0275\u0275text(11, "Coming Soon!");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(12, "section", 9)(13, "div", 6)(14, "div", 10)(15, "div", 11);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(16, "svg", 12);
      \u0275\u0275element(17, "path", 13)(18, "path", 14)(19, "path", 15)(20, "path", 16);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(21, "h2");
      \u0275\u0275text(22, "Registration Coming Soon");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "p", 17);
      \u0275\u0275text(24, " Conference registration: ");
      \u0275\u0275elementStart(25, "strong");
      \u0275\u0275text(26, "January 5-23, 2026");
      \u0275\u0275elementEnd();
      \u0275\u0275text(27, ". We're excited to welcome student council members, leaders, and advisors to the PASC Region J Conference 2026! ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "div", 18)(29, "div", 19)(30, "h3");
      \u0275\u0275text(31, "Conference Date");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "p");
      \u0275\u0275text(33, "February 13, 2026");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(34, "div", 19)(35, "h3");
      \u0275\u0275text(36, "Registration Opens");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "p");
      \u0275\u0275text(38, "January 5-23, 2026");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "div", 19)(40, "h3");
      \u0275\u0275text(41, "Theme");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "p");
      \u0275\u0275text(43, "Navigating the Stars");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(44, "div", 20)(45, "a", 21);
      \u0275\u0275text(46, "Return Home");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "a", 22);
      \u0275\u0275text(48, "Learn More About PASC");
      \u0275\u0275elementEnd()()()()();
    }
  }, dependencies: [CommonModule, RouterModule, RouterLink], styles: ['\n\n.coming-soon-section[_ngcontent-%COMP%] {\n  padding: 80px 20px;\n  position: relative;\n  background:\n    linear-gradient(\n      135deg,\n      #0a0e27 0%,\n      #1a1f3a 100%);\n  min-height: calc(100vh - 400px);\n}\n.coming-soon-section[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-image: url(/assets/img/space-nebula.png);\n  background-size: cover;\n  background-position: center;\n  opacity: 0.25;\n  z-index: 0;\n}\n.coming-soon-section[_ngcontent-%COMP%]    > .container[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n.coming-soon-content[_ngcontent-%COMP%] {\n  max-width: 900px;\n  margin: 0 auto;\n  text-align: center;\n  color: #ffffff;\n}\n.coming-soon-icon[_ngcontent-%COMP%] {\n  margin: 0 auto 40px;\n  width: 120px;\n  height: 120px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(79, 195, 247, 0.1);\n  border-radius: 50%;\n  border: 3px solid rgba(79, 195, 247, 0.3);\n}\n.coming-soon-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  filter: drop-shadow(0 0 10px rgba(79, 195, 247, 0.5));\n}\n.coming-soon-content[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  color: #4fc3f7;\n  margin-bottom: 30px;\n  font-weight: 700;\n}\n.coming-soon-text[_ngcontent-%COMP%] {\n  font-size: 1.3rem;\n  line-height: 1.8;\n  color: #b0b8d4;\n  margin-bottom: 20px;\n}\n.coming-soon-subtext[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  line-height: 1.7;\n  color: #8892b0;\n  margin-bottom: 50px;\n}\n.coming-soon-details[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 30px;\n  margin: 50px 0;\n}\n.detail-item[_ngcontent-%COMP%] {\n  background: rgba(26, 31, 58, 0.6);\n  border: 2px solid rgba(79, 195, 247, 0.3);\n  border-radius: 15px;\n  padding: 30px 20px;\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n  transition: all 0.3s ease;\n}\n.detail-item[_ngcontent-%COMP%]:hover {\n  transform: translateY(-5px);\n  border-color: rgba(79, 195, 247, 0.6);\n  box-shadow: 0 15px 40px rgba(79, 195, 247, 0.2);\n}\n.detail-item[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n  font-size: 1.2rem;\n  margin-bottom: 10px;\n  font-weight: 600;\n}\n.detail-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #ffffff;\n  font-size: 1rem;\n  margin: 0;\n}\n.contact-info-box[_ngcontent-%COMP%] {\n  background: rgba(26, 31, 58, 0.6);\n  border: 2px solid rgba(79, 195, 247, 0.3);\n  border-radius: 15px;\n  padding: 40px;\n  margin: 50px 0;\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n}\n.contact-info-box[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n  font-size: 2rem;\n  margin-bottom: 30px;\n}\n.contact-methods[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 30px;\n  text-align: left;\n}\n.contact-method[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  color: #4fc3f7;\n  font-size: 1.1rem;\n  margin-bottom: 10px;\n}\n.contact-method[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #b0b8d4;\n  font-size: 1rem;\n  margin: 0;\n}\n.contact-method[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n  text-decoration: none;\n  transition: all 0.3s ease;\n}\n.contact-method[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  color: #818cf8;\n  text-decoration: underline;\n}\n.resources-preview[_ngcontent-%COMP%] {\n  margin: 50px 0;\n}\n.resources-preview[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n  font-size: 2rem;\n  margin-bottom: 30px;\n}\n.preview-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n  text-align: left;\n}\n.preview-item[_ngcontent-%COMP%] {\n  background: rgba(26, 31, 58, 0.6);\n  border: 2px solid rgba(79, 195, 247, 0.3);\n  border-radius: 10px;\n  padding: 25px;\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n  transition: all 0.3s ease;\n}\n.preview-item[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px);\n  border-color: rgba(79, 195, 247, 0.6);\n  box-shadow: 0 10px 30px rgba(79, 195, 247, 0.2);\n}\n.preview-item[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n  font-size: 1.2rem;\n  margin-bottom: 10px;\n}\n.preview-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #8892b0;\n  font-size: 0.95rem;\n  line-height: 1.6;\n  margin: 0;\n}\n.cta-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 20px;\n  justify-content: center;\n  flex-wrap: wrap;\n  margin-top: 50px;\n}\n@media (max-width: 768px) {\n  .coming-soon-content[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 2.2rem;\n  }\n  .coming-soon-text[_ngcontent-%COMP%] {\n    font-size: 1.1rem;\n  }\n  .coming-soon-details[_ngcontent-%COMP%], \n   .contact-methods[_ngcontent-%COMP%], \n   .preview-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .cta-buttons[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .cta-buttons[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n@media (max-width: 480px) {\n  .coming-soon-section[_ngcontent-%COMP%] {\n    padding: 40px 15px;\n  }\n  .coming-soon-content[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 1.8rem;\n  }\n  .contact-info-box[_ngcontent-%COMP%], \n   .detail-item[_ngcontent-%COMP%], \n   .preview-item[_ngcontent-%COMP%] {\n    padding: 20px;\n  }\n}\n/*# sourceMappingURL=register.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Register, [{
    type: Component,
    args: [{ selector: "app-register", standalone: true, imports: [CommonModule, RouterModule], template: `<!-- Hero Section -->
<section class="page-hero">
    <!-- Video Background - Desktop -->
    <video #heroVideoDesktop id="registerVideo" class="hero-video hero-video-desktop" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>

    <!-- Video Background - Mobile -->
    <video #heroVideoMobile id="registerVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>

    <div class="container">
        <h1 class="hero-title" id="registerTitle">Conference Registration</h1>
        <p class="hero-subtitle" id="registerSubtitle">Coming Soon!</p>
    </div>
</section>

<!-- Coming Soon Section -->
<section class="coming-soon-section">
    <div class="container">
        <div class="coming-soon-content">
            <div class="coming-soon-icon">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#4fc3f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 2V6" stroke="#4fc3f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 2V6" stroke="#4fc3f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 10H21" stroke="#4fc3f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>

            <h2>Registration Coming Soon</h2>

            <p class="coming-soon-text">
                Conference registration: <strong>January 5-23, 2026</strong>. We're excited to welcome student council members, leaders, and advisors to the PASC Region J Conference 2026!
            </p>


            <div class="coming-soon-details">
                <div class="detail-item">
                    <h3>Conference Date</h3>
                    <p>February 13, 2026</p>
                </div>

                <div class="detail-item">
                    <h3>Registration Opens</h3>
                    <p>January 5-23, 2026</p>
                </div>

                <div class="detail-item">
                    <h3>Theme</h3>
                    <p>Navigating the Stars</p>
                </div>
            </div>

            <div class="cta-buttons">
                <a routerLink="/home" class="btn btn-primary">Return Home</a>
                <a routerLink="/about" class="btn btn-secondary">Learn More About PASC</a>
            </div>
        </div>
    </div>
</section>
`, styles: ['/* src/app/components/register/register.css */\n.coming-soon-section {\n  padding: 80px 20px;\n  position: relative;\n  background:\n    linear-gradient(\n      135deg,\n      #0a0e27 0%,\n      #1a1f3a 100%);\n  min-height: calc(100vh - 400px);\n}\n.coming-soon-section::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-image: url(/assets/img/space-nebula.png);\n  background-size: cover;\n  background-position: center;\n  opacity: 0.25;\n  z-index: 0;\n}\n.coming-soon-section > .container {\n  position: relative;\n  z-index: 1;\n}\n.coming-soon-content {\n  max-width: 900px;\n  margin: 0 auto;\n  text-align: center;\n  color: #ffffff;\n}\n.coming-soon-icon {\n  margin: 0 auto 40px;\n  width: 120px;\n  height: 120px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(79, 195, 247, 0.1);\n  border-radius: 50%;\n  border: 3px solid rgba(79, 195, 247, 0.3);\n}\n.coming-soon-icon svg {\n  filter: drop-shadow(0 0 10px rgba(79, 195, 247, 0.5));\n}\n.coming-soon-content h2 {\n  font-size: 3rem;\n  color: #4fc3f7;\n  margin-bottom: 30px;\n  font-weight: 700;\n}\n.coming-soon-text {\n  font-size: 1.3rem;\n  line-height: 1.8;\n  color: #b0b8d4;\n  margin-bottom: 20px;\n}\n.coming-soon-subtext {\n  font-size: 1.1rem;\n  line-height: 1.7;\n  color: #8892b0;\n  margin-bottom: 50px;\n}\n.coming-soon-details {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 30px;\n  margin: 50px 0;\n}\n.detail-item {\n  background: rgba(26, 31, 58, 0.6);\n  border: 2px solid rgba(79, 195, 247, 0.3);\n  border-radius: 15px;\n  padding: 30px 20px;\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n  transition: all 0.3s ease;\n}\n.detail-item:hover {\n  transform: translateY(-5px);\n  border-color: rgba(79, 195, 247, 0.6);\n  box-shadow: 0 15px 40px rgba(79, 195, 247, 0.2);\n}\n.detail-item h3 {\n  color: #4fc3f7;\n  font-size: 1.2rem;\n  margin-bottom: 10px;\n  font-weight: 600;\n}\n.detail-item p {\n  color: #ffffff;\n  font-size: 1rem;\n  margin: 0;\n}\n.contact-info-box {\n  background: rgba(26, 31, 58, 0.6);\n  border: 2px solid rgba(79, 195, 247, 0.3);\n  border-radius: 15px;\n  padding: 40px;\n  margin: 50px 0;\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n}\n.contact-info-box h3 {\n  color: #4fc3f7;\n  font-size: 2rem;\n  margin-bottom: 30px;\n}\n.contact-methods {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 30px;\n  text-align: left;\n}\n.contact-method strong {\n  display: block;\n  color: #4fc3f7;\n  font-size: 1.1rem;\n  margin-bottom: 10px;\n}\n.contact-method p {\n  color: #b0b8d4;\n  font-size: 1rem;\n  margin: 0;\n}\n.contact-method a {\n  color: #4fc3f7;\n  text-decoration: none;\n  transition: all 0.3s ease;\n}\n.contact-method a:hover {\n  color: #818cf8;\n  text-decoration: underline;\n}\n.resources-preview {\n  margin: 50px 0;\n}\n.resources-preview h3 {\n  color: #4fc3f7;\n  font-size: 2rem;\n  margin-bottom: 30px;\n}\n.preview-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n  text-align: left;\n}\n.preview-item {\n  background: rgba(26, 31, 58, 0.6);\n  border: 2px solid rgba(79, 195, 247, 0.3);\n  border-radius: 10px;\n  padding: 25px;\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n  transition: all 0.3s ease;\n}\n.preview-item:hover {\n  transform: translateY(-3px);\n  border-color: rgba(79, 195, 247, 0.6);\n  box-shadow: 0 10px 30px rgba(79, 195, 247, 0.2);\n}\n.preview-item h4 {\n  color: #4fc3f7;\n  font-size: 1.2rem;\n  margin-bottom: 10px;\n}\n.preview-item p {\n  color: #8892b0;\n  font-size: 0.95rem;\n  line-height: 1.6;\n  margin: 0;\n}\n.cta-buttons {\n  display: flex;\n  gap: 20px;\n  justify-content: center;\n  flex-wrap: wrap;\n  margin-top: 50px;\n}\n@media (max-width: 768px) {\n  .coming-soon-content h2 {\n    font-size: 2.2rem;\n  }\n  .coming-soon-text {\n    font-size: 1.1rem;\n  }\n  .coming-soon-details,\n  .contact-methods,\n  .preview-grid {\n    grid-template-columns: 1fr;\n  }\n  .cta-buttons {\n    flex-direction: column;\n  }\n  .cta-buttons .btn {\n    width: 100%;\n  }\n}\n@media (max-width: 480px) {\n  .coming-soon-section {\n    padding: 40px 15px;\n  }\n  .coming-soon-content h2 {\n    font-size: 1.8rem;\n  }\n  .contact-info-box,\n  .detail-item,\n  .preview-item {\n    padding: 20px;\n  }\n}\n/*# sourceMappingURL=register.css.map */\n'] }]
  }], () => [{ type: AudioService }], { heroVideoDesktop: [{
    type: ViewChild,
    args: ["heroVideoDesktop", { static: false }]
  }], heroVideoMobile: [{
    type: ViewChild,
    args: ["heroVideoMobile", { static: false }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Register, { className: "Register", filePath: "src/app/components/register/register.ts", lineNumber: 14 });
})();

// src/app/components/workshops/workshops.component.ts
var _c06 = ["heroVideoDesktop"];
var _c16 = ["heroVideoMobile"];
var _forTrack03 = ($index, $item) => $item.id;
function WorkshopsComponent_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "div", 25);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Loading workshop forms...");
    \u0275\u0275elementEnd()();
  }
}
function WorkshopsComponent_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function WorkshopsComponent_Conditional_45_For_7_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const form_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(form_r4.formdescription);
  }
}
function WorkshopsComponent_Conditional_45_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 29)(1, "h2", 30)(2, "button", 31);
    \u0275\u0275listener("click", function WorkshopsComponent_Conditional_45_For_7_Template_button_click_2_listener() {
      const \u0275$index_95_r3 = \u0275\u0275restoreView(_r2).$index;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleForm(\u0275$index_95_r3));
    });
    \u0275\u0275elementStart(3, "div", 32)(4, "div", 33);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, WorkshopsComponent_Conditional_45_For_7_Conditional_6_Template, 2, 1, "div", 34);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "div", 35)(8, "div", 36);
    \u0275\u0275element(9, "div", 37);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const form_r4 = ctx.$implicit;
    const \u0275$index_95_r3 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("id", "heading" + form_r4.id);
    \u0275\u0275advance();
    \u0275\u0275classProp("collapsed", ctx_r0.activeFormIndex() !== \u0275$index_95_r3);
    \u0275\u0275attribute("data-target", "#collapse" + form_r4.id)("aria-expanded", ctx_r0.activeFormIndex() === \u0275$index_95_r3)("aria-controls", "collapse" + form_r4.id);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(form_r4.formname);
    \u0275\u0275advance();
    \u0275\u0275conditional(form_r4.formdescription && form_r4.formdescription.trim() ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("show", ctx_r0.activeFormIndex() === \u0275$index_95_r3);
    \u0275\u0275property("id", "collapse" + form_r4.id);
    \u0275\u0275attribute("aria-labelledby", "heading" + form_r4.id);
    \u0275\u0275advance(2);
    \u0275\u0275property("innerHTML", form_r4.sanitizedEmbedCode, \u0275\u0275sanitizeHtml);
  }
}
function WorkshopsComponent_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "h2");
    \u0275\u0275text(2, "Conference Forms");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 27);
    \u0275\u0275text(4, "Select a form below to begin your submission.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 28);
    \u0275\u0275repeaterCreate(6, WorkshopsComponent_Conditional_45_For_7_Template, 10, 13, "div", 29, _forTrack03);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r0.forms());
  }
}
function WorkshopsComponent_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 38);
    \u0275\u0275text(2, "\u{1F4CB}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2");
    \u0275\u0275text(4, "Applications Opening Soon");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "Workshop presenter applications are not currently open. Please check back soon or contact us for more information.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "a", 39);
    \u0275\u0275text(8, "Return Home");
    \u0275\u0275elementEnd()();
  }
}
var WorkshopsComponent = class _WorkshopsComponent {
  heroVideoDesktop;
  heroVideoMobile;
  apiService = inject(ApiService);
  audioService = inject(AudioService);
  sanitizer = inject(DomSanitizer);
  forms = signal([], ...ngDevMode ? [{ debugName: "forms" }] : []);
  pageContent = signal(null, ...ngDevMode ? [{ debugName: "pageContent" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  activeFormIndex = signal(null, ...ngDevMode ? [{ debugName: "activeFormIndex" }] : []);
  subscriptions = [];
  ngOnInit() {
    this.loadPageContent();
    this.loadWorkshopForms();
    this.setupAudioSubscription();
  }
  ngAfterViewInit() {
    if (this.heroVideoDesktop?.nativeElement) {
      this.heroVideoDesktop.nativeElement.muted = true;
      this.heroVideoDesktop.nativeElement.volume = 0;
    }
    if (this.heroVideoMobile?.nativeElement) {
      this.heroVideoMobile.nativeElement.muted = true;
      this.heroVideoMobile.nativeElement.volume = 0;
    }
    this.controlVideoPlayback(this.audioService.isPlaying());
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  setupAudioSubscription() {
    const playingSub = this.audioService.isPlaying$.subscribe((playing) => {
      this.controlVideoPlayback(playing);
    });
    this.subscriptions.push(playingSub);
  }
  controlVideoPlayback(shouldPlay) {
    [this.heroVideoDesktop, this.heroVideoMobile].forEach((videoRef) => {
      if (videoRef && videoRef.nativeElement) {
        if (shouldPlay) {
          videoRef.nativeElement.play().catch(() => {
          });
        } else {
          videoRef.nativeElement.pause();
        }
      }
    });
  }
  loadPageContent() {
    this.apiService.getPageContent("workshops").subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.pageContent.set(response.data);
        }
      },
      error: (err) => {
        console.error("Error loading page content:", err);
      }
    });
  }
  loadWorkshopForms() {
    this.loading.set(true);
    this.apiService.getWorkshopForms("Workshops").subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const formsWithSanitized = response.data.map((form) => __spreadProps(__spreadValues({}, form), {
            sanitizedEmbedCode: this.sanitizer.bypassSecurityTrustHtml(form.embedcode)
          }));
          this.forms.set(formsWithSanitized);
        } else {
          this.error.set("Failed to load workshop forms");
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Error loading workshop forms:", err);
        this.error.set("Failed to load workshop forms");
        this.loading.set(false);
      }
    });
  }
  toggleForm(index) {
    this.activeFormIndex.set(this.activeFormIndex() === index ? null : index);
  }
  static \u0275fac = function WorkshopsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WorkshopsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WorkshopsComponent, selectors: [["app-workshops"]], viewQuery: function WorkshopsComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c06, 5);
      \u0275\u0275viewQuery(_c16, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.heroVideoDesktop = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.heroVideoMobile = _t.first);
    }
  }, decls: 78, vars: 4, consts: [["heroVideoDesktop", ""], ["heroVideoMobile", ""], [1, "page-hero"], ["id", "workshopsVideo", "muted", "", "loop", "", "playsinline", "", 1, "hero-video", "hero-video-desktop"], ["src", "/assets/video/space-background.mp4", "type", "video/mp4"], ["id", "workshopsVideoMobile", "muted", "", "loop", "", "playsinline", "", 1, "hero-video", "hero-video-mobile"], [1, "container"], ["id", "workshopsTitle", 1, "hero-title"], ["id", "workshopsSubtitle", 1, "hero-subtitle"], [1, "workshop-intro"], [1, "intro-content"], [1, "workshop-highlights"], [1, "highlight-item"], [1, "highlight-icon"], [1, "form-section"], [1, "loading-spinner"], [1, "alert", "alert-error"], [1, "no-form-message"], [1, "guidelines-section"], [1, "guidelines-grid"], [1, "guideline-card"], [1, "cta-section"], [1, "cta-buttons"], ["routerLink", "/about", 1, "btn", "btn-primary"], ["routerLink", "/home", 1, "btn", "btn-secondary"], [1, "spinner"], [1, "form-intro"], [1, "form-description"], ["id", "workshopFormsAccordion", 1, "accordion"], [1, "accordion-item"], [1, "accordion-header", 3, "id"], ["type", "button", 1, "accordion-button", 3, "click"], [1, "accordion-header-content"], [1, "form-title"], [1, "form-description-preview"], ["data-bs-parent", "#workshopFormsAccordion", 1, "accordion-collapse", "collapse", 3, "id"], [1, "accordion-body"], [1, "form-container", 3, "innerHTML"], [1, "message-icon"], ["routerLink", "/home", 1, "btn", "btn-primary"]], template: function WorkshopsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 2)(1, "video", 3, 0);
      \u0275\u0275element(3, "source", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "video", 5, 1);
      \u0275\u0275element(6, "source", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 6)(8, "h1", 7);
      \u0275\u0275text(9, "Workshop Application");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "p", 8);
      \u0275\u0275text(11, "Share Your Leadership Expertise");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(12, "section", 9)(13, "div", 6)(14, "div", 10)(15, "h2");
      \u0275\u0275text(16, "Present at Our Conference");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "p");
      \u0275\u0275text(18, "We're looking for passionate leaders to share their knowledge and experience at the PASC Region J Conference 2026. Whether you're a student leader, advisor, or expert in student leadership, we want to hear from you!");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 11)(20, "div", 12)(21, "div", 13);
      \u0275\u0275text(22, "\u{1F3AF}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "h3");
      \u0275\u0275text(24, "Share Your Expertise");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "p");
      \u0275\u0275text(26, "Lead a workshop on topics that matter to student leaders and advisors.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "div", 12)(28, "div", 13);
      \u0275\u0275text(29, "\u{1F91D}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "h3");
      \u0275\u0275text(31, "Connect & Network");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "p");
      \u0275\u0275text(33, "Meet fellow leaders and make lasting connections in the student council community.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(34, "div", 12)(35, "div", 13);
      \u0275\u0275text(36, "\u{1F31F}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "h3");
      \u0275\u0275text(38, "Make an Impact");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "p");
      \u0275\u0275text(40, "Help shape the next generation of student leaders across Region J.");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(41, "section", 14)(42, "div", 6);
      \u0275\u0275conditionalCreate(43, WorkshopsComponent_Conditional_43_Template, 4, 0, "div", 15);
      \u0275\u0275conditionalCreate(44, WorkshopsComponent_Conditional_44_Template, 3, 1, "div", 16);
      \u0275\u0275conditionalCreate(45, WorkshopsComponent_Conditional_45_Template, 8, 0);
      \u0275\u0275conditionalCreate(46, WorkshopsComponent_Conditional_46_Template, 9, 0, "div", 17);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(47, "section", 18)(48, "div", 6)(49, "h2");
      \u0275\u0275text(50, "Workshop Guidelines");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "div", 19)(52, "div", 20)(53, "h3");
      \u0275\u0275text(54, "\u{1F4DA} Workshop Topics");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "p");
      \u0275\u0275text(56, "Leadership skills, team building, communication, civic engagement, project planning, creativity, and student council best practices.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(57, "div", 20)(58, "h3");
      \u0275\u0275text(59, "\u23F1\uFE0F Session Length");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "p");
      \u0275\u0275text(61, "Workshops are 30 minutes. Plan your content to fit within this time frame for maximum engagement.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(62, "div", 20)(63, "h3");
      \u0275\u0275text(64, "\u{1F465} Target Audience");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(65, "p");
      \u0275\u0275text(66, "Workshops can be designed for students, advisors, or all attendees. We encourage interactive and engaging sessions.");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(67, "section", 21)(68, "div", 6)(69, "h2");
      \u0275\u0275text(70, "Questions About Presenting?");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "p");
      \u0275\u0275text(72, "We're here to help! Reach out if you have any questions about the application process.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(73, "div", 22)(74, "a", 23);
      \u0275\u0275text(75, "Learn More About PASC Region J");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(76, "a", 24);
      \u0275\u0275text(77, "Return Home");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(43);
      \u0275\u0275conditional(ctx.loading() ? 43 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 44 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.loading() && !ctx.error() && ctx.forms().length > 0 ? 45 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.loading() && !ctx.error() && ctx.forms().length === 0 ? 46 : -1);
    }
  }, dependencies: [CommonModule, RouterModule, RouterLink], styles: ['\n\n.workshops-intro[_ngcontent-%COMP%] {\n  margin: 40px auto;\n  max-width: 900px;\n}\n.workshops-intro[_ngcontent-%COMP%]   .lead[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  line-height: 1.8;\n  color: #e0e0e0;\n  margin-bottom: 30px;\n  text-align: center;\n}\n.requirements-card[_ngcontent-%COMP%] {\n  background: rgba(26, 31, 58, 0.6);\n  padding: 30px;\n  border-radius: 10px;\n  border-left: 4px solid #4fc3f7;\n  margin: 30px 0;\n}\n.requirements-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n  margin-bottom: 20px;\n}\n.requirements-card[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n}\n.requirements-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  padding: 10px 0 10px 30px;\n  position: relative;\n  color: #ddd;\n}\n.requirements-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]::before {\n  content: "\\2713";\n  position: absolute;\n  left: 0;\n  color: #4fc3f7;\n  font-weight: bold;\n  font-size: 1.2rem;\n}\n.no-forms[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 20px;\n  color: #aaa;\n}\n.forms-accordion[_ngcontent-%COMP%] {\n  margin: 40px 0;\n  max-width: 1000px;\n  margin-left: auto;\n  margin-right: auto;\n}\n.accordion-item[_ngcontent-%COMP%] {\n  margin-bottom: 15px;\n  background: rgba(26, 31, 58, 0.4);\n  border-radius: 10px;\n  overflow: hidden;\n}\n.accordion-header[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 20px 25px;\n  background: rgba(26, 31, 58, 0.6);\n  border-radius: 10px;\n  color: #fff;\n  font-size: 1.1rem;\n  font-weight: 500;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.accordion-header[_ngcontent-%COMP%]:hover {\n  background: rgba(79, 195, 247, 0.2);\n}\n.accordion-header.active[_ngcontent-%COMP%] {\n  background: #4fc3f7;\n  color: #0a0e27;\n  border-radius: 10px 10px 0 0;\n}\n.accordion-icon[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: bold;\n}\n.accordion-content[_ngcontent-%COMP%] {\n  padding: 30px 25px;\n  animation: _ngcontent-%COMP%_slideDown 0.3s ease-out;\n}\n@keyframes _ngcontent-%COMP%_slideDown {\n  from {\n    opacity: 0;\n    max-height: 0;\n  }\n  to {\n    opacity: 1;\n    max-height: 2000px;\n  }\n}\n.form-description[_ngcontent-%COMP%] {\n  color: #e0e0e0;\n  margin-bottom: 25px;\n  font-size: 1rem;\n  line-height: 1.6;\n}\n.form-embed[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 8px;\n  padding: 10px;\n  min-height: 400px;\n}\n.form-embed[_ngcontent-%COMP%]     iframe {\n  width: 100%;\n  min-height: 600px;\n  border: none;\n}\n.cta-section[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 80px 20px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(10, 14, 39, 0.8) 0%,\n      rgba(26, 31, 58, 0.8) 100%);\n}\n.cta-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 2.2rem;\n  margin-bottom: 15px;\n}\n.cta-section[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  margin-bottom: 25px;\n  color: #b0b0b0;\n}\n.accordion-header-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  text-align: left;\n  width: 100%;\n}\n.form-title[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #ffffff;\n  line-height: 1.3;\n}\n.form-description-preview[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 400;\n  color: #b0b8d4;\n  line-height: 1.4;\n  opacity: 0.9;\n}\n.accordion-button[_ngcontent-%COMP%] {\n  padding: 1.25rem 1.5rem;\n}\n.accordion-button[_ngcontent-%COMP%]:not(.collapsed)   .form-title[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n}\n.accordion-button[_ngcontent-%COMP%]:not(.collapsed)   .form-description-preview[_ngcontent-%COMP%] {\n  color: #8ab4d4;\n}\n@media (max-width: 768px) {\n  .form-title[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n  .form-description-preview[_ngcontent-%COMP%] {\n    font-size: 0.85rem;\n  }\n  .accordion-button[_ngcontent-%COMP%] {\n    padding: 1rem 1.25rem;\n  }\n}\n/*# sourceMappingURL=workshops.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WorkshopsComponent, [{
    type: Component,
    args: [{ selector: "app-workshops", standalone: true, imports: [CommonModule, RouterModule], template: `<!-- Hero Section -->
<section class="page-hero">
    <!-- Video Background - Desktop -->
    <video #heroVideoDesktop id="workshopsVideo" class="hero-video hero-video-desktop" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>

    <!-- Video Background - Mobile -->
    <video #heroVideoMobile id="workshopsVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>

    <div class="container">
        <h1 class="hero-title" id="workshopsTitle">Workshop Application</h1>
        <p class="hero-subtitle" id="workshopsSubtitle">Share Your Leadership Expertise</p>
    </div>
</section>

<!-- Workshop Info Section -->
<section class="workshop-intro">
    <div class="container">
        <div class="intro-content">
            <h2>Present at Our Conference</h2>
            <p>We're looking for passionate leaders to share their knowledge and experience at the PASC Region J Conference 2026. Whether you're a student leader, advisor, or expert in student leadership, we want to hear from you!</p>

            <div class="workshop-highlights">
                <div class="highlight-item">
                    <div class="highlight-icon">\u{1F3AF}</div>
                    <h3>Share Your Expertise</h3>
                    <p>Lead a workshop on topics that matter to student leaders and advisors.</p>
                </div>

                <div class="highlight-item">
                    <div class="highlight-icon">\u{1F91D}</div>
                    <h3>Connect & Network</h3>
                    <p>Meet fellow leaders and make lasting connections in the student council community.</p>
                </div>

                <div class="highlight-item">
                    <div class="highlight-icon">\u{1F31F}</div>
                    <h3>Make an Impact</h3>
                    <p>Help shape the next generation of student leaders across Region J.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Application Form Section -->
<section class="form-section">
    <div class="container">
        @if (loading()) {
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading workshop forms...</p>
            </div>
        }

        @if (error()) {
            <div class="alert alert-error">
                <p>{{ error() }}</p>
            </div>
        }

        @if (!loading() && !error() && forms().length > 0) {
            <div class="form-intro">
                <h2>Conference Forms</h2>
                <p class="form-description">Select a form below to begin your submission.</p>
            </div>

            <!-- Bootstrap Accordion for Multiple Forms -->
            <div class="accordion" id="workshopFormsAccordion">
                @for (form of forms(); track form.id; let i = $index) {
                    <div class="accordion-item">
                        <h2 class="accordion-header" [id]="'heading' + form.id">
                            <button
                                class="accordion-button"
                                [class.collapsed]="activeFormIndex() !== i"
                                type="button"
                                [attr.data-target]="'#collapse' + form.id"
                                [attr.aria-expanded]="activeFormIndex() === i"
                                [attr.aria-controls]="'collapse' + form.id"
                                (click)="toggleForm(i)">
                                <div class="accordion-header-content">
                                    <div class="form-title">{{ form.formname }}</div>
                                    @if (form.formdescription && form.formdescription.trim()) {
                                        <div class="form-description-preview">{{ form.formdescription }}</div>
                                    }
                                </div>
                            </button>
                        </h2>
                        <div
                            [id]="'collapse' + form.id"
                            class="accordion-collapse collapse"
                            [class.show]="activeFormIndex() === i"
                            [attr.aria-labelledby]="'heading' + form.id"
                            data-bs-parent="#workshopFormsAccordion">
                            <div class="accordion-body">
                                <div class="form-container" [innerHTML]="form.sanitizedEmbedCode"></div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        }

        @if (!loading() && !error() && forms().length === 0) {
            <!-- Fallback if no form is active -->
            <div class="no-form-message">
                <div class="message-icon">\u{1F4CB}</div>
                <h2>Applications Opening Soon</h2>
                <p>Workshop presenter applications are not currently open. Please check back soon or contact us for more information.</p>
                <a routerLink="/home" class="btn btn-primary">Return Home</a>
            </div>
        }
    </div>
</section>

<!-- Workshop Guidelines Section -->
<section class="guidelines-section">
    <div class="container">
        <h2>Workshop Guidelines</h2>

        <div class="guidelines-grid">
            <div class="guideline-card">
                <h3>\u{1F4DA} Workshop Topics</h3>
                <p>Leadership skills, team building, communication, civic engagement, project planning, creativity, and student council best practices.</p>
            </div>

            <div class="guideline-card">
                <h3>\u23F1\uFE0F Session Length</h3>
                <p>Workshops are 30 minutes. Plan your content to fit within this time frame for maximum engagement.</p>
            </div>

            <div class="guideline-card">
                <h3>\u{1F465} Target Audience</h3>
                <p>Workshops can be designed for students, advisors, or all attendees. We encourage interactive and engaging sessions.</p>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
    <div class="container">
        <h2>Questions About Presenting?</h2>
        <p>We're here to help! Reach out if you have any questions about the application process.</p>
        <div class="cta-buttons">
            <a routerLink="/about" class="btn btn-primary">Learn More About PASC Region J</a>
            <a routerLink="/home" class="btn btn-secondary">Return Home</a>
        </div>
    </div>
</section>
`, styles: ['/* src/app/components/workshops/workshops.component.css */\n.workshops-intro {\n  margin: 40px auto;\n  max-width: 900px;\n}\n.workshops-intro .lead {\n  font-size: 1.2rem;\n  line-height: 1.8;\n  color: #e0e0e0;\n  margin-bottom: 30px;\n  text-align: center;\n}\n.requirements-card {\n  background: rgba(26, 31, 58, 0.6);\n  padding: 30px;\n  border-radius: 10px;\n  border-left: 4px solid #4fc3f7;\n  margin: 30px 0;\n}\n.requirements-card h3 {\n  color: #4fc3f7;\n  margin-bottom: 20px;\n}\n.requirements-card ul {\n  list-style: none;\n  padding: 0;\n}\n.requirements-card li {\n  padding: 10px 0 10px 30px;\n  position: relative;\n  color: #ddd;\n}\n.requirements-card li::before {\n  content: "\\2713";\n  position: absolute;\n  left: 0;\n  color: #4fc3f7;\n  font-weight: bold;\n  font-size: 1.2rem;\n}\n.no-forms {\n  text-align: center;\n  padding: 60px 20px;\n  color: #aaa;\n}\n.forms-accordion {\n  margin: 40px 0;\n  max-width: 1000px;\n  margin-left: auto;\n  margin-right: auto;\n}\n.accordion-item {\n  margin-bottom: 15px;\n  background: rgba(26, 31, 58, 0.4);\n  border-radius: 10px;\n  overflow: hidden;\n}\n.accordion-header {\n  width: 100%;\n  padding: 20px 25px;\n  background: rgba(26, 31, 58, 0.6);\n  border-radius: 10px;\n  color: #fff;\n  font-size: 1.1rem;\n  font-weight: 500;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.accordion-header:hover {\n  background: rgba(79, 195, 247, 0.2);\n}\n.accordion-header.active {\n  background: #4fc3f7;\n  color: #0a0e27;\n  border-radius: 10px 10px 0 0;\n}\n.accordion-icon {\n  font-size: 1.5rem;\n  font-weight: bold;\n}\n.accordion-content {\n  padding: 30px 25px;\n  animation: slideDown 0.3s ease-out;\n}\n@keyframes slideDown {\n  from {\n    opacity: 0;\n    max-height: 0;\n  }\n  to {\n    opacity: 1;\n    max-height: 2000px;\n  }\n}\n.form-description {\n  color: #e0e0e0;\n  margin-bottom: 25px;\n  font-size: 1rem;\n  line-height: 1.6;\n}\n.form-embed {\n  background: #fff;\n  border-radius: 8px;\n  padding: 10px;\n  min-height: 400px;\n}\n.form-embed ::ng-deep iframe {\n  width: 100%;\n  min-height: 600px;\n  border: none;\n}\n.cta-section {\n  text-align: center;\n  padding: 80px 20px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(10, 14, 39, 0.8) 0%,\n      rgba(26, 31, 58, 0.8) 100%);\n}\n.cta-section h2 {\n  font-size: 2.2rem;\n  margin-bottom: 15px;\n}\n.cta-section p {\n  font-size: 1.1rem;\n  margin-bottom: 25px;\n  color: #b0b0b0;\n}\n.accordion-header-content {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  text-align: left;\n  width: 100%;\n}\n.form-title {\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #ffffff;\n  line-height: 1.3;\n}\n.form-description-preview {\n  font-size: 0.9rem;\n  font-weight: 400;\n  color: #b0b8d4;\n  line-height: 1.4;\n  opacity: 0.9;\n}\n.accordion-button {\n  padding: 1.25rem 1.5rem;\n}\n.accordion-button:not(.collapsed) .form-title {\n  color: #4fc3f7;\n}\n.accordion-button:not(.collapsed) .form-description-preview {\n  color: #8ab4d4;\n}\n@media (max-width: 768px) {\n  .form-title {\n    font-size: 1rem;\n  }\n  .form-description-preview {\n    font-size: 0.85rem;\n  }\n  .accordion-button {\n    padding: 1rem 1.25rem;\n  }\n}\n/*# sourceMappingURL=workshops.component.css.map */\n'] }]
  }], null, { heroVideoDesktop: [{
    type: ViewChild,
    args: ["heroVideoDesktop", { static: false }]
  }], heroVideoMobile: [{
    type: ViewChild,
    args: ["heroVideoMobile", { static: false }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WorkshopsComponent, { className: "WorkshopsComponent", filePath: "src/app/components/workshops/workshops.component.ts", lineNumber: 21 });
})();

// src/app/components/resources/resources.component.ts
var _c07 = ["heroVideoDesktop"];
var _c17 = ["heroVideoMobile"];
var _c22 = ["anthemAudio"];
var _c3 = ["anthemSectionVideo"];
var _c4 = ["anthemPlayerVideo"];
var _c5 = ["cinemaSpaceBg"];
var _c6 = ["progressBar"];
var _forTrack04 = ($index, $item) => $item.id;
function ResourcesComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 18);
    \u0275\u0275domElement(1, "div", 62);
    \u0275\u0275domElementStart(2, "p");
    \u0275\u0275text(3, "Loading resources...");
    \u0275\u0275domElementEnd()();
  }
}
function ResourcesComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 19)(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function ResourcesComponent_Conditional_21_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 65);
    \u0275\u0275text(1, "\u{1F4C4}");
    \u0275\u0275domElementEnd();
  }
}
function ResourcesComponent_Conditional_21_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 66);
    \u0275\u0275text(1, "\u{1F4D8}");
    \u0275\u0275domElementEnd();
  }
}
function ResourcesComponent_Conditional_21_For_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 67);
    \u0275\u0275text(1, "\u{1F4CA}");
    \u0275\u0275domElementEnd();
  }
}
function ResourcesComponent_Conditional_21_For_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 68);
    \u0275\u0275text(1, "\u{1F4D9}");
    \u0275\u0275domElementEnd();
  }
}
function ResourcesComponent_Conditional_21_For_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 69);
    \u0275\u0275text(1, "\u{1F4C3}");
    \u0275\u0275domElementEnd();
  }
}
function ResourcesComponent_Conditional_21_For_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 71);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const doc_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(doc_r3.description);
  }
}
function ResourcesComponent_Conditional_21_For_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 72);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const doc_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(doc_r3.documentType);
  }
}
function ResourcesComponent_Conditional_21_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 63)(1, "div", 64);
    \u0275\u0275conditionalCreate(2, ResourcesComponent_Conditional_21_For_2_Conditional_2_Template, 2, 0, "span", 65)(3, ResourcesComponent_Conditional_21_For_2_Conditional_3_Template, 2, 0, "span", 66)(4, ResourcesComponent_Conditional_21_For_2_Conditional_4_Template, 2, 0, "span", 67)(5, ResourcesComponent_Conditional_21_For_2_Conditional_5_Template, 2, 0, "span", 68)(6, ResourcesComponent_Conditional_21_For_2_Conditional_6_Template, 2, 0, "span", 69);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(7, "h3", 70);
    \u0275\u0275text(8);
    \u0275\u0275domElementEnd();
    \u0275\u0275conditionalCreate(9, ResourcesComponent_Conditional_21_For_2_Conditional_9_Template, 2, 1, "p", 71);
    \u0275\u0275conditionalCreate(10, ResourcesComponent_Conditional_21_For_2_Conditional_10_Template, 2, 1, "span", 72);
    \u0275\u0275domElementStart(11, "p", 73);
    \u0275\u0275text(12);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(13, "a", 74);
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(14, "svg", 75);
    \u0275\u0275domElement(15, "path", 58)(16, "polyline", 59)(17, "line", 60);
    \u0275\u0275domElementEnd();
    \u0275\u0275text(18, " Download ");
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const doc_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275conditional(doc_r3.fileExtension === ".pdf" ? 2 : doc_r3.fileExtension === ".doc" || doc_r3.fileExtension === ".docx" ? 3 : doc_r3.fileExtension === ".xls" || doc_r3.fileExtension === ".xlsx" ? 4 : doc_r3.fileExtension === ".ppt" || doc_r3.fileExtension === ".pptx" ? 5 : 6);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(doc_r3.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(doc_r3.description ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(doc_r3.documentType ? 10 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(doc_r3.fileSizeFormatted);
    \u0275\u0275advance();
    \u0275\u0275domProperty("href", doc_r3.downloadPath, \u0275\u0275sanitizeUrl)("download", doc_r3.originalFilename);
  }
}
function ResourcesComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 20);
    \u0275\u0275repeaterCreate(1, ResourcesComponent_Conditional_21_For_2_Template, 19, 7, "div", 63, _forTrack04);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.documents());
  }
}
function ResourcesComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 21)(1, "p");
    \u0275\u0275text(2, "No resources available yet. Check back soon!");
    \u0275\u0275domElementEnd()();
  }
}
var ResourcesComponent = class _ResourcesComponent {
  heroVideoDesktop;
  heroVideoMobile;
  anthemAudio;
  anthemSectionVideo;
  anthemPlayerVideo;
  cinemaSpaceBg;
  progressBar;
  apiService = inject(ApiService);
  audioService = inject(AudioService);
  documents = signal([], ...ngDevMode ? [{ debugName: "documents" }] : []);
  pageContent = signal(null, ...ngDevMode ? [{ debugName: "pageContent" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  // Anthem player state
  isAnthemPlaying = signal(false, ...ngDevMode ? [{ debugName: "isAnthemPlaying" }] : []);
  anthemProgress = signal(0, ...ngDevMode ? [{ debugName: "anthemProgress" }] : []);
  anthemCurrentTime = signal(0, ...ngDevMode ? [{ debugName: "anthemCurrentTime" }] : []);
  anthemDuration = signal(0, ...ngDevMode ? [{ debugName: "anthemDuration" }] : []);
  subscriptions = [];
  ngOnInit() {
    this.loadPageContent();
    this.loadDocuments();
    this.setupAudioSubscription();
  }
  ngAfterViewInit() {
    if (this.heroVideoDesktop?.nativeElement) {
      this.heroVideoDesktop.nativeElement.muted = true;
      this.heroVideoDesktop.nativeElement.volume = 0;
    }
    if (this.heroVideoMobile?.nativeElement) {
      this.heroVideoMobile.nativeElement.muted = true;
      this.heroVideoMobile.nativeElement.volume = 0;
    }
    if (this.cinemaSpaceBg?.nativeElement) {
      this.cinemaSpaceBg.nativeElement.muted = true;
      this.cinemaSpaceBg.nativeElement.volume = 0;
    }
    if (this.anthemSectionVideo?.nativeElement) {
      this.anthemSectionVideo.nativeElement.muted = true;
      this.anthemSectionVideo.nativeElement.volume = 0;
    }
    if (this.anthemPlayerVideo?.nativeElement) {
      this.anthemPlayerVideo.nativeElement.muted = true;
      this.anthemPlayerVideo.nativeElement.volume = 0;
    }
    this.controlVideoPlayback(this.audioService.isPlaying());
    this.setupAnthemPlayerListeners();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    if (this.anthemAudio && !this.anthemAudio.nativeElement.paused) {
      this.anthemAudio.nativeElement.pause();
    }
  }
  setupAudioSubscription() {
    const playingSub = this.audioService.isPlaying$.subscribe((playing) => {
      this.controlVideoPlayback(playing);
      if (playing && this.anthemAudio && !this.anthemAudio.nativeElement.paused) {
        this.anthemAudio.nativeElement.pause();
      }
    });
    this.subscriptions.push(playingSub);
  }
  controlVideoPlayback(shouldPlay) {
    [this.heroVideoDesktop, this.heroVideoMobile].forEach((videoRef) => {
      if (videoRef && videoRef.nativeElement) {
        if (shouldPlay) {
          videoRef.nativeElement.play().catch(() => {
          });
        } else {
          videoRef.nativeElement.pause();
        }
      }
    });
  }
  setupAnthemPlayerListeners() {
    if (!this.anthemAudio)
      return;
    const audio = this.anthemAudio.nativeElement;
    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        const progress = audio.currentTime / audio.duration * 100;
        this.anthemProgress.set(progress);
        this.anthemCurrentTime.set(audio.currentTime);
      }
    });
    audio.addEventListener("loadedmetadata", () => {
      this.anthemDuration.set(audio.duration);
    });
    audio.addEventListener("play", () => {
      this.isAnthemPlaying.set(true);
      if (this.audioService.isPlaying()) {
        this.audioService.pause();
      }
      if (this.anthemSectionVideo) {
        this.anthemSectionVideo.nativeElement.play().catch(() => {
        });
      }
      if (this.anthemPlayerVideo) {
        this.anthemPlayerVideo.nativeElement.play().catch(() => {
        });
      }
    });
    audio.addEventListener("pause", () => {
      this.isAnthemPlaying.set(false);
      if (this.anthemSectionVideo) {
        this.anthemSectionVideo.nativeElement.pause();
      }
      if (this.anthemPlayerVideo) {
        this.anthemPlayerVideo.nativeElement.pause();
      }
    });
    audio.addEventListener("ended", () => {
      this.isAnthemPlaying.set(false);
      this.anthemProgress.set(0);
    });
  }
  toggleAnthemPlayback() {
    if (!this.anthemAudio)
      return;
    const audio = this.anthemAudio.nativeElement;
    if (audio.paused) {
      audio.play().catch((err) => console.log("Anthem audio play failed:", err));
    } else {
      audio.pause();
    }
  }
  seekAnthemAudio(event) {
    if (!this.anthemAudio || !this.progressBar)
      return;
    const audio = this.anthemAudio.nativeElement;
    const progressBarEl = this.progressBar.nativeElement;
    const clickX = event.offsetX;
    const width = progressBarEl.offsetWidth;
    const seekTime = clickX / width * audio.duration;
    audio.currentTime = seekTime;
  }
  formatTime(seconds) {
    if (isNaN(seconds) || seconds === 0)
      return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }
  loadPageContent() {
    this.apiService.getPageContent("resources").subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.pageContent.set(response.data);
        }
      },
      error: (err) => {
        console.error("Error loading page content:", err);
      }
    });
  }
  loadDocuments() {
    this.loading.set(true);
    this.apiService.getDocuments().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.documents.set(response.data);
        } else {
          this.error.set("Failed to load documents");
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Error loading documents:", err);
        this.error.set("Failed to load documents");
        this.loading.set(false);
      }
    });
  }
  static \u0275fac = function ResourcesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ResourcesComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ResourcesComponent, selectors: [["app-resources"]], viewQuery: function ResourcesComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c07, 5);
      \u0275\u0275viewQuery(_c17, 5);
      \u0275\u0275viewQuery(_c22, 5);
      \u0275\u0275viewQuery(_c3, 5);
      \u0275\u0275viewQuery(_c4, 5);
      \u0275\u0275viewQuery(_c5, 5);
      \u0275\u0275viewQuery(_c6, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.heroVideoDesktop = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.heroVideoMobile = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.anthemAudio = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.anthemSectionVideo = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.anthemPlayerVideo = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.cinemaSpaceBg = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.progressBar = _t.first);
    }
  }, decls: 85, vars: 12, consts: [["heroVideoDesktop", ""], ["heroVideoMobile", ""], ["cinemaSpaceBg", ""], ["anthemSectionVideo", ""], ["anthemPlayerVideo", ""], ["anthemAudio", ""], ["playPauseBtn", ""], ["progressBar", ""], [1, "page-hero"], ["id", "resourcesVideo", "muted", "", "loop", "", "playsinline", "", 1, "hero-video", "hero-video-desktop"], ["src", "/assets/video/space-background.mp4", "type", "video/mp4"], ["id", "resourcesVideoMobile", "muted", "", "loop", "", "playsinline", "", 1, "hero-video", "hero-video-mobile"], [1, "container"], ["id", "resourcesTitle", 1, "hero-title"], ["id", "resourcesSubtitle", 1, "hero-subtitle"], [1, "documents-section"], [1, "section-header"], [1, "section-description"], [1, "loading-spinner"], [1, "alert", "alert-error"], [1, "documents-grid"], [1, "no-documents"], [1, "cinema-theater-wrapper"], ["muted", "", "loop", "", "playsinline", "", "autoplay", "", 1, "cinema-space-bg"], ["src", "/assets/video/intro-space-background.mp4", "type", "video/mp4"], [1, "cinema-vignette"], [1, "anthem-section"], ["id", "anthemSectionVideo", "muted", "", "loop", "", "playsinline", "", 1, "anthem-section-video"], ["src", "/assets/video/resources-background.mp4", "type", "video/mp4"], [1, "cinema-screen-frame"], [1, "anthem-featured"], ["id", "anthemPlayerVideo", "muted", "", "loop", "", "playsinline", "", 1, "anthem-player-video"], ["src", "/assets/video/conference-anthem-background.mp4", "type", "video/mp4"], [1, "anthem-header"], [1, "anthem-info"], [1, "song-title"], [1, "song-artist"], [1, "song-description"], [1, "custom-audio-player"], ["id", "anthemAudio", "preload", "metadata", "loop", ""], ["src", "/assets/audio/one-orbit-anthem.mp3", "type", "audio/mpeg"], [1, "player-controls"], ["id", "playPauseBtn", "aria-label", "Play/Pause", 1, "play-pause-btn", 3, "click"], ["width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "currentColor", 1, "play-icon"], ["d", "M8 5v14l11-7z"], ["width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "currentColor", 1, "pause-icon"], ["d", "M6 4h4v16H6V4zm8 0h4v16h-4V4z"], [1, "player-info"], [1, "progress-container"], ["id", "progressBar", 1, "progress-bar", 3, "click"], ["id", "progressFill", 1, "progress-fill"], [1, "time-display"], ["id", "currentTime"], [1, "time-separator"], ["id", "duration"], [1, "anthem-download"], ["href", "/assets/audio/one-orbit-anthem-full.mp3", "download", "one-orbit-anthem-full.mp3", 1, "btn", "btn-download"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2"], ["d", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"], ["points", "7 10 12 15 17 10"], ["x1", "12", "y1", "15", "x2", "12", "y2", "3"], ["href", "/assets/audio/instrumental_background.mp3", "download", "instrumental_background.mp3", 1, "btn", "btn-download", "btn-secondary-download"], [1, "spinner"], [1, "document-card"], [1, "document-icon"], [1, "icon-pdf"], [1, "icon-word"], [1, "icon-excel"], [1, "icon-powerpoint"], [1, "icon-generic"], [1, "document-title"], [1, "document-description"], [1, "document-badge"], [1, "document-size"], [1, "btn", "btn-download-doc", 3, "href", "download"], ["width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2"]], template: function ResourcesComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275domElementStart(0, "section", 8)(1, "video", 9, 0);
      \u0275\u0275domElement(3, "source", 10);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(4, "video", 11, 1);
      \u0275\u0275domElement(6, "source", 10);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(7, "div", 12)(8, "h1", 13);
      \u0275\u0275text(9, "Resources");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(10, "p", 14);
      \u0275\u0275text(11, "Conference Materials & Media");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(12, "section", 15)(13, "div", 12)(14, "div", 16)(15, "h2");
      \u0275\u0275text(16, "Resource Library");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(17, "p", 17);
      \u0275\u0275text(18, "Browse and download conference materials, guides, and resources");
      \u0275\u0275domElementEnd()();
      \u0275\u0275conditionalCreate(19, ResourcesComponent_Conditional_19_Template, 4, 0, "div", 18);
      \u0275\u0275conditionalCreate(20, ResourcesComponent_Conditional_20_Template, 3, 1, "div", 19);
      \u0275\u0275conditionalCreate(21, ResourcesComponent_Conditional_21_Template, 3, 0, "div", 20);
      \u0275\u0275conditionalCreate(22, ResourcesComponent_Conditional_22_Template, 3, 0, "div", 21);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(23, "div", 22)(24, "video", 23, 2);
      \u0275\u0275domElement(26, "source", 24);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElement(27, "div", 25);
      \u0275\u0275domElementStart(28, "section", 26)(29, "video", 27, 3);
      \u0275\u0275domElement(31, "source", 28);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(32, "div", 12)(33, "div", 29)(34, "div", 30)(35, "video", 31, 4);
      \u0275\u0275domElement(37, "source", 32);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(38, "div", 33)(39, "h2");
      \u0275\u0275text(40, "Conference Anthem");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(41, "div", 34)(42, "h3", 35);
      \u0275\u0275text(43, "One Orbit");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(44, "p", 36);
      \u0275\u0275text(45, "by IronRUST");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(46, "p", 37);
      \u0275\u0275text(47, "Official theme song for PASC Region J Conference 2026: Reach for the stars, lead beyond limits!");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(48, "div", 38)(49, "audio", 39, 5);
      \u0275\u0275domElement(51, "source", 40);
      \u0275\u0275text(52, " Your browser does not support the audio element. ");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(53, "div", 41)(54, "button", 42, 6);
      \u0275\u0275domListener("click", function ResourcesComponent_Template_button_click_54_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.toggleAnthemPlayback());
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(56, "svg", 43);
      \u0275\u0275domElement(57, "path", 44);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(58, "svg", 45);
      \u0275\u0275domElement(59, "path", 46);
      \u0275\u0275domElementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275domElementStart(60, "div", 47)(61, "div", 48)(62, "div", 49, 7);
      \u0275\u0275domListener("click", function ResourcesComponent_Template_div_click_62_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.seekAnthemAudio($event));
      });
      \u0275\u0275domElement(64, "div", 50);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(65, "div", 51)(66, "span", 52);
      \u0275\u0275text(67);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(68, "span", 53);
      \u0275\u0275text(69, "/");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(70, "span", 54);
      \u0275\u0275text(71);
      \u0275\u0275domElementEnd()()()()();
      \u0275\u0275domElementStart(72, "div", 55)(73, "a", 56);
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(74, "svg", 57);
      \u0275\u0275domElement(75, "path", 58)(76, "polyline", 59)(77, "line", 60);
      \u0275\u0275domElementEnd();
      \u0275\u0275text(78, " Download MP3 ");
      \u0275\u0275domElementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275domElementStart(79, "a", 61);
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(80, "svg", 57);
      \u0275\u0275domElement(81, "path", 58)(82, "polyline", 59)(83, "line", 60);
      \u0275\u0275domElementEnd();
      \u0275\u0275text(84, " Download Background Music (Instrumental) ");
      \u0275\u0275domElementEnd()()()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(19);
      \u0275\u0275conditional(ctx.loading() ? 19 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 20 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.loading() && !ctx.error() && ctx.documents().length > 0 ? 21 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.loading() && !ctx.error() && ctx.documents().length === 0 ? 22 : -1);
      \u0275\u0275advance(34);
      \u0275\u0275styleProp("display", ctx.isAnthemPlaying() ? "none" : "block");
      \u0275\u0275advance(2);
      \u0275\u0275styleProp("display", ctx.isAnthemPlaying() ? "block" : "none");
      \u0275\u0275advance(6);
      \u0275\u0275styleProp("width", ctx.anthemProgress(), "%");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.formatTime(ctx.anthemCurrentTime()));
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.formatTime(ctx.anthemDuration()));
    }
  }, dependencies: [CommonModule, RouterModule], styles: ["\n\n.resources-intro[_ngcontent-%COMP%] {\n  margin: 40px auto;\n  max-width: 800px;\n  text-align: center;\n}\n.resources-intro[_ngcontent-%COMP%]   .lead[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  line-height: 1.8;\n  color: #e0e0e0;\n}\n.no-documents[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 20px;\n  color: #aaa;\n}\n.documents-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));\n  gap: 25px;\n  margin: 40px 0;\n}\n.document-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n  background: rgba(26, 31, 58, 0.6);\n  padding: 25px;\n  border-radius: 10px;\n  border: 1px solid transparent;\n  transition: all 0.3s ease;\n  text-decoration: none;\n  color: inherit;\n}\n.document-card[_ngcontent-%COMP%]:hover {\n  background: rgba(26, 31, 58, 0.8);\n  border-color: #4fc3f7;\n  transform: translateY(-5px);\n  box-shadow: 0 10px 30px rgba(79, 195, 247, 0.3);\n}\n.document-icon[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  flex-shrink: 0;\n}\n.document-info[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.document-info[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #fff;\n  margin: 0 0 10px 0;\n  font-size: 1.1rem;\n}\n.document-description[_ngcontent-%COMP%] {\n  color: #b0b0b0;\n  font-size: 0.9rem;\n  line-height: 1.5;\n  margin: 0 0 10px 0;\n}\n.document-meta[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 15px;\n  flex-wrap: wrap;\n}\n.document-type[_ngcontent-%COMP%], \n.document-size[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: #4fc3f7;\n  background: rgba(79, 195, 247, 0.1);\n  padding: 4px 12px;\n  border-radius: 15px;\n}\n.download-icon[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  flex-shrink: 0;\n  opacity: 0.5;\n  transition: opacity 0.3s ease;\n}\n.document-card[_ngcontent-%COMP%]:hover   .download-icon[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.cta-section[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 80px 20px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(10, 14, 39, 0.8) 0%,\n      rgba(26, 31, 58, 0.8) 100%);\n}\n.cta-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 2.2rem;\n  margin-bottom: 15px;\n}\n.cta-section[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  margin-bottom: 25px;\n  color: #b0b0b0;\n}\n.cta-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 20px;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n@media (max-width: 768px) {\n  .documents-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .document-card[_ngcontent-%COMP%] {\n    flex-direction: column;\n    text-align: center;\n  }\n  .download-icon[_ngcontent-%COMP%] {\n    order: -1;\n  }\n}\n/*# sourceMappingURL=resources.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResourcesComponent, [{
    type: Component,
    args: [{ selector: "app-resources", standalone: true, imports: [CommonModule, RouterModule], template: `<!-- Hero Section -->
<section class="page-hero">
    <!-- Video Background - Desktop -->
    <video #heroVideoDesktop id="resourcesVideo" class="hero-video hero-video-desktop" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>

    <!-- Video Background - Mobile -->
    <video #heroVideoMobile id="resourcesVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>

    <div class="container">
        <h1 class="hero-title" id="resourcesTitle">Resources</h1>
        <p class="hero-subtitle" id="resourcesSubtitle">Conference Materials & Media</p>
    </div>
</section>

<!-- Document Library Section -->
<section class="documents-section">
    <div class="container">
        <div class="section-header">
            <h2>Resource Library</h2>
            <p class="section-description">Browse and download conference materials, guides, and resources</p>
        </div>

        @if (loading()) {
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading resources...</p>
            </div>
        }

        @if (error()) {
            <div class="alert alert-error">
                <p>{{ error() }}</p>
            </div>
        }

        @if (!loading() && !error() && documents().length > 0) {
            <div class="documents-grid">
                @for (doc of documents(); track doc.id) {
                    <div class="document-card">
                        <!-- File Type Icon -->
                        <div class="document-icon">
                            @if (doc.fileExtension === '.pdf') {
                                <span class="icon-pdf">\u{1F4C4}</span>
                            } @else if (doc.fileExtension === '.doc' || doc.fileExtension === '.docx') {
                                <span class="icon-word">\u{1F4D8}</span>
                            } @else if (doc.fileExtension === '.xls' || doc.fileExtension === '.xlsx') {
                                <span class="icon-excel">\u{1F4CA}</span>
                            } @else if (doc.fileExtension === '.ppt' || doc.fileExtension === '.pptx') {
                                <span class="icon-powerpoint">\u{1F4D9}</span>
                            } @else {
                                <span class="icon-generic">\u{1F4C3}</span>
                            }
                        </div>

                        <!-- Document Title -->
                        <h3 class="document-title">{{ doc.title }}</h3>

                        <!-- Description (if exists) -->
                        @if (doc.description) {
                            <p class="document-description">{{ doc.description }}</p>
                        }

                        <!-- Category Badge (if exists) -->
                        @if (doc.documentType) {
                            <span class="document-badge">{{ doc.documentType }}</span>
                        }

                        <!-- File Size -->
                        <p class="document-size">{{ doc.fileSizeFormatted }}</p>

                        <!-- Download Button -->
                        <a [href]="doc.downloadPath" [download]="doc.originalFilename" class="btn btn-download-doc">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download
                        </a>
                    </div>
                }
            </div>
        }

        @if (!loading() && !error() && documents().length === 0) {
            <div class="no-documents">
                <p>No resources available yet. Check back soon!</p>
            </div>
        }
    </div>
</section>

<!-- Conference Anthem Section with Cinema Effect -->
<div class="cinema-theater-wrapper">
    <!-- Static Space Background (Theater Ambiance) -->
    <video #cinemaSpaceBg class="cinema-space-bg" muted loop playsinline autoplay>
        <source src="/assets/video/intro-space-background.mp4" type="video/mp4">
    </video>

    <!-- Dark Vignette (Theater Edges) -->
    <div class="cinema-vignette"></div>

    <section class="anthem-section">
        <!-- Section Background Video -->
        <video #anthemSectionVideo id="anthemSectionVideo" class="anthem-section-video" muted loop playsinline>
            <source src="/assets/video/resources-background.mp4" type="video/mp4">
        </video>

        <div class="container">
            <!-- Cinema Screen Frame -->
            <div class="cinema-screen-frame">
                <div class="anthem-featured">
                    <!-- Singer Background Video - Covers Entire Section -->
                    <video #anthemPlayerVideo id="anthemPlayerVideo" class="anthem-player-video" muted loop playsinline>
                        <source src="/assets/video/conference-anthem-background.mp4" type="video/mp4">
                    </video>

                    <div class="anthem-header">
                        <h2>Conference Anthem</h2>
                        <div class="anthem-info">
                            <h3 class="song-title">One Orbit</h3>
                            <p class="song-artist">by IronRUST</p>
                            <p class="song-description">Official theme song for PASC Region J Conference 2026: Reach for the stars, lead beyond limits!</p>
                        </div>
                    </div>

                    <!-- Audio Player -->
                    <div class="custom-audio-player">
                        <audio #anthemAudio id="anthemAudio" preload="metadata" loop>
                            <source src="/assets/audio/one-orbit-anthem.mp3" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>

                        <div class="player-controls">
                            <button #playPauseBtn id="playPauseBtn" class="play-pause-btn" aria-label="Play/Pause" (click)="toggleAnthemPlayback()">
                                <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" [style.display]="isAnthemPlaying() ? 'none' : 'block'">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                <svg class="pause-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" [style.display]="isAnthemPlaying() ? 'block' : 'none'">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                                </svg>
                            </button>

                            <div class="player-info">
                                <div class="progress-container">
                                    <div class="progress-bar" #progressBar id="progressBar" (click)="seekAnthemAudio($event)">
                                        <div class="progress-fill" id="progressFill" [style.width.%]="anthemProgress()"></div>
                                    </div>
                                </div>
                                <div class="time-display">
                                    <span id="currentTime">{{ formatTime(anthemCurrentTime()) }}</span>
                                    <span class="time-separator">/</span>
                                    <span id="duration">{{ formatTime(anthemDuration()) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Download Button -->
                    <div class="anthem-download">
                        <a href="/assets/audio/one-orbit-anthem-full.mp3" download="one-orbit-anthem-full.mp3" class="btn btn-download">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download MP3
                        </a>
                        <a href="/assets/audio/instrumental_background.mp3" download="instrumental_background.mp3" class="btn btn-download btn-secondary-download">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download Background Music (Instrumental)
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
`, styles: ["/* src/app/components/resources/resources.component.css */\n.resources-intro {\n  margin: 40px auto;\n  max-width: 800px;\n  text-align: center;\n}\n.resources-intro .lead {\n  font-size: 1.2rem;\n  line-height: 1.8;\n  color: #e0e0e0;\n}\n.no-documents {\n  text-align: center;\n  padding: 60px 20px;\n  color: #aaa;\n}\n.documents-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));\n  gap: 25px;\n  margin: 40px 0;\n}\n.document-card {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n  background: rgba(26, 31, 58, 0.6);\n  padding: 25px;\n  border-radius: 10px;\n  border: 1px solid transparent;\n  transition: all 0.3s ease;\n  text-decoration: none;\n  color: inherit;\n}\n.document-card:hover {\n  background: rgba(26, 31, 58, 0.8);\n  border-color: #4fc3f7;\n  transform: translateY(-5px);\n  box-shadow: 0 10px 30px rgba(79, 195, 247, 0.3);\n}\n.document-icon {\n  font-size: 3rem;\n  flex-shrink: 0;\n}\n.document-info {\n  flex: 1;\n}\n.document-info h3 {\n  color: #fff;\n  margin: 0 0 10px 0;\n  font-size: 1.1rem;\n}\n.document-description {\n  color: #b0b0b0;\n  font-size: 0.9rem;\n  line-height: 1.5;\n  margin: 0 0 10px 0;\n}\n.document-meta {\n  display: flex;\n  gap: 15px;\n  flex-wrap: wrap;\n}\n.document-type,\n.document-size {\n  font-size: 0.85rem;\n  color: #4fc3f7;\n  background: rgba(79, 195, 247, 0.1);\n  padding: 4px 12px;\n  border-radius: 15px;\n}\n.download-icon {\n  font-size: 1.5rem;\n  flex-shrink: 0;\n  opacity: 0.5;\n  transition: opacity 0.3s ease;\n}\n.document-card:hover .download-icon {\n  opacity: 1;\n}\n.cta-section {\n  text-align: center;\n  padding: 80px 20px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(10, 14, 39, 0.8) 0%,\n      rgba(26, 31, 58, 0.8) 100%);\n}\n.cta-section h2 {\n  font-size: 2.2rem;\n  margin-bottom: 15px;\n}\n.cta-section p {\n  font-size: 1.1rem;\n  margin-bottom: 25px;\n  color: #b0b0b0;\n}\n.cta-buttons {\n  display: flex;\n  gap: 20px;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n@media (max-width: 768px) {\n  .documents-grid {\n    grid-template-columns: 1fr;\n  }\n  .document-card {\n    flex-direction: column;\n    text-align: center;\n  }\n  .download-icon {\n    order: -1;\n  }\n}\n/*# sourceMappingURL=resources.component.css.map */\n"] }]
  }], null, { heroVideoDesktop: [{
    type: ViewChild,
    args: ["heroVideoDesktop", { static: false }]
  }], heroVideoMobile: [{
    type: ViewChild,
    args: ["heroVideoMobile", { static: false }]
  }], anthemAudio: [{
    type: ViewChild,
    args: ["anthemAudio", { static: false }]
  }], anthemSectionVideo: [{
    type: ViewChild,
    args: ["anthemSectionVideo", { static: false }]
  }], anthemPlayerVideo: [{
    type: ViewChild,
    args: ["anthemPlayerVideo", { static: false }]
  }], cinemaSpaceBg: [{
    type: ViewChild,
    args: ["cinemaSpaceBg", { static: false }]
  }], progressBar: [{
    type: ViewChild,
    args: ["progressBar", { static: false }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ResourcesComponent, { className: "ResourcesComponent", filePath: "src/app/components/resources/resources.component.ts", lineNumber: 16 });
})();

// src/app/components/contact/contact.component.ts
var _c08 = ["heroVideoDesktop"];
var _c18 = ["heroVideoMobile"];
function ContactComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 15);
    \u0275\u0275text(2, "\u2705");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 16)(4, "h3");
    \u0275\u0275text(5, "Message Sent Successfully!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.successMessage());
  }
}
function ContactComponent_Conditional_20_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const error_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(error_r2);
  }
}
function ContactComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 15);
    \u0275\u0275text(2, "\u26A0\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 16)(4, "h3");
    \u0275\u0275text(5, "Please Correct the Following Errors:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "ul");
    \u0275\u0275repeaterCreate(7, ContactComponent_Conditional_20_For_8_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r0.errorMessages());
  }
}
function ContactComponent_Conditional_21_For_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r4 = ctx.$implicit;
    \u0275\u0275property("value", option_r4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r4);
  }
}
function ContactComponent_Conditional_21_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 49);
    \u0275\u0275text(1, " Sending... ");
  }
}
function ContactComponent_Conditional_21_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 50);
    \u0275\u0275text(1, "\u{1F4E7}");
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, " Send Message ");
  }
}
function ContactComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 17)(2, "div", 18)(3, "h3");
    \u0275\u0275text(4, "Send Us a Message");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "form", 19);
    \u0275\u0275listener("ngSubmit", function ContactComponent_Conditional_21_Template_form_ngSubmit_5_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmit());
    });
    \u0275\u0275elementStart(6, "div", 20)(7, "label", 21);
    \u0275\u0275text(8, "Website");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "input", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 23)(11, "label", 24);
    \u0275\u0275text(12, " Name ");
    \u0275\u0275elementStart(13, "span", 25);
    \u0275\u0275text(14, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(15, "input", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 23)(17, "label", 27);
    \u0275\u0275text(18, " Email Address ");
    \u0275\u0275elementStart(19, "span", 25);
    \u0275\u0275text(20, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(21, "input", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 23)(23, "label", 29);
    \u0275\u0275text(24, " Subject ");
    \u0275\u0275elementStart(25, "span", 25);
    \u0275\u0275text(26, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "select", 30)(28, "option", 31);
    \u0275\u0275text(29, "-- Please Select --");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(30, ContactComponent_Conditional_21_For_31_Template, 2, 2, "option", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 23)(33, "label", 33);
    \u0275\u0275text(34, " Message ");
    \u0275\u0275elementStart(35, "span", 25);
    \u0275\u0275text(36, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(37, "textarea", 34);
    \u0275\u0275elementStart(38, "div", 35)(39, "span");
    \u0275\u0275text(40);
    \u0275\u0275elementEnd();
    \u0275\u0275text(41, " / 5000 characters ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 23)(43, "button", 36);
    \u0275\u0275conditionalCreate(44, ContactComponent_Conditional_21_Conditional_44_Template, 2, 0)(45, ContactComponent_Conditional_21_Conditional_45_Template, 3, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "p", 37)(47, "span", 25);
    \u0275\u0275text(48, "*");
    \u0275\u0275elementEnd();
    \u0275\u0275text(49, " Required fields ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(50, "div", 38)(51, "div", 39)(52, "h3");
    \u0275\u0275text(53, "Contact Information");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "div", 40)(55, "div", 41);
    \u0275\u0275text(56, "\u{1F4E7}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "div", 42)(58, "h4");
    \u0275\u0275text(59, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "p")(61, "a", 43);
    \u0275\u0275text(62, "info@pascregionj.com");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(63, "div", 40)(64, "div", 41);
    \u0275\u0275text(65, "\u{1F4C5}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "div", 42)(67, "h4");
    \u0275\u0275text(68, "Conference Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "p");
    \u0275\u0275text(70, "February 13, 2026");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(71, "div", 40)(72, "div", 41);
    \u0275\u0275text(73, "\u{1F4CD}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "div", 42)(75, "h4");
    \u0275\u0275text(76, "Location");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(77, "p");
    \u0275\u0275text(78, "Neshaminy High School");
    \u0275\u0275element(79, "br");
    \u0275\u0275text(80, "Langhorne, PA");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(81, "div", 40)(82, "div", 41);
    \u0275\u0275text(83, "\u23F0");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "div", 42)(85, "h4");
    \u0275\u0275text(86, "Response Time");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(87, "p");
    \u0275\u0275text(88, "We typically respond within 24-48 hours during business days.");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(89, "div", 39)(90, "h3");
    \u0275\u0275text(91, "Quick Links");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "ul", 44)(93, "li")(94, "a", 45);
    \u0275\u0275text(95, "Workshop Applications");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(96, "li")(97, "a", 46);
    \u0275\u0275text(98, "About PASC Region J");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(99, "li")(100, "a", 47);
    \u0275\u0275text(101, "Resources & Downloads");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(102, "li")(103, "a", 48);
    \u0275\u0275text(104, "Photo Gallery");
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("formGroup", ctx_r0.contactForm);
    \u0275\u0275advance(10);
    \u0275\u0275classProp("invalid", (ctx_r0.name == null ? null : ctx_r0.name.invalid) && (ctx_r0.name == null ? null : ctx_r0.name.touched));
    \u0275\u0275advance(6);
    \u0275\u0275classProp("invalid", (ctx_r0.email == null ? null : ctx_r0.email.invalid) && (ctx_r0.email == null ? null : ctx_r0.email.touched));
    \u0275\u0275advance(6);
    \u0275\u0275classProp("invalid", (ctx_r0.subject == null ? null : ctx_r0.subject.invalid) && (ctx_r0.subject == null ? null : ctx_r0.subject.touched));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.subjectOptions);
    \u0275\u0275advance(7);
    \u0275\u0275classProp("invalid", (ctx_r0.message == null ? null : ctx_r0.message.invalid) && (ctx_r0.message == null ? null : ctx_r0.message.touched));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.messageCharCount);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r0.submitting());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.submitting() ? 44 : 45);
  }
}
function ContactComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "a", 51);
    \u0275\u0275text(2, "Return Home");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "a", 52);
    \u0275\u0275text(4, "Learn More About PASC Region J");
    \u0275\u0275elementEnd()();
  }
}
var ContactComponent = class _ContactComponent {
  heroVideoDesktop;
  heroVideoMobile;
  apiService = inject(ApiService);
  audioService = inject(AudioService);
  fb = inject(FormBuilder);
  contactForm;
  submitting = signal(false, ...ngDevMode ? [{ debugName: "submitting" }] : []);
  submitted = signal(false, ...ngDevMode ? [{ debugName: "submitted" }] : []);
  successMessage = signal(null, ...ngDevMode ? [{ debugName: "successMessage" }] : []);
  errorMessages = signal([], ...ngDevMode ? [{ debugName: "errorMessages" }] : []);
  subjectOptions = [
    "General Inquiry",
    "Conference Registration",
    "Workshop Application",
    "Other"
  ];
  subscriptions = [];
  ngOnInit() {
    this.initForm();
    this.setupAudioSubscription();
  }
  ngAfterViewInit() {
    if (this.heroVideoDesktop?.nativeElement) {
      this.heroVideoDesktop.nativeElement.muted = true;
      this.heroVideoDesktop.nativeElement.volume = 0;
    }
    if (this.heroVideoMobile?.nativeElement) {
      this.heroVideoMobile.nativeElement.muted = true;
      this.heroVideoMobile.nativeElement.volume = 0;
    }
    this.controlVideoPlayback(this.audioService.isPlaying());
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  setupAudioSubscription() {
    const playingSub = this.audioService.isPlaying$.subscribe((playing) => {
      this.controlVideoPlayback(playing);
    });
    this.subscriptions.push(playingSub);
  }
  controlVideoPlayback(shouldPlay) {
    [this.heroVideoDesktop, this.heroVideoMobile].forEach((videoRef) => {
      if (videoRef && videoRef.nativeElement) {
        if (shouldPlay) {
          videoRef.nativeElement.play().catch(() => {
          });
        } else {
          videoRef.nativeElement.pause();
        }
      }
    });
  }
  initForm() {
    this.contactForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      subject: ["", Validators.required],
      message: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(5e3)]],
      website: [""]
      // Honeypot field
    });
  }
  get name() {
    return this.contactForm.get("name");
  }
  get email() {
    return this.contactForm.get("email");
  }
  get subject() {
    return this.contactForm.get("subject");
  }
  get message() {
    return this.contactForm.get("message");
  }
  get messageCharCount() {
    return this.message?.value?.length || 0;
  }
  onSubmit() {
    this.errorMessages.set([]);
    this.successMessage.set(null);
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      const errors = [];
      if (this.name?.hasError("required")) {
        errors.push("Name is required.");
      } else if (this.name?.hasError("minlength")) {
        errors.push("Name must be at least 2 characters.");
      }
      if (this.email?.hasError("required")) {
        errors.push("Email is required.");
      } else if (this.email?.hasError("email")) {
        errors.push("Please enter a valid email address.");
      }
      if (this.subject?.hasError("required")) {
        errors.push("Subject is required.");
      }
      if (this.message?.hasError("required")) {
        errors.push("Message is required.");
      } else if (this.message?.hasError("minlength")) {
        errors.push("Message must be at least 10 characters.");
      } else if (this.message?.hasError("maxlength")) {
        errors.push("Message must not exceed 5000 characters.");
      }
      this.errorMessages.set(errors);
      return;
    }
    this.submitting.set(true);
    const submission = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message,
      website: this.contactForm.value.website
    };
    this.apiService.submitContact(submission).subscribe({
      next: (response) => {
        this.submitting.set(false);
        if (response.success) {
          this.successMessage.set(response.message || "Thank you for your message!");
          this.submitted.set(true);
          this.contactForm.reset();
        } else {
          this.errorMessages.set(response.errors || ["An error occurred. Please try again."]);
        }
      },
      error: (err) => {
        console.error("Error submitting contact form:", err);
        this.submitting.set(false);
        this.errorMessages.set(["An error occurred while sending your message. Please try again or contact us directly at info@pascregionj.com."]);
      }
    });
  }
  static \u0275fac = function ContactComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ContactComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ContactComponent, selectors: [["app-contact"]], viewQuery: function ContactComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c08, 5);
      \u0275\u0275viewQuery(_c18, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.heroVideoDesktop = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.heroVideoMobile = _t.first);
    }
  }, decls: 23, vars: 3, consts: [["heroVideoDesktop", ""], ["heroVideoMobile", ""], [1, "page-hero"], ["id", "contactVideo", "muted", "", "loop", "", "playsinline", "", 1, "hero-video", "hero-video-desktop"], ["src", "/assets/video/space-background.mp4", "type", "video/mp4"], ["id", "contactVideoMobile", "muted", "", "loop", "", "playsinline", "", 1, "hero-video", "hero-video-mobile"], [1, "container"], ["id", "contactTitle", 1, "hero-title"], ["id", "contactSubtitle", 1, "hero-subtitle"], [1, "contact-form-section"], [1, "contact-intro"], [1, "alert", "alert-success"], [1, "alert", "alert-error"], [1, "contact-layout"], [1, "form-actions"], [1, "alert-icon"], [1, "alert-content"], [1, "contact-form-column"], [1, "form-card"], [3, "ngSubmit", "formGroup"], [1, "honeypot-field"], ["for", "website"], ["type", "text", "id", "website", "formControlName", "website", "tabindex", "-1", "autocomplete", "off"], [1, "form-group"], ["for", "contactName", 1, "form-label"], [1, "required"], ["type", "text", "id", "contactName", "formControlName", "name", "placeholder", "Your full name", 1, "form-input"], ["for", "contactEmail", 1, "form-label"], ["type", "email", "id", "contactEmail", "formControlName", "email", "placeholder", "your.email@example.com", 1, "form-input"], ["for", "contactSubject", 1, "form-label"], ["id", "contactSubject", "formControlName", "subject", 1, "form-input"], ["value", ""], [3, "value"], ["for", "contactMessage", 1, "form-label"], ["id", "contactMessage", "formControlName", "message", "rows", "6", "placeholder", "Please provide details about your inquiry...", 1, "form-textarea"], [1, "char-counter"], ["type", "submit", 1, "btn", "btn-primary", "btn-submit", 3, "disabled"], [1, "form-note"], [1, "contact-info-column"], [1, "info-card"], [1, "info-item"], [1, "info-icon"], [1, "info-content"], ["href", "mailto:info@pascregionj.com"], [1, "quick-links"], ["routerLink", "/workshops"], ["routerLink", "/about"], ["routerLink", "/resources"], ["routerLink", "/gallery"], [1, "btn-spinner"], [1, "btn-icon"], ["routerLink", "/", 1, "btn", "btn-primary"], ["routerLink", "/about", 1, "btn", "btn-secondary"]], template: function ContactComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 2)(1, "video", 3, 0);
      \u0275\u0275element(3, "source", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "video", 5, 1);
      \u0275\u0275element(6, "source", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 6)(8, "h1", 7);
      \u0275\u0275text(9, "Contact Us");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "p", 8);
      \u0275\u0275text(11, "We're Here to Help");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(12, "section", 9)(13, "div", 6)(14, "div", 10)(15, "h2");
      \u0275\u0275text(16, "Get in Touch");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "p");
      \u0275\u0275text(18, "Have questions about the PASC Region J Conference 2026? We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(19, ContactComponent_Conditional_19_Template, 8, 1, "div", 11);
      \u0275\u0275conditionalCreate(20, ContactComponent_Conditional_20_Template, 9, 0, "div", 12);
      \u0275\u0275conditionalCreate(21, ContactComponent_Conditional_21_Template, 105, 12, "div", 13)(22, ContactComponent_Conditional_22_Template, 5, 0, "div", 14);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(19);
      \u0275\u0275conditional(ctx.successMessage() ? 19 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorMessages().length > 0 ? 20 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.submitted() ? 21 : 22);
    }
  }, dependencies: [CommonModule, RouterModule, RouterLink, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], styles: ["\n\n.contact-intro[_ngcontent-%COMP%] {\n  text-align: center;\n  max-width: 700px;\n  margin: 0 auto 40px;\n}\n.contact-intro[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-bottom: 15px;\n}\n.contact-intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #b0b0b0;\n  font-size: 1.1rem;\n}\n.alert[_ngcontent-%COMP%] {\n  padding: 25px;\n  border-radius: 10px;\n  margin: 30px 0;\n  display: flex;\n  gap: 20px;\n}\n.alert-success[_ngcontent-%COMP%] {\n  background: rgba(76, 175, 80, 0.2);\n  border: 1px solid #4caf50;\n}\n.alert-error[_ngcontent-%COMP%] {\n  background: rgba(244, 67, 54, 0.2);\n  border: 1px solid #f44336;\n}\n.alert-icon[_ngcontent-%COMP%] {\n  font-size: 2rem;\n}\n.alert-content[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 10px 0;\n  font-size: 1.2rem;\n}\n.alert-content[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  margin: 10px 0 0 20px;\n  color: #f0f0f0;\n}\n.contact-layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1.5fr 1fr;\n  gap: 40px;\n  margin: 40px 0;\n}\n.form-card[_ngcontent-%COMP%], \n.info-card[_ngcontent-%COMP%] {\n  background: rgba(26, 31, 58, 0.6);\n  padding: 30px;\n  border-radius: 10px;\n  border: 1px solid rgba(79, 195, 247, 0.3);\n}\n.form-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.info-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n  margin-bottom: 25px;\n}\n.honeypot-field[_ngcontent-%COMP%] {\n  position: absolute;\n  left: -9999px;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n}\n.form-group[_ngcontent-%COMP%] {\n  margin-bottom: 25px;\n}\n.form-label[_ngcontent-%COMP%] {\n  display: block;\n  color: #e0e0e0;\n  font-weight: 500;\n  margin-bottom: 8px;\n}\n.required[_ngcontent-%COMP%] {\n  color: #f44336;\n}\n.form-input[_ngcontent-%COMP%], \n.form-textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 12px 15px;\n  background: rgba(255, 255, 255, 0.9);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 5px;\n  color: #333;\n  font-size: 1rem;\n  transition: all 0.3s ease;\n}\n.form-input[_ngcontent-%COMP%]::placeholder, \n.form-textarea[_ngcontent-%COMP%]::placeholder {\n  color: #888;\n}\n.form-input[_ngcontent-%COMP%]:focus, \n.form-textarea[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #4fc3f7;\n  background: rgba(255, 255, 255, 1);\n}\n.form-input.invalid[_ngcontent-%COMP%], \n.form-textarea.invalid[_ngcontent-%COMP%] {\n  border-color: #f44336;\n}\nselect.form-input[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.9);\n  color: #333;\n}\nselect.form-input[_ngcontent-%COMP%]   option[_ngcontent-%COMP%] {\n  background: #1a1f3a;\n  color: #fff;\n}\n.form-textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n  min-height: 150px;\n  font-family: inherit;\n}\n.char-counter[_ngcontent-%COMP%] {\n  text-align: right;\n  color: #888;\n  font-size: 0.9rem;\n  margin-top: 5px;\n}\n.btn-submit[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 15px;\n  font-size: 1.1rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n}\n.btn-submit[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-spinner[_ngcontent-%COMP%] {\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top-color: #fff;\n  border-radius: 50%;\n  width: 16px;\n  height: 16px;\n  animation: _ngcontent-%COMP%_spin 0.8s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.form-note[_ngcontent-%COMP%] {\n  color: #888;\n  font-size: 0.9rem;\n  margin-top: 15px;\n}\n.info-item[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 15px;\n  margin-bottom: 25px;\n}\n.info-icon[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  flex-shrink: 0;\n}\n.info-content[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n  margin: 0 0 5px 0;\n  font-size: 1rem;\n}\n.info-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #e0e0e0;\n  margin: 0;\n  line-height: 1.6;\n}\n.info-content[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n  text-decoration: none;\n  transition: color 0.3s ease;\n}\n.info-content[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  color: #fff;\n}\n.quick-links[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n}\n.quick-links[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n}\n.quick-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #e0e0e0;\n  text-decoration: none;\n  transition: color 0.3s ease;\n  display: block;\n  padding: 8px 0;\n}\n.quick-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  color: #4fc3f7;\n}\n.form-actions[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px 0;\n  display: flex;\n  gap: 20px;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n@media (max-width: 992px) {\n  .contact-layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .contact-info-column[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n    gap: 20px;\n  }\n}\n@media (max-width: 576px) {\n  .contact-info-column[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=contact.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContactComponent, [{
    type: Component,
    args: [{ selector: "app-contact", standalone: true, imports: [CommonModule, RouterModule, ReactiveFormsModule], template: `<!-- Hero Section -->
<section class="page-hero">
  <video #heroVideoDesktop id="contactVideo" class="hero-video hero-video-desktop" muted loop playsinline>
    <source src="/assets/video/space-background.mp4" type="video/mp4">
  </video>

  <video #heroVideoMobile id="contactVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>
    <source src="/assets/video/space-background.mp4" type="video/mp4">
  </video>

  <div class="container">
    <h1 class="hero-title" id="contactTitle">Contact Us</h1>
    <p class="hero-subtitle" id="contactSubtitle">We're Here to Help</p>
  </div>
</section>

<!-- Contact Form Section -->
<section class="contact-form-section">
  <div class="container">
    <div class="contact-intro">
      <h2>Get in Touch</h2>
      <p>Have questions about the PASC Region J Conference 2026? We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.</p>
    </div>

    <!-- Success Message -->
    @if (successMessage()) {
      <div class="alert alert-success">
        <div class="alert-icon">\u2705</div>
        <div class="alert-content">
          <h3>Message Sent Successfully!</h3>
          <p>{{ successMessage() }}</p>
        </div>
      </div>
    }

    <!-- Error Messages -->
    @if (errorMessages().length > 0) {
      <div class="alert alert-error">
        <div class="alert-icon">\u26A0\uFE0F</div>
        <div class="alert-content">
          <h3>Please Correct the Following Errors:</h3>
          <ul>
            @for (error of errorMessages(); track error) {
              <li>{{ error }}</li>
            }
          </ul>
        </div>
      </div>
    }

    @if (!submitted()) {
      <div class="contact-layout">
        <!-- Left Column: Contact Form -->
        <div class="contact-form-column">
          <div class="form-card">
            <h3>Send Us a Message</h3>

            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
              <!-- Honeypot field (hidden) -->
              <div class="honeypot-field">
                <label for="website">Website</label>
                <input type="text" id="website" formControlName="website" tabindex="-1" autocomplete="off">
              </div>

              <!-- Name Field -->
              <div class="form-group">
                <label for="contactName" class="form-label">
                  Name <span class="required">*</span>
                </label>
                <input
                  type="text"
                  id="contactName"
                  formControlName="name"
                  class="form-input"
                  [class.invalid]="name?.invalid && name?.touched"
                  placeholder="Your full name">
              </div>

              <!-- Email Field -->
              <div class="form-group">
                <label for="contactEmail" class="form-label">
                  Email Address <span class="required">*</span>
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  formControlName="email"
                  class="form-input"
                  [class.invalid]="email?.invalid && email?.touched"
                  placeholder="your.email@example.com">
              </div>

              <!-- Subject Field -->
              <div class="form-group">
                <label for="contactSubject" class="form-label">
                  Subject <span class="required">*</span>
                </label>
                <select
                  id="contactSubject"
                  formControlName="subject"
                  class="form-input"
                  [class.invalid]="subject?.invalid && subject?.touched">
                  <option value="">-- Please Select --</option>
                  @for (option of subjectOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
              </div>

              <!-- Message Field -->
              <div class="form-group">
                <label for="contactMessage" class="form-label">
                  Message <span class="required">*</span>
                </label>
                <textarea
                  id="contactMessage"
                  formControlName="message"
                  class="form-textarea"
                  [class.invalid]="message?.invalid && message?.touched"
                  rows="6"
                  placeholder="Please provide details about your inquiry..."></textarea>
                <div class="char-counter">
                  <span>{{ messageCharCount }}</span> / 5000 characters
                </div>
              </div>

              <!-- Submit Button -->
              <div class="form-group">
                <button type="submit" class="btn btn-primary btn-submit" [disabled]="submitting()">
                  @if (submitting()) {
                    <span class="btn-spinner"></span>
                    Sending...
                  } @else {
                    <span class="btn-icon">\u{1F4E7}</span>
                    Send Message
                  }
                </button>
              </div>

              <p class="form-note">
                <span class="required">*</span> Required fields
              </p>
            </form>
          </div>
        </div>

        <!-- Right Column: Contact Information -->
        <div class="contact-info-column">
          <div class="info-card">
            <h3>Contact Information</h3>

            <div class="info-item">
              <div class="info-icon">\u{1F4E7}</div>
              <div class="info-content">
                <h4>Email</h4>
                <p><a href="mailto:info@pascregionj.com">info@pascregionj.com</a></p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">\u{1F4C5}</div>
              <div class="info-content">
                <h4>Conference Date</h4>
                <p>February 13, 2026</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">\u{1F4CD}</div>
              <div class="info-content">
                <h4>Location</h4>
                <p>Neshaminy High School<br>Langhorne, PA</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">\u23F0</div>
              <div class="info-content">
                <h4>Response Time</h4>
                <p>We typically respond within 24-48 hours during business days.</p>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>Quick Links</h3>
            <ul class="quick-links">
              <li><a routerLink="/workshops">Workshop Applications</a></li>
              <li><a routerLink="/about">About PASC Region J</a></li>
              <li><a routerLink="/resources">Resources & Downloads</a></li>
              <li><a routerLink="/gallery">Photo Gallery</a></li>
            </ul>
          </div>
        </div>
      </div>
    } @else {
      <!-- Show return home button after successful submission -->
      <div class="form-actions">
        <a routerLink="/" class="btn btn-primary">Return Home</a>
        <a routerLink="/about" class="btn btn-secondary">Learn More About PASC Region J</a>
      </div>
    }
  </div>
</section>
`, styles: ["/* src/app/components/contact/contact.component.css */\n.contact-intro {\n  text-align: center;\n  max-width: 700px;\n  margin: 0 auto 40px;\n}\n.contact-intro h2 {\n  margin-bottom: 15px;\n}\n.contact-intro p {\n  color: #b0b0b0;\n  font-size: 1.1rem;\n}\n.alert {\n  padding: 25px;\n  border-radius: 10px;\n  margin: 30px 0;\n  display: flex;\n  gap: 20px;\n}\n.alert-success {\n  background: rgba(76, 175, 80, 0.2);\n  border: 1px solid #4caf50;\n}\n.alert-error {\n  background: rgba(244, 67, 54, 0.2);\n  border: 1px solid #f44336;\n}\n.alert-icon {\n  font-size: 2rem;\n}\n.alert-content h3 {\n  margin: 0 0 10px 0;\n  font-size: 1.2rem;\n}\n.alert-content ul {\n  margin: 10px 0 0 20px;\n  color: #f0f0f0;\n}\n.contact-layout {\n  display: grid;\n  grid-template-columns: 1.5fr 1fr;\n  gap: 40px;\n  margin: 40px 0;\n}\n.form-card,\n.info-card {\n  background: rgba(26, 31, 58, 0.6);\n  padding: 30px;\n  border-radius: 10px;\n  border: 1px solid rgba(79, 195, 247, 0.3);\n}\n.form-card h3,\n.info-card h3 {\n  color: #4fc3f7;\n  margin-bottom: 25px;\n}\n.honeypot-field {\n  position: absolute;\n  left: -9999px;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n}\n.form-group {\n  margin-bottom: 25px;\n}\n.form-label {\n  display: block;\n  color: #e0e0e0;\n  font-weight: 500;\n  margin-bottom: 8px;\n}\n.required {\n  color: #f44336;\n}\n.form-input,\n.form-textarea {\n  width: 100%;\n  padding: 12px 15px;\n  background: rgba(255, 255, 255, 0.9);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 5px;\n  color: #333;\n  font-size: 1rem;\n  transition: all 0.3s ease;\n}\n.form-input::placeholder,\n.form-textarea::placeholder {\n  color: #888;\n}\n.form-input:focus,\n.form-textarea:focus {\n  outline: none;\n  border-color: #4fc3f7;\n  background: rgba(255, 255, 255, 1);\n}\n.form-input.invalid,\n.form-textarea.invalid {\n  border-color: #f44336;\n}\nselect.form-input {\n  background: rgba(255, 255, 255, 0.9);\n  color: #333;\n}\nselect.form-input option {\n  background: #1a1f3a;\n  color: #fff;\n}\n.form-textarea {\n  resize: vertical;\n  min-height: 150px;\n  font-family: inherit;\n}\n.char-counter {\n  text-align: right;\n  color: #888;\n  font-size: 0.9rem;\n  margin-top: 5px;\n}\n.btn-submit {\n  width: 100%;\n  padding: 15px;\n  font-size: 1.1rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n}\n.btn-submit:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-spinner {\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top-color: #fff;\n  border-radius: 50%;\n  width: 16px;\n  height: 16px;\n  animation: spin 0.8s linear infinite;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.form-note {\n  color: #888;\n  font-size: 0.9rem;\n  margin-top: 15px;\n}\n.info-item {\n  display: flex;\n  gap: 15px;\n  margin-bottom: 25px;\n}\n.info-icon {\n  font-size: 1.8rem;\n  flex-shrink: 0;\n}\n.info-content h4 {\n  color: #4fc3f7;\n  margin: 0 0 5px 0;\n  font-size: 1rem;\n}\n.info-content p {\n  color: #e0e0e0;\n  margin: 0;\n  line-height: 1.6;\n}\n.info-content a {\n  color: #4fc3f7;\n  text-decoration: none;\n  transition: color 0.3s ease;\n}\n.info-content a:hover {\n  color: #fff;\n}\n.quick-links {\n  list-style: none;\n  padding: 0;\n}\n.quick-links li {\n  margin-bottom: 12px;\n}\n.quick-links a {\n  color: #e0e0e0;\n  text-decoration: none;\n  transition: color 0.3s ease;\n  display: block;\n  padding: 8px 0;\n}\n.quick-links a:hover {\n  color: #4fc3f7;\n}\n.form-actions {\n  text-align: center;\n  padding: 40px 0;\n  display: flex;\n  gap: 20px;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n@media (max-width: 992px) {\n  .contact-layout {\n    grid-template-columns: 1fr;\n  }\n  .contact-info-column {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n    gap: 20px;\n  }\n}\n@media (max-width: 576px) {\n  .contact-info-column {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=contact.component.css.map */\n"] }]
  }], null, { heroVideoDesktop: [{
    type: ViewChild,
    args: ["heroVideoDesktop", { static: false }]
  }], heroVideoMobile: [{
    type: ViewChild,
    args: ["heroVideoMobile", { static: false }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ContactComponent, { className: "ContactComponent", filePath: "src/app/components/contact/contact.component.ts", lineNumber: 17 });
})();

// src/app/app.routes.ts
var routes = [
  { path: "", redirectTo: "pre-intro", pathMatch: "full" },
  { path: "pre-intro", component: PreIntroComponent, title: "PASC Region J Conference 2026" },
  { path: "intro", component: IntroComponent, title: "Welcome - PASC Region J" },
  { path: "home", component: HomeComponent, title: "Home - PASC Region J Conference 2026" },
  { path: "about", component: AboutComponent, title: "About - PASC Region J" },
  { path: "gallery", component: GalleryComponent, title: "Gallery - PASC Region J" },
  { path: "register", component: Register, title: "Registration - PASC Region J" },
  { path: "workshops", component: WorkshopsComponent, title: "Workshops - PASC Region J" },
  { path: "resources", component: ResourcesComponent, title: "Resources - PASC Region J" },
  { path: "contact", component: ContactComponent, title: "Contact - PASC Region J" },
  // Admin routes (lazy-loaded)
  {
    path: "admin",
    loadChildren: () => import("./chunk-LYPMDU36.js").then((m) => m.AdminModule),
    title: "Admin Panel - PASC Region J"
  },
  { path: "**", redirectTo: "pre-intro", pathMatch: "full" }
  // 404 redirect to pre-intro
];

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecureJsonInterceptor,
      multi: true
    }
  ]
};

// src/app/components/shared/header.component.ts
var _c09 = () => ({ exact: true });
var HeaderComponent = class _HeaderComponent {
  audioService;
  mobileMenuOpen = signal(false, ...ngDevMode ? [{ debugName: "mobileMenuOpen" }] : []);
  isPlaying = signal(false, ...ngDevMode ? [{ debugName: "isPlaying" }] : []);
  isMuted = signal(false, ...ngDevMode ? [{ debugName: "isMuted" }] : []);
  subscriptions = [];
  constructor(audioService) {
    this.audioService = audioService;
  }
  ngOnInit() {
    const playingSub = this.audioService.isPlaying$.subscribe((playing) => {
      this.isPlaying.set(playing);
    });
    const mutedSub = this.audioService.isMuted$.subscribe((muted) => {
      this.isMuted.set(muted);
    });
    this.subscriptions.push(playingSub, mutedSub);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  toggleMobileMenu() {
    this.mobileMenuOpen.update((value) => !value);
  }
  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
  togglePlayback() {
    this.audioService.toggle();
  }
  static \u0275fac = function HeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HeaderComponent)(\u0275\u0275directiveInject(AudioService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HeaderComponent, selectors: [["app-header"]], decls: 38, vars: 12, consts: [[1, "main-nav"], [1, "nav-container"], [1, "logo"], ["routerLink", "/home"], ["src", "/assets/img/logo.png", "alt", "PASC Region J", "id", "navLogo", 1, "logo-img"], [1, "logo-text"], [1, "nav-menu"], ["routerLink", "/home", "routerLinkActive", "active", 3, "click", "routerLinkActiveOptions"], ["routerLink", "/about", "routerLinkActive", "active", 3, "click"], ["routerLink", "/gallery", "routerLinkActive", "active", 3, "click"], ["routerLink", "/register", "routerLinkActive", "active", 3, "click"], ["routerLink", "/workshops", "routerLinkActive", "active", 3, "click"], ["routerLink", "/contact", "routerLinkActive", "active", 3, "click"], ["routerLink", "/resources", "routerLinkActive", "active", 3, "click"], ["id", "muteToggleBtn", "title", "Mute/Unmute", 1, "mute-toggle-btn", 3, "click"], ["id", "muteIcon", 1, "mute-icon"], ["id", "muteLabel", 1, "mute-label"], ["aria-label", "Toggle menu", 1, "mobile-menu-toggle", 3, "click"]], template: function HeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "nav", 0)(1, "div", 1)(2, "div", 2)(3, "a", 3);
      \u0275\u0275element(4, "img", 4);
      \u0275\u0275elementStart(5, "span", 5);
      \u0275\u0275text(6, "PASC REGION J");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(7, "ul", 6)(8, "li")(9, "a", 7);
      \u0275\u0275listener("click", function HeaderComponent_Template_a_click_9_listener() {
        return ctx.closeMobileMenu();
      });
      \u0275\u0275text(10, "Home");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "li")(12, "a", 8);
      \u0275\u0275listener("click", function HeaderComponent_Template_a_click_12_listener() {
        return ctx.closeMobileMenu();
      });
      \u0275\u0275text(13, "About");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "li")(15, "a", 9);
      \u0275\u0275listener("click", function HeaderComponent_Template_a_click_15_listener() {
        return ctx.closeMobileMenu();
      });
      \u0275\u0275text(16, "Gallery");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "li")(18, "a", 10);
      \u0275\u0275listener("click", function HeaderComponent_Template_a_click_18_listener() {
        return ctx.closeMobileMenu();
      });
      \u0275\u0275text(19, "Registration");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "li")(21, "a", 11);
      \u0275\u0275listener("click", function HeaderComponent_Template_a_click_21_listener() {
        return ctx.closeMobileMenu();
      });
      \u0275\u0275text(22, "Workshops");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "li")(24, "a", 12);
      \u0275\u0275listener("click", function HeaderComponent_Template_a_click_24_listener() {
        return ctx.closeMobileMenu();
      });
      \u0275\u0275text(25, "Contact");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "li")(27, "a", 13);
      \u0275\u0275listener("click", function HeaderComponent_Template_a_click_27_listener() {
        return ctx.closeMobileMenu();
      });
      \u0275\u0275text(28, "Resources");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(29, "button", 14);
      \u0275\u0275listener("click", function HeaderComponent_Template_button_click_29_listener() {
        return ctx.togglePlayback();
      });
      \u0275\u0275elementStart(30, "span", 15);
      \u0275\u0275text(31);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "span", 16);
      \u0275\u0275text(33);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(34, "button", 17);
      \u0275\u0275listener("click", function HeaderComponent_Template_button_click_34_listener() {
        return ctx.toggleMobileMenu();
      });
      \u0275\u0275element(35, "span")(36, "span")(37, "span");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275classProp("rotating", ctx.isPlaying());
      \u0275\u0275advance(3);
      \u0275\u0275classProp("active", ctx.mobileMenuOpen());
      \u0275\u0275advance(2);
      \u0275\u0275property("routerLinkActiveOptions", \u0275\u0275pureFunction0(11, _c09));
      \u0275\u0275advance(20);
      \u0275\u0275classProp("playing", ctx.isPlaying())("muted", !ctx.isPlaying());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.isPlaying() ? "\u{1F50A}" : "\u{1F507}");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.isPlaying() ? "MUTE" : "UNMUTE");
    }
  }, dependencies: [CommonModule, RouterModule, RouterLink, RouterLinkActive], styles: ["\n\n/*# sourceMappingURL=header.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderComponent, [{
    type: Component,
    args: [{ selector: "app-header", standalone: true, imports: [CommonModule, RouterModule], template: `
    <nav class="main-nav">
      <div class="nav-container">
        <div class="logo">
          <a routerLink="/home">
            <img
              src="/assets/img/logo.png"
              alt="PASC Region J"
              class="logo-img"
              id="navLogo"
              [class.rotating]="isPlaying()">
            <span class="logo-text">PASC REGION J</span>
          </a>
        </div>

        <ul class="nav-menu" [class.active]="mobileMenuOpen()">
          <li><a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobileMenu()">Home</a></li>
          <li><a routerLink="/about" routerLinkActive="active" (click)="closeMobileMenu()">About</a></li>
          <li><a routerLink="/gallery" routerLinkActive="active" (click)="closeMobileMenu()">Gallery</a></li>
          <li><a routerLink="/register" routerLinkActive="active" (click)="closeMobileMenu()">Registration</a></li>
          <li><a routerLink="/workshops" routerLinkActive="active" (click)="closeMobileMenu()">Workshops</a></li>
          <li><a routerLink="/contact" routerLinkActive="active" (click)="closeMobileMenu()">Contact</a></li>
          <li><a routerLink="/resources" routerLinkActive="active" (click)="closeMobileMenu()">Resources</a></li>
        </ul>

        <!-- Mute Toggle Button -->
        <button
          class="mute-toggle-btn"
          id="muteToggleBtn"
          (click)="togglePlayback()"
          title="Mute/Unmute"
          [class.playing]="isPlaying()"
          [class.muted]="!isPlaying()">
          <span class="mute-icon" id="muteIcon">{{ isPlaying() ? '&#128266;' : '&#128263;' }}</span>
          <span class="mute-label" id="muteLabel">{{ isPlaying() ? 'MUTE' : 'UNMUTE' }}</span>
        </button>

        <!-- Mobile menu toggle button -->
        <button class="mobile-menu-toggle" aria-label="Toggle menu" (click)="toggleMobileMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  `, styles: ["/* angular:styles/component:css;09171fdbf80922564b3ae1624ac3e5d676ef031875468863b79f053e0fd57b8e;C:/projects/GitHub/PASC_Region_J/Front_End/angular-app-source/src/app/components/shared/header.component.ts */\n/*# sourceMappingURL=header.component.css.map */\n"] }]
  }], () => [{ type: AudioService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HeaderComponent, { className: "HeaderComponent", filePath: "src/app/components/shared/header.component.ts", lineNumber: 61 });
})();

// src/app/components/shared/footer.component.ts
var FooterComponent = class _FooterComponent {
  currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  static \u0275fac = function FooterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FooterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FooterComponent, selectors: [["app-footer"]], decls: 59, vars: 1, consts: [[1, "site-footer"], [1, "container"], [1, "footer-grid"], [1, "footer-column"], [1, "footer-tagline"], ["routerLink", "/"], ["routerLink", "/about"], ["routerLink", "/gallery"], ["routerLink", "/workshops"], ["routerLink", "/resources"], ["routerLink", "/contact"], ["href", "mailto:info@pascregionj.com"], [1, "footer-bottom"], ["routerLink", "/admin", "title", "Admin Login", 1, "admin-link"], [1, "footer-credit"]], template: function FooterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "footer", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "h3");
      \u0275\u0275text(5, "PASC Region J");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p");
      \u0275\u0275text(7, "Pennsylvania Association of Student Councils - Region J");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "p", 4);
      \u0275\u0275text(9, "Reach for the Stars, Lead Beyond Limits");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div", 3)(11, "h4");
      \u0275\u0275text(12, "Quick Links");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "ul")(14, "li")(15, "a", 5);
      \u0275\u0275text(16, "Home");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "li")(18, "a", 6);
      \u0275\u0275text(19, "About");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "li")(21, "a", 7);
      \u0275\u0275text(22, "Gallery");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "li")(24, "a", 8);
      \u0275\u0275text(25, "Workshops");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(26, "div", 3)(27, "h4");
      \u0275\u0275text(28, "Resources");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "ul")(30, "li")(31, "a", 9);
      \u0275\u0275text(32, "Downloads");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "li")(34, "a", 10);
      \u0275\u0275text(35, "Contact Us");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(36, "div", 3)(37, "h4");
      \u0275\u0275text(38, "Conference 2026");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "p")(40, "strong");
      \u0275\u0275text(41, "Date:");
      \u0275\u0275elementEnd();
      \u0275\u0275text(42, " February 13, 2026");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "p")(44, "strong");
      \u0275\u0275text(45, "Location:");
      \u0275\u0275elementEnd();
      \u0275\u0275text(46, " Neshaminy High School, Langhorne, PA");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "p")(48, "strong");
      \u0275\u0275text(49, "Email:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "a", 11);
      \u0275\u0275text(51, "info@pascregionj.com");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(52, "div", 12)(53, "p");
      \u0275\u0275text(54);
      \u0275\u0275elementStart(55, "a", 13);
      \u0275\u0275text(56, "admin");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(57, "p", 14);
      \u0275\u0275text(58, "Powered by Angular & ColdFusion");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(54);
      \u0275\u0275textInterpolate1("\xA9 ", ctx.currentYear, " PASC Region J. All rights reserved. ");
    }
  }, dependencies: [CommonModule, RouterModule, RouterLink], styles: ["\n\n.site-footer[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #0a0e27 0%,\n      #1a1f3a 100%);\n  color: #e0e0e0;\n  padding: 60px 20px 20px;\n  border-top: 1px solid rgba(79, 195, 247, 0.3);\n}\n.footer-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 40px;\n  margin-bottom: 40px;\n}\n.footer-column[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n  margin-bottom: 15px;\n  font-size: 1.5rem;\n}\n.footer-column[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  color: #4fc3f7;\n  margin-bottom: 15px;\n  font-size: 1.1rem;\n}\n.footer-column[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 8px 0;\n  line-height: 1.6;\n  color: #b0b0b0;\n}\n.footer-tagline[_ngcontent-%COMP%] {\n  font-style: italic;\n  color: #ffd700;\n}\n.footer-column[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n}\n.footer-column[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-bottom: 10px;\n}\n.footer-column[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #e0e0e0;\n  text-decoration: none;\n  transition: color 0.3s ease;\n}\n.footer-column[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  color: #4fc3f7;\n}\n.footer-bottom[_ngcontent-%COMP%] {\n  text-align: center;\n  padding-top: 30px;\n  border-top: 1px solid rgba(79, 195, 247, 0.2);\n}\n.footer-bottom[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 5px 0;\n  color: #888;\n  font-size: 0.9rem;\n}\n.footer-credit[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n}\n.admin-link[_ngcontent-%COMP%] {\n  font-size: 0.8em;\n  color: #666;\n  margin-left: 1rem;\n  text-decoration: none;\n  transition: color 0.3s ease;\n}\n.admin-link[_ngcontent-%COMP%]:hover {\n  color: #4fc3f7;\n}\n@media (max-width: 768px) {\n  .footer-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 30px;\n  }\n}\n/*# sourceMappingURL=footer.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FooterComponent, [{
    type: Component,
    args: [{ selector: "app-footer", standalone: true, imports: [CommonModule, RouterModule], template: `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-column">
            <h3>PASC Region J</h3>
            <p>Pennsylvania Association of Student Councils - Region J</p>
            <p class="footer-tagline">Reach for the Stars, Lead Beyond Limits</p>
          </div>

          <div class="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/about">About</a></li>
              <li><a routerLink="/gallery">Gallery</a></li>
              <li><a routerLink="/workshops">Workshops</a></li>
            </ul>
          </div>

          <div class="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a routerLink="/resources">Downloads</a></li>
              <li><a routerLink="/contact">Contact Us</a></li>
            </ul>
          </div>

          <div class="footer-column">
            <h4>Conference 2026</h4>
            <p><strong>Date:</strong> February 13, 2026</p>
            <p><strong>Location:</strong> Neshaminy High School, Langhorne, PA</p>
            <p><strong>Email:</strong> <a href="mailto:info@pascregionj.com">info@pascregionj.com</a></p>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} PASC Region J. All rights reserved. <a routerLink="/admin" class="admin-link" title="Admin Login">admin</a></p>
          <p class="footer-credit">Powered by Angular & ColdFusion</p>
        </div>
      </div>
    </footer>
  `, styles: ["/* angular:styles/component:css;718b0f7260fef33667dc56d0d7dbc64c06a8d3b456430774e7c8322041518b65;C:/projects/GitHub/PASC_Region_J/Front_End/angular-app-source/src/app/components/shared/footer.component.ts */\n.site-footer {\n  background:\n    linear-gradient(\n      135deg,\n      #0a0e27 0%,\n      #1a1f3a 100%);\n  color: #e0e0e0;\n  padding: 60px 20px 20px;\n  border-top: 1px solid rgba(79, 195, 247, 0.3);\n}\n.footer-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 40px;\n  margin-bottom: 40px;\n}\n.footer-column h3 {\n  color: #4fc3f7;\n  margin-bottom: 15px;\n  font-size: 1.5rem;\n}\n.footer-column h4 {\n  color: #4fc3f7;\n  margin-bottom: 15px;\n  font-size: 1.1rem;\n}\n.footer-column p {\n  margin: 8px 0;\n  line-height: 1.6;\n  color: #b0b0b0;\n}\n.footer-tagline {\n  font-style: italic;\n  color: #ffd700;\n}\n.footer-column ul {\n  list-style: none;\n  padding: 0;\n}\n.footer-column ul li {\n  margin-bottom: 10px;\n}\n.footer-column a {\n  color: #e0e0e0;\n  text-decoration: none;\n  transition: color 0.3s ease;\n}\n.footer-column a:hover {\n  color: #4fc3f7;\n}\n.footer-bottom {\n  text-align: center;\n  padding-top: 30px;\n  border-top: 1px solid rgba(79, 195, 247, 0.2);\n}\n.footer-bottom p {\n  margin: 5px 0;\n  color: #888;\n  font-size: 0.9rem;\n}\n.footer-credit {\n  font-size: 0.85rem;\n}\n.admin-link {\n  font-size: 0.8em;\n  color: #666;\n  margin-left: 1rem;\n  text-decoration: none;\n  transition: color 0.3s ease;\n}\n.admin-link:hover {\n  color: #4fc3f7;\n}\n@media (max-width: 768px) {\n  .footer-grid {\n    grid-template-columns: 1fr;\n    gap: 30px;\n  }\n}\n/*# sourceMappingURL=footer.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FooterComponent, { className: "FooterComponent", filePath: "src/app/components/shared/footer.component.ts", lineNumber: 145 });
})();

// src/app/core/services/favicon.service.ts
var FaviconService = class _FaviconService {
  document;
  audioService;
  canvas;
  ctx;
  favicon = null;
  isRotating = false;
  rotationAngle = 0;
  animationFrameId = null;
  originalImage = null;
  constructor(document2, audioService) {
    this.document = document2;
    this.audioService = audioService;
    this.canvas = this.document.createElement("canvas");
    this.canvas.width = 32;
    this.canvas.height = 32;
    this.ctx = this.canvas.getContext("2d");
  }
  /**
   * Initialize the favicon service
   */
  initialize() {
    this.favicon = this.document.getElementById("favicon");
    if (!this.favicon) {
      console.warn("Favicon element not found");
      return;
    }
    this.loadOriginalImage();
    this.audioService.isPlaying$.subscribe((isPlaying) => {
      if (isPlaying) {
        this.startRotation();
      } else {
        this.stopRotation();
      }
    });
  }
  /**
   * Load the original favicon image
   */
  loadOriginalImage() {
    if (!this.favicon)
      return;
    this.originalImage = new Image();
    this.originalImage.crossOrigin = "anonymous";
    this.originalImage.src = this.favicon.href;
    this.originalImage.onload = () => {
      console.log("Favicon image loaded successfully");
    };
    this.originalImage.onerror = () => {
      console.error("Failed to load favicon image");
    };
  }
  /**
   * Start rotating the favicon
   */
  startRotation() {
    if (this.isRotating || !this.originalImage || !this.favicon)
      return;
    this.isRotating = true;
    this.rotationAngle = 0;
    this.animate();
  }
  /**
   * Stop rotating the favicon
   */
  stopRotation() {
    if (!this.isRotating)
      return;
    this.isRotating = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.favicon && this.originalImage) {
      this.favicon.href = this.originalImage.src;
    }
  }
  /**
   * Animation loop
   */
  animate = () => {
    if (!this.isRotating || !this.originalImage || !this.favicon)
      return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.rotate(this.rotationAngle * Math.PI / 180);
    this.ctx.drawImage(this.originalImage, -this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
    this.ctx.restore();
    this.favicon.href = this.canvas.toDataURL("image/png");
    this.rotationAngle = (this.rotationAngle + 3) % 360;
    this.animationFrameId = requestAnimationFrame(this.animate);
  };
  /**
   * Clean up on service destruction
   */
  ngOnDestroy() {
    this.stopRotation();
  }
  static \u0275fac = function FaviconService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FaviconService)(\u0275\u0275inject(DOCUMENT), \u0275\u0275inject(AudioService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FaviconService, factory: _FaviconService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaviconService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: Document, decorators: [{
    type: Inject,
    args: [DOCUMENT]
  }] }, { type: AudioService }], null);
})();

// src/app/app.ts
function App_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-header");
  }
}
function App_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-footer");
  }
}
var App = class _App {
  router;
  faviconService;
  audioService;
  showHeaderFooter = signal(true, ...ngDevMode ? [{ debugName: "showHeaderFooter" }] : []);
  constructor(router, faviconService, audioService) {
    this.router = router;
    this.faviconService = faviconService;
    this.audioService = audioService;
  }
  ngOnInit() {
    this.faviconService.initialize();
    this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe((event) => {
      const url = event.url;
      if (url.startsWith("/admin")) {
        this.audioService.pause();
      }
    });
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      const url = event.urlAfterRedirects || event.url;
      const hideRoutes = ["/pre-intro", "/intro", "/admin"];
      this.showHeaderFooter.set(!hideRoutes.some((route) => url.startsWith(route)));
    });
  }
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(FaviconService), \u0275\u0275directiveInject(AudioService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 4, vars: 4, consts: [[1, "main-content"]], template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, App_Conditional_0_Template, 1, 0, "app-header");
      \u0275\u0275elementStart(1, "main", 0);
      \u0275\u0275element(2, "router-outlet");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, App_Conditional_3_Template, 1, 0, "app-footer");
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.showHeaderFooter() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275classProp("fullscreen", !ctx.showHeaderFooter());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.showHeaderFooter() ? 3 : -1);
    }
  }, dependencies: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent], styles: ["\n\n.main-content[_ngcontent-%COMP%] {\n  min-height: calc(100vh - 200px);\n}\n.main-content.fullscreen[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  padding: 0;\n  margin: 0;\n}\n/*# sourceMappingURL=app.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{ selector: "app-root", standalone: true, imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent], template: '@if (showHeaderFooter()) {\r\n  <app-header></app-header>\r\n}\r\n\r\n<main class="main-content" [class.fullscreen]="!showHeaderFooter()">\r\n  <router-outlet></router-outlet>\r\n</main>\r\n\r\n@if (showHeaderFooter()) {\r\n  <app-footer></app-footer>\r\n}\r\n', styles: ["/* src/app/app.css */\n.main-content {\n  min-height: calc(100vh - 200px);\n}\n.main-content.fullscreen {\n  min-height: 100vh;\n  padding: 0;\n  margin: 0;\n}\n/*# sourceMappingURL=app.css.map */\n"] }]
  }], () => [{ type: Router }, { type: FaviconService }, { type: AudioService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 17 });
})();

// src/main.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
