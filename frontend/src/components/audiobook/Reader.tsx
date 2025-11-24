import React, { useState, useEffect, useRef } from 'react';
import { Book, SegmentType } from '../../types';
import MathRenderer from '../MathRenderer';
import { Play, Pause, SkipBack, SkipForward, X, Volume2 } from 'lucide-react';

interface ReaderProps {
    book: Book;
    onClose: () => void;
}

const Reader: React.FC<ReaderProps> = ({ book, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Speech Synthesis (Fallback)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis;
        }

        // Create hidden audio element for file playback
        audioPlayerRef.current = new Audio();
        audioPlayerRef.current.onended = handleSegmentEnd;

        return () => {
            if (synthRef.current) synthRef.current.cancel();
            if (audioPlayerRef.current) {
                audioPlayerRef.current.pause();
                audioPlayerRef.current.src = '';
            }
        };
    }, []);

    const handleSegmentEnd = () => {
        if (currentIndex < book.content.length - 1) {
            setCurrentIndex(prev => prev + 1);
            // Small delay to prevent race conditions
            setTimeout(() => speakSegment(currentIndex + 1), 50);
        } else {
            setIsPlaying(false);
        }
    };

    const speakSegment = (index: number) => {
        if (!book.content[index]) return;

        // Stop any current playback
        if (synthRef.current) synthRef.current.cancel();
        if (audioPlayerRef.current) audioPlayerRef.current.pause();

        const segment = book.content[index];

        // 1. Priority: Play pre-generated Audio URL (Gemini TTS)
        if (segment.audioUrl && audioPlayerRef.current) {
            audioPlayerRef.current.src = segment.audioUrl;
            audioPlayerRef.current.play().catch(e => {
                console.error("Audio playback failed, falling back to synth", e);
                speakWithSynth(segment.text);
            });
            setIsPlaying(true);
            return;
        }

        // 2. Fallback: Browser Speech Synthesis
        speakWithSynth(segment.text);
    };

    const speakWithSynth = (text: string) => {
        if (!synthRef.current) return;

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang.startsWith('en'));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 0.9;
        utterance.onend = handleSegmentEnd;

        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (isPlaying) {
            if (synthRef.current) synthRef.current.cancel();
            if (audioPlayerRef.current) audioPlayerRef.current.pause();
            setIsPlaying(false);
        } else {
            speakSegment(currentIndex);
        }
    };

    const handleSkip = (direction: 'prev' | 'next') => {
        const newIndex = direction === 'next'
            ? Math.min(book.content.length - 1, currentIndex + 1)
            : Math.max(0, currentIndex - 1);

        setCurrentIndex(newIndex);
        if (isPlaying) {
            speakSegment(newIndex);
        }
    };

    const handleSegmentClick = (index: number) => {
        setCurrentIndex(index);
        speakSegment(index);
    };

    const currentSegment = book.content[currentIndex];

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col md:flex-row h-screen w-screen overflow-hidden">
            {/* Close button */}
            <div className="absolute top-4 left-4 z-50">
                <button onClick={onClose} className="bg-white/80 backdrop-blur p-2 rounded-full shadow-md hover:bg-slate-100 transition-transform hover:scale-110">
                    <X className="w-6 h-6 text-slate-800" />
                </button>
            </div>

            {/* LEFT PANEL: Text Content */}
            <div className="flex-1 h-1/2 md:h-full overflow-y-auto bg-white p-6 md:p-12 relative border-r border-slate-100 scroll-smooth">
                <div className="max-w-2xl mx-auto pt-12 md:pt-0 pb-32">
                    <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">{book.title}</h1>
                    <p className="text-slate-500 mb-8 font-sans uppercase tracking-wide text-xs">By {book.author}</p>

                    <div className="space-y-6">
                        {book.content.map((segment, idx) => (
                            <div
                                key={segment.id}
                                onClick={() => handleSegmentClick(idx)}
                                className={`
                  text-lg md:text-xl leading-relaxed font-serif transition-all duration-300 cursor-pointer p-3 rounded-lg border-l-4
                  ${idx === currentIndex
                                        ? 'bg-indigo-50 text-slate-900 border-indigo-500 shadow-sm'
                                        : 'text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-200'}
                `}
                            >
                                {segment.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Immersive Stage */}
            <div className="flex-1 h-1/2 md:h-full bg-slate-900 text-white flex flex-col relative overflow-hidden">
                {/* Visual Content */}
                <div className="flex-1 flex items-center justify-center p-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>

                    <div className="relative z-10 w-full max-w-lg text-center transition-all duration-500 transform">

                        {/* IMAGE */}
                        {currentSegment?.type === SegmentType.IMAGE && (
                            <div className="animate-fade-in space-y-4">
                                <img
                                    src={currentSegment.visualContent}
                                    alt={currentSegment.visualDescription}
                                    className="rounded-lg shadow-2xl border-4 border-slate-700/50 mx-auto max-h-[50vh] object-cover"
                                />
                                <p className="text-slate-400 text-sm font-medium tracking-wide bg-slate-800/50 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
                                    {currentSegment.visualDescription}
                                </p>
                            </div>
                        )}

                        {/* FORMULA */}
                        {currentSegment?.type === SegmentType.FORMULA && (
                            <div className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl animate-scale-in">
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-4">Core Concept</p>
                                <MathRenderer formula={currentSegment.visualContent || ''} />
                                <p className="text-slate-600 mt-4 italic">{currentSegment.visualDescription}</p>
                            </div>
                        )}

                        {/* AUDIO ONLY/TEXT */}
                        {(currentSegment?.type === SegmentType.TEXT || currentSegment?.type === SegmentType.STEP) && (
                            <div className="flex flex-col items-center justify-center h-full space-y-6">
                                <div className={`w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 ${isPlaying ? 'animate-pulse ring-4 ring-indigo-500/20' : ''}`}>
                                    <Volume2 className="w-10 h-10 text-indigo-400" />
                                </div>
                                <p className="text-slate-400 max-w-md text-lg font-light animate-fade-in">
                                    {isPlaying ? "Listening..." : "Paused"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Player Controls */}
                <div className="h-24 bg-slate-800 border-t border-slate-700 flex items-center px-8 justify-between relative z-20">
                    <div className="flex flex-col w-1/3">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Now Playing</span>
                        <span className="text-white font-medium truncate block">{currentSegment?.visualDescription || "Audiobook Segment"}</span>
                    </div>

                    <div className="flex items-center gap-6 justify-center w-1/3">
                        <button onClick={() => handleSkip('prev')} className="text-slate-400 hover:text-white transition-colors">
                            <SkipBack className="w-6 h-6" />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-14 h-14 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:scale-105"
                        >
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current pl-1" />}
                        </button>

                        <button onClick={() => handleSkip('next')} className="text-slate-400 hover:text-white transition-colors">
                            <SkipForward className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="hidden md:block w-1/3 text-right">
                        <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden mb-1">
                            <div
                                className="bg-indigo-500 h-full transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / book.content.length) * 100}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-slate-500">{currentIndex + 1} / {book.content.length}</span>
                    </div>
                </div>
            </div>

            <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
        </div>
    );
};

export default Reader;
