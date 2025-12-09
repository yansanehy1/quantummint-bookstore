// video-processor/upload-manager.js
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { EventEmitter } = require('events');

class QuantumUploadManager extends EventEmitter {
    constructor(config = {}) {
        super();
        this.config = {
            tempDir: config.tempDir || path.join(__dirname, '../temp/uploads'),
            uploadDir: config.uploadDir || path.join(__dirname, '../videos/originals'),
            maxFileSize: config.maxFileSize || 10 * 1024 * 1024 * 1024, // 10GB
            chunkExpiration: config.chunkExpiration || 24 * 60 * 60 * 1000, // 24 hours
            ...config
        };

        this.activeUploads = new Map();
        this.initDirectories();
    }

    async initDirectories() {
        await fs.mkdir(this.config.tempDir, { recursive: true });
        await fs.mkdir(this.config.uploadDir, { recursive: true });
    }

    async initUpload(metadata) {
        const uploadId = crypto.randomBytes(16).toString('hex');
        const uploadPath = path.join(this.config.tempDir, uploadId);

        await fs.mkdir(uploadPath);

        const uploadState = {
            id: uploadId,
            filename: metadata.filename,
            size: parseInt(metadata.size),
            mimeType: metadata.mimeType,
            chunks: [],
            totalChunks: parseInt(metadata.totalChunks),
            uploadedSize: 0,
            status: 'uploading',
            createdAt: Date.now(),
            userId: metadata.userId,
            metadata: metadata
        };

        this.activeUploads.set(uploadId, uploadState);

        // Save state to disk for recovery
        await this.saveUploadState(uploadId);

        return {
            uploadId,
            chunkSize: metadata.chunkSize || 5 * 1024 * 1024 // Recommend 5MB chunks
        };
    }

    async handleChunk(uploadId, chunkIndex, buffer) {
        const upload = this.activeUploads.get(uploadId);
        if (!upload) {
            // Try to load from disk
            try {
                await this.loadUploadState(uploadId);
            } catch (e) {
                throw new Error('Upload session not found');
            }
        }

        const chunkPath = path.join(this.config.tempDir, uploadId, `chunk_${chunkIndex}`);
        await fs.writeFile(chunkPath, buffer);

        upload.chunks.push({
            index: chunkIndex,
            path: chunkPath,
            size: buffer.length
        });

        upload.uploadedSize += buffer.length;
        this.emit('progress', { uploadId, progress: (upload.uploadedSize / upload.size) * 100 });

        await this.saveUploadState(uploadId);

        // Check if complete
        if (upload.chunks.length === upload.totalChunks) {
            return await this.finalizeUpload(uploadId);
        }

        return { status: 'uploading', progress: (upload.uploadedSize / upload.size) * 100 };
    }

    async finalizeUpload(uploadId) {
        const upload = this.activeUploads.get(uploadId);
        upload.status = 'processing';

        const finalPath = path.join(this.config.uploadDir, `${uploadId}${path.extname(upload.filename)}`);

        // Sort chunks by index
        upload.chunks.sort((a, b) => a.index - b.index);

        // Merge chunks
        const writeStream = require('fs').createWriteStream(finalPath);

        for (const chunk of upload.chunks) {
            const data = await fs.readFile(chunk.path);
            writeStream.write(data);
        }

        writeStream.end();

        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        // Verify size
        const stats = await fs.stat(finalPath);
        if (stats.size !== upload.size) {
            throw new Error(`Upload size mismatch: expected ${upload.size}, got ${stats.size}`);
        }

        // Cleanup temp files
        await fs.rm(path.join(this.config.tempDir, uploadId), { recursive: true, force: true });
        this.activeUploads.delete(uploadId);

        this.emit('completed', {
            uploadId,
            filePath: finalPath,
            metadata: upload.metadata
        });

        return {
            status: 'completed',
            filePath: finalPath,
            uploadId
        };
    }

    async saveUploadState(uploadId) {
        const upload = this.activeUploads.get(uploadId);
        if (upload) {
            await fs.writeFile(
                path.join(this.config.tempDir, uploadId, 'state.json'),
                JSON.stringify(upload)
            );
        }
    }

    async loadUploadState(uploadId) {
        const statePath = path.join(this.config.tempDir, uploadId, 'state.json');
        const data = await fs.readFile(statePath, 'utf8');
        const upload = JSON.parse(data);
        this.activeUploads.set(uploadId, upload);
        return upload;
    }

    async cleanExpiredUploads() {
        const now = Date.now();
        const entries = await fs.readdir(this.config.tempDir);

        for (const entry of entries) {
            try {
                const statePath = path.join(this.config.tempDir, entry, 'state.json');
                const data = await fs.readFile(statePath, 'utf8');
                const upload = JSON.parse(data);

                if (now - upload.createdAt > this.config.chunkExpiration) {
                    await fs.rm(path.join(this.config.tempDir, entry), { recursive: true, force: true });
                    this.activeUploads.delete(entry);
                }
            } catch (e) {
                // Ignore errors (might not be an upload dir)
            }
        }
    }
}

module.exports = QuantumUploadManager;
