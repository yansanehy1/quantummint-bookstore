"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
exports.upsertUser = upsertUser;
exports.getUserByOpenId = getUserByOpenId;
exports.getOrCreateWallet = getOrCreateWallet;
const drizzle_orm_1 = require("drizzle-orm");
const mysql2_1 = require("drizzle-orm/mysql2");
const schema_1 = require("../drizzle/schema");
const env_1 = require("./_core/env");
let _db = null;
// Lazily create the drizzle instance so local tooling can run without a DB.
async function getDb() {
    if (!_db && process.env.DATABASE_URL) {
        try {
            _db = (0, mysql2_1.drizzle)(process.env.DATABASE_URL);
        }
        catch (error) {
            console.warn('[Database] Failed to connect:', error);
            _db = null;
        }
    }
    return _db;
}
async function upsertUser(user) {
    if (!user.openId) {
        throw new Error('User openId is required for upsert');
    }
    const db = await getDb();
    if (!db) {
        console.warn('[Database] Cannot upsert user: database not available');
        return;
    }
    try {
        const values = {
            openId: user.openId,
        };
        const updateSet = {};
        const textFields = ['name', 'email', 'loginMethod', 'phone'];
        const assignNullable = (field) => {
            const value = user[field];
            if (value === undefined)
                return;
            const normalized = value ?? null;
            values[field] = normalized;
            updateSet[field] = normalized;
        };
        textFields.forEach(assignNullable);
        if (user.lastSignedIn !== undefined) {
            values.lastSignedIn = user.lastSignedIn;
            updateSet.lastSignedIn = user.lastSignedIn;
        }
        if (user.role !== undefined) {
            values.role = user.role;
            updateSet.role = user.role;
        }
        else if (user.openId === env_1.ENV.ownerOpenId) {
            values.role = 'admin';
            updateSet.role = 'admin';
        }
        if (!values.lastSignedIn) {
            values.lastSignedIn = new Date();
        }
        if (Object.keys(updateSet).length === 0) {
            updateSet.lastSignedIn = new Date();
        }
        await db.insert(schema_1.users).values(values).onDuplicateKeyUpdate({
            set: updateSet,
        });
        // Create wallet for new users
        const userRecord = await getUserByOpenId(user.openId);
        if (userRecord) {
            await getOrCreateWallet(userRecord.id);
        }
    }
    catch (error) {
        console.error('[Database] Failed to upsert user:', error);
        throw error;
    }
}
async function getUserByOpenId(openId) {
    const db = await getDb();
    if (!db) {
        console.warn('[Database] Cannot get user: database not available');
        return undefined;
    }
    const result = await db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.openId, openId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
// Wallet operations
async function getOrCreateWallet(userId) {
    const db = await getDb();
    if (!db) {
        console.warn('[Database] Cannot get wallet: database not available');
        return undefined;
    }
    try {
        const existing = await db
            .select()
            .from(schema_1.wallets)
            .where((0, drizzle_orm_1.eq)(schema_1.wallets.userId, userId))
            .limit(1);
        if (existing.length > 0) {
            return existing[0];
        }
        // Create new wallet
        await db.insert(schema_1.wallets).values({
            userId,
            balanceUSD: '0',
            balanceSLL: '0',
        });
        const created = await db
            .select()
            .from(schema_1.wallets)
            .where((0, drizzle_orm_1.eq)(schema_1.wallets.userId, userId))
            .limit(1);
        return created[0];
    }
    catch (error) {
        console.error('[Database] Failed to get or create wallet:', error);
        throw error;
    }
}
