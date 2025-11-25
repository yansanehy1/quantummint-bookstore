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

You have two options:

**Option A - Manual Upload (Recommended for first deployment):**
1. Log into Hostinger control panel
2. Go to File Manager
3. Navigate to `public_html`
4. Upload ALL contents from your local `frontend/out` folder
5. Make sure files are in `public_html` directly, NOT in a subfolder

**Option B - Git Integration:**
1. Create a deployment script that copies `out` folder contents to root
2. Add a `.htaccess` file for proper routing
3. Push to GitHub
4. Hostinger will sync the changes

### 5. Add .htaccess for Client-Side Routing

Create a `.htaccess` file in `public_html` with this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

This ensures that client-side routing works properly.

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
