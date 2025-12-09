const express = require('express');
const WebAuthMiddleware = require('../middleware/auth');
const { logger } = require('@quantummint/shared/utils/logger');

class DomainControllerAPI {
    constructor(services, config) {
        this.router = express.Router();
        this.services = services;
        this.auth = new WebAuthMiddleware(config);
        
        this.setupRoutes();
        this.auth.startSessionCleanup();
    }

    setupRoutes() {
        // Authentication routes
        this.router.post('/auth/login', (req, res) => 
            this.auth.login(req, res, this.services.directory));
        this.router.post('/auth/logout', this.auth.authenticate.bind(this.auth), 
            this.auth.logout.bind(this.auth));
        this.router.get('/auth/user', this.auth.authenticate.bind(this.auth), 
            this.auth.getCurrentUser.bind(this.auth));
        this.router.get('/auth/sessions', this.auth.authenticate.bind(this.auth), 
            this.auth.getActiveSessions.bind(this.auth));

        // Dashboard stats
        this.router.get('/stats', this.auth.authenticate.bind(this.auth), 
            this.getDashboardStats.bind(this));

        // User management
        this.router.get('/users', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('user_read'), this.getUsers.bind(this));
        this.router.post('/users', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('user_create'), this.createUser.bind(this));
        this.router.get('/users/:id', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('user_read'), this.getUser.bind(this));
        this.router.put('/users/:id', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('user_update'), this.updateUser.bind(this));
        this.router.delete('/users/:id', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('user_delete'), this.deleteUser.bind(this));

        // Group management
        this.router.get('/groups', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('group_read'), this.getGroups.bind(this));
        this.router.post('/groups', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('group_create'), this.createGroup.bind(this));
        this.router.get('/groups/:id', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('group_read'), this.getGroup.bind(this));
        this.router.put('/groups/:id', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('group_update'), this.updateGroup.bind(this));
        this.router.delete('/groups/:id', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('group_delete'), this.deleteGroup.bind(this));

        // Computer management
        this.router.get('/computers', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('computer_read'), this.getComputers.bind(this));
        this.router.post('/computers', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('computer_create'), this.createComputer.bind(this));
        this.router.get('/computers/:id', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('computer_read'), this.getComputer.bind(this));
        this.router.put('/computers/:id', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('computer_update'), this.updateComputer.bind(this));
        this.router.delete('/computers/:id', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('computer_delete'), this.deleteComputer.bind(this));

        // DNS management
        this.router.get('/dns/records', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('dns_read'), this.getDNSRecords.bind(this));
        this.router.post('/dns/records', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('dns_create'), this.createDNSRecord.bind(this));
        this.router.put('/dns/records/:id', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('dns_update'), this.updateDNSRecord.bind(this));
        this.router.delete('/dns/records/:id', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('dns_delete'), this.deleteDNSRecord.bind(this));

        // Group Policy management
        this.router.get('/policies', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('policy_read'), this.getPolicies.bind(this));
        this.router.post('/policies', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('policy_create'), this.createPolicy.bind(this));
        this.router.get('/policies/:id', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('policy_read'), this.getPolicy.bind(this));
        this.router.put('/policies/:id', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('policy_update'), this.updatePolicy.bind(this));
        this.router.delete('/policies/:id', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('policy_delete'), this.deletePolicy.bind(this));

        // Audit logs
        this.router.get('/audit', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('audit_read'), this.getAuditLogs.bind(this));

        // Security settings
        this.router.get('/security', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('security_read'), this.getSecuritySettings.bind(this));
        this.router.put('/security', this.auth.authenticate.bind(this.auth), 
            this.auth.requirePermission('security_update'), this.updateSecuritySettings.bind(this));
    }

