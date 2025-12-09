/**
 * Notification System for Domain Controller
 * Handles toast notifications, alerts, and user feedback
 */
class NotificationManager {
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
        this.container = document.getElementById('notification-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        }
    }

    /**
     * Setup notification styles
     */
    setupStyles() {
        if (document.getElementById('notification-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            }

            .notification {
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

            .notification.success {
                border-left-color: #28a745;
            }

            .notification.warning {
                border-left-color: #ffc107;
            }

            .notification.error {
                border-left-color: #dc3545;
            }

            .notification.info {
                border-left-color: #17a2b8;
            }

            .notification-icon {
                margin-right: 12px;
                font-size: 18px;
                flex-shrink: 0;
                margin-top: 2px;
            }

            .notification.success .notification-icon {
                color: #28a745;
            }

            .notification.warning .notification-icon {
                color: #ffc107;
            }

            .notification.error .notification-icon {
                color: #dc3545;
            }

            .notification.info .notification-icon {
                color: #17a2b8;
            }

            .notification-content {
                flex: 1;
            }

            .notification-title {
                font-weight: 600;
                margin-bottom: 4px;
                color: #333;
            }

            .notification-message {
                color: #666;
                font-size: 14px;
                line-height: 1.4;
            }

            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                color: #999;
                cursor: pointer;
                padding: 0;
                margin-left: 12px;
                flex-shrink: 0;
            }

            .notification-close:hover {
                color: #666;
            }

            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(0, 0, 0, 0.1);
                animation: progress linear;
            }

            .notification.success .notification-progress {
                background: #28a745;
            }

            .notification.warning .notification-progress {
                background: #ffc107;
            }

            .notification.error .notification-progress {
                background: #dc3545;
            }

            .notification.info .notification-progress {
                background: #17a2b8;
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

            .notification.removing {
                animation: slideOut 0.3s ease-in forwards;
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

        // Remove oldest notification if at limit
        if (this.notifications.size >= this.maxNotifications) {
            const oldestId = this.notifications.keys().next().value;
            this.remove(oldestId);
        }

        const notification = this.createNotification(id, type, title, message, duration, persistent, actions);
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
    createNotification(id, type, title, message, duration, persistent, actions) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.dataset.id = id;

        const icon = this.getIcon(type);
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${this.escapeHtml(title)}</div>
                <div class="notification-message">${this.escapeHtml(message)}</div>
                ${actions.length > 0 ? this.createActions(actions) : ''}
            </div>
            ${!persistent ? '<button class="notification-close" aria-label="Close"><i class="fas fa-times"></i></button>' : ''}
            ${!persistent && duration > 0 ? `<div class="notification-progress" style="animation-duration: ${duration}ms;"></div>` : ''}
        `;

        // Add close button event
        const closeBtn = notification.querySelector('.notification-close');
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
     * Create action buttons
     */
    createActions(actions) {
        const actionsHtml = actions.map((action, index) => {
            const btnClass = action.primary ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
            return `<button class="${btnClass}" data-action="${index}" style="margin-right: 8px; margin-top: 8px;">${this.escapeHtml(action.label)}</button>`;
        }).join('');

        return `<div class="notification-actions">${actionsHtml}</div>`;
    }

    /**
     * Get icon for notification type
     */
    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
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
        return 'notification_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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

        notification.className = `notification ${type}`;
        
        const titleEl = notification.querySelector('.notification-title');
        const messageEl = notification.querySelector('.notification-message');
        const iconEl = notification.querySelector('.notification-icon i');
        
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;
        if (iconEl) iconEl.className = `fas ${this.getIcon(type)}`;
    }
}

// Create global instance
const notifications = new NotificationManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
} else {
    window.NotificationManager = NotificationManager;
    window.notifications = notifications;
}
