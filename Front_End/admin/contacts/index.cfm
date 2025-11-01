<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /admin/contacts/index.cfm
* Created:     October 31, 2025
* Updated:     October 31, 2025
* Author:      Contact Form System Implementation
*
* Purpose:     Admin panel for managing contact form submissions
*              View, filter, search, and update submission status
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Check authentication --->
<cfinclude template="../../includes/auth_check.cfm">

<!--- Handle status filter form submission --->
<cfif structKeyExists(form, "statusFilter")>
    <cfset session.contacts_statusFilter = form.statusFilter>
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Initialize session filter if not set --->
<cfif NOT structKeyExists(session, "contacts_statusFilter")>
    <cfset session.contacts_statusFilter = "all">
</cfif>

<!--- Handle status update from modal --->
<cfif structKeyExists(form, "submission_id") AND structKeyExists(form, "new_status")>
    <cfquery datasource="#application.datasource#">
        UPDATE dbo.contact_submissions
        SET status = <cfqueryparam value="#form.new_status#" cfsqltype="cf_sql_varchar">
        WHERE id = <cfqueryparam value="#form.submission_id#" cfsqltype="cf_sql_integer">
    </cfquery>
    <cfset session.success_message = "Status updated successfully!">
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Handle admin notes update from modal --->
<cfif structKeyExists(form, "submission_id_notes") AND structKeyExists(form, "admin_notes")>
    <cfquery datasource="#application.datasource#">
        UPDATE dbo.contact_submissions
        SET admin_notes = <cfqueryparam value="#trim(form.admin_notes)#" cfsqltype="cf_sql_nvarchar">
        WHERE id = <cfqueryparam value="#form.submission_id_notes#" cfsqltype="cf_sql_integer">
    </cfquery>
    <cfset session.success_message = "Admin notes saved successfully!">
    <cflocation url="index.cfm" addtoken="false">
</cfif>

<!--- Get all submissions --->
<cfquery name="qSubmissions" datasource="#application.datasource#">
    SELECT
        id,
        name,
        email,
        subject,
        LEFT(message, 100) as message_preview,
        message,
        submitted_at,
        ip_address,
        status,
        admin_notes
    FROM dbo.contact_submissions
    WHERE 1=1
    <cfif session.contacts_statusFilter NEQ "all">
        AND status = <cfqueryparam value="#session.contacts_statusFilter#" cfsqltype="cf_sql_varchar">
    </cfif>
    ORDER BY
        CASE status
            WHEN 'new' THEN 1
            WHEN 'read' THEN 2
            WHEN 'replied' THEN 3
            WHEN 'archived' THEN 4
        END,
        submitted_at DESC
</cfquery>

<!--- Get status counts --->
<cfquery name="qStatusCounts" datasource="#application.datasource#">
    SELECT
        status,
        COUNT(*) as count
    FROM dbo.contact_submissions
    GROUP BY status
</cfquery>

<cfset statusCounts = structNew()>
<cfset statusCounts.new = 0>
<cfset statusCounts.read = 0>
<cfset statusCounts.replied = 0>
<cfset statusCounts.archived = 0>

<cfloop query="qStatusCounts">
    <cfset statusCounts[status] = count>
