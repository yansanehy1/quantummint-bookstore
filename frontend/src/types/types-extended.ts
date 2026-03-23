// TypeScript interfaces for the audiobook platform
import { VoiceProfile, Book, Chapter, User } from './types';

// Book, Chapter, User moved to types.ts

export interface Subscription {
    tier: 'halfDay' | 'daily' | 'weekly' | 'monthly';
    startDate: string;
    endDate: string;
    isActive: boolean;
    autoRenew: boolean;
}

export interface UsageSession {
    id: string;
    userId: string;
    bookId: string;
    startTime: string;
    duration: number; // in seconds
    cost: number | null; // null if subscribed
    endTime?: string;
}

export interface CreatorEarnings {
    creatorId: string;
    totalEarnings: number;
    subscriptionRevenue: number;
    payPerUseRevenue: number;
    bookEarnings: BookEarnings[];
    withdrawals: Withdrawal[];
}

export interface BookEarnings {
    bookId: string;
    bookTitle: string;
    totalListeningTime: number; // in seconds
    earnings: number;
    listenerCount: number;
}

export interface Withdrawal {
    id: string;
    amount: number;
    date: string;
    status: 'pending' | 'completed' | 'failed';
}

export interface Cue {
    type: 'visual' | 'formula' | 'step';
    atMs: number;
    payload: any;
}

// Pricing configuration
export const PRICING = {
    payPerUse: {
        perHourSLL: 1, // SLL 1 per hour
        perHourUSD: 0.017, // $0.017 per hour
        perMinuteSLL: 1 / 60, // SLL 0.0167 per minute
        perMinuteUSD: 0.017 / 60, // $0.000283 per minute
    },
    subscription: {
        // 12 hours
        halfDay: {
            sll: 3,
            usd: 0.051,
            hours: 12,
        },
        // 24 hours (1 day)
        daily: {
            sll: 5,
            usd: 0.085,
            hours: 24,
        },
        // 7 days (weekly)
        weekly: {
            sll: 10,
            usd: 0.170,
            hours: 168, // 7 * 24
        },
        // 30 days (monthly)
        monthly: {
            sll: 17,
            usd: 0.289,
            hours: 720, // 30 * 24
        },
    },
    revenueShare: {
        creator: 0.75, // 75%
        platform: 0.25, // 25%
    },
};

// Exchange rate
export const EXCHANGE_RATE = {
    SLL_TO_USD: 0.017, // 1 SLL = $0.017
    USD_TO_SLL: 58.82, // $1 = 58.82 SLL (1 / 0.017)
};

// Payment methods
export type PaymentMethod = 'orange_money' | 'afrimoney' | 'qmoney' | 'stripe';

export interface PaymentMethodConfig {
    method: PaymentMethod;
    name: string;
    icon: string;
    minDeposit: number; // SLL
    maxDeposit: number; // SLL
    minWithdrawal: number; // SLL
    maxWithdrawal: number; // SLL
    depositFee: number; // percentage (0-100)
    withdrawalFee: number; // percentage (0-100)
    currency: 'SLL' | 'USD';
    processingTime: string;
    requiresConnection: boolean; // true for Stripe
}

// Payment System Types moved to payments.ts

export interface UserPaymentAccount {
    userId: string;
    paymentMethod: PaymentMethod;
    accountIdentifier: string; // phone number for mobile money, Stripe account ID for Stripe
    isVerified: boolean;
    isPrimary: boolean;
    createdAt: string;
    stripeAccountId?: string; // Only for Stripe
}

// Transaction moved to payments.ts

// Voice Cloning Types
export interface VoiceClone {
    id: string;
    name: string;
    description?: string;
    status: 'processing' | 'completed' | 'failed';
    audioUrl?: string;
    sampleAudioUrl?: string;
    createdAt: string;
    creatorId: string;
    isDefault: boolean;
    trainingProgress?: number; // 0-100
}

export interface VoiceRecording {
    blob: Blob;
    url: string;
    duration: number;
    sampleRate: number;
}

export interface VoiceUploadResponse {
    voiceId: string;
    status: 'processing' | 'completed' | 'failed';
    message?: string;
}

