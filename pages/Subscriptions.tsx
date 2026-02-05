import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Clock, Zap, Calendar, TrendingUp, Check, Star } from 'lucide-react';

interface Plan {
    id: string;
    sku: string;
    name: string;
    description: string;
    access_period_unit: string;
    access_period_value: number;
    price_amount: number;
    price_currency: string;
    billing_interval: string;
    recurring_interval?: string;
    max_concurrent_streams: number;
    max_quality: string;
    max_downloads: number;
    allowed_product_types?: string[];
    features: string[];
    is_featured: boolean;
}

export const Subscriptions: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<'time-based' | 'recurring'>('time-based');

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const baseUrl = import.meta.env.VITE_SUBSCRIPTION_SERVICE_URL || 'http://localhost:4100';
            const response = await fetch(`${baseUrl}/api/plans`);
            const data = await response.json();
            if (data.success) {
                setPlans(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = (plan: Plan) => {
        // Navigate to checkout or payment
        console.log('Selected plan:', plan);
        // TODO: Implement checkout flow
    };

    const timeBasedPlans = plans.filter(p => p.billing_interval === 'one_time');
    const recurringPlans = plans.filter(p => p.billing_interval === 'recurring');

    const hourlyPlans = timeBasedPlans.filter(p => p.access_period_unit === 'hour');
    const dailyPlans = timeBasedPlans.filter(p => p.access_period_unit === 'day');
    const weeklyPlans = timeBasedPlans.filter(p => p.access_period_unit === 'week');

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-slate-600">Loading subscription plans...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-slate-900 mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Flexible subscription options for every learning style. Pay only for what you need.
                    </p>
                </div>

                {/* Tab Selector */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                        <button
                            onClick={() => setSelectedTab('time-based')}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all ${selectedTab === 'time-based'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <Clock className="inline mr-2" size={20} />
                            Time-Based Access
                        </button>
                        <button
                            onClick={() => setSelectedTab('recurring')}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all ${selectedTab === 'recurring'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <TrendingUp className="inline mr-2" size={20} />
                            Recurring Plans
                        </button>
                    </div>
                </div>

                {/* Time-Based Plans */}
                {selectedTab === 'time-based' && (
                    <div className="space-y-16">
                        {/* Hourly Plans */}
                        {hourlyPlans.length > 0 && (
                            <PlanSection
                                title="Hourly Access"
                                subtitle="Perfect for quick learning sessions"
                                icon={<Zap className="text-yellow-500" size={32} />}
                                plans={hourlyPlans}
                                onSelectPlan={handleSelectPlan}
                            />
                        )}

                        {/* Daily Plans */}
                        {dailyPlans.length > 0 && (
                            <PlanSection
                                title="Daily Access"
                                subtitle="Full day of unlimited learning"
                                icon={<Calendar className="text-blue-500" size={32} />}
                                plans={dailyPlans}
                                onSelectPlan={handleSelectPlan}
                            />
                        )}

                        {/* Weekly Plans */}
                        {weeklyPlans.length > 0 && (
                            <PlanSection
                                title="Weekly Access"
                                subtitle="Intensive week-long learning"
                                icon={<TrendingUp className="text-purple-500" size={32} />}
                                plans={weeklyPlans}
                                onSelectPlan={handleSelectPlan}
                            />
                        )}
                    </div>
                )}

                {/* Recurring Plans */}
                {selectedTab === 'recurring' && (
                    <div className="grid md:grid-cols-3 gap-8">
                        {recurringPlans.map((plan) => (
                            <RecurringPlanCard
                                key={plan.id}
                                plan={plan}
                                onSelect={() => handleSelectPlan(plan)}
                            />
                        ))}
                    </div>
                )}

                {/* Feature Comparison */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
                        Compare Features
                    </h2>
                    <ComparisonTable plans={plans.slice(0, 4)} />
                </div>
            </div>
        </div>
    );
};

interface PlanSectionProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    plans: Plan[];
    onSelectPlan: (plan: Plan) => void;
}

const PlanSection: React.FC<PlanSectionProps> = ({ title, subtitle, icon, plans, onSelectPlan }) => (
    <div>
        <div className="flex items-center gap-4 mb-6">
            {icon}
            <div>
                <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
                <p className="text-slate-600">{subtitle}</p>
            </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onSelect={() => onSelectPlan(plan)} />
            ))}
        </div>
    </div>
);

