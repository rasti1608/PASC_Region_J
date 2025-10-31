<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /resources.cfm
* Created:     October 26, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Resources page - Coming Soon placeholder
*              Temporary page until resources section is built
*
* Project:     PASC Region J Conference 2026 Website
*              Lead Beyond Limits - February 13, 2026
*******************************************************************************
--->
</cfsilent>

<!--- Include header --->
<cfinclude template="includes/header.cfm">

<!--- Hero Section --->
<section class="page-hero">
    <!--- Video Background - Desktop --->
    <video id="resourcesVideo" class="hero-video hero-video-desktop" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>
    
    <!--- Video Background - Mobile --->
    <video id="resourcesVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>
    
    <div class="container">
        <h1 class="hero-title" id="resourcesTitle">Resources</h1>
        <p class="hero-subtitle" id="resourcesSubtitle">Coming Soon!</p>
    </div>
</section>

<!--- Coming Soon Section --->
<section class="coming-soon-section">
    <div class="container">
        <div class="coming-soon-content">
            <div class="coming-soon-icon">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="#4fc3f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="#4fc3f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            
            <h2>Resource Library Coming Soon</h2>
            
            <p class="coming-soon-text">
                We're building a comprehensive resource center with leadership guides, workshop materials, planning templates, and student council best practices.
            </p>
            
            <p class="coming-soon-subtext">
                Our resources section will include downloadable materials for student leaders and advisors, conference materials from past events, and helpful tools for running successful student councils.
            </p>
            
            <div class="resources-preview">
                <h3>What's Coming</h3>
                <div class="preview-grid">
                    <div class="preview-item">
                        <h4>Leadership Guides</h4>
                        <p>Step-by-step guides for student council officers and members</p>
                    </div>
                    
                    <div class="preview-item">
                        <h4>Event Planning Templates</h4>
                        <p>Checklists and templates for organizing school events</p>
                    </div>
                    
                    <div class="preview-item">
                        <h4>Conference Materials</h4>
                        <p>Past presentations, workshop handouts, and session notes</p>
                    </div>
                    
                    <div class="preview-item">
                        <h4>Best Practices</h4>
                        <p>Proven strategies from successful student councils</p>
                    </div>
                </div>
            </div>
            
            <div class="cta-buttons">
                <a href="index.cfm" class="btn btn-primary">Return Home</a>
                <a href="workshops.cfm" class="btn btn-secondary">View Workshops</a>
            </div>
        </div>
    </div>
</section>

<!--- Include footer --->
<cfinclude template="includes/footer.cfm">
