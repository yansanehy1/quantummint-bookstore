/**
 * Reading Session Manager
 * Handles pay-per-use reading/listening sessions with automatic charging
 */
export type BookLevel = "JSS" | "SSS" | "OTHER";
export type SessionType = "reading" | "listening";
export interface ReadingSession {
    id: string;
    userId: number;
    bookId: number;
    bookTitle: string;
    bookLevel: BookLevel;
    sessionType: SessionType;
    startTime: Date;
    pausedAt?: Date;
    totalMinutesSpent: number;
    pricePerHour: number;
    totalCharged: number;
    status: "active" | "paused" | "completed" | "terminated";
}
export interface SessionChargeInfo {
    minutesSpent: number;
    hourlyRate: number;
    chargeAmount: number;
    warningThreshold: number;
}
/**
 * Get pricing for a book level
 * @param bookLevel - The level of the book (JSS, SSS, or OTHER)
 * @returns The price per hour in leones
 */
export declare function getPricePerHour(bookLevel: BookLevel): number;
/**
 * Calculate charge based on minutes spent
 * @param minutesSpent - Total minutes spent in the session
 * @param pricePerHour - Hourly rate in leones
 * @returns The calculated charge amount
 */
export declare function calculateCharge(minutesSpent: number, pricePerHour: number): number;
/**
 * Get session charge info
 * @param minutesSpent - Total minutes spent in the session
 * @param bookLevel - The level of the book
 * @returns Session charge information including minutes, rate, amount and warning threshold
 */
export declare function getSessionChargeInfo(minutesSpent: number, bookLevel: BookLevel): SessionChargeInfo;
/**
 * Format time for display
 * @param minutes - Number of minutes to format
 * @returns Formatted time string (e.g., "2h 30m" or "45m")
 */
export declare function formatTime(minutes: number): string;
/**
 * Get warning message based on balance and session cost
 * @param userBalance - Current user's balance in leones
 * @param sessionCharge - Current session charge
 * @param bookLevel - The level of the book
 * @returns Warning message or null if no warning needed
 */
export declare function getBalanceWarning(userBalance: number, sessionCharge: number, bookLevel: BookLevel): string | null;
/**
 * Estimate reading time based on balance
 * @param userBalance - Current user's balance in leones
 * @param bookLevel - The level of the book
 * @returns Estimated reading time in minutes
 */
export declare function estimateReadingTime(userBalance: number, bookLevel: BookLevel): number;
/**
 * Create a new reading session
 * @param userId - ID of the user starting the session
 * @param bookId - ID of the book being read/listened to
 * @param bookTitle - Title of the book
 * @param bookLevel - Level of the book (JSS, SSS, OTHER)
 * @param sessionType - Type of session (reading or listening)
 * @returns New reading session object
 */
export declare function createReadingSession(userId: number, bookId: number, bookTitle: string, bookLevel: BookLevel, sessionType: SessionType): ReadingSession;
/**
 * Update session with elapsed time
 * @param session - Current session object
 * @param elapsedMinutes - Total minutes elapsed
 * @returns Updated session object with new time and charges
 */
export declare function updateSessionTime(session: ReadingSession, elapsedMinutes: number): ReadingSession;
/**
 * Pause session
 * @param session - Current session object
 * @returns Updated session object with paused status
 */
export declare function pauseSession(session: ReadingSession): ReadingSession;
/**
 * Resume session
 * @param session - Current session object
 * @returns Updated session object with active status
 */
export declare function resumeSession(session: ReadingSession): ReadingSession;
/**
 * Complete session
 * @param session - Current session object
 * @returns Updated session object with completed status
 */
export declare function completeSession(session: ReadingSession): ReadingSession;
/**
 * Terminate session (due to insufficient balance)
 * @param session - Current session object
 * @returns Updated session object with terminated status
 */
export declare function terminateSession(session: ReadingSession): ReadingSession;
