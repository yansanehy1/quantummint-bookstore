"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPricePerHour = getPricePerHour;
exports.estimateReadingTime = estimateReadingTime;
exports.formatTime = formatTime;
exports.calculateCharge = calculateCharge;
exports.getBalanceWarning = getBalanceWarning;
function getPricePerHour(level) {
    switch (level) {
        case "JSS":
            return 1.0;
        case "SSS":
            return 2.0;
        case "beginner":
            return 1.0;
        case "intermediate":
            return 1.5;
        case "advanced":
            return 2.0;
        case "expert":
            return 3.0;
        default:
            return 1.0;
    }
}
function estimateReadingTime(balance, level) {
    const perMinute = getPricePerHour(level) / 60;
    if (perMinute <= 0)
        return 0;
    return Math.floor(balance / perMinute);
}
// Format minutes into human-friendly string like "1h 25m" or "10m"
function formatTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
// Calculate charge for a number of minutes at an hourly rate (L/hour)
function calculateCharge(minutes, hourlyRate) {
    const perMinute = hourlyRate / 60;
    const charge = minutes * perMinute;
    return parseFloat(charge.toFixed(2));
}
// Balance warning helper tailored for session tracker usage
function getBalanceWarning(currentBalance, _currentCharge, level) {
    const perMinute = getPricePerHour(level) / 60;
    if (perMinute <= 0)
        return null;
    const minutesRemaining = currentBalance / perMinute;
    if (currentBalance <= 0)
        return "Insufficient balance. Session will be terminated.";
    if (minutesRemaining < 5)
        return `Low balance warning: Only ${Math.floor(minutesRemaining)} minutes remaining.`;
    if (minutesRemaining < 30)
        return `Balance running low: ${Math.floor(minutesRemaining)} minutes remaining.`;
    return null;
}
