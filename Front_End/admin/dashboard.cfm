<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/dashboard.cfm
* Created:     October 27, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Admin dashboard - main page after login
*              Shows overview and navigation to all admin sections
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../includes/auth_check.cfm">

<!--- Get statistics --->
<cftry>
    <cfquery name="qStats" datasource="#application.datasource#">
        SELECT
            (SELECT COUNT(*) FROM dbo.announcements WHERE is_active = 1) as active_announcements,
            (SELECT COUNT(*) FROM dbo.forms WHERE is_active = 1) as active_forms,
            (SELECT COUNT(*) FROM dbo.gallery WHERE is_active = 1) as active_gallery
    </cfquery>
    <cfcatch>
        <!--- If query fails, set defaults --->
        <cfset qStats = queryNew("active_announcements,active_forms,active_gallery", "integer,integer,integer")>
        <cfset queryAddRow(qStats)>
        <cfset querySetCell(qStats, "active_announcements", 0)>
        <cfset querySetCell(qStats, "active_forms", 0)>
        <cfset querySetCell(qStats, "active_gallery", 0)>
    </cfcatch>
</cftry>

<!--- Get active users count (last 30 minutes) --->
<cftry>
    <cfquery name="qActiveUsers" datasource="#application.datasource#">
        SELECT COUNT(user_id) AS active_count
        FROM dbo.admin_sessions
        WHERE last_activity > DATEADD(MINUTE, -30, GETDATE())
    </cfquery>
    <cfcatch>
        <!--- If query fails, set default --->
        <cfset qActiveUsers = queryNew("active_count", "integer")>
        <cfset queryAddRow(qActiveUsers)>
        <cfset querySetCell(qActiveUsers, "active_count", 0)>
    </cfcatch>
</cftry>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - PASC Region J</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
</head>
<body>
    <div class="admin-wrapper">
        <!--- Sidebar Navigation --->
        <cfinclude template="includes/admin_nav.cfm">

        <!--- Main Content Area --->
        <main class="admin-content">
            <!--- Fixed Header Bar --->
            <cfinclude template="includes/admin_header.cfm">

            <div class="content-header">
                <h1>Dashboard</h1>
                <cfoutput>
                    <p class="welcome-message">Welcome back, #request.admin_full_name#!</p>
                </cfoutput>
            </div>
            
            <!--- Statistics Cards --->
            <div class="stats-grid">
                <cfoutput>
                    <div class="stat-card">
                        <div class="stat-icon">📢</div>
                        <div class="stat-info">
                            <h3>#qStats.active_announcements#</h3>
                            <p>Active Announcements</p>
                        </div>
                        <a href="announcements/index.cfm" class="stat-link">Manage →</a>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">📝</div>
                        <div class="stat-info">
                            <h3>#qStats.active_forms#</h3>
                            <p>Active Forms</p>
                        </div>
                        <a href="forms/index.cfm" class="stat-link">Manage →</a>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">📷</div>
                        <div class="stat-info">
                            <h3>#qStats.active_gallery#</h3>
                            <p>Active Gallery Images</p>
                        </div>
                        <a href="gallery/index.cfm" class="stat-link">Manage →</a>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-info">
                            <h3>#qActiveUsers.active_count#</h3>
                            <p>Active Users</p>
                        </div>
                        <cfif ListFindNoCase(session.permissions, "user_management")>
                            <a href="users/index.cfm" class="stat-link">Manage →</a>
                        <cfelse>
                            <span class="stat-link">Currently logged in</span>
                        </cfif>
                    </div>
                </cfoutput>
            </div>
            
            <!--- Quick Actions --->
            <div class="section">
                <h2>Quick Actions</h2>
                <div class="action-grid">
                    <a href="announcements/add.cfm" class="action-card">
                        <div class="action-icon">➕</div>
                        <h3>New Announcement</h3>
                        <p>Create a new homepage announcement</p>
                    </a>
                    
                    <a href="forms/add.cfm" class="action-card">
                        <div class="action-icon">📋</div>
                        <h3>Add Form</h3>
                        <p>Add a new Google Form embed</p>
                    </a>
                    
                    <a href="gallery/upload.cfm" class="action-card">
                        <div class="action-icon">📷</div>
                        <h3>Add Image</h3>
                        <p>Upload a new gallery image</p>
                    </a>
                    
                    <a href="/" target="_blank" class="action-card">
                        <div class="action-icon">🌐</div>
                        <h3>View Website</h3>
                        <p>Open public website in new tab</p>
                    </a>
                </div>
            </div>
            
            <!--- Recent Activity (placeholder for now) --->
            <div class="section">
                <h2>System Information</h2>
                <div class="info-box">
                    <div class="info-row">
                        <span class="info-label">Conference Date:</span>
                        <span class="info-value">February 13, 2026</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Conference Theme:</span>
                        <span class="info-value">Lead Beyond Limits</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Website Version:</span>
                        <span class="info-value">1.0.0 MVP</span>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
