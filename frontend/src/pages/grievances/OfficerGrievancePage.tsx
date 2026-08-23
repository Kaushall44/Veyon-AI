import React, { useState } from 'react';
import { Lock, EyeOff, ShieldCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const OfficerGrievancePage: React.FC = () => {
  const [grievances, setGrievances] = useState([
    {
      trackingToken: 'GR-1049',
      category: 'ACADEMIC',
      department: 'Computer Science & Engineering',
      description: 'Lab equipment non-functional in Lab 4 during mid-term evaluation.',
      isAnonymous: true,
      complainantName: 'ANONYMOUS_COMPLAINANT',
      complainantRegNo: '[MASKED BY ANONYMITY POLICY]',
      status: 'UNDER_REVIEW',
      assignedOfficer: 'Prof. S. N. Panda (Grievance Redressal Officer)',
      createdAt: '2026-08-23 14:00',
      slaDeadline: '2026-08-25 14:00',
      resolutionNotes: '',
    },
    {
      trackingToken: 'GR-1042',
      category: 'HOSTEL_FACILITIES',
      department: 'Hostel Block 4 Wing',
      description: 'Hot water geyser non-functional in 3rd floor washroom.',
      isAnonymous: false,
      complainantName: 'Amit Verma (2023-ECE-012)',
      complainantRegNo: '2023-ECE-012',
      status: 'SUBMITTED',
      assignedOfficer: 'Prof. S. N. Panda (Grievance Redressal Officer)',
      createdAt: '2026-08-23 11:30',
      slaDeadline: '2026-08-25 11:30',
      resolutionNotes: '',
    },
  ]);

  const handleUpdateStatus = (token: string, newStatus: string, notes?: string) => {
    setGrievances((prev) =>
      prev.map((g) =>
        g.trackingToken === token
          ? { ...g, status: newStatus, resolutionNotes: notes || g.resolutionNotes }
          : g
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white rounded-2xl p-6 sm:p-8 shadow-card flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-red-400" /> Redressal Cell Officer Console
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Grievance Redressal Officer Desk</h1>
          <p className="text-slate-300 text-xs">Review student & faculty grievances with enforced cryptographic anonymity masking and SLA tracking.</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs font-bold bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
          <span className="text-red-400">{grievances.filter((g) => g.status !== 'RESOLVED').length} Active Grievances</span>
        </div>
      </div>

      {/* Anonymity Enforcement Note */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
        <span>
          <strong>Strict Anonymity Enforcement Active:</strong> Complainants marked as <strong>ANONYMOUS_COMPLAINANT</strong> cannot be unmasked under university policy.
        </span>
      </div>

      {/* Grievances Queue List */}
      <div className="space-y-4">
        {grievances.map((item) => (
          <div
            key={item.trackingToken}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-extrabold text-slate-900 text-sm">#{item.trackingToken}</span>
                {item.isAnonymous ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> ANONYMOUS
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                    IDENTIFIED
                  </span>
                )}
                <span className="text-xs font-bold text-slate-500">[{item.category}]</span>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                item.status === 'RESOLVED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : item.status === 'UNDER_REVIEW'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {item.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Complainant Identity</span>
                <span className="font-bold text-slate-900">{item.complainantName}</span>
                <p className="text-[10px] text-slate-400 font-mono">{item.complainantRegNo}</p>
              </div>

              <div className="space-y-1 md:col-span-2">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Grievance Description</span>
                <p className="text-slate-800 font-medium">{item.description}</p>
              </div>
            </div>

            {item.resolutionNotes && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-bold block">Officer Redressal Resolution Brief:</span>
                <p className="text-[11px] text-emerald-800">{item.resolutionNotes}</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-red-500" /> 48h SLA Deadline: <strong className="text-slate-700">{item.slaDeadline}</strong>
              </div>

              <div className="flex items-center gap-2">
                {item.status === 'SUBMITTED' && (
                  <button
                    onClick={() => handleUpdateStatus(item.trackingToken, 'UNDER_REVIEW')}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-xs"
                  >
                    Begin Officer Inquiry
                  </button>
                )}
                {item.status === 'UNDER_REVIEW' && (
                  <button
                    onClick={() => {
                      const notes = prompt('Enter confidential officer resolution brief:', 'Conducted inquiry with Department Chair. Remedial action completed.');
                      if (notes) handleUpdateStatus(item.trackingToken, 'RESOLVED', notes);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sign-Off Resolution
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficerGrievancePage;
