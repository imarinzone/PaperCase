import React from 'react';
import { Smartphone, Printer, Scissors, Zap } from 'lucide-react';

interface Props {
  onHome: () => void;
}

export const Header: React.FC<Props> = ({ onHome }) => {
  return (
    <header className="w-full border-b border-white/5 bg-dark-950/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={onHome} 
          className="flex items-center gap-3 group focus:outline-none"
        >
          {/* Anime-style minimal icon: Rotated diamond with filled zap */}
          <div className="relative w-8 h-8 flex items-center justify-center transform rotate-45 bg-zinc-900 border border-brand-500/30 group-hover:border-brand-400 group-hover:bg-brand-500/10 transition-all duration-300 overflow-hidden shadow-[0_0_15px_rgba(14,165,233,0.1)] group-hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]">
             <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="transform -rotate-45">
                <Zap size={16} className="text-brand-400 fill-brand-400" />
             </div>
          </div>
          
          <div className="flex flex-col items-start -space-y-1">
            <span className="text-xl font-bold font-['Oswald'] italic tracking-wider text-white group-hover:text-brand-50 transition-colors uppercase">
              Skin<span className="text-brand-500">Forge</span>
            </span>
            <span className="text-[7px] text-zinc-500 uppercase tracking-[0.3em] group-hover:text-brand-400/80 transition-colors font-medium ml-0.5">
              Project
            </span>
          </div>
        </button>
        
        <div className="hidden md:flex items-center gap-6 text-zinc-400 text-sm font-medium">
          <button 
            onClick={onHome}
            className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
          >
            <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono">1</span>
            <span>Select Model</span>
          </button>
          <div className="w-8 h-px bg-white/10"></div>
          <div className="flex items-center gap-2 text-brand-400">
            <span className="bg-brand-500/20 text-brand-400 border border-brand-500/50 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono">2</span>
            <span>Customize</span>
          </div>
          <div className="w-8 h-px bg-white/10"></div>
          <div className="flex items-center gap-2">
            <Printer size={14} />
            <span>Print & Cut</span>
          </div>
        </div>

        <button className="text-[10px] font-mono font-semibold bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded border border-white/5 cursor-default tracking-widest uppercase">
          v1.0
        </button>
      </div>
    </header>
  );
};