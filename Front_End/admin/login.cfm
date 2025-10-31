<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/login.cfm
* Created:     October 27, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Admin login page with authentication
*              Simple username/password validation with ColdFusion sessions
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Include database configuration --->
<cfinclude template="../includes/db_config.cfm">

<!--- Initialize variables --->
<cfparam name="form.username" default="">
<cfparam name="form.password" default="">
<cfparam name="url.msg" default="">
<cfset errorMessage = "">
<cfset successMessage = "">

<!--- Handle logout message --->
<cfif url.msg EQ "logged_out">
    <cfset successMessage = "You have been successfully logged out.">
<cfelseif url.msg EQ "session_expired">
    <cfset errorMessage = "Your session has expired. Please log in again.">
</cfif>

<!--- If already logged in, redirect to dashboard --->
<cfif structKeyExists(session, "admin_logged_in") AND session.admin_logged_in>
    <cflocation url="dashboard.cfm" addtoken="false">
</cfif>

<!--- Process login form submission --->
<cfif structKeyExists(form, "submit")>
    <cfif len(trim(form.username)) EQ 0 OR len(trim(form.password)) EQ 0>
        <cfset errorMessage = "Please enter both username and password.">
    <cfelse>
        <cftry>
            <!--- Query user from database --->
            <cfquery name="qUser" datasource="#application.datasource#">
                SELECT 
                    id,
                    username,
                    password_hash,
                    email,
                    full_name,
                    is_active
                FROM dbo.admin_users
                WHERE username = <cfqueryparam value="#trim(form.username)#" cfsqltype="cf_sql_varchar">
            </cfquery>
            
            <cfif qUser.recordCount EQ 0>
                <cfset errorMessage = "Invalid username or password.">
            <cfelseif NOT qUser.is_active>
                <cfset errorMessage = "This account has been deactivated. Please contact the administrator.">
            <cfelse>
                <!--- Check password --->
                <!--- Supports both plain text (for initial testing) and SHA-256 hashed passwords --->
                <cfif form.password EQ qUser.password_hash OR hash(form.password, "SHA-256") EQ qUser.password_hash>
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
                    
                    <!--- Redirect to dashboard --->
                    <cflocation url="dashboard.cfm" addtoken="false">
                <cfelse>
                    <!--- Wrong password --->
                    <cfset errorMessage = "Invalid username or password.">
                </cfif>
            </cfif>
            
            <cfcatch type="any">
                <!--- Display the actual error for debugging --->
                <cfset errorMessage = "ERROR: #cfcatch.message# | Detail: #cfcatch.detail# | Type: #cfcatch.type#">
            </cfcatch>
        </cftry>
    </cfif>
</cfif>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - PASC Region J</title>
    <link rel="stylesheet" href="/assets/css/admin-login.css">
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <div class="login-header">
                <div class="logo">
                    <img src="/assets/img/logo.png" alt="PASC Region J" class="logo-img">
                </div>
                <h1>Admin Panel</h1>
                <p>PASC Region J Conference 2026</p>
            </div>
            
            <cfif len(errorMessage) GT 0>
                <div class="alert alert-error">
                    <cfoutput>#errorMessage#</cfoutput>
                </div>
            </cfif>
            
            <cfif len(successMessage) GT 0>
                <div class="alert alert-success">
                    <cfoutput>#successMessage#</cfoutput>
                </div>
            </cfif>
            
            <form method="post" action="login.cfm" class="login-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value="<cfoutput>#htmlEditFormat(form.username)#</cfoutput>"
                        required 
                        autofocus
                        autocomplete="username">
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required
                        autocomplete="current-password">
                </div>
                
                <button type="submit" name="submit" class="btn btn-login">
                    Sign In
                </button>
            </form>
            
            <div class="login-footer">
                <p><small>Default credentials: admin / Admin123!</small></p>
                <p><small>Please change default password after first login</small></p>
            </div>
        </div>
    </div>
</body>
</html>
