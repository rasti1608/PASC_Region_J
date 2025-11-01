<cfprocessingdirective pageencoding="utf-8">
<!---
*******************************************************************************
* File:        /admin/includes/admin_footer.cfm
* Created:     November 1, 2025
* Author:      Rastislav Toscak
*
* Purpose:     Admin panel footer include
*              Contains session heartbeat JavaScript
*              Include this before </body> tag on all admin pages
*
* Project:     PASC Region J Conference 2026 Website
*******************************************************************************
--->

<!--- Session Heartbeat Script --->
<script>
// Session heartbeat - ping server every 30 seconds to keep session alive
(function() {
    function sendHeartbeat() {
        fetch('/admin/api/heartbeat.cfm', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok && response.status === 401) {
                // Session expired - redirect to login
                window.location.href = '/admin/login.cfm?msg=session_expired';
            }
        })
        .catch(error => {
            // Network error - ignore silently (don't spam console in production)
            console.log('Heartbeat failed:', error);
        });
    }

    // Send heartbeat every 30 seconds (30000 milliseconds)
    setInterval(sendHeartbeat, 30000);

    // Send initial heartbeat on page load
    sendHeartbeat();
})();
</script>
