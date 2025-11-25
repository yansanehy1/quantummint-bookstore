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
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const MapsAgent = () => {
    const [query, setQuery] = (0, react_1.useState)('');
    const [messages, setMessages] = (0, react_1.useState)([
        { role: 'agent', text: "Hello! I'm your QuantumNav assistant. Ask me about places, routes, or local gems." }
    ]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [location, setLocation] = (0, react_1.useState)(undefined);
    const scrollRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }, (error) => console.log("Location access denied or error:", error));
        }
    }, []);
    (0, react_1.useEffect)(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);
    const handleSend = async () => {
        if (!query.trim())
            return;
        const userMsg = query;
        setQuery('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);
        try {
            const response = await (0, geminiService_1.queryMapsAgent)(userMsg, location?.lat, location?.lng);
            setMessages(prev => [...prev, { role: 'agent', text: response.text, chunks: response.chunks }]);
        }
        catch (e) {
            setMessages(prev => [...prev, { role: 'agent', text: "Sorry, I had trouble connecting to Google Maps. Please check your connection." }]);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="h-full flex flex-col bg-slate-50 max-w-4xl mx-auto border-x border-slate-200 shadow-sm">
            <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <lucide_react_1.MapPin size={24}/>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800">QuantumNav Agent</h2>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            {location ? <span className="text-green-600 flex items-center"><lucide_react_1.Navigation size={10} className="mr-1"/> Location Active</span> : "Location unknown"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg, idx) => (<div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 shadow-sm'}`}>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                            {msg.chunks && msg.chunks.length > 0 && (<div className="mt-3 space-y-2">
                                    {msg.chunks.map((chunk, cIdx) => {
                    if (chunk.web?.uri) {
                        return (<a key={cIdx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="block bg-blue-50 hover:bg-blue-100 p-3 rounded-lg border border-blue-200 transition-colors group">
                                                    <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                                                        <lucide_react_1.MapPin size={16}/>
                                                        {chunk.web.title || "View Source"}
                                                    </div>
                                                </a>);
                    }
                    return null;
                })}
                                </div>)}
                        </div>
                    </div>))}
                {isLoading && (<div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-2 items-center">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>)}
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                    <input className="flex-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Ask about restaurants, routes, or places..." value={query} onChange={e => setQuery(e.target.value)}/>
                    <button_1.Button type="submit" disabled={!query.trim() || isLoading} className="rounded-xl">
                        <lucide_react_1.Send size={20}/>
                    </button_1.Button>
                </form>
            </div>
        </div>);
};
exports.default = MapsAgent;
