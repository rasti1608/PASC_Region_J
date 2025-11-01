<cfprocessingdirective pageencoding="utf-8">
<!---
*******************************************************************************
* File:        /admin/includes/admin_header.cfm
* Created:     November 1, 2025
* Author:      Rastislav Toscak
*
* Purpose:     Fixed admin header bar with profile and logout buttons
*              Appears at top of all admin pages
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<div class="admin-header">
    <div class="header-right">
        <cfoutput>
            <!--- Profile/Settings Button --->
            <a href="/admin/profile.cfm" class="header-profile-link" title="Profile & Settings">
                <cfif structKeyExists(session, "profile_picture") AND len(session.profile_picture)>
                    <img src="/assets/img/profiles/#session.profile_picture#"
                         alt="Profile"
                         class="header-profile-pic">
                <cfelse>
                    <span class="header-avatar">👤</span>
                </cfif>
                <span class="header-settings-icon">⚙️</span>
            </a>

            <!--- Logout Button --->
            <a href="/admin/logout.cfm" class="header-logout-link" title="Logout">
                🚪
            </a>
        </cfoutput>
    </div>
</div>
