// video-processor-worker/worker.js
const { createClient } = require('redis');
const path = require('path');
const fs = require('fs').promises;
const { Sequelize, DataTypes } = require('sequelize');
const GPUVideoProcessor = require('./gpu-processor');

// Database configuration
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});

// Define Book model locally for the worker to update metadata
const Book = sequelize.define('Book', {
    hasVideo: DataTypes.BOOLEAN,
    videoUrl: DataTypes.STRING,
    videoMetadata: DataTypes.JSONB,
    videoStatus: DataTypes.ENUM('none', 'pending', 'processing', 'completed', 'failed')
}, { timestamps: false });

const redis = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const processor = new GPUVideoProcessor();

const QUALITIES = [
    { name: '480p', width: 854, height: 480, bitrate: '1000k' },
    { name: '720p', width: 1280, height: 720, bitrate: '2500k' },
    { name: '1080p', width: 1920, height: 1080, bitrate: '5000k' }
];

async function startWorker() {
    await redis.connect();
    await sequelize.authenticate();
    console.log('Video Processor Worker Started 🚀 (DB & Redis connected)');

    while (true) {
        try {
            // Blocking pop from queue
            const result = await redis.brPop('video:queue', 0);
            const job = JSON.parse(result.element);

            console.log(`Processing job ${job.id}...`);
            await processJob(job);

        } catch (error) {
            console.error('Worker error:', error);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

async function processJob(job) {
    const outputs = {};
    try {
        // Update status in Redis and DB
        await redis.hSet(`job:${job.id}`, 'status', 'processing');
        if (job.bookId) {
            await Book.update(
                { videoStatus: 'processing' },
                { where: { id: job.bookId } }
            );
        }

        const outputBaseDir = path.join('/var/www/videos/encoded', job.id);
        await fs.mkdir(outputBaseDir, { recursive: true });

        // Process for each quality (ABR Generation)
        for (const quality of QUALITIES) {
            console.log(`Encoding ${quality.name} for job ${job.id}...`);
            const qualityDir = path.join(outputBaseDir, quality.name);
            await fs.mkdir(qualityDir, { recursive: true });
            
            const outputPath = path.join(qualityDir, 'video.mp4');
            
            await processor.encodeWithGPU(job.inputPath, outputPath, {
                width: quality.width,
                height: quality.height,
                bitrate: quality.bitrate
            });
            
            outputs[quality.name] = `/videos/encoded/${job.id}/${quality.name}/video.mp4`;
        }

        // Finalize job in Redis
        await redis.hSet(`job:${job.id}`, {
            status: 'completed',
            outputs: JSON.stringify(outputs),
            completedAt: new Date().toISOString()
        });

        // Database Persistence: Update Book with video metadata
        if (job.bookId) {
            await Book.update({
                hasVideo: true,
                videoUrl: outputs['1080p'] || outputs['720p'] || outputs['480p'],
                videoMetadata: {
                    qualities: outputs,
                    processor: processor.gpuAvailable ? 'gpu' : 'cpu',
                    gpuInfo: processor.gpuInfo
                },
                videoStatus: 'completed'
            }, {
                where: { id: job.bookId }
            });
        }

        console.log(`Job ${job.id} completed successfully with ABR outputs`);

    } catch (error) {
        console.error(`Job ${job.id} failed:`, error);
        
        // Update status to failed
        await redis.hSet(`job:${job.id}`, {
            status: 'failed',
            error: error.message
        });

        if (job.bookId) {
            await Book.update(
                { videoStatus: 'failed' },
                { where: { id: job.bookId } }
            );
        }

        // Resiliency: Push to Dead Letter Queue (DLQ)
        const failedJob = {
            ...job,
            error: error.message,
            failedAt: new Date().toISOString(),
            retryCount: (job.retryCount || 0) + 1
        };
        await redis.lPush('video:failed', JSON.stringify(failedJob));
        console.log(`Job ${job.id} moved to DLQ (video:failed)`);
    }
}

startWorker().catch(console.error);
