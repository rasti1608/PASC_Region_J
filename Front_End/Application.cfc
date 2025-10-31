<!---
================================================================================
File: Application.cfc
Description: Main application configuration file for PASC Region J Conference 
             website. Defines datasource, application settings, session 
             management, security, and all lifecycle event handlers.
Author: Rastislav Toscak
Date: 10/26/2025
Version: 1.0
================================================================================
--->

<cfcomponent output="false">
    
    <!--- ================================================================== --->
    <!--- APPLICATION SETTINGS --->
    <!--- ================================================================== --->
    
    <!--- Application name (must be unique) --->
    <cfset this.name = "PASC_RegionJ_2026">
    
    <!--- Session management --->
    <cfset this.sessionManagement = true>
    <cfset this.sessionTimeout = createTimeSpan(0, 2, 0, 0)> <!--- 2 hours --->
    <cfset this.setClientCookies = true>
    
    <!--- Application timeout --->
    <cfset this.applicationTimeout = createTimeSpan(1, 0, 0, 0)> <!--- 1 day --->
    
    <!--- Default datasource name --->
    <cfset this.datasource = "pasc_regionj">
    
    <!--- ================================================================== --->
    <!--- DATASOURCE CONFIGURATION --->
    <!--- ================================================================== --->
    
	<!--- Define datasource connection (Lucee-style inline datasource) --->
	<!--- Define datasource connection (Lucee-style inline datasource) --->
	<!---only for Lucee... not needed for Abobe --->
