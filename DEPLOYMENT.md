# QuantumMint Bookstore Deployment Guide

Complete guide for deploying QuantumMint Bookstore with Docker and Fly.io.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              HOSTINGER (Frontend)                            │
│              Next.js Static Files                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              FLY.IO (Backend)                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Container 1  │  │ Container 2  │  │ Container 3  │      │
│  │ Core Services│  │ Business     │  │ Support      │      │
│  │              │  │ Logic        │  │ Services     │      │
│  │ • API Gateway│  │ • Book       │  │ • SMS        │      │
│  │ • Auth       │  │ • Order      │  │ • Notif      │      │
│  │ • User       │  │ • Payment    │  │ • Search     │      │
│  │ • Wallet     │  │ • Gift       │  │ • Analytics  │      │
│  │              │  │ • Seller     │  │ • Audio      │      │
│  │              │  │ • Referral   │  │ • Moderation │      │
│  │              │  │              │  │ • Admin      │      │
│  │              │  │              │  │ • Integration│      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────┬───────┴──────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│  HOSTINGER   │          │   UPSTASH    │
│    MySQL     │          │    Redis     │
└──────────────┘          └──────────────┘
```

## Prerequisites

### 1. Install Docker Desktop
- Download from https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop
- Verify: `docker --version`

### 2. Install Fly.io CLI
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```
- Restart terminal
- Verify: `flyctl version`

### 3. Sign up for Fly.io
```bash
flyctl auth signup
# Or login if you have an account
flyctl auth login
```

## Step 1: Set Up Hostinger MySQL Database

1. **Access phpMyAdmin:**
   - Log into Hostinger control panel
   - Go to **Databases** section
   - Click **phpMyAdmin**

2. **Create Database:**
   - Click **New** in phpMyAdmin
   - Database name: `quantummint_bookstore`
   - Collation: `utf8mb4_unicode_ci`
   - Click **Create**

3. **Import Schema:**
   - Select your database
   - Click **Import** tab
   - Choose file: `schema.sql`
   - Click **Go**

4. **Get Connection Details:**
   - In Hostinger control panel > Databases
   - Note down:
     - Host: `mysql-xxxxx.hostinger.com`
     - Port: `3306`
     - Database name
     - Username
     - Password

## Step 2: Set Up Upstash Redis

1. **Sign up:**
   - Go to https://upstash.com
   - Sign up for free account

2. **Create Redis Database:**
   - Click **Create Database**
   - Name: `quantummint-redis`
   - Region: Choose closest to your users
   - Type: Regional (free tier)
   - Click **Create**

3. **Get Connection URL:**
   - Click on your database
   - Copy **Redis URL** (starts with `rediss://`)

## Step 3: Configure Environment Variables

1. **Create .env file:**
```bash
cd c:\Users\Barrka\.gemini\antigravity\scratch\quantummint-bookstore
cp .env.example .env
```

2. **Edit .env file** with your actual values:
   - Hostinger MySQL credentials
   - Upstash Redis URL
   - Stripe API keys
   - Twilio credentials
   - Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

## Step 4: Test Locally with Docker

1. **Build Docker images:**
```bash
docker build -f docker/Dockerfile.core -t quantummint-core .
docker build -f docker/Dockerfile.business -t quantummint-business .
docker build -f docker/Dockerfile.support -t quantummint-support .
```

2. **Run with docker-compose:**
```bash
docker-compose up
```

3. **Test endpoints:**
```bash
# API Gateway health check
curl http://localhost:3000/health

# Auth service
curl http://localhost:3001/health

# Book service
curl http://localhost:4001/health
```

4. **Stop containers:**
```bash
docker-compose down
```

## Step 5: Deploy to Fly.io

### Deploy Container 1 (Core Services)

```bash
# Set secrets
flyctl secrets set --app quantummint-core \
  DATABASE_URL="mysql://user:pass@host:3306/dbname" \
  REDIS_URL="rediss://..." \
  JWT_SECRET="your-jwt-secret" \
  --config fly.core.toml

# Deploy
flyctl deploy --config fly.core.toml
```

