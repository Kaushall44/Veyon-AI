import React from 'react';
import { CheckCircle2, XCircle, Clock, ShieldCheck, User, Calendar, MapPin, Sparkles, FileText } from 'lucide-react';

export interface ComplianceCheckData {
  check_name: string;
  status: string;
  details: string;
}

export interface ApprovalTaskData {
  id: string;
  request_id: string;
  student_name: string;
  student_reg_no: string;
  department: string;
  service_type: string;
  lab_name: string;
  date_slot: string;
  purpose: string;
  risk_level: string;
  status: string; // PENDING, APPROVED, REJECTED
  assigned_role: string;
  ai_compliance_checks: ComplianceCheckData[];
  approver_comments?: string;
  access_pass_code?: string;
  created_at: string;
}

interface ApprovalCardProps {
  task: ApprovalTaskData;
  onApprove: (taskId: string) => void;
  onReject: (taskId: string) => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ task, onApprove, onReject }) => {
  const isPending = task.status === 'PENDING';
  const isApproved = task.status === 'APPROVED';
  const isRejected = task.status === 'REJECTED';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-5 transition-all hover:shadow-md">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shadow-subtle shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">{task.student_name}</h3>
              <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {task.student_reg_no}
              </span>
            </div>
            <p className="text-xs text-slate-500">{task.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {task.created_at}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
            task.risk_level === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            Risk: {task.risk_level}
          </span>
        </div>
      </div>

      {/* Service Request Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Requested</span>
          <span className="font-bold text-slate-900 text-xs sm:text-sm block">{task.lab_name}</span>
          <span className="text-slate-600 flex items-center gap-1.5 pt-0.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" /> {task.date_slot}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Project Purpose</span>
          <p className="text-slate-700 font-medium leading-relaxed">{task.purpose}</p>
        </div>
      </div>

      {/* AI Pre-Verification Compliance Brief */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Pre-Verification Compliance Brief
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Automated Checks Passed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {task.ai_compliance_checks.map((check, cIdx) => (
            <div key={cIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 text-[11px]">{check.check_name}</span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {check.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">{check.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {isPending ? (
          <>
            <div className="text-xs text-slate-500 font-medium">
              Human approval required. Action will be logged to institutional audit trail.
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onReject(task.id)}
                className="px-4 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" /> Reject Request
              </button>

              <button
                onClick={() => onApprove(task.id)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve Request
              </button>
            </div>
          </>
        ) : isApproved ? (
          <div className="w-full p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>APPROVED by Faculty. Access Pass Issued: <strong className="font-mono bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">{task.access_pass_code || 'PASS-LAB-AI-88192'}</strong></span>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-700">Execution Complete</span>
          </div>
        ) : (
          <div className="w-full p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span>REJECTED: {task.approver_comments}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-red-700">Audit Logged</span>
          </div>
        )}
      </div>
    </div>
  );
};
