<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/migrate-passwords.cfm
* Created:     November 2, 2025
* Author:      Rastislav Toscak
*
* Purpose:     ONE-TIME PASSWORD MIGRATION SCRIPT
*              Converts all plain text passwords to SHA-256 hashed passwords
*
* IMPORTANT:   This script should be run ONCE ONLY by an administrator
*              After running, this file should be deleted or moved for security
*
* Security:    Requires authentication check
*              Requires special confirmation key in URL
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Include authentication check --->
<cfinclude template="../includes/auth_check.cfm">

<!--- Only allow Admin role (role_id = 1) to run this script --->
<cfif NOT structKeyExists(session, "admin_user_id") OR NOT structKeyExists(session, "permissions") OR NOT listFindNoCase(session.permissions, "user_management")>
    <cflocation url="/admin/dashboard.cfm?error=no_permission" addtoken="false">
    <cfabort>
</cfif>

<!--- Require confirmation key in URL to prevent accidental execution --->
<cfparam name="url.confirm" default="">
<cfset variables.confirmKey = "MIGRATE_PASSWORDS_2025">

<!--- Initialize variables --->
<cfset variables.migrationComplete = false>
<cfset variables.migratedCount = 0>
<cfset variables.errorCount = 0>
<cfset variables.errorMessages = []>

<!--- Process migration if confirmed --->
<cfif url.confirm EQ variables.confirmKey>
    <cftry>
        <!--- Get all users --->
        <cfquery name="qUsers" datasource="#application.datasource#">
            SELECT id, username, password_hash
            FROM dbo.admin_users
            ORDER BY id
        </cfquery>

        <!--- Loop through each user and hash their password --->
        <cfloop query="qUsers">
            <cftry>
                <!--- Check if password is already hashed (SHA-256 produces 64 character hex strings) --->
                <cfif len(qUsers.password_hash) EQ 64 AND REFind("^[0-9A-Fa-f]{64}$", qUsers.password_hash)>
                    <!--- Already hashed, skip --->
                    <!--- Don't count as migrated --->
                <cfelse>
                    <!--- Hash the plain text password --->
                    <cfset hashedPassword = hash(qUsers.password_hash, "SHA-256")>

                    <!--- Update the database --->
                    <cfquery datasource="#application.datasource#">
                        UPDATE dbo.admin_users
                        SET password_hash = <cfqueryparam value="#hashedPassword#" cfsqltype="cf_sql_varchar">,
                            updated_at = GETDATE()
                        WHERE id = <cfqueryparam value="#qUsers.id#" cfsqltype="cf_sql_integer">
                    </cfquery>

                    <cfset variables.migratedCount = variables.migratedCount + 1>
                </cfif>

                <cfcatch type="any">
                    <cfset variables.errorCount = variables.errorCount + 1>
                    <cfset arrayAppend(variables.errorMessages, "Error migrating user #qUsers.username# (ID: #qUsers.id#): #cfcatch.message#")>
                </cfcatch>
            </cftry>
        </cfloop>

        <cfset variables.migrationComplete = true>

        <cfcatch type="any">
            <cfset arrayAppend(variables.errorMessages, "Critical error during migration: #cfcatch.message#")>
        </cfcatch>
    </cftry>
