<!---
================================================================================
File: auth.cfc
Description: API endpoint for authentication (login, logout, session checks)
Author: Rastislav Toscak (via Claude Code)
Date: 2025-11-17
Version: 1.0
================================================================================
--->

<cfcomponent output="false">

    <!--- Include database configuration --->
    <cfinclude template="../includes/db_config.cfm">

    <!--- ================================================================== --->
    <!--- LOGIN --->
    <!--- Authenticates user and creates session --->
    <!--- ================================================================== --->
    <cffunction name="login" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qUser = "">
        <cfset var getUserPermissions = "">
        <cfset var requestBody = "">
        <cfset var credentials = {}>

        <cftry>
            <!--- Get JSON body --->
            <cfset requestBody = toString(getHttpRequestData().content)>

            <!--- Parse JSON --->
            <cftry>
                <cfset credentials = deserializeJSON(requestBody, false)>
                <cfcatch type="any">
                    <cfset result = {
                        "success" = false,
                        "message" = "Invalid JSON format in request"
                    }>
                    <cfreturn serializeJSON(result)>
                </cfcatch>
            </cftry>

            <!--- Validate required fields --->
            <cfif NOT structKeyExists(credentials, "username") OR NOT len(trim(credentials.username))>
                <cfset result = {
                    "success" = false,
                    "message" = "Username is required"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif NOT structKeyExists(credentials, "password") OR NOT len(trim(credentials.password))>
                <cfset result = {
                    "success" = false,
                    "message" = "Password is required"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Query user from database --->
            <cfquery name="qUser" datasource="#application.datasource#">
                SELECT
                    u.id,
                    u.username,
                    u.password_hash,
                    u.email,
                    u.full_name,
                    u.is_active,
                    u.role_id,
                    u.profile_picture,
                    r.role_name
                FROM dbo.admin_users u
                LEFT JOIN dbo.roles r ON u.role_id = r.id
                WHERE u.username = <cfqueryparam value="#trim(credentials.username)#" cfsqltype="cf_sql_varchar">
            </cfquery>

            <cfif qUser.recordCount EQ 0>
                <cfset result = {
                    "success" = false,
                    "message" = "Invalid username or password"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif NOT qUser.is_active>
                <cfset result = {
                    "success" = false,
                    "message" = "This account has been deactivated. Please contact the administrator."
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Check password (SHA-256 hashed) --->
            <cfif hash(credentials.password, "SHA-256") NEQ qUser.password_hash>
                <cfset result = {
                    "success" = false,
                    "message" = "Invalid username or password"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Password correct - update last login --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.admin_users
                SET last_login = GETDATE()
                WHERE id = <cfqueryparam value="#qUser.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Set session variables --->
            <cfset session.admin_logged_in = true>
            <cfset session.admin_user_id = qUser.id>
            <cfset session.admin_username = qUser.username>
            <cfset session.admin_full_name = qUser.full_name>
            <cfset session.admin_email = qUser.email>
            <cfset session.role_id = qUser.role_id>
            <cfset session.role_name = qUser.role_name>
            <cfset session.profile_picture = qUser.profile_picture>

            <!--- Load user permissions --->
            <cfquery name="getUserPermissions" datasource="#application.datasource#">
                SELECT p.permission_name
                FROM dbo.role_permissions rp
                INNER JOIN dbo.permissions p ON rp.permission_id = p.id
                WHERE rp.role_id = <cfqueryparam value="#qUser.role_id#" cfsqltype="cf_sql_integer">
            </cfquery>
            <cfset session.permissions = ValueList(getUserPermissions.permission_name)>

            <!--- Create unique session ID --->
            <cfset session.unique_session_id = createUUID()>

            <!--- Insert session tracking --->
            <cftry>
                <cfquery datasource="#application.datasource#">
                    INSERT INTO dbo.admin_sessions (user_id, session_id, last_activity, created_at)
                    VALUES (
                        <cfqueryparam value="#qUser.id#" cfsqltype="cf_sql_integer">,
                        <cfqueryparam value="#session.unique_session_id#" cfsqltype="cf_sql_varchar">,
                        GETDATE(),
                        GETDATE()
                    )
                </cfquery>
                <cfcatch type="any">
                    <!--- Session tracking failure should not prevent login --->
                </cfcatch>
            </cftry>

            <!--- Return success with user data --->
            <cfset result = {
                "success" = true,
                "message" = "Login successful",
                "user" = {
                    "id" = qUser.id,
                    "username" = qUser.username,
                    "full_name" = qUser.full_name,
                    "email" = qUser.email,
                    "role_id" = qUser.role_id,
                    "role_name" = qUser.role_name,
                    "is_active" = qUser.is_active,
                    "profile_picture" = qUser.profile_picture
                }
            }>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "message" = "Login error: #cfcatch.message#"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- LOGOUT --->
    <!--- Destroys session and logs out user --->
    <!--- ================================================================== --->
    <cffunction name="logout" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>

        <cftry>
            <!--- Delete session tracking record if exists --->
            <cfif structKeyExists(session, "unique_session_id")>
                <cftry>
                    <cfquery datasource="#application.datasource#">
                        DELETE FROM dbo.admin_sessions
                        WHERE session_id = <cfqueryparam value="#session.unique_session_id#" cfsqltype="cf_sql_varchar">
                    </cfquery>
                    <cfcatch type="any">
                        <!--- Session tracking cleanup failure should not prevent logout --->
                    </cfcatch>
                </cftry>
            </cfif>

            <!--- Clear all session variables --->
            <cfset structClear(session)>

            <cfset result = {
                "success" = true,
                "message" = "Logout successful"
            }>

            <cfcatch type="any">
                <!--- Even if error occurs, try to clear session --->
                <cfset structClear(session)>
                <cfset result = {
                    "success" = true,
                    "message" = "Logout completed"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- CHECK AUTH --->
    <!--- Verifies if user is logged in and returns user data --->
    <!--- ================================================================== --->
    <cffunction name="checkAuth" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qUser = "">
        <cfset var getUserPermissions = "">

        <cftry>
            <!--- Check if user is logged in --->
            <cfif structKeyExists(session, "admin_logged_in") AND session.admin_logged_in
                  AND structKeyExists(session, "admin_user_id")>

                <!--- Verify user still exists and is active --->
                <cfquery name="qUser" datasource="#application.datasource#">
                    SELECT
                        u.id,
                        u.username,
                        u.email,
                        u.full_name,
                        u.is_active,
                        u.role_id,
                        u.profile_picture,
                        r.role_name
                    FROM dbo.admin_users u
                    LEFT JOIN dbo.roles r ON u.role_id = r.id
                    WHERE u.id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
                    AND u.is_active = 1
                </cfquery>

                <cfif qUser.recordCount GT 0>
                    <!--- User authenticated and active --->
                    <cfset result = {
                        "success" = true,
                        "authenticated" = true,
                        "user" = {
                            "id" = qUser.id,
                            "username" = qUser.username,
                            "full_name" = qUser.full_name,
                            "email" = qUser.email,
                            "role_id" = qUser.role_id,
                            "role_name" = qUser.role_name,
                            "is_active" = qUser.is_active,
                            "profile_picture" = qUser.profile_picture
                        }
                    }>

                    <!--- Ensure permissions are set --->
                    <cfif NOT structKeyExists(session, "permissions")>
                        <cfquery name="getUserPermissions" datasource="#application.datasource#">
                            SELECT p.permission_name
                            FROM dbo.role_permissions rp
                            INNER JOIN dbo.permissions p ON rp.permission_id = p.id
                            WHERE rp.role_id = <cfqueryparam value="#qUser.role_id#" cfsqltype="cf_sql_integer">
                        </cfquery>
                        <cfset session.permissions = ValueList(getUserPermissions.permission_name)>
                    </cfif>

                    <!--- Update session tracking --->
                    <cfif structKeyExists(session, "unique_session_id")>
                        <cftry>
                            <cfquery datasource="#application.datasource#">
                                UPDATE dbo.admin_sessions
                                SET last_activity = GETDATE()
                                WHERE session_id = <cfqueryparam value="#session.unique_session_id#" cfsqltype="cf_sql_varchar">
                            </cfquery>
                            <cfcatch type="any">
                                <!--- Session tracking update failure should not break auth check --->
                            </cfcatch>
                        </cftry>
                    </cfif>
                <cfelse>
                    <!--- User no longer exists or is inactive --->
                    <cfset structClear(session)>
                    <cfset result = {
                        "success" = true,
                        "authenticated" = false,
                        "message" = "Session expired"
                    }>
                </cfif>
            <cfelse>
                <!--- Not logged in --->
                <cfset result = {
                    "success" = true,
                    "authenticated" = false,
                    "message" = "Not authenticated"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "authenticated" = false,
                    "message" = "Auth check error: #cfcatch.message#"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

</cfcomponent>
