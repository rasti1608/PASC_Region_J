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

<!--- Clear all session variables --->
<cfset structClear(session)>

<!--- Redirect to login page with logout message --->
<cflocation url="login.cfm?msg=logged_out" addtoken="false">

</cfsilent>
