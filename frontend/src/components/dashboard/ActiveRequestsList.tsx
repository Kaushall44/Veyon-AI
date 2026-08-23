import React from 'react';
import { Clock, CheckCircle2, FileText, ChevronRight, Filter, ShieldCheck, Zap } from 'lucide-react';

interface ActiveRequestsListProps {
  onViewRequestDetail: (requestId: string) => void;
}

export const ActiveRequestsList: React.FC<ActiveRequestsListProps> = ({ onViewRequestDetail }) => {
  const mockRequests = [
    {
      id: 'LB-4019',
      title: 'Advanced AI Lab Reservation',
      serviceType: 'LAB_BOOKING',
      details: 'Tomorrow (24 Aug), 2:00 PM – 4:00 PM | Purpose: B.Tech Capstone Model Training',
      status: 'PENDING_APPROVAL',
      statusLabel: 'Pending Faculty Sign-off',
      approver: 'Prof. A. K. Samanta (Lab In-Charge)',
      updatedAt: '10 mins ago',
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
      pulseColor: 'bg-amber-400',
    },
    {
      id: 'CERT-881',
      title: 'Bonafide Certificate PDF',
      serviceType: 'CERTIFICATE',
      details: 'Purpose: e-Kalyan Scholarship & Passport Application',
      status: 'COMPLETED',
      statusLabel: 'Approved & QR Signed',
      approver: 'Academic Admin Officer',
      updatedAt: '2 hours ago',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pulseColor: 'bg-emerald-500',
      actionText: 'Download PDF',
    },
    {
      id: 'MT-8842',
      title: 'HVAC AC Leak Maintenance',
      serviceType: 'MAINTENANCE',
      details: 'Location: C-Block Room 302 | Assigned to Estates Team (Mechanical)',
      status: 'IN_PROGRESS',
      statusLabel: 'Technician Dispatched',
      approver: 'Rajesh Kumar (Technician)',
      updatedAt: 'Yesterday',
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
      pulseColor: 'bg-blue-500',
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2.5">
            <span>My Active Service Requests</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {mockRequests.length} Active
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time status tracking, access passes, and approval progress</p>
        </div>

        <button className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer">
          <Filter className="w-3.5 h-3.5 text-slate-500" /> Filter
        </button>
      </div>

      <div className="space-y-3">
        {mockRequests.map((req) => (
          <div
            key={req.id}
            onClick={() => onViewRequestDetail(req.id)}
            className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-indigo-300 hover:bg-white hover:shadow-subtle transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-black text-slate-900 bg-slate-200/70 px-2 py-0.5 rounded-md">
                  #{req.id}
                </span>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                  {req.title}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${req.badgeStyle} flex items-center gap-1.5`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${req.pulseColor} animate-ping`}></span>
                  {req.statusLabel}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {req.details}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-medium">
                <span>Approver: <strong className="text-slate-700 font-bold">{req.approver}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {req.updatedAt}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              {req.actionText ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Downloading official ${req.title} PDF with QR payload...`);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" /> {req.actionText}
                </button>
              ) : (
                <button className="px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all flex items-center gap-1">
                  <span>Track Status</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
