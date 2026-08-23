import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, X, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD'>('ALL');

  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-101',
      title: 'Lab Booking Approved',
      message: 'Prof. A. K. Samanta approved your AI Lab booking (#LB-4019) for tomorrow 14:00-16:00. Digital Access Pass issued.',
      type: 'APPROVED',
      isRead: false,
      createdAt: '14:02 PM',
      targetUrl: '/services/lab-booking',
    },
    {
      id: 'NOTIF-102',
      title: 'Bonafide Certificate Signed',
      message: 'Admin Officer Patnaik signed your Bonafide Certificate request (#CERT-881). Ready for PDF download.',
      type: 'APPROVED',
      isRead: false,
      createdAt: '13:45 PM',
      targetUrl: '/services/certificate',
    },
    {
      id: 'NOTIF-103',
      title: 'Maintenance Ticket Dispatched',
      message: 'Rajesh Kumar (HVAC Lead) accepted ticket #MT-8842 for C-Block Room 302.',
      type: 'IN_PROGRESS',
      isRead: true,
      createdAt: '12:10 PM',
      targetUrl: '/services/maintenance',
    },
  ]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleItemClick = (targetUrl: string, id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    onClose();
    if (onNavigate) {
      onNavigate(targetUrl);
    } else {
      navigate(targetUrl);
    }
  };

  const filtered = notifications.filter((n) => (activeTab === 'UNREAD' ? !n.isRead : true));
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end animate-fade-in font-sans">
      {/* Click Outside Backdrop Overlay */}
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

      {/* Responsive Slide Drawer Container */}
      <div className="relative z-20 bg-white w-full sm:max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 overflow-hidden">
        {/* Prominent Header Bar (Sticky Top) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold shadow-xs">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Notifications</h3>
              <p className="text-[11px] text-slate-500 font-semibold">{unreadCount} unread alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-indigo-50"
              >
                <Check className="w-3.5 h-3.5" /> Mark Read
              </button>
            )}

            {/* High Visibility Close Button */}
            <button
              onClick={onClose}
              title="Close Notifications (Esc)"
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
            >
              <span>Close</span>
              <X className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex gap-2 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'ALL' ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200/80' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setActiveTab('UNREAD')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'UNREAD' ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200/80' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* List Stream */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.targetUrl, item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                !item.isRead
                  ? 'bg-indigo-50/60 border-indigo-200 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  {!item.isRead && <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>}
                  {item.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{item.createdAt}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>

              <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-indigo-600 border-t border-slate-100">
                <span>View Service Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer with Explicit Dismiss Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium shrink-0">
          <span>SOA Real-Time Alerts</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Close Drawer</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
