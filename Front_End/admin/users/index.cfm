<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/users/index.cfm
* Created:     November 1, 2025
* Author:      Rastislav Toscak
*
* Purpose:     User management list page
*              Display all admin users with search, filter, and management options
*
* Features:    - Search by username, name, or email
*              - Filter by role (All, Admin, Content Manager)
*              - Filter by status (All, Active, Inactive)
*              - Toggle user active/inactive status
*              - Pagination (10 users per page)
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Include authentication check --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Permission check: Only users with user_management permission can access this page --->
<cfif NOT ListFindNoCase(session.permissions, "user_management")>
    <cflocation url="/admin/dashboard.cfm?error=no_permission" addtoken="false">
    <cfabort>
</cfif>

<!--- Initialize filter session variables if not exists --->
<cfparam name="session.users_statusFilter" default="all">
<cfparam name="session.users_roleFilter" default="all">

<!--- Handle status filter changes --->
<cfif structKeyExists(url, "statusFilter")>
    <cfset session.users_statusFilter = url.statusFilter>
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Handle role filter changes --->
<cfif structKeyExists(url, "roleFilter")>
    <cfset session.users_roleFilter = url.roleFilter>
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Handle toggle active/inactive --->
<cfif structKeyExists(url, "toggle") AND isNumeric(url.toggle)>
    <cftry>
        <!--- Prevent user from deactivating themselves --->
        <cfif url.toggle EQ session.admin_user_id>
            <cfset variables.errorMessage = "You cannot deactivate your own account.">
        <cfelse>
            <!--- Check if this is the last active Admin --->
            <cfquery name="checkLastAdmin" datasource="#application.datasource#">
                SELECT COUNT(*) as admin_count
                FROM dbo.admin_users
                WHERE role_id = 1
                AND is_active = 1
                AND id <> <cfqueryparam value="#url.toggle#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfquery name="getTogglingUser" datasource="#application.datasource#">
                SELECT role_id, is_active, username
                FROM dbo.admin_users
                WHERE id = <cfqueryparam value="#url.toggle#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Prevent toggling master admin account --->
            <cfif getTogglingUser.username EQ "admin">
                <cfset variables.errorMessage = "Cannot modify master admin account status.">
            <cfelseif getTogglingUser.role_id EQ 1 AND getTogglingUser.is_active EQ 1 AND checkLastAdmin.admin_count EQ 0>
                <cfset variables.errorMessage = "Cannot deactivate the last active Administrator.">
            <cfelse>
                <cfquery datasource="#application.datasource#">
                    UPDATE dbo.admin_users
                    SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END,
                        updated_at = GETDATE()
                    WHERE id = <cfqueryparam value="#url.toggle#" cfsqltype="cf_sql_integer">
                </cfquery>
                <cfset variables.successMessage = "User status updated successfully.">
            </cfif>
        </cfif>
        <cfcatch type="any">
            <cfset variables.errorMessage = "Error updating user status: #cfcatch.message#">
        </cfcatch>
    </cftry>
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Query users based on filters --->
<cftry>
    <cfquery name="qUsers" datasource="#application.datasource#">
        SELECT
            u.id,
            u.username,
            u.full_name,
            u.email,
            u.role_id,
            u.is_active,
            u.last_login,
            u.created_at,
            r.role_name
        FROM dbo.admin_users u
        LEFT JOIN dbo.roles r ON u.role_id = r.id
        WHERE 1=1

        <!--- Apply status filter --->
        <cfif session.users_statusFilter EQ "active">
            AND u.is_active = 1
        <cfelseif session.users_statusFilter EQ "inactive">
            AND u.is_active = 0
        </cfif>

        <!--- Apply role filter --->
        <cfif session.users_roleFilter NEQ "all" AND isNumeric(session.users_roleFilter)>
            AND u.role_id = <cfqueryparam value="#session.users_roleFilter#" cfsqltype="cf_sql_integer">
        </cfif>

        ORDER BY u.created_at DESC
    </cfquery>

    <cfcatch type="any">
        <cfset variables.errorMessage = "Error loading users: #cfcatch.message#">
        <cfset qUsers = queryNew("id,username,full_name,email,role_id,is_active,last_login,created_at,role_name", "integer,varchar,varchar,varchar,integer,bit,timestamp,timestamp,varchar")>
    </cfcatch>
