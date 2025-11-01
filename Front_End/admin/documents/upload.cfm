<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/documents/upload.cfm
* Created:     October 28, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Upload new document to resources
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Initialize error messages --->
<cfset errors = []>
<cfset successMessage = "">

<!--- Handle form submission --->
<cfif structKeyExists(form, "submit")>
    <!--- Server-side validation --->
    <cfif NOT structKeyExists(form, "title") OR len(trim(form.title)) EQ 0>
        <cfset arrayAppend(errors, "Document Title is required")>
    </cfif>
    
    <!--- Check if file was uploaded --->
    <cfif NOT structKeyExists(form, "document_file") OR len(form.document_file) EQ 0>
        <cfset arrayAppend(errors, "Document File is required")>
    <cfelse>
        <!--- Get file upload details --->
        <cfset uploadPath = expandPath("/assets/documents")>
        
        <!--- Create directory if it doesn't exist --->
        <cfif NOT directoryExists(uploadPath)>
            <cfdirectory action="create" directory="#uploadPath#">
        </cfif>
        
        <cftry>
            <!--- Upload the file --->
            <cffile action="upload"
                    fileField="document_file"
                    destination="#uploadPath#"
                    nameConflict="makeunique"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation">
            
            <!--- Validate file type --->
            <cfif NOT listFindNoCase("pdf,doc,docx,xls,xlsx,ppt,pptx", cffile.serverFileExt)>
                <cfset arrayAppend(errors, "Invalid file type. Only PDF, Word, Excel, and PowerPoint files are allowed.")>
                <!--- Delete the uploaded file --->
                <cffile action="delete" file="#uploadPath#/#cffile.serverFile#">
            </cfif>
            
            <!--- Validate file size (10MB max for documents) --->
            <cfif cffile.fileSize GT 10485760>
                <cfset arrayAppend(errors, "File size exceeds 10MB maximum. Please choose a smaller document.")>
                <!--- Delete the uploaded file --->
                <cffile action="delete" file="#uploadPath#/#cffile.serverFile#">
            </cfif>
            
            <cfcatch>
                <cfset arrayAppend(errors, "Error uploading file: #cfcatch.message#")>
            </cfcatch>
        </cftry>
    </cfif>
    
    <!--- If no errors, save to database --->
    <cfif arrayLen(errors) EQ 0>
        <!--- Shift all existing documents down by 1 --->
        <cfquery datasource="#application.datasource#">
            UPDATE dbo.documents
            SET display_order = display_order + 1
        </cfquery>
        
        <!--- Insert new document at position 1 (top) --->
        <cfquery datasource="#application.datasource#">
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
                uploaded_by,
                uploaded_at
            ) VALUES (
                <cfqueryparam value="#trim(form.title)#" cfsqltype="cf_sql_varchar">,
                <cfqueryparam value="#trim(form.description)#" cfsqltype="cf_sql_varchar" null="#len(trim(form.description)) EQ 0#">,
                <cfqueryparam value="#cffile.serverFile#" cfsqltype="cf_sql_varchar">,
                <cfqueryparam value="#cffile.clientFile#" cfsqltype="cf_sql_varchar">,
                <cfqueryparam value=".#lcase(cffile.serverFileExt)#" cfsqltype="cf_sql_varchar">,
                <cfqueryparam value="#cffile.fileSize#" cfsqltype="cf_sql_integer">,
                <cfqueryparam value="#trim(form.document_type)#" cfsqltype="cf_sql_varchar" null="#len(trim(form.document_type)) EQ 0#">,
                <cfqueryparam value="#structKeyExists(form, 'is_active') ? 1 : 0#" cfsqltype="cf_sql_bit">,
                1,
                <cfqueryparam value="#request.admin_username#" cfsqltype="cf_sql_varchar" null="#NOT structKeyExists(request, 'admin_username')#">,
                GETDATE()
            )
        </cfquery>
        
        <cflocation url="index.cfm" addtoken="false">
    </cfif>
</cfif>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Document - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
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
                    <h1>Upload New Document</h1>
                    <p>Add a document to the resources section</p>
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
                
                <form method="post" action="upload.cfm" enctype="multipart/form-data" class="admin-form" id="uploadDocumentForm">
                    <div class="form-group">
                        <label for="title">Document Title *</label>
                        <cfoutput>
                            <input type="text" id="title" name="title" required class="form-control" placeholder="e.g., Registration Form 2026" value="#structKeyExists(form, 'title') ? htmlEditFormat(form.title) : ''#">
                        </cfoutput>
                        <small class="form-help">A descriptive title for this document</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Description (Optional)</label>
                        <cfoutput>
                            <textarea id="description" name="description" class="form-control" rows="3" placeholder="Brief description of what this document contains...">#structKeyExists(form, 'description') ? htmlEditFormat(form.description) : ''#</textarea>
                        </cfoutput>
                        <small class="form-help">Optional description to help users understand the document's purpose</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="document_file">Document File *</label>
                        <input type="file" id="document_file" name="document_file" required class="form-control" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx">
                        <small class="form-help">Allowed: PDF, Word (DOC/DOCX), Excel (XLS/XLSX), PowerPoint (PPT/PPTX) | Max size: 10MB</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="document_type">Document Category (Optional)</label>
                        <cfoutput>
                            <input type="text" id="document_type" name="document_type" class="form-control" placeholder="e.g., Forms, Guidelines, Reports" value="#structKeyExists(form, 'document_type') ? htmlEditFormat(form.document_type) : ''#">
                        </cfoutput>
                        <small class="form-help">Optional category to organize documents</small>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="is_active" value="1" checked>
                            <span>Active (visible on website)</span>
                        </label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" name="submit" class="btn btn-primary">
                            📤 Upload Document
                        </button>
                        <a href="index.cfm" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
            </div>
            
            <script>
                // Client-side validation
                document.getElementById('uploadDocumentForm').addEventListener('submit', function(e) {
                    let isValid = true;
                    let errorMessages = [];
                    
                    // Check title
                    const title = document.getElementById('title').value.trim();
                    if (title === '') {
                        isValid = false;
                        errorMessages.push('Document Title is required');
                    }
                    
                    // Check file
                    const fileInput = document.getElementById('document_file');
                    if (fileInput.files.length === 0) {
                        isValid = false;
                        errorMessages.push('Please select a document file');
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
                    
                    if (!isValid) {
                        e.preventDefault();
                        alert('Please fix the following errors:\n\n' + errorMessages.join('\n'));
                    }
                });
            </script>
        </main>
    </div>

    <!--- Session Heartbeat --->
    <cfinclude template="../includes/admin_footer.cfm">
</body>
</html>
