# PASC Region J Conference Website - Project Summary

**Document Date:** October 25, 2025  
**Project Status:** Planning & Development Phase  
**Client:** Oliver (Student, Neshaminy High School Student Council)  

---

## PROJECT OVERVIEW

### What is PASC?
**PASC** = **Pennsylvania Association of Student Councils**

- Statewide organization that develops, engages, and celebrates student leaders across Pennsylvania
- Tagline: "Developing, engaging, and celebrating leaders"
- Founded in 1932
- Works with student councils, National Honor Society (NHS), and National Junior Honor Society (NJHS) chapters statewide

### Geographic Structure
PASC is divided into **10 geographic regions** across Pennsylvania. Each region:
- Is overseen by a Region Board
- Has an adult Region Director and student Region Representative
- Hosts events and conferences throughout the year
- Represents multiple counties

---

## REGION J DETAILS

### What is Region J?
**Region J** represents **5 counties** in the Philadelphia area:
- **Bucks County**
- **Chester County**
- **Delaware County**
- **Montgomery County**
- **Philadelphia County**

### Region J Leadership
- **Region Director:** Jillian Dwyer (regionjdirector@pasc.net)
- **Region Representative:** Karlee Dwyer (regionjrep@pasc.net)
- **Contact Email:** regionjrep@gmail.com

### Schools in Region J
Approximately **50 high schools** across the 5 counties participate in Region J activities.

**Notable schools mentioned:**
- Neshaminy High School (Bucks County) - **HOSTING 2026 CONFERENCE**
- Multiple schools visible in regional map

---

## THE CONFERENCE EVENT

### Event Details
- **Event Name:** PASC Region J Leadership Conference
- **Date:** February 13, 2026
- **Time:** 10:30 AM - 4:00 PM (Registration starts at 10:00 AM)
- **Location:** Neshaminy High School, Langhorne, PA
- **Host:** Neshaminy High School Student Council
- **Theme:** Solar System / Outer Space - "Reach for the stars, lead beyond limits"

### Why This Conference Matters
- **First Time:** Neshaminy High School selected to host the annual Region J conference
- **Student-Led:** Oliver and ~12 other student council members are organizing the entire event
- **Regional Impact:** Expected attendance from ~50 schools across 5 counties
- **Leadership Development:** Workshops, presentations, and activities for student leaders

### Conference Components
1. **Workshop Sessions** - Student-led presentations on leadership topics
2. **Registration Process** - Schools register attendees and advisors
3. **T-Shirt Orders** - Conference merchandise
4. **Keynote/Activities** - Leadership skills development
5. **Networking** - Students from across Region J connect

---

## THE WEBSITE PROJECT

### Why They Need a Website

**The Problem:**
- Teacher told 12 student council members to "build a website with changing content"
- Students have NO web development experience
- They were considering basic tools like Google Sites
- Need professional solution for promotional and functional purposes

**The Goal:**
- Replace basic/limited solutions with custom professional website
- Promote the conference to all Region J schools
- Facilitate workshop applications and event registration
- Provide platform for ongoing announcements and updates
- Showcase Neshaminy's leadership in hosting
- Reflect the space/solar system theme throughout design
- Allow easy content updates without coding knowledge

### Project Scope
**This is a TEMPORARY website** - for the 2025-2026 school year only, specifically for the February 13, 2026 conference. After the conference, the site may be retired OR potentially adopted by PASC Region J for future use.

---

## DESIGN & BRANDING

### Logo
**Primary Logo:** PASC circular black and white logo
- Features: Liberty Bell, open book, gavel
- Text: "PENNSYLVANIA ASSOCIATION OF STUDENT COUNCILS"
- Text: "CELEBRATING LEADERSHIP"
- Text: "SINCE 1932"

**Custom Logo Plan:**
- Oliver wants to create a custom "Region J" version
- Add purple "J" to the existing PASC logo
- Make it unique for Region J and this conference

