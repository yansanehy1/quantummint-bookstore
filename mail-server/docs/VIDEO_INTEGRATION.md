# QuantumMint Video Integration

## Overview

QuantumMint supports both **audiobook** and **video** content with a unified pay-per-minute billing system. This document covers the video-specific email workflows and webhook integration.

## Video Content Types

| Content Type | Rate/Minute | Description |
|--------------|-------------|-------------|
| Standard Video | $0.25 | Educational videos, courses |
| Premium Video | $0.35 | High-quality productions, expert content |
| Live Streaming | $0.50 | Real-time instructor-led sessions |
| Interactive Video | $0.45 | Videos with quizzes, exercises, polls |

## Email Workflows

### 1. Video Session Summary

**Trigger:** Video viewing session ends (minimum 10 minutes)

**Endpoint:** `POST /api/webhooks/video/session-end`

**Template:** `learner/video-session-summary.html`

**Request Body:**
```json
{
  "user_id": "user_123",
  "user_email": "learner@example.com",
  "listener_name": "John Doe",
  "video_id": "video_456",
  "video_title": "Advanced JavaScript Patterns",
  "creator_name": "Jane Instructor",
  "category": "Programming",
  "thumbnail_url": "https://cdn.quantummint.net/thumbs/video_456.jpg",
  "minutes_watched": 45,
  "amount_deducted": 11.25,
  "remaining_balance": 25.00,
  "completion_percentage": 75,
  "average_quality": "1080p",
  "interactive_elements_completed": 3,
  "total_points": 150,
  "certificate_eligible": true,
  "estimated_minutes_remaining": 100
}
```

**Features:**
- Watch time and cost breakdown
- Quality metrics (720p, 1080p, 4K)
- Interactive elements completed (quizzes, polls)
- Certificate eligibility notification
- Wallet balance update
- Continue watching CTA

---

### 2. Certificate Awarded

**Trigger:** User completes required video content and earns certificate

**Endpoint:** `POST /api/webhooks/video/certificate-issued`

**Template:** `learner/certificate-awarded.html`

**Request Body:**
```json
{
  "user_email": "learner@example.com",
  "user_name": "John Doe",
  "video_id": "video_456",
  "video_title": "Advanced JavaScript Patterns",
  "creator_name": "Jane Instructor", 
  "certificate_id": "CERT-V456-U123-ABC123",
  "certificate_url": "https://cdn.quantummint.net/certs/CERT-V456-U123-ABC123.pdf",
  "verification_url": "https://quantum.quantummint.net/verify/CERT-V456-U123-ABC123",
  "issue_date": "2024-12-02",
  "completion_percentage": 95,
  "quiz_score": 85,
  "exercises_completed": 10,
  "social_share_urls": {
    "linkedin": "https://linkedin.com/...",
    "twitter": "https://twitter.com/...",
    "facebook": "https://facebook.com/..."
  }
}
```

**Features:**
- Certificate preview
- Download PDF link
- Verification URL
- Social sharing buttons (LinkedIn, Twitter, Facebook)
- Achievement metrics
- Learning path recommendations

---

### 3. Live Stream Starting

**Trigger:** Live stream is about to begin (sent to registered users)

**Endpoint:** `POST /api/webhooks/video/live-stream-starting`

**Template:** `learner/live-stream-starting.html`

**Request Body:**
```json
{
  "stream_id": "live_789",
  "title": "Real-Time Web Development Workshop",
  "creator_name": "Expert Developer",
  "start_time": "2024-12-02 14:00 EST",
  "duration_minutes": 90,
  "price_per_minute": 0.50,
  "preview_minutes": 5,
  "registered_users": [
    { "email": "user1@example.com", "name": "User One" },
    { "email": "user2@example.com", "name": "User Two" }
  ]
}
```

**Features:**
- Live badge with animation
- Free preview information
- Estimated total cost
- Join stream CTA
- Interactive features preview
- Wallet balance reminder

---

### 4. Video Upload Processed

**Trigger:** Creator's uploaded video finishes processing

**Endpoint:** `POST /api/webhooks/video/upload-processed`

**Request Body:**
```json
{
  "creator_email": "creator@example.com",
  "creator_name": "Jane Instructor",
  "video_id": "video_999",
  "title": "New Course Video",
  "processing_status": "completed", // or "failed"
  "error_message": null // or error details if failed
}
```

**Success Email:**
- Processing complete confirmation
- Edit video details link
- Next steps checklist
- Preview link

