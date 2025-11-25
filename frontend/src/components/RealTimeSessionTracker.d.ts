import { type SessionChargeState } from "@/lib/balanceService";
import { type BookLevel } from "@/lib/readingSessionManager";
interface RealTimeSessionTrackerProps {
    bookId: number;
    bookTitle: string;
    bookLevel: BookLevel;
    userBalance: number;
    sessionType: "reading" | "listening";
    onSessionEnd?: (state: SessionChargeState) => void;
    onInsufficientBalance?: () => void;
}
export default function RealTimeSessionTracker({ bookId, bookTitle, bookLevel, userBalance, sessionType, onSessionEnd, onInsufficientBalance, }: RealTimeSessionTrackerProps): import("react").JSX.Element;
export {};
