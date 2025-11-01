<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/contacts/email-settings.cfm
* Created:     October 31, 2025
* Updated:     October 31, 2025
* Author:      Contact Form System Implementation
*
* Purpose:     Admin panel for managing contact form email recipients
*              Add/remove recipients, toggle active status
*              Primary email (info@pascregionj.com) cannot be removed or disabled
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Handle add new recipient --->
<cfif structKeyExists(form, "add_email") AND len(trim(form.add_email)) gt 0>
    <cfif isValid("email", trim(form.add_email))>
        <!--- Check if already exists --->
        <cfquery name="qCheck" datasource="#application.datasource#">
            SELECT id FROM dbo.contact_email_recipients
            WHERE email = <cfqueryparam value="#trim(form.add_email)#" cfsqltype="cf_sql_nvarchar">
        </cfquery>

        <cfif qCheck.recordCount eq 0>
            <cfquery datasource="#application.datasource#">
                INSERT INTO dbo.contact_email_recipients (email, is_primary, is_active)
                VALUES (
                    <cfqueryparam value="#trim(form.add_email)#" cfsqltype="cf_sql_nvarchar">,
                    0,
                    1
                )
            </cfquery>
            <cfset session.success_message = "Email recipient added successfully!">
        <cfelse>
            <cfset session.error_message = "This email address is already in the recipients list.">
        </cfif>
    <cfelse>
        <cfset session.error_message = "Please enter a valid email address.">
    </cfif>
    <cflocation url="email-settings.cfm" addtoken="false">
</cfif>

<!--- Handle toggle active status (only for non-primary) --->
<cfif structKeyExists(url, "toggle") AND isNumeric(url.toggle)>
    <!--- Verify it's not primary --->
    <cfquery name="qCheckPrimary" datasource="#application.datasource#">
        SELECT is_primary FROM dbo.contact_email_recipients
        WHERE id = <cfqueryparam value="#url.toggle#" cfsqltype="cf_sql_integer">
    </cfquery>

    <cfif qCheckPrimary.recordCount gt 0 AND qCheckPrimary.is_primary eq 0>
        <cfquery datasource="#application.datasource#">
            UPDATE dbo.contact_email_recipients
            SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
            WHERE id = <cfqueryparam value="#url.toggle#" cfsqltype="cf_sql_integer">
        </cfquery>
        <cfset session.success_message = "Status updated successfully!">
    <cfelse>
        <cfset session.error_message = "Cannot change status of primary email recipient.">
    </cfif>
    <cflocation url="email-settings.cfm" addtoken="false">
</cfif>

<!--- Get all email recipients --->
<cfquery name="qRecipients" datasource="#application.datasource#">
    SELECT
        id,
        email,
        is_primary,
        is_active,
        created_at
    FROM dbo.contact_email_recipients
    ORDER BY is_primary DESC, created_at ASC
