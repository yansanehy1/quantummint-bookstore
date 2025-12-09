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
const SMTPServer = require('./smtp/SMTPServer');
const IMAPServer = require('./imap/IMAPServer');
const POP3Server = require('./pop3/POP3Server');
const MailQueue = require('./queue/MailQueue');
const SecurityManager = require('./security/SecurityManager');
const DNSManager = require('./dns/DNSManager');
const AnalyticsService = require('./analytics/AnalyticsService');

// Web Interface Components
const MailServerAPI = require('./web/routes/api');

class QuantumMailServer {
  constructor() {
    this.app = express();
    this.smtpServer = null;
    this.imapServer = null;
    this.pop3Server = null;
    this.mailQueue = null;
    this.securityManager = null;
    this.dnsManager = null;
    this.analyticsService = null;
    this.webAPI = null;

    this.config = {
      // Server Configuration
      server: {
        hostname: process.env.MAIL_HOSTNAME || 'mail.quantummint.local',
        domain: process.env.MAIL_DOMAIN || 'quantummint.local',
        maxMessageSize: parseInt(process.env.MAX_MESSAGE_SIZE) || 25 * 1024 * 1024, // 25MB
        maxRecipients: parseInt(process.env.MAX_RECIPIENTS) || 100
      },

      // SMTP Configuration
      smtp: {
        port: parseInt(process.env.SMTP_PORT) || 25,
        securePort: parseInt(process.env.SMTP_SECURE_PORT) || 465,
        submissionPort: parseInt(process.env.SMTP_SUBMISSION_PORT) || 587,
        maxConnections: parseInt(process.env.SMTP_MAX_CONNECTIONS) || 100,
        banner: process.env.SMTP_BANNER || 'QuantumMint Mail Server ESMTP',
        authRequired: process.env.SMTP_AUTH_REQUIRED !== 'false'
      },

      // IMAP Configuration
      imap: {
        port: parseInt(process.env.IMAP_PORT) || 143,
        securePort: parseInt(process.env.IMAP_SECURE_PORT) || 993,
        maxConnections: parseInt(process.env.IMAP_MAX_CONNECTIONS) || 100,
        idleTimeout: parseInt(process.env.IMAP_IDLE_TIMEOUT) || 1800000, // 30 minutes
        enableIdle: process.env.IMAP_ENABLE_IDLE !== 'false'
      },

      // POP3 Configuration
      pop3: {
        port: parseInt(process.env.POP3_PORT) || 110,
        securePort: parseInt(process.env.POP3_SECURE_PORT) || 995,
        maxConnections: parseInt(process.env.POP3_MAX_CONNECTIONS) || 50,
        sessionTimeout: parseInt(process.env.POP3_SESSION_TIMEOUT) || 600000 // 10 minutes
      },

      // Database Configuration
      database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/quantummint-mail',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        }
      },

      // Redis Configuration for Caching and Queue
      redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        db: parseInt(process.env.REDIS_DB) || 2,
        keyPrefix: process.env.REDIS_KEY_PREFIX || 'qmail:'
      },

      // Web Interface Configuration
      web: {
        port: parseInt(process.env.WEB_PORT) || 3006,
        host: process.env.WEB_HOST || '0.0.0.0',
        staticPath: path.join(__dirname, 'web', 'public'),
        viewsPath: path.join(__dirname, 'web', 'views')
      },

      // Security Configuration
      security: {
        enableTLS: process.env.ENABLE_TLS !== 'false',
        tlsCertPath: process.env.TLS_CERT_PATH || './certs/mail.crt',
        tlsKeyPath: process.env.TLS_KEY_PATH || './certs/mail.key',
        enableDKIM: process.env.ENABLE_DKIM !== 'false',
        dkimSelector: process.env.DKIM_SELECTOR || 'default',
        dkimPrivateKey: process.env.DKIM_PRIVATE_KEY || './certs/dkim.key',
        enableSPF: process.env.ENABLE_SPF !== 'false',
        enableDMARC: process.env.ENABLE_DMARC !== 'false',
        antispamEnabled: process.env.ANTISPAM_ENABLED !== 'false',
        antivirusEnabled: process.env.ANTIVIRUS_ENABLED !== 'false'
      },

      // DNS Configuration
      dns: {
        servers: process.env.DNS_SERVERS ? process.env.DNS_SERVERS.split(',') : ['8.8.8.8', '8.8.4.4'],
        timeout: parseInt(process.env.DNS_TIMEOUT) || 5000,
        retries: parseInt(process.env.DNS_RETRIES) || 3
      },

      // Queue Configuration
      queue: {
        maxRetries: parseInt(process.env.QUEUE_MAX_RETRIES) || 5,
        retryDelay: parseInt(process.env.QUEUE_RETRY_DELAY) || 300000, // 5 minutes
        maxConcurrent: parseInt(process.env.QUEUE_MAX_CONCURRENT) || 10,
        cleanupInterval: parseInt(process.env.QUEUE_CLEANUP_INTERVAL) || 3600000 // 1 hour
      },

