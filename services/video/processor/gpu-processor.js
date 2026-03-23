// video-processor-worker/gpu-processor.js
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

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

        // GPU-optimized encoding command
        const command = [
            'ffmpeg',
            '-hwaccel', 'cuda',                     // Enable CUDA hardware acceleration
            '-hwaccel_output_format', 'cuda',       // Output in CUDA format
            '-i', `"${inputPath}"`,                 // Input file
            '-vf', `scale_cuda=w=${width}:h=${height}:interp_algo=super`, // GPU scaling
            '-c:v', 'h264_nvenc',                   // NVIDIA H.264 encoder
            '-preset', preset,                      // GPU preset (p1-p7)
            '-profile:v', 'high',                   // Encoding profile
            '-rc', 'vbr',                           // Rate control
            '-cq', quality,                         // Constant quality
            '-b:v', bitrate,                        // Target bitrate
            '-maxrate', `${parseInt(bitrate) * 1.5}k`, // Max bitrate
            '-bufsize', `${parseInt(bitrate) * 2}k`,   // Buffer size
            '-rc-lookahead', '32',                  // Lookahead for better quality
            '-spatial-aq', '1',                     // Spatial adaptive quantization
            '-temporal-aq', '1',                    // Temporal adaptive quantization
            '-bf', '3',                             // B-frames
            '-b_ref_mode', 'middle',                // B-frame reference mode
            '-c:a', 'aac',                          // Audio codec
            '-b:a', '192k',                         // Audio bitrate
            '-y',                                   // Overwrite output
            `"${outputPath}"`
        ].join(' ');

        console.log(`🎬 Encoding with GPU: ${command}`);

        try {
            const { stdout, stderr } = await execAsync(command, { timeout: 3600000 });

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

        const command = [
            'ffmpeg',
            '-i', `"${inputPath}"`,
            '-vf', `scale=w=${width}:h=${height}:flags=lanczos`,
            '-c:v', 'libx264',
            '-preset', preset,
            '-crf', crf,
            '-maxrate', bitrate,
            '-bufsize', `${parseInt(bitrate) * 2}k`,
            '-profile:v', 'high',
            '-level', '4.0',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-movflags', '+faststart',
            '-y',
            `"${outputPath}"`
        ].join(' ');

        console.log(`🎬 Encoding with CPU: ${command}`);

        try {
            const { stdout, stderr } = await execAsync(command, { timeout: 3600000 });

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