### Deploy Container 2 (Business Logic)

```bash
# Set secrets
flyctl secrets set --app quantummint-business \
  DATABASE_URL="mysql://user:pass@host:3306/dbname" \
  STRIPE_SECRET_KEY="sk_..." \
  STRIPE_WEBHOOK_SECRET="whsec_..." \
  --config fly.business.toml

# Deploy
flyctl deploy --config fly.business.toml
```

### Deploy Container 3 (Support Services)

```bash
# Set secrets
flyctl secrets set --app quantummint-support \
  DATABASE_URL="mysql://user:pass@host:3306/dbname" \
  REDIS_URL="rediss://..." \
  TWILIO_ACCOUNT_SID="AC..." \
  TWILIO_AUTH_TOKEN="..." \
  TWILIO_PHONE_NUMBER="+1234567890" \
  --config fly.support.toml

# Deploy
flyctl deploy --config fly.support.toml
```

## Step 6: Verify Deployments

```bash
# Check status
flyctl status --app quantummint-core
flyctl status --app quantummint-business
flyctl status --app quantummint-support

# View logs
flyctl logs --app quantummint-core
flyctl logs --app quantummint-business
flyctl logs --app quantummint-support

# Test endpoints
curl https://quantummint-core.fly.dev/health
curl https://quantummint-business.fly.dev/health
curl https://quantummint-support.fly.dev/health
```

## Step 7: Update Frontend Configuration

1. **Create API configuration file:**

Create `frontend/src/lib/api-config.ts`:
```typescript
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://quantummint-core.fly.dev',
  timeout: 30000,
};
```

2. **Update API calls** to use the new base URL

3. **Rebuild frontend:**
```bash
cd frontend
npm run build
```

4. **Deploy to Hostinger:**
   - Upload all files from `frontend/out` to `public_html`

## Step 8: Configure Stripe Webhooks

1. Go to https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://quantummint-business.fly.dev/webhooks/stripe`
4. Select events to listen for
5. Copy webhook signing secret
6. Update Fly.io secret:
```bash
flyctl secrets set STRIPE_WEBHOOK_SECRET="whsec_..." --app quantummint-business
```

## Troubleshooting

### Docker Build Fails

**Check Node.js version:**
```bash
node --version  # Should be 18.x or higher
```

**Clear Docker cache:**
```bash
docker system prune -a
```

### Fly.io Deployment Fails

**Check logs:**
```bash
flyctl logs --app quantummint-core
```

**SSH into container:**
```bash
flyctl ssh console --app quantummint-core
```

### Database Connection Issues

**Test connection from local machine:**
```bash
mysql -h mysql-xxxxx.hostinger.com -u username -p database_name
```

**Check firewall:** Ensure Hostinger allows external connections

### Services Not Starting

**Check environment variables:**
```bash
flyctl secrets list --app quantummint-core
```

**Restart app:**
```bash
flyctl apps restart quantummint-core
```

## Monitoring

### View Application Metrics
```bash
flyctl dashboard --app quantummint-core
```

### Scale Resources (if needed)
```bash
# Increase memory (requires paid plan)
flyctl scale memory 512 --app quantummint-core
```

## Cost Breakdown

- **Fly.io:** $0/month (3 free VMs with 256MB RAM each)
- **Hostinger:** Your existing plan
- **Upstash Redis:** $0/month (10,000 commands/day free)
- **Stripe:** Transaction fees only
- **Twilio:** Pay-as-you-go for SMS

**Total:** $0/month for infrastructure (plus transaction fees)

## Next Steps

1. Set up monitoring and alerts
2. Configure custom domain for Fly.io apps
3. Set up CI/CD pipeline for automatic deployments
4. Implement backup strategy for database
5. Add rate limiting and security headers
6. Set up error tracking (e.g., Sentry)
