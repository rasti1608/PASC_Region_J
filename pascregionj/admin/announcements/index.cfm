<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/announcements/index.cfm
* Created:     October 27, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     List all announcements with manage options
*              View, edit, delete, and toggle active status
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Handle order change from dropdown --->
<cfif structKeyExists(form, "announcement_id") AND structKeyExists(form, "new_order")>
    <!--- Get current order of the announcement being moved --->
    <cfquery name="qMoving" datasource="#application.datasource#">
        SELECT display_order FROM dbo.announcements
        WHERE id = <cfqueryparam value="#form.announcement_id#" cfsqltype="cf_sql_integer">
    </cfquery>
    
    <cfif qMoving.recordCount GT 0>
        <cfset old_order = qMoving.display_order>
        <cfset new_order = form.new_order>
        
        <cfif old_order NEQ new_order>
            <!--- Moving announcement to new position --->
            <cfif new_order LT old_order>
                <!--- Moving UP - shift others down --->
                <cfquery datasource="#application.datasource#">
                    UPDATE dbo.announcements
                    SET display_order = display_order + 1
                    WHERE display_order >= <cfqueryparam value="#new_order#" cfsqltype="cf_sql_integer">
                    AND display_order < <cfqueryparam value="#old_order#" cfsqltype="cf_sql_integer">
                </cfquery>
            <cfelse>
                <!--- Moving DOWN - shift others up --->
                <cfquery datasource="#application.datasource#">
                    UPDATE dbo.announcements
                    SET display_order = display_order - 1
                    WHERE display_order > <cfqueryparam value="#old_order#" cfsqltype="cf_sql_integer">
                    AND display_order <= <cfqueryparam value="#new_order#" cfsqltype="cf_sql_integer">
                </cfquery>
            </cfif>
            
            <!--- Set the announcement to its new position --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.announcements
                SET display_order = <cfqueryparam value="#new_order#" cfsqltype="cf_sql_integer">
                WHERE id = <cfqueryparam value="#form.announcement_id#" cfsqltype="cf_sql_integer">
            </cfquery>
        </cfif>
    </cfif>
    
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Handle status toggle --->
<cfif structKeyExists(url, "toggle") AND isNumeric(url.toggle)>
    <cfquery datasource="#application.datasource#">
        UPDATE dbo.announcements
        SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
        WHERE id = <cfqueryparam value="#url.toggle#" cfsqltype="cf_sql_integer">
    </cfquery>
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Get all announcements --->
<cfquery name="qAnnouncements" datasource="#application.datasource#">
    SELECT 
        id,
        title,
        content,
        is_active,
        is_featured,
        display_order,
        publish_start,
        publish_end,
        created_at,
        updated_at
    FROM dbo.announcements
    ORDER BY display_order ASC, publish_start DESC, created_at DESC
</cfquery>

