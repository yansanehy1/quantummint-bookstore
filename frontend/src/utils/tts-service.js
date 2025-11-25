"use strict";
/**
 * TTS Service: Handles text-to-speech generation and playback
 * Uses Web Speech API with fallback to backend TTS service
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ttsService = void 0;
exports.createAudioContext = createAudioContext;
exports.getAudioDuration = getAudioDuration;
class TTSService {
    constructor() {
        this.synth = null;
        this.isSupported = false;
        this.currentUtterance = null;
        this.audioCache = new Map();
        this.defaultOptions = {
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            lang: "en-US",
        };
        // Check Web Speech API support
        const speechSynthesis = window.speechSynthesis ||
            window.webkitSpeechSynthesis ||
            window.mozSpeechSynthesis;
        if (speechSynthesis) {
            this.synth = speechSynthesis;
            this.isSupported = true;
        }
    }
    /**
     * Check if TTS is supported in the browser
     */
    isAvailable() {
        return this.isSupported;
    }
    /**
     * Get available voices
     */
    getAvailableVoices() {
        if (!this.synth)
            return [];
        return this.synth.getVoices();
    }
    /**
     * Speak text using Web Speech API
     */
    speak(text, options = {}, onEnd, onStart) {
        if (!this.synth) {
            console.error("TTS not supported");
            return;
        }
        // Cancel any ongoing speech
        this.synth.cancel();
        const opts = { ...this.defaultOptions, ...options };
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = opts.rate || 1.0;
        utterance.pitch = opts.pitch || 1.0;
        utterance.volume = opts.volume || 1.0;
        utterance.lang = opts.lang || "en-US";
        // Set voice if specified
        if (opts.voice) {
            const voices = this.getAvailableVoices();
            const selectedVoice = voices.find((v) => v.name === opts.voice);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
        }
        utterance.onstart = () => {
            onStart?.();
        };
        utterance.onend = () => {
            onEnd?.();
        };
        utterance.onerror = (event) => {
            // Some browsers expose different error properties
            // Log gracefully
            // @ts-ignore
            console.error("TTS error:", event?.error ?? event);
        };
        this.currentUtterance = utterance;
        this.synth.speak(utterance);
    }
    /**
     * Pause current speech
     */
    pause() {
        if (this.synth && this.synth.speaking) {
            this.synth.pause();
        }
    }
    /**
     * Resume paused speech
     */
    resume() {
        if (this.synth && this.synth.paused) {
            this.synth.resume();
        }
    }
    /**
     * Stop current speech
     */
    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
    }
    /**
     * Check if currently speaking
     */
    isSpeaking() {
        return this.synth?.speaking || false;
    }
    /**
     * Generate audio blob from text (requires backend support)
     */
    async generateAudio(text, options = {}) {
        const cacheKey = `${text}-${JSON.stringify(options)}`;
        // Check cache
        if (this.audioCache.has(cacheKey)) {
            return this.audioCache.get(cacheKey);
        }
        try {
            // Call backend TTS service
            const response = await fetch("/api/tts/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, options }),
            });
            if (!response.ok) {
                throw new Error(`TTS generation failed: ${response.statusText}`);
            }
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            const segment = {
                id: `audio-${Date.now()}`,
                text,
                audioUrl,
                blob,
            };
            // Cache the result
            this.audioCache.set(cacheKey, segment);
            return segment;
        }
        catch (error) {
            console.error("Audio generation error:", error);
            throw error;
        }
    }
    /**
     * Clear audio cache
     */
    clearCache() {
        this.audioCache.forEach((segment) => {
            if (segment.audioUrl) {
                URL.revokeObjectURL(segment.audioUrl);
            }
        });
        this.audioCache.clear();
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.audioCache.size,
            entries: this.audioCache.size,
        };
    }
}
// Export singleton instance
exports.ttsService = new TTSService();
/**
 * Utility: Create audio context for advanced audio processing
 */
function createAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext)
        return null;
    return new AudioContext();
}
/**
 * Utility: Calculate audio duration from blob
 */
async function getAudioDuration(blob) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio();
        audio.onloadedmetadata = () => {
            URL.revokeObjectURL(url);
            resolve(audio.duration);
        };
        audio.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load audio"));
        };
        audio.src = url;
    });
}
