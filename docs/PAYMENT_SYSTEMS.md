# Payment Systems Integration

## Overview

QuantumMint Bookstore - Sierra Books supports four payment methods for deposits and withdrawals, optimized for Sierra Leone and international markets.

---

## 💳 Supported Payment Methods

### 1. 🟠 Orange Money

**Type:** Mobile Money Service  
**Region:** Sierra Leone, West Africa  
**Currency:** SLL (Sierra Leone Leones)

**Features:**

- Instant processing
- 24/7 availability
- QR code payments
- No minimum deposit
- Low transaction fees
- USSD and app-based

**Transaction Limits:**

- Min deposit: Le 10
- Max deposit: Le 500,000
- Min withdrawal: Le 10
- Max withdrawal: Le 1,000,000

**Fees:**

- Deposit: Free
- Withdrawal: 0% (deducted from amount)

---

### 2. 🔵 Afrimoney

**Type:** Mobile Money Service  
**Region:** Pan-African  
**Currency:** SLL (primary), multi-currency support

**Features:**

- Instant processing
- 24/7 availability
- Multi-currency wallet
- SMS confirmations
- Agent network access

**Transaction Limits:**

- Min deposit: Le 10
- Max deposit: Le 750,000
- Min withdrawal: Le 10
- Max withdrawal: Le 1,500,000

**Fees:**

- Deposit: Free
- Withdrawal: 0% (deducted from amount)

---

### 3. 🟢 Qmoney

**Type:** Mobile Money/Digital Wallet  
**Region:** Sierra Leone  
**Currency:** SLL

**Features:**

- Instant processing
- 24/7 availability
- QR code payments
- Mobile app integration
- Merchant network

**Transaction Limits:**

- Min deposit: Le 10
- Max deposit: Le 1,000,000
- Min withdrawal: Le 10
- Max withdrawal: Le 2,000,000

**Fees:**

- Deposit: Free
- Withdrawal: 0% (deducted from amount)

---

### 4. 💜 Stripe

**Type:** International Payment Processor  
**Region:** Global  
**Currency:** USD (with SLL conversion)

**Special Model:**

- Users **connect their own Stripe account**
- Direct deposits to user's Stripe account
- Platform fees charged on withdrawal
- International credit/debit card support

**Features:**

- Connect Stripe account to platform
- Direct bank transfers
- Credit/debit card deposits
- Global reach
- Automatic currency conversion

**Transaction Limits:**

- Min deposit: $1 USD (≈ Le 59)
- Max deposit: $10,000 USD
- Min withdrawal: $5 USD (≈ Le 294)
- No max withdrawal (Stripe limits apply)

**Fees:**

- Deposit: Stripe standard fees (2.9% + $0.30)
- **Withdrawal: Platform fee 5%** (covers processing + platform share)
- Currency conversion: Stripe rates apply

**Withdrawal Process:**

1. User requests withdrawal
2. Platform calculates amount after 5% fee
3. Funds transferred to user's connected Stripe account
4. User manages their Stripe withdrawals

---

## 💰 Fee Structure Summary

| Payment Method | Deposit Fee | Withdrawal Fee | Platform Fee* |
|---------------|-------------|----------------|---------------|
| **Orange Money** | Free | 0% | Included |
| **Afrimoney** | Free | 0% | Included |
| **Qmoney** | Free | 0% | Included |
| **Stripe** | 2.9% + $0.30 | **5.0%** | Separate |

*Platform fee for non-Stripe methods is taken from the 25% revenue share. For Stripe, it's charged on withdrawal.

---

## 🔄 User Workflows

### Learner/Reader Deposits

**Scenario:** User wants to subscribe (Le 10 for 7 days)

**Orange Money Flow:**

1. User selects "Orange Money"
2. Enters phone number
3. Receives USSD prompt
4. Confirms payment
5. Le 10 deposited (instant)
6. Subscription activated

**Stripe Flow:**

1. User selects "Stripe"
2. Enters card details (or saved card)
3. Charged $0.17 USD + $0.30 fee = $0.47
4. Converted to Le 10 credit
5. Subscription activated

### Creator Withdrawals

**Scenario:** Creator has Le 100 earnings, wants to withdraw

**Orange Money Flow:**

1. Creator requests Le 100 withdrawal
2. Platform calculates: Le 100
3. Le 100 sent to Orange Money number
4. Transaction complete instant

