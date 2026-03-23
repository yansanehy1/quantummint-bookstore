const express = require('express');
const MailAuthMiddleware = require('../middleware/auth');
const { main: logger } = require('../../utils/logger');

class MailServerAPI {
    constructor(services, config) {
        this.router = express.Router();
        this.services = services;
        this.auth = new MailAuthMiddleware(config);

        this.setupRoutes();
        this.auth.startSessionCleanup();
    }

    setupRoutes() {
        // Authentication routes
        this.router.post('/auth/login', (req, res) =>
            this.auth.login(req, res, this.services.mail));
        this.router.post('/auth/logout', this.auth.authenticate.bind(this.auth),
            this.auth.logout.bind(this.auth));
        this.router.get('/auth/user', this.auth.authenticate.bind(this.auth),
            this.auth.getCurrentUser.bind(this.auth));
        this.router.get('/auth/sessions', this.auth.authenticate.bind(this.auth),
            this.auth.getActiveSessions.bind(this.auth));

        // Dashboard stats
        this.router.get('/stats', this.auth.authenticate.bind(this.auth),
            this.getDashboardStats.bind(this));

        // Folder management
        this.router.get('/folders', this.auth.authenticate.bind(this.auth),
            this.getFolders.bind(this));
        this.router.post('/folders', this.auth.authenticate.bind(this.auth),
            this.createFolder.bind(this));
        this.router.put('/folders/:id', this.auth.authenticate.bind(this.auth),
            this.updateFolder.bind(this));
        this.router.delete('/folders/:id', this.auth.authenticate.bind(this.auth),
            this.deleteFolder.bind(this));

        // Email management
        this.router.get('/emails', this.auth.authenticate.bind(this.auth),
            this.getEmails.bind(this));
        this.router.get('/emails/:id', this.auth.authenticate.bind(this.auth),
            this.getEmail.bind(this));
        this.router.post('/emails/:id/read', this.auth.authenticate.bind(this.auth),
            this.markEmailAsRead.bind(this));
        this.router.post('/emails/:id/unread', this.auth.authenticate.bind(this.auth),
            this.markEmailAsUnread.bind(this));
        this.router.delete('/emails/:id', this.auth.authenticate.bind(this.auth),
            this.deleteEmail.bind(this));
        this.router.post('/emails/:id/move', this.auth.authenticate.bind(this.auth),
            this.moveEmail.bind(this));

        // Email sending
        this.router.post('/send', this.auth.authenticate.bind(this.auth),
            this.auth.rateLimitSending(100), this.sendEmail.bind(this));
        this.router.post('/emails/:id/reply', this.auth.authenticate.bind(this.auth),
            this.auth.rateLimitSending(100), this.replyToEmail.bind(this));
        this.router.post('/emails/:id/forward', this.auth.authenticate.bind(this.auth),
            this.auth.rateLimitSending(100), this.forwardEmail.bind(this));

        // Account management
        this.router.get('/accounts', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('account_read'), this.getAccounts.bind(this));
        this.router.post('/accounts', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('account_create'), this.createAccount.bind(this));
        this.router.get('/accounts/:id', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('account_read'), this.getAccount.bind(this));
        this.router.put('/accounts/:id', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('account_update'), this.updateAccount.bind(this));
        this.router.delete('/accounts/:id', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('account_delete'), this.deleteAccount.bind(this));

        // Domain management
        this.router.get('/domains', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('domain_read'), this.getDomains.bind(this));
        this.router.post('/domains', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('domain_create'), this.createDomain.bind(this));
        this.router.get('/domains/:id', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('domain_read'), this.getDomain.bind(this));
        this.router.put('/domains/:id', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('domain_update'), this.updateDomain.bind(this));
        this.router.delete('/domains/:id', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('domain_delete'), this.deleteDomain.bind(this));
        this.router.post('/domains/:id/verify', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('domain_update'), this.verifyDomain.bind(this));

        // Security and spam management
        this.router.get('/security', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('security_read'), this.getSecuritySettings.bind(this));
        this.router.put('/security', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('security_update'), this.updateSecuritySettings.bind(this));
        this.router.get('/spam', this.auth.authenticate.bind(this.auth),
            this.getSpamSettings.bind(this));
        this.router.put('/spam', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('security_update'), this.updateSpamSettings.bind(this));

        // Analytics
        this.router.get('/analytics', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('analytics_read'), this.getAnalytics.bind(this));
        this.router.get('/analytics/traffic', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('analytics_read'), this.getTrafficAnalytics.bind(this));

        // Queue Management
        this.router.get('/queue/jobs', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('queue_read'), this.getQueueJobs.bind(this));
        this.router.post('/queue/retry/:id', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('queue_update'), this.retryQueueJob.bind(this));
        this.router.delete('/queue/jobs/:id', this.auth.authenticate.bind(this.auth),
            this.auth.requirePermission('queue_delete'), this.deleteQueueJob.bind(this));

        // Attachments
        this.router.post('/attachments', this.auth.authenticate.bind(this.auth),
            this.uploadAttachment.bind(this));
        this.router.get('/attachments/:id', this.auth.authenticate.bind(this.auth),
            this.downloadAttachment.bind(this));
    }

