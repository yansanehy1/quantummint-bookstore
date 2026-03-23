import React from 'react';
import { PAYMENT_CONFIGS, type PaymentMethod } from '../../types/payments';

interface PaymentMethodCardProps {
    method: PaymentMethod;
    selected: boolean;
    onSelect: (m: PaymentMethod) => void;
    showDetails?: boolean;
}

export default function PaymentMethodCard({ method, selected, onSelect, showDetails = false }: PaymentMethodCardProps) {
    const cfg = PAYMENT_CONFIGS[method];

    return (
        <button
            onClick={() => onSelect(method)}
            className="w-full text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl"
            style={{ focusRingColor: cfg.color } as React.CSSProperties}
        >
            <div
                className="rounded-xl border-2 p-4 transition-all duration-200"
                style={{
                    borderColor: selected ? cfg.color : '#E5E7EB',
                    backgroundColor: selected ? cfg.bgColor : 'white',
                }}
            >
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{cfg.icon}</span>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{cfg.label}</p>
                            <p className="text-xs text-gray-500">{cfg.processingTime}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: cfg.bgColor, color: cfg.color }}>
                            {cfg.currency}
                        </span>
                        {cfg.withdrawalFee === 0
                            ? <span className="text-xs text-green-600 font-medium">Free withdrawal</span>
                            : <span className="text-xs text-purple-600 font-medium">{cfg.withdrawalFee}% fee</span>
                        }
                    </div>
                </div>

                {/* Limits */}
                {showDetails && selected && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                            <div>
                                <span className="font-medium block">Min Deposit</span>
                                {cfg.currency === 'SLL' ? `Le ${cfg.minDeposit.toLocaleString()}` : `$${cfg.minDeposit}`}
                            </div>
                            <div>
                                <span className="font-medium block">Max Deposit</span>
                                {cfg.currency === 'SLL' ? `Le ${cfg.maxDeposit.toLocaleString()}` : `$${cfg.maxDeposit.toLocaleString()}`}
                            </div>
                            <div>
                                <span className="font-medium block">Min Withdrawal</span>
                                {cfg.currency === 'SLL' ? `Le ${cfg.minWithdrawal.toLocaleString()}` : `$${cfg.minWithdrawal}`}
                            </div>
                            <div>
                                <span className="font-medium block">Max Withdrawal</span>
                                {cfg.maxWithdrawal
                                    ? (cfg.currency === 'SLL' ? `Le ${cfg.maxWithdrawal.toLocaleString()}` : `$${cfg.maxWithdrawal.toLocaleString()}`)
                                    : 'Stripe limits'}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {cfg.features.map(f => (
                                <span key={f} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{f}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </button>
    );
}
