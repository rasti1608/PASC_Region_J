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
*              Reach for the stars, lead beyond limits - February 13, 2026
*******************************************************************************
--->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="PASC Region J Conference 2026 - Reach for the Stars, Lead Beyond Limits - February 13, 2026">
    <meta name="keywords" content="PASC, Region J, Student Council, Leadership, Conference, Pennsylvania">
    <meta name="author" content="Rastislav Toscak">
    <title>PASC Region J Conference 2026 - Reach for the Stars, Lead Beyond Limits</title>
    
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
    <link rel="stylesheet" href="/assets/css/contact-form.css">

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
            
            <!--- Mute Toggle Button --->
            <button class="mute-toggle-btn" id="muteToggleBtn" onclick="toggleMute()" title="Mute/Unmute">
                <span class="mute-icon" id="muteIcon">&#128266;</span>
                <span class="mute-label" id="muteLabel">UNMUTE</span>
            </button>
            
            <!--- Global Audio Element (shared by all players) --->
            <audio id="globalAnthemAudio" preload="metadata" loop>
                <source src="/assets/audio/instrumental_background.mp3" type="audio/mpeg">
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

    <!--- Background Music Controller JavaScript --->
    <script>
        // Global background music (shared across all pages)
        let globalAudio = null;

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            globalAudio = document.getElementById('globalAnthemAudio');

            if (!globalAudio) {
                console.error('Audio element not found on page load');
                return;
            }

            // Check previous state
            const wasPlaying = sessionStorage.getItem('anthemPlaying') === 'true';
            const savedPosition = parseFloat(sessionStorage.getItem('anthemPosition') || 0);

            // Restore position
            if (savedPosition > 0) {
                globalAudio.currentTime = savedPosition;
            }

            // Set initial button state
            updateMuteButton(!globalAudio.paused);  // Invert: if NOT paused (playing), pass true

            // Resume if was playing
            if (wasPlaying) {
                setTimeout(() => {
                    globalAudio.play().then(() => {
                        // Event listener will handle button state and animations
                    }).catch(err => {
                        console.error('Auto-resume prevented:', err);
                        sessionStorage.setItem('anthemPlaying', 'false');
                    });
                }, 100);
            }

            // Save position while playing
            globalAudio.addEventListener('timeupdate', function() {
                if (!globalAudio.paused) {
                    sessionStorage.setItem('anthemPosition', globalAudio.currentTime);
                }
            });

            // Loop when ends
            globalAudio.addEventListener('ended', function() {
                globalAudio.currentTime = 0;
                globalAudio.play();
            });

            // Sync button state when audio starts playing
            globalAudio.addEventListener('play', function() {
                updateMuteButton(true);    // true = IS playing
                updateAllAnimations(true);
                sessionStorage.setItem('anthemPlaying', 'true');

                // Pause resources page anthem if it's playing
                const anthemAudio = document.getElementById('anthemAudio');
                if (anthemAudio && !anthemAudio.paused) {
                    anthemAudio.pause();
                }
            });

            // Sync button state when audio pauses
            globalAudio.addEventListener('pause', function() {
                updateMuteButton(false);   // false = NOT playing
                updateAllAnimations(false);
                sessionStorage.setItem('anthemPlaying', 'false');
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
                sessionStorage.setItem('musicMuted', globalAudio.muted ? 'true' : 'false');
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
                        sessionStorage.setItem('anthemPlaying', 'true');
                        sessionStorage.setItem('anthemPosition', globalAudio.currentTime);
                    }
                } else {
                    // Page is visible again (tab switched back)
                    if (wasPlaying && globalAudio.paused) {
                        const savedPosition = parseFloat(sessionStorage.getItem('anthemPosition') || 0);
                        if (savedPosition > 0) {
                            globalAudio.currentTime = savedPosition;
                        }

                        // Attempt to resume playback
                        globalAudio.play().then(() => {
                            const isMuted = globalAudio.muted;
                            updateAllAnimations(!isMuted);
                        }).catch(err => {
                            console.log('Auto-resume prevented by browser:', err);
                        });
                    }
                }
            });
        });
        
        // Update mute button icons and labels
        function updateMuteButton(isPlaying) {
            const muteBtn = document.getElementById('muteToggleBtn');
            const muteIcon = document.getElementById('muteIcon');
            const muteLabel = document.getElementById('muteLabel');

            if (!muteBtn || !muteIcon || !muteLabel) return;

            if (isPlaying) {
                // MUSIC IS PLAYING RIGHT NOW
                muteIcon.innerHTML = '&#128266;';  // 🔊 speaker with sound waves
                muteLabel.textContent = 'MUTE';       // Show MUTE when playing
                muteBtn.classList.remove('muted');
                muteBtn.classList.add('playing');
            } else {
                // MUSIC IS STOPPED/MUTED
                muteIcon.innerHTML = '&#128263;';  // 🔇 muted speaker with X
                muteLabel.textContent = 'UNMUTE';     // Show UNMUTE when stopped
                muteBtn.classList.remove('playing');
                muteBtn.classList.add('muted');
            }
        }

        // Update all animations based on audio state
        function updateAllAnimations(shouldAnimate) {
            // Get nav logo
            const navLogo = document.getElementById('navLogo');
            // Get About page logo
            const aboutLogo = document.querySelector('.large-logo');

            // Rotate logos
            if (navLogo) {
                if (shouldAnimate) {
                    navLogo.classList.add('rotating');
                } else {
                    navLogo.classList.remove('rotating');
                }
            }
            if (aboutLogo) {
                if (shouldAnimate) {
                    aboutLogo.classList.add('rotating');
                } else {
                    aboutLogo.classList.remove('rotating');
                }
            }

            // INDEX PAGE - Animate hero titles and videos
            const heroTitle = document.getElementById('heroTitle');
            const heroSubtitle = document.getElementById('heroSubtitle');
            const heroVideo = document.getElementById('heroVideo');
            const heroVideoMobile = document.getElementById('heroVideoMobile');

            if (heroTitle && heroSubtitle) {
                if (shouldAnimate) {
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
                if (shouldAnimate) {
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
                if (shouldAnimate) {
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
                if (shouldAnimate) {
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
                if (shouldAnimate) {
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
                if (shouldAnimate) {
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
                if (shouldAnimate) {
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
        
        // Toggle play/pause (main function called by button)
        function toggleMute() {
            if (!globalAudio) {
                globalAudio = document.getElementById('globalAnthemAudio');
            }

            if (!globalAudio) {
                console.error('Audio element not found');
                return;
            }

            if (globalAudio.paused) {
                // Start playback
                globalAudio.play()
                    .then(() => {
                        console.log('Audio started');
                        // Event listener will handle updateMuteButton(true) and animations
                    })
                    .catch(err => {
                        console.error('Failed to play audio:', err);
                        alert('Could not start audio. Please try clicking again.');
                    });
            } else {
                // Pause playback
                globalAudio.pause();
                // Event listener will handle updateMuteButton(false) and animations
            }
        }

        // Legacy function for backward compatibility
        function toggleAnthem() {
            toggleMute();
        }
    </script>
    
    <!--- Main content wrapper --->
    <main class="main-content">
