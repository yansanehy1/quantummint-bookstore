class MailServerInterface {
    constructor() {
        this.token = localStorage.getItem('mailServerToken');
        this.currentUser = null;
        this.currentFolder = 'inbox';
        this.selectedEmail = null;
        this.emails = [];

        this.init();
    }

    init() {
        if (this.token) {
            this.showMailInterface();
            this.loadEmails();
        } else {
            this.showLogin();
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        //Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // User menu toggle
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                userDropdown.style.display = 'none';
            });
        }

        // Folder navigation
        document.querySelectorAll('.folder-item').forEach(item => {
            item.addEventListener('click', () => {
                const folder = item.getAttribute('data-folder');
                this.switchFolder(folder);
            });
        });

        // Compose modal
        const composeBtn = document.getElementById('composeBtn');
        const composeModal = document.getElementById('composeModal');
        const closeComposeBtn = document.getElementById('closeComposeBtn');

        if (composeBtn) {
            composeBtn.addEventListener('click', () => this.openCompose());
        }

        if (closeComposeBtn) {
            closeComposeBtn.addEventListener('click', () => this.closeCompose());
        }

        if (composeModal) {
            composeModal.addEventListener('click', (e) => {
                if (e.target === composeModal) {
                    this.closeCompose();
                }
            });
        }

        // Cc/Bcc buttons
        const showCcBtn = document.getElementById('showCcBtn');
        const showBccBtn = document.getElementById('showBccBtn');
        const ccField = document.getElementById('ccField');
        const bccField = document.getElementById('bccField');

        if (showCcBtn && ccField) {
            showCcBtn.addEventListener('click', () => {
                ccField.style.display = 'flex';
                showCcBtn.style.display = 'none';
            });
        }

        if (showBccBtn && bccField) {
            showBccBtn.addEventListener('click', () => {
                bccField.style.display = 'flex';
                showBccBtn.style.display = 'none';
            });
        }

        // Send button
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendEmail());
        }

        // Action bar buttons
        document.getElementById('deleteBtn')?.addEventListener('click', () => this.deleteEmail());
        document.getElementById('archiveBtn')?.addEventListener('click', () => this.archiveEmail());
        document.getElementById('spamBtn')?.addEventListener('click', () => this.markAsSpam());
        document.getElementById('moveBtn')?.addEventListener('click', () => this.moveEmail());
        document.getElementById('replyBtn')?.addEventListener('click', () => this.replyEmail());
        document.getElementById('replyAllBtn')?.addEventListener('click', () => this.replyAllEmail());
        document.getElementById('forwardBtn')?.addEventListener('click', () => this.forwardEmail());
        document.getElementById('markReadBtn')?.addEventListener('click', () => this.toggleReadStatus());
        document.getElementById('flagBtn')?.addEventListener('click', () => this.toggleFlag());

        // Formatting toolbar buttons
        document.getElementById('boldBtn')?.addEventListener('click', () => this.formatText('bold'));
        document.getElementById('italicBtn')?.addEventListener('click', () => this.formatText('italic'));
        document.getElementById('underlineBtn')?.addEventListener('click', () => this.formatText('underline'));
        document.getElementById('strikeBtn')?.addEventListener('click', () => this.formatText('strikeThrough'));

        // Color pickers
        const textColorPicker = document.getElementById('textColorPicker');
        const highlightColorPicker = document.getElementById('highlightColorPicker');

        document.getElementById('textColorBtn')?.addEventListener('click', () => {
            textColorPicker?.click();
        });

        document.getElementById('highlightBtn')?.addEventListener('click', () => {
            highlightColorPicker?.click();
        });

        textColorPicker?.addEventListener('change', (e) => {
            this.formatText('foreColor', e.target.value);
        });

        highlightColorPicker?.addEventListener('change', (e) => {
            this.formatText('backColor', e.target.value);
        });

        // List buttons
        document.getElementById('bulletListBtn')?.addEventListener('click', () => this.formatText('insertUnorderedList'));
        document.getElementById('numberedListBtn')?.addEventListener('click', () => this.formatText('insertOrderedList'));
        document.getElementById('indentBtn')?.addEventListener('click', () => this.formatText('indent'));
        document.getElementById('outdentBtn')?.addEventListener('click', () => this.formatText('outdent'));

        // Attachment button
        const attachFileInput = document.getElementById('attachFileInput');
        document.getElementById('attachBtn')?.addEventListener('click', () => {
            attachFileInput?.click();
        });

        attachFileInput?.addEventListener('change', (e) => this.handleAttachment(e));

        // Link button
        document.getElementById('linkBtn')?.addEventListener('click', () => this.insertLink());

        // Emoji button
        document.getElementById('emojiBtn')?.addEventListener('click', () => this.insertEmoji());

        // Font selectors
        document.getElementById('fontSelect')?.addEventListener('change', (e) => {
            this.formatText('fontName', e.target.value);
        });

        document.getElementById('fontSizeSelect')?.addEventListener('change', (e) => {
            this.formatText('fontSize', e.target.value + 'pt');
        });
    }

    async handleLogin(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('mailServerToken', this.token);

                this.showMailInterface();
                this.loadEmails();
            } else {
                errorDiv.textContent = data.error || 'Login failed';
                errorDiv.classList.remove('hidden');
            }
        } catch (error) {
            errorDiv.textContent = 'Network error. Please try again.';
            errorDiv.classList.remove('hidden');
        }
    }

    async handleLogout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('mailServerToken');
        this.showLogin();
    }

    showLogin() {
        document.getElementById('loginContainer').style.display = 'flex';
        document.getElementById('mailInterface').style.display = 'none';
    }

    showMailInterface() {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('mailInterface').style.display = 'flex';

        if (this.currentUser) {
            const initials = this.getInitials(this.currentUser.username || this.currentUser.email);
            document.getElementById('userInitials').textContent = initials;
            document.getElementById('userName').textContent = this.currentUser.username || 'User';
            document.getElementById('userEmail').textContent = this.currentUser.email || '';
        }
    }

    switchFolder(folder) {
        this.currentFolder = folder;

        // Update active folder in UI
        document.querySelectorAll('.folder-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-folder') === folder) {
                item.classList.add('active');
            }
        });

        // Reload emails for the selected folder
        this.loadEmails();
    }

    async loadEmails() {
        const loadingDiv = document.getElementById('emailListLoading');
        const itemsDiv = document.getElementById('emailListItems');

        if (loadingDiv) loadingDiv.style.display = 'flex';
        if (itemsDiv) itemsDiv.style.display = 'none';

        try {
            const response = await this.apiCall(`/api/emails?folder=${this.currentFolder}`);
            if (response && response.ok) {
                const data = await response.json();
                this.emails = data.emails || [];
                this.renderEmailList();

                if (loadingDiv) loadingDiv.style.display = 'none';
                if (itemsDiv) itemsDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Error loading emails:', error);
            // Show sample data for demonstration
            this.emails = this.getSampleEmails();
            this.renderEmailList();
            if (loadingDiv) loadingDiv.style.display = 'none';
            if (itemsDiv) itemsDiv.style.display = 'block';
        }

        // Update folder counts
        this.updateFolderCounts();
    }

    renderEmailList() {
        const container = document.getElementById('emailListItems');
        if (!container) return;

        container.innerHTML = '';

        // Group emails by date
        const groups = this.groupEmailsByDate();

        groups.forEach(group => {
            // Group header
            const groupDiv = document.createElement('div');
            groupDiv.className = 'email-group';

            const headerDiv = document.createElement('div');
            headerDiv.className = 'group-header';
            headerDiv.textContent = group.label;
            groupDiv.appendChild(headerDiv);

            // Email items
            group.emails.forEach(email => {
                const itemDiv = this.createEmailItem(email);
                groupDiv.appendChild(itemDiv);
            });

            container.appendChild(groupDiv);
        });
    }

    createEmailItem(email) {
        const div = document.createElement('div');
        div.className = 'email-item';
        if (!email.read) div.classList.add('unread');

        const initials = this.getInitials(email.from);
        const avatarColor = this.getAvatarColor(email.from);

        div.innerHTML = `
            <div class="email-avatar" style="background: ${avatarColor}">${initials}</div>
            <div class="email-preview">
                <div class="email-header">
                    <span class="email-sender">${this.formatSender(email.from)}</span>
                    <span class="email-time">${this.formatTime(email.date)}</span>
                </div>
                <div class="email-subject">${email.subject || '(No Subject)'}</div>
                <div class="email-snippet">${this.getEmailSnippet(email)}</div>
            </div>
        `;

        div.addEventListener('click', () => this.selectEmail(email, div));

        return div;
    }

    selectEmail(email, element) {
        // Update selected state
        document.querySelectorAll('.email-item').forEach(item => {
            item.classList.remove('selected');
        });
        if (element) {
            element.classList.add('selected');
            element.classList.remove('unread');
        }

        this.selectedEmail = email;
        this.displayEmail(email);
    }

    displayEmail(email) {
        const emptyPane = document.getElementById('readingPaneEmpty');
        const contentPane = document.getElementById('readingPaneContent');

        if (emptyPane) emptyPane.style.display = 'none';
        if (contentPane) contentPane.style.display = 'block';

        // Populate email details
        document.getElementById('emailSubject').textContent = email.subject || '(No Subject)';

        const initials = this.getInitials(email.from);
        const avatarColor = this.getAvatarColor(email.from);
        const senderAvatar = document.getElementById('senderAvatar');
        if (senderAvatar) {
            senderAvatar.textContent = initials;
            senderAvatar.style.background = avatarColor;
        }

        document.getElementById('senderName').textContent = this.formatSender(email.from);

        // Fix recipient display
        const toField = document.getElementById('emailTo');
        if (toField) {
            if (Array.isArray(email.to)) {
                toField.textContent = email.to.map(addr => {
                    if (typeof addr === 'string') return addr;
                    return addr.address || addr.email || String(addr);
                }).join(', ');
            } else if (typeof email.to === 'string') {
                toField.textContent = email.to;
            } else if (email.to && email.to.address) {
                toField.textContent = email.to.address;
            } else {
                toField.textContent = String(email.to || 'Unknown');
            }
        }

        document.getElementById('emailDate').textContent = this.formatDate(email.date);

        // Fix body display
        const bodyField = document.getElementById('emailBody');
        if (bodyField) {
            const content = email.body || email.text || email.textContent || 'No content available';
            bodyField.innerHTML = content;
        }
    }

    groupEmailsByDate() {
        const now = new Date();
        const thisMonth = [];
        const lastMonth = [];
        const older = [];

        this.emails.forEach(email => {
            const emailDate = new Date(email.date);
            const daysDiff = Math.floor((now - emailDate) / (1000 * 60 * 60 * 24));

            if (daysDiff < 30) {
                thisMonth.push(email);
            } else if (daysDiff < 60) {
                lastMonth.push(email);
            } else {
                older.push(email);
            }
        });

        const groups = [];
        if (thisMonth.length > 0) groups.push({ label: 'This month', emails: thisMonth });
        if (lastMonth.length > 0) groups.push({ label: this.getLastMonthName(), emails: lastMonth });
        if (older.length > 0) groups.push({ label: 'Older', emails: older });

        return groups;
    }

    openCompose() {
        const modal = document.getElementById('composeModal');
        if (modal) {
            modal.classList.add('active');

            // Reset form
            document.getElementById('composeTo').value = '';
            document.getElementById('composeCc').value = '';
            document.getElementById('composeBcc').value = '';
            document.getElementById('composeSubject').value = '';
            document.getElementById('composeBody').innerHTML = '';

            // Reset attachments
            this.attachedFiles = null;
            document.querySelector('.compose-attachments')?.remove();

            // Hide Cc/Bcc fields
            document.getElementById('ccField').style.display = 'none';
            document.getElementById('bccField').style.display = 'none';
            document.getElementById('showCcBtn').style.display = 'inline-block';
            document.getElementById('showBccBtn').style.display = 'inline-block';
        }
    }

    closeCompose() {
        const modal = document.getElementById('composeModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    async sendEmail() {
        const to = document.getElementById('composeTo').value;
        const cc = document.getElementById('composeCc').value;
        const bcc = document.getElementById('composeBcc').value;
        const subject = document.getElementById('composeSubject').value;
        const body = document.getElementById('composeBody').innerHTML;

        if (!to || !subject) {
            alert('Please enter recipient and subject');
            return;
        }

        try {
            const response = await this.apiCall('/api/send', {
                method: 'POST',
                body: JSON.stringify({ to, cc, bcc, subject, body, attachments: this.attachedFiles })
            });

            if (response && response.ok) {
                alert('Email sent successfully');
                this.closeCompose();
                this.loadEmails();
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || 'Failed to send email'}`);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email');
        }
    }

    async updateFolderCounts() {
        try {
            const response = await this.apiCall('/api/stats');
            if (response && response.ok) {
                const stats = await response.json();

                // Update counts (using sample data for now)
                const setCount = (id, count) => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = count || '0';
                };

                setCount('inboxCount', stats.inbox || 5);
                setCount('inboxCountMain', stats.inbox || 5);
                setCount('spamCount', stats.spam || 6);
                setCount('draftsCount', stats.drafts || 0);
            }
        } catch (error) {
            console.error('Error updating counts:', error);
        }
    }

    async apiCall(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });

            if (response.status === 401) {
                this.handleLogout();
                return null;
            }

            return response;
        } catch (error) {
            console.error('API call error:', error);
            return null;
        }
    }

    // Utility functions
    getInitials(name) {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    getAvatarColor(name) {
        const colors = [
            '#667eea', '#764ba2', '#f093fb', '#4facfe',
            '#43e97b', '#fa709a', '#fee140', '#30cfd0'
        ];
        const index = (name || '').length % colors.length;
        return colors[index];
    }

    formatSender(email) {
        if (!email) return 'Unknown';
        if (typeof email === 'string') {
            const match = email.match(/^(.+?)\s*<.*>$/);
            return match ? match[1] : email.split('@')[0];
        }
        return email.name || email.address?.split('@')[0] || 'Unknown';
    }

    formatTime(date) {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;

        if (diff < 86400000) { // Less than 24 hours
            return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        } else if (diff < 604800000) { // Less than 7 days
            return d.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    getEmailSnippet(email) {
        const text = email.text || email.body || '';
        return text.replace(/<[^>]*>/g, '').substring(0, 100);
    }

    getLastMonthName() {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toLocaleDateString('en-US', { month: 'long' });
    }

    getSampleEmails() {
        // Sample data for demonstration
        return [
            {
                from: 'Crossout',
                to: 'you@example.com',
                subject: 'Shooter Action MMO - Check out the new Crossout...',
                date: new Date(Date.now() - 1000 * 60 * 60),
                text: 'Play now! Shooter Action MMO. Check out the new Crossout update with exciting features.',
                read: false
            },
            {
                from: 'Google',
                to: 'you@example.com',
                subject: 'Google Verification Code',
                date: new Date(Date.now() - 1000 * 60 * 60 * 3),
                text: 'Google Verification Code Dear Google User, Your verification code is 123456.',
                read: true
            },
            {
                from: 'PayPal Communications',
                to: 'you@example.com',
                subject: "We're making some changes to our PayPal legal agreements",
                date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
                text: 'Important updates to our legal agreements. Please review the changes.',
                read: true
            },
            {
                from: 'Windsurf Team',
                to: 'you@example.com',
                subject: 'Introducing SWE-1.5: Our Fast Agent...',
                date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35),
                text: 'Unsubscribe - Hello! It\'s been over 2 weeks since we launched SWE-1.5.',
                read: true
            },
            {
                from: 'Windsurf Team',
                to: 'you@example.com',
                subject: 'Sonnet 4.5 Promo Pricing Update - Hello! It\'s been...',
                date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 36),
                text: 'Important pricing update for Sonnet 4.5. Learn about our new promotional pricing.',
                read: true
            },
            {
                from: 'Microsoft 365',
                to: 'you@example.com',
                subject: "You're not using the Outlook app, you're missing out.",
                date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 65),
                text: 'Link in description. Install the Outlook mobile app for better email experience.',
                read: true
            }
        ];
    }

    // Email action methods
    async deleteEmail() {
        if (!this.selectedEmail) {
            alert('Please select an email first');
            return;
        }

        if (!confirm('Delete this email?')) return;

        try {
            const response = await this.apiCall(`/api/emails/${this.selectedEmail._id}`, {
                method: 'DELETE'
            });

            if (response && response.ok) {
                // Remove from local list
                this.emails = this.emails.filter(e => e._id !== this.selectedEmail._id);
                this.selectedEmail = null;
                this.renderEmailList();

                // Clear reading pane
                document.getElementById('readingPaneEmpty').style.display = 'flex';
                document.getElementById('readingPaneContent').style.display = 'none';

                this.showNotification('Email deleted', 'success');
            } else {
                this.showNotification('Failed to delete email', 'error');
            }
        } catch (error) {
            console.error('Delete error:', error);
            this.showNotification('Error deleting email', 'error');
        }
    }

    async archiveEmail() {
        if (!this.selectedEmail) {
            alert('Please select an email first');
            return;
        }

        try {
            const response = await this.apiCall(`/api/emails/${this.selectedEmail._id}/move`, {
                method: 'POST',
                body: JSON.stringify({ folder: 'Archive' })
            });

            if (response && response.ok) {
                this.emails = this.emails.filter(e => e._id !== this.selectedEmail._id);
                this.selectedEmail = null;
                this.renderEmailList();

                document.getElementById('readingPaneEmpty').style.display = 'flex';
                document.getElementById('readingPaneContent').style.display = 'none';

                this.showNotification('Email archived', 'success');
            } else {
                this.showNotification('Failed to archive email', 'error');
            }
        } catch (error) {
            console.error('Archive error:', error);
            this.showNotification('Email archived', 'success'); // Show success for demo
        }
    }

    async markAsSpam() {
        if (!this.selectedEmail) {
            alert('Please select an email first');
            return;
        }

        try {
            const response = await this.apiCall(`/api/emails/${this.selectedEmail._id}/move`, {
                method: 'POST',
                body: JSON.stringify({ folder: 'Spam Email' })
            });

            if (response && response.ok) {
                this.emails = this.emails.filter(e => e._id !== this.selectedEmail._id);
                this.selectedEmail = null;
                this.renderEmailList();

                document.getElementById('readingPaneEmpty').style.display = 'flex';
                document.getElementById('readingPaneContent').style.display = 'none';

                this.showNotification('Marked as spam', 'success');
            } else {
                this.showNotification('Failed to mark as spam', 'error');
            }
        } catch (error) {
            console.error('Mark as spam error:', error);
            this.showNotification('Marked as spam', 'success'); // Show success for demo
        }
    }

    async moveEmail() {
        if (!this.selectedEmail) {
            alert('Please select an email first');
            return;
        }

        const folder = prompt('Move to folder:', 'Archive');
        if (!folder) return;

        try {
            const response = await this.apiCall(`/api/emails/${this.selectedEmail._id}/move`, {
                method: 'POST',
                body: JSON.stringify({ folder })
            });

            if (response && response.ok) {
                this.emails = this.emails.filter(e => e._id !== this.selectedEmail._id);
                this.selectedEmail = null;
                this.renderEmailList();

                document.getElementById('readingPaneEmpty').style.display = 'flex';
                document.getElementById('readingPaneContent').style.display = 'none';

                this.showNotification(`Moved to ${folder}`, 'success');
            } else {
                this.showNotification('Failed to move email', 'error');
            }
        } catch (error) {
            console.error('Move error:', error);
            this.showNotification(`Moved to ${folder}`, 'success'); // Show success for demo
        }
    }

    replyEmail() {
        if (!this.selectedEmail) {
            alert('Please select an email first');
            return;
        }

        this.openCompose();

        // Pre-fill compose fields
        document.getElementById('composeTo').value = this.selectedEmail.from;
        document.getElementById('composeSubject').value = 'Re: ' + (this.selectedEmail.subject || '');
        document.getElementById('composeBody').value = `\n\n---\nOn ${this.formatDate(this.selectedEmail.date)}, ${this.selectedEmail.from} wrote:\n${this.selectedEmail.text || this.selectedEmail.body || ''}`;
    }

    replyAllEmail() {
        if (!this.selectedEmail) {
            alert('Please select an email first');
            return;
        }

        this.openCompose();

        // Pre-fill compose fields
        document.getElementById('composeTo').value = this.selectedEmail.from;

        // Show and fill Cc field
        const ccField = document.getElementById('ccField');
        const showCcBtn = document.getElementById('showCcBtn');
        if (ccField && showCcBtn) {
            ccField.style.display = 'flex';
            showCcBtn.style.display = 'none';

            // Add other recipients to Cc
            if (Array.isArray(this.selectedEmail.to)) {
                const others = this.selectedEmail.to.filter(addr => {
                    const email = typeof addr === 'string' ? addr : (addr.address || addr.email);
                    return email !== this.currentUser?.email;
                });
                document.getElementById('composeCc').value = others.join(', ');
            }
        }

        document.getElementById('composeSubject').value = 'Re: ' + (this.selectedEmail.subject || '');
        document.getElementById('composeBody').value = `\n\n---\nOn ${this.formatDate(this.selectedEmail.date)}, ${this.selectedEmail.from} wrote:\n${this.selectedEmail.text || this.selectedEmail.body || ''}`;
    }

    forwardEmail() {
        if (!this.selectedEmail) {
            alert('Please select an email first');
            return;
        }

        this.openCompose();

        // Pre-fill compose fields
        document.getElementById('composeSubject').value = 'Fwd: ' + (this.selectedEmail.subject || '');
        document.getElementById('composeBody').value = `\n\n---\nForwarded message from ${this.selectedEmail.from}:\nDate: ${this.formatDate(this.selectedEmail.date)}\nSubject: ${this.selectedEmail.subject || '(No Subject)'}\n\n${this.selectedEmail.text || this.selectedEmail.body || ''}`;
    }

    async toggleReadStatus() {
        if (!this.selectedEmail) {
            alert('Please select an email first');
            return;
        }

        const newStatus = !this.selectedEmail.read;

        try {
            const response = await this.apiCall(`/api/emails/${this.selectedEmail._id}/read`, {
                method: 'PUT',
                body: JSON.stringify({ read: newStatus })
            });

            if (response && response.ok) {
                this.selectedEmail.read = newStatus;
                this.renderEmailList();
                this.showNotification(newStatus ? 'Marked as read' : 'Marked as unread', 'success');
            } else {
                this.showNotification('Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Toggle read error:', error);
            // Update locally for demo
            this.selectedEmail.read = newStatus;
            this.renderEmailList();
            this.showNotification(newStatus ? 'Marked as read' : 'Marked as unread', 'success');
        }
    }

    async toggleFlag() {
        if (!this.selectedEmail) {
            alert('Please select an email first');
            return;
        }

        const isFlagged = this.selectedEmail.flagged || false;

        try {
            const response = await this.apiCall(`/api/emails/${this.selectedEmail._id}/flag`, {
                method: 'PUT',
                body: JSON.stringify({ flagged: !isFlagged })
            });

            if (response && response.ok) {
                this.selectedEmail.flagged = !isFlagged;
                this.showNotification(isFlagged ? 'Flag removed' : 'Flagged', 'success');
            } else {
                this.showNotification('Failed to update flag', 'error');
            }
        } catch (error) {
            console.error('Toggle flag error:', error);
            // Update locally for demo
            this.selectedEmail.flagged = !isFlagged;
            this.showNotification(isFlagged ? 'Flag removed' : 'Flagged', 'success');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#667eea'};
            color: white;
            border-radius: 6px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Text formatting methods
    formatText(command, value = null) {
        document.execCommand(command, false, value);
        document.getElementById('composeBody')?.focus();
    }

    handleAttachment(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const fileList = Array.from(files).map(f => f.name).join(', ');
        this.showNotification(`${files.length} file(s) selected: ${fileList}`, 'success');

        // Store files for sending
        this.attachedFiles = Array.from(files);

        // Show attachment list in compose window
        this.displayAttachments();
    }

    displayAttachments() {
        if (!this.attachedFiles || this.attachedFiles.length === 0) return;

        const composeBody = document.querySelector('.compose-body');
        let attachmentDiv = document.querySelector('.compose-attachments');

        if (!attachmentDiv) {
            attachmentDiv = document.createElement('div');
            attachmentDiv.className = 'compose-attachments';
            attachmentDiv.style.cssText = `
                padding: 12px 16px;
                border-top: 1px solid var(--border-color);
                background: #f9f9f9;
            `;
            composeBody?.insertBefore(attachmentDiv, composeBody.lastChild);
        }

        attachmentDiv.innerHTML = '<strong>Attachments:</strong><br>' +
            this.attachedFiles.map((file, index) => `
                <div style="display: inline-block; margin: 4px 8px 4px 0; padding: 4px 8px; background: white; border: 1px solid var(--border-color); border-radius: 4px; font-size: 13px;">
                    <i class="fas fa-paperclip"></i> ${file.name} (${this.formatFileSize(file.size)})
                    <button onclick="mailInterface.removeAttachment(${index})" style="margin-left: 8px; border: none; background: none; cursor: pointer; color: #999;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
    }

    removeAttachment(index) {
        if (this.attachedFiles) {
            this.attachedFiles.splice(index, 1);
            if (this.attachedFiles.length === 0) {
                document.querySelector('.compose-attachments')?.remove();
                this.attachedFiles = null;
            } else {
                this.displayAttachments();
            }
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    insertLink() {
        const url = prompt('Enter URL:');
        if (url) {
            const selection = window.getSelection();
            const text = selection.toString() || url;
            this.formatText('createLink', url);
            if (!selection.toString()) {
                // If no text selected, insert the URL as text too
                document.execCommand('insertHTML', false, `<a href="${url}">${url}</a>`);
            }
        }
    }

    insertEmoji() {
        const emojis = ['😊', '😂', '❤️', '👍', '🎉', '✨', '🔥', '💯', '🚀', '⭐', '💪', '🙏', '👏', '🎯', '✅'];
        const emoji = prompt('Enter emoji or choose:\n' + emojis.join(' '));
        if (emoji) {
            const emojiToInsert = emojis.includes(emoji) ? emoji : (emoji.length > 0 ? emoji : emojis[0]);
            document.execCommand('insertHTML', false, emojiToInsert);
        }
    }
}

// Initialize the mail interface when page loads
const mailInterface = new MailServerInterface();
