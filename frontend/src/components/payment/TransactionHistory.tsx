import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import type { Transaction } from '../../services/paymentService';
import { PAYMENT_CONFIGS } from '../../types/payments';

interface TransactionHistoryProps {
    transactions: Transaction[];
    pagination: { page: number; limit: number; total: number; pages: number };
    onPageChange: (page: number) => void;
    onFilterChange: (filters: { type?: string; method?: string; status?: string }) => void;
    loading?: boolean;
}

const typeColors: Record<string, string> = {
    deposit: 'bg-green-100 text-green-800',
    withdrawal: 'bg-orange-100 text-orange-800',
    purchase: 'bg-blue-100 text-blue-800',
    referral_bonus: 'bg-purple-100 text-purple-800',
    gift: 'bg-pink-100 text-pink-800',
};

const statusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    failed: 'bg-red-100 text-red-700',
};

export default function TransactionHistory({
    transactions, pagination, onPageChange, onFilterChange, loading = false,
}: TransactionHistoryProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [filterType, setFilterType] = useState('');
    const [filterMethod, setFilterMethod] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const applyFilters = () => {
        onFilterChange({ type: filterType || undefined, method: filterMethod || undefined, status: filterStatus || undefined });
    };

    const clearFilters = () => {
        setFilterType(''); setFilterMethod(''); setFilterStatus('');
        onFilterChange({});
    };

    return (
        <div>
            {/* Filter bar */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                    {pagination.total} transaction{pagination.total !== 1 ? 's' : ''}
                </h3>
                <button
                    onClick={() => setShowFilters(v => !v)}
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
                >
                    <Filter className="w-3.5 h-3.5" /> Filters
                </button>
            </div>

            {showFilters && (
                <div className="grid grid-cols-3 gap-3 mb-4 bg-gray-50 rounded-xl p-4">
                    <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Type</label>
                        <select value={filterType} onChange={e => setFilterType(e.target.value)}
                            aria-label="Filter by transaction type"
                            className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white">
                            <option value="">All</option>
                            <option value="deposit">Deposit</option>
                            <option value="withdrawal">Withdrawal</option>
                            <option value="purchase">Purchase</option>
                            <option value="referral_bonus">Referral Bonus</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Method</label>
                        <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)}
                            aria-label="Filter by payment method"
                            className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white">
                            <option value="">All</option>
                            <option value="orange_money">Orange Money</option>
                            <option value="afrimoney">Afrimoney</option>
                            <option value="qmoney">Qmoney</option>
                            <option value="stripe">Stripe</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Status</label>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                            aria-label="Filter by transaction status"
                            className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white">
                            <option value="">All</option>
                            <option value="completed">Completed</option>
                            <option value="processing">Processing</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div className="col-span-3 flex gap-2">
                        <button onClick={applyFilters} className="text-sm bg-gray-900 text-white rounded-lg px-4 py-1.5 hover:bg-gray-800 transition-colors">Apply</button>
                        <button onClick={clearFilters} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Clear</button>
                    </div>
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : transactions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-3">📭</div>
                    <p className="font-medium">No transactions yet</p>
                    <p className="text-sm mt-1">Your payment history will appear here</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {['Date', 'Type', 'Method', 'Amount', 'Fee', 'Status'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map(tx => {
                                    const cfg = tx.paymentMethod ? PAYMENT_CONFIGS[tx.paymentMethod as keyof typeof PAYMENT_CONFIGS] : null;
                                    const isPositive = tx.type === 'deposit' || tx.type === 'referral_bonus' || tx.type === 'gift';
                                    return (
                                        <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                                {new Date(tx.createdAt).toLocaleDateString('en-SL', { day: 'numeric', month: 'short', year: '2-digit' })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[tx.type] || 'bg-gray-100 text-gray-700'}`}>
                                                    {tx.type.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {cfg ? `${cfg.icon} ${cfg.label}` : tx.paymentMethod?.replace(/_/g, ' ') || '—'}
                                            </td>
                                            <td className={`px-4 py-3 font-semibold ${isPositive ? 'text-green-700' : 'text-gray-900'}`}>
                                                {isPositive ? '+' : '-'}{tx.currency === 'SLL' ? 'Le' : '$'} {Number(tx.amount).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {Number(tx.platformFee) > 0 ? `${tx.currency === 'USD' ? '$' : 'Le'} ${Number(tx.platformFee).toFixed(2)}` : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[tx.status] || 'bg-gray-100 text-gray-700'}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-xs text-gray-500">
                                Page {pagination.page} of {pagination.pages} · {pagination.total} total
                            </p>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => onPageChange(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    aria-label="Previous page"
                                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onPageChange(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.pages}
                                    aria-label="Next page"
                                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
