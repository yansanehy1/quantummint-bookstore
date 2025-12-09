import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    ArrowLeft
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface Book {
    id: number;
    title: string;
    author: string;
    seller: string;
    category: string;
    status: 'approved' | 'pending' | 'rejected';
    submittedDate: string;
    pages: number;
    rejectionReason?: string;
}

export default function AdminBookManagement() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Book Management - Quantummint Bookstore';
    }, []);
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);

    const [books, setBooks] = useState<Book[]>([
        {
            id: 1,
            title: 'Language Arts - JSS 1, Term 1',
            author: 'Sierra Books Admin',
            seller: 'Administrator',
            category: 'Language Arts',
            status: 'approved',
            submittedDate: '2025-11-02',
            pages: 3,
        },
        {
            id: 2,
            title: 'Advanced Mathematics',
            author: 'Prof. Fatima Jalloh',
            seller: 'Fatima Jalloh',
            category: 'Mathematics',
            status: 'pending',
            submittedDate: '2025-11-01',
            pages: 5,
        },
        {
            id: 3,
            title: 'Physics Basics',
            author: 'Dr. Ahmed Hassan',
            seller: 'Ahmed Hassan',
            category: 'Science',
            status: 'pending',
            submittedDate: '2025-10-31',
            pages: 4,
        },
        {
            id: 4,
            title: 'West African History',
            author: 'Binta K. Mansaray',
            seller: 'Binta K. Mansaray',
            category: 'History',
            status: 'rejected',
            submittedDate: '2025-10-29',
            pages: 7,
            rejectionReason: 'Formatting issues and blurry images. Please revise.'
        },
    ]);

    const pendingBooks = books.filter(b => b.status === 'pending');
    const approvedBooks = books.filter(b => b.status === 'approved');
    const rejectedBooks = books.filter(b => b.status === 'rejected');

    const approveBook = (bookId: number) => {
        setBooks(books.map(b => b.id === bookId ? { ...b, status: 'approved' as const, rejectionReason: undefined } : b));
        alert('Book approved successfully!');
    };

    const rejectBook = (bookId: number) => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason.');
            return;
        }
        setBooks(books.map(b => b.id === bookId ? { ...b, status: 'rejected' as const, rejectionReason } : b));
        setShowRejectDialog(false);
        setRejectionReason('');
        setSelectedBook(null);
        alert('Book rejected. Reason sent to seller.');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800 border-green-300';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-4 h-4 mr-1.5" />;
            case 'pending': return <Clock className="w-4 h-4 mr-1.5" />;
            case 'rejected': return <XCircle className="w-4 h-4 mr-1.5" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-10 pb-4 border-b">
                    <div>
                        <h1 className="text-4xl font-extrabold text-blue-900">Book Submission Review</h1>
                        <p className="text-lg text-gray-600 mt-2">Manage educational content submissions.</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Admin Dashboard
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <Card className="p-5 bg-yellow-50 border-yellow-300 hover:shadow-2xl transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                                <p className="text-4xl font-extrabold text-yellow-700 mt-1">{pendingBooks.length}</p>
                            </div>
                            <Clock className="w-10 h-10 text-yellow-500 opacity-60" />
                        </div>
                    </Card>
                    <Card className="p-5 bg-green-50 border-green-300 hover:shadow-2xl transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Approved</p>
                                <p className="text-4xl font-extrabold text-green-700 mt-1">{approvedBooks.length}</p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-500 opacity-60" />
                        </div>
                    </Card>
                    <Card className="p-5 bg-red-50 border-red-300 hover:shadow-2xl transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Rejected</p>
                                <p className="text-4xl font-extrabold text-red-700 mt-1">{rejectedBooks.length}</p>
                            </div>
                            <XCircle className="w-10 h-10 text-red-500 opacity-60" />
                        </div>
                    </Card>
                </div>

                <div className="mb-8">
                    <div className="flex gap-4 bg-gray-100 p-1 rounded-xl max-w-lg mx-auto">
                        {[
                            { id: 'pending' as const, label: `Pending (${pendingBooks.length})` },
                            { id: 'approved' as const, label: `Approved (${approvedBooks.length})` },
                            { id: 'rejected' as const, label: `Rejected (${rejectedBooks.length})` },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${activeTab === tab.id ? 'bg-white text-blue-700 shadow-md' : 'text-gray-600 hover:text-blue-500'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                    {(activeTab === 'pending' ? pendingBooks : activeTab === 'approved' ? approvedBooks : rejectedBooks).map(book => (
                        <BookCard
                            key={book.id}
                            book={book}
                            getStatusColor={getStatusColor}
                            getStatusIcon={getStatusIcon}
                            onView={() => {
                                setSelectedBook(book);
                                setShowViewDialog(true);
                            }}
                            onApprove={() => approveBook(book.id)}
                            onReject={() => {
                                setSelectedBook(book);
                                setRejectionReason(book.rejectionReason || '');
                                setShowRejectDialog(true);
                            }}
                        />
                    ))}
                </div>

                {/* View Dialog */}
                {showViewDialog && selectedBook && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowViewDialog(false)}>
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-2xl font-bold mb-4">{selectedBook.title}</h3>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Author</p>
                                    <p className="font-bold text-lg">{selectedBook.author}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Seller</p>
                                    <p className="font-bold text-lg">{selectedBook.seller}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Category</p>
                                    <p className="font-bold text-lg">{selectedBook.category}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Pages</p>
                                    <p className="font-bold text-lg">{selectedBook.pages}</p>
                                </div>
                            </div>
                            <Button onClick={() => setShowViewDialog(false)} className="w-full">Close</Button>
                        </div>
                    </div>
                )}

                {/* Reject Dialog */}
                {showRejectDialog && selectedBook && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowRejectDialog(false)}>
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-xl font-bold mb-4">Reject: {selectedBook.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Provide feedback for <strong>{selectedBook.seller}</strong>.
                            </p>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Explain the issues..."
                                rows={5}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg mb-4"
                            />
                            <div className="flex gap-3">
                                <Button onClick={() => setShowRejectDialog(false)} variant="outline" className="flex-1">
                                    Cancel
                                </Button>
                                <Button onClick={() => rejectBook(selectedBook.id)} className="flex-1 bg-red-600" disabled={!rejectionReason.trim()}>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const BookCard: React.FC<{
    book: Book;
    getStatusColor: (status: string) => string;
    getStatusIcon: (status: string) => React.ReactNode;
    onView: () => void;
    onApprove: () => void;
    onReject: () => void;
}> = ({
    book,
    getStatusColor,
    getStatusIcon,
    onView,
    onApprove,
    onReject
}) => (
        <Card className="p-5 hover:shadow-2xl transition">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="font-extrabold text-xl text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">By <span className="font-semibold">{book.author}</span></p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center ${getStatusColor(book.status)}`}>
                    {getStatusIcon(book.status)}
                    {book.status.toUpperCase()}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm mb-4 p-3 bg-gray-50 rounded-lg">
                <div>
                    <p className="text-gray-500 font-medium">Category</p>
                    <p className="font-semibold text-gray-800">{book.category}</p>
                </div>
                <div>
                    <p className="text-gray-500 font-medium">Pages</p>
                    <p className="font-semibold text-gray-800">{book.pages}</p>
                </div>
                <div>
                    <p className="text-gray-500 font-medium">Submitted</p>
                    <p className="font-semibold text-gray-800">{book.submittedDate}</p>
                </div>
            </div>

            {book.rejectionReason && (
                <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-4">
                    <p className="text-xs font-bold text-red-900 flex items-center mb-1">
                        <XCircle className="w-4 h-4 mr-2" />
                        REJECTED: Feedback
                    </p>
                    <p className="text-sm text-red-700">{book.rejectionReason}</p>
                </div>
            )}

            <div className="flex gap-3">
                <Button
                    onClick={onView}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                </Button>

                {book.status === 'pending' && (
                    <>
                        <Button onClick={onApprove} size="sm" className="flex-1 bg-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                        </Button>
                        <Button
                            onClick={onReject}
                            size="sm"
                            className="flex-1 bg-red-600"
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                        </Button>
                    </>
                )}
            </div>
        </Card>
    );
