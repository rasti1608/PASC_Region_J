-- ============================================================================
-- PASC Region J Conference Website - Database Schema
-- ============================================================================
-- Database: MS SQL Server 2016+
-- Created: October 25, 2025
-- Purpose: Conference website with admin-managed content
-- ============================================================================

-- Use the target database (update database name as needed)
-- USE [PASC_RegionJ];
-- GO

-- ============================================================================
-- TABLE 1: admin_users
-- Purpose: Admin panel authentication and user management
-- ============================================================================
CREATE TABLE dbo.admin_users (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    username      NVARCHAR(50)  NOT NULL UNIQUE,
    password_hash NVARCHAR(300) NOT NULL,
    full_name     NVARCHAR(100) NOT NULL,
    email         NVARCHAR(254) NOT NULL,
    is_active     BIT           NOT NULL CONSTRAINT DF_admin_users_is_active DEFAULT(1),
    last_login    DATETIME2(3)  NULL,
    created_at    DATETIME2(3)  NOT NULL CONSTRAINT DF_admin_users_created_at DEFAULT(SYSUTCDATETIME())
);
GO

-- ============================================================================
-- TABLE 2: announcements
-- Purpose: Homepage news/updates managed by admins
-- ============================================================================
CREATE TABLE dbo.announcements (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    title         NVARCHAR(255) NOT NULL,
    content       NVARCHAR(MAX) NOT NULL,
    publish_start DATETIME2(3)  NOT NULL,
    publish_end   DATETIME2(3)  NULL,
    is_featured   BIT           NOT NULL CONSTRAINT DF_announce_featured DEFAULT(0),
    is_active     BIT           NOT NULL CONSTRAINT DF_announce_active DEFAULT(1),
    created_by    INT           NULL,
    created_at    DATETIME2(3)  NOT NULL CONSTRAINT DF_announce_created DEFAULT(SYSUTCDATETIME()),
    updated_at    DATETIME2(3)  NOT NULL CONSTRAINT DF_announce_updated DEFAULT(SYSUTCDATETIME()),
    CONSTRAINT FK_announcements_created_by 
        FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id) 
        ON UPDATE CASCADE ON DELETE SET NULL
);
GO

-- Index for fast homepage queries (active announcements, newest first)
CREATE INDEX IX_announcements_list 
    ON dbo.announcements (is_active, publish_start DESC)
    INCLUDE (title, is_featured, publish_end);
GO

-- ============================================================================
-- TABLE 3: google_forms
-- Purpose: Manage which Google Forms appear on which pages
-- ============================================================================
CREATE TABLE dbo.google_forms (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    form_name     NVARCHAR(255) NOT NULL,
    embed_url     NVARCHAR(MAX) NOT NULL,
    page_location NVARCHAR(50)  NOT NULL, -- 'workshops', 'registration', 'tshirts'
    display_order INT           NOT NULL CONSTRAINT DF_forms_display DEFAULT(0),
    is_active     BIT           NOT NULL CONSTRAINT DF_forms_active DEFAULT(1),
    created_at    DATETIME2(3)  NOT NULL CONSTRAINT DF_forms_created DEFAULT(SYSUTCDATETIME()),
    updated_at    DATETIME2(3)  NULL
);
GO

-- Index for fetching active forms by page
CREATE INDEX IX_google_forms_active 
    ON dbo.google_forms (page_location, is_active, display_order);
GO

