import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    BookOpen, 
    Clock, 
    Award, 
    TrendingUp, 
    Calendar, 
    ChevronRight, 
    Trophy, 
    Users, 
    Play, 
    BarChart3,
    Zap,
    Target
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import api from '../utils/api';
import { toast } from 'sonner';

export const LearnerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [dueNotesCount, setDueNotesCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [analyticsData, leaderboardData, dueNotes] = await Promise.all([
                api.learner.getAnalytics(),
                api.learner.getLeaderboard(),
                api.learner.getDueNotes()
            ]);
            setAnalytics(analyticsData);
            setLeaderboard(leaderboardData);
            setDueNotesCount(dueNotes.length);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            toast.error('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
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
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Student Hub</h1>
                        <p className="text-slate-500 font-bold mt-1">Track your STEM progress and peer rankings</p>
                    </div>
                    <div className="flex gap-3">
                        {dueNotesCount > 0 && (
                            <Button 
                                onClick={() => navigate('/review')} 
                                className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                            >
                                <Zap size={18} className="mr-2" /> Review {dueNotesCount} Notes
                            </Button>
                        )}
                        <Button onClick={() => navigate('/library')} className="bg-quantum-600 hover:bg-quantum-700">
                            <Play size={18} className="mr-2" /> Continue Studying
                        </Button>
                    </div>
                </div>

                {/* Core Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <Card className="p-6 border-l-4 border-l-blue-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Clock size={24} /></div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Study Time</p>
                        <p className="text-3xl font-black text-slate-900">{analytics?.totalHours || 0}h</p>
                        <p className="text-xs text-slate-400 font-bold mt-1">Total across sessions</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-l-quantum-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-quantum-50 text-quantum-600 rounded-lg"><BookOpen size={24} /></div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Books Read</p>
                        <p className="text-3xl font-black text-slate-900">{analytics?.totalBooks || 0}</p>
                        <p className="text-xs text-slate-400 font-bold mt-1">Completed & In-progress</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-l-amber-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Zap size={24} /></div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Study Streak</p>
                        <p className="text-3xl font-black text-slate-900">5 Days</p>
                        <p className="text-xs text-slate-400 font-bold mt-1">Keep it going!</p>
                    </Card>

                    <Card className="p-6 border-l-4 border-l-purple-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Target size={24} /></div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retention</p>
                        <p className="text-3xl font-black text-slate-900">82%</p>
                        <p className="text-xs text-slate-400 font-bold mt-1">Knowledge check score</p>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="p-8">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <History size={20} className="text-quantum-600" /> Recent Study Sessions
                            </h3>
                            <div className="space-y-4">
                                {analytics?.sessions?.length > 0 ? analytics.sessions.map((session: any) => (
                                    <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-quantum-600 group-hover:border-quantum-100 transition-all">
                                                <BookOpen size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">Chapter {session.pagesRead?.length || 1} Review</h4>
                                                <p className="text-xs text-slate-400 font-bold">{new Date(session.startTime).toLocaleDateString()} • {(session.durationSeconds / 60).toFixed(0)} mins</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-slate-300 group-hover:text-quantum-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                )) : (
                                    <div className="text-center py-12 opacity-30">
                                        <Calendar size={48} className="mx-auto mb-2" />
                                        <p className="text-sm font-bold uppercase tracking-widest">No recent activity</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="p-8">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <BarChart3 size={20} className="text-quantum-600" /> Weekly Deep-Work
                            </h3>
                            <div className="h-48 flex items-end justify-between gap-2 px-4">
                                {[40, 70, 45, 90, 65, 30, 80].map((val, i) => (
                                    <div key={i} className="w-full space-y-2">
                                        <div className="bg-quantum-500 rounded-t-lg transition-all hover:bg-quantum-400" style={{ height: `${val}%` }} />
                                        <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-tighter">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Peer Leaderboard */}
                    <div className="space-y-8">
                        <Card className="p-8 bg-slate-900 text-white border-none shadow-2xl">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                <Trophy size={20} className="text-amber-400" /> Peer Leaderboard
                            </h3>
                            <div className="space-y-4">
                                {leaderboard.map((item, index) => (
                                    <div key={item.userId} className={`flex items-center justify-between p-3 rounded-xl ${index === 0 ? 'bg-amber-400/10 border border-amber-400/20' : 'bg-white/5'}`}>
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                                                index === 0 ? 'bg-amber-400 text-slate-900' : 
                                                index === 1 ? 'bg-slate-300 text-slate-900' :
                                                index === 2 ? 'bg-orange-400 text-slate-900' : 'bg-white/10 text-white/50'
                                            }`}>
                                                {index + 1}
                                            </span>
                                            <span className="text-sm font-bold">{item.User?.name || 'Anonymous'}</span>
                                        </div>
                                        <span className="text-xs font-black text-quantum-400">{(item.totalDuration / 3600).toFixed(1)}h</span>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-6 border-white/10 text-white hover:bg-white/10" size="sm">
                                <Users size={16} className="mr-2" /> See Global Ranking
                            </Button>
                        </Card>

                        <Card className="p-8">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <TrendingUp size={20} className="text-quantum-600" /> Study Insights
                            </h3>
                            <div className="space-y-6">
                                <div className="p-4 bg-blue-50 rounded-2xl">
                                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Peak Focus</p>
                                    <p className="text-sm font-bold text-slate-700">You study best between 7 PM - 9 PM.</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-2xl">
                                    <p className="text-xs font-black text-purple-600 uppercase tracking-widest mb-1">Weak Point</p>
                                    <p className="text-sm font-bold text-slate-700">Calculus formulas need more review taps.</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
