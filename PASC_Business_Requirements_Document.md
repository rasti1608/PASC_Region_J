# PASC Region J Conference - Business Requirements Document

**Project Name:** PASC Region J Conference Website  
**Host Organization:** Neshaminy Student Council  
**Project Owner:** Oliver  
**Document Date:** October 22, 2025  
**Target Completion:** November 6, 2025 (Initial Version)  

---

## 1. PROJECT OVERVIEW

### 1.1 Purpose
Create a professional, custom-designed website for the PASC (Pennsylvania Association of Student Councils) Region J Leadership Conference hosted by Neshaminy High School.

### 1.2 Event Details
- **Event Name:** PASC Region J Leadership Conference
- **Theme:** Solar System / Space - "Reach for the stars, lead beyond limits"
- **Date:** February 13, 2026
- **Time:** 10:30 AM - 4:00 PM (Registration begins 10:00 AM)
- **Location:** Neshaminy High School
- **Expected Attendance:** [TO BE CONFIRMED] students and advisors

### 1.3 Project Goals
1. Replace basic Google Sites approach with professional custom website
2. Promote the conference to Region J schools
3. Facilitate workshop applications and event registration
4. Provide platform for ongoing announcements and updates
5. Showcase Neshaminy's leadership in hosting the event
6. Reflect the space/solar system theme throughout design

---

## 2. TARGET AUDIENCE

### 2.1 Primary Users
- High school student council members from Region J schools (PA)
- School advisors and faculty sponsors
- Neshaminy Student Council organizers

### 2.2 User Needs
- Easy access to event information
- Simple registration process
- Clear workshop details and application process
- Mobile-friendly access (students primarily use phones)
- Visual appeal matching space theme

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 Public-Facing Features (Website Visitors)

#### 3.1.1 Event Information Display
- **Event overview** with date, time, location, theme
- **Conference schedule/timeline:**
  - 10:00-10:30 AM: Registration
  - 10:30-11:00 AM: Welcome & Keynote Speaker
  - 11:00 AM onwards: Lunch rotation + Two workshop sessions
  - End of day: Closing keynote & Color Olympics
- **What's included:** Name badges, lanyards, t-shirts, lunch
- **Venue map** showing Neshaminy High School layout
- **Planet-themed room directory** (Sun, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Moon, Mercury)

#### 3.1.2 Registration System
- **Embedded Google Form** for individual student registration
- Registration window: **January 5 - January 23, 2026**
- Form must collect:
  - Student name, school, grade
  - Advisor contact information
  - Dietary restrictions/allergies
  - T-shirt size
  - [TO BE CONFIRMED: Payment information collection method]
- Display registration status (Open/Closed) dynamically based on dates

#### 3.1.3 Workshop Information
- **Embedded Google Form** for workshop applications
- Workshop application deadline: [TO BE CONFIRMED - December?]
- Guidelines displayed:
  - Groups of 2-3 presenters
  - Each workshop presented TWICE during the day
  - Workshops focus on: Leadership, teamwork, communication, discussion
  - Each breakout room named after a planet
- Categories accepting applications:
  - Student Council workshops (goal: 12 workshops)
  - Class Office workshops (goal: 24 workshops)
  - NHS (National Honor Society) - [TO BE CONFIRMED if participating]
  - Mini-THON - [TO BE CONFIRMED if participating]

#### 3.1.4 Announcements & News Feed
- **Dynamic announcements section** on homepage
- Display latest 5-10 announcements
- Show date posted
- Ability to mark announcements as "Important" (pinned to top)
- Examples of announcements:
  - "Keynote speaker announced!"
  - "Workshop applications now open"
  - "Registration deadline extended"
  - "New survey link posted"

#### 3.1.5 T-Shirt Information
- Display t-shirt design preview (when available)
- Design themes: Glow-in-the-dark, stars, solar system, neon colors
- **Embedded Google Form** for t-shirt orders
- School colors note: Red/blue (Neshaminy) but event using purple, blue, pink, neon (space theme)

