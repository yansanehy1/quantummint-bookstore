// services/video/worker/metrics.js
const client = require('prom-client');

// Create registry
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// ===== Custom Metrics =====

// Processing queue metrics
const queueDepth = new client.Gauge({
  name: 'video_queue_depth',
  help: 'Number of jobs waiting in processing queue',
  registers: [register]
});

const processingTime = new client.Histogram({
  name: 'video_processing_duration_seconds',
  help: 'Time to encode video',
  labelNames: ['quality', 'format', 'gpu_used'],
  buckets: [10, 30, 60, 300, 600, 1800],
  registers: [register]
});

// Error metrics
const processingErrors = new client.Counter({
  name: 'video_processing_errors_total',
  help: 'Number of failed video processing jobs',
  labelNames: ['error_type', 'quality'],
  registers: [register]
});

// Export metrics
register.setContentType(client.Registry.OPENMETRICS_CONTENT_TYPE);

module.exports = {
  register,
  metrics: {
    queueDepth,
    processingTime,
    processingErrors
  }
};
