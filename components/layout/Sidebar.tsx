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

