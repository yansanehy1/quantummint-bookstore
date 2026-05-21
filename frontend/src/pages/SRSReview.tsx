import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import {
    Zap,
    ArrowLeft,
    CheckCircle,
    XCircle,
    RotateCcw,
    BookOpen,
    Trophy,
    ChevronRight,
    HelpCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { toast } from 'sonner';

export default function SRSReview() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [stats, setStats] = useState({ correct: 0, total: 0 });

    const { data: dueNotes, isLoading } = useQuery({
        queryKey: ['learner', 'srs', 'due'],
        queryFn: () => api.learner.getDueNotes()
    });

    const reviewMutation = useMutation({
        mutationFn: ({ id, rating }: { id: string; rating: number }) => 
            api.learner.reviewNote(id, rating),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['learner', 'srs', 'due'] });
        }
    });

    const handleRating = (rating: number) => {
        if (!dueNotes || currentIndex >= dueNotes.length) return;

        const currentNote = dueNotes[currentIndex];
        reviewMutation.mutate({ id: currentNote.id, rating });

        if (rating >= 3) {
            setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
        }
        setStats(prev => ({ ...prev, total: prev.total + 1 }));

        if (currentIndex < dueNotes.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setShowAnswer(false);
        } else {
            setIsFinished(true);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quantum-600"></div>
            </div>
        );
    }

    if (!dueNotes || dueNotes.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-12 text-center bg-white rounded-[3rem] shadow-2xl border-none">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">All Caught Up!</h2>
                    <p className="text-slate-500 font-bold mb-8">You've reviewed all your due notes for today. Great job staying on track!</p>
                    <Button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-quantum-600 hover:bg-quantum-700 text-white shadow-xl shadow-quantum-600/20">
                        Back to Dashboard
                    </Button>
                </Card>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-12 text-center bg-white rounded-[3rem] shadow-2xl border-none">
                    <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 text-amber-500">
                        <Trophy size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Session Complete!</h2>
                    <p className="text-slate-500 font-bold mb-2">You reviewed {stats.total} concepts.</p>
                    <p className="text-xs font-black text-quantum-600 uppercase tracking-widest mb-10">Accuracy: {Math.round((stats.correct / stats.total) * 100)}%</p>
                    <Button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-quantum-600 hover:bg-quantum-700 text-white shadow-xl shadow-quantum-600/20">
                        Finish Session
                    </Button>
                </Card>
            </div>
        );
    }

    const currentNote = dueNotes[currentIndex];

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                            <ArrowLeft size={16} />
                        </Button>
                        <div>
                            <p className="text-[10px] font-black text-quantum-600 uppercase tracking-widest">Active Review</p>
                            <h1 className="text-xl font-black text-slate-900">Spaced Repetition</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            {currentIndex + 1} / {dueNotes.length}
                        </span>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-quantum-600 transition-all duration-300" 
                                style={{ width: `${((currentIndex + 1) / dueNotes.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Flashcard */}
                <div className="perspective-1000 min-h-[400px]">
                    <Card className={`w-full h-full p-12 flex flex-col items-center justify-center text-center transition-all duration-500 transform ${showAnswer ? 'rotate-y-180' : ''}`}>
                        {!showAnswer ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="p-3 bg-quantum-50 text-quantum-600 rounded-2xl inline-block mb-6">
                                    <HelpCircle size={32} />
                                </div>
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Recall the concept:</h2>
                                <p className="text-2xl font-black text-slate-900 leading-tight">
                                    {currentNote.highlightText || "What was the content of this note?"}
                                </p>
                                <div className="mt-12">
                                    <Button 
                                        onClick={() => setShowAnswer(true)}
                                        className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-2xl shadow-xl"
                                    >
                                        Reveal Answer
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in zoom-in-95 duration-500">
                                <div className="p-3 bg-green-50 text-green-600 rounded-2xl inline-block mb-6">
                                    <CheckCircle size={32} />
                                </div>
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Your Note:</h2>
                                <p className="text-xl font-bold text-slate-700 italic mb-8">
                                    "{currentNote.content}"
                                </p>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 mb-10">
                                    <BookOpen size={16} className="text-slate-400" />
                                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                        Source: {currentNote.Book?.title} • Page {currentNote.pageId}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <button 
                                        onClick={() => handleRating(1)}
                                        className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-all border border-transparent hover:border-red-100"
                                    >
                                        <RotateCcw size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Again</span>
                                    </button>
                                    <button 
                                        onClick={() => handleRating(2)}
                                        className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-orange-50 text-orange-600 transition-all border border-transparent hover:border-orange-100"
                                    >
                                        <XCircle size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Hard</span>
                                    </button>
                                    <button 
                                        onClick={() => handleRating(3)}
                                        className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-blue-50 text-blue-600 transition-all border border-transparent hover:border-blue-100"
                                    >
                                        <CheckCircle size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Good</span>
                                    </button>
                                    <button 
                                        onClick={() => handleRating(4)}
                                        className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-green-50 text-green-600 transition-all border border-transparent hover:border-green-100"
                                    >
                                        <Zap size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Easy</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
