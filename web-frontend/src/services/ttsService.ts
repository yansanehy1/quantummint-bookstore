const TTS_SERVICE_URL = import.meta.env.VITE_TTS_URL || 'http://localhost:5005';

export interface ProcessResponse {
    segments: any[];
    complexity: number;
    ssml: string;
}

export async function processText(text: string): Promise<ProcessResponse> {
    const response = await fetch(`${TTS_SERVICE_URL}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    return response.json();
}

export async function buildSSML(text: string): Promise<string> {
    const result = await processText(text);
    return result.ssml;
}

export async function synthesizeSpeech(text: string, voiceId: string = 'default', speed: number = 1.0): Promise<string> {
    const response = await fetch(`${TTS_SERVICE_URL}/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice_id: voiceId, speed })
    });

    if (!response.ok) throw new Error('Synthesis failed');

    const blob = await response.blob();
    return URL.createObjectURL(blob);
}
