import React, { useState } from 'react';
import { X, CheckCircle, XCircle, ChevronRight, Award, RotateCcw, HelpCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface QuizModalProps {
    quiz: {
        id: string;
        questions: Question[];
    };
    onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    const handleOptionSelect = (index: number) => {
        if (isSubmitted) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;
        setIsSubmitted(true);
        if (selectedOption === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            setShowResults(true);
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
        }
    };

    const handleReset = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsSubmitted(false);
        setScore(0);
        setShowResults(false);
    };

    if (showResults) {
        const percentage = Math.round((score / quiz.questions.length) * 100);
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                <Card className="w-full max-w-lg p-8 bg-white rounded-[2.5rem] shadow-2xl text-center">
                    <div className="w-20 h-20 bg-quantum-50 text-quantum-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Quiz Complete!</h2>
                    <p className="text-slate-500 font-bold mb-8">You've mastered this chapter's key concepts.</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-6 bg-slate-50 rounded-3xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score</p>
                            <p className="text-3xl font-black text-slate-900">{score} / {quiz.questions.length}</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Percentage</p>
                            <p className={`text-3xl font-black ${percentage >= 70 ? 'text-green-600' : 'text-amber-600'}`}>{percentage}%</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={handleReset}>
                            <RotateCcw size={18} className="mr-2" /> Retry
                        </Button>
                        <Button variant="primary" className="flex-1 bg-quantum-600" onClick={onClose}>
                            Finish Review
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <Card className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-quantum-600 p-2 rounded-xl text-white">
                            <HelpCircle size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 uppercase tracking-tight">Knowledge Check</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-100">
                    <div 
                        className="h-full bg-quantum-500 transition-all duration-500" 
                        style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                    />
                </div>

                {/* Question Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <h4 className="text-xl font-bold text-slate-900 leading-relaxed">
                        {currentQuestion.question}
                    </h4>

                    <div className="grid gap-3">
                        {currentQuestion.options.map((option, index) => {
                            let statusClasses = "border-slate-200 hover:border-quantum-300 hover:bg-slate-50";
                            if (isSubmitted) {
                                if (index === currentQuestion.correctAnswer) {
                                    statusClasses = "border-green-500 bg-green-50 text-green-900";
                                } else if (selectedOption === index) {
                                    statusClasses = "border-red-500 bg-red-50 text-red-900";
                                } else {
                                    statusClasses = "border-slate-100 opacity-50";
                                }
                            } else if (selectedOption === index) {
                                statusClasses = "border-quantum-600 bg-quantum-50 text-quantum-900";
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(index)}
                                    disabled={isSubmitted}
                                    className={`w-full text-left p-5 rounded-2xl border-2 font-bold transition-all flex justify-between items-center ${statusClasses}`}
                                >
                                    <span>{option}</span>
                                    {isSubmitted && index === currentQuestion.correctAnswer && <CheckCircle size={20} className="text-green-600 shrink-0" />}
                                    {isSubmitted && selectedOption === index && index !== currentQuestion.correctAnswer && <XCircle size={20} className="text-red-600 shrink-0" />}
                                </button>
                            );
                        })}
                    </div>

                    {isSubmitted && (
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Explanation</p>
                            <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                {currentQuestion.explanation}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-white">
                    {!isSubmitted ? (
                        <Button 
                            className="w-full h-14 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl" 
                            disabled={selectedOption === null}
                            onClick={handleSubmit}
                        >
                            Submit Answer
                        </Button>
                    ) : (
                        <Button 
                            className="w-full h-14 bg-quantum-600 text-white hover:bg-quantum-700 rounded-2xl" 
                            onClick={handleNext}
                        >
                            {isLastQuestion ? 'View Results' : 'Next Question'} <ChevronRight size={20} className="ml-2" />
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};
