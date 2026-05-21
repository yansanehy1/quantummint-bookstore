import React, { useState, useEffect } from 'react';
import { Users, Mail, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { subscriptionsAPI } from '../utils/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { toast } from 'sonner';

export default function BatchSubscription() {
    const [plans, setPlans] = useState<any[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<string>('');
    const [currency, setCurrency] = useState<'SLL' | 'USD'>('SLL');
    const [emails, setEmails] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingPlans, setIsFetchingPlans] = useState(true);
    const [results, setResults] = useState<any>(null);

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const data = await subscriptionsAPI.getPlans();
                setPlans(data.plans);
                if (data.plans.length > 0) setSelectedPlan(data.plans[0].id);
            } catch (err) {
                toast.error('Failed to load subscription plans');
            } finally {
                setIsFetchingPlans(false);
            }
        };
        loadPlans();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailList = emails.split(/[\n,]+/).map(e => e.trim()).filter(e => e.length > 0);
        
        if (emailList.length === 0) {
            toast.error('Please enter at least one email');
            return;
        }

        setIsLoading(true);
        setResults(null);

        try {
            const data = await subscriptionsAPI.subscribeBatch({
                planId: selectedPlan,
                currency,
                recipientEmails: emailList
            });

            setResults(data);
            if (data.missingEmails.length > 0) {
                toast.warning(`Subscribed ${data.processedCount} users. ${data.missingEmails.length} emails not found.`);
            } else {
                toast.success(`Successfully subscribed all ${data.processedCount} users!`);
                setEmails('');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to process batch subscription');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetchingPlans) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-quantum-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Users className="text-quantum-600" />
                    Batch Subscription
                </h1>
                <p className="text-slate-600 mt-2">
                    Pay for multiple users at once. Perfect for families, small teams, or gifting.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Card className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Step 1: Choose a Plan
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            onClick={() => setSelectedPlan(plan.id)}
                                            className={`cursor-pointer p-4 border-2 rounded-xl transition-all ${
                                                selectedPlan === plan.id
                                                    ? 'border-quantum-600 bg-quantum-50'
                                                    : 'border-slate-100 hover:border-slate-200'
                                            }`}
                                        >
                                            <div className="font-bold text-slate-900">{plan.id.toUpperCase()}</div>
                                            <div className="text-sm text-slate-500">{plan.durationHours} Hours</div>
                                            <div className="mt-2 text-quantum-700 font-bold">
                                                {currency === 'SLL' ? `${plan.priceSLL.toLocaleString()} SLL` : `$${plan.priceUSD}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Step 2: Choose Currency
                                </label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setCurrency('SLL')}
                                        className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                                            currency === 'SLL' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        Sierra Leonean Leone (SLL)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrency('USD')}
                                        className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                                            currency === 'USD' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        US Dollar (USD)
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Step 3: Recipient Emails
                                </label>
                                <p className="text-xs text-slate-500 mb-2">
                                    Enter one email per line or separate by commas.
                                </p>
                                <textarea
                                    className="w-full h-32 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-quantum-500 focus:border-quantum-500 outline-none transition-all"
                                    placeholder="user1@example.com&#10;user2@example.com"
                                    value={emails}
                                    onChange={(e) => setEmails(e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Processing Batch...
                                    </>
                                ) : (
                                    <>
                                        Activate Subscriptions
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Card>
                </div>

                <div>
                    <Card className="p-6 bg-slate-50 border-none sticky top-8">
                        <h3 className="font-bold text-slate-900 mb-4">Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Plan:</span>
                                <span className="font-medium text-slate-900">{selectedPlan.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Recipients:</span>
                                <span className="font-medium text-slate-900">
                                    {emails.split(/[\n,]+/).filter(e => e.trim().length > 0).length}
                                </span>
                            </div>
                            <div className="border-t border-slate-200 pt-3 flex justify-between text-base">
                                <span className="font-bold text-slate-900">Total:</span>
                                <span className="font-bold text-quantum-700">
                                    {currency === 'SLL' 
                                        ? `${((plans.find(p => p.id === selectedPlan)?.priceSLL || 0) * emails.split(/[\n,]+/).filter(e => e.trim().length > 0).length).toLocaleString()} SLL`
                                        : `$${(plans.find(p => p.id === selectedPlan)?.priceUSD || 0) * emails.split(/[\n,]+/).filter(e => e.trim().length > 0).length}`
                                    }
                                </span>
                            </div>
                        </div>

                        {results && (
                            <div className="mt-8 space-y-4">
                                <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <span className="text-sm text-green-800">
                                        {results.processedCount} users successfully subscribed.
                                    </span>
                                </div>
                                
                                {results.missingEmails.length > 0 && (
                                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                        <div className="flex gap-3 mb-2">
                                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                            <span className="text-sm font-bold text-amber-800">
                                                Emails not found (Skipped):
                                            </span>
                                        </div>
                                        <ul className="text-xs text-amber-700 list-disc pl-5">
                                            {results.missingEmails.map((email: string) => (
                                                <li key={email}>{email}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
