import * as React from 'react';
const { useState } = React;
import { Link } from 'react-router-dom';
import { VoiceCloning } from '../components/VoiceCloning';
import { VoiceClone } from '../types';

// Mock creator data - in real app, fetch from API
const MOCK_CREATOR_DATA = {
    totalEarnings: 127.5, // SLL
    totalEarningsUSD: 2.17,
    pendingPayout: 45.0,
    pendingPayoutUSD: 0.77,
    booksPublished: 3,
    totalListeners: 1247,
    totalListeningHours: 8520,
    monthlyGrowth: 23.5, // percentage

    earningsByBook: [
        {
            id: '1',
            title: 'The Digital Frontier',
            coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
            earnings: 67.5,
            earningsUSD: 1.15,
            listeners: 589,
            listeningHours: 4234,
            subscriptionRevenue: 45.0,
            payPerUseRevenue: 22.5,
        },
        {
            id: '2',
            title: 'Midnight Tales',
            coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
            earnings: 42.0,
            earningsUSD: 0.71,
            listeners: 412,
            listeningHours: 2856,
            subscriptionRevenue: 28.5,
            payPerUseRevenue: 13.5,
        },
        {
            id: '3',
            title: 'Journey Through Time',
            coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
            earnings: 18.0,
            earningsUSD: 0.31,
            listeners: 246,
            listeningHours: 1430,
            subscriptionRevenue: 12.0,
            payPerUseRevenue: 6.0,
        },
    ],

    recentPayouts: [
        { date: '2024-11-01', amount: 89.25, amountUSD: 1.52, status: 'completed' },
        { date: '2024-10-01', amount: 56.50, amountUSD: 0.96, status: 'completed' },
        { date: '2024-09-01', amount: 34.75, amountUSD: 0.59, status: 'completed' },
    ],

    monthlyStats: [
        { month: 'Jun', earnings: 12.5, listeners: 145 },
        { month: 'Jul', earnings: 23.0, listeners: 289 },
        { month: 'Aug', earnings: 34.75, listeners: 456 },
        { month: 'Sep', earnings: 56.5, listeners: 678 },
        { month: 'Oct', earnings: 89.25, listeners: 923 },
        { month: 'Nov', earnings: 127.5, listeners: 1247 },
    ],
};

export function CreatorDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'voice-cloning'>('overview');
    const data = MOCK_CREATOR_DATA;

    const handleRequestPayout = async () => {
        // In real app, send payout request to backend
        alert(`Payout request for Le ${data.pendingPayout} ($${data.pendingPayoutUSD.toFixed(2)}) has been submitted!`);
    };

    const handleVoiceCreated = (voice: VoiceClone) => {
        console.log('New voice clone created:', voice);
        // In real app, update voice clones list or refetch from API
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Creator Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Track your earnings, analytics, and audience growth
                    </p>

                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('voice-cloning')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'voice-cloning'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                            >
                                Voice Cloning
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' ? (
                    <div>
                        {/* Top Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Total Earnings */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</h3>
                                    <span className="text-2xl">💰</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Le {data.totalEarnings.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    ${data.totalEarningsUSD.toFixed(2)} USD
                                </div>
                                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                                    ↑ {data.monthlyGrowth}% this month
                                </div>
                            </div>

                            {/* Pending Payout */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Payout</h3>
                                    <span className="text-2xl">⏳</span>
                                </div>
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    Le {data.pendingPayout.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    ${data.pendingPayoutUSD.toFixed(2)} USD
                                </div>
                                <button
                                    onClick={handleRequestPayout}
                                    className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                                >
                                    Request Payout →
                                </button>
                            </div>

                            {/* Total Listeners */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Listeners</h3>
                                    <span className="text-2xl">👥</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {data.totalListeners.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Across {data.booksPublished} books
                                </div>
                            </div>

                            {/* Listening Hours */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Listening Hours</h3>
                                    <span className="text-2xl">⏱️</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {data.totalListeningHours.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Total hours streamed
                                </div>
                            </div>
                        </div>

                        {/* Revenue Breakdown */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Revenue Breakdown</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">By Source</h3>
                                    <div className="space-y-4">
                                        {data.earningsByBook.map((book) => {
                                            const subPercent = (book.subscriptionRevenue / book.earnings) * 100;
                                            const ppuPercent = (book.payPerUseRevenue / book.earnings) * 100;

                                            return (
                                                <div key={book.id}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-700 dark:text-gray-300">{book.title}</span>
                                                        <span className="text-gray-900 dark:text-white font-medium">Le {book.earnings.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                                        <div
                                                            className="bg-purple-500"
                                                            style={{ width: `${subPercent}%` }}
                                                            title={`Subscription: ${subPercent.toFixed(1)}%`}
                                                        />
                                                        <div
                                                            className="bg-green-500"
                                                            style={{ width: `${ppuPercent}%` }}
                                                            title={`Pay-per-use: ${ppuPercent.toFixed(1)}%`}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        <span>🟣 Subscription: Le {book.subscriptionRevenue.toFixed(2)}</span>
                                                        <span>🟢 Pay-per-use: Le {book.payPerUseRevenue.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Monthly Trend</h3>
                                    <div className="space-y-2">
                                        {data.monthlyStats.slice(-6).map((stat, _idx) => (
                                            <div key={stat.month} className="flex items-center gap-3">
                                                <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{stat.month}</span>
                                                <div className="flex-1">
                                                    <div className="h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded"
                                                        style={{ width: `${(stat.earnings / 127.5) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white w-16 text-right">
                                                    Le {stat.earnings.toFixed(1)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Books Performance */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Book Performance</h2>
                            <div className="space-y-4">
                                {data.earningsByBook.map((book, idx) => (
                                    <div key={book.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                        <div className="text-2xl font-bold text-gray-400 dark:text-gray-500 w-8">
                                            #{idx + 1}
                                        </div>
                                        <img
                                            src={book.coverUrl}
                                            alt={book.title}
                                            className="w-16 h-20 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{book.title}</h3>
                                            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                <span>👥 {book.listeners.toLocaleString()} listeners</span>
                                                <span>⏱️ {book.listeningHours.toLocaleString()}h</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                Le {book.earnings.toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                ${book.earningsUSD.toFixed(2)} USD
                                            </div>
                                        </div>
                                        <Link
                                            to={`/book/${book.id}`}
                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                                        >
                                            View
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payout History */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payout History</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Amount (SLL)</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Amount (USD)</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.recentPayouts.map((payout, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                                                <td className="py-3 px-4 text-gray-900 dark:text-white">
                                                    {new Date(payout.date).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                                                    Le {payout.amount.toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                                    ${payout.amountUSD.toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                                        {payout.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <VoiceCloning onVoiceCreated={handleVoiceCreated} />
                )}
            </div>
        </div>
    );
}
