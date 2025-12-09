# Audiobook Certificates

## Overview

QuantumMint now supports **certificates of completion** for audiobook listeners! When users complete an audiobook (90% or higher), they can earn an official certificate recognizing their achievement.

## Features

- 🎧 **Audiobook Completion Certificates** - Awarded at 90%+ completion
- 📜 **Unique Certificate IDs** - Each certificate has a unique verification ID
- 🔗 **Social Sharing** - LinkedIn, Twitter, Facebook integration
- ✅ **Verification System** - Public certificate verification URLs
- 📊 **Listening Metrics** - Total time, chapters completed, streaks

## Certificate Eligibility

### Requirements

By default, users must meet these criteria:

- **Completion**: 90% or higher (configurable via `CERTIFICATE_MIN_COMPLETION`)
- **Listening Time**: Must have actually listened to the content (not fast-forwarded)
- **Unique**: Only one certificate per audiobook per user

### Configuration

```env
# In mail-server/.env
CERTIFICATE_MIN_COMPLETION=90  # Percentage required (default: 90)
```

## Workflow

### 1. Automatic Detection

When a user completes a listening session, the system checks eligibility:

```javascript
// In your application after tracking listening session
if (completionPercentage >= 90 && !userAlreadyHasCertificate) {
    // Issue certificate
    issueCertificate(userId, audiobookId);
}
```

### 2. Certificate Issuance

Your application should:

1. Generate a unique certificate ID (e.g., `CERT-AUD-USER123-BOOK456-TIMESTAMP`)
2. Create certificate PDF/image file
3. Upload to storage (S3, CDN, etc.)
4. Store in database
5. Call the webhook to send email notification

### 3. Email Notification

The webhook sends a beautiful certificate email with:

- Certificate preview
- Download link
- Verification URL
- Social sharing buttons
- Achievement metrics
- Recommendations for similar audiobooks

## API Reference

### Endpoint

```
POST /api/webhooks/wallet/audiobook-certificate-issued
```

### Request Body

```json
{
  "user_id": "user_123",
  "user_email": "listener@example.com",
  "listener_name": "John Doe",
  "audiobook_id": "audiobook_789",
  "audiobook_title": "Atomic Habits",
  "author_name": "James Clear",
  "narrator_name": "James Clear",
  "certificate_id": "CERT-AUD-U123-A789-20241202",
  "certificate_url": "https://cdn.quantummint.net/certs/CERT-AUD-U123-A789-20241202.pdf",
  "verification_url": "https://quantum.quantummint.net/verify/CERT-AUD-U123-A789-20241202",
  "issue_date": "2024-12-02",
  "completion_percentage": 95,
  "total_listening_minutes": 320,
  "listening_hours": "5.3",
  "chapters_completed": 22,
  "total_chapters": 22,
  "streak_days": 14,
  "social_share_urls": {
    "linkedin": "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Atomic%20Habits&organizationId=YOUR_ORG_ID&issueYear=2024&issueMonth=12&certUrl=https://quantum.quantummint.net/verify/CERT-AUD-U123-A789-20241202",
    "twitter": "https://twitter.com/intent/tweet?text=I%20just%20earned%20a%20certificate%20for%20completing%20%22Atomic%20Habits%22%20on%20@QuantumMint!&url=https://quantum.quantummint.net/verify/CERT-AUD-U123-A789-20241202",
    "facebook": "https://www.facebook.com/sharer/sharer.php?u=https://quantum.quantummint.net/verify/CERT-AUD-U123-A789-20241202"
  }
}
```

### Required Fields

- `user_email` - Recipient's email address
- `audiobook_title` - Title of the completed audiobook
- `certificate_id` - Unique certificate identifier

### Optional Fields

All other fields are optional but recommended for a better user experience.

### Response

**Success (200):**
```json
{
  "success": true,
  "message": "Audiobook certificate notification sent"
}
```

**Error (400/500):**
```json
{
  "success": false,
  "error": "Missing required fields: user_email, audiobook_title, certificate_id"
}
```

## Testing

### Test Certificate Issuance

```bash
curl -X POST http://localhost:8082/api/webhooks/wallet/audiobook-certificate-issued \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com",
    "listener_name": "Test User",
    "audiobook_title": "The Power of Habit",
    "author_name": "Charles Duhigg",
    "narrator_name": "Mike Chamberlain",
    "certificate_id": "TEST-CERT-001",
    "certificate_url": "https://example.com/cert.pdf",
    "verification_url": "https://quantum.quantummint.net/verify/TEST-CERT-001",
    "completion_percentage": 95,
    "total_listening_minutes": 450,
    "listening_hours": "7.5",
    "chapters_completed": 18,
    "total_chapters": 18
  }'
```

## Implementation Example

### Backend Certificate Issuance

