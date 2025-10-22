# PASC Region J Conference - Site Map & Navigation Structure

**Project Name:** PASC Region J Conference Website  
**Document Date:** October 22, 2025  
**Document Version:** 1.0  

---

## 1. SITE ARCHITECTURE OVERVIEW

This website consists of **two main sections:**

1. **PUBLIC SITE** - Accessible to all visitors (students, advisors, general public)
2. **ADMIN PANEL** - Password-protected, accessible only to Neshaminy Student Council team

---

## 2. PUBLIC SITE STRUCTURE

### 2.1 Visual Site Map

```
┌─────────────────────────────────────────┐
│           HOME PAGE                     │
│  (pascregionj.com)                      │
│  - Hero banner with theme/date          │
│  - Latest announcements feed            │
│  - Quick links to register/workshops    │
│  - Event highlights                     │
└─────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┬───────────┬───────────┬──────────┐
        │           │           │           │           │          │
        ▼           ▼           ▼           ▼           ▼          ▼
    ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
    │ ABOUT  │  │SCHEDULE│  │WORKSHOPS│ │REGISTER│  │CONTACT │  │RESOURCES│
    └────────┘  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘
```

### 2.2 Detailed Page Breakdown

---

#### **HOME PAGE** (`index.cfm`)

**URL:** `https://pascregionj.com/`

**Purpose:** First impression, event overview, quick access to key actions

**Content Sections:**
1. **Hero Section**
   - Large space-themed banner
   - Event name: "PASC Region J Conference"
   - Tagline: "Reach for the stars, lead beyond limits"
   - Date: February 13, 2026
   - Time: 10:30 AM - 4:00 PM
   - Location: Neshaminy High School
   - Prominent "REGISTER NOW" button (appears when registration opens)

2. **Latest Announcements**
   - Display 5 most recent announcements
   - "Important" announcements pinned at top
   - Each shows: Title, date, brief content
   - "Read all announcements" link

3. **Event Highlights**
   - What's included (badges, t-shirts, lunch, workshops)
   - Keynote speaker teaser (when available)
   - Workshop count (e.g., "24+ workshops to choose from!")

4. **Quick Actions (Call-to-Action Buttons)**
   - "Apply to Present a Workshop" (links to Workshops page)
   - "View Schedule" (links to Schedule page)
   - "Register for Event" (links to Register page)

5. **Countdown Timer (Optional)**
   - Days until conference
   - OR days until registration opens

6. **Social Media Feed/Links**
   - Instagram embed or links
   - Follow for updates

---

#### **ABOUT PAGE** (`about.cfm`)

**URL:** `https://pascregionj.com/about`

**Purpose:** Explain what PASC Region J is, what to expect at the conference

**Content Sections:**
1. **About PASC Region J**
   - Pennsylvania Association of Student Councils
   - What is Region J (which schools)
   - Purpose of regional conferences

2. **About This Conference**
   - Theme explanation: Solar System / "Reach for the stars"
   - Why Neshaminy is hosting
   - What makes this conference special

3. **What to Expect**
   - Conference flow/structure
   - Workshop format (groups of 2-3, presented twice)
   - Lunch details
   - Color Olympics
   - Networking opportunities

4. **Who Should Attend**
   - Student council members
   - Class officers
   - Student leaders
   - Advisors

5. **What's Included in Your Registration**
   - Name badge & lanyard
   - Conference t-shirt
   - Lunch (hoagies, chips, snacks)
   - Access to all workshops
   - Conference materials

6. **Theme Explanation**
   - Planet-themed breakout rooms
   - Space decor and atmosphere
   - "Follow the spaceship to Saturn!" navigation concept

---

#### **SCHEDULE PAGE** (`schedule.cfm`)

**URL:** `https://pascregionj.com/schedule`

**Purpose:** Detailed timeline of the conference day

