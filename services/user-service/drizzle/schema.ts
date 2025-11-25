import { mysqlTable, varchar, boolean, timestamp, int, decimal, text, index } from 'drizzle-orm/mysql-core';

// Users table
export const users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    openId: varchar('open_id', { length: 255 }).unique().notNull(),
    email: varchar('email', { length: 255 }),
    name: varchar('name', { length: 255 }),
    phone: varchar('phone', { length: 20 }),
    loginMethod: varchar('login_method', { length: 50 }),
    role: varchar('role', { length: 20 }).default('user'),
    lastSignedIn: timestamp('last_signed_in'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
    emailIdx: index('idx_email').on(table.email),
    roleIdx: index('idx_role').on(table.role),
}));

// Wallets table
export const wallets = mysqlTable('wallets', {
    id: int('id').primaryKey().autoincrement(),
    userId: int('user_id').notNull(),
    balanceUSD: decimal('balance_usd', { precision: 15, scale: 2 }).default('0.00'),
    balanceSLL: decimal('balance_sll', { precision: 15, scale: 2 }).default('0.00'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
    userIdIdx: index('idx_user_id').on(table.userId),
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;
