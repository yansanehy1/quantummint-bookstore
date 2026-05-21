import { useState, useEffect } from 'react';

export interface BookUpdateNotification {
    id: string;
    bookId: string;
    bookTitle: string;
    updateType: 'chapter_added' | 'chapter_edited' | 'chapter_deleted' | 'metadata_updated';
    chapterNumber?: number;
    chapterTitle?: string;
    message: string;
    timestamp: string;
    read: boolean;
}

// Notifications - initial state empty for production
const initialNotifications: BookUpdateNotification[] = [];

export default function BookUpdateNotifications() {
    const [notifications, setNotifications] = useState<BookUpdateNotification[]>(initialNotifications);
    const [showNotifications, setShowNotifications] = useState(false);

import type { BookUpdateNotification } from '../types/types';
...
    useEffect(() => {
        const handleNewNotifications = (event: Event) => {
            const customEvent = event as CustomEvent;
            const newNotifications = customEvent.detail.map((n: { notification: BookUpdateNotification }) => n.notification);
            setNotifications(prev => [...newNotifications, ...prev]);
        };

        window.addEventListener('BOOK_NOTIFICATIONS_UPDATED', handleNewNotifications);
        return () => window.removeEventListener('BOOK_NOTIFICATIONS_UPDATED', handleNewNotifications);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getIcon = (type: BookUpdateNotification['updateType']) => {
        switch (type) {
            case 'chapter_added': return '➕';
            case 'chapter_edited': return '✏️';
            case 'chapter_deleted': return '🗑️';
            case 'metadata_updated': return '📝';
            default: return '📢';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-300 hover:text-white transition"
                aria-label="Notifications"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifications(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 z-50 max-h-[600px] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="text-white font-semibold">Book Updates</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-purple-400 hover:text-purple-300"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 transition ${!notification.read ? 'bg-purple-900/20' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl">{getIcon(notification.updateType)}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <h4 className="text-white font-medium text-sm truncate">
                                                            {notification.bookTitle}
                                                        </h4>
                                                        {notification.chapterTitle && (
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                Chapter {notification.chapterNumber}: {notification.chapterTitle}
                                                            </p>
                                                        )}
                                                        <p className="text-sm text-gray-300 mt-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            {formatTimestamp(notification.timestamp)}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => clearNotification(notification.id)}
                                                        className="text-gray-500 hover:text-gray-300 flex-shrink-0"
                                                        aria-label="Clear notification"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-xs text-purple-400 hover:text-purple-300 mt-2"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400">
                                    <div className="text-4xl mb-2">🔔</div>
                                    <p>No notifications</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Hook for subscribing to book updates
export function useBookUpdateSubscription(bookId: string) {
    const [hasUpdate, setHasUpdate] = useState(false);
    const [updateInfo, setUpdateInfo] = useState<BookUpdateNotification | null>(null);

    useEffect(() => {
        // Poll for updates if WebSocket is not available
        const checkForUpdates = async () => {
            // Check for book-specific updates via API
        };

        const interval = setInterval(checkForUpdates, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [bookId]);

    return { hasUpdate, updateInfo };
}
