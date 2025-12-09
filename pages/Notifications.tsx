import React, { useState } from 'react';
import { Bell, Check, Trash2, Settings, BookOpen, ShoppingCart, Gift, CreditCard, Star } from 'lucide-react';

export const Notifications: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [notifications, setNotifications] = useState([
        {
            id: '1',
            type: 'purchase',
            title: 'Purchase Successful',
            message: 'You successfully purchased "Advanced Physics: Quantum Mechanics"',
            time: '5 minutes ago',
            read: false,
            icon: ShoppingCart,
            color: 'emerald'
        },
        {
            id: '2',
            type: 'new_release',
            title: 'New Book Available',
            message: 'A new book by Dr. Sarah Chen is now available in your favorite category',
            time: '2 hours ago',
            read: false,
            icon: BookOpen,
            color: 'blue'
        },
        {
            id: '3',
            type: 'gift',
            title: 'Gift Received',
            message: 'John Doe sent you a gift: "Mathematics for SSS Students"',
            time: '1 day ago',
            read: true,
            icon: Gift,
            color: 'purple'
        },
        {
            id: '4',
            type: 'payment',
            title: 'Wallet Topped Up',
            message: 'Your wallet has been credited with $50.00',
            time: '2 days ago',
            read: true,
            icon: CreditCard,
            color: 'green'
        },
        {
            id: '5',
            type: 'review',
            title: 'New Review on Your Book',
            message: 'Someone left a 5-star review on "Chemistry: Organic Reactions"',
            time: '3 days ago',
            read: true,
            icon: Star,
            color: 'amber'
        }
    ]);

    const markAsRead = (id: string) => {
        setNotifications(notifs =>
            notifs.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(notifs =>
            notifs.map(n => ({ ...n, read: true }))
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifs => notifs.filter(n => n.id !== id));
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.read;
        if (filter === 'read') return n.read;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Bell className="text-emerald-600" size={32} />
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
                                <p className="text-slate-600">
                                    {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                                </p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <Settings size={20} />
                            <span>Settings</span>
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 bg-white rounded-lg p-2 shadow-sm">
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'unread', label: 'Unread' },
                            { key: 'read', label: 'Read' }
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key as typeof filter)}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${filter === key
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                {label}
                                {key === 'unread' && unreadCount > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                {filteredNotifications.length > 0 && unreadCount > 0 && (
                    <div className="mb-4">
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium"
                        >
                            <Check size={18} />
                            <span>Mark all as read</span>
                        </button>
                    </div>
                )}

                {/* Notifications List */}
                {filteredNotifications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Bell className="mx-auto text-slate-300 mb-4" size={64} />
                        <h2 className="text-2xl font-semibold text-slate-900 mb-2">No notifications</h2>
                        <p className="text-slate-600">
                            {filter === 'unread' ? "You're all caught up!" : 'No notifications to show'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredNotifications.map(notification => {
                            const Icon = notification.icon;
                            return (
                                <div
                                    key={notification.id}
                                    className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-emerald-600' : ''
                                        }`}
                                >
                                    <div className="p-4">
                                        <div className="flex gap-4">
                                            {/* Icon */}
                                            <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-${notification.color}-100 flex items-center justify-center`}>
                                                <Icon className={`text-${notification.color}-600`} size={24} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-1">
                                                    <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                                                    {!notification.read && (
                                                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-600 ml-2 mt-2"></div>
                                                    )}
                                                </div>
                                                <p className="text-slate-600 mb-2">{notification.message}</p>
                                                <p className="text-xs text-slate-500">{notification.time}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex-shrink-0 flex gap-2">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Delete notification"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Notification Preferences */}
                <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h2>
                    <div className="space-y-4">
                        {[
                            { label: 'New book releases', enabled: true },
                            { label: 'Purchase confirmations', enabled: true },
                            { label: 'Gifts and rewards', enabled: true },
                            { label: 'Reviews and ratings', enabled: false },
                            { label: 'Marketing emails', enabled: false }
                        ].map((pref, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <span className="text-slate-700">{pref.label}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={pref.enabled}
                                        className="sr-only peer"
                                        readOnly
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
