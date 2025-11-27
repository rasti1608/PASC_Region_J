/*******************************************************************************
* FULL DATABASE BACKUP
* Saves to: C:\projects\GitHub\PASC_Region_J\DB_bak_11-26-2025\
*******************************************************************************/

USE master;
GO

DECLARE @BackupFile NVARCHAR(500);

-- EXACT PATH FROM YOUR SCREENSHOT
SET @BackupFile = 'C:\projects\GitHub\PASC_Region_J\DB_bak_11-26-2025\PASC_RegionJ_FULL_' + 
                  CONVERT(VARCHAR(8), GETDATE(), 112) + '_' +
                  REPLACE(CONVERT(VARCHAR(8), GETDATE(), 108), ':', '') + 
                  '.bak';

PRINT '============================================';
PRINT 'Starting Full Database Backup...';
PRINT '============================================';
PRINT 'File: ' + @BackupFile;
PRINT '';

BACKUP DATABASE [PASC_RegionJ]
TO DISK = @BackupFile
WITH 
    COMPRESSION,
    INIT,
    STATS = 10;

PRINT '';
PRINT '============================================';
PRINT '✓✓✓ GREEN LIGHT - BACKUP COMPLETE! ✓✓✓';
PRINT '============================================';
PRINT 'Saved: ' + @BackupFile;
PRINT '';
GO