**Content Sections:**
1. **Conference Day Timeline**
   ```
   10:00 - 10:30 AM    Registration & Check-In
                       (Arrive at hub, receive kit)
   
   10:30 - 11:00 AM    Welcome & Opening Keynote
                       (Keynote speaker introduction)
   
   11:00 AM - 12:00 PM  Session 1
                       • Half of attendees: Lunch
                       • Half of attendees: Workshop Round 1
   
   12:00 - 1:00 PM     Session 2
                       • Groups switch
                       • Workshop Round 2 / Lunch
   
   1:00 - 2:00 PM      Workshop Round 2 (continued)
   
   2:00 - 3:30 PM      Activities & Color Olympics
   
   3:30 - 4:00 PM      Closing Keynote & Wrap-Up
   ```

2. **Workshop Sessions**
   - Two 1-hour workshop sessions
   - Each attendee participates in 2 workshops
   - Rotation system explained

3. **Lunch Details**
   - Menu: Hoagies (Pizza Pie 2), chips, cookies, snacks
   - Dietary accommodations available
   - Lunch location: [Cafeteria/Hub]

4. **Keynote Speakers**
   - Opening keynote: [TO BE ANNOUNCED]
   - Closing keynote: [TO BE ANNOUNCED or same]

5. **Special Activities**
   - Color Olympics details
   - Band performance (rock band)
   - Cheerleader performance (possibly)

6. **Important Notes**
   - Parking information
   - What to bring
   - Dress code (casual/comfortable)

---

#### **WORKSHOPS PAGE** (`workshops.cfm`)

**URL:** `https://pascregionj.com/workshops`

**Purpose:** Explain workshop process, display application form

**Content Sections:**
1. **Workshop Overview**
   - What is a workshop at PASC Region J
   - Topics: Leadership, teamwork, communication, discussion
   - Format: Interactive, student-led
   - Duration: 1 hour (presented twice)

2. **Who Can Present**
   - Student Council members (goal: 12 workshops)
   - Class Office members (goal: 24 workshops)
   - NHS (if participating)
   - Mini-THON (if participating)
   - Other student leadership organizations

3. **Application Guidelines**
   - Groups of 2-3 presenters required
   - Each workshop presented TWICE during the day
   - Must include an activity + main theme/point
   - Example topics provided

4. **Planet Room Assignments**
   - Explanation of planet-themed rooms
   - "Follow the spaceship!" navigation
   - List of rooms:
     - Sun, Venus, Earth, Mars, Jupiter
     - Saturn (plays "Saturn" by SZA)
     - Uranus, Neptune, Mercury, Moon

5. **Workshop Examples / Past Ideas**
   - Glow-in-the-dark painting (communication)
   - Team-building challenges
   - Leadership scenarios
   - Ice-breaker activities

6. **APPLICATION FORM**
   - **[EMBEDDED GOOGLE FORM]**
   - Workshop Application Form
   - Fields: Names, school, workshop title, description, materials needed
   - Application deadline: [TO BE CONFIRMED - likely December]

7. **Application Status**
   - "Applications open December [X]"
   - OR "Applications now open - due by [DATE]"
   - OR "Applications closed - workshops announced soon"

---

#### **REGISTER PAGE** (`register.cfm`)

**URL:** `https://pascregionj.com/register`

**Purpose:** Event registration for attendees

**Content Sections:**
1. **Registration Information**
   - Registration window: **January 5 - 23, 2026**
   - Who can register: Student council members from Region J schools
   - Cost per student: [TO BE CONFIRMED]
   - Registration deadline (hard stop January 23)

2. **Before Registering - What You Need**
   - Student information
   - School/advisor contact
   - T-shirt size
   - Dietary restrictions

3. **Registration Status Banner**
   - **BEFORE JAN 5:** "Registration opens January 5, 2026"
   - **JAN 5-23:** "Registration is OPEN! Register now"
   - **AFTER JAN 23:** "Registration is now closed"

4. **REGISTRATION FORM**
   - **[EMBEDDED GOOGLE FORM]**
   - Fields:
     - Full name
     - School
     - Grade
     - Email
     - Advisor name & email
     - T-shirt size
     - Dietary restrictions/allergies
     - Emergency contact

5. **Payment Information**
   - Cost: [TO BE CONFIRMED per student]
   - Payment instructions: [School pays in advance / Pay at door / etc.]
   - Payment deadline

