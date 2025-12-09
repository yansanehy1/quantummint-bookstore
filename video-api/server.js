// video-api/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const { createClient } = require('redis');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Redis Client
const redis = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redis.connect().catch(console.error);

// Upload Configuration
const upload = multer({ storage: multer.memoryStorage() });
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
const TEMP_DIR = path.join(UPLOAD_DIR, 'temp');

// Ensure directories
(async () => {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(TEMP_DIR, { recursive: true });
})();

// Upload Manager Logic (Simplified for API)
class UploadManager {
    async initUpload(metadata) {
        const uploadId = crypto.randomBytes(16).toString('hex');
        const uploadPath = path.join(TEMP_DIR, uploadId);
        await fs.mkdir(uploadPath);

        const state = {
            id: uploadId,
            ...metadata,
            uploadedSize: 0,
            chunks: [],
            status: 'uploading',
            createdAt: Date.now()
        };

        await this.saveState(uploadId, state);
        return { uploadId, chunkSize: 5 * 1024 * 1024 };
    }

    async handleChunk(uploadId, index, buffer) {
        const state = await this.getState(uploadId);
        if (!state) throw new Error('Upload not found');

        const chunkPath = path.join(TEMP_DIR, uploadId, `chunk_${index}`);
        await fs.writeFile(chunkPath, buffer);

        state.chunks.push({ index, path: chunkPath });
        state.uploadedSize += buffer.length;
        await this.saveState(uploadId, state);

        if (state.chunks.length === state.totalChunks) {
            return await this.finalizeUpload(uploadId, state);
        }

        return { status: 'uploading', progress: (state.uploadedSize / state.size) * 100 };
    }

    async finalizeUpload(uploadId, state) {
        const finalPath = path.join(UPLOAD_DIR, `${uploadId}${path.extname(state.filename)}`);
        const writeStream = require('fs').createWriteStream(finalPath);

        state.chunks.sort((a, b) => a.index - b.index);

        for (const chunk of state.chunks) {
            const data = await fs.readFile(chunk.path);
            writeStream.write(data);
        }
        writeStream.end();

        await new Promise((resolve) => writeStream.on('finish', resolve));
        await fs.rm(path.join(TEMP_DIR, uploadId), { recursive: true, force: true });

        return { status: 'completed', filePath: finalPath };
    }

    async saveState(id, state) {
        await redis.set(`upload:${id}`, JSON.stringify(state), { EX: 86400 });
    }

    async getState(id) {
        const data = await redis.get(`upload:${id}`);
        return data ? JSON.parse(data) : null;
    }
}

const uploadManager = new UploadManager();

// Routes
app.post('/api/upload/init', async (req, res) => {
    try {
        const result = await uploadManager.initUpload(req.body);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/upload/chunk/:uploadId', upload.single('chunk'), async (req, res) => {
    try {
        const result = await uploadManager.handleChunk(req.params.uploadId, parseInt(req.body.index), req.file.buffer);

        if (result.status === 'completed') {
            // Queue for processing
            const jobId = crypto.randomBytes(8).toString('hex');
            await redis.lPush('video:queue', JSON.stringify({
                id: jobId,
                inputPath: result.filePath,
                options: {
                    outputFormats: ['hls', 'mp4'],
                    qualities: ['360p', '720p', '1080p']
                }
            }));
            result.jobId = jobId;
        }

        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/health', (req, res) => res.send('healthy'));

app.listen(PORT, () => console.log(`Video API running on port ${PORT}`));
