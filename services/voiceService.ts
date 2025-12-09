import { VoiceProfile } from '../types';

export class VoiceService {
    static getAvailableVoices(): VoiceProfile[] {
        return [
            {
                id: 'voice-kore',
                name: 'Kore',
                accent: 'Sierra Leonean',
                gender: 'female',
                language: 'en-SL',
                sampleUrl: '/audio/samples/kore.mp3'
            },
            {
                id: 'voice-amara',
                name: 'Amara',
                accent: 'Nigerian',
                gender: 'female',
                language: 'en-NG',
                sampleUrl: '/audio/samples/amara.mp3'
            },
            {
                id: 'voice-james',
                name: 'James',
                accent: 'British',
                gender: 'male',
                language: 'en-GB',
                sampleUrl: '/audio/samples/james.mp3'
            },
            {
                id: 'voice-sarah',
                name: 'Sarah',
                accent: 'American',
                gender: 'female',
                language: 'en-US',
                sampleUrl: '/audio/samples/sarah.mp3'
            }
        ];
    }

    static getVoiceById(id: string): VoiceProfile | undefined {
        return this.getAvailableVoices().find(v => v.id === id);
    }
}
