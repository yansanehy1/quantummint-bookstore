import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '../ui/Button';

export const Header = () => {
    const [, setLocation] = useLocation();

    return (
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div
                    className="text-2xl font-bold text-amber-600 cursor-pointer"
                    onClick={() => setLocation('/')}
                >
                    QuantumMint <span className="text-slate-700">| Learn</span>
                </div>
                <nav className="hidden md:flex space-x-6">
                    <button
                        onClick={() => setLocation('/library')}
                        className="text-gray-600 hover:text-amber-600 font-medium transition"
                    >
                        Library
                    </button>
                    <button
                        onClick={() => setLocation('/seller-dashboard')}
                        className="text-gray-600 hover:text-amber-600 font-medium transition"
                    >
                        Creator
                    </button>
                    <button
                        onClick={() => setLocation('/reading-analytics')}
                        className="text-gray-600 hover:text-amber-600 font-medium transition"
                    >
                        Analytics
                    </button>
                </nav>
                <Button
                    size="md"
                    variant="primary"
                    onClick={() => setLocation('/login')}
                >
                    Sign In
                </Button>
            </div>
        </header>
    );
};
