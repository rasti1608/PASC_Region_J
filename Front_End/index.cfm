<cfprocessingdirective pageencoding="utf-8">
<!---
*******************************************************************************
* File:        /index.cfm
* Created:     October 25, 2025
* Updated:     November 1, 2025 - Added pre-intro splash for audio permission
* Author:      Rastislav Toscak
* 
* Purpose:     Homepage for PASC Region J Conference 2026 website
*              Features animated intro sequence with audio
*
* Flow:        1. Pre-intro splash (LAUNCH SITE button)
*              2. Animated intro with audio (7-10 seconds)
*              3. Main site content
*
* Project:     PASC Region J Conference 2026 Website
*              Reach for the stars, lead beyond limits - February 13, 2026
*******************************************************************************
--->

<!--- ============================================================================
    ROUTING LOGIC - Frontend Version Selector
    ============================================================================
    Purpose: Redirect visitors to the appropriate frontend version of the site
    
    Default Behavior: 
    - pascregionj.com redirects to /angular-app/ (Angular version)
    
    Override Parameters (use in URL):
    - ?cf=1       → Shows original ColdFusion homepage (legacy version)
    - ?angular=1  → Explicitly redirects to Angular version
    - ?react=1    → Future: redirects to React version (when implemented)
    
    Examples:
    - pascregionj.com              → /angular-app/ (default)
    - pascregionj.com?cf=1         → Shows this CF page
    - pascregionj.com?angular=1    → /angular-app/
    - pascregionj.com?react=1      → /react-app/ (future)
    
    Note: All other site functionality (/admin/, /api/, .cfm files) remains
    accessible at their original URLs regardless of this redirect logic.
    
    Created: November 28, 2025
    Author: Rastislav Toscak
    ============================================================================ --->

<cfparam name="url.cf" default="0">
<cfparam name="url.angular" default="0">
<cfparam name="url.react" default="0">

<cfif url.cf NEQ "1" AND url.angular NEQ "1" AND url.react NEQ "1">
    <cflocation url="/angular-app/" addtoken="false">
</cfif>

<!--- Include database configuration --->
<cfinclude template="includes/db_config.cfm">

<cfsilent>
<!--- Include database configuration --->
<cfinclude template="includes/db_config.cfm">

<!--- Fetch active announcements --->
<cfquery name="qAnnouncements" datasource="#application.datasource#">
    SELECT 
        id,
        title,
        content,
        publish_start,
        publish_end,
        is_featured,
        display_order
    FROM dbo.announcements
    WHERE is_active = 1
        AND publish_start <= GETDATE()
        AND (publish_end IS NULL OR publish_end >= GETDATE())
    ORDER BY display_order ASC
</cfquery>

</cfsilent>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PASC Region J Conference 2026 - Reach for the Stars, Lead Beyond Limits</title>
    <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="/assets/css/mobile-menu.css">
    <link rel="stylesheet" href="/assets/css/hero-video.css">
    <link rel="stylesheet" href="/assets/css/animations.css">
    <link rel="stylesheet" href="/assets/css/anthem-player.css">
    <link rel="stylesheet" href="/assets/css/intro-splash.css">
    <link rel="icon" type="image/png" href="/assets/img/favicon.png">
    
