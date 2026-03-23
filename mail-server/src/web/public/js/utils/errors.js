/**
 * Error Handling Utilities for Mail Server
 * Provides comprehensive error handling, logging, and user feedback
 */

/**
 * Custom Mail API Error class
 */
class MailAPIError extends Error {
    constructor(message, status = 500, code = null, data = null) {
        super(message);
        this.name = 'MailAPIError';
        this.status = status;
        this.code = code;
        this.data = data;
        this.timestamp = new Date().toISOString();
    }

    /**
     * Check if error is a validation error
     */
    isValidationError() {
        return this.status === 400 || this.code === 'VALIDATION_ERROR';
    }

    /**
     * Check if error is an authentication error
     */
    isAuthError() {
        return this.status === 401 || this.code === 'AUTH_ERROR';
    }

    /**
     * Check if error is an authorization error
     */
    isAuthorizationError() {
        return this.status === 403 || this.code === 'AUTHORIZATION_ERROR';
    }

    /**
     * Check if error is a not found error
     */
    isNotFoundError() {
        return this.status === 404 || this.code === 'NOT_FOUND';
    }

    /**
     * Check if error is a server error
     */
    isServerError() {
        return this.status >= 500;
    }

    /**
     * Check if error is a network error
     */
    isNetworkError() {
        return this.code === 'NETWORK_ERROR' || this.code === 'TIMEOUT';
    }

    /**
     * Check if error is mail-specific
     */
    isMailError() {
        return ['MAIL_SEND_ERROR', 'MAIL_RECEIVE_ERROR', 'MAILBOX_ERROR', 'QUOTA_EXCEEDED'].includes(this.code);
    }

    /**
     * Check if error is attachment-related
     */
    isAttachmentError() {
        return ['ATTACHMENT_TOO_LARGE', 'ATTACHMENT_TYPE_NOT_ALLOWED', 'ATTACHMENT_UPLOAD_FAILED'].includes(this.code);
    }

    /**
     * Get user-friendly error message
     */
    getUserMessage() {
        if (this.isValidationError()) {
            return this.data && this.data.message ? this.data.message : 'Please check your input and try again.';
        }
        
        if (this.isAuthError()) {
            return 'Please log in to continue.';
        }
        
        if (this.isAuthorizationError()) {
            return 'You do not have permission to perform this action.';
        }
        
        if (this.isNotFoundError()) {
            return 'The requested resource was not found.';
        }
        
        if (this.isNetworkError()) {
            return 'Network connection error. Please check your internet connection and try again.';
        }
        
        if (this.isMailError()) {
            switch (this.code) {
                case 'MAIL_SEND_ERROR':
                    return 'Failed to send email. Please try again.';
                case 'MAIL_RECEIVE_ERROR':
                    return 'Failed to receive emails. Please refresh and try again.';
                case 'MAILBOX_ERROR':
                    return 'Mailbox operation failed. Please try again.';
                case 'QUOTA_EXCEEDED':
                    return 'Mailbox storage quota exceeded. Please delete some emails or contact administrator.';
                default:
                    return 'Mail operation failed. Please try again.';
            }
        }
        
        if (this.isAttachmentError()) {
            switch (this.code) {
                case 'ATTACHMENT_TOO_LARGE':
                    return 'Attachment file is too large. Please choose a smaller file.';
                case 'ATTACHMENT_TYPE_NOT_ALLOWED':
                    return 'This file type is not allowed as an attachment.';
                case 'ATTACHMENT_UPLOAD_FAILED':
                    return 'Failed to upload attachment. Please try again.';
                default:
                    return 'Attachment operation failed. Please try again.';
            }
        }
        
        if (this.isServerError()) {
            return 'A server error occurred. Please try again later.';
        }
        
        return this.message || 'An unexpected error occurred.';
    }

