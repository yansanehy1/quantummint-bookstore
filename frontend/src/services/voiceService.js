"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceService = void 0;
const constants_1 = require("../constants");
class VoiceService {
    /**
     * Retrieves all available voices (Premade + Cloned)
     */
    static getAvailableVoices() {
        if (typeof window === 'undefined')
            return constants_1.PREMADE_VOICES;
        const stored = localStorage.getItem(this.STORAGE_KEY);
        const customVoices = stored ? JSON.parse(stored) : [];
        return [...constants_1.PREMADE_VOICES, ...customVoices];
    }
    /**
     * Simulates the voice cloning process
     */
    static async cloneVoice(name, accent, samples) {
        // In a real app, this would upload files to a Python backend or API like ElevenLabs/Google Cloud TTS
        // For this demo, we simulate the processing delay and storage
        // Simulate upload and processing time
        await new Promise(resolve => setTimeout(resolve, 3000));
        const newVoice = {
            id: `cloned-${Date.now()}`,
            name: name,
            type: 'CLONED',
            accent: accent,
            gender: 'female', // Defaulting to female for cloned voices in this demo as gender detection isn't implemented
            // For demo purposes, we don't generate a real preview URL, but in prod this would be a URL to a generated sample
        };
        // Save to local storage
        const currentCustom = this.getCustomVoices();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...currentCustom, newVoice]));
        return newVoice;
    }
    static getCustomVoices() {
        if (typeof window === 'undefined')
            return [];
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    static deleteCustomVoice(id) {
        const current = this.getCustomVoices();
        const updated = current.filter(v => v.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    }
}
exports.VoiceService = VoiceService;
VoiceService.STORAGE_KEY = 'qm_custom_voices';