</cftry>

<!--- Get total count for display --->
<cfset variables.totalUsers = qUsers.recordCount>

</cfsilent><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
</head>
<body>
    <div class="admin-wrapper">
        <!--- Include Sidebar Navigation --->
        <cfinclude template="../includes/admin_nav.cfm">

        <!--- Main Content --->
        <main class="admin-content">
            <!--- Content Header --->
            <div class="content-header">
                <h1>User Management</h1>
                <p>Manage admin users and their roles</p>
            </div>

            <!--- Success/Error Messages --->
            <cfif structKeyExists(variables, "successMessage")>
                <div class="alert alert-success">
                    <cfoutput>#variables.successMessage#</cfoutput>
                </div>
            </cfif>

            <cfif structKeyExists(variables, "errorMessage")>
                <div class="alert alert-error">
                    <cfoutput>#variables.errorMessage#</cfoutput>
                </div>
            </cfif>

            <!--- Users Section --->
            <div class="section">
                <div class="section-header">
                    <h2>Users (<cfoutput>#variables.totalUsers#</cfoutput>)</h2>
                    <a href="add.cfm" class="btn btn-primary">+ Add New User</a>
                </div>

                <!--- Filters and Search --->
                <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                    <!--- Status Filter --->
                    <div style="flex: 1; min-width: 200px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2d3561;">Filter by Status:</label>
                        <cfoutput>
                            <select onchange="window.location='index.cfm?statusFilter=' + this.value"
                                    style="width: 100%; padding: 8px; border-radius: 8px; border: 2px solid ##e0e0e0;">
                                <option value="all" #session.users_statusFilter EQ "all" ? "selected" : ""#>All Statuses</option>
                                <option value="active" #session.users_statusFilter EQ "active" ? "selected" : ""#>Active</option>
                                <option value="inactive" #session.users_statusFilter EQ "inactive" ? "selected" : ""#>Inactive</option>
                            </select>
                        </cfoutput>
                    </div>

                    <!--- Role Filter --->
                    <div style="flex: 1; min-width: 200px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2d3561;">Filter by Role:</label>
                        <cfoutput>
                            <select onchange="window.location='index.cfm?roleFilter=' + this.value"
                                    style="width: 100%; padding: 8px; border-radius: 8px; border: 2px solid ##e0e0e0;">
                                <option value="all" #session.users_roleFilter EQ "all" ? "selected" : ""#>All Roles</option>
                                <option value="1" #session.users_roleFilter EQ "1" ? "selected" : ""#>Admin</option>
                                <option value="2" #session.users_roleFilter EQ "2" ? "selected" : ""#>Content Manager</option>
                            </select>
                        </cfoutput>
                    </div>

                    <!--- Search Box --->
                    <div style="flex: 1; min-width: 250px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2d3561;">Search:</label>
                        <input type="text"
                               id="searchInput"
                               placeholder="Search by username, name, or email..."
                               style="width: 100%; padding: 8px; border-radius: 8px; border: 2px solid #e0e0e0;">
                    </div>
                </div>

                <!--- Pagination Controls (Top) --->
                <div id="paginationTop" style="margin-bottom: 15px;"></div>

                <!--- Users Table --->
                <cfif qUsers.recordCount GT 0>
                    <table class="data-table" id="users-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th class="col-status">Status</th>
                                <th class="actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody">
                            <cfoutput query="qUsers">
                            <tr data-search="#lCase(htmlEditFormat(username))# #lCase(htmlEditFormat(full_name))# #lCase(htmlEditFormat(email))#">
                                <td>
                                    <strong>#htmlEditFormat(username)#</strong>
                                    <cfif id EQ session.admin_user_id>
                                        <span style="font-size: 0.75rem; color: ##4fc3f7; margin-left: 5px;">(You)</span>
                                    </cfif>
                                </td>
                                <td>#htmlEditFormat(full_name)#</td>
                                <td>
                                    <a href="mailto:#htmlEditFormat(email)#" style="color: ##4fc3f7; text-decoration: none;">
                                        #htmlEditFormat(email)#
                                    </a>
                                </td>
                                <td>
                                    <cfif len(role_name)>
                                        <span style="font-weight: 600; color: ##2d3561;">#htmlEditFormat(role_name)#</span>
                                    <cfelse>
                                        <span style="color: ##999;">No Role</span>
                                    </cfif>
                                </td>
                                <td class="col-status">
                                    <cfif is_active>
                                        <span class="badge badge-success">✓ Active</span>
                                    <cfelse>
                                        <span class="badge badge-inactive">Inactive</span>
                                    </cfif>
                                </td>
                                <td class="actions">
                                    <cfif username EQ "admin">
                                        <!--- Master Admin - Cannot be modified --->
                                        <span title="Master Admin - Cannot be modified" style="color: ##999; font-size: 1.2rem; cursor: not-allowed;">🔒</span>
                                    <cfelse>
                                        <a href="edit.cfm?id=#id#" class="btn btn-sm btn-edit" title="Edit User">✏️</a>
                                        <a href="index.cfm?toggle=#id#"
                                           class="btn btn-sm btn-toggle"
                                           title="Toggle Active/Inactive"
                                           onclick="return confirm('Are you sure you want to change this user\'s status?');">
                                            <cfif is_active>👁️<cfelse>🚫</cfif>
                                        </a>
                                        <a href="delete.cfm?id=#id#" class="btn btn-sm btn-delete" title="Delete User">🗑️</a>
                                    </cfif>
                                </td>
                            </tr>
                            </cfoutput>
                        </tbody>
                    </table>

                    <!--- Pagination Controls (Bottom) --->
                    <div id="paginationBottom" style="margin-top: 20px;"></div>
                <cfelse>
                    <div class="empty-state">
                        <p>No users found matching your criteria.</p>
                        <a href="add.cfm" class="btn btn-primary">Create First User</a>
                    </div>
                </cfif>
            </div>
        </main>
    </div>

    <!--- Search and Pagination JavaScript --->
    <script>
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody ? Array.from(tableBody.getElementsByTagName('tr')) : [];

    // Pagination settings
    const itemsPerPage = 10;
    let currentPage = 1;
    let filteredRows = rows;

    // Search function
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();

        filteredRows = rows.filter(row => {
            const searchData = row.getAttribute('data-search') || '';
            return searchData.includes(searchTerm);
        });

        currentPage = 1;
        displayPage();
    }

    // Display current page
    function displayPage() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Hide all rows
        rows.forEach(row => row.style.display = 'none');

        // Show rows for current page
        filteredRows.slice(startIndex, endIndex).forEach(row => row.style.display = '');

        // Update pagination controls
        updatePaginationControls();
    }

    // Update pagination controls
    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
        const paginationHTML = createPaginationHTML(totalPages);

        document.getElementById('paginationTop').innerHTML = paginationHTML;
        document.getElementById('paginationBottom').innerHTML = paginationHTML;
    }

    // Create pagination HTML
    function createPaginationHTML(totalPages) {
        if (totalPages <= 1) return '';

        let html = '<div style="display: flex; align-items: center; gap: 10px; justify-content: center; flex-wrap: wrap;">';
        html += '<span style="color: #666;">Page:</span>';

        // Previous button
        if (currentPage > 1) {
            html += `<button onclick="changePage(${currentPage - 1})" class="btn btn-secondary" style="padding: 6px 12px;">← Previous</button>`;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                html += `<button class="btn btn-primary" style="padding: 6px 12px;">${i}</button>`;
            } else if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
                html += `<button onclick="changePage(${i})" class="btn btn-secondary" style="padding: 6px 12px;">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += '<span style="color: #666;">...</span>';
            }
        }

        // Next button
        if (currentPage < totalPages) {
            html += `<button onclick="changePage(${currentPage + 1})" class="btn btn-secondary" style="padding: 6px 12px;">Next →</button>`;
        }

        html += `<span style="color: #666; margin-left: 10px;">Showing ${filteredRows.length} of ${rows.length} users</span>`;
        html += '</div>';

        return html;
    }

    // Change page function
    function changePage(page) {
        currentPage = page;
        displayPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Initialize
    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
        displayPage();
    }
    </script>
</body>
</html>
