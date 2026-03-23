const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const { main: logger } = require('./src/utils/logger');
const MailServerAPI = require('./src/web/routes/api');
const MailService = require('./src/services/MailService');

// Mock Config
const config = {
    web: {
        staticPath: path.join(__dirname, 'src', 'web', 'public'),
        viewsPath: path.join(__dirname, 'src', 'web', 'public')
    },
    JWT_SECRET: 'test-secret-123',
    jwt: {
        secret: 'test-secret-123',
        expiresIn: '8h'
    }
};

// Mock Services
const mockServices = {
    queue: {
        queues: {
            localDelivery: {
                getJobs: async () => [
                    { id: '1', name: 'deliver-local', data: { to: 'user@local' }, status: 'waiting', timestamp: Date.now() - 1000 }
                ],
                getJob: async () => null,
                getWaiting: async () => [1],
                getActive: async () => [],
                getCompleted: async () => [],
                getFailed: async () => [],
                getDelayed: async () => []
            },
            remoteDelivery: {
                getJobs: async () => [
                    { id: '2', name: 'deliver-remote', data: { to: 'user@remote' }, status: 'failed', failedReason: 'Connection timeout', timestamp: Date.now() - 5000 }
                ],
                getJob: async () => null,
                getWaiting: async () => [],
                getActive: async () => [],
                getCompleted: async () => [],
                getFailed: async () => [1],
                getDelayed: async () => []
            }
        },
        getQueueStats: async () => ({
            localDelivery: { waiting: 1, active: 0, completed: 10, failed: 0, delayed: 0 },
            remoteDelivery: { waiting: 0, active: 0, completed: 5, failed: 1, delayed: 0 }
        })
    },
    analytics: {
        getOverview: async () => ({
            emails: {
                total: 100,
                spam: 5,
                virus: 1,
                bounced: 2,
                delivered: 92,
                folders: { INBOX: 50, Sent: 30, Spam: 5, Trash: 15 }
            },
            security: {
                blockedIPs: 10,
                authFailures: 25,
                spfFailures: 5,
                dkimFailures: 2
            },
            users: { active: 10, total: 12 }
        })
    },
    security: {
        getSecurityStats: async () => ({}),
        checkRateLimit: async () => true
    }
};

async function startPreview() {
    try {
        console.log('Starting preview server setup...');

        // Mock Models
        const MailUser = require('./src/models/MailUser');
        const EmailMessage = require('./src/models/EmailMessage');

        MailUser.countDocuments = async () => 150;
        MailUser.findOne = async () => ({
            _id: 'mock-id',
            id: 'mock-id',
            username: 'admin',
            email: 'admin@quantummint.local',
            isAdmin: true,
            isActive: true,
            permissions: ['admin'],
            comparePassword: async () => true,
            resetLoginAttempts: async () => { },
            save: async () => { }
        });
        MailUser.findByEmailOrUsername = async () => MailUser.findOne();
        MailUser.find = () => ({
            sort: () => ({
                skip: () => ({
                    limit: () => ({
                        select: () => [
                            { _id: '1', username: 'admin', email: 'admin@quantummint.local', isActive: true, lastLogin: new Date() },
                            { _id: '2', username: 'user1', email: 'user1@quantummint.local', isActive: true, lastLogin: new Date() }
                        ]
                    })
                })
            })
        });

        EmailMessage.countDocuments = async () => 5420;
        EmailMessage.aggregate = async () => [{ totalSize: 1024 * 1024 * 50 }]; // Mock 50MB used
        EmailMessage.distinct = async () => ['Work', 'Personal', 'Finance'];
        EmailMessage.updateMany = async () => ({ modifiedCount: 1 });
        EmailMessage.updateOne = async () => ({ modifiedCount: 1 });
        EmailMessage.find = () => ({
            populate: () => ({
                sort: () => ({
                    skip: () => ({
                        limit: () => ({
                            select: () => [
                                { _id: 'msg1', subject: 'Welcome to QuantumMint', from: 'system@quantummint.local', to: [{ address: 'admin@quantummint.local' }], date: new Date(), size: 1024, folder: 'Inbox', flags: [], textContent: 'Welcome!' },
                                { _id: 'msg2', subject: 'Security Alert', from: 'security@quantummint.local', to: [{ address: 'admin@quantummint.local' }], date: new Date(), size: 2048, folder: 'Inbox', flags: ['seen'], textContent: 'Alert!' }
                            ]
                        })
                    })
                })
            }),
            sort: () => ({
                skip: () => ({
                    limit: () => [
                        { _id: 'msg1', subject: 'Welcome to QuantumMint', from: 'system@quantummint.local', to: [{ address: 'admin@quantummint.local' }], date: new Date(), size: 1024, folder: 'Inbox', flags: [], textContent: 'Welcome!' },
                        { _id: 'msg2', subject: 'Security Alert', from: 'security@quantummint.local', to: [{ address: 'admin@quantummint.local' }], date: new Date(), size: 2048, folder: 'Inbox', flags: ['seen'], textContent: 'Alert!' }
                    ]
                })
            })
        });

        console.log('Models mocked.');

        const mailService = new MailService(config, mockServices);
        const services = { ...mockServices, mail: mailService };
        const api = new MailServerAPI(services, config);

        console.log('API initialized.');

        // Pre-populate session for the mock user
        api.auth.activeSessions.set('mock-id', {
            userId: 'mock-id',
            email: 'admin@quantummint.local',
            username: 'admin',
            lastActivity: Date.now()
        });

        const app = express();
        app.use(express.json());

        // Mock Login for Preview - ensure we return a token that verifyToken will like
        app.post('/api/auth/login', (req, res) => {
            console.log('Login attempt:', req.body);
            const user = {
                id: 'mock-id',
                email: 'admin@quantummint.local',
                username: 'admin',
                role: 'admin',
                permissions: ['admin', 'account_read', 'domain_read', 'security_read', 'analytics_read', 'queue_read']
            };

            const token = api.auth.generateToken(user);

            // Create/Update session
            api.auth.activeSessions.set('mock-id', {
                userId: 'mock-id',
                email: 'admin@quantummint.local',
                username: 'admin',
                loginTime: Date.now(),
                lastActivity: Date.now(),
                ipAddress: req.ip,
                userAgent: req.headers['user-agent']
            });

            console.log('Token generated and session active.');
            res.json({ token, user: { username: 'admin', email: 'admin@quantummint.local' } });
        });

        app.use('/api', api.getRouter());

        // Handle API 404s before the catch-all
        app.use('/api', (req, res) => {
            console.log(`404 API: ${req.method} ${req.url}`);
            res.status(404).json({ error: 'API endpoint not found' });
        });

        app.use(express.static(config.web.staticPath));

        app.get('*', (req, res) => {
            res.sendFile(path.join(config.web.staticPath, 'index.html'));
        });

        const port = 8081;
        app.listen(port, () => {
            console.log(`Preview Server running at http://localhost:${port}`);
            console.log(`Login with any credentials (e.g., admin/password)`);
        });

    } catch (error) {
        console.error('Failed to start preview:', error);
        console.error(error.stack);
    }
}

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

startPreview();
