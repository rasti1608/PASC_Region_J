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
            (SELECT COUNT(*) FROM dbo.forms WHERE is_active = 1) as active_forms
    </cfquery>
    <cfcatch>
        <!--- If query fails, set defaults --->
        <cfset qStats = queryNew("active_announcements,active_forms", "integer,integer")>
        <cfset queryAddRow(qStats)>
        <cfset querySetCell(qStats, "active_announcements", 0)>
        <cfset querySetCell(qStats, "active_forms", 0)>
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
        <aside class="admin-sidebar">
            <div class="sidebar-header">
                <img src="/assets/img/logo.png" alt="PASC Region J" class="sidebar-logo">
                <h2>Admin Panel</h2>
            </div>
            
            <nav class="sidebar-nav">
                <a href="dashboard.cfm" class="nav-item active">
                    <span class="nav-icon">📊</span>
                    <span class="nav-text">Dashboard</span>
                </a>
                
                <a href="announcements/index.cfm" class="nav-item">
                    <span class="nav-icon">📢</span>
                    <span class="nav-text">Announcements</span>
                </a>
                
                <a href="forms/index.cfm" class="nav-item">
                    <span class="nav-icon">📝</span>
                    <span class="nav-text">Forms</span>
                </a>
                
                <a href="gallery/index.cfm" class="nav-item" title="Coming Soon">
                    <span class="nav-icon">📷</span>
                    <span class="nav-text">Gallery</span>
                    <span class="coming-soon">Soon</span>
                </a>
                
                <div class="nav-divider"></div>
                
                <a href="/" class="nav-item" target="_blank">
                    <span class="nav-icon">🌐</span>
                    <span class="nav-text">View Website</span>
                </a>
                
                <a href="logout.cfm" class="nav-item nav-logout">
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
                        <div class="stat-icon">👥</div>
                        <div class="stat-info">
                            <h3>1</h3>
                            <p>Active Admin</p>
                        </div>
                        <span class="stat-link">Online</span>
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