</cfif>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Migration - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
    <style>
        .migration-container {
            max-width: 800px;
            margin: 50px auto;
            padding: 30px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .warning-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .success-box {
            background: #e8f5e9;
            border-left: 4px solid #2e7d32;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
            color: #2e7d32;
        }
        .error-box {
            background: #ffebee;
            border-left: 4px solid #c62828;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
            color: #c62828;
        }
        .confirm-button {
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
            color: #ffffff;
            padding: 15px 40px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            margin: 20px 0;
            transition: all 0.3s ease;
        }
        .confirm-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
        }
        .back-button {
            background: #e0e0e0;
            color: #333;
            padding: 12px 30px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            margin: 20px 10px 20px 0;
        }
        code {
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="migration-container">
        <h1 style="color: #2d3561; margin-bottom: 10px;">🔐 Password Migration Tool</h1>
        <p style="color: #666; margin-bottom: 30px;">Convert plain text passwords to SHA-256 hashed passwords</p>

        <cfif NOT variables.migrationComplete>
            <div class="warning-box">
                <h2 style="margin-top: 0; color: #856404;">⚠️ Important Warning</h2>
                <p style="margin-bottom: 10px;"><strong>This is a ONE-TIME migration script.</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
                    <li>This will convert all plain text passwords in the database to SHA-256 hashed passwords</li>
                    <li>After running this script, login will ONLY work with hashed passwords</li>
                    <li>Users with already-hashed passwords will NOT be affected</li>
                    <li>This process is <strong>irreversible</strong> - plain text passwords cannot be recovered</li>
                    <li>After successful migration, this file should be <strong>deleted</strong> for security</li>
                </ul>
            </div>

            <h3 style="color: #2d3561; margin-top: 30px;">Before You Continue:</h3>
            <ol style="line-height: 1.8; color: #333;">
                <li>Make sure you have a <strong>database backup</strong></li>
                <li>Verify that all password storage points have been updated to use SHA-256 hashing</li>
                <li>Test the login system with a hashed password (e.g., from password reset)</li>
                <li>Only proceed if you're ready to migrate ALL passwords</li>
            </ol>

            <h3 style="color: #2d3561; margin-top: 30px;">To Execute Migration:</h3>
            <p style="color: #666;">Click the button below to hash all plain text passwords in the database.</p>

            <cfoutput>
                <a href="migrate-passwords.cfm?confirm=#variables.confirmKey#" class="confirm-button"
                   onclick="return confirm('Are you absolutely sure you want to migrate all passwords?\n\nThis action cannot be undone.\n\nMake sure you have a database backup!');">
                    🚀 Start Password Migration
                </a>
            </cfoutput>

            <br>
            <a href="/admin/dashboard.cfm" class="back-button">← Cancel and Return to Dashboard</a>

        <cfelse>
            <!--- Migration complete --->
            <cfif variables.errorCount GT 0>
                <div class="error-box">
                    <h2 style="margin-top: 0;">⚠️ Migration Completed with Errors</h2>
                    <p><strong>Successfully migrated:</strong> <cfoutput>#variables.migratedCount#</cfoutput> passwords</p>
                    <p><strong>Errors encountered:</strong> <cfoutput>#variables.errorCount#</cfoutput></p>

                    <h3 style="margin-top: 20px;">Error Details:</h3>
                    <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
                        <cfloop array="#variables.errorMessages#" index="errorMsg">
                            <li><cfoutput>#htmlEditFormat(errorMsg)#</cfoutput></li>
                        </cfloop>
                    </ul>
                </div>
            <cfelse>
                <div class="success-box">
                    <h2 style="margin-top: 0;">✅ Migration Successful!</h2>
                    <p style="font-size: 1.1rem; margin-bottom: 20px;">
                        <strong><cfoutput>#variables.migratedCount#</cfoutput> passwords</strong> have been successfully migrated to SHA-256 hashing.
                    </p>
                </div>
            </cfif>

            <h3 style="color: #2d3561; margin-top: 30px;">Next Steps:</h3>
            <ol style="line-height: 1.8; color: #333;">
                <li><strong>Test Login:</strong> Verify that you can log in with existing credentials</li>
                <li><strong>Test Password Reset:</strong> Confirm the forgot password flow works correctly</li>
                <li><strong>Test Password Change:</strong> Ensure users can change their passwords in profile</li>
                <li><strong>Delete This File:</strong> For security, delete <code>migrate-passwords.cfm</code> after successful testing</li>
            </ol>

            <div class="warning-box" style="margin-top: 30px;">
                <h3 style="margin-top: 0; color: #856404;">🔒 Security Reminder</h3>
                <p style="margin-bottom: 0;">
                    <strong>Delete this file immediately!</strong> This migration script should not remain on the server after use.
                    Run: <code>rm /admin/migrate-passwords.cfm</code>
                </p>
            </div>

            <a href="/admin/dashboard.cfm" class="back-button">← Return to Dashboard</a>
            <a href="/admin/users/index.cfm" class="back-button">View Users</a>
        </cfif>
    </div>
</body>
</html>
