<<<<<<< HEAD

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { BookOpen, Users, Copy, Share2, TrendingUp, Mail } from "lucide-react";

export const Referrals = () => {
  const [, setLocation] = useLocation();
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const referralCode = "REF_12345";
  const referralLink = `https://sierrabooks.com/?ref=${referralCode}`;
  const bonusAmount = "$5.00";

  const mockReferrals = [
    {
      id: 1,
      name: "Fatima Jalloh",
      email: "fatima@example.com",
      status: "completed",
      bonusEarned: "$5.00",
      dateJoined: "2024-01-10",
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      email: "ahmed@example.com",
      status: "pending",
      bonusEarned: "$0.00",
      dateJoined: "2024-01-15",
    },
    {
      id: 3,
      name: "Koroma Ibrahim",
      email: "koroma@example.com",
      status: "completed",
      bonusEarned: "$5.00",
      dateJoined: "2024-01-12",
    },
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = () => {
    if (!inviteEmail) {
      alert("Please enter an email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    alert(`Email invitation sent to ${inviteEmail}! They will receive your referral link and can join Sierra Books.`);
    setInviteEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}> 
            <BookOpen className="w-8 h-8 text-amber-600" />
            <h1 className="text-2xl font-bold text-gray-900">Sierra Books</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <button onClick={() => setLocation("/")} className="text-gray-700 hover:text-amber-600 font-medium">Home</button>
            <button onClick={() => setLocation("/library")} className="text-gray-700 hover:text-amber-600 font-medium">Library</button>
            <button onClick={() => setLocation("/dashboard")} className="text-gray-700 hover:text-amber-600 font-medium">Dashboard</button>
          </nav>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-12">
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Referral Program</h1>
          <p className="text-xl text-gray-600">Share Sierra Books with friends and earn bonuses on their first purchase.</p>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Referrals</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
              </div>
              <Users className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">2</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Earned</p>
                <p className="text-3xl font-bold text-gray-900">$10.00</p>
              </div>
              <TrendingUp className="w-12 h-12 text-amber-600 opacity-20" />
            </div>
          </Card>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50">
            <h3 className="text-2xl font-bold mb-6">Your Referral Code</h3>
            <div className="bg-white border-2 border-purple-200 rounded-lg p-6 mb-6">
              <p className="text-gray-600 text-sm mb-2">Share this code with friends</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-purple-600 font-mono">{referralCode}</p>
                <Button onClick={handleCopyCode} variant="outline" size="sm" className="ml-auto">
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
            <p className="text-gray-700 mb-4">Friends who use your code get a discount on their first purchase, and you earn <strong>{bonusAmount}</strong> when they complete their first purchase.</p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-cyan-50 to-blue-50">
            <h3 className="text-2xl font-bold mb-6">Referral Link</h3>
            <div className="bg-white border-2 border-cyan-200 rounded-lg p-6 mb-6">
              <p className="text-gray-600 text-sm mb-2">Share this link directly</p>
              <div className="flex items-center gap-3">
                <p className="text-sm font-mono text-cyan-600 truncate">{referralLink}</p>
                <Button onClick={handleCopyLink} variant="outline" size="sm" className="ml-auto flex-shrink-0">
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
            <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
              <Share2 className="w-4 h-4 mr-2" />
              Share on Social Media
            </Button>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Invite Friends by Email</h3>
            <div className="flex gap-3 mb-6">
              <Input type="email" placeholder="Enter friend's email address" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="py-2 h-12" />
              <Button onClick={handleSendInvite} className="bg-purple-600 hover:bg-purple-700">
                <Mail className="w-4 h-4 mr-2" />
                Send Invite
              </Button>
            </div>
            <p className="text-gray-600 text-sm">Your friend will receive an email with your referral link and a special welcome offer.</p>
          </Card>
        </section>

        <section>
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Your Referrals</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date Joined</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Bonus Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockReferrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{ref.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{ref.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{ref.dateJoined}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ref.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{ref.bonusEarned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {mockReferrals.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No referrals yet. Start sharing to earn bonuses!</p>
              </div>
            )}
          </Card>
        </section>

        <section className="mt-12">
          <Card className="p-8 bg-gradient-to-r from-amber-50 to-orange-50">
            <h3 className="text-2xl font-bold mb-6">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-lg mb-4">1</div>
                <h4 className="font-bold text-gray-900 mb-2">Share Your Code</h4>
                <p className="text-gray-700">Share your referral code or link with friends and family.</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-lg mb-4">2</div>
                <h4 className="font-bold text-gray-900 mb-2">They Sign Up</h4>
                <p className="text-gray-700">Your friend signs up using your code and gets a welcome bonus.</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-lg mb-4">3</div>
                <h4 className="font-bold text-gray-900 mb-2">You Earn</h4>
                <p className="text-gray-700">When they make their first purchase, you earn {bonusAmount}!</p>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}




=======
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

    const handleEmailShare = () => {
        const subject = encodeURIComponent('Join QuantumMint Bookstore!');
        const body = encodeURIComponent(
            `I've been using QuantumMint Bookstore for educational content and thought you might like it too!\n\n` +
            `Sign up using my referral link and we both get 2 hours of free reading/listening time:\n${referralLink}\n\n` +
            `QuantumMint offers books for JSS, SSS, College, University, and Adult Education levels.`
        );
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    };

    const handleTwitterShare = () => {
        const text = encodeURIComponent(
            `Join me on QuantumMint Bookstore! Get access to educational content across all levels. Sign up with my link and we both get 2 hours free! 📚`
        );
        const url = encodeURIComponent(referralLink);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=550,height=420');
    };

    const handleFacebookShare = () => {
        const url = encodeURIComponent(referralLink);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=550,height=420');
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
                            <button
                                onClick={handleEmailShare}
                                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-700 font-medium"
                            >
                                <Share2 className="w-4 h-4" /> Share via Email
                            </button>
                            <button
                                onClick={handleTwitterShare}
                                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-700 font-medium"
                            >
                                <Share2 className="w-4 h-4" /> Share on Twitter
                            </button>
                            <button
                                onClick={handleFacebookShare}
                                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-700 font-medium"
                            >
                                <Share2 className="w-4 h-4" /> Share on Facebook
                            </button>
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
>>>>>>> eee79d7da06a64aee98daa05ffcfbc5ba43db233
