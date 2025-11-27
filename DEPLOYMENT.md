# QuantumMint Bookstore Deployment Guide

Complete guide for deploying QuantumMint Bookstore to GitHub and Hostinger.

## Table of Contents

- [Recent Updates](#recent-updates)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [GitHub Deployment](#github-deployment)
- [Hostinger Deployment](#hostinger-deployment)
- [Progressive Web App (PWA) Setup](#progressive-web-app-pwa-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Testing & Verification](#testing--verification)
- [Troubleshooting](#troubleshooting)

## Recent Updates

### Latest Features (November 2025)

- ✅ **Progressive Web App (PWA)**: Full PWA support with offline functionality, installability, and push notifications
- ✅ **Live Currency Conversion**: Real-time USD ↔ SLL exchange rates via API
- ✅ **Audio Studio Lazy Auth**: API key only required when generating content (not on page load)
- ✅ **Updated Branding**: New QuantumMint logo integrated across the application
- ✅ **Improved Tab Navigation**: Fixed tab switching in Book Editor and Create Book pages
- ✅ **Service Worker**: Comprehensive caching strategies for optimal performance

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              HOSTINGER (Frontend)                            │
│              Next.js Progressive Web App                     │
│              • PWA with Service Worker                       │
│              • Offline Support                               │
│              • Installable App                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND SERVICES (API)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Core Services│  │ Business     │  │ Support      │      │
│  │              │  │ Logic        │  │ Services     │      │
│  │ • API Gateway│  │ • Book       │  │ • SMS        │      │
│  │ • Auth       │  │ • Order      │  │ • Notif      │      │
│  │ • User       │  │ • Payment    │  │ • Search     │      │
│  │ • Wallet     │  │ • Gift       │  │ • Analytics  │      │
│  │              │  │ • Seller     │  │ • Audio      │      │
│  │              │  │ • Referral   │  │ • Moderation │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌──────────────┐        ┌──────────────┐
│  HOSTINGER   │        │   External   │
│    MySQL     │        │   Services   │
│              │        │ • Currency API│
└──────────────┘        │ • Gemini API │
                        └──────────────┘
```

## Prerequisites

### Required Tools

1. **Git**
   - Download from https://git-scm.com/download/win
   - Verify: `git --version`

2. **Node.js** (v18.x or higher)
   - Download from https://nodejs.org
   - Verify: `node --version`

3. **A Hostinger Account**
   - With hosting plan that supports:
     - MySQL database
     - FTP/SSH access
     - Node.js applications (or static hosting)

### Required API Keys

1. **Google Gemini API** (for Audio Studio)
   - Get from: https://aistudio.google.com/app/apikey
   - Optional: Only needed when creating audiobooks

2. **Currency Exchange API** (for live rates)
   - Currently using: https://api.exchangerate-api.com
   - Free tier: 1,500 requests/month
   - Alternative: https://currencyapi.com (300 requests/month free)

## GitHub Deployment

### 1. Initialize Git Repository (if not done)

```bash
cd c:\Users\Barrka\.gemini\antigravity\scratch\quantummint-bookstore1
git init
```

### 2. Review .gitignore

The `.gitignore` file has been updated to exclude:
- `node_modules/`
- Build outputs (`dist/`, `.next/`, `out/`)
- Environment files (`.env`, `.env.local`)
- Logs (`*.log`, `*.txt`)
- OS files (`.DS_Store`, `Thumbs.db`)

### 3. Stage and Commit Files

```bash
# Check current status
git status

# Add all files
git add .

# Commit changes
git commit -m "feat: complete QuantumMint Bookstore with PWA support

- Add Progressive Web App features (offline, installable, push notifications)
- Implement live currency conversion (USD ↔ SLL)
- Update Audio Studio with lazy authentication
- Add new QuantumMint branding and logo
- Fix tab navigation in Book Editor and Create Book pages
- Add service worker with comprehensive caching strategies"
```

### 4. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `quantummint-bookstore`
3. Description: "Educational bookstore platform for Sierra Leone with audiobook creation"
4. Choose **Public** or **Private**
5. **Do not** initialize with README (we already have code)
6. Click **Create repository**

### 5. Push to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/yansanehy1/quantummint-bookstore.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Hostinger Deployment

### Option A: Static Export (Recommended for PWA)

#### 1. Build Frontend for Production

```bash
cd frontend
npm install
npm run build
```

This creates an optimized production build in `frontend/.next/` or `frontend/out/`.

#### 2. Upload to Hostinger

**Via File Manager:**
1. Log into Hostinger control panel
2. Go to **File Manager**
3. Navigate to `public_html`
4. Upload all files from `frontend/out/` or `frontend/.next/static/`

**Via FTP:**
1. Use FileZilla or any FTP client
2. Connect to your Hostinger FTP:
   - Host: `ftp.yourdomain.com`
   - Username: Your Hostinger username
   - Password: Your Hostinger password
3. Upload contents of `frontend/out/` to `public_html/`

### Option B: Node.js Application (If Hostinger supports it)

#### 1. Configure Next.js for Production

Create `ecosystem.config.js` in `frontend/`:

```javascript
module.exports = {
  apps: [{
    name: 'quantummint-bookstore',
    script: 'npm',
    args: 'start',
    cwd: '/home/username/quantummint-bookstore/frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

#### 2. Deploy via SSH

```bash
# SSH into Hostinger
ssh username@yourdomain.com

# Clone repository
git clone https://github.com/yansanehy1/quantummint-bookstore.git

# Install dependencies
cd quantummint-bookstore/frontend
npm install --production

# Build application
npm run build

# Start with PM2 (if available)
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Progressive Web App (PWA) Setup

### What's Included

✅ **Service Worker** (`frontend/public/sw.js`)
   - Caches pages and assets for offline access
   - Network-first strategy for API calls
   - Cache-first strategy for static resources

✅ **Web App Manifest** (`frontend/public/manifest.json`)
   - App name, description, and icons
   - Install prompts and shortcuts
   - Theme colors and display mode

✅ **Offline Fallback** (`frontend/public/offline.html`)
   - Custom offline page with auto-retry
   - Connection status checking

✅ **App Icons** (from your logo)
   - `icon-192x192.png`
   - `icon-512x512.png`

### Generate Additional Icon Sizes (Optional)

To generate all PWA icon sizes (72, 96, 128, 144, 152, 384):

```bash
# Install sharp-cli globally
npm install -g sharp-cli

# Generate from logo
cd frontend/public
sharp -i logo.png -o icons/icon-72x72.png resize 72 72
sharp -i logo.png -o icons/icon-96x96.png resize 96 96
sharp -i logo.png -o icons/icon-128x128.png resize 128 128
sharp -i logo.png -o icons/icon-144x144.png resize 144 144
sharp -i logo.png -o icons/icon-152x152.png resize 152 152
sharp -i logo.png -o icons/icon-384x384.png resize 384 384
```

### PWA Requirements

⚠️ **HTTPS Required**: PWA features only work over HTTPS

**Hostinger Setup:**
1. Enable SSL certificate (free with Let's Encrypt)
2. Force HTTPS redirect in `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Testing PWA

1. Visit your deployed site in Chrome
2. Open DevTools (F12) → Application tab
3. Check:
   - Manifest loads correctly
   - Service Worker is active
   - Offline mode works (Network tab → Offline checkbox)
4. Run Lighthouse audit (DevTools → Lighthouse → Generate report)
   - Should score 90+ for PWA

## Environment Configuration

### Frontend Environment Variables

Create `frontend/.env.production`:

```env
# API Endpoints
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# PWA
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_OFFLINE=true
```

### Currency Conversion API

The app uses free currency exchange rate API. No configuration needed, but you can:

1. **Monitor Usage**: Check API calls in browser DevTools → Network
2. **Change Provider**: Edit `frontend/src/lib/currencyService.ts` to use different API
3. **Adjust Cache**: Default is 1 hour, configurable in `currencyService.ts`

### Audio Studio (Gemini API)

No server-side configuration needed - API key is requested from user when they:
1. Click "Analyze & Segment" button
2. Try to generate audio

This "lazy auth" approach allows exploring the studio without immediate key requirement.

## Database Setup

### 1. Create MySQL Database

**In Hostinger Control Panel:**
1. Go to **Databases** → **MySQL Databases**
2. Create database: `quantummint_bookstore`
3. Create user with full permissions
4. Note down credentials

### 2. Import Schema

```bash
# Via phpMyAdmin
# 1. Access phpMyAdmin from Hostinger control panel
# 2. Select database
# 3. Go to Import tab
# 4. Upload schema.sql file
# 5. Click Go

# OR via command line
mysql -h hostname -u username -p database_name < schema.sql
```

### 3. Configure Database Connection

Update your API services (if using backend services) with connection details.

## Testing & Verification

### 1. Frontend Testing

```bash
# Run development server
cd frontend
npm run dev

# Access at http://localhost:3000
```

**Test Checklist:**
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Book Editor tabs switch correctly
- [ ] Currency conversion works (USD ↔ SLL)
- [ ] Audio Studio loads (no API key prompt initially)
- [ ] Logo displays correctly
- [ ] PWA install prompt appears (in production)

### 2. PWA Testing

**Install App:**
1. Visit site in Chrome
2. Click install icon in address bar (desktop)
3. Or Menu → "Add to Home Screen" (mobile)

**Test Offline:**
1. Open installed app
2. Go to a few pages (to cache them)
3. Turn off internet
4. Navigate app - should work offline
5. Cached pages should load
6. Non-cached pages show offline.html

**Test Service Worker:**
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Active SW:', regs);
});
```

### 3. Live Currency Conversion

1. Go to Book Editor
2. Enter USD amount → SLL should auto-calculate
3. Enter SLL amount → USD should auto-calculate
4. Check browser console for API calls
5. Verify rate is current (compare with xe.com)

### 4. Audio Studio

1. Navigate to Audio Studio
2. Should load without API key prompt ✅
3. Add some text
4. Click "Analyze & Segment"
5. **Now** it should ask for API key (if not set)
6. Enter valid Gemini API key
7. Content should generate

## Troubleshooting

### Build Errors

**Problem: `npm run build` fails**

```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

**Problem: TypeScript errors**

```bash
# Check TypeScript version
npx tsc --version

# Reinstall types
npm install --save-dev @types/react @types/node
```

### PWA Not Installing

**Checklist:**
1. ✅ Site is served over HTTPS
2. ✅ manifest.json is accessible at `/manifest.json`
3. ✅ Service worker is registered
4. ✅ Icons exist at specified paths
5. ✅ Page is visited multiple times (some browsers require this)

**Debug:**
```javascript
// Check manifest
fetch('/manifest.json').then(r => r.json()).then(console.log);

// Check service worker
navigator.serviceWorker.getRegistrations().then(console.log);
```

### Service Worker Not Updating

```javascript
// Force update
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.update());
});

// Or unregister and re-register
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
  location.reload();
});
```

### Currency API Errors

**Problem: "Failed to fetch exchange rates"**

**Causes:**
1. Rate limit exceeded (1,500/month for free tier)
2. API endpoint changed
3. Network issues

**Solutions:**
```javascript
// Check current rate manually
fetch('https://api.exchangerate-api.com/v4/latest/USD')
  .then(r => r.json())
  .then(data => console.log('SLL Rate:', data.rates.SLL));

// Clear cache to force refresh
import { clearRateCache } from '@/lib/currencyService';
clearRateCache();
```

**Switch to alternative API:**

Edit `frontend/src/lib/currencyService.ts`:

```typescript
// Option 1: CurrencyAPI (300/month free)
const EXCHANGE_RATE_API = 'https://api.currencyapi.com/v3/latest?apikey=YOUR_KEY&base_currency=USD&currencies=SLL';

// Option 2: Fixer.io (100/month free)
const EXCHANGE_RATE_API = 'https://api.fixer.io/latest?access_key=YOUR_KEY&base=USD&symbols=SLL';
```

### Audio Studio Issues

**Problem: API key prompt doesn't appear**

Check browser console for errors. Ensure:
1. `onRequireAuth` prop is passed to Studio component
2. Modal state is managed correctly

**Problem: "API Key not set" error**

This is expected on first use. The auth modal should appear. If not:
```javascript
// Check if key is set
import { setGeminiApiKey } from '@/services/geminiService';
// Key is stored in memory, not persisted
```

**Problem: Audio generation fails**

1. Check API key is valid (test at https://aistudio.google.com)
2. Check rate limits (free tier has limits)
3. Check browser console for specific errors

### Database Connection Issues

**Problem: Cannot connect to MySQL**

```bash
# Test connection
mysql -h your-host -u your-user -p your-database

# Check credentials
# Verify host, port, username, password in .env
```

**Problem: "Access denied"**

1. Check user has correct permissions
2. Verify password is correct
3. Check if remote connections are allowed

### Logo Not Displaying

**Checklist:**
1. ✅ `logo.png` exists in `frontend/public/`
2. ✅ Path in code is `/logo.png` (not `public/logo.png`)
3. ✅ File permissions are correct
4. ✅ Browser cache cleared

**Debug:**
```bash
# Check if file is accessible
curl https://yourdomain.com/logo.png

# Should return image data, not 404
```

## Monitoring & Maintenance

### Performance Monitoring

**Lighthouse Audit:**
```bash
# Install
npm install -g lighthouse

# Run audit
lighthouse https://yourdomain.com --preset=desktop --view

# Should score:
# - Performance: 90+
# - PWA: 90+
# - Accessibility: 90+
# - Best Practices: 90+
# - SEO: 90+
```

**Service Worker Updates:**

Check for updates every hour:
```javascript
setInterval(() => {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.update());
  });
}, 1000 * 60 * 60);
```

### Cache Management

**View cached resources:**
```javascript
caches.keys().then(names => {
  names.forEach(name => {
    caches.open(name).then(cache => {
      cache.keys().then(keys => {
        console.log(`Cache ${name}:`, keys.length, 'items');
      });
    });
  });
});
```

**Clear all caches:**
```javascript
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

### Regular Updates

**Monthly:**
- Check for npm package updates: `npm outdated`
- Review currency API usage
- Monitor error logs

**Quarterly:**
- Update dependencies: `npm update`
- Review and optimize service worker caching
- Audit PWA performance with Lighthouse

## Production Checklist

Before going live, ensure:

### Security
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables secured (not in git)
- [ ] API keys rotated and secured
- [ ] Database credentials are strong
- [ ] CORS properly configured
- [ ] Rate limiting implemented

### Performance
- [ ] Frontend optimized build (`npm run build`)
- [ ] Images optimized (logo, icons)
- [ ] Service worker caching configured
- [ ] CDN configured (optional)
- [ ] Database indexed appropriately

### PWA
- [ ] All icon sizes generated
- [ ] manifest.json validated
- [ ] Service worker active
- [ ] Offline page works
- [ ] Install prompt tested on multiple devices
- [ ] Lighthouse PWA score 90+

### Features
- [ ] Currency conversion tested with live data
- [ ] Audio Studio lazy auth working
- [ ] All navigation working
- [ ] Forms validated
- [ ] Error handling in place

### Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Deployment guide reviewed
- [ ] User guide created (optional)

## Cost Breakdown

### Infrastructure
- **Hostinger Hosting**: Your existing plan (~$2-10/month)
- **MySQL Database**: Included with Hostinger
- **SSL Certificate**: Free (Let's Encrypt)

### APIs (Free Tiers)
- **Currency Exchange API**: Free (1,500 requests/month)
- **Google Gemini API**: Free tier available with limits
- Additional APIs as needed (Stripe, SMS, etc.)

### Total: ~$2-10/month
(Primarily hosting costs, APIs are free tier)

## Next Steps

1. **Custom Domain**: Point your domain to Hostinger
2. **Analytics**: Add Google Analytics or Plausible
3. **Error Tracking**: Implement Sentry or similar
4. **CI/CD**: Set up GitHub Actions for auto-deployment
5. **Monitoring**: Add uptime monitoring (UptimeRobot, Pingdom)
6. **Backups**: Automate database backups
7. **CDN**: Consider Cloudflare for global distribution

## Support & Resources

- **GitHub Repository**: https://github.com/yansanehy1/quantummint-bookstore
- **Next.js Docs**: https://nextjs.org/docs
- **PWA Docs**: https://web.dev/progressive-web-apps/
- **Hostinger Support**: https://www.hostinger.com/support

---

**Last Updated**: November 27, 2025
**Version**: 2.0 (PWA-enabled)