#### 3.1.6 Contact Information
- **Señor Kain's email:** [TO BE CONFIRMED]
- **Student Council Gmail:** [TO BE CONFIRMED]
- **Student Council Instagram:** [TO BE CONFIRMED - handle]
- **Region J social media links:** [TO BE CONFIRMED]
- Contact form or direct email links

#### 3.1.7 Payment Information
- Display cost per student: [TO BE CONFIRMED - amount]
- Payment instructions
- School payment process details

#### 3.1.8 Downloadable Resources
- **Digital pamphlet/flyer (PDF)** including:
  - Event overview
  - Date, time, location
  - Registration window dates
  - Workshop application information
  - Contact details
  - Venue map
  - Region J social media

---

### 3.2 Admin Panel Features (Content Management)

#### 3.2.1 User Access
- Login system for authorized users
- Multiple team members need access: [TO BE CONFIRMED - How many users? Just Oliver or entire team?]
- Password-protected admin area

#### 3.2.2 Content Management Capabilities
**Must be able to add/edit/delete:**
1. **Announcements/News Items**
   - Title
   - Content (text)
   - Date posted (auto-generated)
   - Mark as "Important" (yes/no)
   - Publish/unpublish

2. **Event Information Updates**
   - Schedule changes
   - Keynote speaker information
   - Special activities/performances
   - Color Olympics details

3. **Important Dates/Deadlines**
   - Registration open/close dates
   - Workshop application deadline
   - Website deadline
   - Flyer deadline

4. **File Uploads**
   - Upload PDFs (flyers, pamphlets, maps)
   - Upload images (logos, event photos, t-shirt designs)
   - Manage downloadable resources

5. **Google Form Links**
   - Update embedded form URLs
   - Swap out forms as needed (e.g., January survey)

#### 3.2.3 Admin Panel Must Be:
- **Simple/intuitive** - team members are students, not technical
- **Mobile-friendly** - students may update from phones
- **Quick to use** - add announcement in under 2 minutes

---

## 4. DESIGN REQUIREMENTS

### 4.1 Visual Theme
- **Space/Solar System aesthetic**
- **Color palette:** Purple, dark blue, pink, neon accents
- **Design elements:**
  - Stars, planets, galaxies
  - Glow effects
  - Constellation patterns
  - Rocket ships, orbits

### 4.2 Branding
- Incorporate PASC logo/seal (Pennsylvania Association of Student Councils)
- Neshaminy Student Council branding
- Tagline: "Reach for the stars, lead beyond limits"
- Alternative phrases to use:
  - "Out of this world"
  - "Leadership is out of this world"
  - "We're all on one orbit"
  - "Navigate to success"

### 4.3 Responsive Design
- **Mobile-first approach** - students primarily access via phones
- Desktop/tablet optimization
- Touch-friendly navigation
- Fast loading times

### 4.4 Navigation
- Clear, intuitive menu structure
- Maximum 1-2 clicks to any page
- Sticky header with navigation
- Footer with contact info and social links

---

## 5. TECHNICAL REQUIREMENTS

### 5.1 Hosting & Domain
- Domain name: [TO BE DETERMINED - checking availability]
  - Suggestions: pascregionj.com, regionjpasc.com, pascregionj2026.com
- Hosting: DailyRazor ColdFusion Hosting (CF-ONE plan, $11.96/month)
- SSL certificate included (HTTPS)
- Free domain registration included

### 5.2 Technology Stack
- **Backend:** ColdFusion (CFML) - Lucee engine
- **Database:** Microsoft SQL Server (included in hosting)
- **Frontend:** HTML5, CSS3, JavaScript
- **Forms:** Google Forms (embedded via iframe)
- **Control Panel:** Plesk (provided by host)

### 5.3 Browser Compatibility
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Android Chrome)

