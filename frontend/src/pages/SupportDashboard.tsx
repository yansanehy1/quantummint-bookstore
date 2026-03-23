import { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock support data - in real app, fetch from API
const MOCK_SUPPORT_DATA = {
    openTickets: 23,
    resolvedToday: 47,
    avgResponseTime: '12 mins',
    satisfaction: 94.5,

    ticketQueue: [
        {
            id: '#T-1234',
            user: 'User #4521',
            type: 'technical',
            subject: 'Audio playback freezing',
            priority: 'high',
            created: '5 mins ago',
            status: 'open',
        },
        {
            id: '#T-1233',
            user: 'User #3892',
            type: 'account',
            subject: 'Cannot reset password',
            priority: 'medium',
            created: '15 mins ago',
            status: 'in-progress',
        },
        {
            id: '#T-1232',
            user: 'User #5123',
            type: 'payment',
            subject: 'Subscription charge issue',
            priority: 'high',
            created: '32 mins ago',
            status: 'in-progress',
        },
        {
            id: '#T-1231',
            user: 'User #2847',
            type: 'playback',
            subject: 'Chapter skipping problem',
            priority: 'low',
            created: '1 hour ago',
            status: 'open',
        },
        {
            id: '#T-1230',
            user: 'Creator: John Doe',
            type: 'content',
            subject: 'Book metadata not updating',
            priority: 'medium',
            created: '2 hours ago',
            status: 'redirected',
            note: 'Redirected to creator',
        },
    ],

    recentlyResolved: [
        {
            id: '#T-1229',
            user: 'User #3421',
            subject: 'Mobile app login issue',
            resolvedBy: 'Support Agent #2',
            resolvedIn: '8 mins',
            satisfaction: 5,
        },
        {
            id: '#T-1228',
            user: 'User #7865',
            subject: 'Payment method update',
            resolvedBy: 'Support Agent #1',
            resolvedIn: '15 mins',
            satisfaction: 5,
        },
        {
            id: '#T-1227',
            user: 'User #4532',
            subject: 'Subscription not activating',
            resolvedBy: 'Support Agent #3',
            resolvedIn: '22 mins',
            satisfaction: 4,
        },
    ],

    categoryStats: [
        { category: 'Technical', count: 45, avgTime: '18 mins' },
        { category: 'Account', count: 32, avgTime: '10 mins' },
        { category: 'Payment', count: 28, avgTime: '15 mins' },
        { category: 'Playback', count: 19, avgTime: '12 mins' },
        { category: 'Content', count: 8, avgTime: 'N/A (redirected)' },
    ],
};

export function SupportDashboard() {
    const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
    const data = MOCK_SUPPORT_DATA;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
            case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
            case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
            case 'in-progress': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400';
            case 'redirected': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'technical': return '💻';
            case 'account': return '🔐';
            case 'payment': return '💰';
            case 'playback': return '🎧';
            case 'content': return '📚';
            default: return '❓';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Support Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage technical issues and assist users
                    </p>
                </div>

                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Open Tickets */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Tickets</h3>
                            <span className="text-2xl">🎫</span>
                        </div>
                        <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                            {data.openTickets}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Needs attention
                        </div>
                    </div>

                    {/* Resolved Today */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved Today</h3>
                            <span className="text-2xl">✅</span>
                        </div>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {data.resolvedToday}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Great work!
                        </div>
                    </div>

                    {/* Avg Response Time */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response</h3>
                            <span className="text-2xl">⚡</span>
                        </div>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {data.avgResponseTime}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Response time
                        </div>
                    </div>

                    {/* Satisfaction */}
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium opacity-90">Satisfaction</h3>
                            <span className="text-2xl">⭐</span>
                        </div>
                        <div className="text-3xl font-bold">
                            {data.satisfaction}%
                        </div>
                        <div className="text-sm opacity-80">
                            User rating
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Ticket Queue */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Ticket Queue</h2>
                        <div className="space-y-3">
                            {data.ticketQueue.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                    onClick={() => setSelectedTicket(ticket.id)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{getTypeIcon(ticket.type)}</span>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {ticket.id} - {ticket.subject}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {ticket.user}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span>{ticket.created}</span>
                                        {ticket.note && (
                                            <span className="text-orange-600 dark:text-orange-400">📝 {ticket.note}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category Stats */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">By Category</h2>
                        <div className="space-y-4">
                            {data.categoryStats.map((cat) => (
                                <div key={cat.category}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {cat.category}
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {cat.count}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                        Avg: {cat.avgTime}
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                            style={{ width: `${(cat.count / 45) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                📚 Content issues are redirected to creators
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recently Resolved */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recently Resolved</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Ticket ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">User</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Subject</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Resolved By</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Time</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentlyResolved.map((ticket) => (
                                    <tr key={ticket.id} className="border-b border-gray-100 dark:border-gray-700">
                                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                                            {ticket.id}
                                        </td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                                            {ticket.user}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                            {ticket.subject}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                            {ticket.resolvedBy}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                            {ticket.resolvedIn}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: ticket.satisfaction }).map((_, i) => (
                                                    <span key={i} className="text-yellow-500">⭐</span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
