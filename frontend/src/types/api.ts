// User Service Types
export interface APIUser {
    id: string;
    openId: string;
    email: string | null;
    name: string | null;
    phone: string | null;
    role: 'learner' | 'seller' | 'admin' | 'support';
    loginMethod: string | null;
    lastSignedIn: Date;
    createdAt: Date;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: 'learner' | 'seller';
}

// Book Service Types
export interface APIBook {
    id: string;
    title: string;
    description: string;
    category: string;
    level: 'JSS' | 'SSS' | 'OTHER';
    subjects?: string[];
    tags?: string[];
    priceUSD: number;
    priceSLL: number;
    averageRating?: number;
    totalReviews?: number;
    coverImage?: string;
    createdBy: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface SearchBooksParams {
    query?: string;
    category?: string;
    level?: 'JSS' | 'SSS' | 'OTHER';
    subjects?: string[];
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    sortBy?: 'relevance' | 'price' | 'rating' | 'newest';
    page?: number;
    limit?: number;
}

// Wallet Service Types
export interface Wallet {
    id: string;
    userId: string;
    balanceUSD: string;
    balanceSLL: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface APITransaction {
    id: string;
    walletId: string;
    type: 'deposit' | 'withdrawal' | 'purchase' | 'earning';
    amount: string;
    currency: 'USD' | 'SLL';
    status: 'pending' | 'completed' | 'failed';
    description: string;
    createdAt: Date;
}

// Order Service Types
export interface Order {
    id: string;
    userId: string;
    bookId: string;
    amount: number;
    currency: 'USD' | 'SLL';
    status: 'pending' | 'completed' | 'failed';
    paymentMethod: 'wallet' | 'stripe' | 'orange_money';
    transactionId?: string;
    createdAt: Date;
}

// Audio Service Types
export interface ProcessedSentence {
    id: string;
    text: string;
    originalText: string;
    containsFormula: boolean;
    formulas: Formula[];
    speechText: string;
    startIndex: number;
    endIndex: number;
}

export interface Formula {
    id: string;
    latex: string;
    spoken: string;
    position: { start: number; end: number };
}

export interface ProcessTextRequest {
    text: string;
    title?: string;
}

export interface ProcessTextResponse {
    title: string;
    sentences: ProcessedSentence[];
}

// Analytics Service Types
export interface LearningPatterns {
    preferredSubjects: string[];
    readingTimes: {
        peakHours: number[];
        totalTime: number;
    };
    learningProgress: {
        totalReadingTime: number;
        booksCompleted: number;
        subjectsMastered: string[];
        readingSpeed: number;
        consistencyScore: number;
    };
    comprehensionMetrics: {
        averageScore: number;
    };
    costAnalysis: {
        totalSpent: number;
        averageDailyCost: number;
        costEfficiency: number;
    };
}

// Referral Service Types
export interface Referral {
    id: string;
    userId: string;
    code: string;
    clicks: number;
    signups: number;
    conversions: number;
    totalEarnings: number;
    createdAt: Date;
}

// Notification Service Types
export interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
}

// Common Types
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface ApiError {
    error: string;
    message?: string;
    statusCode?: number;
}
