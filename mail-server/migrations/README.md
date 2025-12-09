# Database Migrations Guide

## Overview

This directory contains SQL migration scripts for the QuantumMint platform database schema. Run these migrations in order to set up the database for the email system integration.

## Migration Files

### 001_quantummint_schema.sql
**Status:** Sample schema from initial documentation
- Base user and content tables
- Wallet transaction tracking
- Reading/viewing sessions
- Creator earnings and payouts
- Email notification tracking

### 002_email_system_tables.sql
**Status:** ✅ Ready to run
- **Users table extensions** - Wallet balance, auto-top up settings
- **Wallet transactions** - All transaction types with metadata
- **Content table** - Audiobook and video content management
- **Content sessions** - Listening/viewing session tracking
- **Creator earnings** - Revenue calculation and payout status
- **Payouts** - Payment processing and history
- **Email notifications** - Email delivery and engagement tracking
- **Certificates** - Video completion certificates
- **Email preferences** - User notification settings
- **Live streams** - Live streaming events and registrations
- **Analytics views** - Helper views for reporting

## Prerequisites

- PostgreSQL 12+ (or MySQL 8+ with modifications)
- Database user with CREATE TABLE privileges
- Existing `users` table (or will be created)

## Running Migrations

### Option 1: PostgreSQL Command Line

```bash
# Connect to database
psql -U your_username -d quantummint

# Run migration
\i migrations/002_email_system_tables.sql

# Verify tables were created
\dt

# Check specific table
\d wallet_transactions
```

### Option 2: Using psql with file

```bash
psql -U your_username -d quantummint -f migrations/002_email_system_tables.sql
```

### Option 3: Node.js Script

```javascript
const { Pool } = require('pg');
const fs = require('fs').promises;

async function runMigration() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });
    
    const sql = await fs.readFile('migrations/002_email_system_tables.sql', 'utf-8');
    
    try {
        await pool.query(sql);
        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

runMigration();
```

### Option 4: Docker

```bash
docker exec -i quantummint-postgres psql -U postgres -d quantummint < migrations/002_email_system_tables.sql
```

## Tables Created

### Core Tables

| Table | Purpose | Rows (Est.) |
|-------|---------|-------------|
| `wallet_transactions` | All wallet activity | Millions |
| `content` | Audiobooks and videos | Thousands |
| `content_sessions` | Listening/viewing sessions | Millions |
| `creator_earnings` | Creator revenue tracking | Hundreds of thousands |
| `payouts` | Payment processing | Thousands |
| `email_notifications` | Email delivery tracking | Millions |
| `certificates` | Video completion certificates | Thousands |
| `email_preferences` | User notification settings | Hundreds of thousands |
| `live_streams` | Live streaming events | Hundreds |
| `live_stream_registrations` | Live stream attendance | Thousands |

### Indexes Created

All tables have proper indexes for:
- Primary keys (automatic)
- Foreign key lookups (user_id, content_id, creator_id)
- Date range queries (created_at, period_start/end)
- Status filters (status, payout_status)
- Type filters (content_type, transaction_type)

## Sample Queries

### Get Users with Low Balance
```sql
SELECT id, email, wallet_balance, 
       FLOOR(wallet_balance / 0.15) as estimated_minutes
FROM users
WHERE wallet_balance < 1.00 AND user_type = 'learner';
```

### Get Creators Ready for Payout
```sql
SELECT creator_id, SUM(net_amount) as available_balance
FROM creator_earnings
WHERE payout_status = 'pending'
GROUP BY creator_id
HAVING SUM(net_amount) >= 25.00;
```

### Get Today's Activity
```sql
SELECT user_id, 
       COUNT(*) as sessions_today,
       SUM(total_minutes) as total_minutes,
       SUM(charge) as total_cost
FROM content_sessions
WHERE DATE(start_time) = CURRENT_DATE
  AND status = 'completed'
GROUP BY user_id;
```

### Email Delivery Stats
```sql
SELECT 
    email_type,
    COUNT(*) as sent,
    SUM(CASE WHEN opened THEN 1 ELSE 0 END) as opened,
    SUM(CASE WHEN clicked THEN 1 ELSE 0 END) as clicked,
    ROUND(100.0 * SUM(CASE WHEN opened THEN 1 ELSE 0 END) / COUNT(*), 2) as open_rate
FROM email_notifications
WHERE DATE(sent_at) >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY email_type;
```

