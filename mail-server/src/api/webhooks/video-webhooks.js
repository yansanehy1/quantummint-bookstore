// Video Webhooks for QuantumMint
// Handles video viewing sessions, certificates, and live streams

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

const { sendEmail } = require('../utils/email-sender');
const { main: logger } = require('../utils/logger');

/**
 * POST /api/webhooks/video/session-end
 * Handle video viewing session completion
 */
router.post('/session-end', async (req, res) => {
    try {
        const {
            user_id,
            user_email,
            listener_name,
            video_id,
            video_title,
            creator_name,
            category,
            thumbnail_url,
            minutes_watched,
            amount_deducted,
            remaining_balance,
            completion_percentage,
            average_quality,
            interactive_elements_completed,
            total_points,
            certificate_eligible,
            estimated_minutes_remaining
        } = req.body;

        if (!user_id || !user_email || !video_id || !minutes_watched) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Only send summary for significant sessions (10+ minutes)
        if (minutes_watched < 10) {
            return res.json({ success: true, message: 'Session too short for summary' });
        }

        const templatePath = path.join(__dirname, '../templates/learner/video-session-summary.html');
        let template = await fs.readFile(templatePath, 'utf-8');

        // Simple template variable replacement
        const data = {
            listener_name: listener_name || 'Learner',
            video_title,
            creator_name,
            category: category || 'Educational',
            thumbnail_url: thumbnail_url || '',
            minutes_watched,
            amount_deducted: `$${parseFloat(amount_deducted).toFixed(2)}`,
            remaining_balance: `$${parseFloat(remaining_balance).toFixed(2)}`,
            completion_percentage,
            average_quality: average_quality || '720p',
            interactive_elements_completed: interactive_elements_completed || 0,
            total_points: total_points || 0,
            certificate_eligible: certificate_eligible || false,
            video_id,
            estimated_minutes_remaining: estimated_minutes_remaining || 0
        };

        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regex, data[key]);
        });

        // Handle conditional sections
        if (interactive_elements_completed > 0) {
            template = template.replace(/{{#if interactive_elements_completed}}/g, '');
            template = template.replace(/{{\/if}}/g, '');
        } else {
            template = template.replace(/{{#if interactive_elements_completed}}[\s\S]*?{{\/if}}/g, '');
        }

        if (certificate_eligible) {
            template = template.replace(/{{#if certificate_eligible}}/g, '');
        } else {
            template = template.replace(/{{#if certificate_eligible}}[\s\S]*?{{\/if}}/g, '');
        }

        await sendEmail({
            from: process.env.EMAIL_LISTENING || 'listen@quantummint.net',
            to: user_email,
            subject: `🎬 Video Complete: ${video_title}`,
            html: template
        });

        logger.info(`Video session summary sent to ${user_email}`);

        res.json({ success: true, message: 'Video session summary sent' });

    } catch (error) {
        logger.error('Video session webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/webhooks/video/certificate-issued
 * Handle certificate issuance notifications
 */
router.post('/certificate-issued', async (req, res) => {
    try {
        const {
            user_id,
            user_email,
            user_name,
            video_id,
            video_title,
            creator_name,
            certificate_id,
            certificate_url,
            verification_url,
            issue_date,
            completion_percentage,
            quiz_score,
            exercises_completed,
            social_share_urls
        } = req.body;

        if (!user_email || !video_title || !certificate_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const templatePath = path.join(__dirname, '../templates/learner/certificate-awarded.html');
        let template = await fs.readFile(templatePath, 'utf-8');

        const data = {
            user_name: user_name || 'Learner',
            video_title,
            creator_name: creator_name || 'Instructor',
            certificate_id,
            certificate_url,
            verification_url,
            issue_date: issue_date || new Date().toLocaleDateString(),
            completion_percentage: completion_percentage || '100',
            quiz_score: quiz_score || '',
            exercises_completed: exercises_completed || '',
            'social_share_urls.linkedin': social_share_urls?.linkedin || '#',
            'social_share_urls.twitter': social_share_urls?.twitter || '#',
            'social_share_urls.facebook': social_share_urls?.facebook || '#'
        };

        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regex, data[key]);
        });

        // Handle conditionals
        if (quiz_score) {
            template = template.replace(/{{#if quiz_score}}/g, '');
        } else {
            template = template.replace(/{{#if quiz_score}}[\s\S]*?{{\/if}}/g, '');
        }

        if (exercises_completed) {
            template = template.replace(/{{#if exercises_completed}}/g, '');
        } else {
            template = template.replace(/{{#if exercises_completed}}[\s\S]*?{{\/if}}/g, '');
        }
        template = template.replace(/{{\/if}}/g, '');

        await sendEmail({
            from: process.env.EMAIL_LIBRARY || 'library@quantummint.net',
            to: user_email,
            subject: `🏆 Certificate Awarded: ${video_title}`,
            html: template
        });

        logger.info(`Certificate notification sent to ${user_email}`);

        res.json({ success: true, message: 'Certificate notification sent' });

    } catch (error) {
        logger.error('Certificate webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/webhooks/video/live-stream-starting
 * Notify registered users that live stream is starting
 */
router.post('/live-stream-starting', async (req, res) => {
    try {
        const {
            stream_id,
            title,
            creator_name,
            start_time,
            duration_minutes,
            price_per_minute,
            preview_minutes,
            registered_users
        } = req.body;

        if (!stream_id || !title || !Array.isArray(registered_users)) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const templatePath = path.join(__dirname, '../templates/learner/live-stream-starting.html');
        const templateBase = await fs.readFile(templatePath, 'utf-8');

        const estimated_cost = ((duration_minutes || 60) * (price_per_minute || 0.50)).toFixed(2);

        // Send to all registered users
        const emailPromises = registered_users.map(async (user) => {
            let template = templateBase;

            const data = {
                listener_name: user.name || 'Learner',
                title,
                creator_name: creator_name || 'Creator',
                start_time: start_time || 'Now',
                duration_minutes: duration_minutes || 60,
                price_per_minute: `$${(price_per_minute || 0.50).toFixed(2)}`,
                preview_minutes: preview_minutes || 5,
                stream_id,
                estimated_cost: `$${estimated_cost}`
            };

            Object.keys(data).forEach(key => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                template = template.replace(regex, data[key]);
            });

            return sendEmail({
                from: process.env.EMAIL_UPDATES || 'updates@quantummint.net',
                to: user.email,
                subject: `🔴 LIVE NOW: ${title}`,
                html: template
            });
        });

        await Promise.all(emailPromises);

        logger.info(`Live stream notifications sent to ${registered_users.length} users`);

        res.json({
            success: true,
            message: `Notifications sent to ${registered_users.length} users`
        });

    } catch (error) {
        logger.error('Live stream webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/webhooks/video/upload-processed
 * Notify creator that video processing is complete
 */
router.post('/upload-processed', async (req, res) => {
    try {
        const {
            creator_id,
            creator_email,
            creator_name,
            video_id,
            title,
            processing_status,
            error_message
        } = req.body;

        if (processing_status === 'completed') {
            const emailContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #10b981; color: white; padding: 30px; text-align: center;">
                        <h1>✅ Video Processing Complete!</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p>Hi <strong>${creator_name}</strong>,</p>
                        <p>Great news! Your video "<strong>${title}</strong>" has been successfully processed and is ready to publish.</p>
                        
                        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3>✨ Next Steps:</h3>
                            <ul>
                                <li>Add detailed description and tags</li>
                                <li>Set pricing tier</li>
                                <li>Preview video quality</li>
                                <li>Publish when ready</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://quantum.quantummint.net/creator/content/${video_id}/edit" 
                               style="background: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                               Edit Video Details
                            </a>
                        </div>
                    </div>
                </div>
            `;

            await sendEmail({
                from: process.env.EMAIL_CREATORS || 'creators@quantummint.net',
                to: creator_email,
                subject: `✅ Video Ready: ${title}`,
                html: emailContent
            });
        } else if (processing_status === 'failed') {
            const emailContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #ef4444; color: white; padding: 30px; text-align: center;">
                        <h1>❌ Video Processing Failed</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p>Hi <strong>${creator_name}</strong>,</p>
                        <p>Unfortunately, there was an issue processing your video "<strong>${title}</strong>".</p>
                        
                        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                            <p><strong>Error:</strong> ${error_message || 'Unknown error'}</p>
                        </div>
                        
                        <p>Please try uploading again or <a href="https://quantum.quantummint.net/support">contact support</a> if the issue persists.</p>
                    </div>
                </div>
            `;

            await sendEmail({
                from: process.env.EMAIL_CREATORS || 'creators@quantummint.net',
                to: creator_email,
                subject: `❌ Video Processing Failed: ${title}`,
                html: emailContent
            });
        }

        res.json({ success: true });

    } catch (error) {
        logger.error('Video upload webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
