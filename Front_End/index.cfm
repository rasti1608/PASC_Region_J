<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
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
    
    <style>
        /* CRITICAL: Ensure planet-container is centered */
        #intro-splash .planet-container {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
        }
        /* Pre-Intro Splash Screen Styles */
        #pre-intro-splash {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2d3561 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 1;
            transition: opacity 0.8s ease;
        }
        
        #pre-intro-splash.fade-out {
            opacity: 0;
            pointer-events: none;
        }
        
        .pre-intro-bg-video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.4;
            z-index: -1;
        }
        
        .pre-intro-content {
            text-align: center;
            z-index: 2;
            animation: fadeInUp 1s ease;
        }
        
        .pre-intro-logo {
            width: 120px;
            height: 120px;
            margin-bottom: 30px;
            animation: pulse 2s infinite;
        }
        
        .pre-intro-title {
            font-size: 3rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 15px;
            text-shadow: 0 0 30px rgba(79, 195, 247, 0.5);
            letter-spacing: 2px;
        }
        
        /* Special styling for the J only */
        .pre-intro-title .special-j {
            font-size: 5rem;
            font-weight: 900;
            font-family: 'Century Schoolbook', 'Century Schoolbook Bold', 'Georgia', serif;
            color: #FF9800;
            display: inline-block;
            font-style: italic;
            transform: rotate(8deg) scaleX(1.3);
            animation: glowJ 2s ease-in-out infinite;
            -webkit-text-stroke: 2px #FF9800;
            text-stroke: 2px #FF9800;
            letter-spacing: 2px;
        }
        
        @keyframes glowJ {
            0%, 100% {
                text-shadow: 0 0 20px rgba(255, 152, 0, 0.8);
            }
            50% {
                text-shadow: 0 0 40px rgba(255, 152, 0, 1), 0 0 60px rgba(255, 152, 0, 0.6);
            }
        }
        
        /* Apply special J to both pre-intro and animated intro */
        .intro-title .special-j {
            font-size: 5rem;
            font-weight: 900;
            font-family: 'Century Schoolbook', 'Century Schoolbook Bold', 'Georgia', serif;
            color: #FF9800;
            display: inline-block;
            font-style: italic;
            transform: rotate(8deg) scaleX(1.3);
            animation: glowJ 2s ease-in-out infinite;
            -webkit-text-stroke: 2px #FF9800;
            text-stroke: 2px #FF9800;
            letter-spacing: 2px;
        }
        
        .pre-intro-subtitle {
            font-size: 1.5rem;
            color: #4fc3f7;
            margin-bottom: 10px;
            font-weight: 300;
        }
        
        .pre-intro-date {
            font-size: 1.1rem;
            color: #b0b8d4;
            margin-bottom: 50px;
        }
        
        .launch-button {
            background: linear-gradient(135deg, #4fc3f7 0%, #2196f3 100%);
            color: #ffffff;
            font-size: 1.3rem;
            font-weight: 700;
            padding: 20px 60px;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(79, 195, 247, 0.4);
            display: flex;
            align-items: center;
            gap: 15px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 0 auto;
        }
        
        .launch-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(79, 195, 247, 0.6);
            background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
        }
        
        .launch-button:active {
            transform: translateY(-1px);
        }
        
        .rocket-icon {
            font-size: 1.5rem;
            animation: rocketBounce 1s infinite;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        @keyframes rocketBounce {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-5px);
            }
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .pre-intro-title {
                font-size: 2rem;
            }
            
            .pre-intro-title .special-j,
            .intro-title .special-j {
                font-size: 3.2rem;
            }
            
            .pre-intro-subtitle {
                font-size: 1.2rem;
            }
            
            .pre-intro-date {
                font-size: 1rem;
            }
            
            .launch-button {
                font-size: 1.1rem;
                padding: 18px 40px;
            }
            
            .pre-intro-logo {
                width: 80px;
                height: 80px;
            }
        }
    </style>
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
            <p class="pre-intro-date">Lead Beyond Limits &middot; February 13, 2026</p>
            
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
        
        <cfif qAnnouncements.recordCount GT 0>
            <div class="announcements-grid">
                <cfoutput query="qAnnouncements" maxrows="3">
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