    /**
     * Convert to JSON for logging
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            code: this.code,
            data: this.data,
            timestamp: this.timestamp,
            stack: this.stack
        };
    }
}

/**
 * Mail Error Handler class
 */
class MailErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 100;
        this.setupGlobalHandlers();
    }

    /**
     * Setup global error handlers
     */
    setupGlobalHandlers() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.logError(event.reason, 'unhandledrejection');
            
            // Show user notification for critical errors
            if (window.mailNotifications) {
                window.mailNotifications.error(
                    'Unexpected Error',
                    'An unexpected error occurred. Please refresh the page if problems persist.'
                );
            }
        });

        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('JavaScript error:', event.error);
            this.logError(event.error, 'javascript');
        });

        // Handle resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                console.error('Resource loading error:', event.target.src || event.target.href);
                this.logError({
                    message: 'Failed to load resource',
                    resource: event.target.src || event.target.href,
                    type: event.target.tagName
                }, 'resource');
            }
        }, true);
    }

    /**
     * Handle API errors
     */
    handleApiError(error, context = '') {
        let apiError;

        if (error instanceof MailAPIError) {
            apiError = error;
        } else if (error.response) {
            // Axios error with response
            const { status, data } = error.response;
            apiError = new MailAPIError(
                data.message || error.message || 'API request failed',
                status,
                data.code || 'API_ERROR',
                data
            );
        } else if (error.request) {
            // Network error
            apiError = new MailAPIError(
                'Network connection failed',
                0,
                'NETWORK_ERROR',
                { originalError: error.message }
            );
        } else {
            // Other error
            apiError = new MailAPIError(
                error.message || 'Unknown error occurred',
                500,
                'UNKNOWN_ERROR',
                { originalError: error }
            );
        }

        this.logError(apiError, context);
        return apiError;
    }

    /**
     * Handle mail-specific errors
     */
    handleMailError(error, operation = 'mail_operation') {
        let mailError;

        if (error instanceof MailAPIError) {
            mailError = error;
        } else {
            mailError = new MailAPIError(
                error.message || 'Mail operation failed',
                error.status || 500,
                error.code || 'MAIL_ERROR',
                error.data || null
            );
        }

        this.logError(mailError, operation);

        // Show appropriate notification
        if (window.mailNotifications) {
            if (mailError.isQuotaError()) {
                window.mailNotifications.quotaWarning(
                    mailError.data?.usage || 0,
                    mailError.data?.limit || 100
                );
            } else if (mailError.isAttachmentError()) {
                window.mailNotifications.error(
                    'Attachment Error',
                    mailError.getUserMessage()
                );
            } else if (mailError.isMailError()) {
                window.mailNotifications.error(
                    'Mail Error',
                    mailError.getUserMessage()
                );
            } else {
                window.mailNotifications.handleApiError(mailError);
            }
        }

        return mailError;
    }

    /**
     * Handle form validation errors
     */
    handleValidationError(errors, formElement = null) {
        const validationError = new MailAPIError(
            'Form validation failed',
            400,
            'VALIDATION_ERROR',
            { errors }
        );

        this.logError(validationError, 'form_validation');

        // Display field-specific errors if form element provided
        if (formElement) {
            this.displayFieldErrors(errors, formElement);
        }

        return validationError;
    }

    /**
     * Display field-specific validation errors
     */
    displayFieldErrors(errors, formElement) {
        // Clear existing errors
        const existingErrors = formElement.querySelectorAll('.field-error');
        existingErrors.forEach(error => error.remove());

        // Display new errors
        Object.entries(errors).forEach(([fieldName, fieldErrors]) => {
            const field = formElement.querySelector(`[name="${fieldName}"]`);
            if (field) {
                const errorMessages = Array.isArray(fieldErrors) ? fieldErrors : [fieldErrors];
                errorMessages.forEach(message => {
                    this.showFieldError(field, message);
                });
            }
        });
    }

    /**
     * Show error message for specific field
     */
    showFieldError(field, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error text-danger small mt-1';
        errorElement.textContent = message;
        
        // Add error styling to field
        field.classList.add('is-invalid');
        
        // Insert error message after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
        
        // Remove error on field change
        const removeError = () => {
            field.classList.remove('is-invalid');
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
            field.removeEventListener('input', removeError);
            field.removeEventListener('change', removeError);
        };
        
        field.addEventListener('input', removeError);
        field.addEventListener('change', removeError);
    }

    /**
     * Handle authentication errors
     */
    handleAuthError(error) {
        const authError = this.handleApiError(error, 'authentication');
        
        // Clear stored authentication data
        localStorage.removeItem('mail_token');
        localStorage.removeItem('mail_refresh_token');
        sessionStorage.removeItem('mail_token');
        sessionStorage.removeItem('mail_refresh_token');
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
            // Show notification before redirect
            if (window.mailNotifications) {
                window.mailNotifications.warning(
                    'Session Expired',
                    'Please log in again to continue.',
                    { duration: 3000 }
                );
            }
            
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        }
        
        return authError;
    }

    /**
     * Handle network errors
     */
    handleNetworkError(error) {
        const networkError = this.handleApiError(error, 'network');
        
        // Show user-friendly network error message
        if (window.mailNotifications) {
            window.mailNotifications.connectionLost({
                onRetry: () => {
                    window.location.reload();
                }
            });
        }
        
        return networkError;
    }

    /**
     * Handle attachment upload errors
     */
    handleAttachmentError(error, filename = '') {
        let attachmentError;

        if (error instanceof MailAPIError) {
            attachmentError = error;
        } else {
            // Determine error type based on error message or status
            let code = 'ATTACHMENT_UPLOAD_FAILED';
            if (error.message && error.message.includes('too large')) {
                code = 'ATTACHMENT_TOO_LARGE';
            } else if (error.message && error.message.includes('not allowed')) {
                code = 'ATTACHMENT_TYPE_NOT_ALLOWED';
            }

            attachmentError = new MailAPIError(
                error.message || 'Attachment upload failed',
                error.status || 400,
                code,
                { filename }
            );
        }

        this.logError(attachmentError, 'attachment_upload');

        // Show notification
        if (window.mailNotifications) {
            window.mailNotifications.error(
                'Attachment Error',
                attachmentError.getUserMessage()
            );
        }

        return attachmentError;
    }

    /**
     * Log error to console and internal log
     */
    logError(error, context = '') {
        const logEntry = {
            timestamp: new Date().toISOString(),
            context,
            error: error instanceof Error ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
                ...(error instanceof MailAPIError ? error.toJSON() : {})
            } : error,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Add to internal log
        this.errorLog.unshift(logEntry);
        
        // Maintain log size limit
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog = this.errorLog.slice(0, this.maxLogSize);
        }

        // Console logging with context
        const contextStr = context ? `[${context}]` : '';
        console.error(`${contextStr} Mail Error logged:`, logEntry);

        // Send to server if available (optional)
        this.sendErrorToServer(logEntry);
    }

    /**
     * Send error to server for logging (optional)
     */
    async sendErrorToServer(logEntry) {
        try {
            // Only send critical errors to avoid spam
            if (logEntry.error.status >= 500 || logEntry.context === 'javascript') {
                // This would be implemented based on your logging endpoint
                // await fetch('/api/mail/logs/error', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(logEntry)
                // });
            }
        } catch (e) {
            // Silently fail to avoid infinite error loops
            console.warn('Failed to send error to server:', e);
        }
    }

    /**
     * Get error log for debugging
     */
    getErrorLog() {
        return [...this.errorLog];
    }

    /**
     * Clear error log
     */
    clearErrorLog() {
        this.errorLog = [];
    }

    /**
     * Create error boundary for mail components
     */
    createErrorBoundary(element, fallbackContent = 'An error occurred while loading this mail content.') {
        const originalContent = element.innerHTML;
        
        try {
            // Wrap element content in error boundary
            const wrapper = document.createElement('div');
            wrapper.className = 'mail-error-boundary';
            wrapper.innerHTML = originalContent;
            
            element.innerHTML = '';
            element.appendChild(wrapper);
            
            return {
                catch: (error) => {
                    this.logError(error, 'mail_component_error');
                    element.innerHTML = `
                        <div class="alert alert-danger">
                            <i class="fas fa-exclamation-triangle"></i>
                            <strong>Error:</strong> ${fallbackContent}
                            <button class="btn btn-sm btn-outline-danger ml-2" onclick="location.reload()">
                                Reload Page
                            </button>
                        </div>
                    `;
                }
            };
        } catch (error) {
            this.logError(error, 'error_boundary_creation');
            return { catch: () => {} };
        }
    }

    /**
     * Retry function with exponential backoff for mail operations
     */
    async retryMailOperation(fn, maxAttempts = 3, baseDelay = 1000) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                
                if (attempt === maxAttempts) {
                    break;
                }
                
                // Don't retry auth errors
                if (error.status === 401 || error.status === 403) {
                    break;
                }
                
                // Exponential backoff
                const delay = baseDelay * Math.pow(2, attempt - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
                
                console.warn(`Mail operation attempt ${attempt} failed, retrying in ${delay}ms...`, error);
            }
        }
        
        throw this.handleApiError(lastError, 'retry_exhausted');
    }

    /**
     * Handle quota exceeded errors
     */
    handleQuotaError(error, usage, limit) {
        const quotaError = new MailAPIError(
            'Mailbox storage quota exceeded',
            413,
            'QUOTA_EXCEEDED',
            { usage, limit }
        );

        this.logError(quotaError, 'quota_exceeded');

        // Show quota warning notification
        if (window.mailNotifications) {
            window.mailNotifications.quotaWarning(usage, limit, {
                onManageStorage: () => {
                    // Navigate to storage management page
                    window.location.href = '/account#storage';
                }
            });
        }

        return quotaError;
    }

    /**
     * Handle email composition errors
     */
    handleComposeError(error, emailData = {}) {
        const composeError = this.handleApiError(error, 'email_compose');
        
        // Auto-save draft if composition fails
        if (emailData.subject || emailData.body) {
            try {
                const draftData = {
                    ...emailData,
                    timestamp: new Date().toISOString(),
                    error: composeError.message
                };
                localStorage.setItem('mail_draft_backup', JSON.stringify(draftData));
                
                if (window.mailNotifications) {
                    window.mailNotifications.info(
                        'Draft Saved',
                        'Your email has been saved as a backup draft.',
                        {
                            actions: [
                                {
                                    label: 'Restore Draft',
                                    primary: true,
                                    handler: () => {
                                        // Restore draft functionality would be implemented here
                                        console.log('Restoring draft:', draftData);
                                    }
                                }
                            ]
                        }
                    );
                }
            } catch (e) {
                console.warn('Failed to save draft backup:', e);
            }
        }

        return composeError;
    }
}

