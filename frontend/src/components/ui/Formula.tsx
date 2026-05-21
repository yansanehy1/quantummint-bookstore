import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

interface Token {
  symbol: string;
  spoken: string;
  definition: string;
}

interface FormulaProps {
  latex: string;
  className?: string;
  block?: boolean;
  interactive?: boolean;
}

export const Formula: React.FC<FormulaProps> = ({ 
  latex, 
  className = '', 
  block = false,
  interactive = true
}) => {
  const [html, setHtml] = useState<string>(latex);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const handleTokenTap = async (token: Token) => {
    setSelectedToken(token);
    if (interactive) {
      try {
        await api.interaction.logInteraction({
          action: 'tap',
          metadata: { symbol: token.symbol, spoken: token.spoken }
        });
      } catch (error) {
        console.error("Failed to log interaction:", error);
      }
    }
  };

  useEffect(() => {
    // Render formula with KaTeX
    if ((window as any).katex) {
      try {
        const rendered = (window as any).katex.renderToString(latex, {
          throwOnError: false,
          displayMode: block
        });
        setHtml(rendered);
      } catch (e) {
        setHtml(latex);
      }
    }

    // Fetch breakdown metadata if interactive
    if (interactive) {
      const fetchBreakdown = async () => {
        try {
          const response = await api.tts.getFormulaBreakdown(latex);
          setTokens(response.tokens);
        } catch (error) {
          console.error("Failed to fetch formula breakdown:", error);
        }
      };
      fetchBreakdown();
    }
  }, [latex, block, interactive]);

  return (
    <div className="relative group">
      <div 
        className={`font-serif cursor-pointer hover:bg-purple-900/20 transition-colors p-2 rounded ${className}`}
        dangerouslySetInnerHTML={{ __html: html }} 
        onClick={() => interactive && tokens.length > 0 && !selectedToken && handleTokenTap(tokens[0])}
      />
      
      {/* Interactive Breakdown Popover */}
      {selectedToken && (
        <div className="absolute z-10 bottom-full left-0 mb-2 w-64 bg-slate-900 border border-purple-500 rounded-lg shadow-xl p-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-purple-400 font-bold text-lg">{selectedToken.symbol}</h4>
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedToken(null); }}
              className="text-slate-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-slate-300 italic mb-1">"{selectedToken.spoken}"</p>
          <p className="text-sm text-white">{selectedToken.definition}</p>
          
          {tokens.length > 1 && (
            <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
              {tokens.map((t, i) => (
                <button
                  key={i}
                  onClick={() => handleTokenTap(t)}
                  className={`px-2 py-1 text-xs rounded border ${
                    selectedToken.symbol === t.symbol 
                    ? 'bg-purple-600 border-purple-400 text-white' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-purple-500'
                  }`}
                >
                  {t.symbol}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


