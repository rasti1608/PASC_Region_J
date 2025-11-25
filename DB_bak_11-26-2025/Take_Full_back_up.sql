/*******************************************************************************
* File:        backup_pasc_regionj.sql
* Purpose:     Create a full backup of PASC Region J database
* 
* IMPORTANT:   Update the backup path to match your system
*              Default path shown below - modify as needed
*******************************************************************************/

USE master;
GO

DECLARE @BackupPath NVARCHAR(500);
DECLARE @BackupFile NVARCHAR(500);
DECLARE @DatabaseName NVARCHAR(100) = 'PASC_RegionJ';

-- ============================================================================
-- CHANGE THIS PATH TO YOUR BACKUP LOCATION
-- ============================================================================
SET @BackupPath = 'C:\DatabaseBackups\';  -- Local server path
-- SET @BackupPath = 'D:\Backups\PASC\';  -- Alternative path

-- Create timestamped backup filename
SET @BackupFile = @BackupPath + @DatabaseName + '_' + 
                  CONVERT(VARCHAR(8), GETDATE(), 112) + '_' +  -- YYYYMMDD
                  REPLACE(CONVERT(VARCHAR(8), GETDATE(), 108), ':', '') + -- HHMMSS
                  '.bak';

PRINT '=======================================================';
PRINT 'PASC Region J Database Backup';
PRINT '=======================================================';
PRINT 'Database: ' + @DatabaseName;
PRINT 'Backup File: ' + @BackupFile;
PRINT 'Started: ' + CONVERT(VARCHAR(30), GETDATE(), 120);
PRINT '';

-- Perform the backup
BACKUP DATABASE [PASC_RegionJ]
TO DISK = @BackupFile
WITH 
    FORMAT,                -- Overwrite existing backup file
    INIT,                  -- Initialize backup media
    COMPRESSION,           -- Compress backup (saves space)
    STATS = 10,           -- Show progress every 10%
    NAME = 'PASC_RegionJ - Full Database Backup',
    DESCRIPTION = 'Full backup before portfolio demo access';

PRINT '';
PRINT '=======================================================';
PRINT 'Backup completed successfully!';
PRINT 'File: ' + @BackupFile;
PRINT 'Completed: ' + CONVERT(VARCHAR(30), GETDATE(), 120);
PRINT '=======================================================';
GO

-- Verify the backup
RESTORE VERIFYONLY 
FROM DISK = 'C:\DatabaseBackups\PASC_RegionJ_20251125_153045.bak'; -- Update with actual filename
GO