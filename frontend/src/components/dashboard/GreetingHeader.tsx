import React, { useState } from 'react';
import { Sparkles, Calendar as CalendarIcon, Clock, ArrowRight, ShieldCheck, Search, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface GreetingHeaderProps {
  onOpenAssistant: (prompt?: string) => void;
}

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({ onOpenAssistant }) => {
  const { user } = useAuth();
  const [quickSearchInput, setQuickSearchInput] = useState('');

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchInput.trim()) {
      onOpenAssistant(quickSearchInput.trim());
    } else {
      onOpenAssistant('What is the procedure to book the Advanced AI Lab?');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 relative overflow-hidden font-sans">
      {/* Delicate Modern Ambient Background Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-100/60 via-purple-50/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        {/* Top Eyebrow Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AGENTIC CO-PILOT v2.5 ACTIVE</span>
            </div>

            <span className="text-xs text-slate-500 font-mono font-medium flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" /> {currentDate}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              ITER Bhubaneswar
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              96.4% SLA Score
            </span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight flex items-center flex-wrap gap-2">
              <span>Welcome back,</span>
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                {user?.name || 'Kaushal Raj Gupta'}
              </span>
              <span className="animate-wave inline-block hover:scale-125 transition-transform origin-bottom-right cursor-pointer select-none">
                👋
              </span>
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl font-normal">
              B.Tech Computer Science & Engineering (2nd Year) • Reg No: <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">2023-CSE-042</span>. Your institutional AI copilot is online.
            </p>
          </div>

          {/* Big Tech Inline AI Prompt Bar */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSearchSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 shadow-xs focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all space-y-2">
              <div className="flex items-center gap-2 px-2">
                <Cpu className="w-4 h-4 text-indigo-600 shrink-0" />
                <input
                  type="text"
                  value={quickSearchInput}
                  onChange={(e) => setQuickSearchInput(e.target.value)}
                  placeholder="Ask AI Copilot (e.g. Book AI Lab tomorrow 2-4 PM)..."
                  className="w-full bg-transparent text-xs font-medium text-slate-900 placeholder-slate-400 outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                <span className="text-slate-400 text-[10px]">Press Enter to launch RAG agent</span>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Query AI</span>
                  <ArrowRight className="w-3 h-3 text-indigo-400" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
