const exchangeRateService = require('../services/exchangeRateService');
const fetch = require('node-fetch');

jest.mock('node-fetch');

describe('exchangeRateService', () => {
  beforeEach(() => {
    exchangeRateService._resetCacheForTests();
    jest.clearAllMocks();
  });

  it('fetches and caches the exchange rate', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 100 })
    });
    const rate1 = await exchangeRateService.getRate();
    expect(rate1).toBe(100);
    // Should use cache on second call
    const rate2 = await exchangeRateService.getRate();
    expect(rate2).toBe(100);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('falls back to env fallback if fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('fail'));
    const rate = await exchangeRateService.getRate();
    expect(rate).toBeGreaterThan(0); // fallback value
  });

  it('respects cache TTL', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ result: 200 }) });
    const rate1 = await exchangeRateService.getRate();
    expect(rate1).toBe(200);
    // Simulate cache expiry
    jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 2 * 60 * 60 * 1000);
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ result: 300 }) });
    const rate2 = await exchangeRateService.getRate();
    expect(rate2).toBe(300);
  });

  it('convertSLLtoUSD and convertUSDtoSLL work', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ result: 100 }) });
    const usd = await exchangeRateService.convertSLLtoUSD(1000);
    expect(usd).toBeCloseTo(10);
    const sll = await exchangeRateService.convertUSDtoSLL(10);
    expect(sll).toBe(1000);
  });
});
