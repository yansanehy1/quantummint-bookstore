type AnalyticsEvent = {
    timestamp: number;
    userId?: string;
    bookId: string;
    chapterId: string;
    eventType: 'cue_trigger' | 'mode_switch' | 'step_navigate' | 'session_start' | 'session_end';
    data: any;
};

import { API_BASE_URL } from './api';

const ANALYTICS_ENDPOINT = import.meta.env.VITE_ANALYTICS_URL || `${API_BASE_URL.replace('/api', '')}/analytics/events`;

class AnalyticsTracker {
    private events: AnalyticsEvent[] = [];
    private sessionStart: number = 0;
    private currentBookId: string = '';
    private currentChapterId: string = '';
    private userId?: string;

    startSession(bookId: string, chapterId: string, userId?: string) {
        this.sessionStart = Date.now();
        this.currentBookId = bookId;
        this.currentChapterId = chapterId;
        this.userId = userId;

        this.track('session_start', {
            bookId,
            chapterId
        });
    }

    endSession() {
        const duration = Date.now() - this.sessionStart;
        this.track('session_end', {
            duration,
            eventsCount: this.events.length
        });

        this.flush();
    }

    trackCueTrigger(cueType: string, cueIndex: number, mode: 'auto' | 'manual', timeMs: number) {
        this.track('cue_trigger', {
            cueType,
            cueIndex,
            mode,
            timeMs,
            timeSinceStart: Date.now() - this.sessionStart
        });
    }

    trackModeSwitch(from: 'auto' | 'manual', to: 'auto' | 'manual') {
        this.track('mode_switch', {
            from,
            to,
            timeSinceStart: Date.now() - this.sessionStart
        });
    }

    trackStepNavigate(direction: 'next' | 'previous', stepIndex: number) {
        this.track('step_navigate', {
            direction,
            stepIndex,
            timeSinceStart: Date.now() - this.sessionStart
        });
    }

    private track(eventType: AnalyticsEvent['eventType'], data: any) {
        this.events.push({
            timestamp: Date.now(),
            userId: this.userId,
            bookId: this.currentBookId,
            chapterId: this.currentChapterId,
            eventType,
            data
        });

        // Auto-flush every 10 events
        if (this.events.length >= 10) {
            this.flush();
        }
    }

    private async flush() {
        if (this.events.length === 0) return;

        const batch = [...this.events];
        this.events = [];

        try {
            await fetch(ANALYTICS_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ events: batch })
            });
        } catch (err) {
            console.error('Failed to send analytics:', err);
            // Re-add failed events
            this.events.push(...batch);
        }
    }

    getStats() {
        const cueEvents = this.events.filter(e => e.eventType === 'cue_trigger');
        const manualTriggers = cueEvents.filter(e => e.data.mode === 'manual').length;
        const autoTriggers = cueEvents.filter(e => e.data.mode === 'auto').length;

        return {
            totalEvents: this.events.length,
            cueTriggers: cueEvents.length,
            manualTriggers,
            autoTriggers,
            sessionDuration: Date.now() - this.sessionStart
        };
    }
}

export const analytics = new AnalyticsTracker();
