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
*              Lead Beyond Limits - February 13, 2026
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
    </div>
</section>

<!--- Conference Anthem Section --->
<section class="anthem-section">
    <!--- Section Background Video --->
    <video id="anthemSectionVideo" class="anthem-section-video" muted loop playsinline>
        <source src="/assets/video/resources-background.mp4" type="video/mp4">
    </video>

    <div class="container">
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
                <a href="/assets/audio/one-orbit-anthem.mp3" download="one-orbit-anthem.mp3" class="btn btn-download">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download MP3
                </a>
            </div>
        </div>
    </div>
</section>

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

<!--- CSS Styles --->
<style>
    /* ========================================
       ANTHEM SECTION STYLES
       ======================================== */
    .anthem-section {
        position: relative;
        overflow: hidden;
        background: linear-gradient(135deg, rgba(91, 75, 138, 0.1) 0%, rgba(26, 35, 50, 0.3) 100%);
        padding: 60px 0;
        border-bottom: 1px solid rgba(79, 195, 247, 0.2);
    }

    .anthem-section-video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 0;
        opacity: 0.5;
    }

    .anthem-section .container {
        position: relative;
        z-index: 1;
    }

    .anthem-featured {
        position: relative;
        overflow: hidden;
        max-width: 800px;
        margin: 0 auto;
        background: rgba(138, 43, 226, 0.15);
        border: 2px solid rgba(138, 43, 226, 0.4);
        border-radius: 20px;
        padding: 40px;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(138, 43, 226, 0.3);
    }

    .anthem-header {
        position: relative;
        z-index: 1;
        text-align: center;
        margin-bottom: 30px;
    }

    .anthem-header h2 {
        color: #ffffff;
        font-size: 2rem;
        margin-bottom: 15px;
        font-weight: 700;
    }

    .anthem-info {
        margin-bottom: 20px;
    }

    .song-title {
        color: #ffd700;
        font-size: 1.5rem;
        margin: 10px 0 5px;
        font-weight: 600;
    }

    .song-artist {
        color: #b0b8d4;
        font-size: 1.1rem;
        margin: 5px 0;
        font-style: italic;
    }

    .song-description {
        color: #e0e0e0;
        font-size: 0.95rem;
        margin: 10px 0;
        line-height: 1.5;
    }

    /* Text shadows for readability over video background */
    .anthem-header h2,
    .song-title,
    .song-artist,
    .song-description {
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8),
                     0 0 20px rgba(0, 0, 0, 0.6);
    }

    /* Custom Audio Player */
    .custom-audio-player {
        position: relative;
        z-index: 1;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 15px;
        padding: 20px;
        margin: 20px 0;
    }

    .anthem-player-video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 0;
        border-radius: 20px;
        opacity: 0.4;
    }

    .player-controls {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .play-pause-btn {
        background: linear-gradient(135deg, #8a2be2, #9370db);
        border: none;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(138, 43, 226, 0.4);
        flex-shrink: 0;
    }

    .play-pause-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(138, 43, 226, 0.6);
    }

    .play-pause-btn:active {
        transform: scale(0.95);
    }

    .play-pause-btn svg {
        color: #ffffff;
    }

    .player-info {
        flex: 1;
    }

    .progress-container {
        margin-bottom: 8px;
    }

    .progress-bar {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #8a2be2, #9370db);
        border-radius: 3px;
        width: 0%;
        transition: width 0.1s linear;
    }

    .time-display {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #b0b8d4;
        font-size: 0.9rem;
        font-family: monospace;
    }

    .time-separator {
        color: #8a8a8a;
    }

    /* Download Button */
    .anthem-download {
        position: relative;
        z-index: 1;
        text-align: center;
        margin-top: 20px;
    }

    .btn-download {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #4a90e2, #357abd);
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
    }

    .btn-download:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(74, 144, 226, 0.5);
        background: linear-gradient(135deg, #357abd, #2868a8);
    }

    .btn-download svg {
        width: 20px;
        height: 20px;
    }

    /* ========================================
       DOCUMENTS SECTION STYLES
       ======================================== */
    .documents-section {
        padding: 60px 0 80px;
        background: linear-gradient(180deg, rgba(10, 14, 39, 0.5) 0%, rgba(26, 35, 50, 0.7) 100%);
    }

    .section-header {
        text-align: center;
        margin-bottom: 40px;
    }

    .section-header h2 {
        color: #ffffff;
        font-size: 2rem;
        margin-bottom: 10px;
        font-weight: 700;
    }

    .section-description {
        color: #b0b8d4;
        font-size: 1.1rem;
    }

    /* Documents Grid */
    .documents-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
    }

    .document-card {
        background: rgba(26, 31, 58, 0.6);
        border: 2px solid rgba(79, 195, 247, 0.3);
        border-radius: 12px;
        padding: 2rem;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
    }

    .document-card:hover {
        transform: translateY(-5px);
        border-color: rgba(79, 195, 247, 0.6);
        box-shadow: 0 10px 30px rgba(79, 195, 247, 0.2);
    }

    .document-icon {
        font-size: 3rem;
        margin-bottom: 15px;
        text-align: center;
    }

    .icon-pdf { filter: hue-rotate(340deg); }
    .icon-word { filter: hue-rotate(200deg); }
    .icon-excel { filter: hue-rotate(100deg); }
    .icon-powerpoint { filter: hue-rotate(20deg); }
    .icon-generic { filter: grayscale(50%); }

    .document-title {
        color: #ffffff;
        font-size: 1.3rem;
        margin-bottom: 10px;
        font-weight: 600;
    }

    .document-description {
        color: #b0b8d4;
        font-size: 0.95rem;
        line-height: 1.5;
        margin-bottom: 15px;
        flex-grow: 1;
    }

    .document-badge {
        display: inline-block;
        background: rgba(74, 144, 226, 0.3);
        color: #4fc3f7;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.85rem;
        margin-bottom: 10px;
        border: 1px solid rgba(79, 195, 247, 0.5);
    }

    .document-size {
        color: #8a8a8a;
        font-size: 0.9rem;
        margin-bottom: 15px;
        font-family: monospace;
    }

    .btn-download-doc {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background: linear-gradient(135deg, #5b4b8a, #7b6aa8);
        color: #ffffff;
        padding: 10px 20px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(91, 75, 138, 0.3);
        margin-top: auto;
    }

    .btn-download-doc:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(91, 75, 138, 0.5);
        background: linear-gradient(135deg, #7b6aa8, #9b8ac8);
    }

    .btn-download-doc svg {
        width: 16px;
        height: 16px;
    }

    /* No Documents State */
    .no-documents {
        text-align: center;
        padding: 60px 20px;
        color: #b0b8d4;
        font-size: 1.2rem;
    }

    /* ========================================
       RESPONSIVE STYLES
       ======================================== */
    @media (max-width: 768px) {
        .anthem-featured {
            padding: 30px 20px;
        }

        .anthem-header h2 {
            font-size: 1.5rem;
        }

        .song-title {
            font-size: 1.2rem;
        }

        .player-controls {
            flex-direction: column;
            gap: 15px;
        }

        .play-pause-btn {
            width: 50px;
            height: 50px;
        }

        .documents-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
        }

        .section-header h2 {
            font-size: 1.5rem;
        }
    }

    @media (max-width: 480px) {
        .anthem-section {
            padding: 40px 0;
        }

        .documents-section {
            padding: 40px 0 60px;
        }

        .documents-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .document-card {
            padding: 1.5rem;
        }
    }
</style>

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
