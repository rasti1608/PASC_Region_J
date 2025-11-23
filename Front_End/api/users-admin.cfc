<!---
================================================================================
File: users-admin.cfc
Description: Admin API endpoint for managing admin users
Author: Auto-generated for Angular migration
Date: 2025-11-16
Version: 1.0
================================================================================
--->

<cfcomponent output="false">

    <!--- ================================================================== --->
    <!--- GET ALL USERS (ADMIN) --->
    <!--- Returns all admin users--->
    <!--- ================================================================== --->
    <cffunction name="getUsersAdmin" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qUsers = "">

        <cftry>
            <!--- Query all users --->
            <cfquery name="qUsers" datasource="pasc_regionj">
                SELECT
                    u.id,
                    u.username,
                    u.full_name,
                    u.email,
                    u.profile_picture,
                    u.role_id,
                    u.is_active,
                    u.last_login,
                    u.created_at,
                    u.updated_at,
                    r.role_name
                FROM dbo.admin_users u
                LEFT JOIN dbo.roles r ON u.role_id = r.id
                ORDER BY u.created_at DESC
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var users = []>

            <cfloop query="qUsers">
                <cfset var user = {
                    "id" = qUsers.id,
                    "username" = qUsers.username,
                    "full_name" = qUsers.full_name,
                    "email" = qUsers.email,
                    "profile_picture" = qUsers.profile_picture,
                    "role_id" = qUsers.role_id,
                    "role_name" = qUsers.role_name,
                    "is_active" = qUsers.is_active,
                    "last_login" = isNull(qUsers.last_login) ? "" : (dateFormat(qUsers.last_login, "yyyy-mm-dd") & " " & timeFormat(qUsers.last_login, "HH:mm:ss")),
                    "created_at" = dateFormat(qUsers.created_at, "yyyy-mm-dd") & " " & timeFormat(qUsers.created_at, "HH:mm:ss"),
                    "updated_at" = isNull(qUsers.updated_at) ? "" : (dateFormat(qUsers.updated_at, "yyyy-mm-dd") & " " & timeFormat(qUsers.updated_at, "HH:mm:ss"))
                }>
                <cfset arrayAppend(users, user)>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = users,
                "message" = "Users retrieved successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = [],
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail,
                    "message" = "Error retrieving users"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- GET SINGLE USER --->
    <!--- Returns single user by ID --->
    <!--- ================================================================== --->
    <cffunction name="getUser" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>
        <cfset var qUser = "">

        <cftry>
            <cfquery name="qUser" datasource="pasc_regionj">
                SELECT
                    u.id,
                    u.username,
                    u.full_name,
                    u.email,
                    u.profile_picture,
                    u.role_id,
                    u.is_active,
                    u.last_login,
                    u.created_at,
                    u.updated_at,
                    r.role_name
                FROM dbo.admin_users u
                LEFT JOIN dbo.roles r ON u.role_id = r.id
                WHERE u.id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif qUser.recordCount GT 0>
                <cfset var user = {
                    "id" = qUser.id,
                    "username" = qUser.username,
                    "full_name" = qUser.full_name,
                    "email" = qUser.email,
                    "profile_picture" = qUser.profile_picture,
                    "role_id" = qUser.role_id,
                    "role_name" = qUser.role_name,
                    "is_active" = qUser.is_active,
                    "last_login" = isNull(qUser.last_login) ? "" : (dateFormat(qUser.last_login, "yyyy-mm-dd") & " " & timeFormat(qUser.last_login, "HH:mm:ss")),
                    "created_at" = dateFormat(qUser.created_at, "yyyy-mm-dd") & " " & timeFormat(qUser.created_at, "HH:mm:ss"),
                    "updated_at" = isNull(qUser.updated_at) ? "" : (dateFormat(qUser.updated_at, "yyyy-mm-dd") & " " & timeFormat(qUser.updated_at, "HH:mm:ss"))
                }>

                <cfset result = {
                    "success" = true,
                    "data" = user,
                    "message" = "User retrieved successfully"
                }>
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "data" = {},
                    "message" = "User not found"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "data" = {},
                    "error" = cfcatch.message,
                    "message" = "Error retrieving user"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- CREATE USER --->
    <!--- Create new admin user with automatic password generation and email activation --->
    <!--- ================================================================== --->
    <cffunction name="createUser" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="username" type="string" required="true">
        <cfargument name="full_name" type="string" required="true">
        <cfargument name="email" type="string" required="true">
        <cfargument name="role_id" type="numeric" required="true">
        <cfargument name="is_active" type="boolean" default="true" required="false">

        <cfset var result = {}>
        <cfset var newUserId = 0>
        <cfset var generatedPassword = "">
        <cfset var activationToken = "">

        <cftry>
            <!--- Check if username already exists --->
            <cfquery name="qCheckUsername" datasource="pasc_regionj">
                SELECT id
                FROM dbo.admin_users
                WHERE username = <cfqueryparam value="#arguments.username#" cfsqltype="cf_sql_varchar">
            </cfquery>

            <cfif qCheckUsername.recordCount GT 0>
                <cfset result = {
                    "success" = false,
                    "message" = "Username already exists"
                }>
                <cfreturn serializeJSON(result, false, false)>
            </cfif>

            <!--- Check if email already exists --->
            <cfquery name="qCheckEmail" datasource="pasc_regionj">
                SELECT id
                FROM dbo.admin_users
                WHERE email = <cfqueryparam value="#arguments.email#" cfsqltype="cf_sql_varchar">
            </cfquery>

            <cfif qCheckEmail.recordCount GT 0>
                <cfset result = {
                    "success" = false,
                    "message" = "Email address already exists"
                }>
                <cfreturn serializeJSON(result, false, false)>
            </cfif>

            <!--- Generate secure random password that meets all requirements --->
            <!--- Must have: 8+ chars, uppercase, number, special char --->
            <cfset var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ">
            <cfset var lowerChars = "abcdefghijklmnopqrstuvwxyz">
            <cfset var numbers = "0123456789">
            <cfset var specialChars = "!@##$%^&*()_+-=[]{};">

            <!--- Start with required characters --->
            <cfset generatedPassword = "">
            <cfset generatedPassword = generatedPassword & mid(upperChars, randRange(1, len(upperChars)), 1)>
            <cfset generatedPassword = generatedPassword & mid(lowerChars, randRange(1, len(lowerChars)), 1)>
            <cfset generatedPassword = generatedPassword & mid(numbers, randRange(1, len(numbers)), 1)>
            <cfset generatedPassword = generatedPassword & mid(specialChars, randRange(1, len(specialChars)), 1)>

            <!--- Fill remaining characters (total 12 chars) --->
            <cfset var allChars = upperChars & lowerChars & numbers & specialChars>
            <cfloop from="1" to="8" index="i">
                <cfset generatedPassword = generatedPassword & mid(allChars, randRange(1, len(allChars)), 1)>
            </cfloop>

            <!--- Shuffle the password to randomize positions --->
            <cfset var passwordArray = listToArray(generatedPassword, "")>
            <cfset var shuffledPassword = "">
            <cfloop condition="arrayLen(passwordArray) GT 0">
                <cfset var randomIndex = randRange(1, arrayLen(passwordArray))>
                <cfset shuffledPassword = shuffledPassword & passwordArray[randomIndex]>
                <cfset arrayDeleteAt(passwordArray, randomIndex)>
            </cfloop>
            <cfset generatedPassword = shuffledPassword>

            <!--- Hash password --->
            <cfset var hashedPassword = hash(generatedPassword, "SHA-256")>

            <!--- Insert new user --->
            <cfquery name="qInsert" datasource="pasc_regionj">
                INSERT INTO dbo.admin_users (
                    username,
                    password_hash,
                    full_name,
                    email,
                    role_id,
                    is_active,
                    must_change_password,
                    created_at
                )
                VALUES (
                    <cfqueryparam value="#arguments.username#" cfsqltype="cf_sql_varchar">,
                    <cfqueryparam value="#hashedPassword#" cfsqltype="cf_sql_varchar">,
                    <cfqueryparam value="#arguments.full_name#" cfsqltype="cf_sql_nvarchar">,
                    <cfqueryparam value="#arguments.email#" cfsqltype="cf_sql_nvarchar">,
                    <cfqueryparam value="#arguments.role_id#" cfsqltype="cf_sql_integer">,
                    <cfqueryparam value="#arguments.is_active#" cfsqltype="cf_sql_bit">,
                    1,
                    GETDATE()
                );
                SELECT SCOPE_IDENTITY() AS newId
            </cfquery>

            <!--- Get the newly created user ID --->
            <cfset newUserId = qInsert.newId>

            <!--- Generate activation token --->
            <cfset activationToken = hash(createUUID() & now() & arguments.email, "SHA-256")>

            <!--- Store token in user_activation_tokens table --->
            <cfquery datasource="pasc_regionj">
                INSERT INTO dbo.user_activation_tokens (
                    user_id,
                    token,
                    created_at,
                    expires_at,
                    ip_address,
                    user_agent
                )
                VALUES (
                    <cfqueryparam value="#newUserId#" cfsqltype="cf_sql_integer">,
                    <cfqueryparam value="#activationToken#" cfsqltype="cf_sql_varchar">,
                    GETDATE(),
                    DATEADD(hour, 24, GETDATE()),
                    <cfqueryparam value="#cgi.REMOTE_ADDR#" cfsqltype="cf_sql_varchar" null="#NOT len(trim(cgi.REMOTE_ADDR))#">,
                    <cfqueryparam value="#cgi.HTTP_USER_AGENT#" cfsqltype="cf_sql_varchar" null="#NOT len(trim(cgi.HTTP_USER_AGENT))#">
                )
            </cfquery>

            <!--- Send activation email --->
            <cfset var baseUrl = "http://#cgi.http_host#">
            <!--- For localhost, skip /angular-app path. For production, include it --->
            <cfif findNoCase("localhost", cgi.http_host)>
                <cfset var activationUrl = "#baseUrl#/admin/activate?token=#activationToken#">
            <cfelse>
                <cfset var activationUrl = "#baseUrl#/angular-app/admin/activate?token=#activationToken#">
            </cfif>

            <cfmail
                to="#arguments.email#"
                from="info@pascregionj.com"
                subject="Activate Your PASC Region J Admin Account"
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
                            <h1>Welcome to PASC Region J Admin</h1>
                        </div>
                        <div class="content">
                            <p>Hello #arguments.full_name#,</p>
                            <p>An admin account has been created for you for the PASC Region J Conference admin panel.</p>
                            <p>Click the button below to activate your account and set your password:</p>
                            <p style="text-align: center;">
                                <a href="#activationUrl#" class="button">Activate Account</a>
                            </p>
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; background: ##fff; padding: 10px; border-radius: 5px;">#activationUrl#</p>
                            <div style="background: ##fef3cd; border-left: 4px solid ##f0ad4e; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <p style="margin: 0; color: ##8a6d3b; font-size: 16px;">
                                    <strong>&##9888; Security Notice:</strong>
                                </p>
                                <p style="margin: 10px 0 0 0; color: ##8a6d3b;">
                                    This activation link will expire in <strong>24 hours</strong> and can only be used once.
                                </p>
                            </div>
                            <p>If you did not expect this account creation, please ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>Best regards,<br>PASC Region J Conference Team</p>
                        </div>
                    </div>
                </body>
                </html>
            </cfmail>

            <!--- Get the newly created user --->
            <cfset var getUserResult = deserializeJSON(getUser(newUserId))>

            <cfif getUserResult.success>
                <cfset result = getUserResult>
                <cfset result.message = "User created successfully. Activation email sent.">
                <cfset result.generatedPassword = generatedPassword>
                <cfset result.activationEmailSent = true>
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "message" = "User created but error retrieving data"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail,
                    "message" = "Error creating user"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- UPDATE USER --->
    <!--- Update existing user (with optional password) --->
    <!--- ================================================================== --->
    <cffunction name="updateUser" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">
        <cfargument name="full_name" type="string" required="true">
        <cfargument name="email" type="string" required="true">
        <cfargument name="role_id" type="numeric" required="true">
        <cfargument name="is_active" type="boolean" required="true">
        <cfargument name="password" type="string" required="false" default="">

        <cfset var result = {}>
        <cfset var hashedPassword = "">

        <cftry>
            <!--- Hash password if provided --->
            <cfif len(trim(arguments.password))>
                <cfset hashedPassword = hash(arguments.password, "SHA-256")>
            </cfif>

            <!--- Update the user --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.admin_users
                SET
                    full_name = <cfqueryparam value="#arguments.full_name#" cfsqltype="cf_sql_nvarchar">,
                    email = <cfqueryparam value="#arguments.email#" cfsqltype="cf_sql_nvarchar">,
                    role_id = <cfqueryparam value="#arguments.role_id#" cfsqltype="cf_sql_integer">,
                    is_active = <cfqueryparam value="#arguments.is_active#" cfsqltype="cf_sql_bit">,
                    <cfif len(trim(hashedPassword))>
                        password_hash = <cfqueryparam value="#hashedPassword#" cfsqltype="cf_sql_nvarchar">,
                        must_change_password = 0,
                    </cfif>
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Get the updated user --->
            <cfset var getUserResult = deserializeJSON(getUser(arguments.id))>

            <cfif getUserResult.success>
                <cfset result = getUserResult>
                <cfset result.message = "User updated successfully">
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "message" = "User updated but error retrieving data"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error updating user"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- DELETE USER --->
    <!--- Delete admin user --->
    <!--- ================================================================== --->
    <cffunction name="deleteUser" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>

        <cftry>
            <!--- Check if user exists and get details --->
            <cfquery name="qUser" datasource="pasc_regionj">
                SELECT username, role_id
                FROM dbo.admin_users
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif qUser.recordCount GT 0>
                <!--- Prevent deleting master admin --->
                <cfif qUser.username EQ "admin">
                    <cfset result = {
                        "success" = false,
                        "message" = "Cannot delete master admin account"
                    }>
                    <cfreturn serializeJSON(result, false, false)>
                </cfif>

                <!--- Delete from database --->
                <cfquery datasource="pasc_regionj">
                    DELETE FROM dbo.admin_users
                    WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
                </cfquery>

                <cfset result = {
                    "success" = true,
                    "message" = "User deleted successfully"
                }>
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "message" = "User not found"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error deleting user"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- TOGGLE ACTIVE --->
    <!--- Toggle user active status --->
    <!--- ================================================================== --->
    <cffunction name="toggleActive" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>

        <cftry>
            <!--- Toggle the active status --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.admin_users
                SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END,
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Get the updated user --->
            <cfset var getUserResult = deserializeJSON(getUser(arguments.id))>

            <cfif getUserResult.success>
                <cfset result = getUserResult>
            <cfelse>
                <cfset result = {
                    "success" = false,
                    "message" = "Error retrieving updated user"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "message" = "Error toggling user status"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- GET ROLES --->
    <!--- Returns all available roles --->
    <!--- ================================================================== --->
    <cffunction name="getRoles" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var qRoles = "">

        <cftry>
            <!--- Query roles --->
            <cfquery name="qRoles" datasource="pasc_regionj">
                SELECT
                    id,
                    role_name
                FROM dbo.roles
                ORDER BY id ASC
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var roles = []>

            <cfloop query="qRoles">
                <cfset var role = {
                    "id" = qRoles.id,
                    "role_name" = qRoles.role_name
                }>
                <cfset arrayAppend(roles, role)>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = roles,
                "message" = "Roles retrieved successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = [],
                    "error" = cfcatch.message,
                    "message" = "Error retrieving roles"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- CHECK USERNAME AVAILABILITY --->
    <!--- Checks if a username is available (for real-time validation) --->
    <!--- ================================================================== --->
    <cffunction name="checkUsernameAvailability" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="username" type="string" required="true">
        <cfargument name="excludeUserId" type="numeric" required="false" default="0">

        <cfset var result = {}>
        <cfset var qCheck = "">

        <cftry>
            <!--- Validate username is provided --->
            <cfif NOT len(trim(arguments.username))>
                <cfset result = {
                    "success" = false,
                    "available" = false,
                    "message" = "Username is required"
                }>
                <cfreturn serializeJSON(result)>
            </cfif>

            <!--- Check if username exists (excluding current user if editing) --->
            <cfquery name="qCheck" datasource="pasc_regionj">
                SELECT id
                FROM dbo.admin_users
                WHERE username = <cfqueryparam value="#trim(arguments.username)#" cfsqltype="cf_sql_varchar">
                <cfif arguments.excludeUserId GT 0>
                    AND id != <cfqueryparam value="#arguments.excludeUserId#" cfsqltype="cf_sql_integer">
                </cfif>
            </cfquery>

            <!--- Build response based on availability --->
            <cfif qCheck.recordCount EQ 0>
                <cfset result = {
                    "success" = true,
                    "available" = true,
                    "message" = "Username is available"
                }>
            <cfelse>
                <cfset result = {
                    "success" = true,
                    "available" = false,
                    "message" = "Username is already taken"
                }>
            </cfif>

            <cfcatch type="any">
                <cfset result = {
                    "success" = false,
                    "available" = false,
                    "error" = cfcatch.message,
                    "message" = "Error checking username availability"
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result)>
    </cffunction>

</cfcomponent>