<!---	<cfset this.datasources["pasc_regionj"] = {
	    class: "com.microsoft.sqlserver.jdbc.SQLServerDriver",
	    bundleName: "org.lucee.mssql",
	    bundleVersion: "12.2.0.jre8",
	    connectionString: "jdbc:sqlserver://Gwdbs2.dailyrazor.com:1433;DATABASENAME=PASC_RegionJ;trustServerCertificate=true;encrypt=true;SelectMethod=direct",
	    username: "pasc_web",
	    password: "encrypted:eaf9c2df3786f3195fe11bd62516f31afdf31c0430a4e7b7b2a3980c200a564fc20a80a015cc68dc",
	    connectionLimit: -1,
	    liveTimeout: 15,
	    validate: false
	}>--->
	    
    <!--- NOTE: For LOCAL testing, change the connectionString above to:
          jdbc:sqlserver://PI1NSQL02:49527;databaseName=PASC_RegionJ;encrypt=false;trustServerCertificate=true
          And update password to your local database password --->
    
    <!--- ================================================================== --->
    <!--- MAPPINGS --->
    <!--- ================================================================== --->
    
    <!--- Virtual directory mappings for easier includes --->
    <cfset this.mappings["/includes"] = getDirectoryFromPath(getCurrentTemplatePath()) & "includes">
    <cfset this.mappings["/assets"] = getDirectoryFromPath(getCurrentTemplatePath()) & "assets">
    <cfset this.mappings["/admin"] = getDirectoryFromPath(getCurrentTemplatePath()) & "admin">
    
    <!--- ================================================================== --->
    <!--- ADDITIONAL SETTINGS --->
    <!--- ================================================================== --->
    
    <!--- Character encoding --->
    <cfset this.setDomainCookies = false>
    <cfset this.charset.web = "utf-8">
    <cfset this.charset.resource = "utf-8">
    
    <!--- Security settings --->
    <cfset this.scriptProtect = "all"> <!--- XSS protection --->
    <cfset this.secureJSON = true>
    <cfset this.secureJSONPrefix = "//">
    
    
    <!--- ================================================================== --->
    <!--- APPLICATION START --->
    <!--- Runs when application first initializes --->
    <!--- Initialize application-level variables and settings --->
    <!--- ================================================================== --->
    <cffunction name="onApplicationStart" returnType="boolean" output="false">
        
        <!--- Basic application info --->
        <cfset application.appName = "PASC Region J Conference 2026">
        <cfset application.version = "1.0">
        <cfset application.startTime = now()>
        <cfset application.environment = "development"> <!--- Change to "development" for local testing --->
        
        <!--- Conference details --->
        <cfset application.conferenceDate = createDate(2026, 2, 13)>
        <cfset application.conferenceLocation = "Neshaminy High School">
        <cfset application.conferenceTheme = "Lead Beyond Limits">
        
        <!--- Site settings --->
        <cfset application.siteName = "PASC Region J Conference 2026">
        <cfset application.siteTagline = "Reach for the Stars">
        <cfset application.maintenanceMode = false> <!--- Set to true to enable maintenance mode --->
        
        <!--- Admin settings --->
        <cfset application.adminTimeout = 30> <!--- Minutes of inactivity before admin logout --->
        <cfset application.maxLoginAttempts = 5> <!--- Max failed login attempts before lockout --->
        
        <!--- Paths --->
        <cfset application.uploadsPath = expandPath("./uploads/")>
        <cfset application.logsPath = expandPath("./logs/")>
        
        <!--- Email settings (configure as needed) --->
        <cfset application.fromEmail = "noreply@pascregionj.com">
        <cfset application.adminEmail = "admin@pascregionj.com">
        <cfset application.supportEmail = "support@pascregionj.com">
        
        <!--- Caching settings --->
        <cfset application.cacheEnabled = true>
        <cfset application.cacheDuration = 60> <!--- Minutes --->
        
        <!--- Debug mode (set to false in production) --->
        <cfset application.debugMode = true>
        
        <cfreturn true>
    </cffunction>
    
    
    <!--- ================================================================== --->
    <!--- REQUEST START --->
    <!--- Runs before each page request --->
    <!--- Handle authentication, maintenance mode, and per-request logic --->
    <!--- ================================================================== --->
    <cffunction name="onRequestStart" returnType="boolean" output="false">
        <cfargument name="targetPage" type="string" required="true">
        
        <!--- Reload application on URL parameter (for debugging/development) --->
        <cfif structKeyExists(url, "reload") AND application.debugMode>
            <cfset applicationStop()>
            <cflocation url="#cgi.script_name#" addtoken="false">
        </cfif>
        
        <!--- Check for maintenance mode (except for admin) --->
        <cfif application.maintenanceMode AND NOT findNoCase("/admin/", arguments.targetPage)>
            <cfif fileExists(expandPath("./maintenance.cfm"))>
                <cfinclude template="./maintenance.cfm">
            <cfelse>
                <cfoutput>
                    <h1>Site Maintenance</h1>
                    <p>We're currently performing maintenance. Please check back soon.</p>
                </cfoutput>
            </cfif>
            <cfreturn false>
        </cfif>
        
        <!--- Admin area protection - require login for /admin/ pages --->
        <cfif findNoCase("/admin/", arguments.targetPage) AND NOT findNoCase("/admin/login.cfm", arguments.targetPage)>
            
            <!--- Check if admin is logged in --->
            <cfif NOT structKeyExists(session, "admin_logged_in") OR NOT session.admin_logged_in>
                <cflocation url="/admin/login.cfm" addtoken="false">
                <cfreturn false>
            </cfif>
            
            <!--- Update last activity time for admin session timeout --->
            <cfset session.lastActivity = now()>
            
            <!--- Check for admin session timeout --->
            <cfif structKeyExists(session, "lastActivity")>
                <cfset var minutesInactive = dateDiff("n", session.lastActivity, now())>
                <cfif minutesInactive GT application.adminTimeout>
                    <cfset structDelete(session, "adminLoggedIn")>
                    <cfset structDelete(session, "adminUser")>
                    <cflocation url="/admin/login.cfm?timeout=1" addtoken="false">
                    <cfreturn false>
                </cfif>
            </cfif>
            
        </cfif>
        
        <!--- Set request-level variables --->
        <cfset request.currentPage = getFileFromPath(arguments.targetPage)>
        <cfset request.startTime = getTickCount()>
        
        <cfreturn true>
    </cffunction>
    
    
    <!--- ================================================================== --->
    <!--- REQUEST END --->
    <!--- Runs after each page request --->
    <!--- Useful for logging, cleanup, or performance tracking --->
    <!--- ================================================================== --->
    <cffunction name="onRequestEnd" returnType="void" output="false">
        <cfargument name="targetPage" type="string" required="true">
        
        <!--- Performance tracking (only in debug mode) --->
        <!--- LOGGING DISABLED: DailyRazor restricts cflog permissions --->
        <!---
        <cfif application.debugMode AND structKeyExists(request, "startTime")>
            <cfset var executionTime = getTickCount() - request.startTime>
            <!--- cflog file="performance" 
                   type="information" 
                   text="Page: #arguments.targetPage# | Execution Time: #executionTime#ms" --->
        </cfif>
        --->
        
    </cffunction>
    
    
    <!--- ================================================================== --->
    <!--- SESSION START --->
    <!--- Runs when new session is created --->
    <!--- Initialize session variables --->
    <!--- ================================================================== --->
    <cffunction name="onSessionStart" returnType="void" output="false">
        
        <cfset session.started = now()>
        <cfset session.sessionId = createUUID()>
        <cfset session.adminLoggedIn = false>
        
        <!--- Track visitor (basic analytics) --->
        <cfset session.firstPage = cgi.script_name>
        <cfset session.userAgent = cgi.http_user_agent>
        <cfset session.ipAddress = cgi.remote_addr>
        
    </cffunction>
    
    
    <!--- ================================================================== --->
    <!--- SESSION END --->
    <!--- Runs when session expires or is manually terminated --->
    <!--- Cleanup session-related resources --->
    <!--- ================================================================== --->
    <cffunction name="onSessionEnd" returnType="void" output="false">
        <cfargument name="sessionScope" type="struct" required="true">
        <cfargument name="applicationScope" type="struct" required="true">
        
        <!--- Log admin logout if applicable --->
        <!--- LOGGING DISABLED: DailyRazor restricts cflog permissions --->
        <!---
        <cfif structKeyExists(arguments.sessionScope, "adminLoggedIn") AND arguments.sessionScope.adminLoggedIn>
            <!--- cflog file="admin_activity" 
                   type="information" 
                   text="Admin session ended: #structKeyExists(arguments.sessionScope, 'adminUser') ? arguments.sessionScope.adminUser.username : 'unknown'#" --->
        </cfif>
        --->
        
    </cffunction>
    
    
    <!--- ================================================================== --->
    <!--- APPLICATION END --->
    <!--- Runs when application times out or is stopped --->
    <!--- Cleanup application-level resources --->
    <!--- ================================================================== --->
    <cffunction name="onApplicationEnd" returnType="void" output="false">
        <cfargument name="applicationScope" type="struct" required="true">
        
        <!--- Log application shutdown --->
        <!--- LOGGING DISABLED: DailyRazor restricts cflog permissions --->
        <!---
        <cflog file="application" 
               type="information" 
               text="Application stopped. Uptime: #dateDiff('n', arguments.applicationScope.startTime, now())# minutes">
        --->
        
    </cffunction>
    
    
    <!--- ================================================================== --->
    <!--- ERROR HANDLER --->
    <!--- Catches and handles application errors --->
    <!--- Provides user-friendly error pages and detailed logging --->
    <!--- ================================================================== --->
    <cffunction name="onError_DISABLED" returnType="void" output="true">
        <cfargument name="exception" type="any" required="true">
        <cfargument name="eventName" type="string" required="true">
        
        <!--- Build detailed error message for logging --->
        <cfset var errorDetail = "Error in #arguments.eventName#: #arguments.exception.message#">
        
        <cfif structKeyExists(arguments.exception, "detail")>
            <cfset errorDetail = errorDetail & " | Detail: #arguments.exception.detail#">
        </cfif>
        
        <cfif structKeyExists(arguments.exception, "tagContext") AND arrayLen(arguments.exception.tagContext)>
            <cfset errorDetail = errorDetail & " | File: #arguments.exception.tagContext[1].template# | Line: #arguments.exception.tagContext[1].line#">
        </cfif>
        
        <!--- Log the error --->
        <!--- LOGGING DISABLED: DailyRazor restricts cflog permissions --->
        <!--- cflog file="application_errors" type="error" text="#errorDetail#" --->
        
        <!--- Display appropriate error page to user --->
        <cfif findNoCase("/admin/", cgi.script_name)>
            <!--- Admin area error page --->
            <cfif fileExists(expandPath("./admin/error.cfm"))>
                <cfinclude template="./admin/error.cfm">
            <cfelse>
                <cfoutput>
                    <h1>Admin Error</h1>
                    <p>An error occurred in the admin panel.</p>
                </cfoutput>
            </cfif>
        <cfelse>
            <!--- Public site error page --->
            <cfif fileExists(expandPath("./error.cfm"))>
                <cfinclude template="./error.cfm">
            <cfelse>
                <!--- Fallback error display --->
                <cfoutput>
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Error</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 50px; }
                            h1 { color: ##cc0000; }
                        </style>
                    </head>
                    <body>
                        <h1>We're Sorry - An Error Occurred</h1>
                        <p>We're experiencing technical difficulties. Please try again later.</p>
                        
                        <!--- Show detailed error in development/debug mode --->
                        <cfif application.debugMode OR cgi.remote_addr EQ "127.0.0.1" OR cgi.remote_addr EQ "::1">
                            <hr>
                            <h2>Debug Information:</h2>
                            <p><strong>Error Message:</strong> #arguments.exception.message#</p>
                            <cfif structKeyExists(arguments.exception, "detail")>
                                <p><strong>Detail:</strong> #arguments.exception.detail#</p>
                            </cfif>
                            <cfif structKeyExists(arguments.exception, "tagContext") AND arrayLen(arguments.exception.tagContext)>
                                <p><strong>File:</strong> #arguments.exception.tagContext[1].template#</p>
                                <p><strong>Line:</strong> #arguments.exception.tagContext[1].line#</p>
                            </cfif>
                            <!--- cfdump disabled on DailyRazor server --->
                            <!--- <cfdump var="##arguments.exception##" label="Exception Details"> --->
                        </cfif>
                    </body>
                    </html>
                </cfoutput>
            </cfif>
        </cfif>
        
    </cffunction>
    
    
    <!--- ================================================================== --->
    <!--- MISSING TEMPLATE HANDLER --->
    <!--- Handles 404 errors --->
    <!--- Custom 404 page for missing files --->
    <!--- ================================================================== --->
    <cffunction name="onMissingTemplate" returnType="boolean" output="true">
        <cfargument name="targetPage" type="string" required="true">
        
        <!--- Log 404 error --->
        <!--- LOGGING DISABLED: DailyRazor restricts cflog permissions --->
        <!---
        <cflog file="404_errors" 
               type="warning" 
               text="404 Not Found: #arguments.targetPage# | Referrer: #structKeyExists(cgi, 'http_referer') ? cgi.http_referer : 'none'# | IP: #cgi.remote_addr#">
        --->
        
        <!--- Display custom 404 page --->
        <cfif fileExists(expandPath("./404.cfm"))>
            <cfinclude template="./404.cfm">
        <cfelse>
            <!--- Fallback 404 display --->
            <cfheader statuscode="404" statustext="Not Found">
            <cfoutput>
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Page Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 50px; }
                        h1 { color: ##333; }
                    </style>
                </head>
                <body>
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <p><a href="/">Return to homepage</a></p>
                </body>
                </html>
            </cfoutput>
        </cfif>
        
        <cfreturn true>
    </cffunction>
    
</cfcomponent>
