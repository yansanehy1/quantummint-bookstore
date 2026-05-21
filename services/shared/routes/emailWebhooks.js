const express = require('express');
const cors = require('cors');
const emailService = require('../emailService');
const logger = require('../logger');
const { models } = require('../database');

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

        // Update user email status in database
        if (bounceType === 'hard') {
            await models.UserEmailPreference.update(
                { unsubscribed_at: new Date(), receives_marketing: false },
                { where: { email } }
            );
            logger.info(`Hard bounce received for ${email}. User unsubscribed.`);
        }

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

        // Update user preferences in database
        await models.UserEmailPreference.update(
            { unsubscribed_at: new Date(), receives_marketing: false },
            { where: { email } }
        );

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

        // Immediately unsubscribe user from all marketing emails
        await models.UserEmailPreference.update(
            { 
                unsubscribed_at: new Date(), 
                receives_marketing: false,
                receives_alerts: false,
                receives_newsletters: false 
            },
            { where: { email } }
        );

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
router.get('/unsubscribe', async (req, res) => {
    const { email, token } = req.query;

    try {
        // In production, we'd verify the token here
        if (email) {
            await models.UserEmailPreference.update(
                { unsubscribed_at: new Date(), receives_marketing: false },
                { where: { email } }
            );
        }

        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribe - QuantumMint Bookstore</title>
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
          <p>You have been unsubscribed from QuantumMint Bookstore marketing emails.</p>
          <p>You will still receive order confirmations and important account notifications.</p>
          <a href="https://quantum.quantummint.net" class="button">Return to QuantumMint Bookstore</a>
        </body>
        </html>
      `);
    } catch (error) {
        logger.error('Failed to process manual unsubscribe:', error);
        res.status(500).send('An error occurred during unsubscription.');
    }
});

/**
 * Email preferences page
 */
router.get('/preferences', async (req, res) => {
    const { email, token } = req.query;

    try {
        // Load user preferences
        const preferences = await models.UserEmailPreference.findOne({ where: { email } });
        
        if (!preferences) {
            return res.status(404).send('Preferences not found.');
        }

        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Email Preferences - QuantumMint Bookstore</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
            }
            h1 { color: #333; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; }
            .button {
              padding: 10px 20px;
              background: #007bff;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <h1>Manage Email Preferences</h1>
          <p>Preferences for: <strong>${email}</strong></p>
          <form action="/api/email/preferences" method="POST">
            <input type="hidden" name="email" value="${email}">
            <div class="form-group">
              <label><input type="checkbox" name="marketing" ${preferences.receives_marketing ? 'checked' : ''}> Receive Marketing Emails</label>
            </div>
            <div class="form-group">
              <label><input type="checkbox" name="newsletters" ${preferences.receives_newsletters ? 'checked' : ''}> Receive Weekly Newsletter</label>
            </div>
            <div class="form-group">
              <label><input type="checkbox" name="alerts" ${preferences.receives_alerts ? 'checked' : ''}> Receive Product Alerts</label>
            </div>
            <button type="submit" class="button">Save Preferences</button>
          </form>
        </body>
        </html>
      `);
    } catch (error) {
        logger.error('Failed to load preferences page:', error);
        res.status(500).send('An error occurred loading preferences.');
    }
});

module.exports = router;
