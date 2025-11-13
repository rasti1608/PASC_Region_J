<cfprocessingdirective pageencoding="utf-8">
<cfsilent>
<!---
*******************************************************************************
* File:        /resources.cfm
* Created:     October 26, 2025
* Updated:     November 2, 2025
* Author:      Rastislav Toscak
*
* Purpose:     Resources page with Conference Anthem player and Document Library
*              Provides access to downloadable conference materials and resources
*
* Sections:    1. Hero section
*              2. Conference Anthem audio player
*              3. Document Library (downloadable documents)
*
* Project:     PASC Region J Conference 2026 Website
*              Reach for the stars, lead beyond limits - February 13, 2026
*******************************************************************************
--->

<!--- Include database configuration --->
<cfinclude template="includes/db_config.cfm">

<!--- Query Documents from Database --->
<cfquery name="qDocuments" datasource="#application.datasource#">
    SELECT
        id,
        title,
        description,
        filename,
        original_filename,
        file_extension,
        file_size,
        document_type,
        display_order
    FROM dbo.documents
    WHERE is_active = 1
    ORDER BY display_order ASC, id ASC
</cfquery>

</cfsilent><!--- Include header --->
<cfinclude template="includes/header.cfm">
<link rel="stylesheet" href="/assets/css/resources-anthem-player.css">

<!--- Hero Section --->
<section class="page-hero">
    <!--- Video Background - Desktop --->
    <video id="resourcesVideo" class="hero-video hero-video-desktop" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>

    <!--- Video Background - Mobile --->
    <video id="resourcesVideoMobile" class="hero-video hero-video-mobile" muted loop playsinline>
        <source src="/assets/video/space-background.mp4" type="video/mp4">
    </video>

    <div class="container">
        <h1 class="hero-title" id="resourcesTitle">Resources</h1>
        <p class="hero-subtitle" id="resourcesSubtitle">Conference Materials & Media</p>
        <p class="hero-subtitle" class="hero-subtitle-accent">&nbsp</p>
    </div>
</section>

<!--- Conference Anthem Section with Cinema Effect --->
<div class="cinema-theater-wrapper">
    <!--- Static Space Background (Theater Ambiance) --->
    <video class="cinema-space-bg" muted loop playsinline autoplay>
        <source src="/assets/video/intro-space-background.mp4" type="video/mp4">
    </video>

    <!--- Dark Vignette (Theater Edges) --->
    <div class="cinema-vignette"></div>

<section class="anthem-section">
    <!--- Section Background Video --->
    <video id="anthemSectionVideo" class="anthem-section-video" muted loop playsinline>
        <source src="/assets/video/resources-background.mp4" type="video/mp4">
    </video>

    <div class="container">
            <!--- Cinema Screen Frame --->
            <div class="cinema-screen-frame">
        <div class="anthem-featured">
            <!--- Singer Background Video - Covers Entire Section --->
            <video id="anthemPlayerVideo" class="anthem-player-video" muted loop playsinline>
                <source src="/assets/video/conference-anthem-background.mp4" type="video/mp4">
            </video>

            <div class="anthem-header">
                <h2>Conference Anthem</h2>
                <div class="anthem-info">
                    <h3 class="song-title">One Orbit</h3>
                    <p class="song-artist">by IronRUST</p>
                    <p class="song-description">Official theme song for PASC Region J Conference 2026: Reach for the stars, lead beyond limits!</p>
                </div>
            </div>

            <!--- Audio Player --->
            <div class="custom-audio-player">
                <audio id="anthemAudio" preload="metadata" loop>
                    <source src="/assets/audio/one-orbit-anthem.mp3" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>

                <div class="player-controls">
                    <button id="playPauseBtn" class="play-pause-btn" aria-label="Play/Pause">
                        <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <svg class="pause-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                    </button>

                    <div class="player-info">
                        <div class="progress-container">
                            <div class="progress-bar" id="progressBar">
                                <div class="progress-fill" id="progressFill"></div>
                            </div>
                        </div>
                        <div class="time-display">
                            <span id="currentTime">0:00</span>
                            <span class="time-separator">/</span>
                            <span id="duration">0:00</span>
                        </div>
                    </div>
                </div>
            </div>

            <!--- Download Button --->
            <div class="anthem-download">
                <a href="/assets/audio/one-orbit-anthem-full.mp3" download="one-orbit-anthem-full.mp3" class="btn btn-download">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download MP3
                </a>
                <a href="/assets/audio/instrumental_background.mp3" download="instrumental_background.mp3" class="btn btn-download btn-secondary-download">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download Background Music (Instrumental)
                </a>
            </div>
        </div>
            </div> <!--- End cinema-screen-frame --->
    </div>
