import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BookUpdateNotifications from './BookUpdateNotifications';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, signOut } = useAuth();

    const handleSignOut = () => {
        signOut();
        navigate('/');
    };

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Marketplace', href: '/marketplace' },
        // Hide Create from learners and support
        ...(user?.role !== 'learner' && user?.role !== 'support' ? [{ name: 'Create', href: '/create' }] : []),
        { name: 'Library', href: '/library' },
        // Show Wallet only to authenticated users
        ...(isAuthenticated ? [{ name: 'Wallet', href: '/wallet' }] : []),
        { name: 'Pricing', href: '/pricing' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navigation */}
            <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-3">
                                <img src="/logo.png" alt="QuantumMint Logo" className="h-10 w-10" />
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-white leading-tight">
                                        QuantumMint Bookstore
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive(item.href)
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* Dashboards Dropdown - Only for Admins */}
                            {user?.role === 'admin' && (
                                <div className="relative group">
                                    <button className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 flex items-center gap-1">
                                        Dashboards
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute right-0 mt-2 w-52 bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <Link
                                            to="/dashboard"
                                            className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-t-lg transition-colors"
                                        >
                                            📊 My Dashboard
                                        </Link>
                                        <Link
                                            to="/creator"
                                            className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        >
                                            💼 Creator Dashboard
                                        </Link>
                                        <Link
                                            to="/support"
                                            className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        >
                                            🛠️ Support Dashboard
                                        </Link>
                                        <Link
                                            to="/admin"
                                            className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-b-lg transition-colors"
                                        >
                                            🔧 Admin Dashboard
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notifications & User Menu */}
                        <div className="hidden md:flex items-center space-x-4">
                            <BookUpdateNotifications />
                            {isAuthenticated ? (
                                <button
                                    onClick={handleSignOut}
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Sign Out
                                </button>
                            ) : (
                                <>
                                    <Link to="/signin" className="text-gray-300 hover:text-white transition-colors">
                                        Sign In
                                    </Link>
                                    <Link to="/get-started" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-300 hover:text-white"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-gray-800 border-t border-gray-700">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-lg font-medium ${isActive(item.href)
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <div className="px-4 py-3 border-t border-gray-700 space-y-2">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        handleSignOut();
                                    }}
                                    className="block w-full text-left text-gray-300 hover:text-white px-3 py-2"
                                >
                                    Sign Out
                                </button>
                            ) : (
                                <>
                                    <Link
                                        to="/signin"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full text-left text-gray-300 hover:text-white px-3 py-2"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/get-started"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-2 rounded-lg font-medium text-center"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                                <span className="text-xl font-bold text-white tracking-tight">QuantumMint Bookstore</span>
                            </div>
                            <p className="text-gray-400 max-w-sm mb-6">
                                Transforming education through high-performance digital content and sponsored learning.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Platform</h3>
                            <ul className="space-y-2">
                                <li><Link to="/marketplace" className="text-gray-400 hover:text-white">Marketplace</Link></li>
                                <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
                        <p>&copy; 2024 QuantumMint Bookstore. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
