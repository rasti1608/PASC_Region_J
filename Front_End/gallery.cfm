<cfprocessingdirective pageencoding="utf-8">
<!---
*******************************************************************************
* File:        /gallery.cfm
* Created:     October 25, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Gallery page placeholder for PASC Region J Conference 2026
*              Will display photo gallery from past conferences
*              (To be fully implemented post-MVP)
*
* Project:     PASC Region J Conference 2026 Website
*              Lead Beyond Limits - February 13, 2026
*******************************************************************************
--->

<!--- Include header --->
<cfinclude template="includes/header.cfm">

<style>
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
    z-index: 1;
}

.hero-video-mobile {
    display: none;
}

.hero-video-desktop {
    display: block;
}

.page-hero {
    position: relative;
    overflow: hidden;
}

.page-hero .container {
    position: relative;
    z-index: 2;
}

@media (max-width: 768px) {
    .hero-video-desktop {
        display: none;
    }
    
    .hero-video-mobile {
        display: block;
        object-fit: cover;
        object-position: center center;
        width: 100%;
        height: 100%;
    }
    
    .page-hero {
        width: 100% !important;
        max-width: 100vw !important;
        margin: 0 !important;
        padding: 0 !important;
    }
}
</style>

<!--- Hero Section --->
<section class="page-hero">
    <!--- Video Background - Desktop --->
    <video id="galleryVideo" class="hero-video hero-video-desktop" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>
    
    <!--- Video Background - Mobile --->
    <video id="galleryVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>
    
    <div class="container">
        <h1 class="hero-title" id="galleryTitle">Photo Gallery</h1>
        <p class="hero-subtitle" id="gallerySubtitle">Coming Soon!</p>
    </div>
</section>

<!--- Coming Soon Section --->
<section class="coming-soon">
    <div class="container" style="text-align: center; padding: 4rem 0;">
        <div style="font-size: 5rem; margin-bottom: 2rem;">📸</div>
        <h2 style="color: var(--color-accent); margin-bottom: 1rem;">Gallery Coming Soon</h2>
        <p style="font-size: 1.25rem; color: var(--color-text-secondary); margin-bottom: 2rem;">
            We're working on bringing you an amazing photo gallery showcasing highlights from our conferences and events!
        </p>
        <a href="index.cfm" class="btn btn-primary">Return Home</a>
    </div>
</section>

<!--- Include footer --->
<cfinclude template="includes/footer.cfm">
