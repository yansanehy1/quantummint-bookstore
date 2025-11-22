import type { Request } from "express";

export type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  domain?: string;
  maxAge?: number;
};

export function getSessionCookieOptions(req: Request): CookieOptions {
  const isSecure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https";
  return {
    httpOnly: true,
    secure: !!isSecure,
    sameSite: isSecure ? "none" : "lax",
    path: "/",
  };
}

export const COOKIE_NAME = "sb.session";
