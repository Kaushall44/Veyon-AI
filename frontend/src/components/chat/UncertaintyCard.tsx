import React from 'react';
import { ShieldAlert, HelpCircle, ArrowRight, FileText, UserCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UncertaintyCardProps {
  query?: string;
  similarityScore?: number;
  refusalReason?: string;
  onEscalate?: () => void;
}

export const UncertaintyCard: React.FC<UncertaintyCardProps> = ({
  query = 'What is the refund rule for dropping a course in 6th semester?',
  similarityScore = 0.54,
  refusalReason,
  onEscalate,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-amber-50/90 border border-amber-200 text-amber-950 rounded-2xl p-5 sm:p-6 shadow-card space-y-4 max-w-xl mx-auto animate-fade-in">
      {/* Refusal Header */}
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center font-bold shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
              Zero-Hallucination Guardrail Active
            </span>
            <h4 className="font-bold text-slate-900 text-sm tracking-tight">
              Unable to Verify in Official Institutional Records
            </h4>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
          Similarity: {(similarityScore * 100).toFixed(0)}% (&lt;70%)
        </span>
      </div>

      {/* Explanation & Policy Statement */}
      <div className="space-y-2 text-xs leading-relaxed text-slate-700">
        <p>
          Our hybrid vector RAG search over official 2025/2026 SOA University policy PDFs did not locate an authoritative passage to answer your question:
        </p>

        <div className="p-3 bg-white/80 rounded-xl border border-amber-200 font-mono text-[11px] text-amber-900 italic">
          "{query}"
        </div>

        <p className="text-[11px] text-slate-600">
          Under the <strong>SOA Nexus Zero-Hallucination Policy</strong>, our AI engine refuses to fabricate or guess ungrounded institutional rules.
        </p>
      </div>

      {/* Escalation CTA Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-amber-200/80">
        <span className="text-[11px] font-semibold text-amber-800 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Need official confirmation?
        </span>

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => navigate('/services/grievance')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> File Helpdesk Inquiry
          </button>

          <button
            onClick={onEscalate || (() => navigate('/requests'))}
            className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" /> Ask Academic Officer
          </button>
        </div>
      </div>
    </div>
  );
};
