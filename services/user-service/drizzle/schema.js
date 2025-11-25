"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wallets = exports.users = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
// Users table
exports.users = (0, mysql_core_1.mysqlTable)('users', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    openId: (0, mysql_core_1.varchar)('open_id', { length: 255 }).unique().notNull(),
    email: (0, mysql_core_1.varchar)('email', { length: 255 }),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }),
    phone: (0, mysql_core_1.varchar)('phone', { length: 20 }),
    loginMethod: (0, mysql_core_1.varchar)('login_method', { length: 50 }),
    role: (0, mysql_core_1.varchar)('role', { length: 20 }).default('user'),
    lastSignedIn: (0, mysql_core_1.timestamp)('last_signed_in'),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
    emailIdx: (0, mysql_core_1.index)('idx_email').on(table.email),
    roleIdx: (0, mysql_core_1.index)('idx_role').on(table.role),
}));
// Wallets table
exports.wallets = (0, mysql_core_1.mysqlTable)('wallets', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    userId: (0, mysql_core_1.int)('user_id').notNull(),
    balanceUSD: (0, mysql_core_1.decimal)('balance_usd', { precision: 15, scale: 2 }).default('0.00'),
    balanceSLL: (0, mysql_core_1.decimal)('balance_sll', { precision: 15, scale: 2 }).default('0.00'),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
    userIdIdx: (0, mysql_core_1.index)('idx_user_id').on(table.userId),
}));