</cfloop>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Contact Submissions - PASC Region J Admin</title>
    <link rel="stylesheet" href="/assets/css/admin-dashboard.css">
    <style>
        /* Status badges with existing theme colors */
        .badge-new {
            background: #fff3e0;
            color: #e65100;
        }
        .badge-read {
            background: #e3f2fd;
            color: #1565c0;
        }
        .badge-replied {
            background: #e8f5e9;
            color: #2e7d32;
        }
        .badge-archived {
            background: #fafafa;
            color: #666;
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

        /* Modal styles (based on gallery modal) */
        .modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            overflow-y: auto;
        }

        .modal-content {
            background: #ffffff;
            margin: 50px auto;
            padding: 0;
            border-radius: 12px;
            width: 90%;
            max-width: 800px;
            position: relative;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
            background: linear-gradient(135deg, #2d3561 0%, #1a1f3a 100%);
            color: #ffffff;
            padding: 25px 30px;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h2 {
            margin: 0;
            font-size: 1.5rem;
        }

        .close {
            color: #ffffff;
            font-size: 32px;
            font-weight: bold;
            cursor: pointer;
            line-height: 1;
            transition: color 0.3s;
        }

        .close:hover {
            color: #ff6b6b;
        }

        .modal-body {
            padding: 30px;
        }

        .detail-row {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #f0f0f0;
        }

        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .detail-label {
            font-weight: 600;
            color: #1a1f3a;
            margin-bottom: 8px;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .detail-value {
            color: #333;
            line-height: 1.6;
        }

        .message-content {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #4fc3f7;
            white-space: pre-wrap;
        }

        .form-select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            background: #ffffff;
            color: #333;
            font-size: 0.95rem;
        }

        .form-textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-family: inherit;
            font-size: 0.95rem;
            resize: vertical;
        }

        /* Stats summary */
        .stats-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }

        .stat-box {
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #1a1f3a;
        }

        .stat-label {
            font-size: 0.85rem;
            color: #666;
            text-transform: uppercase;
            margin-top: 5px;
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
                <h1>Contact Submissions</h1>
                <p>View and manage contact form submissions</p>
            </div>

            <!--- Success Message --->
            <cfif structKeyExists(session, "success_message")>
                <cfoutput>
                <div class="alert alert-success">
                    #session.success_message#
                </div>
                </cfoutput>
                <cfset structDelete(session, "success_message")>
            </cfif>

            <!--- Stats Summary --->
            <cfoutput>
            <div class="stats-summary">
                <div class="stat-box">
                    <div class="stat-number">#statusCounts.new#</div>
                    <div class="stat-label">New</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">#statusCounts.read#</div>
                    <div class="stat-label">Read</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">#statusCounts.replied#</div>
                    <div class="stat-label">Replied</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">#statusCounts.archived#</div>
                    <div class="stat-label">Archived</div>
                </div>
            </div>
            </cfoutput>

            <div class="section">
                <cfoutput>
                <div class="section-header">
                    <h2>All Submissions (#qSubmissions.recordCount#)</h2>
                    <a href="email-settings.cfm" class="btn btn-primary">⚙️ Email Settings</a>
                </div>

                <!--- Search Box and Status Filter --->
                <div class="search-container">
                    <input
                        type="text"
                        id="searchInput"
                        class="search-input"
                        placeholder="Search by name, email, subject, or message..."
                        onkeyup="filterTable()">
                    <form method="post" action="index.cfm" style="display: inline;">
                        <select name="statusFilter" class="status-filter" onchange="this.form.submit()">
                            <option value="all" <cfif session.contacts_statusFilter EQ "all">selected</cfif>>All Statuses</option>
                            <option value="new" <cfif session.contacts_statusFilter EQ "new">selected</cfif>>New</option>
                            <option value="read" <cfif session.contacts_statusFilter EQ "read">selected</cfif>>Read</option>
                            <option value="replied" <cfif session.contacts_statusFilter EQ "replied">selected</cfif>>Replied</option>
                            <option value="archived" <cfif session.contacts_statusFilter EQ "archived">selected</cfif>>Archived</option>
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

                <cfif qSubmissions.recordCount EQ 0>
                    <div class="empty-state">
                        <p>No contact form submissions yet.</p>
                    </div>
                <cfelse>
                    <table class="data-table" id="contacts-table">
                        <thead>
                            <tr>
                                <th class="col-status">Status</th>
                                <th>Date & Time</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Preview</th>
                                <th class="actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody">
                            <cfoutput query="qSubmissions">
                            <tr data-search="#lCase(htmlEditFormat(name))# #lCase(htmlEditFormat(email))# #lCase(htmlEditFormat(subject))# #lCase(htmlEditFormat(message))#" data-status="#lCase(status)#">
                                <td class="col-status">
                                    <span class="badge badge-#lCase(status)#">#uCase(status)#</span>
                                </td>
                                <td>
                                    #dateFormat(submitted_at, 'mm/dd/yyyy')#<br>
                                    <small class="text-muted">#timeFormat(submitted_at, 'h:mm tt')#</small>
                                </td>
                                <td>#htmlEditFormat(name)#</td>
                                <td>
                                    <a href="mailto:#htmlEditFormat(email)#" style="color: ##4a90e2;">#htmlEditFormat(email)#</a>
                                </td>
                                <td>#htmlEditFormat(subject)#</td>
                                <td>
                                    <small class="text-muted">#htmlEditFormat(message_preview)#<cfif len(message) gt 100>...</cfif></small>
                                </td>
                                <td class="actions">
                                    <button class="btn btn-sm btn-edit" title="Edit Details" onclick="openSubmissionModal(#id#)">✏️</button>
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

    <!--- Submission Details Modal --->
    <div id="submissionModal" class="modal" onclick="closeSubmissionModal()">
        <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-header">
                <h2 id="modalTitle">Submission Details</h2>
                <span class="close" onclick="closeSubmissionModal()">&times;</span>
            </div>
            <div class="modal-body" id="modalBody">
                <!--- Content loaded via JavaScript --->
            </div>
        </div>
    </div>

    <!--- JavaScript --->
    <script>
    // Store submissions data
    const submissions = {
        <cfoutput query="qSubmissions">
        #id#: {
            id: #id#,
            name: '#jsStringFormat(name)#',
            email: '#jsStringFormat(email)#',
            subject: '#jsStringFormat(subject)#',
            message: '#jsStringFormat(message)#',
            submitted_at: '#dateFormat(submitted_at, "mmmm d, yyyy")# at #timeFormat(submitted_at, "h:mm tt")#',
            ip_address: '#jsStringFormat(ip_address)#',
            status: '#status#',
            admin_notes: '#jsStringFormat(admin_notes)#'
        }<cfif currentRow lt recordCount>,</cfif>
        </cfoutput>
    };

    // Open submission modal
    function openSubmissionModal(id) {
        const sub = submissions[id];
        if (!sub) return;

        document.getElementById('modalTitle').textContent = 'Edit Submission #' + id;

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="detail-row">
                <div class="detail-label">From</div>
                <div class="detail-value">
                    <strong>${sub.name}</strong><br>
                    <a href="mailto:${sub.email}" style="color: #4a90e2;">${sub.email}</a>
                </div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Subject</div>
                <div class="detail-value">${sub.subject}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Message</div>
                <div class="message-content">${sub.message}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Submitted</div>
                <div class="detail-value">${sub.submitted_at}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">IP Address</div>
                <div class="detail-value">${sub.ip_address}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Status</div>
                <form method="post" action="index.cfm" style="margin: 0;">
                    <input type="hidden" name="submission_id" value="${sub.id}">
                    <select name="new_status" class="form-select" onchange="this.form.submit()">
                        <option value="new" ${sub.status === 'new' ? 'selected' : ''}>New</option>
                        <option value="read" ${sub.status === 'read' ? 'selected' : ''}>Read</option>
                        <option value="replied" ${sub.status === 'replied' ? 'selected' : ''}>Replied</option>
                        <option value="archived" ${sub.status === 'archived' ? 'selected' : ''}>Archived</option>
                    </select>
                </form>
            </div>

            <div class="detail-row">
                <div class="detail-label">Admin Notes</div>
                <form method="post" action="index.cfm" style="margin: 0;">
                    <input type="hidden" name="submission_id_notes" value="${sub.id}">
                    <textarea name="admin_notes" class="form-textarea" rows="3" placeholder="Add notes about this submission...">${sub.admin_notes}</textarea>
                    <button type="submit" class="btn btn-primary" style="margin-top: 10px;">Save Notes</button>
                </form>
            </div>
        `;

        document.getElementById('submissionModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close submission modal
    function closeSubmissionModal() {
        document.getElementById('submissionModal').style.display = 'none';
        document.body.style.overflow = '';
    }

    // ESC key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeSubmissionModal();
        }
    });

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
