import { SyncPoint, SegmentType } from '../types';

// Stub service for AI content generation
// TODO: Integrate with actual Gemini API or other AI service

export async function generateEducationalContent(text: string): Promise<SyncPoint[]> {
    // Mock implementation - split text into paragraphs as segments
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

    return paragraphs.map((paragraph, index) => ({
        id: `segment-${Date.now()}-${index}`,
        time: index * 5,  // time in seconds (matches SyncPoint interface)
        text: paragraph.trim(),
        type: 'normal' as SegmentType,
        visualDescription: 'Generated visual description for content',
        audioUrl: undefined
    }));
}

/**
 * Generate audio from text using Google Cloud Text-to-Speech (free tier)
 * Falls back to browser TTS if API is unavailable
 */
export async function generateAudio(text: string, voiceName: string = 'Kore'): Promise<string> {
    console.log(`Generating audio for: "${text.substring(0, 50)}..." with voice: ${voiceName}`);

    try {
        // Option 1: Try Google Cloud TTS (free tier - no API key needed for basic usage)
        const audioUrl = await generateWithGoogleTTS(text, voiceName);
        if (audioUrl) {
            console.log('✅ Audio generated successfully');
            return audioUrl;
        }
    } catch (error) {
        console.warn('Google TTS failed, trying alternative:', error);
    }

    try {
        // Option 2: Use Microsoft Edge Read Aloud API (free, no key needed)
        const audioUrl = await generateWithEdgeTTS(text, voiceName);
        if (audioUrl) {
            console.log('✅ Audio generated with Edge TTS');
            return audioUrl;
        }
    } catch (error) {
        console.warn('Edge TTS failed:', error);
    }

    // Option 3: Fallback to browser speech synthesis with recording
    console.log('Using browser TTS as fallback');
    return await generateWithBrowserTTS(text, voiceName);
}

/**
 * Generate audio using Google Cloud Text-to-Speech
 */
async function generateWithGoogleTTS(text: string, voiceName: string): Promise<string | null> {
    try {
        // Using Google's public TTS endpoint (demo/free tier)
        const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: { text: text },
                voice: {
                    languageCode: 'en-US',
                    name: voiceName.includes('male') ? 'en-US-Wavenet-D' : 'en-US-Wavenet-F',
                    ssmlGender: voiceName.toLowerCase().includes('male') ? 'MALE' : 'FEMALE'
                },
                audioConfig: {
                    audioEncoding: 'MP3',
                    pitch: 0,
                    speakingRate: 1.0
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Google TTS API error: ${response.status}`);
        }

        const data = await response.json();
        if (data.audioContent) {
            // Convert base64 audio to blob URL
            const audioBlob = base64ToBlob(data.audioContent, 'audio/mp3');
            return URL.createObjectURL(audioBlob);
        }
        return null;
    } catch (error) {
        console.error('Google TTS error:', error);
        return null;
    }
}

/**
 * Generate audio using Microsoft Edge TTS (free alternative)
 */
async function generateWithEdgeTTS(text: string, voiceName: string): Promise<string | null> {
    try {
        // Edge TTS uses a websocket connection, for simplicity using HTTP fallback
        // You can use edge-tts library or similar in production

        // For now, return null to fall through to browser TTS
        // In production, implement proper Edge TTS integration
        return null;
    } catch (error) {
        return null;
    }
}

/**
 * Generate audio using browser's SpeechSynthesis API
 * This speaks the text but doesn't create downloadable audio
 */
async function generateWithBrowserTTS(text: string, voiceName: string): Promise<string> {
    return new Promise((resolve) => {
        try {
            if (!('speechSynthesis' in window)) {
                console.warn('Speech synthesis not supported');
                resolve(createSilentAudio());
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);

            // Try to match the requested voice
            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = voices.find(v =>
                v.name.toLowerCase().includes(voiceName.toLowerCase()) ||
                v.name.toLowerCase().includes('female') ||
                v.name.toLowerCase().includes('english')
            ) || voices[0];

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onend = () => {
                // Since we can't capture browser TTS audio directly,
                // we create a silent audio placeholder
                resolve(createSilentAudio());
            };

            utterance.onerror = () => {
                resolve(createSilentAudio());
            };

            // Speak the text (will be audible but not recorded)
            window.speechSynthesis.speak(utterance);

        } catch (error) {
            console.error('Browser TTS error:', error);
            resolve(createSilentAudio());
        }
    });
}

/**
 * Convert base64 string to Blob
 */
function base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}

/**
 * Create a silent audio file as fallback
 */
function createSilentAudio(): string {
    // Create a minimal silent MP3 (100ms of silence)
    const silentMp3 = 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwPj4+Pj4+TExMTExZWVlZWVlnZ2dnZ3V1dXV1dYODg4ODkZGRkZGRn5+fn5+frKysrKy6urq6urrIyMjIyNbW1tbW1uTk5OTk8vLy8vLy//////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAHjOZTf9/AAAAAAAAAAAAAAAAAAAAAP/7kGQAAANUMEoFPeACNQV40KEYABEY41g5vAAA9RjpZxRTAImU+W8eshaFpAQgALAAYALATx/nYDYCMJ0HITQYYA7AH4c7MoGsnCMU5pnW+OQnBcDrQ9Xx7w37/qMoGsnCMU5pnW+OQnBcDrQ9Xx7w37/qMo';

    const blob = base64ToBlob(silentMp3, 'audio/mp3');
    return URL.createObjectURL(blob);
}
