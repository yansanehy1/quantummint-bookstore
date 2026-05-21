// Centralized API Client for QuantumMint Bookstore
// Handles all backend API communications

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const TTS_SERVICE_URL = import.meta.env.VITE_TTS_SERVICE_URL || 'http://localhost:7001/tts';
// const MEDIA_SYNC_URL = import.meta.env.VITE_MEDIA_SYNC_URL || 'http://localhost:7004/sync';


// Types
import type { 
    Book, 
    Chapter, 
    User, 
    Subscription, 
    Transaction, 
    Review, 
    AuditLogEntry, 
    UserGroup,
    SearchResults,
    SellerProfile,
    Note,
    RefundRequest,
    EligiblePurchase
} from '../types/types';
import * as Sentry from "@sentry/react";

export interface FormulaToken {
    symbol: string;
    spoken: string;
    definition: string;
    metadata?: Record<string, unknown>;
}

export interface FormulaBreakdown {
    formulaId?: string;
    formula: string;
    tokens: FormulaToken[];
}

export interface BookInteraction {
    tokenId?: string;
    formulaId?: string;
    action: string;
    metadata?: Record<string, unknown>;
}

export interface SellerEarnings {
    summary: {
        totalEarningsUSD: number;
        totalEarningsSLL: number;
        pendingPayoutUSD: number;
        pendingPayoutSLL: number;
        totalSales: number;
        publishedBooks: number;
    };
    recentPayouts: Transaction[];
    earningsByBook: Array<{
        bookId: string;
        title: string;
        earningsUSD: number;
        earningsSLL: number;
    }>;
}

export interface EducationalSegment {
    id: string;
    type: 'text' | 'math' | 'chemistry' | 'step';
    content: string;
    original?: string;
    metadata?: Record<string, unknown>;
}

export interface EducationalPage {
    id: string | number;
    content: string;
    segments?: EducationalSegment[];
    title?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

async function fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('auth_token');
    const correlationId = crypto.randomUUID();

    // Set correlation ID for Sentry
    Sentry.setTag("correlation_id", correlationId);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            const errorMsg = error.message || error.error || `HTTP ${response.status}`;
            
            // Log to Sentry with context
            Sentry.captureException(new Error(errorMsg), {
                extra: {
                    endpoint,
                    status: response.status,
                    correlationId
                }
            });

            throw new Error(errorMsg);
        }

        return response.json();
    } catch (err) {
        if (!(err instanceof Error)) {
            Sentry.captureException(new Error(String(err)));
        }
        throw err;
    }
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
        name: string;
        email: string;
        password: string;
        role?: string;
    }): Promise<{ user: User; token: string }> {
        const data = await fetchAPI<{ user: User; token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: userData.role,
            }),
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
        const params = new URLSearchParams(filters as Record<string, string>);
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
    async synthesizeChapter(
        options: {
            text: string;
            voice?: string;
            speed?: number;
            pitch?: number;
            language?: string;
        },
        fetchOptions: { signal?: AbortSignal } = {}
    ): Promise<{ audioUrl: string; durationMs: number }> {
        return fetchAPI<{ audioUrl: string; durationMs: number }>('/tts/synthesize', {
            method: 'POST',
            body: JSON.stringify({
                text: options.text,
                voiceId: options.voice,
                speed: options.speed,
                pitch: options.pitch,
                language: options.language || 'en'
            }),
            signal: fetchOptions.signal
        });
    },

    async getVoices(): Promise<Array<{ id: string; name: string; language: string }>> {
        return fetchAPI<Array<{ id: string; name: string; language: string }>>('/tts/voices');
    },

    async getFormulaBreakdown(formula: string): Promise<{ formula: string; tokens: Array<{ symbol: string; spoken: string; definition: string }> }> {
        return fetchAPI<{ formula: string; tokens: Array<{ symbol: string; spoken: string; definition: string }> }>('/tts/breakdown', {
            method: 'POST',
            body: JSON.stringify({ formula })
        });
    },

    async synthesizeMulti(segments: Array<{ text: string; voice: string; role: string }>, bookId?: string): Promise<{ audioBytes: number[]; durationSeconds: number }> {
        return fetchAPI<{ audioBytes: number[]; durationSeconds: number }>('/tts/multi', {
            method: 'POST',
            body: JSON.stringify({ segments, bookId })
        });
    },

    async getStreamUrl(text: string, voiceId?: string, bookId?: string): Promise<string> {
        const token = localStorage.getItem('auth_token');
        const baseUrl = process.env.VITE_API_URL || '';
        return `${baseUrl}/api/tts/stream-url?text=${encodeURIComponent(text)}&voiceId=${voiceId || ''}&bookId=${bookId || ''}&token=${token || ''}`;
    }
};

