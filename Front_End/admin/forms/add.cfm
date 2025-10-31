<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/forms/add.cfm
* Created:     October 28, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Add new form to the system
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Get location from URL --->
<cfparam name="url.location" default="Workshops">

<!--- Initialize error messages --->
<cfset errors = []>

<!--- Handle form submission --->
<cfif structKeyExists(form, "submit")>
    <!--- Server-side validation --->
    <cfif NOT structKeyExists(form, "form_name") OR len(trim(form.form_name)) EQ 0>
        <cfset arrayAppend(errors, "Form Name is required")>
    </cfif>
    
    <cfif NOT structKeyExists(form, "embed_code") OR len(trim(form.embed_code)) EQ 0>
        <cfset arrayAppend(errors, "Google Form Embed Code is required")>
    </cfif>
    
    <cfif NOT structKeyExists(form, "page_location") OR len(trim(form.page_location)) EQ 0>
        <cfset arrayAppend(errors, "Page Location is required")>
    </cfif>
    
    <!--- If no errors, proceed with insert --->
    <cfif arrayLen(errors) EQ 0>
        <!--- Get the highest display_order for this location --->
        <cfquery name="qMaxOrder" datasource="#application.datasource#">
            SELECT ISNULL(MAX(display_order), 0) as max_order
            FROM dbo.forms
            WHERE page_location = <cfqueryparam value="#form.page_location#" cfsqltype="cf_sql_varchar">
        </cfquery>
        
        <cfset next_order = qMaxOrder.max_order + 1>
        
        <!--- Insert new form --->
        <cfquery datasource="#application.datasource#">
            INSERT INTO dbo.forms (
                form_name,
                form_description,
                embed_code,
                page_location,
                is_active,
                display_order,
                created_at
            ) VALUES (
                <cfqueryparam value="#trim(form.form_name)#" cfsqltype="cf_sql_varchar">,
                <cfqueryparam value="#trim(form.form_description)#" cfsqltype="cf_sql_varchar" null="#NOT structKeyExists(form, 'form_description') OR len(trim(form.form_description)) EQ 0#">,
                <cfqueryparam value="#trim(form.embed_code)#" cfsqltype="cf_sql_varchar">,
                <cfqueryparam value="#form.page_location#" cfsqltype="cf_sql_varchar">,
                <cfqueryparam value="#structKeyExists(form, 'is_active') ? 1 : 0#" cfsqltype="cf_sql_bit">,
                <cfqueryparam value="#next_order#" cfsqltype="cf_sql_integer">,
                GETDATE()
            )
        </cfquery>
        
        <cflocation url="index.cfm?location=#form.page_location#" addtoken="false">
    </cfif>
</cfif>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add New Form - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
</head>
<body>
    <div class="admin-wrapper">
        <!--- Sidebar Navigation --->
        <cfinclude template="../includes/admin_nav.cfm">
        
        <!--- Main Content Area --->
        <main class="admin-content">
            <div class="content-header">
                <cfoutput>
                    <div>
                        <h1>Add New Form</h1>
                        <p>Create a new Google Form for #lcase(url.location)#</p>
                    </div>
                    <a href="index.cfm?location=#url.location#" class="btn btn-secondary">← Back to Forms</a>
                </cfoutput>
            </div>
            
            <div class="form-container">
                <!--- Display validation errors --->
                <cfif arrayLen(errors) GT 0>
                    <div class="alert alert-error" style="background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                        <strong>⚠️ Please fix the following errors:</strong>
                        <ul style="margin: 10px 0 0 20px;">
                            <cfloop array="#errors#" index="error">
                                <li><cfoutput>#error#</cfoutput></li>
                            </cfloop>
                        </ul>
                    </div>
                </cfif>
                
                <cfoutput>
                    <form method="post" action="add.cfm?location=#url.location#" class="admin-form" id="addFormForm">
                        <div class="form-group">
                            <label for="form_name">Form Name *</label>
                            <input type="text" id="form_name" name="form_name" required class="form-control" placeholder="e.g., Workshop Application" value="#structKeyExists(form, 'form_name') ? htmlEditFormat(form.form_name) : ''#">
                            <small class="form-help">This name will be displayed on the website</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="form_description">Description</label>
                            <textarea id="form_description" name="form_description" rows="3" class="form-control" placeholder="Brief description of this form">#structKeyExists(form, 'form_description') ? htmlEditFormat(form.form_description) : ''#</textarea>
                            <small class="form-help">Optional description shown below the form name</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="embed_code">Google Form Embed Code *</label>
                            <textarea id="embed_code" name="embed_code" required rows="5" class="form-control" placeholder='<iframe src="https://docs.google.com/forms/d/e/..." width="640" height="800" frameborder="0"></iframe>'>#structKeyExists(form, 'embed_code') ? htmlEditFormat(form.embed_code) : ''#</textarea>
                            <small class="form-help">Paste the complete iframe embed code from Google Forms</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="page_location">Page Location *</label>
                            <select id="page_location" name="page_location" required class="form-control">
                                <option value="Workshops" #url.location EQ 'Workshops' ? 'selected' : ''#>Workshops</option>
                                <option value="Registration" #url.location EQ 'Registration' ? 'selected' : ''#>Registration</option>
                            </select>
                            <small class="form-help">Where should this form appear on the website?</small>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="is_active" value="1" checked>
                                <span>Active (visible on website)</span>
                            </label>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" name="submit" class="btn btn-primary">
                                💾 Save Form
                            </button>
                            <a href="index.cfm?location=#url.location#" class="btn btn-secondary">Cancel</a>
                        </div>
                    </form>
                </cfoutput>
            </div>
            
            <script>
                // Client-side validation
                document.getElementById('addFormForm').addEventListener('submit', function(e) {
                    let isValid = true;
                    let errorMessages = [];
                    
                    // Check form name
                    const formName = document.getElementById('form_name').value.trim();
                    if (formName === '') {
                        isValid = false;
                        errorMessages.push('Form Name is required');
                    }
                    
                    // Check embed code
                    const embedCode = document.getElementById('embed_code').value.trim();
                    if (embedCode === '') {
                        isValid = false;
                        errorMessages.push('Google Form Embed Code is required');
                    }
                    
                    if (!isValid) {
                        e.preventDefault();
                        alert('Please fill in all required fields:\n\n' + errorMessages.join('\n'));
                    }
                });
            </script>
        </main>
    </div>
</body>
</html>
