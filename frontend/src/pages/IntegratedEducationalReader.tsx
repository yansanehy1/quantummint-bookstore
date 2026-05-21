import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, 
  BookOpen, 
  Eye, 
  Calculator, 
  Clock, 
  Award, 
  Wallet, 
  StickyNote, 
  HelpCircle, 
  Sparkles, 
  X,
  Activity,
  Menu,
  MoreVertical,
  Download,
  CloudOff,
  Highlighter
} from 'lucide-react';
import { EnhancedMediaSyncPlayer } from '../components/EnhancedMediaSyncPlayer';
import { AchievementBadge } from '../components/AchievementBadge';
import { PayGOWallet } from '../components/PayGOWallet';
import { PayGOSessionManager } from '../components/PayGOSessionManager';
import { NotesSidebar } from '../components/NotesSidebar';
import { QuizModal } from '../components/QuizModal';
import { Formula } from '../components/ui/Formula';
import { AiTutor } from '../components/chat/AiTutor';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  pages: BookPage[];
  average_rating: number;
  total_purchases: number;
}

interface BookPage {
  id: number;
  page_number: number;
  title: string;
  content: string;
  audio_url: string;
  audio_duration: number;
}

interface MediaCue {
  id: number;
  timestamp_ms: number;
  cue_type: 'visual' | 'formula' | 'step' | 'highlight';
  content: string;
  metadata?: any;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  badge_icon_url: string;
  points_value: number;
  earned?: boolean;
  earned_at?: string;
}

