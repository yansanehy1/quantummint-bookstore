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
