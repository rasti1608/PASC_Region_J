<cfcomponent output="false">

    <!--- ================================================================== --->
    <!--- GET FORMS ADMIN --->
    <!--- Returns all forms for a specific location for admin panel --->
    <!--- ================================================================== --->
    <cffunction name="getFormsAdmin" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="location" type="string" required="true">

        <cfset var result = {}>
        <cfset var qForms = "">

        <cftry>
            <!--- Query all forms for the location --->
            <cfquery name="qForms" datasource="pasc_regionj">
                SELECT
                    id,
                    form_name,
                    form_description,
                    embed_code,
                    page_location,
                    is_active,
                    display_order,
                    created_at,
                    updated_at
                FROM dbo.forms
                WHERE page_location = <cfqueryparam value="#arguments.location#" cfsqltype="cf_sql_varchar">
                ORDER BY display_order ASC
            </cfquery>

            <!--- Convert query to array of structs --->
            <cfset var forms = []>

            <cfloop query="qForms">
                <cfset var form = {
                    "id" = qForms.id,
                    "form_name" = qForms.form_name,
                    "form_description" = isNull(qForms.form_description) ? javaCast("null", "") : qForms.form_description,
                    "embed_code" = qForms.embed_code,
                    "page_location" = qForms.page_location,
                    "is_active" = qForms.is_active,
                    "display_order" = qForms.display_order,
                    "created_at" = dateTimeFormat(qForms.created_at, "yyyy-mm-dd HH:nn:ss"),
                    "updated_at" = dateTimeFormat(qForms.updated_at, "yyyy-mm-dd HH:nn:ss")
                }>
                <cfset arrayAppend(forms, form)>
            </cfloop>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = forms,
                "count" = arrayLen(forms),
                "message" = "Forms retrieved successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = [],
                    "count" = 0,
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- GET FORM --->
    <!--- Returns a single form by ID for editing --->
    <!--- ================================================================== --->
    <cffunction name="getForm" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>
        <cfset var qForm = "">

        <cftry>
            <!--- Query single form --->
            <cfquery name="qForm" datasource="pasc_regionj">
                SELECT
                    id,
                    form_name,
                    form_description,
                    embed_code,
                    page_location,
                    is_active,
                    display_order,
                    created_at,
                    updated_at
                FROM dbo.forms
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Check if form exists --->
            <cfif qForm.recordCount EQ 0>
                <cfset result = {
                    "success" = false,
                    "data" = javaCast("null", ""),
                    "error" = "Form not found",
                    "message" = "No form found with ID #arguments.id#"
                }>
            <cfelse>
                <!--- Build form struct --->
                <cfset var form = {
                    "id" = qForm.id,
                    "form_name" = qForm.form_name,
                    "form_description" = isNull(qForm.form_description) ? javaCast("null", "") : qForm.form_description,
                    "embed_code" = qForm.embed_code,
                    "page_location" = qForm.page_location,
                    "is_active" = qForm.is_active,
                    "display_order" = qForm.display_order,
                    "created_at" = dateTimeFormat(qForm.created_at, "yyyy-mm-dd HH:nn:ss"),
                    "updated_at" = dateTimeFormat(qForm.updated_at, "yyyy-mm-dd HH:nn:ss")
                }>

                <!--- Build success response --->
                <cfset result = {
                    "success" = true,
                    "data" = form,
                    "message" = "Form retrieved successfully"
                }>
            </cfif>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = javaCast("null", ""),
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- SAVE FORM --->
    <!--- Creates new or updates existing form --->
    <!--- Detects create vs update based on presence of ID --->
    <!--- Accepts JSON from Angular (application/json POST body) --->
    <!--- ================================================================== --->
    <cffunction name="saveForm" access="remote" returntype="String" output="false" returnformat="json">

        <cfset var result = {}>
        <cfset var newId = 0>
        <cfset var data = {}>
        <cfset var requestBody = "">

        <cftry>
            <!--- Read JSON from request body --->
            <cfset requestBody = toString(getHttpRequestData().content)>

            <!--- Parse JSON data --->
            <cfif len(trim(requestBody)) GT 0>
                <cfset data = deserializeJSON(requestBody)>
            <cfelse>
                <cfthrow type="InvalidRequest" message="No data provided in request body">
            </cfif>

            <!--- Set defaults for missing fields --->
            <cfparam name="data.id" default="0">
            <cfparam name="data.is_active" default="false">
            <cfparam name="data.form_description" default="">

            <!--- Validate required fields --->
            <cfif NOT structKeyExists(data, "form_name") OR len(trim(data.form_name)) EQ 0>
                <cfthrow type="Validation" message="Form Name is required">
            </cfif>
            <cfif NOT structKeyExists(data, "embed_code") OR len(trim(data.embed_code)) EQ 0>
                <cfthrow type="Validation" message="Google Form Embed Code is required">
            </cfif>
            <cfif NOT structKeyExists(data, "page_location") OR len(trim(data.page_location)) EQ 0>
                <cfthrow type="Validation" message="Page Location is required">
            </cfif>

            <!--- Check if this is an update (ID provided and exists) --->
            <cfif data.id GT 0>
                <!--- UPDATE existing form --->
                <cfquery datasource="pasc_regionj">
                    UPDATE dbo.forms
                    SET
                        form_name = <cfqueryparam value="#data.form_name#" cfsqltype="cf_sql_varchar">,
                        form_description = <cfqueryparam value="#data.form_description#" cfsqltype="cf_sql_varchar" null="#len(trim(data.form_description)) EQ 0#">,
                        embed_code = <cfqueryparam value="#data.embed_code#" cfsqltype="cf_sql_varchar">,
                        page_location = <cfqueryparam value="#data.page_location#" cfsqltype="cf_sql_varchar">,
                        is_active = <cfqueryparam value="#data.is_active#" cfsqltype="cf_sql_bit">,
                        updated_at = GETDATE()
                    WHERE id = <cfqueryparam value="#data.id#" cfsqltype="cf_sql_integer">
                </cfquery>

                <cfset newId = data.id>
                <cfset var action = "updated">

            <cfelse>
                <!--- INSERT new form --->
                <!--- Get next display_order for this location --->
                <cfquery name="qMaxOrder" datasource="pasc_regionj">
                    SELECT ISNULL(MAX(display_order), 0) + 1 AS next_order
                    FROM dbo.forms
                    WHERE page_location = <cfqueryparam value="#data.page_location#" cfsqltype="cf_sql_varchar">
                </cfquery>

                <cfquery datasource="pasc_regionj" result="insertResult">
                    INSERT INTO dbo.forms (
                        form_name,
                        form_description,
                        embed_code,
                        page_location,
                        is_active,
                        display_order,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        <cfqueryparam value="#data.form_name#" cfsqltype="cf_sql_varchar">,
                        <cfqueryparam value="#data.form_description#" cfsqltype="cf_sql_varchar" null="#len(trim(data.form_description)) EQ 0#">,
                        <cfqueryparam value="#data.embed_code#" cfsqltype="cf_sql_varchar">,
                        <cfqueryparam value="#data.page_location#" cfsqltype="cf_sql_varchar">,
                        <cfqueryparam value="#data.is_active#" cfsqltype="cf_sql_bit">,
                        <cfqueryparam value="#qMaxOrder.next_order#" cfsqltype="cf_sql_integer">,
                        GETDATE(),
                        GETDATE()
                    )
                </cfquery>

                <cfset newId = insertResult.IDENTITYCOL>
                <cfset var action = "created">
            </cfif>

            <!--- Fetch the saved form to return --->
            <cfquery name="qSaved" datasource="pasc_regionj">
                SELECT
                    id,
                    form_name,
                    form_description,
                    embed_code,
                    page_location,
                    is_active,
                    display_order,
                    created_at,
                    updated_at
                FROM dbo.forms
                WHERE id = <cfqueryparam value="#newId#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Build form struct --->
            <cfset var form = {
                "id" = qSaved.id,
                "form_name" = qSaved.form_name,
                "form_description" = isNull(qSaved.form_description) ? javaCast("null", "") : qSaved.form_description,
                "embed_code" = qSaved.embed_code,
                "page_location" = qSaved.page_location,
                "is_active" = qSaved.is_active,
                "display_order" = qSaved.display_order,
                "created_at" = dateTimeFormat(qSaved.created_at, "yyyy-mm-dd HH:nn:ss"),
                "updated_at" = dateTimeFormat(qSaved.updated_at, "yyyy-mm-dd HH:nn:ss")
            }>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = form,
                "message" = "Form #action# successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = javaCast("null", ""),
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- UPDATE ORDER --->
    <!--- Updates display_order for a form within its location --->
    <!--- ================================================================== --->
    <cffunction name="updateOrder" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">
        <cfargument name="newOrder" type="numeric" required="true">
        <cfargument name="location" type="string" required="true">

        <cfset var result = {}>
        <cfset var qMoving = "">
        <cfset var oldOrder = 0>

        <cftry>
            <!--- Get current order of the form being moved --->
            <cfquery name="qMoving" datasource="pasc_regionj">
                SELECT display_order
                FROM dbo.forms
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
                AND page_location = <cfqueryparam value="#arguments.location#" cfsqltype="cf_sql_varchar">
            </cfquery>

            <cfif qMoving.recordCount EQ 0>
                <cfthrow type="NotFound" message="Form not found">
            </cfif>

            <cfset oldOrder = qMoving.display_order>

            <!--- Only proceed if order is actually changing --->
            <cfif oldOrder NEQ arguments.newOrder>
                <!--- Determine direction and shift other forms --->
                <cfif arguments.newOrder LT oldOrder>
                    <!--- Moving UP - shift others down --->
                    <cfquery datasource="pasc_regionj">
                        UPDATE dbo.forms
                        SET display_order = display_order + 1
                        WHERE display_order >= <cfqueryparam value="#arguments.newOrder#" cfsqltype="cf_sql_integer">
                        AND display_order < <cfqueryparam value="#oldOrder#" cfsqltype="cf_sql_integer">
                        AND page_location = <cfqueryparam value="#arguments.location#" cfsqltype="cf_sql_varchar">
                    </cfquery>
                <cfelse>
                    <!--- Moving DOWN - shift others up --->
                    <cfquery datasource="pasc_regionj">
                        UPDATE dbo.forms
                        SET display_order = display_order - 1
                        WHERE display_order > <cfqueryparam value="#oldOrder#" cfsqltype="cf_sql_integer">
                        AND display_order <= <cfqueryparam value="#arguments.newOrder#" cfsqltype="cf_sql_integer">
                        AND page_location = <cfqueryparam value="#arguments.location#" cfsqltype="cf_sql_varchar">
                    </cfquery>
                </cfif>

                <!--- Set the form to its new position --->
                <cfquery datasource="pasc_regionj">
                    UPDATE dbo.forms
                    SET display_order = <cfqueryparam value="#arguments.newOrder#" cfsqltype="cf_sql_integer">,
                        updated_at = GETDATE()
                    WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
                </cfquery>
            </cfif>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "message" = "Display order updated successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- TOGGLE ACTIVE --->
    <!--- Toggles is_active status (0 to 1 or 1 to 0) --->
    <!--- ================================================================== --->
    <cffunction name="toggleActive" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>
        <cfset var qForm = "">

        <cftry>
            <!--- Toggle the is_active status --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.forms
                SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END,
                    updated_at = GETDATE()
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Fetch the updated form to return --->
            <cfquery name="qForm" datasource="pasc_regionj">
                SELECT
                    id,
                    form_name,
                    form_description,
                    embed_code,
                    page_location,
                    is_active,
                    display_order,
                    created_at,
                    updated_at
                FROM dbo.forms
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif qForm.recordCount EQ 0>
                <cfthrow type="NotFound" message="Form not found">
            </cfif>

            <!--- Build form struct --->
            <cfset var form = {
                "id" = qForm.id,
                "form_name" = qForm.form_name,
                "form_description" = isNull(qForm.form_description) ? javaCast("null", "") : qForm.form_description,
                "embed_code" = qForm.embed_code,
                "page_location" = qForm.page_location,
                "is_active" = qForm.is_active,
                "display_order" = qForm.display_order,
                "created_at" = dateTimeFormat(qForm.created_at, "yyyy-mm-dd HH:nn:ss"),
                "updated_at" = dateTimeFormat(qForm.updated_at, "yyyy-mm-dd HH:nn:ss")
            }>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "data" = form,
                "message" = "Form status toggled successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "data" = javaCast("null", ""),
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

    <!--- ================================================================== --->
    <!--- DELETE FORM --->
    <!--- Deletes form and reorders remaining items in that location --->
    <!--- ================================================================== --->
    <cffunction name="deleteForm" access="remote" returntype="String" output="false" returnformat="json">
        <cfargument name="id" type="numeric" required="true">

        <cfset var result = {}>
        <cfset var qForm = "">
        <cfset var deletedOrder = 0>
        <cfset var formLocation = "">

        <cftry>
            <!--- Get the display_order and location of the item being deleted --->
            <cfquery name="qForm" datasource="pasc_regionj">
                SELECT display_order, page_location
                FROM dbo.forms
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfif qForm.recordCount EQ 0>
                <cfthrow type="NotFound" message="Form not found">
            </cfif>

            <cfset deletedOrder = qForm.display_order>
            <cfset formLocation = qForm.page_location>

            <!--- Delete the form --->
            <cfquery datasource="pasc_regionj">
                DELETE FROM dbo.forms
                WHERE id = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Reorder remaining items to fill the gap (only within same location) --->
            <cfquery datasource="pasc_regionj">
                UPDATE dbo.forms
                SET display_order = display_order - 1
                WHERE display_order > <cfqueryparam value="#deletedOrder#" cfsqltype="cf_sql_integer">
                AND page_location = <cfqueryparam value="#formLocation#" cfsqltype="cf_sql_varchar">
            </cfquery>

            <!--- Build success response --->
            <cfset result = {
                "success" = true,
                "message" = "Form deleted successfully"
            }>

            <cfcatch type="any">
                <!--- Build error response --->
                <cfset result = {
                    "success" = false,
                    "error" = cfcatch.message,
                    "detail" = cfcatch.detail
                }>
            </cfcatch>
        </cftry>

        <cfreturn serializeJSON(result, false, false)>
    </cffunction>

</cfcomponent>
