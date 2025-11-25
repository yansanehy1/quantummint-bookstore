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
exports.default = CreateBook;
const react_1 = __importStar(require("react"));
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
const wouter_1 = require("wouter");
const useAutoSaveForm_1 = require("../../hooks/useAutoSaveForm");
function CreateBook() {
    const [, setLocation] = (0, wouter_1.useLocation)();
    const [coverImage, setCoverImage] = (0, react_1.useState)(null);
    const [audioFile, setAudioFile] = (0, react_1.useState)(null);
    const [audioFileName, setAudioFileName] = (0, react_1.useState)('');
    const [currentPageContent, setCurrentPageContent] = (0, react_1.useState)('');
    const [activeTab, setActiveTab] = (0, react_1.useState)('details');
    const [previewMode, setPreviewMode] = (0, react_1.useState)(false);
    const categories = [
        'Science',
        'Mathematics',
        'Literature',
        'History',
        'Technology',
        'Arts',
        'Languages',
        'Business',
    ];
    const initialData = {
        title: '',
        description: '',
        category: '',
        priceUSD: '',
        priceSLL: '',
        coverPreview: '',
        pages: [],
    };
    const saveFn = async (data) => {
        try {
            const res = await fetch('/api/books/drafts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ draft: data }),
            });
            if (!res.ok)
                console.warn('Draft save responded with', res.status);
        }
        catch (err) {
            console.warn('Failed to persist draft to server (kept locally):', err);
        }
    };
    const { formData, setFormData, isSaving, saveSuccess, restoredFromStorage, restoredAt, handleAutoSave, handleManualSave, handleInputChange, } = (0, useAutoSaveForm_1.useAutoSaveForm)({ initialData, saveFn, storageKey: 'createBookDraft', autoLoadFromStorage: true });
    // derived
    const pages = formData.pages;
    const handleCoverImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                const preview = event.target?.result;
                handleInputChange('coverPreview', preview);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleAudioFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setAudioFile(file);
            setAudioFileName(file.name);
        }
    };
    const handleAddPage = () => {
        if (currentPageContent.trim()) {
            const newPage = {
                id: `page-${Date.now()}`,
                pageNumber: pages.length + 1,
                content: currentPageContent,
                audioUrl: audioFile ? audioFileName : undefined,
            };
            setFormData((prev) => ({ ...prev, pages: [...prev.pages, newPage] }));
            setCurrentPageContent('');
            setAudioFile(null);
            setAudioFileName('');
        }
    };
    const handleRemovePage = (id) => {
        setFormData((prev) => {
            const updated = prev.pages
                .filter((p) => p.id !== id)
                .map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
            return { ...prev, pages: updated };
        });
    };
    const handlePublish = async () => {
        if (!formData.title || !formData.category || !formData.priceUSD || formData.pages.length === 0) {
            alert('Please fill in all required fields and add at least one page');
            return;
        }
        const bookData = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            priceUSD: formData.priceUSD,
            priceSLL: formData.priceSLL,
            pages: formData.pages,
            coverImage: formData.coverPreview,
        };
        console.log('Publishing book:', bookData);
        alert("Book published successfully! It's now available in your seller dashboard.");
        setLocation('/seller-dashboard');
    };
    const indicatorText = isSaving ? 'Saving...' : saveSuccess ? 'Saved' : 'All changes saved locally';
    return (<div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation('/')}>
            <lucide_react_1.BookOpen className="w-8 h-8 text-amber-600"/>
            <h1 className="text-2xl font-bold text-gray-900">Sierra Books</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <button onClick={() => setLocation('/')} className="text-gray-700 hover:text-amber-600 font-medium">Home</button>
            <button onClick={() => setLocation('/dashboard')} className="text-gray-700 hover:text-amber-600 font-medium">Dashboard</button>
            <button onClick={() => setLocation('/seller-dashboard')} className="text-gray-700 hover:text-amber-600 font-medium">Seller Hub</button>
          </nav>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create New Book</h1>
          <p className="text-xl text-gray-600">Upload your educational content and start earning from readers across Sierra Leone.</p>
        </section>

        {/* Tabs */}
        <section className="mb-8">
          <div className="flex gap-4 border-b border-gray-200 mb-8">
            <button onClick={() => setActiveTab('details')} className={`px-6 py-3 font-semibold transition ${activeTab === 'details'
            ? 'text-amber-600 border-b-2 border-amber-600'
            : 'text-gray-600 hover:text-gray-900'}`}>
              Book Details
            </button>
            <button onClick={() => setActiveTab('pages')} className={`px-6 py-3 font-semibold transition ${activeTab === 'pages'
            ? 'text-amber-600 border-b-2 border-amber-600'
            : 'text-gray-600 hover:text-gray-900'}`}>
              Pages ({pages.length})
            </button>
            <button onClick={() => setPreviewMode(!previewMode)} className="ml-auto px-6 py-3 font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <lucide_react_1.Eye className="w-4 h-4"/>
              {previewMode ? 'Edit' : 'Preview'}
            </button>
          </div>
        </section>

        {/* Book Details Tab */}
        {activeTab === 'details' && !previewMode && (<section className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Cover Image */}
            <div>
              <card_1.Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Book Cover</h3>
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg h-64 flex items-center justify-center mb-4 overflow-hidden">
                  {formData.coverPreview ? (<img src={formData.coverPreview} alt="Book cover" className="w-full h-full object-cover"/>) : (<div className="text-center">
                      <lucide_react_1.Upload className="w-12 h-12 text-gray-400 mx-auto mb-2"/>
                      <p className="text-sm text-gray-600">No image yet</p>
                    </div>)}
                </div>
                <label className="block">
                  <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden"/>
                  <button_1.Button variant="outline" className="w-full cursor-pointer">
                    <lucide_react_1.Upload className="w-4 h-4 mr-2"/>
                    Upload Cover
                  </button_1.Button>
                </label>
                <p className="text-xs text-gray-500 mt-2">Recommended: 300x450px, JPG or PNG</p>
              </card_1.Card>
            </div>

            {/* Book Details Form */}
            <div className="md:col-span-2 space-y-6">
              <card_1.Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Book Title *</label>
                    <input_1.Input placeholder="Enter book title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="py-2 h-10"/>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea placeholder="Describe your book content, target audience, and learning objectives..." value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium h-24"/>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium h-10" aria-label="Category">
                      <option value="">Select a category...</option>
                      {categories.map((cat) => (<option key={cat} value={cat}>
                          {cat}
                        </option>))}
                    </select>
                  </div>
                </div>
              </card_1.Card>

              <card_1.Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (USD) *</label>
                    <input_1.Input type="number" placeholder="4.99" value={formData.priceUSD} onChange={(e) => handleInputChange('priceUSD', e.target.value)} step="0.01" min="0" className="py-2 h-10"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (SLL)</label>
                    <input_1.Input type="number" placeholder="5000" value={formData.priceSLL} onChange={(e) => handleInputChange('priceSLL', e.target.value)} step="100" min="0" className="py-2 h-10"/>
                  </div>
                </div>
              </card_1.Card>
            </div>
          </section>)}

        {/* Pages Tab */}
        {activeTab === 'pages' && !previewMode && (<section className="mb-12">
            <card_1.Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">Add Book Pages</h3>

              {/* Page Editor */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-4">Page {pages.length + 1}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Page Content</label>
                    <textarea placeholder="Enter the text content for this page..." value={currentPageContent} onChange={(e) => setCurrentPageContent(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium h-32"/>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Audio File (Optional)</label>
                    <div className="flex gap-3">
                      <label className="flex-1">
                        <input type="file" accept="audio/*" onChange={handleAudioFileChange} className="hidden"/>
                        <button_1.Button variant="outline" className="w-full cursor-pointer">
                          <lucide_react_1.Upload className="w-4 h-4 mr-2"/>
                          {audioFileName || 'Upload Audio'}
                        </button_1.Button>
                      </label>
                      {audioFile && (<button_1.Button onClick={() => {
                    setAudioFile(null);
                    setAudioFileName('');
                }} variant="outline">
                          <lucide_react_1.X className="w-4 h-4"/>
                        </button_1.Button>)}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Supported: MP3, WAV, OGG (max 50MB)</p>
                  </div>

                  <button_1.Button onClick={handleAddPage} disabled={!currentPageContent.trim()} className="w-full bg-amber-600 hover:bg-amber-700">
                    <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                    Add Page
                  </button_1.Button>
                </div>
              </div>

              {/* Pages List */}
              {pages.length > 0 && (<div>
                  <h4 className="font-bold text-gray-900 mb-4">Added Pages</h4>
                  <div className="space-y-3">
                    {pages.map((page) => (<card_1.Card key={page.id} className="p-4 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Page {page.pageNumber}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{page.content}</p>
                          {page.audioUrl && (<p className="text-xs text-blue-600 mt-1">🎵 Audio: {page.audioUrl}</p>)}
                        </div>
                        <button_1.Button onClick={() => handleRemovePage(page.id)} variant="outline" size="sm">
                          <lucide_react_1.X className="w-4 h-4"/>
                        </button_1.Button>
                      </card_1.Card>))}
                  </div>
                </div>)}
            </card_1.Card>
          </section>)}

        {/* Preview Mode */}
        {previewMode && (<section className="mb-12">
            <card_1.Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">Book Preview</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg h-80 flex items-center justify-center mb-4">
                    {formData.coverPreview ? (<img src={formData.coverPreview} alt="Book cover" className="w-full h-full object-cover rounded-lg"/>) : (<div className="text-center">
                        <lucide_react_1.BookOpen className="w-16 h-16 text-gray-400 mx-auto"/>
                      </div>)}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-3xl font-bold text-gray-900 mb-2">{formData.title || 'Book Title'}</h4>
                  <p className="text-gray-600 mb-4">{formData.category || 'Category'}</p>
                  <p className="text-gray-700 mb-6">{formData.description || 'Book description will appear here'}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <card_1.Card className="p-4 bg-green-50">
                      <p className="text-sm text-gray-600">Price (USD)</p>
                      <p className="text-2xl font-bold text-green-600">${formData.priceUSD || '0.00'}</p>
                    </card_1.Card>
                    <card_1.Card className="p-4 bg-blue-50">
                      <p className="text-sm text-gray-600">Price (SLL)</p>
                      <p className="text-2xl font-bold text-blue-600">Le {formData.priceSLL || '0'}</p>
                    </card_1.Card>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Book Statistics</p>
                    <p className="text-gray-600">Total Pages: {pages.length}</p>
                    <p className="text-gray-600">Pages with Audio: {pages.filter((p) => p.audioUrl).length}</p>
                  </div>
                </div>
              </div>
            </card_1.Card>
          </section>)}

        {/* Action Buttons */}
        <section className="flex gap-4 justify-end mb-12">
          <button_1.Button onClick={handleManualSave} variant="outline" className="px-8">
            <lucide_react_1.Save className="w-4 h-4 mr-2"/>
            Save Draft
          </button_1.Button>
          <button_1.Button onClick={handlePublish} disabled={!formData.title || !formData.category || !formData.priceUSD || pages.length === 0} className="bg-green-600 hover:bg-green-700 px-8">
            <lucide_react_1.BookOpen className="w-4 h-4 mr-2"/>
            Publish Book
          </button_1.Button>
        </section>
      </main>
    </div>);
}
