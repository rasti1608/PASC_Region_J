<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/documents/index.cfm
* Created:     October 28, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     List all documents with manage options
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Handle order change from dropdown --->
<cfif structKeyExists(form, "document_id") AND structKeyExists(form, "new_order")>
    <!--- Get current order of the document being moved --->
    <cfquery name="qMoving" datasource="#application.datasource#">
        SELECT display_order FROM dbo.documents
        WHERE id = <cfqueryparam value="#form.document_id#" cfsqltype="cf_sql_integer">
    </cfquery>
    
    <cfif qMoving.recordCount GT 0>
        <cfset old_order = qMoving.display_order>
        <cfset new_order = form.new_order>
        
        <cfif old_order NEQ new_order>
            <!--- Moving document to new position --->
            <cfif new_order LT old_order>
                <!--- Moving UP - shift others down --->
                <cfquery datasource="#application.datasource#">
                    UPDATE dbo.documents
                    SET display_order = display_order + 1
                    WHERE display_order >= <cfqueryparam value="#new_order#" cfsqltype="cf_sql_integer">
                    AND display_order < <cfqueryparam value="#old_order#" cfsqltype="cf_sql_integer">
                </cfquery>
            <cfelse>
                <!--- Moving DOWN - shift others up --->
                <cfquery datasource="#application.datasource#">
                    UPDATE dbo.documents
                    SET display_order = display_order - 1
                    WHERE display_order > <cfqueryparam value="#old_order#" cfsqltype="cf_sql_integer">
                    AND display_order <= <cfqueryparam value="#new_order#" cfsqltype="cf_sql_integer">
                </cfquery>
            </cfif>
            
            <!--- Set the document to its new position --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.documents
                SET display_order = <cfqueryparam value="#new_order#" cfsqltype="cf_sql_integer">
                WHERE id = <cfqueryparam value="#form.document_id#" cfsqltype="cf_sql_integer">
            </cfquery>
        </cfif>
    </cfif>
    
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Handle status toggle --->
<cfif structKeyExists(url, "toggle") AND isNumeric(url.toggle)>
    <cfquery datasource="#application.datasource#">
        UPDATE dbo.documents
        SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
        WHERE id = <cfqueryparam value="#url.toggle#" cfsqltype="cf_sql_integer">
    </cfquery>
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Get all documents --->
<cfquery name="qDocuments" datasource="#application.datasource#">
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

<cfset totalCount = qDocuments.recordCount>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Documents - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
    <style>
        /* Document icon styling */
        .doc-icon {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0;
            border-radius: 6px;
            font-size: 24px;
            border: 2px solid #e0e0e0;
        }
        
        .doc-icon.pdf { background: #ffebee; border-color: #ef5350; }
        .doc-icon.doc, .doc-icon.docx { background: #e3f2fd; border-color: #42a5f5; }
        .doc-icon.xls, .doc-icon.xlsx { background: #e8f5e9; border-color: #66bb6a; }
        .doc-icon.ppt, .doc-icon.pptx { background: #fff3e0; border-color: #ff9800; }
        
        .file-info {
            font-size: 12px;
            color: #999;
        }
        
        .doc-description {
            font-size: 13px;
            color: #666;
            margin-top: 4px;
            max-width: 400px;
        }
    </style>
</head>
<body>
    <div class="admin-wrapper">
        <!--- Sidebar Navigation --->
        <cfinclude template="../includes/admin_nav.cfm">
        
        <!--- Main Content Area --->
        <main class="admin-content">
            <div class="content-header">
                <h1>Documents Management</h1>
                <p>Manage downloadable resources and documents</p>
            </div>
            
            <div class="section">
                <cfoutput>
                    <div class="section-header">
                        <h2>All Documents (#qDocuments.recordCount#)</h2>
                        <a href="upload.cfm" class="btn btn-primary">+ Add New Document</a>
                    </div>
                </cfoutput>
                
                <cfif qDocuments.recordCount EQ 0>
                    <div class="empty-state">
                        <p>No documents found.</p>
                        <a href="upload.cfm" class="btn btn-primary">Upload Your First Document</a>
                    </div>
                <cfelse>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Type</th>
                                <th>Document Details</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <cfoutput query="qDocuments">
                                <tr>
                                    <td class="text-center">
                                        <form method="post" action="index.cfm" style="margin: 0;">
                                            <input type="hidden" name="document_id" value="#id#">
                                            <select name="new_order" onchange="this.form.submit()" style="padding: 5px; border-radius: 4px; border: 1px solid ##ddd;">
                                                <cfloop from="1" to="#totalCount#" index="loopIndex">
                                                    <option value="#loopIndex#" <cfif display_order EQ loopIndex>selected</cfif>>#loopIndex#</option>
                                                </cfloop>
                                            </select>
                                        </form>
                                    </td>
                                    <td>
                                        <div class="doc-icon #lcase(file_extension)#">
                                            <cfif file_extension EQ ".pdf">📄
                                            <cfelseif listFindNoCase(".doc,.docx", file_extension)>📝
                                            <cfelseif listFindNoCase(".xls,.xlsx", file_extension)>📊
                                            <cfelseif listFindNoCase(".ppt,.pptx", file_extension)>📽️
                                            <cfelse>📎</cfif>
                                        </div>
                                    </td>
                                    <td>
                                        <strong><a href="/assets/documents/#filename#" target="_blank" style="color: ##2c5282; text-decoration: none;">#htmlEditFormat(title)#</a></strong>
                                        <cfif len(trim(description)) GT 0>
                                            <div class="doc-description">#htmlEditFormat(description)#</div>
                                        </cfif>
                                        <br>
                                        <span class="file-info">
                                            #original_filename# (#ucase(replace(file_extension, ".", ""))#, #numberFormat(file_size/1024, '9.9')# KB)
                                            <cfif len(trim(document_type)) GT 0> | Category: #htmlEditFormat(document_type)#</cfif>
                                        </span>
                                    </td>
                                    <td>
                                        <cfif is_active>
                                            <span class="badge badge-success">✓ Active</span>
                                        <cfelse>
                                            <span class="badge badge-inactive">Inactive</span>
                                        </cfif>
                                    </td>
                                    <td class="actions">
                                        <a href="edit.cfm?id=#id#" class="btn btn-sm btn-edit" title="Edit">✏️</a>
                                        <a href="index.cfm?toggle=#id#" class="btn btn-sm btn-toggle" title="Toggle Active/Inactive">
                                            <cfif is_active>👁️<cfelse>🚫</cfif>
                                        </a>
                                        <a href="delete.cfm?id=#id#" class="btn btn-sm btn-delete" title="Delete">🗑️</a>
                                    </td>
                                </tr>
                            </cfoutput>
                        </tbody>
                    </table>
                </cfif>
            </div>
        </main>
    </div>
</body>
</html>
