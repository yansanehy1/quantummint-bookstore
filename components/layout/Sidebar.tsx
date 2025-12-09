<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
    Home,
    BookOpen,
    ShoppingCart,
    Wallet as WalletIcon,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    Heart,
    TrendingUp,
    Gift,
    Users,
    BarChart2,
    Bell,
    ChevronDown,
    ChevronRight,
    Search,
    Headphones,
    Video,
    Sparkles
} from 'lucide-react';

interface SidebarProps {
    user?: any;
    onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [location] = useLocation();
    const [expandedSections, setExpandedSections] = useState<string[]>(['browse']);

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const isActive = (path: string) => location === path;

    const menuSections = [
        {
            title: 'Main',
            items: [
                { icon: Home, label: 'Home', path: '/' },
                { icon: Search, label: 'Discover', path: '/discover' },
                { icon: BookOpen, label: 'My Library', path: '/library' }
            ]
        },
        {
            title: 'Browse',
            id: 'browse',
            collapsible: true,
            items: [
                { icon: BookOpen, label: 'All Books', path: '/books' },
                { icon: Headphones, label: 'Audiobooks', path: '/audiobooks' },
                { icon: Video, label: 'Video Books', path: '/video-books' },
                { icon: Sparkles, label: 'New Releases', path: '/new-releases' },
                { icon: TrendingUp, label: 'Bestsellers', path: '/bestsellers' }
            ]
        },
        {
            title: 'Shopping',
            items: [
                { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: user?.cartCount },
                { icon: WalletIcon, label: 'Wallet', path: '/wallet' },
                { icon: Gift, label: 'Gifts', path: '/gifts' }
            ]
        }
    ];

    if (user?.role === 'admin') {
        menuSections.push({
            title: 'Admin',
            items: [
                { icon: BarChart2, label: 'Dashboard', path: '/admin' },
                { icon: Users, label: 'Manage Users', path: '/admin/users' },
                { icon: Settings, label: 'Settings', path: '/admin/settings' }
            ]
        });
    }

    if (user?.role === 'seller') {
        menuSections.push({
            title: 'Seller',
            items: [
                { icon: TrendingUp, label: 'Dashboard', path: '/seller' },
                { icon: BookOpen, label: 'My Books', path: '/seller/books' },
                { icon: BarChart2, label: 'Analytics', path: '/seller/analytics' }
            ]
        });
    }

    menuSections.push({
        title: 'Account',
        items: [
            { icon: User, label: 'Profile', path: '/profile' },
            { icon: Bell, label: 'Notifications', path: '/notifications', badge: user?.notificationCount },
            { icon: Settings, label: 'Settings', path: '/settings' }
        ]
    });

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200 
          transition-all duration-300 z-40 overflow-y-auto
          ${isOpen ? 'w-64' : 'w-0 lg:w-20'}
        `}
            >
                <div className={`${!isOpen && 'lg:flex lg:flex-col lg:items-center'}`}>
                    {/* Logo */}
                    <div className={`p-6 border-b border-gray-200 ${!isOpen && 'lg:p-4'}`}>
                        <Link href="/">
                            <div className="flex items-center space-x-3 cursor-pointer">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center">
                                    <BookOpen className="text-white" size={24} />
                                </div>
                                {isOpen && (
                                    <div>
                                        <h1 className="font-bold text-lg text-gray-900">Sierra Books</h1>
                                        <p className="text-xs text-gray-500">QuantumMint Store</p>
                                    </div>
                                )}
                            </div>
                        </Link>
                    </div>

                    {/* User Info */}
                    {user && isOpen && (
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-900 truncate">
                                        {user.name || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Menu Sections */}
                    <nav className="flex-1 p-4 space-y-6">
                        {menuSections.map((section, idx) => (
                            <div key={idx}>
                                {/* Section Header */}
                                {isOpen && (
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            {section.title}
                                        </h3>
                                        {section.collapsible && (
                                            <button
                                                onClick={() => toggleSection(section.id!)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                {expandedSections.includes(section.id!) ? (
                                                    <ChevronDown size={16} />
                                                ) : (
                                                    <ChevronRight size={16} />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Menu Items */}
                                {(!section.collapsible || expandedSections.includes(section.id!)) && (
                                    <ul className="space-y-1">
                                        {section.items.map((item, itemIdx) => {
                                            const Icon = item.icon;
                                            const active = isActive(item.path);

                                            return (
                                                <li key={itemIdx}>
                                                    <Link href={item.path}>
                                                        <div
                                                            className={`
                                flex items-center space-x-3 px-3 py-2 rounded-lg
                                transition-all duration-200 group cursor-pointer
                                ${active
                                                                    ? 'bg-emerald-50 text-emerald-700'
                                                                    : 'text-gray-700 hover:bg-gray-100'
                                                                }
                                ${!isOpen && 'lg:justify-center lg:px-2'}
                              `}
                                                            title={!isOpen ? item.label : undefined}
                                                        >
                                                            <Icon
                                                                size={20}
                                                                className={active ? 'text-emerald-600' : 'text-gray-500 group-hover:text-gray-700'}
                                                            />
                                                            {isOpen && (
                                                                <>
                                                                    <span className="flex-1 font-medium text-sm">
                                                                        {item.label}
                                                                    </span>
                                                                    {item.badge && item.badge > 0 && (
                                                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                                            {item.badge > 99 ? '99+' : item.badge}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        ))}

                        {/* Logout Button */}
                        {user && (
                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={onLogout}
                                    className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg
                    text-red-600 hover:bg-red-50 transition-all duration-200
                    ${!isOpen && 'lg:justify-center lg:px-2'}
                  `}
                                    title={!isOpen ? 'Logout' : undefined}
                                >
                                    <LogOut size={20} />
                                    {isOpen && <span className="font-medium text-sm">Logout</span>}
                                </button>
                            </div>
                        )}
                    </nav>

                    {/* Collapse Toggle (Desktop) */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="hidden lg:flex items-center justify-center w-full p-4 border-t border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        {isOpen ? <ChevronRight size={20} /> : <ChevronRight size={20} className="transform rotate-180" />}
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                />
            )}
        </>
    );
};



