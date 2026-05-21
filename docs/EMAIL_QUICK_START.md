# QuantumMint Bookstore Email System - Quick Start Guide
...
This guide will help you get the QuantumMint Bookstore email system up and running.

## Prerequisites
- SendGrid account (for transactional emails)
- Mailchimp account (for marketing emails - optional)
- Access to DNS management for quantummint.net

## Step 1: Configure DNS Records

Follow the instructions in [DNS_CONFIGURATION.md](./DNS_CONFIGURATION.md) to set up:
- SPF record
- DKIM records (via SendGrid/Mailchimp)
- DMARC record
- MX records

**Verification**: Wait 24-48 hours for DNS propagation, then verify at https://mxtoolbox.com/

## Step 2: Set Up Email Service Providers

### SendGrid Setup
1. Create account at https://sendgrid.com
2. Navigate to Settings → API Keys
3. Create new API key with "Full Access"
4. Save the API key to `.env` as `SENDGRID_API_KEY`

### Domain Authentication
1. Go to Settings → Sender Authentication
2. Click "Authenticate Your Domain"
3. Enter `quantummint.net`
4. Follow instructions to add DNS records
5. Verify domain

### Create Email Templates
1. Navigate to Email API → Dynamic Templates
2. Create templates for each email type (see template list below)
3. Save template IDs to `.env` (e.g., `SENDGRID_TEMPLATE_ORDER_CONFIRM_01=d-xxxxx`)

## Step 3: Configure Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
# Email Service
SENDGRID_API_KEY=SG.your_api_key_here
MAILCHIMP_API_KEY=your_mailchimp_key_here
MAILCHIMP_SERVER=us1
MAILCHIMP_LIST_ID=your_list_id

# Template IDs (from SendGrid)
SENDGRID_TEMPLATE_WELCOME_BOOKSTORE_01=d-xxxxx
SENDGRID_TEMPLATE_ORDER_CONFIRM_01=d-xxxxx
# ... add all template IDs
```

## Step 4: Initialize Email Service

In your main application file (e.g., `bookstore-api/server.js`):

```javascript
const emailService = require('../shared/emailService');
const emailAutomation = require('../shared/middleware/emailAutomation');

// Initialize email service on startup
async function startServer() {
  await emailService.initialize();
  
  // ... rest of your server startup code
}

startServer();
```

## Step 5: Integrate Email Automation

Add email hooks to your business logic:

### User Registration
```javascript
const emailAutomation = require('../shared/middleware/emailAutomation');

router.post('/api/auth/register', async (req, res) => {
  const user = await createUser(req.body);
  
  // Trigger welcome email
  await emailAutomation.onUserRegistered(user);
  
  res.json({ success: true, user });
});
```

### Order Placed
```javascript
router.post('/api/orders', async (req, res) => {
  const order = await createOrder(req.body);
  
  // Trigger order confirmation
  await emailAutomation.onOrderPlaced(order);
  
  res.json({ success: true, order });
});
```

### Order Shipped
```javascript
router.put('/api/orders/:id/ship', async (req, res) => {
  const order = await updateOrderStatus(req.params.id, 'shipped');
  const trackingInfo = req.body.trackingInfo;
  
  // Trigger shipping notification
  await emailAutomation.onOrderShipped(order, trackingInfo);
  
  res.json({ success: true, order });
});
```

## Step 6: Register Webhook Endpoints

Add email webhook routes to your API:

```javascript
const emailWebhooks = require('../shared/routes/emailWebhooks');

app.use('/api/email', emailWebhooks);
```

### Configure SendGrid Webhooks
1. Go to Settings → Mail Settings → Event Webhook
2. Set HTTP Post URL: `https://quantum.quantummint.net/api/email/open`
3. Select events to track: Opened, Clicked, Bounced, Unsubscribed
4. Enable webhook

## Step 7: Testing

