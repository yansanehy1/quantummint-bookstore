import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../utils/api';
import {
    Gift,
    ArrowLeft,
    Search,
    User,
    BookOpen,
    Send,
    CheckCircle,
    Info
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { toast } from 'sonner';

export default function AdminPromotions() {
    const navigate = useNavigate();
    const [recipientType, setRecipientType] = useState<'individual' | 'all'>('individual');
    const [selectedBookId, setSelectedBookId] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [userSearch, setUserSearch] = useState('');

    const { data: books } = useQuery({
        queryKey: ['admin', 'books', 'approved'],
        queryFn: () => api.admin.getAllBooks()
    });

    const { data: users } = useQuery({
        queryKey: ['admin', 'users'],
        queryFn: () => api.admin.getAllUsers()
    });

    const giftMutation = useMutation({
        mutationFn: (data: { bookId: string; userId?: string; recipientType: 'individual' | 'all'; message?: string }) => 
            api.admin.giftBook(data),
        onSuccess: (data) => {
            toast.success(data.message || 'Gift sent successfully');
            setSelectedBookId('');
            setSelectedUserId('');
            setMessage('');
        },
        onError: () => {
            toast.error('Failed to send gift');
        }
    });

    const handleSendGift = () => {
        if (!selectedBookId) {
            toast.error('Please select a book');
            return;
        }
        if (recipientType === 'individual' && !selectedUserId) {
            toast.error('Please select a recipient');
            return;
        }

        giftMutation.mutate({
            bookId: selectedBookId,
            userId: recipientType === 'individual' ? selectedUserId : undefined,
            recipientType,
            message
        });
    };

    const filteredBooks = books?.filter((b: any) => 
        b.status === 'approved' && b.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const filteredUsers = users?.filter((u: any) => 
        u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    ) || [];

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                            <ArrowLeft size={16} />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Promotions & Gifts</h1>
                            <p className="text-slate-500 font-bold">Distribute free educational content</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8">
                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl">
                                <Gift size={24} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Send New Gift</h2>
                        </div>

                        <div className="space-y-8">
                            {/* Step 1: Select Recipient */}
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">1. Select Recipient</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setRecipientType('individual')}
                                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                                            recipientType === 'individual' 
                                                ? 'border-quantum-600 bg-quantum-50 text-quantum-600' 
                                                : 'border-slate-100 hover:border-slate-200'
                                        }`}
                                    >
                                        <User size={20} className="mb-2" />
                                        <p className="font-black text-sm">Individual User</p>
                                        <p className="text-[10px] font-bold opacity-60 uppercase">Specific learner or creator</p>
                                    </button>
                                    <button
                                        onClick={() => setRecipientType('all')}
                                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                                            recipientType === 'all' 
                                                ? 'border-quantum-600 bg-quantum-50 text-quantum-600' 
                                                : 'border-slate-100 hover:border-slate-200'
                                        }`}
                                    >
                                        <CheckCircle size={20} className="mb-2" />
                                        <p className="font-black text-sm">All Platform Users</p>
                                        <p className="text-[10px] font-bold opacity-60 uppercase">Site-wide promotion</p>
                                    </button>
                                </div>

                                {recipientType === 'individual' && (
                                    <div className="mt-4">
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="text"
                                                placeholder="Search user by name or email..."
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-quantum-500 outline-none"
                                                value={userSearch}
                                                onChange={(e) => setUserSearch(e.target.value)}
                                            />
                                        </div>
                                        {userSearch && (
                                            <div className="mt-2 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg">
                                                {filteredUsers.map((u: any) => (
                                                    <button
                                                        key={u.id}
                                                        onClick={() => { setSelectedUserId(u.id); setUserSearch(''); }}
                                                        className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex justify-between items-center ${selectedUserId === u.id ? 'bg-quantum-50 text-quantum-600' : ''}`}
                                                    >
                                                        <div>
                                                            <p className="font-black">{u.name}</p>
                                                            <p className="text-xs font-bold text-slate-400">{u.email}</p>
                                                        </div>
                                                        {selectedUserId === u.id && <CheckCircle size={16} />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {selectedUserId && !userSearch && (
                                            <div className="mt-2 p-3 bg-green-50 rounded-xl border border-green-100 flex items-center justify-between">
                                                <span className="text-xs font-black text-green-700">Recipient: {users?.find((u: any) => u.id === selectedUserId)?.name}</span>
                                                <button onClick={() => setSelectedUserId('')} className="text-xs font-black text-green-700 hover:underline">Change</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Step 2: Select Book */}
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">2. Select Content</label>
                                <div className="relative mb-4">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text"
                                        placeholder="Search approved books..."
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-quantum-500 outline-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredBooks.map((book: any) => (
                                        <button
                                            key={book.id}
                                            onClick={() => setSelectedBookId(book.id)}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                                                selectedBookId === book.id 
                                                    ? 'border-quantum-600 bg-quantum-50 text-quantum-600' 
                                                    : 'border-slate-50 hover:border-slate-100'
                                            }`}
                                        >
                                            <div className="w-10 h-14 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300">
                                                <BookOpen size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-black text-sm">{book.title}</p>
                                                <p className="text-[10px] font-bold opacity-60 uppercase">{book.category} • {book.author}</p>
                                            </div>
                                            {selectedBookId === book.id && <CheckCircle size={18} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Step 3: Optional Message */}
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">3. Optional Message (Internal Log)</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Reason for gift (e.g. Beta tester reward, compensation, site launch promo)"
                                    className="w-full h-24 p-4 text-sm border border-slate-200 rounded-2xl focus:ring-2 focus:ring-quantum-500 outline-none resize-none font-medium"
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    className="w-full py-4 bg-quantum-600 hover:bg-quantum-700 text-white shadow-xl shadow-quantum-600/20"
                                    onClick={handleSendGift}
                                    isLoading={giftMutation.isPending}
                                    disabled={!selectedBookId || (recipientType === 'individual' && !selectedUserId)}
                                >
                                    <Send size={18} className="mr-2" /> Dispatch Gift
                                </Button>
                                <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                                    <Info className="text-blue-500 shrink-0" size={18} />
                                    <p className="text-xs font-bold text-blue-700">
                                        Gifting a book creates a free purchase record for the recipient. 
                                        If "All Users" is selected, this action cannot be undone easily.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
