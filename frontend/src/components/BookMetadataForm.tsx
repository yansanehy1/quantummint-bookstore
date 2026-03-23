import * as React from 'react';
const { useState } = React;

interface BookMetadata {
    title: string;
    author: string;
    description: string;
    genre: string;
    coverImage: string;
}

interface BookMetadataFormProps {
    metadata: BookMetadata;
    onChange: (metadata: BookMetadata) => void;
}

const genres = [
    'Fiction',
    'Non-Fiction',
    'Science & Technology',
    'Business & Economics',
    'Self-Help',
    'History',
    'Biography',
    'Education',
    'Children',
    'Mystery & Thriller',
    'Romance',
    'Fantasy & Sci-Fi',
];

export function BookMetadataForm({ metadata, onChange }: BookMetadataFormProps) {
    const handleChange = (field: keyof BookMetadata, value: string) => {
        onChange({ ...metadata, [field]: value });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange('coverImage', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Book Title *
                        </label>
                        <input
                            type="text"
                            value={metadata.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Enter your book title"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            required
                        />
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Author Name *
                        </label>
                        <input
                            type="text"
                            value={metadata.author}
                            onChange={(e) => handleChange('author', e.target.value)}
                            placeholder="Your name or pen name"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            required
                        />
                    </div>

                    {/* Genre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Genre *
                        </label>
                        <select
                            value={metadata.genre}
                            onChange={(e) => handleChange('genre', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            required
                        >
                            <option value="">Select a genre</option>
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>
                                    {genre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={metadata.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Describe your book..."
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                            required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            {metadata.description.length} characters
                        </p>
                    </div>
                </div>

                {/* Right Column - Cover Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cover Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        {metadata.coverImage ? (
                            <div className="relative">
                                <img
                                    src={metadata.coverImage}
                                    alt="Cover preview"
                                    className="mx-auto max-h-80 rounded-lg shadow-lg"
                                />
                                <button
                                    onClick={() => handleChange('coverImage', '')}
                                    className="mt-4 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                                >
                                    Remove Image
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-6xl">📚</div>
                                <div>
                                    <label className="cursor-pointer">
                                        <span className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block">
                                            Upload Cover Image
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Recommended: 800x1200px
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
