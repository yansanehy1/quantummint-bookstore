
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getBooks, getCurrentUser } from '@/web-frontend/src/services/store';
import { BookOpen, Clock, Trophy, Target, Play } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const LEARNING_DATA = [
   { day: 'Mon', hours: 1.5 },
   { day: 'Tue', hours: 2.2 },
   { day: 'Wed', hours: 0.8 },
   { day: 'Thu', hours: 3.0 },
   { day: 'Fri', hours: 2.5 },
   { day: 'Sat', hours: 4.0 },
   { day: 'Sun', hours: 1.2 },
];

interface LearnerDashboardProps {
   onNavigate: (page: string, bookId?: string) => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({ onNavigate }) => {
   const user = getCurrentUser();
   const books = getBooks();

   // Mock "Continue Reading" - just take the first 2 books
   const continueReading = books.slice(0, 2);
   const recommended = books.slice(2, 4);

   return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
         {/* Welcome Section */}
         <div className="flex justify-between items-end">
            <div>
               <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name.split(' ')[0]}!</h1>
               <p className="text-slate-500 mt-2">You're on a 5-day learning streak. Keep it up!</p>
            </div>
            <div className="hidden md:block">
               <span className="text-sm font-medium text-slate-500 mr-2">Current Level:</span>
               <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">SSS 2</span>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard label="Books Read" value="12" icon={<BookOpen size={20} />} color="bg-blue-500" />
            <StatsCard label="Hours Learned" value="34.5" icon={<Clock size={20} />} color="bg-emerald-500" />
            <StatsCard label="Achievements" value="7" icon={<Trophy size={20} />} color="bg-yellow-500" />
            <StatsCard label="Quiz Avg" value="88%" icon={<Target size={20} />} color="bg-indigo-500" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Continue Reading & Recommendations */}
            <div className="lg:col-span-2 space-y-8">

               <section>
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
                     <Button variant="ghost" size="sm" onClick={() => onNavigate('library')}>View Library</Button>
                  </div>
                  <div className="space-y-4">
                     {continueReading.map((book, idx) => (
                        <div key={book.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 hover:shadow-md transition-shadow group">
                           <div className="w-20 h-28 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1 flex flex-col justify-between py-1">
                              <div>
                                 <div className="flex justify-between">
                                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{book.title}</h3>
                                    <span className="text-xs text-slate-400 font-mono">Ch. {idx + 1}</span>
                                 </div>
                                 <p className="text-xs text-slate-500">{book.author}</p>
                              </div>
                              <div className="space-y-2">
                                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${60 - idx * 20}%` }}></div>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400">{60 - idx * 20}% Complete</span>
                                    <Button size="sm" className="h-8 gap-2" onClick={() => onNavigate('player', book.id)}>
                                       <Play size={14} /> Resume
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Recommended for You</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {recommended.length > 0 ? recommended.map(book => (
                        <Card key={book.id} className="cursor-pointer hover:border-emerald-500 transition-colors group">
                           <CardContent className="p-4 flex gap-4">
                              <img src={book.coverUrl} className="w-16 h-20 object-cover rounded shadow-sm" alt={book.title} />
                              <div>
                                 <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 line-clamp-1">{book.title}</h4>
                                 <p className="text-xs text-slate-500 mb-2">{book.category}</p>
                                 <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                                    <span className="text-yellow-400">★</span> {book.rating.toFixed(1)}
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     )) : (
                        <div className="col-span-2 text-center text-slate-400 py-8 border-2 border-dashed border-slate-200 rounded-xl">
                           Explore the library to get recommendations.
                        </div>
                     )}
                  </div>
               </section>

            </div>

            {/* Right Column: Activity Chart & Goals */}
            <div className="space-y-8">
               <Card>
                  <CardHeader><CardTitle>Weekly Activity</CardTitle></CardHeader>
                  <CardContent>
                     <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={LEARNING_DATA}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                              <Tooltip cursor={{ fill: '#f8fafc' }} />
                              <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="mt-4 text-center">
                        <p className="text-sm text-slate-500">Total this week</p>
                        <p className="text-2xl font-bold text-slate-900">15.2 Hours</p>
                     </div>
                  </CardContent>
               </Card>

               <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">Daily Goal</h3>
                        <Target className="text-emerald-400" />
                     </div>
                     <div className="mb-2 flex justify-between text-sm text-slate-300">
                        <span>Progress</span>
                        <span>45m / 60m</span>
                     </div>
                     <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-emerald-500 w-3/4 rounded-full"></div>
                     </div>
                     <p className="text-xs text-slate-400">Read for 15 more minutes to reach your daily goal!</p>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
};

const StatsCard = ({ label, value, icon, color }: any) => (
   <Card>
      <CardContent className="p-6 flex items-center justify-between">
         <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
         </div>
         <div className={`p-3 rounded-lg text-white ${color}`}>
            {icon}
         </div>
      </CardContent>
   </Card>
);




