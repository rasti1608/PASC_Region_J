<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin_api/auth_api.cfm
* Created:     November 17, 2025
* Author:      Rastislav Toscak (via Claude Code)
*
* Purpose:     REST API for Angular authentication
*
* Methods:     - POST ?method=login - Authenticate user and create session
*              - POST ?method=logout - Destroy session and log out
*              - GET  ?method=checkAuth - Check current authentication status
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Disable secure JSON prefix for API responses --->
<cfsetting enablecfoutputonly="true" showdebugoutput="false">

<!--- Set JSON content type --->
<cfcontent type="application/json" reset="true">

<!--- Include database configuration --->
<cfinclude template="../includes/db_config.cfm">

<!--- Get request method --->
<cfparam name="url.method" default="">
<cfset httpMethod = cgi.request_method>

<!--- Initialize response structure --->
<cfset response = structNew()>
<cfset response.success = false>

<!--- LOGIN Method --->
<cfif url.method EQ "login" AND httpMethod EQ "POST">
    <cftry>
        <!--- Get JSON body with better error handling --->
        <cfset requestBody = toString(getHttpRequestData().content)>

        <!--- Try to parse JSON, handle special characters --->
        <cftry>
            <cfset credentials = deserializeJSON(requestBody, false)>
            <cfcatch type="any">
                <!--- If deserialize fails, return error --->
                <cfset response.message = "Invalid JSON format in request">
                <cfset credentials = structNew()>
            </cfcatch>
        </cftry>

        <!--- Validate required fields --->
        <cfif NOT structKeyExists(credentials, "username") OR NOT len(trim(credentials.username))>
            <cfset response.message = "Username is required">
        <cfelseif NOT structKeyExists(credentials, "password") OR NOT len(trim(credentials.password))>
            <cfset response.message = "Password is required">
        <cfelse>
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
                <cfset response.message = "Invalid username or password">
            <cfelseif NOT qUser.is_active>
                <cfset response.message = "This account has been deactivated. Please contact the administrator.">
            <cfelse>
                <!--- Check password (SHA-256 hashed) --->
                <cfif hash(credentials.password, "SHA-256") EQ qUser.password_hash>
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

                    <!--- Load user permissions (required for CF admin compatibility) --->
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
                    <cfset response.success = true>
                    <cfset response.message = "Login successful">
                    <cfset response.user = {
                        "id" = qUser.id,
                        "username" = qUser.username,
                        "full_name" = qUser.full_name,
                        "email" = qUser.email,
                        "role_id" = qUser.role_id,
                        "role_name" = qUser.role_name,
                        "is_active" = qUser.is_active,
                        "profile_picture" = qUser.profile_picture
                    }>
                <cfelse>
                    <!--- Wrong password --->
                    <cfset response.message = "Invalid username or password">
                </cfif>
            </cfif>
        </cfif>

        <cfcatch type="any">
            <cfset response.message = "Login error: #cfcatch.message#">
        </cfcatch>
    </cftry>

<!--- LOGOUT Method --->
<cfelseif url.method EQ "logout" AND httpMethod EQ "POST">
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

        <cfset response.success = true>
        <cfset response.message = "Logout successful">

        <cfcatch type="any">
            <!--- Even if error occurs, try to clear session --->
            <cfset structClear(session)>
            <cfset response.success = true>
            <cfset response.message = "Logout completed">
        </cfcatch>
    </cftry>

<!--- CHECK AUTH Method --->
<cfelseif url.method EQ "checkAuth" AND httpMethod EQ "GET">
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
                <cfset response.success = true>
                <cfset response.authenticated = true>
                <cfset response.user = {
                    "id" = qUser.id,
                    "username" = qUser.username,
                    "full_name" = qUser.full_name,
                    "email" = qUser.email,
                    "role_id" = qUser.role_id,
                    "role_name" = qUser.role_name,
                    "is_active" = qUser.is_active,
                    "profile_picture" = qUser.profile_picture
                }>

                <!--- Ensure permissions are set (for CF admin compatibility) --->
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
                <cfset response.success = true>
                <cfset response.authenticated = false>
                <cfset response.message = "Session expired">
            </cfif>
        <cfelse>
            <!--- Not logged in --->
            <cfset response.success = true>
            <cfset response.authenticated = false>
            <cfset response.message = "Not authenticated">
        </cfif>

        <cfcatch type="any">
            <cfset response.success = false>
            <cfset response.authenticated = false>
            <cfset response.message = "Auth check error: #cfcatch.message#">
        </cfcatch>
    </cftry>

<!--- Invalid method --->
<cfelse>
    <cfset response.message = "Invalid method or HTTP verb">
</cfif>

</cfsilent>
<!--- Output JSON response --->
<cfoutput>#serializeJSON(response)#</cfoutput>
