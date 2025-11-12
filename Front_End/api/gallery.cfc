<!---
================================================================================
File: gallery.cfc
Description: API endpoint for gallery images with pagination
Author: Auto-generated for Angular migration
Date: 2025-11-11
Version: 1.0
================================================================================
--->

<cfcomponent output="false">

    <!--- ================================================================== --->
    <!--- GET IMAGES --->
    <!--- Returns paginated gallery images for a specific page location --->
    <!--- Parameters:
         - location: 'gallery' or 'about_page' (default: 'gallery')
         - page: page number for pagination (default: 1)
         - limit: images per page (default: 9)
    --->
    <!--- ================================================================== --->
    <cffunction name="getImages" access="remote" returnformat="json" returntype="any" output="false">
        <cfargument name="location" type="string" default="gallery" required="false">
        <cfargument name="page" type="numeric" default="1" required="false">
        <cfargument name="limit" type="numeric" default="9" required="false">

        <cfset var result = {}>
        <cfset var qImages = "">

        <cftry>
            <!--- Calculate offset for pagination --->
            <cfset var offset = (arguments.page - 1) * arguments.limit>

            <!--- Query gallery images with pagination --->
            <cfquery name="qImages" datasource="pasc_regionj">
                SELECT
                    id,
                    title,
                    filename,
                    file_extension,
                    display_order
                FROM dbo.gallery
                WHERE page_location = <cfqueryparam value="#arguments.location#" cfsqltype="cf_sql_varchar">
                    AND is_active = 1
                ORDER BY display_order ASC
                OFFSET #offset# ROWS
                FETCH NEXT #arguments.limit# ROWS ONLY
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var images = []>

            <cfloop query="qImages">
                <cfset var image = {
                    "id" = qImages.id,
                    "title" = qImages.title,
                    "filename" = qImages.filename,
                    "fileExtension" = qImages.file_extension,
                    "displayOrder" = qImages.display_order,
                    "fullPath" = "/assets/img/gallery/" & qImages.filename
                }>
                <cfset arrayAppend(images, image)>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = images,
                "count" = arrayLen(images),
                "page" = arguments.page,
                "limit" = arguments.limit,
                "location" = arguments.location,
                "message" = "Gallery images retrieved successfully"
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

        <cfreturn result>
    </cffunction>


    <!--- ================================================================== --->
    <!--- GET COUNT --->
    <!--- Returns total count of images for a specific location --->
    <!--- Used for pagination calculations --->
    <!--- Parameters:
         - location: 'gallery' or 'about_page' (default: 'gallery')
    --->
    <!--- ================================================================== --->
    <cffunction name="getCount" access="remote" returnformat="json" returntype="any" output="false">
        <cfargument name="location" type="string" default="gallery" required="false">

        <cfset var result = {}>
        <cfset var qCount = "">

        <cftry>
            <!--- Query total count of gallery images --->
            <cfquery name="qCount" datasource="pasc_regionj">
                SELECT COUNT(*) AS totalCount
                FROM dbo.gallery
                WHERE page_location = <cfqueryparam value="#arguments.location#" cfsqltype="cf_sql_varchar">
                    AND is_active = 1
            </cfquery>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "totalCount" = qCount.totalCount,
                "location" = arguments.location,
                "message" = "Count retrieved successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "totalCount" = 0,
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn result>
    </cffunction>

</cfcomponent>
