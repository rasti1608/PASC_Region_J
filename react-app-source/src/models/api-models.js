/**
 * API Models for PASC Region J Conference 2026
 * These are JSDoc type definitions for use in JavaScript
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {*} [data]
 * @property {number} [count]
 * @property {string} [message]
 * @property {string} [error]
 * @property {string} [detail]
 * @property {string[]} [errors]
 */

/**
 * @typedef {Object} Announcement
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {string} publishstart
 * @property {string|null} publishend
 * @property {boolean} isfeatured
 * @property {number} displayorder
 */

/**
 * @typedef {Object} GalleryImage
 * @property {number} id
 * @property {string} title
 * @property {string} filename
 * @property {string} fileextension
 * @property {number} displayorder
 * @property {string} fullpath
 */

/**
 * @typedef {Object} Document
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} filename
 * @property {string} originalfilename
 * @property {string} fileextension
 * @property {number} filesize
 * @property {string} filesizeformatted
 * @property {string} documenttype
 * @property {number} displayorder
 * @property {string} fileicon
 * @property {string} downloadpath
 */

/**
 * @typedef {Object} WorkshopForm
 * @property {number} id
 * @property {string} formname
 * @property {string} formdescription
 * @property {string} embedcode
 * @property {number} displayorder
 */

/**
 * @typedef {Object} ContactSubmission
 * @property {string} name
 * @property {string} email
 * @property {string} subject
 * @property {string} message
 * @property {string} [website]
 */

/**
 * @typedef {Object} ConferenceInfo
 * @property {string} appName
 * @property {string} version
 * @property {string} conferenceDate
 * @property {string} conferenceLocation
 * @property {string} conferenceTheme
 * @property {string} siteName
 * @property {string} siteTagline
 * @property {string} fromEmail
 * @property {string} adminEmail
 * @property {string} supportEmail
 */

/**
 * @typedef {Object} PageContent
 * @property {string} title
 * @property {string} subtitle
 * @property {string} [mission]
 * @property {string} [description]
 * @property {Array} [sections]
 * @property {Array} [categories]
 * @property {string[]} [requirements]
 */

/**
 * @typedef {Object} ScheduleItem
 * @property {number} [schedule_id]
 * @property {string} event_time
 * @property {string} [end_time]
 * @property {string} [event_icon]
 * @property {string} event_name
 * @property {string} [event_description]
 * @property {number} display_order
 * @property {boolean} [is_active]
 */

// Admin Models

/**
 * @typedef {Object} AdminUser
 * @property {number} id
 * @property {string} username
 * @property {string} full_name
 * @property {string} email
 * @property {number} role_id
 * @property {string} role_name
 * @property {boolean} is_active
 * @property {string} [profile_picture]
 * @property {boolean} [must_change_password]
 */

/**
 * @typedef {Object} AdminAnnouncement
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {boolean} is_active
 * @property {boolean} is_featured
 * @property {number} display_order
 * @property {string} publish_start
 * @property {string|null} publish_end
 * @property {number} created_by
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} [computed_status]
 */

/**
 * @typedef {Object} AdminGalleryImage
 * @property {number} id
 * @property {string} title
 * @property {string} filename
 * @property {string} original_filename
 * @property {string} file_extension
 * @property {number} file_size
 * @property {boolean} is_active
 * @property {string} page_location
 * @property {number} display_order
 * @property {string} uploaded_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} AdminDocument
 * @property {number} id
 * @property {string} title
 * @property {string|null} description
 * @property {string} filename
 * @property {string} original_filename
 * @property {string} file_extension
 * @property {number} file_size
 * @property {string|null} document_type
 * @property {boolean} is_active
 * @property {number} display_order
 * @property {string} uploaded_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} AdminForm
 * @property {number} id
 * @property {string} form_name
 * @property {string|null} form_description
 * @property {string} embed_code
 * @property {string} page_location
 * @property {boolean} is_active
 * @property {number} display_order
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} AdminContactSubmission
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} subject
 * @property {string} message
 * @property {string} submitted_at
 * @property {string} ip_address
 * @property {string} status
 * @property {string} admin_notes
 */

/**
 * @typedef {Object} StatusCounts
 * @property {number} new
 * @property {number} read
 * @property {number} replied
 * @property {number} archived
 */

/**
 * @typedef {Object} Role
 * @property {number} id
 * @property {string} role_name
 * @property {string} description
 */

export {};