    async getDashboardStats(req, res) {
        try {
            const userEmail = req.user.email;
            const stats = await Promise.all([
                this.services.mail.getEmailCount(userEmail),
                this.services.mail.getUnreadCount(userEmail),
                this.services.mail.getSentTodayCount(userEmail),
                this.services.mail.getStorageUsed(userEmail),
                this.services.mail.getSpamBlockedCount(userEmail),
                this.services.mail.getActiveAccountsCount(),
                (async () => {
                    console.log('Fetching queue stats...');
                    try {
                        const qs = await this.services.mail.getQueueStats();
                        console.log('Queue stats fetched:', qs);
                        return qs;
                    } catch (e) {
                        console.error('Error fetching queue stats helper:', e);
                        throw e;
                    }
                })()
            ]);

            const storageQuota = await this.services.mail.getStorageQuota(userEmail);

            res.json({
                totalEmails: stats[0],
                unreadEmails: stats[1],
                sentToday: stats[2],
                storageUsed: stats[3],
                spamBlocked: stats[4],
                activeAccounts: stats[5],
                queueStats: stats[6],
                storageQuota: storageQuota,
                storagePercentage: (stats[3] / storageQuota) * 100,
                timestamp: Date.now()
            });
        } catch (error) {
            logger.error('Failed to get mail dashboard stats:', error);
            res.status(500).json({ error: 'Failed to retrieve dashboard statistics' });
        }
    }

    async getFolders(req, res) {
        try {
            const userEmail = req.user.email;
            const folders = await this.services.mail.getFolders(userEmail);
            res.json(folders);
        } catch (error) {
            logger.error('Failed to get folders:', error);
            res.status(500).json({ error: 'Failed to retrieve folders' });
        }
    }

    async createFolder(req, res) {
        try {
            const userEmail = req.user.email;
            const { name, parentId } = req.body;

            const folder = await this.services.mail.createFolder(userEmail, { name, parentId });
            res.status(201).json(folder);
        } catch (error) {
            logger.error('Failed to create folder:', error);
            res.status(500).json({ error: 'Failed to create folder' });
        }
    }

    async updateFolder(req, res) {
        try {
            const { id } = req.params;
            const userEmail = req.user.email;
            const updateData = req.body;

            const folder = await this.services.mail.updateFolder(userEmail, id, updateData);
            if (!folder) {
                return res.status(404).json({ error: 'Folder not found' });
            }

            res.json(folder);
        } catch (error) {
            logger.error('Failed to update folder:', error);
            res.status(500).json({ error: 'Failed to update folder' });
        }
    }

    async deleteFolder(req, res) {
        try {
            const { id } = req.params;
            const userEmail = req.user.email;

            const success = await this.services.mail.deleteFolder(userEmail, id);
            if (!success) {
                return res.status(404).json({ error: 'Folder not found' });
            }

            res.json({ success: true });
        } catch (error) {
            logger.error('Failed to delete folder:', error);
            res.status(500).json({ error: 'Failed to delete folder' });
        }
    }

    async getEmails(req, res) {
        try {
            const userEmail = req.user.email;
            const { folder = 'inbox', page = 1, limit = 50, search } = req.query;

            const emails = await this.services.mail.getEmails(userEmail, {
                folder,
                page: parseInt(page),
                limit: parseInt(limit),
                search
            });

            res.json(emails);
        } catch (error) {
            logger.error('Failed to get emails:', error);
            res.status(500).json({ error: 'Failed to retrieve emails' });
        }
    }

