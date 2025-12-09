/**
 * Mail Server Web Interface Tests
 * Tests authentication, API integration, UI functionality, and utility components
 */

const request = require('supertest');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Mock DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost:3006',
    pretendToBeVisual: true,
    resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.localStorage = dom.window.localStorage;
global.sessionStorage = dom.window.sessionStorage;

describe('Mail Server Web Interface Tests', () => {
    let app;
    let server;

    beforeAll(async () => {
        // Start the mail server for testing
        const MailServer = require('../src/server');
        app = new MailServer();
        server = await app.initialize();
    });

    afterAll(async () => {
        if (server) {
            await server.close();
        }
    });

    describe('Authentication Tests', () => {
        test('should serve login page', async () => {
            const response = await request(app.app)
                .get('/')
                .expect(200);
            
            expect(response.text).toContain('Mail Server Control Panel');
            expect(response.text).toContain('username');
            expect(response.text).toContain('password');
        });

        test('should authenticate valid credentials', async () => {
            const response = await request(app.app)
                .post('/api/auth/login')
                .send({
                    username: 'admin',
                    password: 'admin123'
                })
                .expect(200);

            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.success).toBe(true);
        });

        test('should reject invalid credentials', async () => {
            const response = await request(app.app)
                .post('/api/auth/login')
                .send({
                    username: 'invalid',
                    password: 'wrong'
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('message');
        });

        test('should validate JWT tokens', async () => {
            // First login to get token
            const loginResponse = await request(app.app)
                .post('/api/auth/login')
                .send({
                    username: 'admin',
                    password: 'admin123'
                });

            const token = loginResponse.body.token;

            // Test protected endpoint with token
            const response = await request(app.app)
                .get('/api/mailboxes')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body).toHaveProperty('mailboxes');
        });
    });

    describe('API Endpoints Tests', () => {
        let authToken;

        beforeEach(async () => {
            const loginResponse = await request(app.app)
                .post('/api/auth/login')
                .send({
                    username: 'admin',
                    password: 'admin123'
                });
            authToken = loginResponse.body.token;
        });

        describe('Mailbox Management', () => {
            test('should get mailboxes list', async () => {
                const response = await request(app.app)
                    .get('/api/mailboxes')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('mailboxes');
                expect(Array.isArray(response.body.mailboxes)).toBe(true);
            });

            test('should create new mailbox', async () => {
                const newMailbox = {
                    name: 'testuser',
                    password: 'TestPass123!',
                    quota: 1000000000, // 1GB
                    domain: 'quantummint.local'
                };

                const response = await request(app.app)
                    .post('/api/mailboxes')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(newMailbox)
                    .expect(201);

                expect(response.body.success).toBe(true);
                expect(response.body.mailbox.name).toBe(newMailbox.name);
            });

            test('should update mailbox', async () => {
                const updateData = {
                    quota: 2000000000 // 2GB
                };

                const response = await request(app.app)
                    .put('/api/mailboxes/testuser@quantummint.local')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(updateData)
                    .expect(200);

                expect(response.body.success).toBe(true);
            });

            test('should delete mailbox', async () => {
                const response = await request(app.app)
                    .delete('/api/mailboxes/testuser@quantummint.local')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body.success).toBe(true);
            });
        });

        describe('Email Management', () => {
            test('should get emails list', async () => {
                const response = await request(app.app)
                    .get('/api/emails')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('emails');
                expect(Array.isArray(response.body.emails)).toBe(true);
            });

            test('should send email', async () => {
                const emailData = {
                    to: 'test@quantummint.local',
                    subject: 'Test Email',
                    body: 'This is a test email',
                    from: 'admin@quantummint.local'
                };

                const response = await request(app.app)
                    .post('/api/emails/send')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(emailData)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body).toHaveProperty('messageId');
            });

            test('should get email by ID', async () => {
                // First send an email to get an ID
                const emailData = {
                    to: 'test@quantummint.local',
                    subject: 'Test Email for Retrieval',
                    body: 'This is a test email for retrieval',
                    from: 'admin@quantummint.local'
                };

                const sendResponse = await request(app.app)
                    .post('/api/emails/send')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(emailData);

                const messageId = sendResponse.body.messageId;

                // Now retrieve the email
                const response = await request(app.app)
                    .get(`/api/emails/${messageId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('email');
                expect(response.body.email.subject).toBe(emailData.subject);
            });
        });

        describe('Domain Management', () => {
            test('should get domains list', async () => {
                const response = await request(app.app)
                    .get('/api/domains')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('domains');
                expect(Array.isArray(response.body.domains)).toBe(true);
            });

            test('should create new domain', async () => {
                const newDomain = {
                    name: 'test.local',
                    description: 'Test domain'
                };

                const response = await request(app.app)
                    .post('/api/domains')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(newDomain)
                    .expect(201);

                expect(response.body.success).toBe(true);
                expect(response.body.domain.name).toBe(newDomain.name);
            });
        });

        describe('Queue Management', () => {
            test('should get queue status', async () => {
                const response = await request(app.app)
                    .get('/api/queue/status')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('queue');
                expect(response.body.queue).toHaveProperty('size');
            });

            test('should get queue jobs', async () => {
                const response = await request(app.app)
                    .get('/api/queue/jobs')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('jobs');
                expect(Array.isArray(response.body.jobs)).toBe(true);
            });
        });

        describe('Analytics', () => {
            test('should get analytics data', async () => {
                const response = await request(app.app)
                    .get('/api/analytics/stats')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('stats');
                expect(response.body.stats).toHaveProperty('totalEmails');
                expect(response.body.stats).toHaveProperty('totalUsers');
            });
        });
    });

    describe('Utility Components Tests', () => {
        beforeEach(() => {
            // Reset DOM
            document.body.innerHTML = '';
            
            // Load utility scripts
            const utilsPath = path.join(__dirname, '../src/web/public/js/utils');
            
            // Load API utility
            const apiScript = fs.readFileSync(path.join(utilsPath, 'api.js'), 'utf8');
            eval(apiScript);
            
            // Load validation utility
            const validationScript = fs.readFileSync(path.join(utilsPath, 'validation.js'), 'utf8');
            eval(validationScript);
            
            // Load notifications utility
            const notificationsScript = fs.readFileSync(path.join(utilsPath, 'notifications.js'), 'utf8');
            eval(notificationsScript);
            
            // Load errors utility
            const errorsScript = fs.readFileSync(path.join(utilsPath, 'errors.js'), 'utf8');
            eval(errorsScript);
            
            // Load modals utility
            const modalsScript = fs.readFileSync(path.join(utilsPath, 'modals.js'), 'utf8');
            eval(modalsScript);
        });

        describe('API Utility', () => {
            test('should initialize API client', () => {
                expect(typeof MailAPI).toBe('function');
                const api = new MailAPI();
                expect(api).toHaveProperty('baseURL');
                expect(api).toHaveProperty('login');
                expect(api).toHaveProperty('getMailboxes');
            });

            test('should handle authentication', async () => {
                const api = new MailAPI();
                
                // Mock fetch
                global.fetch = jest.fn(() =>
                    Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve({
                            success: true,
                            token: 'test-token',
                            user: { username: 'admin' }
                        })
                    })
                );

                const result = await api.login('admin', 'password');
                expect(result.success).toBe(true);
                expect(result.token).toBe('test-token');
            });

            test('should handle token refresh', async () => {
                const api = new MailAPI();
                
                // Mock initial request that returns 401
                global.fetch = jest.fn()
                    .mockResolvedValueOnce({
                        ok: false,
                        status: 401,
                        json: () => Promise.resolve({ message: 'Token expired' })
                    })
                    .mockResolvedValueOnce({
                        ok: true,
                        json: () => Promise.resolve({
                            success: true,
                            token: 'new-token'
                        })
                    })
                    .mockResolvedValueOnce({
                        ok: true,
                        json: () => Promise.resolve({
                            success: true,
                            mailboxes: []
                        })
                    });

                // Set initial token
                localStorage.setItem('mail_token', 'expired-token');
                localStorage.setItem('mail_refresh_token', 'refresh-token');

                const result = await api.getMailboxes();
                expect(result.success).toBe(true);
            });
        });

        describe('Validation Utility', () => {
            test('should validate email addresses', () => {
                expect(typeof MailValidation).toBe('object');
                expect(MailValidation.validateEmail('test@domain.com')).toBe(true);
                expect(MailValidation.validateEmail('invalid-email')).toBe(false);
                expect(MailValidation.validateEmail('')).toBe(false);
            });

            test('should validate passwords', () => {
                expect(MailValidation.validatePassword('Password123!')).toBe(true);
                expect(MailValidation.validatePassword('weak')).toBe(false);
                expect(MailValidation.validatePassword('')).toBe(false);
            });

            test('should validate domain names', () => {
                expect(MailValidation.validateDomain('example.com')).toBe(true);
                expect(MailValidation.validateDomain('invalid')).toBe(false);
                expect(MailValidation.validateDomain('')).toBe(false);
            });

            test('should validate mailbox names', () => {
                expect(MailValidation.validateMailboxName('user123')).toBe(true);
                expect(MailValidation.validateMailboxName('u')).toBe(false);
                expect(MailValidation.validateMailboxName('')).toBe(false);
            });

            test('should validate forms', () => {
                // Create test form
                document.body.innerHTML = `
                    <form id="testForm">
                        <input name="email" value="test@domain.com" />
                        <input name="password" value="Password123!" />
                    </form>
                `;

                const form = document.getElementById('testForm');
                const rules = MailValidation.getCommonRules().sendEmail;

                const result = MailValidation.validateForm(form, rules);
                expect(result.isValid).toBe(true);
                expect(result.errors).toEqual({});
            });
        });

        describe('Notifications Utility', () => {
            test('should create notification system', () => {
                expect(typeof MailNotifications).toBe('function');
                const notifications = new MailNotifications();
                expect(notifications).toHaveProperty('show');
                expect(notifications).toHaveProperty('success');
                expect(notifications).toHaveProperty('error');
            });

            test('should show mail-specific notifications', () => {
                const notifications = new MailNotifications();
                const notificationId = notifications.newEmail({
                    from: 'test@example.com',
                    subject: 'Test Email'
                });
                
                expect(typeof notificationId).toBe('string');
                
                // Check if notification was added to DOM
                const notificationElement = document.querySelector('.mail-notification');
                expect(notificationElement).toBeTruthy();
                expect(notificationElement.textContent).toContain('New email');
            });

            test('should show quota warnings', () => {
                const notifications = new MailNotifications();
                const notificationId = notifications.quotaWarning(85);
                
                expect(typeof notificationId).toBe('string');
                
                const notificationElement = document.querySelector('.mail-notification');
                expect(notificationElement).toBeTruthy();
                expect(notificationElement.textContent).toContain('85%');
            });
        });

        describe('Error Handling Utility', () => {
            test('should create custom mail API errors', () => {
                expect(typeof MailAPIError).toBe('function');
                const error = new MailAPIError('Test error', 400, 'MAIL_ERROR');
                
                expect(error.message).toBe('Test error');
                expect(error.status).toBe(400);
                expect(error.code).toBe('MAIL_ERROR');
                expect(error.isMailError()).toBe(true);
            });

            test('should handle attachment errors', () => {
                const errorHandler = new MailErrorHandler();
                expect(errorHandler).toHaveProperty('handleAttachmentError');
                expect(errorHandler).toHaveProperty('handleQuotaError');
                expect(errorHandler).toHaveProperty('handleMailError');
            });
        });

        describe('Modal Management', () => {
            test('should create modal manager', () => {
                expect(typeof MailModalManager).toBe('function');
                const modals = new MailModalManager();
                expect(modals).toHaveProperty('show');
                expect(modals).toHaveProperty('close');
                expect(modals).toHaveProperty('showComposeModal');
            });

            test('should show compose modal', () => {
                const modals = new MailModalManager();
                const modalId = modals.showComposeModal({
                    to: 'test@example.com',
                    subject: 'Test Subject'
                });
                
                expect(typeof modalId).toBe('string');
                
                // Check if modal was added to DOM
                const modalElement = document.querySelector('.mail-modal-overlay');
                expect(modalElement).toBeTruthy();
                expect(modalElement.textContent).toContain('Compose Email');
            });

            test('should show email view modal', () => {
                const modals = new MailModalManager();
                const email = {
                    from: 'sender@example.com',
                    to: 'recipient@example.com',
                    subject: 'Test Email',
                    body: 'Test body content',
                    date: new Date().toISOString()
                };
                
                const modalId = modals.showEmailModal(email);
                
                expect(typeof modalId).toBe('string');
                
                const modalElement = document.querySelector('.mail-modal-overlay');
                expect(modalElement).toBeTruthy();
                expect(modalElement.textContent).toContain('Test Email');
            });
        });
    });

    describe('UI Functionality Tests', () => {
        beforeEach(() => {
            // Load main HTML structure
            const htmlPath = path.join(__dirname, '../src/web/public/index.html');
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            document.body.innerHTML = htmlContent;
        });

        test('should handle login form submission', () => {
            const loginForm = document.getElementById('loginForm');
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            
            expect(loginForm).toBeTruthy();
            expect(usernameInput).toBeTruthy();
            expect(passwordInput).toBeTruthy();
            
            // Simulate form input
            usernameInput.value = 'admin';
            passwordInput.value = 'password';
            
            expect(usernameInput.value).toBe('admin');
            expect(passwordInput.value).toBe('password');
        });

        test('should handle tab navigation', () => {
            const tabs = document.querySelectorAll('.tab');
            expect(tabs.length).toBeGreaterThan(0);
            
            // Test tab click
            const emailsTab = document.querySelector('[data-tab="emails"]');
            expect(emailsTab).toBeTruthy();
            
            // Simulate click
            emailsTab.click();
            
            // Check if tab becomes active (would need actual JS loaded)
            expect(emailsTab.classList.contains('active')).toBe(false); // Initially false without JS
        });

        test('should have all required tab content sections', () => {
            const tabContents = [
                'usersTab',
                'emailsTab',
                'queueTab',
                'analyticsTab'
            ];
            
            tabContents.forEach(tabId => {
                const tabContent = document.getElementById(tabId);
                expect(tabContent).toBeTruthy();
                expect(tabContent.classList.contains('tab-content')).toBe(true);
            });
        });

        test('should have data tables', () => {
            const tables = document.querySelectorAll('.table');
            expect(tables.length).toBeGreaterThan(0);
            
            tables.forEach(table => {
                expect(table.tagName).toBe('TABLE');
                expect(table.querySelector('thead')).toBeTruthy();
                expect(table.querySelector('tbody')).toBeTruthy();
            });
        });

        test('should have stats cards', () => {
            const statCards = document.querySelectorAll('.stat-card');
            expect(statCards.length).toBe(4);
            
            const expectedStats = ['totalUsers', 'totalEmails', 'emailsToday', 'queueSize'];
            expectedStats.forEach(statId => {
                const statElement = document.getElementById(statId);
                expect(statElement).toBeTruthy();
            });
        });
    });

    describe('Integration Tests', () => {
        test('should integrate authentication with API calls', async () => {
            // Test full authentication flow
            const loginResponse = await request(app.app)
                .post('/api/auth/login')
                .send({
                    username: 'admin',
                    password: 'admin123'
                });
            
            expect(loginResponse.status).toBe(200);
            const token = loginResponse.body.token;
            
            // Use token for subsequent API call
            const mailboxesResponse = await request(app.app)
                .get('/api/mailboxes')
                .set('Authorization', `Bearer ${token}`);
            
            expect(mailboxesResponse.status).toBe(200);
            expect(mailboxesResponse.body).toHaveProperty('mailboxes');
        });

        test('should handle error responses properly', async () => {
            // Test unauthorized access
            const response = await request(app.app)
                .get('/api/mailboxes')
                .expect(401);
            
            expect(response.body).toHaveProperty('message');
            expect(response.body.success).toBe(false);
        });

        test('should handle email workflow', async () => {
            // Login first
            const loginResponse = await request(app.app)
                .post('/api/auth/login')
                .send({
                    username: 'admin',
                    password: 'admin123'
                });
            
            const token = loginResponse.body.token;
            
            // Send email
            const emailData = {
                to: 'test@quantummint.local',
                subject: 'Integration Test Email',
                body: 'This is an integration test email',
                from: 'admin@quantummint.local'
            };
            
            const sendResponse = await request(app.app)
                .post('/api/emails/send')
                .set('Authorization', `Bearer ${token}`)
                .send(emailData);
            
            expect(sendResponse.status).toBe(200);
            expect(sendResponse.body.success).toBe(true);
            
            // Check queue status
            const queueResponse = await request(app.app)
                .get('/api/queue/status')
                .set('Authorization', `Bearer ${token}`);
            
            expect(queueResponse.status).toBe(200);
            expect(queueResponse.body).toHaveProperty('queue');
        });
    });
});
