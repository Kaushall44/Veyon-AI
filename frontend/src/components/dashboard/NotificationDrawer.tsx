import React from 'react';
import { Bell, CheckCircle2, Clock, ShieldAlert, X, ExternalLink } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: 'Approval Routed',
      message: 'Your AI Lab reservation request #LB-4019 has been routed to Prof. A. K. Samanta for approval.',
      time: '10 mins ago',
      type: 'APPROVAL_PENDING',
      isUnread: true,
      link: '/requests',
    },
    {
      id: 'n2',
      title: 'Certificate Signed & Generated',
      message: 'Academic Admin Officer approved your Bonafide Certificate #CERT-881. PDF is available for download.',
      time: '2 hours ago',
      type: 'COMPLETED',
      isUnread: true,
      link: '/requests',
    },
    {
      id: 'n3',
      title: 'Maintenance Ticket Assigned',
      message: 'Technician Rajesh Kumar accepted repair complaint #MT-8842 for C-Block 302 HVAC leak.',
      time: 'Yesterday',
      type: 'UPDATE',
      isUnread: false,
      link: '/requests',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-sm bg-white h-full shadow-modal border-l border-slate-200 flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Notifications & Alerts</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
              2 Unread
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onNavigate(n.link);
                onClose();
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                n.isUnread
                  ? 'bg-indigo-50/50 border-indigo-200'
                  : 'bg-slate-50/50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {n.type === 'APPROVAL_PENDING' && <Clock className="w-4 h-4 text-amber-600 shrink-0" />}
                  {n.type === 'COMPLETED' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {n.type === 'UPDATE' && <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />}
                  <h4 className="font-semibold text-xs text-slate-900">{n.title}</h4>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{n.message}</p>
              <div className="mt-2 text-[10px] font-semibold text-indigo-600 flex items-center gap-1">
                <span>View Request Details</span> <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Mark All as Read
          </button>
        </div>
      </div>
    </div>
  );
};