// ============================================================================
// Formula Management
// ============================================================================

export const formulaAPI = {
    async narrate(formula: string, bookId?: string, field?: string): Promise<FormulaBreakdown> {
        return fetchAPI('/formula/narrate', {
            method: 'POST',
            body: JSON.stringify({ formula, bookId, field })
        });
    },

    async getTokens(formulaId: string): Promise<FormulaToken[]> {
        return fetchAPI(`/formula/${formulaId}/tokens`);
    },
};

// ============================================================================
// Learner Interactions
// ============================================================================

export const interactionAPI = {
    async logInteraction(data: BookInteraction): Promise<void> {
        return fetchAPI('/interaction', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getAnalytics(params?: { bookId?: string; userId?: string }): Promise<Array<{
        action: string;
        count: number;
        date: string;
    }>> {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return fetchAPI(`/interaction/analytics?${query}`);
    },
};

// ============================================================================
// Global Search
// ============================================================================

export const searchAPI = {
    async deepSearch(query: string): Promise<SearchResults> {
        return fetchAPI<SearchResults>(`/search?q=${encodeURIComponent(query)}`);
    },
};

// ============================================================================
// Subscriptions API (User)
// ============================================================================

export interface SubscriptionPlan {
    id: string;
    durationHours: number;
    priceSLL: number;
    priceUSD: number;
    priceSLLinUSD: number;
}

export const subscriptionsAPI = {
    async getPlans(): Promise<{ plans: SubscriptionPlan[]; exchangeRate: number }> {
        return fetchAPI('/subscriptions/plans');
    },

    async getCurrent(): Promise<Subscription | null> {
        return fetchAPI<Subscription | null>('/subscriptions/current');
    },

    async subscribe(
        planId: '12hours' | '24hours' | '7days' | '30days',
        currency: 'USD' | 'SLL' = 'SLL'
    ): Promise<Subscription> {
        return fetchAPI<Subscription>('/subscriptions', {
            method: 'POST',
            body: JSON.stringify({ planId, currency }),
        });
    },

    async upgrade(
        planId: '12hours' | '24hours' | '7days' | '30days',
        currency: 'USD' | 'SLL' = 'SLL'
    ): Promise<Subscription> {
        return fetchAPI<Subscription>('/subscriptions/upgrade', {
            method: 'POST',
            body: JSON.stringify({ planId, currency }),
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

    async subscribeBatch(data: {
        planId: string;
        currency: 'USD' | 'SLL';
        recipientEmails: string[];
    }): Promise<{ success: boolean; processedCount: number; missingEmails: string[] }> {
        return fetchAPI('/subscriptions/batch', {
            method: 'POST',
            body: JSON.stringify(data),
        });
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
        const params = new URLSearchParams(filters as Record<string, string>);
        return fetchAPI<Transaction[]>(`/admin/transactions?${params}`);
    },

    async approveTransaction(transactionId: string): Promise<void> {
        return fetchAPI<void>(`/admin/transactions/${transactionId}/approve`, {
            method: 'POST',
        });
    },

    async getSellerProfiles(): Promise<SellerProfile[]> {
        return fetchAPI('/admin/sellers');
    },

    async updateSellerStatus(id: string, status: 'active' | 'rejected'): Promise<{ success: boolean; seller: SellerProfile }> {
        return fetchAPI(`/admin/sellers/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    },

    async getAllBooks(): Promise<Book[]> {
        return fetchAPI('/admin/books');
    },

    async updateBookStatus(id: string, data: { status: string; rejectionReason?: string }): Promise<{ success: boolean; book: Book }> {
        return fetchAPI(`/admin/books/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async bulkUpdateBookStatus(data: { ids: string[]; status: string; rejectionReason?: string }): Promise<{ success: boolean; count: number }> {
        return fetchAPI('/admin/books/bulk-status', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getAllUsers(): Promise<User[]> {
        return fetchAPI('/admin/users');
    },

    async updateUserRole(data: { userId: string; role: string }): Promise<{ success: boolean; role: string }> {
        return fetchAPI('/admin/users/role', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async adjustUserBalance(data: { 
        userId: string; 
        amount: number; 
        currency: 'USD' | 'SLL'; 
        type?: string; 
        description?: string 
    }): Promise<{ success: boolean; balance: string }> {
        return fetchAPI('/admin/users/adjust-balance', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getAdminStats(): Promise<{
        totalSellers: number;
        pendingSellers: number;
        totalBooks: number;
        pendingBooks: number;
        pendingRefunds: number;
        platformRevenueUSD: number;
        platformRevenueSLL: number;
    }> {
        return fetchAPI('/admin/stats');
    },

    async getSubscriptionPlans(): Promise<{ plans: SubscriptionPlan[]; exchangeRate: number }> {
        return fetchAPI('/subscriptions/plans');
    },

    async getAuditLogs(filters?: { action?: string; targetId?: string }): Promise<{
        logs: AuditLogEntry[];
        total: number;
        limit: number;
        offset: number;
    }> {
        const query = filters ? `?${new URLSearchParams(filters as Record<string, string>).toString()}` : '';
        return fetchAPI(`/admin/logs${query}`);
    },

    async getHealthStatus(): Promise<{
        status: string;
        services: Array<{ label: string; status: string; latency: string }>;
    }> {
        return fetchAPI('/admin/health');
    },

    async getPayoutRequests(): Promise<Transaction[]> {
        return fetchAPI('/admin/payouts');
    },

    async processPayout(id: string, data: { status: string; rejectionReason?: string }): Promise<{ success: boolean; transaction: Transaction }> {
        return fetchAPI(`/admin/payouts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async giftBook(data: { bookId: string; userId?: string; recipientType: 'individual' | 'all'; message?: string }): Promise<{ success: boolean; count?: number }> {
        return fetchAPI('/admin/gift-book', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getRefundStats(): Promise<{
        pending: number;
        approved: number;
        rejected: number;
        total: number;
        totalRefundedSLL: number;
        totalRefundedUSD: number;
    }> {
        return fetchAPI('/admin/refunds/stats');
    },

    async getRefundRequests(params?: { status?: string; limit?: number; offset?: number }): Promise<{
        refunds: RefundRequest[];
        total: number;
        limit: number;
        offset: number;
    }> {
        const qs = new URLSearchParams();
        if (params?.status) qs.set('status', params.status);
        if (params?.limit) qs.set('limit', String(params.limit));
        if (params?.offset) qs.set('offset', String(params.offset));
        const query = qs.toString() ? `?${qs}` : '';
        return fetchAPI(`/admin/refunds${query}`);
    },

    async processRefund(id: string, data: { status: 'approved' | 'rejected'; adminNotes?: string }): Promise<{ success: boolean; message: string }> {
        return fetchAPI(`/admin/refunds/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // ============================================================================
    // CUG & Batch Subscriptions (Admin)
    // ============================================================================
    async createGroup(data: {
        name: string;
        description?: string;
        type: 'CUG' | 'ORGANIZATION' | 'GOVERNMENT' | 'PRIVATE';
        sponsorId?: string;
        maxMembers?: number;
        prepaidBalance?: number;
        currency: 'USD' | 'SLL';
    }): Promise<{ success: boolean; group: UserGroup }> {
        return fetchAPI('/groups', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async listGroups(): Promise<UserGroup[]> {
        return fetchAPI('/groups');
    },

    async activateGroup(groupId: string): Promise<{ success: boolean; group: UserGroup }> {
        return fetchAPI(`/groups/${groupId}/activate`, {
            method: 'POST'
        });
    },

    async adjustGroupBalance(groupId: string, data: { amount: number; description?: string }): Promise<{ success: boolean; balance: string }> {
        return fetchAPI(`/groups/${groupId}/balance`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async addGroupMembers(groupId: string, userEmails: string[]): Promise<{ success: boolean; addedCount: number; missingEmails: string[] }> {
        return fetchAPI(`/groups/${groupId}/members`, {
            method: 'POST',
            body: JSON.stringify({ userEmails })
        });
    },

    async activateGroupSubscriptions(groupId: string, planId: string): Promise<{ success: boolean; message: string }> {
        return fetchAPI(`/groups/${groupId}/subscriptions`, {
            method: 'POST',
            body: JSON.stringify({ planId })
        });
    },
};

// ============================================================================
// Book Drafts (Creator)
// ============================================================================

export interface BookDraft {
    id: string;
    title?: string;
    metadata: any;
    pages: any[];
    selectedVoiceId: string;
    lastSavedAt: string;
}

export const draftsAPI = {
    async saveDraft(data: Partial<BookDraft>): Promise<{ success: boolean; draft: BookDraft }> {
        return fetchAPI('/drafts', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getDrafts(): Promise<BookDraft[]> {
        return fetchAPI('/drafts');
    },

    async getDraft(id: string): Promise<BookDraft> {
        return fetchAPI(`/drafts/${id}`);
    },

    async deleteDraft(id: string): Promise<{ success: boolean; message: string }> {
        return fetchAPI(`/drafts/${id}`, {
            method: 'DELETE'
        });
    },
};

// ============================================================================
// Refunds (Learner)
// ============================================================================

export interface RefundRequest {
    id: string;
    userId: string;
    purchaseId: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    adminNotes?: string | null;
    amount: number;
    currency: 'USD' | 'SLL';
    createdAt: string;
    Purchase?: {
        Book?: { title?: string; coverUrl?: string };
    };
}

export interface EligiblePurchase {
    id: string;
    amount: number;
    currency: 'USD' | 'SLL';
    createdAt: string;
    book?: { id: string; title?: string; coverUrl?: string };
}

export const refundsAPI = {
    async getEligiblePurchases(): Promise<EligiblePurchase[]> {
        return fetchAPI('/refunds/eligible-purchases');
    },

    async submit(data: { purchaseId: string; reason: string }): Promise<{ success: boolean; message: string; refundRequest: RefundRequest }> {
        return fetchAPI('/refunds', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async getMyRefunds(): Promise<RefundRequest[]> {
        return fetchAPI('/refunds');
    },
};

// ============================================================================
// Learner Management
// ============================================================================

export const learnerAPI = {
    // Notes
    async getNotes(bookId?: string): Promise<Note[]> {
        return fetchAPI(`/learner/notes${bookId ? `?bookId=${bookId}` : ''}`);
    },
    async createNote(data: { bookId: string | number; pageId: number; content: string; color?: string; highlightText?: string }): Promise<{ success: boolean; note: Note }> {
        return fetchAPI('/learner/notes', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    async deleteNote(id: string): Promise<{ success: boolean }> {
        return fetchAPI(`/learner/notes/${id}`, {
            method: 'DELETE'
        });
    },

    // SRS
    async getDueNotes(): Promise<Array<{
        id: string;
        content: string;
        nextReview: string;
        Book: { title: string; coverUrl: string };
    }>> {
        return fetchAPI('/learner/srs/due');
    },
    async reviewNote(id: string, rating: number): Promise<{ success: boolean; nextReview: string }> {
        return fetchAPI(`/learner/srs/review/${id}`, {
            method: 'POST',
            body: JSON.stringify({ rating })
        });
    },

    // Reading Sessions
    async startSession(bookId: string | number): Promise<{ sessionId: string }> {
        return fetchAPI('/learner/sessions/start', {
            method: 'POST',
            body: JSON.stringify({ bookId })
        });
    },
    async updateSession(id: string, data: { pagesRead?: string[]; durationSeconds?: number }): Promise<{ success: boolean }> {
        return fetchAPI(`/learner/sessions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    async getAnalytics(): Promise<{
        totalReadingTime: number;
        booksRead: number;
        streak: number;
        dailyProgress: Array<{ date: string; minutes: number }>;
    }> {
        return fetchAPI('/learner/analytics');
    },

    // Leaderboards
    async getLeaderboard(): Promise<Array<{
        id: string;
        name: string;
        readingTime: number;
        rank: number;
    }>> {
        return fetchAPI('/learner/leaderboard');
    },

    // Recommendations
    async getRecommendations(): Promise<Book[]> {
        return fetchAPI('/learner/recommendations');
    },

    // Quizzes
    async getQuiz(bookId: string | number, chapterId?: number): Promise<{
        id: string;
        questions: Array<{
            id: string;
            question: string;
            options: string[];
            correctAnswer: number;
            explanation?: string;
        }>;
    }> {
        return fetchAPI(`/learner/quiz?bookId=${bookId}${chapterId ? `&chapterId=${chapterId}` : ''}`);
    }
};

// ============================================================================
// Educational Processing
// ============================================================================

export const sellerAPI = {
    async register(data: {
        businessName: string;
        businessInfo?: Record<string, unknown>;
        taxInfo?: Record<string, unknown>;
        paymentDetails?: Record<string, unknown>;
    }): Promise<{ success: boolean; seller: any }> {
        return fetchAPI('/sellers/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getProfile(): Promise<{
        id: string;
        businessName: string;
        status: string;
        commissionRate: number;
        User: { name: string; email: string };
    }> {
        return fetchAPI('/sellers/profile');
    },

    async getEarnings(): Promise<SellerEarnings> {
        return fetchAPI('/sellers/earnings');
    },

    async requestPayout(data: {
        amount: number;
        currency: 'USD' | 'SLL';
        method: string;
    }): Promise<{ success: boolean; transaction: Transaction }> {
        return fetchAPI('/sellers/payout', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getVoices(): Promise<Array<{
        id: string;
        name: string;
        previewUrl: string;
    }>> {
        return fetchAPI('/sellers/voices');
    }
};

// ============================================================================
// Educational Processing
// ============================================================================

export const educationalAPI = {
    async processBulk(data: {
        bookId: string;
        pages: EducationalPage[];
    }): Promise<{ success: boolean; message: string; results: any[] }> {
        return fetchAPI('/educational/process-bulk', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async extractText(file: File): Promise<{ text: string }> {
        const formData = new FormData();
        formData.append('file', file);
        
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/educational/processing/extract-text`, {
            method: 'POST',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
                'X-Correlation-ID': crypto.randomUUID(),
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to extract text');
        }

        return response.json();
    }
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
    formula: formulaAPI,
    interaction: interactionAPI,
    search: searchAPI,
    subscriptions: subscriptionsAPI,
    usage: usageAPI,
    payments: paymentsAPI,
    earnings: earningsAPI,
    library: libraryAPI,
    admin: adminAPI,
    refunds: refundsAPI,
    educational: educationalAPI,
    seller: sellerAPI,
    learner: learnerAPI,
    referrals: referralsAPI,
};