### 5.4 Performance
- Page load time under 3 seconds
- Optimized images
- Minimal external dependencies

---

## 6. CONTENT REQUIREMENTS

### 6.1 Content to be Provided by Oliver/Team
- [ ] Event description text
- [ ] Keynote speaker information (when available)
- [ ] Workshop categories and descriptions
- [ ] T-shirt design images
- [ ] Venue map/floor plan
- [ ] PASC and Neshaminy logos (high resolution)
- [ ] Photos for homepage (space-themed or event-related)
- [ ] Advisor/contact email addresses
- [ ] Social media handles
- [ ] Payment amount and instructions
- [ ] Any existing promotional materials

### 6.2 Sample Announcement Topics
- "Neshaminy hosting Region J - drumroll announcement!"
- "Website is live!"
- "Workshop applications now open"
- "Keynote speaker revealed"
- "Registration opens January 5th"
- "T-shirt design voting"
- "Flyers available for download"
- "Only 2 weeks until registration closes!"

---

## 7. PROJECT SCOPE

### 7.1 IN SCOPE (What We're Building)
✅ Custom website with space theme design  
✅ Multiple pages with navigation  
✅ Embedded Google Forms (workshop applications, registration, t-shirt orders)  
✅ Dynamic announcements/news section  
✅ Admin panel for content updates  
✅ Database for announcements and dynamic content  
✅ Mobile-responsive design  
✅ Contact information page  
✅ Downloadable resources (PDF pamphlets)  
✅ Venue map display  
✅ Event schedule/timeline  
✅ Domain registration and hosting setup  

### 7.2 OUT OF SCOPE (What We're NOT Building)
❌ Custom registration system (using Google Forms instead)  
❌ Payment processing (handled externally by schools)  
❌ Workshop selection system (Google Forms handles this)  
❌ Live chat or messaging system  
❌ User accounts for attendees  
❌ Mobile app  
❌ Email marketing system  
❌ Social media management  
❌ E-commerce/store  
❌ Database of attendees (Google Sheets from forms handles this)  

### 7.3 PHASE 2 POSSIBILITIES (Future Enhancements)
- Photo gallery after event
- Testimonials from attendees
- Archive of past Region J conferences
- Blog/articles section
- Interactive schedule builder

---

## 8. TIMELINE & MILESTONES

