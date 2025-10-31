<!---
*******************************************************************************
* File:        /includes/header.cfm
* Created:     October 25, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Shared header template for PASC Region J Conference website
*              Contains HTML head, navigation menu, and opening body tag
*              Implements responsive navigation with mobile menu support
*
* Navigation:  Home | About | Workshops | Register | Contact | Resources
*              Auto-highlights active page based on current script name
*
* Usage:       <cfinclude template="includes/header.cfm">
*
* Project:     PASC Region J Conference 2026 Website
*              Lead Beyond Limits - February 13, 2026
*******************************************************************************
--->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="PASC Region J Conference 2026 - Lead Beyond Limits - February 13, 2026">
    <meta name="keywords" content="PASC, Region J, Student Council, Leadership, Conference, Pennsylvania">
    <meta name="author" content="Rastislav Toscak">
    <title>PASC Region J Conference 2026 - Lead Beyond Limits</title>
    
    <!--- Bootstrap 5 CSS (Local) --->
    <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
    
    <!--- Stylesheet with root-relative path (works from any directory) --->
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="/assets/css/mobile-menu.css">
    <link rel="stylesheet" href="/assets/css/workshops-accordion.css">
    <link rel="stylesheet" href="/assets/css/coming-soon.css">
    <link rel="stylesheet" href="/assets/css/hero-video.css">
    <link rel="stylesheet" href="/assets/css/animations.css">
    <link rel="stylesheet" href="/assets/css/anthem-player.css">
    <link rel="stylesheet" href="/assets/css/gallery-grid.css">

    <!--- Optional: Favicon --->
    <link rel="icon" type="image/png" href="/assets/img/favicon.png">
