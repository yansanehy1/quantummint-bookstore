// Currency conversion service using free API
// Alternative to xe.com since it requires paid API access

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD';
const FALLBACK_RATE = 16500; // Fallback if API fails

interface ExchangeRateResponse {
    base: string;
    date: string;
    rates: {
        [key: string]: number;
    };
}

let cachedRate: number | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache

/**
 * Fetch the latest USD to SLL exchange rate
 * Uses caching to avoid excessive API calls
 */
export async function getUsdToSllRate(): Promise<number> {
    const now = Date.now();

    // Return cached rate if still valid
    if (cachedRate && now - lastFetchTime < CACHE_DURATION) {
        return cachedRate;
    }

    try {
        const response = await fetch(EXCHANGE_RATE_API);

        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data: ExchangeRateResponse = await response.json();

        // Get SLL rate (Sierra Leone Leone)
        const sllRate = data.rates.SLL;

        if (!sllRate || isNaN(sllRate)) {
            console.warn('SLL rate not found in API response, using fallback');
            return FALLBACK_RATE;
        }

        // Cache the rate
        cachedRate = sllRate;
        lastFetchTime = now;

        console.log(`Updated exchange rate: 1 USD = ${sllRate} SLL (as of ${data.date})`);

        return sllRate;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        console.warn(`Using fallback rate: 1 USD = ${FALLBACK_RATE} SLL`);

        // Return fallback rate if API fails
        return FALLBACK_RATE;
    }
}

/**
 * Convert USD to SLL
 */
export async function convertUsdToSll(usd: number): Promise<number> {
    const rate = await getUsdToSllRate();
    return Math.round(usd * rate);
}

/**
 * Convert SLL to USD
 */
export async function convertSllToUsd(sll: number): Promise<number> {
    const rate = await getUsdToSllRate();
    return parseFloat((sll / rate).toFixed(2));
}

/**
 * Get formatted exchange rate for display
 */
export async function getFormattedRate(): Promise<string> {
    const rate = await getUsdToSllRate();
    return `1 USD = ${rate.toLocaleString()} SLL`;
}

/**
 * Clear the cached rate (useful for manual refresh)
 */
export function clearRateCache(): void {
    cachedRate = null;
    lastFetchTime = 0;
}
