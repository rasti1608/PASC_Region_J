<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /gallery.cfm
* Created:     October 25, 2025
* Updated:     October 31, 2025
* Author:      Rastislav Toscak
*
* Purpose:     Photo gallery page for PASC Region J Conference 2026
*              Displays conference photos with advanced pagination and lightbox
*              Images pulled from database (dbo.gallery table)
*
* Features:    - 9 images per page (3x3 grid layout)
*              - Advanced pagination: First, Previous, Input Box, Next, Last
*              - Lightbox modal for full-size viewing
*              - Keyboard navigation (arrows, ESC)
*              - Responsive design (mobile: 2 columns, extra-small: 1 column)
*              - Top and bottom pagination controls
*
* Database:    Queries dbo.gallery table
*              WHERE page_location = 'gallery' AND is_active = 1
*              ORDER BY display_order ASC
*
* Reference:   Based on exhibit_d.html design (proven working implementation)
*
* Project:     PASC Region J Conference 2026 Website
*              Lead Beyond Limits - February 13, 2026
*******************************************************************************
--->

<!--- Include database configuration --->
<cfinclude template="includes/db_config.cfm">

<!--- Pagination settings --->
<cfparam name="url.page" default="1">
<cfset imagesPerPage = 9>
<cfset currentPage = max(1, val(url.page))>
<cfset offset = (currentPage - 1) * imagesPerPage>

<!--- Get total count of gallery images --->
<cfquery name="qGalleryCount" datasource="#application.datasource#">
    SELECT COUNT(*) as totalCount
    FROM dbo.gallery
    WHERE page_location = 'gallery'
        AND is_active = 1
</cfquery>

<cfset totalImages = qGalleryCount.totalCount>
<cfset totalPages = ceiling(totalImages / imagesPerPage)>

<!--- Validate current page --->
<cfif currentPage GT totalPages AND totalPages GT 0>
    <cflocation url="gallery.cfm?page=1" addtoken="false">
</cfif>

<!--- Fetch gallery images for current page --->
<cfquery name="qGalleryImages" datasource="#application.datasource#">
    SELECT
        id,
        title,
        filename,
        file_extension,
        display_order
    FROM dbo.gallery
    WHERE page_location = 'gallery'
        AND is_active = 1
    ORDER BY display_order ASC
    OFFSET #offset# ROWS
    FETCH NEXT #imagesPerPage# ROWS ONLY
</cfquery>

<!--- Calculate photo range for pagination display --->
<cfset startPhoto = offset + 1>
<cfset endPhoto = min(offset + imagesPerPage, totalImages)>

</cfsilent>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Photo Gallery - PASC Region J Conference 2026</title>
    <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="/assets/css/mobile-menu.css">
    <link rel="stylesheet" href="/assets/css/hero-video.css">
    <link rel="stylesheet" href="/assets/css/animations.css">
    <link rel="icon" type="image/png" href="/assets/img/favicon.png">
</head>
<body>

<!--- Include header (navigation) --->
<cfinclude template="includes/header.cfm">

<!--- Hero Section --->
<section class="page-hero">
    <!--- Video Background - Desktop --->
    <video id="galleryVideo" class="hero-video hero-video-desktop" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>

    <!--- Video Background - Mobile --->
    <video id="galleryVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>

    <div class="container">
        <h1 class="hero-title" id="galleryTitle">Photo Gallery</h1>
        <p class="hero-subtitle" id="gallerySubtitle">Conference Memories & Highlights</p>
    </div>
</section>

