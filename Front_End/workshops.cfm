<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /workshops.cfm
* Created:     October 26, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Workshops page for PASC Region J Conference 2026 website
*              Displays embedded Google Form for workshop applications
*              Form embed code is pulled from database for easy admin updates
*
* Database:    Queries dbo.forms table
*              Displays active form based on is_active flag
*
* Future:      Admin panel will allow updating form embed code
*              without touching this page code
*
* Project:     PASC Region J Conference 2026 Website
*              Lead Beyond Limits - February 13, 2026
*******************************************************************************
--->

<!--- Include database configuration --->
<cfinclude template="includes/db_config.cfm">

<!--- Fetch active workshop forms for accordion --->
<cfquery name="qWorkshopForm" datasource="#application.datasource#">
    SELECT 
        id,
        form_name,
        form_description,
        embed_code,
        display_order
    FROM dbo.forms
    WHERE is_active = 1
        AND page_location = 'Workshops'
    ORDER BY display_order ASC
</cfquery>

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
    <video id="workshopsVideo" class="hero-video hero-video-desktop" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>
    
    <!--- Video Background - Mobile --->
    <video id="workshopsVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>
    
    <div class="container">
        <h1 class="hero-title" id="workshopsTitle">Workshop Application</h1>
        <p class="hero-subtitle" id="workshopsSubtitle">Share Your Leadership Expertise</p>
    </div>
</section>

<!--- Workshop Info Section --->
<section class="workshop-intro">
    <div class="container">
        <div class="intro-content">
            <h2>Present at Our Conference</h2>
            <p>We're looking for passionate leaders to share their knowledge and experience at the PASC Region J Conference 2026. Whether you're a student leader, advisor, or expert in student leadership, we want to hear from you!</p>
            
            <div class="workshop-highlights">
                <div class="highlight-item">
                    <div class="highlight-icon">🎯</div>
                    <h3>Share Your Expertise</h3>
                    <p>Lead a workshop on topics that matter to student leaders and advisors.</p>
                </div>
                
                <div class="highlight-item">
                    <div class="highlight-icon">🤝</div>
                    <h3>Connect & Network</h3>
                    <p>Meet fellow leaders and make lasting connections in the student council community.</p>
                </div>
                
                <div class="highlight-item">
                    <div class="highlight-icon">🌟</div>
                    <h3>Make an Impact</h3>
                    <p>Help shape the next generation of student leaders across Region J.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!--- Application Form Section --->
<section class="form-section">
    <div class="container">
        <cfif qWorkshopForm.recordCount gt 0>
            <div class="form-intro">
                <h2>Application Form</h2>
                <p class="form-description">Apply to present a workshop at the PASC Region J Conference 2026. Lead Beyond Limits - February 13, 2026.</p>
            </div>
            
            <!--- Bootstrap Accordion for Multiple Forms --->
            <div class="accordion" id="workshopFormsAccordion">
                <cfoutput query="qWorkshopForm">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading#id#">
                            <button 
                                class="accordion-button <cfif currentRow neq 1>collapsed</cfif>" 
                                type="button" 
                                data-target="##collapse#id#" 
                                aria-expanded="<cfif currentRow eq 1>true<cfelse>false</cfif>" 
                                aria-controls="collapse#id#">
                                #form_name#
                            </button>
                        </h2>
                        <div 
                            id="collapse#id#" 
                            class="accordion-collapse collapse <cfif currentRow eq 1>show</cfif>" 
                            aria-labelledby="heading#id#" 
                            data-bs-parent="##workshopFormsAccordion">
                            <div class="accordion-body">
                                <div class="form-container">
                                    #embed_code#
                                </div>
                            </div>
                        </div>
                    </div>
                </cfoutput>
            </div>
        <cfelse>
            <!--- Fallback if no form is active --->
            <div class="no-form-message">
                <div class="message-icon">📋</div>
                <h2>Applications Opening Soon</h2>
                <p>Workshop presenter applications are not currently open. Please check back soon or contact us for more information.</p>
                <a href="index.cfm" class="btn btn-primary">Return Home</a>
            </div>
        </cfif>
    </div>
</section>

<!--- Workshop Guidelines Section --->
<section class="guidelines-section">
    <div class="container">
        <h2>Workshop Guidelines</h2>
        
        <div class="guidelines-grid">
            <div class="guideline-card">
                <h3>📚 Workshop Topics</h3>
                <p>Leadership skills, team building, communication, civic engagement, project planning, creativity, and student council best practices.</p>
            </div>
            
            <div class="guideline-card">
                <h3>⏱️ Session Length</h3>
                <p>Workshops can be 30, 45, or 60 minutes. Choose the format that best fits your content and teaching style.</p>
            </div>
            
            <div class="guideline-card">
                <h3>👥 Target Audience</h3>
                <p>Workshops can be designed for students, advisors, or all attendees. We encourage interactive and engaging sessions.</p>
            </div>
            
            <div class="guideline-card">
                <h3>📅 Important Dates</h3>
                <p>Applications are reviewed on a rolling basis. Early submission is encouraged. Conference date: February 13, 2026.</p>
            </div>
        </div>
    </div>
</section>

<!--- CTA Section --->
<section class="cta-section">
    <div class="container">
        <h2>Questions About Presenting?</h2>
        <p>We're here to help! Reach out if you have any questions about the application process.</p>
        <div class="cta-buttons">
            <a href="about.cfm" class="btn btn-primary">Learn More About PASC Region J</a>
            <a href="index.cfm" class="btn btn-secondary">Return Home</a>
        </div>
    </div>
</section>

<!--- Include footer --->
<cfinclude template="includes/footer.cfm">
