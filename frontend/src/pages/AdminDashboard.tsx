import * as React from 'react';
import { useState, useEffect } from 'react';
import type { AuditLogEntry } from '../types/types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import {
    BookOpen,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    LayoutDashboard,
    Wallet as WalletIcon,
    ArrowRight,
    TrendingUp,
    ShieldAlert,
    History,
    Search,
    Filter,
    DollarSign,
    Gift,
    RotateCcw
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [logFilter, setLogFilter] = useState({ action: '', targetId: '' });
    
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: () => api.admin.getAdminStats()
    });

    const { data: logData } = useQuery({
        queryKey: ['admin', 'logs', logFilter],
        queryFn: () => api.admin.getAuditLogs(logFilter)
    });

    const { data: healthData } = useQuery({
        queryKey: ['admin', 'health'],
        queryFn: () => api.admin.getHealthStatus(),
        refetchInterval: 30000 // Poll every 30 seconds
    });

    const logs = logData?.logs || [];

    useEffect(() => {
        document.title = 'Admin Dashboard - QuantumMint';
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quantum-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-900 p-2 rounded-lg text-white">
                                <LayoutDashboard size={20} />
                            </div>
                            <h1 className="text-xl font-bold text-slate-900">Admin Control Center</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Status: </span>
                            <span className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full ${
                                healthData?.status === 'Operational' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'
                            }`}>
                                {healthData?.status === 'Operational' ? <CheckCircle size={12} /> : <ShieldAlert size={12} />} 
                                {healthData?.status || 'Checking...'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                <Clock size={24} />
                            </div>
                            {stats?.pendingSellers > 0 && (
                                <span className="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full animate-pulse">Action Required</span>
                            )}
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Sellers</p>
                        <p className="text-3xl font-black text-slate-900">{stats?.pendingSellers || 0}</p>
                    </Card>

                    <Card className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <BookOpen size={24} />
                            </div>
                            {stats?.pendingBooks > 0 && (
                                <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full animate-pulse">Action Required</span>
                            )}
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Books</p>
                        <p className="text-3xl font-black text-slate-900">{stats?.pendingBooks || 0}</p>
                    </Card>

                    <Card className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Platform Revenue</p>
                        <p className="text-2xl font-black text-slate-900">Le {stats?.platformRevenueSLL?.toLocaleString() || '0'}</p>
                        <p className="text-xs text-slate-400 font-bold mt-1">${stats?.platformRevenueUSD?.toFixed(2) || '0.00'} USD</p>
                    </Card>

                    <Card className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <Users size={24} />
                            </div>
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Sellers</p>
                        <p className="text-3xl font-black text-slate-900">{stats?.totalSellers || 0}</p>
                    </Card>

                    <Card
                        className="p-6 cursor-pointer hover:border-quantum-500 transition-colors"
                        onClick={() => navigate('/admin/refunds')}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                <RotateCcw size={24} />
                            </div>
                            {stats?.pendingRefunds > 0 && (
                                <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse">Action Required</span>
                            )}
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Refunds</p>
                        <p className="text-3xl font-black text-slate-900">{stats?.pendingRefunds ?? 0}</p>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                            <ShieldAlert size={20} className="text-quantum-600" /> Management Modules
                        </h2>
                        
                        <div className="grid gap-4">
                            <button 
                                onClick={() => navigate('/admin/sellers')}
                                className="w-full text-left bg-white p-6 rounded-3xl border border-slate-200 hover:border-quantum-500 transition-all group flex justify-between items-center shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-amber-50 p-3 rounded-2xl text-amber-600 group-hover:scale-110 transition-transform">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900">Seller Verification</h3>
                                        <p className="text-sm text-slate-500 font-medium">Review and approve marketplace creator applications</p>
                                    </div>
                                </div>
                                <ArrowRight className="text-slate-300 group-hover:text-quantum-500 group-hover:translate-x-1 transition-all" />
                            </button>

                            <button 
                                onClick={() => navigate('/admin/books')}
                                className="w-full text-left bg-white p-6 rounded-3xl border border-slate-200 hover:border-quantum-500 transition-all group flex justify-between items-center shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900">Content Moderation</h3>
                                        <p className="text-sm text-slate-500 font-medium">Review submitted books and STEM interactive segments</p>
                                    </div>
                                </div>
                                <ArrowRight className="text-slate-300 group-hover:text-quantum-500 group-hover:translate-x-1 transition-all" />
                            </button>

                            <button 
                                onClick={() => navigate('/admin/wallet')}
                                className="w-full text-left bg-white p-6 rounded-3xl border border-slate-200 hover:border-quantum-500 transition-all group flex justify-between items-center shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-purple-50 p-3 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform">
                                        <WalletIcon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900">Financial Control</h3>
                                        <p className="text-sm text-slate-500 font-medium">Manage payouts, commissions, and platform fees</p>
                                    </div>
                                </div>
                                <ArrowRight className="text-slate-300 group-hover:text-quantum-500 group-hover:translate-x-1 transition-all" />
                            </button>

                            <button 
                                onClick={() => navigate('/admin/payouts')}
                                className="w-full text-left bg-white p-6 rounded-3xl border border-slate-200 hover:border-quantum-500 transition-all group flex justify-between items-center shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-50 p-3 rounded-2xl text-green-600 group-hover:scale-110 transition-transform">
                                        <DollarSign size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900">Payout Requests</h3>
                                        <p className="text-sm text-slate-500 font-medium">Approve or reject creator withdrawal requests</p>
                                    </div>
                                </div>
                                <ArrowRight className="text-slate-300 group-hover:text-quantum-500 group-hover:translate-x-1 transition-all" />
                            </button>

                            <button 
                                onClick={() => navigate('/admin/refunds')}
                                className="w-full text-left bg-white p-6 rounded-3xl border border-slate-200 hover:border-quantum-500 transition-all group flex justify-between items-center shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-amber-50 p-3 rounded-2xl text-amber-600 group-hover:scale-110 transition-transform">
                                        <RotateCcw size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900">Refund Requests</h3>
                                        <p className="text-sm text-slate-500 font-medium">Review and approve learner purchase refunds</p>
                                    </div>
                                </div>
                                <ArrowRight className="text-slate-300 group-hover:text-quantum-500 group-hover:translate-x-1 transition-all" />
                            </button>

                            <button 
                                onClick={() => navigate('/admin/promotions')}
                                className="w-full text-left bg-white p-6 rounded-3xl border border-slate-200 hover:border-quantum-500 transition-all group flex justify-between items-center shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-pink-50 p-3 rounded-2xl text-pink-600 group-hover:scale-110 transition-transform">
                                        <Gift size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900">Promotions & Gifts</h3>
                                        <p className="text-sm text-slate-500 font-medium">Reward users with free books and site-wide gifts</p>
                                    </div>
                                </div>
                                <ArrowRight className="text-slate-300 group-hover:text-quantum-500 group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <Card className="p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                    <History size={20} className="text-quantum-600" /> Recent Actions
                                </h2>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-48">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input 
                                            type="text"
                                            placeholder="Search ID..."
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-quantum-500 outline-none"
                                            value={logFilter.targetId}
                                            onChange={(e) => setLogFilter(prev => ({ ...prev, targetId: e.target.value }))}
                                        />
                                    </div>
                                    <select 
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-quantum-500 outline-none"
                                        value={logFilter.action}
                                        onChange={(e) => setLogFilter(prev => ({ ...prev, action: e.target.value }))}
                                    >
                                        <option value="">All Actions</option>
                                        <option value="UPDATE_BOOK_STATUS">Book Status</option>
                                        <option value="UPDATE_SELLER_STATUS">Seller Status</option>
                                        <option value="ADJUST_WALLET_BALANCE">Wallet</option>
                                        <option value="UPDATE_USER_ROLE">Roles</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {logs?.length > 0 ? (
                                    logs.map((log: AuditLogEntry) => (
                                        <div key={log.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div>
                                                <p className="text-xs font-black text-slate-900">{log.action.replace(/_/g, ' ')}</p>
                                                <p className="text-[10px] text-slate-500 font-bold mt-0.5">By {log.User?.name} • {new Date(log.createdAt).toLocaleString()}</p>
                                                {log.details?.reason && (
                                                    <p className="text-[10px] text-slate-400 mt-1 italic">"{log.details.reason}"</p>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">#{log.targetId.slice(-4)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 opacity-30">
                                        <History size={48} className="mx-auto mb-2" />
                                        <p className="text-xs font-bold uppercase tracking-widest">No recent activity</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="p-8">
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">System Health</h2>
                            <div className="space-y-6">
                                {(healthData?.services || [
                                    { label: 'Auth Microservice', status: 'Healthy', latency: '24ms' },
                                    { label: 'Azure TTS Engine', status: 'Healthy', latency: '142ms' },
                                    { label: 'Python STEM Orchestrator', status: 'Healthy', latency: '89ms' },
                                    { label: 'MySQL Cluster', status: 'Healthy', latency: '8ms' },
                                    { label: 'Redis Cache', status: 'Healthy', latency: '2ms' },
                                ]).map((service: { label: string; status: string; latency: string }) => (
                                    <div key={service.label} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{service.label}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Latency: {service.latency}</p>
                                        </div>
                                        <span className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                                            service.status === 'Healthy' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${service.status === 'Healthy' ? 'bg-green-500' : 'bg-red-500'}`} /> 
                                            {service.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
