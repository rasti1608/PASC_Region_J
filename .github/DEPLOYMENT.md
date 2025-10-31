# Deployment Guide

## GitHub Actions FTP Deployment

This repository uses GitHub Actions to automatically deploy the `Front_End` folder to DigitalRazor hosting via FTP.

---

## 🔐 Setup GitHub Secrets

Before the workflow can run, you need to configure the following secrets in your GitHub repository:

### Steps to Add Secrets:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `FTP_USERNAME` | Your DigitalRazor FTP username | `user@pascregionj.com` |
| `FTP_PASSWORD` | Your DigitalRazor FTP password | `YourSecurePassword123!` |

---

## 🚀 How Deployment Works

### Automatic Deployment

The workflow automatically triggers when:
- Code is pushed to the `main` branch

### Manual Deployment

You can also trigger deployment manually:
1. Go to **Actions** tab in GitHub
2. Select **Deploy to DigitalRazor via FTP**
3. Click **Run workflow** → **Run workflow**

---

## 📁 What Gets Deployed

- **Source:** `Front_End/` folder (contents only)
- **Destination:** `ftp.pascregionj.com:/httpdocs/`
- **Protocol:** FTPS (FTP over TLS)

### Files Excluded from Deployment

The following files/folders are automatically excluded:
- `.git` and `.gitignore` files
- `node_modules/`
- `.DS_Store` (macOS)
- `.vscode/` and `.idea/` (IDE configs)
- `Thumbs.db` (Windows)
- `.psd` files
- `.env` files (environment variables)

---

## 🔍 Monitoring Deployments

### View Deployment Status

1. Go to the **Actions** tab in GitHub
2. Click on the latest workflow run
3. View logs for each deployment step

### Deployment Steps

1. ✅ **Checkout repository** - Downloads code
2. ✅ **Deploy to DigitalRazor FTP** - Uploads Front_End to server
3. ✅ **Deployment summary** - Shows success message

---

## 🛡️ Security Features

- **Secure credentials:** FTP username/password stored as encrypted GitHub secrets
- **FTPS protocol:** Encrypted FTP connection (TLS/SSL)
- **No sensitive files:** `.env` and other sensitive files excluded
- **Safe deployment:** `dangerous-clean-slate` disabled (won't delete existing server files)

---

## 🐛 Troubleshooting

### Deployment Failed?

**Check the following:**

1. **Secrets configured?**
   - Verify `FTP_USERNAME` and `FTP_PASSWORD` are set in GitHub Secrets

2. **FTP credentials correct?**
   - Test FTP login with FileZilla or another FTP client
   - Server: `ftp.pascregionj.com`
   - Port: `21`
   - Protocol: `FTPS`

3. **Server path correct?**
   - Ensure `/httpdocs/` exists on the server
   - Check if you have write permissions

4. **Firewall/IP restrictions?**
   - GitHub Actions uses dynamic IPs
   - Ensure your host allows connections from GitHub's IP ranges

### Common Errors

| Error | Solution |
|-------|----------|
| `Authentication failed` | Check FTP_USERNAME and FTP_PASSWORD secrets |
| `Connection timeout` | Verify server address and port |
| `Permission denied` | Check FTP user has write access to /httpdocs/ |
| `Directory not found` | Verify remote path exists on server |

---

## 📞 Support

For deployment issues:
1. Check workflow logs in GitHub Actions
2. Test FTP connection manually with credentials
3. Contact DigitalRazor support if server-side issues

---

## ✨ Benefits of This Setup

- ✅ **Automatic deployment** on every push to main
- ✅ **No manual FTP uploads** required
- ✅ **Version controlled** deployment history
- ✅ **Secure** credential storage
- ✅ **Fast** incremental uploads (only changed files)
- ✅ **Reliable** - retry on failure
- ✅ **Auditable** - full deployment logs

---

*Last updated: October 31, 2025*
