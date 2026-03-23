import * as React from 'react';
const { useState } = React;
import { BookMetadataForm } from '../components/BookMetadataForm';
import { ChapterEditor } from '../components/ChapterEditor';
import { AudioSynthesizer } from '../components/AudioSynthesizer';
import { VoiceProfileSelector } from '../components/VoiceProfileSelector';
import { Chapter, VoiceProfile } from '../types';

interface BookMetadata {
    title: string;
    author: string;
    description: string;
    genre: string;
    coverImage: string;
}

interface Step {
    id: number;
    name: string;
    icon: string;
}

const INITIAL_METADATA: BookMetadata = {
    title: '',
    author: '',
    description: '',
    genre: '',
    coverImage: '',
};

export function CreateBook() {
    const [currentStep, setCurrentStep] = useState(0);
    const [metadata, setMetadata] = useState<BookMetadata>(INITIAL_METADATA);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
    const [selectedVoice, setSelectedVoice] = useState<VoiceProfile | undefined>();

    const handleVoiceSelect = (voice: VoiceProfile) => {
        setSelectedVoice(voice);
        console.log('Selected voice for book creation:', voice.name);
    };

    const steps: Step[] = [
        { id: 0, name: 'Book Info', icon: '📋' },
        { id: 1, name: 'Write Chapters', icon: '✍️' },
        { id: 2, name: 'Generate Audio', icon: '🎙️' },
        { id: 3, name: 'Preview & Publish', icon: '🚀' },
    ];

    const canNavigateToStep = (stepId: number): boolean => {
        if (stepId === 0) return true;
        if (stepId === 1) {
            return metadata.title && metadata.author && metadata.description && metadata.genre;
        }
        if (stepId === 2) {
            return chapters.length > 0;
        }
        if (stepId === 3) {
            return chapters.every((c) => c.audioUrl);
        }
        return false;
    };

    const handlePublish = async () => {
        // TODO: Implement publish logic - send to backend API
        const bookData = {
            ...metadata,
            chapters,
            totalDuration: chapters.reduce((sum, c) => sum + c.duration, 0),
            createdAt: new Date().toISOString(),
        };

        console.log('Publishing book:', bookData);
        alert('Book published successfully! (This is a demo - backend integration pending)');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Create Your Audiobook
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Follow the steps below to create and publish your audiobook
                    </p>
                </div>

                {/* Stepper */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                {/* Step Circle */}
                                <div className="flex flex-col items-center flex-1">
                                    <button
                                        onClick={() => canNavigateToStep(step.id) && setCurrentStep(step.id)}
                                        disabled={!canNavigateToStep(step.id)}
                                        className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all ${currentStep === step.id
                                                ? 'bg-purple-600 text-white scale-110'
                                                : canNavigateToStep(step.id)
                                                    ? 'bg-white dark:bg-gray-800 text-purple-600 border-2 border-purple-600 hover:scale-105 cursor-pointer'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <span className="text-2xl">{step.icon}</span>
                                    </button>
                                    <span
                                        className={`mt-2 text-sm font-medium ${currentStep === step.id
                                                ? 'text-purple-600 dark:text-purple-400'
                                                : 'text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        {step.name}
                                    </span>
                                </div>

                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 mx-4 mb-8 transition-all ${currentStep > step.id
                                                ? 'bg-purple-600'
                                                : 'bg-gray-300 dark:bg-gray-700'
                                            }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 min-h-[600px]">
                    {currentStep === 0 && (
                        <BookMetadataForm metadata={metadata} onChange={setMetadata} />
                    )}

                    {currentStep === 1 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Write Your Chapters
                            </h2>
                            <ChapterEditor
                                chapters={chapters}
                                onChaptersChange={setChapters}
                                currentChapterId={currentChapterId}
                                onCurrentChapterChange={setCurrentChapterId}
                            />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Generate Audio
                            </h2>
                            
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Select Voice for Audio Generation
                                </h3>
                                <VoiceProfileSelector
                                    selectedVoiceId={selectedVoice?.id}
                                    onVoiceSelect={handleVoiceSelect}
                                    compact={true}
                                />
                            </div>

                            {selectedVoice && (
                                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        Using voice: <span className="font-semibold">{selectedVoice.name}</span>
                                    </p>
                                </div>
                            )}

                            <AudioSynthesizer 
                                chapters={chapters} 
                                onChaptersChange={setChapters}
                            />
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Preview & Publish
                            </h2>

                            {/* Book Preview */}
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Cover Preview */}
                                <div>
                                    {metadata.coverImage ? (
                                        <img
                                            src={metadata.coverImage}
                                            alt="Book cover"
                                            className="w-full rounded-lg shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                            <span className="text-6xl">📚</span>
                                        </div>
                                    )}
                                </div>

                                {/* Book Details */}
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {metadata.title}
                                        </h3>
                                        <p className="text-lg text-gray-600 dark:text-gray-400">
                                            by {metadata.author}
                                        </p>
                                    </div>

                                    <div className="flex gap-4 text-sm">
                                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                                            {metadata.genre}
                                        </span>
                                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                            {chapters.length} Chapters
                                        </span>
                                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                                            {Math.ceil(chapters.reduce((sum, c) => sum + c.duration, 0) / 60)} min total
                                        </span>
                                    </div>

                                    <p className="text-gray-700 dark:text-gray-300">
                                        {metadata.description}
                                    </p>

                                    {/* Chapter List */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            Chapters
                                        </h4>
                                        <div className="space-y-2">
                                            {chapters.map((chapter, index) => (
                                                <div
                                                    key={chapter.id}
                                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                                                            {String(index + 1).padStart(2, '0')}
                                                        </span>
                                                        <span className="text-gray-900 dark:text-white">
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
                                </div>
                            </div>

                            {/* Publish Button */}
                            <div className="flex justify-center pt-8">
                                <button
                                    onClick={handlePublish}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-lg font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                >
                                    🚀 Publish to Marketplace
                                </button>
                            </div>

                            {/* Revenue Info */}
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div className="text-sm text-green-800 dark:text-green-200">
                                        <p className="font-medium mb-1">You'll earn 75% of all revenue!</p>
                                        <p>Both from subscribers and pay-per-use listeners. Track your earnings in the Creator Dashboard.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        ← Previous
                    </button>

                    {currentStep < steps.length - 1 && (
                        <button
                            onClick={() => setCurrentStep(currentStep + 1)}
                            disabled={!canNavigateToStep(currentStep + 1)}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