-- ============================================================================
-- TABLE 4: resources
-- Purpose: Downloadable files (PDFs, images, documents)
-- ============================================================================
CREATE TABLE dbo.resources (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    file_name     NVARCHAR(255) NOT NULL,
    file_path     NVARCHAR(500) NOT NULL,
    mime_type     NVARCHAR(100) NULL,
    file_checksum VARBINARY(32) NULL, -- MD5/SHA-256 for integrity check
    description   NVARCHAR(MAX) NULL,
    category      NVARCHAR(50)  NULL, -- 'flyer', 'schedule', 'map', 'info'
    file_size     BIGINT        NULL, -- bytes
    uploaded_by   INT           NULL,
    uploaded_at   DATETIME2(3)  NOT NULL CONSTRAINT DF_resources_uploaded DEFAULT(SYSUTCDATETIME()),
    is_active     BIT           NOT NULL CONSTRAINT DF_resources_active DEFAULT(1),
    CONSTRAINT FK_resources_uploaded_by 
        FOREIGN KEY (uploaded_by) REFERENCES dbo.admin_users(id) 
        ON UPDATE CASCADE ON DELETE SET NULL
);
GO

-- Index for resources list page
CREATE INDEX IX_resources_list 
    ON dbo.resources (is_active, category, uploaded_at DESC);
GO

-- ============================================================================
-- TABLE 5: page_content
-- Purpose: Editable text snippets for pages (hero text, about intro, etc.)
-- ============================================================================
CREATE TABLE dbo.page_content (
    id           INT IDENTITY(1,1) PRIMARY KEY,
    page_id      NVARCHAR(50)  NOT NULL, -- 'home', 'about', 'workshops'
    section_id   NVARCHAR(50)  NOT NULL, -- 'hero_title', 'hero_subtitle'
    content_type NVARCHAR(20)  NOT NULL CONSTRAINT DF_page_content_type DEFAULT('text'), -- 'text', 'html', 'markdown'
    content_text NVARCHAR(MAX) NOT NULL,
    updated_by   INT           NULL,
    updated_at   DATETIME2(3)  NOT NULL CONSTRAINT DF_page_content_updated DEFAULT(SYSUTCDATETIME()),
    CONSTRAINT UQ_page_section UNIQUE (page_id, section_id),
    CONSTRAINT FK_page_content_updated_by 
        FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id) 
        ON UPDATE CASCADE ON DELETE SET NULL
);
GO

-- ============================================================================
-- TABLE 6: settings
-- Purpose: Site-wide configuration (dates, flags, simple key-value store)
-- ============================================================================
CREATE TABLE dbo.settings (
    skey       NVARCHAR(100) PRIMARY KEY, -- 'registration_open', 'hero_cta_text'
    svalue     NVARCHAR(MAX) NOT NULL,
    updated_at DATETIME2(3)  NOT NULL CONSTRAINT DF_settings_updated DEFAULT(SYSUTCDATETIME())
);
GO

-- ============================================================================
-- TABLE 7: audit_log
-- Purpose: Track all changes (who, what, when) for accountability
-- ============================================================================
CREATE TABLE dbo.audit_log (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    user_id    INT           NULL, -- admin_users.id (not enforced FK)
    action     NVARCHAR(50)  NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
    table_name NVARCHAR(50)  NOT NULL,
    record_id  INT           NULL,
    old_value  NVARCHAR(MAX) NULL,
    new_value  NVARCHAR(MAX) NULL,
    ts_utc     DATETIME2(3)  NOT NULL CONSTRAINT DF_audit_ts DEFAULT(SYSUTCDATETIME())
);
GO

-- Index for audit log queries
CREATE INDEX IX_audit_lookup 
    ON dbo.audit_log (table_name, record_id, ts_utc DESC);
GO

-- ============================================================================
-- TRIGGERS: Auto-update timestamps on record changes
-- ============================================================================

-- Trigger for announcements.updated_at
CREATE OR ALTER TRIGGER dbo.trg_announcements_touch 
ON dbo.announcements
AFTER UPDATE 
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE a 
    SET updated_at = SYSUTCDATETIME()
    FROM dbo.announcements a
    INNER JOIN inserted i ON a.id = i.id;
END;
GO

-- Trigger for page_content.updated_at
CREATE OR ALTER TRIGGER dbo.trg_page_content_touch 
ON dbo.page_content
AFTER UPDATE 
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p 
    SET updated_at = SYSUTCDATETIME()
    FROM dbo.page_content p
    INNER JOIN inserted i ON p.id = i.id;
