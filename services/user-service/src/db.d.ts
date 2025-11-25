import { InsertUser } from '../drizzle/schema';
export declare function getDb(): Promise<import("drizzle-orm/mysql2").MySql2Database<Record<string, unknown>> & {
    $client: import("drizzle-orm/mysql2").AnyMySql2Connection;
}>;
export declare function upsertUser(user: InsertUser): Promise<void>;
export declare function getUserByOpenId(openId: string): Promise<{
    id: number;
    name: string;
    role: string;
    email: string;
    phone: string;
    openId: string;
    loginMethod: string;
    createdAt: Date;
    updatedAt: Date;
    lastSignedIn: Date;
}>;
export declare function getOrCreateWallet(userId: number): Promise<{
    id: number;
    balanceUSD: string;
    balanceSLL: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}>;
