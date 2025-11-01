<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/contacts/remove-recipient.cfm
* Created:     October 31, 2025
* Author:      Contact Form System Implementation
*
* Purpose:     Delete email recipient with confirmation
*              Primary email cannot be removed
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Get recipient ID from URL --->
<cfparam name="url.id" default="0">

<!--- Handle the delete action --->
<cfif structKeyExists(form, "confirm_delete") AND form.confirm_delete EQ "yes">
    <!--- First verify it's not primary --->
    <cfquery name="qCheckPrimary" datasource="#application.datasource#">
        SELECT is_primary
        FROM dbo.contact_email_recipients
        WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
    </cfquery>

    <cfif qCheckPrimary.recordCount GT 0 AND qCheckPrimary.is_primary EQ 0>
        <!--- Delete the recipient --->
        <cfquery datasource="#application.datasource#">
            DELETE FROM dbo.contact_email_recipients
            WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
        </cfquery>

        <cfset session.success_message = "Email recipient removed successfully!">
    <cfelse>
        <cfset session.error_message = "Cannot remove primary email recipient.">
    </cfif>

    <cflocation url="email-settings.cfm" addtoken="false">
</cfif>

<!--- Get recipient details --->
<cfquery name="qRecipient" datasource="#application.datasource#">
    SELECT
        id,
        email,
        is_primary,
        is_active,
        created_at
    FROM dbo.contact_email_recipients
    WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
</cfquery>

<!--- Redirect if recipient not found or if it's primary --->
<cfif qRecipient.recordCount EQ 0 OR qRecipient.is_primary EQ 1>
    <cfset session.error_message = "Cannot remove primary email recipient or recipient not found.">
    <cflocation url="email-settings.cfm" addtoken="false">
</cfif>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Remove Email Recipient - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
    <style>
        .delete-confirmation {
            max-width: 600px;
            margin: 60px auto;
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .delete-icon {
            width: 80px;
            height: 80px;
            background: #fff3cd;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin: 0 auto 30px;
        }

        .delete-confirmation h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 28px;
        }

        .delete-confirmation p {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 16px;
        }

        .recipient-details {
            background: #f8f9fa;
            border-left: 4px solid #dc3545;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }

        .recipient-details h3 {
            margin: 0 0 10px 0;
            color: #2c3e50;
            font-size: 18px;
        }

        .recipient-details p {
            margin: 5px 0;
            color: #666;
            text-align: left;
            font-size: 14px;
        }

        .warning-note {
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .warning-note strong {
            color: #856404;
        }

        .warning-note p {
            margin: 0;
            color: #856404;
            text-align: left;
        }

        .delete-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
        }

        .btn-confirm-delete {
            background: #dc3545;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: background 0.3s;
        }

        .btn-confirm-delete:hover {
            background: #c82333;
        }

        .btn-cancel {
            background: #6c757d;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.3s;
        }

        .btn-cancel:hover {
            background: #5a6268;
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

            <cfoutput>
            <div class="delete-confirmation">
                <div class="delete-icon">⚠️</div>

                <h1>Remove Email Recipient?</h1>

                <p>Are you sure you want to remove this email recipient? They will no longer receive contact form notifications.</p>

                <div class="recipient-details">
                    <h3>Email Recipient Details</h3>
                    <p><strong>Email:</strong> #htmlEditFormat(qRecipient.email)#</p>
                    <p><strong>Status:</strong> <cfif qRecipient.is_active>Active<cfelse>Inactive</cfif></p>
                    <p><strong>Added:</strong> #dateFormat(qRecipient.created_at, 'mmmm d, yyyy')#</p>
                </div>

                <div class="warning-note">
                    <span>⚠️</span>
                    <p><strong>Note:</strong> This action cannot be undone. The recipient will be permanently removed from the notification list.</p>
                </div>

                <form method="post" action="remove-recipient.cfm?id=#qRecipient.id#">
                    <input type="hidden" name="confirm_delete" value="yes">

                    <div class="delete-actions">
                        <button type="submit" class="btn-confirm-delete">
                            🗑️ Yes, Remove Recipient
                        </button>
                        <a href="email-settings.cfm" class="btn-cancel">
                            ✕ Cancel
                        </a>
                    </div>
                </form>
            </div>
            </cfoutput>
        </main>
    </div>

    <!--- Session Heartbeat --->
    <cfinclude template="../includes/admin_footer.cfm">
</body>
</html>
