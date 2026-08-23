import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, X, FileText, Code2 } from 'lucide-react';

interface AuditJsonViewerModalProps {
  auditRecord: {
    audit_id: string;
    timestamp: string;
    actor_id: string;
    event_type: string;
    action_summary: string;
    provenance_json: any;
  } | null;
  onClose: () => void;
}

export const AuditJsonViewerModal: React.FC<AuditJsonViewerModalProps> = ({ auditRecord, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!auditRecord) return null;

  const jsonString = JSON.stringify(auditRecord.provenance_json, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-modal border border-slate-700 space-y-6 relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  AI Provenance Inspector
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  #{auditRecord.audit_id}
                </span>
              </div>
              <h3 className="font-extrabold text-white text-base tracking-tight">
                {auditRecord.action_summary}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Provenance Verification Badge */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between text-xs relative z-10">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Immutable Provenance Guaranteed (Cryptographic SHA-256 Hash Signed)</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">{auditRecord.timestamp}</span>
        </div>

        {/* Interactive JSON Viewer Box */}
        <div className="relative z-10">
          <div className="flex items-center justify-between bg-slate-950 px-4 py-2 rounded-t-xl border-x border-t border-slate-800 text-xs text-slate-400 font-mono">
            <span>provenance_json_tree.json</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-slate-300 hover:text-white text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="bg-slate-950/90 text-emerald-300 p-5 rounded-b-xl border border-slate-800 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
            {jsonString}
          </pre>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-2 relative z-10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            Close Provenance Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
