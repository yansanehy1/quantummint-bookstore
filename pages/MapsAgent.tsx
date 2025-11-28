import React, { useState, useEffect, useRef } from 'react';
import { queryMapsAgent, MapsResponse } from '../services/geminiService';
import Button from '../components/ui/Button';
import { MapPin, Send, Navigation, Info } from 'lucide-react';

const MapsAgent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'agent', text: string, chunks?: any[]}[]>([
    { role: 'agent', text: "Hello! I'm your QuantumNav assistant. Ask me about places, routes, or local gems." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log("Location access denied or error:", error)
      );
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await queryMapsAgent(userMsg, location?.lat, location?.lng);
      setMessages(prev => [...prev, { role: 'agent', text: response.text, chunks: response.chunks }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'agent', text: "Sorry, I had trouble connecting to Google Maps. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 max-w-4xl mx-auto border-x border-slate-200 shadow-sm">
       <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
               <MapPin size={24} />
             </div>
             <div>
               <h2 className="font-bold text-slate-800">QuantumNav Agent</h2>
               <p className="text-xs text-slate-500 flex items-center gap-1">
                 {location ? <span className="text-green-600 flex items-center"><Navigation size={10} className="mr-1"/> Location Active</span> : "Location unknown"}
               </p>
             </div>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-quantum-600 text-white' : 'bg-white border border-slate-200 shadow-sm'}`}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                
                {msg.chunks && msg.chunks.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.chunks.map((chunk: any, cIdx: number) => {
                      if (chunk.maps?.uri) {
                        return (
                           <a key={cIdx} href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="block bg-blue-50 hover:bg-blue-100 p-3 rounded-lg border border-blue-200 transition-colors group">
                             <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                               <MapPin size={16} />
                               {chunk.maps.title || "View on Maps"}
                             </div>
                             {chunk.maps.placeAnswerSources?.[0]?.reviewSnippets?.[0]?.text && (
                               <p className="text-xs text-slate-600 italic line-clamp-2">
                                 "{chunk.maps.placeAnswerSources[0].reviewSnippets[0].text}"
                               </p>
                             )}
                           </a>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-2 items-center">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
               </div>
            </div>
          )}
       </div>

       <div className="p-4 bg-white border-t border-slate-200">
         <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
           <input
             className="flex-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-quantum-500 focus:outline-none"
             placeholder="Ask about restaurants, routes, or places..."
             value={query}
             onChange={e => setQuery(e.target.value)}
           />
           <Button type="submit" disabled={!query.trim() || isLoading} className="rounded-xl">
             <Send size={20} />
           </Button>
         </form>
       </div>
    </div>
  );
};

export default MapsAgent;