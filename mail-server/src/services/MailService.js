const MailUser = require('../models/MailUser');
const EmailMessage = require('../models/EmailMessage');
const { main: logger } = require('../utils/logger');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class MailService {
    constructor(config, services) {
        this.config = config || {};
        this.services = services || {}; // Access to smtp, imap, queue, security, dns, analytics
    }

    // --- Authentication ---
    async authenticateUser(email, password) {
        try {
            const user = await MailUser.findByEmailOrUsername(email);
            if (!user || !user.isActive || user.isLocked) return null;

            const isValid = await user.comparePassword(password);
            if (!isValid) {
                await user.incLoginAttempts();
                return null;
            }

            await user.resetLoginAttempts();
            user.lastLogin = new Date();
            await user.save();
            return user;
        } catch (error) {
            logger.error('MailService authentication error:', error);
            return null;
        }
    }

    // --- Stats & Dashboard ---
    async getEmailCount(userEmail) {
        const user = await MailUser.findOne({ email: userEmail });
        if (!user) return 0;
        return EmailMessage.countDocuments({ userId: user._id });
    }

    async getUnreadCount(userEmail) {
        const user = await MailUser.findOne({ email: userEmail });
        if (!user) return 0;
        return EmailMessage.countDocuments({ userId: user._id, flags: { $ne: 'seen' } });
    }

    async getSentTodayCount(userEmail) {
        const user = await MailUser.findOne({ email: userEmail });
        if (!user) return 0;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        return EmailMessage.countDocuments({
            userId: user._id,
            folder: 'Sent',
            date: { $gte: startOfDay }
        });
    }

    async getStorageUsed(userEmail) {
        const user = await MailUser.findOne({ email: userEmail });
        if (!user) return 0;
        const result = await EmailMessage.aggregate([
            { $match: { userId: user._id } },
            { $group: { _id: null, totalSize: { $sum: '$size' } } }
        ]);
        return result[0]?.totalSize || 0;
    }

    async getStorageQuota(userEmail) {
        const user = await MailUser.findOne({ email: userEmail });
        return user?.quota || 1024 * 1024 * 1024; // Default 1GB
    }

    async getSpamBlockedCount(userEmail) {
        const user = await MailUser.findOne({ email: userEmail });
        if (!user) return 0;
        return EmailMessage.countDocuments({ userId: user._id, folder: 'Spam' });
    }

    async getActiveAccountsCount() {
        return MailUser.countDocuments({ isActive: true });
    }

    // --- Folder Management ---
    async getFolders(userEmail) {
        const user = await MailUser.findOne({ email: userEmail });
        if (!user) return [];

        const standardFolders = ['Inbox', 'Sent', 'Drafts', 'Trash', 'Spam'];
        const customFolders = await EmailMessage.distinct('folder', { userId: user._id });

        const allFolderNames = Array.from(new Set([...standardFolders, ...customFolders]));

        const folders = await Promise.all(allFolderNames.map(async name => {
            const unread = await EmailMessage.countDocuments({
                userId: user._id,
                folder: name,
                flags: { $ne: 'seen' }
            });
            return {
                id: name.toLowerCase(),
                name: name,
                unread: unread,
                total: await EmailMessage.countDocuments({ userId: user._id, folder: name })
            };
        }));

        return folders;
    }

    async createFolder(userEmail, { name, parentId }) {
        return { id: name.toLowerCase(), name, parentId };
    }

    async updateFolder(userEmail, id, data) {
        const user = await MailUser.findOne({ email: userEmail });
        if (!user) return null;

        const oldName = id.charAt(0).toUpperCase() + id.slice(1);
        const newName = data.name;

        await EmailMessage.updateMany(
            { userId: user._id, folder: oldName },
            { $set: { folder: newName } }
        );

        return { id: newName.toLowerCase(), name: newName };
    }

    async deleteFolder(userEmail, id) {
        const user = await MailUser.findOne({ email: userEmail });
        if (!user) return false;

        const folderName = id.charAt(0).toUpperCase() + id.slice(1);
        await EmailMessage.updateMany(
            { userId: user._id, folder: folderName },
            { $set: { folder: 'Trash' } }
        );
        return true;
    }

    // --- Email Operations ---
    async getEmails(userEmail, { folder, page = 1, limit = 50, search }) {
        const user = await MailUser.findOne({ email: userEmail });
        if (!user) return { emails: [], total: 0 };

        const query = { userId: user._id };
        if (folder && folder !== 'all') {
            query.folder = folder.charAt(0).toUpperCase() + folder.slice(1);
        }

        if (search) {
            query.$or = [
                { subject: { $regex: search, $options: 'i' } },
                { 'from.address': { $regex: search, $options: 'i' } },
                { 'to.address': { $regex: search, $options: 'i' } },
                { textContent: { $regex: search, $options: 'i' } }
            ];
        }

        const emails = await EmailMessage.find(query)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await EmailMessage.countDocuments(query);
        return {
            emails,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        };
    }

    async getEmail(userEmail, id) {
        const user = await MailUser.findOne({ email: userEmail });
        if (!user) return null;
        return EmailMessage.findOne({ _id: id, userId: user._id });
    }

    async markAsRead(userEmail, id) {
        const user = await MailUser.findOne({ email: userEmail });
        if (!user) return false;
        const result = await EmailMessage.updateOne(
            { _id: id, userId: user._id },
            { $addToSet: { flags: 'seen' } }
        );
        return result.modifiedCount > 0;
    }

    async markAsUnread(userEmail, id) {
        const user = await MailUser.findOne({ email: userEmail });
        if (!user) return false;
        const result = await EmailMessage.updateOne(
            { _id: id, userId: user._id },
            { $pull: { flags: 'seen' } }
        );
        return result.modifiedCount > 0;
    }

    async deleteEmail(userEmail, id) {
        const user = await MailUser.findOne({ email: userEmail });
        if (!user) return false;

        const email = await EmailMessage.findOne({ _id: id, userId: user._id });
        if (!email) return false;

        if (email.folder === 'Trash') {
            await EmailMessage.deleteOne({ _id: id });
        } else {
            email.folder = 'Trash';
            await email.save();
        }
        return true;
    }

    async moveEmail(userEmail, id, folderId) {
        const user = await MailUser.findOne({ email: userEmail });
        if (!user) return false;
        const result = await EmailMessage.updateOne(
            { _id: id, userId: user._id },
            { $set: { folder: folderId.charAt(0).toUpperCase() + folderId.slice(1) } }
        );
        return result.modifiedCount > 0;
    }

    async sendEmail(emailData) {
        if (this.services.queue) {
            const result = await this.services.queue.addLocalDelivery(emailData);
            return { success: true, messageId: result?.id || crypto.randomUUID() };
        }
        throw new Error('Mail queue not available');
    }

    // --- Account Management (Admin) ---
    async getAccounts({ page, limit, search, status }) {
        const query = {};
        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } }
            ];
        }
        if (status === 'active') query.isActive = true;
        if (status === 'locked') query.isLocked = true;

        const accounts = await MailUser.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-password');

        const total = await MailUser.countDocuments(query);
        return { accounts, total, page, pages: Math.ceil(total / limit) };
    }

    async createAccount(data) {
        const account = new MailUser(data);
        return await account.save();
    }

    async getAccount(id) {
        return await MailUser.findById(id).select('-password');
    }

    async updateAccount(id, data) {
        delete data._id;
        delete data.email;
        return await MailUser.findByIdAndUpdate(id, data, { new: true }).select('-password');
    }

    async deleteAccount(id) {
        const result = await MailUser.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
            await EmailMessage.deleteMany({ userId: id });
        }
        return result.deletedCount > 0;
    }

    // --- Domain Management ---
    async getDomains() {
        return this.config.domains || [];
    }

    async createDomain(data) {
        if (!this.config.domains) this.config.domains = [];
        const newDomain = { ...data, id: crypto.randomUUID(), verified: false };
        this.config.domains.push(newDomain);
        return newDomain;
    }

    async getDomain(id) {
        return (this.config.domains || []).find(d => d.id === id);
    }

    async updateDomain(id, data) {
        const domain = (this.config.domains || []).find(d => d.id === id);
        if (domain) {
            Object.assign(domain, data);
            return domain;
        }
        return null;
    }

    async deleteDomain(id) {
        if (!this.config.domains) return false;
        const initialLength = this.config.domains.length;
        this.config.domains = this.config.domains.filter(d => d.id !== id);
        return this.config.domains.length < initialLength;
    }

    async verifyDomain(id) {
        const domain = (this.config.domains || []).find(d => d.id === id);
        if (!domain) return { success: false, details: 'Domain not found' };
        domain.verified = true;
        return { success: true };
    }

    // --- Security & Spam ---
    async getSecuritySettings() {
        return {
            spf: this.services.security?.isSPFEnabled?.() ?? true,
            dkim: this.services.security?.isDKIMEnabled?.() ?? true,
            dmarc: this.services.security?.isDMARCEnabled?.() ?? true,
            spam: this.services.security?.isAntiSpamEnabled?.() ?? true,
            virus: this.services.security?.isAntiVirusEnabled?.() ?? true
        };
    }

    async updateSecuritySettings(data) {
        if (!this.config.security) this.config.security = {};
        Object.assign(this.config.security, data);
        return this.getSecuritySettings();
    }

    async getSpamSettings(userEmail) {
        const user = await MailUser.findOne({ email: userEmail });
        return user?.spamSettings || { threshold: 5.0, enabled: true };
    }

    async updateSpamSettings(userEmail, data) {
        return await MailUser.findOneAndUpdate(
            { email: userEmail },
            { $set: { spamSettings: data } },
            { new: true }
        );
    }

    // --- Queue Management ---
    async getQueueJobs() {
        if (!this.services.queue || !this.services.queue.queues) return [];

        const allJobs = [];
        for (const [queueName, queue] of Object.entries(this.services.queue.queues)) {
            const jobs = await queue.getJobs(['waiting', 'active', 'completed', 'failed', 'delayed']);
            allJobs.push(...jobs.map(job => ({
                id: job.id,
                name: job.name,
                queue: queueName,
                data: job.data,
                status: job.status || 'unknown',
                progress: job.progress || 0,
                failedReason: job.failedReason,
                processedOn: job.processedOn,
                finishedOn: job.finishedOn,
                timestamp: job.timestamp
            })));
        }
        return allJobs.sort((a, b) => b.timestamp - a.timestamp);
    }

    async getQueueStats() {
        console.log('DEBUG: MailService.getQueueStats called');
        try {
            if (this.services.queue && this.services.queue.getQueueStats) {
                console.log('DEBUG: calling this.services.queue.getQueueStats()');
                const stats = await this.services.queue.getQueueStats();
                console.log('DEBUG: queue stats returned:', stats);
                return stats;
            }
            console.log('DEBUG: queue service missing or no getQueueStats, returning defaults');
        } catch (err) {
            console.error('DEBUG: Error inside MailService.getQueueStats:', err);
        }
        return {
            localDelivery: { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
            remoteDelivery: { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 }
        };
    }

    async retryJob(jobId) {
        if (!this.services.queue) return false;
        // Search through queues for the job
        for (const queue of Object.values(this.services.queue.queues)) {
            const job = await queue.getJob(jobId);
            if (job) {
                await job.retry();
                return true;
            }
        }
        return false;
    }

    async removeJob(jobId) {
        if (!this.services.queue) return false;
        for (const queue of Object.values(this.services.queue.queues)) {
            const job = await queue.getJob(jobId);
            if (job) {
                await job.remove();
                return true;
            }
        }
        return false;
    }

    // --- Analytics ---
    async getAnalytics({ period }) {
        if (this.services.analytics) {
            const startDate = this._getStartDateFromPeriod(period);
            return await this.services.analytics.getOverview(startDate);
        }
        return {};
    }

    async getTrafficAnalytics({ period }) {
        if (this.services.analytics) {
            const startDate = this._getStartDateFromPeriod(period);
            return await this.services.analytics.getTrafficData(startDate);
        }
        return {};
    }

    _getStartDateFromPeriod(period) {
        const now = new Date();
        switch (period) {
            case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
            case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            default: return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }
    }

    // --- Attachments ---
    async saveAttachment(userEmail, file) {
        return {
            id: crypto.randomUUID(),
            filename: file.originalname,
            size: file.size,
            contentType: file.mimetype
        };
    }

    async getAttachment(userEmail, id) {
        return null;
    }
}

module.exports = MailService;
