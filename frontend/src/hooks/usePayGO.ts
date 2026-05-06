import { useState, useEffect, useCallback } from 'react';

interface PayGOWallet {
  id: string;
  user_id: string;
  leones_balance: number;
  usd_balance: number;
  default_currency: 'SLL' | 'USD';
  auto_topup_enabled: boolean;
  auto_topup_amount: number;
  auto_topup_threshold: number;
  daily_spending_limit: number;
  monthly_spending_limit: number;
  total_deposited_leones: number;
  total_deposited_usd: number;
  total_spent_leones: number;
  total_spent_usd: number;
  is_active: boolean;
  is_suspended: boolean;
  suspension_reason?: string;
  last_used_at: string;
  created_at: string;
  updated_at: string;
}

interface PayGOTransaction {
  id: string;
  wallet_id: string;
  user_id: string;
  transaction_type: 'deposit' | 'charge' | 'refund' | 'adjustment' | 'bonus' | 'transfer_in' | 'transfer_out' | 'fee' | 'cashback';
  leones_amount: number;
  usd_amount: number;
  leones_balance_before: number;
  leones_balance_after: number;
  usd_balance_before: number;
  usd_balance_after: number;
  service_type?: 'video' | 'audiobook' | 'ebook' | 'live_stream';
  product_id?: string;
  product_title?: string;
  start_time?: string;
  end_time?: string;
  duration_seconds?: number;
  duration_minutes?: number;
  rate_per_minute_leones?: number;
  rate_per_minute_usd?: number;
  payment_method?: string;
  payment_provider?: string;
  payment_reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
}

interface PayGOSession {
  id: string;
  wallet_id: string;
  user_id: string;
  session_token: string;
  product_id: string;
  product_type: 'video' | 'audiobook' | 'ebook' | 'live_stream';
  started_at: string;
  last_heartbeat: string;
  ended_at?: string;
  total_duration_seconds: number;
  rate_per_minute_leones: number;
  rate_per_minute_usd: number;
  accumulated_leones: number;
  accumulated_usd: number;
  max_quality: string;
  current_quality: string;
  status: 'active' | 'paused' | 'ended' | 'expired' | 'cancelled';
}

interface BalanceCheck {
  has_sufficient_balance: boolean;
  current_leones_balance: number;
  current_usd_balance: number;
  required_leones: number;
  required_usd: number;
  can_proceed: boolean;
}

interface UsePayGOReturn {
  wallet: PayGOWallet | null;
  loading: boolean;
  error: string | null;
  transactions: PayGOTransaction[];
  activeSessions: PayGOSession[];
  refreshWallet: () => Promise<void>;
  depositFunds: (amount: number, currency: 'SLL' | 'USD', paymentMethod: string, reference?: string) => Promise<void>;
  checkBalance: (requiredLeones?: number, requiredUsd?: number) => Promise<BalanceCheck>;
  startSession: (productId: string, productType: string, quality?: string) => Promise<PayGOSession>;
  updateHeartbeat: (sessionToken: string) => Promise<void>;
  endSession: (sessionToken: string) => Promise<void>;
  getTransactions: (page?: number, limit?: number, type?: string) => Promise<void>;
  getActiveSessions: () => Promise<void>;
}

export const usePayGO = (token: string): UsePayGOReturn => {
  const [wallet, setWallet] = useState<PayGOWallet | null>(null);
  const [transactions, setTransactions] = useState<PayGOTransaction[]>([]);
  const [activeSessions, setActiveSessions] = useState<PayGOSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseURL = process.env.REACT_APP_PAYGO_API_URL || 'http://localhost:8007';

  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${baseURL}/api${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }, [token, baseURL]);

  // Refresh wallet data
  const refreshWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall('/wallet');
      setWallet(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Deposit funds
  const depositFunds = useCallback(async (
    amount: number,
    currency: 'SLL' | 'USD',
    paymentMethod: string,
    reference?: string
  ) => {
    try {
      await apiCall('/wallet/deposit', {
        method: 'POST',
        body: JSON.stringify({
          amount,
          currency,
          payment_method: paymentMethod,
          payment_reference: reference,
        }),
      });

      // Refresh wallet after deposit
      await refreshWallet();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Deposit failed');
    }
  }, [apiCall, refreshWallet]);

  // Check balance
  const checkBalance = useCallback(async (
    requiredLeones = 0,
    requiredUsd = 0
  ): Promise<BalanceCheck> => {
    try {
      const params = new URLSearchParams({
        required_leones: requiredLeones.toString(),
        required_usd: requiredUsd.toString(),
      });

      const data = await apiCall(`/wallet/check-balance?${params}`);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Balance check failed');
    }
  }, [apiCall]);

  // Start usage session
  const startSession = useCallback(async (
    productId: string,
    productType: string,
    quality = '480p'
  ): Promise<PayGOSession> => {
    try {
      const data = await apiCall('/sessions/start', {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId,
          product_type: productType,
          quality,
        }),
      });

      return data.session;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to start session');
    }
  }, [apiCall]);

  // Update session heartbeat
  const updateHeartbeat = useCallback(async (sessionToken: string) => {
    try {
      await apiCall(`/sessions/${sessionToken}/heartbeat`, {
        method: 'POST',
      });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update heartbeat');
    }
  }, [apiCall]);

  // End session
  const endSession = useCallback(async (sessionToken: string) => {
    try {
      const data = await apiCall(`/sessions/${sessionToken}/end`, {
        method: 'POST',
      });

      // Refresh wallet after session ends (charges applied)
      await refreshWallet();
      
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to end session');
    }
  }, [apiCall, refreshWallet]);

  // Get transactions
  const getTransactions = useCallback(async (
    page = 1,
    limit = 20,
    type?: string
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (type) {
        params.append('type', type);
      }

      const data = await apiCall(`/wallet/transactions?${params}`);
      setTransactions(data.transactions || []);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch transactions');
    }
  }, [apiCall]);

  // Get active sessions
  const getActiveSessions = useCallback(async () => {
    try {
      const data = await apiCall('/sessions/active');
      setActiveSessions(data.sessions || []);
      return data.sessions;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch active sessions');
    }
  }, [apiCall]);

  // Initialize wallet on mount
  useEffect(() => {
    if (token) {
      refreshWallet();
      getTransactions();
      getActiveSessions();
    }
  }, [token, refreshWallet, getTransactions, getActiveSessions]);

  // Auto-refresh active sessions every 30 seconds
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      getActiveSessions();
    }, 30000);

    return () => clearInterval(interval);
  }, [token, getActiveSessions]);

  // Auto-update heartbeats for active sessions
  useEffect(() => {
    if (!token || activeSessions.length === 0) return;

    const interval = setInterval(() => {
      activeSessions.forEach(session => {
        updateHeartbeat(session.session_token).catch(console.error);
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [token, activeSessions, updateHeartbeat]);

  return {
    wallet,
    loading,
    error,
    transactions,
    activeSessions,
    refreshWallet,
    depositFunds,
    checkBalance,
    startSession,
    updateHeartbeat,
    endSession,
    getTransactions,
    getActiveSessions,
  };
};