END;
GO

-- ============================================================================
-- SEED DATA: Initial admin user and settings
-- ============================================================================

-- Create default admin user (CHANGE PASSWORD HASH BEFORE PRODUCTION!)
INSERT INTO dbo.admin_users (username, password_hash, full_name, email)
VALUES (
    N'admin', 
    N'$2b$12$REPLACE_WITH_REAL_BCRYPT_HASH', -- IMPORTANT: Generate real hash!
    N'Site Administrator', 
    N'admin@pascregionj.org'
);
GO

-- Insert default site settings
INSERT INTO dbo.settings (skey, svalue) VALUES
    (N'registration_open', N'2026-01-05T00:00:00Z'),
    (N'registration_close', N'2026-01-23T23:59:59Z'),
    (N'workshop_deadline', N'2025-12-15T23:59:59Z'),
    (N'conference_date', N'2026-02-13'),
    (N'conference_time', N'10:30 AM - 4:00 PM'),
    (N'conference_location', N'Neshaminy High School'),
    (N'hero_cta_text', N'Register Now'),
    (N'hero_title', N'REACH FOR THE STARS'),
    (N'hero_subtitle', N'PASC Region J Leadership Conference 2026');
GO

-- Insert sample announcement
INSERT INTO dbo.announcements (title, content, publish_start, is_featured, created_by)
VALUES (
    N'Welcome to PASC Region J Conference 2026!',
    N'We are excited to host this year''s Region J Leadership Conference at Neshaminy High School. Registration opens January 5, 2026. Stay tuned for workshop announcements!',
    SYSUTCDATETIME(),
    1, -- featured
    1  -- created by admin user
);
GO

-- Insert sample page content (hero section)
INSERT INTO dbo.page_content (page_id, section_id, content_type, content_text) VALUES
    (N'home', N'hero_title', N'text', N'REACH FOR THE STARS'),
    (N'home', N'hero_subtitle', N'text', N'PASC Region J Leadership Conference 2026 - Lead Beyond Limits'),
    (N'home', N'hero_tagline', N'text', N'February 13, 2026 | Neshaminy High School'),
    (N'about', N'intro', N'html', N'<p>Join us for an inspiring day of leadership development, workshops, and networking with student leaders from across Region J.</p>');
GO

-- ============================================================================
-- VERIFICATION QUERIES (optional - comment out for production)
-- ============================================================================

-- Verify tables created
SELECT 
    TABLE_NAME, 
    TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'dbo'
ORDER BY TABLE_NAME;
GO

-- Verify admin user created
SELECT 
    id, 
    username, 
    full_name, 
    email, 
    is_active, 
    created_at
FROM dbo.admin_users;
GO

-- Verify settings created
SELECT 
    skey, 
    svalue
FROM dbo.settings
ORDER BY skey;
GO

-- Verify sample announcement created
SELECT 
    id, 
    title, 
    is_featured, 
    is_active, 
    created_at
FROM dbo.announcements;
GO

-- ============================================================================
-- NOTES FOR DEPLOYMENT
-- ============================================================================
-- 1. Update database name at top if needed (uncomment USE statement)
-- 2. CHANGE the default admin password hash before production!
-- 3. Adjust DATETIME2 precision if needed (currently set to milliseconds)
-- 4. Review and adjust NVARCHAR sizes based on actual needs
-- 5. Consider adding additional indexes for performance if needed
-- 6. Set up database backups and maintenance plans
-- 7. Configure appropriate user permissions (create app user, not use admin)
-- ============================================================================

PRINT 'PASC Region J Database Schema created successfully!';
PRINT 'Tables: admin_users, announcements, google_forms, resources, page_content, settings, audit_log';
PRINT 'IMPORTANT: Change default admin password hash before production use!';
GO
