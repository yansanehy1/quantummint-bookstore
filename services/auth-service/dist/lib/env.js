"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
exports.ENV = {
    oAuthServerUrl: process.env.OAUTH_SERVER_URL || "",
    appId: process.env.APP_ID || "",
    cookieSecret: process.env.COOKIE_SECRET || "development-secret",
};
exports.default = exports.ENV;
