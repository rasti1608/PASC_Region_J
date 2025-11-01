<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/profile.cfm
* Created:     November 1, 2025
* Author:      Rastislav Toscak
*
* Purpose:     User profile management page
*              Allow users to update their own profile and change password
*
* Features:    - Edit personal information (name, email)
*              - Change password (requires current password)
*              - View account information
*              - Cannot change own role or status
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Include authentication check --->
<cfinclude template="../includes/auth_check.cfm">

<!--- Get current user's full data --->
<cftry>
    <cfquery name="getUserProfile" datasource="#application.datasource#">
        SELECT
            u.id,
            u.username,
            u.full_name,
            u.email,
            u.password_hash,
            u.role_id,
            u.is_active,
            u.last_login,
            u.created_at,
            u.password_changed_at,
            r.role_name
        FROM dbo.admin_users u
        LEFT JOIN dbo.roles r ON u.role_id = r.id
        WHERE u.id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
    </cfquery>

    <cfif getUserProfile.recordCount EQ 0>
        <cfset structClear(session)>
        <cflocation url="login.cfm?msg=session_expired" addtoken="false">
        <cfabort>
    </cfif>

    <cfcatch type="any">
        <cfset variables.errorMessage = "Error loading profile: #cfcatch.message#">
    </cfcatch>
</cftry>

<!--- Process Personal Info Update --->
<cfif structKeyExists(form, "update_info")>
    <!--- Validate required fields --->
    <cfif NOT len(trim(form.full_name))>
        <cfset variables.errorMessage = "Full name is required.">
    <cfelseif NOT len(trim(form.email))>
        <cfset variables.errorMessage = "Email is required.">
    <cfelseif NOT isValid("email", trim(form.email))>
        <cfset variables.errorMessage = "Please enter a valid email address.">
    <cfelse>
        <!--- Check if email already exists (for another user) --->
        <cfquery name="checkEmail" datasource="#application.datasource#">
            SELECT id
            FROM dbo.admin_users
            WHERE email = <cfqueryparam value="#trim(form.email)#" cfsqltype="cf_sql_varchar">
            AND id <> <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
        </cfquery>

        <cfif checkEmail.recordCount GT 0>
            <cfset variables.errorMessage = "Email address already in use by another user.">
        <cfelse>
            <!--- Update personal information --->
            <cftry>
                <cfquery datasource="#application.datasource#">
                    UPDATE dbo.admin_users
                    SET
                        full_name = <cfqueryparam value="#trim(form.full_name)#" cfsqltype="cf_sql_varchar">,
                        email = <cfqueryparam value="#trim(form.email)#" cfsqltype="cf_sql_varchar">,
                        updated_at = GETDATE()
                    WHERE id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
                </cfquery>

                <!--- Update session variables --->
                <cfset session.admin_full_name = trim(form.full_name)>
                <cfset session.admin_email = trim(form.email)>

                <cfset variables.successMessage = "Profile updated successfully.">

                <!--- Reload profile data --->
                <cfquery name="getUserProfile" datasource="#application.datasource#">
                    SELECT
                        u.id,
                        u.username,
                        u.full_name,
                        u.email,
                        u.password_hash,
                        u.role_id,
                        u.is_active,
                        u.last_login,
                        u.created_at,
                        u.password_changed_at,
                        r.role_name
                    FROM dbo.admin_users u
                    LEFT JOIN dbo.roles r ON u.role_id = r.id
                    WHERE u.id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
                </cfquery>

                <cfcatch type="any">
                    <cfset variables.errorMessage = "Error updating profile: #cfcatch.message#">
                </cfcatch>
            </cftry>
        </cfif>
    </cfif>
</cfif>

<!--- Process Password Change --->
<cfif structKeyExists(form, "change_password")>
    <!--- Validate password fields --->
    <cfif NOT len(trim(form.current_password))>
        <cfset variables.passwordError = "Current password is required.">
    <cfelseif NOT len(trim(form.new_password))>
        <cfset variables.passwordError = "New password is required.">
    <cfelseif len(trim(form.new_password)) LT 8>
        <cfset variables.passwordError = "New password must be at least 8 characters long.">
    <cfelseif form.new_password NEQ form.confirm_new_password>
        <cfset variables.passwordError = "New passwords do not match.">
    <cfelseif trim(form.current_password) EQ trim(form.new_password)>
        <cfset variables.passwordError = "New password must be different from current password.">
    <cfelse>
        <!--- Verify current password --->
        <cfif trim(form.current_password) NEQ getUserProfile.password_hash>
            <cfset variables.passwordError = "Current password is incorrect.">
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

                <cfset variables.passwordSuccess = "Password changed successfully.">

                <!--- Reload profile data --->
                <cfquery name="getUserProfile" datasource="#application.datasource#">
                    SELECT
                        u.id,
                        u.username,
                        u.full_name,
                        u.email,
                        u.password_hash,
                        u.role_id,
                        u.is_active,
                        u.last_login,
                        u.created_at,
                        u.password_changed_at,
                        r.role_name
                    FROM dbo.admin_users u
                    LEFT JOIN dbo.roles r ON u.role_id = r.id
                    WHERE u.id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
                </cfquery>

                <cfcatch type="any">
                    <cfset variables.passwordError = "Error changing password: #cfcatch.message#">
                </cfcatch>
            </cftry>
        </cfif>
    </cfif>
</cfif>