</cfquery>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Settings - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
    <style>
        .badge-primary {
            background: #fff9c4;
            color: #f57f17;
        }

        .add-form {
            background: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            margin-bottom: 30px;
        }

        .add-form h3 {
            margin-top: 0;
            color: #1a1f3a;
        }

        .form-row {
            display: flex;
            gap: 15px;
            align-items: flex-end;
        }

        .form-group {
            flex: 0 1 calc(75% - 15px);
        }

        .form-row .btn {
            flex: 0 0 auto;
            white-space: nowrap;
        }

        .form-label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: #1a1f3a;
            font-size: 0.9rem;
        }

        .form-input {
            width: 100%;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 0.95rem;
        }

        .form-input:focus {
            outline: none;
            border-color: #4a90e2;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }

        .info-box {
            background: #e3f2fd;
            border-left: 4px solid #1565c0;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }

        .info-box h3 {
            margin-top: 0;
            color: #1565c0;
            font-size: 1.1rem;
        }

        .info-box p {
            margin: 0;
            color: #333;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="admin-wrapper">
        <!--- Sidebar Navigation --->
        <cfinclude template="../includes/admin_nav.cfm">

        <!--- Main Content Area --->
        <main class="admin-content">
            <!--- Fixed Header Bar --->
            <cfinclude template="../includes/admin_header.cfm">

            <div style="margin-bottom: 20px;">
                <a href="index.cfm" style="color: #4a90e2; text-decoration: none;">← Back to Contact Submissions</a>
            </div>

            <div class="content-header">
                <h1>Email Settings</h1>
                <p>Manage who receives contact form notifications</p>
            </div>

            <!--- Success/Error Messages --->
            <cfif structKeyExists(session, "success_message")>
                <cfoutput>
                <div class="alert alert-success">
                    #session.success_message#
                </div>
                </cfoutput>
                <cfset structDelete(session, "success_message")>
            </cfif>

            <cfif structKeyExists(session, "error_message")>
                <cfoutput>
                <div class="alert alert-error">
                    #session.error_message#
                </div>
                </cfoutput>
                <cfset structDelete(session, "error_message")>
            </cfif>

            <!--- Information Box --->
            <div class="info-box">
                <h3>📧 How Email Notifications Work</h3>
                <p>When someone submits the contact form, all active email recipients below will receive a notification. The primary email (info@pascregionj.com) is locked and cannot be removed or disabled to ensure you always receive submissions. You can add additional recipients and toggle them on/off as needed.</p>
            </div>

            <!--- Add New Recipient Form --->
            <div class="add-form">
                <h3>➕ Add New Recipient</h3>
                <form method="post" action="email-settings.cfm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="add_email" class="form-label">Email Address</label>
                            <input
                                type="email"
                                id="add_email"
                                name="add_email"
                                class="form-input"
                                placeholder="email@example.com"
                                required>
                        </div>
                        <button type="submit" class="btn btn-primary">Add Recipient</button>
                    </div>
                </form>
            </div>

            <!--- Recipients Table --->
            <div class="section">
                <cfoutput>
                <div class="section-header">
                    <h2>Email Recipients (#qRecipients.recordCount#)</h2>
                </div>
                </cfoutput>

                <cfif qRecipients.recordCount EQ 0>
                    <div class="empty-state">
                        <p>No email recipients configured.</p>
                    </div>
                <cfelse>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Email Address</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Added Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <cfoutput query="qRecipients">
                            <tr>
                                <td>
                                    <strong>#htmlEditFormat(email)#</strong>
                                    <cfif is_primary>
                                        <br><small class="text-muted">Default notification email</small>
                                    </cfif>
                                </td>
                                <td>
                                    <cfif is_primary>
                                        <span class="badge badge-primary">🔒 Primary</span>
                                    <cfelse>
                                        <span class="badge" style="background: ##f5f5f5; color: ##666;">Additional</span>
                                    </cfif>
                                </td>
                                <td>
                                    <cfif is_active>
                                        <span class="badge badge-success">✓ Active</span>
                                    <cfelse>
                                        <span class="badge badge-inactive">Inactive</span>
                                    </cfif>
                                </td>
                                <td>#dateFormat(created_at, 'mm/dd/yyyy')#</td>
                                <td class="actions">
                                    <cfif is_primary>
                                        <span class="btn btn-sm" style="opacity: 0.3; cursor: not-allowed;" title="Primary email is always active">👁️</span>
                                        <span class="btn btn-sm" style="opacity: 0.3; cursor: not-allowed;" title="Primary email cannot be removed">🗑️</span>
                                    <cfelse>
                                        <a href="email-settings.cfm?toggle=#id#" class="btn btn-sm btn-toggle" title="Toggle Active/Inactive">
                                            <cfif is_active>👁️<cfelse>🚫</cfif>
                                        </a>
                                        <a href="remove-recipient.cfm?id=#id#" class="btn btn-sm btn-delete" title="Remove">🗑️</a>
                                    </cfif>
                                </td>
                            </tr>
                            </cfoutput>
                        </tbody>
                    </table>
                </cfif>
            </div>
        </main>
    </div>

    <!--- Session Heartbeat --->
    <cfinclude template="../includes/admin_footer.cfm">
</body>
</html>
