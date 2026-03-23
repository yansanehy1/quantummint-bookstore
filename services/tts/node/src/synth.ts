/// <reference types="node" />
import fs from 'fs';
import path from 'path';
import { ssmlToPhonemeSequence } from './g2p.js';
import { DefaultVoice, VoiceProfile, voices } from './voice.js';

// Simple oscillator + formant filter per frame
type SynthParams = {
    ssml: string;
    voiceId?: string;
    rate: number;         // speed
    pitchShift: number;   // semitones
    format: 'wav' | 'mp3';
    outPath: string;
};

export async function synthesizeToFile(p: SynthParams) {
    const phonemes = ssmlToPhonemeSequence(p.ssml);
    const voice = voices[p.voiceId ?? 'default'] ?? DefaultVoice;
    const sr = 22050;
    const samples: number[] = [];

    for (const ph of phonemes) {
        const durMs = vowel(ph) ? 110 : 70; // basic timing
        const dur = Math.max(40, Math.round(durMs / p.rate));
        const pitchHz = applyPitch(voice.basePitchHz, p.pitchShift);
        const frameSamples = synthPhoneme(ph, voice, sr, dur, pitchHz);
        for (const s of frameSamples) samples.push(s);
    }

    const buf = pcm16le(samples);
    if (p.format === 'wav') writeWav(p.outPath, sr, buf);
    else writeWav(p.outPath, sr, buf); // placeholder: keep WAV for now; swap to MP3 encoder when ready

    const durationMs = Math.round(samples.length / sr * 1000);
    return { durationMs };
}

function vowel(ph: string) {
    return ['AA', 'AE', 'AH', 'AO', 'EH', 'ER', 'IH', 'IY', 'OW', 'UH', 'UW'].includes(ph);
}

function applyPitch(baseHz: number, shiftSt: number) {
    return baseHz * Math.pow(2, shiftSt / 12);
}

function synthPhoneme(ph: string, voice: VoiceProfile, sr: number, durationMs: number, f0: number) {
    const n = Math.round(sr * durationMs / 1000);
    const out = new Array(n).fill(0);
    const form = voice.formants[ph] ?? [700, 1200, 2500];
    const breath = voice.breathiness;

    let phase = 0;
    const twoPi = 2 * Math.PI;
    const glottal = (x: number) => Math.sin(x) * voice.tenseness + Math.random() * breath * 0.2;

    // naive formant filtering: sum of bandpass resonances
    const band = form.map(f => mkBandpass(sr, f, 60));
    for (let i = 0; i < n; i++) {
        phase += twoPi * (f0 / sr);
        const src = glottal(phase);
        let y = src;
        for (const bp of band) y = bp(y);
        out[i] = clamp(y);
    }
    return out;
}

function mkBandpass(sr: number, freq: number, q: number) {
    const w0 = 2 * Math.PI * freq / sr;
    const alpha = Math.sin(w0) / (2 * q);
    const b0 = alpha;
    const b1 = 0;
    const b2 = -alpha;
    const a0 = 1 + alpha;
    const a1 = -2 * Math.cos(w0);
    const a2 = 1 - alpha;
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    return (x0: number) => {
        const y0 = (b0 / a0) * x0 + (b1 / a0) * x1 + (b2 / a0) * x2 - (a1 / a0) * y1 - (a2 / a0) * y2;
        x2 = x1; x1 = x0; y2 = y1; y1 = y0;
        return y0;
    };
}

function clamp(x: number) { return Math.max(-1, Math.min(1, x)); }

function pcm16le(samples: number[]) {
    const b = Buffer.alloc(samples.length * 2);
    for (let i = 0; i < samples.length; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        b.writeInt16LE((s * 32767) | 0, i * 2);
    }
    return b;
}

function writeWav(outPath: string, sr: number, data: Buffer) {
    const header = Buffer.alloc(44);
    const chunkSize = 36 + data.length;
    header.write('RIFF', 0); header.writeUInt32LE(chunkSize, 4); header.write('WAVE', 8);
    header.write('fmt ', 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20);
    header.writeUInt16LE(1, 22); header.writeUInt32LE(sr, 24); header.writeUInt32LE(sr * 2, 28);
    header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
    header.write('data', 36); header.writeUInt32LE(data.length, 40);
    const out = Buffer.concat([header, data]);
    fs.writeFileSync(outPath, out);
}
