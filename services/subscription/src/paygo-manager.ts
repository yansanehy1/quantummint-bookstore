import { Pool } from 'pg';
import { Redis } from 'ioredis';
import { query, queryOne } from './database';
import crypto from 'crypto';

interface PayGoWallet {
    id: string;
    user_id: string;
    leones_balance: number;
    usd_balance: number;
    is_active: boolean;
    is_suspended: boolean;
    auto_topup_enabled: boolean;
    auto_topup_amount: number;
    auto_topup_threshold: number;
}

interface PayGoSession {
    id: string;
    session_token: string;
    user_id: string;
    wallet_id: string;
    product_id: string;
    product_type: string;
    rate_per_minute_leones: number;
    rate_per_minute_usd: number;
    accumulated_leones: number;
    accumulated_usd: number;
    total_duration_seconds: number;
    status: string;
}

interface PayGoRate {
    rate_per_minute_leones: number;
    rate_per_minute_usd: number;
    rate_per_hour_leones: number;
    rate_per_hour_usd: number;
}

export class PayGoManager {
        // Check if wallet exists
        let wallet = await queryOne<PayGoWallet>(
    `SELECT * FROM paygo_wallets WHERE user_id = $1`,
    [userId]
);

if (!wallet) {
    // Create new wallet
    wallet = await queryOne<PayGoWallet>(
        `INSERT INTO paygo_wallets (user_id, leones_balance, usd_balance)
         VALUES ($1, 0.00, 0.00)
         RETURNING *`,
        [userId]
    );
}

return wallet!;
    }

    /**
     * Get wallet balance
     */
    async getWalletBalance(userId: string): Promise < {
    leones: number;
    usd: number;
    minutes_remaining: Record<string, number>;
} > {
    const wallet = await this.getOrCreateWallet(userId);

    // Get rates for different content types
    const rates = await this.getAllRates();

    // Calculate minutes remaining for each type
    const minutesRemaining: Record<string, number> = { };

for (const [type, rate] of Object.entries(rates)) {
    const leonesMins = wallet.leones_balance / rate.rate_per_minute_leones;
    const usdMins = wallet.usd_balance / rate.rate_per_minute_usd;
    minutesRemaining[type] = Math.max(leonesMins, usdMins);
}

return {
    leones: wallet.leones_balance,
    usd: wallet.usd_balance,
    minutes_remaining: minutesRemaining
};
    }

    /**
     * Deposit funds to wallet
     */
    async depositFunds(params: {
    user_id: string;
    amount: number;
    currency: string;
    payment_method: string;
    payment_reference: string;
}): Promise < any > {
    const { user_id, amount, currency, payment_method, payment_reference } = params;

    if(amount <= 0) {
    throw new Error('Deposit amount must be positive');
}

const wallet = await this.getOrCreateWallet(user_id);

// Convert amounts
let leonesAmount = 0;
let usdAmount = 0;

if (currency === 'SLL') {
    leonesAmount = amount;
    usdAmount = amount / this.exchangeRate;
} else if (currency === 'USD') {
    usdAmount = amount;
    leonesAmount = amount * this.exchangeRate;
} else {
    throw new Error(`Unsupported currency: ${currency}`);
}

// Update wallet balance
await query(
    `UPDATE paygo_wallets
       SET leones_balance = leones_balance + $1,
           usd_balance = usd_balance + $2,
           total_deposited_leones = total_deposited_leones + $1,
           total_deposited_usd = total_deposited_usd + $2,
           updated_at = NOW()
       WHERE id = $3`,
    [leonesAmount, usdAmount, wallet.id]
);

// Create transaction record
const transaction = await queryOne(
    `INSERT INTO paygo_transactions (
        wallet_id, user_id, transaction_type,
        leones_amount, usd_amount, exchange_rate,
        leones_balance_before, leones_balance_after,
        usd_balance_before, usd_balance_after,
        payment_method, payment_reference,
        status
      ) VALUES ($1, $2, 'deposit', $3, $4, $5, $6, $7, $8, $9, $10, $11, 'completed')
      RETURNING *`,
    [
        wallet.id,
        user_id,
        leonesAmount,
        usdAmount,
        this.exchangeRate,
        wallet.leones_balance,
        wallet.leones_balance + leonesAmount,
        wallet.usd_balance,
        wallet.usd_balance + usdAmount,
        payment_method,
        payment_reference
    ]
);

return {
    deposit_id: transaction!.id,
    amount_deposited: {
        leones: leonesAmount,
        usd: usdAmount
    },
    new_balance: {
        leones: wallet.leones_balance + leonesAmount,
        usd: wallet.usd_balance + usdAmount
    }
};
    }

    /**
     * Start a PayGO session
     */
    async startSession(params: {
    user_id: string;
    product_id: string;
    product_type: string;
    quality?: string;
}): Promise < any > {
    const { user_id, product_id, product_type, quality = '480p' } = params;

    const wallet = await this.getOrCreateWallet(user_id);

    if(wallet.is_suspended) {
    throw new Error('Wallet is suspended');
}

// Get rate for product type
const rate = await this.getRateForProduct(product_type, null);

// Check minimum balance (1 minute)
const minBalanceLeones = rate.rate_per_minute_leones;
const minBalanceUsd = rate.rate_per_minute_usd;

if (wallet.leones_balance < minBalanceLeones && wallet.usd_balance < minBalanceUsd) {
    throw new Error(
        `Insufficient balance. Required: ${minBalanceLeones} SLL or ${minBalanceUsd} USD`
    );
}

// Generate session token
const sessionToken = crypto.randomBytes(32).toString('hex');

// Create session record
const session = await queryOne<PayGoSession>(
    `INSERT INTO paygo_sessions (
        wallet_id, user_id, session_token,
        product_id, product_type, started_at,
        last_heartbeat, rate_per_minute_leones,
        rate_per_minute_usd, max_quality, current_quality,
        status
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6, $7, $8, $9, 'active')
      RETURNING *`,
    [
        wallet.id,
        user_id,
        sessionToken,
        product_id,
        product_type,
        rate.rate_per_minute_leones,
        rate.rate_per_minute_usd,
        quality,
        quality
    ]
);

// Cache session in Redis
await this.cacheSession(sessionToken, session!);

return {
    session_token: sessionToken,
    session_id: session!.id,
    rate_per_minute: {
        leones: rate.rate_per_minute_leones,
        usd: rate.rate_per_minute_usd
    },
    current_balance: {
        leones: wallet.leones_balance,
        usd: wallet.usd_balance
    },
    heartbeat_interval: 30
};
    }

    /**
     * Process heartbeat and charge for elapsed time
     */
    async processHeartbeat(sessionToken: string, bytesStreamed: number = 0): Promise < any > {
    // Get session from cache or DB
    let session = await this.getCachedSession(sessionToken);

    if(!session) {
        // Try to get from DB
        session = await queryOne<PayGoSession>(
            `SELECT * FROM paygo_sessions WHERE session_token = $1 AND status = 'active'`,
            [sessionToken]
        );

        if (!session) {
            throw new Error('Session not found or expired');
        }

        await this.cacheSession(sessionToken, session);
    }

        // Calculate elapsed time since last heartbeat
        const lastHeartbeat = new Date(session.last_heartbeat);
    const now = new Date();
    const elapsedSeconds = (now.getTime() - lastHeartbeat.getTime()) / 1000;

    // Minimum charge interval (30 seconds)
    const chargeInterval = 30;

    if(elapsedSeconds <chargeInterval) {
        // Too soon, just update heartbeat
        await this.updateHeartbeat(session.id, sessionToken);

        return {
            status: 'active',
            elapsed_seconds: elapsedSeconds,
            next_charge_in: chargeInterval - elapsedSeconds
        };
    }

        // Calculate charge
        const minutesToCharge = Math.ceil(elapsedSeconds / 60);
    const leonesCharge = minutesToCharge * session.rate_per_minute_leones;
    const usdCharge = minutesToCharge * session.rate_per_minute_usd;

    // Check balance
    const wallet = await queryOne<PayGoWallet>(
        `SELECT * FROM paygo_wallets WHERE id = $1`,
        [session.wallet_id]
    );

    if(!wallet || (wallet.leones_balance < leonesCharge && wallet.usd_balance < usdCharge)) {
    // Insufficient balance - end session
    await this.endSession(sessionToken, 'insufficient_balance');
    throw new Error('Insufficient balance');
}

// Charge user
await this.chargeUser({
    wallet_id: session.wallet_id,
    user_id: session.user_id,
    leones_amount: leonesCharge,
    usd_amount: usdCharge,
    session_id: session.id,
    duration_seconds: Math.floor(elapsedSeconds),
    product_id: session.product_id,
    product_type: session.product_type
});

// Update session
await query(
    `UPDATE paygo_sessions
       SET accumulated_leones = accumulated_leones + $1,
           accumulated_usd = accumulated_usd + $2,
           total_duration_seconds = total_duration_seconds + $3,
           bytes_streamed = bytes_streamed + $4,
           last_heartbeat = NOW(),
           updated_at = NOW()
       WHERE id = $5`,
    [leonesCharge, usdCharge, Math.floor(elapsedSeconds), bytesStreamed, session.id]
);

// Update cache
await this.updateCachedSession(sessionToken, {
    accumulated_leones: session.accumulated_leones + leonesCharge,
    accumulated_usd: session.accumulated_usd + usdCharge,
    last_heartbeat: now.toISOString()
});

// Get updated balance
const newBalance = await this.getWalletBalance(session.user_id);

return {
    status: 'active',
    charged: {
        leones: leonesCharge,
        usd: usdCharge,
        minutes: minutesToCharge
    },
    current_balance: newBalance,
    next_charge_in: chargeInterval
};
    }

    /**
     * End PayGO session
     */
    async endSession(sessionToken: string, reason: string = 'user_ended'): Promise < any > {
    const session = await queryOne<PayGoSession>(
        `SELECT * FROM paygo_sessions WHERE session_token = $1`,
        [sessionToken]
    );

    if(!session || session.status !== 'active') {
    throw new Error('Session not found or already ended');
}

// Process final charge if needed
const lastHeartbeat = new Date(session.last_heartbeat);
const now = new Date();
const elapsedSeconds = (now.getTime() - lastHeartbeat.getTime()) / 1000;

if (elapsedSeconds > 0) {
    const minutesToCharge = Math.ceil(elapsedSeconds / 60);
    const leonesCharge = minutesToCharge * session.rate_per_minute_leones;
    const usdCharge = minutesToCharge * session.rate_per_minute_usd;

    // Try to charge final amount
    try {
        await this.chargeUser({
            wallet_id: session.wallet_id,
            user_id: session.user_id,
            leones_amount: leonesCharge,
            usd_amount: usdCharge,
            session_id: session.id,
            duration_seconds: Math.floor(elapsedSeconds),
            product_id: session.product_id,
            product_type: session.product_type
        });
    } catch (error) {
        console.error('Final charge failed:', error);
    }
}

// Update session as ended
await query(
    `UPDATE paygo_sessions
       SET status = 'ended',
           ended_at = NOW(),
           ended_reason = $1,
           updated_at = NOW()
       WHERE id = $2`,
    [reason, session.id]
);

// Remove from cache
await this.redisClient.del(`paygo:session:${sessionToken}`);

// Get final balance
const finalBalance = await this.getWalletBalance(session.user_id);

return {
    status: 'ended',
    ended_reason: reason,
    session_summary: {
        total_duration_seconds: session.total_duration_seconds,
        total_charged_leones: session.accumulated_leones,
        total_charged_usd: session.accumulated_usd
    },
    final_balance: finalBalance
};
    }

    /**
     * Estimate cost for content
     */
    async estimateCost(params: {
    user_id: string;
    can_afford: canAfford
};
    }

    /**
     * Get rate for product type
     */
    private async getRateForProduct(productType: string, category: string | null): Promise < PayGoRate > {
    const rate = await queryOne<PayGoRate>(
        `SELECT rate_per_minute_leones, rate_per_minute_usd,
              rate_per_hour_leones, rate_per_hour_usd
       FROM paygo_rate_cards
       WHERE product_type = $1
       AND (category = $2 OR (category IS NULL AND $2 IS NULL))
       AND is_active = true
       AND (valid_until IS NULL OR valid_until > NOW())
       ORDER BY is_default DESC, valid_from DESC
       LIMIT 1`,
        [productType, category]
    );

    if(rate) {
        return rate;
    }

        // Return defaults
        return {
        rate_per_minute_leones: this.defaultRateLeones,
        rate_per_minute_usd: this.defaultRateUsd,
        rate_per_hour_leones: this.defaultRateLeones * 60,
        rate_per_hour_usd: this.defaultRateUsd * 60
    };
}

    /**
     * Get all rates
     */
    private async getAllRates(): Promise < Record < string, PayGoRate >> {
    const rates = await query<PayGoRate>(
        `SELECT product_type, rate_per_minute_leones, rate_per_minute_usd,
              rate_per_hour_leones, rate_per_hour_usd
       FROM paygo_rate_cards
       WHERE is_active = true
       AND (valid_until IS NULL OR valid_until > NOW())
       AND category IS NULL
       ORDER BY product_type`
    );

    const ratesMap: Record<string, PayGoRate> = { };
for (const rate of rates) {
    ratesMap[(rate as any).product_type] = rate;
}

return ratesMap;
    }

    /**
     * Charge user for usage
     */
    private async chargeUser(params: {
    wallet_id: string;
    user_id: string;
    leones_amount: number;
    usd_amount: number;
    session_id: string;
    duration_seconds: number;
    product_id: string;
    product_type: string;
}): Promise < void> {
    const {
        wallet_id,
        user_id,
        leones_amount,
        usd_amount,
        session_id,
        duration_seconds,
        product_id,
        product_type
    } = params;

    // Get current balance
    const wallet = await queryOne<PayGoWallet>(
        `SELECT * FROM paygo_wallets WHERE id = $1`,
        [wallet_id]
    );

    if(!wallet) {
        throw new Error('Wallet not found');
    }

        // Determine which currency to deduct from
        let leonesDeduction = 0;
    let usdDeduction = 0;

    if(wallet.leones_balance >= leones_amount) {
    leonesDeduction = leones_amount;
} else if (wallet.usd_balance >= usd_amount) {
    usdDeduction = usd_amount;
} else {
    throw new Error('Insufficient balance in both currencies');
}

const newLeonesBalance = wallet.leones_balance - leonesDeduction;
const newUsdBalance = wallet.usd_balance - usdDeduction;

// Update wallet
await query(
    `UPDATE paygo_wallets
       SET leones_balance = $1,
           usd_balance = $2,
           total_spent_leones = total_spent_leones + $3,
           total_spent_usd = total_spent_usd + $4,
           updated_at = NOW()
       WHERE id = $5`,
    [newLeonesBalance, newUsdBalance, leonesDeduction, usdDeduction, wallet_id]
);

// Create transaction record
await query(
    `INSERT INTO paygo_transactions (
        wallet_id, user_id, transaction_type,
        leones_amount, usd_amount,
        leones_balance_before, leones_balance_after,
        usd_balance_before, usd_balance_after,
        service_type, product_id,
        duration_seconds, duration_minutes,
        status, metadata
      ) VALUES ($1, $2, 'charge', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'completed', $13)`,
    [
        wallet_id,
        user_id,
        leonesDeduction,
        usdDeduction,
        wallet.leones_balance,
        newLeonesBalance,
        wallet.usd_balance,
        newUsdBalance,
        product_type,
        product_id,
        duration_seconds,
        duration_seconds / 60,
        JSON.stringify({ session_id })
    ]
);
    }

    /**
     * Cache session in Redis
     */
    private async cacheSession(sessionToken: string, session: PayGoSession): Promise < void> {
    const key = `paygo:session:${sessionToken}`;
    await this.redisClient.setex(
        key,
        3600, // 1 hour TTL
        JSON.stringify({
            ...session,
            last_heartbeat: new Date().toISOString()
        })
    );
}

    /**
     * Get cached session
     */
    private async getCachedSession(sessionToken: string): Promise < PayGoSession | null > {
    const key = `paygo:session:${sessionToken}`;
    const data = await this.redisClient.get(key);

    if(!data) {
        return null;
    }

        return JSON.parse(data);
}

    /**
     * Update cached session
     */
    private async updateCachedSession(sessionToken: string, updates: Partial<PayGoSession>): Promise < void> {
    const session = await this.getCachedSession(sessionToken);

    if(session) {
        const updated = { ...session, ...updates };
        await this.cacheSession(sessionToken, updated);
    }
}

    /**
     * Update heartbeat
     */
    private async updateHeartbeat(sessionId: string, sessionToken: string): Promise < void> {
    await query(
            `UPDATE paygo_sessions SET last_heartbeat = NOW(), updated_at = NOW() WHERE id = $1`,
        [sessionId]
    );

        await this.updateCachedSession(sessionToken, {
        last_heartbeat: new Date().toISOString() as any
    });
}
}

// Export singleton
let paygoManager: PayGoManager | null = null;

export function initializePayGoManager(redisClient: Redis): PayGoManager {
    if (!paygoManager) {
        paygoManager = new PayGoManager(redisClient);
    }
    return paygoManager;
}

export function getPayGoManager(): PayGoManager {
    if (!paygoManager) {
        throw new Error('PayGoManager not initialized');
    }
    return paygoManager;
}
