// video-processor/core.js - Pure Node.js + ffmpeg/wasm
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class QuantumVideoProcessor {
    constructor(config = {}) {
        this.config = {
            ffmpegPath: config.ffmpegPath || 'ffmpeg', // Assumes ffmpeg is in PATH
            ffprobePath: config.ffprobePath || 'ffprobe',
            tempDir: config.tempDir || path.join(__dirname, '../temp'),
            storageDir: config.storageDir || path.join(__dirname, '../videos'),
            maxConcurrent: config.maxConcurrent || 3,
            ...config
        };

        this.queue = [];
        this.activeJobs = new Map();
        this.formats = {
            hls: { ext: 'm3u8', codec: 'h264', preset: 'fast' },
            dash: { ext: 'mpd', codec: 'h264', preset: 'fast' },
            mp4: { ext: 'mp4', codec: 'h264', preset: 'medium' },
            webm: { ext: 'webm', codec: 'vp9', preset: 'good' }
        };

        this.encodingProfiles = {
            '240p': { width: 426, height: 240, bitrate: '400k', audio: '64k' },
            '360p': { width: 640, height: 360, bitrate: '800k', audio: '96k' },
            '480p': { width: 854, height: 480, bitrate: '1200k', audio: '128k' },
            '720p': { width: 1280, height: 720, bitrate: '2500k', audio: '192k' },
            '1080p': { width: 1920, height: 1080, bitrate: '5000k', audio: '256k' },
            '1440p': { width: 2560, height: 1440, bitrate: '8000k', audio: '320k' },
            '4k': { width: 3840, height: 2160, bitrate: '16000k', audio: '384k' }
        };

        this.initDirectories();
    }

    async initDirectories() {
        const dirs = [
            this.config.tempDir,
            this.config.storageDir,
            path.join(this.config.storageDir, 'originals'),
            path.join(this.config.storageDir, 'encoded'),
            path.join(this.config.storageDir, 'hls'),
            path.join(this.config.storageDir, 'thumbnails'),
            path.join(this.config.storageDir, 'previews')
        ];

        for (const dir of dirs) {
            try {
                await fs.mkdir(dir, { recursive: true });
            } catch (error) {
                console.warn(`Could not create directory ${dir}:`, error.message);
            }
        }
    }

    async processVideo(inputPath, options = {}) {
        const jobId = crypto.randomBytes(8).toString('hex');
        const job = {
            id: jobId,
            inputPath,
            options: {
                outputFormats: options.outputFormats || ['hls', 'mp4'],
                qualities: options.qualities || ['360p', '480p', '720p', '1080p'],
                generateThumbnails: options.generateThumbnails !== false,
                generatePreview: options.generatePreview !== false,
                subtitles: options.subtitles || [],
                watermark: options.watermark,
                ...options
            },
            status: 'queued',
            progress: 0,
            createdAt: Date.now(),
            output: {}
        };

        this.queue.push(job);
        this.processQueue();

        return jobId;
    }

    async processQueue() {
        if (this.activeJobs.size >= this.config.maxConcurrent) return;
        if (this.queue.length === 0) return;

        const job = this.queue.shift();
        this.activeJobs.set(job.id, job);

        try {
            job.status = 'analyzing';
            await this.emitProgress(job.id, 5);

            // Step 1: Analyze video
            const videoInfo = await this.analyzeVideo(job.inputPath);
            job.videoInfo = videoInfo;

            // Step 2: Create working directory
            const workDir = path.join(this.config.tempDir, job.id);
            await fs.mkdir(workDir, { recursive: true });

            // Step 3: Generate thumbnails (if requested)
            if (job.options.generateThumbnails) {
                job.status = 'generating_thumbnails';
                await this.emitProgress(job.id, 10);

                const thumbnails = await this.generateThumbnails(job.inputPath, workDir);
                job.output.thumbnails = thumbnails;
            }

            // Step 4: Generate preview clip
            if (job.options.generatePreview) {
                job.status = 'generating_preview';
                await this.emitProgress(job.id, 15);

                const preview = await this.generatePreview(job.inputPath, workDir);
                job.output.preview = preview;
            }

            // Step 5: Encode video for each format
            let formatProgress = 20;
            const formatStep = 60 / job.options.outputFormats.length;

            for (const format of job.options.outputFormats) {
                job.status = `encoding_${format}`;
                await this.emitProgress(job.id, formatProgress);

                const encoded = await this.encodeVideo(
                    job.inputPath,
                    workDir,
                    format,
                    job.options.qualities,
                    job.options
                );

                job.output[format] = encoded;
                formatProgress += formatStep;
                await this.emitProgress(job.id, formatProgress);
            }

            // Step 6: Generate HLS/DASH manifests
            job.status = 'generating_manifests';
            await this.emitProgress(job.id, 85);

            if (job.output.hls) {
                const manifest = await this.generateHLSManifest(job.output.hls, workDir);
                job.output.hlsManifest = manifest;
            }

            if (job.output.dash) {
                const manifest = await this.generateDASHManifest(job.output.dash, workDir);
                job.output.dashManifest = manifest;
            }

            // Step 7: Move to permanent storage
            job.status = 'moving_to_storage';
            await this.emitProgress(job.id, 90);

            const finalPath = path.join(this.config.storageDir, 'encoded', job.id);
            await fs.mkdir(finalPath, { recursive: true });

            // Copy all generated files
            await this.copyDirectory(workDir, finalPath);

            // Cleanup temp directory
            await fs.rm(workDir, { recursive: true, force: true });

            job.status = 'completed';
            job.output.finalPath = finalPath;
            await this.emitProgress(job.id, 100);

        } catch (error) {
            job.status = 'failed';
            job.error = error.message;
            console.error(`Video processing failed for job ${job.id}:`, error);
        } finally {
            this.activeJobs.delete(job.id);
            this.processQueue(); // Process next job
        }
    }

    async analyzeVideo(videoPath) {
        return new Promise((resolve, reject) => {
            const ffprobe = spawn(this.config.ffprobePath, [
                '-v', 'quiet',
                '-print_format', 'json',
                '-show_format',
                '-show_streams',
                videoPath
            ]);

            let stdout = '';
            let stderr = '';

            ffprobe.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            ffprobe.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            ffprobe.on('close', (code) => {
                if (code === 0) {
                    try {
                        const data = JSON.parse(stdout);
                        const videoStream = data.streams.find(s => s.codec_type === 'video');
                        const audioStream = data.streams.find(s => s.codec_type === 'audio');

                        const info = {
                            duration: parseFloat(data.format.duration),
                            size: parseInt(data.format.size),
                            format: data.format.format_name,
                            bitrate: parseInt(data.format.bit_rate),
                            video: videoStream ? {
                                codec: videoStream.codec_name,
                                width: videoStream.width,
                                height: videoStream.height,
                                bitrate: parseInt(videoStream.bit_rate) || null,
                                framerate: videoStream.r_frame_rate, // kept as string to avoid eval
                                rotation: videoStream.tags?.rotate || 0
                            } : null,
                            audio: audioStream ? {
                                codec: audioStream.codec_name,
                                channels: audioStream.channels,
                                samplerate: audioStream.sample_rate,
                                bitrate: parseInt(audioStream.bit_rate) || null
                            } : null
                        };

                        resolve(info);
                    } catch (error) {
                        reject(new Error(`Failed to parse ffprobe output: ${error.message}`));
                    }
                } else {
                    reject(new Error(`ffprobe failed: ${stderr}`));
                }
            });
        });
    }

    async encodeVideo(inputPath, outputDir, format, qualities, options) {
        const results = {};

        switch (format) {
            case 'hls':
                results.hls = await this.encodeHLS(inputPath, outputDir, qualities, options);
                break;
            case 'dash':
                // Placeholder for DASH implementation
                // results.dash = await this.encodeDASH(inputPath, outputDir, qualities, options);
                break;
            case 'mp4':
                results.mp4 = await this.encodeMP4(inputPath, outputDir, qualities, options);
                break;
            case 'webm':
                // Placeholder for WebM implementation
                // results.webm = await this.encodeWebM(inputPath, outputDir, qualities, options);
                break;
        }

        return results;
    }

    async encodeHLS(inputPath, outputDir, qualities, options) {
        const hlsDir = path.join(outputDir, 'hls');
        await fs.mkdir(hlsDir, { recursive: true });

        // Create master playlist
        let masterPlaylist = 'EXTM3U\nEXT-X-VERSION:6\n';
        const segmentDuration = 6;

        const qualityJobs = qualities.map(quality => {
            const profile = this.encodingProfiles[quality];
            if (!profile) throw new Error(`Unknown quality profile: ${quality}`);

            const qualityDir = path.join(hlsDir, quality);
            return {
                quality,
                profile,
                outputPath: path.join(qualityDir, 'playlist.m3u8'),
                args: this.buildFFmpegArgs(inputPath, 'hls', profile, {
                    hlsTime: segmentDuration,
                    hlsListSize: 0,
                    hlsSegmentFilename: path.join(qualityDir, 'segment_%03d.ts'),
                    masterPlaylistName: path.join(hlsDir, 'master.m3u8'),
                    ...options
                })
            };
        });

        // Generate variant playlists
        for (const job of qualityJobs) {
            await fs.mkdir(path.dirname(job.outputPath), { recursive: true });

            await this.runFFmpeg(job.args);

            // Add to master playlist
            masterPlaylist += `EXT-X-STREAM-INF:BANDWIDTH=${parseInt(job.profile.bitrate) * 1000},RESOLUTION=${job.profile.width}x${job.profile.height}\n`;
            masterPlaylist += `${job.quality}/playlist.m3u8\n`;
        }

        // Write master playlist
        await fs.writeFile(path.join(hlsDir, 'master.m3u8'), masterPlaylist);

        return {
            masterPlaylist: path.join(hlsDir, 'master.m3u8'),
            qualities: qualityJobs.map(j => ({
                quality: j.quality,
                playlist: j.outputPath,
                segments: path.join(hlsDir, j.quality, 'segment_%03d.ts')
            })),
            segmentDuration
        };
    }

    async encodeMP4(inputPath, outputDir, qualities, options) {
        const results = {};

        for (const quality of qualities) {
            const profile = this.encodingProfiles[quality];
            if (!profile) continue;

            const outputPath = path.join(outputDir, 'mp4', `${quality}.mp4`);
            await fs.mkdir(path.dirname(outputPath), { recursive: true });

            const args = this.buildFFmpegArgs(inputPath, 'mp4', profile, options);
            args.push(outputPath);

            await this.runFFmpeg(args);

            results[quality] = outputPath;
        }

        return results;
    }

    buildFFmpegArgs(inputPath, format, profile, options = {}) {
        const args = [
            '-i', inputPath,
            '-hide_banner',
            '-loglevel', 'info',
            '-y' // Overwrite output files
        ];

        // Video encoding options
        args.push(
            '-c:v', this.formats[format]?.codec === 'vp9' ? 'libvpx-vp9' : 'libx264',
            '-preset', this.formats[format]?.preset || 'medium',
            '-crf', '23',
            '-maxrate', profile.bitrate,
            '-bufsize', `${parseInt(profile.bitrate) * 2}k`,
            '-vf', `scale=w=${profile.width}:h=${profile.height}:force_original_aspect_ratio=decrease,pad=${profile.width}:${profile.height}:(ow-iw)/2:(oh-ih)/2`
        );

        // Add watermark if specified
        if (options.watermark) {
            args.push('-i', options.watermark.path);
            args.push('-filter_complex', `overlay=${options.watermark.position || '10:10'}`);
        }

        // Audio encoding options
        args.push(
            '-c:a', 'aac',
            '-b:a', profile.audio,
            '-ac', '2',
            '-ar', '48000'
        );

        // Format-specific options
        switch (format) {
            case 'hls':
                args.push(
                    '-hls_time', options.hlsTime || '6',
                    '-hls_list_size', options.hlsListSize || '0',
                    '-hls_segment_filename', options.hlsSegmentFilename,
                    '-hls_playlist_type', 'vod',
                    '-f', 'hls'
                );
                break;
            case 'mp4':
                args.push('-movflags', '+faststart');
                break;
        }

        return args;
    }

    async generateThumbnails(inputPath, outputDir) {
        const thumbDir = path.join(outputDir, 'thumbnails');
        await fs.mkdir(thumbDir, { recursive: true });

        // Generate thumbnail every 10% of video duration
        const info = await this.analyzeVideo(inputPath);
        const interval = info.duration / 10;

        const thumbnails = [];

        for (let i = 0; i <= 10; i++) {
            const time = i * interval;
            const outputFile = path.join(thumbDir, `thumb_${i}.jpg`);

            const args = [
                '-i', inputPath,
                '-ss', time.toString(),
                '-vframes', '1',
                '-q:v', '2',
                '-vf', 'scale=320:-1',
                '-y',
                outputFile
            ];

            await this.runFFmpeg(args);
            thumbnails.push({
                time: Math.round(time),
                percentage: i * 10,
                path: outputFile,
                filename: `thumb_${i}.jpg`
            });
        }

        // Generate sprite sheet (placeholder)
        // await this.generateSpriteSheet(thumbnails, thumbDir);

        return thumbnails;
    }

    async generatePreview(inputPath, outputDir, duration = 30) {
        const info = await this.analyzeVideo(inputPath);
        const startTime = Math.min(60, info.duration / 4); // Start at 25% or 1min

        const previewPath = path.join(outputDir, 'preview.mp4');

        const args = [
            '-i', inputPath,
            '-ss', startTime.toString(),
            '-t', duration.toString(),
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '28',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-vf', 'scale=640:-1',
            '-y',
            previewPath
        ];

        await this.runFFmpeg(args);

        return {
            path: previewPath,
            startTime,
            duration,
            resolution: '640x?'
        };
    }

    async generateHLSManifest(encodedData, outputDir) {
        const { masterPlaylist, qualities, segmentDuration } = encodedData;

        // Read and enhance master playlist
        let masterContent = await fs.readFile(masterPlaylist, 'utf8');

        // Add custom headers for our player
        const enhancedContent = ` QuantumMint HLS Manifest
 Created: ${new Date().toISOString()}
 Segment Duration: ${segmentDuration}s
${masterContent}`;

        const finalPath = path.join(outputDir, 'master_enhanced.m3u8');
        await fs.writeFile(finalPath, enhancedContent);

        return finalPath;
    }

    async runFFmpeg(args) {
        return new Promise((resolve, reject) => {
            console.log(`Running ffmpeg: ${this.config.ffmpegPath} ${args.join(' ')}`);

            const ffmpeg = spawn(this.config.ffmpegPath, args);

            let stdout = '';
            let stderr = '';

            ffmpeg.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            ffmpeg.stderr.on('data', (data) => {
                stderr += data.toString();
                // Parse progress from ffmpeg output
                const timeMatch = data.toString().match(/time=(\d{2}:\d{2}:\d{2}.\d{2})/);
                if (timeMatch) {
                    // console.log(`FFmpeg progress: ${timeMatch[1]}`);
                }
            });

            ffmpeg.on('close', (code) => {
                if (code === 0) {
                    resolve({ stdout, stderr });
                } else {
                    reject(new Error(`FFmpeg failed with code ${code}: ${stderr}`));
                }
            });

            ffmpeg.on('error', (error) => {
                reject(error);
            });
        });
    }

    async copyDirectory(source, destination) {
        const entries = await fs.readdir(source, { withFileTypes: true });

        await fs.mkdir(destination, { recursive: true });

        for (const entry of entries) {
            const srcPath = path.join(source, entry.name);
            const destPath = path.join(destination, entry.name);

            if (entry.isDirectory()) {
                await this.copyDirectory(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    }

    async emitProgress(jobId, progress) {
        const job = this.activeJobs.get(jobId);
        if (job) {
            job.progress = progress;
            // Emit to WebSocket or store in Redis for real-time updates
            console.log(`Job ${jobId} progress: ${progress}%`);
        }
    }

    async getJobStatus(jobId) {
        // Check active jobs
        if (this.activeJobs.has(jobId)) {
            const job = this.activeJobs.get(jobId);
            return {
                id: jobId,
                status: job.status,
                progress: job.progress,
                createdAt: job.createdAt
            };
        }

        // In a real implementation, check database/redis for completed jobs
        return { id: jobId, status: 'unknown' };
    }
}

module.exports = QuantumVideoProcessor;