    async getEmail(req, res) {
        try {
            const { id } = req.params;
            const userEmail = req.user.email;

            const email = await this.services.mail.getEmail(userEmail, id);
            if (!email) {
                return res.status(404).json({ error: 'Email not found' });
            }

            res.json(email);
        } catch (error) {
            logger.error('Failed to get email:', error);
            res.status(500).json({ error: 'Failed to retrieve email' });
        }
    }

    async markEmailAsRead(req, res) {
        try {
            const { id } = req.params;
            const userEmail = req.user.email;

            const success = await this.services.mail.markAsRead(userEmail, id);
            if (!success) {
                return res.status(404).json({ error: 'Email not found' });
            }

            res.json({ success: true });
        } catch (error) {
            logger.error('Failed to mark email as read:', error);
            res.status(500).json({ error: 'Failed to mark email as read' });
        }
    }

    async markEmailAsUnread(req, res) {
        try {
            const { id } = req.params;
            const userEmail = req.user.email;

            const success = await this.services.mail.markAsUnread(userEmail, id);
            if (!success) {
                return res.status(404).json({ error: 'Email not found' });
            }

            res.json({ success: true });
        } catch (error) {
            logger.error('Failed to mark email as unread:', error);
            res.status(500).json({ error: 'Failed to mark email as unread' });
        }
    }

    async deleteEmail(req, res) {
        try {
            const { id } = req.params;
            const userEmail = req.user.email;

            const success = await this.services.mail.deleteEmail(userEmail, id);
            if (!success) {
                return res.status(404).json({ error: 'Email not found' });
            }

            res.json({ success: true });
        } catch (error) {
            logger.error('Failed to delete email:', error);
            res.status(500).json({ error: 'Failed to delete email' });
        }
    }

    async moveEmail(req, res) {
        try {
            const { id } = req.params;
            const { folderId } = req.body;
            const userEmail = req.user.email;

            const success = await this.services.mail.moveEmail(userEmail, id, folderId);
            if (!success) {
                return res.status(404).json({ error: 'Email not found' });
            }

            res.json({ success: true });
        } catch (error) {
            logger.error('Failed to move email:', error);
            res.status(500).json({ error: 'Failed to move email' });
        }
    }

    async sendEmail(req, res) {
        try {
            const userEmail = req.user.email;
            const { to, cc, bcc, subject, content, attachments } = req.body;

            if (!to || !subject) {
                return res.status(400).json({ error: 'To and subject are required' });
            }

            const emailData = {
                from: userEmail,
                to: Array.isArray(to) ? to : [to],
                cc: cc ? (Array.isArray(cc) ? cc : [cc]) : [],
                bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : [],
                subject,
                content,
                attachments: attachments || []
            };

            const result = await this.services.mail.sendEmail(emailData);

            logger.info(`Email sent from ${userEmail} to ${emailData.to.join(', ')}`);
            res.json({ success: true, messageId: result.messageId });

        } catch (error) {
            logger.error('Failed to send email:', error);
            res.status(500).json({ error: 'Failed to send email' });
        }
    }

    async replyToEmail(req, res) {
        try {
            const { id } = req.params;
            const userEmail = req.user.email;
            const { content, replyAll } = req.body;

            const originalEmail = await this.services.mail.getEmail(userEmail, id);
            if (!originalEmail) {
                return res.status(404).json({ error: 'Original email not found' });
            }

            const replyData = {
                from: userEmail,
                to: replyAll ? [originalEmail.sender, ...originalEmail.cc] : [originalEmail.sender],
                subject: `Re: ${originalEmail.subject}`,
                content,
                inReplyTo: originalEmail.messageId,
                references: originalEmail.references || []
            };

            const result = await this.services.mail.sendEmail(replyData);
            res.json({ success: true, messageId: result.messageId });

        } catch (error) {
            logger.error('Failed to reply to email:', error);
            res.status(500).json({ error: 'Failed to reply to email' });
        }
    }