### Color Scheme
**Neshaminy School Colors:** Red and Blue (NOT using these)

**Conference Theme Colors:**
- **Purple** (primary - space theme)
- **Blue** (accent - space/cosmic)
- **Pink/Neon** (highlights - cosmic/galactic)
- **Dark navy/black** (backgrounds - deep space)
- Description from Oliver: "doing outer space/planets theme - so purple shirts with design, also blue and pink colors that resemble space colors, neon"

### Visual References
- **Instagram:** @pascregionj (active with conference photos and updates)
- **Facebook:** PASC Region J (historical photos, event details)
- **Website:** pasc.net/region-j (existing but basic information page)

---

## TECHNICAL REQUIREMENTS

### Platform & Hosting
- **Development Platform:** ColdFusion (Lucee 5.4.8 + 2 LTS)
- **Local Environment:** Already set up and ready
- **Hosting Provider:** DailyRazor (selected previously)
- **Hosting Cost:** $11.96/month = $161.52 for 12 months (includes free domain)
- **Database:** MS SQL Server (included with DailyRazor hosting)

### Domain Name
**Strategy:** Wait to purchase until MVP is approved
- Will register domain after Oliver/team approves the working local version
- Estimated domain will be related to "pascregionj" or conference theme
- No rush - unlikely to be stolen, and alternatives exist if needed

---

## WEBSITE FEATURES & FUNCTIONALITY

### Public-Facing Pages

**1. Home Page**
- Hero section with space theme
- Event date/location/time
- Countdown to conference
- Latest announcements (dynamic from database)
- Quick links to registration/workshops

**2. About/Schedule Page**
- Conference overview
- Detailed schedule/timeline
- What to expect
- Venue information

**3. Workshops Page**
- List of workshop sessions
- Workshop descriptions
- **Embedded Google Form** for workshop applications
- Application deadline information

**4. Registration Page**
- Event registration details
- Cost per student (TBD)
- **Embedded Google Form** for registration
- Registration window: January 5-23, 2026

**5. T-Shirts/Merchandise**
- T-shirt design preview
- Sizing information
- **Embedded Google Form** for orders

**6. Contact Page**
- Señor Kain (Faculty Advisor) contact
- Student Council Gmail
- Region J Director/Rep information
- Social media links

**7. Resources/Downloads**
- Downloadable flyers (PDF)
- Conference materials
- PASC information

### Admin Panel (Password Protected)

**Access Control:**
- Login system for authorized users only
- Likely 3-5 users (student council leadership + faculty advisor)

**Admin Features:**
1. **Announcements Management**
   - Add/Edit/Delete announcements
   - Set publish dates
   - Mark as featured/important

2. **Google Forms Management**
   - Add/Remove/Edit embedded Google Forms
   - Control which forms appear on which pages
   - Update form URLs

3. **Resources Management**
   - Upload PDFs and downloadable files
   - Add descriptions
   - Organize by category

4. **Content Updates**
   - Edit page text without touching code
   - Update dates, times, information
   - Modify schedule/timeline

### Database Structure (Preliminary)

**Tables Needed:**
1. `admin_users` - Login credentials
2. `announcements` - News/updates for homepage
3. `google_forms` - Manage embedded forms
4. `resources` - Downloadable files/PDFs
5. `page_content` - Editable text content
6. `audit_log` - Track who changed what (optional)

---

## DEVELOPMENT STRATEGY

### Phase 1: Build MVP Locally (THIS WEEKEND)
**Goal:** Create working prototype that Oliver and team can see and interact with

**Deliverables:**
- All public pages with space theme design
- Placeholder content (based on Facebook/Instagram research)
- Embedded Google Forms (using existing forms if available)
- Basic admin panel structure
- Mobile-responsive design

**Why Local First:**
- No money spent until approved
- Students can see/touch/experience the site
- Easy to make changes based on feedback
- Risk-free iteration