<cfset totalCount = qAnnouncements.recordCount>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Announcements - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
</head>
<body>
    <div class="admin-wrapper">
        <!--- Sidebar Navigation --->
        <aside class="admin-sidebar">
            <div class="sidebar-header">
                <img src="/assets/img/logo.png" alt="PASC Region J" class="sidebar-logo">
                <h2>Admin Panel</h2>
            </div>
            
            <nav class="sidebar-nav">
                <a href="/admin/dashboard.cfm" class="nav-item">
                    <span class="nav-icon">📊</span>
                    <span class="nav-text">Dashboard</span>
                </a>
                
                <a href="/admin/announcements/index.cfm" class="nav-item active">
                    <span class="nav-icon">📢</span>
                    <span class="nav-text">Announcements</span>
                </a>
                
                <a href="/admin/forms/index.cfm" class="nav-item">
                    <span class="nav-icon">📝</span>
                    <span class="nav-text">Forms</span>
                </a>
                
                <a href="/admin/gallery/index.cfm" class="nav-item" title="Coming Soon">
                    <span class="nav-icon">📷</span>
                    <span class="nav-text">Gallery</span>
                    <span class="coming-soon">Soon</span>
                </a>
                
                <div class="nav-divider"></div>
                
                <a href="/" class="nav-item" target="_blank">
                    <span class="nav-icon">🌐</span>
                    <span class="nav-text">View Website</span>
                </a>
                
                <a href="/admin/logout.cfm" class="nav-item nav-logout">
                    <span class="nav-icon">🚪</span>
                    <span class="nav-text">Logout</span>
                </a>
            </nav>
            
            <div class="sidebar-footer">
                <cfoutput>
                    <p class="user-info">
                        <strong>#request.admin_full_name#</strong><br>
                        <small>@#request.admin_username#</small>
                    </p>
                </cfoutput>
            </div>
        </aside>
        
        <!--- Main Content Area --->
        <main class="admin-content">
            <div class="content-header">
                <h1>Manage Announcements</h1>
                <p>Create and manage homepage announcements</p>
            </div>
            
            <div class="section">
                <cfoutput>
                	<div class="section-header">
	                    <h2>All Announcements (#qAnnouncements.recordCount#)</h2>
	                    <a href="add.cfm" class="btn btn-primary">+ Add New Announcement</a>
	                </div>
                </cfoutput>
                
                <cfif qAnnouncements.recordCount EQ 0>
                    <div class="empty-state">
                        <p>No announcements found.</p>
                        <a href="add.cfm" class="btn btn-primary">Create Your First Announcement</a>
                    </div>
                <cfelse>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Publish Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <cfoutput query="qAnnouncements">
                                <cfset now_date = now()>
                                <cfset is_future = dateCompare(publish_start, now_date) GT 0>
                                <cfset is_expired = isDate(publish_end) AND dateCompare(publish_end, now_date) LT 0>
                                
                                <tr>
                                    <td class="text-center">
                                        <form method="post" action="index.cfm" style="margin: 0;">
                                            <input type="hidden" name="announcement_id" value="#id#">
                                            <select name="new_order" onchange="this.form.submit()" style="padding: 5px; border-radius: 4px; border: 1px solid ##ddd;">
                                                <cfloop from="1" to="#totalCount#" index="loopIndex">
                                                    <option value="#loopIndex#" <cfif display_order EQ loopIndex>selected</cfif>>#loopIndex#</option>
                                                </cfloop>
                                            </select>
                                        </form>
                                    </td>
                                    <td>
                                        <strong>#htmlEditFormat(title)#</strong>
                                        <cfif is_featured>
                                            <span class="badge" style="background: ##fff9c4; color: ##f57f17; font-size: 0.75rem;">⭐ Featured</span>
                                        </cfif>
                                        <cfif len(content) GT 100>
                                            <br><small class="text-muted">#left(htmlEditFormat(content), 100)#...</small>
                                        <cfelse>
                                            <br><small class="text-muted">#htmlEditFormat(content)#</small>
                                        </cfif>
                                    </td>
                                    <td>
                                        <cfif NOT is_active>
                                            <span class="badge badge-inactive">Inactive</span>
                                        <cfelseif is_expired>
                                            <span class="badge" style="background: ##ffebee; color: ##c62828;">Expired</span>
                                        <cfelseif is_future>
                                            <span class="badge" style="background: ##e3f2fd; color: ##1565c0;">📅 Future</span>
                                        <cfelse>
                                            <span class="badge badge-success">✓ Live</span>
                                        </cfif>
                                    </td>
                                    <td>
                                        #dateFormat(publish_start, "mmm d, yyyy")#
                                        <cfif isDate(publish_end)>
                                            <br><small class="text-muted">to #dateFormat(publish_end, "mmm d, yyyy")#</small>
                                        </cfif>
                                    </td>
                                    <td class="actions">
                                        <a href="edit.cfm?id=#id#" class="btn btn-sm btn-edit" title="Edit">✏️</a>
                                        <a href="index.cfm?toggle=#id#" class="btn btn-sm btn-toggle" title="Toggle Active/Inactive">
                                            <cfif is_active>👁️<cfelse>🚫</cfif>
                                        </a>
                                        <a href="delete.cfm?id=#id#" class="btn btn-sm btn-delete" title="Delete" onclick="return confirm('Are you sure you want to delete this announcement?');">🗑️</a>
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
