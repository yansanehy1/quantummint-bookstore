
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface Props {
  src: string;
}

export function VisualPane({ src }: Props) {
  if (!src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
            <ImageIcon size={32} className="opacity-50" />
        </div>
        <p className="font-medium">Visuals appear at key moments.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-black rounded-xl overflow-hidden shadow-lg relative group animate-in zoom-in-95 duration-700">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
      <img 
        src={src} 
        alt="visual aid" 
        className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" 
      />
    </div>
  );
}



