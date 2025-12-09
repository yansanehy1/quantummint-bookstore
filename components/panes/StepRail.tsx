
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  steps: string[];
}

export function StepRail({ steps }: Props) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
        Solution Steps
      </h3>
      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-3 group">
            <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              {i + 1}
            </span>
            <span className="text-slate-700 leading-relaxed">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}



