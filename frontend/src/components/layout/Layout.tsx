
import React from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, LogOut } from 'lucide-react';
import { getCurrentUser } from '@/services/store';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const [location] = useLocation();
  const user = getCurrentUser();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* New Sidebar Component */}
      <Sidebar user={user} onLogout={onLogout} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative lg:ml-64">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-900 text-lg">
              {location.includes('player') ? 'Immersive Reader' : 'Sierra Books'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs text-slate-400 font-medium">BALANCE</span>
              <span className="text-sm font-bold text-emerald-600">${user?.walletBalance?.usd?.toFixed(2) || '0.00'}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              title="Log Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-50">
          {children}
        </div>
      </main>
    </div>
  );
};



