import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Share2, Copy, Users, Gift, TrendingUp, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Referrals() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Referrals - Quantummint Bookstore';
    }, []);
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);

    const referralCode = user?.id ? `REF-${user.id.substring(0, 6).toUpperCase()}` : 'REF-XXXXXX';
    const referralLink = `https://quantummint.net/register?ref=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };



    const mockReferrals = [
        { id: 1, user: "Alice Smith", date: "2024-03-15", status: "Active", earned: "$5.00" },
        { id: 2, user: "Bob Johnson", date: "2024-03-12", status: "Pending", earned: "$0.00" },
        { id: 3, user: "Carol White", date: "2024-03-10", status: "Active", earned: "$5.00" },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Referral Program</h1>
                    <p className="text-slate-600">Invite friends and earn 2 hours of reading/listening time when they join and make their first purchase.</p>
                </div>
                <Button onClick={() => navigate('/wallet')} variant="outline">
                    View Earnings in Wallet
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-quantum-600 to-quantum-700 text-white">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-quantum-100 font-medium mb-1">Total Earnings</p>
                            <h3 className="text-3xl font-bold">$125.00</h3>
                        </div>
                        <div className="p-2 bg-white/10 rounded-lg">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="text-sm text-quantum-100">
                        + $15.00 this month
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-slate-500 font-medium mb-1">Total Referrals</p>
                            <h3 className="text-3xl font-bold text-slate-900">24</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="text-sm text-green-600 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        + 3 this week
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-slate-500 font-medium mb-1">Pending Rewards</p>
                            <h3 className="text-3xl font-bold text-slate-900">$15.00</h3>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <Gift className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                    <div className="text-sm text-slate-500">
                        Available after 30 days
                    </div>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Your Referral Link</h3>
                        <div className="flex gap-3 mb-6">
                            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-600 font-mono text-sm truncate">
                                {referralLink}
                            </div>
                            <Button onClick={handleCopy} variant={copied ? "primary" : "outline"}>
                                {copied ? "Copied!" : <><Copy className="w-4 h-4 mr-2" /> Copy</>}
                            </Button>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <a
                                href={`mailto:?subject=${encodeURIComponent('Join QuantumMint Bookstore!')}&body=${encodeURIComponent(
                                    `I've been using QuantumMint Bookstore for educational content and thought you might like it too!\n\n` +
                                    `Sign up using my referral link and we both get 2 hours of free reading/listening time:\n${referralLink}\n\n` +
                                    `QuantumMint offers books for JSS, SSS, College, University, and Adult Education levels.`
                                )}`}
                                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-700 font-medium"
                            >
                                <Share2 className="w-4 h-4" /> Share via Email
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                    `Join me on QuantumMint Bookstore! Get access to educational content across all levels. Sign up with my link and we both get 2 hours free! 📚`
                                )}&url=${encodeURIComponent(referralLink)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-700 font-medium"
                            >
                                <Share2 className="w-4 h-4" /> Share on Twitter
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-700 font-medium"
                            >
                                <Share2 className="w-4 h-4" /> Share on Facebook
                            </a>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Referral History</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">User</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date Joined</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Earned</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {mockReferrals.map((referral) => (
                                        <tr key={referral.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-sm font-medium text-slate-900">{referral.user}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{referral.date}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${referral.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {referral.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-slate-900 text-right">{referral.earned}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        <h3 className="text-xl font-bold mb-2">How it works</h3>
                        <ul className="space-y-4 mt-4">
                            <li className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">1</div>
                                <p className="text-indigo-100 text-sm">Share your unique referral link with friends and followers.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">2</div>
                                <p className="text-indigo-100 text-sm">They sign up and make their first purchase on QuantumMint.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">3</div>
                                <p className="text-indigo-100 text-sm">You earn 2 hours of reading/listening time for every qualified referral!</p>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
}