6. **What Happens After Registration**
   - Confirmation email sent
   - Check-in process on event day
   - What to bring

7. **T-Shirt Order Form**
   - Separate section or embedded form
   - T-shirt design preview (when available)
   - Sizes available
   - **[EMBEDDED GOOGLE FORM FOR T-SHIRTS]**

---

#### **CONTACT PAGE** (`contact.cfm`)

**URL:** `https://pascregionj.com/contact`

**Purpose:** How to reach organizers with questions

**Content Sections:**
1. **Contact Information**
   - **Faculty Advisor:** Señor Kain
     - Email: [TO BE CONFIRMED]
     - Role: Faculty advisor, Spanish teacher
   
   - **Neshaminy Student Council**
     - Email: [TO BE CONFIRMED - stuco gmail]
     - Instagram: @[TO BE CONFIRMED]
   
   - **Region J PASC**
     - Website: [TO BE CONFIRMED]
     - Instagram: @[TO BE CONFIRMED]

2. **Frequently Asked Questions**
   - When is registration?
   - How much does it cost?
   - What if I have dietary restrictions?
   - Can I present a workshop?
   - Where do I park?
   - What should I wear?

3. **Directions to Neshaminy High School**
   - Full address
   - Google Maps embed
   - Parking instructions
   - Which entrance to use

4. **For Schools/Advisors**
   - Group registration information
   - Payment process
   - Chaperone requirements (if any)

5. **Technical Support**
   - Website issues contact
   - Form submission problems

---

#### **RESOURCES PAGE** (`resources.cfm`)

**URL:** `https://pascregionj.com/resources`

**Purpose:** Downloadable files, links, additional materials

**Content Sections:**
1. **Downloadable Files**
   - Conference pamphlet (PDF)
   - Event flyer (PDF)
   - Venue map (PDF)
   - [Future: Workshop schedule once finalized]

2. **Social Media & Promotion**
   - Region J Instagram
   - Neshaminy Student Council Instagram
   - Share buttons for social media
   - #PASCRegionJ hashtag

3. **Important Links**
   - PASC State website
   - Neshaminy High School website
   - Region J information

4. **Past Conferences** (Optional)
   - Photos from previous Region J events
   - Testimonials from past attendees

5. **For Presenters**
   - Workshop tips (once applications accepted)
   - Presentation guidelines
   - Tech support on event day

---

## 3. NAVIGATION MENU STRUCTURE

### 3.1 Primary Navigation (Desktop)

**Header Navigation Bar:**
```
[LOGO]    HOME    ABOUT    SCHEDULE    WORKSHOPS    REGISTER    CONTACT    RESOURCES
```

**Sticky header** - stays visible when scrolling

### 3.2 Mobile Navigation

**Hamburger menu** (☰) with same links:
```
☰ MENU
  ├── Home
  ├── About
  ├── Schedule
  ├── Workshops
  ├── Register
  ├── Contact
  └── Resources
```

### 3.3 Footer Navigation

**Footer Links (on every page):**
```
┌─────────────────────────────────────────────────────────┐
│  Quick Links          Connect               About        │
│  • Home               • Instagram           • PASC       │
│  • Register           • Email               • Neshaminy  │
│  • Workshops          • Region J            • Contact    │
│  • Schedule                                              │
│                                                          │
│  © 2025-2026 Neshaminy Student Council                  │
│  PASC Region J Conference • February 13, 2026           │
└─────────────────────────────────────────────────────────┘
```

---

## 4. ADMIN PANEL STRUCTURE

### 4.1 Admin Site Map

```
┌──────────────────────────────┐
│      ADMIN LOGIN PAGE        │
│  (/admin/login.cfm)          │
│  - Username & Password       │
└──────────────────────────────┘
                │
                ▼
┌──────────────────────────────┐
│      ADMIN DASHBOARD         │
│  (/admin/dashboard.cfm)      │
│  - Welcome message           │
│  - Quick stats               │
│  - Recent activity           │
└──────────────────────────────┘
                │
        ┌───────┴───────┬───────────┬──────────┐
        ▼               ▼           ▼          ▼
   ┌─────────┐    ┌─────────┐  ┌─────────┐  ┌────────┐
   │ANNOUNCE-│    │  EVENT  │  │  FILES  │  │SETTINGS│
   │ MENTS   │    │  INFO   │  │         │  │        │
   └─────────┘    └─────────┘  └─────────┘  └────────┘
```

