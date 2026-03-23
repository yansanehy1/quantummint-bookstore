/// <reference types="node" />
export async function synthesize({ ssml, language, voiceId }) {
    // TODO: call real TTS provider: pass SSML + optional cloned voiceId
    const durationMs = Math.max(3000, ssml.length * 8); // rough estimate
    const waveform = []; // optional: minimal waveform for preview
    return { durationMs, waveform, data: Buffer.from([]) };
}
