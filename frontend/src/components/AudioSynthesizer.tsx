import * as React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Chapter, WordTimestamp } from '../types';
import ttsService, { Voice } from '../services/ttsService';

interface AudioSynthesizerProps {
    chapters: Chapter[];
    onChaptersChange: (chapters: Chapter[]) => void;
}

export function AudioSynthesizer({ chapters, onChaptersChange }: AudioSynthesizerProps) {
    const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);
    
    // Load preferences from localStorage
    const [selectedVoice, setSelectedVoice] = useState(() => localStorage.getItem('tts_voice') || '');
    const [speed, setSpeed] = useState(() => parseFloat(localStorage.getItem('tts_speed') || '1.0'));
    const [pitch, setPitch] = useState(() => parseInt(localStorage.getItem('tts_pitch') || '0'));
    
    const [synthesizing, setSynthesizing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentlySynthesizing, setCurrentlySynthesizing] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [wordTimestamps, setWordTimestamps] = useState<Record<string, WordTimestamp[]>>({});
    const [highlightedWordIndex, setHighlightedWordIndex] = useState<Record<string, number>>({});

    const abortControllerRef = useRef<AbortController | null>(null);
    const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

    const isBrowserSupported = useMemo(() => ttsService.isBrowserSupported(), []);

    // Cleanup audio refs on unmount
    useEffect(() => {
        return () => {
            Object.values(audioRefs.current).forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.src = ''; 
                }
            });
            audioRefs.current = {};
            abortControllerRef.current?.abort();
        };
    }, []);

    // Cleanup refs for removed chapters
    useEffect(() => {
        const chapterIds = new Set(chapters.map(c => c.id));
        Object.keys(audioRefs.current).forEach(id => {
            if (!chapterIds.has(id) && audioRefs.current[id]) {
                audioRefs.current[id]!.pause();
                delete audioRefs.current[id];
            }
        });
    }, [chapters]);

    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!document.activeElement?.closest('[aria-label="Audio Synthesis Controls"]')) return;
            
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    const activeAudio = Object.values(audioRefs.current).find(a => a && !a.paused);
                    if (activeAudio) activeAudio.paused ? activeAudio.play() : activeAudio.pause();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    Object.values(audioRefs.current).forEach(a => {
                        if (a && !a.paused) a.currentTime = Math.min(a.duration, a.currentTime + 15);
                    });
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    Object.values(audioRefs.current).forEach(a => {
                        if (a && !a.paused) a.currentTime = Math.max(0, a.currentTime - 15);
                    });
                    break;
                case 'Escape':
                    e.preventDefault();
                    Object.values(audioRefs.current).forEach(a => {
                        if (a) { a.pause(); a.currentTime = 0; }
                    });
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Media Session API Integration
    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => {
                const activeAudio = Object.values(audioRefs.current).find(a => a && !a.paused);
                activeAudio?.play();
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                const activeAudio = Object.values(audioRefs.current).find(a => a && !a.paused);
                activeAudio?.pause();
            });
            navigator.mediaSession.setActionHandler('stop', () => {
                Object.values(audioRefs.current).forEach(a => {
                    if (a) {
                        a.pause();
                        a.currentTime = 0;
                    }
                });
            });
        }
    }, []);

    // Sync highlights for playing audio
    const handleTimeUpdate = (chapterId: string) => {
        const audio = audioRefs.current[chapterId];
        const timestamps = wordTimestamps[chapterId];
        if (!audio || !timestamps) return;

        const currentTimeMs = audio.currentTime * 1000;
        const index = timestamps.findIndex(w => 
            currentTimeMs >= w.startMs && currentTimeMs < w.endMs
        );
        
        if (index !== highlightedWordIndex[chapterId]) {
            setHighlightedWordIndex(prev => ({ ...prev, [chapterId]: index }));
        }
    };

    const handleAudioPlay = (chapter: Chapter) => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: chapter.title,
                artist: 'QuantumMint Bookstore',
                album: 'Chapter Preview',
                artwork: [
                    { src: '/logo.png', sizes: '512x512', type: 'image/png' }
                ]
            });
        }
    };

    // Save preferences to localStorage
    useEffect(() => {
        if (selectedVoice) localStorage.setItem('tts_voice', selectedVoice);
        localStorage.setItem('tts_speed', speed.toString());
        localStorage.setItem('tts_pitch', pitch.toString());
    }, [selectedVoice, speed, pitch]);

    useEffect(() => {
        const fetchVoices = async () => {
            try {
                const voices = await ttsService.getVoices();
                setAvailableVoices(voices);
                if (voices.length > 0 && !selectedVoice) {
                    setSelectedVoice(voices[0].id);
                }
            } catch (err) {
                console.error('Failed to load voices:', err);
                setError('Failed to load available voices.');
            }
        };
        fetchVoices();
    }, []);

    const synthesizeChapter = async (chapter: Chapter) => {
        setCurrentlySynthesizing(chapter.id);
        setError(null);

        // Cancel previous if any
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        try {
            const result = await ttsService.synthesizeWithTimestamps(chapter.text, {
                voice: selectedVoice,
                speed,
                pitch,
            }, abortControllerRef.current.signal);

            // Store timestamps
            if (result.words) {
                setWordTimestamps(prev => ({ ...prev, [chapter.id]: result.words }));
            }

            // Update chapter with audio URL and duration
            const updatedChapters = chapters.map((c) =>
                c.id === chapter.id
                    ? { ...c, audioUrl: result.audioUrl, duration: result.durationMs / 1000 }
                    : c
            );
            onChaptersChange(updatedChapters);
        } catch (err: any) {
            if (err.name === 'AbortError') return;
            console.error('TTS Error:', err);
            setError(`Failed to synthesize audio for "${chapter.title}": ${err.message || 'Unknown error'}`);
        } finally {
            setCurrentlySynthesizing(null);
        }
    };

    const synthesizeAll = async () => {
        setSynthesizing(true);
        setProgress(0);
        setError(null);

        const chaptersToSynthesize = chapters.filter(c => !c.audioUrl);
        if (chaptersToSynthesize.length === 0) {
            setSynthesizing(false);
            return;
        }

        try {
            const results = await Promise.allSettled(
                chaptersToSynthesize.map((chapter) => 
                    ttsService.synthesizeChapter(chapter.text, { voice: selectedVoice, speed, pitch })
                        .then(result => ({ id: chapter.id, ...result }))
                )
            );

            // Merge successful results
            const updatedChapters = chapters.map(c => {
                const result = results.find(r => r.status === 'fulfilled' && r.value.id === c.id);
                if (result?.status === 'fulfilled') {
                    return { ...c, audioUrl: result.value.audioUrl, duration: result.value.durationMs / 1000 };
                }
                return c;
            });
            onChaptersChange(updatedChapters);

            // Report partial failures
            const failures = results.filter(r => r.status === 'rejected');
            if (failures.length > 0) {
                setError(`${failures.length} chapter(s) failed to synthesize. Check console for details.`);
            }
        } catch (err: any) {
            console.error('Batch TTS Error:', err);
            setError(`Unexpected error: ${err.message || 'Unknown error'}`);
        } finally {
            setSynthesizing(false);
            setProgress(0);
        }
    };

    const cancelSynthesis = () => {
        abortControllerRef.current?.abort();
        setSynthesizing(false);
        setCurrentlySynthesizing(null);
    };

    const chaptersWithAudio = chapters.filter((c) => c.audioUrl).length;
    const totalChapters = chapters.length;

    // Cost estimation - memoized text extraction
    const unsynthesizedText = useMemo(() => 
        chapters
            .filter(c => !c.audioUrl && c.text)
            .map(c => (c.text || '').replace(/<[^>]*>/g, ''))
            .join(' ')
    , [chapters]);

    const totalChars = useMemo(() => unsynthesizedText.length, [unsynthesizedText]);
    const estimatedCost = useMemo(() => ttsService.calculateCost(unsynthesizedText), [unsynthesizedText]);

    return (
        <div className="space-y-6" role="region" aria-label="Audio Synthesis Controls">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Audio Synthesis</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Convert your book chapters into high-quality audio.
                    </p>
                    <div className="text-xs text-gray-400 mt-2">
                        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">Space</kbd> Play/Pause • 
                        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 ml-1">←</kbd> 
                        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 ml-0.5">→</kbd> Skip • 
                        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 ml-1">Esc</kbd> Stop
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Cost</div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${estimatedCost.toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-400">{totalChars.toLocaleString()} characters remaining</div>
                </div>
            </div>

            {!isBrowserSupported && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-amber-800 dark:text-amber-200 text-sm">
                    <strong>Note:</strong> Your browser does not natively support speech synthesis. While we use a server-side engine, some advanced interactive features might be limited.
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200 text-sm flex justify-between items-center" id="tts-error">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="text-red-600 dark:text-red-400 font-bold ml-2" aria-label="Dismiss error">×</button>
                </div>
            )}

            {/* Voice Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Voice Settings
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Voice Selection */}
                    <div>
                        <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Voice
                        </label>
                        <select
                            id="voice-select"
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                            aria-label="Select synthesis voice"
                            aria-describedby={error ? 'tts-error' : undefined}
                        >
                            {availableVoices.map((voice) => (
                                <option key={voice.id} value={voice.id}>
                                    {voice.name} ({voice.language})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Speed */}
                    <div>
                        <label htmlFor="speed-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Speed: {speed.toFixed(1)}x
                        </label>
                        <input
                            id="speed-range"
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            className="w-full accent-purple-600 cursor-pointer"
                            aria-label={`Playback speed: ${speed.toFixed(1)}x`}
                        />
                    </div>

                    {/* Pitch */}
                    <div>
                        <label htmlFor="pitch-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pitch: {pitch > 0 ? '+' : ''}{pitch}
                        </label>
                        <input
                            id="pitch-range"
                            type="range"
                            min="-5"
                            max="5"
                            step="1"
                            value={pitch}
                            onChange={(e) => setPitch(parseInt(e.target.value))}
                            className="w-full accent-purple-600 cursor-pointer"
                            aria-label={`Voice pitch: ${pitch > 0 ? '+' : ''}${pitch}`}
                        />
                    </div>
                </div>
            </div>

            {/* Chapter List with Synthesis Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Chapters ({chaptersWithAudio}/{totalChapters} synthesized)
                    </h3>
                    <div className="flex gap-2">
                        {synthesizing && (
                            <button
                                onClick={cancelSynthesis}
                                className="text-red-600 hover:text-red-700 px-4 py-2 text-sm font-medium"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={synthesizeAll}
                            disabled={synthesizing || totalChapters === 0}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            aria-busy={synthesizing}
                        >
                            {synthesizing ? 'Synthesizing...' : 'Synthesize All'}
                        </button>
                    </div>
                </div>

                {synthesizing && (
                    <div className="mb-6" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-purple-600 h-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Batch progress: {Math.round(progress)}%
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-2" aria-live="polite">
                    {totalChapters === 0 ? (
                        <p className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
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
                                    <div className="text-sm text-gray-500">
                                        {(chapter.text || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words
                                        {chapter.duration > 0 && ` · ${Math.ceil(chapter.duration / 60)} min audio`}
                                    </div>
                                    
                                    {/* Word Highlighting Preview */}
                                    {wordTimestamps[chapter.id] && (
                                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded text-xs line-clamp-2">
                                            {wordTimestamps[chapter.id].map((w, i) => (
                                                <span 
                                                    key={i} 
                                                    className={`mr-1 transition-colors duration-200 ${
                                                        highlightedWordIndex[chapter.id] === i 
                                                            ? 'bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-100 font-bold' 
                                                            : ''
                                                    }`}
                                                >
                                                    {w.word}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    {chapter.audioUrl ? (
                                        <>
                                            <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                                                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Ready
                                            </span>
                                            <audio 
                                                ref={el => audioRefs.current[chapter.id] = el}
                                                src={chapter.audioUrl} 
                                                controls 
                                                className="h-8 w-48" 
                                                aria-label={`Preview audio for ${chapter.title}`} 
                                                onTimeUpdate={() => handleTimeUpdate(chapter.id)}
                                                onPlay={() => handleAudioPlay(chapter)}
                                            />
                                        </>
                                    ) : currentlySynthesizing === chapter.id ? (
                                        <span className="text-purple-600 dark:text-purple-400 text-sm flex items-center font-medium" aria-live="assertive">
                                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => synthesizeChapter(chapter)}
                                            disabled={synthesizing}
                                            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 text-sm font-medium disabled:opacity-50 focus:outline-none focus:underline"
                                            aria-label={`Synthesize audio for ${chapter.title}`}
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
        </div>
    );
}
