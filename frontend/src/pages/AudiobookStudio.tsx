import React, { useState } from 'react';
import Studio from '../components/audiobook/Studio';
import Reader from '../components/audiobook/Reader';
import { setGeminiApiKey } from '../services/geminiService';
import { Book } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Fingerprint, Loader2 } from 'lucide-react';

export default function AudiobookStudioPage() {
  const [apiKey, setApiKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [authError, setAuthError] = useState('');

  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuth = async () => {
    if (!apiKey) return;
    setIsValidating(true);
    setAuthError('');

    try {
      // Simple validation call
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (res.ok) {
        setGeminiApiKey(apiKey);
        setIsAuthenticated(true);
        setShowAuthModal(false);
      } else {
        throw new Error('Invalid API Key');
      }
    } catch (e) {
      setAuthError('Invalid API Key. Please check and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleBookPreview = (book: Book) => {
    setPreviewBook(book);
    setPreviewOpen(true);
  };

  return (
    <div className="h-screen flex flex-col relative">
      <Studio
        onPreview={handleBookPreview}
        onRequireAuth={() => setShowAuthModal(true)}
      />

      {previewOpen && previewBook && (
        <Reader book={previewBook} onClose={() => setPreviewOpen(false)} />
      )}

      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden border border-slate-700">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Fingerprint className="text-indigo-600 w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Studio Authentication</h2>
              <p className="text-gray-500 text-sm mt-2">Enter your Google Gemini API Key to continue generating content.</p>
            </div>
            <div className="space-y-4">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="Paste AIza... key here"
              />
              <Button
                onClick={handleAuth}
                disabled={isValidating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg transition flex items-center justify-center gap-2"
              >
                {isValidating ? <Loader2 className="animate-spin" /> : <span>Unlock Features</span>}
              </Button>
              {authError && (
                <div className="text-red-500 text-xs text-center bg-red-50 p-2 rounded">{authError}</div>
              )}
            </div>
            <div className="mt-6 text-center text-xs text-gray-400 border-t pt-4">
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="hover:text-indigo-600 underline">Get a key from Google AI Studio</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
