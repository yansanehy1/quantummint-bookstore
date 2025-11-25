"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const geminiService_1 = require("../../services/geminiService");
const voiceService_1 = require("../../services/voiceService");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const constants_1 = require("../../constants");
const Studio = ({ onPreview }) => {
    // Multi-page State
    const [pages, setPages] = (0, react_1.useState)([{ id: 'p1', title: 'Page 1', rawText: '', segments: [] }]);
    const [activePageId, setActivePageId] = (0, react_1.useState)('p1');
    const [bookTitle, setBookTitle] = (0, react_1.useState)('');
    const [isGenerating, setIsGenerating] = (0, react_1.useState)(false);
    const [isGeneratingAudio, setIsGeneratingAudio] = (0, react_1.useState)(false);
    // Voice State
    const [availableVoices, setAvailableVoices] = (0, react_1.useState)([]);
    const [selectedVoiceId, setSelectedVoiceId] = (0, react_1.useState)('voice-kore');
    // Auto-save / Load Draft
    (0, react_1.useEffect)(() => {
        const savedDraft = localStorage.getItem('studio_draft');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                setPages(draft.pages || [{ id: 'p1', title: 'Page 1', rawText: '', segments: [] }]);
                setBookTitle(draft.bookTitle || '');
                setSelectedVoiceId(draft.selectedVoiceId || 'voice-kore');
            }
            catch (e) {
                console.error("Failed to load draft", e);
            }
        }
        refreshVoices();
    }, []);
    // Save on change
    (0, react_1.useEffect)(() => {
        const draft = { pages, bookTitle, selectedVoiceId };
        localStorage.setItem('studio_draft', JSON.stringify(draft));
    }, [pages, bookTitle, selectedVoiceId]);
    const refreshVoices = () => {
        setAvailableVoices(voiceService_1.VoiceService.getAvailableVoices());
    };
    const activePage = pages.find(p => p.id === activePageId) || pages[0];
    const updateActivePage = (updates) => {
        setPages(prev => prev.map(p => p.id === activePageId ? { ...p, ...updates } : p));
    };
    const handleAddPage = () => {
        const newId = `p${Date.now()}`;
        const newPage = { id: newId, title: `Page ${pages.length + 1}`, rawText: '', segments: [] };
        setPages(prev => [...prev, newPage]);
        setActivePageId(newId);
    };
    const handleDeletePage = () => {
        if (pages.length <= 1)
            return;
        const newPages = pages.filter(p => p.id !== activePageId);
        setPages(newPages);
        setActivePageId(newPages[newPages.length - 1].id);
    };
    const handleGenerateContent = async () => {
        if (!activePage.rawText.trim())
            return;
        setIsGenerating(true);
        try {
            const content = await (0, geminiService_1.generateEducationalContent)(activePage.rawText);
            updateActivePage({ segments: content });
        }
        catch (error) {
            alert("Failed to generate content. Please try again.");
        }
        finally {
            setIsGenerating(false);
        }
    };
    const handleGenerateAudio = async () => {
        if (activePage.segments.length === 0)
            return;
        setIsGeneratingAudio(true);
        try {
            const voice = availableVoices.find(v => v.id === selectedVoiceId);
            const voiceName = voice?.name || 'Kore';
            // Generate audio for each segment sequentially to avoid rate limits
            const updatedSegments = [...activePage.segments];
            for (let i = 0; i < updatedSegments.length; i++) {
                if (!updatedSegments[i].audioUrl) { // Only generate if missing
                    try {
                        const audioUrl = await (0, geminiService_1.generateAudio)(updatedSegments[i].text, voiceName);
                        updatedSegments[i].audioUrl = audioUrl;
                        // Force update periodically to show progress
                        updateActivePage({ segments: [...updatedSegments] });
                    }
                    catch (e) {
                        console.error("Audio gen error for segment " + i, e);
                    }
                }
            }
            updateActivePage({ segments: updatedSegments });
            alert("Audio generation complete!");
        }
        catch (e) {
            alert("Error generating audio.");
        }
        finally {
            setIsGeneratingAudio(false);
        }
    };
    const handlePreview = () => {
        // Flatten all pages into one book content array
        const allContent = pages.reduce((acc, page) => [...acc, ...page.segments], []);
        if (allContent.length === 0) {
            alert("Please generate content before previewing.");
            return;
        }
        const tempBook = {
            id: 'preview-' + Date.now(),
            title: bookTitle || "Untitled Draft",
            author: constants_1.CURRENT_USER.name,
            coverUrl: "https://picsum.photos/seed/draft/300/450",
            description: "Draft content from Studio",
            price: 0,
            category: "Education",
            content: allContent,
            voiceProfileId: selectedVoiceId
        };
        onPreview(tempBook);
    };
    return (<div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="border-b border-slate-200 p-4 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <lucide_react_1.Sparkles className="w-5 h-5 text-quantum-600"/>
                        Audiobook Studio Pro
                    </h2>
                    <p className="text-sm text-slate-500">Multi-Page Creator • Auto-saved</p>
                </div>
                <div className="flex gap-2">
                    <button_1.Button variant="outline" size="sm" onClick={() => alert('Draft is auto-saved!')}>
                        <lucide_react_1.Save className="w-4 h-4 mr-2"/> Saved
                    </button_1.Button>
                    <button_1.Button variant="default" size="sm" onClick={handlePreview}>
                        <lucide_react_1.Play className="w-4 h-4 mr-2"/> Preview Book
                    </button_1.Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

                {/* Page Sidebar */}
                <div className="w-full lg:w-48 bg-slate-50 border-r border-slate-200 flex flex-col">
                    <div className="p-3 border-b border-slate-200 font-bold text-slate-700 text-sm">Pages</div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {pages.map((p, idx) => (<button key={p.id} onClick={() => setActivePageId(p.id)} className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${activePageId === p.id ? 'bg-indigo-100 text-indigo-900 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}>
                                <span>{idx + 1}. {p.title}</span>
                                {p.segments.length > 0 && <lucide_react_1.Check size={12} className="text-green-500"/>}
                            </button>))}
                    </div>
                    <div className="p-3 border-t border-slate-200 flex gap-2">
                        <button onClick={handleAddPage} className="flex-1 flex items-center justify-center p-2 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600" title="Add Page">
                            <lucide_react_1.Plus size={16}/>
                        </button>
                        <button onClick={handleDeletePage} className="flex-1 flex items-center justify-center p-2 bg-white border border-slate-300 rounded hover:bg-red-50 text-red-500" title="Delete Page" disabled={pages.length <= 1}>
                            <lucide_react_1.Trash2 size={16}/>
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col p-6 border-r border-slate-200 overflow-y-auto">
                    <div className="space-y-6 max-w-3xl mx-auto w-full">

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Book Title</label>
                                <input type="text" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="My Amazing Book"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Page Title</label>
                                <input type="text" value={activePage.title} onChange={(e) => updateActivePage({ title: e.target.value })} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
                            </div>
                        </div>

                        {/* Voice Selector */}
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <lucide_react_1.Mic className="text-indigo-600 w-4 h-4"/>
                                <select value={selectedVoiceId} onChange={(e) => setSelectedVoiceId(e.target.value)} className="bg-transparent border-none font-medium text-slate-700 focus:ring-0 cursor-pointer outline-none">
                                    {availableVoices.map(v => (<option key={v.id} value={v.id}>{v.name} ({v.accent})</option>))}
                                </select>
                            </div>
                            <span className="text-xs text-slate-400">Used for Audio Gen</span>
                        </div>

                        {/* Content Input */}
                        <div className="flex-1 flex flex-col relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Page Content</label>
                            <textarea value={activePage.rawText} onChange={(e) => updateActivePage({ rawText: e.target.value })} className="w-full h-64 p-4 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none font-serif leading-relaxed" placeholder="Paste the text for this page here..."/>
                        </div>

                        <div className="flex gap-3">
                            <button_1.Button className="flex-1" onClick={handleGenerateContent} disabled={isGenerating || !activePage.rawText.trim()}>
                                <lucide_react_1.Sparkles className="w-4 h-4 mr-2"/>
                                1. Analyze & Segment
                            </button_1.Button>

                            <button_1.Button className="flex-1" variant="outline" onClick={handleGenerateAudio} disabled={isGeneratingAudio || activePage.segments.length === 0}>
                                {isGeneratingAudio ? <lucide_react_1.Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <lucide_react_1.Mic className="w-4 h-4 mr-2"/>}
                                2. Generate Audio (TTS)
                            </button_1.Button>
                        </div>
                    </div>
                </div>

                {/* Results / Segments */}
                <div className="w-full lg:w-1/3 bg-slate-50 p-6 overflow-y-auto border-l border-slate-200">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-800">Segments ({activePage.segments.length})</h3>
                        </div>

                        {activePage.segments.length === 0 && (<div className="text-center py-10 text-slate-400 text-sm">
                                No segments yet. Enter text and click Analyze.
                            </div>)}

                        {activePage.segments.map((segment, idx) => (<div key={segment.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-slate-100 text-slate-500 text-xs font-bold px-1.5 py-0.5 rounded">{idx + 1}</span>
                                    <span className="font-bold text-xs uppercase text-indigo-600">{segment.type}</span>
                                    {segment.audioUrl && <span className="ml-auto text-green-500"><lucide_react_1.Mic size={12}/></span>}
                                </div>
                                <p className="text-slate-700 line-clamp-3 mb-2">{segment.text}</p>
                                <div className="text-xs text-slate-400 italic border-t border-slate-50 pt-1">
                                    {segment.visualDescription}
                                </div>
                            </div>))}
                    </div>
                </div>
            </div>
        </div>);
};
exports.default = Studio;
