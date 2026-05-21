# 📚 QuantumMint Bookstore

QuantumMint Bookstore is a complete integrated learning platform combining videos, audiobooks, and scientific content with AI-powered explanations.

## 🚀 Key Features

- **STEM-Aware TTS**: Real-time recognition and intelligent narration of LaTeX math and chemical formulas.
- **Visual Sync**: Dynamic formula rendering that synchronizes with the audiobook narration.
- **Multi-Service Architecture**: Scalable Docker-based services including Node.js APIs and Python microservices.
- **Flexible Data Store**: Support for PostgreSQL (primary), MySQL, and SQLite for development.
- **Creator Studio**: Backend-persistent draft saving and AI-powered book orchestration.
- **Enhanced UI**: Professional toast notifications and 100% brand-synchronized experience.

## ️ Database Strategy

- 🧪 **Development**: SQLite or MySQL (XAMPP-friendly)
- 🚀 **Production**: PostgreSQL 16+ on Hostinger VPS (required for JSONB math metadata, full-text scientific search, and TTS usage analytics)
- 🔁 **Migration**: Use `pgloader` for zero-downtime MySQL → PostgreSQL transitions

## �🛠️ Running Locally

1. **Prerequisites**: Node.js, Docker, and Python.
2. Install dependencies: `npm install`
3. Set your `GEMINI_API_KEY` in `.env.local`.
4. Start the app: `npm run dev`

## 💱 Refunds & exchange rates

- Learners: **Wallet → Refunds** tab to request refunds for completed purchases
- Admins: **/admin/refunds** to approve or reject (wallet credited on approval)
- Live USD/SLL rate: `GET /api/subscriptions/plans` — see [REFUNDS_AND_EXCHANGE_RATES.md](./REFUNDS_AND_EXCHANGE_RATES.md)

## 🌐 Production Deployment

For production deployment on Hostinger VPS at **quantummint.net**:

### Prerequisites
- Hostinger KVM 2 VPS (8GB RAM, Ubuntu 24.04) [Hostinger VPS](https://www.hostinger.com/vps-hosting)
- Domain DNS pointing to VPS IP (A record)
- `GEMINI_API_KEY` and TTS provider credentials in `.env`

### One-Command Setup
```bash
# Clone and configure
git clone https://github.com/yourorg/quantummint-bookstore.git
cd quantummint-bookstore
cp .env.example .env  # Edit with your secrets

# Deploy with Docker Compose
docker compose up -d

# Initialize database (PostgreSQL)
docker compose exec postgres psql -U quantummint -d quantummint < database/init-all-databases.sql

# Verify deployment
curl -f https://quantummint.net/health && echo "✅ Live!"
```

### Post-Deploy Checklist
- [ ] SSL certificate installed (Let's Encrypt via Certbot)
- [ ] PostgreSQL backups scheduled (`scripts/backup.sh`)
- [ ] TTS usage monitoring enabled (`pg_stat_statements` extension)
- [ ] Redis cache warmed for frequent book chapters

🔗 [Detailed Deployment Guide](C:\Users\Barrka\.gemini\antigravity\brain\41d3bad3-8a47-4393-8a7c-32359d786389\walkthrough.md#🚀-hostinger-vps-deployment-guide)

### Quick Deploy

```bash
./deploy-quantummint-bookstore.sh
```
