<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/change-password-required.cfm
* Created:     November 1, 2025
* Author:      Rastislav Toscak
*
* Purpose:     Forced password change page
*              Require users to change temporary password before accessing system
*
* Features:    - Simple standalone page (no sidebar)
*              - No current password required (temporary anyway)
*              - Password strength indicator
*              - Redirects to dashboard after success
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check if user is logged in --->
<cfif NOT structKeyExists(session, "admin_logged_in") OR NOT session.admin_logged_in>
    <!--- Not logged in - redirect to login page --->
    <cflocation url="/admin/login.cfm" addtoken="false">
    <cfabort>
</cfif>

<!--- Check if session has required data --->
<cfif NOT structKeyExists(session, "admin_user_id") OR
      NOT structKeyExists(session, "admin_username")>
    <!--- Session data missing - log out and redirect --->
    <cfset structClear(session)>
    <cflocation url="/admin/login.cfm?msg=session_expired" addtoken="false">
    <cfabort>
</cfif>

<!--- Get user data to check must_change_password flag --->
<cftry>
    <cfquery name="getUser" datasource="#application.datasource#">
        SELECT
            id,
            username,
            full_name,
            must_change_password
        FROM dbo.admin_users
        WHERE id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
        AND is_active = 1
    </cfquery>

    <cfif getUser.recordCount EQ 0>
        <cfset structClear(session)>
        <cflocation url="/admin/login.cfm?msg=session_expired" addtoken="false">
        <cfabort>
    </cfif>

    <!--- If user doesn't need to change password, redirect to dashboard --->
    <cfif getUser.must_change_password EQ 0>
        <cflocation url="/admin/dashboard.cfm" addtoken="false">
        <cfabort>
    </cfif>

    <cfcatch type="any">
        <cfset variables.errorMessage = "Error loading user data. Please try again.">
    </cfcatch>
</cftry>

<!--- Process password change --->
<cfif structKeyExists(form, "submit")>
    <!--- Validate password fields --->
    <cfif NOT len(trim(form.new_password))>
        <cfset variables.errorMessage = "New password is required.">
    <cfelseif len(trim(form.new_password)) LT 8>
        <cfset variables.errorMessage = "Password must be at least 8 characters long.">
    <cfelseif form.new_password NEQ form.confirm_password>
        <cfset variables.errorMessage = "Passwords do not match.">
    <cfelse>
        <!--- Update password --->
        <cftry>
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.admin_users
                SET
                    password_hash = <cfqueryparam value="#trim(form.new_password)#" cfsqltype="cf_sql_varchar">,
                    must_change_password = 0,
                    password_changed_at = GETDATE(),
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Password changed successfully - redirect to dashboard --->
            <cflocation url="/admin/dashboard.cfm?msg=password_changed" addtoken="false">

            <cfcatch type="any">
            	<cfdump var="#cfcatch#">
            	<cfabort>
                <cfset variables.errorMessage = "Error changing password: #cfcatch.message#">
            </cfcatch>
        </cftry>
    </cfif>
</cfif>

