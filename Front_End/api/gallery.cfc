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
    <cffunction name="getImages" access="remote" returntype="String" output="false" returnformat="json">
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
                <cfset var image = {}>
                <cfset image["id"] = qImages.id>
                <cfset image["title"] = qImages.title>
                <cfset image["filename"] = qImages.filename>
                <cfset image["fileExtension"] = qImages.file_extension>
                <cfset image["displayOrder"] = qImages.display_order>
                <cfset image["fullPath"] = "/assets/img/Gallery/" & qImages.filename>
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

        <cfreturn serializeJSON(result)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- GET COUNT --->
    <!--- Returns total count of images for a specific location --->
    <!--- Used for pagination calculations --->
    <!--- Parameters:
         - location: 'gallery' or 'about_page' (default: 'gallery')
    --->
    <!--- ================================================================== --->
    <cffunction name="getCount" access="remote" returntype="String" output="false" returnformat="json">
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

        <cfreturn serializeJSON(result)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- GET IMAGES ADMIN --->
    <!--- Returns ALL images for admin panel (active and inactive) --->
    <!--- Parameters:
         - location: 'gallery' or 'about_page' (default: 'gallery')
    --->
    <!--- ================================================================== --->
    <cffunction name="getImagesAdmin" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="location" type="string" default="gallery" required="false">

        <cfset var result = {}>
        <cfset var qImages = "">

        <cftry>
            <!--- Query ALL gallery images for admin --->
            <cfquery name="qImages" datasource="pasc_regionj">
                SELECT
                    id,
                    title,
                    filename,
                    original_filename,
                    file_extension,
                    file_size,
                    is_active,
                    page_location,
                    display_order,
                    uploaded_at,
                    updated_at
                FROM dbo.gallery
                WHERE page_location = <cfqueryparam value="#arguments.location#" cfsqltype="cf_sql_varchar">
                ORDER BY display_order ASC, uploaded_at DESC
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var images = []>

            <cfloop query="qImages">
                <cfset var image = {
                    "id" = qImages.id,
                    "title" = qImages.title,
                    "filename" = qImages.filename,
                    "original_filename" = qImages.original_filename,
                    "file_extension" = qImages.file_extension,
                    "file_size" = qImages.file_size,
                    "is_active" = qImages.is_active,
                    "page_location" = qImages.page_location,
                    "display_order" = qImages.display_order,
                    "uploaded_at" = dateFormat(qImages.uploaded_at, "yyyy-mm-dd") & " " & timeFormat(qImages.uploaded_at, "HH:mm:ss"),
                    "updated_at" = dateFormat(qImages.updated_at, "yyyy-mm-dd") & " " & timeFormat(qImages.updated_at, "HH:mm:ss")
                }>
                <cfset arrayAppend(images, image)>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = images,
                "message" = "Gallery images retrieved successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = [],
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail,
                    "message" = "Error retrieving gallery images"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- GET IMAGE --->
    <!--- Returns single image by ID for admin --->
    <!--- ================================================================== --->
    <cffunction name="getImage" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>
        <cfset var qImage = "">

        <cftry>
            <cfquery name="qImage" datasource="pasc_regionj">
                SELECT
                    id,
                    title,
                    filename,
                    original_filename,
                    file_extension,
                    file_size,
                    is_active,
                    page_location,
                    display_order,
                    uploaded_at,
                    updated_at
                FROM dbo.gallery
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif qImage.recordCount GT 0>
                <cfset var image = {
                    "id" = qImage.id,
                    "title" = qImage.title,
                    "filename" = qImage.filename,
                    "original_filename" = qImage.original_filename,
                    "file_extension" = qImage.file_extension,
                    "file_size" = qImage.file_size,
                    "is_active" = qImage.is_active,
                    "page_location" = qImage.page_location,
                    "display_order" = qImage.display_order,
                    "uploaded_at" = dateFormat(qImage.uploaded_at, "yyyy-mm-dd") & " " & timeFormat(qImage.uploaded_at, "HH:mm:ss"),
                    "updated_at" = dateFormat(qImage.updated_at, "yyyy-mm-dd") & " " & timeFormat(qImage.updated_at, "HH:mm:ss")
                }>

                <cfset result = {
                    "success" = true,
                    "data" = image,
                    "message" = "Image retrieved successfully"
                }>
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "data" = {},
                    "message" = "Image not found"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "data" = {},
                    "error" = cfcatch.message,
                    "message" = "Error retrieving image"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- TOGGLE ACTIVE --->
    <!--- Toggle is_active status for an image --->
    <!--- ================================================================== --->
    <cffunction name="toggleActive" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>

        <cftry>
            <!--- Toggle the active status --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.gallery
                SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Get the updated image --->
            <cfset var getImageResult = deserializeJSON(getImage(arguments.id))>

            <cfif getImageResult.success>
                <cfset result = getImageResult>
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "message" = "Error retrieving updated image"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error toggling image status"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- UPLOAD IMAGE --->
    <!--- Upload a new image with metadata --->
    <!--- ================================================================== --->
    <cffunction name="uploadImage" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="title" type="string" required="true">
        <cfargument name="page_location" type="string" required="true">
        <cfargument name="is_active" type="boolean" default="true" required="false">

        <cfset var result = {}>
        <cfset var uploadDir = expandPath("/assets/img/gallery/")>
        <cfset var fileData = "">
        <cfset var newFileName = "">
        <cfset var newImageId = 0>

        <cftry>
            <!--- Ensure upload directory exists --->
            <cfif NOT directoryExists(uploadDir)>
                <cfdirectory action="create" directory="#uploadDir#">
            </cfif>

            <!--- Handle file upload --->
            <cffile action="upload"
                    fileField="image_file"
                    destination="#uploadDir#"
                    nameConflict="makeunique"
                    result="fileData"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp">

            <!--- Get next display order --->
            <cfquery name="qMaxOrder" datasource="pasc_regionj">
                SELECT ISNULL(MAX(display_order), 0) AS maxOrder
                FROM dbo.gallery
                WHERE page_location = <cfqueryparam value="#arguments.page_location#" cfsqltype="cf_sql_varchar">
            </cfquery>

            <!--- Insert image record --->
            <cfquery name="qInsert" datasource="pasc_regionj">
                INSERT INTO dbo.gallery (
                    title,
                    filename,
                    original_filename,
                    file_extension,
                    file_size,
                    page_location,
                    is_active,
                    display_order,
                    uploaded_at,
                    updated_at
                )
                VALUES (
                    <cfqueryparam value="#arguments.title#" cfsqltype="cf_sql_varchar">,
                    <cfqueryparam value="#fileData.serverFile#" cfsqltype="cf_sql_varchar">,
                    <cfqueryparam value="#fileData.clientFile#" cfsqltype="cf_sql_varchar">,
                    <cfqueryparam value="#fileData.serverFileExt#" cfsqltype="cf_sql_varchar">,
                    <cfqueryparam value="#fileData.fileSize#" cfsqltype="cf_sql_integer">,
                    <cfqueryparam value="#arguments.page_location#" cfsqltype="cf_sql_varchar">,
                    <cfqueryparam value="#arguments.is_active#" cfsqltype="cf_sql_bit">,
                    <cfqueryparam value="#qMaxOrder.maxOrder + 1#" cfsqltype="cf_sql_integer">,
                    GETDATE(),
                    GETDATE()
                );
                SELECT SCOPE_IDENTITY() AS newId
            </cfquery>

            <!--- Get the newly created image --->
            <cfset newImageId = qInsert.newId>
            <cfset var getImageResult = deserializeJSON(getImage(newImageId))>

            <cfif getImageResult.success>
                <cfset result = getImageResult>
                <cfset result.message = "Image uploaded successfully">
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "message" = "Image uploaded but error retrieving data"
                }>
            </cfif>

            <cfcatch type="any">
                <!--- Clean up uploaded file if database insert failed --->
                <cfif isDefined("fileData.serverDirectory") AND isDefined("fileData.serverFile")>
                    <cfset var uploadedFile = fileData.serverDirectory & "/" & fileData.serverFile>
                    <cfif fileExists(uploadedFile)>
                        <cffile action="delete" file="#uploadedFile#">
                    </cfif>
                </cfif>

                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail,
                    "message" = "Error uploading image"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- UPDATE IMAGE --->
    <!--- Update image metadata (not the file itself) --->
    <!--- ================================================================== --->
    <cffunction name="updateImage" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">
        <cfargument name="title" type="string" required="true">
        <cfargument name="page_location" type="string" required="true">
        <cfargument name="is_active" type="boolean" required="true">

        <cfset var result = {}>

        <cftry>
            <!--- Update the image metadata --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.gallery
                SET
                    title = <cfqueryparam value="#arguments.title#" cfsqltype="cf_sql_varchar">,
                    page_location = <cfqueryparam value="#arguments.page_location#" cfsqltype="cf_sql_varchar">,
                    is_active = <cfqueryparam value="#arguments.is_active#" cfsqltype="cf_sql_bit">,
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Get the updated image --->
            <cfset var getImageResult = deserializeJSON(getImage(arguments.id))>

            <cfif getImageResult.success>
                <cfset result = getImageResult>
                <cfset result.message = "Image updated successfully">
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "message" = "Image updated but error retrieving data"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error updating image"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- DELETE IMAGE --->
    <!--- Delete image and its file from server, then resequence remaining items --->
    <!--- ================================================================== --->
    <cffunction name="deleteImage" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>
        <cfset var qImage = "">

        <cftry>
            <!--- Get image details before deleting --->
            <cfquery name="qImage" datasource="pasc_regionj">
                SELECT filename, display_order, page_location
                FROM dbo.gallery
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif qImage.recordCount GT 0>
                <cfset var deletedOrder = qImage.display_order>
                <cfset var deletedLocation = qImage.page_location>

                <!--- Delete from database --->
                <cfquery datasource="pasc_regionj">
                    DELETE FROM dbo.gallery
                    WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
                </cfquery>

                <!--- Shift remaining items up to fill the gap --->
                <cfquery datasource="pasc_regionj">
                    UPDATE dbo.gallery
                    SET display_order = display_order - 1
                    WHERE page_location = <cfqueryparam value="#deletedLocation#" cfsqltype="cf_sql_varchar">
                        AND display_order > <cfqueryparam value="#deletedOrder#" cfsqltype="cf_sql_integer">
                </cfquery>

                <!--- Delete physical file --->
                <cfset var filePath = expandPath("/assets/img/gallery/" & qImage.filename)>
                <cfif fileExists(filePath)>
                    <cffile action="delete" file="#filePath#">
                </cfif>

                <cfset result = {
                    "success" = true,
                    "message" = "Image deleted successfully"
                }>
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "message" = "Image not found"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error deleting image"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- UPDATE ORDER --->
    <!--- Update display order for an image with proper shift logic --->
    <!--- When moving from position A to position B: --->
    <!--- - If B < A (moving up): shift items B to A-1 down by 1 --->
    <!--- - If B > A (moving down): shift items A+1 to B up by 1 --->
    <!--- ================================================================== --->
    <cffunction name="updateOrder" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">
        <cfargument name="newOrder" type="numeric" required="true">
        <cfargument name="location" type="string" required="true">

        <cfset var result = {}>
        <cfset var qCurrentOrder = "">
        <cfset var currentOrder = 0>

        <cftry>
            <!--- Get current order of the item being moved --->
            <cfquery name="qCurrentOrder" datasource="pasc_regionj">
                SELECT display_order
                FROM dbo.gallery
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
                    AND page_location = <cfqueryparam value="#arguments.location#" cfsqltype="cf_sql_varchar">
            </cfquery>

            <cfif qCurrentOrder.recordCount EQ 0>
                <cfset result = {
                    "success" = false,
                    "message" = "Image not found"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfset currentOrder = qCurrentOrder.display_order>

            <!--- Only update if the order is actually changing --->
            <cfif currentOrder NEQ arguments.newOrder>

                <!--- Shift other items to make room --->
                <cfif arguments.newOrder LT currentOrder>
                    <!--- Moving UP: shift items from newOrder to currentOrder-1 DOWN by 1 --->
                    <cfquery datasource="pasc_regionj">
                        UPDATE dbo.gallery
                        SET display_order = display_order + 1
                        WHERE page_location = <cfqueryparam value="#arguments.location#" cfsqltype="cf_sql_varchar">
                            AND display_order >= <cfqueryparam value="#arguments.newOrder#" cfsqltype="cf_sql_integer">
                            AND display_order < <cfqueryparam value="#currentOrder#" cfsqltype="cf_sql_integer">
                            AND id != <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
                    </cfquery>
                <cfelse>
                    <!--- Moving DOWN: shift items from currentOrder+1 to newOrder UP by 1 --->
                    <cfquery datasource="pasc_regionj">
                        UPDATE dbo.gallery
                        SET display_order = display_order - 1
                        WHERE page_location = <cfqueryparam value="#arguments.location#" cfsqltype="cf_sql_varchar">
                            AND display_order > <cfqueryparam value="#currentOrder#" cfsqltype="cf_sql_integer">
                            AND display_order <= <cfqueryparam value="#arguments.newOrder#" cfsqltype="cf_sql_integer">
                            AND id != <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
                    </cfquery>
                </cfif>

                <!--- Now set the item's new order --->
                <cfquery datasource="pasc_regionj">
                    UPDATE dbo.gallery
                    SET
                        display_order = <cfqueryparam value="#arguments.newOrder#" cfsqltype="cf_sql_integer">,
                        updated_at = GETDATE()
                    WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
                        AND page_location = <cfqueryparam value="#arguments.location#" cfsqltype="cf_sql_varchar">
                </cfquery>
            </cfif>

            <cfset result = {
                "success" = true,
                "message" = "Display order updated successfully"
            }>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error updating display order"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

</cfcomponent>
