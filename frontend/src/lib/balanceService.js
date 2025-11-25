"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChargePerMinute = getChargePerMinute;
exports.calculateMinuteCharge = calculateMinuteCharge;
exports.createChargeTransaction = createChargeTransaction;
exports.createRefundTransaction = createRefundTransaction;
exports.initializeChargeState = initializeChargeState;
exports.processMinuteCharge = processMinuteCharge;
exports.pauseSession = pauseSession;
exports.resumeSession = resumeSession;
exports.completeSession = completeSession;
exports.terminateSession = terminateSession;
exports.getBalanceWarning = getBalanceWarning;
exports.formatTransaction = formatTransaction;
exports.getSessionSummary = getSessionSummary;
const readingSessionManager_1 = require("./readingSessionManager");
function getChargePerMinute(bookLevel) {
    const hourlyRate = (0, readingSessionManager_1.getPricePerHour)(bookLevel);
    return hourlyRate / 60;
}
function calculateMinuteCharge(minutesElapsed, bookLevel) {
    const chargePerMinute = getChargePerMinute(bookLevel);
    const charge = minutesElapsed * chargePerMinute;
    return parseFloat(charge.toFixed(2));
}
function createChargeTransaction(sessionId, userId, bookId, bookTitle, amount, previousBalance, newBalance) {
    return {
        id: `txn-${Date.now()}`,
        sessionId,
        userId,
        bookId,
        bookTitle,
        type: "charge",
        amount,
        previousBalance,
        newBalance,
        timestamp: new Date(),
        description: `Pay-per-use charge for "${bookTitle}"`,
    };
}
function createRefundTransaction(sessionId, userId, bookId, bookTitle, amount, previousBalance, newBalance) {
    return {
        id: `txn-${Date.now()}`,
        sessionId,
        userId,
        bookId,
        bookTitle,
        type: "refund",
        amount,
        previousBalance,
        newBalance,
        timestamp: new Date(),
        description: `Refund for incomplete session of "${bookTitle}"`,
    };
}
function initializeChargeState(userId, bookId, bookTitle, bookLevel, sessionType, currentBalance) {
    return {
        sessionId: `session-${Date.now()}`,
        userId,
        bookId,
        bookTitle,
        bookLevel,
        sessionType,
        startTime: new Date(),
        currentBalance,
        totalCharged: 0,
        minutesElapsed: 0,
        chargePerMinute: getChargePerMinute(bookLevel),
        transactions: [],
        status: "active",
    };
}
function processMinuteCharge(state, minutesElapsed) {
    const newState = { ...state };
    newState.minutesElapsed = minutesElapsed;
    const totalCharge = calculateMinuteCharge(minutesElapsed, state.bookLevel);
    const chargeThisMinute = totalCharge - state.totalCharged;
    if (chargeThisMinute > 0) {
        const newBalance = state.currentBalance - chargeThisMinute;
        const transaction = createChargeTransaction(state.sessionId, state.userId, state.bookId, state.bookTitle, chargeThisMinute, state.currentBalance, newBalance);
        newState.totalCharged = totalCharge;
        newState.currentBalance = Math.max(newBalance, 0);
        newState.transactions = [...newState.transactions, transaction];
        if (newBalance <= 0) {
            newState.status = "terminated";
        }
    }
    return newState;
}
function pauseSession(state) {
    return { ...state, status: "paused" };
}
function resumeSession(state) {
    return { ...state, status: "active" };
}
function completeSession(state) {
    return { ...state, status: "completed" };
}
function terminateSession(state, refundAmount = 0) {
    const newState = { ...state, status: "terminated" };
    if (refundAmount > 0) {
        const newBalance = state.currentBalance + refundAmount;
        const refundTransaction = createRefundTransaction(state.sessionId, state.userId, state.bookId, state.bookTitle, refundAmount, state.currentBalance, newBalance);
        newState.currentBalance = newBalance;
        newState.transactions = [...newState.transactions, refundTransaction];
    }
    return newState;
}
function getBalanceWarning(currentBalance, chargePerMinute) {
    const minutesRemaining = currentBalance / chargePerMinute;
    if (currentBalance <= 0)
        return "Insufficient balance. Session will be terminated.";
    if (minutesRemaining < 5)
        return `Low balance warning: Only ${Math.floor(minutesRemaining)} minutes remaining.`;
    if (minutesRemaining < 30)
        return `Balance running low: ${Math.floor(minutesRemaining)} minutes remaining.`;
    return null;
}
function formatTransaction(txn) {
    const sign = txn.type === "charge" ? "-" : "+";
    return `${sign}${txn.amount.toFixed(2)} L - ${txn.description}`;
}
function getSessionSummary(state) {
    const hours = Math.floor(state.minutesElapsed / 60);
    const minutes = state.minutesElapsed % 60;
    const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    return {
        duration,
        totalCharged: state.totalCharged.toFixed(2),
        remainingBalance: state.currentBalance.toFixed(2),
        transactionCount: state.transactions.length,
    };
}
