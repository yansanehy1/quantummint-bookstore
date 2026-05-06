// video-processor-worker/gpu-processor.js
const { exec, spawn } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

function runFFmpeg(args, timeoutMs = 3600000) {
    return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
        let stdout = '';
        let stderr = '';

        const timer = setTimeout(() => {
            try {
                ffmpeg.kill('SIGKILL');
            } catch {}
            reject(new Error('ffmpeg timeout'));
        }, timeoutMs);

        ffmpeg.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        ffmpeg.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        ffmpeg.on('error', (error) => {
            clearTimeout(timer);
            reject(error);
        });

        ffmpeg.on('close', (code) => {
            clearTimeout(timer);
            if (code === 0) {
                resolve({ stdout, stderr });
            } else {
                reject(new Error(`ffmpeg failed with code ${code}: ${stderr}`));
            }
        });
    });
}

class GPUVideoProcessor {
    constructor() {
        this.gpuAvailable = false;
        this.gpuInfo = null;
        this.detectGPU();
    }

    async detectGPU() {
        try {
            const { stdout } = await execAsync('nvidia-smi --query-gpu=name,memory.total,compute_cap --format=csv,noheader');
            const [name, memory, computeCap] = stdout.trim().split(', ');

            this.gpuInfo = {
                name: name.trim(),
                memory: parseInt(memory.replace(/\D/g, '')),
                computeCapability: computeCap.trim()
            };

            this.gpuAvailable = true;
            console.log(`✅ GPU detected: ${this.gpuInfo.name} (${this.gpuInfo.memory}MB)`);

        } catch (error) {
            this.gpuAvailable = false;
            console.log('ℹ️  No GPU detected, falling back to CPU processing');
        }
    }

    async encodeWithGPU(inputPath, outputPath, options = {}) {
        if (!this.gpuAvailable) {
            return this.encodeWithCPU(inputPath, outputPath, options);
        }

        const {
            width = 1920,
            height = 1080,
            bitrate = '5000k',
            profile = 'balanced',
            preset = 'p4',
            quality = 23
        } = options;

        const widthInt = Number.isFinite(width) ? Math.trunc(width) : parseInt(width, 10) || 1920;
        const heightInt = Number.isFinite(height) ? Math.trunc(height) : parseInt(height, 10) || 1080;
        const qualityInt = Number.isFinite(quality) ? Math.trunc(quality) : parseInt(quality, 10) || 23;
        const bitrateK = typeof bitrate === 'string' && /^\\d+k$/i.test(bitrate) ? bitrate.toLowerCase() : '5000k';
        const presetNV = typeof preset === 'string' && /^p[1-7]$/i.test(preset) ? preset.toLowerCase() : 'p4';
        const bitrateNum = parseInt(bitrateK, 10);

        // IMPORTANT: use spawn(args) (no shell) to prevent command injection via paths/options.
        const args = [
            '-hwaccel', 'cuda',
            '-hwaccel_output_format', 'cuda',
            '-i', inputPath,
            '-vf', `scale_cuda=w=${widthInt}:h=${heightInt}:interp_algo=super`,
            '-c:v', 'h264_nvenc',
            '-preset', presetNV,
            '-profile:v', 'high',
            '-rc', 'vbr',
            '-cq', String(qualityInt),
            '-b:v', bitrateK,
            '-maxrate', `${Math.floor(bitrateNum * 1.5)}k`,
            '-bufsize', `${Math.floor(bitrateNum * 2)}k`,
            '-rc-lookahead', '32',
            '-spatial-aq', '1',
            '-temporal-aq', '1',
            '-bf', '3',
            '-b_ref_mode', 'middle',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-y',
            outputPath
        ];

        console.log(`🎬 Encoding with GPU (ffmpeg args):`, args);

        try {
            const { stdout, stderr } = await runFFmpeg(args, 3600000);

            // Parse GPU stats from output
            const gpuStats = this.parseGPUStats(stderr);

            return {
                success: true,
                method: 'gpu',
                gpuStats,
                outputPath
            };

        } catch (error) {
            console.error('GPU encoding failed, falling back to CPU:', error.message);
            return this.encodeWithCPU(inputPath, outputPath, options);
        }
    }

    async encodeWithCPU(inputPath, outputPath, options = {}) {
        const {
            width = 1920,
            height = 1080,
            bitrate = '5000k',
            preset = 'medium',
            crf = 23
        } = options;

        const widthInt = Number.isFinite(width) ? Math.trunc(width) : parseInt(width, 10) || 1920;
        const heightInt = Number.isFinite(height) ? Math.trunc(height) : parseInt(height, 10) || 1080;
        const crfInt = Number.isFinite(crf) ? Math.trunc(crf) : parseInt(crf, 10) || 23;
        const bitrateK = typeof bitrate === 'string' && /^\\d+k$/i.test(bitrate) ? bitrate.toLowerCase() : '5000k';
        const presetStr = typeof preset === 'string' ? preset : 'medium';
        const presetSafe = /^[a-zA-Z0-9_-]+$/.test(presetStr) ? presetStr : 'medium';
        const bitrateNum = parseInt(bitrateK, 10);

        // IMPORTANT: use spawn(args) (no shell) to prevent command injection via paths/options.
        const args = [
            '-i', inputPath,
            '-vf', `scale=w=${widthInt}:h=${heightInt}:flags=lanczos`,
            '-c:v', 'libx264',
            '-preset', presetSafe,
            '-crf', String(crfInt),
            '-maxrate', bitrateK,
            '-bufsize', `${Math.floor(bitrateNum * 2)}k`,
            '-profile:v', 'high',
            '-level', '4.0',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-movflags', '+faststart',
            '-y',
            outputPath
        ];

        console.log(`🎬 Encoding with CPU (ffmpeg args):`, args);

        try {
            const { stdout, stderr } = await runFFmpeg(args, 3600000);

            return {
                success: true,
                method: 'cpu',
                outputPath
            };

        } catch (error) {
            console.error('CPU encoding failed:', error);
            throw error;
        }
    }

    parseGPUStats(stderr) {
        const stats = {
            gpuUtilization: 0,
            memoryUsage: 0,
            encoderUtilization: 0,
            fps: 0
        };

        // Parse FFmpeg GPU output
        const gpuMatch = stderr.match(/GPU utilization:\s*(\d+)%/);
        const memoryMatch = stderr.match(/GPU memory usage:\s*(\d+) MB/);
        const encoderMatch = stderr.match(/Encoder utilization:\s*(\d+)%/);
        const fpsMatch = stderr.match(/frame=\s*\d+\s*fps=\s*([\d.]+)/);

        if (gpuMatch) stats.gpuUtilization = parseInt(gpuMatch[1]);
        if (memoryMatch) stats.memoryUsage = parseInt(memoryMatch[1]);
        if (encoderMatch) stats.encoderUtilization = parseInt(encoderMatch[1]);
        if (fpsMatch) stats.fps = parseFloat(fpsMatch[1]);

        return stats;
    }
}

module.exports = GPUVideoProcessor;
