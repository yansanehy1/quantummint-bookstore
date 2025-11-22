/**
 * TTS Service: Handles text-to-speech generation and playback
 * Uses Web Speech API with fallback to backend TTS service
 */

export interface TTSOptions {
  rate?: number; // 0.5 to 2.0
  pitch?: number; // 0.5 to 2.0
  volume?: number; // 0 to 1
  voice?: string; // voice name
  lang?: string; // language code (e.g., "en-US")
}

export interface AudioSegment {
  id: string;
  text: string;
  audioUrl?: string;
  duration?: number;
  blob?: Blob;
}

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private isSupported: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCache: Map<string, AudioSegment> = new Map();
  private defaultOptions: TTSOptions = {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    lang: "en-US",
  };

  constructor() {
    // Check Web Speech API support
    const speechSynthesis =
      window.speechSynthesis ||
      (window as any).webkitSpeechSynthesis ||
      (window as any).mozSpeechSynthesis;

    if (speechSynthesis) {
      this.synth = speechSynthesis;
      this.isSupported = true;
    }
  }

  /**
   * Check if TTS is supported in the browser
   */
  isAvailable(): boolean {
    return this.isSupported;
  }

  /**
   * Get available voices
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  /**
   * Speak text using Web Speech API
   */
  speak(
    text: string,
    options: TTSOptions = {},
    onEnd?: () => void,
    onStart?: () => void
  ): void {
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
  pause(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synth?.speaking || false;
  }

  /**
   * Generate audio blob from text (requires backend support)
   */
  async generateAudio(
    text: string,
    options: TTSOptions = {}
  ): Promise<AudioSegment> {
    const cacheKey = `${text}-${JSON.stringify(options)}`;

    // Check cache
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey)!;
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

      const segment: AudioSegment = {
        id: `audio-${Date.now()}`,
        text,
        audioUrl,
        blob,
      };

      // Cache the result
      this.audioCache.set(cacheKey, segment);

      return segment;
    } catch (error) {
      console.error("Audio generation error:", error);
      throw error;
    }
  }

  /**
   * Clear audio cache
   */
  clearCache(): void {
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
  getCacheStats(): { size: number; entries: number } {
    return {
      size: this.audioCache.size,
      entries: this.audioCache.size,
    };
  }
}

// Export singleton instance
export const ttsService = new TTSService();

/**
 * Utility: Create audio context for advanced audio processing
 */
export function createAudioContext(): AudioContext | null {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return null;
  return new AudioContext();
}

/**
 * Utility: Calculate audio duration from blob
 */
export async function getAudioDuration(blob: Blob): Promise<number> {
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
