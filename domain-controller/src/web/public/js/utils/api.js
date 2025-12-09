/**
 * API Utility Class for Domain Controller
 * Handles all HTTP requests with authentication and error handling
 */
class DomainAPI {
    constructor() {
        this.baseURL = '/api';
        this.token = null;
        this.refreshing = false;
    }

    /**
     * Set authentication token
     */
    setToken(token) {
        this.token = token;
    }

    /**
     * Get authentication headers
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    /**
     * Make HTTP request with error handling
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: this.getHeaders(),
            credentials: 'include',
            ...options
        };

        if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            
            // Handle authentication errors
            if (response.status === 401) {
                if (!this.refreshing) {
                    this.refreshing = true;
                    try {
                        await this.refreshToken();
                        this.refreshing = false;
                        // Retry original request
                        config.headers = this.getHeaders();
                        return await fetch(url, config);
                    } catch (error) {
                        this.refreshing = false;
                        this.handleAuthError();
                        throw new Error('Authentication failed');
                    }
                }
            }

            // Handle other HTTP errors
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new APIError(
                    errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    errorData
                );
            }

            // Parse JSON response
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }

            return response;
        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }
            throw new APIError(`Network error: ${error.message}`, 0, error);
        }
    }

    /**
     * GET request
     */
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url);
    }

    /**
     * POST request
     */
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: data
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    /**
     * Upload file
     */
    async upload(endpoint, formData) {
        const headers = { ...this.getHeaders() };
        delete headers['Content-Type']; // Let browser set multipart boundary

        return this.request(endpoint, {
            method: 'POST',
            headers,
            body: formData
        });
    }

    /**
     * Refresh authentication token
     */
    async refreshToken() {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await response.json();
        this.setToken(data.token);
        return data;
    }

    /**
     * Handle authentication error
     */
    handleAuthError() {
        this.token = null;
        // Redirect to login or show login modal
        if (window.domainApp) {
            window.domainApp.showLogin();
        } else {
            window.location.reload();
        }
    }

    // Authentication endpoints
    async login(credentials) {
        const response = await this.post('/auth/login', credentials);
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }

    async logout() {
        try {
            await this.post('/auth/logout');
        } finally {
            this.token = null;
        }
    }

    async getCurrentUser() {
        return this.get('/auth/me');
    }

    // Dashboard endpoints
    async getDashboardStats() {
        return this.get('/dashboard/stats');
    }

    async getSystemStatus() {
        return this.get('/dashboard/status');
    }

    async getRecentActivity() {
        return this.get('/dashboard/activity');
    }

    // User management endpoints
    async getUsers(params = {}) {
        return this.get('/users', params);
    }

    async getUser(id) {
        return this.get(`/users/${id}`);
    }

    async createUser(userData) {
        return this.post('/users', userData);
    }

    async updateUser(id, userData) {
        return this.put(`/users/${id}`, userData);
    }

    async deleteUser(id) {
        return this.delete(`/users/${id}`);
    }

    async resetUserPassword(id, newPassword) {
        return this.post(`/users/${id}/reset-password`, { password: newPassword });
    }

    async enableUser(id) {
        return this.post(`/users/${id}/enable`);
    }

    async disableUser(id) {
        return this.post(`/users/${id}/disable`);
    }

    // Group management endpoints
    async getGroups(params = {}) {
        return this.get('/groups', params);
    }

    async getGroup(id) {
        return this.get(`/groups/${id}`);
    }

    async createGroup(groupData) {
        return this.post('/groups', groupData);
    }

    async updateGroup(id, groupData) {
        return this.put(`/groups/${id}`, groupData);
    }

    async deleteGroup(id) {
        return this.delete(`/groups/${id}`);
    }

    async addGroupMember(groupId, userId) {
        return this.post(`/groups/${groupId}/members`, { userId });
    }

    async removeGroupMember(groupId, userId) {
        return this.delete(`/groups/${groupId}/members/${userId}`);
    }

    // Computer management endpoints
    async getComputers(params = {}) {
        return this.get('/computers', params);
    }

    async getComputer(id) {
        return this.get(`/computers/${id}`);
    }

    async createComputer(computerData) {
        return this.post('/computers', computerData);
    }

    async updateComputer(id, computerData) {
        return this.put(`/computers/${id}`, computerData);
    }

    async deleteComputer(id) {
        return this.delete(`/computers/${id}`);
    }

    // DNS management endpoints
    async getDNSRecords(params = {}) {
        return this.get('/dns/records', params);
    }

    async getDNSRecord(id) {
        return this.get(`/dns/records/${id}`);
    }

    async createDNSRecord(recordData) {
        return this.post('/dns/records', recordData);
    }

    async updateDNSRecord(id, recordData) {
        return this.put(`/dns/records/${id}`, recordData);
    }

    async deleteDNSRecord(id) {
        return this.delete(`/dns/records/${id}`);
    }

    // Group Policy endpoints
    async getPolicies(params = {}) {
        return this.get('/policies', params);
    }

    async getPolicy(id) {
        return this.get(`/policies/${id}`);
    }

    async createPolicy(policyData) {
        return this.post('/policies', policyData);
    }

    async updatePolicy(id, policyData) {
        return this.put(`/policies/${id}`, policyData);
    }

    async deletePolicy(id) {
        return this.delete(`/policies/${id}`);
    }

    // Security endpoints
    async getSecuritySettings() {
        return this.get('/security/settings');
    }

    async updateSecuritySettings(settings) {
        return this.put('/security/settings', settings);
    }

    async getPasswordPolicy() {
        return this.get('/security/password-policy');
    }

    async updatePasswordPolicy(policy) {
        return this.put('/security/password-policy', policy);
    }

    async getLockoutPolicy() {
        return this.get('/security/lockout-policy');
    }

    async updateLockoutPolicy(policy) {
        return this.put('/security/lockout-policy', policy);
    }

    // Audit endpoints
    async getAuditLogs(params = {}) {
        return this.get('/audit/logs', params);
    }

    async exportAuditLogs(params = {}) {
        return this.get('/audit/export', params);
    }
}

/**
 * Custom API Error class
 */
class APIError extends Error {
    constructor(message, status = 0, data = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }

    isNetworkError() {
        return this.status === 0;
    }

    isAuthError() {
        return this.status === 401 || this.status === 403;
    }

    isValidationError() {
        return this.status === 400;
    }

    isNotFoundError() {
        return this.status === 404;
    }

    isServerError() {
        return this.status >= 500;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DomainAPI, APIError };
} else {
    window.DomainAPI = DomainAPI;
    window.APIError = APIError;
}
