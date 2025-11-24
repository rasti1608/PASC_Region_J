<!---
================================================================================
File: schedule.cfc
Description: API endpoint for conference schedule management
Author: Auto-generated for Angular migration
Date: 2025-11-23
Version: 1.0
================================================================================
--->

<cfcomponent output="false">

    <!--- ================================================================== --->
    <!--- GET SCHEDULE --->
    <!--- Returns all active schedule items for public display --->
    <!--- ================================================================== --->
    <cffunction name="getSchedule" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qSchedule = "">

        <cftry>
            <!--- Query active schedule items --->
            <cfquery name="qSchedule" datasource="pasc_regionj">
                SELECT
                    schedule_id,
                    event_time,
                    end_time,
                    event_icon,
                    event_name,
                    event_description,
                    display_order
                FROM pasc_web.conference_schedule
                WHERE is_active = 1
                ORDER BY display_order ASC
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var scheduleItems = []>

            <cfloop query="qSchedule">
                <cfset var item = {
                    "schedule_id" = qSchedule.schedule_id,
                    "event_time" = qSchedule.event_time,
                    "end_time" = qSchedule.end_time,
                    "event_icon" = qSchedule.event_icon,
                    "event_name" = qSchedule.event_name,
                    "event_description" = qSchedule.event_description,
                    "display_order" = qSchedule.display_order
                }>
                <cfset arrayAppend(scheduleItems, item)>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = scheduleItems,
                "count" = arrayLen(scheduleItems),
                "message" = "Schedule retrieved successfully"
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
    <!--- GET SCHEDULE ADMIN --->
    <!--- Returns ALL schedule items for admin panel --->
    <!--- ================================================================== --->
    <cffunction name="getScheduleAdmin" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qSchedule = "">

        <cftry>
            <!--- Query ALL schedule items for admin --->
            <cfquery name="qSchedule" datasource="pasc_regionj">
                SELECT
                    schedule_id,
                    event_time,
                    end_time,
                    event_icon,
                    event_name,
                    event_description,
                    display_order,
                    is_active,
                    created_date,
                    modified_date
                FROM pasc_web.conference_schedule
                ORDER BY display_order ASC
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var scheduleItems = []>

            <cfloop query="qSchedule">
                <cfset var item = {
                    "schedule_id" = qSchedule.schedule_id,
                    "event_time" = qSchedule.event_time,
                    "end_time" = qSchedule.end_time,
                    "event_icon" = qSchedule.event_icon,
                    "event_name" = qSchedule.event_name,
                    "event_description" = qSchedule.event_description,
                    "display_order" = qSchedule.display_order,
                    "is_active" = qSchedule.is_active
                }>
                <cfset arrayAppend(scheduleItems, item)>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = scheduleItems,
                "count" = arrayLen(scheduleItems),
                "message" = "Schedule retrieved successfully"
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
    <!--- SAVE SCHEDULE --->
    <!--- Batch save operation - saves entire schedule at once --->
    <!--- Deletes removed items, updates existing, creates new --->
    <!--- ================================================================== --->
    <cffunction name="saveSchedule" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="scheduleData" type="string" required="true">

        <cfset var result = {}>
        <cfset var scheduleArray = []>
        <cfset var existingIds = []>
        <cfset var submittedIds = []>

        <cftry>
            <!--- Parse the JSON schedule data --->
            <cfset scheduleArray = deserializeJSON(arguments.scheduleData)>

            <!--- Get all existing schedule IDs --->
            <cfquery name="qExisting" datasource="pasc_regionj">
                SELECT schedule_id
                FROM pasc_web.conference_schedule
            </cfquery>

            <cfloop query="qExisting">
                <cfset arrayAppend(existingIds, qExisting.schedule_id)>
            </cfloop>

            <!--- Process each schedule item --->
            <cfloop array="#scheduleArray#" index="item">
                <!--- Track submitted IDs (those with schedule_id) --->
                <cfif structKeyExists(item, "schedule_id") AND item.schedule_id GT 0>
                    <cfset arrayAppend(submittedIds, item.schedule_id)>

                    <!--- UPDATE existing item --->
                    <cfquery datasource="pasc_regionj">
                        UPDATE pasc_web.conference_schedule
                        SET
                            event_time = <cfqueryparam value="#item.event_time#" cfsqltype="cf_sql_varchar">,
                            end_time = <cfqueryparam value="#item.end_time#" cfsqltype="cf_sql_varchar" null="#NOT structKeyExists(item, 'end_time') OR item.end_time EQ ''#">,
                            event_icon = <cfqueryparam value="#item.event_icon#" cfsqltype="cf_sql_nvarchar" null="#NOT structKeyExists(item, 'event_icon') OR item.event_icon EQ ''#">,
                            event_name = <cfqueryparam value="#item.event_name#" cfsqltype="cf_sql_varchar">,
                            event_description = <cfqueryparam value="#item.event_description#" cfsqltype="cf_sql_varchar" null="#NOT structKeyExists(item, 'event_description') OR item.event_description EQ ''#">,
                            display_order = <cfqueryparam value="#item.display_order#" cfsqltype="cf_sql_integer">,
                            modified_date = GETDATE()
                        WHERE schedule_id = <cfqueryparam value="#item.schedule_id#" cfsqltype="cf_sql_integer">
                    </cfquery>
                <cfelse>
                    <!--- INSERT new item --->
                    <cfquery datasource="pasc_regionj">
                        INSERT INTO pasc_web.conference_schedule (
                            event_time,
                            end_time,
                            event_icon,
                            event_name,
                            event_description,
                            display_order,
                            is_active,
                            created_date,
                            modified_date
                        )
                        VALUES (
                            <cfqueryparam value="#item.event_time#" cfsqltype="cf_sql_varchar">,
                            <cfqueryparam value="#item.end_time#" cfsqltype="cf_sql_varchar" null="#NOT structKeyExists(item, 'end_time') OR item.end_time EQ ''#">,
                            <cfqueryparam value="#item.event_icon#" cfsqltype="cf_sql_nvarchar" null="#NOT structKeyExists(item, 'event_icon') OR item.event_icon EQ ''#">,
                            <cfqueryparam value="#item.event_name#" cfsqltype="cf_sql_varchar">,
                            <cfqueryparam value="#item.event_description#" cfsqltype="cf_sql_varchar" null="#NOT structKeyExists(item, 'event_description') OR item.event_description EQ ''#">,
                            <cfqueryparam value="#item.display_order#" cfsqltype="cf_sql_integer">,
                            1,
                            GETDATE(),
                            GETDATE()
                        )
                    </cfquery>
                </cfif>
            </cfloop>

            <!--- Delete items that were removed (exist in DB but not in submitted data) --->
            <cfloop array="#existingIds#" index="existingId">
                <cfif NOT arrayContains(submittedIds, existingId)>
                    <cfquery datasource="pasc_regionj">
                        DELETE FROM pasc_web.conference_schedule
                        WHERE schedule_id = <cfqueryparam value="#existingId#" cfsqltype="cf_sql_integer">
                    </cfquery>
                </cfif>
            </cfloop>

            <!--- Return success with updated schedule --->
            <cfset var getScheduleResult = deserializeJSON(getScheduleAdmin())>

            <cfif getScheduleResult.success>
                <cfset result = getScheduleResult>
                <cfset result.message = "Schedule saved successfully">
            <cfelse>
                <cfset result = {
                    "success" = true,
                    "data" = [],
                    "message" = "Schedule saved but error retrieving updated data"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail,
                    "message" = "Error saving schedule"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

</cfcomponent>
