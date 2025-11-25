"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChargePerMinute = getChargePerMinute;
exports.calculateMinuteCharge = calculateMinuteCharge;
exports.initializeChargeState = initializeChargeState;
exports.processMinuteCharge = processMinuteCharge;
exports.pauseSession = pauseSession;
exports.resumeSession = resumeSession;
exports.completeSession = completeSession;
exports.terminateSession = terminateSession;
exports.getBalanceWarning = getBalanceWarning;
exports.getSessionSummary = getSessionSummary;
const HOURLY_RATES = {
    JSS: 1,
    SSS: 2,
    OTHER: 2.5,
};
function getChargePerMinute(bookLevel) {
    const hourly = HOURLY_RATES[bookLevel] ?? HOURLY_RATES.OTHER;
    return parseFloat((hourly / 60).toFixed(4));
}
function calculateMinuteCharge(minutes, chargePerMinute) {
    return parseFloat((minutes * chargePerMinute).toFixed(2));
}
function initializeChargeState(userId, bookId, bookTitle, bookLevel, sessionType, startingBalance) {
    const sessionId = `rt-session-${Date.now()}`;
    const chargePerMinute = getChargePerMinute(bookLevel);
    return {
        sessionId,
        userId,
        bookId,
        bookTitle,
        bookLevel,
        sessionType,
        minutesElapsed: 0,
        chargePerMinute,
        totalCharged: 0,
        currentBalance: startingBalance,
        status: "active",
        transactions: [],
    };
}
function processMinuteCharge(state, newMinutesElapsed) {
    if (state.status !== "active")
        return state;
    const minutesDelta = Math.max(0, newMinutesElapsed - state.minutesElapsed);
    if (minutesDelta === 0)
        return state;
    const additionalCharge = calculateMinuteCharge(minutesDelta, state.chargePerMinute);
    const newTotalCharged = parseFloat((state.totalCharged + additionalCharge).toFixed(2));
    const newBalance = parseFloat((state.currentBalance - additionalCharge).toFixed(2));
    const tx = {
        id: `${state.sessionId}-m${newMinutesElapsed}`,
        type: "charge",
        amount: additionalCharge,
        description: `Minute ${newMinutesElapsed} charge`,
        at: new Date(),
    };
    if (newBalance < 0) {
        // Balance depleted at or before this minute
        return {
            ...state,
            minutesElapsed: newMinutesElapsed,
            totalCharged: newTotalCharged,
            currentBalance: newBalance,
            status: "terminated",
            transactions: [...state.transactions, tx],
        };
    }
    return {
        ...state,
        minutesElapsed: newMinutesElapsed,
        totalCharged: newTotalCharged,
        currentBalance: newBalance,
        transactions: [...state.transactions, tx],
    };
}
function pauseSession(state) {
    if (state.status !== "active")
        return state;
    return { ...state, status: "paused" };
}
function resumeSession(state) {
    if (state.status !== "paused")
        return state;
    return { ...state, status: "active" };
}
function completeSession(state) {
    if (state.status === "completed" || state.status === "terminated")
        return state;
    return { ...state, status: "completed" };
}
function terminateSession(state) {
    if (state.status === "terminated")
        return state;
    return { ...state, status: "terminated" };
}
function getBalanceWarning(currentBalance, chargePerMinute) {
    if (currentBalance <= 0)
        return "Insufficient balance to continue.";
    const tenMinutesCost = chargePerMinute * 10;
    if (currentBalance < chargePerMinute)
        return "Your balance will not cover the next minute.";
    if (currentBalance < tenMinutesCost)
        return "Low balance: less than ~10 minutes remaining.";
    return null;
}
function formatDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h && m)
        return `${h}h ${m}m`;
    if (h)
        return `${h}h`;
    return `${m}m`;
}
function getSessionSummary(state) {
    return {
        duration: formatDuration(state.minutesElapsed),
        totalCharged: state.totalCharged.toFixed(2),
        remainingBalance: state.currentBalance.toFixed(2),
        transactionCount: state.transactions.length,
        minutesElapsed: state.minutesElapsed,
    };
}
