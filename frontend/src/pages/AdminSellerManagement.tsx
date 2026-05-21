import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { 
    Users, 
    CheckCircle, 
    XCircle, 
    Clock, 
    ArrowLeft, 
    ShieldCheck, 
    MoreVertical,
    Mail,
    Calendar,
    Percent
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSellerManagement() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

    const { data: sellers, isLoading } = useQuery({
        queryKey: ['admin', 'sellers'],
        queryFn: () => api.admin.getAllSellers()
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status, commissionRate }: { id: string; status: string; commissionRate?: number }) => 
            api.admin.updateSellerStatus(id, { status, commissionRate }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
            toast.success('Seller status updated successfully');
        },
        onError: () => {
            toast.error('Failed to update seller status');
        }
    });

    const handleUpdateStatus = (id: string, status: string, commissionRate?: number) => {
        statusMutation.mutate({ id, status, commissionRate });
    };

    const filteredSellers = sellers?.filter(s => s.status === activeTab) || [];

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
                            <h1 className="text-3xl font-black text-slate-900">Seller Verification</h1>
                            <p className="text-slate-500 font-bold">Review and approve marketplace creators</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 bg-white p-1 rounded-2xl border border-slate-200 w-fit">
                    {[
                        { id: 'pending', label: 'Pending Approval', icon: Clock },
                        { id: 'approved', label: 'Active Sellers', icon: CheckCircle },
                        { id: 'rejected', label: 'Rejected', icon: XCircle },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all ${
                                activeTab === tab.id
                                    ? 'bg-quantum-600 text-white shadow-lg shadow-quantum-600/20'
                                    : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="grid gap-6">
                    {filteredSellers.length > 0 ? (
                        filteredSellers.map((seller) => (
                            <Card key={seller.id} className="p-6">
                                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                            <Users size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">{seller.businessName}</h3>
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                                    <Mail size={14} /> {seller.User?.email}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                                    <Calendar size={14} /> Applied {new Date(seller.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-quantum-600 bg-quantum-50 px-2 py-0.5 rounded-full">
                                                    <Percent size={14} /> {seller.commissionRate}% Fee
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {activeTab === 'pending' && (
                                            <>
                                                <Button 
                                                    variant="outline" 
                                                    className="text-red-600 border-red-100 hover:bg-red-50"
                                                    onClick={() => handleUpdateStatus(seller.id, 'rejected')}
                                                >
                                                    Reject
                                                </Button>
                                                <Button 
                                                    onClick={() => handleUpdateStatus(seller.id, 'approved')}
                                                    className="bg-quantum-600 hover:bg-quantum-700"
                                                >
                                                    <ShieldCheck size={18} className="mr-2" /> Approve Seller
                                                </Button>
                                            </>
                                        )}
                                        {activeTab === 'approved' && (
                                            <Button 
                                                variant="outline"
                                                onClick={() => handleUpdateStatus(seller.id, 'pending')}
                                            >
                                                Revoke Access
                                            </Button>
                                        )}
                                        {activeTab === 'rejected' && (
                                            <Button 
                                                variant="outline"
                                                onClick={() => handleUpdateStatus(seller.id, 'pending')}
                                            >
                                                Re-review
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                            <Users size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold">No {activeTab} sellers found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
