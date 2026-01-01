import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Edit2, Save, Plus, Trash2, BookOpen, Clock, DollarSign, Eye, X
} from 'lucide-react';

interface Page {
    id: number;
    pageNumber: number;
    title: string;
    content: string;
    audioUrl: string;
    durationSeconds: number;
}

interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    category: string;
    priceUsd: number;
    priceSll: number;
    coverImageUrl: string;
    status: 'draft' | 'pending_approval' | 'published' | 'rejected';
    rejectionReason?: string;
    pages: Page[];
}

const BookEditor: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'details' | 'pages' | 'approval'>('details');
    const [isEditingBook, setIsEditingBook] = useState(false);
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

    const [book, setBook] = useState<Book>({
        id: 1,
        title: "Language Arts - JSS 1, Term 1",
        author: "Sierra Books Admin",
        description: "Comprehensive English Language Arts course for Junior Secondary School 1",
        category: "Language Arts",
        priceUsd: 4.99,
        priceSll: 82000,
        coverImageUrl: "https://placehold.co/300x400/blue/white?text=Language+Arts",
        status: "published",
        pages: [
            { id: 1, pageNumber: 1, title: "Unit 1: Greetings", content: "Learn how to greet people...", audioUrl: "", durationSeconds: 480 },
            { id: 2, pageNumber: 2, title: "Unit 2: Questions", content: "Master asking questions...", audioUrl: "", durationSeconds: 520 },
        ]
    });

    useEffect(() => {
        document.title = 'Book Editor - Quantummint Bookstore';
    }, []);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors = {
            published: 'bg-green-600 text-white',
            pending_approval: 'bg-yellow-600 text-white',
            rejected: 'bg-red-600 text-white',
            draft: 'bg-gray-600 text-white'
        };
        return (
            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${colors[status as keyof typeof colors]}`}>
                {status.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    const handleBookFieldChange = (field: keyof Book, value: any) => {
        setBook({ ...book, [field]: value });
    };

    const saveBook = () => {
        setIsEditingBook(false);
        showToast('Book details saved successfully');
    };

    const addNewPage = () => {
        const newPage: Page = {
            id: Math.max(...book.pages.map(p => p.id), 0) + 1,
            pageNumber: book.pages.length + 1,
            title: "New Page",
            content: "Start writing...",
            audioUrl: "",
            durationSeconds: 0
        };
        setBook({ ...book, pages: [...book.pages, newPage] });
        setEditingPage(newPage);
        showToast('New page added');
    };

    const savePage = () => {
        if (!editingPage) return;
        setBook({
            ...book,
            pages: book.pages.map(p => p.id === editingPage.id ? editingPage : p)
        });
        setEditingPage(null);
        showToast('Page saved');
    };

    const deletePage = (pageId: number) => {
        if (confirm('Delete this page?')) {
            setBook({
                ...book,
                pages: book.pages.filter(p => p.id !== pageId).map((p, i) => ({ ...p, pageNumber: i + 1 }))
            });
            showToast('Page deleted');
        }
    };

    const submitForApproval = () => {
        setBook({ ...book, status: 'pending_approval' });
        showToast('Submitted for approval');
    };

    const approveBook = () => {
        setBook({ ...book, status: 'published', rejectionReason: undefined });
        showToast('Book approved and published');
    };

    const rejectBook = () => {
        if (!rejectionReason.trim()) {
            showToast('Please provide a reason', 'error');
            return;
        }
        setBook({ ...book, status: 'rejected', rejectionReason });
        setShowRejectDialog(false);
        setRejectionReason('');
        showToast('Book rejected');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-2xl z-50 ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    } text-white`}>
                    {toast.message}
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Book Content Editor</h1>
                        <p className="text-gray-600">Manage book metadata and content</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <StatusBadge status={book.status} />
                        <button onClick={() => navigate('/seller/dashboard')}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Rejection Alert */}
                {book.status === 'rejected' && book.rejectionReason && (
                    <div className="bg-red-50 border border-red-300 rounded-xl p-4 mb-6">
                        <h3 className="font-bold text-red-800 flex items-center mb-2">
                            <X className="w-5 h-5 mr-2" /> REJECTED - ACTION REQUIRED
                        </h3>
                        <p className="text-red-700 mb-3">Reason: {book.rejectionReason}</p>
                        <button onClick={() => submitForApproval()}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            Resubmit for Approval
                        </button>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {['details', 'pages', 'approval'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 rounded-lg font-semibold ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                                }`}>
                            {tab === 'details' ? 'Book Details' : tab === 'pages' ? `Pages (${book.pages.length})` : 'Approval'}
                        </button>
                    ))}
                </div>

                {/* Details Tab */}
                {activeTab === 'details' && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Book Metadata</h2>
                            <button onClick={() => setIsEditingBook(!isEditingBook)}
                                className={`px-4 py-2 rounded-lg font-semibold ${isEditingBook ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                                    }`}>
                                {isEditingBook ? <><X className="w-4 h-4 inline mr-2" />Cancel</> : <><Edit2 className="w-4 h-4 inline mr-2" />Edit</>}
                            </button>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="flex flex-col items-center">
                                <img src={book.coverImageUrl} alt="Cover" className="w-48 h-64 object-cover rounded-xl shadow-lg mb-4" />
                                <StatusBadge status={book.status} />
                            </div>

                            <div className="lg:col-span-2 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Title</label>
                                        <input value={book.title} onChange={(e) => handleBookFieldChange('title', e.target.value)}
                                            disabled={!isEditingBook}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Author</label>
                                        <input value={book.author} onChange={(e) => handleBookFieldChange('author', e.target.value)}
                                            disabled={!isEditingBook}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Category</label>
                                        <input value={book.category} onChange={(e) => handleBookFieldChange('category', e.target.value)}
                                            disabled={!isEditingBook}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Cover Image URL</label>
                                        <input value={book.coverImageUrl} onChange={(e) => handleBookFieldChange('coverImageUrl', e.target.value)}
                                            disabled={!isEditingBook}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Price (USD)</label>
                                        <input type="number" value={book.priceUsd} onChange={(e) => handleBookFieldChange('priceUsd', parseFloat(e.target.value))}
                                            disabled={!isEditingBook}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Price (SLL)</label>
                                        <input type="number" value={book.priceSll} onChange={(e) => handleBookFieldChange('priceSll', parseFloat(e.target.value))}
                                            disabled={!isEditingBook}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Description</label>
                                    <textarea value={book.description} onChange={(e) => handleBookFieldChange('description', e.target.value)}
                                        disabled={!isEditingBook} rows={4}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>

                                {isEditingBook && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button onClick={saveBook} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                            <Save className="w-4 h-4 inline mr-2" />Save
                                        </button>
                                        <button onClick={submitForApproval} disabled={book.status === 'pending_approval'}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                            <Clock className="w-4 h-4 inline mr-2" />Submit for Approval
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pages Tab */}
                {activeTab === 'pages' && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Book Pages ({book.pages.length})</h2>
                            <button onClick={addNewPage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                <Plus className="w-4 h-4 inline mr-2" />Add Page
                            </button>
                        </div>

                        <div className="space-y-4">
                            {book.pages.map(page => (
                                <div key={page.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg flex items-center">
                                                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                                                Page {page.pageNumber}: {page.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{page.content}</p>
                                            <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                                <span><Clock className="w-3 h-3 inline" /> {page.durationSeconds}s</span>
                                                <span className="truncate">Audio: {page.audioUrl || 'None'}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button onClick={() => setEditingPage(page)}
                                                className="px-3 py-2 text-blue-600 border border-blue-300 rounded hover:bg-blue-50">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => deletePage(page.id)}
                                                className="px-3 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Edit Page Dialog */}
                        {editingPage && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                    <h2 className="text-2xl font-bold mb-4">Edit Page {editingPage.pageNumber}</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Title</label>
                                            <input value={editingPage.title} onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded-lg" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Content</label>
                                            <textarea value={editingPage.content} onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                                                rows={6} className="w-full p-2 border border-gray-300 rounded-lg" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold mb-1">Audio URL</label>
                                                <input value={editingPage.audioUrl} onChange={(e) => setEditingPage({ ...editingPage, audioUrl: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold mb-1">Duration (seconds)</label>
                                                <input type="number" value={editingPage.durationSeconds}
                                                    onChange={(e) => setEditingPage({ ...editingPage, durationSeconds: parseInt(e.target.value) || 0 })}
                                                    className="w-full p-2 border border-gray-300 rounded-lg" />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-4 border-t">
                                            <button onClick={savePage} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save</button>
                                            <button onClick={() => setEditingPage(null)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Approval Tab */}
                {activeTab === 'approval' && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Approval & Distribution</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold mb-3">Status</h3>
                                <StatusBadge status={book.status} />
                            </div>
                            <div className="p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold mb-3">Pricing</h3>
                                <div className="space-y-2">
                                    <p className="flex justify-between">
                                        <span><DollarSign className="w-4 h-4 inline text-green-600" /> USD:</span>
                                        <span className="font-bold">${book.priceUsd}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>SLL:</span>
                                        <span className="font-bold">Le {book.priceSll.toLocaleString()}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 border rounded-lg bg-blue-50">
                                <h3 className="font-bold mb-4">Actions</h3>
                                {book.status === 'pending_approval' && (
                                    <div className="space-y-3">
                                        <button onClick={approveBook} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                            Approve (Admin)
                                        </button>
                                        <button onClick={() => setShowRejectDialog(true)} className="w-full px-4 py-2 border border-red-400 text-red-600 rounded-lg hover:bg-red-50">
                                            Reject (Admin)
                                        </button>
                                    </div>
                                )}
                                {book.status === 'draft' && (
                                    <button onClick={submitForApproval} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        <Clock className="w-4 h-4 inline mr-2" />Submit
                                    </button>
                                )}
                                <button className="w-full px-4 py-2 mt-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    <Eye className="w-4 h-4 inline mr-2" />Preview
                                </button>
                            </div>
                        </div>

                        {/* Reject Dialog */}
                        {showRejectDialog && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                                    <h2 className="text-2xl font-bold text-red-800 mb-4">Reject Book</h2>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Rejection Reason</label>
                                        <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Explain why..." rows={4}
                                            className="w-full p-2 border border-red-300 rounded-lg" />
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button onClick={rejectBook} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reject</button>
                                        <button onClick={() => setShowRejectDialog(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookEditor;

