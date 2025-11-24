import { VoiceProfile } from './types';

export const CURRENT_USER = {
    name: 'Demo User',
    id: 'user-1'
};

export const AVAILABLE_ACCENTS = ['American', 'British', 'Australian', 'Indian'];

export const PREMADE_VOICES: VoiceProfile[] = [
    { id: 'voice-kore', name: 'Kore', accent: 'American', gender: 'female', type: 'PREMADE' },
    { id: 'voice-aoede', name: 'Aoede', accent: 'American', gender: 'female', type: 'PREMADE' },
    { id: 'voice-fenrir', name: 'Fenrir', accent: 'American', gender: 'male', type: 'PREMADE' },
    { id: 'voice-puck', name: 'Puck', accent: 'British', gender: 'male', type: 'PREMADE' },
];
