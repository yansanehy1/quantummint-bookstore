import React, { useEffect, useRef } from 'react';

interface MathRendererProps {
  formula: string;
}

declare global {
  interface Window {
    katex: any;
  }
}

const MathRenderer: React.FC<MathRendererProps> = ({ formula }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && window.katex) {
      try {
        window.katex.render(formula, containerRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (e) {
        console.error("KaTeX render error:", e);
        containerRef.current.innerText = formula;
      }
    }
  }, [formula]);

  return <div ref={containerRef} className="text-2xl md:text-3xl text-slate-800 font-serif py-4" />;
};

export default MathRenderer;