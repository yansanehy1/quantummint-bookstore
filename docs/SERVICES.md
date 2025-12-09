# QuantumMint Services Documentation

## Overview

The QuantumMint platform consists of multiple integrated services providing enterprise-grade functionality for the bookstore application.

## Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    QuantumMint Platform                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Frontend   │  │     Mail     │  │   Domain     │     │
│  │    App       │  │    Server    │  │  Controller  │     │
│  │  (Port 3000) │  │ (Port 8082)  │  │ (Port 8080)  │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│         ┌──────────────────┴──────────────────┐             │
│         │                                      │             │
│    ┌────▼────┐                           ┌────▼────┐        │
│    │ MongoDB │                           │  Redis  │        │
│    │ (27017) │                           │ (6379)  │        │
│    └─────────┘                           └─────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Services

### Frontend Application (quantummint-bookstore)
- **Port:** 3000
- **Technology:** React/Vite
- **Purpose:** User-facing bookstore application
- **Dependencies:** Backend API services

### Mail Server
- **Web Interface:** http://localhost:8082
- **Purpose:** Enterprise email solution with SMTP/IMAP/POP3
- **Key Features:**
  - Full email server (SMTP, IMAP, POP3)
  - Email authentication (SPF, DKIM, DMARC)
  - Spam and virus filtering
  - DNS management
  - Web-based administration

**Ports:**
- `8082` - Web interface and API
- `25` - SMTP
- `587` - SMTP Submission (STARTTLS)
- `465` - SMTP Secure (SSL/TLS)
- `143` - IMAP
- `993` - IMAP Secure
- `110` - POP3
- `995` - POP3 Secure

### Domain Controller
- **Web Interface:** http://localhost:8080
- **Purpose:** LDAP directory services and authentication
- **Key Features:**
  - LDAP v3 directory server
  - Kerberos authentication
  - DNS integration
  - Group policy management
  - User/group management

**Ports:**
- `8080` - Web interface and API
- `389` - LDAP
- `636` - LDAPS (Secure)
- `88` - Kerberos
- `53` - DNS (UDP)

### Shared Infrastructure

#### MongoDB
- **Port:** 27017
- **Purpose:** Primary database for all services
- **Databases:**
  - `quantummint` - Main application
  - `quantummint-mail` - Mail server data
  - `quantummint-domain` - Domain controller data

#### Redis
- **Port:** 6379
- **Purpose:** Caching and message queuing
- **Used by:** All services for session management and queuing

## Service Integration

### Authentication Flow
```
User Login → Frontend → Domain Controller (LDAP) → JWT Token → Frontend
                              ↓
                      Audit & Logging
```

### Email Notifications
```
Application Event → Mail Server API → Email Queue → SMTP Delivery
                         ↓
                  Domain Controller (User Lookup)
```

### User Management
```
Admin Dashboard → Domain Controller API → LDAP Directory
                         ↓
                  Mail Server (Mailbox Creation)
```

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Run setup script to generate certificates and keys
.\setup-services.bat  # Windows
# or
./setup-services.sh   # Linux/macOS

# Start all services
docker-compose -f docker-compose.unified.yml up -d

# View logs
docker-compose -f docker-compose.unified.yml logs -f

# Stop all services
docker-compose -f docker-compose.unified.yml down
```

### Running Services Locally

**Prerequisites:**
- Node.js 18+
- MongoDB 4.4+
- Redis 6.0+
- OpenSSL

**Setup:**
```bash
# Install dependencies
cd mail-server && npm install && cd ..
cd domain-controller && npm install && cd ..
cd shared && npm install && cd ..

# Start MongoDB and Redis (via Docker or locally)
docker run -d -p 27017:27017 --name mongodb mongo:6.0
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Start Domain Controller
cd domain-controller
npm start

