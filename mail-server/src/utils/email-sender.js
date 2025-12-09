// Email Sender Utility for QuantumMint
// Provides a consistent interface for sending emails via the mail server

const nodemailer = require('nodemailer');
const { main: logger } = require('./logger');

// Create transporter (will use existing SMTP configuration)
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOSTNAME || 'mail.quantummint.net',
    port: process.env.SMTP_SUBMISSION_PORT || 587,
    secure: false, // use STARTTLS
    auth: {
        user: process.env.SMTP_AUTH_USER || 'noreply@quantummint.net',
        pass: process.env.SMTP_AUTH_PASS || ''
    }
});

/**
 * Send an email using the configured SMTP server
 * @param {Object} options - Email options
 * @param {string} options.from - Sender email address
 * @param {string|string[]} options.to - Recipient email address(es)
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email content
 * @param {string} [options.text] - Plain text email content
 * @returns {Promise<Object>} Send result
 */
async function sendEmail({ from, to, subject, html, text }) {
    try {
        const mailOptions = {
            from: from || process.env.EMAIL_SUPPORT || 'support@quantummint.net',
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            html,
            text: text || stripHtml(html)
        };

        const info = await transporter.sendMail(mailOptions);

        logger.info(`Email sent successfully: ${info.messageId}`);

        return {
            success: true,
            messageId: info.messageId,
            accepted: info.accepted,
            rejected: info.rejected
        };

    } catch (error) {
        logger.error(`Failed to send email to ${to}:`, error);
        throw error;
    }
}

/**
 * Strip HTML tags for plain text fallback
 */
function stripHtml(html) {
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
}

/**
 * Verify SMTP connection
 */
async function verifyConnection() {
    try {
        await transporter.verify();
        logger.info('SMTP connection verified successfully');
        return true;
    } catch (error) {
        logger.error('SMTP connection verification failed:', error);
        return false;
    }
}

module.exports = {
    sendEmail,
    verifyConnection
};
