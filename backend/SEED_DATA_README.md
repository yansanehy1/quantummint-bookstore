# QuantumMint Bookstore - User Seed Data

This directory contains seed data files for populating the database with demo users and test accounts.

## Files

### 1. `seed-users.sql`
Ready-to-use SQL file containing INSERT statements with bcrypt-hashed passwords.

**How to use:**
1. Open phpMyAdmin
2. Select the `quantummint_db` database
3. Click the "Import" tab
4. Choose `seed-users.sql`
5. Click "Go" to import

**What it creates:**
- 6 demo user accounts
- 1 seller profile (for the creator account)

### 2. `seed-users-generator.js`
Node.js script that generates fresh seed data with randomly hashed passwords.

**How to use:**
```bash
cd backend
node seed-users-generator.js > seed-output.sql
```

Then import the output SQL file using phpMyAdmin.

## Demo Accounts

### 1. **Learner Account**
- Email: `learner@quantummint.com`
- Password: `password123`
- Role: User (Learner)
- Balance: $50.00
- Purpose: Browse and purchase content

### 2. **Creator Account**
- Email: `creator@quantummint.com`
- Password: `password123`
- Role: Educator (Content Creator)
- Balance: $150.00
- Seller Profile: Yes (Sarah Creator Publishing)
- Purpose: Create and publish content, manage earnings

### 3. **Admin Account**
- Email: `admin@quantummint.com`
- Password: `password123`
- Role: Admin
- Balance: $1000.00
- Purpose: Platform administration and management

### 4. **Support Account**
- Email: `support@quantummint.com`
- Password: `password123`
- Role: User
- Balance: $100.00
- Purpose: Support team operations

### 5. **Test Account 1**
- Email: `test@test.com`
- Password: `password123`
- Role: User
- Balance: $25.00
- Purpose: General testing

### 6. **Test Account 2**
- Email: `john@example.com`
- Password: `password123`
- Role: User
- Balance: $75.50
- Purpose: General testing

## Features Tested

With these accounts, you can test:
- ✅ User registration and login
- ✅ Role-based access control (learner, creator, admin)
- ✅ Wallet and balance management
- ✅ Purchase system
- ✅ Creator Dashboard
- ✅ Admin Dashboard
- ✅ Seller profiles and commissions

## Database Requirements

Before importing seed data:
1. Ensure `quantummint_db` database exists (run `schema.sql` first)
2. User roles must be: `user`, `educator`, `admin`
3. Password field must be VARCHAR(255) for bcrypt hashes

## Password Information

- **All accounts use:** `password123`
- **Hashing:** bcrypt with cost factor 10
- **Format:** `$2b$10$...` (60 characters)

## Regenerating Seed Data

If you need new UUIDs or passwords:

```bash
node seed-users-generator.js
```

This will output fresh SQL with new bcrypt hashes.

## Updating User Data

To update a user after import:

```sql
UPDATE Users 
SET balance = 100.00 
WHERE email = 'learner@quantummint.com';
```

## Deleting Seed Data

To remove all demo accounts:

```sql
DELETE FROM Users WHERE email IN (
  'learner@quantummint.com',
  'creator@quantummint.com',
  'admin@quantummint.com',
  'support@quantummint.com',
  'test@test.com',
  'john@example.com'
);
```

## Notes

- All accounts are pre-verified (`isVerified = 1`)
- Users have initial balances for testing wallet features
- Seller profile only for creator account
- Timestamps are set to current time during import
- Safe to re-import (uses INSERT, will fail if duplicates exist)
