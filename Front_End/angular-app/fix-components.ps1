# PowerShell script to fix all component files

$components = @(
    @{Path="src/app/admin/dashboard/dashboard.component.ts"; Class="Dashboard"; Selector="app-dashboard"},
    @{Path="src/app/admin/announcements/announcement-list/announcement-list.component.ts"; Class="AnnouncementList"; Selector="app-announcement-list"},
    @{Path="src/app/admin/announcements/announcement-form/announcement-form.component.ts"; Class="AnnouncementForm"; Selector="app-announcement-form"},
    @{Path="src/app/admin/forms/form-list/form-list.component.ts"; Class="FormList"; Selector="app-form-list"},
    @{Path="src/app/admin/forms/form-form/form-form.component.ts"; Class="FormForm"; Selector="app-form-form"},
    @{Path="src/app/admin/gallery/gallery-list/gallery-list.component.ts"; Class="GalleryList"; Selector="app-gallery-list"},
    @{Path="src/app/admin/gallery/gallery-upload/gallery-upload.component.ts"; Class="GalleryUpload"; Selector="app-gallery-upload"},
    @{Path="src/app/admin/gallery/gallery-edit/gallery-edit.component.ts"; Class="GalleryEdit"; Selector="app-gallery-edit"},
    @{Path="src/app/admin/documents/document-list/document-list.component.ts"; Class="DocumentList"; Selector="app-document-list"},
    @{Path="src/app/admin/documents/document-upload/document-upload.component.ts"; Class="DocumentUpload"; Selector="app-document-upload"},
    @{Path="src/app/admin/documents/document-edit/document-edit.component.ts"; Class="DocumentEdit"; Selector="app-document-edit"},
    @{Path="src/app/admin/contacts/contact-list/contact-list.component.ts"; Class="ContactList"; Selector="app-contact-list"},
    @{Path="src/app/admin/users/user-list/user-list.component.ts"; Class="UserList"; Selector="app-user-list"},
    @{Path="src/app/admin/users/user-form/user-form.component.ts"; Class="UserForm"; Selector="app-user-form"},
    @{Path="src/app/admin/profile/profile.component.ts"; Class="Profile"; Selector="app-profile"},
    @{Path="src/app/admin/shared/data-table/data-table.component.ts"; Class="DataTable"; Selector="app-data-table"},
    @{Path="src/app/admin/shared/pagination/pagination.component.ts"; Class="Pagination"; Selector="app-pagination"},
    @{Path="src/app/admin/shared/search-filter/search-filter.component.ts"; Class="SearchFilter"; Selector="app-search-filter"},
    @{Path="src/app/admin/shared/status-badge/status-badge.component.ts"; Class="StatusBadge"; Selector="app-status-badge"},
    @{Path="src/app/admin/shared/stats-card/stats-card.component.ts"; Class="StatsCard"; Selector="app-stats-card"},
    @{Path="src/app/admin/shared/modal/modal.component.ts"; Class="Modal"; Selector="app-modal"},
    @{Path="src/app/admin/shared/empty-state/empty-state.component.ts"; Class="EmptyState"; Selector="app-empty-state"}
)

foreach ($comp in $components) {
    $className = $comp.Class + "Component"
    $selector = $comp.Selector
    $path = $comp.Path

    # Extract base name from path (e.g., "dashboard" from "dashboard.component.ts")
    $baseName = $path.Split('/')[-2]

    $content = @"
import { Component } from '@angular/core';

@Component({
  selector: '$selector',
  standalone: false,
  templateUrl: './$baseName.component.html',
  styleUrls: ['./$baseName.component.css']
})
export class $className {

}
"@

    Write-Host "Updating $path"
    Set-Content -Path $path -Value $content -Force
}

Write-Host "Done updating all component files!"