    async forwardEmail(req, res) {
        try {
            const { id } = req.params;
            const userEmail = req.user.email;
            const { to, content } = req.body;

            const originalEmail = await this.services.mail.getEmail(userEmail, id);
            if (!originalEmail) {
                return res.status(404).json({ error: 'Original email not found' });
            }

            const forwardData = {
                from: userEmail,
                to: Array.isArray(to) ? to : [to],
                subject: `Fwd: ${originalEmail.subject}`,
                content: `${content}\n\n---------- Forwarded message ----------\n${originalEmail.content}`,
                attachments: originalEmail.attachments || []
            };

            const result = await this.services.mail.sendEmail(forwardData);
            res.json({ success: true, messageId: result.messageId });

        } catch (error) {
            logger.error('Failed to forward email:', error);
            res.status(500).json({ error: 'Failed to forward email' });
        }
    }

    async getAccounts(req, res) {
        try {
            const { page = 1, limit = 50, search, status } = req.query;
            const accounts = await this.services.mail.getAccounts({
                page: parseInt(page),
                limit: parseInt(limit),
                search,
                status
            });

            res.json(accounts);
        } catch (error) {
            logger.error('Failed to get accounts:', error);
            res.status(500).json({ error: 'Failed to retrieve accounts' });
        }
    }

    async createAccount(req, res) {
        try {
            const accountData = req.body;
            const account = await this.services.mail.createAccount(accountData);

            logger.info(`Mail account created: ${account.email}`);
            res.status(201).json(account);
        } catch (error) {
            logger.error('Failed to create account:', error);
            res.status(500).json({ error: 'Failed to create account' });
        }
    }

