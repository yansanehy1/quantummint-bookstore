import * as React from 'react';
import { useState, useEffect } from 'react';
import { TTS_SERVICE_URL } from '../utils/api';
import { Chapter } from '../types';

interface AudioSynthesizerProps {
    chapters: Chapter[];
    onChaptersChange: (chapters: Chapter[]) => void;
}

const voices = [
    { id: 'alloy', name: 'Alloy (Neutral)' },
    { id: 'echo', name: 'Echo (Male)' },
    { id: 'fable', name: 'Fable (British)' },
    { id: 'onyx', name: 'Onyx (Deep)' },
    { id: 'nova', name: 'Nova (Female)' },
    { id: 'shimmer', name: 'Shimmer (Soft)' },
];

export function AudioSynthesizer({ chapters, onChaptersChange }: AudioSynthesizerProps) {
    const [selectedVoice, setSelectedVoice] = useState(voices[0].id);
    const [speed, setSpeed] = useState(1.0);
    const [pitch, setPitch] = useState(0);
    const [synthesizing, setSynthesizing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentlySynthesizing, setCurrentlySynthesizing] = useState<string | null>(null);

    const synthesizeChapter = async (chapter: Chapter) => {
        setCurrentlySynthesizing(chapter.id);

        try {
            // Simulate TTS API call
            const response = await fetch(`${TTS_SERVICE_URL}/synthesize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: chapter.text.replace(/<[^>]*>/g, ''), // Strip HTML
                    voice: selectedVoice,
                    speed,
                    pitch,
                }),
            });

            if (!response.ok) {
                throw new Error('TTS synthesis failed');
            }

            const data = await response.json();

            // Update chapter with audio URL and duration
            const updatedChapters = chapters.map((c) =>
                c.id === chapter.id
                    ? { ...c, audioUrl: data.audioUrl, duration: data.duration }
                    : c
            );
            onChaptersChange(updatedChapters);
        } catch (error) {
            console.error('TTS Error:', error);
            alert(`Failed to synthesize audio for "${chapter.title}". Make sure the TTS service is running.`);
        } finally {
            setCurrentlySynthesizing(null);
        }
    };

    const synthesizeAll = async () => {
        setSynthesizing(true);
        setProgress(0);

        for (let i = 0; i < chapters.length; i++) {
            await synthesizeChapter(chapters[i]);
            setProgress(((i + 1) / chapters.length) * 100);
        }

        setSynthesizing(false);
        setProgress(0);
    };

    const chaptersWithAudio = chapters.filter((c) => c.audioUrl).length;
    const totalChapters = chapters.length;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Audio Synthesis</h2>

            {/* Voice Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Voice Settings
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                    {/* Voice Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Voice
                        </label>
                        <select
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        >
                            {voices.map((voice) => (
                                <option key={voice.id} value={voice.id}>
                                    {voice.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Speed */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Speed: {speed.toFixed(1)}x
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    {/* Pitch */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pitch: {pitch > 0 ? '+' : ''}{pitch}
                        </label>
                        <input
                            type="range"
                            min="-5"
                            max="5"
                            step="1"
                            value={pitch}
                            onChange={(e) => setPitch(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Chapter List with Synthesis Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Chapters ({chaptersWithAudio}/{totalChapters} synthesized)
                    </h3>
                    <button
                        onClick={synthesizeAll}
                        disabled={synthesizing || totalChapters === 0}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {synthesizing ? 'Synthesizing...' : 'Synthesize All'}
                    </button>
                </div>

                {synthesizing && (
                    <div className="mb-4">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-purple-600 h-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Progress: {Math.round(progress)}%
                        </p>
                    </div>
                )}

                <div className="space-y-2">
                    {totalChapters === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No chapters to synthesize. Add some chapters first.
                        </p>
                    ) : (
                        chapters.map((chapter) => (
                            <div
                                key={chapter.id}
                                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                        {chapter.title}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {chapter.text.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words
                                        {chapter.duration > 0 && ` · ${Math.ceil(chapter.duration / 60)} min audio`}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    {chapter.audioUrl ? (
                                        <>
                                            <span className="flex items-center text-green-600 dark:text-green-400 text-sm">
                                                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Ready
                                            </span>
                                            <audio src={chapter.audioUrl} controls className="h-8" />
                                        </>
                                    ) : currentlySynthesizing === chapter.id ? (
                                        <span className="text-purple-600 dark:text-purple-400 text-sm flex items-center">
                                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Synthesizing...
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => synthesizeChapter(chapter)}
                                            disabled={synthesizing}
                                            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 text-sm font-medium disabled:opacity-50"
                                        >
                                            Synthesize
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-medium mb-1">Note:</p>
                        <p>Make sure the TTS service is running at <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{TTS_SERVICE_URL.replace('/tts', '')}</code>. You can synthesize chapters individually or all at once.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
