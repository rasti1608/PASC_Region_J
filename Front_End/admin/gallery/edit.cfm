<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/gallery/edit.cfm
* Created:     October 28, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Edit existing gallery image
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Get image ID and location from URL --->
<cfparam name="url.id" default="0">
<cfparam name="url.location" default="about_page">

<!--- Initialize error messages --->
<cfset errors = []>

<!--- Handle form submission --->
<cfif structKeyExists(form, "submit")>
    <!--- Server-side validation --->
    <cfif NOT structKeyExists(form, "title") OR len(trim(form.title)) EQ 0>
        <cfset arrayAppend(errors, "Image Title is required")>
    </cfif>
    
    <cfif NOT structKeyExists(form, "page_location") OR len(trim(form.page_location)) EQ 0>
        <cfset arrayAppend(errors, "Page Location is required")>
    </cfif>
    
    <!--- Check if user wants to replace the image --->
    <cfset replaceImage = false>
    <cfif structKeyExists(form, "replace_image") AND form.replace_image EQ "1" AND structKeyExists(form, "new_image_file") AND len(form.new_image_file) GT 0>
        <cfset replaceImage = true>
        <cfset uploadPath = expandPath("/assets/img/gallery")>
        
        <cftry>
            <!--- Upload the new file --->
            <cffile action="upload"
                    fileField="new_image_file"
                    destination="#uploadPath#"
                    nameConflict="makeunique"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp">
            
            <!--- Validate file type --->
            <cfif NOT listFindNoCase("jpg,jpeg,png,gif,webp", cffile.serverFileExt)>
                <cfset arrayAppend(errors, "Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed.")>
                <!--- Delete the uploaded file --->
                <cffile action="delete" file="#uploadPath#/#cffile.serverFile#">
                <cfset replaceImage = false>
            </cfif>
            
            <!--- Validate file size (5MB max) --->
            <cfif cffile.fileSize GT 5242880>
                <cfset arrayAppend(errors, "File size exceeds 5MB maximum. Please choose a smaller image.")>
                <!--- Delete the uploaded file --->
                <cffile action="delete" file="#uploadPath#/#cffile.serverFile#">
                <cfset replaceImage = false>
            </cfif>
            
            <cfcatch>
                <cfset arrayAppend(errors, "Error uploading file: #cfcatch.message#")>
                <cfset replaceImage = false>
            </cfcatch>
        </cftry>
    </cfif>
    
    <!--- If no errors, update database --->
    <cfif arrayLen(errors) EQ 0>
        <cfif replaceImage>
            <!--- Get old filename to delete it --->
            <cfquery name="qOldImage" datasource="#application.datasource#">
                SELECT filename FROM dbo.gallery
                WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
            </cfquery>
            
            <!--- Delete old image file --->
            <cftry>
                <cffile action="delete" file="#uploadPath#/#qOldImage.filename#">
                <cfcatch>
                    <!--- Ignore if file doesn't exist --->
                </cfcatch>
            </cftry>
            
            <!--- Update with new image --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.gallery
                SET 
                    title = <cfqueryparam value="#trim(form.title)#" cfsqltype="cf_sql_varchar">,
                    filename = <cfqueryparam value="#cffile.serverFile#" cfsqltype="cf_sql_varchar">,
                    original_filename = <cfqueryparam value="#cffile.clientFile#" cfsqltype="cf_sql_varchar">,
                    file_extension = <cfqueryparam value=".#cffile.serverFileExt#" cfsqltype="cf_sql_varchar">,
                    file_size = <cfqueryparam value="#cffile.fileSize#" cfsqltype="cf_sql_integer">,
                    page_location = <cfqueryparam value="#form.page_location#" cfsqltype="cf_sql_varchar">,
                    is_active = <cfqueryparam value="#structKeyExists(form, 'is_active') ? 1 : 0#" cfsqltype="cf_sql_bit">,
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
            </cfquery>
        <cfelse>
            <!--- Update without changing image --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.gallery
                SET 
                    title = <cfqueryparam value="#trim(form.title)#" cfsqltype="cf_sql_varchar">,
                    page_location = <cfqueryparam value="#form.page_location#" cfsqltype="cf_sql_varchar">,
                    is_active = <cfqueryparam value="#structKeyExists(form, 'is_active') ? 1 : 0#" cfsqltype="cf_sql_bit">,
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
            </cfquery>
        </cfif>
        
        <cflocation url="index.cfm?location=#form.page_location#" addtoken="false">
    </cfif>
