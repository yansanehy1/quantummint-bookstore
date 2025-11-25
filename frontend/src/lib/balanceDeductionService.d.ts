export type BookLevel = "JSS" | "SSS" | "OTHER";
export type SessionType = "reading" | "listening";
export type SessionStatus = "active" | "paused" | "completed" | "terminated";
export interface SessionTransaction {
    id: string;
    type: "charge" | "credit";
    amount: number;
    description: string;
    at: Date;
}
export interface SessionChargeState {
    sessionId: string;
    userId: number;
    bookId: number;
    bookTitle: string;
    bookLevel: BookLevel;
    sessionType: SessionType;
    minutesElapsed: number;
    chargePerMinute: number;
    totalCharged: number;
    currentBalance: number;
    status: SessionStatus;
    transactions: SessionTransaction[];
}
export declare function getChargePerMinute(bookLevel: BookLevel): number;
export declare function calculateMinuteCharge(minutes: number, chargePerMinute: number): number;
export declare function initializeChargeState(userId: number, bookId: number, bookTitle: string, bookLevel: BookLevel, sessionType: SessionType, startingBalance: number): SessionChargeState;
export declare function processMinuteCharge(state: SessionChargeState, newMinutesElapsed: number): SessionChargeState;
export declare function pauseSession(state: SessionChargeState): SessionChargeState;
export declare function resumeSession(state: SessionChargeState): SessionChargeState;
export declare function completeSession(state: SessionChargeState): SessionChargeState;
export declare function terminateSession(state: SessionChargeState): SessionChargeState;
export declare function getBalanceWarning(currentBalance: number, chargePerMinute: number): string | null;
export declare function getSessionSummary(state: SessionChargeState): {
    duration: string;
    totalCharged: string;
    remainingBalance: string;
    transactionCount: number;
    minutesElapsed: number;
};