</head>
<body class="index-page">
    <!--- PRE-INTRO SPLASH SCREEN (NEW) --->
    <div id="pre-intro-splash">
        <!--- Background Video (optional - same as intro or static) --->
        <video class="pre-intro-bg-video" autoplay muted loop playsinline>
            <source src="/assets/video/intro-space-background.mp4" type="video/mp4">
        </video>
        
        <div class="pre-intro-content">
            <img src="/assets/img/logo.png" alt="PASC Region J" class="pre-intro-logo">
            <h1 class="pre-intro-title">PASC REGION <span class="special-j">J</span></h1>
            <p class="pre-intro-subtitle">Leadership Conference 2026</p>
            <p class="pre-intro-date">Reach for the Stars, Lead Beyond Limits &middot; February 13, 2026</p>
            
            <button class="launch-button" onclick="launchSite()">
                <span class="rocket-icon">🚀</span>
                <span>LAUNCH SITE</span>
            </button>
        </div>
    </div>

    <!--- Animated Intro Splash Screen (EXISTING - Now with Audio) --->
    <div id="intro-splash" style="display: none;">
        <!--- Intro Video Backgrounds WITH AUDIO --->
        <video id="introVideoDesktop" class="intro-video intro-video-desktop" muted loop playsinline>
            <source src="/assets/video/intro-space-background.mp4" type="video/mp4">
        </video>
        
        <video id="introVideoMobile" class="intro-video intro-video-mobile" muted loop playsinline>
            <source src="/assets/video/intro-space-background_M.mp4" type="video/mp4">
        </video>
        
        <div class="stars" id="stars"></div>
        
        <div class="planet-container">
            <div class="orbit orbit-1">
                <div class="planet planet-1">
                    <img src="/assets/img/orbit-planet-1.png" alt="Moon">
                </div>
            </div>
            <div class="orbit orbit-2">
                <div class="planet planet-2">
                    <img src="/assets/img/orbit-planet-2.png" alt="Earth">
                </div>
            </div>
            <div class="orbit orbit-3">
                <div class="planet planet-3">
                    <img src="/assets/img/orbit-planet-3.png" alt="Mars">
                </div>
            </div>
            <div class="orbit orbit-4">
                <div class="planet planet-4">
                    <img src="/assets/img/orbit-planet-4.png" alt="Saturn">
                </div>
            </div>
            <div class="center-logo"></div>
        </div>
        
        <div class="intro-text">
            <h1 class="intro-title">PASC REGION <span class="special-j">J</span></h1>
            <p class="intro-subtitle">Reach for the Stars, Lead Beyond Limits</p>
            <p class="intro-date">February 13, 2026</p>
            <p class="hero-subtitle-accent">Hosted by Neshaminy High School</p>
        </div>
        
        <button class="skip-btn" onclick="skipIntro()">Skip Intro →</button>
    </div>

    <!--- Main Site Content --->
    <div id="main-site">

<!--- Include header --->
<cfinclude template="includes/header.cfm">

<!--- Hero Section --->
<section class="hero">
    <!--- Video Background - Desktop --->
    <video id="heroVideo" class="hero-video hero-video-desktop" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
        <source src="/assets/video/space-background.webm" type="video/webm">
    </video>
    
    <!--- Video Background - Mobile --->
    <video id="heroVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>
        <source src="/assets/video/space-background_M.mp4" type="video/mp4">
    </video>
    
    <div class="hero-content">
        <div class="stars-background"></div>
        <div class="hero-text">
            <h1 class="hero-title" id="heroTitle">PASC REGION J CONFERENCE 2026</h1>
            <p class="hero-subtitle" id="heroSubtitle">Reach for the Stars, Lead Beyond Limits - February 13, 2026</p>

            <div class="hero-buttons">
                <a href="workshops.cfm" class="btn btn-primary">Register Now</a>
                <a href="about.cfm" class="btn btn-secondary">Learn More</a>
            </div>
        </div>
    </div>
</section>

<!--- Announcements Section --->
<section class="announcements-section">
    <div class="container">
        <h2 class="section-title">Latest Announcements</h2>
        
        <cfif qAnnouncements.recordCount GT 0>
            <div class="announcements-grid">
                <cfoutput query="qAnnouncements">
                    <div class="announcement-card <cfif is_featured>featured</cfif>">
                        <cfif is_featured>
                            <span class="featured-badge">⭐ Featured</span>
                        </cfif>
                        <h3>#htmlEditFormat(title)#</h3>
                        <p>#htmlEditFormat(content)#</p>
                        <span class="announcement-date">#dateFormat(publish_start, "mmmm d, yyyy")#</span>
                    </div>
                </cfoutput>
            </div>
        <cfelse>
            <p class="no-announcements">No announcements at this time. Check back soon!</p>
        </cfif>
    </div>
</section>

