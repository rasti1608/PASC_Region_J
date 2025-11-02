/**
 * Admin Panel Mobile Navigation
 * Handles hamburger menu toggle for mobile responsive sidebar
 */
(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        const hamburger = document.getElementById('hamburger-menu');
        const sidebar = document.querySelector('.admin-sidebar');
        const overlay = document.getElementById('mobile-overlay');

        if (!hamburger || !sidebar || !overlay) {
            return; // Exit if elements don't exist
        }

        const hamburgerIcon = hamburger.querySelector('.hamburger-icon');
        const closeIcon = hamburger.querySelector('.close-icon');

        // Toggle sidebar function
        function toggleSidebar() {
            sidebar.classList.toggle('mobile-open');
            overlay.classList.toggle('active');
            document.body.classList.toggle('mobile-menu-open');

            // Toggle icons
            if (sidebar.classList.contains('mobile-open')) {
                if (hamburgerIcon) hamburgerIcon.style.display = 'none';
                if (closeIcon) closeIcon.style.display = 'block';
            } else {
                if (hamburgerIcon) hamburgerIcon.style.display = 'block';
                if (closeIcon) closeIcon.style.display = 'none';
            }
        }

        // Close sidebar function
        function closeSidebar() {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
            if (hamburgerIcon) hamburgerIcon.style.display = 'block';
            if (closeIcon) closeIcon.style.display = 'none';
        }

        // Hamburger button click
        hamburger.addEventListener('click', toggleSidebar);

        // Overlay click - close sidebar
        overlay.addEventListener('click', closeSidebar);

        // Close sidebar when clicking nav links on mobile
        const navLinks = sidebar.querySelectorAll('.nav-item');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Only auto-close on mobile
                if (window.innerWidth <= 768) {
                    closeSidebar();
                }
            });
        });

        // Close sidebar on window resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeSidebar();
            }
        });
    });
})();
