<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin_api/profile_api.cfm
* Created:     November 17, 2025
* Author:      Rastislav Toscak (via Claude Code)
*
* Purpose:     REST API for Angular profile management
*
* Methods:     - GET  ?method=getProfile - Get current user profile
*              - POST ?method=updateProfile - Update name/email
*              - POST ?method=changePassword - Change password
*              - POST ?method=uploadProfilePicture - Upload profile picture
*              - DELETE ?method=removeProfilePicture - Remove profile picture
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Set JSON content type --->
<cfcontent type="application/json" reset="true">

<!--- Include authentication check --->
<cfinclude template="../includes/auth_check.cfm">

<!--- Get request method --->
<cfparam name="url.method" default="">
<cfset httpMethod = cgi.request_method>

<!--- Initialize response structure --->
<cfset response = structNew()>
<cfset response.success = false>

<!--- GET Profile Data --->
<cfif url.method EQ "getProfile" AND httpMethod EQ "GET">
    <cftry>
        <cfquery name="getUserProfile" datasource="#application.datasource#">
            SELECT
                u.id,
                u.username,
                u.full_name,
                u.email,
                u.role_id,
                u.is_active,
                u.last_login,
                u.created_at,
                u.password_changed_at,
                u.profile_picture,
                u.must_change_password,
                r.role_name
            FROM dbo.admin_users u
            LEFT JOIN dbo.roles r ON u.role_id = r.id
            WHERE u.id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
        </cfquery>

        <cfif getUserProfile.recordCount EQ 0>
            <cfset response.message = "User not found">
            <cfoutput>#serializeJSON(response)#</cfoutput>
            <cfabort>
        </cfif>

        <cfset response.success = true>
        <cfset response.data = {
            "id" = getUserProfile.id,
            "username" = getUserProfile.username,
            "full_name" = getUserProfile.full_name,
            "email" = getUserProfile.email,
            "role_id" = getUserProfile.role_id,
            "role_name" = getUserProfile.role_name,
            "is_active" = getUserProfile.is_active,
            "last_login" = dateFormat(getUserProfile.last_login, "yyyy-mm-dd") & "T" & timeFormat(getUserProfile.last_login, "HH:mm:ss"),
            "created_at" = dateFormat(getUserProfile.created_at, "yyyy-mm-dd") & "T" & timeFormat(getUserProfile.created_at, "HH:mm:ss"),
            "password_changed_at" = isNull(getUserProfile.password_changed_at) ? "" : dateFormat(getUserProfile.password_changed_at, "yyyy-mm-dd") & "T" & timeFormat(getUserProfile.password_changed_at, "HH:mm:ss"),
            "profile_picture" = getUserProfile.profile_picture,
            "must_change_password" = getUserProfile.must_change_password
        }>

        <cfcatch type="any">
            <cfset response.message = "Error loading profile: #cfcatch.message#">
        </cfcatch>
    </cftry>

<!--- UPDATE Profile (name, email) --->
<cfelseif url.method EQ "updateProfile" AND httpMethod EQ "POST">
    <cftry>
        <!--- Get JSON body --->
        <cfset requestBody = toString(getHttpRequestData().content)>
        <cfset formData = deserializeJSON(requestBody)>

        <!--- Validate required fields --->
        <cfif NOT structKeyExists(formData, "full_name") OR NOT len(trim(formData.full_name))>
            <cfset response.message = "Full name is required">
        <cfelseif NOT structKeyExists(formData, "email") OR NOT len(trim(formData.email))>
            <cfset response.message = "Email is required">
        <cfelseif NOT isValid("email", trim(formData.email))>
            <cfset response.message = "Please enter a valid email address">
        <cfelse>
            <!--- Check if email already exists (for another user) --->
            <cfquery name="checkEmail" datasource="#application.datasource#">
                SELECT id
                FROM dbo.admin_users
                WHERE email = <cfqueryparam value="#trim(formData.email)#" cfsqltype="cf_sql_varchar">
                AND id <> <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif checkEmail.recordCount GT 0>
                <cfset response.message = "Email address already in use by another user">
            <cfelse>
                <!--- Update personal information --->
                <cfquery datasource="#application.datasource#">
                    UPDATE dbo.admin_users
                    SET
                        full_name = <cfqueryparam value="#trim(formData.full_name)#" cfsqltype="cf_sql_varchar">,
                        email = <cfqueryparam value="#trim(formData.email)#" cfsqltype="cf_sql_varchar">,
                        updated_at = GETDATE()
                    WHERE id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
                </cfquery>

                <!--- Update session variables --->
                <cfset session.admin_full_name = trim(formData.full_name)>
                <cfset session.admin_email = trim(formData.email)>

                <cfset response.success = true>
                <cfset response.message = "Profile updated successfully">
            </cfif>
        </cfif>

        <cfcatch type="any">
            <cfset response.message = "Error updating profile: #cfcatch.message#">
        </cfcatch>
    </cftry>

