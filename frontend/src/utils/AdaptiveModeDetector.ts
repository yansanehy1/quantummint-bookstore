type BehaviorMetrics = {
    pauseCount: number;
    rewindCount: number;
    averagePauseDuration: number;
    stepCompletionRate: number;
    lastPauseTime: number;
};

export class AdaptiveModeDetector {
    private metrics: BehaviorMetrics = {
        pauseCount: 0,
        rewindCount: 0,
        averagePauseDuration: 0,
        stepCompletionRate: 1.0,
        lastPauseTime: 0
    };

    private pauseStartTime: number = 0;
    private totalPauseDuration: number = 0;
    private lastAudioTime: number = 0;
    private stepsCompleted: number = 0;
    private totalSteps: number = 0;

    constructor(totalSteps: number) {
        this.totalSteps = totalSteps;
    }

    onPause() {
        this.metrics.pauseCount++;
        this.pauseStartTime = Date.now();
    }

    onResume() {
        if (this.pauseStartTime > 0) {
            const pauseDuration = Date.now() - this.pauseStartTime;
            this.totalPauseDuration += pauseDuration;
            this.metrics.averagePauseDuration = this.totalPauseDuration / this.metrics.pauseCount;
            this.pauseStartTime = 0;
        }
    }

    onSeek(newTime: number) {
        // Detect rewind (seeking backwards)
        if (newTime < this.lastAudioTime - 500) { // 500ms threshold
            this.metrics.rewindCount++;
        }
        this.lastAudioTime = newTime;
    }

    onStepComplete() {
        this.stepsCompleted++;
        this.metrics.stepCompletionRate = this.stepsCompleted / Math.max(this.totalSteps, 1);
    }

    shouldSuggestManualMode(): boolean {
        // Suggest manual mode if:
        // 1. User pauses frequently (>3 times in short period)
        // 2. Average pause duration is long (>3 seconds)
        // 3. User rewinds often (>2 times)

        const frequentPauses = this.metrics.pauseCount >= 3;
        const longPauses = this.metrics.averagePauseDuration > 3000;
        const frequentRewinds = this.metrics.rewindCount >= 2;

        return (frequentPauses && longPauses) || frequentRewinds;
    }

    shouldSuggestAutoMode(): boolean {
        // Suggest auto mode if:
        // 1. Low pause rate (<2 pauses)
        // 2. High step completion rate (>80%)
        // 3. No rewinds

        const lowPauses = this.metrics.pauseCount < 2;
        const highCompletion = this.metrics.stepCompletionRate > 0.8;
        const noRewinds = this.metrics.rewindCount === 0;

        return lowPauses && highCompletion && noRewinds;
    }

    getRecommendation(): 'manual' | 'auto' | 'none' {
        if (this.shouldSuggestManualMode()) return 'manual';
        if (this.shouldSuggestAutoMode()) return 'auto';
        return 'none';
    }

    getMetrics(): BehaviorMetrics {
        return { ...this.metrics };
    }

    reset() {
        this.metrics = {
            pauseCount: 0,
            rewindCount: 0,
            averagePauseDuration: 0,
            stepCompletionRate: 1.0,
            lastPauseTime: 0
        };
        this.pauseStartTime = 0;
        this.totalPauseDuration = 0;
        this.lastAudioTime = 0;
        this.stepsCompleted = 0;
    }
}
