<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/gallery/delete.cfm
* Created:     October 28, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Delete gallery image with confirmation
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Get image ID and location from URL --->
<cfparam name="url.id" default="0">
<cfparam name="url.location" default="about_page">

<!--- Handle the delete action --->
<cfif structKeyExists(form, "confirm_delete") AND form.confirm_delete EQ "yes">
    <!--- First, get the display_order, page_location, and filename of the image being deleted --->
    <cfquery name="qGetInfo" datasource="#application.datasource#">
        SELECT display_order, page_location, filename
        FROM dbo.gallery
        WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
    </cfquery>
    
    <cfif qGetInfo.recordCount GT 0>
        <cfset deleted_order = qGetInfo.display_order>
        <cfset deleted_location = qGetInfo.page_location>
        <cfset deleted_filename = qGetInfo.filename>
        
        <!--- Delete the image file from disk --->
        <cfset uploadPath = expandPath("/assets/img/gallery")>
        <cftry>
            <cffile action="delete" file="#uploadPath#/#deleted_filename#">
            <cfcatch>
                <!--- Ignore if file doesn't exist --->
            </cfcatch>
        </cftry>
        
        <!--- Delete the image from database --->
        <cfquery datasource="#application.datasource#">
            DELETE FROM dbo.gallery
            WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
        </cfquery>
        
        <!--- Now shift all images with higher display_order down by 1 (in same location) --->
        <cfquery datasource="#application.datasource#">
            UPDATE dbo.gallery
            SET display_order = display_order - 1
            WHERE display_order > <cfqueryparam value="#deleted_order#" cfsqltype="cf_sql_integer">
            AND page_location = <cfqueryparam value="#deleted_location#" cfsqltype="cf_sql_varchar">
        </cfquery>
    </cfif>
    
    <cflocation url="index.cfm?location=#url.location#" addtoken="false">
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
        is_active
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
    <title>Delete Image - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
    <style>
        .delete-confirmation {
            max-width: 600px;
            margin: 60px auto;
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .delete-icon {
            width: 80px;
            height: 80px;
            background: #fff3cd;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin: 0 auto 30px;
        }
        
        .delete-confirmation h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 28px;
        }
        
        .delete-confirmation p {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 16px;
        }
        
        .image-details {
            background: #f8f9fa;
            border-left: 4px solid #dc3545;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
            text-align: center;
        }
        
        .image-details img {
            max-width: 100%;
            max-height: 300px;
            border-radius: 8px;
            margin-bottom: 15px;
            border: 2px solid #e0e0e0;
        }
        
        .image-details h3 {
            margin: 0 0 10px 0;
            color: #2c3e50;
            font-size: 18px;
        }
        
        .image-details p {
            margin: 5px 0;
            color: #666;
            text-align: center;
            font-size: 14px;
        }
        
        .warning-note {
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .warning-note strong {
            color: #856404;
        }
        
        .warning-note p {
            margin: 0;
            color: #856404;
            text-align: left;
        }
        
        .delete-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
        }
        
        .btn-confirm-delete {
            background: #dc3545;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: background 0.3s;
        }
        
        .btn-confirm-delete:hover {
            background: #c82333;
        }
        
        .btn-cancel {
            background: #6c757d;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.3s;
        }
        
        .btn-cancel:hover {
            background: #5a6268;
        }
    </style>
</head>
<body>
    <div class="admin-wrapper">
        <!--- Sidebar Navigation --->
        <cfinclude template="../includes/admin_nav.cfm">
        
        <!--- Main Content Area --->
        <main class="admin-content">
            <cfoutput query="qImage">
                <div class="delete-confirmation">
                    <div class="delete-icon">⚠️</div>
                    <h1>Delete Image?</h1>
                    <p>Are you sure you want to delete this image? This action cannot be undone.</p>
                    
                    <div class="image-details">
                        <img src="/assets/img/gallery/#filename#" alt="#htmlEditFormat(title)#">
                        <h3>#htmlEditFormat(title)#</h3>
                        <p>
                            <strong>Location:</strong> #page_location EQ 'about_page' ? 'About Page' : 'Gallery'# | 
                            <strong>Status:</strong> #is_active ? 'Active' : 'Inactive'#
                        </p>
                        <p>
                            <small>#original_filename# (#file_extension#, #numberFormat(file_size/1024, '9.9')# KB)</small>
                        </p>
                    </div>
                    
                    <div class="warning-note">
                        <span style="font-size: 24px;">⚠️</span>
                        <p><strong>Note:</strong> This will permanently delete the image file and remove it from the website immediately.</p>
                    </div>
                    
                    <form method="post" action="delete.cfm?id=#id#&location=#page_location#">
                        <input type="hidden" name="confirm_delete" value="yes">
                        <div class="delete-actions">
                            <button type="submit" class="btn-confirm-delete">
                                🗑️ Yes, Delete Image
                            </button>
                            <a href="index.cfm?location=#page_location#" class="btn-cancel">✕ Cancel</a>
                        </div>
                    </form>
                </div>
            </cfoutput>
        </main>
    </div>
</body>
</html>
