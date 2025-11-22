import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/mysql2';
import { InsertUser, users, wallets, Wallet } from '../drizzle/schema';
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn('[Database] Failed to connect:', error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error('User openId is required for upsert');
  }

  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot upsert user: database not available');
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    } as InsertUser;
    const updateSet: Record<string, unknown> = {};

    const textFields = ['name', 'email', 'loginMethod', 'phone'] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = (user as any)[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      (values as any)[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      (values as any).lastSignedIn = user.lastSignedIn;
      (updateSet as any).lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      (values as any).role = user.role;
      (updateSet as any).role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      (values as any).role = 'admin';
      (updateSet as any).role = 'admin';
    }

    if (!(values as any).lastSignedIn) {
      (values as any).lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      (updateSet as any).lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });

    // Create wallet for new users
    const userRecord = await getUserByOpenId(user.openId);
    if (userRecord) {
      await getOrCreateWallet((userRecord as any).id);
    }
  } catch (error) {
    console.error('[Database] Failed to upsert user:', error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot get user: database not available');
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Wallet operations
export async function getOrCreateWallet(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot get wallet: database not available');
    return undefined;
  }

  try {
    const existing = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      return existing[0] as Wallet;
    }

    // Create new wallet
    await db.insert(wallets).values({
      userId,
      balanceUSD: '0',
      balanceSLL: '0',
    });

    const created = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    return created[0] as Wallet;
  } catch (error) {
    console.error('[Database] Failed to get or create wallet:', error);
    throw error;
  }
}