      // Analytics Configuration
      analytics: {
        enabled: process.env.ANALYTICS_ENABLED !== 'false',
        retentionDays: parseInt(process.env.ANALYTICS_RETENTION_DAYS) || 90,
        aggregationInterval: parseInt(process.env.ANALYTICS_AGGREGATION_INTERVAL) || 3600000 // 1 hour
      },

      // JWT Configuration for Web Interface
      jwt: {
        secret: process.env.JWT_SECRET || 'quantum-mail-secret-2024',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
      },

      // Rate Limiting for Email Sending
      rateLimiting: {
        emailsPerHour: parseInt(process.env.EMAILS_PER_HOUR) || 100,
        emailsPerDay: parseInt(process.env.EMAILS_PER_DAY) || 1000
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
      // Initialize Analytics Service first
      this.analyticsService = new AnalyticsService(this.config);

      // Initialize Security Manager
      this.securityManager = new SecurityManager(this.config, this.analyticsService);
      await this.securityManager.start();

      // Initialize DNS Manager (constructor sets up providers)
      this.dnsManager = new DNSManager(this.config);

      // Initialize Mail Queue
      this.mailQueue = new MailQueue(this.config, this.securityManager, this.analyticsService);

      // Initialize SMTP Server
      this.smtpServer = new SMTPServer(this.config, this.mailQueue, this.securityManager, this.dnsManager, this.analyticsService);

      // Initialize IMAP Server
      this.imapServer = new IMAPServer(this.config, this.securityManager, this.analyticsService);

      // Initialize POP3 Server
      this.pop3Server = new POP3Server(this.config, this.securityManager, this.analyticsService);

      // Initialize Web API
      const services = {
        smtp: this.smtpServer,
        imap: this.imapServer,
        pop3: this.pop3Server,
        queue: this.mailQueue,
        security: this.securityManager,
        dns: this.dnsManager,
        analytics: this.analyticsService
      };

      this.webAPI = new MailServerAPI(services, this.config);

      logger.info('All mail services initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize mail services:', error);
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

    // Rate limiting for web interface
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
    // Web Interface API Routes
    if (this.webAPI && typeof this.webAPI.getRouter === 'function') {
      this.app.use('/api', this.webAPI.getRouter());
    } else {
      logger.warn('Web API not initialized; /api routes are unavailable');
    }

    // QuantumMint Webhook Routes
    try {
      const quantumMintWebhooks = require('./api/webhooks');
      this.app.use('/api/webhooks', quantumMintWebhooks);
      logger.info('QuantumMint webhook routes integrated successfully');
    } catch (error) {
      logger.warn('QuantumMint webhooks not available:', error.message);
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
          smtp: this.smtpServer ? (typeof this.smtpServer.isRunning === 'function' ? this.smtpServer.isRunning() : !!this.smtpServer.isRunning) : false,
          imap: this.imapServer ? (typeof this.imapServer.isRunning === 'function' ? this.imapServer.isRunning() : !!this.imapServer.isRunning) : false,
          pop3: this.pop3Server ? (typeof this.pop3Server.isRunning === 'function' ? this.pop3Server.isRunning() : !!this.pop3Server.isRunning) : false,
          queue: this.mailQueue ? (typeof this.mailQueue.isRunning === 'function' ? this.mailQueue.isRunning() : !!this.mailQueue.isRunning) : false,
          security: this.securityManager?.isInitialized() || false,
          analytics: this.analyticsService ? (typeof this.analyticsService.isRunning === 'function' ? this.analyticsService.isRunning() : !!this.analyticsService.isRunning) : false
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
            smtp: {
              running: this.smtpServer ? (typeof this.smtpServer.isRunning === 'function' ? this.smtpServer.isRunning() : !!this.smtpServer.isRunning) : false,
              connections: this.smtpServer && typeof this.smtpServer.getConnectionCount === 'function' ? this.smtpServer.getConnectionCount() : 0,
              messagesProcessed: this.smtpServer && typeof this.smtpServer.getMessageCount === 'function' ? this.smtpServer.getMessageCount() : 0
            },
            imap: {
              running: this.imapServer ? (typeof this.imapServer.isRunning === 'function' ? this.imapServer.isRunning() : !!this.imapServer.isRunning) : false,
              connections: this.imapServer && typeof this.imapServer.getConnectionCount === 'function' ? this.imapServer.getConnectionCount() : 0,
              sessions: this.imapServer && typeof this.imapServer.getSessionCount === 'function' ? this.imapServer.getSessionCount() : 0
            },
            pop3: {
              running: this.pop3Server ? (typeof this.pop3Server.isRunning === 'function' ? this.pop3Server.isRunning() : !!this.pop3Server.isRunning) : false,
              connections: this.pop3Server && typeof this.pop3Server.getConnectionCount === 'function' ? this.pop3Server.getConnectionCount() : 0,
              sessions: this.pop3Server && typeof this.pop3Server.getSessionCount === 'function' ? this.pop3Server.getSessionCount() : 0
            },
            queue: {
              running: this.mailQueue ? (typeof this.mailQueue.isRunning === 'function' ? this.mailQueue.isRunning() : !!this.mailQueue.isRunning) : false,
              pending: this.mailQueue && typeof this.mailQueue.getPendingCount === 'function' ? await this.mailQueue.getPendingCount() : 0,
              processing: this.mailQueue && typeof this.mailQueue.getProcessingCount === 'function' ? await this.mailQueue.getProcessingCount() : 0,
              failed: this.mailQueue && typeof this.mailQueue.getFailedCount === 'function' ? await this.mailQueue.getFailedCount() : 0
            },
            analytics: {
              running: this.analyticsService ? (typeof this.analyticsService.isRunning === 'function' ? this.analyticsService.isRunning() : !!this.analyticsService.isRunning) : false,
              dailyStats: this.analyticsService && typeof this.analyticsService.getDailyStats === 'function' ? await this.analyticsService.getDailyStats() : {}
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
      // Start mail protocol servers
      await this.smtpServer.start();
      await this.imapServer.start();
      await this.pop3Server.start();

      // Start mail queue processing
      await this.mailQueue.start();

      // Start analytics service
      await this.analyticsService.start();

      // Start web server
      const webServer = this.app.listen(this.config.web.port, this.config.web.host, () => {
        logger.info(`Mail Server Web Interface listening on ${this.config.web.host}:${this.config.web.port}`);
        logger.info(`Web interface available at: http://${this.config.web.host}:${this.config.web.port}`);
      });

      // Graceful shutdown handlers
      const gracefulShutdown = async (signal) => {
        logger.info(`Received ${signal}, starting graceful shutdown...`);

        try {
          // Close web server
          webServer.close();

          // Stop services
          if (this.analyticsService) await this.analyticsService.stop();
          if (this.mailQueue) await this.mailQueue.stop();
          if (this.pop3Server) await this.pop3Server.stop();
          if (this.imapServer) await this.imapServer.stop();
          if (this.smtpServer) await this.smtpServer.stop();

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
      logger.error('Failed to start mail servers:', error);
      throw error;
    }
  }

  async initialize() {
    try {
      logger.info('Initializing QuantumMint Mail Server...');
      await this.connectDatabase();
      this.setupMiddleware();

      // Allow disabling protocol servers for staging/debug via env flag
      const enableProtocols = (process.env.MAIL_PROTOCOLS_ENABLED || 'true').toLowerCase() !== 'false';
      if (!enableProtocols) {
        const port = this.config.web.port || 3006;
        const host = this.config.web.host || '0.0.0.0';

        // Override health to explicitly indicate degraded but reachable
        this.app.get('/health', (req, res) => {
          res.status(503).json({
            status: 'unhealthy',
            service: 'mail-server',
            error: 'Protocols disabled by MAIL_PROTOCOLS_ENABLED=false',
            timestamp: new Date().toISOString()
          });
        });

        const server = this.app.listen(port, host, () => {
          logger.warn(`Mail Server HTTP interface running with protocols disabled on ${host}:${port}`);
          logger.warn(`Health check: http://localhost:${port}/health`);
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal) => {
          logger.info(`Received ${signal}, shutting down gracefully...`);
          try {
            server.close();
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
      // Routes may depend on initialized services (smtp/imap/pop3)
      this.setupRoutes();
      await this.startServers();
      logger.info('QuantumMint Mail Server initialized successfully');
    } catch (error) {
      // Degraded startup: expose minimal health endpoint and start server
      logger.error('Failed to initialize mail server. Starting in degraded mode with health endpoint only.', error);

      // Minimal /health endpoint
      this.app.get('/health', (req, res) => {
        res.status(503).json({
          status: 'unhealthy',
          service: 'mail-server',
          error: error?.message || 'Initialization failed',
          timestamp: new Date().toISOString()
        });
      });

      // Attach error handler for consistency
      this.app.use(errorHandler);

      const port = this.config.web.port || 3006;
      const host = this.config.web.host || '0.0.0.0';
      const server = this.app.listen(port, host, () => {
        logger.warn(`Mail Server running in degraded mode on ${host}:${port}`);
        logger.warn(`Health check: http://localhost:${port}/health`);
      });

      const gracefulShutdown = async (signal) => {
        logger.info(`Received ${signal}, shutting down gracefully...`);
        try {
          server.close();
          await mongoose.connection.close();
          if (this.mailQueue && this.mailQueue.close) {
            await this.mailQueue.close();
          }
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
  const mailServer = new QuantumMailServer();
  mailServer.initialize().catch(error => {
    logger.error('Fatal error starting Mail Server:', error);
    process.exit(1);
  });
}

module.exports = QuantumMailServer;
