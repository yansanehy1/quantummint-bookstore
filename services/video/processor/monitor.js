// video-processor/monitor.js
const os = require('os');
const { WebSocketServer } = require('ws');

class QuantumVideoMonitor {
    constructor(server, videoProcessor, uploadManager) {
        this.wss = new WebSocketServer({ server, path: '/monitor' });
        this.processor = videoProcessor;
        this.uploadManager = uploadManager;
        this.clients = new Set();

        this.init();
    }

    init() {
        this.wss.on('connection', (ws) => {
            this.clients.add(ws);

            // Send initial state
            this.sendStats(ws);

            ws.on('close', () => {
                this.clients.delete(ws);
            });
        });

        // Broadcast stats every 2 seconds
        setInterval(() => this.broadcastStats(), 2000);

        // Listen to processor events
        // this.processor.on('progress', ...) - would need to add event emitter to processor
    }

    async getSystemStats() {
        const cpuUsage = os.loadavg()[0];
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;

        // Get disk usage (mock for now, would use 'df' or similar)
        const diskUsage = {
            total: 1000 * 1024 * 1024 * 1024, // 1TB
            used: 400 * 1024 * 1024 * 1024,   // 400GB
            free: 600 * 1024 * 1024 * 1024
        };

        return {
            cpu: {
                usage: cpuUsage,
                cores: os.cpus().length
            },
            memory: {
                total: totalMem,
                used: usedMem,
                free: freeMem,
                percentage: (usedMem / totalMem) * 100
            },
            disk: diskUsage,
            uptime: os.uptime()
        };
    }

    async broadcastStats() {
        const stats = await this.getSystemStats();

        const data = {
            type: 'stats_update',
            timestamp: Date.now(),
            system: stats,
            queues: {
                processing: this.processor.queue.length,
                active: this.processor.activeJobs.size,
                uploads: this.uploadManager.activeUploads.size
            },
            jobs: Array.from(this.processor.activeJobs.values()).map(j => ({
                id: j.id,
                status: j.status,
                progress: j.progress,
                filename: path.basename(j.inputPath)
            }))
        };

        const message = JSON.stringify(data);

        for (const client of this.clients) {
            if (client.readyState === 1) { // OPEN
                client.send(message);
            }
        }
    }

    sendStats(ws) {
        // Send immediate stats to new connection
        this.getSystemStats().then(stats => {
            ws.send(JSON.stringify({
                type: 'init',
                system: stats
            }));
        });
    }
}

module.exports = QuantumVideoMonitor;