interface PlanCardProps {
    plan: Plan;
    onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => (
    <Card className="relative hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500">
        {plan.is_featured && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star size={14} fill="white" />
                    POPULAR
                </div>
            </div>
        )}
        <CardContent className="p-8">
            <div className="text-center mb-6">
                <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">
                    {plan.access_period_value} {plan.access_period_unit}{plan.access_period_value > 1 ? 's' : ''}
                </div>
                <div className="text-5xl font-bold text-slate-900 mb-2">
                    ${plan.price_amount}
                </div>
                <div className="text-slate-500 text-sm">
                    ≈ ${(plan.price_amount / plan.access_period_value).toFixed(2)}/{plan.access_period_unit}
                </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                {plan.name}
            </h3>
            <p className="text-slate-600 text-center mb-6">
                {plan.description}
            </p>

            <div className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                        <Check className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                        <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                ))}
                <div className="flex items-start gap-2">
                    <Check className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-700 text-sm">{plan.max_quality} streaming</span>
                </div>
                <div className="flex items-start gap-2">
                    <Check className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-700 text-sm">{plan.max_concurrent_streams} concurrent stream{plan.max_concurrent_streams > 1 ? 's' : ''}</span>
                </div>
                {plan.max_downloads > 0 && (
                    <div className="flex items-start gap-2">
                        <Check className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                        <span className="text-slate-700 text-sm">{plan.max_downloads} downloads</span>
                    </div>
                )}
            </div>

            <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3"
                onClick={() => console.log('Select', plan.id)}
            >
                Get {plan.access_period_value} {plan.access_period_unit}{plan.access_period_value > 1 ? 's' : ''}
            </Button>
        </CardContent>
    </Card>
);

const RecurringPlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => (
    <Card className={`relative ${plan.is_featured ? 'ring-4 ring-emerald-500 shadow-2xl scale-105' : 'shadow-lg'} hover:shadow-2xl transition-all duration-300`}>
        {plan.is_featured && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    BEST VALUE
                </div>
            </div>
        )}
        <CardHeader className="bg-gradient-to-br from-slate-50 to-slate-100 border-b">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">
                {plan.name}
            </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
            <div className="text-center mb-6">
                <div className="text-6xl font-bold text-slate-900 mb-2">
                    ${plan.price_amount}
                </div>
                <div className="text-slate-600">
                    per {plan.recurring_interval?.replace('ly', '')}
                </div>
                {plan.recurring_interval === 'yearly' && (
                    <div className="mt-2 text-emerald-600 font-semibold text-sm">
                        Save 2-3 months vs monthly!
                    </div>
                )}
            </div>

            <p className="text-slate-600 text-center mb-6">
                {plan.description}
            </p>

            <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <Check className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-slate-700">{feature}</span>
                    </div>
                ))}
            </div>

            <Button
                className={`w-full font-bold py-4 text-lg ${plan.is_featured
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                onClick={onSelect}
            >
                Subscribe Now
            </Button>
        </CardContent>
    </Card>
);

const ComparisonTable: React.FC<{ plans: Plan[] }> = ({ plans }) => (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-slate-200">
        <table className="w-full">
            <thead>
                <tr className="bg-slate-900 text-white">
                    <th className="p-4 text-left font-bold">Feature</th>
                    {plans.map((plan) => (
                        <th key={plan.id} className="p-4 text-center font-bold">
                            {plan.name}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-700">Price</td>
                    {plans.map((plan) => (
                        <td key={plan.id} className="p-4 text-center font-bold text-emerald-600">
                            ${plan.price_amount}
                        </td>
                    ))}
                </tr>
                <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-700">Streaming Quality</td>
                    {plans.map((plan) => (
                        <td key={plan.id} className="p-4 text-center">
                            {plan.max_quality}
                        </td>
                    ))}
                </tr>
                <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-700">Concurrent Streams</td>
                    {plans.map((plan) => (
                        <td key={plan.id} className="p-4 text-center">
                            {plan.max_concurrent_streams}
                        </td>
                    ))}
                </tr>
                <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-700">Downloads</td>
                    {plans.map((plan) => (
                        <td key={plan.id} className="p-4 text-center">
                            {plan.max_downloads > 0 ? plan.max_downloads : '—'}
                        </td>
                    ))}
                </tr>
                <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-700">Content Types</td>
                    {plans.map((plan) => (
                        <td key={plan.id} className="p-4 text-center text-sm">
                            {plan.allowed_product_types?.join(', ') || 'All'}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    </div>
);
