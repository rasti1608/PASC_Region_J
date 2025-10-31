<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /contact.cfm
* Created:     October 26, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Contact page - Coming Soon placeholder
*              Temporary page until contact form is built
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
    <video id="contactVideo" class="hero-video hero-video-desktop" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>
    
    <!--- Video Background - Mobile --->
    <video id="contactVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>
    
    <div class="container">
        <h1 class="hero-title" id="contactTitle">Contact Us</h1>
        <p class="hero-subtitle" id="contactSubtitle">Coming Soon!</p>
    </div>
</section>

<!--- Coming Soon Section --->
<section class="coming-soon-section">
    <div class="container">
        <div class="coming-soon-content">
            <div class="coming-soon-icon">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#4fc3f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            
            <h2>Contact Form Coming Soon</h2>
            
            <p class="coming-soon-text">
                We're building a comprehensive contact system to help answer all your questions about the PASC Region J Conference 2026.
            </p>
            
            <p class="coming-soon-subtext">
                In the meantime, you can reach us via email or phone with any questions about the conference, registration, workshops, or PASC Region J activities.
            </p>
            
            <div class="contact-info-box">
                <h3>Get in Touch</h3>
                <div class="contact-methods">
                    <div class="contact-method">
                        <strong>Email:</strong>
                        <p><a href="mailto:info@pascregionj.com">info@pascregionj.com</a></p>
                    </div>
                    
                    <div class="contact-method">
                        <strong>Conference Date:</strong>
                        <p>February 13, 2026</p>
                    </div>
                    
                    <div class="contact-method">
                        <strong>Location:</strong>
                        <p>Neshaminy High School, Langhorne, PA</p>
                    </div>
                </div>
            </div>
            
            <div class="cta-buttons">
                <a href="index.cfm" class="btn btn-primary">Return Home</a>
                <a href="about.cfm" class="btn btn-secondary">Learn More</a>
            </div>
        </div>
    </div>
</section>

<!--- Include footer --->
<cfinclude template="includes/footer.cfm">
