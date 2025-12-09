# QuantumMint Email System Documentation

## Overview

The QuantumMint email system provides comprehensive email notifications for a pay-per-minute learning platform, integrated into the existing mail server infrastructure.

## Architecture

```
Frontend App → API Calls → Mail Server Webhooks → Email Templates → SMTP Delivery
                                ↓
                          Database Updates
                          Business Rules
                          Rate Limiting
```

## Webhook Endpoints

### Base URL
`http://localhost:8082/api/webhooks`

###The Wallet Webhooks

#### 1. Wallet Top-Up
**POST** `/wallet/topup`

Triggered when a learner recharges their wallet.

**Request Body:**
```json
{
  "user_id": "12345",
  "user_email": "learner@example.com",
  "learner_name": "John Doe",
  "amount": 10.00,
  "currency": "USD",
  "transaction_id": "txn_abc123",
  "payment_method": "Credit Card",
  "new_balance": 15.50,
  "rate_per_minute": 0.10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Top-up confirmation sent"
}
```

**Email Template:** `learner/wallet-topup-confirmation.html`

---

#### 2. Reading Session Deduction
**POST** `/wallet/deduct`

Triggered when a reading session ends and wallet is deducted.

**Request Body:**
```json
{
  "user_id": "12345",
  "user_email": "learner@example.com",
  "learner_name": "John Doe",
  "content_id": "content_789",
  "content_title": "Introduction to Quantum Physics",
  "minutes_used": 15,
  "amount_deducted": 1.50,
  "remaining_balance": 14.00,
  "rate_per_minute": 0.10,
  "total_time_today": "45 minutes"
}
```

**Business Rules:**
- Only sends email if session > 5 minutes
- Automatically triggers low balance alert if balance < $1.00
- Low balance alerts are rate-limited to once per 24 hours

**Email Template:** `learner/reading-summary.html`

---

#### 3. Auto Top-Up
**POST** `/wallet/autotopup`

Triggered when automatic wallet recharge occurs.

**Request Body:**
```json
{
  "user_id": "12345",
  "user_email": "learner@example.com",
  "learner_name": "John Doe",
  "amount": 10.00,
  "threshold": 2.00,
  "new_balance": 12.00,
  "rate_per_minute": 0.10
}
```

**Email Template:** Inline HTML (simple notification)

---

### Educator Payout Webhooks

#### 4. Payout Request
**POST** `/payout/request`

Triggered when an educator requests a withdrawal.

**Request Body:**
```json
{
  "educator_id": "edu_456",
  "educator_email": "educator@example.com",
  "educator_name": "Jane Smith",
  "requested_amount": 100.00,
  "platform_fee_percentage": 15,
  "transaction_fee": 0.25,
  "payment_method": "Bank Transfer",
  "estimated_arrival_days": 5
}
```

**Fee Calculation:**
- Platform Fee: `requested_amount * 0.15`
- Net Amount: `requested_amount - platform_fee - 0.25`

**Email Template:** Inline HTML (payout request confirmation)

---

#### 5. Payout Completion
**POST** `/payout/complete`

Triggered when a payout is successfully processed.

**Request Body:**
```json
{
  "educator_id": "edu_456",
  "educator_email": "educator@example.com",
  "educator_name": "Jane Smith",
  "amount": 84.75,
  "transaction_id": "payout_xyz789",
  "payment_method": "Bank Transfer",
  "completed_date": "2024-12-02"
}
```

**Email Template:** Inline HTML (payout completion)

---

#### 6. Daily Earnings
**POST** `/payout/daily` (or `/earnings/daily`)

Triggered daily to notify educators of their earnings.

**Request Body:**
```json
{
  "educator_id": "edu_456",
  "educator_email": "educator@example.com",
  "educator_name": "Jane Smith",
  "period_start": "2024-12-01",
  "period_end": "2024-12-01",
  "total_minutes": 120,
  "earnings_per_minute": 0.085,
  "gross_amount": 10.20,
  "platform_fee_percentage": 15,
  "transaction_fee": 0.25,
  "available_balance": 45.60
}
```

**Business Rules:**
- Only sends if `total_minutes > 0` and `gross_amount > 0`
- Scheduled to run daily at 9:00 PM

**Email Template:** `educator/daily-earnings.html`

---

## Email Templates

### Template Directory Structure
```
mail-server/src/templates/
├── learner/
│   ├── wallet-topup-confirmation.html
│   ├── low-balance-alert.html
│   └── reading-summary.html
├── educator/
│   └── daily-earnings.html
├── security/
└── common/
```

### Template Variables

All templates use double-brace syntax: `{{variable_name}}`