</cfif>

<!--- Get image details --->
<cfquery name="qImage" datasource="#application.datasource#">
    SELECT 
        id,
        title,
        filename,
        original_filename,
        file_extension,
        file_size,
        page_location,
        is_active,
        display_order,
        uploaded_at,
        updated_at
    FROM dbo.gallery
    WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
</cfquery>

<!--- Redirect if image not found --->
<cfif qImage.recordCount EQ 0>
    <cflocation url="index.cfm?location=#url.location#" addtoken="false">
</cfif>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Image - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
    <style>
        .current-image {
            max-width: 300px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            margin: 15px 0;
        }
        
        .replace-image-section {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
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
                <cfoutput query="qImage">
                    <div>
                        <h1>Edit Image</h1>
                        <p>Modify image details for #page_location EQ 'about_page' ? 'About Page' : 'Gallery'#</p>
                    </div>
                    <a href="index.cfm?location=#page_location#" class="btn btn-secondary">← Back to Gallery</a>
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
                
                <cfoutput query="qImage">
                    <form method="post" action="edit.cfm?id=#id#&location=#page_location#" enctype="multipart/form-data" class="admin-form" id="editImageForm">
                        <div class="form-group">
                            <label>Current Image</label>
                            <img src="/assets/img/gallery/#filename#" alt="#htmlEditFormat(title)#" class="current-image">
                            <br>
                            <small class="form-help">#original_filename# (#file_extension#, #numberFormat(file_size/1024, '9.9')# KB)</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="title">Image Title *</label>
                            <input type="text" id="title" name="title" required class="form-control" value="#htmlEditFormat(title)#" placeholder="e.g., Conference 2025 Group Photo">
                            <small class="form-help">A descriptive title for this image</small>
                        </div>
                        
                        <div class="replace-image-section">
                            <label class="checkbox-label">
                                <input type="checkbox" id="replace_image" name="replace_image" value="1" onchange="document.getElementById('new_image_file').disabled = !this.checked;">
                                <span>Replace image file</span>
                            </label>
                            
                            <div class="form-group" style="margin-top: 10px;">
                                <label for="new_image_file">New Image File</label>
                                <input type="file" id="new_image_file" name="new_image_file" class="form-control" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" disabled>
                                <small class="form-help">Check the box above to replace the current image</small>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="page_location">Page Location *</label>
                            <select id="page_location" name="page_location" required class="form-control">
                                <option value="about_page" #page_location EQ 'about_page' ? 'selected' : ''#>About Page</option>
                                <option value="gallery" #page_location EQ 'gallery' ? 'selected' : ''#>Gallery</option>
                            </select>
                            <small class="form-help">Where should this image appear on the website?</small>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="is_active" value="1" #is_active ? 'checked' : ''#>
                                <span>Active (visible on website)</span>
                            </label>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" name="submit" class="btn btn-primary">
                                💾 Update Image
                            </button>
                            <a href="index.cfm?location=#page_location#" class="btn btn-secondary">Cancel</a>
                        </div>
                    </form>
                </cfoutput>
            </div>
            
            <script>
                // Client-side validation
                document.getElementById('editImageForm').addEventListener('submit', function(e) {
                    const title = document.getElementById('title').value.trim();
                    if (title === '') {
                        e.preventDefault();
                        alert('Image Title is required');
                    }
                });
            </script>
        </main>
    </div>
</body>
</html>
