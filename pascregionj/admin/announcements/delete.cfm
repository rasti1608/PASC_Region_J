<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/announcements/delete.cfm
* Created:     October 27, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Delete announcement
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Get announcement ID --->
<cfif NOT structKeyExists(url, "id") OR NOT isNumeric(url.id)>
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Get the display_order of the announcement being deleted --->
<cfquery name="qDeleting" datasource="#application.datasource#">
    SELECT display_order FROM dbo.announcements
    WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
</cfquery>

<!--- Delete the announcement --->
<cftry>
    <cfquery datasource="#application.datasource#">
        DELETE FROM dbo.announcements
        WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
    </cfquery>
    
    <!--- If deletion successful, shift all announcements after it up by 1 to close the gap --->
    <cfif qDeleting.recordCount GT 0>
        <cfquery datasource="#application.datasource#">
            UPDATE dbo.announcements
            SET display_order = display_order - 1
            WHERE display_order > <cfqueryparam value="#qDeleting.display_order#" cfsqltype="cf_sql_integer">
        </cfquery>
    </cfif>
    
    <cfcatch>
        <!--- If deletion fails, redirect with error --->
    </cfcatch>
</cftry>

<!--- Redirect back to list --->
<cflocation url="index.cfm" addtoken="false">

</cfsilent>