// Voice Profile Types
// VoiceProfile moved to types.ts

export const FREE_VOICE_PROFILES: VoiceProfile[] = [
    {
        id: 'sarah_narrative',
        name: 'Sarah - Storyteller',
        description: 'Warm, engaging voice perfect for storytelling and educational content',
        language: 'English',
        accent: 'American',
        gender: 'female',
        age: 'adult',
        style: 'narrative',
        sampleAudioUrl: '/samples/sarah_narrative.mp3',
        isPremium: false,
        isCustom: false,
        tags: ['storytelling', 'educational', 'warm'],
        rating: 4.8,
        usageCount: 15420
    },
    {
        id: 'james_professional',
        name: 'James - Professional',
        description: 'Clear, authoritative voice ideal for business and technical content',
        language: 'English',
        accent: 'British',
        gender: 'male',
        age: 'mature',
        style: 'professional',
        sampleAudioUrl: '/samples/james_professional.mp3',
        isPremium: false,
        isCustom: false,
        tags: ['business', 'technical', 'authoritative'],
        rating: 4.7,
        usageCount: 12350
    },
    {
        id: 'emma_conversational',
        name: 'Emma - Conversational',
        description: 'Friendly, natural voice great for casual learning and podcasts',
        language: 'English',
        accent: 'American',
        gender: 'female',
        age: 'young',
        style: 'conversational',
        sampleAudioUrl: '/samples/emma_conversational.mp3',
        isPremium: false,
        isCustom: false,
        tags: ['casual', 'friendly', 'podcast'],
        rating: 4.9,
        usageCount: 18930
    },
    {
        id: 'david_dramatic',
        name: 'David - Dramatic',
        description: 'Expressive, dynamic voice perfect for fiction and dramatic content',
        language: 'English',
        accent: 'American',
        gender: 'male',
        age: 'adult',
        style: 'dramatic',
        sampleAudioUrl: '/samples/david_dramatic.mp3',
        isPremium: false,
        isCustom: false,
        tags: ['fiction', 'drama', 'expressive'],
        rating: 4.6,
        usageCount: 9870
    },
    {
        id: 'lisa_calm',
        name: 'Lisa - Calm & Soothing',
        description: 'Gentle, soothing voice ideal for meditation and relaxation content',
        language: 'English',
        accent: 'American',
        gender: 'female',
        age: 'adult',
        style: 'narrative',
        sampleAudioUrl: '/samples/lisa_calm.mp3',
        isPremium: false,
        isCustom: false,
        tags: ['meditation', 'relaxation', 'gentle'],
        rating: 4.8,
        usageCount: 11200
    },
    {
        id: 'michael_energetic',
        name: 'Michael - Energetic',
        description: 'Upbeat, energetic voice great for motivational and educational content',
        language: 'English',
        accent: 'American',
        gender: 'male',
        age: 'young',
        style: 'conversational',
        sampleAudioUrl: '/samples/michael_energetic.mp3',
        isPremium: false,
        isCustom: false,
        tags: ['motivational', 'energetic', 'educational'],
        rating: 4.5,
        usageCount: 8900
    },
    {
        id: 'sophia_academic',
        name: 'Sophia - Academic',
        description: 'Clear, precise voice perfect for academic and educational materials',
        language: 'English',
        accent: 'Neutral',
        gender: 'female',
        age: 'adult',
        style: 'professional',
        sampleAudioUrl: '/samples/sophia_academic.mp3',
        isPremium: false,
        isCustom: false,
        tags: ['academic', 'educational', 'precise'],
        rating: 4.7,
        usageCount: 14560
    },
    {
        id: 'robert_classic',
        name: 'Robert - Classic Narrator',
        description: 'Traditional narrator voice with rich, warm tone for classic literature',
        language: 'English',
        accent: 'British',
        gender: 'male',
        age: 'mature',
        style: 'narrative',
        sampleAudioUrl: '/samples/robert_classic.mp3',
        isPremium: false,
        isCustom: false,
        tags: ['classic', 'literature', 'warm'],
        rating: 4.9,
        usageCount: 22100
    }
];
