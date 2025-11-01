<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/users/edit.cfm
* Created:     November 1, 2025
* Author:      Rastislav Toscak
*
* Purpose:     Edit existing admin user
*              Update user information and optionally reset password
*
* Features:    - Edit full name, email, role, and status
*              - Optional password change section
*              - View last login and created date
*              - Prevent invalid role changes
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Include authentication check --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Permission check: Only users with user_management permission can access this page --->
<cfif NOT ListFindNoCase(session.permissions, "user_management")>
    <cflocation url="/admin/dashboard.cfm?error=no_permission" addtoken="false">
    <cfabort>
</cfif>

<!--- Validate ID parameter --->
<cfif NOT structKeyExists(url, "id") OR NOT isNumeric(url.id)>
    <cflocation url="index.cfm" addtoken="false">
    <cfabort>
</cfif>

<!--- Get user data --->
<cftry>
    <cfquery name="getUser" datasource="#application.datasource#">
        SELECT
            u.id,
            u.username,
            u.full_name,
            u.email,
            u.role_id,
            u.is_active,
            u.last_login,
            u.created_at,
            r.role_name
        FROM dbo.admin_users u
        LEFT JOIN dbo.roles r ON u.role_id = r.id
        WHERE u.id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
    </cfquery>

    <cfif getUser.recordCount EQ 0>
        <cflocation url="index.cfm" addtoken="false">
        <cfabort>
    </cfif>

    <cfcatch type="any">
        <cfset variables.errorMessage = "Error loading user: #cfcatch.message#">
        <cflocation url="index.cfm" addtoken="false">
        <cfabort>
    </cfcatch>
</cftry>

<!--- Prevent editing master admin account --->
<cfif getUser.username EQ "admin">
    <cflocation url="index.cfm" addtoken="false">
    <cfabort>
</cfif>

<!--- Initialize form parameters --->
<cfparam name="form.is_active" default="0">
<cfparam name="form.change_password" default="0">

<!--- Process form submission --->
<cfif structKeyExists(form, "submit")>
    <!--- Validate required fields --->
    <cfif NOT len(trim(form.full_name))>
        <cfset variables.errorMessage = "Full name is required.">
    <cfelseif NOT len(trim(form.email))>
        <cfset variables.errorMessage = "Email is required.">
    <cfelseif NOT isValid("email", trim(form.email))>
        <cfset variables.errorMessage = "Please enter a valid email address.">
    <cfelseif NOT isNumeric(form.role_id) OR form.role_id LT 1>
        <cfset variables.errorMessage = "Please select a valid role.">
    <cfelse>
        <!--- Validate password if changing --->
        <cfif form.change_password EQ 1>
            <cfif NOT len(trim(form.new_password))>
                <cfset variables.errorMessage = "New password is required when 'Change Password' is checked.">
            <cfelseif len(trim(form.new_password)) LT 8>
                <cfset variables.errorMessage = "Password must be at least 8 characters long.">
            <cfelseif form.new_password NEQ form.confirm_password>
                <cfset variables.errorMessage = "Passwords do not match.">
            </cfif>
        </cfif>

        <!--- Check if trying to deactivate last active Admin --->
        <cfif NOT structKeyExists(variables, "errorMessage") AND form.is_active EQ 0>
            <cfquery name="checkLastAdmin" datasource="#application.datasource#">
                SELECT COUNT(*) as admin_count
                FROM dbo.admin_users
                WHERE role_id = 1
                AND is_active = 1
                AND id <> <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif getUser.role_id EQ 1 AND getUser.is_active EQ 1 AND checkLastAdmin.admin_count EQ 0>
                <cfset variables.errorMessage = "Cannot deactivate the last active Administrator.">
            </cfif>
        </cfif>

        <!--- Check if email already exists (for another user) --->
        <cfif NOT structKeyExists(variables, "errorMessage")>
            <cfquery name="checkEmail" datasource="#application.datasource#">
                SELECT id
                FROM dbo.admin_users
                WHERE email = <cfqueryparam value="#trim(form.email)#" cfsqltype="cf_sql_varchar">
                AND id <> <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif checkEmail.recordCount GT 0>
                <cfset variables.errorMessage = "Email address already exists. Please use a different email.">
            </cfif>
        </cfif>

        <!--- All validation passed - update user --->
        <cfif NOT structKeyExists(variables, "errorMessage")>
            <cftry>
                <cfquery datasource="#application.datasource#">
                    UPDATE dbo.admin_users
                    SET
                        full_name = <cfqueryparam value="#trim(form.full_name)#" cfsqltype="cf_sql_varchar">,
                        email = <cfqueryparam value="#trim(form.email)#" cfsqltype="cf_sql_varchar">,
                        role_id = <cfqueryparam value="#form.role_id#" cfsqltype="cf_sql_integer">,
                        is_active = <cfqueryparam value="#form.is_active#" cfsqltype="cf_sql_bit">,
                        updated_at = GETDATE()
                        <cfif form.change_password EQ 1>
                            ,password_hash = <cfqueryparam value="#trim(form.new_password)#" cfsqltype="cf_sql_varchar">
                            ,must_change_password = 0
                            ,password_changed_at = GETDATE()
                        </cfif>
                    WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
                </cfquery>

                <cfset variables.successMessage = "User updated successfully.">

                <!--- Reload user data to show updated values --->
                <cfquery name="getUser" datasource="#application.datasource#">
                    SELECT
                        u.id,
                        u.username,
                        u.full_name,
                        u.email,
                        u.role_id,
                        u.is_active,
                        u.last_login,
                        u.created_at,
                        r.role_name
                    FROM dbo.admin_users u
                    LEFT JOIN dbo.roles r ON u.role_id = r.id
                    WHERE u.id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
                </cfquery>

                <cfcatch type="any">
                    <cfset variables.errorMessage = "Error updating user: #cfcatch.message#">
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
    <title>Edit User - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
