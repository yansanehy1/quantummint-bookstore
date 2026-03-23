import { analytics } from '../utils/analytics';

type Cue = { type: 'visual' | 'formula' | 'step'; atMs: number; payload: any };

export class SyncEngine {
    private raf: number | null = null;
    private startTime: number = 0;
    private audioElement: HTMLAudioElement | null = null;
    private manualMode: boolean = false;
    private currentStepIndex: number = 0;
    private stepCues: Cue[] = [];
    private firedCues = new Set<number>();

    constructor(
        private cues: Cue[],
        private onCue: (cue: Cue) => void,
        private onStepChange?: (index: number, total: number) => void
    ) {
        // Extract step cues for manual control
        this.stepCues = cues.filter(c => c.type === 'step');
    }

    setAudio(audio: HTMLAudioElement) {
        this.audioElement = audio;
    }

    setManualMode(manual: boolean) {
        const previousMode = this.manualMode;
        this.manualMode = manual;

        if (manual) {
            this.currentStepIndex = 0;
            this.onStepChange?.(0, this.stepCues.length);
        }

        // Track mode switch
        if (previousMode !== manual) {
            analytics.trackModeSwitch(
                previousMode ? 'manual' : 'auto',
                manual ? 'manual' : 'auto'
            );
        }
    }

    nextStep() {
        if (!this.manualMode || this.currentStepIndex >= this.stepCues.length) return;

        const cue = this.stepCues[this.currentStepIndex];
        this.onCue(cue);

        // Track navigation
        analytics.trackStepNavigate('next', this.currentStepIndex);
        analytics.trackCueTrigger(cue.type, this.currentStepIndex, 'manual', cue.atMs);

        this.currentStepIndex++;
        this.onStepChange?.(this.currentStepIndex, this.stepCues.length);
    }

    previousStep() {
        if (!this.manualMode || this.currentStepIndex <= 0) return;

        this.currentStepIndex--;
        const cue = this.stepCues[this.currentStepIndex];
        this.onCue(cue);

        // Track navigation
        analytics.trackStepNavigate('previous', this.currentStepIndex);

        this.onStepChange?.(this.currentStepIndex, this.stepCues.length);
    }

    play() {
        this.startTime = Date.now();
        this.audioElement?.play();
        this.tick();
    }

    pause() {
        this.audioElement?.pause();
        if (this.raf) {
            cancelAnimationFrame(this.raf);
            this.raf = null;
        }
    }

    private tick = () => {
        const elapsed = Date.now() - this.startTime;

        for (let i = 0; i < this.cues.length; i++) {
            const cue = this.cues[i];

            // Skip step cues in manual mode
            if (this.manualMode && cue.type === 'step') continue;

            // Check if cue should fire
            if (Math.abs(cue.atMs - elapsed) < 100 && !this.firedCues.has(i)) {
                this.firedCues.add(i);
                this.onCue(cue);

                // Track auto-triggered cue
                analytics.trackCueTrigger(cue.type, i, 'auto', cue.atMs);
            }
        }

        this.raf = requestAnimationFrame(this.tick);
    };

    stop() {
        this.pause();
        this.audioElement && (this.audioElement.currentTime = 0);
        this.currentStepIndex = 0;
        this.firedCues.clear();
    }
}
