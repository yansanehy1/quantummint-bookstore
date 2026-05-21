import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import {
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    ArrowLeft,
    User,
    Wallet
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { toast } from 'sonner';

export default function AdminPayoutManagement() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
        interface Payout {
            id: string;
            userId: string;
            amount: number;
            currency: 'USD' | 'SLL';
            status: string;
            rejectionReason?: string;
        }
        const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectDialog, setShowRejectDialog] = useState(false);

    const { data: payouts, isLoading } = useQuery({
        queryKey: ['admin', 'payouts'],
        queryFn: () => api.admin.getPayoutRequests()
    });

    const processMutation = useMutation({
        mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) => 
            api.admin.processPayout(id, { status, rejectionReason: reason }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'payouts'] });
            toast.success('Payout processed successfully');
            setShowRejectDialog(false);
            setRejectionReason('');
        },
        onError: () => {
            toast.error('Failed to process payout');
        }
    });

    const handleApprove = (id: string) => {
        processMutation.mutate({ id, status: 'approved' });
    };

    const handleReject = () => {
        if (!rejectionReason.trim() || !selectedPayout) return;
        processMutation.mutate({ id: selectedPayout.id, status: 'failed', reason: rejectionReason });
    };

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
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payout Requests</h1>
                            <p className="text-slate-500 font-bold">Review and authorize creator withdrawals</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid gap-6">
                    {payouts && payouts.length > 0 ? (
                        payouts.map((payout: any) => (
                            <Card key={payout.id} className="p-6">
                                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                                            <DollarSign size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">
                                                {payout.currency === 'USD' ? '$' : 'Le '}
                                                {parseFloat(payout.amount).toLocaleString()}
                                            </h3>
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                                    <User size={14} /> {payout.User?.name || 'Unknown'}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                                    <Wallet size={14} /> {payout.paymentMethod?.replace(/_/g, ' ')}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                                    <Clock size={14} /> {new Date(payout.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            {payout.phoneNumber && (
                                                <p className="text-xs font-black text-quantum-600 mt-2">Target: {payout.phoneNumber}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button 
                                            variant="outline"
                                            className="text-red-600 border-red-100 hover:bg-red-50"
                                            onClick={() => { setSelectedPayout(payout); setShowRejectDialog(true); }}
                                        >
                                            Reject
                                        </Button>
                                        <Button 
                                            onClick={() => handleApprove(payout.id)}
                                            className="bg-green-600 hover:bg-green-700"
                                            isLoading={processMutation.isPending}
                                        >
                                            Approve Payout
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                            <DollarSign size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold">No pending payout requests</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Dialog */}
            {showRejectDialog && selectedPayout && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <Card className="w-full max-w-md p-8 bg-white rounded-[2rem] shadow-2xl">
                        <h3 className="text-xl font-black text-slate-900 mb-2">Reject Payout</h3>
                        <p className="text-sm text-slate-500 font-bold mb-6">Provide a reason for rejection (this will be shown to the user)</p>
                        
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g., Invalid account details, suspicious activity..."
                            className="w-full h-32 p-4 text-sm border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none font-medium mb-6"
                        />

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
                            <Button 
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleReject}
                                disabled={!rejectionReason.trim()}
                                isLoading={processMutation.isPending}
                            >
                                Confirm Rejection
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
