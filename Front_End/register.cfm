<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /register.cfm
* Created:     October 26, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Registration page - Coming Soon placeholder
*              Temporary page until registration system is built
*
* Project:     PASC Region J Conference 2026 Website
*              Lead Beyond Limits - February 13, 2026
*******************************************************************************
--->
</cfsilent>

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
    <video id="registerVideo" class="hero-video hero-video-desktop" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>
    
    <!--- Video Background - Mobile --->
    <video id="registerVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>
    
    <div class="container">
        <h1 class="hero-title" id="registerTitle">Conference Registration</h1>
        <p class="hero-subtitle" id="registerSubtitle">Coming Soon!</p>
    </div>
</section>

<!--- Coming Soon Section --->
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
                Conference registration will open on <strong>January 5, 2026</strong>. We're excited to welcome student council members, leaders, and advisors to the PASC Region J Conference 2026!
            </p>
            
            <p class="coming-soon-subtext">
                Registration will include options for students, advisors, and workshop presenters. Early bird pricing will be available for those who register in January.
            </p>
            
            <div class="coming-soon-details">
                <div class="detail-item">
                    <h3>Conference Date</h3>
                    <p>February 13, 2026</p>
                </div>
                
                <div class="detail-item">
                    <h3>Registration Opens</h3>
                    <p>January 5, 2026</p>
                </div>
                
                <div class="detail-item">
                    <h3>Theme</h3>
                    <p>Lead Beyond Limits</p>
                </div>
            </div>
            
            <div class="cta-buttons">
                <a href="index.cfm" class="btn btn-primary">Return Home</a>
                <a href="about.cfm" class="btn btn-secondary">Learn More About PASC</a>
            </div>
        </div>
    </div>
</section>

<!--- Include footer --->
<cfinclude template="includes/footer.cfm">