### 4.2 Admin Panel Pages

---

#### **LOGIN PAGE** (`/admin/login.cfm`)

**Purpose:** Secure access to admin panel

**Features:**
- Username field
- Password field
- "Remember me" checkbox (optional)
- Login button
- Forgot password link (optional)

---

#### **ADMIN DASHBOARD** (`/admin/dashboard.cfm`)

**Purpose:** Central hub for admin tasks

**Content:**
1. **Welcome message** - "Welcome back, Oliver!"
2. **Quick stats:**
   - Total announcements
   - Recent form submissions (if tracking)
   - Days until conference
3. **Recent activity:**
   - Last 5 announcements posted
   - Last login date
4. **Quick actions:**
   - Add new announcement (button)
   - Upload file (button)
   - View public site (button)

---

#### **ANNOUNCEMENTS MANAGEMENT** (`/admin/announcements.cfm`)

**Purpose:** Create, edit, delete announcements

**Features:**

**List View:**
- Table showing all announcements:
  - Title
  - Date posted
  - Important? (Yes/No)
  - Published? (Yes/No)
  - Actions (Edit | Delete)
- "Add New Announcement" button
- Search/filter by date

**Add/Edit Form:**
- Title (text input)
- Content (textarea - rich text editor optional)
- Mark as Important (checkbox)
- Publish (checkbox)
- Save/Cancel buttons

**Delete Confirmation:**
- "Are you sure?" popup

---

#### **EVENT INFO MANAGEMENT** (`/admin/event-info.cfm`)

**Purpose:** Update event details without editing code

**Editable Fields:**
- Conference date/time
- Location details
- Registration window dates
- Workshop application deadline
- Keynote speaker name & bio
- Important deadlines
- Any dynamic text on homepage

---

#### **FILE MANAGEMENT** (`/admin/files.cfm`)

**Purpose:** Upload/manage downloadable files

**Features:**
- Upload PDF files (flyers, pamphlets, maps)
- Upload images (logos, photos, t-shirt designs)
- List all uploaded files
- Download/preview files
- Delete files
- Copy link to clipboard (for use on site)

---

#### **SETTINGS** (`/admin/settings.cfm`)

**Purpose:** Admin account settings

**Features:**
- Change password
- Update email
- Logout
- View site button

---

## 5. USER FLOW DIAGRAMS

### 5.1 Visitor Registration Flow

```
Visitor lands on homepage
         ↓
Clicks "REGISTER NOW" button
         ↓
Goes to /register page
         ↓
Reads registration info
         ↓
Fills out embedded Google Form
         ↓
Submits form
         ↓
Receives confirmation (via Google)
         ↓
Receives follow-up email from organizers
```

### 5.2 Workshop Application Flow

```
Student wants to present workshop
         ↓
Navigates to Workshops page
         ↓
Reads guidelines
         ↓
Discusses with 2-3 teammates
         ↓
Fills out workshop application (Google Form)
         ↓
Submits application
         ↓
Oliver's team reviews in Google Sheets
         ↓
Accepted workshops announced (via site announcement)
```

### 5.3 Admin Posting Announcement Flow

```
Team member needs to post update
         ↓
Goes to /admin/login.cfm
         ↓
Enters credentials
         ↓
Redirected to dashboard
         ↓
Clicks "Announcements"
         ↓
Clicks "Add New Announcement"
         ↓
Fills out form (title, content, mark important)
         ↓
Clicks "Save & Publish"
         ↓
Announcement appears on homepage immediately
```

---

## 6. EMBEDDED CONTENT

### 6.1 Google Forms Integration Points