**Learner Templates:**
- `{{learner_name}}` - Student's name
- `{{amount}}`, `{{new_balance}}` - Currency amounts
- `{{transaction_id}}` - Transaction reference
- `{{minutes}}`, `{{estimated_minutes}}` - Time values
- `{{content_title}}` - Learning content name

**Educator Templates:**
- `{{educator_name}}` - Instructor's name
- `{{gross_amount}}`, `{{net_amount}}` - Earnings
- `{{platform_fee}}`, `{{transaction_fee}}` - Deductions
- `{{total_minutes}}` - Total reading time
- `{{available_balance}}` - Withdrawable amount

---

## Business Rules

### Wallet Management
- **Low Balance Threshold:** $1.00 (10 minutes)
- **Reading Rate:** $0.10 per minute
- **Max Daily Top-Up:** $500
- **Rate Limiting:** Low balance alerts once per 24 hours

### Educator Payouts
- **Platform Fee:** 15% of gross earnings
- **Transaction Fee:** $0.25 per payout
- **Minimum Payout:** $10.00
- **Max Monthly Payout:** $5,000 per educator
- **Processing Time:** 3-5 business days

### Email Rate Limits
- **Learner Emails:** Max 10 per day
- **Educator Emails:** Max 5 per day
- **Reading Summaries:** Only for sessions > 5 minutes
- **Low Balance Alerts:** Max 1 per 24 hours

---

## Integration Examples

### From Frontend Application

```javascript
// When user completes wallet top-up
async function handleWalletTopUp(userId, amount, transactionDetails) {
    const response = await fetch('http://localhost:8082/api/webhooks/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            user_email: await getUserEmail(userId),
            learner_name: await getUserName(userId),
            amount: amount,
            currency: 'USD',
            transaction_id: transactionDetails.id,
            payment_method: transactionDetails.method,
            new_balance: await getNewBalance(userId),
            rate_per_minute: 0.10
        })
    });
    
    return response.json();
}
```

### From Reading Session Handler

```javascript
// When reading session ends
async function handleSessionEnd(userId, sessionData) {
    await fetch('http://localhost:8082/api/webhooks/wallet/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            user_email: sessionData.userEmail,
            learner_name: sessionData.userName,
            content_id: sessionData.contentId,
            content_title: sessionData.contentTitle,
            minutes_used: sessionData.duration,
            amount_deducted: sessionData.cost,
            remaining_balance: sessionData.newBalance,
            rate_per_minute: 0.10,
            total_time_today: await getTotalReadingTimeToday(userId)
        })
    });
}
```

---

## Testing

### Test Wallet Top-Up
```bash
curl -X POST http://localhost:8082/api/webhooks/wallet/topup \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test123",
    "user_email": "test@example.com",
    "learner_name": "Test User",
    "amount": 10.00,
    "transaction_id": "test_txn_001",
    "payment_method": "Test",
    "new_balance": 10.00,
    "rate_per_minute": 0.10
  }'
```

### Test Low Balance Alert
```bash
curl -X POST http://localhost:8082/api/webhooks/wallet/deduct \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test123",
    "user_email": "test@example.com",
    "learner_name": "Test User",
    "content_id": "content_1",
    "content_title": "Test Content",
    "minutes_used": 10,
    "amount_deducted": 1.00,
    "remaining_balance": 0.50,
    "rate_per_minute": 0.10
  }'
```

### Health Check
```bash
curl http://localhost:8082/api/webhooks/health
```

---

## Troubleshooting

### Email Not Sending

1. **Check SMTP Configuration:**
   ```bash
   # Verify .env settings
   cat mail-server/.env | grep SMTP
   ```

2. **Check Logs:**
   ```bash
   tail -f mail-server/logs/mail-server.log
   ```

3. **Test Email Sender:**
   ```javascript
   const { verifyConnection } = require('./src/utils/email-sender');
   await verifyConnection();
   ```

### Rate Limiting Issues

Low balance alerts are limited to once per 24 hours. To reset for testing:
```javascript
// In the mail server console
lowBalanceAlerts.clear(); // Reset rate limit cache
```

### Template Not Found

Ensure template files exist:
```bash
ls -la mail-server/src/templates/learner/
ls -la mail-server/src/templates/educator/
```

---

## Future Enhancements

### Phase 2 (Planned)
- Reading streak notifications
- Content recommendations
- Inactivity re-engagement emails

### Phase 3 (Planned)
- Weekly performance reports for educators
- Content publishing notifications
- Security alerts

### Phase 4 (Planned)
- Automated payout processing (cron jobs)
- Tax document generation
- Advanced analytics reports

---

## Support

For issues or questions:
- **Documentation:** See individual README files
- **Logs:** `mail-server/logs/mail-server.log`
- **Email:** support@quantummint.net
