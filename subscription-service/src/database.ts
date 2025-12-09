import { Pool, PoolClient } from 'pg';
import Redis from 'ioredis';

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'siera_subscriptions',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

// Create PostgreSQL connection pool
export const db = new Pool(dbConfig);

// Redis configuration
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
};

// Create Redis client
export const redis = new Redis(redisConfig);

// Connection monitoring
db.on('error', (err) => {
    console.error('Unexpected database error:', err);
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

redis.on('connect', () => {
    console.log('✅ Connected to Redis');
});

db.on('connect', () => {
    console.log('✅ Connected to PostgreSQL');
});

// Helper to get a database client
export async function getDbClient(): Promise<PoolClient> {
    return await db.connect();
}

// Helper to execute queries with automatic connection handling
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const client = await getDbClient();
    try {
        const result = await client.query(text, params);
        return result.rows;
    } finally {
        client.release();
    }
}

// Helper to execute single row query
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
    const rows = await query<T>(text, params);
    return rows.length > 0 ? rows[0] : null;
}

// Redis cache helpers
export async function cacheGet<T = any>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
}

export async function cacheSet(key: string, value: any, ttl: number = 300): Promise<void> {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
}

export async function cacheDel(key: string): Promise<void> {
    await redis.del(key);
}

// Graceful shutdown
export async function closeConnections(): Promise<void> {
    console.log('Closing database connections...');
    await db.end();
    await redis.quit();
    console.log('✅ Database connections closed');
}

// Health check
export async function checkHealth(): Promise<{ database: boolean; redis: boolean }> {
    let dbHealthy = false;
    let redisHealthy = false;

    try {
        await db.query('SELECT 1');
        dbHealthy = true;
    } catch (err) {
        console.error('Database health check failed:', err);
    }

    try {
        await redis.ping();
        redisHealthy = true;
    } catch (err) {
        console.error('Redis health check failed:', err);
    }

    return { database: dbHealthy, redis: redisHealthy };
}
