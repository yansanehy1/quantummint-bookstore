@echo off
REM QuantumMint Services Setup Script for Windows
REM This script prepares the mail-server and domain-controller services for deployment

echo =========================================
echo QuantumMint Services Setup
echo =========================================
echo.

REM Check if running in the correct directory
if not exist "mail-server\" (
    echo Error: Please run this script from the quantummint-bookstore156 directory
    exit /b 1
)
if not exist "domain-controller\" (
    echo Error: Please run this script from the quantummint-bookstore156 directory
    exit /b 1
)

REM Create required directories
echo Creating required directories...
if not exist "mail-server\logs" mkdir mail-server\logs
if not exist "mail-server\certs" mkdir mail-server\certs
if not exist "mail-server\keys" mkdir mail-server\keys
if not exist "mail-server\keys\dkim" mkdir mail-server\keys\dkim
if not exist "domain-controller\logs" mkdir domain-controller\logs
if not exist "domain-controller\certs" mkdir domain-controller\certs
echo [SUCCESS] Directories created
echo.

REM Generate TLS/SSL certificates for development
echo Generating TLS/SSL certificates...
echo.

REM Mail Server Certificate
if not exist "mail-server\certs\certificate.crt" (
    openssl req -x509 -newkey rsa:2048 ^
        -keyout mail-server\certs\private.key ^
        -out mail-server\certs\certificate.crt ^
        -days 365 -nodes ^
        -subj "/C=US/ST=State/L=City/O=QuantumMint/CN=mail.quantummint.net"
    echo [SUCCESS] Mail server certificate generated
) else (
    echo [WARNING] Mail server certificate already exists
)

REM Domain Controller Certificate
if not exist "domain-controller\certs\certificate.crt" (
    openssl req -x509 -newkey rsa:2048 ^
        -keyout domain-controller\certs\private.key ^
        -out domain-controller\certs\certificate.crt ^
        -days 365 -nodes ^
        -subj "/C=US/ST=State/L=City/O=QuantumMint/CN=dc.quantummint.net"
    echo [SUCCESS] Domain controller certificate generated
) else (
    echo [WARNING] Domain controller certificate already exists
)

echo.
echo Generating DKIM keys...
REM Generate DKIM keys for mail server
if not exist "mail-server\keys\dkim\private.key" (
    openssl genrsa -out mail-server\keys\dkim\private.key 2048
    openssl rsa -in mail-server\keys\dkim\private.key -pubout -out mail-server\keys\dkim\public.key
    echo [SUCCESS] DKIM keys generated
    echo.
    echo Add this DNS TXT record for DKIM:
    echo quantum._domainkey.quantummint.net TXT "v=DKIM1; k=rsa; p=PUBLIC_KEY_HERE"
    echo (Replace PUBLIC_KEY_HERE with the content of mail-server\keys\dkim\public.key)
    echo.
) else (
    echo [WARNING] DKIM keys already exist
)

REM Check if .env files exist
echo Checking environment configuration...
if exist "mail-server\.env" (
    echo [SUCCESS] mail-server\.env exists
) else (
    echo [WARNING] mail-server\.env not found - already created by previous setup
)

if exist "domain-controller\.env" (
    echo [SUCCESS] domain-controller\.env exists
) else (
    echo [WARNING] domain-controller\.env not found - already created by previous setup
)

REM Install shared package dependencies
echo.
echo Setting up shared package...
cd shared
if not exist "node_modules" (
    call npm install uuid
    echo [SUCCESS] Shared package dependencies installed
) else (
    echo [WARNING] Shared package already initialized
)
cd ..

REM Install service dependencies (optional)
echo.
set /p install_deps="Do you want to install service dependencies now? (y/n): "

if /i "%install_deps%"=="y" (
    echo Installing mail-server dependencies...
    cd mail-server
    call npm install
    cd ..
    echo [SUCCESS] Mail server dependencies installed
    
    echo Installing domain-controller dependencies...
    cd domain-controller
    call npm install
    cd ..
    echo [SUCCESS] Domain controller dependencies installed
)

echo.
echo =========================================
echo [SUCCESS] Setup complete!
echo =========================================
echo.
echo Next steps:
echo 1. Review and update .env files in mail-server\ and domain-controller\
echo 2. Start services with: docker-compose -f docker-compose.unified.yml up -d
echo 3. Or run locally:
echo    - Mail Server: cd mail-server ^&^& npm start
echo    - Domain Controller: cd domain-controller ^&^& npm start
echo.
echo Service URLs:
echo   - Mail Server:        http://localhost:8082
echo   - Domain Controller:  http://localhost:8080
echo.
echo Important Ports:
echo   - SMTP:      25, 587, 465
echo   - IMAP:      143, 993
echo   - POP3:      110, 995
echo   - LDAP:      389, 636
echo   - Kerberos:  88
echo   - DNS:       53
echo.
pause
