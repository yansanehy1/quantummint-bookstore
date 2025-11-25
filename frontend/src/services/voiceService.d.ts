import { VoiceProfile } from '../types';
export declare class VoiceService {
    private static STORAGE_KEY;
    /**
     * Retrieves all available voices (Premade + Cloned)
     */
    static getAvailableVoices(): VoiceProfile[];
    /**
     * Simulates the voice cloning process
     */
    static cloneVoice(name: string, accent: string, samples: File[]): Promise<VoiceProfile>;
    private static getCustomVoices;
    static deleteCustomVoice(id: string): void;
}
