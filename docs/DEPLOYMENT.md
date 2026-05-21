# Deployment Guide

## QuantumMint Bookstore

---

## 🎯 Deployment Overview

This guide covers deploying the QuantumMint Bookstore platform across different environments:

- **Local Development** - For development and testing
- **Staging** - For QA and client review
- **Production** - For live users

---

## 💻 Local Development Setup

### Prerequisites

**Required:**

- Node.js 18+ and npm 9+
- Git
- Code editor (VS Code recommended)

**Optional:**

- Docker (for backend services)
- PostgreSQL (for database)

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/yourusername/quantummint-bookstore.git
cd quantummint-bookstore

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Start development server
npm run dev
```

### Environment Variables (`.env.local`)

```env
# Application
VITE_APP_NAME="QuantumMint Bookstore"
VITE_APP_URL=http://localhost:5173

# API Endpoints
VITE_API_BASE_URL=http://localhost:8000/api
VITE_TTS_SERVICE_URL=http://localhost:7001/tts
VITE_MEDIA_SYNC_URL=http://localhost:7004/sync

# Payment Gateways (Test Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_ORANGE_MONEY_MERCHANT_ID=test_merchant
VITE_QMONEY_API_KEY=test_key

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PAYMENTS=false
```

### Development Server

```bash
# Start frontend (Vite)
npm run dev
# Runs on http://localhost:5173

# Start backend API (if available)
npm run server
# Runs on http://localhost:8000

# Start TTS service
npm run tts-service
# Runs on http://localhost:7001
```

---

## 🧪 Staging Deployment

### Staging Environment

**Purpose:**

- QA testing
- Client demos
- Integration testing
- Performance testing

**Hosting Options:**

- Vercel (recommended for frontend)
- Netlify
- AWS S3 + CloudFront

### Deploy to Vercel (Staging)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2 Login to Vercel
vercel login

# 3. Deploy to staging
vercel --env=staging

# 4. Set environment variables
vercel env add VITE_API_BASE_URL staging
# Input: https://api-staging.quantummint.net/api

vercel env add VITE_STRIPE_PUBLISHABLE_KEY staging
# Input: pk_test_...
```

### Environment Variables (Staging)

```env
# Application
VITE_APP_URL=https://staging.quantummint.net

# API Endpoints
VITE_API_BASE_URL=https://api-staging.quantummint.net/api
VITE_TTS_SERVICE_URL=https://tts-staging.quantummint.net

# Payment Gateways (Test Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_ENABLE_PAYMENTS=true

# Analytics
VITE_ENABLE_ANALYTICS=true
VITE_GA_TRACKING_ID=UA-STAGING-ID
```

---

## 🚀 Production Deployment

### Production Requirements

**Infrastructure:**

- CDN for static assets
- SSL/TLS certificates
- DDoS protection
- Auto-scaling capabilities

**Monitoring:**

- Error tracking (Sentry)
- Performance monitoring (Web Vitals)
- Uptime monitoring
- Analytics (Google Analytics)

### Option 1: Vercel (Recommended)

**Advantages:**

- Automatic deployments from Git
- Global CDN
- Serverless functions support
- Free SSL certificates
- Excellent DX

**Setup:**

```bash
# 1. Connect GitHub repository to Vercel
# Via Vercel Dashboard: vercel.com/new

# 2. Configure project settings
vercel link

# 3. Set production environment variables
vercel env add VITE_API_BASE_URL production
# Input: https://api.quantummint.net/api

vercel env add VITE_STRIPE_PUBLISHABLE_KEY production
# Input: pk_live_...

# 4. Deploy to production
vercel --prod
```

**Custom Domain:**

```bash
# Add custom domain
vercel domains add quantummint.net

# Configure DNS
# Add A record: @ -> 76.76.21.21
# Add CNAME: www -> cname.vercel-dns.com
```

### Option 2: Netlify

