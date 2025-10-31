<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /contact.cfm
* Created:     October 31, 2025
* Author:      Contact Form System Implementation
*
* Purpose:     Contact page with full form functionality
*              - Two-column layout (form + contact info)
*              - Client & server-side validation
*              - Rate limiting (3 submissions/hour/IP)
*              - Email notifications (admin + auto-reply)
*              - Honeypot spam protection
*
* Database:    Tables: dbo.contact_submissions, dbo.contact_email_recipients
*
* Project:     PASC Region J Conference 2026 Website
*              Lead Beyond Limits - February 13, 2026
*******************************************************************************
--->

<!--- Include database configuration --->
<cfinclude template="includes/db_config.cfm">

<!--- Initialize variables --->
<cfparam name="form.contactName" default="">
<cfparam name="form.contactEmail" default="">
<cfparam name="form.contactSubject" default="">
<cfparam name="form.contactMessage" default="">
<cfparam name="form.website" default=""><!--- Honeypot field --->
<cfparam name="form.submitted" default="false">

<cfset showForm = true>
<cfset errorMessages = []>
<cfset successMessage = "">

<!--- Process form submission --->
<cfif form.submitted eq "true">
    <!--- Honeypot check - if filled, it's a bot --->
    <cfif len(trim(form.website)) gt 0>
        <!--- Silent rejection - don't tell bots they failed --->
        <cfset successMessage = "Thank you for your message! We'll get back to you soon.">
        <cfset showForm = false>
    <cfelse>
        <!--- Server-side validation --->
        <cfif len(trim(form.contactName)) eq 0>
            <cfset arrayAppend(errorMessages, "Name is required.")>
        <cfelseif len(trim(form.contactName)) lt 2>
            <cfset arrayAppend(errorMessages, "Name must be at least 2 characters.")>
        </cfif>

        <cfif len(trim(form.contactEmail)) eq 0>
            <cfset arrayAppend(errorMessages, "Email is required.")>
        <cfelseif NOT isValid("email", trim(form.contactEmail))>
            <cfset arrayAppend(errorMessages, "Please enter a valid email address.")>
        </cfif>

        <cfif len(trim(form.contactSubject)) eq 0>
            <cfset arrayAppend(errorMessages, "Subject is required.")>
        </cfif>

        <cfif len(trim(form.contactMessage)) eq 0>
            <cfset arrayAppend(errorMessages, "Message is required.")>
        <cfelseif len(trim(form.contactMessage)) lt 10>
            <cfset arrayAppend(errorMessages, "Message must be at least 10 characters.")>
        </cfif>

        <!--- Rate limiting check (3 submissions per IP per hour) --->
        <cfif arrayLen(errorMessages) eq 0>
            <cfset userIP = cgi.REMOTE_ADDR>
            <cfset oneHourAgo = dateAdd('h', -1, now())>

            <cfquery name="qCheckRateLimit" datasource="#application.datasource#">
                SELECT COUNT(*) AS submissionCount
                FROM dbo.contact_submissions
                WHERE ip_address = <cfqueryparam value="#userIP#" cfsqltype="cf_sql_varchar">
                    AND submitted_at >= <cfqueryparam value="#oneHourAgo#" cfsqltype="cf_sql_timestamp">
            </cfquery>

            <cfif qCheckRateLimit.submissionCount gte 3>
                <cfset arrayAppend(errorMessages, "You've submitted too many messages recently. Please try again in an hour.")>
            </cfif>
        </cfif>

        <!--- If no errors, save to database and send emails --->
        <cfif arrayLen(errorMessages) eq 0>
            <cftry>
                <!--- Save to database --->
                <cfquery datasource="#application.datasource#">
                    INSERT INTO dbo.contact_submissions (
                        name,
                        email,
                        subject,
                        message,
                        ip_address,
                        user_agent,
                        status
                    )
                    VALUES (
                        <cfqueryparam value="#trim(form.contactName)#" cfsqltype="cf_sql_nvarchar">,
                        <cfqueryparam value="#trim(form.contactEmail)#" cfsqltype="cf_sql_nvarchar">,
                        <cfqueryparam value="#trim(form.contactSubject)#" cfsqltype="cf_sql_nvarchar">,
                        <cfqueryparam value="#trim(form.contactMessage)#" cfsqltype="cf_sql_nvarchar">,
                        <cfqueryparam value="#cgi.REMOTE_ADDR#" cfsqltype="cf_sql_varchar">,
                        <cfqueryparam value="#cgi.HTTP_USER_AGENT#" cfsqltype="cf_sql_nvarchar">,
                        'new'
                    )
                </cfquery>

                <!--- Get active email recipients for admin notification --->
                <cfquery name="qRecipients" datasource="#application.datasource#">
                    SELECT email
                    FROM dbo.contact_email_recipients
                    WHERE is_active = 1
                </cfquery>

                <!--- Send admin notification email --->
                <cfif qRecipients.recordCount gt 0>
                    <cfset recipientList = valueList(qRecipients.email)>

                    <cfmail
                        to="#recipientList#"
                        from="noreply@pascregionj.com"
                        subject="New Contact Form Submission: #trim(form.contactSubject)#"
                        type="html">
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: ##333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: linear-gradient(135deg, ##0a0e27 0%, ##1a1f3a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                                .header h1 { margin: 0; font-size: 24px; }
                                .content { background: ##f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                                .field { margin-bottom: 20px; }
                                .label { font-weight: bold; color: ##4fc3f7; margin-bottom: 5px; }
                                .value { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid ##4fc3f7; }
                                .footer { text-align: center; margin-top: 20px; color: ##666; font-size: 12px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>📧 New Contact Form Submission</h1>
                                </div>
                                <div class="content">
                                    <div class="field">
                                        <div class="label">Name:</div>
                                        <div class="value">#htmlEditFormat(trim(form.contactName))#</div>
                                    </div>

                                    <div class="field">
                                        <div class="label">Email:</div>
                                        <div class="value"><a href="mailto:#htmlEditFormat(trim(form.contactEmail))#">#htmlEditFormat(trim(form.contactEmail))#</a></div>
                                    </div>

                                    <div class="field">
                                        <div class="label">Subject:</div>
                                        <div class="value">#htmlEditFormat(trim(form.contactSubject))#</div>
                                    </div>

                                    <div class="field">
                                        <div class="label">Message:</div>
                                        <div class="value">#replace(htmlEditFormat(trim(form.contactMessage)), chr(10), '<br>', 'all')#</div>
                                    </div>

                                    <div class="field">
                                        <div class="label">Submitted:</div>
                                        <div class="value">#dateFormat(now(), 'mmmm d, yyyy')# at #timeFormat(now(), 'h:mm tt')#</div>
                                    </div>

                                    <div class="footer">
                                        <p>This message was sent via the PASC Region J Conference 2026 website contact form.</p>
                                        <p>To manage contact form settings, log in to the admin panel.</p>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    </cfmail>
                </cfif>

                <!--- Send auto-reply to user --->
                <cfmail
                    to="#trim(form.contactEmail)#"
                    from="info@pascregionj.com"
                    subject="Thank you for contacting PASC Region J"
                    type="html">
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: ##333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: linear-gradient(135deg, ##0a0e27 0%, ##1a1f3a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                            .header h1 { margin: 0; font-size: 24px; }
                            .content { background: ##f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                            .message { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
                            .footer { text-align: center; margin-top: 20px; color: ##666; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>✅ Thank You for Contacting Us!</h1>
                            </div>
                            <div class="content">
                                <p>Dear #htmlEditFormat(trim(form.contactName))#,</p>

                                <p>Thank you for reaching out to PASC Region J! We've received your message and will get back to you as soon as possible.</p>

                                <div class="message">
                                    <strong>Your Message:</strong><br>
                                    <strong>Subject:</strong> #htmlEditFormat(trim(form.contactSubject))#<br><br>
                                    #replace(htmlEditFormat(trim(form.contactMessage)), chr(10), '<br>', 'all')#
                                </div>

                                <p>If you have any additional questions about the PASC Region J Conference 2026, please feel free to email us directly at <a href="mailto:info@pascregionj.com">info@pascregionj.com</a>.</p>

                                <p><strong>Conference Details:</strong><br>
                                Date: February 13, 2026<br>
                                Location: Neshaminy High School, Langhorne, PA<br>
                                Theme: Lead Beyond Limits</p>

                                <div class="footer">
                                    <p>This is an automated message confirming receipt of your contact form submission.</p>
                                    <p>&copy; 2025 PASC Region J. All rights reserved.</p>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                </cfmail>

                <!--- Success! --->
                <cfset successMessage = "Thank you for your message! We've received your inquiry and will get back to you soon. A confirmation email has been sent to #htmlEditFormat(trim(form.contactEmail))#.">
                <cfset showForm = false>

                <cfcatch type="any">
                    <!--- Log error for debugging --->
                    <cflog file="contact_form" text="Error: #cfcatch.message# - #cfcatch.detail#">
                    <!--- Show user-friendly message --->
                    <cfset arrayAppend(errorMessages, "An error occurred while processing your message. Please try again or contact us directly at info@pascregionj.com.")>
                </cfcatch>
            </cftry>
        </cfif>
    </cfif>
</cfif>

</cfsilent>

<!--- Include header --->
<cfinclude template="includes/header.cfm">

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
        <p class="hero-subtitle" id="contactSubtitle">We're Here to Help</p>
    </div>
</section>

<!--- Contact Form Section --->
<section class="contact-form-section">
    <div class="container">
        <div class="contact-intro">
            <h2>Get in Touch</h2>
            <p>Have questions about the PASC Region J Conference 2026? We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.</p>
        </div>

        <!--- Success Message --->
        <cfif len(successMessage) gt 0>
            <cfoutput>
            <div class="alert alert-success">
                <div class="alert-icon">✅</div>
                <div class="alert-content">
                    <h3>Message Sent Successfully!</h3>
                    <p>#successMessage#</p>
                </div>
            </div>
            </cfoutput>
        </cfif>

        <!--- Error Messages --->
        <cfif arrayLen(errorMessages) gt 0>
            <div class="alert alert-error">
                <div class="alert-icon">⚠️</div>
                <div class="alert-content">
                    <h3>Please Correct the Following Errors:</h3>
                    <ul>
                        <cfoutput>
                        <cfloop array="#errorMessages#" index="error">
                            <li>#error#</li>
                        </cfloop>
                        </cfoutput>
                    </ul>
                </div>
            </div>
        </cfif>

        <cfif showForm>
            <div class="contact-layout">
                <!--- Left Column: Contact Form --->
                <div class="contact-form-column">
                    <div class="form-card">
                        <h3>Send Us a Message</h3>

                        <cfoutput>
                        <form id="contactForm" method="post" action="contact.cfm" novalidate>
                            <input type="hidden" name="submitted" value="true">

                            <!--- Honeypot field (hidden from users, visible to bots) --->
                            <div class="honeypot-field">
                                <label for="website">Website</label>
                                <input type="text" id="website" name="website" value="" tabindex="-1" autocomplete="off">
                            </div>

                            <!--- Name Field --->
                            <div class="form-group">
                                <label for="contactName" class="form-label">
                                    Name <span class="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="contactName"
                                    name="contactName"
                                    class="form-input"
                                    value="#htmlEditFormat(form.contactName)#"
                                    required
                                    maxlength="200"
                                    placeholder="Your full name">
                            </div>

                            <!--- Email Field --->
                            <div class="form-group">
                                <label for="contactEmail" class="form-label">
                                    Email Address <span class="required">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="contactEmail"
                                    name="contactEmail"
                                    class="form-input"
                                    value="#htmlEditFormat(form.contactEmail)#"
                                    required
                                    maxlength="255"
                                    placeholder="your.email@example.com">
                            </div>

                            <!--- Subject Field --->
                            <div class="form-group">
                                <label for="contactSubject" class="form-label">
                                    Subject <span class="required">*</span>
                                </label>
                                <select
                                    id="contactSubject"
                                    name="contactSubject"
                                    class="form-input"
                                    required>
                                    <option value="">-- Please Select --</option>
                                    <option value="General Inquiry" <cfif form.contactSubject eq "General Inquiry">selected</cfif>>General Inquiry</option>
                                    <option value="Conference Registration" <cfif form.contactSubject eq "Conference Registration">selected</cfif>>Conference Registration</option>
                                    <option value="Workshop Application" <cfif form.contactSubject eq "Workshop Application">selected</cfif>>Workshop Application</option>
                                    <option value="Sponsorship Opportunities" <cfif form.contactSubject eq "Sponsorship Opportunities">selected</cfif>>Sponsorship Opportunities</option>
                                    <option value="Volunteer Information" <cfif form.contactSubject eq "Volunteer Information">selected</cfif>>Volunteer Information</option>
                                    <option value="Media & Press" <cfif form.contactSubject eq "Media & Press">selected</cfif>>Media & Press</option>
                                    <option value="Technical Support" <cfif form.contactSubject eq "Technical Support">selected</cfif>>Technical Support</option>
                                    <option value="Other" <cfif form.contactSubject eq "Other">selected</cfif>>Other</option>
                                </select>
                            </div>

                            <!--- Message Field --->
                            <div class="form-group">
                                <label for="contactMessage" class="form-label">
                                    Message <span class="required">*</span>
                                </label>
                                <textarea
                                    id="contactMessage"
                                    name="contactMessage"
                                    class="form-textarea"
                                    required
                                    rows="6"
                                    maxlength="5000"
                                    placeholder="Please provide details about your inquiry...">#htmlEditFormat(form.contactMessage)#</textarea>
                                <div class="char-counter">
                                    <span id="charCount">0</span> / 5000 characters
                                </div>
                            </div>

                            <!--- Submit Button --->
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary btn-submit">
                                    <span class="btn-icon">📧</span>
                                    Send Message
                                </button>
                            </div>

                            <p class="form-note">
                                <span class="required">*</span> Required fields
                            </p>
                        </form>
                        </cfoutput>
                    </div>
                </div>

                <!--- Right Column: Contact Information --->
                <div class="contact-info-column">
                    <div class="info-card">
                        <h3>Contact Information</h3>

                        <div class="info-item">
                            <div class="info-icon">📧</div>
                            <div class="info-content">
                                <h4>Email</h4>
                                <p><a href="mailto:info@pascregionj.com">info@pascregionj.com</a></p>
                            </div>
                        </div>

                        <div class="info-item">
                            <div class="info-icon">📅</div>
                            <div class="info-content">
                                <h4>Conference Date</h4>
                                <p>February 13, 2026</p>
                            </div>
                        </div>

                        <div class="info-item">
                            <div class="info-icon">📍</div>
                            <div class="info-content">
                                <h4>Location</h4>
                                <p>Neshaminy High School<br>Langhorne, PA</p>
                            </div>
                        </div>

                        <div class="info-item">
                            <div class="info-icon">⏰</div>
                            <div class="info-content">
                                <h4>Response Time</h4>
                                <p>We typically respond within 24-48 hours during business days.</p>
                            </div>
                        </div>
                    </div>

                    <div class="info-card">
                        <h3>Quick Links</h3>
                        <ul class="quick-links">
                            <li><a href="registration.cfm">Registration Information</a></li>
                            <li><a href="workshops.cfm">Workshop Applications</a></li>
                            <li><a href="about.cfm">About PASC Region J</a></li>
                            <li><a href="resources.cfm">Resources & Downloads</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        <cfelse>
            <!--- Show return home button after successful submission --->
            <div class="form-actions">
                <a href="index.cfm" class="btn btn-primary">Return Home</a>
                <a href="about.cfm" class="btn btn-secondary">Learn More About PASC Region J</a>
            </div>
        </cfif>
    </div>
</section>

<!--- Character Counter Script --->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const messageField = document.getElementById('contactMessage');
    const charCount = document.getElementById('charCount');

    if (messageField && charCount) {
        // Update counter on page load
        charCount.textContent = messageField.value.length;

        // Update counter on input
        messageField.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }

    // Client-side form validation
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value.trim();

            let errors = [];

            if (name.length < 2) {
                errors.push('Name must be at least 2 characters.');
            }

            if (!email || !isValidEmail(email)) {
                errors.push('Please enter a valid email address.');
            }

            if (!subject) {
                errors.push('Please select a subject.');
            }

            if (message.length < 10) {
                errors.push('Message must be at least 10 characters.');
            }

            if (errors.length > 0) {
                e.preventDefault();
                alert('Please correct the following errors:\n\n' + errors.join('\n'));
                return false;
            }
        });
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
</script>

<!--- Include footer --->
<cfinclude template="includes/footer.cfm">
