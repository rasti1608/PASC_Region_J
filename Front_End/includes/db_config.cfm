<cfsilent>
<!---
*******************************************************************************
* File:        /includes/db_config.cfm
* Created:     October 25, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Database configuration file for PASC Region J Conference 2026
*              Contains datasource settings and database connection parameters
*              Include this file at the top of any page requiring database access
*
* Database:    Microsoft SQL Server
* Datasource:  pasc_regionj
*
* Usage:       <cfinclude template="includes/db_config.cfm">
*
* Project:     PASC Region J Conference 2026 Website
*              Lead Beyond Limits - February 13, 2026
*******************************************************************************
--->

<!--- Database connection settings --->
<cfset application.datasource = "pasc_regionj">

<!--- Query timeout in seconds --->
<cfset application.queryTimeout = 30>

<!--- Enable/disable query debugging (set to false in production) --->
<cfset application.debugQueries = false>

<!--- Optional: Database connection verification --->
<!--- Uncomment below to test connection on include
<cfquery name="qTest" datasource="#application.datasource#" maxrows="1">
    SELECT 1 AS test
</cfquery>
--->

</cfsilent>
