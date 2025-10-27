<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/announcements/edit.cfm
* Created:     October 27, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Edit existing announcement
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Get announcement ID --->
<cfif NOT structKeyExists(url, "id") OR NOT isNumeric(url.id)>
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Get existing announcement --->
<cfquery name="qAnnouncement" datasource="#application.datasource#">
    SELECT 
        id,
        title,
        content,
        is_active,
        is_featured,
        display_order,
        publish_start,
        publish_end
    FROM dbo.announcements
    WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
</cfquery>

<cfif qAnnouncement.recordCount EQ 0>
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Initialize form variables for display --->
<cfif NOT structKeyExists(form, "submit")>
    <!--- Initial page load - set from database --->
    <cfset form.title = qAnnouncement.title>
    <cfset form.content = qAnnouncement.content>
    <cfset form.is_active = qAnnouncement.is_active>
    <cfset form.is_featured = qAnnouncement.is_featured>
    <cfset form.publish_start = dateFormat(qAnnouncement.publish_start, 'yyyy-mm-dd')>
    <cfset form.publish_end = isDate(qAnnouncement.publish_end) ? dateFormat(qAnnouncement.publish_end, 'yyyy-mm-dd') : ''>
</cfif>
<cfset errorMessage = "">

<!--- Process form submission --->
<cfif structKeyExists(form, "submit")>
    <!--- Handle checkbox values (they won't exist in form if unchecked) --->
    <cfparam name="form.is_active" default="0">
    <cfparam name="form.is_featured" default="0">
    
    <!--- Validate --->
    <cfif len(trim(form.title)) EQ 0>
        <cfset errorMessage = "Title is required.">
    <cfelseif len(trim(form.content)) EQ 0>
        <cfset errorMessage = "Content is required.">
    <cfelse>
        <!--- Update announcement --->
        <cftry>
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.announcements
                SET title = <cfqueryparam value="#trim(form.title)#" cfsqltype="cf_sql_varchar">,
                    content = <cfqueryparam value="#trim(form.content)#" cfsqltype="cf_sql_varchar">,
                    is_active = <cfqueryparam value="#form.is_active#" cfsqltype="cf_sql_bit">,
                    is_featured = <cfqueryparam value="#form.is_featured#" cfsqltype="cf_sql_bit">,
                    publish_start = <cfqueryparam value="#form.publish_start#" cfsqltype="cf_sql_date">,
                    publish_end = <cfif len(trim(form.publish_end)) GT 0>
                        <cfqueryparam value="#form.publish_end#" cfsqltype="cf_sql_date">
                    <cfelse>
                        NULL
                    </cfif>,
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
            </cfquery>
            
            <!--- Redirect to list --->
            <cflocation url="index.cfm" addtoken="false">
            
            <cfcatch>
                <cfset errorMessage = "Error updating announcement: #cfcatch.message#">
            </cfcatch>
        </cftry>
    </cfif>
</cfif>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Announcement - PASC Region J Admin</title>
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
                <h1>Edit Announcement</h1>
                <p><a href="index.cfm">← Back to Announcements</a></p>
            </div>
            
            <div class="section">
                <cfif len(errorMessage) GT 0>
                    <div class="alert alert-error">
                        <cfoutput>#errorMessage#</cfoutput>
                    </div>
                </cfif>
                
                <cfoutput>
                <form method="post" action="edit.cfm?id=#url.id#" class="admin-form">
                    <div class="form-group">
                        <label for="title">Title *</label>
                        <input 
                            type="text" 
                            id="title" 
                            name="title" 
                            value="#htmlEditFormat(form.title)#"
                            required 
                            maxlength="255"
                            placeholder="Enter announcement title">
                        <small>Keep it short and clear</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="content">Content *</label>
                        <textarea 
                            id="content" 
                            name="content" 
                            rows="6" 
                            required
                            placeholder="Enter announcement content">#htmlEditFormat(form.content)#</textarea>
                        <small>This will appear on the homepage</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="publish_start">Publish Start Date *</label>
                        <input 
                            type="date" 
                            id="publish_start" 
                            name="publish_start" 
                            value="#form.publish_start#"
                            required>
                        <small>Announcement will appear on homepage starting this date</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="publish_end">Publish End Date (Optional)</label>
                        <input 
                            type="date" 
                            id="publish_end" 
                            name="publish_end" 
                            value="#form.publish_end#">
                        <small>Leave empty for no end date</small>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input 
                                type="checkbox" 
                                name="is_featured" 
                                value="1"
                                <cfif form.is_featured EQ 1>checked</cfif>>
                            <span>Featured announcement (highlighted on homepage)</span>
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input 
                                type="checkbox" 
                                name="is_active" 
                                value="1"
                                <cfif form.is_active EQ 1>checked</cfif>>
                            <span>Active (ready to publish)</span>
                        </label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" name="submit" class="btn btn-primary">Update Announcement</button>
                        <a href="index.cfm" class="btn btn-secondary">Cancel</a>
                        <a href="delete.cfm?id=#url.id#" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this announcement?');">Delete</a>
                    </div>
                </form>
                </cfoutput>
            </div>
        </main>
    </div>
</body>
</html>
