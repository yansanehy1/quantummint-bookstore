
import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserStatus, deleteUser, subscribe } from '@/web-frontend/src/services/store';
import { User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Filter, MoreVertical, Trash2, Ban, CheckCircle, Mail, Shield } from 'lucide-react';

export const ManageUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>(getAllUsers());
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState<'ALL' | 'LEARNER' | 'EDUCATOR' | 'ADMIN'>('ALL');

    useEffect(() => {
        const unsubscribe = subscribe(() => {
            setUsers(getAllUsers());
        });
        return unsubscribe;
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = filterRole === 'ALL' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleStatusChange = (userId: string, newStatus: User['status']) => {
        if (confirm(`Are you sure you want to mark this user as ${newStatus}?`)) {
            updateUserStatus(userId, newStatus);
        }
    };

    const handleDelete = (userId: string) => {
        if (confirm("Are you sure you want to DELETE this user? This action is irreversible.")) {
            deleteUser(userId);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500">View, edit, and manage system users.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Export CSV</Button>
                    <Button>Add New User</Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Filter size={18} className="text-slate-400" />
                        <select
                            className="border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-emerald-500"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as any)}
                        >
                            <option value="ALL">All Roles</option>
                            <option value="LEARNER">Learners</option>
                            <option value="EDUCATOR">Educators</option>
                            <option value="ADMIN">Admins</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* User List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No users found matching your criteria.
                    </div>
                ) : (
                    filteredUsers.map(user => (
                        <div key={user.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center gap-4">
                            <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-slate-100" />

                            <div className="flex-1 text-center md:text-left">
                                <h3 className="font-bold text-slate-900">{user.name}</h3>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-500">
                                    <Mail size={12} />
                                    {user.email || 'No email'}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'EDUCATOR' ? 'bg-blue-100 text-blue-700' :
                                            'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    {user.role}
                                </span>

                                <span className={`flex items-center gap-1 text-sm font-medium ${user.status === 'Active' ? 'text-emerald-600' :
                                        user.status === 'Suspended' ? 'text-red-500' :
                                            'text-orange-500'
                                    }`}>
                                    {user.status === 'Active' && <CheckCircle size={14} />}
                                    {user.status === 'Suspended' && <Ban size={14} />}
                                    {user.status === 'Pending' && <Shield size={14} />}
                                    {user.status || 'Active'}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0 w-full md:w-auto justify-center">
                                {user.status !== 'Active' && (
                                    <Button size="sm" variant="ghost" className="text-emerald-600 hover:bg-emerald-50" onClick={() => handleStatusChange(user.id, 'Active')}>
                                        Activate
                                    </Button>
                                )}
                                {user.status !== 'Suspended' && (
                                    <Button size="sm" variant="ghost" className="text-orange-600 hover:bg-orange-50" onClick={() => handleStatusChange(user.id, 'Suspended')}>
                                        Suspend
                                    </Button>
                                )}
                                <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(user.id)}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};




