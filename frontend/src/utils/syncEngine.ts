
export type CueType = 'visual' | 'formula' | 'step';

export interface Cue {
  type: CueType;
  atMs: number;
  payload: any;
}

interface SyncEngineOptions {
  audio: HTMLAudioElement;
  cues: Cue[];
  onCue: (cue: Cue) => void;
}

export class SyncEngine {
  private audio: HTMLAudioElement;
  private cues: Cue[];
  private fired = new Set<number>();
  private rafId = 0;
  private onCue: (cue: Cue) => void;

  constructor(opts: SyncEngineOptions) {
    this.audio = opts.audio;
    // Sort cues by time for reliable firing order
    this.cues = (opts.cues ?? []).sort((a, b) => a.atMs - b.atMs);
    this.onCue = opts.onCue;
    
    this.loop = this.loop.bind(this);
    
    this.audio.addEventListener('play', () => this.start());
    this.audio.addEventListener('pause', () => this.stop());
    this.audio.addEventListener('seeked', () => this.resetFrom(this.audio.currentTime * 1000));
    // Ensure we catch the end to stop the loop
    this.audio.addEventListener('ended', () => this.stop());
  }

  private loop() {
    if (!this.audio) return;
    
    const t = Math.floor(this.audio.currentTime * 1000);
    
    for (let i = 0; i < this.cues.length; i++) {
      const cue = this.cues[i];
      // Fire cue if time is reached/passed AND it hasn't been fired yet
      if (t >= cue.atMs && !this.fired.has(i)) {
        this.fired.add(i);
        this.onCue(cue);
      }
    }
    this.rafId = requestAnimationFrame(this.loop);
  }

  start() { 
    this.stop(); 
    this.rafId = requestAnimationFrame(this.loop); 
  }

  stop() { 
    if (this.rafId) cancelAnimationFrame(this.rafId); 
  }

  resetFrom(ms: number) {
    this.fired.clear();
    // Mark all cues before the new time as "fired" so they don't re-trigger immediately
    // unless we want to "replay" the state, which is handled by the consumer logic usually.
    // However, for immediate state restoration (like showing the current slide), 
    // the consumer should probably handle the "last valid state".
    // Here we just ensure we don't refire old events as "new".
    for (let i = 0; i < this.cues.length; i++) {
      if (this.cues[i].atMs < ms) this.fired.add(i);
    }
  }

  dispose() { 
    this.stop();
    // Clean up listeners if necessary, though simpler in this scope
  }
}