<!--- Gallery Section --->
<section class="gallery-section">
    <div class="container">
        <cfif qGalleryImages.recordCount GT 0>

            <!--- TOP PAGINATION CONTROLS --->
            <div class="controls">
                <div class="page-info">
                    <cfoutput>
                        Page <span id="currentPage">#currentPage#</span> of <span id="totalPages">#totalPages#</span>
                        (Photos <span id="startPhoto">#startPhoto#</span>-<span id="endPhoto">#endPhoto#</span> of <span id="totalPhotos">#totalImages#</span>)
                    </cfoutput>
                </div>
                <div class="nav-buttons">
                    <cfoutput>
                        <button class="nav-button" id="firstButton" onclick="goToPage(1)" <cfif currentPage EQ 1>disabled</cfif>>⏮ First</button>
                        <button class="nav-button" id="prevButton" onclick="previousPage()" <cfif currentPage EQ 1>disabled</cfif>>◀ Previous</button>
                        <input type="number"
                               class="page-input"
                               id="pageInput"
                               min="1"
                               max="#totalPages#"
                               value="#currentPage#"
                               oninput="handlePageInput(event)"
                               onkeyup="handlePageInput(event)"
                               onchange="handlePageInput(event)">
                        <button class="nav-button" id="nextButton" onclick="nextPage()" <cfif currentPage EQ totalPages>disabled</cfif>>Next ▶</button>
                        <button class="nav-button" id="lastButton" onclick="goToPage(#totalPages#)" <cfif currentPage EQ totalPages>disabled</cfif>>Last ⏭</button>
                    </cfoutput>
                </div>
            </div>

            <!--- Gallery Grid --->
            <div class="gallery-grid">
                <cfoutput query="qGalleryImages">
                    <div class="gallery-item">
                        <img
                            src="/assets/img/Gallery/#filename#"
                            alt="#htmlEditFormat(title)#"
                            onclick="openModal(this.src, #currentRow - 1#)"
                            loading="lazy">
                        <div class="info">
                            <div class="date">#htmlEditFormat(title)#</div>
                        </div>
                    </div>
                </cfoutput>
            </div>

            <!--- BOTTOM PAGINATION CONTROLS (IDENTICAL TO TOP) --->
            <div class="controls">
                <div class="page-info">
                    <cfoutput>
                        Page <span id="currentPageBottom">#currentPage#</span> of <span id="totalPagesBottom">#totalPages#</span>
                        (Photos <span id="startPhotoBottom">#startPhoto#</span>-<span id="endPhotoBottom">#endPhoto#</span> of <span id="totalPhotosBottom">#totalImages#</span>)
                    </cfoutput>
                </div>
                <div class="nav-buttons">
                    <cfoutput>
                        <button class="nav-button" id="firstButtonBottom" onclick="goToPage(1)" <cfif currentPage EQ 1>disabled</cfif>>⏮ First</button>
                        <button class="nav-button" id="prevButtonBottom" onclick="previousPage()" <cfif currentPage EQ 1>disabled</cfif>>◀ Previous</button>
                        <input type="number"
                               class="page-input"
                               id="pageInputBottom"
                               min="1"
                               max="#totalPages#"
                               value="#currentPage#"
                               oninput="handlePageInput(event)"
                               onkeyup="handlePageInput(event)"
                               onchange="handlePageInput(event)">
                        <button class="nav-button" id="nextButtonBottom" onclick="nextPage()" <cfif currentPage EQ totalPages>disabled</cfif>>Next ▶</button>
                        <button class="nav-button" id="lastButtonBottom" onclick="goToPage(#totalPages#)" <cfif currentPage EQ totalPages>disabled</cfif>>Last ⏭</button>
                    </cfoutput>
                </div>
            </div>

        <cfelse>
            <!--- Empty Gallery State --->
            <div class="gallery-empty">
                <div class="gallery-empty-icon">📸</div>
                <h2>No Photos Yet</h2>
                <p>Gallery photos will be added soon. Check back later!</p>
                <a href="index.cfm" class="btn btn-primary">Return Home</a>
            </div>
        </cfif>
    </div>
</section>

<!--- Lightbox Modal --->
<div id="imageModal" class="modal" onclick="closeModal()">
    <span class="close" onclick="closeModal()">&times;</span>
    <img class="modal-content" id="modalImage" onclick="event.stopPropagation()">

    <div class="modal-arrows">
        <button class="arrow-left" id="prevModalBtn" onclick="previousModalImage(event)">◀</button>
        <button class="arrow-right" id="nextModalBtn" onclick="nextModalImage(event)">▶</button>
    </div>

    <div class="modal-info" id="modalInfo">Photo 1 of 1</div>
</div>

<!--- Include footer --->
<cfinclude template="includes/footer.cfm">

<!--- Gallery JavaScript --->
<script>
// Gallery data for lightbox
const galleryImages = [
    <cfoutput query="qGalleryImages">
        {
            filename: '#jsStringFormat(filename)#',
            title: '#jsStringFormat(title)#',
            index: #currentRow#
        }<cfif currentRow LT qGalleryImages.recordCount>,</cfif>
    </cfoutput>
];

let currentPage = <cfoutput>#currentPage#</cfoutput>;
let totalPages = <cfoutput>#totalPages#</cfoutput>;
let currentModalIndex = 0;

// ========================================
// PAGE NAVIGATION FUNCTIONS
// ========================================

function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
        window.location.href = 'gallery.cfm?page=' + page;
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

function previousPage() {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

let inputTimeout;
function handlePageInput(event) {
    const inputValue = parseInt(event.target.value);

    // Clear previous timeout
    if (inputTimeout) {
        clearTimeout(inputTimeout);
    }

    // If Enter key is pressed, jump immediately
    if (event.key === 'Enter') {
        if (inputValue >= 1 && inputValue <= totalPages) {
            goToPage(inputValue);
        }
        return;
    }

    // For typing, wait 1 second before jumping
    if (inputValue >= 1 && inputValue <= totalPages) {
        inputTimeout = setTimeout(() => {
            goToPage(inputValue);
        }, 1000);
    }
}

// ========================================
// LIGHTBOX MODAL FUNCTIONS
// ========================================

function openModal(src, index) {
    currentModalIndex = index;
    document.getElementById('imageModal').style.display = 'block';
    document.getElementById('modalImage').src = src;

    // Update modal info
    document.getElementById('modalInfo').textContent = 'Photo ' + (index + 1) + ' of ' + galleryImages.length;

    // Update button states
    document.getElementById('prevModalBtn').disabled = (index === 0);
    document.getElementById('nextModalBtn').disabled = (index === galleryImages.length - 1);

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
    document.body.style.overflow = '';
}

function previousModalImage(event) {
    event.stopPropagation();
    if (currentModalIndex > 0) {
        currentModalIndex--;
        const newSrc = '/assets/img/Gallery/' + galleryImages[currentModalIndex].filename;
        document.getElementById('modalImage').src = newSrc;

        document.getElementById('modalInfo').textContent = 'Photo ' + (currentModalIndex + 1) + ' of ' + galleryImages.length;

        document.getElementById('prevModalBtn').disabled = (currentModalIndex === 0);
        document.getElementById('nextModalBtn').disabled = (currentModalIndex === galleryImages.length - 1);
    }
}

function nextModalImage(event) {
    event.stopPropagation();
    if (currentModalIndex < galleryImages.length - 1) {
        currentModalIndex++;
        const newSrc = '/assets/img/Gallery/' + galleryImages[currentModalIndex].filename;
        document.getElementById('modalImage').src = newSrc;

        document.getElementById('modalInfo').textContent = 'Photo ' + (currentModalIndex + 1) + ' of ' + galleryImages.length;

        document.getElementById('prevModalBtn').disabled = (currentModalIndex === 0);
        document.getElementById('nextModalBtn').disabled = (currentModalIndex === galleryImages.length - 1);
    }
}

// ========================================
// KEYBOARD NAVIGATION
// ========================================

document.addEventListener('keydown', function(event) {
    if (document.getElementById('imageModal').style.display === 'block') {
        if (event.key === 'ArrowLeft') {
            previousModalImage(event);
        } else if (event.key === 'ArrowRight') {
            nextModalImage(event);
        } else if (event.key === 'Escape') {
            closeModal();
        }
    }
});
</script>

</body>
</html>
