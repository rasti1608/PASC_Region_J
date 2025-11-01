<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/forms/index.cfm
* Created:     October 28, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     List all forms with manage options
*              View, edit, delete, toggle active status, and reorder
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Get page location from URL (default to Workshops) --->
<cfparam name="url.location" default="Workshops">

<!--- Handle status filter form submission --->
<cfif structKeyExists(form, "statusFilter")>
    <cfset session["forms_#url.location#_statusFilter"] = form.statusFilter>
    <cflocation url="index.cfm?location=#url.location#" addtoken="false">
</cfif>

<!--- Initialize session filter for current tab --->
<cfif NOT structKeyExists(session, "forms_#url.location#_statusFilter")>
    <cfset session["forms_#url.location#_statusFilter"] = "all">
</cfif>

<!--- Handle order change from dropdown --->
<cfif structKeyExists(form, "form_id") AND structKeyExists(form, "new_order")>
    <!--- Get current order of the form being moved --->
    <cfquery name="qMoving" datasource="#application.datasource#">
        SELECT display_order FROM dbo.forms
        WHERE id = <cfqueryparam value="#form.form_id#" cfsqltype="cf_sql_integer">
        AND page_location = <cfqueryparam value="#url.location#" cfsqltype="cf_sql_varchar">
    </cfquery>
    
    <cfif qMoving.recordCount GT 0>
        <cfset old_order = qMoving.display_order>
        <cfset new_order = form.new_order>
        
        <cfif old_order NEQ new_order>
            <!--- Moving form to new position --->
            <cfif new_order LT old_order>
                <!--- Moving UP - shift others down --->
                <cfquery datasource="#application.datasource#">
                    UPDATE dbo.forms
                    SET display_order = display_order + 1
                    WHERE display_order >= <cfqueryparam value="#new_order#" cfsqltype="cf_sql_integer">
                    AND display_order < <cfqueryparam value="#old_order#" cfsqltype="cf_sql_integer">
                    AND page_location = <cfqueryparam value="#url.location#" cfsqltype="cf_sql_varchar">
                </cfquery>
            <cfelse>
                <!--- Moving DOWN - shift others up --->
                <cfquery datasource="#application.datasource#">
                    UPDATE dbo.forms
                    SET display_order = display_order - 1
                    WHERE display_order > <cfqueryparam value="#old_order#" cfsqltype="cf_sql_integer">
                    AND display_order <= <cfqueryparam value="#new_order#" cfsqltype="cf_sql_integer">
                    AND page_location = <cfqueryparam value="#url.location#" cfsqltype="cf_sql_varchar">
                </cfquery>
            </cfif>
            
            <!--- Set the form to its new position --->
            <cfquery datasource="#application.datasource#">
                UPDATE dbo.forms
                SET display_order = <cfqueryparam value="#new_order#" cfsqltype="cf_sql_integer">
                WHERE id = <cfqueryparam value="#form.form_id#" cfsqltype="cf_sql_integer">
            </cfquery>
        </cfif>
    </cfif>
    
    <cflocation url="index.cfm?location=#url.location#" addtoken="false">
</cfif>

<!--- Handle status toggle --->
<cfif structKeyExists(url, "toggle") AND isNumeric(url.toggle)>
    <cfquery datasource="#application.datasource#">
        UPDATE dbo.forms
        SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
        WHERE id = <cfqueryparam value="#url.toggle#" cfsqltype="cf_sql_integer">
    </cfquery>
    <cflocation url="index.cfm?location=#url.location#" addtoken="false">
</cfif>

<!--- Get all forms for the selected location --->
<cfquery name="qForms" datasource="#application.datasource#">
    SELECT 
        id,
        form_name,
        form_description,
        embed_code,
        is_active,
        page_location,
        display_order,
        created_at,
        updated_at
    FROM dbo.forms
    WHERE page_location = <cfqueryparam value="#url.location#" cfsqltype="cf_sql_varchar">
    <cfif session["forms_#url.location#_statusFilter"] NEQ "all">
        AND is_active = <cfqueryparam value="#session['forms_#url.location#_statusFilter'] EQ 'active' ? 1 : 0#" cfsqltype="cf_sql_bit">
    </cfif>
    ORDER BY display_order ASC, created_at DESC
