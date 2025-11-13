<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/reset-password.cfm
* Created:     November 2, 2025
* Author:      Rastislav Toscak
*
* Purpose:     Password reset page with token validation
*              Allows users to set a new password using a valid reset token
*
* Features:    - Token validation (exists, not expired, not used)
*              - Password requirements enforcement
*              - Password confirmation
*              - SHA-256 password hashing
*              - Token single-use enforcement
*              - Auto-redirect to login on success
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Include database configuration --->
<cfinclude template="../includes/db_config.cfm">

<!--- Initialize variables --->
<cfparam name="url.token" default="">
<cfparam name="form.new_password" default="">
<cfparam name="form.confirm_password" default="">
<cfset errorMessage = "">
<cfset successMessage = "">
<cfset tokenValid = false>
<cfset userId = 0>
<cfset userFullName = "">

<!--- If already logged in, redirect to dashboard --->
<cfif structKeyExists(session, "admin_logged_in") AND session.admin_logged_in>
    <cflocation url="dashboard.cfm" addtoken="false">
</cfif>

<!--- Validate token from URL --->
<cfif len(trim(url.token)) GT 0>
    <cftry>
        <!--- Look up token in database --->
        <cfquery name="qToken" datasource="#application.datasource#">
            SELECT
                t.id,
                t.user_id,
                t.token,
                t.expires_at,
                t.used_at,
                u.full_name,
                u.email,
                u.is_active
            FROM dbo.password_reset_tokens t
            INNER JOIN dbo.admin_users u ON t.user_id = u.id
            WHERE t.token = <cfqueryparam value="#trim(url.token)#" cfsqltype="cf_sql_varchar">
        </cfquery>

        <cfif qToken.recordCount EQ 0>
            <!--- Token doesn't exist --->
            <cfset errorMessage = "Invalid password reset link. This link may have been already used or is incorrect.">
        <cfelseif len(qToken.used_at) GT 0>
            <!--- Token already used --->
            <cfset errorMessage = "This password reset link has already been used. Please request a new one if needed.">
        <cfelseif dateCompare(now(), qToken.expires_at) GT 0>
            <!--- Token expired --->
            <cfset errorMessage = "This password reset link has expired. Please request a new one.">
        <cfelseif qToken.is_active EQ 0>
            <!--- User account deactivated --->
            <cfset errorMessage = "This account has been deactivated. Please contact the administrator.">
        <cfelse>
            <!--- Token is valid --->
            <cfset tokenValid = true>
            <cfset userId = qToken.user_id>
            <cfset userFullName = qToken.full_name>
        </cfif>

        <cfcatch type="any">
        	<cfdump var="#cfcatch#">
        	<cfabort>
            <cfset errorMessage = "An error occurred validating your reset link. Please try again.">
        </cfcatch>
    </cftry>
<cfelse>
    <cfset errorMessage = "No reset token provided. Please use the link from your email.">
</cfif>

