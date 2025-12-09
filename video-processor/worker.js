// video-processor-worker/worker.js
const { createClient } = require('redis');
const path = require('path');
const fs = require('fs').promises;
const GPUVideoProcessor = require('./gpu-processor');

const redis = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const processor = new GPUVideoProcessor();

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
    try {
        // Update status
        await redis.hSet(`job:${job.id}`, 'status', 'processing');

        const outputDir = path.join('/var/www/videos/encoded', job.id);
        await fs.mkdir(outputDir, { recursive: true });

        // Process for each quality/format
        // Simplified for demo: just one format
        const outputPath = path.join(outputDir, 'video.mp4');

        const result = await processor.encodeWithGPU(job.inputPath, outputPath, {
            width: 1920,
            height: 1080,
            bitrate: '5000k'
        });

        await redis.hSet(`job:${job.id}`, {
            status: 'completed',
            output: outputPath,
            stats: JSON.stringify(result.gpuStats || {})
        });

        console.log(`Job ${job.id} completed successfully`);

    } catch (error) {
        console.error(`Job ${job.id} failed:`, error);
        await redis.hSet(`job:${job.id}`, {
            status: 'failed',
            error: error.message
        });
    }
}

startWorker().catch(console.error);
