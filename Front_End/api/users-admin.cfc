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
    <!--- Create new admin user --->
    <!--- ================================================================== --->
    <cffunction name="createUser" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="username" type="string" required="true">
        <cfargument name="password" type="string" required="true">
        <cfargument name="full_name" type="string" required="true">
        <cfargument name="email" type="string" required="true">
        <cfargument name="role_id" type="numeric" required="true">
        <cfargument name="is_active" type="boolean" default="true" required="false">

        <cfset var result = {}>
        <cfset var newUserId = 0>

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

            <!--- Hash password --->
            <cfset var hashedPassword = hash(arguments.password, "SHA-256")>

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

            <!--- Get the newly created user --->
            <cfset newUserId = qInsert.newId>
            <cfset var getUserResult = deserializeJSON(getUser(newUserId))>

            <cfif getUserResult.success>
                <cfset result = getUserResult>
                <cfset result.message = "User created successfully">
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
    <!--- Update existing user (without password) --->
    <!--- ================================================================== --->
    <cffunction name="updateUser" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">
        <cfargument name="full_name" type="string" required="true">
        <cfargument name="email" type="string" required="true">
        <cfargument name="role_id" type="numeric" required="true">
        <cfargument name="is_active" type="boolean" required="true">

        <cfset var result = {}>

        <cftry>
            <!--- Update the user --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.admin_users
                SET
                    full_name = <cfqueryparam value="#arguments.full_name#" cfsqltype="cf_sql_nvarchar">,
                    email = <cfqueryparam value="#arguments.email#" cfsqltype="cf_sql_nvarchar">,
                    role_id = <cfqueryparam value="#arguments.role_id#" cfsqltype="cf_sql_integer">,
                    is_active = <cfqueryparam value="#arguments.is_active#" cfsqltype="cf_sql_bit">,
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

</cfcomponent>
