<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/users/delete.cfm
* Created:     November 1, 2025
* Author:      Rastislav Toscak
*
* Purpose:     Delete user confirmation page
*              Confirm before permanently deleting admin user
*
* Features:    - Display user details before deletion
*              - Prevent deletion of last active Admin
*              - Prevent self-deletion
*              - Warning messages for validation failures
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

<!--- Validate ID parameter --->
<cfif NOT structKeyExists(url, "id") OR NOT isNumeric(url.id)>
    <cflocation url="index.cfm" addtoken="false">
    <cfabort>
</cfif>

<!--- Get user data --->
<cftry>
    <cfquery name="getUser" datasource="#application.datasource#">
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
        WHERE u.id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
    </cfquery>

    <cfif getUser.recordCount EQ 0>
        <cflocation url="index.cfm" addtoken="false">
        <cfabort>
    </cfif>

    <cfcatch type="any">
        <cfset variables.errorMessage = "Error loading user: #cfcatch.message#">
        <cflocation url="index.cfm" addtoken="false">
        <cfabort>
    </cfcatch>
</cftry>

<!--- Prevent deleting master admin account --->
<cfif getUser.username EQ "admin">
    <cfset variables.errorMessage = "The master admin account cannot be deleted. This account is protected.">
</cfif>

<!--- Check if user is trying to delete themselves --->
<cfif getUser.id EQ session.admin_user_id>
    <cfset variables.errorMessage = "You cannot delete your own account. Please ask another administrator to delete your account if needed.">
</cfif>

<!--- Check if this is the last active Admin --->
<cfif NOT structKeyExists(variables, "errorMessage") AND getUser.role_id EQ 1 AND getUser.is_active EQ 1>
    <cfquery name="checkLastAdmin" datasource="#application.datasource#">
        SELECT COUNT(*) as admin_count
        FROM dbo.admin_users
        WHERE role_id = 1
        AND is_active = 1
        AND id <> <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
    </cfquery>

    <cfif checkLastAdmin.admin_count EQ 0>
        <cfset variables.errorMessage = "Cannot delete the last active Administrator. There must be at least one active Administrator in the system.">
    </cfif>
</cfif>

<!--- Process delete confirmation --->
<cfif structKeyExists(form, "confirm_delete") AND form.confirm_delete EQ "yes" AND NOT structKeyExists(variables, "errorMessage")>
    <cftry>
        <!--- Delete user --->
        <cfquery datasource="#application.datasource#">
            DELETE FROM dbo.admin_users
            WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
        </cfquery>

        <!--- Redirect to index with success message --->
        <cflocation url="index.cfm" addtoken="false">

        <cfcatch type="any">
            <cfset variables.errorMessage = "Error deleting user: #cfcatch.message#">
        </cfcatch>
    </cftry>
</cfif>

</cfsilent><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delete User - PASC Region J Admin</title>
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
                <h1>Delete User</h1>
                <p><a href="index.cfm" style="color: #4fc3f7; text-decoration: none;">← Back to User Management</a></p>
            </div>

            <!--- Main Section --->
            <div class="section">
                <!--- Error Message --->
                <cfif structKeyExists(variables, "errorMessage")>
                    <div class="alert alert-error">
                        <cfoutput>#variables.errorMessage#</cfoutput>
                    </div>

                    <div style="margin-top: 20px;">
                        <a href="index.cfm" class="btn btn-secondary">← Back to User Management</a>
                        <cfoutput>
                            <a href="edit.cfm?id=#url.id#" class="btn btn-primary">Edit User Instead</a>
                        </cfoutput>
                    </div>
                <cfelse>
                    <!--- Delete Confirmation Form --->
                    <div style="max-width: 700px;">
                        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                            <div style="display: flex; align-items: flex-start; gap: 15px;">
                                <div style="font-size: 2rem;">⚠️</div>
                                <div>
                                    <h3 style="margin: 0 0 10px 0; color: #856404;">Warning: Permanent Deletion</h3>
                                    <p style="margin: 0; color: #856404; line-height: 1.6;">
                                        You are about to permanently delete this user account. This action cannot be undone.
                                        All user data will be permanently removed from the system.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="admin-form">
                            <h3 style="margin-bottom: 20px; color: #2d3561;">User Details:</h3>

                            <div class="info-row">
                                <span class="info-label">Username:</span>
                                <span class="info-value">
                                    <cfoutput>#htmlEditFormat(getUser.username)#</cfoutput>
                                </span>
                            </div>

                            <div class="info-row">
                                <span class="info-label">Full Name:</span>
                                <span class="info-value">
                                    <cfoutput>#htmlEditFormat(getUser.full_name)#</cfoutput>
                                </span>
                            </div>

                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">
                                    <cfoutput>#htmlEditFormat(getUser.email)#</cfoutput>
                                </span>
                            </div>

                            <div class="info-row">
                                <span class="info-label">Role:</span>
                                <span class="info-value">
                                    <cfoutput>
                                        <cfif len(getUser.role_name)>
                                            #htmlEditFormat(getUser.role_name)#
                                        <cfelse>
                                            <span style="color: ##999;">No Role Assigned</span>
                                        </cfif>
                                    </cfoutput>
                                </span>
                            </div>

                            <div class="info-row">
                                <span class="info-label">Status:</span>
                                <span class="info-value">
                                    <cfif getUser.is_active>
                                        <span class="badge badge-success">✓ Active</span>
                                    <cfelse>
                                        <span class="badge badge-inactive">Inactive</span>
                                    </cfif>
                                </span>
                            </div>

                            <div class="info-row">
                                <span class="info-label">Last Login:</span>
                                <span class="info-value">
                                    <cfoutput>
                                        <cfif len(getUser.last_login)>
                                            #dateFormat(getUser.last_login, "mmmm d, yyyy")# at #timeFormat(getUser.last_login, "h:mm tt")#
                                        <cfelse>
                                            Never logged in
                                        </cfif>
                                    </cfoutput>
                                </span>
                            </div>

                            <div class="info-row">
                                <span class="info-label">Created:</span>
                                <span class="info-value">
                                    <cfoutput>#dateFormat(getUser.created_at, "mmmm d, yyyy")# at #timeFormat(getUser.created_at, "h:mm tt")#</cfoutput>
                                </span>
                            </div>

                            <form method="post" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                                <input type="hidden" name="confirm_delete" value="yes">

                                <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                                    <p style="margin: 0; color: #c62828; font-weight: 600;">
                                        Are you absolutely sure you want to delete this user?
                                    </p>
                                </div>

                                <div class="form-actions" style="margin: 0; padding: 0; border: none;">
                                    <button type="submit" class="btn btn-danger">
                                        🗑️ Yes, Delete User
                                    </button>
                                    <a href="index.cfm" class="btn btn-secondary">Cancel</a>
                                    <cfoutput>
                                        <a href="edit.cfm?id=#url.id#" class="btn btn-primary">Edit Instead</a>
                                    </cfoutput>
                                </div>
                            </form>
                        </div>
                    </div>
                </cfif>
            </div>
        </main>
    </div>
</body>
</html>
