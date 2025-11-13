<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/forgot-password.cfm
* Created:     November 2, 2025
* Author:      Rastislav Toscak
*
* Purpose:     Password reset request page
*              Allows users to request a password reset link via email
*
* Features:    - Email validation
*              - Rate limiting (3 requests per hour per IP)
*              - Secure token generation
*              - Email with reset link
*              - Security: Never reveals if email exists
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Include database configuration --->
<cfinclude template="../includes/db_config.cfm">

<!--- Initialize variables --->
<cfparam name="form.email" default="">
<cfset errorMessage = "">
<cfset successMessage = "">

<!--- If already logged in, redirect to dashboard --->
<cfif structKeyExists(session, "admin_logged_in") AND session.admin_logged_in>
    <cflocation url="dashboard.cfm" addtoken="false">
</cfif>

<!--- Process form submission --->
<cfif structKeyExists(form, "submit")>
    <cfset form.email = trim(form.email)>

    <!--- Validate email format --->
    <cfif len(form.email) EQ 0>
        <cfset errorMessage = "Please enter your email address.">
    <cfelseif NOT isValid("email", form.email)>
        <cfset errorMessage = "Please enter a valid email address.">
    <cfelse>
        <cftry>
            <!--- Rate limiting: Check how many reset requests from this IP in the last hour --->
            <cfset userIP = cgi.REMOTE_ADDR>
            <cfset oneHourAgo = dateAdd('h', -1, now())>

            <cfquery name="qCheckRateLimit" datasource="#application.datasource#">
                SELECT COUNT(*) AS requestCount
                FROM dbo.password_reset_tokens
                WHERE ip_address = <cfqueryparam value="#userIP#" cfsqltype="cf_sql_varchar">
                    AND created_at >= <cfqueryparam value="#oneHourAgo#" cfsqltype="cf_sql_timestamp">
            </cfquery>

            <cfif qCheckRateLimit.requestCount GTE 3>
                <cfset errorMessage = "You've requested too many password resets recently. Please try again in an hour.">
            <cfelse>
                <!--- Look up user by email --->
                <cfquery name="qUser" datasource="#application.datasource#">
                    SELECT
                        id,
                        username,
                        email,
                        full_name,
                        is_active
                    FROM dbo.admin_users
                    WHERE email = <cfqueryparam value="#form.email#" cfsqltype="cf_sql_varchar">
                        AND is_active = 1
                </cfquery>

                <!--- If user exists, generate token and send email --->
                <cfif qUser.recordCount GT 0>
                    <!--- Generate secure token using UUID + timestamp + IP --->
                    <cfset resetToken = hash(createUUID() & now() & userIP & qUser.id, "SHA-256")>
                    <cfset expiresAt = dateAdd('h', 1, now())>

                    <!--- Insert reset token into database --->
                    <cfquery datasource="#application.datasource#">
                        INSERT INTO dbo.password_reset_tokens (
                            user_id,
                            token,
                            expires_at,
                            ip_address,
                            user_agent,
                            created_at,
                            used_at
                        ) VALUES (
                            <cfqueryparam value="#qUser.id#" cfsqltype="cf_sql_integer">,
                            <cfqueryparam value="#resetToken#" cfsqltype="cf_sql_varchar">,
                            <cfqueryparam value="#expiresAt#" cfsqltype="cf_sql_timestamp">,
                            <cfqueryparam value="#userIP#" cfsqltype="cf_sql_varchar">,
                            <cfqueryparam value="#cgi.HTTP_USER_AGENT#" cfsqltype="cf_sql_varchar">,
                            GETDATE(),
                            NULL
                        )
                    </cfquery>

                    <!--- Build reset link --->
                    <cfset resetLink = "http://#cgi.SERVER_NAME#/admin/reset-password.cfm?token=#resetToken#">

                    <!--- Send email with reset link --->
                    <cfmail
                        to="#qUser.email#"
                        from="info@pascregionj.com"
                        subject="PASC Region J - Password Reset Request"
                        type="html">
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ##f9f9f9;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ##f9f9f9; padding: 40px 20px;">
                                <tr>
                                    <td align="center">
                                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: ##ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                            <!--- Header --->
                                            <tr>
                                                <td style="background: linear-gradient(135deg, ##1a1f3a 0%, ##2d3561 100%); padding: 40px 30px; text-align: center;">
                                                    <h1 style="color: ##ffffff; margin: 0; font-size: 28px; font-weight: 600;">Password Reset Request</h1>
                                                    <p style="color: ##b0b8d4; margin: 10px 0 0 0; font-size: 16px;">PASC Region J Conference 2026</p>
                                                </td>
                                            </tr>

                                            <!--- Content --->
                                            <tr>
                                                <td style="padding: 40px 30px;">
                                                    <p style="color: ##333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                                        Hello <strong>#htmlEditFormat(qUser.full_name)#</strong>,
                                                    </p>

                                                    <p style="color: ##333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                                        We received a request to reset your password for the PASC Region J Admin Panel.
                                                    </p>

                                                    <p style="color: ##333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                                        Click the button below to create a new password:
                                                    </p>

                                                    <!--- Reset Button --->
                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td align="center">
                                                                <a href="#resetLink#" style="display: inline-block; background: linear-gradient(135deg, ##4fc3f7 0%, ##2196f3 100%); color: ##ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">Reset Password</a>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <p style="color: ##666666; font-size: 14px; line-height: 1.6; margin: 30px 0 20px 0;">
                                                        Or copy and paste this link into your browser:
                                                    </p>

                                                    <p style="color: ##4fc3f7; font-size: 14px; word-break: break-all; margin: 0 0 30px 0;">
                                                        <a href="#resetLink#" style="color: ##4fc3f7; text-decoration: underline;">#resetLink#</a>
                                                    </p>

                                                    <!--- Security Notice Box --->
                                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ##fff3cd; border-left: 4px solid ##ffc107; border-radius: 4px; margin: 20px 0;">
                                                        <tr>
                                                            <td style="padding: 15px 20px;">
                                                                <p style="color: ##856404; font-size: 14px; line-height: 1.5; margin: 0;">
                                                                    <strong>⚠️ Security Notice:</strong>
                                                                </p>
                                                                <p style="color: ##856404; font-size: 14px; line-height: 1.5; margin: 8px 0 0 0;">
                                                                    This link will expire in <strong>1 hour</strong> and can only be used once.
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <p style="color: ##666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                                        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                                                    </p>
                                                </td>
                                            </tr>

                                            <!--- Footer --->
                                            <tr>
                                                <td style="background-color: ##f5f5f5; padding: 20px 30px; text-align: center; border-top: 1px solid ##e0e0e0;">
                                                    <p style="color: ##999999; font-size: 12px; margin: 0;">
                                                        &copy; 2025 PASC Region J Conference. All rights reserved.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                    </cfmail>
                </cfif>

                <!--- ALWAYS show success message (security: don't reveal if email exists) --->
                <cfset successMessage = "If that email address is associated with an active account, you will receive a password reset link shortly. Please check your inbox.">
            </cfif>

            <cfcatch type="any">
            	<cfdump var="#cfcatch#">
            	<cfabort>
                <!--- Log error but show generic message to user --->
                <cfset errorMessage = "An error occurred. Please try again later.">
                <!--- For debugging: #cfcatch.message# | #cfcatch.detail# --->
            </cfcatch>
        </cftry>
    </cfif>
</cfif>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - PASC Region J</title>
    <link rel="stylesheet" href="/assets/css/admin-login.css">
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <div class="login-header">
                <div class="logo">
                    <img src="/assets/img/logo.png" alt="PASC Region J" class="logo-img">
                </div>
                <h1>Reset Password</h1>
                <p>PASC Region J Conference 2026</p>
            </div>

            <cfif len(errorMessage) GT 0>
                <div class="alert alert-error">
                    <cfoutput>#errorMessage#</cfoutput>
                </div>
            </cfif>

            <cfif len(successMessage) GT 0>
                <div class="alert alert-success">
                    <cfoutput>#successMessage#</cfoutput>
                </div>
            </cfif>

            <cfif len(successMessage) EQ 0>
                <div style="padding: 0 30px 20px 30px;">
                    <p style="color: #666; text-align: center; margin: 0 0 20px 0; font-size: 0.95rem;">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form method="post" action="forgot-password.cfm" class="login-form">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value="<cfoutput>#htmlEditFormat(form.email)#</cfoutput>"
                            required
                            autofocus
                            autocomplete="email"
                            placeholder="your.email@example.com">
                    </div>

                    <button type="submit" name="submit" class="btn btn-login">
                        Send Reset Link
                    </button>
                </form>
            </cfif>

            <div class="login-footer">
                <p><a href="login.cfm" class="link-primary">← Back to Login</a></p>
            </div>
        </div>
    </div>
</body>
</html>
