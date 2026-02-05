---
description: Deploying QuantumMint Bookstore to Hostinger VPS
---

# Hostinger VPS Deployment Workflow

Follow these steps to deploy the full QuantumMint Bookstore platform to your Hostinger VPS.

### 1. Initial VPS Setup

Once you have your VPS login details (IP Address and Root Password), connect via SSH:

```bash
ssh root@your_vps_ip
```

### 2. Install Docker (If not pre-installed)

If you didn't choose the "Docker" template on Hostinger:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 3. Transfer the Codebase

You can use `scp` to upload the project files from your local machine to the VPS:

```bash
# Run this on your LOCAL machine
scp -r quantummint-bookstore root@your_vps_ip:/root/
```

### 4. Run the Deployment Script

Navigate to the project directory on the VPS and execute the master deployment script:

```bash
# Run this on the VPS
cd quantummint-bookstore
chmod +x deploy-siera-books.sh
./deploy-siera-books.sh
```

### 5. Finalize Configuration

The script will create a `siera-books` folder with a generated `.env`. Update it with your production secrets:

```bash
cd siera-books
nano .env
# Update JWT_SECRET, DB_PASSWORD, etc. if needed
```

### 6. Start the Platform

// turbo

```bash
./start.sh
```

### 7. Verification

Access your site at `https://quantummint.net`. The script automatically configures Nginx with the correct proxy settings for the TTS engine.
