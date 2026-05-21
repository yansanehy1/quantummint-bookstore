import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book } from '../types';

// Mock book data - in real app, this would come from API
const MOCK_BOOK: Book = {
    id: '1',
    title: 'The Art of Scientific Thinking',
    author: 'Dr. Sarah Chen',
    description: 'Learn the fundamental principles of scientific reasoning and critical thinking. This comprehensive guide takes you through the process of formulating hypotheses, conducting experiments, and drawing meaningful conclusions. Perfect for students, researchers, and anyone interested in developing a more analytical mindset. Through real-world examples and practical exercises, you\'ll discover how to think like a scientist and apply these principles to everyday life.',
    coverImage: '',
    chapters: [
        { id: '1', title: 'Introduction to Scientific Method', text: '', audioUrl: '', duration: 900, order: 0 },
        { id: '2', title: 'Hypothesis Formation', text: '', audioUrl: '', duration: 1200, order: 1 },
        { id: '3', title: 'Experimental Design', text: '', audioUrl: '', duration: 1500, order: 2 },
        { id: '4', title: 'Data Analysis', text: '', audioUrl: '', duration: 1800, order: 3 },
        { id: '5', title: 'Drawing Conclusions', text: '', audioUrl: '', duration: 1800, order: 4 },
    ],
    totalDuration: 7200,
    genre: 'Science & Technology',
    rating: 4.8,
    creatorId: 'creator1',
    createdAt: '2024-01-15',
};

export function BookDetail() {
    const { id } = useParams<{ id: string }>();

    // In real app, fetch book by ID from API
    const book = MOCK_BOOK;

    const totalMinutes = Math.ceil(book.totalDuration / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    to="/marketplace"
                    className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-6"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Marketplace
                </Link>

                {/* Book Detail */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-3 gap-8 p-8">
                        {/* Cover Image */}
                        <div className="md:col-span-1">
                            {book.coverImage ? (
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-full rounded-lg shadow-xl"
                                />
                            ) : (
                                <div className="w-full aspect-[2/3] bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg shadow-xl flex items-center justify-center">
                                    <span className="text-9xl">📚</span>
                                </div>
                            )}

                            {/* Start Listening Button */}
                            <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                🎧 Start Listening
                            </button>

                            {/* Preview Button */}
                            <button className="w-full mt-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                🎵 Preview (First Chapter Free)
                            </button>
                        </div>

                        {/* Book Info */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Title and Author */}
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    {book.title}
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-400">
                                    by {book.author}
                                </p>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                                    {book.genre}
                                </span>
                                <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    {durationText}
                                </span>
                                <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
                                    {book.chapters.length} Chapters
                                </span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-6 h-6 ${i < Math.floor(book.rating)
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300 dark:text-gray-600'
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {book.rating.toFixed(1)}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                    (248 ratings)
                                </span>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    About This Audiobook
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {book.description}
                                </p>
                            </div>

                            {/* Chapters */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    Chapters ({book.chapters.length})
                                </h2>
                                <div className="space-y-2">
                                    {book.chapters.map((chapter, index) => (
                                        <div
                                            key={chapter.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-500 dark:text-gray-400 font-mono text-sm font-semibold w-8">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <span className="text-gray-900 dark:text-white font-medium">
                                                    {chapter.title}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {Math.ceil(chapter.duration / 60)} min
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing Info */}
                            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                                <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
                                    💡 Educational Access
                                </h3>
                                <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
                                    <li>• Pay-per-use: Billed via Pay-As-You-Go mechanism</li>
                                    <li>• Or subscribe for unlimited listening & reading</li>
                                    <li>• Support creators with every minute you spend learning</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Books */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        More from {book.genre}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Related books coming soon...
                    </p>
                </div>
            </div>
        </div>
    );
}