```javascript
// Example: Issue audiobook certificate
async function issueAudiobookCertificate(userId, audiobookId, sessionData) {
    // 1. Check eligibility
    if (sessionData.completionPercentage < 90) {
        return { eligible: false, reason: 'Completion below 90%' };
    }
    
    // 2. Check if certificate already exists
    const existingCert = await db.query(
        'SELECT id FROM certificates WHERE user_id = ? AND content_id = ? AND content_type = ?',
        [userId, audiobookId, 'audio']
    );
    
    if (existingCert.length > 0) {
        return { eligible: false, reason: 'Certificate already issued' };
    }
    
    // 3. Generate certificate
    const certificateId = `CERT-AUD-${userId.substr(0,4)}-${audiobookId.substr(0,4)}-${Date.now()}`;
    const certificatePdf = await generateCertificatePDF({
        userId,
        audiobookId,
        certificateId,
        ...sessionData
    });
    
    // 4. Upload to S3/CDN
    const certificateUrl = await uploadToS3(certificatePdf, `certs/${certificateId}.pdf`);
    const verificationUrl = `https://quantum.quantummint.net/verify/${certificateId}`;
    
    // 5. Store in database
    await db.query(`
        INSERT INTO certificates (
            user_id, content_id, content_type, certificate_id, 
            certificate_url, verification_url, completion_percentage,
            total_listening_minutes, chapters_completed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        userId, audiobookId, 'audio', certificateId,
        certificateUrl, verificationUrl, sessionData.completionPercentage,
        sessionData.totalListeningMinutes, sessionData.chaptersCompleted
    ]);
    
    // 6. Send email notification via webhook
    await fetch('http://mail-server:8082/api/webhooks/wallet/audiobook-certificate-issued', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_email: sessionData.userEmail,
            listener_name: sessionData.userName,
            audiobook_title: sessionData.audiobookTitle,
            author_name: sessionData.authorName,
            narrator_name: sessionData.narratorName,
            certificate_id: certificateId,
            certificate_url: certificateUrl,
            verification_url: verificationUrl,
            completion_percentage: sessionData.completionPercentage,
            total_listening_minutes: sessionData.totalListeningMinutes,
            listening_hours: (sessionData.totalListeningMinutes / 60).toFixed(1),
            chapters_completed: sessionData.chaptersCompleted,
            total_chapters: sessionData.totalChapters,
            social_share_urls: generateSocialShareUrls(certificateId, sessionData.audiobookTitle)
        })
    });
    
    return { eligible: true, certificateId, certificateUrl };
}
```

### Social Share URL Generation

```javascript
function generateSocialShareUrls(certificateId, audiobookTitle) {
    const verifyUrl = `https://quantum.quantummint.net/verify/${certificateId}`;
    const encodedTitle = encodeURIComponent(audiobookTitle);
    const encodedUrl = encodeURIComponent(verifyUrl);
    
    return {
        linkedin: `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodedTitle}&organizationId=YOUR_ORG_ID&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certUrl=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=I%20just%20completed%20"${encodedTitle}"%20on%20@QuantumMint!&url=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    };
}
```

## Certificate Verification

You should implement a public verification page at:

```
https://quantum.quantummint.net/verify/{certificate_id}
```

This page should:
- Display certificate details
- Show completion metrics
- Confirm authenticity
- Allow download of certificate PDF
- Show user's achievement timeline

## Database Schema

The certificate is stored in the `certificates` table created in the migration:

```sql
SELECT 
    c.*,
    u.name as listener_name,
    u.email as listener_email,
    content.title as audiobook_title,
    content.author,
    content.narrator
FROM certificates c
JOIN users u ON c.user_id = u.id
JOIN content ON c.content_id = content.id
WHERE c.certificate_id = 'CERT-AUD-...'
AND c.content_type = 'audio';
```

## Analytics

Track certificate issuance:

```sql
-- Certificates issued today
SELECT COUNT(*) as certs_today
FROM certificates
WHERE DATE(issued_at) = CURRENT_DATE
AND content_type = 'audio';

-- Most completed audiobooks
SELECT 
    content.title,
    content.author,
    COUNT(certificates.id) as certificate_count
FROM certificates
JOIN content ON certificates.content_id = content.id
WHERE certificates.content_type = 'audio'
GROUP BY content.id
ORDER BY certificate_count DESC
LIMIT 10;

-- User engagement
SELECT 
    user_id,
    COUNT(*) as total_certificates,
    MIN(issued_at) as first_certificate,
    MAX(issued_at) as latest_certificate
FROM certificates
WHERE content_type = 'audio'
GROUP BY user_id;
```

## Best Practices

1. **Unique Certificates** - Ensure one certificate per audiobook per user
2. **Verify Listening** - Don't award certificates for fast-forwarded content
3. **PDF Generation** - Use quality templates (consider using Puppeteer, PDFKit, or external services)
4. **Storage** - Use CDN for certificate PDFs to ensure fast downloads
5. **Security** - Use cryptographic signatures to prevent certificate forgery
6. **Expiration** - Consider if certificates should expire (usually they shouldn't)
7. **Revocation** - Support revoking certificates if needed (fraud, etc.)

## Email Template

The certificate email includes:

- **Header**: Congratulatory message with audiobook and headphone emojis
- **Certificate Preview**: Visual representation of the certificate
- **Achievement Metrics**: Completion %, listening time, chapters, streaks
- **Download Button**: Direct link to certificate PDF
- **Verify Button**: Link to public verification page
- **Social Sharing**: One-click sharing to LinkedIn, Twitter, Facebook
- **Recommendations**: Similar audiobooks to continue learning
- **App Downloads**: Links to iOS and Android apps

## Support

For issues with audiobook certificates:
- Check logs: `mail-server/logs/mail-server.log`
- Template: `mail-server/src/templates/learner/audiobook-certificate-awarded.html`
- Webhook: `mail-server/src/api/webhooks/wallet-webhooks.js`
- Database: `certificates` table with `content_type = 'audio'`

---

**Celebrate Learning** - Every completed audiobook is an achievement worth recognizing! 🎧📚🏆
