<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/documents/delete.cfm
* Created:     October 28, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Delete document with confirmation
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Get document ID from URL --->
<cfparam name="url.id" default="0">

<!--- Handle the delete action --->
<cfif structKeyExists(form, "confirm_delete") AND form.confirm_delete EQ "yes">
    <!--- First, get the display_order and filename of the document being deleted --->
    <cfquery name="qGetInfo" datasource="#application.datasource#">
        SELECT display_order, filename
        FROM dbo.documents
        WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
    </cfquery>
    
    <cfif qGetInfo.recordCount GT 0>
        <cfset deleted_order = qGetInfo.display_order>
        <cfset deleted_filename = qGetInfo.filename>
        
        <!--- Delete the document file from disk --->
        <cfset uploadPath = expandPath("/assets/documents")>
        <cftry>
            <cffile action="delete" file="#uploadPath#/#deleted_filename#">
            <cfcatch>
                <!--- Ignore if file doesn't exist --->
            </cfcatch>
        </cftry>
        
        <!--- Delete the document from database --->
        <cfquery datasource="#application.datasource#">
            DELETE FROM dbo.documents
            WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
        </cfquery>
        
        <!--- Now shift all documents with higher display_order down by 1 --->
        <cfquery datasource="#application.datasource#">
            UPDATE dbo.documents
            SET display_order = display_order - 1
            WHERE display_order > <cfqueryparam value="#deleted_order#" cfsqltype="cf_sql_integer">
        </cfquery>
    </cfif>
    
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Get document details --->
<cfquery name="qDocument" datasource="#application.datasource#">
    SELECT 
        id,
        title,
        description,
        filename,
        original_filename,
        file_extension,
        file_size,
        document_type,
        is_active
    FROM dbo.documents
    WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
</cfquery>

<!--- Redirect if document not found --->
<cfif qDocument.recordCount EQ 0>
    <cflocation url="index.cfm" addtoken="false">
</cfif>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delete Document - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
    <style>
        .delete-confirm {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .delete-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .delete-icon {
            font-size: 64px;
            margin-bottom: 20px;
            opacity: 0.5;
        }
        
        .document-preview {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid #dc3545;
        }
        
        .doc-icon-large {
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0;
            border-radius: 8px;
            font-size: 48px;
            border: 2px solid #e0e0e0;
            margin: 0 auto 15px;
        }
        
        .doc-icon-large.pdf { background: #ffebee; border-color: #ef5350; }
        .doc-icon-large.doc, .doc-icon-large.docx { background: #e3f2fd; border-color: #42a5f5; }
        .doc-icon-large.xls, .doc-icon-large.xlsx { background: #e8f5e9; border-color: #66bb6a; }
        .doc-icon-large.ppt, .doc-icon-large.pptx { background: #fff3e0; border-color: #ff9800; }
        
        .document-info {
            text-align: center;
        }
        
        .document-info h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        
        .document-info h3 a {
            color: #2c5282;
            text-decoration: none;
        }
        
        .document-info h3 a:hover {
            text-decoration: underline;
        }
        
        .document-info p {
            margin: 5px 0;
            color: #666;
        }
        
        .warning-message {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        
        .warning-message .warning-icon {
            font-size: 20px;
            flex-shrink: 0;
        }
        
        .warning-message .warning-text {
            flex: 1;
        }
        
        .warning-message strong {
            display: block;
            color: #856404;
            margin-bottom: 5px;
        }
        
        .warning-message p {
            margin: 0;
            color: #856404;
        }
        
        .delete-actions {
            display: flex;
            gap: 10px;
            margin-top: 30px;
        }
        
        .delete-actions .btn {
            flex: 1;
        }
        
        .btn-danger {
            background: #dc3545;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .btn-danger:hover {
            background: #c82333;
        }
    </style>
</head>
<body>
    <div class="admin-wrapper">
        <!--- Sidebar Navigation --->
        <cfinclude template="../includes/admin_nav.cfm">
        
        <!--- Main Content Area --->
        <main class="admin-content">
            <!--- Fixed Header Bar --->
            <cfinclude template="../includes/admin_header.cfm">

            <cfoutput query="qDocument">
                <div class="delete-confirm">
                    <div class="delete-header">
                        <div class="delete-icon">⚠️</div>
                        <h1>Delete Document?</h1>
                        <p>Are you sure you want to delete this document?</p>
                    </div>
                    
                    <div class="document-preview">
                        <div class="doc-icon-large #lcase(replace(file_extension, '.', ''))#">
                            <cfif file_extension EQ ".pdf">📄
                            <cfelseif listFindNoCase(".doc,.docx", file_extension)>📝
                            <cfelseif listFindNoCase(".xls,.xlsx", file_extension)>📊
                            <cfelseif listFindNoCase(".ppt,.pptx", file_extension)>📽️
                            <cfelse>📎</cfif>
                        </div>
                        <div class="document-info">
                            <h3><a href="/assets/documents/#filename#" target="_blank">#htmlEditFormat(title)#</a></h3>
                            <cfif len(trim(description)) GT 0>
                                <p style="font-style: italic;">#htmlEditFormat(description)#</p>
                            </cfif>
                            <p>
                                <strong>#htmlEditFormat(original_filename)#</strong><br>
                                #ucase(replace(file_extension, ".", ""))# | #numberFormat(file_size/1024, '9.9')# KB
                                <cfif len(trim(document_type)) GT 0><br>Category: #htmlEditFormat(document_type)#</cfif>
                            </p>
                            <p>
                                <cfif is_active>
                                    <span class="badge badge-success">✓ Active</span>
                                <cfelse>
                                    <span class="badge badge-inactive">Inactive</span>
                                </cfif>
                            </p>
                        </div>
                    </div>
                    
                    <div class="warning-message">
                        <span class="warning-icon">⚠️</span>
                        <div class="warning-text">
                            <strong>Warning</strong>
                            <p>This action cannot be undone. The document file will be permanently deleted from the server.</p>
                        </div>
                    </div>
                    
                    <form method="post" action="delete.cfm?id=#id#">
                        <div class="delete-actions">
                            <button type="submit" name="confirm_delete" value="yes" class="btn btn-danger">
                                🗑️ Yes, Delete Document
                            </button>
                            <a href="index.cfm" class="btn btn-secondary">
                                ✕ Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </cfoutput>
        </main>
    </div>
</body>
</html>
