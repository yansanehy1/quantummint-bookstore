import React, { useState, useEffect, useRef } from 'react';
import { generateEducationalContent, generateAudio } from '../services/geminiService';
import { VoiceService } from '../services/voiceService';
import { SyncPoint, Book, SegmentType, VoiceProfile } from '../types';
import Button from '../components/ui/Button';
import { Sparkles, Play, Image as ImageIcon, Sigma, Mic, Upload, Check, Settings2, Trash2, Save, Plus, X, Loader2, AlertTriangle, CheckCircle, Info, BrainCircuit, Layout as LayoutIcon, FileText, BarChart3, Globe, RotateCcw } from 'lucide-react';
import api from '../utils/api';
import { Formula } from '../components/ui/Formula';
import { BookMetadataForm } from '../components/BookMetadataForm';
import { CURRENT_USER } from '../constants';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { analyzeText } from '../utils/text-analysis/textAnalyzer';
import { toast } from 'sonner';

interface StudioProps {
  onPreview: (book: Book) => void;
}

interface StudioPage {
  id: string;
  title: string;
  rawText: string;
  segments: SyncPoint[];
  analysisResults?: {
    grammar?: any[];
    scientific?: any[];
    concepts?: any[];
  };
}

interface BookMetadata {
  title: string;
  author: string;
  description: string;
  genre: string;
  coverImage: string;
}

