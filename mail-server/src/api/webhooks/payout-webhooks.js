// Payout Webhooks for QuantumMint Educators
// Handles withdrawal requests, payout completions, and earnings notifications

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

const { sendEmail } = require('../utils/email-sender');
const { main: logger } = require('../utils/logger');

/**
 * POST /api/webhooks/payout/request
 * Handle educator withdrawal/payout requests
 */
router.post('/request', async (req, res) => {
    try {
        const {
            educator_id,
            educator_email,
            educator_name,
            requested_amount,
            platform_fee_percentage = 15,
            transaction_fee = 0.25,
            payment_method,
            estimated_arrival_days = 5
        } = req.body;

        if (!educator_id || !educator_email || !requested_amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Calculate fees
        const platform_fee = requested_amount * (platform_fee_percentage / 100);
        const net_amount = requested_amount - platform_fee - transaction_fee;

        const arrival_date = new Date();
        arrival_date.setDate(arrival_date.getDate() + estimated_arrival_days);

        // Simple email template
        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #8B5CF6; color: white; padding: 30px; text-align: center;">
                    <h1>🏧 Withdrawal Request Received</h1>
                </div>
                <div style="padding: 30px;">
                    <p>Hi <strong>${educator_name}</strong>,</p>
                    <p>We've received your withdrawal request and are processing it.</p>
                    
                    <div style="background: #f5f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>💰 Payout Details</h3>
                        <p><strong>Requested Amount:</strong> $${requested_amount.toFixed(2)}</p>
                        <p><strong>Platform Fee (${platform_fee_percentage}%):</strong> -$${platform_fee.toFixed(2)}</p>
                        <p><strong>Transaction Fee:</strong> -$${transaction_fee.toFixed(2)}</p>
                        <hr>
                        <p style="font-size: 18px;"><strong>Net Payout:</strong> $${net_amount.toFixed(2)}</p>
                        <p><strong>Payment Method:</strong> ${payment_method}</p>
                        <p><strong>Est. Arrival:</strong> ${arrival_date.toLocaleDateString()}</p>
                    </div>
                    
                    <p style="font-size: 13px; color: #666;">
                        Status: <strong>Pending → Processing → Completed</strong><br>
                        You'll receive another email when the payout is completed.
                    </p>
                    
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="https://quantummint.net/educator/payouts" 
                           style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                            View Payout Status
                        </a>
                    </p>
                </div>
            </div>
        `;

        await sendEmail({
            from: process.env.EMAIL_PAYOUTS || 'payouts@quantummint.net',
            to: educator_email,
            subject: '🏧 Withdrawal Request Received',
            html: emailContent
        });

        logger.info(`Payout request confirmation sent to ${educator_email}`);

        res.json({
            success: true,
            net_amount,
            message: 'Payout request confirmation sent'
        });

    } catch (error) {
        logger.error('Payout request webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/webhooks/payout/complete
 * Handle completed payout notifications
 */
router.post('/complete', async (req, res) => {
    try {
        const {
            educator_id,
            educator_email,
            educator_name,
            amount,
            transaction_id,
            payment_method,
            completed_date
        } = req.body;

        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #10b981; color: white; padding: 30px; text-align: center;">
                    <h1>✅ Payout Completed</h1>
                </div>
                <div style="padding: 30px;">
                    <p>Hi <strong>${educator_name}</strong>,</p>
                    <p>Great news! Your payout has been successfully processed.</p>
                    
                    <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981;">
                        <p><strong>Amount Paid:</strong> <span style="font-size: 24px; color: #10b981;">$${amount.toFixed(2)}</span></p>
                        <p><strong>Transaction ID:</strong> ${transaction_id}</p>
                        <p><strong>Payment Method:</strong> ${payment_method}</p>
                        <p><strong>Date Completed:</strong> ${completed_date || new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <p>The funds should appear in your account within 1-2 business days.</p>
                    
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="https://quantummint.net/educator/payouts" 
                           style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                            View Transaction History
                        </a>
                    </p>
                </div>
            </div>
        `;

        await sendEmail({
            from: process.env.EMAIL_PAYOUTS || 'payouts@quantummint.net',
            to: educator_email,
            subject: '✅ Payout Completed Successfully',
            html: emailContent
        });

        logger.info(`Payout completion notification sent to ${educator_email}`);

        res.json({ success: true, message: 'Payout completion notification sent' });

    } catch (error) {
        logger.error('Payout completion webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/webhooks/earnings/daily
 * Send daily earnings notifications
 */
router.post('/daily', async (req, res) => {
    try {
        const {
            educator_id,
            educator_email,
            educator_name,
            period_start,
            period_end,
            total_minutes,
            earnings_per_minute,
            gross_amount,
            platform_fee_percentage = 15,
            transaction_fee = 0.25,
            available_balance
        } = req.body;

        // Only send if there are earnings
        if (total_minutes <= 0 || gross_amount <= 0) {
            return res.json({ success: true, message: 'No earnings to report' });
        }

        const platform_fee = gross_amount * (platform_fee_percentage / 100);
        const net_amount = gross_amount - platform_fee - transaction_fee;

        const templatePath = path.join(__dirname, '../templates/educator/daily-earnings.html');
        let template = await fs.readFile(templatePath, 'utf-8');

        const data = {
            educator_name: educator_name || 'Educator',
            period_start: period_start || new Date().toLocaleDateString(),
            period_end: period_end || new Date().toLocaleDateString(),
            total_minutes,
            earnings_per_minute: `$${earnings_per_minute.toFixed(3)}`,
            gross_amount: `$${gross_amount.toFixed(2)}`,
            platform_fee_percentage: `${platform_fee_percentage}%`,
            platform_fee: `$${platform_fee.toFixed(2)}`,
            transaction_fee: `$${transaction_fee.toFixed(2)}`,
            net_amount: `$${net_amount.toFixed(2)}`,
            available_balance: `$${available_balance.toFixed(2)}`
        };

        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regex, data[key]);
        });

        await sendEmail({
            from: process.env.EMAIL_PAYOUTS || 'payouts@quantummint.net',
            to: educator_email,
            subject: `📈 Daily Earnings: $${gross_amount.toFixed(2)}`,
            html: template
        });

        logger.info(`Daily earnings notification sent to ${educator_email}`);

        res.json({ success: true, message: 'Daily earnings notification sent' });

    } catch (error) {
        logger.error('Daily earnings webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
