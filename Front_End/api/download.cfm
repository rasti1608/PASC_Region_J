<cfsilent>
<!---
Simple document download handler for DailyRazor hosting
Workaround for cfcontent restrictions in CFC methods
--->

<cfparam name="url.id" default="0">

<!--- Validate ID parameter --->
<cfif NOT isNumeric(url.id) OR url.id LTE 0>
    <cfheader statuscode="400" statustext="Bad Request">
    <cfoutput>Invalid document ID</cfoutput>
    <cfabort>
</cfif>

<!--- Query document details --->
<cfquery name="qDocument" datasource="pasc_regionj">
    SELECT filename, title, file_extension
    FROM dbo.documents
    WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
    AND is_active = 1
</cfquery>

<!--- Check if document exists --->
<cfif qDocument.recordCount EQ 0>
    <cfheader statuscode="404" statustext="Not Found">
    <cfoutput>Document not found</cfoutput>
    <cfabort>
</cfif>

<!--- Build file path --->
<cfset filePath = expandPath("/assets/documents/" & qDocument.filename)>

<!--- Check if physical file exists --->
<cfif NOT fileExists(filePath)>
    <cfheader statuscode="404" statustext="Not Found">
    <cfoutput>File not found on server</cfoutput>
    <cfabort>
</cfif>

<!--- Determine MIME type based on extension --->
<cfswitch expression="#lcase(qDocument.file_extension)#">
    <cfcase value=".pdf">
        <cfset mimeType = "application/pdf">
    </cfcase>
    <cfcase value=".doc">
        <cfset mimeType = "application/msword">
    </cfcase>
    <cfcase value=".docx">
        <cfset mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document">
    </cfcase>
    <cfcase value=".xls">
        <cfset mimeType = "application/vnd.ms-excel">
    </cfcase>
    <cfcase value=".xlsx">
        <cfset mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
    </cfcase>
    <cfcase value=".ppt">
        <cfset mimeType = "application/vnd.ms-powerpoint">
    </cfcase>
    <cfcase value=".pptx">
        <cfset mimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation">
    </cfcase>
    <cfcase value=".txt">
        <cfset mimeType = "text/plain">
    </cfcase>
    <cfcase value=".zip">
        <cfset mimeType = "application/zip">
    </cfcase>
    <cfdefaultcase>
        <cfset mimeType = "application/octet-stream">
    </cfdefaultcase>
</cfswitch>

<!--- Build download filename using document title --->
<cfset downloadFilename = qDocument.title & '.' & qDocument.file_extension>

<!--- Set headers for file download --->
<cfheader name="Content-Type" value="#mimeType#">
<cfheader name="Content-Disposition" value="attachment; filename=""#downloadFilename#""">

</cfsilent><!--- Serve the file --->
<cfcontent file="#filePath#" type="#mimeType#" deletefile="false" reset="true">
