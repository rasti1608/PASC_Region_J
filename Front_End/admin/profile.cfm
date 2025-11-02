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
            u.profile_picture,
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

<!--- Process Profile Picture Upload --->
<cfif structKeyExists(form, "upload_picture")>
    <cftry>
        <!--- Upload file FIRST --->
        <cffile action="upload"
                filefield="profile_picture"
                destination="#expandPath('/assets/img/profiles/')#"
                nameconflict="makeunique"
                result="uploadResult">

        <!--- NOW validate the uploaded file using uploadResult --->
        <cfset fileExt = lCase(listLast(uploadResult.serverFile, "."))>
        <cfset allowedExtensions = "jpg,jpeg,png,gif">

        <!--- Validate file extension --->
        <cfif NOT listFindNoCase(allowedExtensions, fileExt)>
            <!--- Delete invalid file --->
            <cffile action="delete" file="#uploadResult.serverDirectory#/#uploadResult.serverFile#">
            <cfset variables.pictureError = "Invalid file type. Only JPG, PNG, and GIF files are allowed.">

        <!--- Validate file size (5MB = 5242880 bytes) --->
        <cfelseif uploadResult.fileSize GT 5242880>
            <!--- Delete oversized file --->
            <cffile action="delete" file="#uploadResult.serverDirectory#/#uploadResult.serverFile#">
            <cfset variables.pictureError = "File too large. Maximum file size is 5MB.">

        <!--- File is valid, process it --->
        <cfelse>
            <!--- Rename file to user_id.jpg --->
            <cfset newFileName = "#session.admin_user_id#.jpg">
            <cfset newFilePath = "#expandPath('/assets/img/profiles/')##newFileName#">

            <!--- Delete old profile picture if exists --->
            <cfif fileExists(newFilePath)>
                <cffile action="delete" file="#newFilePath#">
            </cfif>

            <!--- Rename uploaded file --->
            <cffile action="rename"
                    source="#uploadResult.serverDirectory#/#uploadResult.serverFile#"
                    destination="#newFilePath#">

            <!--- Update database --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.admin_users
                SET profile_picture = <cfqueryparam value="#newFileName#" cfsqltype="cf_sql_varchar">,
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Update session variable --->
            <cfset session.profile_picture = newFileName>

            <cfset variables.pictureSuccess = "Profile picture uploaded successfully!">

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
                    u.profile_picture,
                    r.role_name
                FROM dbo.admin_users u
                LEFT JOIN dbo.roles r ON u.role_id = r.id
                WHERE u.id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
            </cfquery>
        </cfif>

        <cfcatch type="any">
            <cfset variables.pictureError = "Error uploading file: #cfcatch.message#">
        </cfcatch>
    </cftry>
</cfif>

