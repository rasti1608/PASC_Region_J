<cfsilent>
<cfprocessingdirective pageencoding="utf-8">
<!---
*******************************************************************************
* File:        /admin/api/heartbeat.cfm
* Created:     November 1, 2025
* Author:      Rastislav Toscak
*
* Purpose:     Session heartbeat endpoint
*              Updates last_activity timestamp to keep session alive
*              Called by JavaScript every 30 seconds from admin pages
*
* Returns:     JSON response with status
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check if user is logged in --->
<cfif NOT structKeyExists(session, "admin_logged_in") OR NOT session.admin_logged_in>
    <cfheader statuscode="401" statustext="Unauthorized">
    <cfabort>
</cfif>

<!--- Update session timestamp --->
<cftry>
    <cfif structKeyExists(session, "unique_session_id")>
        <cfquery datasource="#application.datasource#">
            UPDATE dbo.admin_sessions
            SET last_activity = GETDATE()
            WHERE session_id = <cfqueryparam value="#session.unique_session_id#" cfsqltype="cf_sql_varchar">
        </cfquery>
    </cfif>
    <cfcatch>
        <!--- Ignore errors - don't break heartbeat --->
    </cfcatch>
</cftry>

<!--- Return success response --->
<cfheader name="Content-Type" value="application/json">
<cfoutput>{"status":"ok","timestamp":"#now()#"}</cfoutput>
</cfsilent>