**Stripe Flow:**

1. Creator requests withdrawal
2. Must have Stripe account connected
3. Platform calculates: Le 100 × 0.017 = $1.70 USD
4. Platform fee 5%: $1.70 - $0.09 = $1.61
5. $1.61 transferred to creator's Stripe account
6. Creator manages own withdrawal from Stripe

---

## 🔐 Stripe Account Connection

### Why Connect Stripe?

For creators using Stripe, they connect their own account to:

- Receive payouts directly
- Manage their own funds
- Handle international transactions
- Comply with tax requirements

### Connection Process

1. **Creator Initiates:**
   - Navigate to Creator Dashboard
   - Click "Add Payment Method"
   - Select "Stripe"

2. **OAuth Flow:**
   - Redirected to Stripe Connect
   - Sign in to Stripe (or create account)
   - Authorize QuantumMint access
   - Redirect back with account linked

3. **Verification:**
   - Stripe account ID stored
   - Account verified
   - Ready to receive payouts

4. **Disconnect:**
   - Creator can disconnect anytime
   - Must add alternative payment method first
   - Pending funds processed before disconnect

---

## 💡 Business Logic

### Revenue Distribution

**For Mobile Money (Orange, Afrimoney, Qmoney):**

```
User Payment: Le 10 (subscription)
↓
Platform receives: Le 10
↓
Revenue Split:
- Creators pool: Le 7.0 (70%)
- Platform: Le 3.0 (30%)
↓
Creator Withdrawal:
- Creator earnings: Le 7
- Withdrawal fee free
- Creator receives: Le 7
```

**For Stripe:**

```
User Payment: $0.17 (subscription)
↓
Stripe fee: -$0.30 (2.9% + $0.30)
Platform receives: -$0.13 (loss on small transaction)
↓
Revenue Split:
- Creators pool: -$0.10 (75%)
- Platform: -$0.03 (25%)
↓
Creator Withdrawal:
- Creator earnings: $1.70 (accumulated)
- Platform fee 5%: -$0.09
- Transfer to Stripe: $1.61
- Creator manages own withdrawal from Stripe
```

**Note:** Stripe is better for larger transactions or international users.

---

## 🎯 Recommended Use Cases

### Orange Money

✅ Small deposits (Le 10)  
✅ Local Sierra Leone users  
✅ Quick withdrawals  
✅ Users without bank accounts  

### Afrimoney

✅ Medium deposits (Le 10)  
✅ Pan-African users  
✅ Multi-currency needs  
✅ Agent network access  

### Qmoney

✅ Large deposits (Le 1,000+)  
✅ Frequent transactions  
✅ QR code payments  
✅ Lowest withdrawal fees  

### Stripe

✅ International users  
✅ Credit/debit card payments  
✅ Large withdrawals ($50+)  
✅ USD preference  
✅ Creators with existing Stripe accounts  

---

## 🛠️ Technical Implementation

### Payment Method Selection

**Types:**

```typescript
export type PaymentMethod = 'orange_money' | 'afrimoney' | 'qmoney' | 'stripe';

export interface PaymentConfig {
    method: PaymentMethod;
    minDeposit: number; // SLL
    maxDeposit: number; // SLL
    minWithdrawal: number; // SLL
    maxWithdrawal: number; // SLL
    depositFee: number; // percentage
    withdrawalFee: number; // percentage
    currency: 'SLL' | 'USD';
    processingTime: string;
}
```

### Mobile Money Integration

**Orange Money API:**

```typescript
interface OrangeMoneyDeposit {
    phoneNumber: string;
    amount: number; // SLL
    reference: string;
    callbackUrl: string;
}

// POST /api/payments/orange-money/deposit
```

**Afrimoney API:**

```typescript
interface AfrimoneyDeposit {
    accountNumber: string;
    amount: number; // SLL
    currency: 'SLL';
    merchantId: string;
}

// POST /api/payments/afrimoney/deposit
```

**Qmoney API:**

```typescript
interface QmoneyDeposit {
    walletId: string;
    amount: number; // SLL
    qrCode?: string;
    merchantRef: string;
}

// POST /api/payments/qmoney/deposit
```

### Stripe Connect Integration

**Connect Flow:**