</head>
<body>
    <div class="admin-wrapper">
        <!--- Include Sidebar Navigation --->
        <cfinclude template="../includes/admin_nav.cfm">

        <!--- Main Content --->
        <main class="admin-content">
            <!--- Fixed Header Bar --->
            <cfinclude template="../includes/admin_header.cfm">

            <!--- Content Header --->
            <div class="content-header">
                <h1>Edit User</h1>
                <p><a href="index.cfm" style="color: #4fc3f7; text-decoration: none;">← Back to User Management</a></p>
            </div>

            <!--- Main Section --->
            <div class="section">
                <!--- Success Message --->
                <cfif structKeyExists(variables, "successMessage")>
                    <div class="alert alert-success">
                        <cfoutput>#variables.successMessage#</cfoutput>
                    </div>
                </cfif>

                <!--- Error Message --->
                <cfif structKeyExists(variables, "errorMessage")>
                    <div class="alert alert-error">
                        <cfoutput>#variables.errorMessage#</cfoutput>
                    </div>
                </cfif>

                <!--- Edit User Form --->
                <form method="post" class="admin-form">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text"
                               value="<cfoutput>#htmlEditFormat(getUser.username)#</cfoutput>"
                               readonly
                               style="background-color: #f5f7fa; cursor: not-allowed;">
                        <small>Username cannot be changed.</small>
                    </div>

                    <div class="form-group">
                        <label for="full_name">Full Name *</label>
                        <cfif NOT structKeyExists(form, "submit")>
                            <cfset form.full_name = getUser.full_name>
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
                        <cfif NOT structKeyExists(form, "submit")>
                            <cfset form.email = getUser.email>
                        </cfif>
                        <input type="email"
                               id="email"
                               name="email"
                               value="<cfoutput>#htmlEditFormat(form.email)#</cfoutput>"
                               required
                               maxlength="100">
                    </div>

                    <div class="form-group">
                        <label for="role_id">Role *</label>
                        <cfif NOT structKeyExists(form, "submit")>
                            <cfset form.role_id = getUser.role_id>
                        </cfif>
                        <select id="role_id" name="role_id" required>
                            <option value="">-- Select Role --</option>
                            <cfoutput>
                                <option value="1" #form.role_id EQ 1 ? "selected" : ""#>Admin</option>
                                <option value="2" #form.role_id EQ 2 ? "selected" : ""#>Content Manager</option>
                            </cfoutput>
                        </select>
                        <small>
                            <strong>Admin:</strong> Full access including user management. |
                            <strong>Content Manager:</strong> Can manage all content sections.
                        </small>
                    </div>

                    <div class="form-group">
                        <cfif NOT structKeyExists(form, "submit")>
                            <cfset form.is_active = getUser.is_active>
                        </cfif>
                        <label class="checkbox-label">
                            <cfoutput>
                                <input type="checkbox"
                                       name="is_active"
                                       value="1"
                                       #form.is_active EQ 1 ? "checked" : ""#>
                            </cfoutput>
                            Active
                        </label>
                        <small>If checked, user can log in. Uncheck to disable access.</small>
                    </div>

                    <!--- Password Change Section --->
                    <div style="margin: 30px 0; padding: 20px; background: #f5f7fa; border-radius: 8px;">
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox"
                                       id="change_password_check"
                                       name="change_password"
                                       value="1"
                                       onchange="togglePasswordFields()">
                                Change Password
                            </label>
                            <small>Check this box if you want to reset the user's password.</small>
                        </div>

                        <div id="password_fields" style="display: none;">
                            <div class="form-group">
                                <label for="new_password">New Password</label>
                                <input type="password"
                                       id="new_password"
                                       name="new_password"
                                       minlength="8"
                                       autocomplete="new-password">
                                <small>Minimum 8 characters. User will NOT be required to change this password.</small>
                            </div>

                            <div class="form-group">
                                <label for="confirm_password">Confirm New Password</label>
                                <input type="password"
                                       id="confirm_password"
                                       name="confirm_password"
                                       minlength="8"
                                       autocomplete="new-password">
                            </div>
                        </div>
                    </div>

                    <!--- Read-Only Information --->
                    <div style="margin: 30px 0; padding: 20px; background: #f5f7fa; border-radius: 8px;">
                        <h3 style="margin-bottom: 15px; color: #2d3561;">Account Information</h3>

                        <div class="info-row">
                            <span class="info-label">Last Login:</span>
                            <span class="info-value">
                                <cfoutput>
                                    <cfif len(getUser.last_login)>
                                        #dateFormat(getUser.last_login, "mmmm d, yyyy")# at #timeFormat(getUser.last_login, "h:mm tt")#
                                    <cfelse>
                                        Never logged in
                                    </cfif>
                                </cfoutput>
                            </span>
                        </div>

                        <div class="info-row">
                            <span class="info-label">Account Created:</span>
                            <span class="info-value">
                                <cfoutput>#dateFormat(getUser.created_at, "mmmm d, yyyy")# at #timeFormat(getUser.created_at, "h:mm tt")#</cfoutput>
                            </span>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" name="submit" class="btn btn-primary">Update User</button>
                        <a href="index.cfm" class="btn btn-secondary">Cancel</a>
                        <cfoutput>
                            <a href="delete.cfm?id=#url.id#" class="btn btn-danger" style="margin-left: auto;">Delete User</a>
                        </cfoutput>
                    </div>
                </form>
            </div>
        </main>
    </div>

    <!--- JavaScript for Password Fields Toggle and Validation --->
    <script>
    function togglePasswordFields() {
        const checkbox = document.getElementById('change_password_check');
        const passwordFields = document.getElementById('password_fields');
        const newPasswordInput = document.getElementById('new_password');
        const confirmPasswordInput = document.getElementById('confirm_password');

        if (checkbox.checked) {
            passwordFields.style.display = 'block';
            newPasswordInput.required = true;
            confirmPasswordInput.required = true;
        } else {
            passwordFields.style.display = 'none';
            newPasswordInput.required = false;
            confirmPasswordInput.required = false;
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';
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
    <cfinclude template="../includes/admin_footer.cfm">
</body>
</html>
