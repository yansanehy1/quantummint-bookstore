export type BookLevel = "JSS" | "SSS" | "beginner" | "intermediate" | "advanced" | "expert";
export declare function getPricePerHour(level: BookLevel): number;
export declare function estimateReadingTime(balance: number, level: BookLevel): number;
export declare function formatTime(minutes: number): string;
export declare function calculateCharge(minutes: number, hourlyRate: number): number;
export declare function getBalanceWarning(currentBalance: number, _currentCharge: number, level: BookLevel): string | null;
