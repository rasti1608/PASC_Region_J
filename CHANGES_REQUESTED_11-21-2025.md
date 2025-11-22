# Website Change Requests - PASC Region J Conference 2026

## 📋 Overview

This document outlines the requested changes for the PASC Region J Conference website based on feedback from Oliver (the original stakeholder and my son). The site was built as a complete custom solution featuring multimedia elements, custom animations, and original music composition.

---

## 🎯 Context & Background

I built this entire conference management website from scratch as a passion project for my son Oliver's student council conference. This wasn't a template or WordPress site - it's a fully custom Angular application with ColdFusion backend, complete admin CMS, multimedia integration, and original music composition.

**Professional Value:** A website of this scope and quality would typically cost **$8,000 - $12,000** in the marketplace. I built it for free because it's for Oliver and his student council.

**Portfolio Consideration:** Since this represents significant professional work, I'd like to use this site as a portfolio piece to showcase my capabilities to potential clients. This is particularly relevant for one specific element (see Question #3 in Clarifications below).

---

## ✅ Confirmed Changes Needed

### 1️⃣ **Browser & General**
- [ ] Add logo/favicon next to URL in browser tab

---

### 2️⃣ **Home Page Changes**

**Latest Announcements Section:**
- [ ] Fix "FEATURED" badge color (currently too yellow/odd-looking - needs to match brand colors)
- [ ] Change date format from numbers (e.g., `2025-11-01`) to full text format (e.g., `November 1, 2025`)

**Footer Updates:**
- [ ] Change "Conference 2026" → "Conference Info"
- [ ] Add zipcode after "Langhorne, PA" 
- [ ] Fix spacing: `Email:info@` → `Email: info@` (add space after colon)
- [ ] **CRITICAL:** ALL orange colors throughout the site must match the exact orange hex code from the logo's "J" (currently showing blue in some places)
- [ ] Update copyright text to:
  ```
  Region J Conference presented by Neshaminy High School Student Council
  © 2025-2026 Created by Rastislav & Oliver Toscak [admin]
  ```
- [ ] **REMOVE** any references to "Angular" or framework mentions (not needed for public site)

---

### 3️⃣ **About Page**
- [ ] **REMOVE ENTIRE SECTION** containing the 6 benefit boxes:
  - Leadership Training
  - Networking Opportunities  
  - Recognition & Awards
  - Resources & Support
  - Leadership Positions
  - Make a Difference
  
  **Reason:** Content is repetitive/redundant with other sections

---

### 4️⃣ **Registration Page**
- [ ] Change label from "Theme" → "Slogan"
- [ ] Text underneath should read: `"Reach for the Stars, Lead Beyond Limits"`

---

### 5️⃣ **Workshops Page**

**Remove Redundant Content:**
- [ ] **REMOVE** the 3 top boxes (Share Your Expertise, Connect & Network, Make an Impact)
  - **Reason:** Repetitive with Google form content
- [ ] **REMOVE** dropdown menu for form selection
  - **Reason:** Only one workshop form exists, dropdown is unnecessary
- [ ] Change description to focus on how to apply (not repeat slogan)
- [ ] **REMOVE** text: `"Lead beyond limits - feb 13,2025"`

**Target Audience Update:**
- [ ] Change from: `"students, advisors, or all attendees"`
- [ ] Change to: `"student council members or attendees"`
- [ ] **Reason:** Workshops are ONLY for students, not teachers/advisors

---

### 6️⃣ **Resources Page**

**Schedule Visibility:**
- [ ] Put conference schedule **PROMINENTLY at the top of the page**
- [ ] Make it large and visible (not tiny download icon)
- [ ] **Goal:** Ensure attendees notice the schedule immediately

**Conference Anthem:**
- [ ] ⚠️ **SEE CLARIFICATION #3 BELOW** - This requires discussion

---

### 7️⃣ **Navigation Bar Reordering**

**Current order needs to be changed to:**
```
Home → About → Registration → Workshops → Resources → Gallery → Contact
```

---

## ❓ Clarifications Needed

### **Question 1: Orange Brand Color**
Do you have the exact hex code from the logo's orange "J"? If not, I'll need to extract it from the logo file to ensure perfect color matching throughout the site.

### **Question 2: Schedule Placement Details**
For the Resources page - how large should the schedule display be, and exactly where should it appear? Top of page before other downloads? As a featured/hero element?

### **Question 3: Conference Anthem (Original Music)**
This one requires a conversation between us.

**Your Request:** Remove the Conference Anthem/song entirely
- Your reasoning: It's blocking access to files and not needed

**My Position:** I disagree with removing it - I think the anthem actually fits perfectly where it is
- My reasoning: 
  - This is an original composition I created specifically for this project
  - It integrates beautifully with the space-themed background animations
  - It demonstrates multimedia capabilities beyond standard web development
  - **Most importantly:** Since I built this entire $8-12k website for free, I'd like to use it as a portfolio piece to showcase my work to potential clients. The song + video background combination is a unique differentiator that shows I can deliver custom multimedia solutions, not just code.

**Proposed Compromise (if the current placement is the only obstacle):**

If your concern is that the anthem is blocking access to documents/files, we could rearrange the Resources page like this:

**New Resources Page Order:**
1. Conference Schedule (prominent at top)
2. Documents/Files (easy access)
3. Conference Anthem (moved lower on the page)

This way:
- ✅ Files are easily accessible and not blocked
- ✅ Schedule is highly visible as requested
- ✅ Anthem remains on the site for portfolio purposes

**However**, I still believe the anthem works well in its current position and enhances the site's multimedia experience. If the only issue is file accessibility, the compromise above solves that. What do you think?

---

## 📊 Implementation Summary

**Total Changes:** ~25 discrete updates
**Complexity:** Low to Medium (mostly content/layout adjustments)
**Estimated Time:** 4-6 hours of development work

**Priority Tiers:**
- 🔴 **High Priority:** Color fixes, navigation reordering, date formatting
- 🟡 **Medium Priority:** Content removal, text updates
- 🟢 **Low Priority:** Favicon, minor spacing adjustments

---

## ✍️ Next Steps

1. **Oliver:** Review this document and confirm all changes are captured correctly
2. **Oliver:** Answer the 3 clarification questions above
3. **Me:** Implement approved changes
4. **Both:** Review and test together before deploying to production

---

## 📝 Notes

- This document will be tracked in GitHub for version control
- Changes will be implemented in a development branch first
- Oliver will review changes before production deployment
- The site will maintain full functionality throughout the update process

---

**Created by:** Rasti Toscak  
**Date:** November 21, 2024  
**For:** Oliver Toscak & PASC Region J Conference Team
