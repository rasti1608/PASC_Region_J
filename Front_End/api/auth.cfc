<!---
================================================================================
File: auth.cfc
Description: API endpoint for authentication (login, logout, session checks)
Author: Rastislav Toscak (via Claude Code)
Date: 2025-11-17
Version: 1.0
================================================================================
--->

<cfcomponent output="false">

    <!--- Include database configuration --->
    <cfinclude template="../includes/db_config.cfm">

    <!--- ================================================================== --->
    <!--- LOGIN --->
    <!--- Authenticates user and creates session --->
    <!--- ================================================================== --->
    <cffunction name="login" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qUser = "">
        <cfset var getUserPermissions = "">
        <cfset var requestBody = "">
        <cfset var credentials = {}>

        <cftry>
            <!--- Get JSON body --->
            <cfset requestBody = toString(getHttpRequestData().content)>

            <!--- Parse JSON --->
            <cftry>
                <cfset credentials = deserializeJSON(requestBody, false)>
                <cfcatch type="any">
                    <cfset result = {
                        "success" = false,
                        "message" = "Invalid JSON format in request"
                    }>
                    <cfreturn serializeJSON(result)>
                </cfcatch>
            </cftry>

            <!--- Validate required fields --->
            <cfif NOT structKeyExists(credentials, "username") OR NOT len(trim(credentials.username))>
                <cfset result = {
                    "success" = false,
                    "message" = "Username is required"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif NOT structKeyExists(credentials, "password") OR NOT len(trim(credentials.password))>
                <cfset result = {
                    "success" = false,
                    "message" = "Password is required"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Query user from database --->
            <cfquery name="qUser" datasource="#application.datasource#">
                SELECT
                    u.id,
                    u.username,
                    u.password_hash,
                    u.email,
                    u.full_name,
                    u.is_active,
                    u.role_id,
                    u.profile_picture,
                    u.must_change_password,
                    r.role_name
                FROM dbo.admin_users u
                LEFT JOIN dbo.roles r ON u.role_id = r.id
                WHERE u.username = <cfqueryparam value="#trim(credentials.username)#" cfsqltype="cf_sql_varchar">
            </cfquery>

            <cfif qUser.recordCount EQ 0>
                <cfset result = {
                    "success" = false,
                    "message" = "Invalid username or password"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif NOT qUser.is_active>
                <cfset result = {
                    "success" = false,
                    "message" = "This account has been deactivated. Please contact the administrator."
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Check password (SHA-256 hashed) --->
            <cfif hash(credentials.password, "SHA-256") NEQ qUser.password_hash>
                <cfset result = {
                    "success" = false,
                    "message" = "Invalid username or password"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Password correct - update last login --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.admin_users
                SET last_login = GETDATE()
                WHERE id = <cfqueryparam value="#qUser.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Set session variables --->
            <cfset session.admin_logged_in = true>
            <cfset session.admin_user_id = qUser.id>
            <cfset session.admin_username = qUser.username>
            <cfset session.admin_full_name = qUser.full_name>
            <cfset session.admin_email = qUser.email>
            <cfset session.role_id = qUser.role_id>
            <cfset session.role_name = qUser.role_name>
            <cfset session.profile_picture = qUser.profile_picture>

            <!--- Load user permissions --->
            <cfquery name="getUserPermissions" datasource="#application.datasource#">
                SELECT p.permission_name
                FROM dbo.role_permissions rp
                INNER JOIN dbo.permissions p ON rp.permission_id = p.id
                WHERE rp.role_id = <cfqueryparam value="#qUser.role_id#" cfsqltype="cf_sql_integer">
            </cfquery>
            <cfset session.permissions = ValueList(getUserPermissions.permission_name)>

            <!--- Create unique session ID --->
            <cfset session.unique_session_id = createUUID()>

            <!--- Insert session tracking --->
            <cftry>
                <cfquery datasource="#application.datasource#">
                    INSERT INTO dbo.admin_sessions (user_id, session_id, last_activity, created_at)
                    VALUES (
                        <cfqueryparam value="#qUser.id#" cfsqltype="cf_sql_integer">,
                        <cfqueryparam value="#session.unique_session_id#" cfsqltype="cf_sql_varchar">,
                        GETDATE(),
                        GETDATE()
                    )
                </cfquery>
                <cfcatch type="any">
                    <!--- Session tracking failure should not prevent login --->
                </cfcatch>
            </cftry>

            <!--- Return success with user data --->
            <cfset result = {
                "success" = true,
                "message" = "Login successful",
                "user" = {
                    "id" = qUser.id,
                    "username" = qUser.username,
                    "full_name" = qUser.full_name,
                    "email" = qUser.email,
                    "role_id" = qUser.role_id,
                    "role_name" = qUser.role_name,
                    "is_active" = qUser.is_active,
                    "profile_picture" = qUser.profile_picture,
                    "must_change_password" = qUser.must_change_password
                }
            }>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "message" = "Login error: #cfcatch.message#"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- LOGOUT --->
    <!--- Destroys session and logs out user --->
    <!--- ================================================================== --->
    <cffunction name="logout" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>

        <cftry>
            <!--- Delete session tracking record if exists --->
            <cfif structKeyExists(session, "unique_session_id")>
                <cftry>
                    <cfquery datasource="#application.datasource#">
                        DELETE FROM dbo.admin_sessions
                        WHERE session_id = <cfqueryparam value="#session.unique_session_id#" cfsqltype="cf_sql_varchar">
                    </cfquery>
                    <cfcatch type="any">
                        <!--- Session tracking cleanup failure should not prevent logout --->
                    </cfcatch>
                </cftry>
            </cfif>

            <!--- Clear all session variables --->
            <cfset structClear(session)>

            <cfset result = {
                "success" = true,
                "message" = "Logout successful"
            }>

            <cfcatch type="any">
                <!--- Even if error occurs, try to clear session --->
                <cfset structClear(session)>
                <cfset result = {
                    "success" = true,
                    "message" = "Logout completed"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- CHECK AUTH --->
    <!--- Verifies if user is logged in and returns user data --->
    <!--- ================================================================== --->
    <cffunction name="checkAuth" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qUser = "">
        <cfset var getUserPermissions = "">

        <cftry>
            <!--- Check if user is logged in --->
            <cfif structKeyExists(session, "admin_logged_in") AND session.admin_logged_in
                  AND structKeyExists(session, "admin_user_id")>

                <!--- Verify user still exists and is active --->
                <cfquery name="qUser" datasource="#application.datasource#">
                    SELECT
                        u.id,
                        u.username,
                        u.email,
                        u.full_name,
                        u.is_active,
                        u.role_id,
                        u.profile_picture,
                        r.role_name
                    FROM dbo.admin_users u
                    LEFT JOIN dbo.roles r ON u.role_id = r.id
                    WHERE u.id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
                    AND u.is_active = 1
                </cfquery>

                <cfif qUser.recordCount GT 0>
                    <!--- User authenticated and active --->
                    <cfset result = {
                        "success" = true,
                        "authenticated" = true,
                        "user" = {
                            "id" = qUser.id,
                            "username" = qUser.username,
                            "full_name" = qUser.full_name,
                            "email" = qUser.email,
                            "role_id" = qUser.role_id,
                            "role_name" = qUser.role_name,
                            "is_active" = qUser.is_active,
                            "profile_picture" = qUser.profile_picture
                        }
                    }>

                    <!--- Ensure permissions are set --->
                    <cfif NOT structKeyExists(session, "permissions")>
                        <cfquery name="getUserPermissions" datasource="#application.datasource#">
                            SELECT p.permission_name
                            FROM dbo.role_permissions rp
                            INNER JOIN dbo.permissions p ON rp.permission_id = p.id
                            WHERE rp.role_id = <cfqueryparam value="#qUser.role_id#" cfsqltype="cf_sql_integer">
                        </cfquery>
                        <cfset session.permissions = ValueList(getUserPermissions.permission_name)>
                    </cfif>

                    <!--- Update session tracking --->
                    <cfif structKeyExists(session, "unique_session_id")>
                        <cftry>
                            <cfquery datasource="#application.datasource#">
                                UPDATE dbo.admin_sessions
                                SET last_activity = GETDATE()
                                WHERE session_id = <cfqueryparam value="#session.unique_session_id#" cfsqltype="cf_sql_varchar">
                            </cfquery>
                            <cfcatch type="any">
                                <!--- Session tracking update failure should not break auth check --->
                            </cfcatch>
                        </cftry>
                    </cfif>
                <cfelse>
                    <!--- User no longer exists or is inactive --->
                    <cfset structClear(session)>
                    <cfset result = {
                        "success" = true,
                        "authenticated" = false,
                        "message" = "Session expired"
                    }>
                </cfif>
            <cfelse>
                <!--- Not logged in --->
                <cfset result = {
                    "success" = true,
                    "authenticated" = false,
                    "message" = "Not authenticated"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "authenticated" = false,
                    "message" = "Auth check error: #cfcatch.message#"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- REQUEST PASSWORD RESET --->
    <!--- Sends password reset email to user --->
    <!--- ================================================================== --->
    <cffunction name="requestPasswordReset" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qUser = "">
        <cfset var resetToken = "">
        <cfset var requestBody = "">
        <cfset var data = {}>

        <cftry>
            <!--- Get JSON body --->
            <cfset requestBody = toString(getHttpRequestData().content)>

            <!--- Parse JSON --->
            <cftry>
                <cfset data = deserializeJSON(requestBody, false)>
                <cfcatch type="any">
                    <cfset result = {
                        "success" = false,
                        "message" = "Invalid JSON format in request"
                    }>
                    <cfreturn serializeJSON(result)>
                </cfcatch>
            </cftry>

            <!--- Validate email --->
            <cfif NOT structKeyExists(data, "email") OR NOT len(trim(data.email))>
                <cfset result = {
                    "success" = true,
                    "message" = "If that email exists in our system, a reset link has been sent."
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Query user by email --->
            <cfquery name="qUser" datasource="pasc_regionj">
                SELECT id, username, email, full_name
                FROM dbo.admin_users
                WHERE email = <cfqueryparam value="#trim(data.email)#" cfsqltype="cf_sql_varchar">
                AND is_active = 1
            </cfquery>

            <!--- Always return success to prevent email enumeration --->
            <cfif qUser.recordCount GT 0>
                <!--- Generate reset token --->
                <cfset resetToken = hash(createUUID() & now() & qUser.email, "SHA-256")>

                <!--- Store token in password_reset_tokens table --->
                <cfquery datasource="pasc_regionj">
                    INSERT INTO dbo.password_reset_tokens (
                        user_id,
                        token,
                        created_at,
                        expires_at,
                        ip_address,
                        user_agent
                    )
                    VALUES (
                        <cfqueryparam value="#qUser.id#" cfsqltype="cf_sql_integer">,
                        <cfqueryparam value="#resetToken#" cfsqltype="cf_sql_varchar">,
                        GETDATE(),
                        DATEADD(hour, 12, GETDATE()),
                        <cfqueryparam value="#cgi.REMOTE_ADDR#" cfsqltype="cf_sql_varchar" null="#NOT len(trim(cgi.REMOTE_ADDR))#">,
                        <cfqueryparam value="#cgi.HTTP_USER_AGENT#" cfsqltype="cf_sql_varchar" null="#NOT len(trim(cgi.HTTP_USER_AGENT))#">
                    )
                </cfquery>

                <!--- Send reset email --->
                <cfset var baseUrl = "http://#cgi.http_host#">
                <!--- For localhost, skip /angular-app path. For production, include it --->
                <cfif findNoCase("localhost", cgi.http_host)>
                    <cfset var resetUrl = "#baseUrl#/admin/reset-password?token=#resetToken#">
                <cfelse>
                    <cfset var resetUrl = "#baseUrl#/angular-app/admin/reset-password?token=#resetToken#">
                </cfif>

                <cfmail
                    to="#qUser.email#"
                    from="info@pascregionj.com"
                    subject="Password Reset Request - PASC Region J Admin"
                    type="html">
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: ##333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: linear-gradient(135deg, ##0a0e27 0%, ##1a1f3a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                            .header h1 { margin: 0; font-size: 24px; }
                            .content { background: ##f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                            .button { display: inline-block; background: ##4fc3f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                            .footer { text-align: center; margin-top: 20px; color: ##666; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Password Reset Request</h1>
                            </div>
                            <div class="content">
                                <p>Hello #qUser.full_name#,</p>
                                <p>We received a request to reset the password for your PASC Region J admin account.</p>
                                <p>Click the button below to reset your password:</p>
                                <p style="text-align: center;">
                                    <a href="#resetUrl#" class="button">Reset Password</a>
                                </p>
                                <p>Or copy and paste this link into your browser:</p>
                                <p style="word-break: break-all; background: ##fff; padding: 10px; border-radius: 5px;">#resetUrl#</p>
                                <div style="background: ##fef3cd; border-left: 4px solid ##f0ad4e; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                    <p style="margin: 0; color: ##8a6d3b; font-size: 16px;">
                                        <strong>&##9888; Security Notice:</strong>
                                    </p>
                                    <p style="margin: 10px 0 0 0; color: ##8a6d3b;">
                                        This link will expire in <strong>12 hours</strong> and can only be used once.
                                    </p>
                                </div>
                                <p>If you did not request this password reset, please ignore this email.</p>
                            </div>
                            <div class="footer">
                                <p>Best regards,<br>PASC Region J Conference Team</p>
                            </div>
                        </div>
                    </body>
                    </html>
                </cfmail>
            </cfif>

            <!--- Always return success --->
            <cfset result = {
                "success" = true,
                "message" = "If that email exists in our system, a reset link has been sent."
            }>

            <cfcatch type="any">
                <cfset result = {
                    "success" = true,
                    "message" = "If that email exists in our system, a reset link has been sent."
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- RESET PASSWORD WITH TOKEN --->
    <!--- Resets user password using token from email link --->
    <!--- ================================================================== --->
    <cffunction name="resetPassword" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qToken = "">
        <cfset var requestBody = "">
        <cfset var data = {}>

        <cftry>
            <!--- Get JSON body --->
            <cfset requestBody = toString(getHttpRequestData().content)>

            <!--- Parse JSON --->
            <cftry>
                <cfset data = deserializeJSON(requestBody, false)>
                <cfcatch type="any">
                    <cfset result = {
                        "success" = false,
                        "message" = "Invalid JSON format in request"
                    }>
                    <cfreturn serializeJSON(result)>
                </cfcatch>
            </cftry>

            <!--- Validate token --->
            <cfif NOT structKeyExists(data, "token") OR NOT len(trim(data.token))>
                <cfset result = {
                    "success" = false,
                    "message" = "Reset token is required"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Validate new password --->
            <cfif NOT structKeyExists(data, "newPassword") OR NOT len(trim(data.newPassword))>
                <cfset result = {
                    "success" = false,
                    "message" = "New password is required"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Validate password requirements --->
            <cfset var pwd = trim(data.newPassword)>
            <cfif len(pwd) LT 8>
                <cfset result = {
                    "success" = false,
                    "message" = "Password must be at least 8 characters"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif NOT reFind("[A-Z]", pwd)>
                <cfset result = {
                    "success" = false,
                    "message" = "Password must contain at least one uppercase letter"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif NOT reFind("[0-9]", pwd)>
                <cfset result = {
                    "success" = false,
                    "message" = "Password must contain at least one number"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <cfif NOT reFind("[!@##$%^&*()_+\-=\[\]{};':""\\|,.<>\/?]", pwd)>
                <cfset result = {
                    "success" = false,
                    "message" = "Password must contain at least one special character"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Query token --->
            <cfquery name="qToken" datasource="pasc_regionj">
                SELECT
                    t.id,
                    t.user_id,
                    t.expires_at,
                    t.used_at,
                    u.username,
                    u.email
                FROM dbo.password_reset_tokens t
                INNER JOIN dbo.admin_users u ON t.user_id = u.id
                WHERE t.token = <cfqueryparam value="#trim(data.token)#" cfsqltype="cf_sql_varchar">
                AND u.is_active = 1
            </cfquery>

            <!--- Check if token exists --->
            <cfif qToken.recordCount EQ 0>
                <cfset result = {
                    "success" = false,
                    "message" = "Invalid or expired reset token"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Check if token has been used --->
            <cfif len(trim(qToken.used_at))>
                <cfset result = {
                    "success" = false,
                    "message" = "This reset link has already been used"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Check if token has expired --->
            <cfif now() GT qToken.expires_at>
                <cfset result = {
                    "success" = false,
                    "message" = "This reset link has expired. Please request a new one."
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Hash the new password --->
            <cfset var hashedPassword = hash(pwd, "SHA-256")>

            <!--- Update user password --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.admin_users
                SET
                    password_hash = <cfqueryparam value="#hashedPassword#" cfsqltype="cf_sql_varchar">,
                    password_changed_at = GETDATE(),
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#qToken.user_id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Mark token as used --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.password_reset_tokens
                SET used_at = GETDATE()
                WHERE id = <cfqueryparam value="#qToken.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfset result = {
                "success" = true,
                "message" = "Password reset successfully"
            }>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "message" = "An error occurred while resetting your password. Please try again."
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- CHANGE REQUIRED PASSWORD --->
    <!--- Changes password and clears must_change_password flag --->
    <!--- ================================================================== --->
    <cffunction name="changeRequiredPassword" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var requestBody = "">
        <cfset var data = {}>

        <cftry>
            <!--- Check if user is logged in --->
            <cfif NOT structKeyExists(session, "admin_logged_in") OR NOT session.admin_logged_in>
                <cfset result = {
                    "success" = false,
                    "message" = "Not authenticated"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Get JSON body --->
            <cfset requestBody = toString(getHttpRequestData().content)>

            <!--- Parse JSON --->
            <cftry>
                <cfset data = deserializeJSON(requestBody, false)>
                <cfcatch type="any">
                    <cfset result = {
                        "success" = false,
                        "message" = "Invalid JSON format in request"
                    }>
                    <cfreturn serializeJSON(result)>
                </cfcatch>
            </cftry>

            <!--- Validate new password --->
            <cfif NOT structKeyExists(data, "newPassword") OR NOT len(trim(data.newPassword))>
                <cfset result = {
                    "success" = false,
                    "message" = "New password is required"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Validate password requirements --->
            <cfset var pwd = data.newPassword>
            <cfif len(pwd) LT 8>
                <cfset result = {
                    "success" = false,
                    "message" = "Password must be at least 8 characters"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Check for uppercase --->
            <cfif NOT reFind("[A-Z]", pwd)>
                <cfset result = {
                    "success" = false,
                    "message" = "Password must contain at least one uppercase letter"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Check for number --->
            <cfif NOT reFind("[0-9]", pwd)>
                <cfset result = {
                    "success" = false,
                    "message" = "Password must contain at least one number"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Check for special character --->
            <cfif NOT reFind("[!@##$%^&*()_+\-=\[\]{};':""\\|,.<>\/?]", pwd)>
                <cfset result = {
                    "success" = false,
                    "message" = "Password must contain at least one special character"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Hash the new password --->
            <cfset var hashedPassword = hash(pwd, "SHA-256")>

            <!--- Update password and clear must_change_password flag --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.admin_users
                SET
                    password_hash = <cfqueryparam value="#hashedPassword#" cfsqltype="cf_sql_varchar">,
                    must_change_password = 0,
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#session.admin_user_id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfset result = {
                "success" = true,
                "message" = "Password changed successfully"
            }>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "message" = "Error changing password: #cfcatch.message#"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

</cfcomponent>
