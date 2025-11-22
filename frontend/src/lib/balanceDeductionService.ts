export type BookLevel = "JSS" | "SSS" | "OTHER";
export type SessionType = "reading" | "listening";
export type SessionStatus = "active" | "paused" | "completed" | "terminated";

export interface SessionTransaction {
  id: string;
  type: "charge" | "credit";
  amount: number; // positive numbers
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

const HOURLY_RATES: Record<BookLevel, number> = {
  JSS: 1,
  SSS: 2,
  OTHER: 2.5,
};

export function getChargePerMinute(bookLevel: BookLevel): number {
  const hourly = HOURLY_RATES[bookLevel] ?? HOURLY_RATES.OTHER;
  return parseFloat((hourly / 60).toFixed(4));
}

export function calculateMinuteCharge(minutes: number, chargePerMinute: number): number {
  return parseFloat((minutes * chargePerMinute).toFixed(2));
}

export function initializeChargeState(
  userId: number,
  bookId: number,
  bookTitle: string,
  bookLevel: BookLevel,
  sessionType: SessionType,
  startingBalance: number
): SessionChargeState {
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

export function processMinuteCharge(state: SessionChargeState, newMinutesElapsed: number): SessionChargeState {
  if (state.status !== "active") return state;
  const minutesDelta = Math.max(0, newMinutesElapsed - state.minutesElapsed);
  if (minutesDelta === 0) return state;

  const additionalCharge = calculateMinuteCharge(minutesDelta, state.chargePerMinute);
  const newTotalCharged = parseFloat((state.totalCharged + additionalCharge).toFixed(2));
  const newBalance = parseFloat((state.currentBalance - additionalCharge).toFixed(2));

  const tx: SessionTransaction = {
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

export function pauseSession(state: SessionChargeState): SessionChargeState {
  if (state.status !== "active") return state;
  return { ...state, status: "paused" };
}

export function resumeSession(state: SessionChargeState): SessionChargeState {
  if (state.status !== "paused") return state;
  return { ...state, status: "active" };
}

export function completeSession(state: SessionChargeState): SessionChargeState {
  if (state.status === "completed" || state.status === "terminated") return state;
  return { ...state, status: "completed" };
}

export function terminateSession(state: SessionChargeState): SessionChargeState {
  if (state.status === "terminated") return state;
  return { ...state, status: "terminated" };
}

export function getBalanceWarning(currentBalance: number, chargePerMinute: number): string | null {
  if (currentBalance <= 0) return "Insufficient balance to continue.";
  const tenMinutesCost = chargePerMinute * 10;
  if (currentBalance < chargePerMinute) return "Your balance will not cover the next minute.";
  if (currentBalance < tenMinutesCost) return "Low balance: less than ~10 minutes remaining.";
  return null;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export function getSessionSummary(state: SessionChargeState) {
  return {
    duration: formatDuration(state.minutesElapsed),
    totalCharged: state.totalCharged.toFixed(2),
    remainingBalance: state.currentBalance.toFixed(2),
    transactionCount: state.transactions.length,
    minutesElapsed: state.minutesElapsed,
  };
}
