/**
 * Dynamic Exchange Rate Service
 *
 * Fetches the live USD → SLL exchange rate from an external provider and caches
 * it in memory for a configurable TTL.  If the fetch fails for any reason the
 * service falls back to the value in FALLBACK_SLL_TO_USD (env var) or the
 * compile-time default of 59 SLL/USD.
 *
 * Supported provider: exchangerate.host (free, no API key required).
 * Override with EXCHANGE_RATE_API_URL env var to point at a different endpoint
 * that returns JSON with a numeric `result` field representing SLL per 1 USD.
 *
 * Exports:
 *   getRate()              → Promise<number>   — SLL per 1 USD
 *   convertSLLtoUSD(sll)   → Promise<number>
 *   convertUSDtoSLL(usd)   → Promise<number>
 */

const fetch = require('node-fetch');
const { main: logger } = require('../utils/logger');

// ─── Configuration ────────────────────────────────────────────────────────────

const FALLBACK_RATE = parseFloat(process.env.FALLBACK_SLL_TO_USD) || 59;
const CACHE_TTL_MS  = parseInt(process.env.EXCHANGE_RATE_CACHE_TTL_MS, 10) || 60 * 60 * 1000; // 1 hour

// Default provider: exchangerate.host converts 1 USD → SLL
const DEFAULT_API_URL =
    'https://api.exchangerate.host/convert?from=USD&to=SLL&amount=1';

const API_URL = process.env.EXCHANGE_RATE_API_URL || DEFAULT_API_URL;

// ─── In-memory cache ──────────────────────────────────────────────────────────

let _cachedRate      = null;  // number | null
let _cacheTimestamp  = 0;     // epoch ms of last successful fetch

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Fetch the rate from the remote API.
 * Returns the rate on success, throws on failure.
 */
async function _fetchRemoteRate() {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 8000); // 8 s timeout

    try {
        const response = await fetch(API_URL, { signal: controller.signal });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} from exchange rate API`);
        }

        const data = await response.json();

        // exchangerate.host returns { result: <number>, ... }
        // A custom endpoint may return { rate: <number> } — support both
        const rate = parseFloat(data.result ?? data.rate);
        if (isNaN(rate) || rate <= 0) {
            throw new Error(`Invalid rate value received: ${JSON.stringify(data)}`);
        }

        return rate;
    } finally {
        clearTimeout(timeout);
    }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the current SLL/USD exchange rate.
 * Uses the in-memory cache; refreshes when stale.
 * Falls back to FALLBACK_RATE if the remote fetch fails.
 */
exports.getRate = async function getRate() {
    const now = Date.now();

    if (_cachedRate !== null && (now - _cacheTimestamp) < CACHE_TTL_MS) {
        return _cachedRate;
    }

    try {
        const rate = await _fetchRemoteRate();
        _cachedRate     = rate;
        _cacheTimestamp = now;
        logger.info(`Exchange rate refreshed: 1 USD = ${rate} SLL`);
        return rate;
    } catch (err) {
        logger.warn(`Exchange rate fetch failed (using fallback ${FALLBACK_RATE}): ${err.message}`);
        // Return stale cache if available, otherwise fallback
        return _cachedRate !== null ? _cachedRate : FALLBACK_RATE;
    }
};

/**
 * Converts a SLL amount to USD using the live rate.
 * @param {number} sll
 * @returns {Promise<number>}
 */
exports.convertSLLtoUSD = async function convertSLLtoUSD(sll) {
    const rate = await exports.getRate();
    return parseFloat((sll / rate).toFixed(4));
};

/**
 * Converts a USD amount to SLL using the live rate.
 * @param {number} usd
 * @returns {Promise<number>}
 */
exports.convertUSDtoSLL = async function convertUSDtoSLL(usd) {
    const rate = await exports.getRate();
    return Math.round(usd * rate);
};

/** @internal — reset in-memory cache (for tests only) */
exports._resetCacheForTests = function _resetCacheForTests() {
    _cachedRate = null;
    _cacheTimestamp = 0;
};