<!--- Quick Info Section --->
<section class="quick-info">
    <div class="container">
        <div class="info-grid">
            <div class="info-card">
                <div class="info-icon">📆</div>
                <h3>Event Date</h3>
                <p>February 13, 2026</p>
            </div>
            
            <div class="info-card">
                <div class="info-icon">🎓</div>
                <h3>Who Can Attend</h3>
                <p>Student Council Members within Region J</p>
            </div>
            
            <div class="info-card">
                <div class="info-icon">🚀</div>
                <h3>Theme</h3>
                <p>Navigating the Stars</p>
            </div>
            
            <div class="info-card">
                <div class="info-icon">📋</div>
                <h3>Registration</h3>
                <p>January 5-23, 2026</p>
            </div>
        </div>
    </div>
</section>

<!--- Call to Action Section --->
<section class="cta-section">
    <div class="container">
        <h2>Ready to Reach for the Stars, Lead Beyond Limits?</h2>
        <p>Join us for an inspiring day of leadership, workshops, and networking!</p>
        <div class="cta-buttons">
            <a href="workshops.cfm" class="btn btn-large btn-primary">Register for the Conference</a>
            <a href="workshops.cfm" class="btn btn-large btn-outline">Apply to Present a Workshop</a>
        </div>
    </div>
</section>

