import { azureSynthesizeToFile } from './azure_synth.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export async function synthesize({ ssml, language, voiceId }) {
    // If Azure credentials are provided, use Azure TTS
    if (process.env.AZURE_SPEECH_KEY) {
        try {
            const tempPath = path.join(process.env.TEMP_DIR || '/tmp', `${uuidv4()}.wav`);
            const result = await azureSynthesizeToFile(ssml, tempPath, voiceId);
            const data = fs.readFileSync(tempPath);
            fs.unlinkSync(tempPath); // cleanup
            return { durationMs: result.durationMs, waveform: [], data };
        } catch (error) {
            console.error('Azure TTS failed in synth.js:', error);
        }
    }

    // Fallback to minimal mock result
    const durationMs = Math.max(3000, ssml.length * 8); 
    const waveform = []; 
    return { durationMs, waveform, data: Buffer.from([]) };
}
