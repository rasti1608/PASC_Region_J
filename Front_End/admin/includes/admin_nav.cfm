<cfprocessingdirective pageencoding="utf-8">
<!---
*******************************************************************************
* File:        /admin/includes/admin_nav.cfm
* Created:     October 28, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Admin sidebar navigation (reusable across all admin pages)
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<cfsilent>
<!--- Determine which section is active based on current page --->
<cfset currentPage = listLast(cgi.script_name, "/")>
<cfset currentFolder = listGetAt(cgi.script_name, listLen(cgi.script_name, "/") - 1, "/")>

<cfset isDashboard = (currentPage CONTAINS "dashboard")>
<cfset isAnnouncements = (currentFolder EQ "announcements")>
<cfset isForms = (currentFolder EQ "forms")>
<cfset isGallery = (currentFolder EQ "gallery")>
<cfset isDocuments = (currentFolder EQ "documents")>
<cfset isContacts = (currentFolder EQ "contacts")>
<cfset isUsers = (currentFolder EQ "users")>
<cfset isProfile = (currentPage CONTAINS "profile")>

<!--- Get count of new contact submissions for badge --->
<cftry>
    <cfquery name="qNewContacts" datasource="#application.datasource#">
        SELECT COUNT(*) as newCount
        FROM dbo.contact_submissions
        WHERE status = 'new'
    </cfquery>
    <cfset newContactCount = qNewContacts.newCount>
    <cfcatch>
        <cfset newContactCount = 0>
    </cfcatch>
</cftry>
</cfsilent>

<aside class="admin-sidebar">
    <div class="sidebar-header">
        <img src="/assets/img/logo.png" alt="PASC Region J" class="sidebar-logo">
        <h2>Admin Panel</h2>
    </div>
    
    <nav class="sidebar-nav">
        <cfoutput>
            <a href="/admin/dashboard.cfm" class="nav-item #isDashboard ? 'active' : ''#">
                <span class="nav-icon">📊</span>
                <span class="nav-text">Dashboard</span>
            </a>
            
            <a href="/admin/announcements/index.cfm" class="nav-item #isAnnouncements ? 'active' : ''#">
                <span class="nav-icon">📢</span>
                <span class="nav-text">Announcements</span>
            </a>
            
            <a href="/admin/forms/index.cfm" class="nav-item #isForms ? 'active' : ''#">
                <span class="nav-icon">📝</span>
                <span class="nav-text">Forms</span>
            </a>
            
            <a href="/admin/gallery/index.cfm" class="nav-item #isGallery ? 'active' : ''#">
                <span class="nav-icon">📷</span>
                <span class="nav-text">Gallery</span>
            </a>
            
            <a href="/admin/documents/index.cfm" class="nav-item #isDocuments ? 'active' : ''#">
                <span class="nav-icon">📁</span>
                <span class="nav-text">Documents</span>
            </a>

            <a href="/admin/contacts/index.cfm" class="nav-item #isContacts ? 'active' : ''#">
                <span class="nav-icon">📧</span>
                <span class="nav-text">Contact Submissions</span>
                <cfif newContactCount gt 0>
                    <span class="nav-badge">#newContactCount#</span>
                </cfif>
            </a>

            <!--- User Management (Admin Only) --->
            <cfif ListFindNoCase(session.permissions, "user_management")>
                <div class="nav-divider"></div>

                <a href="/admin/users/index.cfm" class="nav-item #isUsers ? 'active' : ''#">
                    <span class="nav-icon">👥</span>
                    <span class="nav-text">User Management</span>
                </a>
            </cfif>

            <div class="nav-divider"></div>
            
            <a href="/" class="nav-item" target="_blank">
                <span class="nav-icon">🌐</span>
                <span class="nav-text">View Website</span>
            </a>
            
            <a href="/admin/logout.cfm" class="nav-item nav-logout">
                <span class="nav-icon">🚪</span>
                <span class="nav-text">Logout</span>
            </a>
        </cfoutput>
    </nav>
    
    <div class="sidebar-footer">
        <cfoutput>
            <div class="user-info">
                <!--- Profile Picture or Placeholder --->
                <cfif structKeyExists(session, "profile_picture") AND len(session.profile_picture)>
                    <img src="/assets/img/profiles/#session.profile_picture#"
                         alt="Profile"
                         style="width:40px; height:40px; border-radius:50%; margin-bottom:10px; display:block; margin-left:auto; margin-right:auto;">
                <cfelse>
                    <div style="width:40px; height:40px; border-radius:50%; background:##4fc3f7;
                                display:flex; align-items:center; justify-content:center;
                                font-size:20px; margin:0 auto 10px auto;">
                        👤
                    </div>
                </cfif>

                <strong>#request.admin_full_name#</strong><br>
                <small style="color: ##b0b8d4;">
                    <cfif structKeyExists(session, "role_name")>
                        #session.role_name#
                    <cfelse>
                        @#request.admin_username#
                    </cfif>
                </small>
            </div>

            <!--- My Profile Link --->
            <div style="margin-top:15px;">
                <a href="/admin/profile.cfm" class="nav-item #isProfile ? 'active' : ''#" style="padding:8px 15px;">
                    <span class="nav-icon">⚙️</span>
                    <span class="nav-text">My Profile</span>
                </a>
            </div>
        </cfoutput>
    </div>
</aside>