### Phase 2: Review & Feedback
- Demo to Oliver
- Demo to other 11 student council members
- Demo to Señor Kain (faculty advisor)
- Collect all feedback and change requests

### Phase 3: Revisions
- Implement requested changes
- Adjust content/design
- Fine-tune functionality
- Get final approval

### Phase 4: Deployment (After Approval)
- Purchase domain name
- Purchase DailyRazor hosting (12 months, $161.52)
- Set up production database
- Deploy website to live server
- Configure DNS
- Final testing

### Phase 5: Handoff & Training
- Train admin users on panel
- Provide documentation
- Give login credentials
- Establish support process

---

## CONTENT SOURCES

### What We Have Available
1. **Original PDF** - Conference planning document from Oliver
2. **Facebook Page** - @pascregionj (photos, event history, announcements)
3. **Instagram** - @pascregionj (current photos, visual style reference)
4. **Existing Website** - pasc.net/region-j (basic info, structure reference)
5. **Google Forms** - Already in use (example: Region J Board Application)
6. **Previous Conference Materials** - Photos from past Region J events

### What We Need from Oliver
- [ ] Final text/copy for all pages
- [ ] Specific workshop details and descriptions
- [ ] Contact email addresses (Señor Kain, Student Council Gmail)
- [ ] Social media handles to link
- [ ] Workshop application deadline date
- [ ] Cost per student for registration
- [ ] Number of expected attendees
- [ ] How many people need admin panel access
- [ ] Any existing PDFs/flyers to upload
- [ ] Domain name preference

**Note:** We can proceed with placeholder content and update later. The goal is to show them something working so they can provide better feedback.

---

## PROJECT TIMELINE

### Target Dates
- **Today (October 25):** Begin MVP development
- **This Weekend:** Complete local MVP
- **Next Week:** Oliver team review and feedback
- **Early November:** Revisions and final approval
- **Mid November:** Purchase hosting/domain and deploy
- **November 6, 2025:** Initial launch target (from original BRD)
- **January 5, 2026:** Registration opens
- **January 23, 2026:** Registration closes
- **February 13, 2026:** CONFERENCE DAY
- **Post-Conference:** Site may continue or be retired

---

## KEY STAKEHOLDERS

### Primary Contact
**Oliver** - Student, Neshaminy High School Student Council
- Project lead for website
- Son of developer (you)
- Age: 15, turning 16 in 2-3 months
- Part of 12-person organizing committee

### Faculty Advisor
**Señor Kain** - Neshaminy High School teacher
- Supervising the student council
- Will need to approve final website

### Student Council Team
- ~12 students total on organizing committee
- Various responsibilities:
  - Some handling t-shirts
  - Some created the PDF planning document
  - Oliver assigned to website
  - All will review and provide feedback

### Region J Leadership
- Jillian Dwyer (Region Director)
- Karlee Dwyer (Region Rep)
- May see the site, may adopt for future use

---

## DESIGN APPROACH

### Theme: Outer Space / Solar System
**Visual Elements:**
- Stars, planets, galaxies, nebulae
- Cosmic backgrounds
- Space-inspired graphics
- Futuristic/modern design

**Color Psychology:**
- Purple: Creativity, imagination, cosmic mystery
- Blue: Trust, stability, depth of space
- Pink/Neon: Energy, excitement, nebulae
- Dark backgrounds: Deep space, professionalism

### Mobile-First Design
**Why:** Students primarily use phones to access websites
- Responsive layout for all screen sizes
- Touch-friendly navigation
- Fast loading on mobile data
- Optimized images

### User Experience Goals
- **Simple:** Easy to navigate, clear information hierarchy
- **Visual:** Eye-catching space theme, professional appearance
- **Fast:** Quick page loads, minimal clicks to key info
- **Accessible:** Works for students, teachers, parents

---

## SUCCESS CRITERIA

