const mockFetch = jest.fn();

jest.mock('node-fetch', () => mockFetch);

describe('exchangeRateService', () => {
    const originalEnv = process.env;

    afterAll(() => {
        process.env = originalEnv;
    });

    function loadService(envOverrides = {}) {
        jest.resetModules();
        mockFetch.mockReset();
        process.env = { ...originalEnv, ...envOverrides };
        return require('../services/exchangeRateService');
    }

    it('fetches and caches the rate within TTL', async () => {
        const exchangeRateService = loadService({ EXCHANGE_RATE_CACHE_TTL_MS: '60000' });
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ result: 23500 }),
        });

        const rate1 = await exchangeRateService.getRate();
        const rate2 = await exchangeRateService.getRate();

        expect(rate1).toBe(23500);
        expect(rate2).toBe(23500);
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('refreshes cache after TTL expires', async () => {
        const exchangeRateService = loadService({ EXCHANGE_RATE_CACHE_TTL_MS: '1000' });
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ result: 100 }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ result: 200 }),
            });

        const rate1 = await exchangeRateService.getRate();
        await new Promise((r) => setTimeout(r, 1100));
        const rate2 = await exchangeRateService.getRate();

        expect(rate1).toBe(100);
        expect(rate2).toBe(200);
        expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('falls back to FALLBACK_SLL_TO_USD when fetch fails and no stale cache', async () => {
        const exchangeRateService = loadService({ FALLBACK_SLL_TO_USD: '42' });
        mockFetch.mockRejectedValue(new Error('network error'));

        const rate = await exchangeRateService.getRate();

        expect(rate).toBe(42);
    });

    it('returns stale cache when fetch fails but cache exists', async () => {
        const exchangeRateService = loadService({ EXCHANGE_RATE_CACHE_TTL_MS: '1' });
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ result: 150 }),
            })
            .mockRejectedValueOnce(new Error('network error'));

        const rate1 = await exchangeRateService.getRate();
        await new Promise((r) => setTimeout(r, 5));
        const rate2 = await exchangeRateService.getRate();

        expect(rate1).toBe(150);
        expect(rate2).toBe(150);
    });

    it('convertSLLtoUSD uses the live rate', async () => {
        const exchangeRateService = loadService();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ result: 100 }),
        });

        const usd = await exchangeRateService.convertSLLtoUSD(250);
        expect(usd).toBe(2.5);
    });
});
