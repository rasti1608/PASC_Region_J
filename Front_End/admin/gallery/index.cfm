<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/gallery/index.cfm
* Created:     October 28, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     List all gallery images with manage options
*              Tabs for About Page and Gallery
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Get page location from URL (default to About Page) --->
<cfparam name="url.location" default="about_page">

<!--- Handle order change from dropdown --->
<cfif structKeyExists(form, "image_id") AND structKeyExists(form, "new_order")>
    <!--- Get current order of the image being moved --->
    <cfquery name="qMoving" datasource="#application.datasource#">
        SELECT display_order FROM dbo.gallery
        WHERE id = <cfqueryparam value="#form.image_id#" cfsqltype="cf_sql_integer">
        AND page_location = <cfqueryparam value="#url.location#" cfsqltype="cf_sql_varchar">
    </cfquery>
    
    <cfif qMoving.recordCount GT 0>
        <cfset old_order = qMoving.display_order>
        <cfset new_order = form.new_order>
        
        <cfif old_order NEQ new_order>
            <!--- Moving image to new position --->
            <cfif new_order LT old_order>
                <!--- Moving UP - shift others down --->
                <cfquery datasource="#application.datasource#">
                    UPDATE dbo.gallery
                    SET display_order = display_order + 1
                    WHERE display_order >= <cfqueryparam value="#new_order#" cfsqltype="cf_sql_integer">
                    AND display_order < <cfqueryparam value="#old_order#" cfsqltype="cf_sql_integer">
                    AND page_location = <cfqueryparam value="#url.location#" cfsqltype="cf_sql_varchar">
                </cfquery>
            <cfelse>
                <!--- Moving DOWN - shift others up --->
                <cfquery datasource="#application.datasource#">
                    UPDATE dbo.gallery
                    SET display_order = display_order - 1
                    WHERE display_order > <cfqueryparam value="#old_order#" cfsqltype="cf_sql_integer">
                    AND display_order <= <cfqueryparam value="#new_order#" cfsqltype="cf_sql_integer">
                    AND page_location = <cfqueryparam value="#url.location#" cfsqltype="cf_sql_varchar">
                </cfquery>
            </cfif>
            
            <!--- Set the image to its new position --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.gallery
                SET display_order = <cfqueryparam value="#new_order#" cfsqltype="cf_sql_integer">
                WHERE id = <cfqueryparam value="#form.image_id#" cfsqltype="cf_sql_integer">
            </cfquery>
        </cfif>
    </cfif>
    
    <cflocation url="index.cfm?location=#url.location#" addtoken="false">
</cfif>

<!--- Handle status toggle --->
<cfif structKeyExists(url, "toggle") AND isNumeric(url.toggle)>
    <cfquery datasource="#application.datasource#">
        UPDATE dbo.gallery
        SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
        WHERE id = <cfqueryparam value="#url.toggle#" cfsqltype="cf_sql_integer">
    </cfquery>
    <cflocation url="index.cfm?location=#url.location#" addtoken="false">
</cfif>

<!--- Get all images for the selected location --->
<cfquery name="qImages" datasource="#application.datasource#">
    SELECT 
        id,
        title,
        filename,
        original_filename,
        file_extension,
        file_size,
        is_active,
        page_location,
        display_order,
        uploaded_at,
        updated_at
    FROM dbo.gallery
    WHERE page_location = <cfqueryparam value="#url.location#" cfsqltype="cf_sql_varchar">
    ORDER BY display_order ASC, uploaded_at DESC
</cfquery>

<!--- Count images by location --->
<cfquery name="qAboutCount" datasource="#application.datasource#">
    SELECT COUNT(*) as image_count FROM dbo.gallery WHERE page_location = 'about_page'
</cfquery>

<cfquery name="qGalleryCount" datasource="#application.datasource#">
    SELECT COUNT(*) as image_count FROM dbo.gallery WHERE page_location = 'gallery'
</cfquery>