**Failure Email:**
- Error message display
- Retry instructions
- Support contact link

---

## Video Quality & Billing

### Quality Levels

| Quality | Resolution | Bitrate | Price Multiplier |
|---------|-----------|---------|------------------|
| 360p | 640×360 | 800 kbps | 0.8× |
| 480p | 854×480 | 1.2 Mbps | 1.0× |
| 720p | 1280×720 | 2.5 Mbps | 1.2× |
| 1080p | 1920×1080 | 5 Mbps | 1.5× |
| 4K | 3840×2160 | 16 Mbps | 2.0× |

### Billing Example

```javascript
// Standard video at 720p quality
const baseRate = 0.25; // $0.25/minute
const qualityMultiplier = 1.2; // 720p
const finalRate = baseRate * qualityMultiplier; // $0.30/minute

// 60 minutes of viewing
const cost = finalRate * 60; // $18.00
```

---

## Interactive Video Elements

### Supported Types

1. **Quizzes** - Knowledge checks with scoring
2. **Polls** - Real-time audience feedback
3. **Resources** - Downloadable materials
4. **Exercises** - Hands-on practice activities

### Certificate Requirements

- Minimum completion: 90% (configurable via `CERTIFICATE_MIN_COMPLETION`)
- Quiz score minimum: 70% (if applicable)
- All required exercises completed
- Maximum retry attempts: 3

---

## Live Streaming Features

### Configuration

```env
VIDEO_RATE_LIVE=0.50
LIVE_STREAM_MAX_DURATION=180  # 3 hours
LIVE_STREAM_PREVIEW_MINUTES=5
```

### Features

- **Free Preview:** First 5 minutes free for all attendees
- **Real-time Chat:** WebSocket-based messaging
- **Interactive Elements:** Polls, Q&A, reactions
- **Recording:** Automatic recording for replay
- **Certificates:** Available for attendees who watch 80%+

---

## Testing

### Test Video Session
```bash
curl -X POST http://localhost:8082/api/webhooks/video/session-end \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com",
    "listener_name": "Test User",
    "video_id": "test_video",
    "video_title": "Test Course",
    "creator_name": "Test Instructor",
    "minutes_watched": 30,
    "amount_deducted": 7.50,
    "remaining_balance": 20.00,
    "completion_percentage": 50,
    "average_quality": "1080p",
    "certificate_eligible": false
  }'
```

### Test Certificate Issuance
```bash
curl -X POST http://localhost:8082/api/webhooks/video/certificate-issued \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com",
    "user_name": "Test User",
    "video_title": "Advanced Course",
    "certificate_id": "TEST-CERT-001",
    "certificate_url": "https://example.com/cert.pdf",
    "verification_url": "https://quantum.quantummint.net/verify/TEST-CERT-001"
  }'
```

### Test Live Stream Notification
```bash
curl -X POST http://localhost:8082/api/webhooks/video/live-stream-starting \
  -H "Content-Type: application/json" \
  -d '{
    "stream_id": "test_stream",
    "title": "Live Workshop",
    "creator_name": "Expert",
    "price_per_minute": 0.50,
    "registered_users": [
      {"email": "test@example.com", "name": "Test User"}
    ]
  }'
```

---

## Database Schema

See `migrations/002_video_schema.sql` for:
- `video_chapters` - Chapter markers and timestamps
- `video_interactive_elements` - Quizzes, polls, exercises
- `video_playback_stats` - Quality metrics, buffering
- `video_certificates` - Issued certificates and verification

---

## Future Enhancements

### Phase 1 (Completed)
- ✅ Video session summaries
- ✅ Certificate system
- ✅ Live stream notifications
- ✅ Upload processing emails

### Phase 2 (Planned)
- [ ] Video recommendations based on viewing history
- [ ] Learning path progress emails
- [ ] Weekly video watch digest
- [ ] Creator video analytics reports

### Phase 3 (Planned)
- [ ] Video download for offline viewing notifications
- [ ] Collaborative watching invitations
- [ ] Video annotation sharing
- [ ] Integration with LMS platforms

---

## Support

For video-specific email issues:
- **Logs:** `mail-server/logs/mail-server.log`
- **Templates:** `mail-server/src/templates/learner/`
- **Webhooks:** `mail-server/src/api/webhooks/video-webhooks.js`
- **Documentation:** This file and `EMAIL_WORKFLOWS.md`

---

**QuantumMint Video Platform** - Learn through audio and video, pay by the minute.
