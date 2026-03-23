import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import Card from '@/components/ui/Card';
import { Clock, BookOpen, Calendar, TrendingUp } from 'lucide-react';

export default function ReadingAnalytics() {
    useEffect(() => {
        document.title = 'Reading Analytics - Quantummint Bookstore';
    }, []);

    const weeklyActivity = [
        { day: 'Mon', minutes: 45 },
        { day: 'Tue', minutes: 30 },
        { day: 'Wed', minutes: 60 },
        { day: 'Thu', minutes: 25 },
        { day: 'Fri', minutes: 90 },
        { day: 'Sat', minutes: 120 },
        { day: 'Sun', minutes: 45 },
    ];

    const genreDistribution = [
        { name: 'Fiction', value: 400 },
        { name: 'Science', value: 300 },
        { name: 'History', value: 300 },
        { name: 'Tech', value: 200 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Reading Analytics</h1>
                <p className="text-slate-600">Track your reading progress and habits.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-green-600 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" /> +12%
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">24.5 hrs</h3>
                    <p className="text-sm text-slate-500">Total Reading Time</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-green-600 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" /> +2
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">12</h3>
                    <p className="text-sm text-slate-500">Books Completed</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-50 rounded-lg">
                            <Calendar className="w-6 h-6 text-amber-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">Current Streak</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">5 Days</h3>
                    <p className="text-sm text-slate-500">Keep it up!</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-pink-50 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-pink-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">Avg. Session</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">45 min</h3>
                    <p className="text-sm text-slate-500">Per day</p>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Weekly Activity</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyActivity}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Bar dataKey="minutes" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Genre Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genreDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {genreDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-6 mt-4">
                            {genreDistribution.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-sm text-slate-600">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