<!--- Process password reset form submission --->
<cfif structKeyExists(form, "submit") AND tokenValid>
    <cfset form.new_password = trim(form.new_password)>
    <cfset form.confirm_password = trim(form.confirm_password)>

    <!--- Validate password --->
    <cfif len(form.new_password) EQ 0>
        <cfset errorMessage = "Please enter a new password.">
    <cfelseif len(form.new_password) LT 8>
        <cfset errorMessage = "Password must be at least 8 characters long.">
    <cfelseif NOT REFind("[A-Z]", form.new_password)>
        <cfset errorMessage = "Password must contain at least one uppercase letter (A-Z).">
    <cfelseif NOT REFind("[0-9]", form.new_password)>
        <cfset errorMessage = "Password must contain at least one number (0-9).">
    <cfelseif NOT REFind("[^a-zA-Z0-9]", form.new_password)>
        <cfset errorMessage = "Password must contain at least one special character (e.g., !@##$%^&*).">
    <cfelseif form.new_password NEQ form.confirm_password>
        <cfset errorMessage = "Passwords do not match.">
    <cfelse>
        <cftry>
            <!--- Hash the new password with SHA-256 --->
            <cfset hashedPassword = hash(form.new_password, "SHA-256")>

            <!--- Update user's password --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.admin_users
                SET
                    password_hash = <cfqueryparam value="#hashedPassword#" cfsqltype="cf_sql_varchar">,
                    password_changed_at = GETDATE(),
                    must_change_password = 0,
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#userId#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Mark token as used --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.password_reset_tokens
                SET used_at = GETDATE()
                WHERE token = <cfqueryparam value="#trim(url.token)#" cfsqltype="cf_sql_varchar">
            </cfquery>

            <!--- Success! --->
            <cfset successMessage = "Your password has been successfully reset. You will be redirected to the login page in 3 seconds...">
            <cfset tokenValid = false>

            <!--- Auto-redirect to login after 3 seconds --->
            <cfset autoRedirect = true>

            <cfcatch type="any">
                <cfset errorMessage = "An error occurred updating your password. Please try again.">
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
    <title>Reset Password - PASC Region J</title>
    <link rel="stylesheet" href="/assets/css/admin-login.css">
    <cfif structKeyExists(variables, "autoRedirect") AND autoRedirect>
        <meta http-equiv="refresh" content="3;url=login.cfm?msg=password_reset">
    </cfif>
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

            <cfif tokenValid>
                <div style="padding: 0 30px 20px 30px;">
                    <p style="color: #666; text-align: center; margin: 0 0 20px 0; font-size: 0.95rem;">
                        Hello <strong><cfoutput>#htmlEditFormat(userFullName)#</cfoutput></strong>, please enter your new password below.
                    </p>
                </div>

                <form method="post" action="reset-password.cfm?token=<cfoutput>#urlEncodedFormat(url.token)#</cfoutput>" class="login-form" id="resetForm">
                    <div class="form-group">
                        <label for="new_password">New Password</label>
                        <div class="password-input-wrapper">
                            <input
                                type="password"
                                id="new_password"
                                name="new_password"
                                required
                                autofocus
                                autocomplete="new-password"
                                minlength="8">
                            <button type="button" class="password-toggle" onclick="togglePassword('new_password')" aria-label="Toggle password visibility">
                                <span class="toggle-icon">👁️</span>
                            </button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="confirm_password">Confirm New Password</label>
                        <div class="password-input-wrapper">
                            <input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                required
                                autocomplete="new-password"
                                minlength="8">
                            <button type="button" class="password-toggle" onclick="togglePassword('confirm_password')" aria-label="Toggle password visibility">
                                <span class="toggle-icon">👁️</span>
                            </button>
                        </div>
                    </div>

                    <!--- Password Requirements Box --->
                    <div style="padding: 0 30px 20px 30px;">
                        <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px; padding: 15px;">
                            <p style="color: #1565c0; font-size: 0.9rem; margin: 0 0 10px 0; font-weight: 600;">
                                Password Requirements:
                            </p>
                            <ul style="color: #1565c0; font-size: 0.85rem; margin: 0; padding-left: 20px; line-height: 1.6;">
                                <li>Minimum 8 characters</li>
                                <li>At least one uppercase letter (A-Z)</li>
                                <li>At least one number (0-9)</li>
                                <li>At least one special character (e.g., !@##$%^&*)</li>
                                <li>Passwords must match</li>
                            </ul>
                        </div>
                    </div>

                    <button type="submit" name="submit" class="btn btn-login">
                        Reset Password
                    </button>
                </form>

                <!--- Client-side validation script --->
                <script>
                    document.getElementById('resetForm').addEventListener('submit', function(e) {
                        const newPassword = document.getElementById('new_password').value;
                        const confirmPassword = document.getElementById('confirm_password').value;
                        const errors = [];

                        // Validate password requirements
                        if (newPassword.length < 8) {
                            errors.push('Password must be at least 8 characters long.');
                        }
                        if (!/[A-Z]/.test(newPassword)) {
                            errors.push('Password must contain at least one uppercase letter.');
                        }
                        if (!/[0-9]/.test(newPassword)) {
                            errors.push('Password must contain at least one number.');
                        }
                        if (!/[^a-zA-Z0-9]/.test(newPassword)) {
                            errors.push('Password must contain at least one special character.');
                        }
                        if (newPassword !== confirmPassword) {
                            errors.push('Passwords do not match.');
                        }

                        if (errors.length > 0) {
                            e.preventDefault();
                            alert(errors.join('\n'));
                            return false;
                        }
                    });
                </script>
            </cfif>

            <div class="login-footer">
                <p><a href="login.cfm" class="link-primary">← Back to Login</a></p>
            </div>
        </div>
    </div>

    <script>
        function togglePassword(fieldId) {
            const field = document.getElementById(fieldId);
            const toggle = field.parentElement.querySelector('.password-toggle');
            const icon = toggle.querySelector('.toggle-icon');

            if (field.type === 'password') {
                field.type = 'text';
                icon.textContent = '🙈';
            } else {
                field.type = 'password';
                icon.textContent = '👁️';
            }
        }
    </script>
</body>
</html>
