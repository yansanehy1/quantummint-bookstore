import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

type AnalyticsEvent = {
    timestamp: number;
    userId?: string;
    bookId: string;
    chapterId: string;
    eventType: 'cue_trigger' | 'mode_switch' | 'step_navigate' | 'session_start' | 'session_end';
    data: any;
};

// In-memory storage (replace with database in production)
const events: AnalyticsEvent[] = [];

app.post('/analytics/events', (req, res) => {
    const { events: batch } = req.body;

    if (!Array.isArray(batch)) {
        return res.status(400).json({ error: 'events must be an array' });
    }

    events.push(...batch);

    console.log(`Received ${batch.length} events. Total: ${events.length}`);

    res.json({ success: true, received: batch.length, total: events.length });
});

app.get('/analytics/report/:bookId/:chapterId', (req, res) => {
    const { bookId, chapterId } = req.params;

    const filtered = events.filter(e =>
        e.bookId === bookId && e.chapterId === chapterId
    );

    const stats = {
        totalEvents: filtered.length,
        uniqueUsers: new Set(filtered.map(e => e.userId)).size,
        eventTypes: {} as Record<string, number>,
        modePreference: {
            auto: 0,
            manual: 0
        },
        averageSessionDuration: 0,
        completionRate: 0
    };

    // Count event types
    filtered.forEach(e => {
        stats.eventTypes[e.eventType] = (stats.eventTypes[e.eventType] || 0) + 1;
    });

    // Mode preference
    const cueTriggers = filtered.filter(e => e.eventType === 'cue_trigger');
    stats.modePreference.auto = cueTriggers.filter(e => e.data.mode === 'auto').length;
    stats.modePreference.manual = cueTriggers.filter(e => e.data.mode === 'manual').length;

    // Session duration
    const sessions = filtered.filter(e => e.eventType === 'session_end');
    if (sessions.length > 0) {
        stats.averageSessionDuration = sessions.reduce((sum, e) => sum + (e.data.duration || 0), 0) / sessions.length;
    }

    res.json(stats);
});

app.get('/analytics/events', (req, res) => {
    const limit = parseInt(req.query.limit as string) || 100;
    res.json({ events: events.slice(-limit), total: events.length });
});

app.listen(7006, () => console.log('Analytics service on :7006'));
