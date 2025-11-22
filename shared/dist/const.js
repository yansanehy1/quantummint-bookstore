"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AXIOS_TIMEOUT_MS = exports.ONE_YEAR_MS = exports.COOKIE_NAME = void 0;
// Shared constants used across frontend and services
exports.COOKIE_NAME = "sb.session";
// One year in milliseconds
exports.ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
// Axios default timeout for service-to-service and SDK calls
exports.AXIOS_TIMEOUT_MS = 15000;
exports.default = {
    COOKIE_NAME: exports.COOKIE_NAME,
    ONE_YEAR_MS: exports.ONE_YEAR_MS,
    AXIOS_TIMEOUT_MS: exports.AXIOS_TIMEOUT_MS,
};
