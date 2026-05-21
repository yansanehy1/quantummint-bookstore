// video-processor-worker/worker.js
const { createClient } = require('redis');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs').promises;
const express = require('express');
const { register, metrics } = require('./metrics');
const GPUVideoProcessor = require('./gpu-processor');

const app = express();
const METRICS_PORT = process.env.METRICS_PORT || 9091;

const redis = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const processor = new GPUVideoProcessor();

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    try {
        const queueLen = await redis.lLen('video:queue');
        metrics.queueDepth.set(queueLen);
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (err) {
        res.status(500).end(err.message);
    }
});

app.listen(METRICS_PORT, () => {
    console.log(`Worker metrics server listening on port ${METRICS_PORT}`);
});

async function startWorker() {
    await redis.connect();
    console.log('Video Processor Worker Started 🚀');

    while (true) {
        try {
            // Blocking pop from queue
            const result = await redis.brPop('video:queue', 0);
            const job = JSON.parse(result.element);

            console.log(`Processing job ${job.id}...`);
            await processJob(job);

        } catch (error) {
            console.error('Worker error:', error);
            // Wait a bit before retrying to avoid tight loops on error
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

async function processJob(job) {
    const startTime = Date.now();
    try {
        // Update status in both Redis and PostgreSQL
        await Promise.all([
            redis.hSet(`job:${job.id}`, 'status', 'processing'),
            pgPool.query(
                'UPDATE video_jobs SET status = $1, updated_at = NOW() WHERE id = $2',
                ['processing', job.id]
            )
        ]);

        const outputDir = path.join(process.env.VIDEO_STORAGE || '/data/videos', job.id);
        await fs.mkdir(outputDir, { recursive: true });

        // Process for each quality/format
        // Simplified for demo: just one format
        const outputPath = path.join(outputDir, 'video.mp4');

        const result = await processor.encodeWithGPU(job.inputPath, outputPath, {
            width: 1920,
            height: 1080,
            bitrate: '5000k'
        });

        const stats = JSON.stringify(result.gpuStats || {});
        
        await Promise.all([
            redis.hSet(`job:${job.id}`, {
                status: 'completed',
                output: outputPath,
                stats: stats
            }),
            pgPool.query(
                'UPDATE video_jobs SET status = $1, output_path = $2, video_metadata = video_metadata || $3, updated_at = NOW(), completed_at = NOW() WHERE id = $4',
                ['completed', outputPath, stats, job.id]
            )
        ]);

        // Record metrics
        const duration = (Date.now() - startTime) / 1000;
        metrics.processingTime.observe({ quality: '1080p', format: 'mp4', gpu_used: 'true' }, duration);

        console.log(`Job ${job.id} completed successfully`);

    } catch (error) {
        console.error(`Job ${job.id} failed:`, error);
        
        // Record error metrics
        metrics.processingErrors.inc({ error_type: 'processing_failure', quality: '1080p' });

        await Promise.all([
            redis.hSet(`job:${job.id}`, {
                status: 'failed',
                error: error.message
            }),
            pgPool.query(
                'UPDATE video_jobs SET status = $1, error_message = $2, updated_at = NOW() WHERE id = $3',
                ['failed', error.message, job.id]
            )
        ]);
    }
}

startWorker().catch(console.error);
