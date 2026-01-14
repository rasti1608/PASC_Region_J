<!--- testmail.cfm - DELETE THIS FILE AFTER TESTING --->
<cfset smtpServer = "mailserver.purelymail.com">
<cfset smtpPort = "587">
<cfset smtpUsername = "info@pascregionj.com">
<cfset smtpPassword = "Oliver007!Oliver007!">

<h2>SMTP Test - Port 587 TLS</h2>

<cftry>
    <cfmail
        to="rasto@comcast.net"
        from="info@pascregionj.com"
        subject="SMTP Test from DailyRazor - Port 587"
        type="text"
        server="#smtpServer#"
        port="#smtpPort#"
        username="#smtpUsername#"
        password="#smtpPassword#"
        usetls="true"
        spoolenable="false">
This is a test email sent directly through Purelymail SMTP on port 587.
    </cfmail>
    
    <p style="color:green; font-weight:bold;">SUCCESS - Email sent without errors!</p>
    
<cfcatch type="any">
    <p style="color:red; font-weight:bold;">ERROR:</p>
    <p><strong>Message:</strong> <cfoutput>#cfcatch.message#</cfoutput></p>
    <p><strong>Detail:</strong> <cfoutput>#cfcatch.detail#</cfoutput></p>
    <p><strong>Type:</strong> <cfoutput>#cfcatch.type#</cfoutput></p>
</cfcatch>
</cftry>

<hr>
<p><em>Delete this file after testing!</em></p>
