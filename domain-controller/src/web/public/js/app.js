// Domain Controller Web Interface Application
class DomainControllerApp {
    constructor() {
        this.apiBase = '/api';
        this.currentSection = 'dashboard';
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboard();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = btn.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Search functionality
        const userSearch = document.getElementById('user-search');
        if (userSearch) {
            userSearch.addEventListener('input', (e) => {
                this.searchUsers(e.target.value);
            });
        }

        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'create-user-form') {
                e.preventDefault();
                this.createUser();
            }
        });
    }

    showSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        this.currentSection = sectionId;

        // Load section-specific data
        switch (sectionId) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'dns':
                this.loadDNSRecords();
                break;
            case 'audit':
                this.loadAuditLogs();
                break;
        }
    }

    switchTab(tabId) {
        const parentSection = document.querySelector('.content-section.active');
        
        // Update tab buttons
        parentSection.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        parentSection.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update tab content
        parentSection.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        // Load tab-specific data
        switch (tabId) {
            case 'users-tab':
                this.loadUsers();
                break;
            case 'groups-tab':
                this.loadGroups();
                break;
            case 'computers-tab':
                this.loadComputers();
                break;
        }
    }

    async loadDashboard() {
        try {
            // Load service status
            const healthResponse = await fetch('/health');
            const healthData = await healthResponse.json();
            this.updateServiceStatus(healthData.services);

            // Load statistics
            const statsResponse = await fetch(`${this.apiBase}/stats`);
            const statsData = await statsResponse.json();
            this.updateStatistics(statsData);

            // Load recent activity
            const activityResponse = await fetch(`${this.apiBase}/audit/recent`);
            const activityData = await activityResponse.json();
            this.updateRecentActivity(activityData);

        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    updateServiceStatus(services) {
        const statusMap = {
            ldap: 'ldap-status',
            kerberos: 'kerberos-status',
            dns: 'dns-status',
            directory: 'directory-status'
        };

        Object.entries(statusMap).forEach(([service, elementId]) => {
            const element = document.getElementById(elementId);
            if (element) {
                const dot = element.querySelector('.status-dot');
                const text = element.querySelector('.status-text');
                
                if (services[service]) {
                    dot.className = 'status-dot online';
                    text.textContent = 'Online';
                } else {
                    dot.className = 'status-dot offline';
                    text.textContent = 'Offline';
                }
            }
        });
    }

    updateStatistics(stats) {
        const statElements = {
            'total-users': stats.totalUsers || 0,
            'active-sessions': stats.activeSessions || 0,
            'total-groups': stats.totalGroups || 0,
            'total-computers': stats.totalComputers || 0
        };

        Object.entries(statElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    updateRecentActivity(activities) {
        const activityList = document.getElementById('recent-activity');
        if (!activityList) return;

        if (!activities || activities.length === 0) {
            activityList.innerHTML = '<div class="activity-item"><i class="fas fa-info-circle"></i><span>No recent activities</span></div>';
            return;
        }

        activityList.innerHTML = activities.slice(0, 5).map(activity => `
            <div class="activity-item">
                <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                <span>${activity.description}</span>
                <small>${this.formatTime(activity.timestamp)}</small>
            </div>
        `).join('');
    }

    async loadUsers() {
        try {
            const response = await fetch(`${this.apiBase}/directory/users`);
            const users = await response.json();
            this.renderUsersTable(users);
        } catch (error) {
            console.error('Error loading users:', error);
            this.showTableError('users-table', 'Failed to load users');
        }
    }

    renderUsersTable(users) {
        const tbody = document.querySelector('#users-table tbody');
        if (!tbody) return;

        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading-row">No users found</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.username}</td>
                <td>${user.displayName || '-'}</td>
                <td>${user.email || '-'}</td>
                <td>
                    <span class="status-badge ${user.enabled ? 'status-active' : 'status-disabled'}">
                        ${user.enabled ? 'Active' : 'Disabled'}
                    </span>
                </td>
                <td>${user.lastLogin ? this.formatTime(user.lastLogin) : 'Never'}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="app.editUser('${user.id}')">Edit</button>
                    <button class="btn btn-sm btn-outline" onclick="app.resetPassword('${user.id}')">Reset Password</button>
                </td>
            </tr>
        `).join('');
    }

    async loadGroups() {
        try {
            const response = await fetch(`${this.apiBase}/directory/groups`);
            const groups = await response.json();
            this.renderGroupsTable(groups);
        } catch (error) {
            console.error('Error loading groups:', error);
            this.showTableError('groups-table', 'Failed to load groups');
        }
    }

    renderGroupsTable(groups) {
        const tbody = document.querySelector('#groups-table tbody');
        if (!tbody) return;

        if (!groups || groups.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading-row">No groups found</td></tr>';
            return;
        }

        tbody.innerHTML = groups.map(group => `
            <tr>
                <td>${group.name}</td>
                <td>${group.type || 'Security'}</td>
                <td>${group.memberCount || 0}</td>
                <td>${group.description || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="app.editGroup('${group.id}')">Edit</button>
                    <button class="btn btn-sm btn-outline" onclick="app.viewGroupMembers('${group.id}')">Members</button>
                </td>
            </tr>
        `).join('');
    }

    async loadComputers() {
        try {
            const response = await fetch(`${this.apiBase}/directory/computers`);
            const computers = await response.json();
            this.renderComputersTable(computers);
        } catch (error) {
            console.error('Error loading computers:', error);
            this.showTableError('computers-table', 'Failed to load computers');
        }
    }

    renderComputersTable(computers) {
        const tbody = document.querySelector('#computers-table tbody');
        if (!tbody) return;

        if (!computers || computers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading-row">No computers found</td></tr>';
            return;
        }

        tbody.innerHTML = computers.map(computer => `
            <tr>
                <td>${computer.name}</td>
                <td>${computer.operatingSystem || 'Unknown'}</td>
                <td>${computer.lastSeen ? this.formatTime(computer.lastSeen) : 'Never'}</td>
                <td>
                    <span class="status-badge ${computer.online ? 'status-active' : 'status-offline'}">
                        ${computer.online ? 'Online' : 'Offline'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="app.viewComputer('${computer.id}')">View</button>
                </td>
            </tr>
        `).join('');
    }

    async loadDNSRecords() {
        try {
            const response = await fetch(`${this.apiBase}/dns/records`);
            const records = await response.json();
            this.renderDNSTable(records);
            
            // Update zone statistics
            document.getElementById('zone-records').textContent = records.length;
        } catch (error) {
            console.error('Error loading DNS records:', error);
            this.showTableError('dns-table', 'Failed to load DNS records');
        }
    }

    renderDNSTable(records) {
        const tbody = document.querySelector('#dns-table tbody');
        if (!tbody) return;

        if (!records || records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading-row">No DNS records found</td></tr>';
            return;
        }

        tbody.innerHTML = records.map(record => `
            <tr>
                <td>${record.name}</td>
                <td>${record.type}</td>
                <td>${record.value}</td>
                <td>${record.ttl || 3600}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="app.editDNSRecord('${record.id}')">Edit</button>
                    <button class="btn btn-sm btn-outline" onclick="app.deleteDNSRecord('${record.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    async loadAuditLogs() {
        try {
            const response = await fetch(`${this.apiBase}/audit/logs`);
            const logs = await response.json();
            this.renderAuditTable(logs);
        } catch (error) {
            console.error('Error loading audit logs:', error);
            this.showTableError('audit-table', 'Failed to load audit logs');
        }
    }

    renderAuditTable(logs) {
        const tbody = document.querySelector('#audit-table tbody');
        if (!tbody) return;

        if (!logs || logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading-row">No audit logs found</td></tr>';
            return;
        }

        tbody.innerHTML = logs.map(log => `
            <tr>
                <td>${this.formatTime(log.timestamp)}</td>
                <td>${log.eventType}</td>
                <td>${log.user || 'System'}</td>
                <td>${log.description}</td>
                <td>${log.sourceIP || '-'}</td>
                <td>
                    <span class="status-badge ${log.success ? 'status-success' : 'status-error'}">
                        ${log.success ? 'Success' : 'Failed'}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    // Modal functions
    showCreateUserModal() {
        const modal = document.getElementById('modal-overlay');
        const userModal = document.getElementById('create-user-modal');
        
        // Show only the user modal
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        userModal.style.display = 'block';
        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('modal-overlay');
        modal.classList.remove('active');
        
        // Reset forms
        document.querySelectorAll('.modal form').forEach(form => form.reset());
    }

    async createUser() {
        const form = document.getElementById('create-user-form');
        const formData = new FormData(form);
        
        const userData = {
            username: formData.get('username'),
            displayName: formData.get('displayName'),
            email: formData.get('email'),
            password: formData.get('password'),
            groups: formData.getAll('groups')
        };

        try {
            const response = await fetch(`${this.apiBase}/directory/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                this.showSuccess('User created successfully');
                this.closeModal();
                this.loadUsers();
            } else {
                const error = await response.json();
                this.showError(error.message || 'Failed to create user');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            this.showError('Failed to create user');
        }
    }

    // Search functionality
    searchUsers(query) {
        const rows = document.querySelectorAll('#users-table tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Utility functions
    formatTime(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

    getActivityIcon(type) {
        const icons = {
            login: 'fa-sign-in-alt',
            logout: 'fa-sign-out-alt',
            user_created: 'fa-user-plus',
            user_modified: 'fa-user-edit',
            group_created: 'fa-users',
            policy_changed: 'fa-shield-alt',
            dns_record: 'fa-globe',
            default: 'fa-info-circle'
        };
        return icons[type] || icons.default;
    }

    showTableError(tableId, message) {
        const tbody = document.querySelector(`#${tableId} tbody`);
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" class="loading-row"><i class="fas fa-exclamation-triangle"></i> ${message}</td></tr>`;
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    startAutoRefresh() {
        // Refresh dashboard every 30 seconds
        this.refreshInterval = setInterval(() => {
            if (this.currentSection === 'dashboard') {
                this.loadDashboard();
            }
        }, 30000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
}

// Global functions for onclick handlers
window.showCreateUserModal = () => app.showCreateUserModal();
window.showCreateGroupModal = () => console.log('Create group modal - to be implemented');
window.showAddRecordModal = () => console.log('Add DNS record modal - to be implemented');
window.showCreatePolicyModal = () => console.log('Create policy modal - to be implemented');
window.closeModal = () => app.closeModal();
window.createUser = () => app.createUser();
window.exportAuditLogs = () => console.log('Export audit logs - to be implemented');

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DomainControllerApp();
});

// Add notification styles dynamically
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 90px;
    right: 20px;
    background: white;
    border-radius: 8px;
    padding: 1rem 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 3000;
    min-width: 300px;
    animation: slideInRight 0.3s ease;
}

.notification-success {
    border-left: 4px solid #48bb78;
}

.notification-error {
    border-left: 4px solid #f56565;
}

.notification i {
    color: #48bb78;
}

.notification-error i {
    color: #f56565;
}

.notification-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #a0aec0;
    cursor: pointer;
    margin-left: auto;
}

.status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
}

.status-active {
    background: #c6f6d5;
    color: #22543d;
}

.status-disabled {
    background: #fed7d7;
    color: #742a2a;
}

.status-offline {
    background: #e2e8f0;
    color: #4a5568;
}

.status-success {
    background: #c6f6d5;
    color: #22543d;
}

.status-error {
    background: #fed7d7;
    color: #742a2a;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);