**Setup:**

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Initialize site
netlify init

# 4. Deploy
netlify deploy --prod
```

**`netlify.toml` Configuration:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### Option 3: Custom VPS (Digital Ocean, AWS EC2)

**Requirements:**

- Ubuntu 22.04 LTS
- Nginx as reverse proxy
- PM2 for process management
- Let's Encrypt for SSL

**Setup:**

```bash
# 1. Connect to server
ssh root@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 3. Install Nginx
apt-get install -y nginx

# 4. Clone repository
cd /var/www
git clone https://github.com/yourusername/quantummint-bookstore.git
cd quantummint-bookstore

# 5. Install dependencies and build
npm install
npm run build

# 6. Configure Nginx
nano /etc/nginx/sites-available/quantummint
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name quantummint.net www.quantummint.net;

    root /var/www/quantummint-bookstore/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**SSL with Let's Encrypt:**

```bash
# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d quantummint.net -d www.quantummint.net

# Auto-renewal
certbot renew --dry-run
```

---

## 🗄️ Backend Deployment

### Database (PostgreSQL)

**Hosting Options:**

- **Managed:** AWS RDS, DigitalOcean Managed Databases, Supabase
- **Self-hosted:** PostgreSQL on VPS

**Connection String:**

```env
DATABASE_URL=postgresql://user:password@host:5432/quantummint_prod
```

**Migrations:**

```bash
# Run migrations
npm run migrate:prod

# Seed initial data
npm run seed:prod
```

### API Server (Node.js + Express)

**Deployment Options:**

- **Vercel Serverless Functions**
- **Railway.app**
- **Heroku**
- **Custom VPS with PM2**

**PM2 Configuration (`ecosystem.config.js`):**

```javascript
module.exports = {
  apps: [{
    name: 'quantummint-api',
    script: './server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8000,
    },
  }]
};
```

**Deploy:**

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Save configuration
pm2 save

# Setup startup script
pm2 startup
```

### TTS Service

**Recommended:** Dedicated server for TTS processing

```bash
# TTS service on port 7001
pm2 start tts-service.js --name tts-service
```

---

## 💱 Backend: exchange rate & refunds

Add these to the **backend** `.env` on VPS or Docker (also in `config/.env.production` and `infrastructure/.env.production`):

```env
# Live USD → SLL rate (wallet + subscriptions)
FALLBACK_SLL_TO_USD=59
EXCHANGE_RATE_CACHE_TTL_MS=3600000

# Refund rate limits
REFUND_SUBMIT_MAX_PER_HOUR=5
REFUND_ADMIN_MAX_PER_WINDOW=60

# Global API rate limit (optional overrides)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=120

# Subscription expiry emails (optional)
SENDGRID_API_KEY=
EMAIL_FROM=noreply@quantummint.net
PUSH_NOTIFICATION_WEBHOOK_URL=
```

After deploy, verify:

```bash
curl https://quantummint.net/api/subscriptions/plans
# Expect: { "plans": [...], "exchangeRate": <number> }
```

Full API and UI paths: [REFUNDS_AND_EXCHANGE_RATES.md](./REFUNDS_AND_EXCHANGE_RATES.md).

---

## 🔐 Security Configuration

### SSL/TLS

**For Vercel/Netlify:**

- Automatic SSL certificates
- Auto-renewal

**For Custom VPS:**

```bash
# Let's Encrypt
certbot --nginx -d api.quantummint.net
```

### Environment Secrets

**Never commit:**

- API keys
- Database credentials
- Payment gateway secrets
- JWT secrets

**Store in:**

- Vercel environment variables
- `.env` files (gitignored)
- AWS Secrets Manager
- HashiCorp Vault

### Security Headers

```nginx
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://analytics.google.com";
```

---

## 📊 Monitoring & Logging

### Error Tracking (Sentry)

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Performance Monitoring

**Web Vitals:**

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  const url = `${import.meta.env.VITE_API_BASE_URL}/analytics`;

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true });
  }
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Uptime Monitoring

**Services:**

- UptimeRobot
- Pingdom
- StatusCake

**Setup:**

```bash
# Monitor endpoints
- https://quantummint.net (Frontend)
- https://api.quantummint.net/health (API)
- https://tts.quantummint.net/health (TTS Service)
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

