import { type BookLevel } from "@/lib/readingSessionManager";
interface ReadingSessionTrackerProps {
    bookId: number;
    bookTitle: string;
    bookLevel: BookLevel;
    userBalance: number;
    sessionType: "reading" | "listening";
    onSessionEnd?: (minutesSpent: number, chargeAmount: number) => void;
    onInsufficientBalance?: () => void;
}
export default function ReadingSessionTracker({ bookId, bookTitle, bookLevel, userBalance, sessionType, onSessionEnd, onInsufficientBalance, }: ReadingSessionTrackerProps): import("react").JSX.Element;
export {};