/**
 * Mail Error Utility functions
 */
const MailErrorUtils = {
    /**
     * Safe async function wrapper for mail operations
     */
    async safeMailAsync(fn, fallback = null) {
        try {
            return await fn();
        } catch (error) {
            mailErrorHandler.handleMailError(error, 'safe_mail_async');
            return fallback;
        }
    },

    /**
     * Safe function wrapper for mail operations
     */
    safeMailSync(fn, fallback = null) {
        try {
            return fn();
        } catch (error) {
            mailErrorHandler.logError(error, 'safe_mail_sync');
            return fallback;
        }
    },

    /**
     * Debounced error handler for mail operations
     */
    debounceMailError: (() => {
        const errorCounts = new Map();
        const resetTimeout = new Map();
        
        return (error, context, maxCount = 3, timeWindow = 5000) => {
            const key = `${context}_${error.message}`;
            const count = errorCounts.get(key) || 0;
            
            if (count < maxCount) {
                errorCounts.set(key, count + 1);
                mailErrorHandler.logError(error, context);
                
                // Reset counter after time window
                if (resetTimeout.has(key)) {
                    clearTimeout(resetTimeout.get(key));
                }
                
                resetTimeout.set(key, setTimeout(() => {
                    errorCounts.delete(key);
                    resetTimeout.delete(key);
                }, timeWindow));
                
                return true;
            }
            
            return false; // Error suppressed due to rate limiting
        };
    })(),

    /**
     * Validate email operation before execution
     */
    validateMailOperation(operation, data) {
        switch (operation) {
            case 'send':
                if (!data.to || !data.subject) {
                    throw new MailAPIError('Missing required fields', 400, 'VALIDATION_ERROR');
                }
                break;
            case 'upload_attachment':
                if (!data.file) {
                    throw new MailAPIError('No file selected', 400, 'VALIDATION_ERROR');
                }
                if (data.file.size > 25 * 1024 * 1024) { // 25MB limit
                    throw new MailAPIError('File too large', 413, 'ATTACHMENT_TOO_LARGE');
                }
                break;
            default:
                break;
        }
    }
};

// Create global error handler instance
const mailErrorHandler = new MailErrorHandler();

// Make MailAPIError available globally if APIError doesn't exist
if (typeof APIError === 'undefined') {
    window.APIError = MailAPIError;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MailAPIError, MailErrorHandler, MailErrorUtils };
} else {
    window.MailAPIError = MailAPIError;
    window.MailErrorHandler = MailErrorHandler;
    window.MailErrorUtils = MailErrorUtils;
    window.mailErrorHandler = mailErrorHandler;
}
