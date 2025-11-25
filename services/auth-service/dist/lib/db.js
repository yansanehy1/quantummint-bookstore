"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByOpenId = getUserByOpenId;
exports.upsertUser = upsertUser;
const byOpenId = new Map();
async function getUserByOpenId(openId) {
    var _a;
    return (_a = byOpenId.get(openId)) !== null && _a !== void 0 ? _a : null;
}
async function upsertUser(partial) {
    var _a;
    const existing = (_a = byOpenId.get(partial.openId)) !== null && _a !== void 0 ? _a : {
        openId: partial.openId,
        name: null,
        email: null,
        loginMethod: null,
        lastSignedIn: null,
    };
    const updated = {
        ...existing,
        ...partial,
    };
    byOpenId.set(updated.openId, updated);
    return updated;
}
