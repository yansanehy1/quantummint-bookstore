import { useState, useEffect, useCallback } from 'react';
import { subscriptionsAPI } from '../utils/api';

const DEFAULT_RATE = 59;

export function useExchangeRate() {
    const [rate, setRate] = useState(DEFAULT_RATE);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const { exchangeRate } = await subscriptionsAPI.getPlans();
            if (exchangeRate > 0) setRate(exchangeRate);
        } catch {
            // keep last known rate
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { rate, loading, refresh };
}
