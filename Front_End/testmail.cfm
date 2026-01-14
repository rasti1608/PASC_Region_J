<!--- testmail.cfm - DELETE THIS FILE AFTER TESTING --->
<cfset smtpServer = "mailserver.purelymail.com">
<cfset smtpPort = "465">
<cfset smtpUsername = "info@pascregionj.com">
<cfset smtpPassword = "Oliver007!Oliver007!">

<h2>SMTP Test</h2>

<cftry>
    <cfmail
        to="rasto@comcast.net"
        from="info@pascregionj.com"
        subject="SMTP Test from DailyRazor"
        type="text"
        server="#smtpServer#"
        port="#smtpPort#"
        username="#smtpUsername#"
        password="#smtpPassword#"
        usessl="true"
        spoolenable="false">
This is a test email sent directly through Purelymail SMTP.
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
