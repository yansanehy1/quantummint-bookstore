import { walletClient } from '../client';
import type { Wallet, Transaction } from '../../types/api';

export const walletService = {
    /**
     * Get wallet by user ID
     */
    async getWallet(userId: string): Promise<Wallet> {
        return walletClient.get<Wallet>(`/wallets/${userId}`);
    },

    /**
     * Get transaction history
     */
    async getTransactions(userId: string, limit = 50): Promise<Transaction[]> {
        return walletClient.get<Transaction[]>(`/wallets/${userId}/transactions`, {
            params: { limit },
        });
    },

    /**
     * Deposit funds
     */
    async deposit(userId: string, amount: number, currency: 'USD' | 'SLL'): Promise<Transaction> {
        return walletClient.post<Transaction>(`/wallets/${userId}/deposit`, {
            amount,
            currency,
        });
    },

    /**
     * Withdraw funds
     */
    async withdraw(userId: string, amount: number, currency: 'USD' | 'SLL'): Promise<Transaction> {
        return walletClient.post<Transaction>(`/wallets/${userId}/withdraw`, {
            amount,
            currency,
        });
    },

    /**
     * Credit wallet (internal use)
     */
    async credit(userId: string, amount: number, currency: 'USD' | 'SLL', type: string, transactionId?: string): Promise<void> {
        return walletClient.post(`/wallets/${userId}/credit`, {
            amount,
            currency,
            type,
            transactionId,
        });
    },
};
