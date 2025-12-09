<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { generateEducationalContent, generateAudio } from '@/services/geminiService';
import { VoiceService } from '@/services/voiceService';
import { SyncPoint, Book, SegmentType, VoiceProfile } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Sparkles, Play, Mic, Check, Trash2, Save, Plus, Loader2, Video, Image as ImageIcon, Code, PlayCircle } from 'lucide-react';
import { CURRENT_USER } from '@/constants';
import { createAIClient, ensureApiKeySelected, generateBookCover } from '@/web-frontend/src/services/aiService';
import { buildSSML, synthesizeSpeech } from '@/web-frontend/src/services/ttsService';
import { openAiGenMaxEmbed, generateVideoWithAiGenMax, generateImageWithAiGenMax } from '@/services/aiGenMaxService';
import 'katex/dist/katex.min.css';

interface StudioProps {
    onPreview: (book: Book) => void;
    onClose?: () => void;
}

interface StudioPage {
    id: string;
    title: string;
    rawText: string;
    segments: SyncPoint[];
}

const Studio: React.FC<StudioProps> = ({ onPreview, onClose }) => {
    // Studio sub-tab state
    const [activeStudioTab, setActiveStudioTab] = useState<'audiobook' | 'marketing' | 'audio'>('audiobook');

    // Audiobook Creator State
    const [pages, setPages] = useState<StudioPage[]>([{ id: 'p1', title: 'Page 1', rawText: '', segments: [] }]);
    const [activePageId, setActivePageId] = useState<string>('p1');
    const [bookTitle, setBookTitle] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [availableVoices, setAvailableVoices] = useState<VoiceProfile[]>([]);
    const [selectedVoiceId, setSelectedVoiceId] = useState<string>('voice-kore');

    // Marketing / Veo State
    const [prompt, setPrompt] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

    // Audio / TTS State
    const [ttsInput, setTtsInput] = useState('Velocity is defined as $$v = \\frac{d}{t}$$.');
    const [generatedSSML, setGeneratedSSML] = useState('');
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

    // Auto-save / Load Draft
    useEffect(() => {
        const savedDraft = localStorage.getItem('studio_draft');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                setPages(draft.pages || [{ id: 'p1', title: 'Page 1', rawText: '', segments: [] }]);
                setBookTitle(draft.bookTitle || '');
                setSelectedVoiceId(draft.selectedVoiceId || 'voice-kore');
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
        setAvailableVoices(VoiceService.getAvailableVoices());
    }, []);

    // Save on change
    useEffect(() => {
        const draft = { pages, bookTitle, selectedVoiceId };
        localStorage.setItem('studio_draft', JSON.stringify(draft));
    }, [pages, bookTitle, selectedVoiceId]);

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
        } catch (error) {
            alert("Failed to generate content. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateAudio = async () => {
        if (activePage.segments.length === 0) return;
        setIsGeneratingAudio(true);

        try {
            const voice = availableVoices.find(v => v.id === selectedVoiceId);
            const voiceName = voice?.name || 'Kore';

            const updatedSegments = [...activePage.segments];
            for (let i = 0; i < updatedSegments.length; i++) {
                if (!updatedSegments[i].audioUrl) {
                    try {
                        const audioUrl = await generateAudio(updatedSegments[i].text, voiceName);
                        updatedSegments[i].audioUrl = audioUrl;
                        updateActivePage({ segments: [...updatedSegments] });
                    } catch (e) {
                        console.error("Audio gen error for segment " + i, e);
                    }
                }
            }
            updateActivePage({ segments: updatedSegments });
            alert("Audio generation complete!");
        } catch (e) {
            alert("Error generating audio.");
        } finally {
            setIsGeneratingAudio(false);
        }
    };

    const handlePreview = () => {
        const allContent = pages.reduce((acc, page) => [...acc, ...page.segments], [] as SyncPoint[]);

        if (allContent.length === 0) {
            alert("Please generate content before previewing.");
            return;
        }

        const tempBook: any = {
            id: 'preview-' + Date.now(),
            title: bookTitle || "Untitled Draft",
            author: CURRENT_USER.name,
            coverUrl: "https://picsum.photos/seed/draft/300/450",
            description: "Draft content from Studio",
            price: 0,
            category: "Education",
            content: allContent,
            voiceProfileId: selectedVoiceId,
            chapters: []
        };

        onPreview(tempBook);
    };

    // Marketing handlers
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateVideo = async () => {
        if (!prompt) return;

        await ensureApiKeySelected();
        setIsGeneratingVideo(true);
        console.log('Starting video generation...');

        try {
            // Mock video generation - replace with actual Veo API
            await new Promise(resolve => setTimeout(resolve, 3000));
            const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
            console.log('Setting video URL:', videoUrl);
            setGeneratedVideoUrl(videoUrl);
            console.log('Video URL set successfully. Current state should update.');
            alert('Video generated successfully!');
        } catch (error) {
            console.error('Video generation error:', error);
            alert('Failed to generate video');
        } finally {
            setIsGeneratingVideo(false);
            console.log('Video generation complete');
        }
    };

    // Audio handlers
    const handleGenerateSSML = async () => {
        const ssml = await buildSSML(ttsInput);
        setGeneratedSSML(ssml);
    };

    const handleSynthesize = async () => {
        setIsSynthesizing(true);
        try {
            const audioUrl = await synthesizeSpeech(generatedSSML, 'default');
            setAudioPreviewUrl(audioUrl);
        } catch (error) {
            alert('Failed to synthesize audio');
        } finally {
            setIsSynthesizing(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="border-b border-slate-200 p-4 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                        Audiobook Studio Pro
                    </h2>
                    <p className="text-sm text-slate-500">Create, Market & Produce</p>
                </div>
                {activeStudioTab === 'audiobook' && (
                    <div className="flex gap-2">
                        {onClose && (
                            <Button variant="outline" size="sm" onClick={onClose}>
                                ✕ Close
                            </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => alert('Draft is auto-saved!')}>
                            <Save className="w-4 h-4 mr-2" /> Saved
                        </Button>
                        <Button size="sm" onClick={handlePreview}>
                            <Play className="w-4 h-4 mr-2" /> Preview Book
                        </Button>
                    </div>
                )}
            </div>

            {/* Sub-navigation */}
            <div className="border-b border-slate-200 bg-slate-50">
                <div className="flex">
                    <button
                        onClick={() => setActiveStudioTab('audiobook')}
                        className={`px-6 py-3 font-semibold transition ${activeStudioTab === 'audiobook'
                            ? 'text-amber-600 border-b-2 border-amber-600 bg-white'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        Audiobook Creator
                    </button>
                    <button
                        onClick={() => setActiveStudioTab('marketing')}
                        className={`px-6 py-3 font-semibold transition ${activeStudioTab === 'marketing'
                            ? 'text-amber-600 border-b-2 border-amber-600 bg-white'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Video className="w-4 h-4 inline mr-2" />
                        Video Marketing
                    </button>
                    <button
                        onClick={() => setActiveStudioTab('audio')}
                        className={`px-6 py-3 font-semibold transition ${activeStudioTab === 'audio'
                            ? 'text-amber-600 border-b-2 border-amber-600 bg-white'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Mic className="w-4 h-4 inline mr-2" />
                        Audio Tools
                    </button>
                </div>
            </div>

            {/* Audiobook Creator Tab */}
            {activeStudioTab === 'audiobook' && (
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                    {/* Page Sidebar */}
                    <div className="w-full lg:w-48 bg-slate-50 border-r border-slate-200 flex flex-col">
                        <div className="p-3 border-b border-slate-200 font-bold text-slate-700 text-sm">Pages</div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {pages.map((p, idx) => (
                                <button
                                    key={p.id}
                                    onClick={() => setActivePageId(p.id)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${activePageId === p.id ? 'bg-amber-100 text-amber-900 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                                >
                                    <span>{idx + 1}. {p.title}</span>
                                    {p.segments.length > 0 && <Check size={12} className="text-green-500" />}
                                </button>
                            ))}
                        </div>
                        <div className="p-3 border-t border-slate-200 flex gap-2">
                            <button onClick={handleAddPage} className="flex-1 flex items-center justify-center p-2 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600" title="Add Page">
                                <Plus size={16} />
                            </button>
                            <button onClick={handleDeletePage} className="flex-1 flex items-center justify-center p-2 bg-white border border-slate-300 rounded hover:bg-red-50 text-red-500" title="Delete Page" disabled={pages.length <= 1}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 flex flex-col p-6 border-r border-slate-200 overflow-y-auto">
                        <div className="space-y-6 max-w-3xl mx-auto w-full">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Book Title</label>
                                    <input
                                        type="text"
                                        value={bookTitle}
                                        onChange={(e) => setBookTitle(e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                        placeholder="My Amazing Book"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Page Title</label>
                                    <input
                                        type="text"
                                        value={activePage.title}
                                        onChange={(e) => updateActivePage({ title: e.target.value })}
                                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Mic className="text-amber-600 w-4 h-4" />
                                    <select
                                        value={selectedVoiceId}
                                        onChange={(e) => setSelectedVoiceId(e.target.value)}
                                        className="bg-transparent border-none font-medium text-slate-700 focus:ring-0 cursor-pointer"
                                        title="Select Voice"
                                    >
                                        {availableVoices.map(v => (
                                            <option key={v.id} value={v.id}>{v.name} ({v.accent})</option>
                                        ))}
                                    </select>
                                </div>
                                <span className="text-xs text-slate-400">Used for Audio Gen</span>
                            </div>

                            <div className="flex-1 flex flex-col relative">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Page Content</label>
                                <textarea
                                    value={activePage.rawText}
                                    onChange={(e) => updateActivePage({ rawText: e.target.value })}
                                    className="w-full h-64 p-4 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none font-serif leading-relaxed"
                                    placeholder="Paste the text for this page here..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    className="flex-1"
                                    onClick={handleGenerateContent}
                                    disabled={!activePage.rawText.trim() || isGenerating}
                                >
                                    {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                    1. Analyze & Segment
                                </Button>

                                <Button
                                    className="flex-1"
                                    variant="secondary"
                                    onClick={handleGenerateAudio}
                                    disabled={activePage.segments.length === 0 || isGeneratingAudio}
                                >
                                    {isGeneratingAudio ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mic className="w-4 h-4 mr-2" />}
                                    2. Generate Audio (TTS)
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Results / Segments */}
                    <div className="w-full lg:w-1/3 bg-slate-50 p-6 overflow-y-auto border-l border-slate-200">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-800">Segments ({activePage.segments.length})</h3>
                            </div>

                            {activePage.segments.length === 0 && (
                                <div className="text-center py-10 text-slate-400 text-sm">
                                    No segments yet. Enter text and click Analyze.
                                </div>
                            )}

                            {activePage.segments.map((segment, idx) => (
                                <div key={segment.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-slate-100 text-slate-500 text-xs font-bold px-1.5 py-0.5 rounded">{idx + 1}</span>
                                        <span className="font-bold text-xs uppercase text-amber-600">{segment.type}</span>
                                        {segment.audioUrl && <span className="ml-auto text-green-500"><Mic size={12} /></span>}
                                    </div>
                                    <p className="text-slate-700 line-clamp-3 mb-2">{segment.text}</p>
                                    <div className="text-xs text-slate-400 italic border-t border-slate-50 pt-1">
                                        {segment.visualDescription}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Marketing Tab */}
            {activeStudioTab === 'marketing' && (
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Generate Video Ads</h2>
                            <p className="text-gray-600 mb-6">Create dynamic video promos for your books using AI</p>

                            <Card className="p-6">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
                                        <textarea
                                            className="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-amber-500 focus:border-amber-500 h-24"
                                            placeholder="Describe the video you want (e.g., A cinematic shot of a physics textbook glowing with magical energy)"
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Source Image (Optional)</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                                            {selectedImage ? (
                                                <img src={selectedImage} alt="Preview" className="h-32 object-contain" />
                                            ) : (
                                                <>
                                                    <ImageIcon size={32} className="text-gray-400 mb-2" />
                                                    <span className="text-sm text-gray-500">Click to upload image</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            className="w-full bg-amber-600 hover:bg-amber-700"
                                            onClick={handleGenerateVideo}
                                            disabled={!prompt || isGeneratingVideo}
                                        >
                                            <Video size={18} className="mr-2" />
                                            {isGeneratingVideo ? 'Generating...' : 'Generate Video'}
                                        </Button>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-300"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-white text-gray-500">or</span>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                                            onClick={() => openAiGenMaxEmbed('video')}
                                            variant="outline"
                                        >
                                            <Sparkles size={18} className="mr-2" />
                                            Open AiGenMax Studio
                                        </Button>
                                        <p className="text-xs text-gray-500 text-center">
                                            Use AiGenMax.art for professional image & video generation
                                        </p>
                                    </div>

                                    <p className="text-xs text-gray-500 text-center">Powered by Google Veo. Requires API key.</p>
                                </div>
                            </Card>
                        </div>

                        <div>
                            {generatedVideoUrl ? (
                                <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
                                    <video src={generatedVideoUrl} controls autoPlay loop className="w-full aspect-video" />
                                    <div className="p-4 bg-gray-900 flex justify-between items-center">
                                        <span className="text-white text-sm font-medium">Generated Ad</span>
                                        <Button size="sm" variant="outline">Download</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-[400px] bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                                    <Video size={48} className="mb-4 opacity-50" />
                                    <p>Generated video will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Audio Tools Tab */}
            {activeStudioTab === 'audio' && (
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Formula-Aware TTS</h2>
                            <p className="text-gray-600 mb-6">Convert textbook content into speech with proper emphasis on formulas</p>

                            <Card className="p-6">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Input Text (Markdown/LaTeX)</label>
                                        <textarea
                                            className="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-amber-500 focus:border-amber-500 h-40 font-mono"
                                            placeholder="Enter text with $$formula$$ or \[formula\]..."
                                            value={ttsInput}
                                            onChange={(e) => setTtsInput(e.target.value)}
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Supports LaTeX with $$...$$ delimiters.</p>
                                    </div>
                                    <Button
                                        className="w-full bg-amber-600 hover:bg-amber-700"
                                        onClick={handleGenerateSSML}
                                        disabled={!ttsInput}
                                    >
                                        <Code size={18} className="mr-2" />
                                        Generate SSML
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="h-full p-6">
                                <h3 className="text-xl font-bold mb-4">SSML Output</h3>
                                <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-auto border border-gray-700 mb-4">
                                    <code className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                                        {generatedSSML || '// Generated SSML will appear here...'}
                                    </code>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        onClick={handleSynthesize}
                                        disabled={!generatedSSML || isSynthesizing}
                                    >
                                        <PlayCircle size={18} className="mr-2" />
                                        {isSynthesizing ? 'Synthesizing...' : 'Preview Audio'}
                                    </Button>
                                </div>

                                {audioPreviewUrl && (
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center justify-between mt-4">
                                        <span className="text-sm text-green-800 font-medium">Audio Ready</span>
                                        <audio controls src={audioPreviewUrl} className="h-8 w-40" />
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Studio;
=======
import React, { useState, useEffect, useRef } from 'react';
import { generateEducationalContent, generateAudio } from '../services/geminiService';
import { VoiceService } from '../services/voiceService';
import { SyncPoint, Book, SegmentType, VoiceProfile } from '../types';
import Button from '../components/ui/Button';
import { Sparkles, Play, Image as ImageIcon, Sigma, Mic, Upload, Check, Settings2, Trash2, Save, Plus, X, Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { CURRENT_USER, AVAILABLE_ACCENTS } from '../constants';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { analyzeText } from '../utils/text-analysis/textAnalyzer';
import { processTextWithSSML } from '../utils/text-analysis/textAnalyzer';
import { detectFormulas } from '../utils/text-analysis/formulaDetector';

interface StudioProps {
  onPreview: (book: Book) => void;
}

interface StudioPage {
  id: string;
  title: string;
  rawText: string;
  segments: SyncPoint[];
}

const Studio: React.FC<StudioProps> = ({ onPreview }) => {
  // Multi-page State
  const [pages, setPages] = useState<StudioPage[]>([{ id: 'p1', title: 'Page 1', rawText: '', segments: [] }]);
  const [activePageId, setActivePageId] = useState<string>('p1');

  const [bookTitle, setBookTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [showCreator, setShowCreator] = useState(false);

  // Voice State
  const [availableVoices, setAvailableVoices] = useState<VoiceProfile[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('voice-kore');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  // Auto-save / Load Draft
  useEffect(() => {
    const savedDraft = localStorage.getItem('studio_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setPages(draft.pages || [{ id: 'p1', title: 'Page 1', rawText: '', segments: [] }]);
        setBookTitle(draft.bookTitle || '');
        setSelectedVoiceId(draft.selectedVoiceId || 'voice-kore');
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
    refreshVoices();
  }, []);

  // Save on change
  useEffect(() => {
    const draft = { pages, bookTitle, selectedVoiceId };
    localStorage.setItem('studio_draft', JSON.stringify(draft));
  }, [pages, bookTitle, selectedVoiceId]);

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
    } catch (error) {
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (activePage.segments.length === 0) return;
    setIsGeneratingAudio(true);

    try {
      const voice = availableVoices.find(v => v.id === selectedVoiceId);
      const voiceName = voice?.name || 'Kore';

      // Generate audio for each segment sequentially to avoid rate limits
      const updatedSegments = [...activePage.segments];
      for (let i = 0; i < updatedSegments.length; i++) {
        if (!updatedSegments[i].audioUrl) { // Only generate if missing
          try {
            const audioUrl = await generateAudio(updatedSegments[i].text, voiceName);
            updatedSegments[i].audioUrl = audioUrl;
            // Force update periodically to show progress
            updateActivePage({ segments: [...updatedSegments] });
          } catch (e) {
            console.error("Audio gen error for segment " + i, e);
          }
        }
      }
      updateActivePage({ segments: updatedSegments });
      alert("Audio generation complete!");
    } catch (e) {
      alert("Error generating audio.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handlePreview = () => {
    // Flatten all pages into one book content array
    const allContent = pages.reduce((acc, page) => [...acc, ...page.segments], [] as SyncPoint[]);

    if (allContent.length === 0) {
      alert("Please generate content before previewing.");
      return;
    }

    const tempBook: Book = {
      id: 'preview-' + Date.now(),
      title: bookTitle || "Untitled Draft",
      author: CURRENT_USER.name,
      coverUrl: "https://picsum.photos/seed/draft/300/450",
      description: "Draft content from Studio",
      price: 0,
      category: "Education",
      content: allContent,
      voiceProfileId: selectedVoiceId
    };

    onPreview(tempBook);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 p-4 flex justify-between items-center bg-white sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-quantum-600" />
            Audiobook Studio Pro
          </h2>
          <p className="text-sm text-slate-500">Multi-Page Creator • Auto-saved</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => alert('Draft is auto-saved!')}
          >
            <Save className="w-4 h-4 mr-2" /> Saved
          </Button>
          <Button variant="primary" size="sm" onClick={handlePreview}
          >
            <Play className="w-4 h-4 mr-2" /> Preview Book
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowCreator(!showCreator)}
          >
            <Mic className="w-4 h-4 mr-2" /> {showCreator ? 'Close Creator' : 'Audiobook Creator'}
          </Button>
        </div>
      </div>

      {/* Editor Area or Audiobook Creator */}
      {showCreator ? (
        <div className="flex-1 overflow-y-auto bg-white">
          <AudiobookCreator />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Page Sidebar */}
          <div className="w-full lg:w-48 bg-slate-50 border-r border-slate-200 flex flex-col">
            <div className="p-3 border-b border-slate-200 font-bold text-slate-700 text-sm">Pages</div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {pages.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActivePageId(p.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${activePageId === p.id ? 'bg-quantum-100 text-quantum-900 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <span>{idx + 1}. {p.title}</span>
                  {p.segments.length > 0 && <Check size={12} className="text-green-500" />}
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-slate-200 flex gap-2">
              <button onClick={handleAddPage} className="flex-1 flex items-center justify-center p-2 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600" title="Add Page">
                <Plus size={16} />
              </button>
              <button onClick={handleDeletePage} className="flex-1 flex items-center justify-center p-2 bg-white border border-slate-300 rounded hover:bg-red-50 text-red-500" title="Delete Page" disabled={pages.length <= 1}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col p-6 border-r border-slate-200 overflow-y-auto">
            <div className="space-y-6 max-w-3xl mx-auto w-full">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Book Title</label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-quantum-500 focus:outline-none"
                    placeholder="My Amazing Book"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Page Title</label>
                  <input
                    type="text"
                    value={activePage.title}
                    onChange={(e) => updateActivePage({ title: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-quantum-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Voice Selector */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="text-quantum-600 w-4 h-4" />
                  <select
                    value={selectedVoiceId}
                    onChange={(e) => setSelectedVoiceId(e.target.value)}
                    className="bg-transparent border-none font-medium text-slate-700 focus:ring-0 cursor-pointer"
                  >
                    {availableVoices.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.accent})</option>
                    ))}
                  </select>
                </div>
                <span className="text-xs text-slate-400">Used for Audio Gen</span>
              </div>

              {/* Content Input */}
              <div className="flex-1 flex flex-col relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">Page Content</label>
                <textarea
                  value={activePage.rawText}
                  onChange={(e) => updateActivePage({ rawText: e.target.value })}
                  className="w-full h-64 p-4 border border-slate-300 rounded-md focus:ring-2 focus:ring-quantum-500 focus:outline-none resize-none font-serif leading-relaxed"
                  placeholder="Paste the text for this page here..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={handleGenerateContent}
                  isLoading={isGenerating}
                  disabled={!activePage.rawText.trim()}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  1. Analyze & Segment
                </Button>

                <Button
                  className="flex-1"
                  variant="secondary"
                  onClick={handleGenerateAudio}
                  isLoading={isGeneratingAudio}
                  disabled={activePage.segments.length === 0}
                >
                  {isGeneratingAudio ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mic className="w-4 h-4 mr-2" />}
                  2. Generate Audio (TTS)
                </Button>
              </div>
            </div>
          </div>

          {/* Results / Segments */}
          <div className="w-full lg:w-1/3 bg-slate-50 p-6 overflow-y-auto border-l border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Segments ({activePage.segments.length})</h3>
              </div>

              {activePage.segments.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No segments yet. Enter text and click Analyze.
                </div>
              )}

              {activePage.segments.map((segment, idx) => (
                <div key={segment.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-slate-100 text-slate-500 text-xs font-bold px-1.5 py-0.5 rounded">{idx + 1}</span>
                    <span className="font-bold text-xs uppercase text-quantum-600">{segment.type}</span>
                    {segment.audioUrl && <span className="ml-auto text-green-500"><Mic size={12} /></span>}
                  </div>
                  <p className="text-slate-700 line-clamp-3 mb-2">{segment.text}</p>
                  <div className="text-xs text-slate-400 italic border-t border-slate-50 pt-1">
                    {segment.visualDescription}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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

// Helper function
const processText = (rawText: string) => {
  const sentences = rawText.match(/[^.!?]+[.!?]|\S+$/g) || [];
  return sentences.map(sentence => {
    const formulas: any[] = [];
    let inlineMatch;
    const inlineRegex = /\$([^$]+)\$/g;
    while ((inlineMatch = inlineRegex.exec(sentence)) !== null) {
      formulas.push({
        content: inlineMatch[1],
        type: 'inline'
      });
    }
    let displayMatch;
    const displayRegex = /\$\$([^$]+)\$\$/g;
    while ((displayMatch = displayRegex.exec(sentence)) !== null) {
      formulas.push({
        content: displayMatch[1],
        type: 'display'
      });
    }
    return {
      text: sentence,
      isFormula: formulas.length > 0,
      formulas,
      narrationText: sentence,
      grammarIssues: [] as any[]
    };
  });
};

function AudiobookCreator() {
  const [currentPage, setCurrentPage] = useState({
    rawText: '',
    processedText: '',
    formulas: [] as any[]
  });
  const [processedSentences, setProcessedSentences] = useState<any[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('grammar');
  const [activeTab, setActiveTab] = useState('edit');

  const updateCurrentPage = (updates: any) => {
    setCurrentPage(prev => ({ ...prev, ...updates }));
  };

  const handleProcessText = async () => {
    if (!currentPage.rawText.trim() || isAnalyzing) return;

    const text = currentPage.rawText;
    const formulas = detectFormulas(text);
    const processedText = processTextWithSSML(text, formulas);

    setCurrentPage(prev => ({
      ...prev,
      processedText,
      formulas
    }));

    setIsAnalyzing(true);
    try {
      const results = await analyzeText(currentPage.rawText);
      setAnalysisResults(results);

      const sentences = processText(currentPage.rawText);
      sentences.forEach((sentence) => {
        const sentenceStart = currentPage.rawText.indexOf(sentence.text);
        if (sentenceStart >= 0) {
          const sentenceEnd = sentenceStart + sentence.text.length;
          sentence.grammarIssues = results.grammarIssues.filter(issue => issue.start >= sentenceStart && issue.end <= sentenceEnd);
        }
      });
      setProcessedSentences(sentences);
      setActiveTab('preview');
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Audiobook Creator</h1>

      <div className="mb-4">
        <textarea className="w-full p-4 border rounded-lg" rows={10} value={currentPage.rawText} onChange={(e) => updateCurrentPage({ rawText: e.target.value })} placeholder="Enter your text here..." />
      </div>

      <button onClick={handleProcessText} disabled={!currentPage.rawText.trim() || isAnalyzing} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
        {isAnalyzing ? 'Processing...' : 'Process & Analyze Text'}
      </button>

      {activeTab === 'preview' && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
            <div className="flex space-x-2">
              <button onClick={() => setActiveAnalysisTab('grammar')} className={`px-4 py-2 rounded-md ${activeAnalysisTab === 'grammar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                Grammar
              </button>
              <button onClick={() => setActiveAnalysisTab('math')} className={`px-4 py-2 rounded-md ${activeAnalysisTab === 'math'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                Math
              </button>
              <button onClick={() => setActiveAnalysisTab('science')} className={`px-4 py-2 rounded-md ${activeAnalysisTab === 'science'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                Science
              </button>
            </div>
          </div>

          {isAnalyzing ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
              <span className="ml-3">Analyzing text...</span>
            </div>
          ) : analysisResults ? (
            <div className="space-y-6">
              {activeAnalysisTab === 'grammar' && (
                <GrammarIssuesViewer issues={analysisResults.grammarIssues} onApplySuggestion={(suggestion) => {
                  const newText = currentPage.rawText.substring(0, suggestion.start) +
                    (suggestion.suggestion || '') +
                    currentPage.rawText.substring(suggestion.end);
                  updateCurrentPage({ rawText: newText });
                }} />
              )}

              {activeAnalysisTab === 'math' && (
                <MathIssuesViewer issues={analysisResults.mathIssues} text={currentPage.rawText} />
              )}

              {activeAnalysisTab === 'science' && (
                <ScienceIssuesViewer issues={analysisResults.scientificIssues} onApplySuggestion={(suggestion) => {
                  const newText = currentPage.rawText.substring(0, suggestion.start) +
                    (suggestion.suggestion || '') +
                    currentPage.rawText.substring(suggestion.end);
                  updateCurrentPage({ rawText: newText });
                }} />
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No analysis results available. Click "Process & Analyze Text" to analyze your content.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Studio;
>>>>>>> eee79d7da06a64aee98daa05ffcfbc5ba43db233
