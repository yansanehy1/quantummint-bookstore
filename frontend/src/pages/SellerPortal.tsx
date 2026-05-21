import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { VoiceCloning } from '../components/VoiceCloning';
import { VideoUploader } from '../components/VideoUploader';
import { 
    BookOpen, 
    Plus, 
    DollarSign, 
    TrendingUp, 
    Users, 
    Eye, 
    Edit2, 
    Trash2, 
    Download, 
    Mic, 
    Video, 
    LayoutDashboard,
    BarChart3,
    History,
    CheckCircle,
    Clock,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

import { useSellerStats, usePayoutMutation } from '../hooks/useSeller';

export default function SellerPortal() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'voice-lab' | 'video-hub' | 'analytics'>('overview');
    
    const { data: stats, isLoading: loading, refetch: fetchStats } = useSellerStats();
    const payoutMutation = usePayoutMutation();

    useEffect(() => {
        document.title = 'Seller Portal - QuantumMint';
    }, []);

    const handleRequestPayout = async () => {
        if (!stats?.summary?.totalEarningsSLL) return;
        
        try {
            await payoutMutation.mutateAsync({
                amount: stats.summary.totalEarningsSLL,
                currency: 'SLL',
                method: 'orange_money'
            });
            toast.success('Payout request submitted!');
        } catch (error) {
            toast.error('Failed to submit payout request');
        }
    };

    const handleDeleteBook = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                await api.books.delete(id);
                toast.success('Book deleted successfully');
                fetchStats();
            } catch (error) {
                toast.error('Failed to delete book');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quantum-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-quantum-600 p-2 rounded-lg text-white">
                                <LayoutDashboard size={20} />
                            </div>
                            <h1 className="text-xl font-bold text-slate-900">Seller Portal</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={() => navigate('/studio')} size="sm">
                                <Plus size={16} className="mr-2" /> New Book
                            </Button>
                        </div>
                    </div>
                    
                    {/* Tabs */}
                    <nav className="flex space-x-8 -mb-px">
                        {[
                            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                            { id: 'books', label: 'My Books', icon: BookOpen },
                            { id: 'voice-lab', label: 'Voice Lab', icon: Mic },
                            { id: 'video-hub', label: 'Video Hub', icon: Video },
                            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-bold text-sm transition-all ${
                                    activeTab === tab.id
                                        ? 'border-quantum-600 text-quantum-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                        <DollarSign size={24} />
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                                </div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Earnings</p>
                                <p className="text-2xl font-black text-slate-900">Le {stats?.summary?.totalEarningsSLL?.toFixed(2) || '0.00'}</p>
                                <p className="text-xs text-slate-400 font-bold mt-1">${stats?.summary?.totalEarningsUSD?.toFixed(2) || '0.00'} USD</p>
                            </Card>

                            <Card className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                        <Clock size={24} />
                                    </div>
                                    <button onClick={handleRequestPayout} className="text-xs font-bold text-purple-600 hover:underline">Withdraw</button>
                                </div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Payout</p>
                                <p className="text-2xl font-black text-purple-600">Le {stats?.summary?.pendingPayoutSLL?.toFixed(2) || '0.00'}</p>
                                <p className="text-xs text-slate-400 font-bold mt-1">${stats?.summary?.pendingPayoutUSD?.toFixed(2) || '0.00'} USD</p>
                            </Card>

                            <Card className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <Users size={24} />
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Sales</p>
                                <p className="text-2xl font-black text-slate-900">{stats?.summary?.totalSales || 0}</p>
                                <p className="text-xs text-slate-400 font-bold mt-1">Across {stats?.summary?.publishedBooks || 0} books</p>
                            </Card>

                            <Card className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                        <TrendingUp size={24} />
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Monthly Growth</p>
                                <p className="text-2xl font-black text-slate-900">23.5%</p>
                                <p className="text-xs text-slate-400 font-bold mt-1">Vs last 30 days</p>
                            </Card>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Revenue Breakdown */}
                            <Card className="lg:col-span-2 p-8">
                                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <BarChart3 size={20} className="text-quantum-600" /> Revenue Breakdown
                                </h3>
                                <div className="space-y-6">
                                    {stats?.earningsByBook?.map((book: any) => (
                                        <div key={book.id}>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-bold text-slate-700">{book.title}</span>
                                                <span className="font-black text-slate-900">Le {book.earnings.toFixed(2)}</span>
                                            </div>
                                            <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
                                                <div className="bg-quantum-500" style={{ width: '70%' }} />
                                                <div className="bg-purple-500" style={{ width: '30%' }} />
                                            </div>
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                                                <span>Quantum Sales: 70%</span>
                                                <span>Pay-per-use: 30%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Recent Payouts */}
                            <Card className="p-8">
                                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <History size={20} className="text-quantum-600" /> Recent Payouts
                                </h3>
                                <div className="space-y-4">
                                    {stats?.recentPayouts?.length > 0 ? (
                                        stats.recentPayouts.map((payout: any) => (
                                            <div key={payout.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                                <div>
                                                    <p className="text-xs font-black text-slate-900">Le {parseFloat(payout.amount).toFixed(2)}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">{new Date(payout.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                    payout.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {payout.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 opacity-40">
                                            <History size={32} className="mx-auto mb-2" />
                                            <p className="text-xs font-bold">No payout history</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'books' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-900">My Published Content</h2>
                            <Button onClick={() => navigate('/studio')} size="sm">Create New</Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {stats?.earningsByBook?.map((book: any) => (
                                <Card key={book.id} className="p-4 hover:border-quantum-200 transition-all border-l-4 border-l-quantum-600">
                                    <div className="flex items-center gap-6">
                                        <img src={book.coverUrl || 'https://via.placeholder.com/150'} alt={book.title} className="w-16 h-24 object-cover rounded-lg shadow-sm" />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">{book.title}</h3>
                                            <div className="flex gap-4">
                                                <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                                    <Users size={12} /> {book.sales} Readers
                                                </div>
                                                <div className="text-xs font-bold text-green-600 flex items-center gap-1">
                                                    <DollarSign size={12} /> Le {book.earnings.toFixed(2)} Earned
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => navigate(`/book/${book.id}`)}><Eye size={16} /></Button>
                                            <Button variant="outline" size="sm" onClick={() => navigate(`/edit/${book.id}`)}><Edit2 size={16} /></Button>
                                            <Button variant="outline" size="sm" onClick={() => handleDeleteBook(book.id)} className="text-red-600"><Trash2 size={16} /></Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'voice-lab' && (
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                            <VoiceCloning />
                        </div>
                    </div>
                )}

                {activeTab === 'video-hub' && (
                    <div className="space-y-6">
                        <Card className="p-8">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <Video size={28} className="text-quantum-600" /> Adaptive Video Hub
                            </h2>
                            <VideoUploader 
                                userId={user?.id || 'anon'} 
                                onUploadComplete={(id) => toast.success(`Video ${id} processed!`)} 
                            />
                        </Card>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="p-8">
                            <h3 className="text-xl font-black text-slate-900 mb-6">Audience Demographics</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'STEM Students', value: '45%' },
                                    { label: 'Researchers', value: '30%' },
                                    { label: 'Self-Learners', value: '20%' },
                                    { label: 'Others', value: '5%' },
                                ].map((item) => (
                                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                        <span className="text-sm font-bold text-slate-600">{item.label}</span>
                                        <span className="text-sm font-black text-quantum-600">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card className="p-8">
                            <h3 className="text-xl font-black text-slate-900 mb-6">Platform Engagement</h3>
                            <div className="space-y-6 py-4 flex flex-col items-center justify-center h-48 opacity-30">
                                <BarChart3 size={48} />
                                <p className="text-xs font-bold uppercase tracking-widest">Advanced analytics coming soon</p>
                            </div>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
