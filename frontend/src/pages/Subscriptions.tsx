import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Check, RefreshCw } from 'lucide-react';
import { subscriptionsAPI, type SubscriptionPlan } from '../utils/api';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const PLAN_LABELS: Record<string, string> = {
    '12hours': '12 Hours',
    '24hours': '24 Hours',
    '7days': '7 Days',
    '30days': '30 Days',
};

export const Subscriptions: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { rate: exchangeRate, loading: rateLoading } = useExchangeRate();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState<'SLL' | 'USD'>('SLL');
    const [subscribing, setSubscribing] = useState<string | null>(null);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        setLoading(true);
        try {
            const data = await subscriptionsAPI.getPlans();
            setPlans(data.plans);
        } catch {
            toast.error('Failed to load subscription plans');
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planId: string) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/subscriptions' } });
            return;
        }
        setSubscribing(planId);
        try {
            await subscriptionsAPI.subscribe(
                planId as '12hours' | '24hours' | '7days' | '30days',
                currency
            );
            toast.success('Subscription activated! Funds deducted from your wallet.');
            navigate('/wallet');
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Subscription failed';
            if (msg.toLowerCase().includes('insufficient')) {
                toast.error('Insufficient balance — add funds in your wallet first.');
                navigate('/wallet');
            } else {
                toast.error(msg);
            }
        } finally {
            setSubscribing(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">Subscription Plans</h1>
                    <p className="text-lg text-slate-600 max-w-xl mx-auto">
                        Pay from your QuantumMint wallet. Live rate:{' '}
                        <span className="font-semibold text-emerald-700">
                            {rateLoading ? '…' : `1 USD = ${exchangeRate.toLocaleString()} SLL`}
                        </span>
                    </p>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                        <button
                            type="button"
                            onClick={() => setCurrency('SLL')}
                            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
                                currency === 'SLL' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                            }`}
                        >
                            Pay in SLL (Le)
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrency('USD')}
                            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
                                currency === 'USD' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                            }`}
                        >
                            Pay in USD ($)
                        </button>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => {
                        const price = currency === 'USD' ? plan.priceUSD : plan.priceSLL;
                        const altPrice =
                            currency === 'USD'
                                ? `≈ Le ${(plan.priceUSD * exchangeRate).toLocaleString()}`
                                : `≈ $${plan.priceSLLinUSD.toFixed(2)}`;

                        return (
                            <div
                                key={plan.id}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-400 transition-all p-6 flex flex-col"
                            >
                                <div className="flex items-center gap-2 text-emerald-600 mb-4">
                                    <Clock size={20} />
                                    <span className="text-sm font-bold uppercase tracking-wide">
                                        {PLAN_LABELS[plan.id] || plan.id}
                                    </span>
                                </div>
                                <p className="text-3xl font-black text-slate-900 mb-1">
                                    {currency === 'USD' ? `$${price}` : `Le ${price.toLocaleString()}`}
                                </p>
                                <p className="text-sm text-slate-500 mb-6">{altPrice}</p>
                                <ul className="space-y-2 mb-6 flex-1 text-sm text-slate-600">
                                    <li className="flex gap-2">
                                        <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                        {plan.durationHours}h full platform access
                                    </li>
                                    <li className="flex gap-2">
                                        <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                        Deducted from wallet balance
                                    </li>
                                </ul>
                                <button
                                    type="button"
                                    disabled={subscribing === plan.id}
                                    onClick={() => handleSubscribe(plan.id)}
                                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2"
                                >
                                    {subscribing === plan.id ? (
                                        <>
                                            <RefreshCw size={16} className="animate-spin" />
                                            Processing…
                                        </>
                                    ) : (
                                        'Subscribe'
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <p className="text-center text-sm text-slate-500 mt-10">
                    Need funds first?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/wallet')}
                        className="text-emerald-600 font-semibold hover:underline"
                    >
                        Top up your wallet
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Subscriptions;
