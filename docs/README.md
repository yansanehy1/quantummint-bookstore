<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# QuantumMint Platform

A comprehensive enterprise bookstore platform with integrated mail server and domain controller services.

## Platform Services

### 📚 Frontend Application
**Port:** 3000  
React-based bookstore application with modern UI and full e-commerce functionality.

### 📧 Mail Server
**Port:** 8082  
Enterprise email solution with SMTP, IMAP, POP3, and security features (SPF, DKIM, DMARC).

### 🔐 Domain Controller
**Port:** 8080  
LDAP directory services with Kerberos authentication, DNS, and group policy management.

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# 1. Run setup script
.\setup-services.bat  # Windows
./setup-services.sh   # Linux/macOS

# 2. Start all services
docker-compose -f docker-compose.unified.yml up -d

# 3. Access services
# - Frontend: http://localhost:3000
# - Mail Server: http://localhost:8082
# - Domain Controller: http://localhost:8080
```

### Option 2: Local Development

**Prerequisites:**  
- Node.js 18+
- MongoDB 4.4+
- Redis 6.0+

```bash
# 1. Install dependencies
npm install  # Frontend
cd mail-server && npm install && cd ..
cd domain-controller && npm install && cd ..

# 2. Start infrastructure
docker run -d -p 27017:27017 mongo:6.0
docker run -d -p 6379:6379 redis:7-alpine

# 3. Set API key (frontend only)
# Edit .env.local and set GEMINI_API_KEY

# 4. Start services (separate terminals)
npm run dev                        # Frontend (port 3000)
cd mail-server && npm start        # Mail (port 8082)
cd domain-controller && npm start  # Domain (port 8080)
```

## Port Reference

| Service | Port(s) | Description |
|---------|---------|-------------|
| Frontend | 3000 | Web application |
| Mail Server | 8082 | Web interface |
| | 25, 587, 465 | SMTP |
| | 143, 993 | IMAP |
| | 110, 995 | POP3 |
| Domain Controller | 8080 | Web interface |
| | 389, 636 | LDAP/LDAPS |
| | 88 | Kerberos |
| | 53 | DNS |
| MongoDB | 27017 | Database |
| Redis | 6379 | Cache & Queue |

## Documentation

- **[SERVICES.md](SERVICES.md)** - Comprehensive service documentation
- **[mail-server/README.md](mail-server/README.md)** - Mail server details
- **[domain-controller/README.md](domain-controller/README.md)** - Domain controller details

## Architecture

```
Frontend App ─┬─→ Mail Server ────┐
              │                    ├─→ MongoDB
              └─→ Domain Controller┘     ↓
                       ↓                Redis
                  LDAP/Kerberos
```

## Development

View your app in AI Studio: https://ai.studio/apps/drive/1DK6zOQWf7EeSzp8Kicf8VqWX04TmvK6n

## License

Copyright (c) 2024 QuantumMint. All rights reserved.
