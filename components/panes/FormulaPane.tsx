
import React from 'react';
import { Formula } from '../ui/Formula';

interface Props {
  latex: string;
}

export function FormulaPane({ latex }: Props) {
  if (!latex) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
        <p className="text-slate-400 font-medium">Formulas will appear here when introduced in the audio.</p>
      </div>
    );
  }

  return (
    <div className="prose max-w-none bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4 block">Current Concept</span>
        <div className="text-3xl text-slate-800 py-4 overflow-x-auto">
          <Formula latex={latex} block />
        </div>
      </div>
    </div>
  );
}



