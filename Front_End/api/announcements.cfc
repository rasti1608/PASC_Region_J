<!---
================================================================================
File: announcements.cfc
Description: API endpoint for announcements data
Author: Auto-generated for Angular migration
Date: 2025-11-11
Version: 1.0
================================================================================
--->

<cfcomponent output="false">

    <!--- ================================================================== --->
    <!--- GET ANNOUNCEMENTS --->
    <!--- Returns all active announcements filtered by publish dates --->
    <!--- ================================================================== --->
    <cffunction name="getAnnouncements" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qAnnouncements = "">

        <cftry>
            <!--- Query active announcements --->
            <cfquery name="qAnnouncements" datasource="pasc_regionj">
                SELECT
                    id,
                    title,
                    content,
                    publish_start,
                    publish_end,
                    is_featured,
                    display_order
                FROM dbo.announcements
                WHERE is_active = 1
                    AND publish_start <= GETDATE()
                    AND (publish_end IS NULL OR publish_end >= GETDATE())
                ORDER BY display_order ASC
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var announcements = []>

            <cfloop query="qAnnouncements">
                <cfset var announcement = {
                    "id" = qAnnouncements.id,
                    "title" = qAnnouncements.title,
                    "content" = qAnnouncements.content,
                    "publishStart" = dateFormat(qAnnouncements.publish_start, "yyyy-mm-dd"),
                    "publishEnd" = isNull(qAnnouncements.publish_end) ? javaCast("null", "") : dateFormat(qAnnouncements.publish_end, "yyyy-mm-dd"),
                    "isFeatured" = qAnnouncements.is_featured,
                    "displayOrder" = qAnnouncements.display_order
                }>
                <cfset arrayAppend(announcements, announcement)>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = announcements,
                "count" = arrayLen(announcements),
                "message" = "Announcements retrieved successfully"
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