| Page | Form Purpose | When Added |
|------|-------------|------------|
| **Workshops page** | Workshop application form | December 2025 |
| **Register page** | Individual registration form | January 2026 |
| **Register page** | T-shirt order form | November 2025 |
| **Resources page** (future) | January survey | January 2026 |

**Technical Implementation:**
- Forms embedded using `<iframe>` tags
- Form URLs stored in database (can be updated via admin panel)
- Responsive iframe sizing for mobile

### 6.2 External Links

- PASC State website
- Region J social media
- Neshaminy High School website
- Google Maps (directions)

---

## 7. RESPONSIVE BEHAVIOR

### 7.1 Desktop (>1024px)
- Full navigation menu visible
- Two-column layouts for content
- Large hero images
- Sidebar for announcements

### 7.2 Tablet (768px - 1024px)
- Full navigation menu visible (possibly condensed)
- Single-column layouts
- Adjusted image sizes

### 7.3 Mobile (<768px)
- Hamburger menu (☰)
- Single-column layouts
- Stacked buttons
- Touch-friendly spacing
- Simplified announcement cards

---

## 8. PAGE HIERARCHY & IMPORTANCE

**Priority 1 (Critical - Launch Day):**
- Home page
- About page
- Contact page

**Priority 2 (Needed by December):**
- Workshops page (with form)
- Schedule page

**Priority 3 (Needed by January):**
- Register page (with form)
- Resources page

**Priority 4 (Admin - Ongoing):**
- All admin panel pages

---

## 9. SITEMAP FOR SEARCH ENGINES

**sitemap.xml structure:**
```xml
- https://pascregionj.com/
- https://pascregionj.com/about
- https://pascregionj.com/schedule
- https://pascregionj.com/workshops
- https://pascregionj.com/register
- https://pascregionj.com/contact
- https://pascregionj.com/resources
```

*Note: Admin pages excluded from sitemap (no index)*

---

## 10. URL STRUCTURE

**Clean URLs using ColdFusion:**
```
/ or /index.cfm          → Homepage
/about                   → About page
/schedule                → Schedule page
/workshops               → Workshops page
/register                → Register page
/contact                 → Contact page
/resources               → Resources page

/admin/login             → Admin login
/admin/dashboard         → Admin dashboard
/admin/announcements     → Manage announcements
/admin/event-info        → Manage event details
/admin/files             → File uploads
/admin/settings          → Admin settings
```

---

## 11. NAVIGATION NOTES

### 11.1 Active Page Indicator
- Current page link highlighted in navigation
- Different color or underline
- "You are here" breadcrumb (optional)

### 11.2 Call-to-Action Buttons
**Prominent throughout site:**
- "REGISTER NOW" - appears on multiple pages when registration open
- "APPLY TO PRESENT" - on workshops page
- "DOWNLOAD FLYER" - on resources page

### 11.3 Accessibility
- Keyboard navigation support
- Skip to content link
- Alt text for all images
- ARIA labels where appropriate

---

## 12. QUESTIONS FOR OLIVER

Please confirm:

1. **Is this navigation structure clear and logical?**  
   ☐ Yes, looks good  
   ☐ No, I'd like to change: _______________

2. **Are there any additional pages needed?**  
   ☐ No, this covers everything  
   ☐ Yes, we also need: _______________

3. **Admin panel structure makes sense?**  
   ☐ Yes, this will work for our team  
   ☐ No, we need: _______________

4. **Should Resources page be separate, or combine with About?**  
   ☐ Keep separate  
   ☐ Combine into About page

5. **Priority order correct?**  
   ☐ Yes  
   ☐ No, adjust: _______________

---

## 13. APPROVAL

**Once you approve this site map:**
- We'll proceed with database design
- We'll start building pages in this exact structure
- Navigation will match this document
- Changes later will require scope adjustment

**Approved by:**

**Name:** Oliver  
**Date:** ___________________________  
**Signature/Confirmation:** ___________________________  

---

**Document Version:** 1.0  
**Next Steps:** Upon approval, proceed to database schema design and development sequence planning  

**Notes:** This structure is designed to be simple, intuitive, and mobile-friendly for student users. All pages are maximum 1-2 clicks from the homepage.
