/**
 * QuantumMint Mail Server Web Interface
 * Interactive JavaScript Application
 */

class MailServerApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentFolder = 'inbox';
        this.selectedEmail = null;
        this.emails = [];
        this.folders = [];
        this.accounts = [];
        this.domains = [];
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupNavigation();
        await this.loadInitialData();
        this.showSection('dashboard');
        this.startRealTimeUpdates();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-tab a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });

        // Compose button
        const composeBtn = document.querySelector('.compose-btn');
        if (composeBtn) {
            composeBtn.addEventListener('click', () => this.openComposeModal());
        }

        // Folder navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.folder-link')) {
                e.preventDefault();
                const folder = e.target.dataset.folder;
                this.selectFolder(folder);
            }
        });

        // Email list
        document.addEventListener('click', (e) => {
            if (e.target.closest('.email-item')) {
                const emailId = e.target.closest('.email-item').dataset.emailId;
                this.selectEmail(emailId);
            }
        });

        // Modal controls
        document.addEventListener('click', (e) => {
            if (e.target.matches('.close-btn') || e.target.matches('.modal')) {
                this.closeModal();
            }
        });

        // Search functionality
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.addEventListener('input', (e) => {
                this.searchEmails(e.target.value);
            });
        }

        // Rich text editor
        this.setupRichTextEditor();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-tab a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Show corresponding section
                const section = link.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });
    }

    async loadInitialData() {
        try {
            await Promise.all([
                this.loadDashboardStats(),
                this.loadFolders(),
                this.loadEmails(),
                this.loadAccounts(),
                this.loadDomains()
            ]);
        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.showNotification('Failed to load data', 'error');
        }
    }

    async loadDashboardStats() {
        try {
            const response = await fetch('/api/mail/stats');
            const stats = await response.json();
            
            this.updateDashboardStats(stats);
        } catch (error) {
            console.error('Failed to load dashboard stats:', error);
        }
    }

    updateDashboardStats(stats) {
        const elements = {
            'total-emails': stats.totalEmails || 0,
            'unread-emails': stats.unreadEmails || 0,
            'sent-today': stats.sentToday || 0,
            'storage-used': stats.storageUsed || 0,
            'active-accounts': stats.activeAccounts || 0,
            'spam-blocked': stats.spamBlocked || 0
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'storage-used') {
                    element.textContent = this.formatBytes(value);
                } else {
                    element.textContent = this.formatNumber(value);
                }
            }
        });

        // Update progress bars
        this.updateProgressBar('storage-progress', stats.storagePercentage || 0);
        this.updateProgressBar('quota-progress', stats.quotaPercentage || 0);
    }

    updateProgressBar(id, percentage) {
        const progressBar = document.getElementById(id);
        if (progressBar) {
            progressBar.style.width = `${Math.min(percentage, 100)}%`;
        }
    }

    async loadFolders() {
        try {
            const response = await fetch('/api/mail/folders');
            this.folders = await response.json();
            this.renderFolders();
        } catch (error) {
            console.error('Failed to load folders:', error);
        }
    }

    renderFolders() {
        const folderList = document.querySelector('.folder-list');
        if (!folderList) return;

        folderList.innerHTML = this.folders.map(folder => `
            <li class="folder-item">
                <a href="#" class="folder-link ${folder.id === this.currentFolder ? 'active' : ''}" 
                   data-folder="${folder.id}">
                    <span class="folder-name">
                        <i class="${folder.icon}"></i>
                        ${folder.name}
                    </span>
                    ${folder.count > 0 ? `<span class="folder-count">${folder.count}</span>` : ''}
                </a>
            </li>
        `).join('');
    }

    async loadEmails(folder = 'inbox') {
        try {
            const response = await fetch(`/api/mail/emails?folder=${folder}`);
            this.emails = await response.json();
            this.renderEmailList();
        } catch (error) {
            console.error('Failed to load emails:', error);
        }
    }

    renderEmailList() {
        const emailList = document.querySelector('.email-list-content');
        if (!emailList) return;

        if (this.emails.length === 0) {
            emailList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox fa-3x mb-3"></i>
                    <p>No emails in this folder</p>
                </div>
            `;
            return;
        }

        emailList.innerHTML = this.emails.map(email => `
            <div class="email-item ${email.unread ? 'unread' : ''} ${email.id === this.selectedEmail?.id ? 'selected' : ''}" 
                 data-email-id="${email.id}">
                <div class="email-header">
                    <span class="email-sender">${email.sender}</span>
                    <span class="email-time">${this.formatTime(email.timestamp)}</span>
                </div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${email.preview}</div>
            </div>
        `).join('');
    }

    async selectFolder(folderId) {
        this.currentFolder = folderId;
        
        // Update folder UI
        document.querySelectorAll('.folder-link').forEach(link => {
            link.classList.toggle('active', link.dataset.folder === folderId);
        });

        // Load emails for selected folder
        await this.loadEmails(folderId);
        
        // Clear email preview
        this.selectedEmail = null;
        this.renderEmailPreview();
    }

    async selectEmail(emailId) {
        try {
            const response = await fetch(`/api/mail/emails/${emailId}`);
            this.selectedEmail = await response.json();
            
            // Mark as read
            if (this.selectedEmail.unread) {
                await this.markEmailAsRead(emailId);
            }
            
            this.renderEmailPreview();
            this.updateEmailListSelection(emailId);
        } catch (error) {
            console.error('Failed to load email:', error);
        }
    }

    renderEmailPreview() {
        const previewPanel = document.querySelector('.email-preview-panel');
        if (!previewPanel) return;

        if (!this.selectedEmail) {
            previewPanel.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-envelope-open fa-3x mb-3"></i>
                    <p>Select an email to view</p>
                </div>
            `;
            return;
        }

        const email = this.selectedEmail;
        previewPanel.innerHTML = `
            <div class="email-detail-header">
                <div class="email-actions">
                    <button class="btn" onclick="mailApp.replyToEmail('${email.id}')">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                    <button class="btn" onclick="mailApp.forwardEmail('${email.id}')">
                        <i class="fas fa-share"></i> Forward
                    </button>
                    <button class="btn" onclick="mailApp.deleteEmail('${email.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
                <h3>${email.subject}</h3>
                <div class="email-meta">
                    <div class="meta-row">
                        <span class="meta-label">From:</span>
                        <span>${email.sender}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">To:</span>
                        <span>${email.recipients.join(', ')}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Date:</span>
                        <span>${this.formatDateTime(email.timestamp)}</span>
                    </div>
                    ${email.attachments?.length ? `
                        <div class="meta-row">
                            <span class="meta-label">Files:</span>
                            <span>${email.attachments.map(att => att.name).join(', ')}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="email-content">
                ${email.content}
            </div>
        `;
    }

    updateEmailListSelection(emailId) {
        document.querySelectorAll('.email-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.emailId === emailId);
            if (item.dataset.emailId === emailId) {
                item.classList.remove('unread');
            }
        });
    }

    async markEmailAsRead(emailId) {
        try {
            await fetch(`/api/mail/emails/${emailId}/read`, { method: 'POST' });
            await this.loadDashboardStats(); // Update unread count
        } catch (error) {
            console.error('Failed to mark email as read:', error);
        }
    }

    async loadAccounts() {
        try {
            const response = await fetch('/api/mail/accounts');
            this.accounts = await response.json();
            this.renderAccountsTable();
        } catch (error) {
            console.error('Failed to load accounts:', error);
        }
    }

    renderAccountsTable() {
        const tableBody = document.querySelector('#accounts-table tbody');
        if (!tableBody) return;

        tableBody.innerHTML = this.accounts.map(account => `
            <tr>
                <td>${account.email}</td>
                <td>${account.name}</td>
                <td>
                    <span class="status-badge ${account.active ? 'active' : 'inactive'}">
                        ${account.active ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>${this.formatBytes(account.storageUsed)}</td>
                <td>${this.formatDateTime(account.lastLogin)}</td>
                <td>
                    <button class="btn btn-sm" onclick="mailApp.editAccount('${account.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm" onclick="mailApp.deleteAccount('${account.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async loadDomains() {
        try {
            const response = await fetch('/api/mail/domains');
            this.domains = await response.json();
            this.renderDomainsTable();
        } catch (error) {
            console.error('Failed to load domains:', error);
        }
    }

    renderDomainsTable() {
        const tableBody = document.querySelector('#domains-table tbody');
        if (!tableBody) return;

        tableBody.innerHTML = this.domains.map(domain => `
            <tr>
                <td>${domain.name}</td>
                <td>
                    <span class="status-badge ${domain.verified ? 'active' : 'pending'}">
                        ${domain.verified ? 'Verified' : 'Pending'}
                    </span>
                </td>
                <td>${domain.accountCount}</td>
                <td>${this.formatDateTime(domain.createdAt)}</td>
                <td>
                    <button class="btn btn-sm" onclick="mailApp.manageDomain('${domain.id}')">
                        <i class="fas fa-cog"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;

            // Load section-specific data
            this.loadSectionData(sectionId);
        }
    }

    async loadSectionData(sectionId) {
        switch (sectionId) {
            case 'dashboard':
                await this.loadDashboardStats();
                break;
            case 'mailbox':
                await this.loadEmails(this.currentFolder);
                break;
            case 'accounts':
                await this.loadAccounts();
                break;
            case 'domains':
                await this.loadDomains();
                break;
            case 'analytics':
                await this.loadAnalytics();
                break;
        }
    }

    openComposeModal() {
        const modal = document.getElementById('compose-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus on the to field
            const toField = document.getElementById('compose-to');
            if (toField) {
                setTimeout(() => toField.focus(), 100);
            }
        }
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    setupRichTextEditor() {
        const editorButtons = document.querySelectorAll('.editor-btn');
        editorButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.dataset.command;
                const value = btn.dataset.value || null;
                
                document.execCommand(command, false, value);
                btn.classList.toggle('active');
            });
        });

        // Make editor content editable
        const editorContent = document.querySelector('.editor-content');
        if (editorContent) {
            editorContent.contentEditable = true;
            editorContent.addEventListener('focus', () => {
                editorContent.style.outline = 'none';
            });
        }
    }

    async sendEmail() {
        const form = document.getElementById('compose-form');
        if (!form) return;

        const formData = new FormData(form);
        const emailData = {
            to: formData.get('to'),
            cc: formData.get('cc'),
            bcc: formData.get('bcc'),
            subject: formData.get('subject'),
            content: document.querySelector('.editor-content').innerHTML,
            attachments: [] // Handle file uploads separately
        };

        try {
            const response = await fetch('/api/mail/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            if (response.ok) {
                this.showNotification('Email sent successfully', 'success');
                this.closeModal();
                form.reset();
                document.querySelector('.editor-content').innerHTML = '';
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Failed to send email:', error);
            this.showNotification('Failed to send email', 'error');
        }
    }

    async replyToEmail(emailId) {
        const email = this.selectedEmail;
        if (!email) return;

        this.openComposeModal();
        
        // Pre-fill reply fields
        setTimeout(() => {
            document.getElementById('compose-to').value = email.sender;
            document.getElementById('compose-subject').value = `Re: ${email.subject}`;
            
            const editorContent = document.querySelector('.editor-content');
            editorContent.innerHTML = `
                <br><br>
                <div style="border-left: 3px solid #ccc; padding-left: 1rem; margin-left: 1rem;">
                    <p><strong>On ${this.formatDateTime(email.timestamp)}, ${email.sender} wrote:</strong></p>
                    ${email.content}
                </div>
            `;
        }, 100);
    }

    async forwardEmail(emailId) {
        const email = this.selectedEmail;
        if (!email) return;

        this.openComposeModal();
        
        setTimeout(() => {
            document.getElementById('compose-subject').value = `Fwd: ${email.subject}`;
            
            const editorContent = document.querySelector('.editor-content');
            editorContent.innerHTML = `
                <br><br>
                <div style="border-left: 3px solid #ccc; padding-left: 1rem; margin-left: 1rem;">
                    <p><strong>---------- Forwarded message ----------</strong></p>
                    <p><strong>From:</strong> ${email.sender}</p>
                    <p><strong>Date:</strong> ${this.formatDateTime(email.timestamp)}</p>
                    <p><strong>Subject:</strong> ${email.subject}</p>
                    <br>
                    ${email.content}
                </div>
            `;
        }, 100);
    }

    async deleteEmail(emailId) {
        if (!confirm('Are you sure you want to delete this email?')) return;

        try {
            const response = await fetch(`/api/mail/emails/${emailId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showNotification('Email deleted successfully', 'success');
                await this.loadEmails(this.currentFolder);
                this.selectedEmail = null;
                this.renderEmailPreview();
            } else {
                throw new Error('Failed to delete email');
            }
        } catch (error) {
            console.error('Failed to delete email:', error);
            this.showNotification('Failed to delete email', 'error');
        }
    }

    searchEmails(query) {
        if (!query.trim()) {
            this.renderEmailList();
            return;
        }

        const filteredEmails = this.emails.filter(email => 
            email.subject.toLowerCase().includes(query.toLowerCase()) ||
            email.sender.toLowerCase().includes(query.toLowerCase()) ||
            email.preview.toLowerCase().includes(query.toLowerCase())
        );

        const emailList = document.querySelector('.email-list-content');
        if (!emailList) return;

        emailList.innerHTML = filteredEmails.map(email => `
            <div class="email-item ${email.unread ? 'unread' : ''}" data-email-id="${email.id}">
                <div class="email-header">
                    <span class="email-sender">${email.sender}</span>
                    <span class="email-time">${this.formatTime(email.timestamp)}</span>
                </div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${email.preview}</div>
            </div>
        `).join('');
    }

    async loadAnalytics() {
        try {
            const response = await fetch('/api/mail/analytics');
            const analytics = await response.json();
            this.renderAnalytics(analytics);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        }
    }

    renderAnalytics(analytics) {
        // Update analytics charts and metrics
        // This would integrate with a charting library like Chart.js
        console.log('Analytics data:', analytics);
    }

    startRealTimeUpdates() {
        // Poll for updates every 30 seconds
        setInterval(async () => {
            if (this.currentSection === 'dashboard') {
                await this.loadDashboardStats();
            } else if (this.currentSection === 'mailbox') {
                await this.loadEmails(this.currentFolder);
            }
        }, 30000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Add click to dismiss
        notification.addEventListener('click', () => {
            notification.remove();
        });
    }

    // Utility functions
    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 86400000) { // Less than 24 hours
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diff < 604800000) { // Less than 7 days
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    }

    formatDateTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mailApp = new MailServerApp();
});

// Global functions for onclick handlers
window.sendEmail = () => window.mailApp.sendEmail();
window.createAccount = () => {
    // Implementation for creating new email account
    console.log('Create account functionality');
};
window.addDomain = () => {
    // Implementation for adding new domain
    console.log('Add domain functionality');
};
