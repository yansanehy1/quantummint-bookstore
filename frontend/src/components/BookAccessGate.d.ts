import { type BookLevel } from "@/lib/readingSessionManager";
interface BookAccessGateProps {
    bookId: number;
    bookTitle: string;
    bookLevel: BookLevel;
    bookPrice: number;
    userBalance: number;
    isPurchased: boolean;
    onPurchase?: () => void;
    onStartPayPerUse?: (sessionType: "reading" | "listening") => void;
}
export default function BookAccessGate({ bookId, bookTitle, bookLevel, bookPrice, userBalance, isPurchased, onPurchase, onStartPayPerUse }: BookAccessGateProps): import("react").JSX.Element;
export {};
