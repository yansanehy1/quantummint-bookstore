import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { renderLatexToPng, renderStepFrames } from './shapes.js';

// Call local TTS (your tts-service) via file read/write to keep provider-free
async function localNarrationToWav(text: string, outPath: string) {
    // For demo, generate a tone-like placeholder; replace with actual tts-service call if you allow internal HTTP
    fs.writeFileSync(outPath, silentWav(10000)); // 10s silence; swap with narration
}

type Cue = { type: 'visual' | 'formula' | 'step'; atMs: number; payload: any };

export async function createExplainerVideo({ id, narrationText, baseImage, cues }: {
    id: string; narrationText?: string; baseImage?: string; cues?: Cue[];
}) {
    const outDir = path.join(process.cwd(), 'media', 'videos');
    fs.mkdirSync(outDir, { recursive: true });
    const audioPath = path.join(outDir, `${id}.wav`);
    const videoPath = path.join(outDir, `${id}.mp4`);

    if (narrationText) await localNarrationToWav(narrationText, audioPath);

    // Prepare overlay assets for cues
    const overlays: { startMs: number; endMs: number; file: string; x: number; y: number }[] = [];
    for (const cue of (cues ?? [])) {
        const start = cue.atMs;
        const end = start + 3500;
        if (cue.type === 'formula') {
            const png = path.join(outDir, `${id}-formula-${start}.png`);
            await renderLatexToPng(String(cue.payload), png, { width: 1000 });
            overlays.push({ startMs: start, endMs: end, file: png, x: 140, y: 60 });
        } else if (cue.type === 'step') {
            // Render each step individually and stagger their appearance
            const stepFiles = await renderStepFrames(cue.payload as string[], outDir, id);
            let offset = 0;
            for (const file of stepFiles) {
                const stepStart = cue.atMs + offset;
                const stepEnd = stepStart + 2500; // Each step visible for 2.5s
                overlays.push({ startMs: stepStart, endMs: stepEnd, file, x: 160, y: 380 });
                offset += 3000; // Next step appears 3s later (0.5s gap)
            }
        }
        // visual: we can swap base image on timestamp by using concat or overlay; for MVP, overlay small thumbnail
        if (cue.type === 'visual') {
            overlays.push({ startMs: start, endMs: end, file: cue.payload, x: 860, y: 60 });
        }
    }

    return new Promise<string>((resolve, reject) => {
        // Base video
        const base = baseImage ?? 'color=c=white:s=1280x720:d=10'; // 10s default
        const cmd = ffmpeg();

        if (base.startsWith('color=')) cmd.input(base).inputFormat('lavfi');
        else cmd.input(base); // local file or URL (download first if remote)

        if (fs.existsSync(audioPath)) cmd.input(audioPath);

        // Build complex filter for timed overlays
        const filters: string[] = [];
        let map = '[0:v]';
        let idx = 1;

        filters.push(`${map}scale=1280:720[v0]`);
        map = '[v0]';

        for (const ov of overlays) {
            cmd.input(ov.file);
            filters.push(`${map}[${idx}:v]overlay=${ov.x}:${ov.y}:enable='between(t,${ov.startMs / 1000},${ov.endMs / 1000})'[v${idx}]`);
            map = `[v${idx}]`;
            idx++;
        }

        cmd
            .complexFilter(filters.join(';'))
            .outputOptions(['-map', map, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-shortest'])
            .on('end', () => resolve(`/media/videos/${id}.mp4`))
            .on('error', (err) => reject(err))
            .save(videoPath);
    });
}

function silentWav(ms: number) {
    const sr = 22050;
    const n = Math.round(sr * ms / 1000);
    const data = Buffer.alloc(n * 2);
    const header = Buffer.alloc(44);
    const chunkSize = 36 + data.length;
    header.write('RIFF', 0); header.writeUInt32LE(chunkSize, 4); header.write('WAVE', 8);
    header.write('fmt ', 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20);
    header.writeUInt16LE(1, 22); header.writeUInt32LE(sr, 24); header.writeUInt32LE(sr * 2, 28);
    header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
    header.write('data', 36); header.writeUInt32LE(data.length, 40);
    return Buffer.concat([header, data]);
}
