import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, MousePointer2, Activity, Filter, Download } from 'lucide-react';
import api from '../utils/api';

interface AnalyticsData {
    totalInteractions: number;
    topFormulas: any[];
    actionDistribution: any[];
    engagementTimeline: any[];
}

export const TutorAnalyticsDashboard: React.FC<{ bookId?: string }> = ({ bookId }) => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d');

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const interactions = await api.interaction.getAnalytics({ bookId });
                
                // Process data for charts
                const totalInteractions = interactions.length;
                
                // 1. Action Distribution
                const actions = interactions.reduce((acc: any, curr: any) => {
                    acc[curr.action] = (acc[curr.action] || 0) + 1;
                    return acc;
                }, {});
                const actionDistribution = Object.keys(actions).map(name => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    value: actions[name]
                }));

                // 2. Top Formulas (Mocked from metadata for now)
                const formulaCounts = interactions
                    .filter((i: any) => i.action === 'tap' && i.metadata?.symbol)
                    .reduce((acc: any, curr: any) => {
                        const symbol = curr.metadata.symbol;
                        acc[symbol] = (acc[symbol] || 0) + 1;
                        return acc;
                    }, {});
                const topFormulas = Object.keys(formulaCounts)
                    .map(symbol => ({ symbol, count: formulaCounts[symbol] }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

                setAnalytics({
                    totalInteractions,
                    topFormulas,
                    actionDistribution,
                    engagementTimeline: [] // Would need date grouping
                });
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [bookId, timeRange]);

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

    if (loading) return <div className="p-8 text-center">Loading analytics...</div>;

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Content Engagement Insights</h1>
                    <p className="text-slate-500 text-sm">Track how learners explore your STEM content</p>
                </div>
                <div className="flex space-x-3">
                    <select 
                        value={timeRange} 
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm shadow-sm"
                    >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>
                    <button className="bg-white border border-slate-200 rounded-lg p-2 hover:bg-slate-100 transition-colors">
                        <Download className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<Activity className="text-blue-600" />} label="Total Interactions" value={analytics?.totalInteractions || 0} trend="+12%" />
                <StatCard icon={<MousePointer2 className="text-purple-600" />} label="Avg. Taps per Session" value="4.2" trend="+5%" />
                <StatCard icon={<Users className="text-green-600" />} label="Active Learners" value="128" trend="+18%" />
                <StatCard icon={<BookOpen className="text-orange-600" />} label="Completion Rate" value="76%" trend="-2%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Action Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold mb-6 text-slate-800">Interaction Types</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics?.actionDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {analytics?.actionDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center space-x-4 mt-4">
                        {analytics?.actionDistribution.map((entry, index) => (
                            <div key={entry.name} className="flex items-center space-x-1">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="text-xs text-slate-500">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Formulas */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold mb-6 text-slate-800">Most Explored Symbols</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics?.topFormulas}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="symbol" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, trend: string }> = ({ icon, label, value, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
            <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{trend}</span>
        </div>
        <h4 className="text-slate-500 text-sm font-medium">{label}</h4>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
);
