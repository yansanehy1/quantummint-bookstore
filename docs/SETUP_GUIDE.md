# QuantumMint Platform - Complete Setup Guide

## 🎯 What You Have

A complete **audiobook + video pay-per-minute learning platform** with integrated email system, domain controller, and mail server.

## 📦 Services Overview

| Service | Port | Purpose |
|---------|------|---------|
| **Mail Server** | 8082 (Web), 25 (SMTP), 143 (IMAP) | Email sending, webhooks, templates |
| **Domain Controller** | 8080 | LDAP, Kerberos, DNS management |
| **MongoDB** | 27017 | Shared database for services |
| **Redis** | 6379 | Shared cache and sessions |

## 🚀 Quick Start

### 1. Initial Setup

```bash
# Windows
.\setup-services.bat

# Linux/Mac
chmod +x setup-services.sh
./setup-services.sh
```

This creates:
- TLS/SSL certificates for `quantummint.net`
- DKIM keys for email authentication
- Required directories
- Initial configuration

### 2. Configure Environment

Both services have `.env` files created. Key settings to review:

**mail-server/.env:**
```env
# Email senders
EMAIL_LISTENING=listen@quantummint.net
EMAIL_CREATORS=creators@quantummint.net
EMAIL_LIBRARY=library@quantummint.net

# Business rules
AUDIO_RATE_PER_MINUTE=0.15
VIDEO_RATE_STANDARD=0.25
VIDEO_RATE_PREMIUM=0.35
VIDEO_RATE_LIVE=0.50

# Platform URLs
PLATFORM_URL=https://quantum.quantummint.net
```

**domain-controller/.env:**
```env
DOMAIN_NAME=quantummint.net
MAIL_SERVER_URL=http://mail-server:8082
```

### 3. Set Up Database

```bash
cd mail-server

# Option 1: Using Node.js script
node src/utils/run-migrations.js

# Option 2: Using PostgreSQL directly
psql -U your_username -d quantummint -f migrations/002_email_system_tables.sql
```

See `mail-server/migrations/README.md` for detailed instructions.

### 4. Start Services

```bash
# Using Docker Compose (recommended)
docker-compose -f docker-compose.unified.yml up -d

# Or start services individually
cd mail-server && npm install && npm start
cd domain-controller && npm install && npm start
```

### 5. Verify Services

```bash
# Check mail server
curl http://localhost:8082/health

# Check webhooks
curl http://localhost:8082/api/webhooks/health

# Check domain controller
curl http://localhost:8080/health
```

## 📧 Email System Features

### Audiobook Workflows

1. **Wallet Top-Up** - Confirmation emails when users add credits
2. **Listening Sessions** - Summary after each listening session (10+ min)
3. **Low Balance** - Alerts when wallet drops below threshold
4. **Creator Royalties** - Daily earnings notifications for narrators/authors

### Video Workflows

1. **Video Sessions** - Summary with quality metrics, interactive elements
2. **Certificates** - Achievement notifications with social sharing
3. **Live Streams** - Starting notifications with free preview info
4. **Upload Processing** - Creator notifications when videos are ready

### Testing Email Workflows

```bash
# Test wallet top-up
curl -X POST http://localhost:8082/api/webhooks/wallet/topup \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com",
    "learner_name": "Test User",
    "amount": 25.00,
    "new_balance": 45.00
  }'

# Test video session summary
curl -X POST http://localhost:8082/api/webhooks/video/session-end \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com",
    "video_title": "Advanced JavaScript",
    "minutes_watched": 30,
    "certificate_eligible": true
  }'

# Test certificate issuance
curl -X POST http://localhost:8082/api/webhooks/video/certificate-issued \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com",
    "video_title": "Python Masterclass",
    "certificate_id": "CERT-TEST-001",
    "certificate_url": "https://example.com/cert.pdf"
  }'
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [SERVICES.md](SERVICES.md) | Architecture, deployment, DNS setup |
| [mail-server/docs/EMAIL_WORKFLOWS.md](mail-server/docs/EMAIL_WORKFLOWS.md) | Complete audiobook email workflows |
| [mail-server/docs/VIDEO_INTEGRATION.md](mail-server/docs/VIDEO_INTEGRATION.md) | Video-specific email workflows |
| [mail-server/README_QUANTUMMINT.md](mail-server/README_QUANTUMMINT.md) | Quick start for email system |
| [mail-server/migrations/README.md](mail-server/migrations/README.md) | Database setup instructions |

## 🗄️ Database Schema

The migration creates these tables:

**Core Tables:**
- `users` (extended with wallet_balance, user_type)
- `wallet_transactions` - All financial transactions
- `content` - Audiobooks and videos
- `content_sessions` - Listening/viewing sessions
- `creator_earnings` - Revenue tracking and payouts
- `payouts` - Payment processing
- `email_notifications` - Email delivery tracking
- `certificates` - Video completion certificates
- `live_streams` - Live streaming events

**Analytics Views:**
- `daily_revenue` - Revenue summaries
- `creator_earnings_summary` - Creator performance
- `user_engagement` - User activity metrics

## 🔧 Configuration

### Email Senders (SPF/DKIM Required)

```
listen@quantummint.net    → Listening sessions, wallet updates
creators@quantummint.net   → Creator earnings, payouts
library@quantummint.net    → Certificates, content updates
billing@quantummint.net    → Billing support
updates@quantummint.net    → Platform news, live streams
support@quantummint.net    → General support
```

### Business Rules

```env
# Pricing
AUDIO_RATE_PER_MINUTE=0.15       # $0.15/min for audiobooks
VIDEO_RATE_STANDARD=0.25         # $0.25/min for standard video
VIDEO_RATE_PREMIUM=0.35          # $0.35/min for premium video
VIDEO_RATE_LIVE=0.50             # $0.50/min for live streams
VIDEO_RATE_INTERACTIVE=0.45      # $0.45/min for interactive video

