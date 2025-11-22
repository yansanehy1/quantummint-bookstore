import { type BookLevel, getPricePerHour } from "./readingSessionManager";

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

export function getChargePerMinute(bookLevel: BookLevel): number {
  const hourlyRate = getPricePerHour(bookLevel);
  return hourlyRate / 60;
}

export function calculateMinuteCharge(minutesElapsed: number, bookLevel: BookLevel): number {
  const chargePerMinute = getChargePerMinute(bookLevel);
  const charge = minutesElapsed * chargePerMinute;
  return parseFloat(charge.toFixed(2));
}

export function createChargeTransaction(
  sessionId: string,
  userId: number,
  bookId: number,
  bookTitle: string,
  amount: number,
  previousBalance: number,
  newBalance: number
): BalanceTransaction {
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

export function createRefundTransaction(
  sessionId: string,
  userId: number,
  bookId: number,
  bookTitle: string,
  amount: number,
  previousBalance: number,
  newBalance: number
): BalanceTransaction {
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

export function initializeChargeState(
  userId: number,
  bookId: number,
  bookTitle: string,
  bookLevel: BookLevel,
  sessionType: "reading" | "listening",
  currentBalance: number
): SessionChargeState {
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

export function processMinuteCharge(state: SessionChargeState, minutesElapsed: number): SessionChargeState {
  const newState = { ...state };
  newState.minutesElapsed = minutesElapsed;

  const totalCharge = calculateMinuteCharge(minutesElapsed, state.bookLevel);
  const chargeThisMinute = totalCharge - state.totalCharged;

  if (chargeThisMinute > 0) {
    const newBalance = state.currentBalance - chargeThisMinute;

    const transaction = createChargeTransaction(
      state.sessionId,
      state.userId,
      state.bookId,
      state.bookTitle,
      chargeThisMinute,
      state.currentBalance,
      newBalance
    );

    newState.totalCharged = totalCharge;
    newState.currentBalance = Math.max(newBalance, 0);
    newState.transactions = [...newState.transactions, transaction];

    if (newBalance <= 0) {
      newState.status = "terminated";
    }
  }

  return newState;
}

export function pauseSession(state: SessionChargeState): SessionChargeState {
  return { ...state, status: "paused" };
}

export function resumeSession(state: SessionChargeState): SessionChargeState {
  return { ...state, status: "active" };
}

export function completeSession(state: SessionChargeState): SessionChargeState {
  return { ...state, status: "completed" };
}

export function terminateSession(state: SessionChargeState, refundAmount: number = 0): SessionChargeState {
  const newState: SessionChargeState = { ...state, status: "terminated" };

  if (refundAmount > 0) {
    const newBalance = state.currentBalance + refundAmount;
    const refundTransaction = createRefundTransaction(
      state.sessionId,
      state.userId,
      state.bookId,
      state.bookTitle,
      refundAmount,
      state.currentBalance,
      newBalance
    );

    newState.currentBalance = newBalance;
    newState.transactions = [...newState.transactions, refundTransaction];
  }

  return newState;
}

export function getBalanceWarning(currentBalance: number, chargePerMinute: number): string | null {
  const minutesRemaining = currentBalance / chargePerMinute;

  if (currentBalance <= 0) return "Insufficient balance. Session will be terminated.";
  if (minutesRemaining < 5) return `Low balance warning: Only ${Math.floor(minutesRemaining)} minutes remaining.`;
  if (minutesRemaining < 30) return `Balance running low: ${Math.floor(minutesRemaining)} minutes remaining.`;
  return null;
}

export function formatTransaction(txn: BalanceTransaction): string {
  const sign = txn.type === "charge" ? "-" : "+";
  return `${sign}${txn.amount.toFixed(2)} L - ${txn.description}`;
}

export function getSessionSummary(state: SessionChargeState): {
  duration: string;
  totalCharged: string;
  remainingBalance: string;
  transactionCount: number;
} {
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
