// TTS (Text-to-Speech) Service
// Handles audio synthesis for book chapters

import api from '../utils/api';

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
}

import type { VoiceClone, VoiceUploadResponse } from '../types';

class TTSService {
    private availableVoices: Voice[] = [];

    /**
     * Synthesize chapter text to audio
     */
    async synthesizeChapter(
        chapterText: string,
        options: SynthesisOptions = {}
    ): Promise<{ audioUrl: string; duration: number }> {
        try {
            const result = await api.tts.synthesizeChapter(chapterText, options.voice);

            console.log(`Synthesized ${chapterText.length} characters`);

            return result;
        } catch (error) {
            console.error('TTS synthesis failed:', error);
            throw error;
        }
    }

    /**
     * Get available voices
     */
    async getVoices(): Promise<Voice[]> {
        try {
            if (this.availableVoices.length === 0) {
                this.availableVoices = await api.tts.getVoices();
            }
            return this.availableVoices;
        } catch (error) {
            console.error('Failed to get voices:', error);
            throw error;
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
     * Batch synthesize multiple chapters
     */
    async synthesizeMultiple(
        chapters: Array<{ id: string; text: string }>,
        options: SynthesisOptions = {},
        onProgress?: (completed: number, total: number) => void
    ): Promise<Array<{ id: string; audioUrl: string; duration: number }>> {
        const results = [];

        for (let i = 0; i < chapters.length; i++) {
            const chapter = chapters[i];

            try {
                const result = await this.synthesizeChapter(chapter.text, options);
                results.push({
                    id: chapter.id,
                    ...result
                });

                if (onProgress) {
                    onProgress(i + 1, chapters.length);
                }
            } catch (error) {
                console.error(`Failed to synthesize chapter ${chapter.id}:`, error);
                throw error;
            }
        }

        return results;
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
            // Mock implementation for now, replacing the internal mock in VoiceCloning.tsx
            // In a real implementation, this would use api.post with FormData

            /* 
            const formData = new FormData();
            formData.append('audio', voiceData.audioBlob);
            formData.append('name', voiceData.name);
            if (voiceData.description) formData.append('description', voiceData.description);
            
            const response = await fetch(`${import.meta.env.VITE_TTS_SERVICE_URL}/voices/clone`, {
                method: 'POST',
                // Headers are handled by browser for FormData (multipart/form-data)
                body: formData
            });
            return response.json();
            */

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        voiceId: `voice_clone_${Date.now()}`,
                        status: 'processing',
                        message: 'Voice clone is being processed successfully.'
                    });
                }, 2000);
            });

        } catch (error) {
            console.error('Voice cloning failed:', error);
            throw error;
        }
    }

    /**
     * Validate text for synthesis
     */
    validateText(text: string): { valid: boolean; error?: string } {
        if (!text || text.trim().length === 0) {
            return { valid: false, error: 'Text cannot be empty' };
        }

        if (text.length > 100000) {
            return { valid: false, error: 'Text is too long (max 100,000 characters)' };
        }

        return { valid: true };
    }
}

export const ttsService = new TTSService();
export default ttsService;
