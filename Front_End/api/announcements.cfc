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

    <!--- ================================================================== --->
    <!--- GET ANNOUNCEMENTS ADMIN --->
    <!--- Returns all announcements (including inactive) for admin panel --->
    <!--- ================================================================== --->
    <cffunction name="getAnnouncementsAdmin" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qAnnouncements = "">

        <cftry>
            <!--- Query all announcements with computed status --->
            <cfquery name="qAnnouncements" datasource="pasc_regionj">
                SELECT
                    id,
                    title,
                    content,
                    is_active,
                    is_featured,
                    display_order,
                    publish_start,
                    publish_end,
                    created_by,
                    created_at,
                    updated_at,
                    CASE
                        WHEN is_active = 0 THEN 'inactive'
                        WHEN publish_start > GETDATE() THEN 'future'
                        WHEN publish_end IS NOT NULL AND publish_end < GETDATE() THEN 'expired'
                        ELSE 'live'
                    END AS computed_status
                FROM dbo.announcements
                ORDER BY display_order ASC
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var announcements = []>

            <cfloop query="qAnnouncements">
                <cfset var announcement = {
                    "id" = qAnnouncements.id,
                    "title" = qAnnouncements.title,
                    "content" = qAnnouncements.content,
                    "is_active" = qAnnouncements.is_active,
                    "is_featured" = qAnnouncements.is_featured,
                    "display_order" = qAnnouncements.display_order,
                    "publish_start" = dateFormat(qAnnouncements.publish_start, "yyyy-mm-dd"),
                    "publish_end" = isNull(qAnnouncements.publish_end) ? javaCast("null", "") : dateFormat(qAnnouncements.publish_end, "yyyy-mm-dd"),
                    "created_by" = qAnnouncements.created_by,
                    "created_at" = dateTimeFormat(qAnnouncements.created_at, "yyyy-mm-dd HH:nn:ss"),
                    "updated_at" = dateTimeFormat(qAnnouncements.updated_at, "yyyy-mm-dd HH:nn:ss"),
                    "computed_status" = qAnnouncements.computed_status
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

    <!--- ================================================================== --->
    <!--- GET ANNOUNCEMENT --->
    <!--- Returns a single announcement by ID for editing --->
    <!--- ================================================================== --->
    <cffunction name="getAnnouncement" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>
        <cfset var qAnnouncement = "">

        <cftry>
            <!--- Query single announcement --->
            <cfquery name="qAnnouncement" datasource="pasc_regionj">
                SELECT
                    id,
                    title,
                    content,
                    is_active,
                    is_featured,
                    display_order,
                    publish_start,
                    publish_end,
                    created_by,
                    created_at,
                    updated_at
                FROM dbo.announcements
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Check if announcement exists --->
            <cfif qAnnouncement.recordCount EQ 0>
                <cfset result = {
                    "success" = false,
                    "data" = javaCast("null", ""),
                    "error" = "Announcement not found",
                    "message" = "No announcement found with ID #arguments.id#"
                }>
            <cfelse>
                <!--- Build announcement struct --->
                <cfset var announcement = {
                    "id" = qAnnouncement.id,
                    "title" = qAnnouncement.title,
                    "content" = qAnnouncement.content,
                    "is_active" = qAnnouncement.is_active,
                    "is_featured" = qAnnouncement.is_featured,
                    "display_order" = qAnnouncement.display_order,
                    "publish_start" = dateFormat(qAnnouncement.publish_start, "yyyy-mm-dd"),
                    "publish_end" = isNull(qAnnouncement.publish_end) ? javaCast("null", "") : dateFormat(qAnnouncement.publish_end, "yyyy-mm-dd"),
                    "created_by" = qAnnouncement.created_by,
                    "created_at" = dateTimeFormat(qAnnouncement.created_at, "yyyy-mm-dd HH:nn:ss"),
                    "updated_at" = dateTimeFormat(qAnnouncement.updated_at, "yyyy-mm-dd HH:nn:ss")
                }>

                <!--- Build success response --->
                <cfset result = {
                    "success" = true,
                    "data" = announcement,
                    "message" = "Announcement retrieved successfully"
                }>
            </cfif>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = javaCast("null", ""),
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- SAVE ANNOUNCEMENT --->
    <!--- Creates new or updates existing announcement --->
    <!--- Detects create vs update based on presence of ID --->
    <!--- Accepts JSON from Angular (application/json POST body) --->
    <!--- ================================================================== --->
    <cffunction name="saveAnnouncement" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var newId = 0>
        <cfset var data = {}>
        <cfset var requestBody = "">

        <cftry>
            <!--- Read JSON from request body --->
            <cfset requestBody = toString(getHttpRequestData().content)>

            <!--- Parse JSON data --->
            <cfif len(trim(requestBody)) GT 0>
                <cfset data = deserializeJSON(requestBody)>
            <cfelse>
                <cfthrow type="InvalidRequest" message="No data provided in request body">
            </cfif>

            <!--- Set defaults for missing fields --->
            <cfparam name="data.id" default="0">
            <cfparam name="data.is_active" default="true">
            <cfparam name="data.is_featured" default="false">
            <cfparam name="data.publish_end" default="">
            <cfparam name="data.display_order" default="0">

            <!--- Validate required fields --->
            <cfif NOT structKeyExists(data, "title") OR len(trim(data.title)) EQ 0>
                <cfthrow type="Validation" message="Title is required">
            </cfif>
            <cfif NOT structKeyExists(data, "content") OR len(trim(data.content)) EQ 0>
                <cfthrow type="Validation" message="Content is required">
            </cfif>
            <cfif NOT structKeyExists(data, "publish_start") OR len(trim(data.publish_start)) EQ 0>
                <cfthrow type="Validation" message="Publish start date is required">
            </cfif>

            <!--- Check if this is an update (ID provided and exists) --->
            <cfif data.id GT 0>
                <!--- UPDATE existing announcement --->
                <cfquery datasource="pasc_regionj">
                    UPDATE dbo.announcements
                    SET
                        title = <cfqueryparam value="#data.title#" cfsqltype="cf_sql_varchar">,
                        content = <cfqueryparam value="#data.content#" cfsqltype="cf_sql_varchar">,
                        is_active = <cfqueryparam value="#data.is_active#" cfsqltype="cf_sql_bit">,
                        is_featured = <cfqueryparam value="#data.is_featured#" cfsqltype="cf_sql_bit">,
                        publish_start = <cfqueryparam value="#data.publish_start#" cfsqltype="cf_sql_date">,
                        publish_end = <cfqueryparam value="#data.publish_end#" cfsqltype="cf_sql_date" null="#len(trim(data.publish_end)) EQ 0#">,
                        <cfif data.display_order GT 0>
                        display_order = <cfqueryparam value="#data.display_order#" cfsqltype="cf_sql_integer">,
                        </cfif>
                        updated_at = GETDATE()
                    WHERE id = <cfqueryparam value="#data.id#" cfsqltype="cf_sql_integer">
                </cfquery>

                <cfset newId = data.id>
                <cfset var action = "updated">

            <cfelse>
                <!--- INSERT new announcement --->
                <!--- Get next display_order if not provided --->
                <cfif data.display_order EQ 0>
                    <cfquery name="qMaxOrder" datasource="pasc_regionj">
                        SELECT ISNULL(MAX(display_order), 0) + 1 AS next_order
                        FROM dbo.announcements
                    </cfquery>
                    <cfset data.display_order = qMaxOrder.next_order>
                </cfif>

                <!--- TODO: Get actual admin user ID from session --->
                <cfset var adminUserId = 1>

                <cfquery datasource="pasc_regionj" result="insertResult">
                    INSERT INTO dbo.announcements (
                        title,
                        content,
                        is_active,
                        is_featured,
                        publish_start,
                        publish_end,
                        display_order,
                        created_by,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        <cfqueryparam value="#data.title#" cfsqltype="cf_sql_varchar">,
                        <cfqueryparam value="#data.content#" cfsqltype="cf_sql_varchar">,
                        <cfqueryparam value="#data.is_active#" cfsqltype="cf_sql_bit">,
                        <cfqueryparam value="#data.is_featured#" cfsqltype="cf_sql_bit">,
                        <cfqueryparam value="#data.publish_start#" cfsqltype="cf_sql_date">,
                        <cfqueryparam value="#data.publish_end#" cfsqltype="cf_sql_date" null="#len(trim(data.publish_end)) EQ 0#">,
                        <cfqueryparam value="#data.display_order#" cfsqltype="cf_sql_integer">,
                        <cfqueryparam value="#adminUserId#" cfsqltype="cf_sql_integer">,
                        GETDATE(),
                        GETDATE()
                    )
                </cfquery>

                <cfset newId = insertResult.IDENTITYCOL>
                <cfset var action = "created">
            </cfif>

            <!--- Fetch the saved announcement to return --->
            <cfquery name="qSaved" datasource="pasc_regionj">
                SELECT
                    id,
                    title,
                    content,
                    is_active,
                    is_featured,
                    display_order,
                    publish_start,
                    publish_end,
                    created_by,
                    created_at,
                    updated_at
                FROM dbo.announcements
                WHERE id = <cfqueryparam value="#newId#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Build announcement struct --->
            <cfset var announcement = {
                "id" = qSaved.id,
                "title" = qSaved.title,
                "content" = qSaved.content,
                "is_active" = qSaved.is_active,
                "is_featured" = qSaved.is_featured,
                "display_order" = qSaved.display_order,
                "publish_start" = dateFormat(qSaved.publish_start, "yyyy-mm-dd"),
                "publish_end" = isNull(qSaved.publish_end) ? javaCast("null", "") : dateFormat(qSaved.publish_end, "yyyy-mm-dd"),
                "created_by" = qSaved.created_by,
                "created_at" = dateTimeFormat(qSaved.created_at, "yyyy-mm-dd HH:nn:ss"),
                "updated_at" = dateTimeFormat(qSaved.updated_at, "yyyy-mm-dd HH:nn:ss")
            }>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = announcement,
                "message" = "Announcement #action# successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = javaCast("null", ""),
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- UPDATE ORDER --->
    <!--- Updates display_order for an announcement --->
    <!--- Handles shifting other announcements up/down --->
    <!--- ================================================================== --->
    <cffunction name="updateOrder" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">
        <cfargument name="newOrder" type="numeric" required="true">

        <cfset var result = {}>
        <cfset var qMoving = "">
        <cfset var oldOrder = 0>

        <cftry>
            <!--- Get current order of the announcement being moved --->
            <cfquery name="qMoving" datasource="pasc_regionj">
                SELECT display_order
                FROM dbo.announcements
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif qMoving.recordCount EQ 0>
                <cfthrow type="NotFound" message="Announcement not found">
            </cfif>

            <cfset oldOrder = qMoving.display_order>

            <!--- Only proceed if order is actually changing --->
            <cfif oldOrder NEQ arguments.newOrder>
                <!--- Determine direction and shift other announcements --->
                <cfif arguments.newOrder LT oldOrder>
                    <!--- Moving UP - shift others down --->
                    <cfquery datasource="pasc_regionj">
                        UPDATE dbo.announcements
                        SET display_order = display_order + 1
                        WHERE display_order >= <cfqueryparam value="#arguments.newOrder#" cfsqltype="cf_sql_integer">
                        AND display_order < <cfqueryparam value="#oldOrder#" cfsqltype="cf_sql_integer">
                    </cfquery>
                <cfelse>
                    <!--- Moving DOWN - shift others up --->
                    <cfquery datasource="pasc_regionj">
                        UPDATE dbo.announcements
                        SET display_order = display_order - 1
                        WHERE display_order > <cfqueryparam value="#oldOrder#" cfsqltype="cf_sql_integer">
                        AND display_order <= <cfqueryparam value="#arguments.newOrder#" cfsqltype="cf_sql_integer">
                    </cfquery>
                </cfif>

                <!--- Set the announcement to its new position --->
                <cfquery datasource="pasc_regionj">
                    UPDATE dbo.announcements
                    SET display_order = <cfqueryparam value="#arguments.newOrder#" cfsqltype="cf_sql_integer">,
                        updated_at = GETDATE()
                    WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
                </cfquery>
            </cfif>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "message" = "Display order updated successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- TOGGLE ACTIVE --->
    <!--- Toggles is_active status (0 to 1 or 1 to 0) --->
    <!--- ================================================================== --->
    <cffunction name="toggleActive" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>
        <cfset var qAnnouncement = "">

        <cftry>
            <!--- Toggle the is_active status --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.announcements
                SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END,
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Fetch the updated announcement to return --->
            <cfquery name="qAnnouncement" datasource="pasc_regionj">
                SELECT
                    id,
                    title,
                    content,
                    is_active,
                    is_featured,
                    display_order,
                    publish_start,
                    publish_end,
                    created_by,
                    created_at,
                    updated_at
                FROM dbo.announcements
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif qAnnouncement.recordCount EQ 0>
                <cfthrow type="NotFound" message="Announcement not found">
            </cfif>

            <!--- Build announcement struct --->
            <cfset var announcement = {
                "id" = qAnnouncement.id,
                "title" = qAnnouncement.title,
                "content" = qAnnouncement.content,
                "is_active" = qAnnouncement.is_active,
                "is_featured" = qAnnouncement.is_featured,
                "display_order" = qAnnouncement.display_order,
                "publish_start" = dateFormat(qAnnouncement.publish_start, "yyyy-mm-dd"),
                "publish_end" = isNull(qAnnouncement.publish_end) ? javaCast("null", "") : dateFormat(qAnnouncement.publish_end, "yyyy-mm-dd"),
                "created_by" = qAnnouncement.created_by,
                "created_at" = dateTimeFormat(qAnnouncement.created_at, "yyyy-mm-dd HH:nn:ss"),
                "updated_at" = dateTimeFormat(qAnnouncement.updated_at, "yyyy-mm-dd HH:nn:ss")
            }>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = announcement,
                "message" = "Announcement status toggled successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = javaCast("null", ""),
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- DELETE ANNOUNCEMENT --->
    <!--- Deletes announcement and reorders remaining items --->
    <!--- ================================================================== --->
    <cffunction name="deleteAnnouncement" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>
        <cfset var qAnnouncement = "">
        <cfset var deletedOrder = 0>

        <cftry>
            <!--- Get the display_order of the item being deleted --->
            <cfquery name="qAnnouncement" datasource="pasc_regionj">
                SELECT display_order
                FROM dbo.announcements
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif qAnnouncement.recordCount EQ 0>
                <cfthrow type="NotFound" message="Announcement not found">
            </cfif>

            <cfset deletedOrder = qAnnouncement.display_order>

            <!--- Delete the announcement --->
            <cfquery datasource="pasc_regionj">
                DELETE FROM dbo.announcements
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Reorder remaining items to fill the gap --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.announcements
                SET display_order = display_order - 1
                WHERE display_order > <cfqueryparam value="#deletedOrder#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "message" = "Announcement deleted successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

</cfcomponent>
