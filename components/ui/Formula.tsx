import React, { useState, useEffect } from 'react';

interface FormulaProps {
  latex: string;
  className?: string;
  block?: boolean;
}

export const Formula: React.FC<FormulaProps> = ({ latex, className = '', block = false }) => {
  // Initialize with raw latex as fallback
  const [html, setHtml] = useState<string>(latex);

  useEffect(() => {
    // Check if KaTeX script is loaded globally
    if ((window as any).katex) {
      try {
        const rendered = (window as any).katex.renderToString(latex, {
          throwOnError: false,
          displayMode: block
        });
        setHtml(rendered);
      } catch (e) {
        console.error("KaTeX rendering error:", e);
        // Fallback to text on error
        setHtml(latex);
      }
    }
  }, [latex, block]);

  return (
    <div 
      className={`font-serif ${className}`}
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};


