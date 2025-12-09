# QuantumMint Audiobook Platform - Email System

## Platform Overview

**QuantumMint** is a pay-per-minute audiobook platform with planned video integration:
- **Primary**: Audiobook streaming ($0.15/minute)
- **Upcoming**: Educational video content ($0.25-0.35/minute)
- **Model**: Unified wallet for all content types

## Platform URLs
- **Main Site:** https://quantum.quantummint.net
- **Creator Portal:** https://quantum.quantummint.net/creator
- **Library:** https://quantum.quantummint.net/library

## Email System Integration

The email system supports:

### Listener Workflows
- 🎧 Listening session summaries  
- 💰 Wallet management (top-ups, auto-recharge)
- ⚠️ Balance alerts
- 🏆 Milestones & achievements
- 📚 Content recommendations

### Creator/Narrator Workflows
- 💵 Royalty earnings notifications
- 💸 Payout processing
- 📈 Performance analytics
- 🎙️ Content upload status
- 🌟 Tier upgrades

## Quick Test

```bash
# Test audiobook session summary
curl -X POST http://localhost:8082/api/webhooks/wallet/deduct \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test123",
    "user_email": "test@example.com",
    "learner_name": "Test Listener",
    "content_id": "audiobook_1",
    "content_title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "narrator": "Jake Gyllenhaal",
    "minutes_used": 45,
    "amount_deducted": 6.75,
    "remaining_balance": 15.00,
    "completion_percentage": "35",
    "current_chapter": "5",
    "total_chapters": "9"
  }'
```

## Configuration

All settings in `mail-server/.env`:

```env
# Audiobook Platform Senders
EMAIL_LISTENING=listen@quantummint.net
EMAIL_CREATORS=creators@quantummint.net
EMAIL_LIBRARY=library@quantummint.net

# Pricing
AUDIO_RATE_PER_MINUTE=0.15
VIDEO_RATE_PER_MINUTE=0.25
```

## Documentation

- **API Reference:** `docs/EMAIL_WORKFLOWS.md`
- **Database Schema:** `migrations/001_quantummint_schema.sql`
- **Templates:** `src/templates/`

---

**QuantumMint Audiobook Platform** - Listen. Learn. Grow.
