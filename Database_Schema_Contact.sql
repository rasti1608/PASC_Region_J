/******************************************************************************
* File: Database_Schema_Contact.sql
* Created: October 31, 2025
* Author: Contact Form System Implementation
* Purpose: Database schema for contact form submissions and email recipient management
* Project: PASC Region J Conference 2026 Website
******************************************************************************/

USE [PASC_RegionJ];
GO

-- ============================================================================
-- TABLE: dbo.contact_submissions
-- Purpose: Stores all contact form submissions from website visitors
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[contact_submissions]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[contact_submissions] (
        [id] INT IDENTITY(1,1) NOT NULL,
        [name] NVARCHAR(200) NOT NULL,
        [email] NVARCHAR(255) NOT NULL,
        [subject] NVARCHAR(500) NOT NULL,
        [message] NVARCHAR(MAX) NOT NULL,
        [submitted_at] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
        [ip_address] VARCHAR(45) NULL,  -- Supports both IPv4 and IPv6
        [status] VARCHAR(20) NOT NULL DEFAULT 'new',  -- new, read, replied, archived
        [admin_notes] NVARCHAR(MAX) NULL,
        [user_agent] NVARCHAR(500) NULL,

        CONSTRAINT [PK_contact_submissions] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [CK_contact_submissions_status] CHECK ([status] IN ('new', 'read', 'replied', 'archived'))
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY];

    PRINT 'Table [dbo].[contact_submissions] created successfully.';
END
ELSE
BEGIN
    PRINT 'Table [dbo].[contact_submissions] already exists.';
END
GO

-- Create index on submitted_at for faster date-based queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_contact_submissions_submitted_at' AND object_id = OBJECT_ID(N'[dbo].[contact_submissions]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_contact_submissions_submitted_at]
    ON [dbo].[contact_submissions] ([submitted_at] DESC)
    INCLUDE ([status], [name], [email], [subject]);

    PRINT 'Index [IX_contact_submissions_submitted_at] created successfully.';
END
GO

-- Create index on status for filtering
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_contact_submissions_status' AND object_id = OBJECT_ID(N'[dbo].[contact_submissions]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_contact_submissions_status]
    ON [dbo].[contact_submissions] ([status])
    INCLUDE ([submitted_at], [name], [email], [subject]);

    PRINT 'Index [IX_contact_submissions_status] created successfully.';
END
GO

-- Create index on IP address for rate limiting
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_contact_submissions_ip_submitted' AND object_id = OBJECT_ID(N'[dbo].[contact_submissions]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_contact_submissions_ip_submitted]
    ON [dbo].[contact_submissions] ([ip_address], [submitted_at] DESC);

    PRINT 'Index [IX_contact_submissions_ip_submitted] created successfully.';
END
GO

-- ============================================================================
-- TABLE: dbo.contact_email_recipients
-- Purpose: Manages email addresses that receive contact form notifications
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[contact_email_recipients]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[contact_email_recipients] (
        [id] INT IDENTITY(1,1) NOT NULL,
        [email] NVARCHAR(255) NOT NULL,
        [is_primary] BIT NOT NULL DEFAULT 0,  -- Primary email cannot be deleted
        [is_active] BIT NOT NULL DEFAULT 1,   -- Can be toggled on/off
        [created_at] DATETIME2(7) NOT NULL DEFAULT GETDATE(),

        CONSTRAINT [PK_contact_email_recipients] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [UQ_contact_email_recipients_email] UNIQUE ([email])
    ) ON [PRIMARY];

    PRINT 'Table [dbo].[contact_email_recipients] created successfully.';
END
ELSE
BEGIN
    PRINT 'Table [dbo].[contact_email_recipients] already exists.';
END
GO

-- Create index on is_active for filtering active recipients
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_contact_email_recipients_active' AND object_id = OBJECT_ID(N'[dbo].[contact_email_recipients]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_contact_email_recipients_active]
    ON [dbo].[contact_email_recipients] ([is_active])
    INCLUDE ([email], [is_primary]);

    PRINT 'Index [IX_contact_email_recipients_active] created successfully.';
END
GO

-- ============================================================================
-- INSERT DEFAULT DATA
-- ============================================================================

-- Insert primary email recipient if not exists
IF NOT EXISTS (SELECT * FROM [dbo].[contact_email_recipients] WHERE [email] = 'info@pascregionj.com')
BEGIN
    INSERT INTO [dbo].[contact_email_recipients] ([email], [is_primary], [is_active])
    VALUES ('info@pascregionj.com', 1, 1);

    PRINT 'Default primary email recipient (info@pascregionj.com) inserted successfully.';
END
ELSE
BEGIN
    PRINT 'Primary email recipient (info@pascregionj.com) already exists.';
END
GO

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

PRINT '';
PRINT '============================================================================';
PRINT 'DATABASE SCHEMA CREATION COMPLETE';
PRINT '============================================================================';
PRINT '';
PRINT 'Tables created:';
SELECT
    t.name AS TableName,
    SUM(p.rows) AS RowCount
FROM sys.tables t
INNER JOIN sys.partitions p ON t.object_id = p.object_id
WHERE t.name IN ('contact_submissions', 'contact_email_recipients')
    AND p.index_id IN (0, 1)
GROUP BY t.name
ORDER BY t.name;

PRINT '';
PRINT 'Email recipients configured:';
SELECT
    id,
    email,
    CASE WHEN is_primary = 1 THEN 'Yes' ELSE 'No' END AS IsPrimary,
    CASE WHEN is_active = 1 THEN 'Active' ELSE 'Inactive' END AS Status,
    created_at
FROM [dbo].[contact_email_recipients]
ORDER BY is_primary DESC, created_at ASC;

PRINT '';
PRINT '============================================================================';
PRINT 'You can now use the contact form system.';
PRINT 'Primary email: info@pascregionj.com';
PRINT '============================================================================';
GO
