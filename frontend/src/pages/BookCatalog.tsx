import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, BookOpen, Star, Play, Headphones } from 'lucide-react';

interface CatalogProps {
    title: string;
    description: string;
    type?: 'all' | 'ebook' | 'audiobook' | 'video';
    featured?: boolean;
}

export const BookCatalog: React.FC<CatalogProps> = ({
    title,
    description,
    type = 'all',
    featured = false
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [selectedLevel, setSelectedLevel] = useState('all');

    // Mock books data
    const allBooks = [
        {
            id: '1',
            title: 'Physics: Advanced Mechanics',
            author: 'Dr. John Smith',
            cover: 'https://picsum.photos/seed/phys1/300/450',
            price: 29.99,
            rating: 4.8,
            type: 'ebook',
            level: 'Tertiary',
            sales: 1234
        },
        {
            id: '2',
            title: 'Introduction to Programming',
            author: 'Sarah Johnson',
            cover: 'https://picsum.photos/seed/prog1/300/450',
            price: 34.99,
            rating: 4.9,
            type: 'video',
            level: 'SSS',
            sales: 2156
        },
        {
            id: '3',
            title: 'Chemistry: Organic Compounds',
            author: 'Prof. Michael Chen',
            cover: 'https://picsum.photos/seed/chem1/300/450',
            price: 24.99,
            rating: 4.7,
            type: 'audiobook',
            level: 'SSS',
            sales: 987
        },
        {
            id: '4',
            title: 'Mathematics: Calculus I',
            author: 'Dr. Emily Brown',
            cover: 'https://picsum.photos/seed/math1/300/450',
            price: 27.99,
            rating: 4.6,
            type: 'ebook',
            level: 'Tertiary',
            sales: 1543
        },
        {
            id: '5',
            title: 'African History & Culture',
            author: 'Dr. Aminata Kamara',
            cover: 'https://picsum.photos/seed/hist1/300/450',
            price: 19.99,
            rating: 4.9,
            type: 'audiobook',
            level: 'JSS',
            sales: 2345
        },
        {
            id: '6',
            title: 'Web Development Masterclass',
            author: 'David Wilson',
            cover: 'https://picsum.photos/seed/web1/300/450',
            price: 39.99,
            rating: 4.8,
            type: 'video',
            level: 'General',
            sales: 3421
        }
    ];

    // Filter books based on type
    let books = type === 'all' ? allBooks : allBooks.filter(b => b.type === type);

    // Sort books
    if (sortBy === 'popular') {
        books = [...books].sort((a, b) => b.sales - a.sales);
    } else if (sortBy === 'rating') {
        books = [...books].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-low') {
        books = [...books].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        books = [...books].sort((a, b) => b.price - a.price);
    }

    // Filter by level
    if (selectedLevel !== 'all') {
        books = books.filter(b => b.level === selectedLevel);
    }

    const getTypeIcon = (bookType: string) => {
        switch (bookType) {
            case 'video':
                return <Play size={16} className="text-blue-500" />;
            case 'audiobook':
                return <Headphones size={16} className="text-purple-500" />;
            default:
                return <BookOpen size={16} className="text-emerald-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
                    <p className="text-slate-600">{description}</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search books..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            />
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        >
                            <option value="popular">Most Popular</option>
                            <option value="rating">Highest Rated</option>
                        </select>

                        {/* Filter Button */}
                        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                            <SlidersHorizontal size={20} />
                            <span>Filters</span>
                        </button>
                    </div>

                    {/* Level Filter */}
                    <div className="flex gap-2 mt-4">
                        {['all', 'JSS', 'SSS', 'Tertiary', 'General'].map(level => (
                            <button
                                key={level}
                                onClick={() => setSelectedLevel(level)}
                                className={`px-4 py-2 rounded-lg transition-colors ${selectedLevel === level
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {level === 'all' ? 'All Levels' : level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 text-slate-600">
                    Showing <span className="font-semibold text-slate-900">{books.length}</span> result{books.length !== 1 ? 's' : ''}
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map(book => (
                        <div key={book.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                                <img
                                    src={book.cover}
                                    alt={book.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 left-2 bg-slate-900 bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded">
                                    {book.level}
                                </div>
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
                                        <span className="text-xs text-slate-500">({book.sales})</span>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600 uppercase">Pay-As-You-Go</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <div className="mt-8 text-center">
                    <button className="px-8 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                        Load More Books
                    </button>
                </div>
            </div>
        </div>
    );
};

// Individual page exports
export const AllBooks: React.FC = () => (
    <BookCatalog
        title="All Books"
        description="Browse our complete collection of books, audiobooks, and video courses"
        type="all"
    />
);

export const Audiobooks: React.FC = () => (
    <BookCatalog
        title="Audiobooks"
        description="Listen and learn with our extensive audiobook library"
        type="audiobook"
    />
);

export const VideoBooks: React.FC = () => (
    <BookCatalog
        title="Video Courses"
        description="Watch and master new skills with video courses"
        type="video"
    />
);

export const NewReleases: React.FC = () => (
    <BookCatalog
        title="New Releases"
        description="Check out the latest additions to our catalog"
        type="all"
        featured={true}
    />
);

export const Bestsellers: React.FC = () => (
    <BookCatalog
        title="Bestsellers"
        description="Our most popular and highest-rated content"
        type="all"
        featured={true}
    />
);
