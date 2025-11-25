"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByOpenId = getUserByOpenId;
exports.upsertUser = upsertUser;
const byOpenId = new Map();
async function getUserByOpenId(openId) {
    return byOpenId.get(openId) ?? null;
}
async function upsertUser(partial) {
    const existing = byOpenId.get(partial.openId) ?? {
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
