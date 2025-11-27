---
description: Deploy QuantumMint Bookstore to Hostinger
---

# Deploy to Hostinger Business Web Hosting

## Prerequisites
- Hostinger Business Web Hosting account
- Git integration set up on Hostinger
- Node.js installed locally

## Steps

### 1. Build the Next.js Frontend

Navigate to the frontend directory and build the static export:

```bash
cd frontend
npm install
npm run build
```

This will create an `out` folder with all the static files ready for deployment.

### 2. Verify the Build

Check that the `out` folder was created:

```bash
ls out
```

You should see files like `index.html`, `_next/`, etc.

### 3. Clean Hostinger's public_html

**IMPORTANT:** You need to remove the WordPress installation and source code from Hostinger.

Option A - Via Hostinger File Manager:
- Log into Hostinger control panel
- Go to File Manager
- Navigate to `public_html`
- Delete all WordPress files (wp-admin, wp-content, wp-includes, etc.)
- Delete all the source code files you previously uploaded

Option B - Via SSH/Terminal (if you have SSH access):
```bash
# Connect to Hostinger via SSH, then:
cd public_html
rm -rf *
```

### 4. Deploy the Built Files

**CRITICAL:** The contents of `frontend/out` must be in the ROOT of `public_html`, NOT in a subfolder!

**Step-by-Step Deployment:**

1. **Log into Hostinger:**
   - Go to Hostinger control panel
   - Navigate to File Manager
   - Go to `public_html` directory

2. **Clear Everything First:**
   - Delete ALL existing files in `public_html` (including any `frontend` folder, old `index.html`, `index.php`, WordPress files, etc.)
   - Make sure `public_html` is completely empty

3. **Upload the Built Files:**
   - On your local computer, navigate to `frontend/out` folder
   - Select ALL files and folders inside `frontend/out` (you should see files like `index.html`, `_next` folder, etc.)
   - Upload these files directly to `public_html` (not into a subfolder!)
   - After upload, verify that `public_html/index.html` exists (NOT `public_html/frontend/out/index.html`)

4. **Upload .htaccess File:**
   - Upload the `.htaccess` file from your project root to `public_html`
   - This file enables proper client-side routing

**Your final structure on Hostinger should look like:**
```
public_html/
  ├── index.html          ← Main entry point
  ├── .htaccess           ← URL routing
  ├── _next/              ← Next.js assets
  │   ├── static/
  │   └── ...
  ├── 404.html
  └── other HTML files...
```

**What NOT to do:**
❌ Don't have `public_html/frontend/out/index.html`
❌ Don't have redirect files (`index.php` or `index.html` that redirect)
❌ Don't put files in a subfolder

### 5. Verify File Structure on Hostinger

After uploading, check that:
- ✅ `public_html/index.html` exists (the one from `frontend/out`)
- ✅ `public_html/_next/` directory exists
- ✅ `public_html/.htaccess` exists
- ✅ No `frontend` or `out` folders in `public_html`

### 6. Verify Deployment

Visit your domain and verify that:
- The QuantumMint Bookstore homepage loads
- Navigation works
- No WordPress content appears

## Important Notes

### Backend Services
Your application has backend services (auth, book, user, notification, payment, integration) that **cannot run on Hostinger Business Web Hosting** because it doesn't support Node.js.

You have two options:

1. **Deploy backend separately** to a Node.js hosting provider:
   - Heroku
   - Railway
   - Render
   - DigitalOcean
   - AWS/GCP/Azure

2. **Use serverless functions** if your hosting supports it

### Environment Variables
Make sure to update your frontend's API endpoints to point to wherever you deploy your backend services.

### Database
Your MySQL database and Redis need to be hosted separately or use Hostinger's MySQL service if available.

## Troubleshooting

**Still seeing WordPress?**
- Clear browser cache
- Verify all WordPress files are deleted from `public_html`
- Check that `index.html` from the `out` folder is in `public_html`

**404 errors on navigation?**
- Ensure `.htaccess` file is present and configured correctly
- Check that mod_rewrite is enabled on your hosting

**Blank page?**
- Check browser console for errors
- Verify all files from `out` folder were uploaded
- Check file permissions (should be 644 for files, 755 for directories)
