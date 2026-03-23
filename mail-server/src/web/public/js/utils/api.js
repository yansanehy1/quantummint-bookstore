/**
 * API Utility Class for Mail Server
 * Handles HTTP requests, authentication, and error handling
 */
class MailAPI {
    constructor() {
        this.baseURL = window.location.origin;
        this.token = null;
        this.refreshToken = null;
        this.isRefreshing = false;
        this.failedQueue = [];
        this.init();
    }

    /**
     * Initialize API client
     */
    init() {
        this.loadTokens();
        this.setupInterceptors();
    }

    /**
     * Load tokens from storage
     */
    loadTokens() {
        this.token = localStorage.getItem('mail_token') || sessionStorage.getItem('mail_token');
        this.refreshToken = localStorage.getItem('mail_refresh_token') || sessionStorage.getItem('mail_refresh_token');
    }

    /**
     * Save tokens to storage
     */
    saveTokens(token, refreshToken, remember = false) {
        this.token = token;
        this.refreshToken = refreshToken;
        
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('mail_token', token);
        if (refreshToken) {
            storage.setItem('mail_refresh_token', refreshToken);
        }
    }

    /**
     * Clear tokens from storage
     */
    clearTokens() {
        this.token = null;
        this.refreshToken = null;
        localStorage.removeItem('mail_token');
        localStorage.removeItem('mail_refresh_token');
        sessionStorage.removeItem('mail_token');
        sessionStorage.removeItem('mail_refresh_token');
    }

    /**
     * Setup request/response interceptors
     */
    setupInterceptors() {
        // This would be used with axios if available
        // For now, we'll handle it in the request method
    }

    /**
     * Make HTTP request
     */
    async request(method, endpoint, data = null, options = {}) {
        const url = `${this.baseURL}/api${endpoint}`;
        const config = {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add authentication header
        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Add request body
        if (data && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, config);
            
            // Handle token refresh for 401 errors
            if (response.status === 401 && this.refreshToken && !options.skipRefresh) {
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    // Retry original request with new token
                    return this.request(method, endpoint, data, { ...options, skipRefresh: true });
                }
            }

            const responseData = await this.handleResponse(response);
            return responseData;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Handle response
     */
    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            throw new APIError(
                data.message || `HTTP ${response.status}`,
                response.status,
                data.code || 'HTTP_ERROR',
                data
            );
        }

