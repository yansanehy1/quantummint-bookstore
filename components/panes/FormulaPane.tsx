import React from 'react';
import { Card } from '../ui/Card';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface FormulaPaneProps {
  formula: string | null;
  type: 'inline' | 'block' | 'chemistry';
  isVisible: boolean;
}

export const FormulaPane: React.FC<FormulaPaneProps> = ({ formula, type, isVisible }) => {
  if (!isVisible || !formula) return null;

  return (
    <div className="fixed bottom-32 right-8 w-80 transform transition-all duration-500 ease-in-out">
      <Card className="p-6 bg-white/90 backdrop-blur-md border-2 border-blue-500 shadow-2xl animate-in slide-in-from-right-8">
        <div className="flex flex-col items-center gap-4">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Detected {type === 'chemistry' ? 'Chemical Formula' : 'Mathematical Expression'}
          </span>
          <div className="text-2xl text-slate-900 py-4">
            {type === 'chemistry' ? (
              <span className="font-mono">{formula}</span>
            ) : (
              <BlockMath math={formula} />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
