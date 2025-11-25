"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_NAME = void 0;
exports.getSessionCookieOptions = getSessionCookieOptions;
function getSessionCookieOptions(req) {
    const isSecure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https";
    return {
        httpOnly: true,
        secure: !!isSecure,
        sameSite: isSecure ? "none" : "lax",
        path: "/",
    };
}
exports.COOKIE_NAME = "sb.session";
