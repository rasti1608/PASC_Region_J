<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /index.cfm
* Created:     October 25, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Homepage for PASC Region J Conference 2026 website
*              Displays hero section with conference title and tagline
*              Shows active announcements from database
*              Includes quick info cards and call-to-action sections
*
* Sections:    1. Hero section with space theme
*              2. Announcements grid (dynamic from database)
*              3. Quick info cards
*              4. Call-to-action buttons
*
* Database:    Queries dbo.announcements table
*              Uses publish_start and publish_end for date filtering
*
* Project:     PASC Region J Conference 2026 Website
*              Lead Beyond Limits - February 13, 2026
*******************************************************************************
--->

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
    <title>PASC Region J Conference 2026 - Lead Beyond Limits</title>
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
    <!--- Animated Intro Splash Screen --->
    <div id="intro-splash">
        <!--- Intro Video Backgrounds --->
        <video class="intro-video intro-video-desktop" autoplay muted loop playsinline>
            <source src="/assets/video/intro-space-background.mp4" type="video/mp4">
        </video>
        
        <video class="intro-video intro-video-mobile" autoplay muted loop playsinline>
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
            <h1 class="intro-title">PASC REGION J</h1>
            <p class="intro-subtitle">Lead Beyond Limits</p>
            <p class="intro-date">February 13, 2026</p>
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
            <p class="hero-subtitle" id="heroSubtitle">Lead Beyond Limits - February 13, 2026</p>
            
            <!--- Conference Anthem Player
            <div class="anthem-player">
                <div class="anthem-icon">&#127925;</div>
                <div class="anthem-info">
                    <div class="anthem-title">Conference Anthem: "One Orbit"</div>
                    <div class="anthem-subtitle">by IronRUST &middot; We're all on one orbit</div>
                    <div class="anthem-progress-container">
                        <div class="anthem-progress-bar" onclick="seekIndexAnthem(event)">
                            <div class="anthem-progress-fill" id="anthemProgressFillIndex"></div>
                        </div>
                        <div class="anthem-time-display">
                            <span id="anthemCurrentTimeIndex">0:00</span> / <span id="anthemTotalTimeIndex">0:00</span>
                        </div>
                    </div>
                </div>
                <button id="anthemPlayBtn" class="anthem-play-btn" onclick="toggleAnthem()">
                    <i class="play-icon">&#9654;</i>
                </button>
            </div> --->
            
            <!--- Mobile-Only Anthem Player (ABOVE buttons) --->
            <div class="anthem-player-mobile">
                <div class="anthem-icon-mobile">&#127925;</div>
                <div class="anthem-info-mobile">
                    <div class="anthem-title-mobile">"One Orbit"</div>
                    <div class="anthem-credit-mobile">Conference Anthem by IronRUST</div>
                    <div class="anthem-progress-container-mobile">
                        <div class="anthem-progress-bar-mobile" onclick="seekIndexAnthem(event)">
                            <div class="anthem-progress-fill-mobile" id="anthemProgressFillIndexMobile"></div>
                        </div>
                        <div class="anthem-time-display-mobile">
                            <span id="anthemCurrentTimeIndexMobile">0:00</span> / <span id="anthemTotalTimeIndexMobile">0:00</span>
                        </div>
                    </div>
                </div>
                <button class="anthem-btn-mobile" onclick="toggleAnthem()">
                    <span class="play-icon-mobile">&#9654;</span>
                </button>
            </div>
            
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
        
        <cfif qAnnouncements.recordCount gt 0>
            <div class="announcements-grid">
                <cfoutput query="qAnnouncements">
                    <article class="announcement-card <cfif is_featured>featured</cfif>">
                        <div class="announcement-header">
                            <h3 class="announcement-title">#title#</h3>
                            <time class="announcement-date" datetime="#dateFormat(publish_start, 'yyyy-mm-dd')#">
                                #dateFormat(publish_start, "mmmm d, yyyy")#
                            </time>
                        </div>
                        <div class="announcement-content">
                            #content#
                        </div>
                        <cfif is_featured>
                            <span class="featured-badge">Featured</span>
                        </cfif>
                    </article>
                </cfoutput>
            </div>
        <cfelse>
            <div class="no-announcements">
                <p>No announcements at this time. Check back soon!</p>
            </div>
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
                <p>Student Council Members & Leaders</p>
            </div>
            
            <div class="info-card">
                <div class="info-icon">🚀</div>
                <h3>Theme</h3>
                <p>Space & Solar System</p>
            </div>
            
            <div class="info-card">
                <div class="info-icon">📋</div>
                <h3>Registration</h3>
                <p>Opens January 5, 2026</p>
            </div>
        </div>
    </div>
</section>

<!--- Call to Action Section --->
<section class="cta-section">
    <div class="container">
        <h2>Ready to Lead Beyond Limits?</h2>
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
        // Generate random stars
        function createStars() {
            const starsContainer = document.getElementById('stars');
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
            const splash = document.getElementById('intro-splash');
            const mainSite = document.getElementById('main-site');
            
            splash.classList.add('fade-out');
            mainSite.classList.add('visible');
            
            setTimeout(() => {
                splash.style.display = 'none';
            }, 800);
        }
        
        // Initialize on page load
        window.addEventListener('DOMContentLoaded', function() {
            // Check if intro was already seen this session
            if (sessionStorage.getItem('introSeen')) {
                // Skip intro immediately if already seen
                const splash = document.getElementById('intro-splash');
                const mainSite = document.getElementById('main-site');
                splash.style.display = 'none';
                mainSite.classList.add('visible');
            } else {
                // Show intro for first time this session
                createStars();
                
                // Wait for intro videos to load before showing intro
                const desktopVideo = document.querySelector('.intro-video-desktop');
                const mobileVideo = document.querySelector('.intro-video-mobile');
                const splash = document.getElementById('intro-splash');
                
                // Determine which video is active based on screen size
                const activeVideo = window.innerWidth <= 768 ? mobileVideo : desktopVideo;
                
                // Function to show intro once video is ready
                function showIntro() {
                    splash.classList.add('loaded');
                    
                    // Mark intro as seen for this session
                    sessionStorage.setItem('introSeen', 'true');
                    
                    // Auto-skip intro after 7 seconds
                    setTimeout(function() {
                        skipIntro();
                    }, 7000);
                }
                
                // Check if video is already loaded
                if (activeVideo.readyState >= 3) {
                    // Video is already loaded
                    showIntro();
                } else {
                    // Wait for video to load
                    activeVideo.addEventListener('canplay', showIntro, { once: true });
                    
                    // Fallback: show after 2 seconds even if video not loaded
                    setTimeout(showIntro, 2000);
                }
            }
        });
        
        // Index Page Progress Bar Updates
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
