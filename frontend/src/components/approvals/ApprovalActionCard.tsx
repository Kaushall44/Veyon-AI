import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  User, 
  Calendar, 
  MapPin, 
  Sparkles, 
  QrCode, 
  HelpCircle,
  FileCheck,
  Building,
  Check
} from 'lucide-react';
import { ApprovalTaskData } from './ApprovalCard';

interface ApprovalActionCardProps {
  task: ApprovalTaskData;
  onApprove: (taskId: string, comments?: string) => void;
  onReject: (taskId: string) => void;
  onRequestClarification?: (taskId: string, comments: string) => void;
}

export const ApprovalActionCard: React.FC<ApprovalActionCardProps> = ({
  task,
  onApprove,
  onReject,
  onRequestClarification
}) => {
  const [showClarificationInput, setShowClarificationInput] = useState(false);
  const [clarificationText, setClarificationText] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  const isPending = task.status === 'PENDING';
  const isApproved = task.status === 'APPROVED';
  const isRejected = task.status === 'REJECTED';
  const isClarification = task.status === 'CLARIFICATION_REQUESTED';

  const handleSendClarification = () => {
    if (!clarificationText.trim()) return;
    if (onRequestClarification) {
      onRequestClarification(task.id, clarificationText);
    }
    setShowClarificationInput(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-xs space-y-5 transition-all hover:border-neutral-300">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white font-bold flex items-center justify-center text-sm shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-neutral-900 text-sm sm:text-base">{task.student_name}</h3>
              <span className="font-mono text-xs font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                {task.student_reg_no}
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-medium">{task.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-neutral-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {task.created_at}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
              task.risk_level === 'HIGH'
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-neutral-100 text-neutral-800 border-neutral-300'
            }`}
          >
            Risk: {task.risk_level}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
              isApproved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isRejected
                ? 'bg-red-50 text-red-700 border-red-200'
                : isClarification
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-neutral-50 text-neutral-700 border-neutral-200'
            }`}
          >
            {task.status}
          </span>
        </div>
      </div>

      {/* Service Request Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-neutral-50/80 p-4 rounded-xl border border-neutral-200/80 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Service Requested</span>
          <span className="font-bold text-neutral-900 text-xs sm:text-sm block">{task.lab_name}</span>
          <span className="text-neutral-600 flex items-center gap-1.5 pt-0.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" /> {task.date_slot}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Project Purpose</span>
          <p className="text-neutral-700 font-medium leading-relaxed">{task.purpose}</p>
        </div>
      </div>

      {/* AI Pre-Verification Compliance Brief */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-neutral-700" /> AI Compliance & Prerequisite Verification
          </span>
          <span className="text-[10px] font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
            Prerequisites Validated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {task.ai_compliance_checks.map((check, cIdx) => (
            <div key={cIdx} className="p-2.5 rounded-xl bg-white border border-neutral-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-800 text-[11px]">{check.check_name}</span>
                <span className="text-[10px] font-bold text-neutral-900 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-neutral-700" /> {check.status}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 truncate">{check.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Clarification Input Drawer */}
      {showClarificationInput && isPending && (
        <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2 text-xs">
          <label className="font-bold text-neutral-800 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" /> Request Prerequisite Clarification
          </label>
          <textarea
            value={clarificationText}
            onChange={(e) => setClarificationText(e.target.value)}
            placeholder="Specify what additional documentation or clarification is needed from the student..."
            rows={2}
            className="w-full text-xs p-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setShowClarificationInput(false)}
              className="px-3 py-1 text-xs text-neutral-600 hover:text-neutral-900 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSendClarification}
              className="px-3 py-1 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
            >
              Submit Clarification Request
            </button>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {isPending ? (
          <>
            <div className="text-xs text-neutral-500 font-medium">
              Human sign-off required. Digital credential pass will be generated upon approval.
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowClarificationInput(!showClarificationInput)}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold transition-all flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Clarify
              </button>

              <button
                onClick={() => onReject(task.id)}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-300 text-neutral-800 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-semibold transition-all flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>

              <button
                onClick={() => onApprove(task.id)}
                className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Sign-off
              </button>
            </div>
          </>
        ) : isApproved ? (
          <div className="w-full p-3.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="block text-white font-bold">Approved by Authorized Signatory</span>
                <span className="text-[11px] text-neutral-300">
                  Verifiable Access Pass: <strong className="font-mono text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/20">{task.access_pass_code || 'PASS-LAB-AI-88192'}</strong>
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowQrModal(true)}
              className="px-3 py-1 bg-white text-neutral-900 rounded-lg text-xs font-bold hover:bg-neutral-100 flex items-center gap-1.5 shrink-0"
            >
              <QrCode className="w-3.5 h-3.5" /> View QR Pass
            </button>
          </div>
        ) : isClarification ? (
          <div className="w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>CLARIFICATION REQUESTED: {task.approver_comments}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-amber-800">Pending Student Reply</span>
          </div>
        ) : (
          <div className="w-full p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-neutral-900 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-neutral-700" />
              <span>REJECTED: {task.approver_comments}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-neutral-600">Audit Logged</span>
          </div>
        )}
      </div>

      {/* Verifiable QR Pass Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-neutral-200 text-center">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2 text-left">
                <ShieldCheck className="w-5 h-5 text-neutral-900" />
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">Official Access Pass</h4>
                  <p className="text-[10px] text-neutral-500">SOA University Verified Credential</p>
                </div>
              </div>
              <button onClick={() => setShowQrModal(false)} className="text-neutral-400 hover:text-neutral-900 text-sm font-bold">
                ✕
              </button>
            </div>

            {/* Mock QR Visual */}
            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 flex flex-col items-center justify-center space-y-2">
              <QrCode className="w-28 h-28 text-neutral-900" />
              <span className="font-mono text-xs font-bold text-neutral-900 bg-white px-2 py-1 rounded border border-neutral-200">
                {task.access_pass_code || 'PASS-LAB-AI-88192'}
              </span>
            </div>

            <div className="text-xs text-neutral-600 text-left space-y-1 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <p><strong>Student:</strong> {task.student_name} ({task.student_reg_no})</p>
              <p><strong>Facility:</strong> {task.lab_name}</p>
              <p><strong>Time Slot:</strong> {task.date_slot}</p>
              <p><strong>Security Status:</strong> <span className="text-emerald-700 font-bold">VALID & SIGNED</span></p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