# Creator Revenue
CREATOR_PLATFORM_FEE=0.15        # 15% platform fee
CREATOR_TRANSACTION_FEE=0.25     # $0.25 per transaction
MINIMUM_PAYOUT=25.00             # Minimum $25 for payout

# Limits
MAX_DAILY_TOPUP=500.00           # Max $500 top-up per day
MAX_MONTHLY_PAYOUT=5000.00       # Max $5000 payout per month
MINIMUM_SESSION_FOR_SUMMARY=10   # 10 min minimum for email summary
```

### Quality-Based Billing (Video)

| Quality | Multiplier | Example Cost (1 hour) |
|---------|-----------|---------------------|
| 360p | 0.8× | $12.00 |
| 480p | 1.0× | $15.00 |
| 720p | 1.2× | $18.00 |
| 1080p | 1.5× | $22.50 |
| 4K | 2.0× | $30.00 |

## 🌐 DNS Configuration

Add these records to your DNS:

```
; A Records
@                   IN A     YOUR_SERVER_IP
quantum            IN A     YOUR_SERVER_IP
mail               IN A     YOUR_SERVER_IP

; MX Record
@                   IN MX 10 mail.quantummint.net.

; SPF Record
@                   IN TXT   "v=spf1 ip4:YOUR_SERVER_IP mx ~all"

; DKIM Record (get from setup script output)
default._domainkey IN TXT   "v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY"

; DMARC Record
_dmarc             IN TXT   "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@quantummint.net"
```

## 📊 Monitoring

### Check Service Health

```bash
# Mail server logs
tail -f mail-server/logs/mail-server.log

# Domain controller logs
tail -f domain-controller/logs/dc.log

# Docker logs
docker-compose logs -f mail-server
docker-compose logs -f domain-controller
```

### Database Queries

```sql
-- Check wallet balances
SELECT id, email, wallet_balance FROM users WHERE user_type = 'learner';

-- Today's revenue
SELECT * FROM daily_revenue WHERE date = CURRENT_DATE;

-- Pending payouts
SELECT creator_id, SUM(net_amount) as pending
FROM creator_earnings WHERE payout_status = 'pending'
GROUP BY creator_id HAVING SUM(net_amount) >= 25.00;

-- Email delivery stats
SELECT email_type, COUNT(*) as sent,
       SUM(CASE WHEN opened THEN 1 ELSE 0 END) as opened
FROM email_notifications
WHERE sent_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY email_type;
```

## 🔒 Security Checklist

- [ ] Update default SMTP credentials in `.env`
- [ ] Generate unique JWT secrets
- [ ] Configure SSL certificates for production
- [ ] Set up firewall rules (only expose needed ports)
- [ ] Enable rate limiting for webhooks
- [ ] Configure DKIM/SPF/DMARC for email authentication
- [ ] Set up backup schedule for database
- [ ] Enable monitoring and alerting
- [ ] Review and adjust business rules
- [ ] Test all webhook endpoints

## 🚨 Troubleshooting

### Emails Not Sending

1. Check SMTP credentials in `mail-server/.env`
2. Verify SMTP server is running: `curl localhost:25`
3. Check logs: `tail -f mail-server/logs/mail-server.log`
4. Test email sender utility: `node mail-server/src/utils/email-sender.js`

### Database Connection Issues

1. Verify DATABASE_URL in `.env`
2. Test connection: `node mail-server/src/utils/run-migrations.js`
3. Check PostgreSQL is running
4. Verify credentials and database exists

### Webhook Errors

1. Check request format matches documentation
2. Verify all required fields are present
3. Check webhook logs in `mail-server/logs/`
4. Test with curl examples above

### Port Conflicts

- Mail server web: 8082 (was changed from default to avoid conflicts)
- Domain controller: 8080
- MongoDB: 27017
- Redis: 6379

## 📞 Support

For issues or questions:
- **Email:** support@quantummint.net
- **Documentation:** See files in `docs/` directories
- **Logs:** Check service logs in respective `logs/` directories

## 🎓 Next Steps

1. **Set Up Frontend** - Connect your learner/creator portals to these APIs
2. **Configure Payment Gateway** - Integrate Stripe/PayPal for wallet top-ups
3. **Upload Content** - Add audiobooks and videos to the platform
4. **Test Workflows** - Run through complete user journeys
5. **Deploy to Production** - Use Docker Compose on your server
6. **Monitor Performance** - Set up logging and analytics
7. **Scale as Needed** - Add more instances behind load balancer

---

**QuantumMint Platform** - Learn through audio and video, pay by the minute 🎬🎧
