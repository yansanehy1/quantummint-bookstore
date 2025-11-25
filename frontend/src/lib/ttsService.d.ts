export type TTSOptions = {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
    lang?: string;
};
export declare const ttsService: {
    isAvailable(): boolean;
    getAvailableVoices(): {
        name: string;
        lang: string;
    }[];
    speak(text: string, options?: TTSOptions, onend?: () => void, onstart?: () => void): void;
    pause(): void;
    stop(): void;
};
