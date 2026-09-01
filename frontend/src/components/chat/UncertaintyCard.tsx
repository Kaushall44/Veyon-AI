import React from 'react';
import { ShieldAlert, HelpCircle, ArrowRight, FileText, UserCheck, Sparkles, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DepartmentContact {
  office: string;
  campus: string;
  email: string;
  phone: string;
  timings?: string;
}

interface UncertaintyCardProps {
  query?: string;
  similarityScore?: number;
  refusalReason?: string;
  departmentContact?: DepartmentContact;
  onEscalate?: () => void;
}

export const UncertaintyCard: React.FC<UncertaintyCardProps> = ({
  query = 'What is the fee refund for 3rd semester dropout?',
  similarityScore = 0.42,
  refusalReason,
  departmentContact = {
    office: 'Dean of Academics Office',
    campus: 'ITER Campus, Jagamara, Khandagiri, Bhubaneswar',
    email: 'academic.dean@soa.ac.in',
    phone: '+91-674-2350181',
    timings: 'Mon - Fri, 09:30 AM - 05:00 PM',
  },
  onEscalate,
}) => {
  const navigate = useNavigate();
  const matchPercent = Math.round(similarityScore * 100);

  return (
    <div className="bg-amber-50/90 border border-amber-200 text-amber-950 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 max-w-xl animate-fade-in">
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
              Ungrounded Inquiry — Refusing to Guess
            </h4>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
          Match: {matchPercent}% (&lt; 82% threshold)
        </span>
      </div>

      {/* Explanation & Policy Statement */}
      <div className="space-y-2 text-xs leading-relaxed text-slate-700">
        <p>
          Our high-dimensional vector search across official SOA University Academic Regulations did not locate an authoritative policy passage for your question:
        </p>

        <div className="p-3 bg-white/90 rounded-xl border border-amber-200 font-mono text-[11px] text-amber-900 italic">
          "{query}"
        </div>

        <p className="text-[11px] text-slate-600">
          Under the <strong>SOA Nexus Zero-Hallucination Policy</strong>, our AI refuses to fabricate or speculate on ungrounded institutional rules.
        </p>
      </div>

      {/* Official Department Contact Box */}
      {departmentContact && (
        <div className="p-3.5 bg-white/95 rounded-xl border border-amber-200/90 space-y-2">
          <span className="text-[11px] font-bold text-slate-900 block flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            Official Departmental Contact
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div>
              <span className="font-semibold text-slate-800 block">{departmentContact.office}</span>
              <span className="text-[10px] text-slate-500">{departmentContact.campus}</span>
            </div>
            <div className="space-y-1">
              <a
                href={`mailto:${departmentContact.email}`}
                className="flex items-center gap-1 text-[#2B6CB0] hover:underline font-medium"
              >
                <Mail className="w-3 h-3" /> {departmentContact.email}
              </a>
              <a
                href={`tel:${departmentContact.phone}`}
                className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-mono text-[10px]"
              >
                <Phone className="w-3 h-3" /> {departmentContact.phone}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Escalation CTA Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-amber-200/80">
        <span className="text-[11px] font-semibold text-amber-800 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Need manual human review?
        </span>

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => navigate('/services/grievance')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> File Ticket
          </button>

          <button
            onClick={onEscalate || (() => navigate('/requests'))}
            className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" /> Ask Academic Desk
          </button>
        </div>
      </div>
    </div>
  );
};
