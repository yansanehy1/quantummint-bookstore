import React from 'react';

export const Footer = () => {
    return (
        <footer className="bg-slate-800 text-white py-12 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="flex justify-center space-x-6 mb-6">
                    <button className="text-slate-300 hover:text-amber-400">About</button>
                    <button className="text-slate-300 hover:text-amber-400">Privacy</button>
                    <button className="text-slate-300 hover:text-amber-400">Terms</button>
                    <button className="text-slate-300 hover:text-amber-400">Contact</button>
                </div>
                <p className="text-slate-400 text-sm">
                    &copy; {new Date().getFullYear()} QuantumMint Learning Platform. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