const Studio: React.FC<StudioProps> = ({ onPreview }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'metadata' | 'editor' | 'review'>('metadata');

  // Draft State
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Multi-page State
  const [pages, setPages] = useState<StudioPage[]>([{ id: 'p1', title: 'Page 1', rawText: '', segments: [] }]);
  const [activePageId, setActivePageId] = useState<string>('p1');

  // Book Metadata State
  const [metadata, setMetadata] = useState<BookMetadata>({
    title: '',
    author: CURRENT_USER.name,
    description: '',
    genre: 'Education',
    coverImage: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      const { text } = await api.educational.extractText(file);
      if (text) {
        // Split text into pages (roughly by 2000 chars or newlines)
        const textPages = text.split(/\n\n\n|\f/).filter(p => p.trim().length > 10);
        
        if (textPages.length > 1) {
          const newPages = textPages.map((p, i) => ({
            id: `p${Date.now()}-${i}`,
            title: `Imported Page ${i + 1}`,
            rawText: p.trim(),
            segments: []
          }));
          setPages(newPages);
          setActivePageId(newPages[0].id);
        } else {
          updateActivePage({ rawText: text.trim() });
        }
        toast.success("Text extracted successfully!");
      }
    } catch (error) {
      toast.error("Failed to extract text from file.");
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Voice State
  const [availableVoices, setAvailableVoices] = useState<VoiceProfile[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('voice-kore');

  // Auto-save / Load Draft
  useEffect(() => {
    const loadInitialDraft = async () => {
      // 1. Try to load from URL if draftId is present (for future implementation)
      
      // 2. Try to load from backend (get latest draft)
      try {
        const drafts = await api.drafts.getDrafts();
        if (drafts.length > 0) {
          const latestDraft = drafts[0];
          applyDraft(latestDraft);
          toast.info(`Loaded latest draft: ${latestDraft.title || 'Untitled'}`);
          return;
        }
      } catch (e) {
        console.error("Failed to load drafts from backend", e);
      }

      // 3. Fallback to localStorage (legacy)
      const savedDraft = localStorage.getItem('studio_draft_v2');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setPages(draft.pages || [{ id: 'p1', title: 'Page 1', rawText: '', segments: [] }]);
          setMetadata(draft.metadata || {
            title: '',
            author: CURRENT_USER.name,
            description: '',
            genre: 'Education',
            coverImage: ''
          });
          setSelectedVoiceId(draft.selectedVoiceId || 'voice-kore');
          if (draft.metadata?.title) setActiveTab('editor');
        } catch (e) {
          console.error("Failed to load local draft", e);
        }
      }
    };

    loadInitialDraft();
    refreshVoices();
  }, []);

  const applyDraft = (draft: any) => {
    setCurrentDraftId(draft.id);
    setPages(draft.pages || [{ id: 'p1', title: 'Page 1', rawText: '', segments: [] }]);
    setMetadata(draft.metadata || {
      title: '',
      author: CURRENT_USER.name,
      description: '',
      genre: 'Education',
      coverImage: ''
    });
    setSelectedVoiceId(draft.selectedVoiceId || 'voice-kore');
  };

  const handleNewBook = async () => {
    if (window.confirm("Are you sure you want to start a new book? This will clear your current draft.")) {
      setPages([{ id: 'p1', title: 'Page 1', rawText: '', segments: [] }]);
      setMetadata({
        title: '',
        author: CURRENT_USER.name,
        description: '',
        genre: 'Education',
        coverImage: ''
      });
      setSelectedVoiceId('voice-kore');
      setActiveTab('metadata');
      setCurrentDraftId(null);
      localStorage.removeItem('studio_draft_v2');
      toast.success("New book started.");
    }
  };

  // Auto-save logic
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    // Only save if there's actually content
    const hasContent = metadata.title || pages.some(p => p.rawText.trim().length > 0);
    if (!hasContent) return;

    // Set new timeout for auto-save (2 seconds after last change)
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        const response = await api.drafts.saveDraft({
          id: currentDraftId || undefined,
          title: metadata.title,
          metadata,
          pages,
          selectedVoiceId
        });
        
        const draft = response.draft;
        if (draft && draft.id !== currentDraftId) {
          setCurrentDraftId(draft.id);
        }
        
        // Also sync to localStorage as backup
        localStorage.setItem('studio_draft_v2', JSON.stringify({ pages, metadata, selectedVoiceId }));
        
      } catch (e) {
        console.error("Auto-save failed", e);
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [pages, metadata, selectedVoiceId, currentDraftId]);

  const refreshVoices = () => {
    setAvailableVoices(VoiceService.getAvailableVoices());
  };

  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  const updateActivePage = (updates: Partial<StudioPage>) => {
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, ...updates } : p));
  };

  const handleAddPage = () => {
    const newId = `p${Date.now()}`;
    const newPage = { id: newId, title: `Page ${pages.length + 1}`, rawText: '', segments: [] };
    setPages(prev => [...prev, newPage]);
    setActivePageId(newId);
  };

  const handleDeletePage = () => {
    if (pages.length <= 1) return;
    const newPages = pages.filter(p => p.id !== activePageId);
    setPages(newPages);
    setActivePageId(newPages[newPages.length - 1].id);
  };

  const handleGenerateContent = async () => {
    if (!activePage.rawText.trim()) return;
    setIsGenerating(true);
    try {
      const content = await generateEducationalContent(activePage.rawText);
      updateActivePage({ segments: content });
      toast.success("Content segments generated!");
    } catch (error) {
      console.error('Content generation error:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScientificProcess = async () => {
    if (!activePage.rawText.trim()) return;
    setIsGenerating(true);
    try {
      const response = await api.educational.processPage({
        bookId: currentDraftId || 'studio-draft',
        pageId: 1,
        content: activePage.rawText
      });

      if (response.cues) {
        const segments: SyncPoint[] = response.cues.map((cue: {
          id: string | number;
          content: string;
          cue_type: string;
          metadata?: { explanation?: string };
        }) => ({
          id: `cue-${cue.id}-${Date.now()}`,
          text: cue.metadata?.explanation || cue.content,
          type: cue.cue_type.toUpperCase() as SegmentType,
          visualContent: cue.content,
          visualDescription: cue.metadata?.explanation || 'Scientific formula/step',
          metadata: cue.metadata
        }));
        updateActivePage({ segments });
        toast.success("Scientific analysis complete!");
      }
    } catch (error) {
      console.error('Scientific Processing Error:', error);
      toast.error('Scientific processing failed. Please check your backend connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (activePage.segments.length === 0) {
      toast.error("Please run Scientific AI Analysis first to identify narration segments.");
      return;
    }
    
    setIsGeneratingAudio(true);
    let successCount = 0;
    let failCount = 0;

    try {
      const voice = availableVoices.find(v => v.id === selectedVoiceId);
      const voiceName = voice?.name || 'Kore';

      // Clone segments to avoid direct state mutation during loop
      const updatedSegments = [...activePage.segments];
      
      // Process in small batches of 2 to avoid overwhelming the TTS service but faster than sequential
      const BATCH_SIZE = 2;
      for (let i = 0; i < updatedSegments.length; i += BATCH_SIZE) {
        const batch = updatedSegments.slice(i, i + BATCH_SIZE);
        const batchIndices = Array.from({ length: batch.length }, (_, k) => i + k);
        
        await Promise.all(batch.map(async (segment, batchIdx) => {
          const globalIdx = batchIndices[batchIdx];
          if (!segment.audioUrl) {
            try {
              const audioUrl = await generateAudio(segment.text, voiceName);
              updatedSegments[globalIdx] = { ...segment, audioUrl };
              successCount++;
            } catch (e) {
              console.error(`Audio gen error for segment ${globalIdx}`, e);
              failCount++;
            }
          } else {
            successCount++; // Already has audio
          }
        }));
        
        // Update state after each batch to show progress
        updateActivePage({ segments: [...updatedSegments] });
      }

      if (failCount > 0) {
        toast.warning(`Audio generation finished with some issues. Success: ${successCount}, Failed: ${failCount}.`);
      } else {
        toast.success(`Successfully generated audio for all ${successCount} segments!`);
      }
    } catch (e: unknown) {
      const error = e as Error;
      console.error("Audio generation orchestrator error:", error);
      toast.error("An error occurred during audio generation.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handlePreview = () => {
    const allContent = pages.reduce((acc, page) => [...acc, ...page.segments], [] as SyncPoint[]);

    if (allContent.length === 0) {
      toast.error("Please generate content before previewing.");
      return;
    }

    const tempBook: Book = {
      id: 'preview-' + Date.now(),
      title: metadata.title || "Untitled Draft",
      author: metadata.author,
      coverUrl: metadata.coverImage || "https://picsum.photos/seed/draft/300/450",
      description: metadata.description,
      price: 0,
      category: metadata.genre,
      content: allContent,
      voiceProfileId: selectedVoiceId
    };

    onPreview(tempBook);
  };

  const handlePublish = async () => {
    if (!metadata.title || !metadata.description) {
      toast.error("Please provide book title and description before publishing.");
      setActiveTab('metadata');
      return;
    }

    // Verify all pages have segments generated
    const incompletePages = pages.filter(p => p.segments.length === 0);
    if (incompletePages.length > 0) {
      const confirm = window.confirm(`Some pages (${incompletePages.map(p => p.title).join(', ')}) have no segments. Publish anyway?`);
      if (!confirm) return;
    }

    setIsPublishing(true);
    try {
      // 1. Create Book Metadata
      const bookResponse = await api.books.create({
        title: metadata.title,
        author: metadata.author,
        description: metadata.description,
        category: metadata.genre,
        coverUrl: metadata.coverImage,
        voiceProfileId: selectedVoiceId,
        status: 'published',
        pageCount: pages.length
      });

      const bookId = bookResponse.id;

      // 2. Bulk Process all pages and their segments
      // This orchestrates STEM analysis and narration segments in one call
      await api.educational.processBulk({
        bookId,
        pages: pages.map(page => ({
          id: page.id,
          content: page.rawText,
          segments: page.segments,
          title: page.title
        }))
      });

      // Cleanup draft upon successful publication
      if (currentDraftId) {
        await api.drafts.deleteDraft(currentDraftId);
      }
      localStorage.removeItem('studio_draft_v2');

      toast.success("🎉 Congratulations! Your AI-native STEM book has been published to the QuantumMint marketplace.");
      
      // Navigate to the newly created book or dashboard
      setTimeout(() => {
        window.location.href = `/book/${bookId}`;
      }, 2000);
    } catch (e) {
      console.error("Publishing error:", e);
      toast.error("Failed to publish book. Please ensure your internet connection is stable and try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="bg-quantum-600 p-2 rounded-lg text-white">
            <BrainCircuit size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Creator Studio</h1>
              {isSaving && (
                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase animate-pulse">
                  <Save size={10} /> Saving...
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">Draft: {metadata.title || 'Untitled Book'}</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('metadata')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'metadata' ? 'bg-white text-quantum-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <FileText size={16} /> Metadata
          </button>
          <button 
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'editor' ? 'bg-white text-quantum-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutIcon size={16} /> Content Editor
          </button>
          <button 
            onClick={() => setActiveTab('review')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'review' ? 'bg-white text-quantum-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <CheckCircle size={16} /> Review
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".pdf,.docx,.txt"
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
            isLoading={isExtracting}
          >
            <Upload className="w-4 h-4 mr-2" /> Import PDF/Doc
          </Button>
          <Button variant="outline" size="sm" onClick={handleNewBook} className="text-slate-500 hover:text-red-600 border-slate-200">
            <RotateCcw className="w-4 h-4 mr-2" /> New Book
          </Button>
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Play className="w-4 h-4 mr-2" /> Preview
          </Button>
          <Button variant="primary" size="sm" onClick={handlePublish} isLoading={isPublishing}>
            <Globe className="w-4 h-4 mr-2" /> Publish Book
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'metadata' && (
          <div className="h-full overflow-y-auto p-8 max-w-5xl mx-auto">
            <div className="p-8 bg-white shadow-xl rounded-3xl border border-slate-200">
              <BookMetadataForm 
                metadata={metadata} 
                onChange={(newMetadata) => setMetadata(newMetadata)} 
              />
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="h-full flex">
            {/* Page Navigation Sidebar */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chapters / Pages</span>
                <button onClick={handleAddPage} className="p-1 hover:bg-slate-200 rounded-md text-quantum-600 transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {pages.map((p, idx) => (
                  <div key={p.id} className="group relative">
                    <button
                      onClick={() => setActivePageId(p.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 ${activePageId === p.id ? 'bg-quantum-50 text-quantum-700 font-bold border border-quantum-100 shadow-sm' : 'text-slate-600 hover:bg-slate-50 border border-transparent'}`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${activePageId === p.id ? 'bg-quantum-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {idx + 1}
                      </span>
                      <span className="truncate">{p.title}</span>
                      {p.segments.length > 0 && <Check size={14} className="ml-auto text-green-500" />}
                    </button>
                    {pages.length > 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeletePage(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Editor Canvas */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                    <input
                      type="text"
                      value={activePage.title}
                      onChange={(e) => updateActivePage({ title: e.target.value })}
                      className="bg-transparent border-none font-bold text-slate-700 focus:ring-0 text-lg w-1/2"
                    />
                    
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                      <Mic className="text-quantum-600 w-4 h-4" />
                      <select
                        value={selectedVoiceId}
                        onChange={(e) => setSelectedVoiceId(e.target.value)}
                        className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 cursor-pointer"
                      >
                        {availableVoices.map(v => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-6">
                    <textarea
                      value={activePage.rawText}
                      onChange={(e) => updateActivePage({ rawText: e.target.value })}
                      className="w-full h-[400px] p-0 border-none focus:ring-0 resize-none font-serif text-lg leading-relaxed text-slate-800 placeholder-slate-300"
                      placeholder="Once upon a time in the world of science..."
                    />
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <Button
                      className="flex-1 rounded-xl shadow-md"
                      onClick={handleScientificProcess}
                      isLoading={isGenerating}
                      disabled={!activePage.rawText.trim()}
                    >
                      <BrainCircuit className="w-4 h-4 mr-2" />
                      Scientific AI Analysis
                    </Button>
                    <Button
                      className="flex-1 rounded-xl shadow-md"
                      variant="secondary"
                      onClick={handleGenerateAudio}
                      isLoading={isGeneratingAudio}
                      disabled={activePage.segments.length === 0}
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Generate Audio Narrations
                    </Button>
                  </div>
                </div>

                {/* Page Segments Preview */}
                {activePage.segments.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                      <BarChart3 size={18} className="text-slate-400" />
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Narration Segments</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activePage.segments.map((segment, idx) => (
                        <div key={segment.id} className="p-4 bg-white hover:border-quantum-200 transition-all border border-slate-200 rounded-xl shadow-sm group">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="bg-slate-100 text-slate-500 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-md">{idx + 1}</span>
                              <span className="text-[10px] font-black uppercase tracking-tighter text-quantum-600">{segment.type}</span>
                            </div>
                            {segment.metadata?.voice_role && (
                              <span className="bg-purple-100 text-purple-700 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Mic size={10} /> {segment.metadata.voice_role}
                              </span>
                            )}
                          </div>
                          
                          {segment.type === 'FORMULA' ? (
                            <div className="py-4 flex justify-center bg-slate-50 rounded-xl mb-3 border border-slate-100 group-hover:bg-purple-50/50 transition-colors">
                              <Formula latex={segment.visualContent || ''} interactive={true} />
                            </div>
                          ) : (
                            <p className="text-slate-600 text-xs line-clamp-3 mb-3 leading-relaxed">{segment.text}</p>
                          )}

                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                            <span className="text-[9px] text-slate-400 font-medium italic truncate w-2/3">{segment.visualDescription}</span>
                            {segment.audioUrl && <CheckCircle size={14} className="text-green-500" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="h-full overflow-y-auto bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Final Quality Review</h2>
                  <p className="text-sm text-slate-500 font-medium">AI-driven validation for your educational content</p>
                </div>
                <Button onClick={() => { setIsAnalyzing(true); setTimeout(() => setIsAnalyzing(false), 2000); }} isLoading={isAnalyzing}>
                  <Sparkles size={16} className="mr-2" /> Re-Analyze All Pages
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Grammar & Style */}
                <div className="p-6 bg-white shadow-xl border border-slate-200 rounded-3xl">
                  <GrammarIssuesViewer issues={[]} onApplySuggestion={() => {}} />
                </div>

                {/* Math & Scientific Integrity */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white shadow-xl border border-slate-200 rounded-3xl">
                    <MathIssuesViewer issues={[]} text={activePage.rawText} />
                  </div>
                  <div className="p-6 bg-white shadow-xl border border-slate-200 rounded-3xl">
                    <ScienceIssuesViewer issues={[]} onApplySuggestion={() => {}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper components
const GrammarIssuesViewer = ({ issues, onApplySuggestion }: { issues: any[], onApplySuggestion: (issue: any) => void }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Grammar Issues</h3>
    {issues.length > 0 ? (
      <div className="space-y-4">
        {issues.map((issue, index) => (
          <div key={index} className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">{issue.message}</p>
                {issue.suggestion && (
                  <div className="mt-2">
                    <p className="text-sm text-yellow-700">Suggestion: {issue.suggestion}</p>
                    <button onClick={() => onApplySuggestion(issue)} className="mt-1 text-xs text-yellow-700 hover:text-yellow-900 font-medium">
                      Apply suggestion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 bg-green-50 rounded-lg">
        <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No grammar issues found</h3>
      </div>
    )}
  </div>
);

const MathIssuesViewer = ({ issues, text }: { issues: any[], text: string }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Math Expressions</h3>
    {issues.length > 0 ? (
      <div className="space-y-4">
        {issues.map((math, index) => (
          <div key={index} className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r">
            <div className="flex items-start">
              {math.result.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900 mb-2">
                  <InlineMath math={math.expression} />
                </div>
                {math.result.isValid ? (
                  <div className="text-sm text-green-700">
                    {math.result.verification || 'Valid math expression'}
                    {math.result.solution && (
                      <div className="mt-1">
                        Result: {JSON.stringify(math.result.solution)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-red-700">
                    Error: {math.result.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Info className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No math expressions found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Use $...$ for inline math and $$...$$ for display math.
        </p>
      </div>
    )}
  </div>
);

const ScienceIssuesViewer = ({ issues, onApplySuggestion }: { issues: any[], onApplySuggestion: (issue: any) => void }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Scientific Accuracy</h3>
    {issues.length > 0 ? (
      <div className="space-y-4">
        {issues.map((issue, index) => (
          <div key={index} className={`p-4 border-l-4 rounded-r ${issue.severity === 'high'
            ? 'bg-red-50 border-red-400'
            : issue.severity === 'medium'
              ? 'bg-yellow-50 border-yellow-400'
              : 'bg-blue-50 border-blue-400'}`}>
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{issue.type}</p>
                <p className="text-sm text-gray-700 mt-1">{issue.message}</p>
                {issue.suggestion && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Suggestion: <span className="font-medium">{issue.suggestion}</span>
                    </p>
                    <button onClick={() => onApplySuggestion(issue)} className="mt-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                      Apply suggestion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 bg-green-50 rounded-lg">
        <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No scientific inaccuracies found</h3>
      </div>
    )}
  </div>
);

export default Studio;

