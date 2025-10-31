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
<section class="coming-soon-section">
    <div class="container">
        <div class="coming-soon-content">
            <div class="coming-soon-icon">📸</div>
            <h2>Gallery Coming Soon</h2>
            <p class="coming-soon-text">
                We're working on bringing you an amazing photo gallery showcasing highlights from our conferences and events!
            </p>
            <div class="cta-buttons">
                <a href="index.cfm" class="btn btn-primary">Return Home</a>
            </div>
        </div>
    </div>
</section>

<!--- Include footer --->
<cfinclude template="includes/footer.cfm">
