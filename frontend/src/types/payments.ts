// ============================================================
// QuantumMint Payment Systems – Type Definitions
// ============================================================

export type PaymentMethod = 'orange_money' | 'afrimoney' | 'qmoney' | 'stripe';
export type Currency = 'SLL' | 'USD';
export type TransactionType = 'deposit' | 'purchase' | 'withdrawal' | 'referral_bonus' | 'gift';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'processing';

// SLL to USD exchange rate (Le 59 = $1)
export const SLL_TO_USD_RATE = 59;

export interface PaymentConfig {
    method: PaymentMethod;
    label: string;
    icon: string;
    color: string;
    bgColor: string;
    borderColor: string;
    currency: Currency;
    minDeposit: number;   // in primary currency
    maxDeposit: number;
    minWithdrawal: number;
    maxWithdrawal: number | null;
    depositFee: number;   // percentage (0 = free)
    depositFeeFixed: number; // fixed fee in USD (for Stripe)
    withdrawalFee: number; // percentage
    processingTime: string;
    features: string[];
}

export const PAYMENT_CONFIGS: Record<PaymentMethod, PaymentConfig> = {
    orange_money: {
        method: 'orange_money',
        label: 'Orange Money',
        icon: '🟠',
        color: '#FF6600',
        bgColor: '#FFF3E8',
        borderColor: '#FF6600',
        currency: 'SLL',
        minDeposit: 10,
        maxDeposit: 500_000,
        minWithdrawal: 10,
        maxWithdrawal: 1_000_000,
        depositFee: 0,
        depositFeeFixed: 0,
        withdrawalFee: 0,
        processingTime: 'Instant',
        features: ['Instant processing', '24/7 availability', 'QR code payments', 'USSD & app-based'],
    },
    afrimoney: {
        method: 'afrimoney',
        label: 'Afrimoney',
        icon: '🔵',
        color: '#1D4ED8',
        bgColor: '#EFF6FF',
        borderColor: '#1D4ED8',
        currency: 'SLL',
        minDeposit: 10,
        maxDeposit: 750_000,
        minWithdrawal: 10,
        maxWithdrawal: 1_500_000,
        depositFee: 0,
        depositFeeFixed: 0,
        withdrawalFee: 0,
        processingTime: 'Instant',
        features: ['Multi-currency wallet', 'SMS confirmations', 'Agent network access', '24/7 availability'],
    },
    qmoney: {
        method: 'qmoney',
        label: 'Qmoney',
        icon: '🟢',
        color: '#16A34A',
        bgColor: '#F0FDF4',
        borderColor: '#16A34A',
        currency: 'SLL',
        minDeposit: 10,
        maxDeposit: 1_000_000,
        minWithdrawal: 10,
        maxWithdrawal: 2_000_000,
        depositFee: 0,
        depositFeeFixed: 0,
        withdrawalFee: 0,
        processingTime: 'Instant',
        features: ['QR code payments', 'Mobile app integration', 'Merchant network', 'Largest limits'],
    },
    stripe: {
        method: 'stripe',
        label: 'Stripe',
        icon: '💜',
        color: '#7C3AED',
        bgColor: '#F5F3FF',
        borderColor: '#7C3AED',
        currency: 'USD',
        minDeposit: 1,        // USD
        maxDeposit: 10_000,   // USD
        minWithdrawal: 5,     // USD
        maxWithdrawal: null,  // Stripe limits apply
        depositFee: 2.9,      // % Stripe standard
        depositFeeFixed: 0.30, // $0.30 fixed
        withdrawalFee: 5,     // % platform fee
        processingTime: '1-3 business days',
        features: ['International cards', 'Direct bank transfers', 'Auto currency conversion', 'Global reach'],
    },
};

// ─── Wallet ─────────────────────────────────────────────────────────────────

export interface WalletBalance {
    balanceSLL: number;
    balanceUSD: number;
    balanceSLLinUSD: number; // SLL converted to USD for display
}

// ─── Transactions ────────────────────────────────────────────────────────────

export interface Transaction {
    id: string;
    type: TransactionType;
    paymentMethod?: PaymentMethod;
    amount: number;
    currency: Currency;
    platformFee: number;
    externalRef?: string;
    phoneNumber?: string;
    description?: string;
    status: TransactionStatus;
    createdAt: string;
}

// ─── Deposit / Withdrawal requests ──────────────────────────────────────────

export interface MobileMoneyDepositRequest {
    method: 'orange_money' | 'afrimoney' | 'qmoney';
    phoneNumber: string;
    amountSLL: number;
}

export interface StripeDepositRequest {
    amountUSD: number;
    // Stripe.js handles card data client-side via Elements
}

export interface MobileMoneyWithdrawalRequest {
    method: 'orange_money' | 'afrimoney' | 'qmoney';
    phoneNumber: string;
    amountSLL: number;
}

export interface StripeWithdrawalRequest {
    amountUSD: number;
    stripeAccountId: string;
}

// ─── Fee Calculation ─────────────────────────────────────────────────────────

export interface FeeBreakdownResult {
    method: PaymentMethod;
    grossAmount: number;
    currency: Currency;
    depositFee: number;       // amount charged on top (deposits)
    platformFee: number;      // amount deducted (withdrawals)
    netAmount: number;        // what user ultimately receives/pays
    feeLabel: string;         // human-readable description
}

export function calculateDepositFee(method: PaymentMethod, amount: number): FeeBreakdownResult {
    const cfg = PAYMENT_CONFIGS[method];
    if (method === 'stripe') {
        const fee = parseFloat(((amount * cfg.depositFee) / 100 + cfg.depositFeeFixed).toFixed(4));
        return { method, grossAmount: amount, currency: 'USD', depositFee: fee, platformFee: 0, netAmount: amount, feeLabel: `2.9% + $0.30 Stripe fee` };
    }
    return { method, grossAmount: amount, currency: 'SLL', depositFee: 0, platformFee: 0, netAmount: amount, feeLabel: 'Free' };
}

export function calculateWithdrawalFee(method: PaymentMethod, amount: number): FeeBreakdownResult {
    const cfg = PAYMENT_CONFIGS[method];
    if (method === 'stripe') {
        const fee = parseFloat(((amount * cfg.withdrawalFee) / 100).toFixed(4));
        return { method, grossAmount: amount, currency: 'USD', depositFee: 0, platformFee: fee, netAmount: parseFloat((amount - fee).toFixed(4)), feeLabel: '5% platform fee' };
    }
    return { method, grossAmount: amount, currency: 'SLL', depositFee: 0, platformFee: 0, netAmount: amount, feeLabel: 'Free' };
}

// ─── Saved Payment Method ────────────────────────────────────────────────────

export interface SavedPaymentMethod {
    id: string;
    type: PaymentMethod;
    phoneNumber?: string;
    stripeAccountId?: string;
    stripeConnectedAt?: string;
    isDefault: boolean;
}
