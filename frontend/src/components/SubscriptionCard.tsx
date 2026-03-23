import * as React from 'react';
const { useState, useEffect } = React;
import { Subscription } from '../types';
import { PRICING } from '../types';

interface SubscriptionCardProps {
    subscription: Subscription | null;
    onSubscribe: (tier: Subscription['tier']) => void;
    onCancel: () => void;
    onUpgrade: (tier: Subscription['tier']) => void;
}

export function SubscriptionCard({ subscription, onSubscribe, onCancel, onUpgrade }: SubscriptionCardProps) {
    const isActive = subscription?.isActive || false;
    const currentTier = subscription?.tier || null;

    const [timeRemaining, setTimeRemaining] = useState('');

    useEffect(() => {
        if (subscription?.endDate) {
            const updateTimeRemaining = () => {
                const end = new Date(subscription.endDate);
                const now = new Date();
                const diff = end.getTime() - now.getTime();

                if (diff <= 0) {
                    setTimeRemaining('Expired');
                    return;
                }

                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                if (days > 0) {
                    setTimeRemaining(`${days} day${days !== 1 ? 's' : ''} remaining`);
                } else {
                    setTimeRemaining(`${hours} hour${hours !== 1 ? 's' : ''} remaining`);
                }
            };

            updateTimeRemaining();
            const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

            return () => clearInterval(interval);
        }
    }, [subscription?.endDate]);

    const getTierDisplay = (tier: Subscription['tier']) => {
        const displays = {
            halfDay: { name: '12 Hours', sll: PRICING.subscription.halfDay.sll, usd: PRICING.subscription.halfDay.usd },
            daily: { name: '24 Hours', sll: PRICING.subscription.daily.sll, usd: PRICING.subscription.daily.usd },
            weekly: { name: '7 Days', sll: PRICING.subscription.weekly.sll, usd: PRICING.subscription.weekly.usd },
            monthly: { name: '30 Days', sll: PRICING.subscription.monthly.sll, usd: PRICING.subscription.monthly.usd },
        };
        return displays[tier];
    };

    if (!isActive) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-purple-200 dark:border-purple-800">
                <div className="text-center mb-4">
                    <div className="text-5xl mb-3">🎧</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        No Active Subscription
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        You're currently on pay-per-use (Le 1/hour or $0.017/hour)
                    </p>
                </div>

                <div className="space-y-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                        Subscribe for unlimited listening:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => onSubscribe('halfDay')}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                        >
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">12 Hours</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Le {PRICING.subscription.halfDay.sll} (${PRICING.subscription.halfDay.usd})</div>
                        </button>
                        <button
                            onClick={() => onSubscribe('daily')}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                        >
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">24 Hours</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Le {PRICING.subscription.daily.sll} (${PRICING.subscription.daily.usd})</div>
                        </button>
                        <button
                            onClick={() => onSubscribe('weekly')}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                        >
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">7 Days</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Le {PRICING.subscription.weekly.sll} (${PRICING.subscription.weekly.usd})</div>
                        </button>
                        <button
                            onClick={() => onSubscribe('monthly')}
                            className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg transition-colors border-2 border-purple-300 dark:border-purple-700"
                        >
                            <div className="text-sm font-semibold text-purple-900 dark:text-purple-200">30 Days</div>
                            <div className="text-xs text-purple-700 dark:text-purple-400">Le {PRICING.subscription.monthly.sll} (${PRICING.subscription.monthly.usd})</div>
                        </button>
                    </div>
                </div>

                <a
                    href="/pricing"
                    className="block mt-4 text-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
                >
                    View All Plans & Details →
                </a>
            </div>
        );
    }

    const tierInfo = getTierDisplay(currentTier!);

    return (
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">♾️</span>
                        <h3 className="text-xl font-bold">Active Subscription</h3>
                    </div>
                    <p className="text-purple-100">{tierInfo.name} Plan - Le {tierInfo.sll} (${tierInfo.usd.toFixed(3)})</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {subscription!.autoRenew ? '🔄 Auto-Renew' : '⏸️ Expiring'}
                </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="text-purple-200">Started</div>
                        <div className="font-semibold">{new Date(subscription!.startDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                        <div className="text-purple-200">Expires</div>
                        <div className="font-semibold">{new Date(subscription!.endDate).toLocaleDateString()}</div>
                    </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <div className="text-purple-200 text-sm">Status</div>
                    <div className="font-semibold">{timeRemaining}</div>
                </div>
            </div>

            {/* Upgrade Options */}
            {(currentTier === 'halfDay' || currentTier === 'daily' || currentTier === 'weekly') && (
                <div className="mb-4">
                    <p className="text-sm text-purple-100 mb-2">💡 Save more with a longer plan:</p>
                    <div className="flex gap-2">
                        {currentTier !== 'weekly' && currentTier !== 'monthly' && (
                            <button
                                onClick={() => onUpgrade('weekly')}
                                className="flex-1 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                            >
                                Upgrade to 7 Days
                            </button>
                        )}
                        {currentTier !== 'monthly' && (
                            <button
                                onClick={() => onUpgrade('monthly')}
                                className="flex-1 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                            >
                                Upgrade to 30 Days
                            </button>
                        )}
                    </div>
                </div>
            )}

            <button
                onClick={onCancel}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors border border-white/30"
            >
                Cancel Subscription
            </button>
        </div>
    );
}
