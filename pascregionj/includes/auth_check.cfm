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

</cfsilent>
