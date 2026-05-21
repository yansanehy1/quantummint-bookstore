import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import {
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    ArrowLeft,
    FileText,
    User,
    Tag
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { toast } from 'sonner';

export default function AdminBookManagement() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
        interface Book {
            id: string;
            title: string;
            author: string;
            status: string;
            rejectionReason?: string;
        }
        const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showBulkRejectDialog, setShowBulkRejectDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);

    const { data: books, isLoading } = useQuery({
        queryKey: ['admin', 'books'],
        queryFn: () => api.admin.getAllBooks()
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) => 
            api.admin.updateBookStatus(id, { status, rejectionReason: reason }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'books'] });
            toast.success('Book status updated');
            setShowRejectDialog(false);
            setRejectionReason('');
        },
        onError: () => {
            toast.error('Failed to update book status');
        }
    });

    const bulkStatusMutation = useMutation({
        mutationFn: (data: { ids: string[]; status: string; rejectionReason?: string }) => 
            api.admin.bulkUpdateBookStatus(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'books'] });
            toast.success(`Bulk updated ${data.count} books`);
            setSelectedIds([]);
            setShowBulkRejectDialog(false);
            setRejectionReason('');
        },
        onError: () => {
            toast.error('Failed to bulk update books');
        }
    });

    const handleApprove = (id: string) => {
        statusMutation.mutate({ id, status: 'approved' });
    };

    const handleReject = () => {
        if (!rejectionReason.trim() || !selectedBook) return;
        statusMutation.mutate({ id: selectedBook.id, status: 'rejected', reason: rejectionReason });
    };

    const handleBulkApprove = () => {
        if (selectedIds.length === 0) return;
        bulkStatusMutation.mutate({ ids: selectedIds, status: 'approved' });
    };

    const handleBulkReject = () => {
        if (selectedIds.length === 0 || !rejectionReason.trim()) return;
        bulkStatusMutation.mutate({ ids: selectedIds, status: 'rejected', rejectionReason });
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredBooks.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredBooks.map((b: any) => b.id));
        }
    };

    const filteredBooks = books?.filter((b: any) => b.status === activeTab) || [];

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
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Content Moderation</h1>
                            <p className="text-slate-500 font-bold">Review AI-native STEM books</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <Card className="p-6 bg-amber-50 border-amber-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pending Review</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{books?.filter((b:any) => b.status === 'pending').length || 0}</p>
                            </div>
                            <Clock className="text-amber-500" size={32} />
                        </div>
                    </Card>
                    <Card className="p-6 bg-green-50 border-green-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Live Content</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{books?.filter((b:any) => b.status === 'approved').length || 0}</p>
                            </div>
                            <CheckCircle className="text-green-500" size={32} />
                        </div>
                    </Card>
                    <Card className="p-6 bg-red-50 border-red-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Rejected</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{books?.filter((b:any) => b.status === 'rejected').length || 0}</p>
                            </div>
                            <XCircle className="text-red-500" size={32} />
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex gap-4 bg-white p-1 rounded-2xl border border-slate-200 w-fit">
                        {[
                            { id: 'pending', label: 'Queued', icon: Clock },
                            { id: 'approved', label: 'Approved', icon: CheckCircle },
                            { id: 'rejected', label: 'Rejected', icon: XCircle },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id as any); setSelectedIds([]); }}
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

                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">{selectedIds.length} Selected</span>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 border-red-100 hover:bg-red-50"
                                onClick={() => setShowBulkRejectDialog(true)}
                            >
                                Bulk Reject
                            </Button>
                            <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={handleBulkApprove}
                                isLoading={bulkStatusMutation.isPending}
                            >
                                Bulk Approve
                            </Button>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="grid gap-6">
                    {filteredBooks.length > 0 && (
                        <div className="flex items-center gap-3 px-6 mb-2">
                            <label htmlFor="select-all-books" className="sr-only">Select All Books</label>
                            <input 
                                id="select-all-books"
                                type="checkbox" 
                                checked={selectedIds.length === filteredBooks.length && filteredBooks.length > 0}
                                onChange={toggleSelectAll}
                                className="w-5 h-5 rounded border-slate-300 text-quantum-600 focus:ring-quantum-500"
                            />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Select All</span>
                        </div>
                    )}
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book: any) => (
                            <Card key={book.id} className={`p-6 transition-all ${selectedIds.includes(book.id) ? 'border-quantum-500 bg-quantum-50/30' : ''}`}>
                                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                                    <div className="flex items-center gap-6">
                                        <label htmlFor={`select-book-${book.id}`} className="sr-only">Select Book {book.title}</label>
                                        <input 
                                            id={`select-book-${book.id}`}
                                            type="checkbox" 
                                            checked={selectedIds.includes(book.id)}
                                            onChange={() => toggleSelect(book.id)}
                                            className="w-5 h-5 rounded border-slate-300 text-quantum-600 focus:ring-quantum-500"
                                        />
                                        <div className="w-16 h-24 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                                            {book.coverUrl ? (
                                                <img src={book.coverUrl} alt={book.title + ' cover'} className="w-full h-full object-cover" />
                                            ) : (
                                                <FileText size={32} />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">{book.title}</h3>
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                                    <User size={14} /> {book.Seller?.User?.name || 'Unknown'}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                                    <Tag size={14} /> {book.category}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-quantum-600 bg-quantum-50 px-2 py-0.5 rounded-full uppercase">
                                                    {book.difficulty_level}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => { setSelectedBook(book); setShowViewDialog(true); }}
                                        >
                                            <Eye size={18} className="mr-2" /> Preview
                                        </Button>
                                        
                                        {activeTab === 'pending' && (
                                            <>
                                                <Button 
                                                    variant="outline"
                                                    className="text-red-600 border-red-100 hover:bg-red-50"
                                                    onClick={() => { setSelectedBook(book); setShowRejectDialog(true); }}
                                                >
                                                    Reject
                                                </Button>
                                                <Button 
                                                    onClick={() => handleApprove(book.id)}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    Approve Content
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                            <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold">No {activeTab} content found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Dialog */}
            {showRejectDialog && selectedBook && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <Card className="w-full max-w-md p-8 bg-white rounded-[2rem] shadow-2xl">
                        <h3 className="text-xl font-black text-slate-900 mb-2">Reject Content</h3>
                        <p className="text-sm text-slate-500 font-bold mb-6">Provide feedback to {selectedBook.Seller?.User?.name}</p>
                        
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Why is this content being rejected? (e.g., incorrect STEM formulas, low audio quality)"
                            className="w-full h-32 p-4 text-sm border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none font-medium mb-6"
                        />

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
                            <Button 
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleReject}
                                disabled={!rejectionReason.trim()}
                            >
                                Confirm Rejection
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Bulk Reject Dialog */}
            {showBulkRejectDialog && selectedIds.length > 0 && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <Card className="w-full max-w-md p-8 bg-white rounded-[2rem] shadow-2xl">
                        <h3 className="text-xl font-black text-slate-900 mb-2">Bulk Reject Content</h3>
                        <p className="text-sm text-slate-500 font-bold mb-6">Provide feedback for {selectedIds.length} books</p>
                        
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Reason for bulk rejection..."
                            className="w-full h-32 p-4 text-sm border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none font-medium mb-6"
                        />

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setShowBulkRejectDialog(false)}>Cancel</Button>
                            <Button 
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleBulkReject}
                                disabled={!rejectionReason.trim()}
                                isLoading={bulkStatusMutation.isPending}
                            >
                                Confirm Bulk Reject
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
