import type { Request } from "express";
export type CookieOptions = {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
    path?: string;
    domain?: string;
    maxAge?: number;
};
export declare function getSessionCookieOptions(req: Request): CookieOptions;
export declare const COOKIE_NAME = "sb.session";