<!--- Process Profile Picture Removal --->
<cfif structKeyExists(form, "remove_picture")>
    <cftry>
        <!--- Delete file if exists --->
        <cfif len(getUserProfile.profile_picture) AND fileExists(expandPath("/assets/img/profiles/#getUserProfile.profile_picture#"))>
            <cffile action="delete" file="#expandPath('/assets/img/profiles/#getUserProfile.profile_picture#')#">
        </cfif>

        <!--- Update database --->
        <cfquery datasource="#application.datasource#">
            UPDATE dbo.admin_users
            SET profile_picture = NULL,
                updated_at = GETDATE()
            WHERE id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
        </cfquery>

        <!--- Update session variable --->
        <cfset session.profile_picture = "">

        <cfset variables.pictureSuccess = "Profile picture removed successfully.">

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
                u.profile_picture,
                r.role_name
            FROM dbo.admin_users u
            LEFT JOIN dbo.roles r ON u.role_id = r.id
            WHERE u.id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
        </cfquery>

        <cfcatch type="any">
            <cfset variables.pictureError = "Error removing profile picture: #cfcatch.message#">
        </cfcatch>
    </cftry>
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
    <cfelseif NOT REFind("[A-Z]", trim(form.new_password))>
        <cfset variables.passwordError = "Password must contain at least one uppercase letter (A-Z).">
    <cfelseif NOT REFind("[0-9]", trim(form.new_password))>
        <cfset variables.passwordError = "Password must contain at least one number (0-9).">
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
            <!--- Top Header Bar --->
            <cfinclude template="includes/admin_header.cfm">

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

            <!--- Profile Picture Section --->
            <div class="section">
                <h2>Profile Picture</h2>

                <cfif structKeyExists(variables, "pictureSuccess")>
                    <div class="alert alert-success">
                        <cfoutput>#variables.pictureSuccess#</cfoutput>
                    </div>
                </cfif>

                <cfif structKeyExists(variables, "pictureError")>
                    <div class="alert alert-error">
                        <cfoutput>#variables.pictureError#</cfoutput>
                    </div>
                </cfif>

                <form method="post" enctype="multipart/form-data" class="admin-form">
                    <!--- Display Current Picture --->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <cfoutput>
                            <cfif len(getUserProfile.profile_picture) AND fileExists(expandPath("/assets/img/profiles/#getUserProfile.profile_picture#"))>
                                <img src="/assets/img/profiles/#getUserProfile.profile_picture#?v=#now().getTime()#"
                                     alt="Profile Picture"
                                     class="profile-picture-preview">
                            <cfelse>
                                <div class="profile-placeholder">
                                    👤
                                </div>
                            </cfif>
                        </cfoutput>
                    </div>

                    <div class="form-group">
                        <label for="profile_picture">Choose New Picture</label>
                        <input type="file"
                               id="profile_picture"
                               name="profile_picture"
                               accept=".jpg,.jpeg,.png,.gif">
                        <small>Maximum file size: 5MB. Allowed types: JPG, PNG, GIF</small>
                    </div>

                    <div class="form-actions" style="justify-content: center;">
                        <button type="submit" name="upload_picture" class="btn btn-primary">Upload Picture</button>
                        <cfif len(getUserProfile.profile_picture)>
                            <button type="submit" name="remove_picture" class="btn btn-secondary"
                                    style="background: #dc3545; color: white;"
                                    onclick="return confirm('Are you sure you want to remove your profile picture?');">
                                Remove Picture
                            </button>
                        </cfif>
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
                               pattern="^(?=.*[A-Z])(?=.*\d).{8,}$"
                               title="Must be at least 8 characters with one uppercase letter and one number"
                               autocomplete="new-password">
                        <small>Must be at least 8 characters with one uppercase letter (A-Z) and one number (0-9).</small>
                    </div>

                    <div class="form-group">
                        <label for="confirm_new_password">Confirm New Password *</label>
                        <input type="password"
                               id="confirm_new_password"
                               name="confirm_new_password"
                               required
                               minlength="8"
                               pattern="^(?=.*[A-Z])(?=.*\d).{8,}$"
                               title="Must be at least 8 characters with one uppercase letter and one number"
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

    <!--- Password Validation JavaScript --->
    <script>
    const newPasswordInput = document.getElementById('new_password');
    const confirmNewPasswordInput = document.getElementById('confirm_new_password');

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
        if (confirmNewPasswordInput.value && newPasswordInput.value !== confirmNewPasswordInput.value) {
            confirmNewPasswordInput.setCustomValidity('Passwords do not match');
        } else {
            confirmNewPasswordInput.setCustomValidity('');
        }
    }

    if (newPasswordInput && confirmNewPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            const error = validatePasswordStrength(this.value);
            this.setCustomValidity(error);
            validatePasswordMatch();
        });
        confirmNewPasswordInput.addEventListener('input', validatePasswordMatch);
    }
    </script>

    <!--- Session Heartbeat --->
    <cfinclude template="includes/admin_footer.cfm">
</body>
</html>
