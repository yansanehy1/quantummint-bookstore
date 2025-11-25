"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const ForbiddenError = (message) => Object.assign(new Error(message), { status: 403, code: 'FORBIDDEN' });
exports.ForbiddenError = ForbiddenError;
exports.default = {
    ForbiddenError: exports.ForbiddenError,
};
