<!---
================================================================================
File: schedule-pdf.cfm
Description: PDF generation endpoint for conference schedule
Author: Rasti Toscak
Date: 2025-11-24
Version: 5.0 - Direct stream (no temp file), date in filename
================================================================================
--->

<!--- Query active schedule items --->
<cfquery name="qSchedule" datasource="pasc_regionj">
    SELECT
        event_time,
        end_time,
        event_name,
        event_description
    FROM pasc_web.conference_schedule
    WHERE is_active = 1
    ORDER BY display_order ASC
</cfquery>

<!--- Set filename with date --->
<cfset pdfFileName = "PASC_Conference_Schedule_#dateFormat(now(), 'mm-dd-yyyy')#.pdf">

<!--- Tell browser to download as PDF --->
<cfheader name="Content-Disposition" value="attachment; filename=#pdfFileName#">

<!--- Generate and stream PDF directly to browser --->
<cfdocument format="pdf"
            marginTop="0.4"
            marginBottom="0.4"
            marginLeft="0.5"
            marginRight="0.5"
            pageType="letter"
            orientation="portrait">

    <cfoutput>
    <!--- Header with Purple Background --->
    <div style="background-color: ##1a1f3a; padding: 20px; margin-bottom: 20px; text-align: center;">
        <div style="color: ##ffffff; font-family: Arial, sans-serif; font-size: 22pt; font-weight: bold; margin-bottom: 4px;">
            PASC Region J Conference 2026
        </div>
        <div style="color: ##FF8C00; font-family: Arial, sans-serif; font-size: 14pt;">
            Conference Schedule
        </div>
        <div style="color: ##b0b8d4; font-family: Arial, sans-serif; font-size: 10pt; margin-top: 6px;">
            February 13, 2026 &bull; Neshaminy High School, Langhorne PA
        </div>
    </div>

    <!--- Schedule Items --->
    <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
        <cfloop query="qSchedule">
            <tr style="border-bottom: 1px solid ##dddddd;">
                <!--- Time Column --->
                <td style="width: 110px; padding: 10px 8px; vertical-align: top; background-color: ##fff5eb; border-left: 3px solid ##FF8C00;">
                    <div style="font-family: Courier New, monospace; font-size: 9pt; font-weight: bold; color: ##FF8C00;">
                        #qSchedule.event_time#
                        <cfif len(trim(qSchedule.end_time))>
                            <br>- #qSchedule.end_time#
                        </cfif>
                    </div>
                </td>
                <!--- Event Column --->
                <td style="padding: 10px 12px; vertical-align: top;">
                    <div style="font-size: 11pt; font-weight: bold; color: ##1a1f3a; margin-bottom: 3px;">
                        #qSchedule.event_name#
                    </div>
                    <cfif len(trim(qSchedule.event_description))>
                        <div style="font-size: 9pt; color: ##555555; line-height: 1.4;">
                            #qSchedule.event_description#
                        </div>
                    </cfif>
                </td>
            </tr>
        </cfloop>
    </table>

    <!--- Footer with Purple Background --->
    <div style="margin-top: 25px; background-color: ##1a1f3a; padding: 15px; text-align: center; font-family: Arial, sans-serif;">
        <div style="color: ##FF8C00; font-style: italic; font-size: 10pt; margin-bottom: 6px;">
            Reach for the Stars, Lead Beyond Limits
        </div>
        <div style="font-size: 8pt; color: ##b0b8d4;">
            PASC Region J &bull; Pennsylvania Association of Student Councils
        </div>
        <div style="font-size: 8pt; color: ##888888; margin-top: 8px;">
            Generated: #dateFormat(now(), "mmmm dd, yyyy")# at #timeFormat(now(), "h:mm tt")#
        </div>
    </div>
    </cfoutput>

</cfdocument>