</cfquery>

<!--- Count forms by location --->
<cfquery name="qWorkshopCount" datasource="#application.datasource#">
    SELECT COUNT(*) as form_count FROM dbo.forms WHERE page_location = 'Workshops'
</cfquery>

<cfquery name="qRegistrationCount" datasource="#application.datasource#">
    SELECT COUNT(*) as form_count FROM dbo.forms WHERE page_location = 'Registration'
</cfquery>

<cfset totalCount = qForms.recordCount>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Forms - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
    <style>
        /* Tab Navigation */
        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            border-bottom: 2px solid #e0e0e0;
        }
        
        .tab {
            padding: 12px 24px;
            background: none;
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            color: #666;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        }
        
        .tab:hover {
            color: #4a90e2;
            background: rgba(74, 144, 226, 0.05);
        }
        
        .tab.active {
            color: #4a90e2;
            border-bottom-color: #4a90e2;
            font-weight: 600;
        }
        
        .tab-badge {
            display: inline-block;
            background: #e0e0e0;
            color: #666;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            margin-left: 6px;
            font-weight: 600;
        }
        
        .tab.active .tab-badge {
            background: #4a90e2;
            color: white;
        }

        /* Search box and filters */
        .search-container {
            margin-bottom: 20px;
            display: flex;
            gap: 15px;
            align-items: center;
            flex-wrap: wrap;
        }

        .search-input {
            flex: 1;
            min-width: 250px;
            max-width: 400px;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 0.95rem;
        }

        .search-input:focus {
            outline: none;
            border-color: #4a90e2;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }

        .status-filter {
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #ffffff;
            color: #333;
            font-size: 0.95rem;
            cursor: pointer;
            min-width: 150px;
        }

        .status-filter:focus {
            outline: none;
            border-color: #4a90e2;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }

        .search-results {
            color: #666;
            font-size: 0.9rem;
        }

        /* Pagination */
        .pagination-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding: 20px 0;
            border-top: 1px solid #e0e0e0;
        }

        .pagination-info {
            color: #666;
            font-size: 0.9rem;
        }

        .pagination-controls {
            display: flex;
            gap: 5px;
            align-items: center;
        }

        .pagination-btn {
            padding: 8px 12px;
            border: 1px solid #ddd;
            background: #ffffff;
            color: #333;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s;
        }

        .pagination-btn:hover:not(:disabled) {
            background: #f5f5f5;
            border-color: #4a90e2;
        }

        .pagination-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .pagination-btn.active {
            background: #4a90e2;
            color: #ffffff;
            border-color: #4a90e2;
        }
    </style>
</head>
<body>
    <div class="admin-wrapper">
        <!--- Sidebar Navigation --->
        <cfinclude template="../includes/admin_nav.cfm">
        
        <!--- Main Content Area --->
        <main class="admin-content">
            <div class="content-header">
                <h1>Forms Management</h1>
                <p>Manage Google Forms for workshops and registration</p>
            </div>
            
            <!--- Tabs Navigation --->
            <div class="tabs">
                <cfoutput>
                    <a href="index.cfm?location=Workshops" class="tab #url.location EQ 'Workshops' ? 'active' : ''#">
                        📝 Workshops
                        <span class="tab-badge">#qWorkshopCount.form_count#</span>
                    </a>
                    <a href="index.cfm?location=Registration" class="tab #url.location EQ 'Registration' ? 'active' : ''#">
                        👥 Registration
                        <span class="tab-badge">#qRegistrationCount.form_count#</span>
                    </a>
                </cfoutput>
            </div>
            
            <div class="section">
                <cfoutput>
                    <div class="section-header">
                        <h2>#url.location# Forms (#qForms.recordCount#)</h2>
                        <a href="add.cfm?location=#url.location#" class="btn btn-primary">+ Add New Form</a>
                    </div>

                    <!--- Search Box and Status Filter --->
                    <div class="search-container">
                        <input
                            type="text"
                            id="searchInput"
                            class="search-input"
                            placeholder="Search by form name or description..."
                            onkeyup="filterTable()">
                        <form method="post" action="index.cfm?location=#url.location#" style="display: inline;">
                            <select name="statusFilter" class="status-filter" onchange="this.form.submit()">
                                <option value="all" <cfif session["forms_#url.location#_statusFilter"] EQ "all">selected</cfif>>All Statuses</option>
                                <option value="active" <cfif session["forms_#url.location#_statusFilter"] EQ "active">selected</cfif>>Active</option>
                                <option value="inactive" <cfif session["forms_#url.location#_statusFilter"] EQ "inactive">selected</cfif>>Inactive</option>
                            </select>
                        </form>
                        <span class="search-results" id="searchResults"></span>
                    </div>

                    <!--- Top Pagination --->
                    <div class="pagination-container" id="paginationContainerTop">
                        <div class="pagination-info" id="paginationInfoTop"></div>
                        <div class="pagination-controls" id="paginationControlsTop"></div>
                    </div>
                </cfoutput>

                <cfif qForms.recordCount EQ 0>
                    <div class="empty-state">
                        <cfoutput>
                            <p>No #lcase(url.location)# forms found.</p>
                            <a href="add.cfm?location=#url.location#" class="btn btn-primary">Create Your First Form</a>
                        </cfoutput>
                    </div>
                <cfelse>
                    <table class="data-table" id="forms-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Form Details</th>
                                <th class="col-status">Status</th>
                                <th class="actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody">
                            <cfoutput query="qForms">
                                <tr data-search="#lCase(htmlEditFormat(form_name))# #lCase(htmlEditFormat(form_description))#" data-status="#is_active ? 'active' : 'inactive'#">
                                    <td class="text-center">
                                        <form method="post" action="index.cfm?location=#url.location#" style="margin: 0;">
                                            <input type="hidden" name="form_id" value="#id#">
                                            <select name="new_order" onchange="this.form.submit()">
                                                <cfloop from="1" to="#totalCount#" index="loopIndex">
                                                    <option value="#loopIndex#" <cfif display_order EQ loopIndex>selected</cfif>>#loopIndex#</option>
                                                </cfloop>
                                            </select>
                                        </form>
                                    </td>
                                    <td>
                                        <strong>#htmlEditFormat(form_name)#</strong>
                                        <cfif len(form_description) GT 0>
                                            <cfif len(form_description) GT 100>
                                                <br><small class="text-muted">#left(htmlEditFormat(form_description), 100)#...</small>
                                            <cfelse>
                                                <br><small class="text-muted">#htmlEditFormat(form_description)#</small>
                                            </cfif>
                                        </cfif>
                                    </td>
                                    <td class="col-status">
                                        <cfif is_active>
                                            <span class="badge badge-success">✓ Active</span>
                                        <cfelse>
                                            <span class="badge badge-inactive">Inactive</span>
                                        </cfif>
                                    </td>
                                    <td class="actions">
                                        <a href="edit.cfm?id=#id#&location=#url.location#" class="btn btn-sm btn-edit" title="Edit">✏️</a>
                                        <a href="index.cfm?location=#url.location#&toggle=#id#" class="btn btn-sm btn-toggle" title="Toggle Active/Inactive">
                                            <cfif is_active>👁️<cfelse>🚫</cfif>
                                        </a>
                                        <a href="delete.cfm?id=#id#&location=#url.location#" class="btn btn-sm btn-delete" title="Delete">🗑️</a>
                                    </td>
                                </tr>
                            </cfoutput>
                        </tbody>
                    </table>

                    <!--- Pagination --->
                    <div class="pagination-container" id="paginationContainer">
                        <div class="pagination-info" id="paginationInfo"></div>
                        <div class="pagination-controls" id="paginationControls"></div>
                    </div>
                </cfif>
            </div>
        </main>
    </div>

    <!--- JavaScript --->
    <script>
    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredRows = [];

    // Search and Pagination function
    function filterTable() {
        const searchInput = document.getElementById('searchInput');
        const searchFilter = searchInput.value.toLowerCase();
        const tableBody = document.getElementById('tableBody');
        const rows = Array.from(tableBody.getElementsByTagName('tr'));

        // Filter rows by search only (status filtering is server-side)
        filteredRows = rows.filter(row => {
            const searchData = row.getAttribute('data-search');
            // Check search match
            return !searchFilter || (searchData && searchData.indexOf(searchFilter) > -1);
        });

        // Update search results text
        const resultsSpan = document.getElementById('searchResults');
        if (searchFilter.length > 0) {
            resultsSpan.textContent = filteredRows.length + ' result' + (filteredRows.length !== 1 ? 's' : '') + ' found';
        } else {
            resultsSpan.textContent = '';
        }

        // Reset to page 1 when filters change
        currentPage = 1;

        // Apply pagination
        paginateRows();
    }

    function paginateRows() {
        const tableBody = document.getElementById('tableBody');
        const allRows = Array.from(tableBody.getElementsByTagName('tr'));

        // Hide all rows first
        allRows.forEach(row => row.style.display = 'none');

        // Calculate pagination
        const totalItems = filteredRows.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

        // Show only current page rows
        for (let i = startIndex; i < endIndex; i++) {
            filteredRows[i].style.display = '';
        }

        // Update pagination info (both top and bottom)
        const paginationInfo = document.getElementById('paginationInfo');
        const paginationInfoTop = document.getElementById('paginationInfoTop');
        const infoText = totalItems > 0
            ? `Showing ${startIndex + 1}-${endIndex} of ${totalItems} total`
            : 'No results found';

        paginationInfo.textContent = infoText;
        paginationInfoTop.textContent = infoText;

        // Update pagination controls
        updatePaginationControls(totalPages);
    }

    function updatePaginationControls(totalPages) {
        // Always show pagination (even with 1 or 0 pages)
        // Ensure at least 1 page
        if (totalPages < 1) totalPages = 1;

        // Update both top and bottom pagination
        buildPaginationControls('paginationControls', totalPages);
        buildPaginationControls('paginationControlsTop', totalPages);
    }

    function buildPaginationControls(containerId, totalPages) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '« Previous';
        prevBtn.className = 'pagination-btn';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                paginateRows();
            }
        };
        container.appendChild(prevBtn);

        if (totalPages > 1) {
            // Page numbers
            const maxPagesToShow = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            if (endPage - startPage < maxPagesToShow - 1) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            if (startPage > 1) {
                const firstBtn = document.createElement('button');
                firstBtn.textContent = '1';
                firstBtn.className = 'pagination-btn';
                firstBtn.onclick = () => {
                    currentPage = 1;
                    paginateRows();
                };
                container.appendChild(firstBtn);

                if (startPage > 2) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '...';
                    ellipsis.style.padding = '0 8px';
                    ellipsis.style.color = '#666';
                    container.appendChild(ellipsis);
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.textContent = i;
                pageBtn.className = 'pagination-btn' + (i === currentPage ? ' active' : '');
                pageBtn.onclick = ((page) => {
                    return () => {
                        currentPage = page;
                        paginateRows();
                    };
                })(i);
                container.appendChild(pageBtn);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '...';
                    ellipsis.style.padding = '0 8px';
                    ellipsis.style.color = '#666';
                    container.appendChild(ellipsis);
                }

                const lastBtn = document.createElement('button');
                lastBtn.textContent = totalPages;
                lastBtn.className = 'pagination-btn';
                lastBtn.onclick = () => {
                    currentPage = totalPages;
                    paginateRows();
                };
                container.appendChild(lastBtn);
            }
        } else {
            // Single page - show page 1 button (active but no click needed)
            const pageBtn = document.createElement('button');
            pageBtn.textContent = '1';
            pageBtn.className = 'pagination-btn active';
            pageBtn.disabled = true;
            container.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next »';
        nextBtn.className = 'pagination-btn';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                paginateRows();
            }
        };
        container.appendChild(nextBtn);
    }

    // Initialize pagination on page load
    window.addEventListener('DOMContentLoaded', () => {
        filterTable();
    });
    </script>
</body>
</html>
