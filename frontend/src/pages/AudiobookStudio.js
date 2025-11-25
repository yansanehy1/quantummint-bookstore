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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AudiobookStudioPage;
const react_1 = __importStar(require("react"));
const Studio_1 = __importDefault(require("../components/audiobook/Studio"));
const Reader_1 = __importDefault(require("../components/audiobook/Reader"));
const geminiService_1 = require("../services/geminiService");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
function AudiobookStudioPage() {
    const [apiKey, setApiKey] = (0, react_1.useState)('');
    const [isAuthenticated, setIsAuthenticated] = (0, react_1.useState)(false);
    const [isValidating, setIsValidating] = (0, react_1.useState)(false);
    const [authError, setAuthError] = (0, react_1.useState)('');
    const [previewBook, setPreviewBook] = (0, react_1.useState)(null);
    const [previewOpen, setPreviewOpen] = (0, react_1.useState)(false);
    const handleAuth = async () => {
        if (!apiKey)
            return;
        setIsValidating(true);
        setAuthError('');
        try {
            // Simple validation call
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            if (res.ok) {
                (0, geminiService_1.setGeminiApiKey)(apiKey);
                setIsAuthenticated(true);
            }
            else {
                throw new Error('Invalid API Key');
            }
        }
        catch (e) {
            setAuthError('Invalid API Key. Please check and try again.');
        }
        finally {
            setIsValidating(false);
        }
    };
    const handleBookPreview = (book) => {
        setPreviewBook(book);
        setPreviewOpen(true);
    };
    if (!isAuthenticated) {
        return (<div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden border border-slate-700">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <lucide_react_1.Fingerprint className="text-indigo-600 w-8 h-8"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Studio Authentication</h2>
            <p className="text-gray-500 text-sm mt-2">Enter your Google Gemini API Key to unlock the studio.</p>
          </div>
          <div className="space-y-4">
            <input_1.Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Paste AIza... key here"/>
            <button_1.Button onClick={handleAuth} disabled={isValidating} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg transition flex items-center justify-center gap-2">
              {isValidating ? <lucide_react_1.Loader2 className="animate-spin"/> : <span>Enter Studio</span>}
            </button_1.Button>
            {authError && (<div className="text-red-500 text-xs text-center bg-red-50 p-2 rounded">{authError}</div>)}
          </div>
          <div className="mt-6 text-center text-xs text-gray-400 border-t pt-4">
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="hover:text-indigo-600 underline">Get a key from Google AI Studio</a>
          </div>
        </div>
      </div>);
    }
    return (<div className="h-screen flex flex-col">
      <Studio_1.default onPreview={handleBookPreview}/>

      {previewOpen && previewBook && (<Reader_1.default book={previewBook} onClose={() => setPreviewOpen(false)}/>)}
    </div>);
}