```typescript
// 1. Generate Connect URL
const stripeConnectUrl = `https://connect.stripe.com/oauth/authorize?
  response_type=code
  &client_id=${STRIPE_CLIENT_ID}
  &scope=read_write
  &redirect_uri=${REDIRECT_URI}
  &state=${userId}`;

// 2. Handle Callback
interface StripeConnectCallback {
    code: string;
    state: string; // userId
}

// 3. Exchange Code for Account ID
const accountId = await stripe.oauth.token({
    grant_type: 'authorization_code',
    code: callbackCode,
});

// 4. Store Connection
await db.users.update({
    stripeAccountId: accountId,
    stripeConnectedAt: new Date(),
});
```

**Payout Flow:**

```typescript
interface StripePayout {
    amount: number; // USD cents
    stripeAccountId: string;
    description: string;
    platformFee: number; // 0%
}

// POST /api/payouts/stripe
const transfer = await stripe.transfers.create({
    amount: amountAfterFee,
    currency: 'usd',
    destination: stripeAccountId,
    description: 'Creator earnings payout',
});
```

---

## 🔒 Security Considerations

### Mobile Money

- Phone number verification
- OTP confirmation
- Transaction limits
- Fraud detection
- Webhook signature validation

### Stripe

- OAuth 2.0 for account connection
- PCI DSS compliance
- 3D Secure for cards
- Webhooks with signature verification
- Account ownership verification

---

## 📊 Payment Analytics

Track metrics for each payment method:

- Total transaction volume (SLL)
- Transaction count
- Average transaction size
- Fee revenue
- Failure rate
- Processing time
- User preference distribution

---

## 🚀 Implementation Phases

### Phase 1: Mobile Money (Priority)

- [ ] Orange Money integration
- [ ] Afrimoney integration  
- [ ] Qmoney integration
- [ ] Deposit flows
- [ ] Withdrawal flows
- [ ] Webhook handlers

### Phase 2: Stripe Connect

- [ ] Stripe Connect setup
- [ ] OAuth integration
- [ ] Account linking UI
- [ ] Payout processing
- [ ] Fee calculation
- [ ] Disconnect flow

### Phase 3: Enhancements

- [ ] Payment method switching
- [ ] Multi-method balance
- [ ] Automatic retry logic
- [ ] Payment history export
- [ ] Refund processing

---

## 💳 User Interface Elements

### Payment Method Selector

**Deposit Page:**

```
Select Payment Method:
[ ] 🟠 Orange Money - Instant, No fees
[ ] 🔵 Afrimoney - Instant, No fees
[ ] 🟢 Qmoney - Instant, No fees
[ ] 💜 Stripe - International cards accepted
```

### Creator Payout Page

**Withdrawal Options:**

```
Available Balance: Le 127.50 ($2.17)

Withdraw to:
○ Orange Money: +232-XX-XXX-XXX
   You'll receive: Le 127.50

○ Stripe: Connected (account_xxx)
   You'll receive: $2.06 (5% platform fee)

[ Request Withdrawal ]
```

---

## 📋 Compliance & Regulations

### Mobile Money

- Sierra Leone Bank regulations
- KYC requirements
- Transaction limits
- Anti-money laundering (AML)

### Stripe

- International payment regulations
- Tax reporting (1099-K for US users)
- GDPR compliance
- PSD2 compliance (EU)

---

## ✅ Testing Checklist

- [ ] Orange Money sandbox integration
- [ ] Afrimoney test accounts
- [ ] Qmoney test environment
- [ ] Stripe test mode
- [ ] Deposit success scenarios
- [ ] Deposit failure scenarios
- [ ] Withdrawal success scenarios
- [ ] Withdrawal failure scenarios
- [ ] Fee calculations
- [ ] Currency conversions
- [ ] Webhook handling
- [ ] Account connection/disconnection
- [ ] Transaction limits
- [ ] Error handling

---

## 🎯 Success Metrics

**Targets:**

- 95%+ transaction success rate
- <5 second deposit confirmation
- <4 hour mobile money withdrawals
- <10% payment method abandonment
- >90% user satisfaction with payments

---

## 📝 Next Steps

1. Integrate Orange Money API (highest usage expected)
2. Add Qmoney (best rates)
3. Implement Afrimoney
4. Set up Stripe Connect for international users
5. Build payment method management UI
6. Create comprehensive error handling
7. Implement webhook processing
8. Add payment analytics dashboard
