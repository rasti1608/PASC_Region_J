<!---
================================================================================
File: contact.cfc
Description: API endpoint for contact form submissions with validation,
             rate limiting, and email notifications
Author: Auto-generated for Angular migration
Date: 2025-11-11
Version: 1.0
================================================================================
--->

<cfcomponent output="false">

    <!--- ================================================================== --->
    <!--- SUBMIT CONTACT FORM --->
    <!--- Handles contact form submissions with full validation and emails --->
    <!--- Parameters:
         - name: sender name (required, min 2 chars)
         - email: sender email (required, valid email)
         - subject: message subject (required)
         - message: message body (required, min 10 chars, max 5000 chars)
         - website: honeypot field (must be empty)
    --->
    <!--- ================================================================== --->
    <cffunction name="submitContact" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="name" type="string" required="false" default="">
        <cfargument name="email" type="string" required="false" default="">
        <cfargument name="subject" type="string" required="false" default="">
        <cfargument name="message" type="string" required="false" default="">
        <cfargument name="website" type="string" required="false" default="">

        <cfset var result = {}>
        <cfset var errors = []>

        <cftry>
            <!--- HONEYPOT CHECK - Silent rejection if filled --->
            <cfif len(trim(arguments.website)) gt 0>
                <!--- Don't tell bots they failed - return fake success --->
                <cfset result = {
                    "success" = true,
                    "message" = "Thank you for your message! We'll get back to you soon."
                }>
                <cfreturn serializeJSON(result, false, false)>
            </cfif>

            <!--- SERVER-SIDE VALIDATION --->
            <cfif len(trim(arguments.name)) eq 0>
                <cfset arrayAppend(errors, "Name is required.")>
            <cfelseif len(trim(arguments.name)) lt 2>
                <cfset arrayAppend(errors, "Name must be at least 2 characters.")>
            </cfif>

            <cfif len(trim(arguments.email)) eq 0>
                <cfset arrayAppend(errors, "Email is required.")>
            <cfelseif NOT isValid("email", trim(arguments.email))>
                <cfset arrayAppend(errors, "Please enter a valid email address.")>
            </cfif>

            <cfif len(trim(arguments.subject)) eq 0>
                <cfset arrayAppend(errors, "Subject is required.")>
            </cfif>

            <cfif len(trim(arguments.message)) eq 0>
                <cfset arrayAppend(errors, "Message is required.")>
            <cfelseif len(trim(arguments.message)) lt 10>
                <cfset arrayAppend(errors, "Message must be at least 10 characters.")>
            <cfelseif len(trim(arguments.message)) gt 5000>
                <cfset arrayAppend(errors, "Message must not exceed 5000 characters.")>
            </cfif>

            <!--- RATE LIMITING CHECK (3 submissions per IP per hour) --->
            <cfif arrayLen(errors) eq 0>
                <cfset var userIP = cgi.REMOTE_ADDR>
                <cfset var oneHourAgo = dateAdd('h', -1, now())>

                <cfquery name="qCheckRateLimit" datasource="pasc_regionj">
                    SELECT COUNT(*) AS submissionCount
                    FROM dbo.contact_submissions
                    WHERE ip_address = <cfqueryparam value="#userIP#" cfsqltype="cf_sql_varchar">
                        AND submitted_at >= <cfqueryparam value="#oneHourAgo#" cfsqltype="cf_sql_timestamp">
                </cfquery>

                <cfif qCheckRateLimit.submissionCount gte 3>
                    <cfset arrayAppend(errors, "You've submitted too many messages recently. Please try again in an hour.")>
                </cfif>
            </cfif>

            <!--- RETURN VALIDATION ERRORS IF ANY --->
            <cfif arrayLen(errors) gt 0>
                <cfset result = {
                    "success" = false,
                    "errors" = errors,
                    "message" = "Please correct the errors and try again."
                }>
                <cfreturn serializeJSON(result, false, false)>
            </cfif>

            <!--- SAVE TO DATABASE --->
            <cfquery datasource="pasc_regionj">
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
                    <cfqueryparam value="#trim(arguments.name)#" cfsqltype="cf_sql_nvarchar">,
                    <cfqueryparam value="#trim(arguments.email)#" cfsqltype="cf_sql_nvarchar">,
                    <cfqueryparam value="#trim(arguments.subject)#" cfsqltype="cf_sql_nvarchar">,
                    <cfqueryparam value="#trim(arguments.message)#" cfsqltype="cf_sql_nvarchar">,
                    <cfqueryparam value="#cgi.REMOTE_ADDR#" cfsqltype="cf_sql_varchar">,
                    <cfqueryparam value="#cgi.HTTP_USER_AGENT#" cfsqltype="cf_sql_nvarchar">,
                    'new'
                )
            </cfquery>

            <!--- GET EMAIL RECIPIENTS FOR ADMIN NOTIFICATION --->
            <cfquery name="qRecipients" datasource="pasc_regionj">
                SELECT email
                FROM dbo.contact_email_recipients
                WHERE is_active = 1
            </cfquery>

            <!--- SEND ADMIN NOTIFICATION EMAIL --->
            <cfif qRecipients.recordCount gt 0>
                <cfset var recipientList = valueList(qRecipients.email)>

                <cfmail
                    to="#recipientList#"
                    from="info@pascregionj.com"
                    subject="New Contact Form Submission: #trim(arguments.subject)#"
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
                                    <div class="value">#htmlEditFormat(trim(arguments.name))#</div>
                                </div>

                                <div class="field">
                                    <div class="label">Email:</div>
                                    <div class="value"><a href="mailto:#htmlEditFormat(trim(arguments.email))#">#htmlEditFormat(trim(arguments.email))#</a></div>
                                </div>

                                <div class="field">
                                    <div class="label">Subject:</div>
                                    <div class="value">#htmlEditFormat(trim(arguments.subject))#</div>
                                </div>

                                <div class="field">
                                    <div class="label">Message:</div>
                                    <div class="value">#replace(htmlEditFormat(trim(arguments.message)), chr(10), '<br>', 'all')#</div>
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

            <!--- SEND AUTO-REPLY TO USER --->
            <cfmail
                to="#trim(arguments.email)#"
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
                            <p>Dear #htmlEditFormat(trim(arguments.name))#,</p>

                            <p>Thank you for reaching out to PASC Region J! We've received your message and will get back to you as soon as possible.</p>

                            <div class="message">
                                <strong>Your Message:</strong><br>
                                <strong>Subject:</strong> #htmlEditFormat(trim(arguments.subject))#<br><br>
                                #replace(htmlEditFormat(trim(arguments.message)), chr(10), '<br>', 'all')#
                            </div>

                            <p>If you have any additional questions about the PASC Region J Conference 2026, please feel free to email us directly at <a href="mailto:info@pascregionj.com">info@pascregionj.com</a>.</p>

                            <p><strong>Conference Details:</strong><br>
                            Date: February 13, 2026<br>
                            Location: Neshaminy High School, Langhorne, PA<br>
                            Theme: Navigating the Stars<br>
                            Slogan: Reach for the Stars, Lead Beyond Limits</p>

                            <div class="footer">
                                <p>This is an automated message confirming receipt of your contact form submission.</p>
                                <p>&copy; 2025 PASC Region J. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            </cfmail>

            <!--- BUILD SUCCESS RESPONSE --->
            <cfset result = {
                "success" = true,
                "message" = "Thank you for your message! We've received your inquiry and will get back to you soon. A confirmation email has been sent to " & htmlEditFormat(trim(arguments.email)) & "."
            }>

            <cfcatch type="any">
                <!--- BUILD ERROR RESPONSE --->
                <cfset result = {
                    "success" = false,
                    "errors" = ["An error occurred while processing your message. Please try again or contact us directly at info@pascregionj.com."],
                    "message" = "An error occurred while processing your request.",
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- GET EMAIL RECIPIENTS --->
    <!--- Returns active email recipients for contact form notifications --->
    <!--- (Admin only - should be protected by authentication) --->
    <!--- ================================================================== --->
    <cffunction name="getRecipients" access="remote" returntype="string" output="false">
        <cfcontent type="application/json" reset="true">

        <cfset var result = {}>
        <cfset var qRecipients = "">

        <cftry>
            <!--- Query active email recipients --->
            <cfquery name="qRecipients" datasource="pasc_regionj">
                SELECT
                    id,
                    email,
                    is_active
                FROM dbo.contact_email_recipients
                WHERE is_active = 1
                ORDER BY email ASC
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var recipients = []>

            <cfloop query="qRecipients">
                <cfset var recipient = {
                    "id" = qRecipients.id,
                    "email" = qRecipients.email,
                    "isActive" = qRecipients.is_active
                }>
                <cfset arrayAppend(recipients, recipient)>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = recipients,
                "count" = arrayLen(recipients),
                "message" = "Recipients retrieved successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = [],
                    "count" = 0,
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

</cfcomponent>
