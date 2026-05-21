import * as React from 'react';
const { useState, useEffect } = React;
import { BookCard } from '../components/BookCard';
import { Book } from '../types';
import { booksAPI } from '../utils/api';
import { Loader2 } from 'lucide-react';

const GENRES = [
    'All',
    'Science & Technology',
    'Business & Economics',
    'Self-Help',
    'History',
    'Education',
    'Mystery & Thriller',
    'Fiction',
    'Non-Fiction',
    'Biography',
    'Children',
    'Romance',
    'Fantasy & Sci-Fi',
];

const SORT_OPTIONS = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'duration-short', label: 'Shortest First' },
    { value: 'duration-long', label: 'Longest First' },
];

export function Marketplace() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [sortBy, setSortBy] = useState('popular');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const data = await booksAPI.getAll();
                setBooks(data);
            } catch (error) {
                console.error('Failed to fetch books:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    // Filter and sort books
    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            searchQuery === '' ||
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;

        return matchesSearch && matchesGenre;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'duration-short':
                return (a.totalDuration || 0) - (b.totalDuration || 0);
            case 'duration-long':
                return (b.totalDuration || 0) - (a.totalDuration || 0);
            default: // popular
                return (b.rating || 0) - (a.rating || 0);
        }
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Browse Audiobooks
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Discover amazing audiobooks from talented creators
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search books, authors..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                                <svg
                                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Genre Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Genre
                            </label>
                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                            >
                                {GENRES.map((genre) => (
                                    <option key={genre} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                    </div>
                ) : filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBooks.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No books found matching your criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
