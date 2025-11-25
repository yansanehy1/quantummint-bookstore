/**
 * TTS Service: Handles text-to-speech generation and playback
 * Uses Web Speech API with fallback to backend TTS service
 */
export interface TTSOptions {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
    lang?: string;
}
export interface AudioSegment {
    id: string;
    text: string;
    audioUrl?: string;
    duration?: number;
    blob?: Blob;
}
declare class TTSService {
    private synth;
    private isSupported;
    private currentUtterance;
    private audioCache;
    private defaultOptions;
    constructor();
    /**
     * Check if TTS is supported in the browser
     */
    isAvailable(): boolean;
    /**
     * Get available voices
     */
    getAvailableVoices(): SpeechSynthesisVoice[];
    /**
     * Speak text using Web Speech API
     */
    speak(text: string, options?: TTSOptions, onEnd?: () => void, onStart?: () => void): void;
    /**
     * Pause current speech
     */
    pause(): void;
    /**
     * Resume paused speech
     */
    resume(): void;
    /**
     * Stop current speech
     */
    stop(): void;
    /**
     * Check if currently speaking
     */
    isSpeaking(): boolean;
    /**
     * Generate audio blob from text (requires backend support)
     */
    generateAudio(text: string, options?: TTSOptions): Promise<AudioSegment>;
    /**
     * Clear audio cache
     */
    clearCache(): void;
    /**
     * Get cache statistics
     */
    getCacheStats(): {
        size: number;
        entries: number;
    };
}
export declare const ttsService: TTSService;
/**
 * Utility: Create audio context for advanced audio processing
 */
export declare function createAudioContext(): AudioContext | null;
/**
 * Utility: Calculate audio duration from blob
 */
export declare function getAudioDuration(blob: Blob): Promise<number>;
export {};
