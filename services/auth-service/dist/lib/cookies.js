"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionCookieOptions = getSessionCookieOptions;
// Return cookie options suitable for session cookies. Uses `secure` when in production
// or when the request indicates HTTPS via `x-forwarded-proto` or `req.protocol`.
function getSessionCookieOptions(req) {
    var _a;
    const forwardedProto = (_a = req.headers["x-forwarded-proto"]) !== null && _a !== void 0 ? _a : req.protocol;
    const isSecure = process.env.NODE_ENV === "production" || forwardedProto === "https";
    const cookieOptions = {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        path: "/",
    };
    return cookieOptions;
}
