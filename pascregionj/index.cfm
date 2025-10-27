<cfprocessingdirective pageencoding="utf-8">
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

<!--- Include header --->
<cfinclude template="includes/header.cfm">

<!--- Hero Section --->
<section class="hero">
    <div class="hero-content">
        <div class="stars-background"></div>
        <div class="hero-text">
            <h1 class="hero-title">PASC REGION J CONFERENCE 2026</h1>
            <p class="hero-subtitle">Lead Beyond Limits - February 13, 2026</p>
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