<!--- CHANGE Password --->
<cfelseif url.method EQ "changePassword" AND httpMethod EQ "POST">
    <cftry>
        <!--- Get JSON body --->
        <cfset requestBody = toString(getHttpRequestData().content)>
        <cfset formData = deserializeJSON(requestBody)>

        <!--- Get current user password hash --->
        <cfquery name="getUserPassword" datasource="#application.datasource#">
            SELECT password_hash
            FROM dbo.admin_users
            WHERE id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
        </cfquery>

        <!--- Validate password fields --->
        <cfif NOT structKeyExists(formData, "current_password") OR NOT len(trim(formData.current_password))>
            <cfset response.message = "Current password is required">
        <cfelseif NOT structKeyExists(formData, "new_password") OR NOT len(trim(formData.new_password))>
            <cfset response.message = "New password is required">
        <cfelseif len(trim(formData.new_password)) LT 8>
            <cfset response.message = "New password must be at least 8 characters long">
        <cfelseif NOT REFind("[A-Z]", trim(formData.new_password))>
            <cfset response.message = "Password must contain at least one uppercase letter (A-Z)">
        <cfelseif NOT REFind("[0-9]", trim(formData.new_password))>
            <cfset response.message = "Password must contain at least one number (0-9)">
        <cfelseif NOT REFind("[^a-zA-Z0-9]", trim(formData.new_password))>
            <cfset response.message = "Password must contain at least one special character (e.g., !@##$%^&*)">
        <cfelseif NOT structKeyExists(formData, "confirm_new_password") OR formData.new_password NEQ formData.confirm_new_password>
            <cfset response.message = "New passwords do not match">
        <cfelseif trim(formData.current_password) EQ trim(formData.new_password)>
            <cfset response.message = "New password must be different from current password">
        <cfelseif hash(trim(formData.current_password), "SHA-256") NEQ getUserPassword.password_hash>
            <cfset response.message = "Current password is incorrect">
        <cfelse>
            <!--- Update password --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.admin_users
                SET
                    password_hash = <cfqueryparam value="#hash(trim(formData.new_password), 'SHA-256')#" cfsqltype="cf_sql_varchar">,
                    must_change_password = 0,
                    password_changed_at = GETDATE(),
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfset response.success = true>
            <cfset response.message = "Password changed successfully">
        </cfif>

        <cfcatch type="any">
            <cfset response.message = "Error changing password: #cfcatch.message#">
        </cfcatch>
    </cftry>

<!--- UPLOAD Profile Picture --->
<cfelseif url.method EQ "uploadProfilePicture" AND httpMethod EQ "POST">
    <cftry>
        <!--- Upload file FIRST --->
        <cffile action="upload"
                filefield="profile_picture"
                destination="#expandPath('/assets/img/profiles/')#"
                nameconflict="makeunique"
                result="uploadResult">

        <!--- Validate the uploaded file --->
        <cfset fileExt = lCase(listLast(uploadResult.serverFile, "."))>
        <cfset allowedExtensions = "jpg,jpeg,png,gif">

        <!--- Validate file extension --->
        <cfif NOT listFindNoCase(allowedExtensions, fileExt)>
            <!--- Delete invalid file --->
            <cffile action="delete" file="#uploadResult.serverDirectory#/#uploadResult.serverFile#">
            <cfset response.message = "Invalid file type. Only JPG, PNG, and GIF files are allowed">

        <!--- Validate file size (5MB = 5242880 bytes) --->
        <cfelseif uploadResult.fileSize GT 5242880>
            <!--- Delete oversized file --->
            <cffile action="delete" file="#uploadResult.serverDirectory#/#uploadResult.serverFile#">
            <cfset response.message = "File too large. Maximum file size is 5MB">

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

            <cfset response.success = true>
            <cfset response.message = "Profile picture uploaded successfully!">
            <cfset response.filename = newFileName>
        </cfif>

        <cfcatch type="any">
            <cfset response.message = "Error uploading file: #cfcatch.message#">
        </cfcatch>
    </cftry>

<!--- REMOVE Profile Picture --->
<cfelseif url.method EQ "removeProfilePicture" AND httpMethod EQ "DELETE">
    <cftry>
        <!--- Get current profile picture --->
        <cfquery name="getUserPicture" datasource="#application.datasource#">
            SELECT profile_picture
            FROM dbo.admin_users
            WHERE id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
        </cfquery>

        <!--- Delete file if exists --->
        <cfif len(getUserPicture.profile_picture) AND fileExists(expandPath("/assets/img/profiles/#getUserPicture.profile_picture#"))>
            <cffile action="delete" file="#expandPath('/assets/img/profiles/#getUserPicture.profile_picture#')#">
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

        <cfset response.success = true>
        <cfset response.message = "Profile picture removed successfully">

        <cfcatch type="any">
            <cfset response.message = "Error removing profile picture: #cfcatch.message#">
        </cfcatch>
    </cftry>

<!--- Invalid method --->
<cfelse>
    <cfset response.message = "Invalid method or HTTP verb">
</cfif>

</cfsilent>
<!--- Output JSON response --->
<cfoutput>#serializeJSON(response)#</cfoutput>
