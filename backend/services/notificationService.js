const fetch = require('node-fetch');
const { main: logger } = require('../utils/logger');

const FROM_EMAIL = process.env.EMAIL_FROM || process.env.EMAIL || 'noreply@quantummint.net';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'QuantumMint Bookstore';
const PUSH_WEBHOOK_URL = process.env.PUSH_NOTIFICATION_WEBHOOK_URL || '';

async function sendEmail({ to, subject, html, text }) {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey || !to) {
        logger.warn(`[Notification] Email skipped (no SENDGRID_API_KEY or recipient): ${subject}`);
        return { sent: false, reason: 'not_configured' };
    }

    try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{ to: [{ email: to }] }],
                from: { email: FROM_EMAIL, name: FROM_NAME },
                subject,
                content: [
                    { type: 'text/plain', value: text || subject },
                    { type: 'text/html', value: html || `<p>${text || subject}</p>` },
                ],
            }),
        });

        if (!response.ok) {
            const body = await response.text();
            throw new Error(`SendGrid HTTP ${response.status}: ${body}`);
        }

        logger.info(`[Notification] Email sent: "${subject}" → ${to}`);
        return { sent: true };
    } catch (err) {
        logger.error(`[Notification] Email failed: ${err.message}`);
        return { sent: false, reason: err.message };
    }
}

async function sendPush({ userId, title, body, data = {} }) {
    if (!PUSH_WEBHOOK_URL) {
        logger.info(`[Notification] Push (webhook not configured): ${title} → user ${userId}`);
        return { sent: false, reason: 'not_configured' };
    }

    try {
        const response = await fetch(PUSH_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, title, body, data }),
        });

        if (!response.ok) {
            throw new Error(`Push webhook HTTP ${response.status}`);
        }

        logger.info(`[Notification] Push sent: "${title}" → user ${userId}`);
        return { sent: true };
    } catch (err) {
        logger.error(`[Notification] Push failed: ${err.message}`);
        return { sent: false, reason: err.message };
    }
}

async function notifySubscriptionLowBalance({ user, planId, requiredAmount, currency }) {
    const subject = 'Subscription renewal failed — low balance';
    const text = `Hi ${user.name || 'there'},\n\nWe could not auto-renew your "${planId}" subscription because your ${currency} wallet balance is below ${requiredAmount}. Please top up your wallet to continue access.\n\n— QuantumMint`;
    const html = `<p>Hi ${user.name || 'there'},</p><p>We could not auto-renew your <strong>${planId}</strong> subscription because your <strong>${currency}</strong> wallet balance is below <strong>${requiredAmount}</strong>.</p><p>Please top up your wallet to continue access.</p><p>— QuantumMint</p>`;

    await Promise.all([
        sendEmail({ to: user.email, subject, text, html }),
        sendPush({
            userId: user.id,
            title: 'Low balance — subscription not renewed',
            body: `Add funds to renew your ${planId} plan.`,
            data: { type: 'subscription_low_balance', planId },
        }),
    ]);
}

async function notifySubscriptionExpired({ user, planId }) {
    const subject = 'Your subscription has expired';
    const text = `Hi ${user.name || 'there'},\n\nYour "${planId}" subscription has expired. Visit QuantumMint to renew and restore full access.\n\n— QuantumMint`;
    const html = `<p>Hi ${user.name || 'there'},</p><p>Your <strong>${planId}</strong> subscription has expired.</p><p><a href="${process.env.FRONTEND_URL || 'https://quantummint.net'}/subscriptions">Renew now</a> to restore full access.</p><p>— QuantumMint</p>`;

    await Promise.all([
        sendEmail({ to: user.email, subject, text, html }),
        sendPush({
            userId: user.id,
            title: 'Subscription expired',
            body: `Your ${planId} plan has ended. Renew to continue.`,
            data: { type: 'subscription_expired', planId },
        }),
    ]);
}

module.exports = {
    sendEmail,
    sendPush,
    notifySubscriptionLowBalance,
    notifySubscriptionExpired,
};
