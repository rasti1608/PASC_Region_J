<cfprocessingdirective pageencoding="utf-8">
<!--- TEST --->
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
    <link rel="icon" type="image/png" href="/assets/img/favicon.png">
    
    <style>
        /* Intro Splash Screen Styles */
        body { overflow-x: hidden; }
        
        #intro-splash {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.8s ease-in-out;
            overflow: hidden;
            opacity: 0; /* Hidden until video loads */
            background: linear-gradient(135deg, #1a0033 0%, #2d1b4e 50%, #1a0033 100%); /* Loading background */
        }
        
        #intro-splash.loaded {
            opacity: 1; /* Show when video is ready */
        }
        
        /* Intro Video Backgrounds */
        .intro-video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: -1;
        }
        
        .intro-video-desktop {
            display: block;
        }
        
        .intro-video-mobile {
            display: none;
        }
        
        #intro-splash.fade-out {
            opacity: 0;
            pointer-events: none;
        }
        
        .stars { position: absolute; width: 100%; height: 100%; overflow: hidden; }
        .star { position: absolute; background: white; border-radius: 50%; animation: twinkle 3s infinite; }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
        
        .planet-container { position: relative; width: 640px; height: 640px; margin-bottom: 40px; }
        .orbit { position: absolute; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .orbit-1 { width: 260px; height: 260px; animation: rotate 8s linear infinite; animation-delay: 0s; }
        .orbit-2 { width: 380px; height: 380px; animation: rotate 12s linear infinite reverse; animation-delay: -9s; }
        .orbit-3 { width: 500px; height: 500px; animation: rotate 16s linear infinite; animation-delay: -4s; }
        .orbit-4 { width: 620px; height: 620px; animation: rotate 20s linear infinite reverse; animation-delay: -15s; }
        
        @keyframes rotate {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .planet {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .planet img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.4));
        }
        
        .planet-1 {
            width: 35px;
            height: 35px;
        }
        
        .planet-2 {
            width: 55px;
            height: 55px;
        }
        
        .planet-3 {
            width: 45px;
            height: 45px;
        }
        
        .planet-4 {
            width: 65px;
            height: 65px;
        }
        
        .center-logo {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 150px;
            height: 150px;
            background-image: url('/assets/img/logo.png');
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 50%;
            box-shadow: 0 0 80px rgba(255, 140, 66, 0.6);
            animation: pulse 2s ease-in-out infinite, rotate360 20s linear infinite;
        }
        
        @keyframes rotate360 {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes pulse {
            0%, 100% { 
                box-shadow: 0 0 80px rgba(255, 140, 66, 0.6);
                filter: brightness(1);
            }
            50% { 
                box-shadow: 0 0 120px rgba(255, 140, 66, 0.9);
                filter: brightness(1.2);
            }
        }
        
        .intro-text { text-align: center; color: white; z-index: 10; }
        .intro-title { font-size: 3rem; font-weight: bold; margin-bottom: 20px; opacity: 0; animation: fadeInUp 1s ease-out 0.5s forwards; text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
        .intro-subtitle { font-size: 1.5rem; color: #ffd700; opacity: 0; animation: fadeInUp 1s ease-out 1.5s forwards; text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
        .intro-date { font-size: 1.2rem; color: #00d4ff; margin-top: 10px; opacity: 0; animation: fadeInUp 1s ease-out 2s forwards; }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .skip-btn {
            position: absolute;
            bottom: 40px;
            right: 40px;
            padding: 12px 30px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            font-size: 1rem;
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.3s;
            opacity: 0;
            animation: fadeIn 0.5s ease-out 3s forwards;
        }
        
        .skip-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.6);
            transform: scale(1.05);
        }
        
        @keyframes fadeIn {
            to { opacity: 1; }
        }
        
        #main-site { opacity: 0; transition: opacity 0.8s ease-in-out; }
        #main-site.visible { opacity: 1; }
        
        @media (max-width: 768px) {
            /* Show mobile video, hide desktop video */
            .intro-video-desktop {
                display: none;
            }
            
            .intro-video-mobile {
                display: block;
            }
            
            .planet-container {
                width: 420px;
                height: 420px;
                margin-bottom: 30px;
            }
            
            .orbit-1 { width: 170px; height: 170px; animation-delay: 0s; }
            .orbit-2 { width: 250px; height: 250px; animation-delay: -9s; }
            .orbit-3 { width: 330px; height: 330px; animation-delay: -4s; }
            .orbit-4 { width: 410px; height: 410px; animation-delay: -15s; }
            
            .center-logo {
                width: 100px;
                height: 100px;
            }
            
            .planet-1 { width: 28px; height: 28px; }
            .planet-2 { width: 44px; height: 44px; }
            .planet-3 { width: 36px; height: 36px; }
            .planet-4 { width: 152px; height: 152px; }
            
            .intro-title { font-size: 1.8rem; }
            .intro-subtitle { font-size: 1.1rem; }
            .intro-date { font-size: 1rem; }
            .skip-btn { bottom: 20px; right: 20px; padding: 10px 20px; font-size: 0.9rem; }
        }
        
        /* Anthem Player Styles */
        .anthem-player {
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(138, 43, 226, 0.15);
            border: 2px solid rgba(138, 43, 226, 0.4);
            border-radius: 20px;
            padding: 20px 30px;
            margin: 30px auto;
            max-width: 600px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(138, 43, 226, 0.3);
            transition: all 0.3s ease;
            gap: 15px;
        }
        
        .anthem-player:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(138, 43, 226, 0.4);
            border-color: rgba(138, 43, 226, 0.6);
        }
        
        .anthem-icon {
            font-size: 2.5rem;
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .anthem-info {
            flex: 1;
            text-align: left;
        }
        
        .anthem-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #fff;
            margin-bottom: 5px;
        }
        
        .anthem-subtitle {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.8);
            font-style: italic;
        }
        
        .anthem-progress-container {
            margin-top: 10px;
        }
        
        .anthem-progress-bar {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            cursor: pointer;
            position: relative;
            margin-bottom: 5px;
        }
        
        .anthem-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #8a2be2, #9370db);
            border-radius: 3px;
            width: 0%;
            transition: width 0.1s linear;
        }
        
        .anthem-time-display {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.7);
            text-align: right;
        }
        
        .anthem-play-btn {
            background: linear-gradient(135deg, #8a2be2, #9370db);
            border: none;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(138, 43, 226, 0.4);
        }
        
        .anthem-play-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(138, 43, 226, 0.6);
        }
        
        .anthem-play-btn:active {
            transform: scale(0.95);
        }
        
        .play-icon {
            font-size: 1.5rem;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        }
        
        /* Fix pause centering */
        .anthem-play-btn.playing .play-icon {
            margin-left: 0;
            letter-spacing: 0;
            font-weight: bold;
        }
        
        audio {
            display: none;
        }
        
        /* Dancing titles when music plays */
        .hero-title.dancing {
            animation: titleDance 1.5s ease-in-out infinite;
        }
        
        .hero-subtitle.dancing {
            animation: subtitleDance 1.8s ease-in-out infinite;
        }
        
        @keyframes titleDance {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        @keyframes subtitleDance {
            0%, 100% {
                transform: scale(1) translateY(0);
            }
            50% {
                transform: scale(1.03) translateY(-3px);
            }
        }
        
        /* Hero Video Background */
        .hero-video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
        }
        
        /* Hide mobile video on desktop, show desktop video */
        .hero-video-mobile {
            display: none;
        }
        
        .hero-video-desktop {
            display: block;
        }
        
        /* Mobile video is portrait (9:16) - ensure it fills screen */
        .hero-video-mobile {
            object-fit: cover;
            object-position: center center;
            width: 100%;
            height: 100%;
        }
        
        .hero {
            position: relative;
            overflow: hidden;
        }
        
        .hero-content {
            position: relative;
            z-index: 1;
        }
        
        /* Mobile-Only Anthem Player (hidden on desktop) */
        .anthem-player-mobile {
            display: none;
            margin-top: 30px;
            background: rgba(138, 43, 226, 0.15);
            border: 1px solid rgba(138, 43, 226, 0.4);
            border-radius: 15px;
            padding: 15px 20px;
            backdrop-filter: blur(10px);
            align-items: center;
            gap: 15px;
            box-shadow: 0 4px 20px rgba(138, 43, 226, 0.2);
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .anthem-icon-mobile {
            font-size: 2.5rem;
            flex-shrink: 0;
            animation: float 3s ease-in-out infinite;
        }
        
        .anthem-info-mobile {
            flex: 1;
            text-align: left;
        }
        
        .anthem-title-mobile {
            font-size: 1.1rem;
            font-weight: 600;
            color: #fff;
            margin-bottom: 4px;
        }
        
        .anthem-credit-mobile {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.7);
            font-style: italic;
        }
        
        .anthem-progress-container-mobile {
            margin-top: 8px;
        }
        
        .anthem-progress-bar-mobile {
            width: 100%;
            height: 5px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            cursor: pointer;
            position: relative;
            margin-bottom: 4px;
        }
        
        .anthem-progress-fill-mobile {
            height: 100%;
            background: linear-gradient(90deg, #8a2be2, #9370db);
            border-radius: 3px;
            width: 0%;
            transition: width 0.1s linear;
        }
        
        .anthem-time-display-mobile {
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.7);
            text-align: right;
        }
        
        .anthem-btn-mobile {
            background: linear-gradient(135deg, rgba(138, 43, 226, 0.9), rgba(147, 112, 219, 0.9));
            border: 2px solid rgba(138, 43, 226, 0.6);
            border-radius: 50%;
            width: 55px;
            height: 55px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(138, 43, 226, 0.4);
            flex-shrink: 0;
        }
        
        .anthem-btn-mobile:hover,
        .anthem-btn-mobile:active {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(138, 43, 226, 0.6);
        }
        
        .play-icon-mobile {
            font-size: 1.4rem;
            color: #fff;
        }
        
        .anthem-btn-mobile.playing .play-icon-mobile {
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        @media (max-width: 768px) {
            /* CRITICAL: Prevent horizontal scrolling */
            html, body {
                overflow-x: hidden !important;
                max-width: 100vw;
            }
            
            /* Hide desktop video, show mobile video */
            .hero-video-desktop {
                display: none !important;
            }
            
            .hero-video-mobile {
                display: block !important;
                /* Force portrait video to fill mobile screen at full height */
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: auto !important;
                height: 100% !important;
                min-height: 100vh; /* Full viewport height */
                object-fit: cover;
                object-position: center center;
            }
            
            /* Ensure hero section is full width on mobile */
            .hero {
                width: 100% !important;
                max-width: 100vw !important;
                left: 0;
                right: 0;
            }
            
            .anthem-player {
                display: none; /* Hide desktop player on mobile */
            }
            
            .anthem-player-mobile {
                display: flex; /* Show mobile player */
                margin-bottom: 30px; /* Space before Register Now button */
            }
            
            .anthem-icon {
                font-size: 2rem;
            }
            
            .anthem-title {
                font-size: 1rem;
            }
            
            .anthem-subtitle {
                font-size: 0.85rem;
            }
            
            .anthem-play-btn {
                width: 50px;
                height: 50px;
            }
            
            .play-icon {
                font-size: 1.3rem;
            }
            
            /* Fix hero video positioning on mobile - show left side */
            .hero-video {
                object-position: left center !important;
            }
            
            .hero {
                overflow: hidden;
            }
        }
    </style>
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
