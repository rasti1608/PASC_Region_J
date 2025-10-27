<cfprocessingdirective pageencoding="utf-8">
<!---
*******************************************************************************
* File:        /about.cfm
* Created:     October 25, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     About page for PASC Region J Conference 2026 website
*              Provides information about PASC Region J organization
*              Mission, vision, and what we offer to student leaders
*
* Sections:    1. Hero section
*              2. Who We Are
*              3. Mission & Vision
*              4. What We Do
*              5. Why Join
*              6. Call-to-action
*
* Project:     PASC Region J Conference 2026 Website
*              Lead Beyond Limits - February 13, 2026
*******************************************************************************
--->

<!--- Include header --->
<cfinclude template="includes/header.cfm">

<!--- Hero Section --->
<section class="page-hero">
    <div class="container">
        <h1 class="hero-title">About PASC Region J</h1>
        <p class="hero-subtitle">Celebrating Leadership Since 1932</p>
    </div>
</section>

<!--- Who We Are Section --->
<section class="about-intro">
    <div class="container">
        <div class="about-grid">
            <div class="about-text">
                <h2>Who We Are</h2>
                <p>PASC Region J represents Districts 11 and 12, proudly serving student councils across <strong>Philadelphia, Delaware, Bucks, Montgomery, and Chester Counties</strong>.</p>
                
                <p>Since 1932, the Pennsylvania Association of Student Councils has been dedicated to developing, engaging, and celebrating leaders across our state. PASC helps students improve their lives while learning to lead through service, collaboration, and participation.</p>
                
                <p>Our region is part of a statewide network that empowers and equips students to develop and hone their leadership skills through conferences, events, recognition programs, and networking opportunities.</p>
            </div>
            <div class="about-logo">
                <img src="/assets/img/logo.png" alt="PASC Region J Logo" class="large-logo">
            </div>
        </div>
    </div>
</section>

<!--- Mission & Vision Section --->
<section class="mission-vision">
    <div class="container">
        <div class="mission-vision-grid">
            <div class="mission-box">
                <h2>Mission</h2>
                <p>The Pennsylvania Association of Student Councils develops and elevates leaders by providing opportunities, training, networking, civic engagement, recognition, and resources necessary for students and advisors to engage in their schools, communities, and world.</p>
            </div>
            <div class="vision-box">
                <h2>Vision</h2>
                <p>The Pennsylvania Association of Student Councils envisions leaders being inspired, confident, and empowered to use their voices and put their skills into action for good in their schools, communities, and world.</p>
            </div>
        </div>
    </div>
</section>

<!--- What We Do Section with Photos --->
<section class="what-we-do">
    <div class="container">
        <h2 class="section-title">What We Do</h2>
        <p class="section-intro">PASC Region J provides year-round opportunities for students and advisors to develop and apply leadership skills in order to improve themselves, their schools, and their communities.</p>
        
        <div class="activities-grid">
            <div class="activity-card">
                <img src="/assets/img/gallery/f2.jpg" alt="Students holding PASC sign">
                <h3>Conferences & Events</h3>
                <p>We host regional conferences that bring together student leaders from across Districts 11 and 12. Our annual conference features inspiring keynote speakers, interactive workshops, and networking opportunities.</p>
            </div>
            
            <div class="activity-card">
                <img src="/assets/img/gallery/f3.jpg" alt="Students at registration">
                <h3>Leadership Development</h3>
                <p>Through workshops, training sessions, and hands-on activities, we help students develop essential leadership skills including communication, collaboration, problem-solving, and civic engagement.</p>
            </div>
            
            <div class="activity-card">
                <img src="/assets/img/gallery/f1.jpg" alt="Students collaborating">
                <h3>Networking & Connection</h3>
                <p>Connect with fellow student leaders, share ideas, and build lasting relationships. Our events provide forums and opportunities for students and advisors to collaborate and learn from one another.</p>
            </div>
        </div>
    </div>
</section>

<!--- Why Join Section --->
<section class="why-join">
    <div class="container">
        <h2 class="section-title">Why Join PASC Region J?</h2>
        
        <div class="benefits-grid">
            <div class="benefit-item">
                <div class="benefit-icon">🎯</div>
                <h3>Leadership Training</h3>
                <p>Access to state-of-the-art leadership programs, conferences, and workshops designed to develop your skills.</p>
            </div>
            
            <div class="benefit-item">
                <div class="benefit-icon">🤝</div>
                <h3>Networking Opportunities</h3>
                <p>Connect with student leaders from across the region and build relationships that last beyond high school.</p>
            </div>
            
            <div class="benefit-item">
                <div class="benefit-icon">🏆</div>
                <h3>Recognition & Awards</h3>
                <p>Eligibility for PASC awards, scholarships, and recognition programs celebrating your leadership achievements.</p>
            </div>
            
            <div class="benefit-item">
                <div class="benefit-icon">📚</div>
                <h3>Resources & Support</h3>
                <p>Access to advisors, training materials, best practices, and guidance from regional and state officers.</p>
            </div>
            
            <div class="benefit-item">
                <div class="benefit-icon">🎤</div>
                <h3>Leadership Positions</h3>
                <p>Opportunities to run for regional and state leadership positions, developing your skills at the highest level.</p>
            </div>
            
            <div class="benefit-item">
                <div class="benefit-icon">🌟</div>
                <h3>Make a Difference</h3>
                <p>Use your voice to create positive change in your school, community, and beyond through service and advocacy.</p>
            </div>
        </div>
    </div>
</section>

<!--- CTA Section --->
<section class="cta-section">
    <div class="container">
        <h2>Ready to Lead Beyond Limits?</h2>
        <p>Join us for an inspiring day of leadership, workshops, and networking!</p>
        <div class="cta-buttons">
            <a href="workshops.cfm" class="btn btn-primary">View Workshops</a>
            <a href="gallery.cfm" class="btn btn-secondary">View Gallery</a>
        </div>
    </div>
</section>

<!--- Include footer --->
<cfinclude template="includes/footer.cfm">