export const IntegratedEducationalReader: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem('auth_token') || '';
  
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [cues, setCues] = useState<MediaCue[]>([]);
  const [currentCue, setCurrentCue] = useState<MediaCue | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWallet, setShowWallet] = useState(false);
  const [showSessionManager, setShowSessionManager] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number, y: number } | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pagesRead, setPagesRead] = useState<Set<number>>(new Set());
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDownloadPage = async () => {
    const pgData = book?.pages[currentPage];
    if (!pgData?.audio_url || !bookId) return;
    setIsDownloading(true);
    try {
      const cache = await caches.open(`book-${bookId}-offline`);
      
      // Cache Audio
      await cache.add(pgData.audio_url);
      
      // Cache Metadata/Text (as a JSON blob)
      const blob = new Blob([JSON.stringify({
        title: pgData.title,
        content: pgData.content,
        cues
      })], { type: 'application/json' });
      
      await cache.put(`/api/offline/book/${bookId}/page/${currentPage}`, new Response(blob));
      
      toast.success("Page available offline!");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download for offline use.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadFullBook = async () => {
    if (!book) return;
    setIsDownloading(true);
    try {
      const cache = await caches.open(`book-${bookId}-offline`);
      
      // Cache all pages audio and metadata
      const downloadPromises = book.pages.map(async (page, index) => {
        if (page.audio_url) {
          await cache.add(page.audio_url);
        }
        
        const blob = new Blob([JSON.stringify({
          title: page.title,
          content: page.content,
          // Note: In a real app, we'd need to fetch cues for each page too
        })], { type: 'application/json' });
        
        await cache.put(`/api/offline/book/${bookId}/page/${index}`, new Response(blob));
      });

      await Promise.all(downloadPromises);
      
      // Save full book structure
      await cache.put(`/api/offline/book/${bookId}/meta`, new Response(JSON.stringify(book)));
      
      toast.success("Full book downloaded for offline use!");
    } catch (err) {
      console.error("Full book download failed:", err);
      toast.error("Failed to download full book.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Fetch book data
  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId || !token) return;

      try {
        setLoading(true);
        
        // Attempt to load from network
        try {
          const response = await fetch(`${process.env.VITE_API_URL || 'http://localhost:5000'}/api/educational/books/${bookId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const bookData = await response.json();
            setBook(bookData);
            setCues(bookData.cues || []);
            
            // Save full book structure for offline metadata if needed
            const cache = await caches.open(`book-${bookId}-offline`);
            await cache.put(`/api/offline/book/${bookId}/meta`, new Response(JSON.stringify(bookData)));
            return;
          }
        } catch (netErr) {
          console.warn("Network fetch failed, trying cache...", netErr);
        }

        // Fallback to cache if network fails or is offline
        const cache = await caches.open(`book-${bookId}-offline`);
        const cachedMeta = await cache.match(`/api/offline/book/${bookId}/meta`);
        
        if (cachedMeta) {
          const bookData = await cachedMeta.json();
          setBook(bookData);
          setCues(bookData.cues || []);
          setIsOffline(true);
          toast.info("Working in Offline Mode");
        } else {
          throw new Error('Book not available offline. Please connect to the internet.');
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId, token]);

  // Fetch user achievements
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${process.env.VITE_API_URL || 'http://localhost:5000'}/api/educational/achievements`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAchievements(data.achievements || []);
        }
      } catch (err) {
        console.error('Failed to fetch achievements:', err);
      }
    };

    fetchAchievements();
  }, [token]);

  // Reading Session Tracking
  useEffect(() => {
    const startSession = async () => {
      if (!bookId || !token) return;
      try {
        const session = await api.learner.startSession(bookId);
        setSessionId(session.id);
      } catch (err) {
        console.error('Failed to start reading session:', err);
      }
    };
    startSession();
  }, [bookId, token]);

  useEffect(() => {
    if (sessionId) {
      const updateProgress = async () => {
        try {
          await api.learner.updateSession(sessionId, {
            pagesRead: Array.from(pagesRead),
            durationSeconds: 30
          });
        } catch (err) {
          console.error('Failed to update session progress:', err);
        }
      };
      const interval = setInterval(updateProgress, 30000);
      return () => clearInterval(interval);
    }
  }, [sessionId, pagesRead]);

  useEffect(() => {
    setPagesRead(prev => new Set(prev).add(currentPage));
  }, [currentPage]);

  const handleStartQuiz = async () => {
    if (!bookId) return;
    try {
      const data = await api.learner.getQuiz(bookId);
      if (data && data.questions) {
        setQuizData(data);
        setShowQuiz(true);
      } else {
        toast.error("No quiz available for this chapter yet.");
      }
    } catch (err) {
      toast.error("Failed to load quiz. Please try again.");
    }
  };

  const handleCueTrigger = (cue: MediaCue) => {
    setCurrentCue(cue);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text && text.length > 3) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      
      if (rect) {
        setSelectedText(text);
        setSelectionPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + window.scrollY
        });
      }
    } else {
      setSelectedText('');
      setSelectionPosition(null);
    }
  };

  const handleCreateNoteFromSelection = async () => {
    if (!selectedText || !bookId) return;
    
    try {
      await api.learner.createNote({
        bookId,
        pageId: currentPage,
        content: 'Important highlight',
        highlightText: selectedText,
        color: 'yellow'
      });
      toast.success('Highlight saved to notes');
      setShowNotes(true);
      setSelectedText('');
      setSelectionPosition(null);
      window.getSelection()?.removeAllRanges();
    } catch (err) {
      toast.error('Failed to save highlight');
    }
  };

  const handleProgress = (progress: number) => {
    // Progress is handled by player
  };

  const goToPage = (pageIndex: number) => {
    if (book && pageIndex >= 0 && pageIndex < book.pages.length) {
      setCurrentPage(pageIndex);
    }
  };

  const renderCueContent = (cue: MediaCue) => {
    switch (cue.cue_type) {
      case 'visual':
        return (
          <div className="flex flex-col items-center space-y-4">
            <Eye className="w-8 h-8 text-blue-600" />
            <img src={cue.content} alt="Visual aid" className="max-w-full h-auto rounded-lg shadow-lg" />
            {cue.metadata?.description && <p className="text-sm text-gray-600 text-center">{cue.metadata.description}</p>}
          </div>
        );
      case 'formula':
        return (
          <div className="flex flex-col items-center space-y-4">
            <Calculator className="w-8 h-8 text-purple-600" />
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-full">
              <div className="text-xl font-mono text-center flex justify-center">
                <Formula latex={cue.content} block={true} interactive={true} />
              </div>
            </div>
            {cue.metadata?.explanation && <p className="text-sm text-gray-600 text-center">{cue.metadata.explanation}</p>}
          </div>
        );
      case 'step':
        return (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                {cue.metadata?.step_number || 1}
              </div>
              <span className="font-semibold text-gray-900">Step {cue.metadata?.step_number || 1}</span>
            </div>
            <p className="text-gray-700">{cue.content}</p>
          </div>
        );
      case 'highlight':
        return (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-gray-700">{cue.content}</p>
          </div>
        );
      default:
        return <p className="text-gray-700">{cue.content}</p>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Book not found'}</p>
          <button onClick={() => navigate('/library')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const currentPageData = book.pages[currentPage];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate(-1)} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-900 leading-tight truncate max-w-[200px]">{book.title}</h1>
                <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">by {book.author}</p>
              </div>
            </div>
            
            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center space-x-2">
              {isOffline && (
                <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mr-2">
                  <CloudOff size={12} /> Offline Mode
                </div>
              )}
              
              <button
                onClick={handleDownloadPage}
                disabled={isDownloading}
                className={`p-2 rounded-full transition-colors ${isDownloading ? 'animate-pulse text-quantum-400' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Download for Offline"
              >
                <Download className="w-5 h-5" />
              </button>

              <button onClick={() => setShowNotes(!showNotes)} className={`p-2 rounded-full transition-colors ${showNotes ? 'bg-quantum-50 text-quantum-600' : 'text-gray-600 hover:bg-gray-100'}`} title="Study Notes">
                <StickyNote className="w-5 h-5" />
              </button>
              <button onClick={() => setShowSessionManager(!showSessionManager)} className={`p-2 rounded-full transition-colors ${showSessionManager ? 'bg-quantum-50 text-quantum-600' : 'text-gray-600 hover:bg-gray-100'}`} title="Session Manager">
                <Clock className="w-5 h-5" />
              </button>
              <button onClick={() => setShowWallet(!showWallet)} className={`p-2 rounded-full transition-colors ${showWallet ? 'bg-quantum-50 text-quantum-600' : 'text-gray-600 hover:bg-gray-100'}`} title="PayGO Wallet">
                <Wallet className="w-5 h-5" />
              </button>
              <div className="h-6 w-px bg-slate-200 mx-2" />
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${book.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' : book.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {book.difficulty_level}
              </span>
              <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-full">
                <Award className="w-3 h-3 text-amber-600" />
                <span className="text-xs font-black text-amber-900">{achievements.filter(a => a.earned).length}</span>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <button onClick={() => setShowNotes(!showNotes)} className={`p-2 rounded-full ${showNotes ? 'bg-quantum-50 text-quantum-600' : 'text-slate-600'}`}>
                <StickyNote className="w-5 h-5" />
              </button>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full">
                <MoreVertical className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Control Sheet */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-8 space-y-8 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2" />
            <h3 className="text-center font-black text-slate-900 uppercase tracking-widest text-sm">Study Controls</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { setShowWallet(true); setShowMobileMenu(false); }} className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Wallet /></div>
                <span className="text-xs font-bold text-slate-600">Wallet</span>
              </button>
              <button 
                onClick={() => { setShowSessionManager(true); setShowMobileMenu(false); }}
                className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-3xl border border-slate-100"
              >
                <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl"><Clock /></div>
                <span className="text-xs font-bold text-slate-600">Session</span>
              </button>
              <button 
                onClick={() => { handleDownloadFullBook(); setShowMobileMenu(false); }}
                className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-3xl border border-slate-100"
                disabled={isDownloading}
              >
                <div className={`p-3 bg-green-100 text-green-600 rounded-2xl ${isDownloading ? 'animate-pulse' : ''}`}><Download /></div>
                <span className="text-xs font-bold text-slate-600">Download All</span>
              </button>
            </div>
            <Card className="p-6 bg-slate-900 text-white border-none">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="text-quantum-400" />
                <h4 className="font-bold">Ready for a Quiz?</h4>
              </div>
              <Button className="w-full bg-quantum-500 hover:bg-quantum-400">Start Knowledge Check</Button>
            </Card>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0} className="px-4 py-2 text-sm font-bold bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                      Prev
                    </button>
                    <span className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-widest">{currentPage + 1} / {book.pages.length}</span>
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === book.pages.length - 1} className="px-4 py-2 text-sm font-bold bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                      Next
                    </button>
                  </div>
                </div>

                {/* Page Content */}
                <div 
                  className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 md:p-10 min-h-[400px] md:min-h-[500px] relative overflow-hidden"
                  onMouseUp={handleTextSelection}
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-quantum-500/10" />
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 tracking-tight">{currentPageData.title}</h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-base md:text-lg text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{currentPageData.content}</p>
                  </div>
                </div>

                {/* Floating Highlight Button */}
                {selectionPosition && (
                  <div 
                    className="fixed z-50 animate-in fade-in zoom-in duration-200"
                    style={{ 
                      left: `${selectionPosition.x}px`, 
                      top: `${selectionPosition.y - 50}px`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <button 
                      onClick={handleCreateNoteFromSelection}
                      className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full shadow-2xl hover:bg-slate-800 transition-all font-bold text-xs"
                    >
                      <Highlighter size={14} className="text-quantum-400" /> Highlight & Note
                    </button>
                  </div>
                )}

                {currentPageData.audio_url && (
                  <div className="sticky bottom-0 z-20 -mx-4 md:mx-0">
                    <EnhancedMediaSyncPlayer bookId={bookId!} audioUrl={currentPageData.audio_url} token={token!} productTitle={`${book.title} - Page ${currentPage + 1}`} onProgress={handleProgress} onCueTrigger={handleCueTrigger} />
                  </div>
                )}

                {currentCue && (
                  <div className="bg-white rounded-3xl shadow-lg border-2 border-quantum-100 p-6 md:p-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-black text-quantum-600 uppercase tracking-widest flex items-center gap-2"><Sparkles size={16} /> Insight</h3>
                      <button onClick={() => setCurrentCue(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                    </div>
                    {renderCueContent(currentCue)}
                  </div>
                )}
              </div>

              <div className="hidden lg:block space-y-6">
                {showSessionManager && <PayGOSessionManager productId={bookId!} productType="audiobook" productTitle={book.title} quality="480p" />}
                {showWallet && <PayGOWallet />}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Activity size={14} className="text-quantum-600" /> Study Progress</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600"><Clock size={20} /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Focus Time</p>
                        <p className="text-sm font-black text-slate-900">2h 34m</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600"><BookOpen size={20} /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Retention</p>
                        <p className="text-sm font-black text-slate-900">{Math.round((pagesRead.size / book.pages.length) * 100)}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="p-6 bg-slate-900 text-white border-none shadow-xl">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><HelpCircle size={14} className="text-quantum-400" /> Knowledge Check</h3>
                    <p className="text-sm font-bold mb-4">Ready to test your understanding of this chapter?</p>
                    <Button 
                        variant="primary" 
                        className="w-full bg-quantum-500 hover:bg-quantum-400 text-white" 
                        size="sm"
                        onClick={handleStartQuiz}
                    >
                        Start Chapter Quiz
                    </Button>
                </Card>
              </div>
            </div>
          </div>
        </main>
        {showNotes && (
          <div className="fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-0 flex lg:block">
            <div className="flex-1 lg:hidden bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowNotes(false)} />
            <div className="w-full sm:w-80 lg:w-80 h-full">
              <NotesSidebar bookId={bookId!} currentPage={currentPage} onClose={() => setShowNotes(false)} />
            </div>
          </div>
        )}
      </div>

      {/* Quiz Modal */}
      {showQuiz && quizData && (
        <QuizModal 
          quiz={quizData} 
          onClose={() => setShowQuiz(false)} 
        />
      )}

      <AiTutor activeFormula={currentCue?.cue_type === 'formula' ? currentCue.content : undefined} pageContent={currentPageData.content} />
    </div>
  );
};