### Test Individual Emails
```javascript
const emailService = require('../shared/emailService');

// Test welcome email
await emailService.sendWelcomeEmail({
  email: 'test@example.com',
  firstName: 'Test'
});

// Test order confirmation
await emailService.sendOrderConfirmation({
  customerEmail: 'test@example.com',
  orderNumber: 'TEST-001',
  items: [{ title: 'Test Book', quantity: 1, price: 19.99 }],
  total: 19.99
});
```

### Check Email Delivery
1. Send test emails to your inbox
2. Verify they arrive and look correct
3. Test all links work
4. Check mobile responsiveness
5. Test spam score at https://www.mail-tester.com/

## Email Templates to Create in SendGrid

Create the following dynamic templates in SendGrid:

### Customer Journey
1. `WELCOME_BOOKSTORE_01` - Welcome email with discount code
2. `ORDER_CONFIRM_01` - Order confirmation
3. `ORDER_SHIPPED` - Shipping notification
4. `ORDER_OUT_FOR_DELIVERY` - Out for delivery
5. `ORDER_DELIVERED` - Delivery confirmation

### Abandoned Cart
6. `CART_ABANDONED_1H` - 1 hour after abandonment
7. `CART_ABANDONED_24H` - 24 hours after abandonment
8. `CART_ABANDONED_72H` - 72 hours after abandonment

### Inventory Alerts
9. `BACK_IN_STOCK` - Product back in stock
10. `PRICE_DROP` - Price drop alert
11. `PREORDER_REMINDER` - Pre-order reminder

### Support & Reviews
12. `SUPPORT_TICKET` - Support ticket confirmation
13. `REVIEW_REQUEST_01` - Review request

### Loyalty & Marketing
14. `POINTS_EARNED` - Loyalty points earned
15. `TIER_UPGRADE` - Loyalty tier upgrade
16. `MONTHLY_NEWSLETTER` - Monthly newsletter
17. `RECOMMENDATIONS` - Personalized recommendations

### Re-engagement
18. `INACTIVE_30_DAYS` - 30 days inactive
19. `INACTIVE_90_DAYS` - 90 days inactive
20. `INACTIVE_180_DAYS` - 180 days inactive

## Template Variables

Each template should include these standard variables:

```handlebars
{{firstName}} - User's first name
{{platformUrl}} - https://quantum.quantummint.net
{{unsubscribeUrl}} - Unsubscribe link
{{companyAddress}} - Physical address
{{preferencesUrl}} - Email preferences link
```

## Monitoring

### View Email Analytics
- SendGrid: Stats → Overview
- Check open rates, click rates, bounce rates
- Review spam reports

### Set Up Alerts
Monitor these metrics daily:
- Bounce rate > 5% → Investigate email list quality
- Unsubscribe rate > 2% → Review email content/frequency
- Open rate < 15% → Improve subject lines

## Troubleshooting

### Emails Not Sending
1. Check `SENDGRID_API_KEY` is set correctly
2. Verify email service initialized: check logs for "Email Service initialized"
3. Check SendGrid activity log for errors

### Emails Going to Spam
1. Verify DNS records are correct (SPF, DKIM, DMARC)
2. Test spam score at mail-tester.com
3. Warm up IP gradually (start with small volumes)
4. Ensure unsubscribe link is present

### Template Errors
1. Verify template ID is correct in `.env`
2. Check all dynamic variables are provided
3. Test template in SendGrid preview

## Next Steps

1. **Week 1**: Set up foundation (DNS, accounts, basic templates)
2. **Week 2**: Implement automation (abandoned cart, order emails)
3. **Week 3**: Add marketing (newsletter, recommendations)
4. **Week 4**: Optimize (A/B testing, analytics dashboard)

## Support Resources

- **SendGrid Docs**: https://docs.sendgrid.com
- **Mailchimp Docs**: https://mailchimp.com/developer
- **Email Testing**: https://www.mail-tester.com
- **DNS Verification**: https://mxtoolbox.com

## Contact

For email system support:
- **Email**: admin@quantummint.net
- **Internal Documentation**: See `docs/` folder
