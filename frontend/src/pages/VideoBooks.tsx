import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Play, Video, Search, Filter, Star, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';

interface VideoBook {
    id: string;
    title: string;
    author: string;
    category: string;
    coverUrl: string;
    videoUrl?: string;
    priceSLL: number;
    rating?: number;
    durationSeconds?: number;
    description: string;
}

export const VideoBooks = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState<VideoBook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVideoBooks();
    }, [selectedCategory, searchQuery]);

    const fetchVideoBooks = async () => {
        setLoading(true);
        try {
            // Using existing listBooks API with filters
            const response = await api.books.list({
                hasVideo: true,
                genre: selectedCategory,
                search: searchQuery
            });
            setBooks(response);
        } catch (error) {
            console.error('Fetch Video Books Error:', error);
            toast.error('Failed to load video books');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['all', 'Science', 'Mathematics', 'History', 'Technology'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                        <Video className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Video Books</h1>
                    </div>
                    <nav className="flex gap-4 items-center">
                        <button onClick={() => navigate("/")} className="text-gray-700 hover:text-indigo-600 font-medium">Home</button>
                        <button onClick={() => navigate("/library")} className="text-gray-700 hover:text-indigo-600 font-medium">Library</button>
                        <Button onClick={() => navigate("/login")}>Sign In</Button>
                    </nav>
                </div>
            </header>

            <main className="container max-w-7xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <section className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Video className="w-4 h-4" />
                        Enhanced Learning Experience
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Video-Enhanced <span className="text-indigo-600">Books</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Immerse yourself in learning with our collection of books featuring embedded video lessons, animations, and interactive content.
                    </p>
                </section>

                {/* Search and Filter */}
                <section className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search video books..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 flex-wrap">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-300'
                                        }`}
                                >
                                    {category === 'all' ? 'All Books' : category}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Video Books Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                            <Loader2 className="w-12 h-12 animate-spin mb-4" />
                            <p className="text-lg font-medium">Loading amazing content...</p>
                        </div>
                    ) : books.length > 0 ? (
                        books.map(book => (
                            <Card key={book.id} className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 group">
                                {/* Video Preview */}
                                <div className="relative aspect-[2/3] bg-gray-900 overflow-hidden">
                                    <img
                                        src={book.coverUrl || 'https://picsum.photos/seed/book/400/600'}
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <button className="bg-white/90 backdrop-blur-sm text-indigo-600 rounded-full p-6 hover:scale-110 transition-transform shadow-lg">
                                            <Play className="w-8 h-8 fill-current" />
                                        </button>
                                    </div>
                                    {/* Duration Badge */}
                                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                                        <Video className="w-4 h-4" />
                                        {book.durationSeconds ? `${Math.floor(book.durationSeconds / 60)}m` : 'Video'}
                                    </div>
                                </div>

                                {/* Book Info */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 mb-3">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span className="text-sm font-semibold text-gray-900">{book.rating || '5.0'}</span>
                                        <span className="text-sm text-gray-500">• {book.category}</span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{book.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-gray-500">Price</div>
                                            <div className="text-2xl font-bold text-indigo-600">Le {book.priceSLL.toLocaleString()}</div>
                                        </div>
                                        <Button
                                            onClick={() => navigate(`/player?book=${book.id}`)}
                                            className="bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Watch Now
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No video books found</h3>
                            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </section>

                {/* CTA Section */}
                <section className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Want to Create Video Books?</h2>
                    <p className="text-lg mb-8 text-indigo-100">
                        Join our creator community and start producing engaging video-enhanced educational content
                    </p>
                    <Button
                        onClick={() => navigate("/seller-dashboard")}
                        className="bg-white text-indigo-600 hover:bg-gray-100"
                        size="lg"
                    >
                        Become a Creator
                    </Button>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
                <div className="container max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <BookOpen className="w-6 h-6" />
                        <span className="text-xl font-bold text-white">QuantumMint Bookstore</span>
                    </div>
                    <p className="text-sm">© 2024 QuantumMint Bookstore. Transforming education through video-enhanced learning.</p>
                </div>
            </footer>
        </div>
    );
};
