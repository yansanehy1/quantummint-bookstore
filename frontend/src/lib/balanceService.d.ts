import { type BookLevel } from "./readingSessionManager";
export interface BalanceTransaction {
    id: string;
    sessionId: string;
    userId: number;
    bookId: number;
    bookTitle: string;
    type: "charge" | "refund";
    amount: number;
    previousBalance: number;
    newBalance: number;
    timestamp: Date;
    description: string;
}
export interface SessionChargeState {
    sessionId: string;
    userId: number;
    bookId: number;
    bookTitle: string;
    bookLevel: BookLevel;
    sessionType: "reading" | "listening";
    startTime: Date;
    currentBalance: number;
    totalCharged: number;
    minutesElapsed: number;
    chargePerMinute: number;
    transactions: BalanceTransaction[];
    status: "active" | "paused" | "completed" | "terminated";
}
export declare function getChargePerMinute(bookLevel: BookLevel): number;
export declare function calculateMinuteCharge(minutesElapsed: number, bookLevel: BookLevel): number;
export declare function createChargeTransaction(sessionId: string, userId: number, bookId: number, bookTitle: string, amount: number, previousBalance: number, newBalance: number): BalanceTransaction;
export declare function createRefundTransaction(sessionId: string, userId: number, bookId: number, bookTitle: string, amount: number, previousBalance: number, newBalance: number): BalanceTransaction;
export declare function initializeChargeState(userId: number, bookId: number, bookTitle: string, bookLevel: BookLevel, sessionType: "reading" | "listening", currentBalance: number): SessionChargeState;
export declare function processMinuteCharge(state: SessionChargeState, minutesElapsed: number): SessionChargeState;
export declare function pauseSession(state: SessionChargeState): SessionChargeState;
export declare function resumeSession(state: SessionChargeState): SessionChargeState;
export declare function completeSession(state: SessionChargeState): SessionChargeState;
export declare function terminateSession(state: SessionChargeState, refundAmount?: number): SessionChargeState;
export declare function getBalanceWarning(currentBalance: number, chargePerMinute: number): string | null;
export declare function formatTransaction(txn: BalanceTransaction): string;
export declare function getSessionSummary(state: SessionChargeState): {
    duration: string;
    totalCharged: string;
    remainingBalance: string;
    transactionCount: number;
};
