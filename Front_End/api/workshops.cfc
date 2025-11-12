<!---
================================================================================
File: workshops.cfc
Description: API endpoint for workshop forms (embedded Google Forms, etc.)
Author: Auto-generated for Angular migration
Date: 2025-11-11
Version: 1.0
================================================================================
--->

<cfcomponent output="false">

    <!--- ================================================================== --->
    <!--- GET FORMS --->
    <!--- Returns all active forms for a specific page location --->
    <!--- Parameters:
         - location: page location filter (default: 'Workshops')
    --->
    <!--- ================================================================== --->
    <cffunction name="getForms" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="location" type="string" default="Workshops" required="false">

        <cfset var result = {}>
        <cfset var qForms = "">

        <cftry>
            <!--- Query active forms --->
            <cfquery name="qForms" datasource="pasc_regionj">
                SELECT
                    id,
                    form_name,
                    form_description,
                    embed_code,
                    display_order
                FROM dbo.forms
                WHERE is_active = 1
                    AND page_location = <cfqueryparam value="#arguments.location#" cfsqltype="cf_sql_varchar">
                ORDER BY display_order ASC
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var forms = []>

            <cfloop query="qForms">
                <cfset var form = {
                    "id" = qForms.id,
                    "formName" = qForms.form_name,
                    "formDescription" = qForms.form_description,
                    "embedCode" = qForms.embed_code,
                    "displayOrder" = qForms.display_order
                }>
                <cfset arrayAppend(forms, form)>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = forms,
                "count" = arrayLen(forms),
                "location" = arguments.location,
                "message" = "Forms retrieved successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = [],
                    "count" = 0,
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

</cfcomponent>
