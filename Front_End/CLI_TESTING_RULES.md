# CLI Testing Rules & Standards
**Project:** PASC Region J Conference Website  
**Last Updated:** November 17, 2025  
**Purpose:** Standards for testing, debugging, and artifact management

---

## 🎯 Core Rule: Keep the Codebase Clean

**ALL temporary testing files go in `/temp-testing/` directory.**

---

## 📁 Testing Artifacts Directory

### Location:
```
/Front_End/temp-testing/
```

### What Goes Here:
- ✅ Screenshots (*.png, *.jpg)
- ✅ Test reports (HTML, JSON, XML)
- ✅ Log files (*.log, *.txt)
- ✅ Database dumps (*.sql, *.csv)
- ✅ Debug output files
- ✅ Playwright reports
- ✅ Performance traces
- ✅ **Empty/placeholder documents** (temporary .md, .txt files)
- ✅ **Test-related package.json/package-lock.json files**
- ✅ **node_modules/ directories created for testing**
- ✅ **Any investigation/diagnostic reports** (*.md files)
- ✅ **Any other temporary artifacts**

### What Does NOT Go Here:
- ❌ Source code
- ❌ Production assets
- ❌ Production configuration files
- ❌ Real documentation (project docs go in root)

---

## 🧹 Cleanup Requirements

### During Testing:
1. Create `/temp-testing/` if it doesn't exist
2. Save ALL artifacts to this directory
3. Use descriptive filenames with timestamps:
   - ✅ `2025-11-17_login-test-screenshot.png`
   - ✅ `dashboard-error-19h30m.png`
   - ❌ `test1.png` (too generic)

### After Testing:
1. **DELETE** all temporary files you created
2. Leave `/temp-testing/` empty (or delete old files)
3. **NEVER** leave test artifacts in main codebase directories
4. **NEVER** leave placeholder/empty documents in root

### Command to Clean Up:
```bash
# Windows
del /q Front_End\temp-testing\*.*

# Linux/Mac
rm -rf Front_End/temp-testing/*
```

---

## 🔧 Tool-Specific Rules

### Playwright MCP:
- Save screenshots to `/temp-testing/playwright-screenshots/`
- Save reports to `/temp-testing/playwright-reports/`
- **Move package.json/package-lock.json to `/temp-testing/`** if created in root
- Delete after investigation is complete

### MSSQL MCP:
- Save query results to `/temp-testing/db-exports/`
- Use `.csv` or `.sql` format
- Include timestamp in filename

### Browser DevTools:
- Save network HAR files to `/temp-testing/network-traces/`
- Save console logs to `/temp-testing/console-logs/`

### Investigation Reports:
- Save diagnostic reports to `/temp-testing/reports/`
- Examples: `CF_ADMIN_INVESTIGATION_REPORT.md`, `SESSION_PERMISSIONS_FIX_REPORT.md`
- Delete after issue is resolved

---

## 📝 Testing Workflow

### Before Testing:
```bash
# Ensure temp directory exists
mkdir -p Front_End/temp-testing
```

### During Testing:
```typescript
// Example: Save Playwright screenshot
await page.screenshot({ 
  path: 'Front_End/temp-testing/login-page-test.png' 
});
```

### After Testing:
1. Complete investigation
2. Report findings
3. **DELETE** all files in `/temp-testing/`
4. Confirm cleanup in response

---

## ⚠️ What NOT to Do

### ❌ NEVER:
- Save test files in `/Front_End/` root
- Save test files in `/admin/`, `/api/`, `/assets/`
- Save test files in `/angular-app/src/`
- Create package.json in `/Front_End/` root (Angular has its own in /angular-app/)
- Leave empty placeholder documents in root
- Leave investigation reports in root
- Commit test artifacts to Git
- Leave screenshots scattered around codebase

### ✅ ALWAYS:
- Use `/temp-testing/` directory
- Clean up after yourself
- Use descriptive filenames
- Organize by test type (screenshots/, reports/, logs/)
- **Move ANY file created during testing to `/temp-testing/`**

---

## 🗑️ Common Test Artifacts to Move

If you see these in `/Front_End/` root, move them to `/temp-testing/`:

- `package.json` (if not for Angular app)
- `package-lock.json` (if not for Angular app)
- `node_modules/` (test dependencies)
- `*test*.png` (screenshots)
- `*screenshot*.png`
- `*-broken.png`, `*-fixed.png`, `*-error.png`
- `*_INVESTIGATION_REPORT.md`
- `*_FIX_REPORT.md`
- `CONTACTS_USERS_IMPLEMENTATION_PLAN.md` (temporary plans)
- Any `.md` files created during investigation

---

## 📊 Testing Report Format

When reporting test results, include:

1. **What was tested**
2. **Test results** (pass/fail)
3. **Artifacts created** (list files)
4. **Cleanup status** (✅ Files deleted / ❌ Files remain)

### Example:
```
TESTING COMPLETE: Login Authentication

Results:
✅ Login form displays correctly
✅ Authentication succeeds with valid credentials
❌ Error message styling needs fix

Artifacts Created:
- /temp-testing/login-form-screenshot.png
- /temp-testing/auth-error-screenshot.png
- /temp-testing/network-trace.har
- /temp-testing/package.json (Playwright dependencies)

Cleanup: ✅ All artifacts deleted
```

---

## 🎓 Best Practices

1. **Timestamp Everything**
   - Use ISO format: `2025-11-17_14-30-00`
   - Include in filenames for easy sorting

2. **Organize by Type**
```
   /temp-testing/
   ├── screenshots/
   ├── reports/
   ├── logs/
   ├── db-exports/
   └── playwright/ (package.json, etc.)
```

3. **Delete Aggressively**
   - After each test session
   - Before starting new tests
   - Keep directory lean

4. **Never Commit**
   - `/temp-testing/` is gitignored
   - If you see test files in Git status, something's wrong

5. **One Source of Truth for package.json**
   - `/Front_End/angular-app/package.json` = Angular app (KEEP)
   - `/Front_End/package.json` = Testing only (MOVE to temp-testing)

---

## 🚨 Emergency Cleanup

If test files end up in Git:
```bash
# Remove from staging
git reset HEAD Front_End/*.png
git reset HEAD Front_End/**/*test*.png
git reset HEAD Front_End/package.json
git reset HEAD Front_End/package-lock.json

# Delete the files
del Front_End\*test*.png
del Front_End\package.json
del Front_End\package-lock.json

# Add to .gitignore
echo "*test*.png" >> .gitignore
echo "temp-testing/" >> .gitignore
```

---

## 📞 Questions?

**If unsure where to save something:**
- Default: `/temp-testing/`
- Temporary: `/temp-testing/`
- For testing: `/temp-testing/`
- Empty/placeholder docs: `/temp-testing/`
- Investigation reports: `/temp-testing/`
- **When in doubt: `/temp-testing/`**

---

## ✅ Checklist for Every Testing Session

- [ ] Create `/temp-testing/` if needed
- [ ] Save all artifacts to `/temp-testing/`
- [ ] Use descriptive filenames with timestamps
- [ ] Move any package.json/package-lock.json to `/temp-testing/`
- [ ] Move any investigation reports to `/temp-testing/`
- [ ] Complete testing and report results
- [ ] **DELETE** all files in `/temp-testing/`
- [ ] Confirm cleanup in final response
- [ ] **NEVER** leave files in `/Front_End/` root

---

**Remember: If it's temporary, it goes in `/temp-testing/`!** 🧹✨

**One package.json to rule them all: `/angular-app/package.json`** 💍