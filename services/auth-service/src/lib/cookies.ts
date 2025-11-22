import type { Request } from "express";
import type { CookieOptions } from "express-serve-static-core";

// Return cookie options suitable for session cookies. Uses `secure` when in production
// or when the request indicates HTTPS via `x-forwarded-proto` or `req.protocol`.
export function getSessionCookieOptions(req: Request): CookieOptions {
  const forwardedProto = (req.headers["x-forwarded-proto"] as string | undefined) ?? req.protocol;
  const isSecure = process.env.NODE_ENV === "production" || forwardedProto === "https";

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
  };

  return cookieOptions;
}
