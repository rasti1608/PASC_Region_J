<cfsilent>
<!---
    React App Router for ColdFusion/IIS
    Handles SPA routing for React application

    - Serves static files (JS, CSS, images) directly
    - Routes all other requests to index.html for React Router
--->

<!--- Get the requested path relative to react-app --->
<cfset requestedPath = cgi.PATH_INFO />
<cfset basePath = "/react-app" />

<!--- Remove base path from requested path --->
<cfif len(requestedPath) AND left(requestedPath, len(basePath)) EQ basePath>
    <cfset relativePath = mid(requestedPath, len(basePath) + 1, len(requestedPath)) />
<cfelse>
    <cfset relativePath = requestedPath />
</cfif>

<!--- If no path or just /, serve index.html --->
<cfif NOT len(relativePath) OR relativePath EQ "/">
    <cfset relativePath = "/index.html" />
</cfif>

<!--- Get the current directory --->
<cfset currentDir = getDirectoryFromPath(getCurrentTemplatePath()) />

<!--- Build the full file path --->
<cfset fullFilePath = currentDir & replace(relativePath, "/", "\", "all") />

<!--- Check if it's a request for a static file that exists --->
<cfset staticExtensions = "js,css,html,json,ico,png,jpg,jpeg,gif,svg,webp,woff,woff2,ttf,eot,map" />
<cfset fileExtension = listLast(relativePath, ".") />

<cfif listFindNoCase(staticExtensions, fileExtension) AND fileExists(fullFilePath)>
    <!--- Serve the static file with appropriate content type --->
    <cfswitch expression="#lcase(fileExtension)#">
        <cfcase value="js">
            <cfcontent type="application/javascript" file="#fullFilePath#" />
        </cfcase>
        <cfcase value="css">
            <cfcontent type="text/css" file="#fullFilePath#" />
        </cfcase>
        <cfcase value="json">
            <cfcontent type="application/json" file="#fullFilePath#" />
        </cfcase>
        <cfcase value="html">
            <cfcontent type="text/html" file="#fullFilePath#" />
        </cfcase>
        <cfcase value="ico">
            <cfcontent type="image/x-icon" file="#fullFilePath#" />
        </cfcase>
        <cfcase value="png">
            <cfcontent type="image/png" file="#fullFilePath#" />
        </cfcase>
        <cfcase value="jpg,jpeg">
            <cfcontent type="image/jpeg" file="#fullFilePath#" />
        </cfcase>
        <cfcase value="gif">
            <cfcontent type="image/gif" file="#fullFilePath#" />
        </cfcase>
        <cfcase value="svg">
            <cfcontent type="image/svg+xml" file="#fullFilePath#" />
        </cfcase>
        <cfcase value="webp">
            <cfcontent type="image/webp" file="#fullFilePath#" />
        </cfcase>
        <cfcase value="woff">
            <cfcontent type="font/woff" file="#fullFilePath#" />
        </cfcase>
        <cfcase value="woff2">
            <cfcontent type="font/woff2" file="#fullFilePath#" />
        </cfcase>
        <cfcase value="ttf">
            <cfcontent type="font/ttf" file="#fullFilePath#" />
        </cfcase>
        <cfcase value="eot">
            <cfcontent type="application/vnd.ms-fontobject" file="#fullFilePath#" />
        </cfcase>
        <cfcase value="map">
            <cfcontent type="application/json" file="#fullFilePath#" />
        </cfcase>
        <cfdefaultcase>
            <cfcontent type="application/octet-stream" file="#fullFilePath#" />
        </cfdefaultcase>
    </cfswitch>
    <cfabort />
<cfelse>
    <!--- For all other routes, serve index.html so React Router can handle them --->
    <cfset indexPath = currentDir & "index.html" />
    <cfif fileExists(indexPath)>
        <cfcontent type="text/html" file="#indexPath#" />
    <cfelse>
        <!--- index.html not found - React app may not be built yet --->
        <cfoutput>
        <!DOCTYPE html>
        <html>
        <head>
            <title>React App - Not Built</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; background: ##0a0e27; color: ##e0e0e0; }
                .error { background: ##1a1f3a; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto; }
                h1 { color: ##4fc3f7; }
                code { background: ##2a2f4a; padding: 2px 8px; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="error">
                <h1>React App Not Built</h1>
                <p>The React application has not been built yet.</p>
                <p>To build the React app, run:</p>
                <pre><code>cd react-app-source
npm run build</code></pre>
                <p>Then copy the contents of <code>build/</code> to <code>Front_End/react-app/</code></p>
            </div>
        </body>
        </html>
        </cfoutput>
    </cfif>
</cfif>
</cfsilent>