### For Oliver & Team
- ✅ Looks professional and represents Neshaminy well
- ✅ Space theme is clear and attractive
- ✅ Easy for them to update content via admin panel
- ✅ Forms work smoothly for registration/applications
- ✅ Mobile-friendly for student access
- ✅ Impresses other schools in Region J

### For Attendees (Students/Teachers)
- ✅ Find event information quickly
- ✅ Register easily through embedded forms
- ✅ See workshop options clearly
- ✅ Download resources as needed
- ✅ Stay updated with announcements

### Technical
- ✅ Works in all major browsers
- ✅ Fast page load times
- ✅ Secure admin panel
- ✅ Database performs well
- ✅ Forms integrate seamlessly
- ✅ Easy to maintain

---

## RISKS & MITIGATIONS

### Risk 1: Students Don't Know What They Want
**Mitigation:** Build MVP with our best judgment, let them react to something tangible rather than trying to describe abstract requirements

### Risk 2: Scope Creep
**Mitigation:** Clear BRD and Site Map already approved, stick to MVP features, document any new requests as "Phase 2"

### Risk 3: Timeline Pressure
**Mitigation:** Working locally first, no hosting commitment until approved, can iterate quickly

### Risk 4: Content Delays
**Mitigation:** Use placeholder content from Facebook/Instagram, easy to swap in final content later through admin panel

### Risk 5: Budget Concerns
**Mitigation:** Only $161.52 for entire year, free domain included, no payment until they approve the working site

---

## NEXT IMMEDIATE STEPS

### This Weekend (Oct 25-27)
1. ✅ Create project folder structure
2. ✅ Set up local database with schema
3. ✅ Build homepage with space theme
4. ✅ Build remaining static pages
5. ✅ Embed Google Forms
6. ✅ Build basic admin panel
7. ✅ Connect everything to database
8. ✅ Test on mobile devices
9. ✅ Prepare demo for Oliver

### Monday/Tuesday (Oct 28-29)
- Demo to Oliver
- Show him on his phone and computer
- Collect feedback
- Make revision list

### Rest of Week
- Implement changes
- Polish design
- Get final approval

---

## IMPORTANT NOTES

### About the Logo
- Oliver will create custom Region J logo himself
- He has Photoshop skills to add purple "J" to PASC logo
- Not a blocker for development - we use existing logo as placeholder
- Can swap in new logo anytime once created

### About Google Forms
- They're already using Google Forms (confirmed via examples)
- We just embed their forms, don't create new ones
- Forms are managed by them in their Google account
- Admin panel just controls which form appears on which page

### About the Content
- Much of the content exists on Facebook and Instagram already
- We're not creating content from scratch - we're organizing existing content
- Placeholder content is acceptable for MVP
- They can update through admin panel once live

### About Future Use
- This is technically a "one-time" website for Feb 2026 conference
- However, if successful, Region J leadership might want to keep it going
- Could become the official Region J website year-round
- Potential ongoing hosting relationship beyond initial 12 months

---

## REFERENCE LINKS

- **PASC Main Site:** https://www.pasc.net
- **Region J Page:** https://www.pasc.net/region-j
- **Instagram:** https://www.instagram.com/pascregionj
- **Facebook:** https://www.facebook.com/pascregionj
- **Region Rep Email:** regionjrep@gmail.com
- **Region Director Email:** regionjdirector@pasc.net

---

## DOCUMENT CONTROL

**Created By:** Dad (Developer helping Oliver)  
**Created Date:** October 25, 2025  
**Last Updated:** October 25, 2025  
**Version:** 1.0  
**Status:** Active Project  

**Distribution:**
- Oliver (Student Council, Project Lead)
- Dad (Developer)
- Señor Kain (Faculty Advisor) - if needed
- Student Council Team - for reference

---

**END OF SUMMARY**

This document will be updated as the project progresses and new information becomes available.
