<!---
================================================================================
File: profile.cfc
Description: API endpoint for user profile management
Author: Rastislav Toscak (via Claude Code)
Date: 2025-11-17
Version: 1.0
================================================================================
--->

<cfcomponent output="false">

    <!--- Include database configuration --->
    <cfinclude template="../includes/db_config.cfm">

    <!--- ================================================================== --->
    <!--- CHECK AUTHENTICATION --->
    <!--- Helper function to verify session is valid --->
    <!--- Returns struct with {authenticated: boolean, message: string} --->
    <!--- ================================================================== --->
    <cffunction name="checkAuth" access="private" returntype="struct" output="false">
        <cfset var authResult = {}>

        <cfif NOT structKeyExists(session, "admin_logged_in") OR NOT session.admin_logged_in>
            <cfset authResult.authenticated = false>
            <cfset authResult.message = "Not authenticated. Please log in.">
            <cfreturn authResult>
        </cfif>

        <cfif NOT structKeyExists(session, "admin_user_id")>
            <cfset authResult.authenticated = false>
            <cfset authResult.message = "Session data missing. Please log in again.">
            <cfreturn authResult>
        </cfif>

        <cfset authResult.authenticated = true>
        <cfreturn authResult>
    </cffunction>

    <!--- ================================================================== --->
    <!--- GET PROFILE --->
    <!--- Returns current user profile data --->
    <!--- ================================================================== --->
    <cffunction name="getProfile" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var getUserProfile = "">
        <cfset var authCheck = checkAuth()>

        <!--- Check authentication --->
        <cfif NOT authCheck.authenticated>
            <cfset result = {
                "success" = false,
                "message" = authCheck.message
            }>
            <cfreturn serializeJSON(result)>
        </cfif>

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
                <cfset result = {
                    "success" = false,
                    "message" = "User not found"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfset result = {
                "success" = true,
                "data" = {
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
                }
            }>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "message" = "Error loading profile: #cfcatch.message#"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- UPDATE PROFILE --->
    <!--- Updates user's name and email --->
    <!--- ================================================================== --->
    <cffunction name="updateProfile" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var checkEmail = "">
        <cfset var authCheck = checkAuth()>
        <cfset var requestBody = "">
        <cfset var formData = {}>

        <!--- Check authentication --->
        <cfif NOT authCheck.authenticated>
            <cfset result = {
                "success" = false,
                "message" = authCheck.message
            }>
            <cfreturn serializeJSON(result)>
        </cfif>

        <cftry>
            <!--- Get JSON body --->
            <cfset requestBody = toString(getHttpRequestData().content)>
            <cfset formData = deserializeJSON(requestBody)>

            <!--- Validate required fields --->
            <cfif NOT structKeyExists(formData, "full_name") OR NOT len(trim(formData.full_name))>
                <cfset result = {
                    "success" = false,
                    "message" = "Full name is required"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif NOT structKeyExists(formData, "email") OR NOT len(trim(formData.email))>
                <cfset result = {
                    "success" = false,
                    "message" = "Email is required"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif NOT isValid("email", trim(formData.email))>
                <cfset result = {
                    "success" = false,
                    "message" = "Please enter a valid email address"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Check if email already exists (for another user) --->
            <cfquery name="checkEmail" datasource="#application.datasource#">
                SELECT id
                FROM dbo.admin_users
                WHERE email = <cfqueryparam value="#trim(formData.email)#" cfsqltype="cf_sql_varchar">
                AND id <> <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif checkEmail.recordCount GT 0>
                <cfset result = {
                    "success" = false,
                    "message" = "Email address already in use by another user"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

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

            <cfset result = {
                "success" = true,
                "message" = "Profile updated successfully"
            }>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "message" = "Error updating profile: #cfcatch.message#"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- UPDATE PASSWORD --->
    <!--- Changes user's password with validation --->
    <!--- ================================================================== --->
    <cffunction name="updatePassword" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var getUserPassword = "">
        <cfset var authCheck = checkAuth()>
        <cfset var requestBody = "">
        <cfset var formData = {}>

        <!--- Check authentication --->
        <cfif NOT authCheck.authenticated>
            <cfset result = {
                "success" = false,
                "message" = authCheck.message
            }>
            <cfreturn serializeJSON(result)>
        </cfif>

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
                <cfset result = {
                    "success" = false,
                    "message" = "Current password is required"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif NOT structKeyExists(formData, "new_password") OR NOT len(trim(formData.new_password))>
                <cfset result = {
                    "success" = false,
                    "message" = "New password is required"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif len(trim(formData.new_password)) LT 8>
                <cfset result = {
                    "success" = false,
                    "message" = "New password must be at least 8 characters long"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif NOT REFind("[A-Z]", trim(formData.new_password))>
                <cfset result = {
                    "success" = false,
                    "message" = "Password must contain at least one uppercase letter (A-Z)"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif NOT REFind("[0-9]", trim(formData.new_password))>
                <cfset result = {
                    "success" = false,
                    "message" = "Password must contain at least one number (0-9)"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif NOT REFind("[^a-zA-Z0-9]", trim(formData.new_password))>
                <cfset result = {
                    "success" = false,
                    "message" = "Password must contain at least one special character (e.g., !@##$%^&*)"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif NOT structKeyExists(formData, "confirm_new_password") OR formData.new_password NEQ formData.confirm_new_password>
                <cfset result = {
                    "success" = false,
                    "message" = "New passwords do not match"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif trim(formData.current_password) EQ trim(formData.new_password)>
                <cfset result = {
                    "success" = false,
                    "message" = "New password must be different from current password"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif hash(trim(formData.current_password), "SHA-256") NEQ getUserPassword.password_hash>
                <cfset result = {
                    "success" = false,
                    "message" = "Current password is incorrect"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

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

            <cfset result = {
                "success" = true,
                "message" = "Password changed successfully"
            }>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "message" = "Error changing password: #cfcatch.message#"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- UPLOAD PROFILE PICTURE --->
    <!--- Uploads and saves user profile picture --->
    <!--- ================================================================== --->
    <cffunction name="uploadProfilePicture" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var uploadResult = "">
        <cfset var fileExt = "">
        <cfset var authCheck = checkAuth()>

        <!--- Check authentication --->
        <cfif NOT authCheck.authenticated>
            <cfset result = {
                "success" = false,
                "message" = authCheck.message
            }>
            <cfreturn serializeJSON(result)>
        </cfif>

        <cftry>
            <!--- Upload file FIRST --->
            <cffile action="upload"
                    filefield="profile_picture"
                    destination="#expandPath('/assets/img/profiles/')#"
                    nameconflict="makeunique"
                    result="uploadResult">

            <!--- Validate the uploaded file --->
            <cfset fileExt = lCase(listLast(uploadResult.serverFile, "."))>
            <cfset var allowedExtensions = "jpg,jpeg,png,gif">

            <!--- Validate file extension --->
            <cfif NOT listFindNoCase(allowedExtensions, fileExt)>
                <!--- Delete invalid file --->
                <cffile action="delete" file="#uploadResult.serverDirectory#/#uploadResult.serverFile#">
                <cfset result = {
                    "success" = false,
                    "message" = "Invalid file type. Only JPG, PNG, and GIF files are allowed"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Validate file size (5MB = 5242880 bytes) --->
            <cfif uploadResult.fileSize GT 5242880>
                <!--- Delete oversized file --->
                <cffile action="delete" file="#uploadResult.serverDirectory#/#uploadResult.serverFile#">
                <cfset result = {
                    "success" = false,
                    "message" = "File too large. Maximum file size is 5MB"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Rename file to user_id.jpg --->
            <cfset var newFileName = "#session.admin_user_id#.jpg">
            <cfset var newFilePath = "#expandPath('/assets/img/profiles/')##newFileName#">

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

            <cfset result = {
                "success" = true,
                "message" = "Profile picture uploaded successfully!",
                "filename" = newFileName
            }>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "message" = "Error uploading file: #cfcatch.message#"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- REMOVE PROFILE PICTURE --->
    <!--- Deletes user's profile picture --->
    <!--- ================================================================== --->
    <cffunction name="removeProfilePicture" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var getUserPicture = "">
        <cfset var authCheck = checkAuth()>

        <!--- Check authentication --->
        <cfif NOT authCheck.authenticated>
            <cfset result = {
                "success" = false,
                "message" = authCheck.message
            }>
            <cfreturn serializeJSON(result)>
        </cfif>

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

            <cfset result = {
                "success" = true,
                "message" = "Profile picture removed successfully"
            }>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "message" = "Error removing profile picture: #cfcatch.message#"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

</cfcomponent>
