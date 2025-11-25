import { type ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
export declare function formatPrice(price: number, currency?: string): string;
export declare function formatDate(date: Date | string): string;
export declare function truncate(str: string, length: number): string;
export declare function generateSlug(str: string): string;
export declare function isBrowser(): boolean;
export declare function getBaseUrl(): string;
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