</head>
<body>
    <!--- Navigation Bar --->
    <nav class="main-nav">
        <div class="nav-container">
            <div class="logo">
                <a href="index.cfm">
                    <img src="/assets/img/logo.png" alt="PASC Region J" class="logo-img" id="navLogo">
                    <span class="logo-text">PASC REGION J</span>
                </a>
            </div>
            
            <ul class="nav-menu">
                <li><a href="index.cfm" class="<cfif listLast(cgi.script_name, '/') eq 'index.cfm'>active</cfif>">Home</a></li>
                <li><a href="about.cfm" class="<cfif listLast(cgi.script_name, '/') eq 'about.cfm'>active</cfif>">About</a></li>
                <li><a href="gallery.cfm" class="<cfif listLast(cgi.script_name, '/') eq 'gallery.cfm'>active</cfif>">Gallery</a></li>
                <li><a href="register.cfm" class="<cfif listLast(cgi.script_name, '/') eq 'register.cfm'>active</cfif>">Registration</a></li>
                <li><a href="workshops.cfm" class="<cfif listLast(cgi.script_name, '/') eq 'workshops.cfm'>active</cfif>">Workshops</a></li>
                <li><a href="contact.cfm" class="<cfif listLast(cgi.script_name, '/') eq 'contact.cfm'>active</cfif>">Contact</a></li>
                <li><a href="resources.cfm" class="<cfif listLast(cgi.script_name, '/') eq 'resources.cfm'>active</cfif>">Resources</a></li>
            </ul>
            
            <!--- Shared Anthem Player --->
            <div class="anthem-player-header">
                <!--- Animated Equalizer (left side) --->
                <div class="equalizer-bars" id="equalizerLeft" style="display: none;">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
                
                <div class="anthem-info-header">
                    <div class="anthem-title-header">&#127925; "One Orbit"</div>
                    <div class="anthem-credit-header">by IronRUST</div>
                    <div class="anthem-progress-header" id="anthemProgressHeader" onclick="seekHeaderAnthem(event)">
                        <div class="anthem-progress-fill-header" id="anthemProgressFillHeader"></div>
                    </div>
                </div>
                <button class="anthem-btn-header" id="anthemBtnHeader" onclick="toggleGlobalAnthem()" title="Play Conference Anthem">
                    <span class="anthem-play-icon-header">&#9654;</span>
                </button>
                
                <!--- Animated Equalizer (right side) --->
                <div class="equalizer-bars" id="equalizerRight" style="display: none;">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
            </div>
            
            <!--- Global Audio Element (shared by all players) --->
            <audio id="globalAnthemAudio" preload="metadata">
                <source src="/assets/audio/one-orbit-anthem.mp3" type="audio/mpeg">
                <source src="/assets/audio/one-orbit-anthem.wav" type="audio/wav">
            </audio>
            
            <!--- Mobile menu toggle button --->
            <button class="mobile-menu-toggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>
    
    <!--- Mobile Anthem Player (Fixed at Bottom) --->
    <div class="anthem-player-mobile-fixed">
        <div class="anthem-mobile-icon">&#127925;</div>
        
        <div class="equalizer-mobile" id="equalizerMobile" style="display: none;">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
        
        <div class="anthem-mobile-info">
            <div class="anthem-mobile-title">"One Orbit"</div>
            <div class="anthem-mobile-credit">by IronRUST</div>
            <div class="anthem-progress-mobile-fixed" onclick="seekMobileFixed(event)">
                <div class="anthem-progress-fill-mobile-fixed" id="anthemProgressFillMobileFixed"></div>
            </div>
        </div>
        
        <button class="anthem-btn-mobile" id="anthemBtnMobile" onclick="toggleGlobalAnthem()">
            <span class="anthem-play-icon-mobile">&#9654;</span>
        </button>
    </div>
    
    <!--- Global Anthem Player JavaScript --->
    <script>
        // Global anthem player (shared across all pages)
        let globalAudio = null;
        let headerBtn = null;
        let headerIcon = null;
        let mobileBtn = null;
        let mobileIcon = null;
        let equalizerLeft = null;
        let equalizerRight = null;
        let equalizerMobile = null;
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            globalAudio = document.getElementById('globalAnthemAudio');
            headerBtn = document.getElementById('anthemBtnHeader');
            headerIcon = headerBtn ? headerBtn.querySelector('.anthem-play-icon-header') : null;
            mobileBtn = document.getElementById('anthemBtnMobile');
            mobileIcon = mobileBtn ? mobileBtn.querySelector('.anthem-play-icon-mobile') : null;
            equalizerLeft = document.getElementById('equalizerLeft');
            equalizerRight = document.getElementById('equalizerRight');
            equalizerMobile = document.getElementById('equalizerMobile');
            
            if (!globalAudio) return;
            
            // Check previous state
            const wasPlaying = sessionStorage.getItem('anthemPlaying') === 'true';
            const savedPosition = parseFloat(sessionStorage.getItem('anthemPosition') || 0);
            
            // Restore position
            if (savedPosition > 0) {
                globalAudio.currentTime = savedPosition;
            }
            
            // Resume if was playing
            if (wasPlaying) {
                setTimeout(() => {
                    globalAudio.play().then(() => {
                        updateAllPlayers(true);
                    }).catch(err => {
                        sessionStorage.setItem('anthemPlaying', 'false');
                    });
                }, 100);
            }
            
            // Save position while playing
            globalAudio.addEventListener('timeupdate', function() {
                if (!globalAudio.paused) {
                    sessionStorage.setItem('anthemPosition', globalAudio.currentTime);
                    // Update progress bar
                    updateProgressBar();
                }
            });
            
            // Reset when ends
            globalAudio.addEventListener('ended', function() {
                updateAllPlayers(false);
                sessionStorage.setItem('anthemPlaying', 'false');
                sessionStorage.setItem('anthemPosition', '0');
            });
            
            // Keep-alive: Check every 2 seconds if audio should be playing (helps in-app browsers)
            setInterval(function() {
                if (!globalAudio) return;
                
                const shouldBePlaying = sessionStorage.getItem('anthemPlaying') === 'true';
                
                // If it should be playing but got paused (e.g., by browser), try to resume
                if (shouldBePlaying && globalAudio.paused && !document.hidden) {
                    const savedPosition = parseFloat(sessionStorage.getItem('anthemPosition') || 0);
                    if (savedPosition > 0 && Math.abs(globalAudio.currentTime - savedPosition) > 2) {
                        globalAudio.currentTime = savedPosition;
                    }
                    
                    globalAudio.play().catch(err => {
                        // Silently fail if browser blocks (user needs to interact)
                    });
                }
            }, 2000);
            
            // Save state before unload
            window.addEventListener('beforeunload', function() {
                sessionStorage.setItem('anthemPlaying', !globalAudio.paused ? 'true' : 'false');
                if (!globalAudio.paused) {
                    sessionStorage.setItem('anthemPosition', globalAudio.currentTime);
                }
            });
            
            // Handle page visibility changes (tab switching)
            document.addEventListener('visibilitychange', function() {
                if (!globalAudio) return;
                
                const wasPlaying = sessionStorage.getItem('anthemPlaying') === 'true';
                
                if (document.hidden) {
                    // Page is hidden (tab switched away)
                    if (!globalAudio.paused) {
                        // Save that it was playing
                        sessionStorage.setItem('anthemPlaying', 'true');
                        sessionStorage.setItem('anthemPosition', globalAudio.currentTime);
                    }
                } else {
                    // Page is visible again (tab switched back)
                    if (wasPlaying && globalAudio.paused) {
                        // Try to resume if it was playing before
                        const savedPosition = parseFloat(sessionStorage.getItem('anthemPosition') || 0);
                        if (savedPosition > 0) {
                            globalAudio.currentTime = savedPosition;
                        }
                        
                        // Attempt to resume playback
                        globalAudio.play().then(() => {
                            updateAllPlayers(true);
                        }).catch(err => {
                            console.log('Auto-resume prevented by browser:', err);
                            // Browser blocked auto-resume, user needs to click play again
                        });
                    }
                }
            });
        });
        
        // Update all player buttons
        function updateAllPlayers(isPlaying) {
            // Get nav logo
            const navLogo = document.getElementById('navLogo');
            
            // Update header button
            if (headerBtn && headerIcon) {
                if (isPlaying) {
                    headerBtn.classList.add('playing');
                    headerIcon.textContent = '| |'; // Simple pipes with space
                    // Show equalizers
                    if (equalizerLeft) equalizerLeft.style.display = 'flex';
                    if (equalizerRight) equalizerRight.style.display = 'flex';
                    // Rotate logo
                    if (navLogo) navLogo.classList.add('rotating');
                } else {
                    headerBtn.classList.remove('playing');
                    headerIcon.innerHTML = '&#9654;'; // Play icon
                    // Hide equalizers
                    if (equalizerLeft) equalizerLeft.style.display = 'none';
                    if (equalizerRight) equalizerRight.style.display = 'none';
                    // Stop logo rotation
                    if (navLogo) navLogo.classList.remove('rotating');
                }
            }
            
            // Update index page button if it exists
            const indexBtn = document.getElementById('anthemPlayBtn');
            const indexIcon = indexBtn ? indexBtn.querySelector('.play-icon') : null;
            if (indexBtn && indexIcon) {
                if (isPlaying) {
                    indexBtn.classList.add('playing');
                    indexIcon.textContent = '| |'; // Simple pipes with space
                } else {
                    indexBtn.classList.remove('playing');
                    indexIcon.innerHTML = '&#9654;'; // Play icon
                }
            }
            
            // Update mobile button
            if (mobileBtn && mobileIcon) {
                if (isPlaying) {
                    mobileBtn.classList.add('playing');
                    mobileIcon.textContent = '| |';
                    if (equalizerMobile) equalizerMobile.style.display = 'flex';
                } else {
                    mobileBtn.classList.remove('playing');
                    mobileIcon.innerHTML = '&#9654;';
                    if (equalizerMobile) equalizerMobile.style.display = 'none';
                }
            }
            
            // INDEX PAGE - Animate hero titles and videos
            const heroTitle = document.getElementById('heroTitle');
            const heroSubtitle = document.getElementById('heroSubtitle');
            const heroVideo = document.getElementById('heroVideo');
            const heroVideoMobile = document.getElementById('heroVideoMobile');
            
            if (heroTitle && heroSubtitle) {
                if (isPlaying) {
                    heroTitle.classList.add('dancing');
                    heroSubtitle.classList.add('dancing');
                    if (heroVideo) heroVideo.play().catch(err => console.log('Desktop video play prevented:', err));
                    if (heroVideoMobile) heroVideoMobile.play().catch(err => console.log('Mobile video play prevented:', err));
                } else {
                    heroTitle.classList.remove('dancing');
                    heroSubtitle.classList.remove('dancing');
                    if (heroVideo) heroVideo.pause();
                    if (heroVideoMobile) heroVideoMobile.pause();
                }
            }
            
            // ABOUT PAGE
            const aboutTitle = document.getElementById('aboutTitle');
            const aboutSubtitle = document.getElementById('aboutSubtitle');
            const aboutVideo = document.getElementById('aboutVideo');
            const aboutVideoMobile = document.getElementById('aboutVideoMobile');
            
            if (aboutTitle && aboutSubtitle) {
                if (isPlaying) {
                    aboutTitle.classList.add('dancing');
                    aboutSubtitle.classList.add('dancing');
                    if (aboutVideo) aboutVideo.play().catch(err => console.log('About video play prevented:', err));
                    if (aboutVideoMobile) aboutVideoMobile.play().catch(err => console.log('About mobile video play prevented:', err));
                } else {
                    aboutTitle.classList.remove('dancing');
                    aboutSubtitle.classList.remove('dancing');
                    if (aboutVideo) aboutVideo.pause();
                    if (aboutVideoMobile) aboutVideoMobile.pause();
                }
            }
            
            // CONTACT PAGE
            const contactTitle = document.getElementById('contactTitle');
            const contactSubtitle = document.getElementById('contactSubtitle');
            const contactVideo = document.getElementById('contactVideo');
            const contactVideoMobile = document.getElementById('contactVideoMobile');
            
            if (contactTitle && contactSubtitle) {
                if (isPlaying) {
                    contactTitle.classList.add('dancing');
                    contactSubtitle.classList.add('dancing');
                    if (contactVideo) contactVideo.play().catch(err => console.log('Contact video play prevented:', err));
                    if (contactVideoMobile) contactVideoMobile.play().catch(err => console.log('Contact mobile video play prevented:', err));
                } else {
                    contactTitle.classList.remove('dancing');
                    contactSubtitle.classList.remove('dancing');
                    if (contactVideo) contactVideo.pause();
                    if (contactVideoMobile) contactVideoMobile.pause();
                }
            }
            
            // GALLERY PAGE
            const galleryTitle = document.getElementById('galleryTitle');
            const gallerySubtitle = document.getElementById('gallerySubtitle');
            const galleryVideo = document.getElementById('galleryVideo');
            const galleryVideoMobile = document.getElementById('galleryVideoMobile');
            
            if (galleryTitle && gallerySubtitle) {
                if (isPlaying) {
                    galleryTitle.classList.add('dancing');
                    gallerySubtitle.classList.add('dancing');
                    if (galleryVideo) galleryVideo.play().catch(err => console.log('Gallery video play prevented:', err));
                    if (galleryVideoMobile) galleryVideoMobile.play().catch(err => console.log('Gallery mobile video play prevented:', err));
                } else {
                    galleryTitle.classList.remove('dancing');
                    gallerySubtitle.classList.remove('dancing');
                    if (galleryVideo) galleryVideo.pause();
                    if (galleryVideoMobile) galleryVideoMobile.pause();
                }
            }
            
            // REGISTER PAGE
            const registerTitle = document.getElementById('registerTitle');
            const registerSubtitle = document.getElementById('registerSubtitle');
            const registerVideo = document.getElementById('registerVideo');
            const registerVideoMobile = document.getElementById('registerVideoMobile');
            
            if (registerTitle && registerSubtitle) {
                if (isPlaying) {
                    registerTitle.classList.add('dancing');
                    registerSubtitle.classList.add('dancing');
                    if (registerVideo) registerVideo.play().catch(err => console.log('Register video play prevented:', err));
                    if (registerVideoMobile) registerVideoMobile.play().catch(err => console.log('Register mobile video play prevented:', err));
                } else {
                    registerTitle.classList.remove('dancing');
                    registerSubtitle.classList.remove('dancing');
                    if (registerVideo) registerVideo.pause();
                    if (registerVideoMobile) registerVideoMobile.pause();
                }
            }
            
            // RESOURCES PAGE
            const resourcesTitle = document.getElementById('resourcesTitle');
            const resourcesSubtitle = document.getElementById('resourcesSubtitle');
            const resourcesVideo = document.getElementById('resourcesVideo');
            const resourcesVideoMobile = document.getElementById('resourcesVideoMobile');
            
            if (resourcesTitle && resourcesSubtitle) {
                if (isPlaying) {
                    resourcesTitle.classList.add('dancing');
                    resourcesSubtitle.classList.add('dancing');
                    if (resourcesVideo) resourcesVideo.play().catch(err => console.log('Resources video play prevented:', err));
                    if (resourcesVideoMobile) resourcesVideoMobile.play().catch(err => console.log('Resources mobile video play prevented:', err));
                } else {
                    resourcesTitle.classList.remove('dancing');
                    resourcesSubtitle.classList.remove('dancing');
                    if (resourcesVideo) resourcesVideo.pause();
                    if (resourcesVideoMobile) resourcesVideoMobile.pause();
                }
            }
            
            // WORKSHOPS PAGE
            const workshopsTitle = document.getElementById('workshopsTitle');
            const workshopsSubtitle = document.getElementById('workshopsSubtitle');
            const workshopsVideo = document.getElementById('workshopsVideo');
            const workshopsVideoMobile = document.getElementById('workshopsVideoMobile');
            
            if (workshopsTitle && workshopsSubtitle) {
                if (isPlaying) {
                    workshopsTitle.classList.add('dancing');
                    workshopsSubtitle.classList.add('dancing');
                    if (workshopsVideo) workshopsVideo.play().catch(err => console.log('Workshops video play prevented:', err));
                    if (workshopsVideoMobile) workshopsVideoMobile.play().catch(err => console.log('Workshops mobile video play prevented:', err));
                } else {
                    workshopsTitle.classList.remove('dancing');
                    workshopsSubtitle.classList.remove('dancing');
                    if (workshopsVideo) workshopsVideo.pause();
                    if (workshopsVideoMobile) workshopsVideoMobile.pause();
                }
            }
        }
        
        // Toggle anthem (called from header)
        function toggleGlobalAnthem() {
            if (!globalAudio) return;
            
            if (globalAudio.paused) {
                // Unlock audio context on first interaction (helps in-app browsers)
                if (globalAudio.currentTime === 0) {
                    globalAudio.load();
                }
                
                globalAudio.play().then(() => {
                    updateAllPlayers(true);
                    sessionStorage.setItem('anthemPlaying', 'true');
                }).catch(err => {
                    console.error('Playback failed:', err);
                });
            } else {
                globalAudio.pause();
                updateAllPlayers(false);
                sessionStorage.setItem('anthemPlaying', 'false');
            }
        }
        
        // Toggle anthem (called from index page)
        function toggleAnthem() {
            toggleGlobalAnthem();
        }
        
        // Update progress bar
        function updateProgressBar() {
            if (!globalAudio) return;
            const progress = (globalAudio.currentTime / globalAudio.duration) * 100;
            
            // Update header progress bar
            const progressFill = document.getElementById('anthemProgressFillHeader');
            if (progressFill && !isNaN(progress)) {
                progressFill.style.width = progress + '%';
            }
            
            // Update mobile fixed player progress bar
            const progressFillMobile = document.getElementById('anthemProgressFillMobileFixed');
            if (progressFillMobile && !isNaN(progress)) {
                progressFillMobile.style.width = progress + '%';
            }
        }
        
        // Seek functionality for header player
        function seekHeaderAnthem(event) {
            if (!globalAudio) return;
            const progressBar = event.currentTarget;
            const clickX = event.offsetX;
            const width = progressBar.offsetWidth;
            const seekTime = (clickX / width) * globalAudio.duration;
            globalAudio.currentTime = seekTime;
            updateProgressBar();
        }
        
        // Seek functionality for mobile fixed player
        function seekMobileFixed(event) {
            if (!globalAudio) return;
            const progressBar = event.currentTarget;
            const clickX = event.offsetX;
            const width = progressBar.offsetWidth;
            const seekTime = (clickX / width) * globalAudio.duration;
            globalAudio.currentTime = seekTime;
            updateProgressBar();
        }
    </script>
    
    <!--- Main content wrapper --->
    <main class="main-content">
