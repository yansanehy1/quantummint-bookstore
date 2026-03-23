// Service Index
// Central export point for all services

import { authService } from './authService';
import * as paymentService from './paymentService';
import { subscriptionService } from './subscriptionService';
import { ttsService } from './ttsService';
import { usageTrackingService } from './usageTrackingService';
import { libraryService } from './libraryService';
import { earningsService } from './earningsService';
import { analyticsService } from './analyticsService';
import { bookUpdateNotificationService, notifyBookUpdate, registerAsActiveReader } from './bookUpdateNotificationService';

export {
    authService,
    paymentService,
    subscriptionService,
    ttsService,
    usageTrackingService,
    libraryService,
    earningsService,
    analyticsService,
    bookUpdateNotificationService,
    notifyBookUpdate,
    registerAsActiveReader
};

export default {
    auth: authService,
    payment: paymentService,
    subscription: subscriptionService,
    tts: ttsService,
    usageTracking: usageTrackingService,
    library: libraryService,
    earnings: earningsService,
    analytics: analyticsService,
    notifications: bookUpdateNotificationService,
};
