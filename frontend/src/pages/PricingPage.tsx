import * as React from 'react';
import { Link } from 'react-router-dom';
import { PRICING } from '../types';

export function PricingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Flexible Pricing for Everyone
                    </h1>
                    <p className="text-xl text-purple-200 max-w-2xl mx-auto">
                        Choose between pay-per-use or subscription. Start listening today!
                    </p>
                </div>

                {/* Pay-Per-Use */}
                <div className="mb-16">
                    <div className="glass-card max-w-2xl mx-auto p-8">
                        <div className="text-center">
                            <div className="text-5xl mb-4">⏱️</div>
                            <h2 className="text-3xl font-bold text-white mb-2">Pay-Per-Use</h2>
                            <p className="text-purple-200 mb-6">Pay only for what you listen</p>
                            <div className="bg-white/10 rounded-lg p-6 mb-6">
                                <div className="text-4xl font-bold text-white mb-2">
                                    Le 1 <span className="text-2xl text-purple-200">/ hour</span>
                                </div>
                                <div className="text-lg text-purple-300">
                                    $0.017 / hour
                                </div>
                            </div>
                            <ul className="text-left space-y-3 mb-8">
                                <li className="flex items-center text-purple-100">
                                    <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    No commitment - pay as you go
                                </li>
                                <li className="flex items-center text-purple-100">
                                    <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Charged based on actual listening time
                                </li>
                                <li className="flex items-center text-purple-100">
                                    <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Perfect for occasional listeners
                                </li>
                                <li className="flex items-center text-purple-100">
                                    <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    75% goes directly to creators
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Subscriptions */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white text-center mb-8">
                        ♾️ Unlimited Subscriptions
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* 12 Hours */}
                        <div className="glass-card p-6 hover:scale-105 transition-transform">
                            <h3 className="text-xl font-bold text-white mb-2">12 Hours</h3>
                            <div className="text-3xl font-bold text-purple-300 mb-4">
                                Le {PRICING.subscription.halfDay.sll}
                            </div>
                            <div className="text-sm text-purple-200 mb-4">
                                ${PRICING.subscription.halfDay.usd.toFixed(3)} USD
                            </div>
                            <ul className="space-y-2 text-sm text-purple-100 mb-6">
                                <li>✓ Unlimited listening</li>
                                <li>✓ 12-hour duration</li>
                                <li>✓ Auto-renew option</li>
                            </ul>
                            <Link
                                to="/subscription"
                                className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-center transition-colors"
                            >
                                Subscribe
                            </Link>
                        </div>

                        {/* 24 Hours */}
                        <div className="glass-card p-6 hover:scale-105 transition-transform">
                            <h3 className="text-xl font-bold text-white mb-2">24 Hours</h3>
                            <div className="text-3xl font-bold text-purple-300 mb-4">
                                Le {PRICING.subscription.daily.sll}
                            </div>
                            <div className="text-sm text-purple-200 mb-4">
                                ${PRICING.subscription.daily.usd.toFixed(3)} USD
                            </div>
                            <ul className="space-y-2 text-sm text-purple-100 mb-6">
                                <li>✓ Unlimited listening</li>
                                <li>✓ Full day access</li>
                                <li>✓ Best for daily listeners</li>
                            </ul>
                            <Link
                                to="/subscription"
                                className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-center transition-colors"
                            >
                                Subscribe
                            </Link>
                        </div>

                        {/* 7 Days - Most Popular */}
                        <div className="glass-card p-6 border-2 border-purple-400 relative hover:scale-105 transition-transform">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                                POPULAR
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">7 Days</h3>
                            <div className="text-3xl font-bold text-purple-300 mb-4">
                                Le {PRICING.subscription.weekly.sll}
                            </div>
                            <div className="text-sm text-purple-200 mb-4">
                                ${PRICING.subscription.weekly.usd.toFixed(3)} USD
                            </div>
                            <ul className="space-y-2 text-sm text-purple-100 mb-6">
                                <li>✓ Unlimited listening</li>
                                <li>✓ Full week access</li>
                                <li>✓ Best value/hour</li>
                            </ul>
                            <Link
                                to="/subscription"
                                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg text-center transition-all"
                            >
                                Subscribe
                            </Link>
                        </div>

                        {/* 30 Days */}
                        <div className="glass-card p-6 hover:scale-105 transition-transform">
                            <h3 className="text-xl font-bold text-white mb-2">30 Days</h3>
                            <div className="text-3xl font-bold text-purple-300 mb-4">
                                Le {PRICING.subscription.monthly.sll}
                            </div>
                            <div className="text-sm text-purple-200 mb-4">
                                ${PRICING.subscription.monthly.usd.toFixed(3)} USD
                            </div>
                            <ul className="space-y-2 text-sm text-purple-100 mb-6">
                                <li>✓ Unlimited listening</li>
                                <li>✓ Full month access</li>
                                <li>✓ Maximum savings</li>
                            </ul>
                            <Link
                                to="/subscription"
                                className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-center transition-colors"
                            >
                                Subscribe
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Revenue Share Info */}
                <div className="glass-card max-w-3xl mx-auto p-8">
                    <h3 className="text-2xl font-bold text-white mb-4 text-center">
                        💰 Supporting Creators
                    </h3>
                    <p className="text-purple-100 text-center mb-6">
                        <span className="text-3xl font-bold text-green-400">75%</span> of all revenue goes directly to creators
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-purple-200 mb-2">Pay-Per-Use</h4>
                            <p className="text-sm text-purple-300">
                                For every Leone you spend, Le 0.75 goes to the creator
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-purple-200 mb-2">Subscriptions</h4>
                            <p className="text-sm text-purple-300">
                                75% of subscription fees are distributed to creators based on listening time
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Ready to Start Listening?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/marketplace"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
                        >
                            Browse Audiobooks
                        </Link>
                        <Link
                            to="/subscription"
                            className="bg-white hover:bg-gray-100 text-purple-600 px-8 py-3 rounded-lg font-bold transition-colors"
                        >
                            Subscribe Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