    async getAccount(req, res) {
        try {
            const { id } = req.params;
            const account = await this.services.mail.getAccount(id);

            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }

            res.json(account);
        } catch (error) {
            logger.error('Failed to get account:', error);
            res.status(500).json({ error: 'Failed to retrieve account' });
        }
    }

    async updateAccount(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const account = await this.services.mail.updateAccount(id, updateData);
            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }

            res.json(account);
        } catch (error) {
            logger.error('Failed to update account:', error);
            res.status(500).json({ error: 'Failed to update account' });
        }
    }

    async deleteAccount(req, res) {
        try {
            const { id } = req.params;
            const success = await this.services.mail.deleteAccount(id);

            if (!success) {
                return res.status(404).json({ error: 'Account not found' });
            }

            res.json({ success: true });
        } catch (error) {
            logger.error('Failed to delete account:', error);
            res.status(500).json({ error: 'Failed to delete account' });
        }
    }

    async getDomains(req, res) {
        try {
            const domains = await this.services.mail.getDomains();
            res.json(domains);
        } catch (error) {
            logger.error('Failed to get domains:', error);
            res.status(500).json({ error: 'Failed to retrieve domains' });
        }
    }

    async createDomain(req, res) {
        try {
            const domainData = req.body;
            const domain = await this.services.mail.createDomain(domainData);

            logger.info(`Mail domain created: ${domain.name}`);
            res.status(201).json(domain);
        } catch (error) {
            logger.error('Failed to create domain:', error);
            res.status(500).json({ error: 'Failed to create domain' });
        }
    }

    async getDomain(req, res) {
        try {
            const { id } = req.params;
            const domain = await this.services.mail.getDomain(id);

            if (!domain) {
                return res.status(404).json({ error: 'Domain not found' });
            }

            res.json(domain);
        } catch (error) {
            logger.error('Failed to get domain:', error);
            res.status(500).json({ error: 'Failed to retrieve domain' });
        }
    }

    async updateDomain(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const domain = await this.services.mail.updateDomain(id, updateData);
            if (!domain) {
                return res.status(404).json({ error: 'Domain not found' });
            }

            res.json(domain);
        } catch (error) {
            logger.error('Failed to update domain:', error);
            res.status(500).json({ error: 'Failed to update domain' });
        }
    }

    async deleteDomain(req, res) {
        try {
            const { id } = req.params;
            const success = await this.services.mail.deleteDomain(id);

            if (!success) {
                return res.status(404).json({ error: 'Domain not found' });
            }

            res.json({ success: true });
        } catch (error) {
            logger.error('Failed to delete domain:', error);
            res.status(500).json({ error: 'Failed to delete domain' });
        }
    }

    async verifyDomain(req, res) {
        try {
            const { id } = req.params;
            const result = await this.services.mail.verifyDomain(id);

            if (!result.success) {
                return res.status(400).json({ error: 'Domain verification failed', details: result.details });
            }

            res.json({ success: true, verified: true });
        } catch (error) {
            logger.error('Failed to verify domain:', error);
            res.status(500).json({ error: 'Failed to verify domain' });
        }
    }

    async getSecuritySettings(req, res) {
        try {
            const settings = await this.services.mail.getSecuritySettings();
            res.json(settings);
        } catch (error) {
            logger.error('Failed to get security settings:', error);
            res.status(500).json({ error: 'Failed to retrieve security settings' });
        }
    }

    async updateSecuritySettings(req, res) {
        try {
            const updateData = req.body;
            const settings = await this.services.mail.updateSecuritySettings(updateData);

            logger.info('Mail security settings updated');
            res.json(settings);
        } catch (error) {
            logger.error('Failed to update security settings:', error);
            res.status(500).json({ error: 'Failed to update security settings' });
        }
    }

    async getSpamSettings(req, res) {
        try {
            const userEmail = req.user.email;
            const settings = await this.services.mail.getSpamSettings(userEmail);
            res.json(settings);
        } catch (error) {
            logger.error('Failed to get spam settings:', error);
            res.status(500).json({ error: 'Failed to retrieve spam settings' });
        }
    }

    async updateSpamSettings(req, res) {
        try {
            const userEmail = req.user.email;
            const updateData = req.body;
            const settings = await this.services.mail.updateSpamSettings(userEmail, updateData);

            res.json(settings);
        } catch (error) {
            logger.error('Failed to update spam settings:', error);
            res.status(500).json({ error: 'Failed to update spam settings' });
        }
    }

    async getAnalytics(req, res) {
        try {
            const { period = '7d' } = req.query;
            const analytics = await this.services.mail.getAnalytics({ period });
            res.json(analytics);
        } catch (error) {
            logger.error('Failed to get analytics:', error);
            res.status(500).json({ error: 'Failed to retrieve analytics' });
        }
    }

    async getTrafficAnalytics(req, res) {
        try {
            const { period = '24h' } = req.query;
            const traffic = await this.services.mail.getTrafficAnalytics({ period });
            res.json(traffic);
        } catch (error) {
            logger.error('Failed to get traffic analytics:', error);
            res.status(500).json({ error: 'Failed to retrieve traffic analytics' });
        }
    }

    async getQueueJobs(req, res) {
        try {
            const jobs = await this.services.mail.getQueueJobs();
            res.json(jobs);
        } catch (error) {
            logger.error('Failed to get queue jobs:', error);
            res.status(500).json({ error: 'Failed to retrieve queue jobs' });
        }
    }

    async retryQueueJob(req, res) {
        try {
            const { id } = req.params;
            const success = await this.services.mail.retryJob(id);
            if (!success) return res.status(404).json({ error: 'Job not found' });
            res.json({ success: true });
        } catch (error) {
            logger.error('Failed to retry queue job:', error);
            res.status(500).json({ error: 'Failed to retry queue job' });
        }
    }

    async deleteQueueJob(req, res) {
        try {
            const { id } = req.params;
            const success = await this.services.mail.removeJob(id);
            if (!success) return res.status(404).json({ error: 'Job not found' });
            res.json({ success: true });
        } catch (error) {
            logger.error('Failed to delete queue job:', error);
            res.status(500).json({ error: 'Failed to delete queue job' });
        }
    }

    async uploadAttachment(req, res) {
        try {
            // This would handle file upload using multer or similar
            const userEmail = req.user.email;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const attachment = await this.services.mail.saveAttachment(userEmail, file);
            res.json(attachment);
        } catch (error) {
            logger.error('Failed to upload attachment:', error);
            res.status(500).json({ error: 'Failed to upload attachment' });
        }
    }

    async downloadAttachment(req, res) {
        try {
            const { id } = req.params;
            const userEmail = req.user.email;

            const attachment = await this.services.mail.getAttachment(userEmail, id);
            if (!attachment) {
                return res.status(404).json({ error: 'Attachment not found' });
            }

            res.setHeader('Content-Disposition', `attachment; filename="${attachment.filename}"`);
            res.setHeader('Content-Type', attachment.contentType);
            res.send(attachment.data);
        } catch (error) {
            logger.error('Failed to download attachment:', error);
            res.status(500).json({ error: 'Failed to download attachment' });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = MailServerAPI;
