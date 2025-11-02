<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/users/add.cfm
* Created:     November 1, 2025
* Author:      Rastislav Toscak
*
* Purpose:     Add new admin user form
*              Create new admin users with role assignment
*
* Features:    - Username validation (unique)
*              - Password validation (min 8 chars, must match)
*              - Email format validation
*              - Role assignment
*              - Sets must_change_password flag
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

<!--- Initialize form parameters (for checkbox handling) --->
<cfparam name="form.is_active" default="0">

<!--- Process form submission --->
<cfif structKeyExists(form, "submit")>
    <!--- Validate required fields --->
    <cfif NOT len(trim(form.username))>
        <cfset variables.errorMessage = "Username is required.">
    <cfelseif NOT len(trim(form.password))>
        <cfset variables.errorMessage = "Password is required.">
    <cfelseif len(trim(form.password)) LT 8>
        <cfset variables.errorMessage = "Password must be at least 8 characters long.">
    <cfelseif NOT REFind("[A-Z]", trim(form.password))>
        <cfset variables.errorMessage = "Password must contain at least one uppercase letter (A-Z).">
    <cfelseif NOT REFind("[0-9]", trim(form.password))>
        <cfset variables.errorMessage = "Password must contain at least one number (0-9).">
    <cfelseif form.password NEQ form.confirm_password>
        <cfset variables.errorMessage = "Passwords do not match.">
    <cfelseif NOT len(trim(form.full_name))>
        <cfset variables.errorMessage = "Full name is required.">
    <cfelseif NOT len(trim(form.email))>
        <cfset variables.errorMessage = "Email is required.">
    <cfelseif NOT isValid("email", trim(form.email))>
        <cfset variables.errorMessage = "Please enter a valid email address.">
    <cfelseif NOT isNumeric(form.role_id) OR form.role_id LT 1>
        <cfset variables.errorMessage = "Please select a valid role.">
    <cfelse>
        <!--- Check if username already exists --->
        <cftry>
            <cfquery name="checkUsername" datasource="#application.datasource#">
                SELECT id
                FROM dbo.admin_users
                WHERE username = <cfqueryparam value="#trim(form.username)#" cfsqltype="cf_sql_varchar">
            </cfquery>

            <cfif checkUsername.recordCount GT 0>
                <cfset variables.errorMessage = "Username already exists. Please choose a different username.">
            <cfelse>
                <!--- Check if email already exists --->
                <cfquery name="checkEmail" datasource="#application.datasource#">
                    SELECT id
                    FROM dbo.admin_users
                    WHERE email = <cfqueryparam value="#trim(form.email)#" cfsqltype="cf_sql_varchar">
                </cfquery>

                <cfif checkEmail.recordCount GT 0>
                    <cfset variables.errorMessage = "Email address already exists. Please use a different email.">
                <cfelse>
                    <!--- All validation passed - insert new user --->
                    <cfquery datasource="#application.datasource#">
                        INSERT INTO dbo.admin_users (
                            username,
                            password_hash,
                            full_name,
                            email,
                            role_id,
                            is_active,
                            must_change_password,
                            created_at,
                            updated_at
                        ) VALUES (
                            <cfqueryparam value="#trim(form.username)#" cfsqltype="cf_sql_varchar">,
                            <cfqueryparam value="#trim(form.password)#" cfsqltype="cf_sql_varchar">,
                            <cfqueryparam value="#trim(form.full_name)#" cfsqltype="cf_sql_varchar">,
                            <cfqueryparam value="#trim(form.email)#" cfsqltype="cf_sql_varchar">,
                            <cfqueryparam value="#form.role_id#" cfsqltype="cf_sql_integer">,
                            <cfqueryparam value="#form.is_active#" cfsqltype="cf_sql_bit">,
                            1,
                            GETDATE(),
                            GETDATE()
                        )
                    </cfquery>

                    <!--- Store password for success message display --->
                    <cfset variables.tempPassword = trim(form.password)>
                    <cfset variables.successMessage = "User created successfully!">
                </cfif>
            </cfif>

            <cfcatch type="any">
            	<cfdump var="#cfcatch#">
            	<cfabort>
                <cfset variables.errorMessage = "Error creating user: #cfcatch.message#">
            </cfcatch>
        </cftry>
    </cfif>
</cfif>