## Analytics Views

Three helper views are created:

### daily_revenue
```sql
SELECT * FROM daily_revenue WHERE date >= CURRENT_DATE - INTERVAL '7 days';
```

### creator_earnings_summary
```sql
SELECT * FROM creator_earnings_summary WHERE creator_id = 123;
```

### user_engagement
```sql
SELECT * FROM user_engagement WHERE total_minutes > 100 ORDER BY total_minutes DESC LIMIT 10;
```

## Rollback

If you need to rollback the migration:

```sql
-- Drop all tables (BE CAREFUL - this deletes data!)
DROP TABLE IF EXISTS live_stream_registrations CASCADE;
DROP TABLE IF EXISTS live_streams CASCADE;
DROP TABLE IF EXISTS email_preferences CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS email_notifications CASCADE;
DROP TABLE IF EXISTS payouts CASCADE;
DROP TABLE IF EXISTS creator_earnings CASCADE;
DROP TABLE IF EXISTS content_sessions CASCADE;
DROP TABLE IF EXISTS content CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;

-- Drop views
DROP VIEW IF EXISTS daily_revenue;
DROP VIEW IF EXISTS creator_earnings_summary;
DROP VIEW IF EXISTS user_engagement;

-- Remove user table extensions (if needed)
ALTER TABLE users 
DROP COLUMN IF EXISTS wallet_balance,
DROP COLUMN IF EXISTS auto_top_up_enabled,
DROP COLUMN IF EXISTS auto_top_up_amount,
DROP COLUMN IF EXISTS auto_top_up_threshold,
DROP COLUMN IF EXISTS user_type,
DROP COLUMN IF EXISTS total_listening_minutes,
DROP COLUMN IF EXISTS total_video_minutes,
DROP COLUMN IF EXISTS creator_tier,
DROP COLUMN IF EXISTS earnings_rate;
```

## Verification

After running the migration, verify the setup:

```sql
-- Check table count
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'wallet_transactions', 'content', 'content_sessions', 
    'creator_earnings', 'payouts', 'email_notifications',
    'certificates', 'email_preferences', 'live_streams'
);
-- Expected: 9

-- Check indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename = 'wallet_transactions';

-- Check views
SELECT viewname FROM pg_views WHERE schemaname = 'public';
```

## Seeding Test Data (Optional)

```sql
-- Create a test learner
INSERT INTO users (email, user_type, wallet_balance) 
VALUES ('test.learner@example.com', 'learner', 10.00);

-- Create a test creator
INSERT INTO users (email, user_type, creator_tier) 
VALUES ('test.creator@example.com', 'creator', 'tier1');

-- Create test content
INSERT INTO content (creator_id, title, content_type, duration_minutes, rate_per_minute, status)
VALUES (2, 'Test Audiobook', 'audio', 60, 0.15, 'published');

-- Create test transaction
INSERT INTO wallet_transactions (user_id, transaction_type, amount, balance_before, balance_after)
VALUES (1, 'top_up', 10.00, 0.00, 10.00);
```

## Troubleshooting

### Issue: "relation already exists"
**Solution:** Some tables may already exist. Either drop them first or modify the migration to use `CREATE TABLE IF NOT EXISTS`.

### Issue: "column already exists"
**Solution:** The ALTER TABLE statements use `ADD COLUMN IF NOT EXISTS` to prevent errors.

### Issue: Permission denied
**Solution:** Ensure your database user has CREATE TABLE and ALTER TABLE privileges:
```sql
GRANT CREATE ON SCHEMA public TO your_username;
```

### Issue: Syntax errors (MySQL vs PostgreSQL)
**Solution:** The migration is written for PostgreSQL. For MySQL:
- Change `SERIAL` to `AUTO_INCREMENT`
- Change `JSONB` to `JSON`
- Change `TIMESTAMP` to `DATETIME`
- Remove `CHECK` constraints

## Next Steps

After running migrations:

1. **Update Application Config** - Set `DATABASE_URL` in `.env`
2. **Test Connections** - Verify app can connect to database
3. **Run Seed Data** - Optionally create test users and content
4. **Start Email Webhooks** - Begin sending transactions to webhook APIs
5. **Monitor Logs** - Check for any database errors

## Support

For issues with migrations:
- Check PostgreSQL logs: `/var/log/postgresql/`
- Verify table structure: `\d table_name` in psql
- Contact: database-support@quantummint.net
