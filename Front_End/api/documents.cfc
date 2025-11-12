<!---
================================================================================
File: documents.cfc
Description: API endpoint for downloadable documents/resources
Author: Auto-generated for Angular migration
Date: 2025-11-11
Version: 1.0
================================================================================
--->

<cfcomponent output="false">

    <!--- ================================================================== --->
    <!--- GET DOCUMENTS --->
    <!--- Returns all active documents/resources --->
    <!--- ================================================================== --->
    <cffunction name="getDocuments" access="remote" returnformat="json" returntype="any" output="false">

        <cfset var result = {}>
        <cfset var qDocuments = "">

        <cftry>
            <!--- Query active documents --->
            <cfquery name="qDocuments" datasource="pasc_regionj">
                SELECT
                    id,
                    title,
                    description,
                    filename,
                    original_filename,
                    file_extension,
                    file_size,
                    document_type,
                    display_order
                FROM dbo.documents
                WHERE is_active = 1
                ORDER BY display_order ASC, id ASC
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var documents = []>

            <cfloop query="qDocuments">
                <!--- Calculate file size in human-readable format --->
                <cfset var fileSizeKB = round(qDocuments.file_size / 1024)>
                <cfset var fileSizeMB = round(qDocuments.file_size / 1024 / 1024 * 100) / 100>
                <cfset var fileSizeFormatted = fileSizeKB LT 1024 ? "#fileSizeKB# KB" : "#fileSizeMB# MB">

                <!--- Determine file type icon based on extension --->
                <cfset var fileIcon = "file">
                <cfswitch expression="#lcase(qDocuments.file_extension)#">
                    <cfcase value=".pdf">
                        <cfset fileIcon = "file-pdf">
                    </cfcase>
                    <cfcase value=".doc,.docx">
                        <cfset fileIcon = "file-word">
                    </cfcase>
                    <cfcase value=".xls,.xlsx">
                        <cfset fileIcon = "file-excel">
                    </cfcase>
                    <cfcase value=".ppt,.pptx">
                        <cfset fileIcon = "file-powerpoint">
                    </cfcase>
                    <cfcase value=".zip,.rar">
                        <cfset fileIcon = "file-archive">
                    </cfcase>
                    <cfcase value=".jpg,.jpeg,.png,.gif">
                        <cfset fileIcon = "file-image">
                    </cfcase>
                </cfswitch>

                <cfset var document = {
                    "id" = qDocuments.id,
                    "title" = qDocuments.title,
                    "description" = qDocuments.description,
                    "filename" = qDocuments.filename,
                    "originalFilename" = qDocuments.original_filename,
                    "fileExtension" = qDocuments.file_extension,
                    "fileSize" = qDocuments.file_size,
                    "fileSizeFormatted" = fileSizeFormatted,
                    "documentType" = qDocuments.document_type,
                    "displayOrder" = qDocuments.display_order,
                    "fileIcon" = fileIcon,
                    "downloadPath" = "/assets/documents/" & qDocuments.filename
                }>
                <cfset arrayAppend(documents, document)>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = documents,
                "count" = arrayLen(documents),
                "message" = "Documents retrieved successfully"
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

</cfcomponent>
