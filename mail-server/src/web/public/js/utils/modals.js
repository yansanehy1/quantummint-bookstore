/**
 * Modal Management Utilities for Mail Server
 * Handles modal creation, display, and interaction
 */
class MailModalManager {
    constructor() {
        this.modals = new Map();
        this.activeModal = null;
        this.modalStack = [];
        this.init();
    }

    /**
     * Initialize modal system
     */
    init() {
        this.setupStyles();
        this.setupEventListeners();
    }

    /**
     * Setup modal styles
     */
    setupStyles() {
        if (document.getElementById('mail-modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'mail-modal-styles';
        styles.textContent = `
            .mail-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }

            .mail-modal-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .mail-modal-container {
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                max-width: 90vw;
                max-height: 90vh;
                overflow: hidden;
                transform: scale(0.9) translateY(-20px);
                transition: transform 0.3s ease;
                position: relative;
            }

            .mail-modal-overlay.active .mail-modal-container {
                transform: scale(1) translateY(0);
            }

            .mail-modal-header {
                padding: 20px 24px 16px;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #f8f9fa;
            }

            .mail-modal-title {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
                color: #333;
            }

            .mail-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                color: #6c757d;
                cursor: pointer;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s ease, color 0.2s ease;
            }

            .mail-modal-close:hover {
                background-color: #e9ecef;
                color: #495057;
            }

            .mail-modal-body {
                padding: 24px;
                overflow-y: auto;
                max-height: calc(90vh - 140px);
            }

            .mail-modal-footer {
                padding: 16px 24px 20px;
                border-top: 1px solid #e9ecef;
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                background: #f8f9fa;
            }

            .mail-modal-sm .mail-modal-container {
                width: 400px;
            }

            .mail-modal-md .mail-modal-container {
                width: 600px;
            }

            .mail-modal-lg .mail-modal-container {
                width: 800px;
            }

            .mail-modal-xl .mail-modal-container {
                width: 1200px;
            }

            .mail-modal-fullscreen .mail-modal-container {
                width: 100vw;
                height: 100vh;
                max-width: none;
                max-height: none;
                border-radius: 0;
            }

            .mail-modal-form .form-group {
                margin-bottom: 1rem;
            }

            .mail-modal-form label {
                font-weight: 500;
                margin-bottom: 0.5rem;
                display: block;
            }

            .mail-modal-form .form-control {
                width: 100%;
                padding: 0.5rem 0.75rem;
                border: 1px solid #ced4da;
                border-radius: 0.25rem;
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            }

            .mail-modal-form .form-control:focus {
                border-color: #80bdff;
                outline: 0;
                box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
            }

            .mail-modal-form .form-control.is-invalid {
                border-color: #dc3545;
            }

            .mail-modal-form .invalid-feedback {
                display: block;
                width: 100%;
                margin-top: 0.25rem;
                font-size: 0.875rem;
                color: #dc3545;
            }
        `;
        document.head.appendChild(styles);
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close(this.activeModal);
            }
        });

        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('mail-modal-overlay') && this.activeModal) {
                this.close(this.activeModal);
            }
        });
    }

    /**
     * Create and show modal
     */
    show(options = {}) {
        const id = this.generateId();
        const modal = this.createModal(id, options);
        
        document.body.appendChild(modal);
        this.modals.set(id, modal);
        
        // Show modal with animation
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
        
        // Update active modal and stack
        if (this.activeModal) {
            this.modalStack.push(this.activeModal);
        }
        this.activeModal = id;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        return id;
    }

    /**
     * Create modal element
     */
    createModal(id, options) {
        const {
            title = 'Modal',
            content = '',
            size = 'md',
            closable = true,
            buttons = [],
            className = '',
            onShow = null,
            onHide = null
        } = options;

        const modal = document.createElement('div');
        modal.className = `mail-modal-overlay mail-modal-${size} ${className}`;
        modal.dataset.modalId = id;

        const container = document.createElement('div');
        container.className = 'mail-modal-container';

        // Header
        const header = document.createElement('div');
        header.className = 'mail-modal-header';
        header.innerHTML = `
            <h5 class="mail-modal-title">${this.escapeHtml(title)}</h5>
            ${closable ? '<button class="mail-modal-close" aria-label="Close"><i class="fas fa-times"></i></button>' : ''}
        `;

        // Body
        const body = document.createElement('div');
        body.className = 'mail-modal-body';
        body.innerHTML = content;

        // Footer
        const footer = document.createElement('div');
        footer.className = 'mail-modal-footer';
        
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = `btn ${button.className || 'btn-secondary'}`;
            btn.textContent = button.text;
            btn.onclick = () => {
                if (button.handler) {
                    button.handler(id);
                }
                if (button.close !== false) {
                    this.close(id);
                }
            };
            footer.appendChild(btn);
        });

        // Assemble modal
        container.appendChild(header);
        container.appendChild(body);
        if (buttons.length > 0) {
            container.appendChild(footer);
        }
        modal.appendChild(container);

        // Add event listeners
        if (closable) {
            const closeBtn = header.querySelector('.mail-modal-close');
            if (closeBtn) {
                closeBtn.onclick = () => this.close(id);
            }
        }

        // Store callbacks
        if (onShow) modal._onShow = onShow;
        if (onHide) modal._onHide = onHide;

        return modal;
    }

    /**
     * Close modal
     */
    close(id) {
        const modal = this.modals.get(id);
        if (!modal) return;

        // Call onHide callback
        if (modal._onHide) {
            modal._onHide(id);
        }

        // Hide with animation
        modal.classList.remove('active');
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            this.modals.delete(id);
            
            // Update active modal
            if (this.activeModal === id) {
                this.activeModal = this.modalStack.pop() || null;
            }
            
            // Restore body scroll if no modals
            if (this.modals.size === 0) {
                document.body.style.overflow = '';
            }
        }, 300);
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'mail_modal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Mail-specific modal methods
    
    /**
     * Show email compose modal
     */
    showComposeModal(options = {}) {
        const { to = '', subject = '', body = '', onSend = null } = options;
        
        return this.show({
            title: 'Compose Email',
            size: 'lg',
            content: `
                <form class="mail-modal-form" id="composeForm">
                    <div class="form-group">
                        <label for="composeTo">To:</label>
                        <input type="email" class="form-control" id="composeTo" name="to" value="${this.escapeHtml(to)}" required>
                    </div>
                    <div class="form-group">
                        <label for="composeSubject">Subject:</label>
                        <input type="text" class="form-control" id="composeSubject" name="subject" value="${this.escapeHtml(subject)}" required>
                    </div>
                    <div class="form-group">
                        <label for="composeBody">Message:</label>
                        <textarea class="form-control" id="composeBody" name="body" rows="10" required>${this.escapeHtml(body)}</textarea>
                    </div>
                </form>
            `,
            buttons: [
                {
                    text: 'Cancel',
                    className: 'btn-secondary'
                },
                {
                    text: 'Send',
                    className: 'btn-primary',
                    handler: (modalId) => {
                        const form = document.getElementById('composeForm');
                        const formData = new FormData(form);
                        const emailData = Object.fromEntries(formData.entries());
                        
                        if (onSend) {
                            onSend(emailData);
                        }
                    }
                }
            ]
        });
    }

    /**
     * Show email view modal
     */
    showEmailModal(email) {
        return this.show({
            title: `Email from ${email.from}`,
            size: 'lg',
            content: `
                <div class="email-details">
                    <div class="email-header">
                        <p><strong>From:</strong> ${this.escapeHtml(email.from)}</p>
                        <p><strong>To:</strong> ${this.escapeHtml(email.to)}</p>
                        <p><strong>Subject:</strong> ${this.escapeHtml(email.subject)}</p>
                        <p><strong>Date:</strong> ${new Date(email.date).toLocaleString()}</p>
                    </div>
                    <div class="email-body" style="margin-top: 20px; padding: 15px; border: 1px solid #e9ecef; border-radius: 4px;">
                        ${email.body}
                    </div>
                </div>
            `,
            buttons: [
                {
                    text: 'Reply',
                    className: 'btn-primary',
                    handler: () => {
                        this.showComposeModal({
                            to: email.from,
                            subject: `Re: ${email.subject}`
                        });
                    }
                },
                {
                    text: 'Close',
                    className: 'btn-secondary'
                }
            ]
        });
    }

    /**
     * Show confirmation dialog
     */
    confirm(title, message, options = {}) {
        return new Promise((resolve) => {
            this.show({
                title,
                content: `<p>${this.escapeHtml(message)}</p>`,
                size: options.size || 'sm',
                buttons: [
                    {
                        text: options.cancelText || 'Cancel',
                        className: 'btn-secondary',
                        handler: () => resolve(false)
                    },
                    {
                        text: options.confirmText || 'Confirm',
                        className: options.dangerous ? 'btn-danger' : 'btn-primary',
                        handler: () => resolve(true)
                    }
                ]
            });
        });
    }

    /**
     * Show alert dialog
     */
    alert(title, message, options = {}) {
        return new Promise((resolve) => {
            this.show({
                title,
                content: `<p>${this.escapeHtml(message)}</p>`,
                size: options.size || 'sm',
                buttons: [
                    {
                        text: options.buttonText || 'OK',
                        className: 'btn-primary',
                        handler: () => resolve()
                    }
                ]
            });
        });
    }
}

// Create global instance
const mailModals = new MailModalManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MailModalManager;
} else {
    window.MailModalManager = MailModalManager;
    window.mailModals = mailModals;
}
