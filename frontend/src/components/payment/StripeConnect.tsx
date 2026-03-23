import React, { useState } from 'react';
import { ExternalLink, Unlink, CheckCircle, Shield } from 'lucide-react';
import { getStripeConnectUrl, disconnectStripe, type SavedMethod } from '../../services/paymentService';

interface StripeConnectProps {
    connectedMethod?: SavedMethod;
    onConnect: () => void;
    onDisconnect: () => void;
}

export default function StripeConnect({ connectedMethod, onConnect, onDisconnect }: StripeConnectProps) {
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [error, setError] = useState('');

    const isConnected = !!(connectedMethod?.stripeAccountId);
    const accountId = connectedMethod?.stripeAccountId;
    const connectedAt = connectedMethod?.stripeConnectedAt
        ? new Date(connectedMethod.stripeConnectedAt).toLocaleDateString()
        : null;

    const handleConnect = async () => {
        setConnecting(true);
        setError('');
        try {
            const url = await getStripeConnectUrl();
            window.location.href = url;
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to start Stripe connect');
            setConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm('Disconnect Stripe? Pending Stripe payouts will still be processed.')) return;
        setDisconnecting(true);
        setError('');
        try {
            await disconnectStripe();
            onDisconnect();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to disconnect Stripe');
        } finally {
            setDisconnecting(false);
        }
    };

    return (
        <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-5">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">💜</span>
                <div>
                    <h4 className="font-semibold text-gray-900">Stripe Account</h4>
                    <p className="text-xs text-gray-500">International credit/debit cards & bank transfers</p>
                </div>
                {isConnected && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Connected
                    </span>
                )}
            </div>

            {error && (
                <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
            )}

            {isConnected ? (
                <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border border-purple-100">
                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <p className="text-gray-500 text-xs">Account ID</p>
                                <p className="font-mono text-gray-800 font-medium">{accountId}</p>
                            </div>
                            {connectedAt && (
                                <div className="text-right">
                                    <p className="text-gray-500 text-xs">Connected</p>
                                    <p className="text-gray-700 text-xs font-medium">{connectedAt}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-purple-700 bg-purple-100 rounded-lg p-2">
                        <Shield className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>5% platform fee applies on withdrawals. You manage your own Stripe payouts.</span>
                    </div>
                    <button
                        onClick={handleDisconnect}
                        disabled={disconnecting}
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
                    >
                        <Unlink className="w-3.5 h-3.5" />
                        {disconnecting ? 'Disconnecting…' : 'Disconnect Stripe'}
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                        Connect your Stripe account to receive USD payouts directly. You manage your own funds on Stripe.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                        <li>✅ Receive earnings in USD</li>
                        <li>✅ International cards accepted</li>
                        <li>✅ Direct bank transfers</li>
                        <li>⚠️ 5% platform fee on withdrawals</li>
                    </ul>
                    <button
                        onClick={handleConnect}
                        disabled={connecting}
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                        <ExternalLink className="w-4 h-4" />
                        {connecting ? 'Redirecting to Stripe…' : 'Connect Stripe Account'}
                    </button>
                </div>
            )}
        </div>
    );
}