<cfset totalCount = qImages.recordCount>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Gallery - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
    <style>
        /* Tab Navigation */
        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            border-bottom: 2px solid #e0e0e0;
        }
        
        .tab {
            padding: 12px 24px;
            background: none;
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            color: #666;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        }
        
        .tab:hover {
            color: #4a90e2;
            background: rgba(74, 144, 226, 0.05);
        }
        
        .tab.active {
            color: #4a90e2;
            border-bottom-color: #4a90e2;
            font-weight: 600;
        }
        
        .tab-badge {
            display: inline-block;
            background: #e0e0e0;
            color: #666;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            margin-left: 6px;
            font-weight: 600;
        }
        
        .tab.active .tab-badge {
            background: #4a90e2;
            color: white;
        }
        
        /* Image thumbnail in table */
        .img-thumbnail {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 4px;
            border: 2px solid #e0e0e0;
        }
        
        .file-info {
            font-size: 12px;
            color: #999;
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
                <h1>Gallery Management</h1>
                <p>Manage images for About page and event gallery</p>
            </div>
            
            <!--- Tabs Navigation --->
            <div class="tabs">
                <cfoutput>
                    <a href="index.cfm?location=about_page" class="tab #url.location EQ 'about_page' ? 'active' : ''#">
                        📄 About Page
                        <span class="tab-badge">#qAboutCount.image_count#</span>
                    </a>
                    <a href="index.cfm?location=gallery" class="tab #url.location EQ 'gallery' ? 'active' : ''#">
                        🖼️ Gallery
                        <span class="tab-badge">#qGalleryCount.image_count#</span>
                    </a>
                </cfoutput>
            </div>
            
            <div class="section">
                <cfoutput>
                    <div class="section-header">
                        <h2>#url.location EQ 'about_page' ? 'About Page' : 'Gallery'# Images (#qImages.recordCount#)</h2>
                        <a href="upload.cfm?location=#url.location#" class="btn btn-primary">+ Add New Image</a>
                    </div>
                </cfoutput>
                
                <cfif qImages.recordCount EQ 0>
                    <div class="empty-state">
                        <cfoutput>
                            <p>No images found for #lcase(url.location EQ 'about_page' ? 'About Page' : 'Gallery')#.</p>
                            <a href="upload.cfm?location=#url.location#" class="btn btn-primary">Upload Your First Image</a>
                        </cfoutput>
                    </div>
                <cfelse>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Thumbnail</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <cfoutput query="qImages">
                                <tr>
                                    <td class="text-center">
                                        <form method="post" action="index.cfm?location=#url.location#" style="margin: 0;">
                                            <input type="hidden" name="image_id" value="#id#">
                                            <select name="new_order" onchange="this.form.submit()" style="padding: 5px; border-radius: 4px; border: 1px solid ##ddd;">
                                                <cfloop from="1" to="#totalCount#" index="loopIndex">
                                                    <option value="#loopIndex#" <cfif display_order EQ loopIndex>selected</cfif>>#loopIndex#</option>
                                                </cfloop>
                                            </select>
                                        </form>
                                    </td>
                                    <td>
                                        <img src="/assets/img/gallery/#filename#" alt="#htmlEditFormat(title)#" class="img-thumbnail">
                                    </td>
                                    <td>
                                        <strong>#htmlEditFormat(title)#</strong>
                                        <br>
                                        <span class="file-info">#original_filename# (#file_extension#, #numberFormat(file_size/1024, '9.9')# KB)</span>
                                    </td>
                                    <td>
                                        <cfif is_active>
                                            <span class="badge badge-success">✓ Active</span>
                                        <cfelse>
                                            <span class="badge badge-inactive">Inactive</span>
                                        </cfif>
                                    </td>
                                    <td class="actions">
                                        <a href="edit.cfm?id=#id#&location=#url.location#" class="btn btn-sm btn-edit" title="Edit">✏️</a>
                                        <a href="index.cfm?location=#url.location#&toggle=#id#" class="btn btn-sm btn-toggle" title="Toggle Active/Inactive">
                                            <cfif is_active>👁️<cfelse>🚫</cfif>
                                        </a>
                                        <a href="delete.cfm?id=#id#&location=#url.location#" class="btn btn-sm btn-delete" title="Delete">🗑️</a>
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
