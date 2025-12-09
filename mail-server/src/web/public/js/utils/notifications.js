/**
 * Notification System for Mail Server
 * Handles toast notifications, alerts, and user feedback
 */
class MailNotificationManager {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.defaultDuration = 5000;
        this.maxNotifications = 5;
        this.init();
    }

    /**
     * Initialize notification system
     */
    init() {
        this.createContainer();
        this.setupStyles();
    }

    /**
     * Create notification container
     */
    createContainer() {
        this.container = document.getElementById('mail-notification-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'mail-notification-container';
            this.container.className = 'mail-notification-container';
            document.body.appendChild(this.container);
        }
    }

    /**
     * Setup notification styles
     */
    setupStyles() {
        if (document.getElementById('mail-notification-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'mail-notification-styles';
        styles.textContent = `
            .mail-notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            }

            .mail-notification {
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                margin-bottom: 10px;
                padding: 16px;
                display: flex;
                align-items: flex-start;
                animation: slideIn 0.3s ease-out;
                border-left: 4px solid #007bff;
                position: relative;
                overflow: hidden;
            }

            .mail-notification.success {
                border-left-color: #28a745;
            }

            .mail-notification.warning {
                border-left-color: #ffc107;
            }

            .mail-notification.error {
                border-left-color: #dc3545;
            }

            .mail-notification.info {
                border-left-color: #17a2b8;
            }

            .mail-notification.mail {
                border-left-color: #6f42c1;
            }

            .mail-notification-icon {
                margin-right: 12px;
                font-size: 18px;
                flex-shrink: 0;
                margin-top: 2px;
            }

            .mail-notification.success .mail-notification-icon {
                color: #28a745;
            }

            .mail-notification.warning .mail-notification-icon {
                color: #ffc107;
            }

            .mail-notification.error .mail-notification-icon {
                color: #dc3545;
            }

            .mail-notification.info .mail-notification-icon {
                color: #17a2b8;
            }

            .mail-notification.mail .mail-notification-icon {
                color: #6f42c1;
            }

            .mail-notification-content {
                flex: 1;
            }

            .mail-notification-title {
                font-weight: 600;
                margin-bottom: 4px;
                color: #333;
            }

            .mail-notification-message {
                color: #666;
                font-size: 14px;
                line-height: 1.4;
            }

            .mail-notification-meta {
                font-size: 12px;
                color: #999;
                margin-top: 4px;
            }

            .mail-notification-close {
                background: none;
                border: none;
                font-size: 18px;
                color: #999;
                cursor: pointer;
                padding: 0;
                margin-left: 12px;
                flex-shrink: 0;
            }

            .mail-notification-close:hover {
                color: #666;
            }

            .mail-notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(0, 0, 0, 0.1);
                animation: progress linear;
            }

            .mail-notification.success .mail-notification-progress {
                background: #28a745;
            }

            .mail-notification.warning .mail-notification-progress {
                background: #ffc107;
            }

            .mail-notification.error .mail-notification-progress {
                background: #dc3545;
            }

            .mail-notification.info .mail-notification-progress {
                background: #17a2b8;
            }

            .mail-notification.mail .mail-notification-progress {
                background: #6f42c1;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            @keyframes progress {
                from {
                    width: 100%;
                }
                to {
                    width: 0%;
                }
            }

            .mail-notification.removing {
                animation: slideOut 0.3s ease-in forwards;
            }

            .mail-notification-actions {
                margin-top: 8px;
            }

            .mail-notification-actions .btn {
                margin-right: 8px;
                padding: 4px 12px;
                font-size: 12px;
            }

            .mail-notification-email-preview {
                background: #f8f9fa;
                border-radius: 4px;
                padding: 8px;
                margin-top: 8px;
                font-size: 12px;
            }

            .mail-notification-email-from {
                font-weight: 500;
                color: #495057;
            }

            .mail-notification-email-subject {
                color: #6c757d;
                margin-top: 2px;
            }

            .mail-notification-attachment {
                display: inline-flex;
                align-items: center;
                background: #e9ecef;
                border-radius: 12px;
                padding: 2px 8px;
                margin: 2px 4px 2px 0;
                font-size: 11px;
                color: #495057;
            }

            .mail-notification-attachment i {
                margin-right: 4px;
                font-size: 10px;
            }
        `;
        document.head.appendChild(styles);
    }

    /**
     * Show notification
     */
    show(type, title, message, options = {}) {
        const id = this.generateId();
        const duration = options.duration !== undefined ? options.duration : this.defaultDuration;
        const persistent = options.persistent || false;
        const actions = options.actions || [];
        const meta = options.meta || null;

        // Remove oldest notification if at limit
        if (this.notifications.size >= this.maxNotifications) {
            const oldestId = this.notifications.keys().next().value;
            this.remove(oldestId);
        }

        const notification = this.createNotification(id, type, title, message, duration, persistent, actions, meta);
        this.container.appendChild(notification);
        this.notifications.set(id, notification);

        // Auto-remove after duration (unless persistent)
        if (!persistent && duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }

        return id;
    }

    /**
     * Create notification element
     */
    createNotification(id, type, title, message, duration, persistent, actions, meta) {
        const notification = document.createElement('div');
        notification.className = `mail-notification ${type}`;
        notification.dataset.id = id;

        const icon = this.getIcon(type);
        
        let content = `
            <div class="mail-notification-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="mail-notification-content">
                <div class="mail-notification-title">${this.escapeHtml(title)}</div>
                <div class="mail-notification-message">${this.escapeHtml(message)}</div>
        `;

        // Add meta information
        if (meta) {
            if (meta.email) {
                content += this.createEmailPreview(meta.email);
            }
            if (meta.attachments && meta.attachments.length > 0) {
                content += this.createAttachmentList(meta.attachments);
            }
            if (meta.timestamp) {
                content += `<div class="mail-notification-meta">
                    <i class="fas fa-clock"></i> ${this.formatTimestamp(meta.timestamp)}
                </div>`;
            }
        }

        // Add actions
        if (actions.length > 0) {
            content += this.createActions(actions);
        }

        content += `
            </div>
            ${!persistent ? '<button class="mail-notification-close" aria-label="Close"><i class="fas fa-times"></i></button>' : ''}
            ${!persistent && duration > 0 ? `<div class="mail-notification-progress" style="animation-duration: ${duration}ms;"></div>` : ''}
        `;

        notification.innerHTML = content;

        // Add close button event
        const closeBtn = notification.querySelector('.mail-notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.remove(id);
            });
        }

        // Add action button events
        actions.forEach((action, index) => {
            const actionBtn = notification.querySelector(`[data-action="${index}"]`);
            if (actionBtn) {
                actionBtn.addEventListener('click', () => {
                    if (action.handler) {
                        action.handler();
                    }
                    if (action.closeOnClick !== false) {
                        this.remove(id);
                    }
                });
            }
        });

        return notification;
    }

    /**
     * Create email preview
     */
    createEmailPreview(email) {
        return `
            <div class="mail-notification-email-preview">
                <div class="mail-notification-email-from">
                    <i class="fas fa-user"></i> ${this.escapeHtml(email.from)}
                </div>
                <div class="mail-notification-email-subject">
                    <i class="fas fa-envelope"></i> ${this.escapeHtml(email.subject)}
                </div>
            </div>
        `;
    }

    /**
     * Create attachment list
     */
    createAttachmentList(attachments) {
        const attachmentItems = attachments.map(attachment => {
            const icon = this.getAttachmentIcon(attachment.type);
            return `<span class="mail-notification-attachment">
                <i class="fas ${icon}"></i>
                ${this.escapeHtml(attachment.name)}
            </span>`;
        }).join('');

        return `<div class="mail-notification-attachments">${attachmentItems}</div>`;
    }

    /**
     * Create action buttons
     */
    createActions(actions) {
        const actionsHtml = actions.map((action, index) => {
            const btnClass = action.primary ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
            return `<button class="${btnClass}" data-action="${index}">${this.escapeHtml(action.label)}</button>`;
        }).join('');

        return `<div class="mail-notification-actions">${actionsHtml}</div>`;
    }

    /**
     * Get icon for notification type
     */
    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
            mail: 'fa-envelope'
        };
        return icons[type] || icons.info;
    }

    /**
     * Get icon for attachment type
     */
    getAttachmentIcon(type) {
        if (type.startsWith('image/')) return 'fa-image';
        if (type.includes('pdf')) return 'fa-file-pdf';
        if (type.includes('word')) return 'fa-file-word';
        if (type.includes('excel') || type.includes('spreadsheet')) return 'fa-file-excel';
        if (type.includes('powerpoint') || type.includes('presentation')) return 'fa-file-powerpoint';
        if (type.startsWith('video/')) return 'fa-file-video';
        if (type.startsWith('audio/')) return 'fa-file-audio';
        if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return 'fa-file-archive';
        return 'fa-file';
    }

    /**
     * Format timestamp
     */
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) { // Less than 1 minute
            return 'Just now';
        } else if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diff < 86400000) { // Less than 1 day
            const hours = Math.floor(diff / 3600000);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    /**
     * Remove notification
     */
    remove(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        notification.classList.add('removing');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.delete(id);
        }, 300);
    }

    /**
     * Clear all notifications
     */
    clear() {
        this.notifications.forEach((notification, id) => {
            this.remove(id);
        });
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'mail_notification_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Convenience methods
    success(title, message, options = {}) {
        return this.show('success', title, message, options);
    }

    error(title, message, options = {}) {
        return this.show('error', title, message, options);
    }

    warning(title, message, options = {}) {
        return this.show('warning', title, message, options);
    }

    info(title, message, options = {}) {
        return this.show('info', title, message, options);
    }

    mail(title, message, options = {}) {
        return this.show('mail', title, message, options);
    }

    // Mail-specific notifications
    newEmail(email, options = {}) {
        return this.mail('New Email', `From ${email.from}`, {
            ...options,
            meta: { email, timestamp: new Date() },
            actions: [
                {
                    label: 'View',
                    primary: true,
                    handler: () => {
                        if (options.onView) options.onView(email);
                    }
                },
                {
                    label: 'Mark as Read',
                    handler: () => {
                        if (options.onMarkRead) options.onMarkRead(email);
                    }
                }
            ]
        });
    }

    emailSent(to, subject, options = {}) {
        return this.success('Email Sent', `To ${to}`, {
            ...options,
            meta: { 
                email: { to, subject },
                timestamp: new Date()
            }
        });
    }

    emailDraft(subject, options = {}) {
        return this.info('Draft Saved', subject, {
            ...options,
            meta: { timestamp: new Date() }
        });
    }

    attachmentUploaded(filename, options = {}) {
        return this.success('Attachment Added', filename, {
            ...options,
            meta: { timestamp: new Date() }
        });
    }

    quotaWarning(usage, limit, options = {}) {
        const percentage = Math.round((usage / limit) * 100);
        return this.warning('Storage Warning', `Mailbox is ${percentage}% full`, {
            ...options,
            actions: [
                {
                    label: 'Manage Storage',
                    primary: true,
                    handler: () => {
                        if (options.onManageStorage) options.onManageStorage();
                    }
                }
            ]
        });
    }

    connectionLost(options = {}) {
        return this.error('Connection Lost', 'Unable to connect to mail server', {
            ...options,
            persistent: true,
            actions: [
                {
                    label: 'Retry',
                    primary: true,
                    handler: () => {
                        if (options.onRetry) options.onRetry();
                    }
                }
            ]
        });
    }

    // API response handlers
    handleApiSuccess(message = 'Operation completed successfully', title = 'Success') {
        return this.success(title, message);
    }

    handleApiError(error, title = 'Error') {
        let message = 'An unexpected error occurred';
        
        if (error instanceof APIError) {
            message = error.message;
            
            if (error.isValidationError() && error.data && error.data.errors) {
                const errors = Array.isArray(error.data.errors) 
                    ? error.data.errors 
                    : Object.values(error.data.errors).flat();
                message = errors.join(', ');
            }
        } else if (typeof error === 'string') {
            message = error;
        } else if (error && error.message) {
            message = error.message;
        }

        return this.error(title, message);
    }

    // Confirmation dialog
    confirm(title, message, options = {}) {
        return new Promise((resolve) => {
            const actions = [
                {
                    label: options.cancelLabel || 'Cancel',
                    handler: () => resolve(false)
                },
                {
                    label: options.confirmLabel || 'Confirm',
                    primary: true,
                    handler: () => resolve(true)
                }
            ];

            this.show('warning', title, message, {
                persistent: true,
                actions
            });
        });
    }

    // Loading notification
    loading(title, message = 'Please wait...') {
        return this.show('info', title, message, {
            persistent: true,
            duration: 0
        });
    }

    // Update existing notification
    update(id, type, title, message) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        notification.className = `mail-notification ${type}`;
        
        const titleEl = notification.querySelector('.mail-notification-title');
        const messageEl = notification.querySelector('.mail-notification-message');
        const iconEl = notification.querySelector('.mail-notification-icon i');
        
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;
        if (iconEl) iconEl.className = `fas ${this.getIcon(type)}`;
    }
}

// Create global instance
const mailNotifications = new MailNotificationManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MailNotificationManager;
} else {
    window.MailNotificationManager = MailNotificationManager;
    window.mailNotifications = mailNotifications;
}
