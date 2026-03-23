import * as React from 'react';
const { useState } = React;
import { BookCard } from '../components/BookCard';
import { Book } from '../types';

// Mock book data for demonstration
const MOCK_BOOKS: Book[] = [
    {
        id: '1',
        title: 'The Art of Scientific Thinking',
        author: 'Dr. Sarah Chen',
        description: 'Learn the fundamental principles of scientific reasoning and critical thinking. Perfect for students and professionals alike.',
        coverImage: '',
        chapters: [],
        totalDuration: 7200, // 2 hours
        genre: 'Science & Technology',
        rating: 4.8,
        creatorId: 'creator1',
        createdAt: '2024-01-15',
    },
    {
        id: '2',
        title: 'Business Strategy Essentials',
        author: 'Michael Rodriguez',
        description: 'Master the core concepts of modern business strategy with real-world examples and case studies.',
        coverImage: '',
        chapters: [],
        totalDuration: 5400, // 1.5 hours
        genre: 'Business & Economics',
        rating: 4.6,
        creatorId: 'creator2',
        createdAt: '2024-01-20',
    },
    {
        id: '3',
        title: 'Mindfulness for Beginners',
        author: 'Emma Thompson',
        description: 'Start your mindfulness journey with practical exercises and guided meditations.',
        coverImage: '',
        chapters: [],
        totalDuration: 3600, // 1 hour
        genre: 'Self-Help',
        rating: 4.9,
        creatorId: 'creator3',
        createdAt: '2024-02-01',
    },
    {
        id: '4',
        title: 'World War II: A Complete History',
        author: 'Prof. James Anderson',
        description: 'Comprehensive overview of the Second World War, from its causes to its lasting impact.',
        coverImage: '',
        chapters: [],
        totalDuration: 14400, // 4 hours
        genre: 'History',
        rating: 4.7,
        creatorId: 'creator4',
        createdAt: '2024-02-10',
    },
    {
        id: '5',
        title: 'Introduction to Python Programming',
        author: 'Alex Kumar',
        description: 'Learn Python from scratch with hands-on examples and practical projects.',
        coverImage: '',
        chapters: [],
        totalDuration: 10800, // 3 hours
        genre: 'Education',
        rating: 4.5,
        creatorId: 'creator5',
        createdAt: '2024-02-15',
    },
    {
        id: '6',
        title: 'The Mystery of Shadow Creek',
        author: 'Rachel Williams',
        description: 'A gripping mystery that will keep you on the edge of your seat till the very end.',
        coverImage: '',
        chapters: [],
        totalDuration: 9000, // 2.5 hours
        genre: 'Mystery & Thriller',
        rating: 4.4,
        creatorId: 'creator6',
        createdAt: '2024-02-20',
    },
];

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

    // Filter and sort books
    const filteredBooks = MOCK_BOOKS.filter((book) => {
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
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'rating':
                return b.rating - a.rating;
            case 'duration-short':
                return a.totalDuration - b.totalDuration;
            case 'duration-long':
                return b.totalDuration - a.totalDuration;
            default: // popular
                return b.rating - a.rating;
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

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Showing {filteredBooks.length} audiobook{filteredBooks.length !== 1 ? 's' : ''}
                        {searchQuery && ` for "${searchQuery}"`}
                        {selectedGenre !== 'All' && ` in ${selectedGenre}`}
                    </div>
                </div>

                {/* Book Grid */}
                {filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBooks.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No audiobooks found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Try adjusting your search or filters
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedGenre('All');
                            }}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
