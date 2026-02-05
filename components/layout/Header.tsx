import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { Home, Library, LayoutDashboard, Wallet, BarChart2, Sparkles, LogOut } from 'lucide-react';

export const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const getDashboardPath = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin';
        if (user.role === 'educator') return '/seller/dashboard';
        return '/reading-analytics';
    };

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/library', label: 'Library', icon: Library },
        { path: getDashboardPath(), label: 'Dashboard', icon: LayoutDashboard },
        { path: '/wallet', label: 'Wallet', icon: Wallet },
        { path: '/reading-analytics', label: 'Analytics', icon: BarChart2 },
        { path: '/studio', label: 'AI Hub', icon: Sparkles },
    ];

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-amber-600 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <div
                    className="flex items-center gap-2 text-2xl font-bold text-white cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <img
                        src="/logo.png"
                        alt="QuantumMint"
                        className="h-8 w-8 bg-white rounded-lg p-1"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    <span>QuantumMint</span>
                </div>

                <nav className="hidden md:flex items-center space-x-1">
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive(item.path)
                                ? 'bg-white/20 text-white'
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <Button
                            size="md"
                            className="bg-white/20 text-white hover:bg-white/30 border-none font-bold backdrop-blur-sm"
                            onClick={logout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    ) : (
                        <Button
                            size="md"
                            className="bg-white text-orange-600 hover:bg-orange-50 border-none font-bold"
                            onClick={() => navigate('/login')}
                        >
                            Sign In
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};
