# Refunds & Live Exchange Rates

## Overview

Learners can request refunds for completed book purchases. Admins review requests and, on approval, funds are credited back to the learner wallet. Subscription pricing and wallet balance conversions use a live USD→SLL rate with caching and fallback.

---

## Exchange rate

| Variable | Default | Description |
|----------|---------|-------------|
| `FALLBACK_SLL_TO_USD` | `59` | SLL per 1 USD when the API is unavailable |
| `EXCHANGE_RATE_CACHE_TTL_MS` | `3600000` | In-memory cache TTL (1 hour) |
| `EXCHANGE_RATE_API_URL` | exchangerate.host | JSON with `result` or `rate` field |

**Service:** `backend/services/exchangeRateService.js`

**Public endpoint:**

```http
GET /api/subscriptions/plans
```

Response includes `exchangeRate` and per-plan `priceSLLinUSD`.

**Wallet balance** (`GET /api/wallet/balance`) also returns `exchangeRate` for display conversions.

---

## Refund API

### Learner (authenticated)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/refunds/eligible-purchases` | Completed purchases without pending/approved refund |
| `POST` | `/api/refunds` | Submit request `{ purchaseId, reason }` (reason 10–1000 chars) |
| `GET` | `/api/refunds` | List own requests |
| `GET` | `/api/refunds/:id` | Request detail |

**Rate limit:** 5 submissions per user per hour (`REFUND_SUBMIT_MAX_PER_HOUR`).

### Admin (authenticated + admin role)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/refunds/stats` | Counts and total refunded amounts |
| `GET` | `/api/admin/refunds?status=pending` | List requests |
| `PUT` | `/api/admin/refunds/:id` | Approve/reject `{ status, adminNotes? }` |

On **approve**: wallet credited, `Transaction` type `refund` created, audit log recorded.

**Rate limit:** 60 admin actions per 15 minutes (`REFUND_ADMIN_MAX_PER_WINDOW`).

---

## Subscription worker notifications

Cron worker: `backend/workers/subscriptionWorker.js`

| Event | Notification |
|-------|----------------|
| Auto-renewal failed (low balance) | Email + push (`notifySubscriptionLowBalance`) |
| Subscription expired (no auto-renew) | Email + push (`notifySubscriptionExpired`) |
| Auto-renewal sweep expired subs | Email + push (`notifySubscriptionExpired`) |

Configure:

```env
SENDGRID_API_KEY=...
EMAIL_FROM=noreply@quantummint.net
PUSH_NOTIFICATION_WEBHOOK_URL=https://your-push-service/hook  # optional
```

Without `SENDGRID_API_KEY`, emails are logged and skipped (non-blocking).

---

## Frontend routes

| Route | Audience |
|-------|----------|
| `/wallet` → **Refunds** tab | Learners |
| `/subscriptions` | Plans + wallet checkout (main API) |
| `/admin/refunds` | Admins |

**Hook:** `frontend/src/hooks/useExchangeRate.ts` — shared live rate for Wallet, Subscriptions, and `FeeBreakdown`.

---

## Tests

```bash
cd backend
npm test
```

- `tests/exchangeRateService.test.js` — cache, fallback, conversions
- `tests/refunds.integration.test.js` — submit → approve → wallet credit
- `tests/subscriptionWorker.test.js` — renewal and notifications

---

## Deployment checklist

- [ ] Set `FALLBACK_SLL_TO_USD` and `EXCHANGE_RATE_CACHE_TTL_MS` in production env (`config/.env.production` or VPS `.env`)
- [ ] Configure `SENDGRID_API_KEY` for subscription/refund-related emails (optional)
- [ ] Set `REFUND_SUBMIT_MAX_PER_HOUR` / `REFUND_ADMIN_MAX_PER_WINDOW` if defaults are too strict
- [ ] Verify `GET /api/subscriptions/plans` is reachable from the frontend (`VITE_API_BASE_URL`)
