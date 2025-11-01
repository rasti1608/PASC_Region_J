<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/logout.cfm
* Created:     October 27, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Logout handler for admin panel
*              Destroys session and redirects to login page
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Delete session from admin_sessions table --->
<cfif structKeyExists(session, "cfid") AND structKeyExists(session, "cftoken")>
    <cftry>
        <cfquery datasource="#application.datasource#">
            DELETE FROM dbo.admin_sessions
            WHERE session_id = <cfqueryparam value="#session.cfid#_#session.cftoken#" cfsqltype="cf_sql_varchar">
        </cfquery>
        <cfcatch type="any">
            <!--- Session deletion failure should not prevent logout --->
        </cfcatch>
    </cftry>
</cfif>

<!--- Clear all session variables --->
<cfset structClear(session)>

<!--- Redirect to login page with logout message --->
<cflocation url="login.cfm?msg=logged_out" addtoken="false">

</cfsilent>
