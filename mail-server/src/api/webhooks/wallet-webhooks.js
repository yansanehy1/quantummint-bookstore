// Wallet Transaction Webhooks for QuantumMint
// Handles wallet top-ups, deductions, auto-top ups, and balance alerts

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// Email sending utility (uses existing mail server functionality)
const { sendEmail } = require('../utils/email-sender');
const { main: logger } = require('../utils/logger');

// Rate limiting for low balance alerts (24 hour cooldown)
const lowBalanceAlerts = new Map();

/**
 * POST /api/webhooks/wallet/topup
 * Handle wallet top-up transactions
 */
router.post('/topup', async (req, res) => {
    try {
        const {
            user_id,
            user_email,
            learner_name,
            amount,
            currency = 'USD',
            transaction_id,
            payment_method,
            new_balance,
            rate_per_minute = 0.10
        } = req.body;

        // Validate required fields
        if (!user_id || !user_email || !amount || !transaction_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Calculate estimated reading time
        const estimated_minutes = Math.floor(new_balance / rate_per_minute);

        // Load and render template
        const templatePath = path.join(__dirname, '../templates/learner/wallet-topup-confirmation.html');
        let template = await fs.readFile(templatePath, 'utf-8');

        // Replace template variables
        const data = {
            learner_name: learner_name || 'Learner',
            amount: `$${amount.toFixed(2)}`,
            currency,
            transaction_id,
            payment_method,
            new_balance: `$${new_balance.toFixed(2)}`,
            date: new Date().toLocaleString(),
            rate_per_minute: `$${rate_per_minute.toFixed(2)}`,
            estimated_minutes
        };

        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regex, data[key]);
        });

        // Send email
        await sendEmail({
            from: process.env.EMAIL_ACCOUNTS || 'accounts@quantummint.net',
            to: user_email,
            subject: '💰 Wallet Recharged Successfully',
            html: template
        });

        logger.info(`Wallet top-up confirmation sent to ${user_email}`);

        res.json({ success: true, message: 'Top-up confirmation sent' });

    } catch (error) {
        logger.error('Wallet top-up webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/webhooks/wallet/deduct
 * Handle reading session wallet deductions
 */
router.post('/deduct', async (req, res) => {
    try {
        const {
            user_id,
            user_email,
            learner_name,
            content_id,
            content_title,
            minutes_used,
            amount_deducted,
            remaining_balance,
            rate_per_minute = 0.10,
            total_time_today
        } = req.body;

        // Only send summary if session > 5 minutes
        if (minutes_used >= 5) {
            const estimated_minutes_left = Math.floor(remaining_balance / rate_per_minute);

            const templatePath = path.join(__dirname, '../templates/learner/reading-summary.html');
            let template = await fs.readFile(templatePath, 'utf-8');

            const data = {
                learner_name: learner_name || 'Learner',
                content_title: content_title || 'Learning Content',
                content_id,
                minutes: minutes_used,
                amount_deducted: `$${amount_deducted.toFixed(2)}`,
                remaining_balance: `$${remaining_balance.toFixed(2)}`,
                estimated_minutes_left,
                total_time_today: total_time_today || `${minutes_used} minutes`
            };

            Object.keys(data).forEach(key => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                template = template.replace(regex, data[key]);
            });

            await sendEmail({
                from: process.env.EMAIL_READING || 'reading@quantummint.net',
                to: user_email,
                subject: `📚 Reading Session Complete - ${content_title}`,
                html: template
            });

            logger.info(`Reading summary sent to ${user_email}`);
        }

        // Check for low balance (< $1.00 = 10 minutes)
        if (remaining_balance < 1.00) {
            await checkAndSendLowBalanceAlert(user_id, user_email, learner_name, remaining_balance, rate_per_minute);
        }

        res.json({ success: true, message: 'Reading session processed' });

    } catch (error) {
        logger.error('Wallet deduction webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/webhooks/wallet/autotopup
 * Handle automatic wallet top-ups
 */
router.post('/autotopup', async (req, res) => {
    try {
        const {
            user_id,
            user_email,
            learner_name,
            amount,
            threshold,
            new_balance,
            rate_per_minute = 0.10
        } = req.body;

        const estimated_minutes = Math.floor(new_balance / rate_per_minute);

        // Simple template rendering for auto-topup
        const emailContent = `
            <p>Hi ${learner_name},</p>
            <p>Your QuantumMint wallet has been automatically recharged.</p>
            <p><strong>Amount Added:</strong> $${amount.toFixed(2)}</p>
            <p><strong>Triggered at:</strong> $${threshold.toFixed(2)}</p>
            <p><strong>New Balance:</strong> $${new_balance.toFixed(2)}</p>
            <p>You now have approximately ${estimated_minutes} minutes of reading time.</p>
            <p><a href="https://quantummint.net/wallet/settings">Manage Auto-Top Up Settings</a></p>
        `;

        await sendEmail({
            from: process.env.EMAIL_ACCOUNTS || 'accounts@quantummint.net',
            to: user_email,
            subject: '🔄 Auto-Top Up Completed',
            html: emailContent
        });

        logger.info(`Auto top-up confirmation sent to ${user_email}`);

        res.json({ success: true, message: 'Auto top-up confirmation sent' });

    } catch (error) {
        logger.error('Auto top-up webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Check and send low balance alert with rate limiting
 */
async function checkAndSendLowBalanceAlert(user_id, user_email, learner_name, balance, rate_per_minute) {
    const now = Date.now();
    const lastAlert = lowBalanceAlerts.get(user_id);
    const cooldown = 24 * 60 * 60 * 1000; // 24 hours

    // Rate limit: only send one alert per 24 hours
    if (lastAlert && (now - lastAlert) < cooldown) {
        logger.info(`Low balance alert skipped for user ${user_id} (rate limited)`);
        return;
    }

    try {
        const minutes_left = Math.floor(balance / rate_per_minute);

        const templatePath = path.join(__dirname, '../templates/learner/low-balance-alert.html');
        let template = await fs.readFile(templatePath, 'utf-8');

        const data = {
            learner_name: learner_name || 'Learner',
            balance: `$${balance.toFixed(2)}`,
            minutes_left,
            auto_topup_threshold: '$1.00'
        };

        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regex, data[key]);
        });

        await sendEmail({
            from: process.env.EMAIL_ACCOUNTS || 'accounts@quantummint.net',
            to: user_email,
            subject: '⚠️ Low Wallet Balance Alert',
            html: template
        });

        // Update last alert timestamp
        lowBalanceAlerts.set(user_id, now);

        logger.info(`Low balance alert sent to ${user_email}`);

    } catch (error) {
        logger.error('Low balance alert error:', error);
    }
}

/**
 * POST /api/webhooks/wallet/audiobook-certificate-issued
 * Handle audiobook completion certificate issuance
 */
router.post('/audiobook-certificate-issued', async (req, res) => {
    try {
        const {
            user_email,
            listener_name,
            audiobook_id,
            audiobook_title,
            author_name,
            narrator_name,
            certificate_id,
            certificate_url,
            verification_url,
            issue_date,
            completion_percentage,
            total_listening_minutes,
            listening_hours,
            chapters_completed,
            total_chapters,
            streak_days,
            social_share_urls
        } = req.body;

        if (!user_email || !audiobook_title || !certificate_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: user_email, audiobook_title, certificate_id'
            });
        }

        const templatePath = path.join(__dirname, '../templates/learner/audiobook-certificate-awarded.html');
        let template = await fs.readFile(templatePath, 'utf-8');

        const hours = listening_hours || (total_listening_minutes ? (total_listening_minutes / 60).toFixed(1) : '0');

        const data = {
            listener_name: listener_name || 'Learner',
            audiobook_title,
            audiobook_id: audiobook_id || '',
            author_name: author_name || 'Unknown Author',
            narrator_name: narrator_name || '',
            certificate_id,
            certificate_url,
            verification_url,
            issue_date: issue_date || new Date().toLocaleDateString(),
            completion_percentage: completion_percentage || '100',
            total_listening_minutes: total_listening_minutes || '0',
            listening_hours: hours,
            chapters_completed: chapters_completed || '',
            total_chapters: total_chapters || '',
            streak_days: streak_days || '',
            'social_share_urls.linkedin': social_share_urls?.linkedin || '#',
            'social_share_urls.twitter': social_share_urls?.twitter || '#',
            'social_share_urls.facebook': social_share_urls?.facebook || '#'
        };

        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regex, data[key]);
        });

        // Handle conditional sections
        if (narrator_name) {
            template = template.replace(/{{#if narrator_name}}/g, '');
        } else {
            template = template.replace(/{{#if narrator_name}}[\s\S]*?{{\/if}}/g, '');
        }

        if (chapters_completed) {
            template = template.replace(/{{#if chapters_completed}}/g, '');
        } else {
            template = template.replace(/{{#if chapters_completed}}[\s\S]*?{{\/if}}/g, '');
        }

        if (streak_days) {
            template = template.replace(/{{#if streak_days}}/g, '');
        } else {
            template = template.replace(/{{#if streak_days}}[\s\S]*?{{\/if}}/g, '');
        }

        template = template.replace(/{{\/if}}/g, '');

        await sendEmail({
            from: process.env.EMAIL_LIBRARY || 'library@quantummint.net',
            to: user_email,
            subject: `🎧 Audiobook Certificate Earned: ${audiobook_title}`,
            html: template
        });

        logger.info(`Audiobook certificate notification sent to ${user_email} for ${audiobook_title}`);

        res.json({ success: true, message: 'Audiobook certificate notification sent' });

    } catch (error) {
        logger.error('Audiobook certificate webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