**`.github/workflows/deploy.yml`:**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Pre-deployment Checks

```yaml
# .github/workflows/checks.yml
name: Pre-deployment Checks

on: [pull_request]

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run build
```

---

## 🔙 Rollback Strategy

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

### Manual Rollback (VPS)

```bash
# 1. SSH to server
ssh root@your-server-ip

# 2. Switch to previous release
cd /var/www/quantummint-bookstore
git checkout <previous-commit-hash>

# 3. Rebuild and restart
npm install
npm run build
pm2 restart all
```

### Database Rollback

```bash
# Rollback last migration
npm run migrate:rollback

# Rollback to specific version
npm run migrate:rollback --to=20240101000000
```

---

## 📋 Deployment Checklist

### Pre-deployment

- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] Database backed up
- [ ] Monitoring enabled

### Deployment

- [ ] Build successful
- [ ] Assets uploaded to CDN
- [ ] DNS updated (if needed)
- [ ] Health checks passing
- [ ] Smoke tests passed

### Post-deployment

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify payment processing
- [ ] Test critical user flows
- [ ] Update documentation
- [ ] Notify stakeholders

---

## 🌍 Multi-Region Deployment

### CDN Configuration

**Vercel:** Automatic global CDN
**Cloudflare:** Add in front of any hosting

```bash
# Configure Cloudflare
- Add domain to Cloudflare
- Update nameservers
- Enable CDN (orange cloud)
- Configure cache rules
```

### Geographic Considerations

**Sierra Leone Optimization:**

- Use African CDN nodes (Cloudflare has nodes in Lagos, Nigeria)
- Orange Money integration (local payment processor)
- Lightweight assets for mobile connections
- Progressive Web App for offline capability

---

## 💾 Backup Strategy

### Automated Backups

**Database:**

```bash
# Daily backups at 2 AM
0 2 * * * pg_dump quantummint_prod > /backup/db_$(date +\%Y\%m\%d).sql
```

**File Storage:**

```bash
# Sync to S3 daily
aws s3 sync /var/www/quantummint-bookstore s3://quantummint-backups/
```

**Retention Policy:**

- Daily backups: 7 days
- Weekly backups: 4 weeks
- Monthly backups: 12 months

---

## 📞 Support & Maintenance

### On-call Rotation

**Responsibilities:**

- Monitor alerts
- Respond to incidents
- Perform emergency fixes
- Coordinate with team

**Tools:**

- PagerDuty for alerting
- Slack for communication
- Statuspage for public updates

### Maintenance Windows

**Schedule:**

- Sundays 2-4 AM GMT (lowest traffic)
- Notify users 48 hours in advance
- Status page updates

---

## ✅ Success Metrics

**Uptime:** 99.9% (< 43 minutes downtime/month)
**Performance:** LCP < 2.5s, FID < 100ms
**Error Rate:** < 0.1%
**Deployment Frequency:** Weekly for features, daily for fixes
**Mean Time to Recovery:** < 1 hour

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Sentry Setup](https://docs.sentry.io/)

---

## 🔁 CI/CD Integration (GitHub Actions)

The project includes a reusable GitHub Actions workflow at `.github/workflows/backend-ci.yml` that:

- runs on `push` and `pull_request` for `main`, `master`, and `dev`
- checks out code
- sets up Node.js 20
- installs backend dependencies in `backend/`
- runs `npm test`
- runs `npm audit --audit-level=moderate || true` (informational)

To use, commit the workflow file and push to origin; GitHub will run the pipeline automatically.

