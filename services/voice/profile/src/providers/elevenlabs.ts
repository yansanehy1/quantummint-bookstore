import axios from 'axios';
import { uploadAudioToStorage } from '../storage.js';

export class ElevenLabsProvider {
    private apiKey: string;
    private baseUrl = 'https://api.elevenlabs.io/v1';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async cloneVoice(
        name: string,
        sampleUrls: string[],
        description?: string
    ): Promise<{ voiceId: string; status: string }> {
        // ElevenLabs requires direct file upload, not URLs
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description || '');

        for (const url of sampleUrls) {
            // In production, these are S3 URLs. For local dev, they are local paths.
            // If they are local paths, we need to read them.
            // Let's assume they are fetchable (http or local server)
            const response = await fetch(url);
            const blob = await response.blob();
            formData.append('files', blob, `sample_${Date.now()}.wav`);
        }

        const result = await axios.post(
            `${this.baseUrl}/voices/add`,
            formData,
            {
                headers: {
                    'xi-api-key': this.apiKey,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return {
            voiceId: result.data.voice_id,
            status: 'ready'
        };
    }

    async synthesize(
        voiceId: string,
        text: string,
        options: {
            model?: string;
            stability?: number;
            similarityBoost?: number;
        } = {}
    ): Promise<{ audioUrl: string; durationMs: number }> {
        const response = await axios.post(
            `${this.baseUrl}/text-to-speech/${voiceId}`,
            {
                text,
                model_id: options.model || 'eleven_monolingual_v1',
                voice_settings: {
                    stability: options.stability ?? 0.75,
                    similarity_boost: options.similarityBoost ?? 0.75
                }
            },
            {
                headers: { 'xi-api-key': this.apiKey },
                responseType: 'arraybuffer'
            }
        );

        const audioUrl = await uploadAudioToStorage(response.data);
        const durationMs = Math.ceil(text.length / 15 * 1000); // ~15 chars/sec

        return { audioUrl, durationMs };
    }
}
