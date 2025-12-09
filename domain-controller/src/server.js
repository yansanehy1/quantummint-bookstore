const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { config } = require('@quantummint/shared/config');
const { errorHandler } = require('@quantummint/shared/http/errorHandler');
const requestIdMiddleware = require('@quantummint/shared/middleware/requestId');

const { main: logger } = require('./utils/logger');
const LDAPServer = require('./ldap/LDAPServer');
const KerberosServer = require('./kerberos/KerberosServer');
const DNSController = require('./dns/DNSController');
const DirectoryService = require('./directory/DirectoryService');
const GroupPolicyManager = require('./policy/GroupPolicyManager');
const ReplicationManager = require('./replication/ReplicationManager');
const SecurityManager = require('./security/SecurityManager');
const AuditService = require('./audit/AuditService');
const QuantumMintIntegration = require('./integration/QuantumMintIntegration');

// Web Interface Components
const DomainControllerAPI = require('./web/routes/api');

class QuantumDomainController {
  constructor() {
    this.app = express();
    this.ldapServer = null;
    this.kerberosServer = null;
    this.dnsController = null;
    this.directoryService = null;
    this.groupPolicyManager = null;
    this.replicationManager = null;
    this.securityManager = null;
    this.auditService = null;
    this.integration = null;
    this.webAPI = null;
    
    this.config = {
      // Domain Configuration
      domain: {
        name: process.env.DOMAIN_NAME || 'quantummint.local',
        netbiosName: process.env.NETBIOS_NAME || 'QUANTUMMINT',
        forestLevel: process.env.FOREST_LEVEL || '2019',
        domainLevel: process.env.DOMAIN_LEVEL || '2019'
      },
      
      // LDAP Configuration
      ldap: {
        port: process.env.LDAP_PORT || 389,
        securePort: process.env.LDAPS_PORT || 636,
        baseDN: process.env.LDAP_BASE_DN || 'dc=quantummint,dc=local',
        bindDN: process.env.LDAP_BIND_DN || 'cn=Administrator,cn=Users,dc=quantummint,dc=local',
        maxConnections: process.env.LDAP_MAX_CONNECTIONS || 1000
      },
      
      // Kerberos Configuration
      kerberos: {
        realm: process.env.KERBEROS_REALM || 'QUANTUMMINT.LOCAL',
        port: process.env.KERBEROS_PORT || 88,
        adminPort: process.env.KERBEROS_ADMIN_PORT || 749,
        keyTabPath: process.env.KERBEROS_KEYTAB || '/etc/krb5.keytab'
      },
      
      // DNS Configuration
      dns: {
        port: process.env.DNS_PORT || 53,
        forwarders: process.env.DNS_FORWARDERS ? process.env.DNS_FORWARDERS.split(',') : ['8.8.8.8', '8.8.4.4'],
        zones: process.env.DNS_ZONES ? process.env.DNS_ZONES.split(',') : ['quantummint.local']
      },
      
      // Database Configuration
      database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/quantummint-domain',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        }
      },
      
      // Web Interface Configuration
      web: {
        port: process.env.WEB_PORT || 8080,
        host: process.env.WEB_HOST || '0.0.0.0',
        staticPath: path.join(__dirname, 'web', 'public'),
        viewsPath: path.join(__dirname, 'web', 'views')
      },
      
      // Security Configuration
      security: {
        passwordPolicy: {
          minLength: parseInt(process.env.PASSWORD_MIN_LENGTH) || 8,
          requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
          requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
          requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS !== 'false',
          requireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL !== 'false',
          maxAge: parseInt(process.env.PASSWORD_MAX_AGE) || 90,
          historyCount: parseInt(process.env.PASSWORD_HISTORY_COUNT) || 12
        },
        lockoutPolicy: {
          threshold: parseInt(process.env.LOCKOUT_THRESHOLD) || 5,
          duration: parseInt(process.env.LOCKOUT_DURATION) || 30,
          observationWindow: parseInt(process.env.LOCKOUT_OBSERVATION_WINDOW) || 30
        },
        auditPolicy: {
          logonEvents: process.env.AUDIT_LOGON_EVENTS !== 'false',
          objectAccess: process.env.AUDIT_OBJECT_ACCESS !== 'false',
          privilegeUse: process.env.AUDIT_PRIVILEGE_USE !== 'false',
          accountManagement: process.env.AUDIT_ACCOUNT_MANAGEMENT !== 'false',
          policyChange: process.env.AUDIT_POLICY_CHANGE !== 'false',
          systemEvents: process.env.AUDIT_SYSTEM_EVENTS !== 'false'
        }
      },
      
      // Replication Configuration
      replication: {
        enabled: process.env.REPLICATION_ENABLED === 'true',
        partners: process.env.REPLICATION_PARTNERS ? process.env.REPLICATION_PARTNERS.split(',') : [],
        interval: parseInt(process.env.REPLICATION_INTERVAL) || 15,
        compression: process.env.REPLICATION_COMPRESSION !== 'false'
      },
      
      // Integration Configuration
      integration: {
        quantummintAPI: process.env.QUANTUMMINT_API_URL || 'http://localhost:3007',
        apiKey: process.env.QUANTUMMINT_API_KEY,
        syncInterval: parseInt(process.env.SYNC_INTERVAL) || 300,
        enableUserSync: process.env.ENABLE_USER_SYNC !== 'false',
        enableGroupSync: process.env.ENABLE_GROUP_SYNC !== 'false'
      },
      
      // JWT Configuration for Web Interface
      jwt: {
        secret: process.env.JWT_SECRET || 'quantum-domain-secret-2024',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
      }
    };
  }

  async connectDatabase() {
    try {
      const uri = config.mongoUri || this.config.database.uri;
      await mongoose.connect(uri, this.config.database.options);
      logger.info('Connected to MongoDB successfully');
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async initializeServices() {
    try {
      // Initialize core services
      this.auditService = new AuditService(this.config);
      await this.auditService.initialize();

      this.securityManager = new SecurityManager(this.config, this.auditService);
      await this.securityManager.initialize();

      this.directoryService = new DirectoryService(this.config, this.auditService);
      await this.directoryService.initialize();

      this.dnsController = new DNSController(this.config, this.auditService);
      await this.dnsController.initialize();

      this.groupPolicyManager = new GroupPolicyManager(this.config, this.directoryService, this.auditService);
      await this.groupPolicyManager.initialize();

      this.replicationManager = new ReplicationManager(this.config, this.directoryService, this.auditService);
      await this.replicationManager.initialize();

      this.integration = new QuantumMintIntegration(this.config, this.directoryService, this.auditService);
      await this.integration.initialize();

      // Initialize protocol servers
      this.ldapServer = new LDAPServer(this.config, this.directoryService, this.auditService);
      await this.ldapServer.initialize();

      this.kerberosServer = new KerberosServer(this.config, this.directoryService, this.auditService);
      await this.kerberosServer.initialize();

      // Initialize Web API
      const services = {
        directory: this.directoryService,
        dns: this.dnsController,
        groupPolicy: this.groupPolicyManager,
        security: this.securityManager,
        audit: this.auditService,
        replication: this.replicationManager,
        integration: this.integration
      };

      this.webAPI = new DomainControllerAPI(services, this.config);

      logger.info('All services initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize services:', error);
      throw error;
    }
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"]
        }
      }
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: process.env.RATE_LIMIT_MAX || 100,
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false
    });
    this.app.use('/api/', limiter);

    // Request ID and body parsing middleware
    this.app.use(requestIdMiddleware);
    // Attach logger on req for shared error handler
    this.app.use((req, res, next) => { req.logger = logger; next(); });
    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(cookieParser());

    // Static files for web interface
    this.app.use('/static', express.static(this.config.web.staticPath));

    // Request logging
    this.app.use((req, res, next) => {
      logger.debug(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  setupRoutes() {
    // Web Interface Routes
    if (this.webAPI && typeof this.webAPI.getRouter === 'function') {
      this.app.use('/api', this.webAPI.getRouter());
    } else {
      logger.warn('Web API not initialized; /api routes are unavailable');
    }

    // Serve main web interface
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(this.config.web.viewsPath, 'index.html'));
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          ldap: this.ldapServer?.isRunning() || false,
          kerberos: this.kerberosServer?.isRunning() || false,
          dns: this.dnsController?.isRunning() || false,
          directory: this.directoryService?.isInitialized() || false,
          replication: this.replicationManager?.isRunning() || false
        }
      });
    });

    // Status endpoint for monitoring
    this.app.get('/status', async (req, res) => {
      try {
        const stats = {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          timestamp: new Date().toISOString(),
          services: {
            ldap: {
              running: this.ldapServer?.isRunning() || false,
              connections: this.ldapServer?.getConnectionCount() || 0
            },
            kerberos: {
              running: this.kerberosServer?.isRunning() || false,
              tickets: this.kerberosServer?.getTicketCount() || 0
            },
            dns: {
              running: this.dnsController?.isRunning() || false,
              queries: this.dnsController?.getQueryCount() || 0
            },
            directory: {
              initialized: this.directoryService?.isInitialized() || false,
              users: await this.directoryService?.getUserCount() || 0,
              groups: await this.directoryService?.getGroupCount() || 0
            }
          }
        };
        res.json(stats);
      } catch (error) {
        logger.error('Error getting status:', error);
        res.status(500).json({ error: 'Failed to get status' });
      }
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Not found' });
    });

    // Global error handler (shared)
    this.app.use(errorHandler);
  }

  async startServers() {
    try {
      // Start protocol servers
      await this.ldapServer.start();
      await this.kerberosServer.start();
      await this.dnsController.start();

      // Start replication if enabled
      if (this.config.replication.enabled) {
        await this.replicationManager.start();
      }

      // Start integration sync
      await this.integration.start();

      // Start web server
      const webServer = this.app.listen(this.config.web.port, this.config.web.host, () => {
        logger.info(`Domain Controller Web Interface listening on ${this.config.web.host}:${this.config.web.port}`);
        logger.info(`Web interface available at: http://${this.config.web.host}:${this.config.web.port}`);
      });

      // Graceful shutdown handlers
      const gracefulShutdown = async (signal) => {
        logger.info(`Received ${signal}, starting graceful shutdown...`);
        
        try {
          // Close web server
          webServer.close();
          
          // Stop services
          if (this.integration) await this.integration.stop();
          if (this.replicationManager) await this.replicationManager.stop();
          if (this.dnsController) await this.dnsController.stop();
          if (this.kerberosServer) await this.kerberosServer.stop();
          if (this.ldapServer) await this.ldapServer.stop();
          
          // Close database connection
          await mongoose.connection.close();
          
          logger.info('Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      };

      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
      logger.error('Failed to start servers:', error);
      throw error;
    }
  }

  async start() {
    try {
      logger.info('Starting QuantumMint Domain Controller...');
      await this.connectDatabase();
      this.setupMiddleware();

      // Allow disabling protocol servers for staging/debug via env flag
      const enableProtocols = (process.env.DOMAIN_PROTOCOLS_ENABLED || 'true').toLowerCase() !== 'false';
      if (!enableProtocols) {
        const port = this.config.web.port || 8080;
        const host = this.config.web.host || '0.0.0.0';

        // Minimal /health endpoint in HTTP-only mode
        this.app.get('/health', (req, res) => {
          res.status(503).json({
            status: 'unhealthy',
            service: 'domain-controller',
            error: 'Protocols disabled by DOMAIN_PROTOCOLS_ENABLED=false',
            timestamp: new Date().toISOString()
          });
        });

        // Attach error handler
        this.app.use(errorHandler);

        const webServer = this.app.listen(port, host, () => {
          logger.warn(`Domain Controller HTTP interface running with protocols disabled on ${host}:${port}`);
          logger.warn(`Health check: http://localhost:${port}/health`);
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal) => {
          logger.info(`Received ${signal}, starting graceful shutdown...`);
          try {
            webServer.close();
            await mongoose.connection.close();
            logger.info('Graceful shutdown completed');
            process.exit(0);
          } catch (e) {
            logger.error('Error during shutdown:', e);
            process.exit(1);
          }
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        return; // Skip protocol servers
      }

      // Full initialization with protocol servers
      await this.initializeServices();
      this.setupRoutes();
      await this.startServers();
      logger.info('QuantumMint Domain Controller started successfully');
    } catch (error) {
      // Degraded startup: expose minimal health endpoint and start server
      logger.error('Failed to start Domain Controller. Starting in degraded mode with health endpoint only.', error);

      // Minimal /health endpoint
      this.app.get('/health', (req, res) => {
        res.status(503).json({
          status: 'unhealthy',
          service: 'domain-controller',
          error: error?.message || 'Initialization failed',
          timestamp: new Date().toISOString()
        });
      });

      // Attach error handler for consistency
      this.app.use(errorHandler);

      const port = this.config.web.port || 8080;
      const host = this.config.web.host || '0.0.0.0';
      const webServer = this.app.listen(port, host, () => {
        logger.warn(`Domain Controller running in degraded mode on ${host}:${port}`);
        logger.warn(`Health check: http://localhost:${port}/health`);
      });

      // Graceful shutdown
      const gracefulShutdown = async (signal) => {
        logger.info(`Received ${signal}, starting graceful shutdown...`);
        try {
          webServer.close();
          await mongoose.connection.close();
          logger.info('Graceful shutdown completed');
          process.exit(0);
        } catch (e) {
          logger.error('Error during shutdown:', e);
          process.exit(1);
        }
      };
      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  const domainController = new QuantumDomainController();
  domainController.start().catch(error => {
    logger.error('Fatal error starting Domain Controller:', error);
    process.exit(1);
  });
}

module.exports = QuantumDomainController;
