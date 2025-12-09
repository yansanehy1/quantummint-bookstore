/**
 * Domain Controller Web Interface Tests
 * Tests authentication, API integration, UI functionality, and utility components
 */

const request = require('supertest');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Mock DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost:8080',
    pretendToBeVisual: true,
    resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.localStorage = dom.window.localStorage;
global.sessionStorage = dom.window.sessionStorage;

describe('Domain Controller Web Interface Tests', () => {
    let app;
    let server;

    beforeAll(async () => {
        // Start the domain controller server for testing
        const DomainController = require('../src/server');
        app = new DomainController();
        server = await app.start();
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
            
            expect(response.text).toContain('Domain Controller Login');
            expect(response.text).toContain('username');
            expect(response.text).toContain('password');
        });

        test('should authenticate valid credentials', async () => {
            const response = await request(app.app)
                .post('/api/auth/login')
                .send({
                    username: 'administrator',
                    password: 'admin123',
                    domain: 'quantummint.local'
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
                    password: 'wrong',
                    domain: 'quantummint.local'
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
                    username: 'administrator',
                    password: 'admin123',
                    domain: 'quantummint.local'
                });

            const token = loginResponse.body.token;

            // Test protected endpoint with token
            const response = await request(app.app)
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body).toHaveProperty('users');
        });
    });

    describe('API Endpoints Tests', () => {
        let authToken;

        beforeEach(async () => {
            const loginResponse = await request(app.app)
                .post('/api/auth/login')
                .send({
                    username: 'administrator',
                    password: 'admin123',
                    domain: 'quantummint.local'
                });
            authToken = loginResponse.body.token;
        });

        describe('User Management', () => {
            test('should get users list', async () => {
                const response = await request(app.app)
                    .get('/api/users')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('users');
                expect(Array.isArray(response.body.users)).toBe(true);
            });

            test('should create new user', async () => {
                const newUser = {
                    username: 'testuser',
                    password: 'TestPass123!',
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@quantummint.local'
                };

                const response = await request(app.app)
                    .post('/api/users')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(newUser)
                    .expect(201);

                expect(response.body.success).toBe(true);
                expect(response.body.user.username).toBe(newUser.username);
            });

            test('should update user', async () => {
                const updateData = {
                    firstName: 'Updated',
                    lastName: 'Name'
                };

                const response = await request(app.app)
                    .put('/api/users/testuser')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(updateData)
                    .expect(200);

                expect(response.body.success).toBe(true);
            });

            test('should delete user', async () => {
                const response = await request(app.app)
                    .delete('/api/users/testuser')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body.success).toBe(true);
            });
        });

        describe('Group Management', () => {
            test('should get groups list', async () => {
                const response = await request(app.app)
                    .get('/api/groups')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('groups');
                expect(Array.isArray(response.body.groups)).toBe(true);
            });

            test('should create new group', async () => {
                const newGroup = {
                    name: 'TestGroup',
                    description: 'Test security group',
                    type: 'security'
                };

                const response = await request(app.app)
                    .post('/api/groups')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(newGroup)
                    .expect(201);

                expect(response.body.success).toBe(true);
                expect(response.body.group.name).toBe(newGroup.name);
            });
        });

        describe('Computer Management', () => {
            test('should get computers list', async () => {
                const response = await request(app.app)
                    .get('/api/computers')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('computers');
                expect(Array.isArray(response.body.computers)).toBe(true);
            });
        });

        describe('DNS Management', () => {
            test('should get DNS records', async () => {
                const response = await request(app.app)
                    .get('/api/dns/records')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('records');
                expect(Array.isArray(response.body.records)).toBe(true);
            });

            test('should create DNS record', async () => {
                const dnsRecord = {
                    name: 'test',
                    type: 'A',
                    value: '192.168.1.100',
                    ttl: 300,
                    zone: 'quantummint.local'
                };

                const response = await request(app.app)
                    .post('/api/dns/records')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(dnsRecord)
                    .expect(201);

                expect(response.body.success).toBe(true);
            });
        });

        describe('Audit Logs', () => {
            test('should get audit logs', async () => {
                const response = await request(app.app)
                    .get('/api/audit/logs')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('logs');
                expect(Array.isArray(response.body.logs)).toBe(true);
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
                expect(typeof DomainAPI).toBe('function');
                const api = new DomainAPI();
                expect(api).toHaveProperty('baseURL');
                expect(api).toHaveProperty('login');
                expect(api).toHaveProperty('getUsers');
            });

            test('should handle authentication', async () => {
                const api = new DomainAPI();
                
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

                const result = await api.login('admin', 'password', 'domain');
                expect(result.success).toBe(true);
                expect(result.token).toBe('test-token');
            });
        });

        describe('Validation Utility', () => {
            test('should validate usernames', () => {
                expect(typeof DomainValidation).toBe('object');
                expect(DomainValidation.validateUsername('admin')).toBe(true);
                expect(DomainValidation.validateUsername('a')).toBe(false);
                expect(DomainValidation.validateUsername('')).toBe(false);
            });

            test('should validate passwords', () => {
                expect(DomainValidation.validatePassword('Password123!')).toBe(true);
                expect(DomainValidation.validatePassword('weak')).toBe(false);
                expect(DomainValidation.validatePassword('')).toBe(false);
            });

            test('should validate emails', () => {
                expect(DomainValidation.validateEmail('test@domain.com')).toBe(true);
                expect(DomainValidation.validateEmail('invalid-email')).toBe(false);
                expect(DomainValidation.validateEmail('')).toBe(false);
            });

            test('should validate forms', () => {
                // Create test form
                document.body.innerHTML = `
                    <form id="testForm">
                        <input name="username" value="admin" />
                        <input name="email" value="test@domain.com" />
                    </form>
                `;

                const form = document.getElementById('testForm');
                const rules = {
                    username: { required: true, minLength: 3 },
                    email: { required: true, email: true }
                };

                const result = DomainValidation.validateForm(form, rules);
                expect(result.isValid).toBe(true);
                expect(result.errors).toEqual({});
            });
        });

        describe('Notifications Utility', () => {
            test('should create notification system', () => {
                expect(typeof DomainNotifications).toBe('function');
                const notifications = new DomainNotifications();
                expect(notifications).toHaveProperty('show');
                expect(notifications).toHaveProperty('success');
                expect(notifications).toHaveProperty('error');
            });

            test('should show notifications', () => {
                const notifications = new DomainNotifications();
                const notificationId = notifications.success('Test message');
                
                expect(typeof notificationId).toBe('string');
                
                // Check if notification was added to DOM
                const notificationElement = document.querySelector('.domain-notification');
                expect(notificationElement).toBeTruthy();
                expect(notificationElement.textContent).toContain('Test message');
            });
        });

        describe('Error Handling Utility', () => {
            test('should create custom API errors', () => {
                expect(typeof APIError).toBe('function');
                const error = new APIError('Test error', 400, 'VALIDATION_ERROR');
                
                expect(error.message).toBe('Test error');
                expect(error.status).toBe(400);
                expect(error.code).toBe('VALIDATION_ERROR');
                expect(error.isValidationError()).toBe(true);
            });

            test('should handle API errors', () => {
                const errorHandler = new DomainErrorHandler();
                expect(errorHandler).toHaveProperty('handleAPIError');
                expect(errorHandler).toHaveProperty('handleValidationError');
                expect(errorHandler).toHaveProperty('handleNetworkError');
            });
        });

        describe('Modal Management', () => {
            test('should create modal manager', () => {
                expect(typeof DomainModalManager).toBe('function');
                const modals = new DomainModalManager();
                expect(modals).toHaveProperty('show');
                expect(modals).toHaveProperty('close');
                expect(modals).toHaveProperty('confirm');
            });

            test('should show modals', () => {
                const modals = new DomainModalManager();
                const modalId = modals.show({
                    title: 'Test Modal',
                    content: 'Test content'
                });
                
                expect(typeof modalId).toBe('string');
                
                // Check if modal was added to DOM
                const modalElement = document.querySelector('.domain-modal-overlay');
                expect(modalElement).toBeTruthy();
                expect(modalElement.textContent).toContain('Test Modal');
            });

            test('should handle confirmation dialogs', async () => {
                const modals = new DomainModalManager();
                
                // Mock user clicking confirm
                setTimeout(() => {
                    const confirmBtn = document.querySelector('.btn-primary');
                    if (confirmBtn) confirmBtn.click();
                }, 100);
                
                const result = await modals.confirm('Test', 'Are you sure?');
                expect(result).toBe(true);
            });
        });
    });

    describe('UI Functionality Tests', () => {
        beforeEach(() => {
            // Load main HTML structure
            const htmlPath = path.join(__dirname, '../src/web/views/index.html');
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            document.body.innerHTML = htmlContent;
        });

        test('should handle login form submission', () => {
            const loginForm = document.getElementById('login-form');
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

        test('should handle navigation menu', () => {
            const navItems = document.querySelectorAll('.nav-item');
            expect(navItems.length).toBeGreaterThan(0);
            
            // Test navigation click
            const usersNavItem = document.querySelector('[data-section="users"]');
            expect(usersNavItem).toBeTruthy();
            
            // Simulate click
            usersNavItem.click();
            
            // Check if section becomes active (would need actual JS loaded)
            expect(usersNavItem.classList.contains('active')).toBe(false); // Initially false without JS
        });

        test('should have all required sections', () => {
            const sections = [
                'dashboard-section',
                'users-section',
                'groups-section',
                'computers-section',
                'dns-section',
                'policies-section',
                'security-section',
                'audit-section'
            ];
            
            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                expect(section).toBeTruthy();
            });
        });

        test('should have data tables', () => {
            const tables = [
                'users-table',
                'groups-table',
                'computers-table',
                'dns-table',
                'policies-table',
                'audit-table'
            ];
            
            tables.forEach(tableId => {
                const table = document.getElementById(tableId);
                expect(table).toBeTruthy();
                expect(table.tagName).toBe('TABLE');
            });
        });
    });

    describe('Integration Tests', () => {
        test('should integrate authentication with API calls', async () => {
            // Test full authentication flow
            const loginResponse = await request(app.app)
                .post('/api/auth/login')
                .send({
                    username: 'administrator',
                    password: 'admin123',
                    domain: 'quantummint.local'
                });
            
            expect(loginResponse.status).toBe(200);
            const token = loginResponse.body.token;
            
            // Use token for subsequent API call
            const usersResponse = await request(app.app)
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`);
            
            expect(usersResponse.status).toBe(200);
            expect(usersResponse.body).toHaveProperty('users');
        });

        test('should handle error responses properly', async () => {
            // Test unauthorized access
            const response = await request(app.app)
                .get('/api/users')
                .expect(401);
            
            expect(response.body).toHaveProperty('message');
            expect(response.body.success).toBe(false);
        });
    });
});