    async getDashboardStats(req, res) {
        try {
            const stats = await Promise.all([
                this.services.directory.getUserCount(),
                this.services.directory.getGroupCount(),
                this.services.directory.getComputerCount(),
                this.services.dns.getRecordCount(),
                this.services.audit.getRecentActivityCount(),
                this.services.security.getSecurityStatus()
            ]);

            res.json({
                totalUsers: stats[0],
                totalGroups: stats[1],
                totalComputers: stats[2],
                dnsRecords: stats[3],
                recentActivity: stats[4],
                securityStatus: stats[5],
                timestamp: Date.now()
            });
        } catch (error) {
            logger.error('Failed to get dashboard stats:', error);
            res.status(500).json({ error: 'Failed to retrieve dashboard statistics' });
        }
    }

    async getUsers(req, res) {
        try {
            const { page = 1, limit = 50, search, filter } = req.query;
            const users = await this.services.directory.getUsers({
                page: parseInt(page),
                limit: parseInt(limit),
                search,
                filter
            });

            res.json(users);
        } catch (error) {
            logger.error('Failed to get users:', error);
            res.status(500).json({ error: 'Failed to retrieve users' });
        }
    }

    async createUser(req, res) {
        try {
            const userData = req.body;
            const user = await this.services.directory.createUser(userData);
            
            // Log audit event
            await this.services.audit.logEvent({
                action: 'user_created',
                userId: req.user.id,
                targetId: user.id,
                details: { username: user.username }
            });

            res.status(201).json(user);
        } catch (error) {
            logger.error('Failed to create user:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    }

    async getUser(req, res) {
        try {
            const { id } = req.params;
            const user = await this.services.directory.getUser(id);
            
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            logger.error('Failed to get user:', error);
            res.status(500).json({ error: 'Failed to retrieve user' });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const user = await this.services.directory.updateUser(id, updateData);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Log audit event
            await this.services.audit.logEvent({
                action: 'user_updated',
                userId: req.user.id,
                targetId: id,
                details: updateData
            });

            res.json(user);
        } catch (error) {
            logger.error('Failed to update user:', error);
            res.status(500).json({ error: 'Failed to update user' });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const success = await this.services.directory.deleteUser(id);
            
            if (!success) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Log audit event
            await this.services.audit.logEvent({
                action: 'user_deleted',
                userId: req.user.id,
                targetId: id
            });

            res.json({ success: true });
        } catch (error) {
            logger.error('Failed to delete user:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }

    async getGroups(req, res) {
        try {
            const { page = 1, limit = 50, search } = req.query;
            const groups = await this.services.directory.getGroups({
                page: parseInt(page),
                limit: parseInt(limit),
                search
            });

            res.json(groups);
        } catch (error) {
            logger.error('Failed to get groups:', error);
            res.status(500).json({ error: 'Failed to retrieve groups' });
        }
    }

    async createGroup(req, res) {
        try {
            const groupData = req.body;
            const group = await this.services.directory.createGroup(groupData);
            
            // Log audit event
            await this.services.audit.logEvent({
                action: 'group_created',
                userId: req.user.id,
                targetId: group.id,
                details: { name: group.name }
            });

            res.status(201).json(group);
        } catch (error) {
            logger.error('Failed to create group:', error);
            res.status(500).json({ error: 'Failed to create group' });
        }
    }

    async getGroup(req, res) {
        try {
            const { id } = req.params;
            const group = await this.services.directory.getGroup(id);
            
            if (!group) {
                return res.status(404).json({ error: 'Group not found' });
            }

            res.json(group);
        } catch (error) {
            logger.error('Failed to get group:', error);
            res.status(500).json({ error: 'Failed to retrieve group' });
        }
    }

    async updateGroup(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const group = await this.services.directory.updateGroup(id, updateData);
            if (!group) {
                return res.status(404).json({ error: 'Group not found' });
            }

            // Log audit event
            await this.services.audit.logEvent({
                action: 'group_updated',
                userId: req.user.id,
                targetId: id,
                details: updateData
            });

            res.json(group);
        } catch (error) {
            logger.error('Failed to update group:', error);
            res.status(500).json({ error: 'Failed to update group' });
        }
    }

    async deleteGroup(req, res) {
        try {
            const { id } = req.params;
            const success = await this.services.directory.deleteGroup(id);
            
            if (!success) {
                return res.status(404).json({ error: 'Group not found' });
            }

            // Log audit event
            await this.services.audit.logEvent({
                action: 'group_deleted',
                userId: req.user.id,
                targetId: id
            });

            res.json({ success: true });
        } catch (error) {
            logger.error('Failed to delete group:', error);
            res.status(500).json({ error: 'Failed to delete group' });
        }
    }

    async getComputers(req, res) {
        try {
            const { page = 1, limit = 50, search, status } = req.query;
            const computers = await this.services.directory.getComputers({
                page: parseInt(page),
                limit: parseInt(limit),
                search,
                status
            });

            res.json(computers);
        } catch (error) {
            logger.error('Failed to get computers:', error);
            res.status(500).json({ error: 'Failed to retrieve computers' });
        }
    }

    async createComputer(req, res) {
        try {
            const computerData = req.body;
            const computer = await this.services.directory.createComputer(computerData);
            
            // Log audit event
            await this.services.audit.logEvent({
                action: 'computer_created',
                userId: req.user.id,
                targetId: computer.id,
                details: { name: computer.name }
            });

            res.status(201).json(computer);
        } catch (error) {
            logger.error('Failed to create computer:', error);
            res.status(500).json({ error: 'Failed to create computer' });
        }
    }

    async getComputer(req, res) {
        try {
            const { id } = req.params;
            const computer = await this.services.directory.getComputer(id);
            
            if (!computer) {
                return res.status(404).json({ error: 'Computer not found' });
            }

            res.json(computer);
        } catch (error) {
            logger.error('Failed to get computer:', error);
            res.status(500).json({ error: 'Failed to retrieve computer' });
        }
    }

    async updateComputer(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const computer = await this.services.directory.updateComputer(id, updateData);
            if (!computer) {
                return res.status(404).json({ error: 'Computer not found' });
            }

            // Log audit event
            await this.services.audit.logEvent({
                action: 'computer_updated',
                userId: req.user.id,
                targetId: id,
                details: updateData
            });

            res.json(computer);
        } catch (error) {
            logger.error('Failed to update computer:', error);
            res.status(500).json({ error: 'Failed to update computer' });
        }
    }

    async deleteComputer(req, res) {
        try {
            const { id } = req.params;
            const success = await this.services.directory.deleteComputer(id);
            
            if (!success) {
                return res.status(404).json({ error: 'Computer not found' });
            }

            // Log audit event
            await this.services.audit.logEvent({
                action: 'computer_deleted',
                userId: req.user.id,
                targetId: id
            });

            res.json({ success: true });
        } catch (error) {
            logger.error('Failed to delete computer:', error);
            res.status(500).json({ error: 'Failed to delete computer' });
        }
    }

    async getDNSRecords(req, res) {
        try {
            const { zone, type, search } = req.query;
            const records = await this.services.dns.getRecords({ zone, type, search });
            res.json(records);
        } catch (error) {
            logger.error('Failed to get DNS records:', error);
            res.status(500).json({ error: 'Failed to retrieve DNS records' });
        }
    }

    async createDNSRecord(req, res) {
        try {
            const recordData = req.body;
            const record = await this.services.dns.createRecord(recordData);
            
            // Log audit event
            await this.services.audit.logEvent({
                action: 'dns_record_created',
                userId: req.user.id,
                targetId: record.id,
                details: recordData
            });

            res.status(201).json(record);
        } catch (error) {
            logger.error('Failed to create DNS record:', error);
            res.status(500).json({ error: 'Failed to create DNS record' });
        }
    }

    async updateDNSRecord(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const record = await this.services.dns.updateRecord(id, updateData);
            if (!record) {
                return res.status(404).json({ error: 'DNS record not found' });
            }

            // Log audit event
            await this.services.audit.logEvent({
                action: 'dns_record_updated',
                userId: req.user.id,
                targetId: id,
                details: updateData
            });

            res.json(record);
        } catch (error) {
            logger.error('Failed to update DNS record:', error);
            res.status(500).json({ error: 'Failed to update DNS record' });
        }
    }

    async deleteDNSRecord(req, res) {
        try {
            const { id } = req.params;
            const success = await this.services.dns.deleteRecord(id);
            
            if (!success) {
                return res.status(404).json({ error: 'DNS record not found' });
            }

            // Log audit event
            await this.services.audit.logEvent({
                action: 'dns_record_deleted',
                userId: req.user.id,
                targetId: id
            });

            res.json({ success: true });
        } catch (error) {
            logger.error('Failed to delete DNS record:', error);
            res.status(500).json({ error: 'Failed to delete DNS record' });
        }
    }

    async getPolicies(req, res) {
        try {
            const policies = await this.services.groupPolicy.getPolicies();
            res.json(policies);
        } catch (error) {
            logger.error('Failed to get policies:', error);
            res.status(500).json({ error: 'Failed to retrieve policies' });
        }
    }

    async createPolicy(req, res) {
        try {
            const policyData = req.body;
            const policy = await this.services.groupPolicy.createPolicy(policyData);
            
            // Log audit event
            await this.services.audit.logEvent({
                action: 'policy_created',
                userId: req.user.id,
                targetId: policy.id,
                details: { name: policy.name }
            });

            res.status(201).json(policy);
        } catch (error) {
            logger.error('Failed to create policy:', error);
            res.status(500).json({ error: 'Failed to create policy' });
        }
    }

    async getPolicy(req, res) {
        try {
            const { id } = req.params;
            const policy = await this.services.groupPolicy.getPolicy(id);
            
            if (!policy) {
                return res.status(404).json({ error: 'Policy not found' });
            }

            res.json(policy);
        } catch (error) {
            logger.error('Failed to get policy:', error);
            res.status(500).json({ error: 'Failed to retrieve policy' });
        }
    }

    async updatePolicy(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const policy = await this.services.groupPolicy.updatePolicy(id, updateData);
            if (!policy) {
                return res.status(404).json({ error: 'Policy not found' });
            }

            // Log audit event
            await this.services.audit.logEvent({
                action: 'policy_updated',
                userId: req.user.id,
                targetId: id,
                details: updateData
            });

            res.json(policy);
        } catch (error) {
            logger.error('Failed to update policy:', error);
            res.status(500).json({ error: 'Failed to update policy' });
        }
    }

    async deletePolicy(req, res) {
        try {
            const { id } = req.params;
            const success = await this.services.groupPolicy.deletePolicy(id);
            
            if (!success) {
                return res.status(404).json({ error: 'Policy not found' });
            }

            // Log audit event
            await this.services.audit.logEvent({
                action: 'policy_deleted',
                userId: req.user.id,
                targetId: id
            });

            res.json({ success: true });
        } catch (error) {
            logger.error('Failed to delete policy:', error);
            res.status(500).json({ error: 'Failed to delete policy' });
        }
    }

    async getAuditLogs(req, res) {
        try {
            const { page = 1, limit = 100, action, userId, startDate, endDate } = req.query;
            const logs = await this.services.audit.getLogs({
                page: parseInt(page),
                limit: parseInt(limit),
                action,
                userId,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined
            });

            res.json(logs);
        } catch (error) {
            logger.error('Failed to get audit logs:', error);
            res.status(500).json({ error: 'Failed to retrieve audit logs' });
        }
    }

    async getSecuritySettings(req, res) {
        try {
            const settings = await this.services.security.getSettings();
            res.json(settings);
        } catch (error) {
            logger.error('Failed to get security settings:', error);
            res.status(500).json({ error: 'Failed to retrieve security settings' });
        }
    }

    async updateSecuritySettings(req, res) {
        try {
            const updateData = req.body;
            const settings = await this.services.security.updateSettings(updateData);
            
            // Log audit event
            await this.services.audit.logEvent({
                action: 'security_settings_updated',
                userId: req.user.id,
                details: updateData
            });

            res.json(settings);
        } catch (error) {
            logger.error('Failed to update security settings:', error);
            res.status(500).json({ error: 'Failed to update security settings' });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = DomainControllerAPI;
