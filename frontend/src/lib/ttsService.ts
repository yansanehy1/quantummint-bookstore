export type TTSOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
  lang?: string;
};

function isClient() {
  return typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';
}

function getVoicesSafe(): SpeechSynthesisVoice[] {
  if (!isClient()) return [];
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  // Some browsers load voices asynchronously
  if (voices.length === 0) {
    // Trigger async load
    synth.getVoices();
  }
  return voices;
}

export const ttsService = {
  isAvailable(): boolean {
    return isClient();
  },

  getAvailableVoices(): { name: string; lang: string }[] {
    return getVoicesSafe().map(v => ({ name: v.name, lang: v.lang }));
  },

  speak(text: string, options: TTSOptions = {}, onend?: () => void, onstart?: () => void) {
    if (!isClient()) return;
    const synth = window.speechSynthesis;
    this.stop();

    const utter = new SpeechSynthesisUtterance(text);
    if (options.lang) utter.lang = options.lang;
    if (typeof options.rate === 'number') utter.rate = options.rate;
    if (typeof options.pitch === 'number') utter.pitch = options.pitch;
    if (typeof options.volume === 'number') utter.volume = options.volume;

    if (options.voice) {
      const voice = getVoicesSafe().find(v => v.name === options.voice);
      if (voice) utter.voice = voice;
    }

    if (onend) utter.onend = () => onend();
    if (onstart) utter.onstart = () => onstart();

    synth.speak(utter);
  },

  pause() {
    if (!isClient()) return;
    const synth = window.speechSynthesis;
    if (!synth.paused) synth.pause();
  },

  stop() {
    if (!isClient()) return;
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending || synth.paused) {
      synth.cancel();
    }
  }
};
