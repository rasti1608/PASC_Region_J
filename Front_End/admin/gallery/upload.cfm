<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/gallery/upload.cfm
* Created:     October 28, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Upload new image to gallery
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Get location from URL --->
<cfparam name="url.location" default="about_page">

<!--- Initialize error messages --->
<cfset errors = []>
<cfset successMessage = "">

<!--- Handle form submission --->
<cfif structKeyExists(form, "submit")>
    <!--- Server-side validation --->
    <cfif NOT structKeyExists(form, "title") OR len(trim(form.title)) EQ 0>
        <cfset arrayAppend(errors, "Image Title is required")>
    </cfif>
    
    <cfif NOT structKeyExists(form, "page_location") OR len(trim(form.page_location)) EQ 0>
        <cfset arrayAppend(errors, "Page Location is required")>
    </cfif>
    
    <!--- Check if file was uploaded --->
    <cfif NOT structKeyExists(form, "image_file") OR len(form.image_file) EQ 0>
        <cfset arrayAppend(errors, "Image File is required")>
    <cfelse>
        <!--- Get file upload details --->
        <cfset uploadPath = expandPath("/assets/img/gallery")>
        
        <cftry>
            <!--- Upload the file --->
            <cffile action="upload"
                    fileField="image_file"
                    destination="#uploadPath#"
                    nameConflict="makeunique"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp">
            
            <!--- Validate file type --->
            <cfif NOT listFindNoCase("jpg,jpeg,png,gif,webp", cffile.serverFileExt)>
                <cfset arrayAppend(errors, "Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed.")>
                <!--- Delete the uploaded file --->
                <cffile action="delete" file="#uploadPath#/#cffile.serverFile#">
            </cfif>
            
            <!--- Validate file size (5MB max) --->
            <cfif cffile.fileSize GT 5242880>
                <cfset arrayAppend(errors, "File size exceeds 5MB maximum. Please choose a smaller image.")>
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
        <!--- Shift all existing images in this location down by 1 --->
        <cfquery datasource="#application.datasource#">
            UPDATE dbo.gallery
            SET display_order = display_order + 1
            WHERE page_location = <cfqueryparam value="#form.page_location#" cfsqltype="cf_sql_varchar">
        </cfquery>
        
        <!--- Insert new image at position 1 (top) --->
        <cfquery datasource="#application.datasource#">
            INSERT INTO dbo.gallery (
                title,
                filename,
                original_filename,
                file_extension,
                file_size,
                page_location,
                is_active,
                display_order,
                uploaded_by,
                uploaded_at
            ) VALUES (
                <cfqueryparam value="#trim(form.title)#" cfsqltype="cf_sql_varchar">,
                <cfqueryparam value="#cffile.serverFile#" cfsqltype="cf_sql_varchar">,
                <cfqueryparam value="#cffile.clientFile#" cfsqltype="cf_sql_varchar">,
                <cfqueryparam value=".#cffile.serverFileExt#" cfsqltype="cf_sql_varchar">,
                <cfqueryparam value="#cffile.fileSize#" cfsqltype="cf_sql_integer">,
                <cfqueryparam value="#form.page_location#" cfsqltype="cf_sql_varchar">,
                <cfqueryparam value="#structKeyExists(form, 'is_active') ? 1 : 0#" cfsqltype="cf_sql_bit">,
                1,
                <cfqueryparam value="#request.admin_username#" cfsqltype="cf_sql_varchar" null="#NOT structKeyExists(request, 'admin_username')#">,
                GETDATE()
            )
        </cfquery>
        
        <cflocation url="index.cfm?location=#form.page_location#" addtoken="false">
    </cfif>
</cfif>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Image - PASC Region J Admin</title>
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
                <cfoutput>
                    <div>
                        <h1>Upload New Image</h1>
                        <p>Add an image to #url.location EQ 'about_page' ? 'About Page' : 'Gallery'#</p>
                    </div>
                    <a href="index.cfm?location=#url.location#" class="btn btn-secondary">← Back to Gallery</a>
                </cfoutput>
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
                
                <cfoutput>
                    <form method="post" action="upload.cfm?location=#url.location#" enctype="multipart/form-data" class="admin-form" id="uploadImageForm">
                        <div class="form-group">
                            <label for="title">Image Title *</label>
                            <input type="text" id="title" name="title" required class="form-control" placeholder="e.g., Conference 2025 Group Photo" value="#structKeyExists(form, 'title') ? htmlEditFormat(form.title) : ''#">
                            <small class="form-help">A descriptive title for this image</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="image_file">Image File *</label>
                            <input type="file" id="image_file" name="image_file" required class="form-control" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp">
                            <small class="form-help">Allowed: JPG, PNG, GIF, WebP | Max size: 5MB</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="page_location">Page Location *</label>
                            <select id="page_location" name="page_location" required class="form-control">
                                <option value="about_page" #url.location EQ 'about_page' ? 'selected' : ''#>About Page</option>
                                <option value="gallery" #url.location EQ 'gallery' ? 'selected' : ''#>Gallery</option>
                            </select>
                            <small class="form-help">Where should this image appear on the website?</small>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="is_active" value="1" checked>
                                <span>Active (visible on website)</span>
                            </label>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" name="submit" class="btn btn-primary">
                                📤 Upload Image
                            </button>
                            <a href="index.cfm?location=#url.location#" class="btn btn-secondary">Cancel</a>
                        </div>
                    </form>
                </cfoutput>
            </div>
            
            <script>
                // Client-side validation
                document.getElementById('uploadImageForm').addEventListener('submit', function(e) {
                    let isValid = true;
                    let errorMessages = [];
                    
                    // Check title
                    const title = document.getElementById('title').value.trim();
                    if (title === '') {
                        isValid = false;
                        errorMessages.push('Image Title is required');
                    }
                    
                    // Check file
                    const fileInput = document.getElementById('image_file');
                    if (fileInput.files.length === 0) {
                        isValid = false;
                        errorMessages.push('Please select an image file');
                    } else {
                        const file = fileInput.files[0];
                        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                        
                        if (!validTypes.includes(file.type)) {
                            isValid = false;
                            errorMessages.push('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed');
                        }
                        
                        if (file.size > 5242880) {
                            isValid = false;
                            errorMessages.push('File size exceeds 5MB. Please choose a smaller image');
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
