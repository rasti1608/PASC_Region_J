<!---
*******************************************************************************
* File:        /includes/footer.cfm
* Created:     October 25, 2025
* Updated:     October 26, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Shared footer template for PASC Region J Conference website
*              Contains closing HTML tags, footer content, and JavaScript files
*              Includes Bootstrap 5 JS for interactive components
*
* Usage:       <cfinclude template="includes/footer.cfm">
*
* Project:     PASC Region J Conference 2026 Website
*              Lead Beyond Limits - February 13, 2026
*******************************************************************************
--->

    <!--- Footer Section --->
    <footer class="main-footer">
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>PASC Region J</h3>
                    <p>Pennsylvania Association of Student Councils - Region J</p>
                    <p>Lead Beyond Limits</p>
                </div>
                
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul class="footer-links">
                        <li><a href="index.cfm">Home</a></li>
                        <li><a href="about.cfm">About</a></li>
                        <li><a href="workshops.cfm">Workshops</a></li>
                        <li><a href="register.cfm">Register</a></li>
                        <li><a href="contact.cfm">Contact</a></li>
                        <li><a href="resources.cfm">Resources</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Conference Info</h3>
                    <p><strong>Date:</strong> February 13, 2026</p>
                    <p><strong>Location:</strong> Neshaminy High School</p>
                    <p><strong>Theme:</strong> Lead Beyond Limits</p>
                </div>
                
                <div class="footer-section">
                    <h3>Contact</h3>
                    <p>Email: <a href="mailto:info@pascregionj.com">info@pascregionj.com</a></p>
                    <p>For questions or support</p>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; <cfoutput>#year(now())#</cfoutput> PASC Region J Conference. All rights reserved.</p>
                <p>Reach for the Stars</p>
                <p>Created by Rastislav & Oliver Toscak <a href="/admin" style="color: #888; text-decoration: none; font-size: 0.8rem;"> [admin]</a></p>
            </div>
        </div>
    </footer>

    <!--- Bootstrap 5 JS Bundle (Local) --->
    <script src="/assets/js/bootstrap.bundle.min.js"></script>
    
    <!--- Fallback Accordion Script (if Bootstrap doesn't load) --->
    <script src="/assets/js/accordion.js"></script>
    
    <!--- Custom JavaScript --->
    <script src="/assets/js/main.js"></script>

</body>
</html>
