# 🚀 QuantumMint VPS Migration Guide: Hostinger KVM Setup

This guide outlines the steps to migrate the QuantumMint Bookstore from a local XAMPP/shared hosting environment to a Hostinger KVM VPS using Docker and PostgreSQL.

---

## 📋 Phase 0: Pre-Migration Checklist

### ✅ Before You Start
1. **Backup your current database** (MySQL/MariaDB).
2. **Export your file uploads** (TTS audio files).
3. **Document your environment variables** (.env).
4. **Note your domain DNS settings**.

### 🎯 Recommended Hostinger VPS Plan: **KVM 2 (8 GB RAM)**
Handle PostgreSQL + Redis + Node.js + Nginx with ease.

---

## 🖥️ Phase 1: VPS Provisioning & Base Setup

### Step 1: Launch VPS in Hostinger hPanel
- **OS**: Ubuntu 24.04 LTS
- **Plan**: KVM 2
- **Hostname**: quantummint-prod

### Step 2: SSH into VPS & Update
```bash
ssh root@YOUR_VPS_IP
apt update && apt upgrade -y
apt install -y curl wget git unzip htop nano fail2ban ufw
```

### Step 3: Create User & Configure Firewall
```bash
adduser quantummint
usermod -aG sudo quantummint
su - quantummint

sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

---

## 🐳 Phase 2: Docker & Project Setup

### Step 4: Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker quantummint
```

### Step 5: Project Structure
```bash
mkdir -p ~/quantummint/{app,postgres,data,redis,nginx,logs,scripts}
cd ~/quantummint
```

### Step 6: Environment Variables
Create a `.env` file in `~/quantummint` with the following:
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `REDIS_PASSWORD`
- `JWT_SECRET`
- `TTS_API_KEY`

---

## 🗄️ Phase 3: Deployment & Migration

### Step 7: Upload Deployment Files
Upload the files from `infrastructure/vps-migration/` to `~/quantummint/`.

### Step 8: Start Services
```bash
docker compose up -d
```

### Step 9: Database Migration
The `init.sql` script will automatically initialize the PostgreSQL schema. To migrate data from MySQL, use `pgloader`.

---

## 📊 Phase 4: Post-Launch & Optimization

### Automated Backups
The `scripts/backup.sh` is provided to handle daily DB and file backups. Schedule it via cron:
```bash
(crontab -l 2>/dev/null; echo "0 2 * * * /home/quantummint/scripts/backup.sh") | crontab -
```

### Health Monitoring
Use `scripts/healthcheck.sh` to monitor system status.

### Redis Caching for TTS
The application is configured to use Redis for caching TTS audio URLs to reduce API costs and latency.

---

## 🔄 Migration Rollback Plan
1. Keep old hosting active for 7 days.
2. If issues arise, export VPS DB and update DNS to point back to the old IP.

---

## 🎯 Final Launch Checklist
- [ ] Domain DNS updated to VPS IP.
- [ ] SSL certificate installed (Certbot).
- [ ] TTS proxy endpoint working with auth.
- [ ] Environment variables secured.
- [ ] Firewall active.
- [ ] Backups scheduled.
