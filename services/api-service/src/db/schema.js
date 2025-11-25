"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactions = exports.wallets = exports.purchases = exports.bookPages = exports.books = exports.users = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
/** Users */
exports.users = (0, mysql_core_1.mysqlTable)("users", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    openId: (0, mysql_core_1.varchar)("openId", { length: 64 }).notNull().unique(),
    name: (0, mysql_core_1.text)("name"),
    email: (0, mysql_core_1.varchar)("email", { length: 320 }),
    phone: (0, mysql_core_1.varchar)("phone", { length: 20 }),
    loginMethod: (0, mysql_core_1.varchar)("loginMethod", { length: 64 }),
    role: (0, mysql_core_1.mysqlEnum)("role", ["user", "admin", "seller"]).default("user").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: (0, mysql_core_1.timestamp)("lastSignedIn").defaultNow().notNull(),
});
/** Books */
exports.books = (0, mysql_core_1.mysqlTable)("books", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    description: (0, mysql_core_1.text)("description"),
    category: (0, mysql_core_1.varchar)("category", { length: 100 }).notNull(),
    createdBy: (0, mysql_core_1.int)("createdBy").notNull(),
    priceUSD: (0, mysql_core_1.decimal)("priceUSD", { precision: 10, scale: 2 }).notNull(),
    priceSLL: (0, mysql_core_1.decimal)("priceSLL", { precision: 15, scale: 2 }),
    coverImageUrl: (0, mysql_core_1.text)("coverImageUrl"),
    totalPages: (0, mysql_core_1.int)("totalPages"),
    published: (0, mysql_core_1.boolean)("published").default(false).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").defaultNow().onUpdateNow().notNull(),
});
/** Book pages */
exports.bookPages = (0, mysql_core_1.mysqlTable)("bookPages", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    bookId: (0, mysql_core_1.int)("bookId").notNull(),
    pageNumber: (0, mysql_core_1.int)("pageNumber").notNull(),
    content: (0, mysql_core_1.text)("content"),
    audioUrl: (0, mysql_core_1.text)("audioUrl"),
    audioTimestamp: (0, mysql_core_1.int)("audioTimestamp"),
    formulas: (0, mysql_core_1.text)("formulas"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
});
/** Purchases */
exports.purchases = (0, mysql_core_1.mysqlTable)("purchases", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    userId: (0, mysql_core_1.int)("userId").notNull(),
    bookId: (0, mysql_core_1.int)("bookId").notNull(),
    amount: (0, mysql_core_1.decimal)("amount", { precision: 10, scale: 2 }).notNull(),
    currency: (0, mysql_core_1.varchar)("currency", { length: 3 }).notNull(),
    status: (0, mysql_core_1.mysqlEnum)("status", ["pending", "completed", "failed"]).default("pending").notNull(),
    transactionId: (0, mysql_core_1.varchar)("transactionId", { length: 255 }),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").defaultNow().onUpdateNow().notNull(),
});
/** Wallets */
exports.wallets = (0, mysql_core_1.mysqlTable)("wallets", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    userId: (0, mysql_core_1.int)("userId").notNull().unique(),
    balanceUSD: (0, mysql_core_1.decimal)("balanceUSD", { precision: 15, scale: 2 }).default("0").notNull(),
    balanceSLL: (0, mysql_core_1.decimal)("balanceSLL", { precision: 15, scale: 2 }).default("0").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").defaultNow().onUpdateNow().notNull(),
});
/** Wallet transactions */
exports.transactions = (0, mysql_core_1.mysqlTable)("transactions", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    walletId: (0, mysql_core_1.int)("walletId").notNull(),
    type: (0, mysql_core_1.mysqlEnum)("type", ["deposit", "purchase", "cashout", "bonus", "gift"]).notNull(),
    amount: (0, mysql_core_1.decimal)("amount", { precision: 15, scale: 2 }).notNull(),
    currency: (0, mysql_core_1.varchar)("currency", { length: 3 }).notNull(),
    provider: (0, mysql_core_1.varchar)("provider", { length: 100 }),
    status: (0, mysql_core_1.mysqlEnum)("status", ["pending", "completed", "failed"]).default("pending").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
});
