const express = require('express');
const cors = require('cors');
const emailService = require('../shared/emailService');
const logger = require('../shared/logger');

const router = express.Router();

router.use(cors());
router.use(express.json());

/**
 * Webhook: Email Opened
 * Triggered when recipient opens an email
 */
router.post('/open', async (req, res) => {
    try {
        const { email, messageId, timestamp, event } = req.body;

        await emailService.trackEvent('email_opened', {
            email,
            messageId,
            timestamp: timestamp || Date.now(),
            event
        });

        logger.info('Email opened', { email, messageId });
        res.status(200).json({ success: true });
    } catch (error) {
        logger.error('Failed to process email open webhook:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Webhook: Email Clicked
 * Triggered when recipient clicks a link in email
 */
router.post('/click', async (req, res) => {
    try {
        const { email, messageId, url, timestamp, event } = req.body;

        await emailService.trackEvent('email_clicked', {
            email,
            messageId,
            url,
            timestamp: timestamp || Date.now(),
            event
        });

        logger.info('Email link clicked', { email, messageId, url });
        res.status(200).json({ success: true });
    } catch (error) {
        logger.error('Failed to process email click webhook:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Webhook: Email Bounced
 * Triggered when email cannot be delivered
 */
router.post('/bounce', async (req, res) => {
    try {
        const { email, messageId, reason, bounceType, timestamp } = req.body;

        await emailService.trackEvent('email_bounced', {
            email,
            messageId,
            reason,
            bounceType,
            timestamp: timestamp || Date.now()
        });

        // TODO: Update user email status in database
        // If hard bounce, mark email as invalid
        // If soft bounce, increment bounce counter

        logger.warn('Email bounced', { email, messageId, reason, bounceType });
        res.status(200).json({ success: true });
    } catch (error) {
        logger.error('Failed to process email bounce webhook:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Webhook: Unsubscribe
 * Triggered when recipient unsubscribes
 */
router.post('/unsubscribe', async (req, res) => {
    try {
        const { email, messageId, timestamp } = req.body;

        await emailService.trackEvent('email_unsubscribed', {
            email,
            messageId,
            timestamp: timestamp || Date.now()
        });

        // TODO: Update user preferences in database
        // Mark user as unsubscribed from marketing emails

        logger.info('User unsubscribed', { email });
        res.status(200).json({ success: true });
    } catch (error) {
        logger.error('Failed to process unsubscribe webhook:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Webhook: Spam Report
 * Triggered when recipient marks email as spam
 */
router.post('/spam', async (req, res) => {
    try {
        const { email, messageId, timestamp } = req.body;

        await emailService.trackEvent('email_spam_report', {
            email,
            messageId,
            timestamp: timestamp || Date.now()
        });

        // TODO: Immediately unsubscribe user from all marketing emails

        logger.warn('Email marked as spam', { email, messageId });
        res.status(200).json({ success: true });
    } catch (error) {
        logger.error('Failed to process spam report webhook:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Public endpoint: Unsubscribe from emails
 * Accessible via link in email footer
 */
router.get('/unsubscribe', (req, res) => {
    const { email, token } = req.query;

    // TODO: Verify token, update preferences, show confirmation page

    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Unsubscribe - Sierra Books</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          text-align: center;
        }
        h1 { color: #333; }
        p { color: #666; line-height: 1.6; }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <h1>Successfully Unsubscribed</h1>
      <p>You have been unsubscribed from Sierra Books marketing emails.</p>
      <p>You will still receive order confirmations and important account notifications.</p>
      <a href="https://quantum.quantummint.net" class="button">Return to Sierra Books</a>
    </body>
    </html>
  `);
});

/**
 * Email preferences page
 */
router.get('/preferences', (req, res) => {
    const { email, token } = req.query;

    // TODO: Verify token, load user preferences

    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email Preferences - Sierra Books</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
        }
        h1 { color: #333; }
        .preference {
          margin: 15px 0;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        input[type="checkbox"] {
          margin-right: 10px;
        }
        .button {
          padding: 12px 24px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <h1>Email Preferences</h1>
      <form action="/api/email/preferences" method="POST">
        <div class="preference">
          <label>
            <input type="checkbox" name="newsletter" checked>
            Monthly Newsletter - Book recommendations and new arrivals
          </label>
        </div>
        <div class="preference">
          <label>
            <input type="checkbox" name="promotions" checked>
            Promotional Emails - Special offers and discounts
          </label>
        </div>
        <div class="preference">
          <label>
            <input type="checkbox" name="backInStock" checked>
            Back in Stock Alerts - For wishlisted items
          </label>
        </div>
        <div class="preference">
          <label>
            <input type="checkbox" name="priceDrops" checked>
            Price Drop Alerts - For wishlisted items
          </label>
        </div>
        <div class="preference">
          <label>
            <input type="checkbox" name="recommendations" checked>
            Personalized Recommendations
          </label>
        </div>
        <p><small>Note: Order confirmations and account notifications cannot be disabled.</small></p>
        <button type="submit" class="button">Save Preferences</button>
      </form>
    </body>
    </html>
  `);
});

module.exports = router;
