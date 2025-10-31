<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/forms/delete.cfm
* Created:     October 28, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Delete form with confirmation
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Get form ID and location from URL --->
<cfparam name="url.id" default="0">
<cfparam name="url.location" default="Workshops">

<!--- Handle the delete action --->
<cfif structKeyExists(form, "confirm_delete") AND form.confirm_delete EQ "yes">
    <!--- First, get the display_order and page_location of the item being deleted --->
    <cfquery name="qGetOrder" datasource="#application.datasource#">
        SELECT display_order, page_location
        FROM dbo.forms
        WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
    </cfquery>
    
    <cfif qGetOrder.recordCount GT 0>
        <cfset deleted_order = qGetOrder.display_order>
        <cfset deleted_location = qGetOrder.page_location>
        
        <!--- Delete the form --->
        <cfquery datasource="#application.datasource#">
            DELETE FROM dbo.forms
            WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
        </cfquery>
        
        <!--- Now shift all items with higher display_order down by 1 (in same location) --->
        <cfquery datasource="#application.datasource#">
            UPDATE dbo.forms
            SET display_order = display_order - 1
            WHERE display_order > <cfqueryparam value="#deleted_order#" cfsqltype="cf_sql_integer">
            AND page_location = <cfqueryparam value="#deleted_location#" cfsqltype="cf_sql_varchar">
        </cfquery>
    </cfif>
    
    <cflocation url="index.cfm?location=#url.location#" addtoken="false">
</cfif>

<!--- Get form details --->
<cfquery name="qForm" datasource="#application.datasource#">
    SELECT 
        id,
        form_name,
        form_description,
        page_location,
        is_active
    FROM dbo.forms
    WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
</cfquery>

<!--- Redirect if form not found --->
<cfif qForm.recordCount EQ 0>
    <cflocation url="index.cfm?location=#url.location#" addtoken="false">
</cfif>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delete Form - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
    <style>
        .delete-confirmation {
            max-width: 600px;
            margin: 60px auto;
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .delete-icon {
            width: 80px;
            height: 80px;
            background: #fff3cd;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin: 0 auto 30px;
        }
        
        .delete-confirmation h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 28px;
        }
        
        .delete-confirmation p {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 16px;
        }
        
        .form-details {
            background: #f8f9fa;
            border-left: 4px solid #dc3545;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        
        .form-details h3 {
            margin: 0 0 10px 0;
            color: #2c3e50;
            font-size: 18px;
        }
        
        .form-details p {
            margin: 5px 0;
            color: #666;
            text-align: left;
            font-size: 14px;
        }
        
        .warning-note {
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .warning-note strong {
            color: #856404;
        }
        
        .warning-note p {
            margin: 0;
            color: #856404;
            text-align: left;
        }
        
        .delete-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
        }
        
        .btn-confirm-delete {
            background: #dc3545;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: background 0.3s;
        }
        
        .btn-confirm-delete:hover {
            background: #c82333;
        }
        
        .btn-cancel {
            background: #6c757d;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.3s;
        }
        
        .btn-cancel:hover {
            background: #5a6268;
        }
    </style>
</head>
<body>
    <div class="admin-wrapper">
        <!--- Sidebar Navigation --->
        <cfinclude template="../includes/admin_nav.cfm">
        
        <!--- Main Content Area --->
        <main class="admin-content">
            <cfoutput query="qForm">
                <div class="delete-confirmation">
                    <div class="delete-icon">⚠️</div>
                    <h1>Delete Form?</h1>
                    <p>Are you sure you want to delete this form? This action cannot be undone.</p>
                    
                    <div class="form-details">
                        <h3>#htmlEditFormat(form_name)#</h3>
                        <cfif len(trim(form_description)) GT 0>
                            <p>#htmlEditFormat(form_description)#</p>
                        </cfif>
                        <p>
                            <strong>Location:</strong> #page_location# | 
                            <strong>Status:</strong> #is_active ? 'Active' : 'Inactive'#
                        </p>
                    </div>
                    
                    <div class="warning-note">
                        <span style="font-size: 24px;">⚠️</span>
                        <p><strong>Note:</strong> This will remove the form from the website immediately.</p>
                    </div>
                    
                    <form method="post" action="delete.cfm?id=#id#&location=#page_location#">
                        <input type="hidden" name="confirm_delete" value="yes">
                        <div class="delete-actions">
                            <button type="submit" class="btn-confirm-delete">
                                🗑️ Yes, Delete Form
                            </button>
                            <a href="index.cfm?location=#page_location#" class="btn-cancel">✕ Cancel</a>
                        </div>
                    </form>
                </div>
            </cfoutput>
        </main>
    </div>
</body>
</html>
