<!--- testmail.cfm - DELETE THIS FILE AFTER TESTING --->
<cfset brevoApiKey = "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">

<h2>Brevo API Test</h2>

<cftry>
    <cfset emailData = {
        "sender": {"name": "PASC Region J", "email": "info@pascregionj.com"},
        "to": [{"email": "rasto@comcast.net", "name": "Test"}],
        "subject": "Brevo API Test from DailyRazor",
        "htmlContent": "<p>This is a test email sent through Brevo API!</p>"
    }>
    
    <cfhttp method="POST" url="https://api.brevo.com/v3/smtp/email" result="httpResult">
        <cfhttpparam type="header" name="api-key" value="#brevoApiKey#">
        <cfhttpparam type="header" name="Content-Type" value="application/json">
        <cfhttpparam type="body" value="#serializeJSON(emailData)#">
    </cfhttp>
    
    <cfoutput>
        <p><strong>HTTP Status:</strong> #httpResult.statusCode#</p>
        <p><strong>Response:</strong> #httpResult.fileContent#</p>
    </cfoutput>
    
    <cfif httpResult.statusCode contains "201">
        <p style="color:green; font-weight:bold;">SUCCESS - Email sent via Brevo API!</p>
    <cfelse>
        <p style="color:orange; font-weight:bold;">Check response above for details</p>
    </cfif>
    
<cfcatch type="any">
    <p style="color:red; font-weight:bold;">ERROR:</p>
    <cfoutput>
        <p><strong>Message:</strong> #cfcatch.message#</p>
        <p><strong>Detail:</strong> #cfcatch.detail#</p>
    </cfoutput>
</cfcatch>
</cftry>

<hr>
<p><em>Delete this file after testing!</em></p>
