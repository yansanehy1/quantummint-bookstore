/**
 * Error Handling Utilities for Domain Controller
 * Provides comprehensive error handling, logging, and user feedback
 */

/**
 * Custom API Error class
 */
class APIError extends Error {
    constructor(message, status = 500, code = null, data = null) {
        super(message);
        this.name = 'APIError';
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
 * Error Handler class
 */
class ErrorHandler {
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
            if (window.notifications) {
                window.notifications.error(
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

        if (error instanceof APIError) {
            apiError = error;
        } else if (error.response) {
            // Axios error with response
            const { status, data } = error.response;
            apiError = new APIError(
                data.message || error.message || 'API request failed',
                status,
                data.code || 'API_ERROR',
                data
            );
        } else if (error.request) {
            // Network error
            apiError = new APIError(
                'Network connection failed',
                0,
                'NETWORK_ERROR',
                { originalError: error.message }
            );
        } else {
            // Other error
            apiError = new APIError(
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
     * Handle form validation errors
     */
    handleValidationError(errors, formElement = null) {
        const validationError = new APIError(
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
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
            // Show notification before redirect
            if (window.notifications) {
                window.notifications.warning(
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
        if (window.notifications) {
            window.notifications.error(
                'Connection Error',
                'Unable to connect to the server. Please check your internet connection and try again.',
                { duration: 8000 }
            );
        }
        
        return networkError;
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
                ...(error instanceof APIError ? error.toJSON() : {})
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
        console.error(`${contextStr} Error logged:`, logEntry);

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
                // await fetch('/api/logs/error', {
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
     * Create error boundary for components
     */
    createErrorBoundary(element, fallbackContent = 'An error occurred while loading this content.') {
        const originalContent = element.innerHTML;
        
        try {
            // Wrap element content in error boundary
            const wrapper = document.createElement('div');
            wrapper.className = 'error-boundary';
            wrapper.innerHTML = originalContent;
            
            element.innerHTML = '';
            element.appendChild(wrapper);
            
            return {
                catch: (error) => {
                    this.logError(error, 'component_error');
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
     * Retry function with exponential backoff
     */
    async retry(fn, maxAttempts = 3, baseDelay = 1000) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                
                if (attempt === maxAttempts) {
                    break;
                }
                
                // Exponential backoff
                const delay = baseDelay * Math.pow(2, attempt - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
                
                console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error);
            }
        }
        
        throw this.handleApiError(lastError, 'retry_exhausted');
    }
}

/**
 * Utility functions
 */
const ErrorUtils = {
    /**
     * Safe async function wrapper
     */
    async safeAsync(fn, fallback = null) {
        try {
            return await fn();
        } catch (error) {
            errorHandler.logError(error, 'safe_async');
            return fallback;
        }
    },

    /**
     * Safe function wrapper
     */
    safe(fn, fallback = null) {
        try {
            return fn();
        } catch (error) {
            errorHandler.logError(error, 'safe_sync');
            return fallback;
        }
    },

    /**
     * Debounced error handler
     */
    debounceError: (() => {
        const errorCounts = new Map();
        const resetTimeout = new Map();
        
        return (error, context, maxCount = 3, timeWindow = 5000) => {
            const key = `${context}_${error.message}`;
            const count = errorCounts.get(key) || 0;
            
            if (count < maxCount) {
                errorCounts.set(key, count + 1);
                errorHandler.logError(error, context);
                
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
    })()
};

// Create global error handler instance
const errorHandler = new ErrorHandler();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIError, ErrorHandler, ErrorUtils };
} else {
    window.APIError = APIError;
    window.ErrorHandler = ErrorHandler;
    window.ErrorUtils = ErrorUtils;
    window.errorHandler = errorHandler;
}
