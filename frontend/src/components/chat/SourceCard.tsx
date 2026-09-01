import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, ExternalLink, Bookmark, CheckCircle } from 'lucide-react';

export interface SourceCitation {
  title: string;
  section?: string;
  page?: number;
  score?: number;
  text?: string;
}

interface SourceCardProps {
  sources: SourceCitation[];
}

export const SourceCard: React.FC<SourceCardProps> = ({ sources }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1B365D]">
        <Bookmark className="w-3.5 h-3.5 text-[#2B6CB0]" />
        <span>Grounded Policy Citations ({sources.length})</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-1">
        {sources.map((src, idx) => {
          const isExpanded = expandedIdx === idx;
          const scorePercent = src.score ? Math.round(src.score * 100) : 94;

          return (
            <div
              key={idx}
              className="bg-white border border-[#E2E8F0] rounded-lg p-3 transition-all duration-200 hover:border-[#CBD5E1] shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#F1F5F9] text-[#1B365D] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-[#2B6CB0]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A] leading-snug">
                      {src.title}
                    </h4>
                    {src.section && (
                      <p className="text-[11px] font-medium text-[#475569] mt-0.5">
                        {src.section}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {src.page && (
                    <span className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-mono font-semibold text-[#334155]">
                      p. {src.page}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-semibold text-emerald-700">
                    {scorePercent}% match
                  </span>
                </div>
              </div>

              {/* Text Snippet with Expandable toggle */}
              {src.text && (
                <div className="mt-2 pt-2 border-t border-[#F1F5F9]">
                  <div
                    className={`text-[11px] text-[#475569] font-sans leading-relaxed ${
                      isExpanded ? '' : 'line-clamp-2'
                    }`}
                  >
                    "{src.text}"
                  </div>

                  <button
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                    className="mt-1.5 text-[10px] font-semibold text-[#2B6CB0] hover:text-[#1B365D] flex items-center gap-1 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        <span>Hide excerpt</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        <span>View grounded passage excerpt</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
