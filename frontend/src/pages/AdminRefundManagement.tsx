import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { type RefundRequest } from '../utils/api';
import {
    RotateCcw,
    CheckCircle,
    XCircle,
    Clock,
    ArrowLeft,
    User,
    BookOpen,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { toast } from 'sonner';

export default function AdminRefundManagement() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState('pending');
    const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [showRejectDialog, setShowRejectDialog] = useState(false);

    const { data: stats } = useQuery({
        queryKey: ['admin', 'refund-stats'],
        queryFn: () => api.admin.getRefundStats(),
    });

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'refunds', statusFilter],
        queryFn: () => api.admin.getRefundRequests({ status: statusFilter }),
    });

    const processMutation = useMutation({
        mutationFn: ({ id, status, notes }: { id: string; status: 'approved' | 'rejected'; notes?: string }) =>
            api.admin.processRefund(id, { status, adminNotes: notes }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'refunds'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'refund-stats'] });
            toast.success('Refund processed successfully');
            setShowRejectDialog(false);
            setAdminNotes('');
            setSelectedRefund(null);
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Failed to process refund');
        },
    });

    const refunds = data?.refunds || [];

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
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                            <ArrowLeft size={16} />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Refund Requests</h1>
                            <p className="text-slate-500 font-bold">Review learner purchase refund requests</p>
                        </div>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold bg-white"
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="all">All</option>
                    </select>
                </div>

                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card className="p-4">
                            <p className="text-xs font-bold text-slate-500 uppercase">Pending</p>
                            <p className="text-2xl font-black text-amber-600">{stats.pending}</p>
                        </Card>
                        <Card className="p-4">
                            <p className="text-xs font-bold text-slate-500 uppercase">Approved</p>
                            <p className="text-2xl font-black text-green-600">{stats.approved}</p>
                        </Card>
                        <Card className="p-4">
                            <p className="text-xs font-bold text-slate-500 uppercase">Rejected</p>
                            <p className="text-2xl font-black text-red-600">{stats.rejected}</p>
                        </Card>
                        <Card className="p-4">
                            <p className="text-xs font-bold text-slate-500 uppercase">Total Refunded</p>
                            <p className="text-sm font-black text-slate-900">
                                Le {stats.totalRefundedSLL?.toLocaleString()} / ${stats.totalRefundedUSD?.toFixed(2)}
                            </p>
                        </Card>
                    </div>
                )}

                <div className="grid gap-6">
                    {refunds.length > 0 ? (
                        refunds.map((refund) => (
                            <Card key={refund.id} className="p-6">
                                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                            <RotateCcw size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">
                                                {refund.currency === 'USD' ? '$' : 'Le '}
                                                {parseFloat(String(refund.amount)).toLocaleString()}
                                            </h3>
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                                    <User size={14} /> {(refund as any).User?.name || 'Unknown'}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                                    <BookOpen size={14} /> {refund.Purchase?.Book?.title || 'Purchase'}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                                    <Clock size={14} /> {new Date(refund.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-3 max-w-xl">{refund.reason}</p>
                                            <span className={`inline-block mt-2 text-xs font-black px-2 py-0.5 rounded-full ${
                                                refund.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                refund.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {refund.status}
                                            </span>
                                        </div>
                                    </div>

                                    {refund.status === 'pending' && (
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                className="text-red-600 border-red-100 hover:bg-red-50"
                                                onClick={() => { setSelectedRefund(refund); setShowRejectDialog(true); }}
                                            >
                                                <XCircle size={16} className="mr-1" /> Reject
                                            </Button>
                                            <Button
                                                onClick={() => processMutation.mutate({ id: refund.id, status: 'approved' })}
                                                className="bg-green-600 hover:bg-green-700"
                                                disabled={processMutation.isPending}
                                            >
                                                <CheckCircle size={16} className="mr-1" /> Approve
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="p-12 text-center">
                            <RotateCcw className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-bold">No {statusFilter} refund requests</p>
                        </Card>
                    )}
                </div>
            </div>

            {showRejectDialog && selectedRefund && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full p-6">
                        <h3 className="text-lg font-black text-slate-900 mb-4">Reject Refund</h3>
                        <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Optional notes for the learner..."
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm mb-4 min-h-[100px]"
                        />
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
                            <Button
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => processMutation.mutate({
                                    id: selectedRefund.id,
                                    status: 'rejected',
                                    notes: adminNotes || undefined,
                                })}
                                disabled={processMutation.isPending}
                            >
                                Confirm Reject
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
