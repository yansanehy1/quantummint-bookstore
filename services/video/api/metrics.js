// services/video/api/metrics.js
const client = require('prom-client');

// Create registry
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// ===== Custom Metrics =====

// Video upload metrics
const uploadDuration = new client.Histogram({
  name: 'video_upload_duration_seconds',
  help: 'Time spent uploading video chunks',
  labelNames: ['status'],
  buckets: [0.1, 0.5, 1, 5, 10, 30, 60],
  registers: [register]
});

const uploadSize = new client.Counter({
  name: 'video_upload_bytes_total',
  help: 'Total bytes uploaded',
  labelNames: ['user_id'],
  registers: [register]
});

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

// Streaming metrics
const streamRequests = new client.Counter({
  name: 'video_stream_requests_total',
  help: 'Number of video stream requests',
  labelNames: ['format', 'quality', 'status'],
  registers: [register]
});

const streamBytes = new client.Counter({
  name: 'video_stream_bytes_total',
  help: 'Total bytes streamed to clients',
  labelNames: ['format'],
  registers: [register]
});

// Export metrics
register.setContentType(client.Registry.OPENMETRICS_CONTENT_TYPE);

module.exports = {
  register,
  metrics: {
    uploadDuration,
    uploadSize,
    queueDepth,
    processingTime,
    processingErrors,
    streamRequests,
    streamBytes
  }
};
