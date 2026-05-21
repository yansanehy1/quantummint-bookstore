import fs from 'fs/promises';
import wav from 'node-wav';
import FFT from 'fft.js';

/**
 * Detect base pitch (F0) using autocorrelation
 */
export async function analyzePitchHz(filePath: string): Promise<number | null> {
    try {
        const buffer = await fs.readFile(filePath);
        const result = wav.decode(buffer);
        const data = result.channelData[0];
        const sampleRate = result.sampleRate;

        // Human voice F0 typically 75Hz - 400Hz
        const minLag = Math.floor(sampleRate / 400);
        const maxLag = Math.floor(sampleRate / 75);
        
        let bestLag = -1;
        let maxCorr = -Infinity;

        // Sample a portion to keep it fast
        const searchSize = Math.min(data.length - maxLag, 4096);
        const start = Math.floor((data.length - searchSize - maxLag) / 2);

        for (let lag = minLag; lag <= maxLag; lag++) {
            let corr = 0;
            for (let i = 0; i < searchSize; i++) {
                corr += data[start + i] * data[start + i + lag];
            }
            if (corr > maxCorr) {
                maxCorr = corr;
                bestLag = lag;
            }
        }

        if (bestLag === -1) return null;
        return sampleRate / bestLag;
    } catch (err) {
        console.error('Pitch analysis error:', err);
        return null;
    }
}

/**
 * Estimate spectral tilt (brightness/darkness) using FFT
 */
export async function analyzeSpectralTilt(filePath: string): Promise<number> {
    try {
        const buffer = await fs.readFile(filePath);
        const result = wav.decode(buffer);
        const data = result.channelData[0];

        const fftSize = 2048;
        const f = new FFT(fftSize);
        const out = f.createComplexArray();
        const input = new Float32Array(fftSize);
        
        const start = Math.floor(data.length / 2);
        for (let i = 0; i < fftSize; i++) {
            input[i] = data[start + i] || 0;
        }
        
        f.realTransform(out, input);
        
        let lowSum = 0;
        let highSum = 0;
        
        // Low freq (0-2kHz) vs High freq (2-8kHz)
        const lowLimit = Math.floor(2000 / (result.sampleRate / fftSize));
        const highLimit = Math.floor(8000 / (result.sampleRate / fftSize));

        for (let i = 1; i < lowLimit; i++) {
            lowSum += Math.sqrt(out[i*2]**2 + out[i*2+1]**2);
        }
        for (let i = lowLimit; i < Math.min(highLimit, fftSize/2); i++) {
            highSum += Math.sqrt(out[i*2]**2 + out[i*2+1]**2);
        }
        
        // Tilt in dB per octave (simplified)
        if (lowSum === 0) return 0;
        return 10 * Math.log10(highSum / lowSum);
    } catch (err) {
        console.error('Spectral tilt error:', err);
        return 0;
    }
}

/**
 * General voice quality checks (SNR, clipping, duration)
 */
export async function analyzeVoiceQuality(filePath: string): Promise<{
    duration: number;
    snr: number;
    clipping: boolean;
}> {
    try {
        const buffer = await fs.readFile(filePath);
        const result = wav.decode(buffer);
        const data = result.channelData[0];
        
        let maxVal = 0;
        let clipping = false;
        let rms = 0;
        
        for (const val of data) {
            const absVal = Math.abs(val);
            if (absVal > 0.98) clipping = true;
            if (absVal > maxVal) maxVal = absVal;
            rms += val * val;
        }
        
        rms = Math.sqrt(rms / data.length);
        
        return {
            duration: data.length / result.sampleRate,
            snr: 20 * Math.log10(rms / 0.0001 || 1),
            clipping
        };
    } catch (err) {
        console.error('Voice quality analysis error:', err);
        return { duration: 0, snr: 0, clipping: false };
    }
}
