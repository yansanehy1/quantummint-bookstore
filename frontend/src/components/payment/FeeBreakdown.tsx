import React from 'react';
import { Info } from 'lucide-react';
import { previewDepositFee, previewWithdrawalFee } from '../../services/paymentService';

interface FeeBreakdownProps {
    method: string;
    amount: number;
    direction: 'deposit' | 'withdrawal';
    currency: 'SLL' | 'USD';
    /** Live SLL per 1 USD from GET /api/subscriptions/plans */
    exchangeRate?: number;
}

export default function FeeBreakdown({ method, amount, direction, currency, exchangeRate = 59 }: FeeBreakdownProps) {
    if (!amount || amount <= 0) return null;

    const amountNum = parseFloat(String(amount));

    if (direction === 'deposit') {
        const { fee, total, label } = previewDepositFee(method, amountNum);
        const isFree = fee === 0;
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm mb-1">
                    <Info className="w-4 h-4" />
                    Deposit Breakdown
                </div>
                <Row label="You send" value={currency === 'SLL' ? `Le ${amountNum.toLocaleString()}` : `$${amountNum.toFixed(2)}`} />
                <Row label="Platform fee" value={isFree ? 'Free' : (currency === 'USD' ? `$${fee.toFixed(2)}` : `Le ${fee}`)} highlight={!isFree} />
                <div className="border-t border-blue-200 pt-2">
                    <Row label="You're charged" value={currency === 'SLL' ? `Le ${total.toLocaleString()}` : `$${total.toFixed(2)}`} bold />
                </div>
                <p className="text-xs text-blue-600">{label}</p>
            </div>
        );
    }

    const { fee, netAmount, label } = previewWithdrawalFee(method, amountNum);
    const isFree = fee === 0;

    // Also show SLL ↔ USD conversion for Stripe
    const usdEquiv = currency === 'SLL' ? (amountNum / exchangeRate).toFixed(2) : null;

    return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-green-700 font-semibold text-sm mb-1">
                <Info className="w-4 h-4" />
                Withdrawal Breakdown
            </div>
            <Row label="You withdraw" value={currency === 'SLL' ? `Le ${amountNum.toLocaleString()}` : `$${amountNum.toFixed(2)}`} />
            {usdEquiv && method === 'stripe' && (
                <Row label="USD equivalent" value={`≈ $${usdEquiv}`} muted />
            )}
            <Row label="Platform fee" value={isFree ? 'Free' : `$${fee.toFixed(2)} (5%)`} highlight={!isFree} />
            <div className="border-t border-green-200 pt-2">
                <Row label="You receive" value={currency === 'SLL' ? `Le ${netAmount.toLocaleString()}` : `$${netAmount.toFixed(2)}`} bold success />
            </div>
            <p className="text-xs text-green-600">{label}</p>
        </div>
    );
}

function Row({ label, value, bold, highlight, muted, success }: {
    label: string; value: string; bold?: boolean; highlight?: boolean; muted?: boolean; success?: boolean;
}) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className={`${muted ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
            <span className={`
        ${bold ? 'font-bold text-base' : 'font-medium'}
        ${highlight ? 'text-orange-600' : ''}
        ${success ? 'text-green-700' : ''}
        ${muted ? 'text-gray-400' : 'text-gray-900'}
      `}>{value}</span>
        </div>
    );
}
