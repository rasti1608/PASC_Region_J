<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/announcements/delete.cfm
* Created:     October 28, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Delete announcement with confirmation
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Get announcement ID from URL --->
<cfparam name="url.id" default="0">

<!--- Handle the delete action --->
<cfif structKeyExists(form, "confirm_delete") AND form.confirm_delete EQ "yes">
    <!--- First, get the display_order of the item being deleted --->
    <cfquery name="qGetOrder" datasource="#application.datasource#">
        SELECT display_order
        FROM dbo.announcements
        WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
    </cfquery>
    
    <cfif qGetOrder.recordCount GT 0>
        <cfset deleted_order = qGetOrder.display_order>
        
        <!--- Delete the announcement --->
        <cfquery datasource="#application.datasource#">
            DELETE FROM dbo.announcements
            WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
        </cfquery>
        
        <!--- Now shift all items with higher display_order down by 1 --->
        <cfquery datasource="#application.datasource#">
            UPDATE dbo.announcements
            SET display_order = display_order - 1
            WHERE display_order > <cfqueryparam value="#deleted_order#" cfsqltype="cf_sql_integer">
        </cfquery>
    </cfif>
    
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Get announcement details --->
<cfquery name="qAnnouncement" datasource="#application.datasource#">
    SELECT 
        id,
        title,
        content,
        is_active,
        is_featured,
        publish_start,
        publish_end
    FROM dbo.announcements
    WHERE id = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
</cfquery>

<!--- Redirect if announcement not found --->
<cfif qAnnouncement.recordCount EQ 0>
    <cflocation url="index.cfm" addtoken="false">
</cfif>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delete Announcement - PASC Region J Admin</title>
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
        
        .announcement-details {
            background: #f8f9fa;
            border-left: 4px solid #dc3545;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        
        .announcement-details h3 {
            margin: 0 0 10px 0;
            color: #2c3e50;
            font-size: 18px;
        }
        
        .announcement-details p {
            margin: 5px 0;
            color: #666;
            text-align: left;
            font-size: 14px;
        }
        
        .announcement-details .meta {
            display: flex;
            gap: 20px;
            margin-top: 10px;
            flex-wrap: wrap;
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
            <cfoutput query="qAnnouncement">
                <div class="delete-confirmation">
                    <div class="delete-icon">⚠️</div>
                    <h1>Delete Announcement?</h1>
                    <p>Are you sure you want to delete this announcement? This action cannot be undone.</p>
                    
                    <div class="announcement-details">
                        <h3>#htmlEditFormat(title)#</h3>
                        <p>#left(htmlEditFormat(content), 100)#<cfif len(content) GT 100>...</cfif></p>
                        <div class="meta">
                            <p><strong>Status:</strong> <cfif is_active>Active<cfelse>Inactive</cfif></p>
                            <cfif is_featured>
                                <p><strong>Featured:</strong> Yes ⭐</p>
                            </cfif>
                        </div>
                    </div>
                    
                    <div class="warning-note">
                        <span style="font-size: 24px;">⚠️</span>
                        <p><strong>Note:</strong> This will remove the announcement from the website immediately.</p>
                    </div>
                    
                    <form method="post" action="delete.cfm?id=#url.id#">
                        <input type="hidden" name="confirm_delete" value="yes">
                        <div class="delete-actions">
                            <button type="submit" class="btn-confirm-delete">
                                🗑️ Yes, Delete Announcement
                            </button>
                            <a href="index.cfm" class="btn-cancel">✕ Cancel</a>
                        </div>
                    </form>
                </div>
            </cfoutput>
        </main>
    </div>
</body>
</html>
