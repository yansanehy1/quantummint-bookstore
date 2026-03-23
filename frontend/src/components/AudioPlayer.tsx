import * as React from 'react';
const { useState, useRef, useEffect } = React;
import { Book, Chapter } from '../types';
import { UsageTracker } from './UsageTracker';
import { SyncEngine } from '../sync/SyncEngine';

interface AudioPlayerProps {
    book: Book;
    isSubscribed?: boolean;
}

export function AudioPlayer({ book, isSubscribed = false }: AudioPlayerProps) {
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [volume, setVolume] = useState(1.0);

    const audioRef = useRef<HTMLAudioElement>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const currentChapter = book.chapters[currentChapterIndex];

    // Usage tracking
    const usageTracker = UsageTracker({
        book,
        isSubscribed,
        onSessionEnd: (session) => {
            console.log('Session ended:', session);
            // Show summary modal or notification
        },
    });

    // Update progress while playing
    useEffect(() => {
        if (isPlaying) {
            progressIntervalRef.current = setInterval(() => {
                if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                }
            }, 100);
        } else {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        }

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [isPlaying]);

    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            usageTracker.stopTracking();
        } else {
            audioRef.current.play();
            usageTracker.startTracking();
        }
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        if (currentChapterIndex < book.chapters.length - 1) {
            setCurrentChapterIndex(currentChapterIndex + 1);
            setCurrentTime(0);
        }
    };

    const handlePrevious = () => {
        if (currentChapterIndex > 0) {
            setCurrentChapterIndex(currentChapterIndex - 1);
            setCurrentTime(0);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        handleNext();
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl overflow-hidden">
            {/* Book Info Header */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-4">
                    {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-20 h-20 rounded-lg shadow-lg" />
                    ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-3xl">
                            📚
                        </div>
                    )}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white">{book.title}</h2>
                        <p className="text-gray-400">by {book.author}</p>
                        <p className="text-sm text-purple-400">
                            Chapter {currentChapterIndex + 1} of {book.chapters.length}: {currentChapter.title}
                        </p>
                    </div>
                    {!isSubscribed && (
                        <div className="text-right">
                            <div className="text-sm text-gray-400">Session Cost</div>
                            <div className="text-2xl font-bold text-green-400">
                                Le {usageTracker.displayCost}
                            </div>
                            <div className="text-xs text-gray-500">
                                ${(usageTracker.sessionCost * 0.017).toFixed(4)} | {usageTracker.formatTime(usageTracker.listeningTime)}
                            </div>
                        </div>
                    )}
                    {isSubscribed && (
                        <div className="px-4 py-2 bg-purple-600 rounded-full text-white font-semibold">
                            ♾️ Unlimited
                        </div>
                    )}
                </div>
            </div>

            {/* Audio Element */}
            <audio
                ref={audioRef}
                src={currentChapter.audioUrl || ''}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            {/* Main Controls */}
            <div className="p-6">
                {/* Progress Bar */}
                <div className="mb-4">
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`,
                        }}
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Play Controls */}
                <div className="flex items-center justify-center gap-6 mb-6">
                    <button
                        onClick={handlePrevious}
                        disabled={currentChapterIndex === 0}
                        className="text-white hover:text-purple-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                        title="Previous Chapter"
                    >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                        </svg>
                    </button>

                    <button
                        onClick={togglePlayPause}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 transition-all hover:scale-110"
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? (
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={currentChapterIndex === book.chapters.length - 1}
                        className="text-white hover:text-purple-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                        title="Next Chapter"
                    >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                        </svg>
                    </button>
                </div>

                {/* Additional Controls */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Speed Control */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Speed: {playbackSpeed.toFixed(1)}x
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={playbackSpeed}
                            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Volume Control */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Volume: {Math.round(volume * 100)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Chapter List */}
            <div className="p-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Chapters</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                    {book.chapters.map((chapter, index) => (
                        <button
                            key={chapter.id}
                            onClick={() => {
                                setCurrentChapterIndex(index);
                                setCurrentTime(0);
                            }}
                            className={`w-full text-left px-3 py-2 rounded transition-colors ${index === currentChapterIndex
                                ? 'bg-purple-600 text-white'
                                : 'hover:bg-gray-700 text-gray-300'
                                }`}
                        >
                            <span className="font-mono text-sm mr-2">{String(index + 1).padStart(2, '0')}</span>
                            {chapter.title}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
