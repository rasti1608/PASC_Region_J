<cfsilent>
<!---
*******************************************************************************
* File:        /admin/includes/auth_check.cfm
* Created:     October 27, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Authentication check for admin pages
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

<!--- Store user info in request scope for use in pages --->
<cfset request.admin_user_id = session.admin_user_id>
<cfset request.admin_username = session.admin_username>
<cfset request.admin_full_name = session.admin_full_name>

<!--- Load user's role and permissions into session --->
<cfquery name="getUserRole" datasource="#application.datasource#">
    SELECT
        u.id,
        u.username,
        u.full_name,
        u.email,
        u.role_id,
        u.must_change_password,
        u.profile_picture,
        r.role_name
    FROM dbo.admin_users u
    LEFT JOIN dbo.roles r ON u.role_id = r.id
    WHERE u.id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
    AND u.is_active = 1
</cfquery>

<cfif getUserRole.recordCount EQ 0>
    <!--- User no longer exists or is inactive - log out --->
    <cfset structClear(session)>
    <cflocation url="/admin/login.cfm?msg=session_expired" addtoken="false">
    <cfabort>
</cfif>

<!--- Store role info in session (only if not already set or changed) --->
<cfif NOT structKeyExists(session, "role_id") OR session.role_id NEQ getUserRole.role_id>
    <cfset session.role_id = getUserRole.role_id>
    <cfset session.role_name = getUserRole.role_name>
    <cfset session.admin_full_name = getUserRole.full_name>
    <cfset session.admin_email = getUserRole.email>
    <cfset session.profile_picture = getUserRole.profile_picture>

    <!--- Load permissions for this role --->
    <cfquery name="getUserPermissions" datasource="#application.datasource#">
        SELECT p.permission_name
        FROM dbo.role_permissions rp
        INNER JOIN dbo.permissions p ON rp.permission_id = p.id
        WHERE rp.role_id = <cfqueryparam value="#session.role_id#" cfsqltype="cf_sql_integer">
    </cfquery>

    <cfset session.permissions = ValueList(getUserPermissions.permission_name)>
</cfif>

<!--- Update request scope with latest session data --->
<cfset request.admin_full_name = session.admin_full_name>

<!--- Check if user must change password --->
<cfif getUserRole.must_change_password EQ 1>
    <!--- Allow only change-password-required.cfm and logout.cfm --->
    <cfset currentPage = GetFileFromPath(GetCurrentTemplatePath())>
    <cfif currentPage NEQ "change-password-required.cfm" AND currentPage NEQ "logout.cfm">
        <cflocation url="/admin/change-password-required.cfm" addtoken="false">
        <cfabort>
    </cfif>
</cfif>

<!--- Update session tracking --->
<cftry>
    <cfquery datasource="#application.datasource#">
        MERGE INTO dbo.admin_sessions AS target
        USING (SELECT
            <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer"> AS user_id,
            <cfqueryparam value="#session.cfid#_#session.cftoken#" cfsqltype="cf_sql_varchar"> AS session_id
        ) AS source
        ON target.session_id = source.session_id
        WHEN MATCHED THEN
            UPDATE SET last_activity = GETDATE()
        WHEN NOT MATCHED THEN
            INSERT (user_id, session_id, last_activity, created_at)
            VALUES (source.user_id, source.session_id, GETDATE(), GETDATE());
    </cfquery>
    <cfcatch type="any">
        <!--- Session tracking failure should not break the page --->
    </cfcatch>
</cftry>

    <cfcatch type="any">
        <!--- Log session tracking errors for debugging --->
        <cflog file="auth_check" type="error"
               text="Session tracking error: #cfcatch.message# - #cfcatch.detail# - User: #session.admin_user_id#">
    </cfcatch>
</cftry>

<!--- Clean up expired sessions (run randomly ~1% of page loads to avoid overhead) --->
<cfif randRange(1, 100) EQ 1>
    <cftry>
        <cfquery datasource="#application.datasource#">
            DELETE FROM dbo.admin_sessions
            WHERE last_activity < DATEADD(MINUTE, -60, GETDATE())
        </cfquery>
        <cfcatch type="any">
            <!--- Cleanup failure should not break the page --->
        </cfcatch>
    </cftry>
</cfif>

</cfsilent>
