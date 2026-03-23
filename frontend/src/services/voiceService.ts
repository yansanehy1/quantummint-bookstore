import { VoiceProfile } from '../types';
import { PREMADE_VOICES } from '../constants';

export class VoiceService {
  private static STORAGE_KEY = 'qm_custom_voices';

  /**
   * Retrieves all available voices (Premade + Cloned)
   */
  static getAvailableVoices(): VoiceProfile[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const customVoices: VoiceProfile[] = stored ? JSON.parse(stored) : [];
    return [...PREMADE_VOICES, ...customVoices];
  }

  /**
   * Simulates the voice cloning process
   */
  static async cloneVoice(name: string, accent: string, samples: File[]): Promise<VoiceProfile> {
    // In a real app, this would upload files to a Python backend or API like ElevenLabs/Google Cloud TTS
    // For this demo, we simulate the processing delay and storage
    
    // Simulate upload and processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    const newVoice: VoiceProfile = {
      id: `cloned-${Date.now()}`,
      name: name,
      type: 'CLONED',
      accent: accent,
      // For demo purposes, we don't generate a real preview URL, but in prod this would be a URL to a generated sample
    };

    // Save to local storage
    const currentCustom = this.getCustomVoices();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...currentCustom, newVoice]));
    
    return newVoice;
  }

  private static getCustomVoices(): VoiceProfile[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static deleteCustomVoice(id: string): void {
    const current = this.getCustomVoices();
    const updated = current.filter(v => v.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }
}

