// Centralized API Client for QuantumMint Bookstore
// Handles all backend API communications

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const TTS_SERVICE_URL = import.meta.env.VITE_TTS_SERVICE_URL || 'http://localhost:7001/tts';
// const MEDIA_SYNC_URL = import.meta.env.VITE_MEDIA_SYNC_URL || 'http://localhost:7004/sync';


// Types
import type { Book, Chapter, User, Subscription, Transaction } from '../types';

// ============================================================================
// Helper Functions
// ============================================================================

async function fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('auth_token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
}

// ============================================================================
// Authentication
// ============================================================================

export const authAPI = {
    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        const data = await fetchAPI<{ user: User; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    },

    async register(userData: {
        fullName: string;
        email: string;
        password: string;
        role: 'learner' | 'creator';
    }): Promise<{ user: User; token: string }> {
        const data = await fetchAPI<{ user: User; token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    },

    async logout(): Promise<void> {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    },
};

// ============================================================================
// Books Management
// ============================================================================

export const booksAPI = {
    async getAll(filters?: {
        genre?: string;
        search?: string;
        sortBy?: 'newest' | 'popular' | 'rating';
    }): Promise<Book[]> {
        const params = new URLSearchParams(filters as any);
        return fetchAPI<Book[]>(`/books?${params}`);
    },

    async getById(id: string): Promise<Book> {
        return fetchAPI<Book>(`/books/${id}`);
    },

    async create(bookData: Partial<Book>): Promise<Book> {
        return fetchAPI<Book>('/books', {
            method: 'POST',
            body: JSON.stringify(bookData),
        });
    },

    async update(id: string, bookData: Partial<Book>): Promise<Book> {
        return fetchAPI<Book>(`/books/${id}`, {
            method: 'PUT',
            body: JSON.stringify(bookData),
        });
    },

    async delete(id: string): Promise<void> {
        return fetchAPI<void>(`/books/${id}`, {
            method: 'DELETE',
        });
    },

    async publish(id: string): Promise<Book> {
        return fetchAPI<Book>(`/books/${id}/publish`, {
            method: 'POST',
        });
    },

    async getMyBooks(): Promise<Book[]> {
        return fetchAPI<Book[]>('/books/my-books');
    },
};

// ============================================================================
// TTS Service
// ============================================================================

export const ttsAPI = {
    async synthesizeChapter(chapterText: string, voice?: string): Promise<{ audioUrl: string; duration: number }> {
        const response = await fetch(`${TTS_SERVICE_URL}/synthesize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: chapterText, voice }),
        });

        if (!response.ok) {
            throw new Error('TTS synthesis failed');
        }

        return response.json();
    },

    async getVoices(): Promise<Array<{ id: string; name: string; language: string }>> {
        const response = await fetch(`${TTS_SERVICE_URL}/voices`);
        return response.json();
    },
};

// ============================================================================
// Subscriptions
// ============================================================================

export const subscriptionsAPI = {
    async getCurrent(): Promise<Subscription | null> {
        return fetchAPI<Subscription | null>('/subscriptions/current');
    },

    async subscribe(tier: '12hours' | '24hours' | '7days' | '30days'): Promise<Subscription> {
        return fetchAPI<Subscription>('/subscriptions', {
            method: 'POST',
            body: JSON.stringify({ tier }),
        });
    },

    async upgrade(tier: '12hours' | '24hours' | '7days' | '30days'): Promise<Subscription> {
        return fetchAPI<Subscription>('/subscriptions/upgrade', {
            method: 'POST',
            body: JSON.stringify({ tier }),
        });
    },

    async cancel(): Promise<void> {
        return fetchAPI<void>('/subscriptions/cancel', {
            method: 'POST',
        });
    },

    async getHistory(): Promise<Subscription[]> {
        return fetchAPI<Subscription[]>('/subscriptions/history');
    },
};

// ============================================================================
// Usage Tracking
// ============================================================================

export const usageAPI = {
    async startSession(bookId: string, chapterId: string): Promise<{ sessionId: string }> {
        return fetchAPI<{ sessionId: string }>('/usage/start', {
            method: 'POST',
            body: JSON.stringify({ bookId, chapterId }),
        });
    },

    async updateSession(sessionId: string, duration: number): Promise<void> {
        return fetchAPI<void>('/usage/update', {
            method: 'POST',
            body: JSON.stringify({ sessionId, duration }),
        });
    },

    async endSession(sessionId: string, totalDuration: number): Promise<{ cost: number }> {
        return fetchAPI<{ cost: number }>('/usage/end', {
            method: 'POST',
            body: JSON.stringify({ sessionId, totalDuration }),
        });
    },

    async getHistory(): Promise<Array<{
        bookId: string;
        bookTitle: string;
        duration: number;
        cost: number;
        date: string;
    }>> {
        return fetchAPI('/usage/history');
    },
};

// ============================================================================
// Payments & Wallet
// ============================================================================

export const paymentsAPI = {
    async deposit(amount: number, method: 'qmoney' | 'orange' | 'afrimoney' | 'stripe'): Promise<Transaction> {
        return fetchAPI<Transaction>('/payments/deposit', {
            method: 'POST',
            body: JSON.stringify({ amount, method }),
        });
    },

    async withdraw(amount: number, method: 'qmoney' | 'orange' | 'afrimoney' | 'stripe', accountNumber: string): Promise<Transaction> {
        return fetchAPI<Transaction>('/payments/withdraw', {
            method: 'POST',
            body: JSON.stringify({ amount, method, accountNumber }),
        });
    },

    async getBalance(): Promise<{ sll: number; usd: number }> {
        return fetchAPI<{ sll: number; usd: number }>('/payments/balance');
    },

    async getTransactions(): Promise<Transaction[]> {
        return fetchAPI<Transaction[]>('/payments/transactions');
    },

    async requestPayout(amount: number): Promise<Transaction> {
        return fetchAPI<Transaction>('/payments/payout', {
            method: 'POST',
            body: JSON.stringify({ amount }),
        });
    },
};

// ============================================================================
// Creator Earnings
// ============================================================================

export const earningsAPI = {
    async getEarnings(): Promise<{
        totalEarnings: number;
        subscriptionRevenue: number;
        payPerUseRevenue: number;
        pendingPayout: number;
    }> {
        return fetchAPI('/earnings');
    },

    async getBookEarnings(bookId: string): Promise<{
        bookId: string;
        totalEarnings: number;
        totalListeners: number;
        totalListeningTime: number;
    }> {
        return fetchAPI(`/earnings/book/${bookId}`);
    },

    async getPayoutHistory(): Promise<Array<{
        id: string;
        amount: number;
        method: string;
        status: 'pending' | 'completed' | 'failed';
        date: string;
    }>> {
        return fetchAPI('/earnings/payouts');
    },
};

// ============================================================================
// Library & Reading Progress
// ============================================================================

export const libraryAPI = {
    async getLibrary(): Promise<Book[]> {
        return fetchAPI<Book[]>('/library');
    },

    async addToLibrary(bookId: string): Promise<void> {
        return fetchAPI<void>('/library/add', {
            method: 'POST',
            body: JSON.stringify({ bookId }),
        });
    },

    async removeFromLibrary(bookId: string): Promise<void> {
        return fetchAPI<void>(`/library/${bookId}`, {
            method: 'DELETE',
        });
    },

    async getProgress(bookId: string): Promise<{
        currentChapter: number;
        currentPosition: number;
        lastAccessedAt: string;
    }> {
        return fetchAPI(`/library/${bookId}/progress`);
    },

    async updateProgress(bookId: string, chapterNumber: number, position: number): Promise<void> {
        return fetchAPI<void>(`/library/${bookId}/progress`, {
            method: 'PUT',
            body: JSON.stringify({ chapterNumber, position }),
        });
    },
};

// ============================================================================
// Admin Functions
// ============================================================================

export const adminAPI = {
    async getStats(): Promise<{
        totalUsers: number;
        totalBooks: number;
        totalRevenue: number;
        activeSubscriptions: number;
    }> {
        return fetchAPI('/admin/stats');
    },

    async getBooks(status?: 'pending' | 'approved' | 'rejected'): Promise<Book[]> {
        const params = status ? `?status=${status}` : '';
        return fetchAPI<Book[]>(`/admin/books${params}`);
    },

    async approveBook(bookId: string): Promise<void> {
        return fetchAPI<void>(`/admin/books/${bookId}/approve`, {
            method: 'POST',
        });
    },

    async rejectBook(bookId: string, reason: string): Promise<void> {
        return fetchAPI<void>(`/admin/books/${bookId}/reject`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    },

    async getTransactions(filters?: { status?: string; type?: string }): Promise<Transaction[]> {
        const params = new URLSearchParams(filters as any);
        return fetchAPI<Transaction[]>(`/admin/transactions?${params}`);
    },

    async approveTransaction(transactionId: string): Promise<void> {
        return fetchAPI<void>(`/admin/transactions/${transactionId}/approve`, {
            method: 'POST',
        });
    },
};

// ============================================================================
// Referrals
// ============================================================================

export const referralsAPI = {
    async getReferralCode(): Promise<{ code: string; link: string }> {
        return fetchAPI('/referrals/code');
    },

    async getReferrals(): Promise<Array<{
        id: string;
        name: string;
        email: string;
        status: 'pending' | 'active';
        joinedDate: string;
        earnings: number;
    }>> {
        return fetchAPI('/referrals');
    },

    async getTotalEarnings(): Promise<{ total: number; pending: number }> {
        return fetchAPI('/referrals/earnings');
    },
};

// Export all APIs
export default {
    auth: authAPI,
    books: booksAPI,
    tts: ttsAPI,
    subscriptions: subscriptionsAPI,
    usage: usageAPI,
    payments: paymentsAPI,
    earnings: earningsAPI,
    library: libraryAPI,
    admin: adminAPI,
    referrals: referralsAPI,
};
