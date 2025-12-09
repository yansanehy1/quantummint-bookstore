
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, Server, AlertTriangle, CheckCircle, Search, MoreVertical, DollarSign, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 7500 },
];

const MOCK_USERS = [
    { id: 'u1', name: 'Alice Kamara', role: 'LEARNER', status: 'Active', joined: 'Oct 24, 2023' },
    { id: 'u2', name: 'John Doe', role: 'EDUCATOR', status: 'Active', joined: 'Sep 12, 2023' },
    { id: 'u3', name: 'Jane Smith', role: 'LEARNER', status: 'Inactive', joined: 'Nov 01, 2023' },
    { id: 'u4', name: 'Bob Brown', role: 'EDUCATOR', status: 'Pending', joined: 'Nov 05, 2023' },
    { id: 'u5', name: 'Charlie Davis', role: 'LEARNER', status: 'Active', joined: 'Oct 15, 2023' },
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
       <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">System Administration</h1>
          <div className="flex gap-2">
             <Button variant="outline">Export Reports</Button>
             <Button variant="danger">System Maintenance</Button>
          </div>
       </div>

       {/* System Health Stats */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard label="Total Users" value="15,234" icon={<Users size={20} />} trend="+5.2%" color="bg-blue-600" />
          <StatsCard label="Monthly Revenue" value="$45,231" icon={<DollarSign size={20} />} trend="+12%" color="bg-emerald-600" />
          <StatsCard label="Server Load" value="42%" icon={<Server size={20} />} trend="Stable" color="bg-indigo-600" />
          <StatsCard label="Pending Content" value="8" icon={<AlertTriangle size={20} />} trend="Needs Action" color="bg-orange-500" />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
             {/* Revenue Chart */}
             <Card>
                <CardHeader><CardTitle>Platform Revenue Growth</CardTitle></CardHeader>
                <CardContent>
                   <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={REVENUE_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} />
                         </LineChart>
                      </ResponsiveContainer>
                   </div>
                </CardContent>
             </Card>

             {/* User Management Table */}
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                   <CardTitle>Recent Users</CardTitle>
                   <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none" 
                      />
                   </div>
                </CardHeader>
                <CardContent>
                   <table className="w-full text-sm text-left">
                      <thead className="text-slate-500 font-medium bg-slate-50">
                         <tr>
                            <th className="p-3 rounded-tl-lg">Name</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Joined</th>
                            <th className="p-3 rounded-tr-lg"></th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {MOCK_USERS.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50">
                               <td className="p-3 font-medium text-slate-900">{user.name}</td>
                               <td className="p-3">
                                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : user.role === 'EDUCATOR' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                     {user.role}
                                  </span>
                               </td>
                               <td className="p-3">
                                  <span className={`flex items-center gap-1.5 ${user.status === 'Active' ? 'text-emerald-600' : user.status === 'Pending' ? 'text-orange-500' : 'text-slate-400'}`}>
                                     <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Pending' ? 'bg-orange-500' : 'bg-slate-400'}`}></span>
                                     {user.status}
                                  </span>
                               </td>
                               <td className="p-3 text-slate-500">{user.joined}</td>
                               <td className="p-3 text-right">
                                  <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </CardContent>
             </Card>
          </div>

          {/* Right Column: Actions */}
          <div className="space-y-6">
             <Card>
                <CardHeader><CardTitle>Content Approval</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                   {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3 items-start border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                         <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center">
                            <Activity size={18} className="text-slate-400" />
                         </div>
                         <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-900">Advanced Calculus Vol. {i}</h4>
                            <p className="text-xs text-slate-500 mb-2">By Dr. Math Prof</p>
                            <div className="flex gap-2">
                               <Button size="sm" className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700">Approve</Button>
                               <Button size="sm" variant="outline" className="h-7 px-2 text-xs">Review</Button>
                            </div>
                         </div>
                      </div>
                   ))}
                   <Button variant="ghost" className="w-full text-xs text-slate-500 mt-2">View All Pending</Button>
                </CardContent>
             </Card>

             <Card className="bg-slate-900 text-white border-slate-800">
                <CardContent className="p-6">
                   <h3 className="font-bold text-lg mb-2">System Status</h3>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-400">Database</span>
                         <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle size={14} /> Online</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-400">API Gateway</span>
                         <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle size={14} /> Online</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-400">TTS Service</span>
                         <span className="flex items-center gap-1.5 text-yellow-400"><AlertTriangle size={14} /> High Latency</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-400">Veo Service</span>
                         <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle size={14} /> Online</span>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>
       </div>
    </div>
  );
};

const StatsCard = ({ label, value, icon, trend, color }: any) => (
  <Card>
    <CardContent className="p-6 flex items-center justify-between">
       <div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</p>
          <div className="flex items-baseline gap-2 mt-1">
             <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
             <span className={`text-xs font-bold ${trend.includes('+') ? 'text-emerald-600' : trend === 'Needs Action' ? 'text-orange-500' : 'text-slate-400'}`}>
                {trend}
             </span>
          </div>
       </div>
       <div className={`p-3 rounded-lg text-white ${color} shadow-lg shadow-current/20`}>
          {icon}
       </div>
    </CardContent>
  </Card>
);