</section>

</div> <!--- End cinema-theater-wrapper --->
<!--- Document Library Section --->
<section class="documents-section">
    <div class="container">
        <div class="section-header">
            <h2>Resource Library</h2>
            <p class="section-description">Browse and download conference materials, guides, and resources</p>
        </div>

        <cfif qDocuments.recordCount gt 0>
            <div class="documents-grid">
                <cfoutput query="qDocuments">
                    <div class="document-card">
                        <!--- File Type Icon --->
                        <div class="document-icon">
                            <cfif file_extension eq '.pdf'>
                                <span class="icon-pdf">📄</span>
                            <cfelseif listFindNoCase('doc,docx', replace(file_extension, '.', ''))>
                                <span class="icon-word">📘</span>
                            <cfelseif listFindNoCase('xls,xlsx', replace(file_extension, '.', ''))>
                                <span class="icon-excel">📊</span>
                            <cfelseif listFindNoCase('ppt,pptx', replace(file_extension, '.', ''))>
                                <span class="icon-powerpoint">📙</span>
                            <cfelse>
                                <span class="icon-generic">📃</span>
                            </cfif>
                        </div>

                        <!--- Document Title --->
                        <h3 class="document-title">#htmlEditFormat(title)#</h3>

                        <!--- Description (if exists) --->
                        <cfif len(trim(description)) gt 0>
                            <p class="document-description">#htmlEditFormat(description)#</p>
                        </cfif>

                        <!--- Category Badge (if exists) --->
                        <cfif len(trim(document_type)) gt 0>
                            <span class="document-badge">#htmlEditFormat(document_type)#</span>
                        </cfif>

                        <!--- File Size --->
                        <p class="document-size">
                            <cfif file_size gte 1048576>
                                #numberFormat(file_size / 1048576, '9.9')# MB
                            <cfelse>
                                #numberFormat(file_size / 1024, '9.9')# KB
                            </cfif>
                        </p>

                        <!--- Download Button --->
                        <a href="/assets/documents/#filename#" download="#original_filename#" class="btn btn-download-doc">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download
                        </a>
                    </div>
                </cfoutput>
            </div>
        <cfelse>
            <div class="no-documents">
                <p>No resources available yet. Check back soon!</p>
            </div>
        </cfif>
    </div>
</section>

        .cinema-vignette {
            background: radial-gradient(ellipse at center, transparent 20%, rgba(0, 0, 0, 0.9) 100%);
        }
    }


<!--- JavaScript for Audio Player --->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const audio = document.getElementById('anthemAudio');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');
        const progressBar = document.getElementById('progressBar');
        const progressFill = document.getElementById('progressFill');
        const currentTimeEl = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');

        // Get video elements for sync
        const sectionVideo = document.getElementById('anthemSectionVideo');
        const playerVideo = document.getElementById('anthemPlayerVideo');

        // Format time helper (seconds to M:SS)
        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return mins + ':' + (secs < 10 ? '0' : '') + secs;
        }

        // Play/Pause toggle
        playPauseBtn.addEventListener('click', function() {
            if (audio.paused) {
                audio.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                audio.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        });

        // Update progress bar and time
        audio.addEventListener('timeupdate', function() {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = progress + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
        });

        // Set duration when metadata loads
        audio.addEventListener('loadedmetadata', function() {
            durationEl.textContent = formatTime(audio.duration);
        });

        // Seek functionality
        progressBar.addEventListener('click', function(e) {
            const clickX = e.offsetX;
            const width = progressBar.offsetWidth;
            const seekTime = (clickX / width) * audio.duration;
            audio.currentTime = seekTime;
        });

        // Reset icons when audio ends
        audio.addEventListener('ended', function() {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            progressFill.style.width = '0%';
        });

        // Sync videos with audio playback
        audio.addEventListener('play', function() {
            // Update button UI to show pause icon
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';

            // Sync videos
            if (sectionVideo) {
                sectionVideo.play().catch(err => console.log('Section video play failed:', err));
            }
            if (playerVideo) {
                playerVideo.play().catch(err => console.log('Player video play failed:', err));
            }
        });

        audio.addEventListener('pause', function() {
            // Update button UI to show play icon
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';

            // Sync videos
            if (sectionVideo) sectionVideo.pause();
            if (playerVideo) playerVideo.pause();
        });

        // Pause global background music when anthem starts playing
        audio.addEventListener('play', function() {
            const globalAudio = document.getElementById('globalAnthemAudio');
            if (globalAudio && !globalAudio.paused) {
                globalAudio.pause();  // Auto-updates mute button via its event listener
            }
        });
    });
</script>

<!--- Include footer --->
<cfinclude template="includes/footer.cfm">
