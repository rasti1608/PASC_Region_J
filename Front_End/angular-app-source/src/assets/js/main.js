/*******************************************************************************
* File: main.js
* Created: October 26, 2025
* Author: Rastislav Toscak
* Purpose: Main JavaScript for PASC Region J Conference website
*          Handles mobile menu toggle and other interactive features
* Project: PASC Region J Conference 2026 Website
*******************************************************************************/

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main.js loaded');
    
    // =========================================================================
    // Mobile Menu Toggle
    // =========================================================================
    
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        console.log('Mobile menu elements found');
        
        // Toggle menu on button click
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Mobile menu button clicked');
            
            // Toggle active class on button
            this.classList.toggle('active');
            
            // Toggle active class on menu
            navMenu.classList.toggle('active');
            
            // Toggle body scroll lock when menu is open
            document.body.classList.toggle('menu-open');
            
            console.log('Menu toggled:', navMenu.classList.contains('active'));
        });
        
        // Close menu when clicking a link (for single-page sections)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Close menu
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                console.log('Menu closed via link click');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    
                    console.log('Menu closed via outside click');
                }
            }
        });
        
        // Close menu on window resize (if going from mobile to desktop)
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768) {
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }, 250);
        });
        
    } else {
        console.warn('Mobile menu elements not found');
        if (!mobileMenuToggle) console.warn('Missing: .mobile-menu-toggle');
        if (!navMenu) console.warn('Missing: .nav-menu');
    }
    
    // =========================================================================
    // Smooth Scroll for Anchor Links (optional)
    // =========================================================================
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    console.log('Main.js initialization complete');
});
