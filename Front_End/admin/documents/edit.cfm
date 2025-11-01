<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/documents/edit.cfm
* Created:     October 28, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Edit existing document
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Get document ID from URL --->
<cfparam name="url.id" default="0">

<!--- Initialize error messages --->
<cfset errors = []>

<!--- Handle form submission --->
<cfif structKeyExists(form, "submit")>
    <!--- Server-side validation --->
    <cfif NOT structKeyExists(form, "title") OR len(trim(form.title)) EQ 0>
        <cfset arrayAppend(errors, "Document Title is required")>
    </cfif>
    
    <!--- Check if user wants to replace the document --->
    <cfset replaceDocument = false>
    <cfif structKeyExists(form, "replace_document") AND form.replace_document EQ "1" AND structKeyExists(form, "new_document_file") AND len(form.new_document_file) GT 0>
        <cfset replaceDocument = true>
        <cfset uploadPath = expandPath("/assets/documents")>
        
        <cftry>
            <!--- Upload the new file --->
            <cffile action="upload"
                    fileField="new_document_file"
                    destination="#uploadPath#"
                    nameConflict="makeunique"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation">
            
            <!--- Validate file type --->
            <cfif NOT listFindNoCase("pdf,doc,docx,xls,xlsx,ppt,pptx", cffile.serverFileExt)>
                <cfset arrayAppend(errors, "Invalid file type. Only PDF, Word, Excel, and PowerPoint files are allowed.")>
                <!--- Delete the uploaded file --->
                <cffile action="delete" file="#uploadPath#/#cffile.serverFile#">
                <cfset replaceDocument = false>
            </cfif>
            
            <!--- Validate file size (10MB max) --->
            <cfif cffile.fileSize GT 10485760>
                <cfset arrayAppend(errors, "File size exceeds 10MB maximum. Please choose a smaller document.")>
                <!--- Delete the uploaded file --->
                <cffile action="delete" file="#uploadPath#/#cffile.serverFile#">
                <cfset replaceDocument = false>
            </cfif>
            
            <cfcatch>
                <cfset arrayAppend(errors, "Error uploading file: #cfcatch.message#")>
                <cfset replaceDocument = false>
            </cfcatch>
        </cftry>
    </cfif>
    
    <!--- If no errors, update database --->
    <cfif arrayLen(errors) EQ 0>
        <!--- If replacing document, delete old file and update filename fields --->
        <cfif replaceDocument>
            <!--- Get old filename to delete --->
            <cfquery name="qOldDoc" datasource="#application.datasource#">
                SELECT filename FROM dbo.documents
                WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
            </cfquery>
            
            <cfif qOldDoc.recordCount GT 0>
                <!--- Delete old file from disk --->
                <cftry>
                    <cffile action="delete" file="#uploadPath#/#qOldDoc.filename#">
                    <cfcatch>
                        <!--- Ignore if file doesn't exist --->
                    </cfcatch>
                </cftry>
            </cfif>
            
            <!--- Update with new file info --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.documents
                SET 
                    title = <cfqueryparam value="#trim(form.title)#" cfsqltype="cf_sql_varchar">,
                    description = <cfqueryparam value="#trim(form.description)#" cfsqltype="cf_sql_varchar" null="#len(trim(form.description)) EQ 0#">,
                    filename = <cfqueryparam value="#cffile.serverFile#" cfsqltype="cf_sql_varchar">,
                    original_filename = <cfqueryparam value="#cffile.clientFile#" cfsqltype="cf_sql_varchar">,
                    file_extension = <cfqueryparam value=".#lcase(cffile.serverFileExt)#" cfsqltype="cf_sql_varchar">,
                    file_size = <cfqueryparam value="#cffile.fileSize#" cfsqltype="cf_sql_integer">,
                    document_type = <cfqueryparam value="#trim(form.document_type)#" cfsqltype="cf_sql_varchar" null="#len(trim(form.document_type)) EQ 0#">,
                    is_active = <cfqueryparam value="#structKeyExists(form, 'is_active') ? 1 : 0#" cfsqltype="cf_sql_bit">,
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
            </cfquery>
        <cfelse>
            <!--- Update without changing the file --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.documents
                SET 
                    title = <cfqueryparam value="#trim(form.title)#" cfsqltype="cf_sql_varchar">,
                    description = <cfqueryparam value="#trim(form.description)#" cfsqltype="cf_sql_varchar" null="#len(trim(form.description)) EQ 0#">,
                    document_type = <cfqueryparam value="#trim(form.document_type)#" cfsqltype="cf_sql_varchar" null="#len(trim(form.document_type)) EQ 0#">,
                    is_active = <cfqueryparam value="#structKeyExists(form, 'is_active') ? 1 : 0#" cfsqltype="cf_sql_bit">,
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
            </cfquery>
        </cfif>
        
        <cflocation url="index.cfm" addtoken="false">
    </cfif>
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
    <title>Edit Document - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
    <style>
        .current-file {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            border: 1px solid #e0e0e0;
        }
        
        .current-file strong {
            display: block;
            margin-bottom: 8px;
            color: #333;
        }
        
        .file-details {
            font-size: 13px;
            color: #666;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .file-icon {
            font-size: 32px;
        }
        
        .replace-option {
            margin-top: 15px;
            padding: 15px;
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 6px;
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

            <div class="content-header">
                <div>
                    <h1>Edit Document</h1>
                    <p>Update document information</p>
                </div>
                <a href="index.cfm" class="btn btn-secondary">← Back to Documents</a>
            </div>
            
            <div class="form-container">
                <!--- Display validation errors --->
                <cfif arrayLen(errors) GT 0>
                    <div class="alert alert-error" style="background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                        <strong>⚠️ Please fix the following errors:</strong>
                        <ul style="margin: 10px 0 0 20px;">
                            <cfloop array="#errors#" index="error">
                                <li><cfoutput>#error#</cfoutput></li>
                            </cfloop>
                        </ul>
                    </div>
                </cfif>
                
                <cfoutput query="qDocument">
                    <!--- Current File Info --->
                    <div class="current-file">
                        <strong>Current Document:</strong>
                        <div class="file-details">
                            <span class="file-icon">
                                <cfif file_extension EQ ".pdf">📄
                                <cfelseif listFindNoCase(".doc,.docx", file_extension)>📝
                                <cfelseif listFindNoCase(".xls,.xlsx", file_extension)>📊
                                <cfelseif listFindNoCase(".ppt,.pptx", file_extension)>📽️
                                <cfelse>📎</cfif>
                            </span>
                            <div>
                                <div>#htmlEditFormat(original_filename)#</div>
                                <div style="font-size: 12px; color: ##999;">
                                    #ucase(replace(file_extension, ".", ""))# | #numberFormat(file_size/1024, '9.9')# KB
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <form method="post" action="edit.cfm?id=#id#" enctype="multipart/form-data" class="admin-form" id="editDocumentForm">
                        <div class="form-group">
                            <label for="title">Document Title *</label>
                            <input type="text" id="title" name="title" required class="form-control" placeholder="e.g., Registration Form 2026" value="#htmlEditFormat(title)#">
                            <small class="form-help">A descriptive title for this document</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="description">Description (Optional)</label>
                            <textarea id="description" name="description" class="form-control" rows="3" placeholder="Brief description of what this document contains...">#htmlEditFormat(description)#</textarea>
                            <small class="form-help">Optional description to help users understand the document's purpose</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="document_type">Document Category (Optional)</label>
                            <input type="text" id="document_type" name="document_type" class="form-control" placeholder="e.g., Forms, Guidelines, Reports" value="#htmlEditFormat(document_type)#">
                            <small class="form-help">Optional category to organize documents</small>
                        </div>
                        
                        <div class="replace-option">
                            <label class="checkbox-label">
                                <input type="checkbox" id="replace_document" name="replace_document" value="1" onchange="toggleFileUpload()">
                                <span><strong>Replace this document with a new file</strong></span>
                            </label>
                            
                            <div id="new_file_upload" style="display: none; margin-top: 15px;">
                                <label for="new_document_file">New Document File</label>
                                <input type="file" id="new_document_file" name="new_document_file" class="form-control" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx">
                                <small class="form-help">Allowed: PDF, Word, Excel, PowerPoint | Max size: 10MB</small>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="is_active" value="1" #is_active ? 'checked' : ''#>
                                <span>Active (visible on website)</span>
                            </label>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" name="submit" class="btn btn-primary">
                                💾 Save Changes
                            </button>
                            <a href="index.cfm" class="btn btn-secondary">Cancel</a>
                        </div>
                    </form>
                </cfoutput>
            </div>
            
            <script>
                function toggleFileUpload() {
                    const checkbox = document.getElementById('replace_document');
                    const uploadDiv = document.getElementById('new_file_upload');
                    const fileInput = document.getElementById('new_document_file');
                    
                    if (checkbox.checked) {
                        uploadDiv.style.display = 'block';
                        fileInput.required = true;
                    } else {
                        uploadDiv.style.display = 'none';
                        fileInput.required = false;
                        fileInput.value = '';
                    }
                }
                
                // Client-side validation
                document.getElementById('editDocumentForm').addEventListener('submit', function(e) {
                    let isValid = true;
                    let errorMessages = [];
                    
                    // Check title
                    const title = document.getElementById('title').value.trim();
                    if (title === '') {
                        isValid = false;
                        errorMessages.push('Document Title is required');
                    }
                    
                    // Check replacement file if checkbox is checked
                    const replaceCheckbox = document.getElementById('replace_document');
                    if (replaceCheckbox.checked) {
                        const fileInput = document.getElementById('new_document_file');
                        if (fileInput.files.length === 0) {
                            isValid = false;
                            errorMessages.push('Please select a replacement document file');
                        } else {
                            const file = fileInput.files[0];
                            const fileName = file.name.toLowerCase();
                            const validExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
                            const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
                            
                            if (!hasValidExtension) {
                                isValid = false;
                                errorMessages.push('Invalid file type. Only PDF, Word, Excel, and PowerPoint files are allowed');
                            }
                            
                            if (file.size > 10485760) {
                                isValid = false;
                                errorMessages.push('File size exceeds 10MB. Please choose a smaller document');
                            }
                        }
                    }
                    
                    if (!isValid) {
                        e.preventDefault();
                        alert('Please fix the following errors:\n\n' + errorMessages.join('\n'));
                    }
                });
            </script>
        </main>
    </div>
</body>
</html>