<!--- Include footer --->
<cfinclude template="includes/footer.cfm">

    </div> <!--- End #main-site --->

    <script>
        // ═══════════════════════════════════════════════════════════════
        // PRE-INTRO TO INTRO TRANSITION (NEW)
        // ═══════════════════════════════════════════════════════════════
        
        function launchSite() {
            const preIntro = document.getElementById('pre-intro-splash');
            const intro = document.getElementById('intro-splash');
            
            // Fade out pre-intro
            preIntro.classList.add('fade-out');
            
            setTimeout(function() {
                preIntro.style.display = 'none';
                intro.style.display = 'block';
                
                // UNMUTE AND PLAY INTRO VIDEO WITH AUDIO
                const desktopVideo = document.getElementById('introVideoDesktop');
                const mobileVideo = document.getElementById('introVideoMobile');
                
                // Determine which video is active
                const activeVideo = window.innerWidth <= 768 ? mobileVideo : desktopVideo;
                
                // Unmute the active video (NOW AUDIO WILL PLAY!)
                activeVideo.muted = false;
                activeVideo.play();
                
                // Start intro animation
                createStars();
                intro.classList.add('loaded');
                
                // Mark intro as seen
                sessionStorage.setItem('introSeen', 'true');
                
                // Auto-skip intro after 10 seconds (adjust as needed)
                setTimeout(function() {
                    skipIntro();
                }, 10000); // 10 seconds - change to 7000 for 7 seconds
            }, 800);
        }
        
        // ═══════════════════════════════════════════════════════════════
        // EXISTING INTRO FUNCTIONS
        // ═══════════════════════════════════════════════════════════════
        
        // Generate random stars
        function createStars() {
            const starsContainer = document.getElementById('stars');
            if (!starsContainer) return;
            
            // Clear existing stars first
            starsContainer.innerHTML = '';
            
            const starCount = 100;
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                const size = Math.random() * 3 + 1;
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                star.style.animationDelay = Math.random() * 3 + 's';
                starsContainer.appendChild(star);
            }
        }
        
        // Skip intro and show main site
        function skipIntro() {
            const intro = document.getElementById('intro-splash');
            const mainSite = document.getElementById('main-site');

            // Mute intro videos when skipping
            const desktopVideo = document.getElementById('introVideoDesktop');
            const mobileVideo = document.getElementById('introVideoMobile');
            if (desktopVideo) desktopVideo.muted = true;
            if (mobileVideo) mobileVideo.muted = true;

            intro.classList.add('fade-out');
            mainSite.classList.add('visible');

            // AUTO-START BACKGROUND MUSIC
            const globalAudio = document.getElementById('globalAnthemAudio');
            if (globalAudio && globalAudio.paused) {
                globalAudio.play().then(() => {
                    sessionStorage.setItem('anthemPlaying', 'true');
                    // Trigger animations if not muted
                    if (typeof updateAllAnimations === 'function' && !globalAudio.muted) {
                        updateAllAnimations(true);
                    }
                }).catch(err => console.log('Auto-play prevented:', err));
            }

            setTimeout(() => {
                intro.style.display = 'none';
            }, 800);
        }
        
        // ═══════════════════════════════════════════════════════════════
        // INITIALIZE ON PAGE LOAD
        // ═══════════════════════════════════════════════════════════════
        
        window.addEventListener('DOMContentLoaded', function() {
            // Check if intro sequence was already seen this session
            if (sessionStorage.getItem('introSeen')) {
                // Skip entire intro sequence if already seen
                const preIntro = document.getElementById('pre-intro-splash');
                const intro = document.getElementById('intro-splash');
                const mainSite = document.getElementById('main-site');
                
                preIntro.style.display = 'none';
                intro.style.display = 'none';
                mainSite.classList.add('visible');
            } else {
                // Show pre-intro splash (user must click LAUNCH SITE)
                const preIntro = document.getElementById('pre-intro-splash');
                preIntro.style.display = 'flex';
            }
        });
        
        // ═══════════════════════════════════════════════════════════════
        // INDEX PAGE ANTHEM PLAYER (EXISTING)
        // ═══════════════════════════════════════════════════════════════
        
        window.addEventListener('DOMContentLoaded', function() {
            // Get global audio from header
            const globalAudio = document.getElementById('globalAnthemAudio');
            if (!globalAudio) return;
            
            // Format time helper
            function formatTime(seconds) {
                if (isNaN(seconds)) return '0:00';
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return mins + ':' + (secs < 10 ? '0' : '') + secs;
            }
            
            // Update progress bars and times
            globalAudio.addEventListener('timeupdate', function() {
                const progress = (globalAudio.currentTime / globalAudio.duration) * 100;
                
                // Desktop player
                const progressFill = document.getElementById('anthemProgressFillIndex');
                const currentTime = document.getElementById('anthemCurrentTimeIndex');
                if (progressFill && !isNaN(progress)) progressFill.style.width = progress + '%';
                if (currentTime) currentTime.textContent = formatTime(globalAudio.currentTime);
                
                // Mobile player
                const progressFillMobile = document.getElementById('anthemProgressFillIndexMobile');
                const currentTimeMobile = document.getElementById('anthemCurrentTimeIndexMobile');
                if (progressFillMobile && !isNaN(progress)) progressFillMobile.style.width = progress + '%';
                if (currentTimeMobile) currentTimeMobile.textContent = formatTime(globalAudio.currentTime);
            });
            
            // Update total duration when loaded
            globalAudio.addEventListener('loadedmetadata', function() {
                const totalTime = document.getElementById('anthemTotalTimeIndex');
                const totalTimeMobile = document.getElementById('anthemTotalTimeIndexMobile');
                const duration = formatTime(globalAudio.duration);
                if (totalTime) totalTime.textContent = duration;
                if (totalTimeMobile) totalTimeMobile.textContent = duration;
            });
            
            // Check if already loaded
            if (globalAudio.readyState >= 1) {
                const totalTime = document.getElementById('anthemTotalTimeIndex');
                const totalTimeMobile = document.getElementById('anthemTotalTimeIndexMobile');
                const duration = formatTime(globalAudio.duration);
                if (totalTime) totalTime.textContent = duration;
                if (totalTimeMobile) totalTimeMobile.textContent = duration;
            }
        });
        
        // Seek functionality for index page
        function seekIndexAnthem(event) {
            const globalAudio = document.getElementById('globalAnthemAudio');
            if (!globalAudio) return;
            
            const progressBar = event.currentTarget;
            const clickX = event.offsetX;
            const width = progressBar.offsetWidth;
            const seekTime = (clickX / width) * globalAudio.duration;
            globalAudio.currentTime = seekTime;
        }
    </script>
</body>
</html>
