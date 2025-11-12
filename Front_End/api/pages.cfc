<!---
================================================================================
File: pages.cfc
Description: API endpoint for static page content and conference details
Author: Auto-generated for Angular migration
Date: 2025-11-11
Version: 1.0
================================================================================
--->

<cfcomponent output="false">

    <!--- ================================================================== --->
    <!--- GET CONFERENCE INFO --->
    <!--- Returns conference details from Application.cfc --->
    <!--- ================================================================== --->
    <cffunction name="getConferenceInfo" access="remote" returntype="string" output="false">
        <cfcontent type="application/json" reset="true">

        <cfset var result = {}>

        <cftry>
            <!--- Build conference info from application variables --->
            <cfset var conferenceInfo = {
                "appName" = application.appName,
                "version" = application.version,
                "conferenceDate" = dateFormat(application.conferenceDate, "mmmm d, yyyy"),
                "conferenceLocation" = application.conferenceLocation,
                "conferenceTheme" = application.conferenceTheme,
                "siteName" = application.siteName,
                "siteTagline" = application.siteTagline,
                "fromEmail" = application.fromEmail,
                "adminEmail" = application.adminEmail,
                "supportEmail" = application.supportEmail
            }>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = conferenceInfo,
                "message" = "Conference information retrieved successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = {},
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>


    <!--- ================================================================== --->
    <!--- GET PAGE CONTENT --->
    <!--- Returns static content for various pages --->
    <!--- Parameters:
         - pageName: name of the page (about, resources, etc.)
    --->
    <!--- ================================================================== --->
    <cffunction name="getContent" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="pageName" type="string" required="false" default="about">

        <cfset var result = {}>
        <cfset var content = {}>

        <cftry>
            <!--- Define static content for different pages --->
            <cfswitch expression="#lcase(arguments.pageName)#">

                <cfcase value="about">
                    <cfset content = {
                        "title" = "About PASC Region J",
                        "subtitle" = "Shaping Tomorrow's Leaders Today",
                        "mission" = "The Pennsylvania Association of Student Councils (PASC) Region J is dedicated to empowering student leaders across Pennsylvania. Our annual conference brings together student council members from schools throughout the region to learn, connect, and grow as leaders.",
                        "sections" = [
                            {
                                "title" = "What We Do",
                                "content" = "PASC Region J provides leadership training, networking opportunities, and resources for student councils. Our annual conference features workshops, keynote speakers, and collaborative activities designed to enhance leadership skills and foster connections among student leaders."
                            },
                            {
                                "title" = "Our Vision",
                                "content" = "We envision a future where every student has the opportunity to develop their leadership potential and make a positive impact in their schools and communities. Through our programs and events, we aim to cultivate the next generation of responsible, innovative leaders."
                            },
                            {
                                "title" = "Conference 2026",
                                "content" = "Join us on February 13, 2026, at Neshaminy High School for an unforgettable day of learning and leadership. This year's theme, ""Lead Beyond Limits,"" challenges students to push boundaries, think creatively, and reach for the stars in their leadership journey."
                            }
                        ]
                    }>
                </cfcase>

                <cfcase value="resources">
                    <cfset content = {
                        "title" = "Resources & Downloads",
                        "subtitle" = "Essential Materials for Student Leaders",
                        "description" = "Access important documents, forms, and resources for the PASC Region J Conference 2026. Download materials to help you prepare for the conference and enhance your leadership journey.",
                        "categories" = [
                            {
                                "name" = "Conference Materials",
                                "description" = "Conference schedules, maps, and guides"
                            },
                            {
                                "name" = "Workshop Resources",
                                "description" = "Handouts and materials from our leadership workshops"
                            },
                            {
                                "name" = "Forms & Applications",
                                "description" = "Registration forms and workshop applications"
                            },
                            {
                                "name" = "Leadership Tools",
                                "description" = "Templates and resources for student councils"
                            }
                        ]
                    }>
                </cfcase>

                <cfcase value="workshops">
                    <cfset content = {
                        "title" = "Workshop Applications",
                        "subtitle" = "Apply to Lead a Workshop",
                        "description" = "Interested in leading a workshop at the PASC Region J Conference 2026? Submit your workshop proposal using the forms below. Share your expertise and help fellow student leaders grow!",
                        "requirements" = [
                            "Workshop proposals must be submitted by the deadline",
                            "Workshops should be 45-60 minutes in length",
                            "Topics should relate to leadership, student government, or school activities",
                            "Presenters must be available on February 13, 2026"
                        ]
                    }>
                </cfcase>

                <cfdefaultcase>
                    <cfset content = {
                        "title" = "Page Content",
                        "subtitle" = "PASC Region J Conference 2026",
                        "description" = "Content for this page is currently being updated."
                    }>
                </cfdefaultcase>

            </cfswitch>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = content,
                "pageName" = arguments.pageName,
                "message" = "Page content retrieved successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = {},
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

</cfcomponent>
