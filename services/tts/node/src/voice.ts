export type VoiceProfile = {
    id: string;
    basePitchHz: number;       // fundamental frequency
    formants: { [phoneme: string]: number[] }; // F1,F2,F3 per vowel; consonants use noise/occlusion params
    breathiness: number;       // 0..1
    tenseness: number;         // 0..1 (glottal)
    speedScale: number;        // global timing
};

// Default "neutral" profile
export const DefaultVoice: VoiceProfile = {
    id: 'default',
    basePitchHz: 140,
    breathiness: 0.2,
    tenseness: 0.6,
    speedScale: 1.0,
    formants: {
        AE: [700, 1700, 2500], AH: [750, 1400, 2400], AO: [600, 1000, 2400],
        EH: [600, 1900, 2500], ER: [500, 1500, 2000], IH: [450, 2100, 2700], IY: [300, 2300, 3000],
        OW: [400, 800, 2400], UH: [400, 1300, 2500], UW: [300, 900, 2200]
    }
};

// Storage for registered voice profiles
export const voices: Record<string, VoiceProfile> = {
    [DefaultVoice.id]: DefaultVoice
};

// Register a custom voice profile (called by voice-profile-service integration)
// WARNING: In production, this should validate the profile and check caller authorization
export function registerVoice(profile: VoiceProfile) {
    if (!profile.id || !/^[a-zA-Z0-9_-]+$/.test(profile.id)) {
        throw new Error('Invalid voice ID format');
    }
    if (typeof profile.basePitchHz !== 'number' || profile.basePitchHz <= 0) {
        throw new Error('Invalid basePitchHz');
    }
    voices[profile.id] = profile;
}