### 8.1 Key Dates
| Date | Milestone |
|------|-----------|
| **October 22, 2025** | Project kickoff, requirements gathering |
| **October 23-24, 2025** | Domain selection and hosting setup |
| **October 25-31, 2025** | Design and development |
| **November 1-5, 2025** | Testing and revisions |
| **November 6, 2025** | **Initial website launch** (per Oliver's requirement) |
| **November-December 2025** | Add workshop application forms, refine content |
| **December 2025** | Workshop form link goes live |
| **January 5, 2026** | Registration opens |
| **January 2026** | Post survey link |
| **January 23, 2026** | Registration closes |
| **February 13, 2026** | **CONFERENCE DAY** |

### 8.2 Deliverables

#### Phase 1 - Initial Launch (by November 6, 2025)
- Custom designed website with space theme
- Static pages: Home, About, Schedule, Contact
- Placeholder sections for forms (forms added when ready)
- Basic announcements section
- Domain and hosting live

#### Phase 2 - Full Functionality (by December 2025)
- Admin panel operational
- Embedded Google Forms (workshop applications)
- Dynamic announcements system
- All content finalized

#### Phase 3 - Registration Phase (January 2026)
- Registration form embedded
- Registration status displayed dynamically
- Regular announcements posted

#### Phase 4 - Post-Event (February 2026+)
- Archive site for reference
- Optional: Add photos/recap

---

## 9. SUCCESS CRITERIA

The website will be considered successful if it:

✅ **Launches by November 6, 2025** with professional appearance  
✅ **Attracts registrations** from Region J schools (measurable via Google Forms)  
✅ **Receives workshop applications** meeting goals (12 StuCo, 24 Class Office)  
✅ **Allows easy content updates** by Oliver's team without developer assistance  
✅ **Works seamlessly on mobile devices** (where most students will access it)  
✅ **Reflects the space theme** professionally and creatively  
✅ **Receives positive feedback** from advisors and Region J representatives  
✅ **Requires minimal troubleshooting** on conference day  

---

## 10. RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Domain unavailable | Medium | Have 5+ backup domain options ready |
| Hosting setup delays | High | Purchase hosting immediately upon approval |
| Content not provided on time | Medium | Request content by specific dates with reminders |
| Google Forms not ready | Low | Use placeholder text, swap in forms when ready |
| Admin panel too complex | Medium | Design with simplicity first, get feedback early |
| Mobile compatibility issues | High | Test on multiple devices throughout development |
| Last-minute scope changes | High | Refer to approved BRD, document change requests |

---

## 11. ASSUMPTIONS

This project assumes:
- Oliver's team will provide content (text, images, logos) in timely manner
- Google Forms will be created and managed by Oliver's team
- Domain will be available for registration
- DailyRazor hosting will work as expected
- Oliver's team has basic computer skills to use admin panel
- Schools will handle payment collection separately
- Region J will promote the website through their channels

---

## 12. DEPENDENCIES

This project depends on:
- Domain availability and registration
- Hosting account setup (DailyRazor)
- Content delivery from Oliver's team
- Google Forms creation by Oliver's team
- Approval of this requirements document
- Access to PASC/Neshaminy branding materials

---

## 13. QUESTIONS REQUIRING CONFIRMATION

Please provide answers to the following:

1. **Exact workshop application deadline date:** [TO BE CONFIRMED]
2. **Señor Kain's email address:** [TO BE CONFIRMED]
3. **Student Council Gmail address:** [TO BE CONFIRMED]
4. **Student Council Instagram handle:** [TO BE CONFIRMED]
5. **Region J social media links:** [TO BE CONFIRMED]
6. **Cost per student (for payment info page):** [TO BE CONFIRMED]
7. **Expected number of attendees:** [TO BE CONFIRMED]
8. **How many people need admin panel access?** [TO BE CONFIRMED]
9. **Should NHS and Mini-THON submit workshop proposals?** [TO BE CONFIRMED]
10. **Preferred domain name (will check availability):** [TO BE CONFIRMED]
11. **Any existing promotional materials/branding guidelines?** [TO BE CONFIRMED]

---

## 14. APPROVAL

By approving this Business Requirements Document, you confirm that:
- The scope accurately reflects the project needs
- The timeline is achievable and acceptable
- You understand what is IN SCOPE and OUT OF SCOPE
- You will provide required content and information
- No major features are missing from this document

**Approval Required:**

**Name:** Oliver  
**Role:** Project Lead, Neshaminy Student Council  
**Signature:** ___________________________  
**Date:** ___________________________  

**Additional Approvals (if needed):**

**Name:** Señor Kain  
**Role:** Faculty Advisor  
**Signature:** ___________________________  
**Date:** ___________________________  

---

## 15. CHANGE REQUEST PROCESS

After approval, any changes to scope must:
1. Be submitted in writing
2. Include justification for the change
3. Be evaluated for impact on timeline and complexity
4. Be approved before implementation

**Minor changes** (typos, small content edits): Can be made anytime  
**Major changes** (new pages, features): Require discussion and may affect timeline  

---

**Document Version:** 1.0  
**Created By:** Developer (Dad helping Oliver)  
**Next Review Date:** Upon Oliver's feedback  

---

## NOTES FOR OLIVER:

Please review this document carefully and:
1. ✅ Check that everything you need is listed
2. ❌ Flag anything missing or incorrect
3. ❓ Answer all "[TO BE CONFIRMED]" questions
4. ✍️ Approve by signing above (or email/text confirmation works too)

**Once approved, we can proceed with domain selection and development!**
