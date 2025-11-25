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
    <cffunction name="getDocuments" access="remote" returntype="String" output="false" returnformat="json">

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

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- GET DOCUMENTS ADMIN --->
    <!--- Returns ALL documents for admin panel (active and inactive) --->
    <!--- ================================================================== --->
    <cffunction name="getDocumentsAdmin" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qDocuments = "">

        <cftry>
            <!--- Query ALL documents for admin --->
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
                    is_active,
                    display_order,
                    uploaded_at,
                    updated_at
                FROM dbo.documents
                ORDER BY display_order ASC, uploaded_at DESC
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var documents = []>

            <cfloop query="qDocuments">
                <cfset var document = {
                    "id" = qDocuments.id,
                    "title" = qDocuments.title,
                    "description" = qDocuments.description,
                    "filename" = qDocuments.filename,
                    "original_filename" = qDocuments.original_filename,
                    "file_extension" = qDocuments.file_extension,
                    "file_size" = qDocuments.file_size,
                    "document_type" = qDocuments.document_type,
                    "is_active" = qDocuments.is_active,
                    "display_order" = qDocuments.display_order,
                    "uploaded_at" = dateFormat(qDocuments.uploaded_at, "yyyy-mm-dd") & " " & timeFormat(qDocuments.uploaded_at, "HH:mm:ss"),
                    "updated_at" = dateFormat(qDocuments.updated_at, "yyyy-mm-dd") & " " & timeFormat(qDocuments.updated_at, "HH:mm:ss")
                }>
                <cfset arrayAppend(documents, document)>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = documents,
                "message" = "Documents retrieved successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = [],
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail,
                    "message" = "Error retrieving documents"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- GET DOCUMENT --->
    <!--- Returns single document by ID for admin --->
    <!--- ================================================================== --->
    <cffunction name="getDocument" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>
        <cfset var qDocument = "">

        <cftry>
            <cfquery name="qDocument" datasource="pasc_regionj">
                SELECT
                    id,
                    title,
                    description,
                    filename,
                    original_filename,
                    file_extension,
                    file_size,
                    document_type,
                    is_active,
                    display_order,
                    uploaded_at,
                    updated_at
                FROM dbo.documents
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif qDocument.recordCount GT 0>
                <cfset var document = {
                    "id" = qDocument.id,
                    "title" = qDocument.title,
                    "description" = qDocument.description,
                    "filename" = qDocument.filename,
                    "original_filename" = qDocument.original_filename,
                    "file_extension" = qDocument.file_extension,
                    "file_size" = qDocument.file_size,
                    "document_type" = qDocument.document_type,
                    "is_active" = qDocument.is_active,
                    "display_order" = qDocument.display_order,
                    "uploaded_at" = dateFormat(qDocument.uploaded_at, "yyyy-mm-dd") & " " & timeFormat(qDocument.uploaded_at, "HH:mm:ss"),
                    "updated_at" = dateFormat(qDocument.updated_at, "yyyy-mm-dd") & " " & timeFormat(qDocument.updated_at, "HH:mm:ss")
                }>

                <cfset result = {
                    "success" = true,
                    "data" = document,
                    "message" = "Document retrieved successfully"
                }>
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "data" = {},
                    "message" = "Document not found"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "data" = {},
                    "error" = cfcatch.message,
                    "message" = "Error retrieving document"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- UPLOAD DOCUMENT --->
    <!--- Upload a new document with metadata --->
    <!--- ================================================================== --->
    <cffunction name="uploadDocument" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="title" type="string" required="true">
        <cfargument name="description" type="string" default="" required="false">
        <cfargument name="document_type" type="string" default="" required="false">
        <cfargument name="is_active" type="boolean" default="true" required="false">

        <cfset var result = {}>
        <cfset var uploadDir = expandPath("/assets/documents/")>
        <cfset var fileData = "">
        <cfset var newDocumentId = 0>

        <cftry>
            <!--- Ensure upload directory exists --->
            <cfif NOT directoryExists(uploadDir)>
                <cfdirectory action="create" directory="#uploadDir#">
            </cfif>

            <!--- Handle file upload --->
            <cffile action="upload"
                    fileField="document_file"
                    destination="#uploadDir#"
                    nameConflict="makeunique"
                    result="fileData"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation">

            <!--- Get next display order --->
            <cfquery name="qMaxOrder" datasource="pasc_regionj">
                SELECT ISNULL(MAX(display_order), 0) AS maxOrder
                FROM dbo.documents
            </cfquery>

            <!--- Insert document record --->
            <cfquery name="qInsert" datasource="pasc_regionj">
                INSERT INTO dbo.documents (
                    title,
                    description,
                    filename,
                    original_filename,
                    file_extension,
                    file_size,
                    document_type,
                    is_active,
                    display_order,
                    uploaded_at,
                    updated_at
                )
                VALUES (
                    <cfqueryparam value="#arguments.title#" cfsqltype="cf_sql_varchar">,
                    <cfqueryparam value="#arguments.description#" cfsqltype="cf_sql_varchar" null="#arguments.description EQ ''#">,
                    <cfqueryparam value="#fileData.serverFile#" cfsqltype="cf_sql_varchar">,
                    <cfqueryparam value="#fileData.clientFile#" cfsqltype="cf_sql_varchar">,
                    <cfqueryparam value="#fileData.serverFileExt#" cfsqltype="cf_sql_varchar">,
                    <cfqueryparam value="#fileData.fileSize#" cfsqltype="cf_sql_integer">,
                    <cfqueryparam value="#arguments.document_type#" cfsqltype="cf_sql_varchar" null="#arguments.document_type EQ ''#">,
                    <cfqueryparam value="#arguments.is_active#" cfsqltype="cf_sql_bit">,
                    <cfqueryparam value="#qMaxOrder.maxOrder + 1#" cfsqltype="cf_sql_integer">,
                    GETDATE(),
                    GETDATE()
                );
                SELECT SCOPE_IDENTITY() AS newId
            </cfquery>

            <!--- Get the newly created document --->
            <cfset newDocumentId = qInsert.newId>
            <cfset var getDocumentResult = deserializeJSON(getDocument(newDocumentId))>

            <cfif getDocumentResult.success>
                <cfset result = getDocumentResult>
                <cfset result.message = "Document uploaded successfully">
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "message" = "Document uploaded but error retrieving data"
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
                    "message" = "Error uploading document"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- UPDATE DOCUMENT --->
    <!--- Update document metadata (not the file itself) --->
    <!--- ================================================================== --->
    <cffunction name="updateDocument" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">
        <cfargument name="title" type="string" required="true">
        <cfargument name="description" type="string" default="" required="false">
        <cfargument name="document_type" type="string" default="" required="false">
        <cfargument name="is_active" type="boolean" required="true">

        <cfset var result = {}>

        <cftry>
            <!--- Update the document metadata --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.documents
                SET
                    title = <cfqueryparam value="#arguments.title#" cfsqltype="cf_sql_varchar">,
                    description = <cfqueryparam value="#arguments.description#" cfsqltype="cf_sql_varchar" null="#arguments.description EQ ''#">,
                    document_type = <cfqueryparam value="#arguments.document_type#" cfsqltype="cf_sql_varchar" null="#arguments.document_type EQ ''#">,
                    is_active = <cfqueryparam value="#arguments.is_active#" cfsqltype="cf_sql_bit">,
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Get the updated document --->
            <cfset var getDocumentResult = deserializeJSON(getDocument(arguments.id))>

            <cfif getDocumentResult.success>
                <cfset result = getDocumentResult>
                <cfset result.message = "Document updated successfully">
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "message" = "Document updated but error retrieving data"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error updating document"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- DELETE DOCUMENT --->
    <!--- Delete document and its file from server, then resequence remaining items --->
    <!--- ================================================================== --->
    <cffunction name="deleteDocument" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>
        <cfset var qDocument = "">

        <cftry>
            <!--- Get document details before deleting --->
            <cfquery name="qDocument" datasource="pasc_regionj">
                SELECT filename, display_order
                FROM dbo.documents
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif qDocument.recordCount GT 0>
                <cfset var deletedOrder = qDocument.display_order>

                <!--- Delete from database --->
                <cfquery datasource="pasc_regionj">
                    DELETE FROM dbo.documents
                    WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
                </cfquery>

                <!--- Shift remaining items up to fill the gap --->
                <cfquery datasource="pasc_regionj">
                    UPDATE dbo.documents
                    SET display_order = display_order - 1
                    WHERE display_order > <cfqueryparam value="#deletedOrder#" cfsqltype="cf_sql_integer">
                </cfquery>

                <!--- Delete physical file --->
                <cfset var filePath = expandPath("/assets/documents/" & qDocument.filename)>
                <cfif fileExists(filePath)>
                    <cffile action="delete" file="#filePath#">
                </cfif>

                <cfset result = {
                    "success" = true,
                    "message" = "Document deleted successfully"
                }>
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "message" = "Document not found"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error deleting document"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- TOGGLE ACTIVE --->
    <!--- Toggle is_active status for a document --->
    <!--- ================================================================== --->
    <cffunction name="toggleActive" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>

        <cftry>
            <!--- Toggle the active status --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.documents
                SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Get the updated document --->
            <cfset var getDocumentResult = deserializeJSON(getDocument(arguments.id))>

            <cfif getDocumentResult.success>
                <cfset result = getDocumentResult>
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "message" = "Error retrieving updated document"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error toggling document status"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- DOWNLOAD DOCUMENT --->
    <!--- Serve document file with proper headers and filename --->
    <!--- ================================================================== --->
    <cffunction name="downloadDocument" access="remote" returntype="void" output="true">
        <cfargument name="id" type="numeric" required="true">

        <cfset var qDocument = "">
        <cfset var filePath = "">
        <cfset var mimeType = "">
        <cfset var downloadFilename = "">

        <cftry>
            <!--- Get document details --->
            <cfquery name="qDocument" datasource="pasc_regionj">
                SELECT
                    filename,
                    title,
                    file_extension
                FROM dbo.documents
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
                AND is_active = 1
            </cfquery>

            <cfif qDocument.recordCount EQ 0>
                <cfheader statuscode="404" statustext="Not Found">
                <cfoutput>Document not found</cfoutput>
                <cfabort>
            </cfif>

            <!--- Build file path --->
            <cfset filePath = expandPath("/assets/documents/" & qDocument.filename)>

            <!--- Check if file exists --->
            <cfif NOT fileExists(filePath)>
                <cfheader statuscode="404" statustext="Not Found">
                <cfoutput>File not found on server</cfoutput>
                <cfabort>
            </cfif>

            <!--- Determine MIME type based on file extension --->
            <cfswitch expression="#lcase(qDocument.file_extension)#">
                <cfcase value="pdf">
                    <cfset mimeType = "application/pdf">
                </cfcase>
                <cfcase value="doc">
                    <cfset mimeType = "application/msword">
                </cfcase>
                <cfcase value="docx">
                    <cfset mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                </cfcase>
                <cfcase value="xls">
                    <cfset mimeType = "application/vnd.ms-excel">
                </cfcase>
                <cfcase value="xlsx">
                    <cfset mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                </cfcase>
                <cfcase value="ppt">
                    <cfset mimeType = "application/vnd.ms-powerpoint">
                </cfcase>
                <cfcase value="pptx">
                    <cfset mimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation">
                </cfcase>
                <cfcase value="zip">
                    <cfset mimeType = "application/zip">
                </cfcase>
                <cfcase value="rar">
                    <cfset mimeType = "application/x-rar-compressed">
                </cfcase>
                <cfcase value="jpg,.jpeg">
                    <cfset mimeType = "image/jpeg">
                </cfcase>
                <cfcase value="png">
                    <cfset mimeType = "image/png">
                </cfcase>
                <cfcase value="gif">
                    <cfset mimeType = "image/gif">
                </cfcase>
                <cfdefaultcase>
                    <cfset mimeType = "application/octet-stream">
                </cfdefaultcase>
            </cfswitch>

            <!--- Build download filename using document title + extension --->
            <cfset downloadFilename = qDocument.filename>
			
            <!--- Set response headers --->
            <cfheader name="Content-Type" value="#mimeType#">
            <cfheader name="Content-Disposition" value="attachment; filename=""#downloadFilename#""">

            <!--- Serve the file --->
            <cfcontent file="#filePath#" type="#mimeType#" deletefile="false" reset="true">

            <cfcatch type="any">
                <cfheader statuscode="500" statustext="Internal Server Error">
                <cfoutput>Error downloading document: #cfcatch.message#</cfoutput>
                <cfabort>
            </cfcatch>
        </cftry>
    </cffunction>


    <!--- ================================================================== --->
    <!--- UPDATE ORDER --->
    <!--- Update display order for a document with proper shift logic --->
    <!--- ================================================================== --->
    <cffunction name="updateOrder" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">
        <cfargument name="newOrder" type="numeric" required="true">

        <cfset var result = {}>
        <cfset var qMoving = "">
        <cfset var oldOrder = 0>

        <cftry>
            <!--- Get current order of the document being moved --->
            <cfquery name="qMoving" datasource="pasc_regionj">
                SELECT display_order
                FROM dbo.documents
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif qMoving.recordCount EQ 0>
                <cfthrow type="NotFound" message="Document not found">
            </cfif>

            <cfset oldOrder = qMoving.display_order>

            <!--- Only proceed if order is actually changing --->
            <cfif oldOrder NEQ arguments.newOrder>
                <!--- Determine direction and shift other documents --->
                <cfif arguments.newOrder LT oldOrder>
                    <!--- Moving UP - shift others down --->
                    <cfquery datasource="pasc_regionj">
                        UPDATE dbo.documents
                        SET display_order = display_order + 1
                        WHERE display_order >= <cfqueryparam value="#arguments.newOrder#" cfsqltype="cf_sql_integer">
                        AND display_order < <cfqueryparam value="#oldOrder#" cfsqltype="cf_sql_integer">
                    </cfquery>
                <cfelse>
                    <!--- Moving DOWN - shift others up --->
                    <cfquery datasource="pasc_regionj">
                        UPDATE dbo.documents
                        SET display_order = display_order - 1
                        WHERE display_order > <cfqueryparam value="#oldOrder#" cfsqltype="cf_sql_integer">
                        AND display_order <= <cfqueryparam value="#arguments.newOrder#" cfsqltype="cf_sql_integer">
                    </cfquery>
                </cfif>

                <!--- Set the document to its new position --->
                <cfquery datasource="pasc_regionj">
                    UPDATE dbo.documents
                    SET display_order = <cfqueryparam value="#arguments.newOrder#" cfsqltype="cf_sql_integer">,
                        updated_at = GETDATE()
                    WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
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

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

</cfcomponent>
