<!---
*******************************************************************************
* File:        /includes/header.cfm
* Created:     October 25, 2025
* Author:      Rastislav Toscak
* 
* Purpose:     Shared header template for PASC Region J Conference website
*              Contains HTML head, navigation menu, and opening body tag
*              Implements responsive navigation with mobile menu support
*
* Navigation:  Home | About | Workshops | Register | Contact | Resources
*              Auto-highlights active page based on current script name
*
* Usage:       <cfinclude template="includes/header.cfm">
*
* Project:     PASC Region J Conference 2026 Website
*              Lead Beyond Limits - February 13, 2026
*******************************************************************************
--->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="PASC Region J Conference 2026 - Lead Beyond Limits - February 13, 2026">
    <meta name="keywords" content="PASC, Region J, Student Council, Leadership, Conference, Pennsylvania">
    <meta name="author" content="Rastislav Toscak">
    <title>PASC Region J Conference 2026 - Lead Beyond Limits</title>
    
    <!--- Bootstrap 5 CSS (Local) --->
    <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
    
    <!--- Stylesheet with root-relative path (works from any directory) --->
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="/assets/css/mobile-menu.css">
    <link rel="stylesheet" href="/assets/css/workshops-accordion.css">
    <link rel="stylesheet" href="/assets/css/coming-soon.css">
    
    <!--- Optional: Favicon --->
    <link rel="icon" type="image/png" href="/assets/img/favicon.png">
</head>
<body>
    <!--- Navigation Bar --->
    <nav class="main-nav">
        <div class="nav-container">
            <div class="logo">
                <a href="index.cfm">
                    <img src="/assets/img/logo.png" alt="PASC Region J" class="logo-img">
                    <span class="logo-text">PASC REGION J</span>
                </a>
            </div>
            
            <ul class="nav-menu">
                <li><a href="index.cfm" class="<cfif listLast(cgi.script_name, '/') eq 'index.cfm'>active</cfif>">Home</a></li>
                <li><a href="about.cfm" class="<cfif listLast(cgi.script_name, '/') eq 'about.cfm'>active</cfif>">About</a></li>
                <li><a href="gallery.cfm" class="<cfif listLast(cgi.script_name, '/') eq 'gallery.cfm'>active</cfif>">Gallery</a></li>
                <li><a href="register.cfm" class="<cfif listLast(cgi.script_name, '/') eq 'register.cfm'>active</cfif>">Registration</a></li>
                <li><a href="workshops.cfm" class="<cfif listLast(cgi.script_name, '/') eq 'workshops.cfm'>active</cfif>">Workshops</a></li>
                <li><a href="contact.cfm" class="<cfif listLast(cgi.script_name, '/') eq 'contact.cfm'>active</cfif>">Contact</a></li>
                <li><a href="resources.cfm" class="<cfif listLast(cgi.script_name, '/') eq 'resources.cfm'>active</cfif>">Resources</a></li>
            </ul>
            
            <!--- Mobile menu toggle button --->
            <button class="mobile-menu-toggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>
    
    <!--- Main content wrapper --->
    <main class="main-content">
