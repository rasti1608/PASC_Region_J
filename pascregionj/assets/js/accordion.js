/*******************************************************************************
* File: accordion.js
* Created: October 26, 2025
* Author: Rastislav Toscak
* Purpose: Simple vanilla JavaScript accordion for workshops forms
*          Fallback when Bootstrap CDN is blocked
* Project: PASC Region J Conference 2026 Website
*******************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
    console.log('Accordion script loaded');
    
    // Get all accordion buttons
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    console.log('Found accordion buttons:', accordionButtons.length);
    
    accordionButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log('Accordion button clicked');
            
            // Get the target collapse element
            const targetId = this.getAttribute('data-target').substring(1); // Remove #
            const targetCollapse = document.getElementById(targetId);
            
            console.log('Target:', targetId);
            
            if (!targetCollapse) {
                console.error('Target not found:', targetId);
                return;
            }
            
            // Check if THIS accordion is currently open BEFORE we change anything
            const isCurrentlyOpen = targetCollapse.classList.contains('show');
            
            console.log('Is currently open:', isCurrentlyOpen);
            
            // Close all accordion items first
            const allCollapses = document.querySelectorAll('.accordion-collapse');
            const allButtons = document.querySelectorAll('.accordion-button');
            
            allCollapses.forEach(function(collapse) {
                collapse.classList.remove('show');
            });
            
            allButtons.forEach(function(btn) {
                btn.classList.add('collapsed');
                btn.setAttribute('aria-expanded', 'false');
            });
            
            // If it was NOT open before, open it now
            // If it WAS open, leave it closed
            if (!isCurrentlyOpen) {
                targetCollapse.classList.add('show');
                this.classList.remove('collapsed');
                this.setAttribute('aria-expanded', 'true');
                console.log('Opened:', targetId);
            } else {
                console.log('Closed:', targetId);
            }
        });
    });
});