</cfsilent><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Change Password Required - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-login.css">
    <style>
        .password-strength {
            margin-top: 8px;
            padding: 8px;
            border-radius: 4px;
            font-size: 0.85rem;
            font-weight: 600;
            display: none;
        }
        .strength-weak {
            background: #ffebee;
            color: #c62828;
        }
        .strength-medium {
            background: #fff3cd;
            color: #856404;
        }
        .strength-strong {
            background: #e8f5e9;
            color: #2e7d32;
        }
        .requirements {
            margin-top: 15px;
            padding: 15px;
            background: #f5f7fa;
            border-radius: 8px;
            font-size: 0.9rem;
        }
        .requirements h4 {
            margin: 0 0 10px 0;
            color: #2d3561;
            font-size: 0.95rem;
        }
        .requirements ul {
            margin: 0;
            padding-left: 20px;
        }
        .requirements li {
            margin-bottom: 5px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <!--- Header --->
            <div class="login-header">
                <div class="logo">
                    <img src="/assets/img/logo.png" alt="PASC Region J" class="logo-img">
                </div>
                <h1>Password Change Required</h1>
                <p style="color: #666; margin-top: 10px;">
                    Welcome! For security, please change your temporary password before continuing.
                </p>
            </div>

            <!--- Error Message --->
            <cfif structKeyExists(variables, "errorMessage")>
                <div class="alert alert-error">
                    <cfoutput>#variables.errorMessage#</cfoutput>
                </div>
            </cfif>

            <!--- User Info --->
            <div style="margin-bottom: 20px; padding: 15px; background: #f5f7fa; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #666; font-size: 0.9rem;">Logged in as:</p>
                <p style="margin: 5px 0 0 0; font-weight: 700; color: #2d3561; font-size: 1.1rem;">
                    <cfoutput>#htmlEditFormat(getUser.full_name)#</cfoutput>
                </p>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 0.85rem;">
                    <cfoutput>(#htmlEditFormat(getUser.username)#)</cfoutput>
                </p>
            </div>

            <!--- Change Password Form --->
            <form method="post" class="login-form">
                <div class="form-group">
                    <label for="new_password">New Password *</label>
                    <input type="password"
                           id="new_password"
                           name="new_password"
                           required
                           minlength="8"
                           autocomplete="new-password"
                           oninput="checkPasswordStrength()">

                    <div id="passwordStrength" class="password-strength"></div>
                </div>

                <div class="form-group">
                    <label for="confirm_password">Confirm New Password *</label>
                    <input type="password"
                           id="confirm_password"
                           name="confirm_password"
                           required
                           minlength="8"
                           autocomplete="new-password">
                </div>

                <div class="requirements">
                    <h4>Password Requirements:</h4>
                    <ul>
                        <li>Minimum 8 characters</li>
                        <li>Recommended: Mix of uppercase, lowercase, numbers, and symbols</li>
                        <li>Avoid common words or personal information</li>
                    </ul>
                </div>

                <button type="submit" name="submit" class="btn-login">
                    Change Password & Continue
                </button>

                <div style="text-align: center; margin-top: 20px;">
                    <a href="logout.cfm" style="color: #4fc3f7; text-decoration: none; font-size: 0.9rem;">
                        Logout
                    </a>
                </div>
            </form>

            <!--- Footer --->
            <div class="login-footer">
                <p>&copy; 2025 PASC Region J Conference. All rights reserved.</p>
            </div>
        </div>
    </div>

    <!--- JavaScript for Password Strength and Validation --->
    <script>
    function checkPasswordStrength() {
        const password = document.getElementById('new_password').value;
        const strengthDiv = document.getElementById('passwordStrength');

        if (password.length === 0) {
            strengthDiv.style.display = 'none';
            return;
        }

        strengthDiv.style.display = 'block';

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        if (strength <= 2) {
            strengthDiv.className = 'password-strength strength-weak';
            strengthDiv.textContent = '⚠️ Weak Password - Consider making it stronger';
        } else if (strength <= 4) {
            strengthDiv.className = 'password-strength strength-medium';
            strengthDiv.textContent = '⚡ Medium Strength - Good!';
        } else {
            strengthDiv.className = 'password-strength strength-strong';
            strengthDiv.textContent = '✓ Strong Password - Excellent!';
        }
    }

    // Password match validation
    const newPasswordInput = document.getElementById('new_password');
    const confirmPasswordInput = document.getElementById('confirm_password');

    function validatePasswordMatch() {
        if (confirmPasswordInput.value && newPasswordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    }

    if (newPasswordInput && confirmPasswordInput) {
        newPasswordInput.addEventListener('input', validatePasswordMatch);
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
    </script>

    <!--- Session Heartbeat --->
    <cfinclude template="includes/admin_footer.cfm">
</body>
</html>
