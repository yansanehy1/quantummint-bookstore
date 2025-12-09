# Audiobook Certificate Test

## Quick Test

```bash
curl -X POST http://localhost:8082/api/webhooks/wallet/audiobook-certificate-issued \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com",
    "listener_name": "Test Listener",
    "audiobook_id": "audiobook_123",
    "audiobook_title": "Atomic Habits",
    "author_name": "James Clear",
    "narrator_name": "James Clear",
    "certificate_id": "CERT-AUD-TEST-001",
    "certificate_url": "https://cdn.quantummint.net/certs/CERT-AUD-TEST-001.pdf",
    "verification_url": "https://quantum.quantummint.net/verify/CERT-AUD-TEST-001",
    "issue_date": "2024-12-02",
    "completion_percentage": 95,
    "total_listening_minutes": 320,
    "listening_hours": "5.3",
    "chapters_completed": 18,
    "total_chapters": 18,
    "streak_days": 7,
    "social_share_urls": {
      "linkedin": "https://www.linkedin.com/profile/add?...",
      "twitter": "https://twitter.com/intent/tweet?...",
      "facebook": "https://www.facebook.com/sharer/sharer.php?..."
    }
  }'
```

## Expected Response

```json
{
  "success": true,
  "message": "Audiobook certificate notification sent"
}
```

## Email Content

The user will receive an email with:
- 🎧📚 Congratulatory header
- Certificate preview with:
  - Listener name
  - Audiobook title & author
  - Narrator (if provided)
  - Certificate ID
  - Issue date
  - Listening hours
- Achievement metrics:
  - Completion percentage
  - Total listening time
  - Chapters completed (if provided)
  - Listening streak (if provided)
- Download certificate button
- Verification link
- Social sharing buttons (LinkedIn, Twitter, Facebook)
- Similar audiobook recommendations
- App download links

## Files Created

- **Template**: `mail-server/src/templates/learner/audiobook-certificate-awarded.html`
- **Webhook**: Added to `mail-server/src/api/webhooks/wallet-webhooks.js`
- **Documentation**: `mail-server/docs/AUDIOBOOK_CERTIFICATES.md`
- **Health Check**: Updated in `mail-server/src/api/webhooks/index.js`

## Next Steps

1. **Generate Certificates** - Your application should generate certificate PDFs when users complete audiobooks
2. **Store Certificates** - Save to database and upload PDFs to CDN
3. **Call Webhook** - Trigger this endpoint to send the email
4. **Verification Page** - Create a public page at `/verify/{certificate_id}` to validate certificates

See `AUDIOBOOK_CERTIFICATES.md` for full implementation guide!