=======
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutGrid, ShoppingBag, Mic2, BarChart2, Wallet as WalletIcon,
    Users, Map, ScanEye, LayoutDashboard, UserPlus, UserCircle,
    Shield, LogOut
} from 'lucide-react';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex z-40 h-screen sticky top-0">
            <div className="flex flex-col h-full">
                <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-100 flex-shrink-0">
                    <img src="/logo.png" alt="QuantumMint Logo" className="w-10 h-10 rounded-lg object-contain" />
                    <span className="ml-3 font-bold text-xl text-slate-800 hidden lg:block">QuantumMint</span>
                </div>

                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    <NavItem to="/" icon={<LayoutGrid />} label="Home" />
                    <NavItem to="/marketplace" icon={<ShoppingBag />} label="Marketplace" />
                    <NavItem to="/library" icon={<LayoutGrid />} label="My Library" />
                    <NavItem to="/analytics" icon={<BarChart2 />} label="Reading Analytics" />
                    <NavItem to="/wallet" icon={<WalletIcon />} label="Wallet" />
                    <NavItem to="/referrals" icon={<Users />} label="Referrals" />

                    <div className="pt-4 pb-2">
                        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:block">Tools</p>
                    </div>

                    <NavItem to="/maps" icon={<Map />} label="Maps Agent" />
                    <NavItem to="/vision" icon={<ScanEye />} label="Vision Agent" />

                    {user?.role === 'educator' && (
                        <>
                            <div className="pt-4 pb-2">
                                <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:block">Creator</p>
                            </div>
                            <NavItem to="/studio" icon={<Mic2 />} label="Audiobook Studio" />
                            <NavItem to="/seller/dashboard" icon={<LayoutDashboard />} label="Seller Dashboard" />
                            <NavItem to="/seller/onboarding" icon={<UserPlus />} label="Seller Onboarding" />
                            <NavItem to="/seller/registration" icon={<UserCircle />} label="Seller Registration" />
                        </>
                    )}

                    {user?.role === 'admin' && (
                        <>
                            <div className="pt-4 pb-2">
                                <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:block">Admin</p>
                            </div>
                            <NavItem to="/admin" icon={<Shield />} label="Admin Dashboard" />
                        </>
                    )}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                        {user?.avatarUrl ? <img src={user.avatarUrl} alt="Av" /> : <UserCircle className="text-slate-500" />}
                    </div>
                    <div className="ml-3 hidden lg:block">
                        <p className="text-sm font-medium text-slate-900 truncate w-32">{user?.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center p-3 text-slate-500 hover:text-red-600 transition-colors w-full rounded-lg hover:bg-red-50"
                >
                    <LogOut size={20} />
                    <span className="ml-3 font-medium hidden lg:block">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

const NavItem = ({ icon, label, to }: { icon: React.ReactNode, label: string, to: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `
      flex items-center w-full p-3 rounded-lg transition-all duration-200 group
      ${isActive ? 'bg-quantum-50 text-quantum-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
    `}
    >
        {({ isActive }) => (
            <>
                <span className={`transition-colors ${isActive ? 'text-quantum-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {React.cloneElement(icon as React.ReactElement<any>, { size: 22 })}
                </span>
                <span className="ml-3 font-medium hidden lg:block">{label}</span>
            </>
        )}
    </NavLink>
);

export default Sidebar;
>>>>>>> eee79d7da06a64aee98daa05ffcfbc5ba43db233
