// TTS (Text-to-Speech) Service
// Handles audio synthesis for book chapters

import api from '../utils/api';
import { WordTimestamp } from '../types';

export interface Voice {
    id: string;
    name: string;
    language: string;
    gender?: 'male' | 'female';
    preview?: string;
}

export interface SynthesisOptions {
    voice?: string;
    speed?: number;
    pitch?: number;
    language?: string;
}

import type { VoiceClone, VoiceUploadResponse } from '../types';

const DEFAULT_VOICES: Voice[] = [
    { id: 'alloy', name: 'Alloy (Neutral)', language: 'en' },
    { id: 'echo', name: 'Echo (Male)', language: 'en' },
    { id: 'fable', name: 'Fable (British)', language: 'en' },
    { id: 'onyx', name: 'Onyx (Deep)', language: 'en' },
    { id: 'nova', name: 'Nova (Female)', language: 'en' },
    { id: 'shimmer', name: 'Shimmer (Soft)', language: 'en' },
];

class TTSService {
    private availableVoices: Voice[] = [];

    /**
     * Check if browser-based speech synthesis is supported
     */
    isBrowserSupported(): boolean {
        return typeof window !== 'undefined' && 'speechSynthesis' in window;
    }

    /**
     * Synthesize chapter text to audio
     */
    async synthesizeChapter(
        chapterText: string,
        options: SynthesisOptions = {},
        signal?: AbortSignal
    ): Promise<{ audioUrl: string; durationMs: number }> {
        try {
            // Validate text length (backend limit is 5000)
            const validation = this.validateText(chapterText);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Sanitize text: strip HTML and extra whitespace
            const sanitizedText = this.sanitizeText(chapterText);

            const result = await api.tts.synthesizeChapter({
                text: sanitizedText,
                voice: options.voice,
                speed: options.speed,
                pitch: options.pitch,
                language: options.language || 'en'
            }, { signal });

            console.log(`Synthesized ${sanitizedText.length} characters`);

            return result;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Synthesis request aborted');
                throw error;
            }
            console.error('TTS synthesis failed:', error);
            throw error;
        }
    }

    /**
     * Sanitize text for TTS
     */
    private sanitizeText(text: string): string {
        return text
            .replace(/<[^>]*>/g, '') // Strip HTML
            .replace(/\s+/g, ' ')    // Normalize whitespace
            .trim();
    }

    /**
     * Get available voices
     */
    async getVoices(): Promise<Voice[]> {
        try {
            if (this.availableVoices.length === 0) {
                // Try to get from API, fallback to defaults
                try {
                    const apiVoices = await api.tts.getVoices();
                    this.availableVoices = apiVoices.length > 0 ? apiVoices : DEFAULT_VOICES;
                } catch (e) {
                    console.warn('Failed to fetch voices from API, using defaults');
                    this.availableVoices = DEFAULT_VOICES;
                }
            }
            return this.availableVoices;
        } catch (error) {
            console.error('Failed to get voices:', error);
            return DEFAULT_VOICES;
        }
    }

    /**
     * Estimate synthesis duration
     */
    estimateDuration(text: string, wordsPerMinute: number = 150): number {
        const words = text.split(/\s+/).length;
        const minutes = words / wordsPerMinute;
        return Math.ceil(minutes * 60); // Return in seconds
    }

    /**
     * Calculate synthesis cost (if applicable)
     */
    calculateCost(text: string, pricePerCharacter: number = 0.000016): number {
        return text.length * pricePerCharacter;
    }

    /**
     * Batch synthesize multiple chapters with concurrency control
     */
    async synthesizeMultiple(
        chapters: Array<{ id: string; text: string }>,
        options: SynthesisOptions = {},
        onProgress?: (completed: number, total: number) => void,
        concurrency: number = 2
    ): Promise<Array<{ id: string; audioUrl: string; durationMs: number }>> {
        const results = new Array(chapters.length);
        let completed = 0;
        let currentIndex = 0;

        const processNext = async (): Promise<void> => {
            if (currentIndex >= chapters.length) return;
            
            const index = currentIndex++;
            const chapter = chapters[index];

            try {
                const result = await this.synthesizeChapter(chapter.text, options);
                results[index] = {
                    id: chapter.id,
                    ...result
                };
            } catch (error) {
                console.error(`Failed to synthesize chapter ${chapter.id}:`, error);
                results[index] = null; // Mark as failed but continue batch
            } finally {
                completed++;
                if (onProgress) {
                    onProgress(completed, chapters.length);
                }
                await processNext();
            }
        };

        // Launch workers
        const workerCount = Math.min(concurrency, chapters.length);
        const workers = Array(workerCount)
            .fill(null)
            .map(() => processNext());

        await Promise.all(workers);

        return results.filter(r => r !== null);
    }

    /**
     * Synthesize text with word-level timestamps (if supported by provider)
     */
    async synthesizeWithTimestamps(
        text: string,
        options: SynthesisOptions = {},
        signal?: AbortSignal
    ): Promise<{ 
        audioUrl: string; 
        durationMs: number;
        words: WordTimestamp[];
    }> {
        try {
            const sanitizedText = this.sanitizeText(text);
            const result = await api.tts.synthesizeChapter({
                text: sanitizedText,
                voice: options.voice,
                speed: options.speed,
                pitch: options.pitch,
                language: options.language || 'en',
                // @ts-ignore - Backend flag for proxy to forward
                returnTimestamps: true 
            }, { signal });

            return result as any;
        } catch (error) {
            console.error('TTS synthesis with timestamps failed:', error);
            throw error;
        }
    }

    /**
     * Synthesize with browser fallback if network or server fails
     */
    async synthesizeWithBrowserFallback(
        text: string,
        options: SynthesisOptions = {}
    ): Promise<{ audioUrl: string; durationMs: number; isFallback: boolean }> {
        try {
            const result = await this.synthesizeChapter(text, options);
            return { ...result, isFallback: false };
        } catch (err) {
            if (!navigator.onLine || this.isBrowserSupported()) {
                console.warn('Falling back to browser speech synthesis');
                return new Promise((resolve, reject) => {
                    const utterance = new SpeechSynthesisUtterance(this.sanitizeText(text));
                    utterance.rate = options.speed || 1.0;
                    utterance.pitch = (options.pitch || 0) / 10 + 1; // Map -5..5 to 0.5..1.5
                    
                    const voices = window.speechSynthesis.getVoices();
                    const matchedVoice = voices.find(v => v.lang.startsWith(options.language || 'en'));
                    if (matchedVoice) utterance.voice = matchedVoice;
                    
                    utterance.onend = () => {
                        resolve({
                            audioUrl: 'blob:browser-tts', // Indicator for live playback
                            durationMs: this.estimateDuration(text) * 1000,
                            isFallback: true
                        });
                    };
                    utterance.onerror = (e) => reject(new Error(`Browser TTS failed: ${e.error}`));
                    
                    window.speechSynthesis.speak(utterance);
                });
            }
            throw err;
        }
    }

    /**
     * Upload a voice clone
     */
    async uploadVoiceClone(voiceData: {
        name: string;
        description?: string;
        audioBlob: Blob;
    }): Promise<VoiceUploadResponse> {
        try {
            const formData = new FormData();
            formData.append('audio', voiceData.audioBlob);
            formData.append('name', voiceData.name);
            if (voiceData.description) {
                formData.append('description', voiceData.description);
            }
            
            // Note: fetchAPI currently handles JSON bodies. For FormData, 
            // we might need a separate helper or use direct fetch with auth.
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${api.API_BASE_URL}/tts/voices/clone`, {
                method: 'POST',
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Upload failed' }));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('Voice cloning failed:', error);
            throw error;
        }
    }

    /**
     * Synthesize long text by chunking it
     */
    async synthesizeLongText(
        text: string,
        options: SynthesisOptions = {},
        onProgress?: (completed: number, total: number) => void
    ): Promise<{ audioUrl: string[]; totalDurationMs: number }> {
        const sanitizedText = this.sanitizeText(text);
        const chunks = this.chunkText(sanitizedText, 4500); // Slightly less than 5000 to be safe
        const results = [];
        let totalDurationMs = 0;

        for (let i = 0; i < chunks.length; i++) {
            try {
                const result = await this.synthesizeChapter(chunks[i], options);
                results.push(result.audioUrl);
                totalDurationMs += result.durationMs;

                if (onProgress) {
                    onProgress(i + 1, chunks.length);
                }
            } catch (error) {
                console.error(`Failed to synthesize chunk ${i + 1}:`, error);
                throw error;
            }
        }

        return {
            audioUrl: results,
            totalDurationMs
        };
    }

    /**
     * Chunk text into smaller pieces
     */
    private chunkText(text: string, maxLength: number): string[] {
        const chunks: string[] = [];
        let remainingText = text;

        while (remainingText.length > 0) {
            if (remainingText.length <= maxLength) {
                chunks.push(remainingText);
                break;
            }

            // Find a good breaking point (period, newline, or space)
            let breakIndex = remainingText.lastIndexOf('. ', maxLength);
            if (breakIndex === -1) breakIndex = remainingText.lastIndexOf('\n', maxLength);
            if (breakIndex === -1) breakIndex = remainingText.lastIndexOf(' ', maxLength);
            if (breakIndex === -1) breakIndex = maxLength;

            chunks.push(remainingText.substring(0, breakIndex + 1).trim());
            remainingText = remainingText.substring(breakIndex + 1).trim();
        }

        return chunks;
    }

    /**
     * Estimate synthesis duration
     */
    estimateDuration(text: string, wordsPerMinute: number = 150): number {
        const words = text.split(/\s+/).length;
        const minutes = words / wordsPerMinute;
        return Math.ceil(minutes * 60); // Return in seconds
    }

    /**
     * Calculate synthesis cost (if applicable)
     */
    calculateCost(text: string, pricePerCharacter: number = 0.000016): number {
        return text.length * pricePerCharacter;
    }

    /**
     * Validate text for synthesis
     */
    validateText(text: string): { valid: boolean; error?: string } {
        if (!text || text.trim().length === 0) {
            return { valid: false, error: 'Text cannot be empty' };
        }

        // Backend limit is 5000 characters
        if (text.length > 5000) {
            return { valid: false, error: `Text is too long (max 5000 characters). Current length: ${text.length}` };
        }

        return { valid: true };
    }
}

export const ttsService = new TTSService();
export default ttsService;
