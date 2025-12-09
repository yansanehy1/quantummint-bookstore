
import React, { useEffect, useRef, useState } from 'react';
import { MOCK_BOOKS } from '@/web-frontend/src/services/mockData';
import { updateWalletBalance, getCurrentUser } from '@/web-frontend/src/services/store';
import { SyncEngine, Cue } from '../utils/syncEngine';
import { FormulaPane } from '../components/panes/FormulaPane';
import { VisualPane } from '../components/panes/VisualPane';
import { StepRail } from '../components/panes/StepRail';
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, Volume2, Coins } from 'lucide-react';

interface PlayerProps {
  bookId: string;
  onBack: () => void;
}

export const Player: React.FC<PlayerProps> = ({ bookId, onBack }) => {
  // Check if this is a preview book from Studio
  let book;
  if (bookId.startsWith('preview-')) {
    const previewData = sessionStorage.getItem('preview-book');
    if (previewData) {
      try {
        const previewBook = JSON.parse(previewData);
        console.log('Loading preview book:', previewBook);

        // Get audio URL from first segment with audio, or use placeholder
        const firstAudioSegment = previewBook.content?.find((seg: any) => seg.audioUrl);
        const audioUrl = firstAudioSegment?.audioUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'; // Temporary placeholder

        // Convert content to chapters format if needed
        book = {
          ...previewBook,
          educationalLevel: previewBook.educationalLevel || 'JSS',
          chapters: previewBook.chapters?.length > 0 ? previewBook.chapters : [{
            id: 'preview-chapter',
            title: 'Preview Chapter',
            audioUrl: audioUrl,
            durationMs: (previewBook.content?.length || 1) * 10000, // Estimate duration
            cues: (previewBook.content || []).map((segment: any, index: number) => ({
              type: 'visual' as const,
              atMs: segment.time * 1000,
              payload: segment.text || '',
              duration: 5000
            })),
            transcript: (previewBook.content || []).map((seg: any) => seg.text).join('\n\n')
          }]
        };

        console.log('Preview book processed:', book);
      } catch (e) {
        console.error('Failed to load preview book', e);
        book = MOCK_BOOKS[0];
      }
    } else {
      console.warn('No preview book data in sessionStorage');
      book = MOCK_BOOKS[0];
    }
  } else {
    book = MOCK_BOOKS.find(b => b.id === bookId) || MOCK_BOOKS[0];
  }
  const chapter = book.chapters[0];

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // State for synced content
  const [activeFormula, setActiveFormula] = useState<string>("");
  const [activeVisual, setActiveVisual] = useState<string>("");
  const [activeSteps, setActiveSteps] = useState<string[]>([]);

  // Billing state
  const [sessionCost, setSessionCost] = useState(0);
  const [currency, setCurrency] = useState<'SLL' | 'USD'>('SLL');

  useEffect(() => {
    // Determine Rate based on Level
    const isJSS = book.educationalLevel === 'JSS';
    const hourlyRateSLL = isJSS ? 1.0 : 1.5;
    const hourlyRateUSD = 0.081;

    const user = getCurrentUser();
    const useUSD = user && user.walletBalance.sll < 100 && user.walletBalance.usd > 1;
    const currentCurrency = useUSD ? 'USD' : 'SLL';
    setCurrency(currentCurrency);

    const hourlyRate = currentCurrency === 'USD' ? hourlyRateUSD : hourlyRateSLL;
    const perSecondRate = hourlyRate / 3600;

    let billingInterval: ReturnType<typeof setInterval>;

    if (isPlaying) {
      billingInterval = setInterval(() => {
        setSessionCost(prev => prev + perSecondRate);
        updateWalletBalance(-perSecondRate, currentCurrency);
      }, 1000);
    }

    return () => clearInterval(billingInterval);
  }, [isPlaying, book.educationalLevel]);

  useEffect(() => {
    if (!audioRef.current) return;

    // --- Resume Playback Logic ---
    const savedProgressKey = `progress_${bookId}`;
    const savedData = localStorage.getItem(savedProgressKey);

    if (savedData) {
      try {
        const { timestamp } = JSON.parse(savedData);
        if (typeof timestamp === 'number' && timestamp > 0) {
          const restoreTime = () => {
            if (audioRef.current) {
              audioRef.current.currentTime = timestamp;
              setCurrentTime(timestamp);
            }
          };
          if (audioRef.current.readyState >= 1) {
            restoreTime();
          } else {
            audioRef.current.addEventListener('loadedmetadata', restoreTime, { once: true });
          }
        }
      } catch (e) {
        console.error("Failed to restore playback progress", e);
      }
    }

    // Initialize Sync Engine using the robust implementation
    const engine = new SyncEngine({
      audio: audioRef.current,
      cues: chapter.cues,
      onCue: (cue: Cue) => {
        if (cue.type === 'formula') setActiveFormula(cue.payload);
        if (cue.type === 'visual') setActiveVisual(cue.payload);
        if (cue.type === 'step') setActiveSteps(cue.payload);
      }
    });

    const updateProgress = () => {
      if (audioRef.current) {
        const curr = audioRef.current.currentTime;
        const dur = audioRef.current.duration || 1;
        setCurrentTime(curr);
        setProgress((curr / dur) * 100);

        if (curr > 0) {
          localStorage.setItem(savedProgressKey, JSON.stringify({
            timestamp: curr,
            chapterId: chapter.id,
            updatedAt: Date.now()
          }));
        }
      }
    };

    const onEnded = () => setIsPlaying(false);

    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener('ended', onEnded);

    return () => {
      engine.dispose();
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', onEnded);
      }
    };
  }, [bookId, chapter]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900">
      {/* Player Header */}
      <div className="h-16 border-b border-slate-200 flex items-center px-6 gap-4 bg-white shadow-sm z-20 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h2 className="text-base font-bold text-slate-900">{book.title}</h2>
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-500 font-medium">{chapter.title}</p>
            {book.educationalLevel && (
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full uppercase border border-slate-200">{book.educationalLevel} Level</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Session Cost</span>
            <div className="flex items-center gap-1 text-emerald-600 font-mono text-sm font-bold">
              <Coins size={14} />
              {currency === 'USD' ? '$' : 'Le'} {sessionCost.toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {/* Split Content Area */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left: Text & Formulas */}
        <div className="w-1/2 p-8 border-r border-slate-200 overflow-y-auto bg-slate-50/50">
          <div className="max-w-xl mx-auto space-y-8">
            <div className="space-y-2">
              <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Concept</span>
              <h3 className="text-2xl font-bold text-slate-900">Understanding Motion</h3>
              <p className="text-slate-600 leading-relaxed">
                Listen to the audio narration to follow along with the formulas and visual aids.
              </p>
            </div>

            <FormulaPane latex={activeFormula} />

            <StepRail steps={activeSteps} />
          </div>
        </div>

        {/* Right: Immersive Visuals */}
        <div className="w-1/2 bg-slate-900 relative flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 opacity-50" />
          <div className="relative w-full max-w-2xl aspect-video rounded-xl shadow-2xl overflow-hidden border border-slate-700/50 bg-black/20 backdrop-blur-sm">
            <VisualPane src={activeVisual} />
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-24 bg-white border-t border-slate-200 px-8 flex flex-col justify-center gap-2 z-30 shrink-0">
        <audio ref={audioRef} src={chapter.audioUrl} preload="auto" />

        {/* Scrubber */}
        <div className="w-full flex items-center gap-3 group">
          <span className="text-xs text-slate-400 font-mono w-10 text-right">{formatTime(currentTime)}</span>
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full cursor-pointer relative overflow-hidden group-hover:h-2 transition-all">
            <div
              className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 font-mono w-10">{formatTime(chapter.durationMs / 1000)}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-1/3">
            <button className="text-slate-400 hover:text-slate-600"><Volume2 size={18} /></button>
            <div className="w-20 h-1 bg-slate-200 rounded-full">
              <div className="w-3/4 h-full bg-slate-400 rounded-full" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 w-1/3">
            <button className="text-slate-400 hover:text-emerald-600 transition-colors" onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 10 }}>
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 hover:scale-105 transition-all shadow-lg shadow-slate-900/20"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-slate-400 hover:text-emerald-600 transition-colors" onClick={() => { if (audioRef.current) audioRef.current.currentTime += 10 }}>
              <SkipForward size={20} />
            </button>
          </div>

          <div className="w-1/3 flex justify-end">
            <span className="text-xs font-medium text-slate-500 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer">1.0x Speed</span>
          </div>
        </div>
      </div>
    </div>
  );
};




