import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import {
    Wallet,
    Plus,
    Minus,
    ArrowLeft,
    Users,
    Search,
    DollarSign,
    Gift,
    ShieldAlert,
    CheckCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { toast } from 'sonner';

export default function AdminWalletManagement() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
        interface User {
            id: string;
            name: string;
            email: string;
            balance: number;
            currency: 'USD' | 'SLL';
            role: string;
        }
        const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [adjustmentAmount, setAdjustmentAmount] = useState('');
    const [adjustmentCurrency, setAdjustmentCurrency] = useState<'USD' | 'SLL'>('SLL');
    const [adjustmentDescription, setAdjustmentDescription] = useState('');
    const [showAdjustDialog, setShowAdjustDialog] = useState(false);
    const [showRoleDialog, setShowRoleDialog] = useState(false);

    const { data: users, isLoading } = useQuery({
        queryKey: ['admin', 'users'],
        queryFn: () => api.admin.getAllUsers()
    });

    const adjustMutation = useMutation({
        mutationFn: (data: { userId: string; amount: number; currency: 'USD' | 'SLL'; description: string }) => 
            api.admin.adjustUserBalance(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            toast.success('Balance adjusted successfully');
            setShowAdjustDialog(false);
            setAdjustmentAmount('');
            setAdjustmentDescription('');
        },
        onError: () => {
            toast.error('Failed to adjust balance');
        }
    });

    const roleMutation = useMutation({
        mutationFn: (data: { userId: string; role: string }) => 
            api.admin.updateUserRole(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            toast.success('User role updated');
            setShowRoleDialog(false);
        },
        onError: () => {
            toast.error('Failed to update user role');
        }
    });

    const handleAdjust = (isCredit: boolean) => {
        if (!selectedUser || !adjustmentAmount || isNaN(parseFloat(adjustmentAmount))) return;
        
        const amount = parseFloat(adjustmentAmount) * (isCredit ? 1 : -1);
        adjustMutation.mutate({
            userId: selectedUser.id,
            amount,
            currency: adjustmentCurrency,
            description: adjustmentDescription || `Admin ${isCredit ? 'Credit' : 'Debit'}`
        });
    };

    const handleRoleUpdate = (newRole: string) => {
        if (!selectedUser) return;
        roleMutation.mutate({ userId: selectedUser.id, role: newRole });
    };

    const filteredUsers = users?.filter((u: any) => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quantum-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                            <ArrowLeft size={16} />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Control</h1>
                            <p className="text-slate-500 font-bold">Manage user wallets and platform credits</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-quantum-500 focus:border-transparent font-medium shadow-sm"
                    />
                </div>

                {/* Users List */}
                <div className="grid gap-4">
                    {filteredUsers.map((user: any) => (
                        <Card key={user.id} className="p-6">
                            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900">{user.name}</h3>
                                        <p className="text-xs text-slate-400 font-bold">{user.email} • <span className="uppercase">{user.role}</span></p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SLL Balance</p>
                                        <p className="text-lg font-black text-slate-900">Le {parseFloat(user.sllBalance).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">USD Balance</p>
                                        <p className="text-lg font-black text-quantum-600">${parseFloat(user.usdBalance).toFixed(2)}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button 
                                            size="sm" 
                                            className="bg-slate-900 hover:bg-slate-800"
                                            onClick={() => { setSelectedUser(user); setShowAdjustDialog(true); }}
                                        >
                                            Adjust Balance
                                        </Button>
                                        <Button 
                                            variant="outline"
                                            size="sm" 
                                            onClick={() => { setSelectedUser(user); setShowRoleDialog(true); }}
                                        >
                                            Change Role
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Role Update Dialog */}
            {showRoleDialog && selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <Card className="w-full max-w-md p-8 bg-white rounded-[2.5rem] shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <ShieldAlert size={24} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Update User Role</h3>
                        </div>
                        
                        <p className="text-sm text-slate-500 font-bold mb-6">Changing role for: <span className="text-slate-900">{selectedUser.name}</span></p>

                        <div className="grid grid-cols-1 gap-3 mb-8">
                            {['learner', 'seller', 'admin'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => handleRoleUpdate(role)}
                                    className={`w-full py-4 px-6 rounded-2xl font-black text-sm text-left flex justify-between items-center transition-all ${
                                        selectedUser.role === role 
                                            ? 'bg-quantum-600 text-white shadow-lg' 
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="uppercase tracking-widest">{role}</span>
                                    {selectedUser.role === role && <CheckCircle size={18} />}
                                </button>
                            ))}
                        </div>

                        <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => setShowRoleDialog(false)}
                        >
                            Cancel
                        </Button>
                    </Card>
                </div>
            )}

            {/* Adjust Balance Dialog */}
            {showAdjustDialog && selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <Card className="w-full max-w-md p-8 bg-white rounded-[2.5rem] shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-quantum-50 text-quantum-600 rounded-lg">
                                <Wallet size={24} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Adjust Balance</h3>
                        </div>
                        
                        <p className="text-sm text-slate-500 font-bold mb-6">Adjusting wallet for: <span className="text-slate-900">{selectedUser.name}</span></p>

                        <div className="space-y-4 mb-8">
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setAdjustmentCurrency('SLL')}
                                    className={`flex-1 py-3 rounded-xl font-black text-xs border-2 transition-all ${adjustmentCurrency === 'SLL' ? 'border-quantum-600 bg-quantum-50 text-quantum-600' : 'border-slate-100 text-slate-400'}`}
                                >
                                    SLL (Le)
                                </button>
                                <button 
                                    onClick={() => setAdjustmentCurrency('USD')}
                                    className={`flex-1 py-3 rounded-xl font-black text-xs border-2 transition-all ${adjustmentCurrency === 'USD' ? 'border-quantum-600 bg-quantum-50 text-quantum-600' : 'border-slate-100 text-slate-400'}`}
                                >
                                    USD ($)
                                </button>
                            </div>

                            <input
                                type="number"
                                placeholder="Amount (e.g. 50.00)"
                                value={adjustmentAmount}
                                onChange={(e) => setAdjustmentAmount(e.target.value)}
                                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-quantum-500 font-bold"
                            />

                            <input
                                type="text"
                                placeholder="Description / Reason"
                                value={adjustmentDescription}
                                onChange={(e) => setAdjustmentDescription(e.target.value)}
                                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-quantum-500 text-sm font-medium"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button 
                                className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border-none"
                                onClick={() => handleAdjust(false)}
                                isLoading={adjustMutation.isPending}
                            >
                                <Minus size={18} className="mr-2" /> Debit
                            </Button>
                            <Button 
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleAdjust(true)}
                                isLoading={adjustMutation.isPending}
                            >
                                <Plus size={18} className="mr-2" /> Credit
                            </Button>
                        </div>
                        <Button 
                            variant="outline" 
                            className="w-full mt-3" 
                            onClick={() => setShowAdjustDialog(false)}
                        >
                            Cancel
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    );
}
