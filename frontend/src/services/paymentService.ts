// ============================================================
// Frontend Payment Service – API client for all payment flows
// ============================================================

import { API_BASE_URL } from '../utils/api';

// API_BASE_URL already includes '/api' (e.g. 'http://localhost:8000/api')
const base = API_BASE_URL.replace(/\/api$/, '');

function authHeaders(): Record<string, string> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

async function handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
    return data as T;
}

// ─── Wallet ──────────────────────────────────────────────────────────────────

export async function getWalletBalance() {
    const res = await fetch(`${base}/wallet/balance`, { headers: authHeaders() });
    return handleResponse<{
        balanceSLL: number;
        balanceUSD: number;
        balanceSLLinUSD: number;
        savedMethods: SavedPaymentMethod[];
    }>(res);
}

// SavedMethod moved to payments.ts

export async function getTransactionHistory(params: {
    page?: number;
    limit?: number;
    type?: string;
    method?: string;
    status?: string;
} = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    const res = await fetch(`${base}/wallet/transactions?${qs}`, { headers: authHeaders() });
    return handleResponse<{
        transactions: Transaction[];
        pagination: { page: number; limit: number; total: number; pages: number };
    }>(res);
}

import { Transaction, SavedPaymentMethod } from '../types/payments';

export type { Transaction, SavedPaymentMethod };

// ─── Deposits ─────────────────────────────────────────────────────────────────

export async function depositMobileMoney(params: {
    method: 'orange_money' | 'afrimoney' | 'qmoney';
    phoneNumber: string;
    amountSLL: number;
}) {
    const res = await fetch(`${base}/payments/deposit`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ method: params.method, amount: params.amountSLL, phoneNumber: params.phoneNumber, currency: 'SLL' }),
    });
    return handleResponse<{ success: boolean; externalRef: string; message: string; status: string }>(res);
}

export async function depositStripe(params: { amountUSD: number }) {
    const res = await fetch(`${base}/payments/deposit`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ method: 'stripe', amount: params.amountUSD, currency: 'USD' }),
    });
    return handleResponse<{ success: boolean; externalRef: string; message: string; status: string }>(res);
}

// ─── Withdrawals ──────────────────────────────────────────────────────────────

export async function withdrawMobileMoney(params: {
    method: 'orange_money' | 'afrimoney' | 'qmoney';
    phoneNumber: string;
    amountSLL: number;
}) {
    const res = await fetch(`${base}/payments/withdraw`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ method: params.method, amount: params.amountSLL, phoneNumber: params.phoneNumber }),
    });
    return handleResponse<{ success: boolean; externalRef: string; message: string; netAmount: number; platformFee: number }>(res);
}

export async function withdrawStripe(params: { amountUSD: number }) {
    const res = await fetch(`${base}/payments/withdraw`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ method: 'stripe', amount: params.amountUSD }),
    });
    return handleResponse<{ success: boolean; externalRef: string; message: string; netAmount: number; platformFee: number }>(res);
}

// ─── Stripe Connect ───────────────────────────────────────────────────────────

export async function getStripeConnectUrl(): Promise<string> {
    const res = await fetch(`${base}/payments/stripe/connect`, { headers: authHeaders() });
    const data = await handleResponse<{ connectUrl: string }>(res);
    return data.connectUrl;
}

export async function disconnectStripe() {
    const res = await fetch(`${base}/payments/stripe/disconnect`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse<{ success: boolean; message: string }>(res);
}

// ─── Fee preview (client-side, no API call needed) ───────────────────────────

export const SLL_TO_USD = 59;

export function previewDepositFee(method: string, amount: number) {
    if (method === 'stripe') {
        const fee = parseFloat(((amount * 2.9) / 100 + 0.30).toFixed(2));
        return { fee, total: parseFloat((amount + fee).toFixed(2)), label: '2.9% + $0.30' };
    }
    return { fee: 0, total: amount, label: 'Free' };
}

export function previewWithdrawalFee(method: string, amount: number) {
    if (method === 'stripe') {
        const fee = parseFloat(((amount * 5) / 100).toFixed(2));
        return { fee, netAmount: parseFloat((amount - fee).toFixed(2)), label: '5% platform fee' };
    }
    return { fee: 0, netAmount: amount, label: 'Free' };
}

// ─── Purchases ──────────────────────────────────────────────────────────────

export async function purchaseBook(params: {
    bookId: string;
    amount: number;
    currency: 'SLL' | 'USD';
}) {
    const res = await fetch(`${base}/purchase`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(params),
    });
    return handleResponse<{ success: boolean; message: string; purchaseId: string; transactionId: string }>(res);
}
