import * as React from 'react';
const { useState } = React;
import { Subscription } from '../types';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { PRICING } from '../types';
import { API_BASE_URL } from '../utils/api';

// Mock current user subscription - in real app, fetch from auth context/API
const MOCK_SUBSCRIPTION: Subscription | null = null; // Set to null for demo

export function SubscriptionManager() {
    const [subscription, setSubscription] = useState<Subscription | null>(MOCK_SUBSCRIPTION);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [pendingAction, setPendingAction] = useState<{
        type: 'subscribe' | 'upgrade' | 'cancel';
        tier?: Subscription['tier'];
    } | null>(null);

    const handleSubscribe = (tier: Subscription['tier']) => {
        setPendingAction({ type: 'subscribe', tier });
        setShowConfirmation(true);
    };

    const handleUpgrade = (tier: Subscription['tier']) => {
        setPendingAction({ type: 'upgrade', tier });
        setShowConfirmation(true);
    };

    const handleCancel = () => {
        setPendingAction({ type: 'cancel' });
        setShowConfirmation(true);
    };

    const confirmAction = async () => {
        if (!pendingAction) return;

        if (pendingAction.type === 'subscribe' || pendingAction.type === 'upgrade') {
            const tier = pendingAction.tier!;
            const now = new Date();
            const endDate = new Date(now);

            // Calculate end date based on tier (hour-based)
            switch (tier) {
                case 'halfDay':
                    endDate.setHours(endDate.getHours() + 12);
                    break;
                case 'daily':
                    endDate.setHours(endDate.getHours() + 24);
                    break;
                case 'weekly':
                    endDate.setDate(endDate.getDate() + 7);
                    break;
                case 'monthly':
                    endDate.setDate(endDate.getDate() + 30);
                    break;
            }

            const newSubscription: Subscription = {
                tier,
                startDate: now.toISOString(),
                endDate: endDate.toISOString(),
                isActive: true,
                autoRenew: true,
            };

            setSubscription(newSubscription);

            // In real app, send to backend
            try {
                await fetch(`${API_BASE_URL}/subscriptions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSubscription),
                });
            } catch (error) {
                console.error('Failed to create subscription:', error);
            }
        } else if (pendingAction.type === 'cancel') {
            if (subscription) {
                setSubscription({
                    ...subscription,
                    autoRenew: false,
                });

                // In real app, send to backend
                try {
                    await fetch(`${API_BASE_URL}/subscriptions/${subscription.tier}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ autoRenew: false }),
                    });
                } catch (error) {
                    console.error('Failed to cancel subscription:', error);
                }
            }
        }

        setShowConfirmation(false);
        setPendingAction(null);
    };

    const cancelAction = () => {
        setShowConfirmation(false);
        setPendingAction(null);
    };

    const getTierName = (tier: Subscription['tier']) => {
        const names = {
            halfDay: '12 Hours',
            daily: '24 Hours',
            weekly: '7 Days',
            monthly: '30 Days',
        };
        return names[tier];
    };

    const getTierPrice = (tier: Subscription['tier']) => {
        return PRICING.subscription[tier];
    };

    return (
        <div className="space-y-6">
            {/* Main Subscription Card */}
            <SubscriptionCard
                subscription={subscription}
                onSubscribe={handleSubscribe}
                onCancel={handleCancel}
                onUpgrade={handleUpgrade}
            />

            {/* Benefits Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    ✨ Subscription Benefits
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">♾️</div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Unlimited Listening</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Listen to any audiobook, any time, no limits
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">💰</div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">No Per-Minute Charges</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Fixed price, listen as much as you want
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">📥</div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Offline Downloads</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Download and listen offline (coming soon)
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">🎯</div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Support Creators</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                75% of subscription revenue goes to creators
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment History */}
            {subscription && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        💳 Payment History
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {getTierName(subscription.tier)} Subscription
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(subscription.startDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    Le {getTierPrice(subscription.tier).sll} (${getTierPrice(subscription.tier).usd.toFixed(3)})
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-400">Paid</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmation && pendingAction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {pendingAction.type === 'cancel' && 'Cancel Subscription?'}
                            {pendingAction.type === 'subscribe' && 'Start Subscription?'}
                            {pendingAction.type === 'upgrade' && 'Upgrade Subscription?'}
                        </h3>

                        {pendingAction.type === 'cancel' && (
                            <div className="mb-6">
                                <p className="text-gray-700 dark:text-gray-300 mb-3">
                                    Your subscription will remain active until{' '}
                                    <strong>{new Date(subscription!.endDate).toLocaleDateString()}</strong>.
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    You can re-subscribe anytime. After expiration, you'll revert to pay-per-use
                                    (Le 1/hour or $0.017/hour).
                                </p>
                            </div>
                        )}

                        {(pendingAction.type === 'subscribe' || pendingAction.type === 'upgrade') && (
                            <div className="mb-6">
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {getTierName(pendingAction.tier!)} Plan
                                        </span>
                                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                            Le {getTierPrice(pendingAction.tier!).sll} (${getTierPrice(pendingAction.tier!).usd.toFixed(3)})
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Unlimited listening for {pendingAction.tier === 'halfDay' ? '12 hours' : pendingAction.tier === 'daily' ? '24 hours' : pendingAction.tier === 'weekly' ? '7 days' : '30 days'}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    You'll be charged immediately and your subscription will auto-renew.
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={cancelAction}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={confirmAction}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${pendingAction.type === 'cancel'
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                                    }`}
                            >
                                {pendingAction.type === 'cancel' && 'Cancel Subscription'}
                                {pendingAction.type === 'subscribe' && 'Subscribe Now'}
                                {pendingAction.type === 'upgrade' && 'Upgrade Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
