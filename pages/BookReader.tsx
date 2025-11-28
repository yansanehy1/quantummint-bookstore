import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import {
    BookOpen, Play, Pause, Volume2, Bookmark, Download, Share2, ShoppingCart,
    Headphones, Eye, ThumbsUp, ThumbsDown, Trash2, Edit, MessageSquare, Send,
    Star, Verified, X
} from 'lucide-react';

// Mock notification system
const useToast = () => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error' | 'info'>('info');

    const showToast = (msg: string, t: 'success' | 'error' | 'info' = 'info') => {
        setMessage(msg);
        setType(t);
        setTimeout(() => setMessage(''), 3000);
    };

    return {
        success: (msg: string) => showToast(msg, 'success'),
        error: (msg: string) => showToast(msg, 'error'),
        info: (msg: string) => showToast(msg, 'info'),
        message,
        type,
        clear: () => setMessage('')
    };
};

const BookReader: React.FC = () => {
    const { setView } = useNavigation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(180);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showBookmarks, setShowBookmarks] = useState(false);
    const [activeTab, setActiveTab] = useState<'reader' | 'reviews'>('reader');
    const [isPurchased, setIsPurchased] = useState(false);
    const [activeSession, setActiveSession] = useState<any>(null);

    const audioRef = useRef<HTMLAudioElement>(null);
    const toast = useToast();

    useEffect(() => {
        document.title = 'Book Reader - Quantummint Bookstore';
    }, []);

    const mockBook = {
        title: "Introduction to Physics",
        author: "Dr. Ahmed Hassan",
        category: "Science",
        price: 4.99,
        rating: 4.5,
        reviews: 128,
        description: "A comprehensive introduction to physics covering mechanics, thermodynamics, and waves.",
        pages: 256,
        hasAudio: true
    };

    const mockPages = [
        { number: 1, content: "Chapter 1: Fundamentals of Motion\n\nMotion is the change in position of an object over time." },
        { number: 2, content: "Velocity and Speed\n\nVelocity is a vector quantity describing rate of change." },
        { number: 3, content: "Acceleration\n\nAcceleration is the rate of change of velocity." }
    ];

    const currentPageData = mockPages.find(p => p.number === currentPage);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        toast.info(isPlaying ? "Audio paused" : "Audio playing");
    };

    const handleNextPage = useCallback(() => {
        if (currentPage < mockPages.length) {
            setCurrentPage(currentPage + 1);
            setIsPlaying(false);
        }
    }, [currentPage]);

    const handlePreviousPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setIsPlaying(false);
        }
    }, [currentPage]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Toast Notification */}
            {toast.message && (
                <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    } text-white`}>
                    <span>{toast.message}</span>
                    <button onClick={toast.clear}><X className="w-4 h-4" /></button>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex justify-center">
                            <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl w-48 h-64 flex items-center justify-center text-6xl">
                                ⚛️
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <h1 className="text-4xl font-bold mb-2">{mockBook.title}</h1>
                            <p className="text-xl text-blue-600 mb-4">by {mockBook.author}</p>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} className={`w-5 h-5 ${i <= mockBook.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                                    ))}
                                    <span className="ml-2 font-bold">{mockBook.rating}</span>
                                </div>
                                <span className="text-gray-600">({mockBook.reviews} reviews)</span>
                            </div>
                            <p className="text-gray-700 mb-6">{mockBook.description}</p>
                            <div className="flex gap-3">
                                <button onClick={() => { setPurchased(true); toast.success('Book purchased!'); }}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" /> Buy Now - ${mockBook.price}
                                </button>
                                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                                    <Download className="w-5 h-5" /> Sample
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button onClick={() => setActiveTab('reader')}
                        className={`px-6 py-3 rounded-lg font-semibold ${activeTab === 'reader' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>
                        Reader Access
                    </button>
                    <button onClick={() => setActiveTab('reviews')}
                        className={`px-6 py-3 rounded-lg font-semibold ${activeTab === 'reviews' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>
                        Reviews ({mockBook.reviews})
                    </button>
                </div>

                {/* Reader Tab */}
                {activeTab === 'reader' && (
                    <div className="space-y-6">
                        {/* Access Gate */}
                        {!isPurchased && !activeSession && (
                            <div className="bg-yellow-50 border-4 border-yellow-200 rounded-xl p-6">
                                <h2 className="text-2xl font-bold mb-4">Unlock Full Access</h2>
                                <p className="mb-6">Choose an access option below.</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <button onClick={() => { setPurchased(true); toast.success('Purchased!'); }}
                                        className="p-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                                        <ShoppingCart className="w-6 h-6 mx-auto mb-2" />
                                        <div className="text-lg font-bold">Buy Permanently</div>
                                        <div className="text-sm">${mockBook.price}</div>
                                    </button>
                                    <button onClick={() => { setActiveSession({ type: 'reading' }); toast.info('Session started'); }}
                                        className="p-6 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50">
                                        <Eye className="w-6 h-6 mx-auto mb-2" />
                                        <div className="text-lg font-bold">Pay Per Use</div>
                                        <div className="text-sm">Start Reading</div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Reader Content */}
                        {(isPurchased || activeSession) && (
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Current Chapter</h2>
                                    <button onClick={() => setShowBookmarks(!showBookmarks)}
                                        className={`px-4 py-2 rounded-lg ${showBookmarks ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}>
                                        <Bookmark className="w-4 h-4 inline mr-2" />
                                        Bookmarks
                                    </button>
                                </div>

                                <div className="border-4 border-gray-100 rounded-xl p-8 mb-6 min-h-[400px]">
                                    <p className="text-sm text-gray-500 mb-4">Page {currentPage} of {mockPages.length}</p>
                                    <p className="text-xl leading-relaxed whitespace-pre-wrap">{currentPageData?.content}</p>
                                </div>

                                {/* Audio Player */}
                                {mockBook.hasAudio && (
                                    <div className="bg-blue-50 rounded-xl p-6 mb-6">
                                        <h3 className="font-bold mb-4 flex items-center">
                                            <Headphones className="w-5 h-5 mr-2" /> Audio Narration
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <button onClick={handlePlayPause}
                                                className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700">
                                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                                            </button>
                                            <div className="flex-1">
                                                <div className="bg-blue-200 h-2 rounded-full mb-2">
                                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }} />
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>{formatTime(currentTime)}</span>
                                                    <span>{formatTime(duration)}</span>
                                                </div>
                                            </div>
                                            <Volume2 className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="flex justify-between items-center">
                                    <button onClick={handlePreviousPage} disabled={currentPage === 1}
                                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                                        ← Previous
                                    </button>
                                    <span className="font-bold">{currentPage} / {mockPages.length}</span>
                                    <button onClick={handleNextPage} disabled={currentPage === mockPages.length}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>
                        <div className="text-center mb-8">
                            <div className="text-6xl font-bold text-yellow-600 mb-2">{mockBook.rating}</div>
                            <div className="flex justify-center">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className={`w-6 h-6 ${i <= mockBook.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <p className="text-gray-600 mt-2">Based on {mockBook.reviews} reviews</p>
                        </div>
                        <p className="text-center text-gray-500">Review system not yet implemented</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookReader;
