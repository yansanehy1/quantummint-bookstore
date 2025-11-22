/**
 * Reading Session Manager
 * Handles pay-per-use reading/listening sessions with automatic charging
 */

export type BookLevel = "JSS" | "SSS" | "OTHER";
export type SessionType = "reading" | "listening";

// Pricing per hour in leones
const PRICING: Record<BookLevel, number> = {
  JSS: 1,
  SSS: 2,
  OTHER: 2.5,
};

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
export function getPricePerHour(bookLevel: BookLevel): number {
  return PRICING[bookLevel] || PRICING.OTHER;
}

/**
 * Calculate charge based on minutes spent
 * @param minutesSpent - Total minutes spent in the session
 * @param pricePerHour - Hourly rate in leones
 * @returns The calculated charge amount
 */
export function calculateCharge(
  minutesSpent: number,
  pricePerHour: number
): number {
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
export function getSessionChargeInfo(
  minutesSpent: number,
  bookLevel: BookLevel
): SessionChargeInfo {
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
export function formatTime(minutes: number): string {
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
export function getBalanceWarning(
  userBalance: number,
  sessionCharge: number,
  bookLevel: BookLevel
): string | null {
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
export function estimateReadingTime(
  userBalance: number,
  bookLevel: BookLevel
): number {
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
export function createReadingSession(
  userId: number,
  bookId: number,
  bookTitle: string,
  bookLevel: BookLevel,
  sessionType: SessionType
): ReadingSession {
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
export function updateSessionTime(
  session: ReadingSession,
  elapsedMinutes: number
): ReadingSession {
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
export function pauseSession(session: ReadingSession): ReadingSession {
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
export function resumeSession(session: ReadingSession): ReadingSession {
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
export function completeSession(session: ReadingSession): ReadingSession {
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
export function terminateSession(session: ReadingSession): ReadingSession {
  return {
    ...session,
    status: "terminated",
  };
}