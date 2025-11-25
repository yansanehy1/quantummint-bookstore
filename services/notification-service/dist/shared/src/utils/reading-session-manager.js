"use strict";
/**
 * Reading Session Manager
 * Handles pay-per-use reading/listening sessions with automatic charging
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPricePerHour = getPricePerHour;
exports.calculateCharge = calculateCharge;
exports.getSessionChargeInfo = getSessionChargeInfo;
exports.formatTime = formatTime;
exports.getBalanceWarning = getBalanceWarning;
exports.estimateReadingTime = estimateReadingTime;
exports.createReadingSession = createReadingSession;
exports.updateSessionTime = updateSessionTime;
exports.pauseSession = pauseSession;
exports.resumeSession = resumeSession;
exports.completeSession = completeSession;
exports.terminateSession = terminateSession;
// Pricing per hour in leones
const PRICING = {
    JSS: 1,
    SSS: 2,
    OTHER: 2.5,
};
/**
 * Get pricing for a book level
 * @param bookLevel - The level of the book (JSS, SSS, or OTHER)
 * @returns The price per hour in leones
 */
function getPricePerHour(bookLevel) {
    return PRICING[bookLevel] || PRICING.OTHER;
}
/**
 * Calculate charge based on minutes spent
 * @param minutesSpent - Total minutes spent in the session
 * @param pricePerHour - Hourly rate in leones
 * @returns The calculated charge amount
 */
function calculateCharge(minutesSpent, pricePerHour) {
    const hours = minutesSpent / 60;
    const charge = parseFloat((hours * pricePerHour).toFixed(2));
    return Math.max(charge, 0);
}
/**
 * Get session charge info
 * @param minutesSpent - Total minutes spent in the session
 * @param bookLevel - The level of the book
 * @returns Session charge information including minutes, rate, amount and warning threshold
 */
function getSessionChargeInfo(minutesSpent, bookLevel) {
    const hourlyRate = getPricePerHour(bookLevel);
    const chargeAmount = calculateCharge(minutesSpent, hourlyRate);
    const warningThreshold = hourlyRate * 0.8; // Warn at 80% of hourly rate
    return {
        minutesSpent,
        hourlyRate,
        chargeAmount,
        warningThreshold,
    };
}
/**
 * Format time for display
 * @param minutes - Number of minutes to format
 * @returns Formatted time string (e.g., "2h 30m" or "45m")
 */
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
        return `${mins}m`;
    }
    if (mins === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${mins}m`;
}
/**
 * Get warning message based on balance and session cost
 * @param userBalance - Current user's balance in leones
 * @param sessionCharge - Current session charge
 * @param bookLevel - The level of the book
 * @returns Warning message or null if no warning needed
 */
function getBalanceWarning(userBalance, sessionCharge, bookLevel) {
    const hourlyRate = getPricePerHour(bookLevel);
    if (userBalance < sessionCharge) {
        return `Insufficient balance. You need ${(sessionCharge - userBalance).toFixed(2)} leones more to continue.`;
    }
    if (userBalance < hourlyRate * 2) {
        return `Low balance warning: You have only ${userBalance.toFixed(2)} leones remaining.`;
    }
    return null;
}
/**
 * Estimate reading time based on balance
 * @param userBalance - Current user's balance in leones
 * @param bookLevel - The level of the book
 * @returns Estimated reading time in minutes
 */
function estimateReadingTime(userBalance, bookLevel) {
    const hourlyRate = getPricePerHour(bookLevel);
    const estimatedHours = userBalance / hourlyRate;
    return Math.floor(estimatedHours * 60); // Return in minutes
}
/**
 * Create a new reading session
 * @param userId - ID of the user starting the session
 * @param bookId - ID of the book being read/listened to
 * @param bookTitle - Title of the book
 * @param bookLevel - Level of the book (JSS, SSS, OTHER)
 * @param sessionType - Type of session (reading or listening)
 * @returns New reading session object
 */
function createReadingSession(userId, bookId, bookTitle, bookLevel, sessionType) {
    const pricePerHour = getPricePerHour(bookLevel);
    return {
        id: `session-${Date.now()}`,
        userId,
        bookId,
        bookTitle,
        bookLevel,
        sessionType,
        startTime: new Date(),
        totalMinutesSpent: 0,
        pricePerHour,
        totalCharged: 0,
        status: "active",
    };
}
/**
 * Update session with elapsed time
 * @param session - Current session object
 * @param elapsedMinutes - Total minutes elapsed
 * @returns Updated session object with new time and charges
 */
function updateSessionTime(session, elapsedMinutes) {
    const newSession = { ...session };
    newSession.totalMinutesSpent = elapsedMinutes;
    newSession.totalCharged = calculateCharge(elapsedMinutes, session.pricePerHour);
    return newSession;
}
/**
 * Pause session
 * @param session - Current session object
 * @returns Updated session object with paused status
 */
function pauseSession(session) {
    return {
        ...session,
        status: "paused",
        pausedAt: new Date(),
    };
}
/**
 * Resume session
 * @param session - Current session object
 * @returns Updated session object with active status
 */
function resumeSession(session) {
    return {
        ...session,
        status: "active",
        pausedAt: undefined,
    };
}
/**
 * Complete session
 * @param session - Current session object
 * @returns Updated session object with completed status
 */
function completeSession(session) {
    return {
        ...session,
        status: "completed",
    };
}
/**
 * Terminate session (due to insufficient balance)
 * @param session - Current session object
 * @returns Updated session object with terminated status
 */
function terminateSession(session) {
    return {
        ...session,
        status: "terminated",
    };
}
