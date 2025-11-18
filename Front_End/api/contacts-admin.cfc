<!---
================================================================================
File: contacts-admin.cfc
Description: Admin API endpoint for managing contact form submissions
Author: Auto-generated for Angular migration
Date: 2025-11-16
Version: 1.0
================================================================================
--->

<cfcomponent output="false">

    <!--- ================================================================== --->
    <!--- GET ALL SUBMISSIONS (ADMIN) --->
    <!--- Returns all contact submissions for admin panel --->
    <!--- ================================================================== --->
    <cffunction name="getSubmissionsAdmin" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qSubmissions = "">

        <cftry>
            <!--- Query all submissions --->
            <cfquery name="qSubmissions" datasource="pasc_regionj">
                SELECT
                    id,
                    name,
                    email,
                    subject,
                    message,
                    submitted_at,
                    ip_address,
                    status,
                    admin_notes
                FROM dbo.contact_submissions
                ORDER BY
                    CASE status
                        WHEN 'new' THEN 1
                        WHEN 'read' THEN 2
                        WHEN 'replied' THEN 3
                        WHEN 'archived' THEN 4
                    END,
                    submitted_at DESC
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var submissions = []>

            <cfloop query="qSubmissions">
                <cfset var submission = {
                    "id" = qSubmissions.id,
                    "name" = qSubmissions.name,
                    "email" = qSubmissions.email,
                    "subject" = qSubmissions.subject,
                    "message" = qSubmissions.message,
                    "submitted_at" = dateFormat(qSubmissions.submitted_at, "yyyy-mm-dd") & " " & timeFormat(qSubmissions.submitted_at, "HH:mm:ss"),
                    "ip_address" = qSubmissions.ip_address,
                    "status" = qSubmissions.status,
                    "admin_notes" = qSubmissions.admin_notes
                }>
                <cfset arrayAppend(submissions, submission)>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = submissions,
                "message" = "Submissions retrieved successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = [],
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail,
                    "message" = "Error retrieving submissions"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- GET SINGLE SUBMISSION --->
    <!--- Returns single submission by ID --->
    <!--- ================================================================== --->
    <cffunction name="getSubmission" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>
        <cfset var qSubmission = "">

        <cftry>
            <cfquery name="qSubmission" datasource="pasc_regionj">
                SELECT
                    id,
                    name,
                    email,
                    subject,
                    message,
                    submitted_at,
                    ip_address,
                    status,
                    admin_notes
                FROM dbo.contact_submissions
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif qSubmission.recordCount GT 0>
                <cfset var submission = {
                    "id" = qSubmission.id,
                    "name" = qSubmission.name,
                    "email" = qSubmission.email,
                    "subject" = qSubmission.subject,
                    "message" = qSubmission.message,
                    "submitted_at" = dateFormat(qSubmission.submitted_at, "yyyy-mm-dd") & " " & timeFormat(qSubmission.submitted_at, "HH:mm:ss"),
                    "ip_address" = qSubmission.ip_address,
                    "status" = qSubmission.status,
                    "admin_notes" = qSubmission.admin_notes
                }>

                <cfset result = {
                    "success" = true,
                    "data" = submission,
                    "message" = "Submission retrieved successfully"
                }>
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "data" = {},
                    "message" = "Submission not found"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "data" = {},
                    "error" = cfcatch.message,
                    "message" = "Error retrieving submission"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- UPDATE STATUS --->
    <!--- Update submission status --->
    <!--- ================================================================== --->
    <cffunction name="updateStatus" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">
        <cfargument name="status" type="string" required="true">

        <cfset var result = {}>

        <cftry>
            <!--- Update the status --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.contact_submissions
                SET status = <cfqueryparam value="#arguments.status#" cfsqltype="cf_sql_varchar">
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Get the updated submission --->
            <cfset var getSubmissionResult = deserializeJSON(getSubmission(arguments.id))>

            <cfif getSubmissionResult.success>
                <cfset result = getSubmissionResult>
                <cfset result.message = "Status updated successfully">
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "message" = "Status updated but error retrieving data"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error updating status"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- UPDATE ADMIN NOTES --->
    <!--- Update admin notes for a submission --->
    <!--- ================================================================== --->
    <cffunction name="updateAdminNotes" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">
        <cfargument name="admin_notes" type="string" default="" required="false">

        <cfset var result = {}>

        <cftry>
            <!--- Update the admin notes --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.contact_submissions
                SET admin_notes = <cfqueryparam value="#trim(arguments.admin_notes)#" cfsqltype="cf_sql_nvarchar">
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Get the updated submission --->
            <cfset var getSubmissionResult = deserializeJSON(getSubmission(arguments.id))>

            <cfif getSubmissionResult.success>
                <cfset result = getSubmissionResult>
                <cfset result.message = "Admin notes updated successfully">
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "message" = "Admin notes updated but error retrieving data"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error updating admin notes"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- GET STATUS COUNTS --->
    <!--- Returns count of submissions by status --->
    <!--- ================================================================== --->
    <cffunction name="getStatusCounts" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qStatusCounts = "">

        <cftry>
            <!--- Query status counts --->
            <cfquery name="qStatusCounts" datasource="pasc_regionj">
                SELECT
                    status,
                    COUNT(*) as count
                FROM dbo.contact_submissions
                GROUP BY status
            </cfquery>

            <!--- Build counts object --->
            <cfset var counts = {
                "new" = 0,
                "read" = 0,
                "replied" = 0,
                "archived" = 0
            }>

            <cfloop query="qStatusCounts">
                <cfset counts[status] = count>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = counts,
                "message" = "Status counts retrieved successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = {"new" = 0, "read" = 0, "replied" = 0, "archived" = 0},
                    "error" = cfcatch.message,
                    "message" = "Error retrieving status counts"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

</cfcomponent>
