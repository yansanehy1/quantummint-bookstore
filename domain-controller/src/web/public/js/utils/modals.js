/**
 * Modal Management Utilities for Domain Controller
 * Handles modal creation, display, and interaction
 */
class ModalManager {
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
        if (document.getElementById('modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .modal-overlay {
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

            .modal-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .modal-container {
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

            .modal-overlay.active .modal-container {
                transform: scale(1) translateY(0);
            }

            .modal-header {
                padding: 20px 24px 16px;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #f8f9fa;
            }

            .modal-title {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
                color: #333;
            }

            .modal-close {
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

            .modal-close:hover {
                background-color: #e9ecef;
                color: #495057;
            }

            .modal-body {
                padding: 24px;
                overflow-y: auto;
                max-height: calc(90vh - 140px);
            }

            .modal-footer {
                padding: 16px 24px 20px;
                border-top: 1px solid #e9ecef;
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                background: #f8f9fa;
            }

            .modal-sm .modal-container {
                width: 400px;
            }

            .modal-md .modal-container {
                width: 600px;
            }

            .modal-lg .modal-container {
                width: 800px;
            }

            .modal-xl .modal-container {
                width: 1200px;
            }

            .modal-fullscreen .modal-container {
                width: 100vw;
                height: 100vh;
                max-width: none;
                max-height: none;
                border-radius: 0;
            }

            .modal-loading {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px;
                color: #6c757d;
            }

            .modal-loading .spinner {
                width: 32px;
                height: 32px;
                border: 3px solid #e9ecef;
                border-top: 3px solid #007bff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 12px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .modal-form .form-group {
                margin-bottom: 1rem;
            }

            .modal-form label {
                font-weight: 500;
                margin-bottom: 0.5rem;
                display: block;
            }

            .modal-form .form-control {
                width: 100%;
                padding: 0.5rem 0.75rem;
                border: 1px solid #ced4da;
                border-radius: 0.25rem;
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            }

            .modal-form .form-control:focus {
                border-color: #80bdff;
                outline: 0;
                box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
            }

            .modal-form .form-control.is-invalid {
                border-color: #dc3545;
            }

            .modal-form .invalid-feedback {
                display: block;
                width: 100%;
                margin-top: 0.25rem;
                font-size: 0.875rem;
                color: #dc3545;
            }

            .modal-tabs {
                display: flex;
                border-bottom: 1px solid #e9ecef;
                margin: -24px -24px 24px -24px;
                padding: 0 24px;
            }

            .modal-tab {
                padding: 12px 16px;
                background: none;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                font-weight: 500;
                color: #6c757d;
                transition: color 0.2s ease, border-color 0.2s ease;
            }

            .modal-tab.active {
                color: #007bff;
                border-bottom-color: #007bff;
            }

            .modal-tab:hover {
                color: #495057;
            }

            .modal-tab-content {
                display: none;
            }

            .modal-tab-content.active {
                display: block;
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
            if (e.target.classList.contains('modal-overlay') && this.activeModal) {
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
            backdrop = true,
            keyboard = true,
            buttons = [],
            tabs = [],
            className = '',
            onShow = null,
            onHide = null
        } = options;

        const modal = document.createElement('div');
        modal.className = `modal-overlay modal-${size} ${className}`;
        modal.dataset.modalId = id;

        const container = document.createElement('div');
        container.className = 'modal-container';

        // Header
        const header = document.createElement('div');
        header.className = 'modal-header';
        header.innerHTML = `
            <h5 class="modal-title">${this.escapeHtml(title)}</h5>
            ${closable ? '<button class="modal-close" aria-label="Close"><i class="fas fa-times"></i></button>' : ''}
        `;

        // Body
        const body = document.createElement('div');
        body.className = 'modal-body';

        // Add tabs if provided
        if (tabs.length > 0) {
            const tabsContainer = this.createTabs(tabs);
            body.appendChild(tabsContainer);
        } else {
            body.innerHTML = content;
        }

        // Footer
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        
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
            const closeBtn = header.querySelector('.modal-close');
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
     * Create tabs for modal
     */
    createTabs(tabs) {
        const container = document.createElement('div');
        
        // Tab headers
        const tabHeaders = document.createElement('div');
        tabHeaders.className = 'modal-tabs';
        
        // Tab contents
        const tabContents = document.createElement('div');
        
        tabs.forEach((tab, index) => {
            // Tab header
            const tabHeader = document.createElement('button');
            tabHeader.className = `modal-tab ${index === 0 ? 'active' : ''}`;
            tabHeader.textContent = tab.title;
            tabHeader.onclick = () => this.switchTab(container, index);
            tabHeaders.appendChild(tabHeader);
            
            // Tab content
            const tabContent = document.createElement('div');
            tabContent.className = `modal-tab-content ${index === 0 ? 'active' : ''}`;
            tabContent.innerHTML = tab.content;
            tabContents.appendChild(tabContent);
        });
        
        container.appendChild(tabHeaders);
        container.appendChild(tabContents);
        
        return container;
    }

    /**
     * Switch active tab
     */
    switchTab(container, activeIndex) {
        const tabs = container.querySelectorAll('.modal-tab');
        const contents = container.querySelectorAll('.modal-tab-content');
        
        tabs.forEach((tab, index) => {
            tab.classList.toggle('active', index === activeIndex);
        });
        
        contents.forEach((content, index) => {
            content.classList.toggle('active', index === activeIndex);
        });
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
     * Close all modals
     */
    closeAll() {
        const modalIds = Array.from(this.modals.keys());
        modalIds.forEach(id => this.close(id));
    }

    /**
     * Update modal content
     */
    updateContent(id, content) {
        const modal = this.modals.get(id);
        if (!modal) return;

        const body = modal.querySelector('.modal-body');
        if (body) {
            body.innerHTML = content;
        }
    }

    /**
     * Update modal title
     */
    updateTitle(id, title) {
        const modal = this.modals.get(id);
        if (!modal) return;

        const titleElement = modal.querySelector('.modal-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    /**
     * Show loading state
     */
    showLoading(id, message = 'Loading...') {
        this.updateContent(id, `
            <div class="modal-loading">
                <div class="spinner"></div>
                <span>${this.escapeHtml(message)}</span>
            </div>
        `);
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'modal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
    
    /**
     * Show confirmation dialog
     */
    confirm(title, message, options = {}) {
        return new Promise((resolve) => {
            const id = this.show({
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
            const id = this.show({
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

    /**
     * Show form modal
     */
    form(title, fields, options = {}) {
        return new Promise((resolve, reject) => {
            const formHtml = this.createFormHtml(fields);
            
            const id = this.show({
                title,
                content: `<form class="modal-form">${formHtml}</form>`,
                size: options.size || 'md',
                buttons: [
                    {
                        text: options.cancelText || 'Cancel',
                        className: 'btn-secondary',
                        handler: () => reject(new Error('Form cancelled'))
                    },
                    {
                        text: options.submitText || 'Submit',
                        className: 'btn-primary',
                        handler: () => {
                            const modal = this.modals.get(id);
                            const form = modal.querySelector('.modal-form');
                            const formData = this.getFormData(form);
                            
                            if (options.validate) {
                                const validation = options.validate(formData);
                                if (!validation.valid) {
                                    this.showFormErrors(form, validation.errors);
                                    return;
                                }
                            }
                            
                            resolve(formData);
                        }
                    }
                ]
            });
        });
    }

    /**
     * Create form HTML from field definitions
     */
    createFormHtml(fields) {
        return fields.map(field => {
            const {
                name,
                label,
                type = 'text',
                required = false,
                placeholder = '',
                options = [],
                value = ''
            } = field;

            let inputHtml = '';
            
            switch (type) {
                case 'select':
                    const optionsHtml = options.map(opt => 
                        `<option value="${this.escapeHtml(opt.value)}" ${opt.value === value ? 'selected' : ''}>${this.escapeHtml(opt.text)}</option>`
                    ).join('');
                    inputHtml = `<select class="form-control" name="${name}" ${required ? 'required' : ''}>${optionsHtml}</select>`;
                    break;
                    
                case 'textarea':
                    inputHtml = `<textarea class="form-control" name="${name}" placeholder="${this.escapeHtml(placeholder)}" ${required ? 'required' : ''}>${this.escapeHtml(value)}</textarea>`;
                    break;
                    
                case 'checkbox':
                    inputHtml = `<input type="checkbox" name="${name}" value="1" ${value ? 'checked' : ''} ${required ? 'required' : ''}> ${this.escapeHtml(label)}`;
                    return `<div class="form-group"><label>${inputHtml}</label></div>`;
                    
                default:
                    inputHtml = `<input type="${type}" class="form-control" name="${name}" placeholder="${this.escapeHtml(placeholder)}" value="${this.escapeHtml(value)}" ${required ? 'required' : ''}>`;
            }

            return `
                <div class="form-group">
                    <label>${this.escapeHtml(label)}${required ? ' *' : ''}</label>
                    ${inputHtml}
                </div>
            `;
        }).join('');
    }

    /**
     * Get form data as object
     */
    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    /**
     * Show form validation errors
     */
    showFormErrors(form, errors) {
        // Clear existing errors
        form.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        });
        form.querySelectorAll('.invalid-feedback').forEach(error => {
            error.remove();
        });

        // Show new errors
        Object.entries(errors).forEach(([fieldName, messages]) => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.classList.add('is-invalid');
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'invalid-feedback';
                errorDiv.textContent = Array.isArray(messages) ? messages[0] : messages;
                
                field.parentNode.appendChild(errorDiv);
            }
        });
    }
}

// Create global instance
const modals = new ModalManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalManager;
} else {
    window.ModalManager = ModalManager;
    window.modals = modals;
}