</cfsilent><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
</head>
<body>
    <div class="admin-wrapper">
        <!--- Include Sidebar Navigation --->
        <cfinclude template="includes/admin_nav.cfm">

        <!--- Main Content --->
        <main class="admin-content">
            <!--- Content Header --->
            <div class="content-header">
                <h1>My Profile</h1>
                <p>Manage your personal information and account settings</p>
            </div>

            <!--- Success/Error Messages --->
            <cfif structKeyExists(variables, "successMessage")>
                <div class="alert alert-success">
                    <cfoutput>#variables.successMessage#</cfoutput>
                </div>
            </cfif>

            <cfif structKeyExists(variables, "errorMessage")>
                <div class="alert alert-error">
                    <cfoutput>#variables.errorMessage#</cfoutput>
                </div>
            </cfif>

            <!--- Personal Information Section --->
            <div class="section">
                <h2>Personal Information</h2>

                <form method="post" class="admin-form">
                    <div class="form-group">
                        <label for="full_name">Full Name *</label>
                        <cfif NOT structKeyExists(form, "update_info")>
                            <cfset form.full_name = getUserProfile.full_name>
                        </cfif>
                        <input type="text"
                               id="full_name"
                               name="full_name"
                               value="<cfoutput>#htmlEditFormat(form.full_name)#</cfoutput>"
                               required
                               maxlength="100">
                    </div>

                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <cfif NOT structKeyExists(form, "update_info")>
                            <cfset form.email = getUserProfile.email>
                        </cfif>
                        <input type="email"
                               id="email"
                               name="email"
                               value="<cfoutput>#htmlEditFormat(form.email)#</cfoutput>"
                               required
                               maxlength="100">
                    </div>

                    <div class="form-actions">
                        <button type="submit" name="update_info" class="btn btn-primary">Update Profile</button>
                    </div>
                </form>
            </div>

            <!--- Change Password Section --->
            <div class="section">
                <h2>Change Password</h2>

                <cfif structKeyExists(variables, "passwordSuccess")>
                    <div class="alert alert-success">
                        <cfoutput>#variables.passwordSuccess#</cfoutput>
                    </div>
                </cfif>

                <cfif structKeyExists(variables, "passwordError")>
                    <div class="alert alert-error">
                        <cfoutput>#variables.passwordError#</cfoutput>
                    </div>
                </cfif>

                <form method="post" class="admin-form">
                    <div class="form-group">
                        <label for="current_password">Current Password *</label>
                        <input type="password"
                               id="current_password"
                               name="current_password"
                               required
                               autocomplete="current-password">
                        <small>Enter your current password for security verification.</small>
                    </div>

                    <div class="form-group">
                        <label for="new_password">New Password *</label>
                        <input type="password"
                               id="new_password"
                               name="new_password"
                               required
                               minlength="8"
                               autocomplete="new-password">
                        <small>Minimum 8 characters.</small>
                    </div>

                    <div class="form-group">
                        <label for="confirm_new_password">Confirm New Password *</label>
                        <input type="password"
                               id="confirm_new_password"
                               name="confirm_new_password"
                               required
                               minlength="8"
                               autocomplete="new-password">
                    </div>

                    <div class="form-actions">
                        <button type="submit" name="change_password" class="btn btn-primary">Change Password</button>
                    </div>
                </form>
            </div>

            <!--- Account Information Section (Read-Only) --->
            <div class="section">
                <h2>Account Information</h2>

                <div class="admin-form">
                    <div class="info-row">
                        <span class="info-label">Username:</span>
                        <span class="info-value">
                            <cfoutput>#htmlEditFormat(getUserProfile.username)#</cfoutput>
                        </span>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Role:</span>
                        <span class="info-value">
                            <cfoutput>
                                <strong style="color: ##2d3561;">#htmlEditFormat(getUserProfile.role_name)#</strong>
                            </cfoutput>
                        </span>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Account Status:</span>
                        <span class="info-value">
                            <cfif getUserProfile.is_active>
                                <span class="badge badge-success">✓ Active</span>
                            <cfelse>
                                <span class="badge badge-inactive">Inactive</span>
                            </cfif>
                        </span>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Last Login:</span>
                        <span class="info-value">
                            <cfoutput>
                                <cfif len(getUserProfile.last_login)>
                                    #dateFormat(getUserProfile.last_login, "mmmm d, yyyy")# at #timeFormat(getUserProfile.last_login, "h:mm tt")#
                                <cfelse>
                                    Never logged in
                                </cfif>
                            </cfoutput>
                        </span>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Account Created:</span>
                        <span class="info-value">
                            <cfoutput>#dateFormat(getUserProfile.created_at, "mmmm d, yyyy")# at #timeFormat(getUserProfile.created_at, "h:mm tt")#</cfoutput>
                        </span>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Password Last Changed:</span>
                        <span class="info-value">
                            <cfoutput>
                                <cfif len(getUserProfile.password_changed_at)>
                                    #dateFormat(getUserProfile.password_changed_at, "mmmm d, yyyy")# at #timeFormat(getUserProfile.password_changed_at, "h:mm tt")#
                                <cfelse>
                                    Never changed
                                </cfif>
                            </cfoutput>
                        </span>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!--- Password Match Validation JavaScript --->
    <script>
    const newPasswordInput = document.getElementById('new_password');
    const confirmNewPasswordInput = document.getElementById('confirm_new_password');

    function validatePasswordMatch() {
        if (confirmNewPasswordInput.value && newPasswordInput.value !== confirmNewPasswordInput.value) {
            confirmNewPasswordInput.setCustomValidity('Passwords do not match');
        } else {
            confirmNewPasswordInput.setCustomValidity('');
        }
    }

    if (newPasswordInput && confirmNewPasswordInput) {
        newPasswordInput.addEventListener('input', validatePasswordMatch);
        confirmNewPasswordInput.addEventListener('input', validatePasswordMatch);
    }
    </script>
</body>
</html>