</cfsilent><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add New User - PASC Region J Admin</title>
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
                <h1>Add New User</h1>
                <p><a href="index.cfm" style="color: #4fc3f7; text-decoration: none;">← Back to User Management</a></p>
            </div>

            <!--- Main Section --->
            <div class="section">
                <!--- Success Message with Temp Password --->
                <cfif structKeyExists(variables, "successMessage")>
                    <div class="alert alert-success" style="margin-bottom: 20px;">
                        <strong>✓ <cfoutput>#variables.successMessage#</cfoutput></strong>
                        <cfif structKeyExists(variables, "tempPassword")>
                            <div style="margin-top: 15px; padding: 15px; background: #fff; border-left: 4px solid #4fc3f7; border-radius: 4px;">
                                <strong style="color: #2d3561;">Temporary Password:</strong>
                                <code style="display: block; margin-top: 10px; padding: 10px; background: #f5f7fa; border-radius: 4px; font-size: 1.1rem; font-family: 'Courier New', monospace; color: #2d3561;">
                                    <cfoutput>#htmlEditFormat(variables.tempPassword)#</cfoutput>
                                </code>
                                <p style="margin-top: 10px; color: #666; font-size: 0.9rem;">
                                    ⚠️ <strong>Important:</strong> Share this password securely with the user.
                                    They will be required to change it upon first login.
                                </p>
                            </div>
                        </cfif>
                        <div style="margin-top: 15px;">
                            <a href="add.cfm" class="btn btn-primary">Add Another User</a>
                            <a href="index.cfm" class="btn btn-secondary">Back to User List</a>
                        </div>
                    </div>
                </cfif>

                <!--- Error Message --->
                <cfif structKeyExists(variables, "errorMessage")>
                    <div class="alert alert-error">
                        <cfoutput>#variables.errorMessage#</cfoutput>
                    </div>
                </cfif>

                <!--- Add User Form --->
                <cfif NOT structKeyExists(variables, "successMessage")>
                    <form method="post" class="admin-form">
                        <div class="form-group">
                            <label for="username">Username *</label>
                            <input type="text"
                                   id="username"
                                   name="username"
                                   value="<cfif structKeyExists(form, 'username')><cfoutput>#htmlEditFormat(form.username)#</cfoutput></cfif>"
                                   required
                                   maxlength="50"
                                   autocomplete="off">
                            <small>Username for logging into the admin panel. Must be unique.</small>
                        </div>

                        <div class="form-group">
                            <label for="password">Password *</label>
                            <input type="password"
                                   id="password"
                                   name="password"
                                   required
                                   minlength="8"
                                   pattern="^(?=.*[A-Z])(?=.*\d).{8,}$"
                                   title="Must be at least 8 characters with one uppercase letter and one number"
                                   autocomplete="new-password">
                            <small>Must be at least 8 characters with one uppercase letter (A-Z) and one number (0-9). User will be required to change this on first login.</small>
                        </div>

                        <div class="form-group">
                            <label for="confirm_password">Confirm Password *</label>
                            <input type="password"
                                   id="confirm_password"
                                   name="confirm_password"
                                   required
                                   minlength="8"
                                   pattern="^(?=.*[A-Z])(?=.*\d).{8,}$"
                                   title="Must be at least 8 characters with one uppercase letter and one number"
                                   autocomplete="new-password">
                            <small>Re-enter the password to confirm.</small>
                        </div>

                        <div class="form-group">
                            <label for="full_name">Full Name *</label>
                            <input type="text"
                                   id="full_name"
                                   name="full_name"
                                   value="<cfif structKeyExists(form, 'full_name')><cfoutput>#htmlEditFormat(form.full_name)#</cfoutput></cfif>"
                                   required
                                   maxlength="100">
                            <small>User's full name (displayed in admin panel).</small>
                        </div>

                        <div class="form-group">
                            <label for="email">Email Address *</label>
                            <input type="email"
                                   id="email"
                                   name="email"
                                   value="<cfif structKeyExists(form, 'email')><cfoutput>#htmlEditFormat(form.email)#</cfoutput></cfif>"
                                   required
                                   maxlength="100">
                            <small>Valid email address for notifications and password reset.</small>
                        </div>

                        <div class="form-group">
                            <label for="role_id">Role *</label>
                            <select id="role_id" name="role_id" required>
                                <option value="">-- Select Role --</option>
                                <option value="1" <cfif structKeyExists(form, "role_id") AND form.role_id EQ 1>selected</cfif>>
                                    Admin
                                </option>
                                <option value="2" <cfif structKeyExists(form, "role_id") AND form.role_id EQ 2>selected</cfif>>
                                    Content Manager
                                </option>
                            </select>
                            <small>
                                <strong>Admin:</strong> Full access including user management. |
                                <strong>Content Manager:</strong> Can manage all content sections.
                            </small>
                        </div>

                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox"
                                       name="is_active"
                                       value="1"
                                       <cfif NOT structKeyExists(form, "submit") OR form.is_active EQ 1>checked</cfif>>
                                Active
                            </label>
                            <small>If checked, user can log in immediately. Uncheck to create inactive user.</small>
                        </div>

                        <div class="form-actions">
                            <button type="submit" name="submit" class="btn btn-primary">Create User</button>
                            <a href="index.cfm" class="btn btn-secondary">Cancel</a>
                        </div>
                    </form>
                </cfif>
            </div>
        </main>
    </div>

    <!--- Password Match Validation JavaScript --->
    <script>
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');

    function validatePasswordStrength(password) {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter (A-Z)';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number (0-9)';
        }
        return '';
    }

    function validatePasswordMatch() {
        if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    }

    if (passwordInput && confirmPasswordInput) {
        passwordInput.addEventListener('input', function() {
            const error = validatePasswordStrength(this.value);
            this.setCustomValidity(error);
            validatePasswordMatch();
        });
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
    </script>

    <!--- Session Heartbeat --->
    <cfinclude template="../includes/admin_footer.cfm">
</body>
</html>
