import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Star, BookOpen, Play } from 'lucide-react';

export const Discover: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Mock data for discovery
    const featuredBooks = [
        {
            id: '1',
            title: 'Advanced Physics: Quantum Mechanics',
            author: 'Dr. Sarah Chen',
            cover: 'https://picsum.photos/seed/physics/300/450',
            rating: 4.8,
            price: 24.99,
            category: 'Science',
            type: 'ebook',
            trending: true
        },
        {
            id: '2',
            title: 'Machine Learning Fundamentals',
            author: 'Prof. James Wilson',
            cover: 'https://picsum.photos/seed/ml/300/450',
            rating: 4.9,
            price: 29.99,
            category: 'Technology',
            type: 'video',
            trending: true
        },
        {
            id: '3',
            title: 'African History: Sierra Leone',
            author: 'Dr. Aminata Kamara',
            cover: 'https://picsum.photos/seed/history/300/450',
            rating: 4.7,
            price: 19.99,
            category: 'History',
            type: 'audiobook',
            newRelease: true
        },
        {
            id: '4',
            title: 'Mathematics for SSS Students',
            author: 'Mr. Mohamed Sesay',
            cover: 'https://picsum.photos/seed/math/300/450',
            rating: 4.6,
            price: 15.99,
            category: 'Mathematics',
            type: 'ebook',
            newRelease: true
        }
    ];

    const categories = [
        { id: 'all', name: 'All Categories', count: 234 },
        { id: 'science', name: 'Science', count: 45 },
        { id: 'mathematics', name: 'Mathematics', count: 67 },
        { id: 'technology', name: 'Technology', count: 38 },
        { id: 'history', name: 'History', count: 29 },
        { id: 'literature', name: 'Literature', count: 55 }
    ];

    const trendingTopics = [
        { name: 'Quantum Physics', books: 12 },
        { name: 'Data Science', books: 18 },
        { name: 'African Literature', books: 24 },
        { name: 'Chemistry', books: 15 }
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Discover Amazing Content</h1>
                    <p className="text-slate-600">Explore our collection of books, audiobooks, and video courses</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search for books, topics, or authors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                            <Filter size={20} />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar Filters */}
                    <div className="col-span-12 lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                            <h3 className="font-semibold text-slate-900 mb-4">Categories</h3>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === cat.id
                                                ? 'bg-emerald-50 text-emerald-700 font-medium'
                                                : 'hover:bg-slate-50 text-slate-700'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{cat.name}</span>
                                            <span className="text-xs text-slate-400">{cat.count}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8">
                                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <TrendingUp size={18} className="text-emerald-600" />
                                    Trending Topics
                                </h3>
                                <div className="space-y-3">
                                    {trendingTopics.map(topic => (
                                        <div key={topic.name} className="flex items-center justify-between">
                                            <span className="text-sm text-slate-700">{topic.name}</span>
                                            <span className="text-xs text-slate-400">{topic.books} books</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-12 lg:col-span-9">
                        {/* Trending Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="text-emerald-600" size={24} />
                                <h2 className="text-2xl font-bold text-slate-900">Trending Now</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {featuredBooks.filter(b => b.trending).map(book => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>
                        </div>

                        {/* New Releases */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="text-amber-500" size={24} />
                                <h2 className="text-2xl font-bold text-slate-900">New Releases</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {featuredBooks.filter(b => b.newRelease).map(book => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>
                        </div>

                        {/* All Books */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">All Books</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {featuredBooks.map(book => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookCard: React.FC<{ book: any }> = ({ book }) => {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video': return <Play size={16} className="text-blue-500" />;
            case 'audiobook': return <BookOpen size={16} className="text-purple-500" />;
            default: return <BookOpen size={16} className="text-emerald-500" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {book.trending && (
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        TRENDING
                    </div>
                )}
                {book.newRelease && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        NEW
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                    {getTypeIcon(book.type)}
                    <span className="text-xs text-slate-500 capitalize">{book.type}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-slate-600 mb-2">{book.author}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium text-slate-700">{book.rating}</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-600">${book.price}</span>
                </div>
            </div>
        </div>
    );
};