# Start Mail Server (in another terminal)
cd mail-server
npm start
```

## DNS Configuration (Production)

For production deployment, configure these DNS records:

### MX Records
```
quantummint.net.        MX    10 mail.quantummint.net.
```

### A Records
```
mail.quantummint.net.        A     YOUR_SERVER_IP
dc.quantummint.net.          A     YOUR_SERVER_IP
ldap.quantummint.net.        A     YOUR_SERVER_IP
```

### SPF Record
```
quantummint.net.        TXT   "v=spf1 ip4:YOUR_SERVER_IP ~all"
```

### DKIM Record
```
quantum._domainkey.quantummint.net.  TXT  "v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY"
```
(Generated by setup script - see `mail-server/keys/dkim/public.key`)

### DMARC Record
```
_dmarc.quantummint.net.  TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@quantummint.net"
```

### Service Records (SRV)
```
_ldap._tcp.quantummint.net.      SRV  0  0  389  dc.quantummint.net.
_ldaps._tcp.quantummint.net.     SRV  0  0  636  dc.quantummint.net.
_kerberos._tcp.quantummint.net.  SRV  0  0  88   dc.quantummint.net.
```

## Firewall Configuration

### Required Ports (Inbound)

**Mail Server:**
- TCP 25 (SMTP)
- TCP 587 (SMTP Submission)
- TCP 465 (SMTP Secure)
- TCP 143 (IMAP)
- TCP 993 (IMAP Secure)
- TCP 110 (POP3)
- TCP 995 (POP3 Secure)
- TCP 8082 (Web Interface) - Internal only

**Domain Controller:**
- TCP 389 (LDAP)
- TCP 636 (LDAPS)
- TCP 88 (Kerberos)
- UDP 53 (DNS)
- TCP 8080 (Web Interface) - Internal only

**Database:**
- TCP 27017 (MongoDB) - Internal only
- TCP 6379 (Redis) - Internal only

## API Documentation

### Mail Server API

**Base URL:** `http://localhost:8082/api`

**Send Email:**
```http
POST /email/send
Content-Type: application/json
Authorization: Bearer <token>

{
  "to": ["user@example.com"],
  "subject": "Test Email",
  "content": "<h1>Hello!</h1>",
  "contentType": "text/html"
}
```

**Check Queue Status:**
```http
GET /queue/status
Authorization: Bearer <token>
```

### Domain Controller API

**Base URL:** `http://localhost:8080/api`

**Authenticate User:**
```http
POST /integration/auth/login
Content-Type: application/json

{
  "username": "user@quantummint.net",
  "password": "password"
}
```

**List Users:**
```http
GET /users?page=1&limit=50
Authorization: Bearer <token>
```

**Create User:**
```http
POST /users
Content-Type: application/json
Authorization: Bearer <token>

{
  "sAMAccountName": "newuser",
  "displayName": "New User",
  "mail": "newuser@quantummint.net",
  "password": "SecurePass123!"
}
```

## Security Considerations

### Production Deployment Checklist

- [ ] Change all default passwords in `.env` files
- [ ] Generate strong JWT secrets (32+ characters)
- [ ] Use real TLS/SSL certificates (not self-signed)
- [ ] Enable firewall rules restricting port access
- [ ] Configure MongoDB authentication
- [ ] Set Redis password
- [ ] Enable audit logging
- [ ] Set up log monitoring and alerts
- [ ] Configure automated backups
- [ ] Use environment-specific configuration
- [ ] Secure DNS with DNSSEC (optional)
- [ ] Implement rate limiting at network level

### Development vs Production

**Development (.env files):**
- Uses `quantummint.net` domain
- Self-signed certificates
- Simplified passwords
- All services on localhost
- Detailed logging enabled

**Production (requires updates):**
- Real domain name
- Valid SSL/TLS certificates
- Strong passwords and secrets
- Distributed services possible
- Optimized logging levels

## Monitoring

### Health Checks

```bash
# Mail Server
curl http://localhost:8082/health

# Domain Controller
curl http://localhost:8080/health

# Detailed Status
curl http://localhost:8082/status
curl http://localhost:8080/status
```

### Logs

**Mail Server:**
- `mail-server/logs/mail-server.log`

**Domain Controller:**
- `domain-controller/logs/domain-controller.log`

**Docker:**
```bash
docker-compose -f docker-compose.unified.yml logs mail-server
docker-compose -f docker-compose.unified.yml logs domain-controller
```

## Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :8080

# Linux/macOS
lsof -i :8080

# Kill the process or change port in .env file
```

**MongoDB Connection Failed:**
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Start MongoDB
docker-compose -f docker-compose.unified.yml up -d mongodb
```

**Services Not Starting:**
1. Check logs for error messages
2. Verify all required ports are available
3. Ensure MongoDB and Redis are running
4. Verify .env files exist and are properly configured
5. Check Node.js version (18+ required)

**TLS/SSL Certificate Errors:**
```bash
# Regenerate certificates
.\setup-services.bat  # Will skip existing certificates unless deleted
```

## Support

- **Documentation:** See individual service README.md files
- **Issues:** Check service logs for detailed error messages
- **Email:** support@quantummint.net

---

**QuantumMint Platform** - Enterprise Bookstore Solution
Built with ❤️ for modern applications

