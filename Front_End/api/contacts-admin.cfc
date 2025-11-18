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


    <!--- ================================================================== --->
    <!--- GET EMAIL RECIPIENTS --->
    <!--- Returns all email recipients for notifications --->
    <!--- ================================================================== --->
    <cffunction name="getEmailRecipients" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qRecipients = "">

        <cftry>
            <!--- Query all recipients --->
            <cfquery name="qRecipients" datasource="pasc_regionj">
                SELECT
                    id,
                    email,
                    is_primary,
                    is_active,
                    created_at
                FROM dbo.contact_email_recipients
                ORDER BY is_primary DESC, created_at ASC
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var recipients = []>

            <cfloop query="qRecipients">
                <cfset var recipient = {
                    "id" = qRecipients.id,
                    "email" = qRecipients.email,
                    "is_primary" = qRecipients.is_primary,
                    "is_active" = qRecipients.is_active,
                    "created_at" = dateFormat(qRecipients.created_at, "yyyy-mm-dd") & " " & timeFormat(qRecipients.created_at, "HH:mm:ss")
                }>
                <cfset arrayAppend(recipients, recipient)>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = recipients,
                "message" = "Recipients retrieved successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = [],
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail,
                    "message" = "Error retrieving recipients"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- ADD EMAIL RECIPIENT --->
    <!--- Add new email recipient for notifications --->
    <!--- ================================================================== --->
    <cffunction name="addEmailRecipient" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="email" type="string" required="true">

        <cfset var result = {}>

        <cftry>
            <!--- Validate email format --->
            <cfif NOT isValid("email", trim(arguments.email))>
                <cfset result = {
                    "success" = false,
                    "message" = "Invalid email format"
                }>
                <cfreturn serializeJSON(result, false, false)>
            </cfif>

            <!--- Check if email already exists --->
            <cfquery name="qCheck" datasource="pasc_regionj">
                SELECT id FROM dbo.contact_email_recipients
                WHERE email = <cfqueryparam value="#trim(arguments.email)#" cfsqltype="cf_sql_nvarchar">
            </cfquery>

            <cfif qCheck.recordCount GT 0>
                <cfset result = {
                    "success" = false,
                    "message" = "This email is already in the recipient list"
                }>
                <cfreturn serializeJSON(result, false, false)>
            </cfif>

            <!--- Insert new recipient --->
            <cfquery datasource="pasc_regionj">
                INSERT INTO dbo.contact_email_recipients (email, is_primary, is_active)
                VALUES (
                    <cfqueryparam value="#trim(arguments.email)#" cfsqltype="cf_sql_nvarchar">,
                    0,
                    1
                )
            </cfquery>

            <!--- Get all recipients to return --->
            <cfset result = deserializeJSON(getEmailRecipients())>
            <cfset result.message = "Recipient added successfully">

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error adding recipient"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- TOGGLE RECIPIENT STATUS --->
    <!--- Toggle active/inactive status for recipient --->
    <!--- ================================================================== --->
    <cffunction name="toggleRecipientStatus" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>

        <cftry>
            <!--- Toggle the is_active status --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.contact_email_recipients
                SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Get all recipients to return --->
            <cfset result = deserializeJSON(getEmailRecipients())>
            <cfset result.message = "Recipient status updated successfully">

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error updating recipient status"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- DELETE EMAIL RECIPIENT --->
    <!--- Delete an email recipient --->
    <!--- ================================================================== --->
    <cffunction name="deleteEmailRecipient" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>

        <cftry>
            <!--- Check if this is the primary recipient --->
            <cfquery name="qCheck" datasource="pasc_regionj">
                SELECT is_primary FROM dbo.contact_email_recipients
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif qCheck.recordCount GT 0 AND qCheck.is_primary EQ 1>
                <cfset result = {
                    "success" = false,
                    "message" = "Cannot delete the primary recipient"
                }>
                <cfreturn serializeJSON(result, false, false)>
            </cfif>

            <!--- Delete the recipient --->
            <cfquery datasource="pasc_regionj">
                DELETE FROM dbo.contact_email_recipients
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Get all recipients to return --->
            <cfset result = deserializeJSON(getEmailRecipients())>
            <cfset result.message = "Recipient deleted successfully">

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error deleting recipient"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

</cfcomponent>