        return data;
    }

    /**
     * Handle errors
     */
    handleError(error) {
        if (error instanceof APIError) {
            return error;
        }

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return new APIError(
                'Network connection failed',
                0,
                'NETWORK_ERROR',
                { originalError: error.message }
            );
        }

        return new APIError(
            error.message || 'Request failed',
            500,
            'REQUEST_ERROR',
            { originalError: error }
        );
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken() {
        if (this.isRefreshing) {
            return new Promise((resolve) => {
                this.failedQueue.push(resolve);
            });
        }

        this.isRefreshing = true;

        try {
            const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: this.refreshToken
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.saveTokens(data.token, data.refreshToken || this.refreshToken);
                
                // Process failed queue
                this.failedQueue.forEach(resolve => resolve(true));
                this.failedQueue = [];
                
                return true;
            } else {
                this.clearTokens();
                this.failedQueue.forEach(resolve => resolve(false));
                this.failedQueue = [];
                return false;
            }
        } catch (error) {
            this.clearTokens();
            this.failedQueue.forEach(resolve => resolve(false));
            this.failedQueue = [];
            return false;
        } finally {
            this.isRefreshing = false;
        }
    }

    // HTTP method helpers
    async get(endpoint, options = {}) {
        return this.request('GET', endpoint, null, options);
    }

    async post(endpoint, data, options = {}) {
        return this.request('POST', endpoint, data, options);
    }

    async put(endpoint, data, options = {}) {
        return this.request('PUT', endpoint, data, options);
    }

    async patch(endpoint, data, options = {}) {
        return this.request('PATCH', endpoint, data, options);
    }

    async delete(endpoint, options = {}) {
        return this.request('DELETE', endpoint, null, options);
    }

    // Authentication endpoints
    async login(email, password, remember = false) {
        const response = await this.post('/auth/login', { email, password });
        if (response.token) {
            this.saveTokens(response.token, response.refreshToken, remember);
        }
        return response;
    }

    async logout() {
        try {
            await this.post('/auth/logout');
        } catch (error) {
            // Continue with logout even if server request fails
        } finally {
            this.clearTokens();
        }
    }

    async changePassword(currentPassword, newPassword) {
        return this.post('/auth/change-password', {
            currentPassword,
            newPassword
        });
    }

    // Mail endpoints
    async getMailboxes() {
        return this.get('/mail/mailboxes');
    }

    async getEmails(mailbox = 'INBOX', options = {}) {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.search) params.append('search', options.search);
        if (options.unread) params.append('unread', options.unread);
        
        const query = params.toString();
        return this.get(`/mail/emails/${encodeURIComponent(mailbox)}${query ? `?${query}` : ''}`);
    }

    async getEmail(mailbox, uid) {
        return this.get(`/mail/emails/${encodeURIComponent(mailbox)}/${uid}`);
    }

    async markAsRead(mailbox, uid) {
        return this.patch(`/mail/emails/${encodeURIComponent(mailbox)}/${uid}/read`);
    }

    async markAsUnread(mailbox, uid) {
        return this.patch(`/mail/emails/${encodeURIComponent(mailbox)}/${uid}/unread`);
    }

    async deleteEmail(mailbox, uid) {
        return this.delete(`/mail/emails/${encodeURIComponent(mailbox)}/${uid}`);
    }

    async moveEmail(mailbox, uid, targetMailbox) {
        return this.patch(`/mail/emails/${encodeURIComponent(mailbox)}/${uid}/move`, {
            targetMailbox
        });
    }

    async sendEmail(emailData) {
        return this.post('/mail/send', emailData);
    }

    async saveDraft(emailData) {
        return this.post('/mail/drafts', emailData);
    }

    async getDrafts() {
        return this.get('/mail/drafts');
    }

    async updateDraft(draftId, emailData) {
        return this.put(`/mail/drafts/${draftId}`, emailData);
    }

    async deleteDraft(draftId) {
        return this.delete(`/mail/drafts/${draftId}`);
    }

    // Attachment endpoints
    async uploadAttachment(file, onProgress = null) {
        const formData = new FormData();
        formData.append('file', file);

        const config = {
            method: 'POST',
            body: formData,
            headers: {}
        };

        // Add auth header
        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Handle progress if callback provided
        if (onProgress && typeof onProgress === 'function') {
            // This would need XMLHttpRequest for progress tracking
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete);
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            resolve(response);
                        } catch (e) {
                            resolve(xhr.responseText);
                        }
                    } else {
                        reject(new APIError(`Upload failed: ${xhr.status}`, xhr.status));
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new APIError('Upload failed', 0, 'NETWORK_ERROR'));
                });

                xhr.open('POST', `${this.baseURL}/api/mail/attachments`);
                if (this.token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
                }
                xhr.send(formData);
            });
        }

        return fetch(`${this.baseURL}/api/mail/attachments`, config)
            .then(response => this.handleResponse(response));
    }

    async getAttachment(attachmentId) {
        return this.get(`/mail/attachments/${attachmentId}`);
    }

    async deleteAttachment(attachmentId) {
        return this.delete(`/mail/attachments/${attachmentId}`);
    }

    // Contact endpoints
    async getContacts() {
        return this.get('/mail/contacts');
    }

    async addContact(contactData) {
        return this.post('/mail/contacts', contactData);
    }

    async updateContact(contactId, contactData) {
        return this.put(`/mail/contacts/${contactId}`, contactData);
    }

    async deleteContact(contactId) {
        return this.delete(`/mail/contacts/${contactId}`);
    }

    // Account management endpoints
    async getAccountInfo() {
        return this.get('/mail/account');
    }

    async updateAccountSettings(settings) {
        return this.patch('/mail/account/settings', settings);
    }

    async getMailboxQuota() {
        return this.get('/mail/account/quota');
    }

    // Domain management endpoints (for admin users)
    async getDomains() {
        return this.get('/mail/domains');
    }

    async addDomain(domainData) {
        return this.post('/mail/domains', domainData);
    }

    async updateDomain(domainId, domainData) {
        return this.put(`/mail/domains/${domainId}`, domainData);
    }

    async deleteDomain(domainId) {
        return this.delete(`/mail/domains/${domainId}`);
    }

    async verifyDomain(domainId) {
        return this.post(`/mail/domains/${domainId}/verify`);
    }

    // User management endpoints (for admin users)
    async getUsers() {
        return this.get('/mail/users');
    }

    async addUser(userData) {
        return this.post('/mail/users', userData);
    }

    async updateUser(userId, userData) {
        return this.put(`/mail/users/${userId}`, userData);
    }

    async deleteUser(userId) {
        return this.delete(`/mail/users/${userId}`);
    }

    async resetUserPassword(userId) {
        return this.post(`/mail/users/${userId}/reset-password`);
    }

    // Security endpoints
    async getSecurityLogs() {
        return this.get('/mail/security/logs');
    }

    async getFailedLogins() {
        return this.get('/mail/security/failed-logins');
    }

    async updateSecuritySettings(settings) {
        return this.patch('/mail/security/settings', settings);
    }

    // Analytics endpoints
    async getMailStats(period = '7d') {
        return this.get(`/mail/analytics/stats?period=${period}`);
    }

    async getStorageStats() {
        return this.get('/mail/analytics/storage');
    }

    async getActivityLogs() {
        return this.get('/mail/analytics/activity');
    }

    // System endpoints
    async getSystemStatus() {
        return this.get('/mail/system/status');
    }

    async getSystemHealth() {
        return this.get('/mail/system/health');
    }

    async getSystemLogs() {
        return this.get('/mail/system/logs');
    }

    // Utility methods
    isAuthenticated() {
        return !!this.token;
    }

    getToken() {
        return this.token;
    }

    setToken(token) {
        this.token = token;
    }
}

// Custom API Error class (if not already defined)
if (typeof APIError === 'undefined') {
    class APIError extends Error {
        constructor(message, status = 500, code = null, data = null) {
            super(message);
            this.name = 'APIError';
            this.status = status;
            this.code = code;
            this.data = data;
            this.timestamp = new Date().toISOString();
        }

        isValidationError() {
            return this.status === 400 || this.code === 'VALIDATION_ERROR';
        }

        isAuthError() {
            return this.status === 401 || this.code === 'AUTH_ERROR';
        }

        isAuthorizationError() {
            return this.status === 403 || this.code === 'AUTHORIZATION_ERROR';
        }

        isNotFoundError() {
            return this.status === 404 || this.code === 'NOT_FOUND';
        }

        isServerError() {
            return this.status >= 500;
        }

        isNetworkError() {
            return this.code === 'NETWORK_ERROR' || this.code === 'TIMEOUT';
        }
    }
    
    window.APIError = APIError;
}

// Create global instance
const mailAPI = new MailAPI();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MailAPI;
} else {
    window.MailAPI = MailAPI;
    window.mailAPI = mailAPI;
}
