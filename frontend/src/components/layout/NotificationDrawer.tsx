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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

      {/* Responsive Slide Drawer Container (S1 Design System) */}
      <div className="relative z-20 bg-[#FAF9F5] w-full sm:max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#EAE7DF] overflow-hidden">
        {/* Prominent Header Bar (Sticky Top) */}
        <div className="p-4 sm:p-5 border-b border-[#EAE7DF] flex items-center justify-between bg-white shrink-0 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center justify-center font-bold shadow-xs">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-[#1B231F] text-lg leading-tight">Notifications</h3>
              <p className="text-[11px] text-[#5A6E63] font-semibold">{unreadCount} unread alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-[#152E22] hover:text-[#1E3A2B] flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAF8F3] hover:bg-[#EFECE3] border border-[#E5E2D9]"
              >
                <Check className="w-3.5 h-3.5" /> Mark Read
              </button>
            )}

            {/* High Visibility Close Button */}
            <button
              onClick={onClose}
              title="Close Notifications"
              className="p-2 rounded-xl bg-[#FAF8F3] hover:bg-[#EFECE3] text-[#152E22] font-bold text-xs flex items-center gap-1 transition-all border border-[#E5E2D9] cursor-pointer"
            >
              <X className="w-4 h-4 text-[#152E22]" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#FAF8F3] border-b border-[#EAE7DF] flex gap-2 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeTab === 'ALL'
                ? 'bg-[#152E22] text-white font-bold shadow-xs'
                : 'text-[#5A6E63] hover:text-[#1B231F] hover:bg-[#EFECE3]'
            }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setActiveTab('UNREAD')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeTab === 'UNREAD'
                ? 'bg-[#152E22] text-white font-bold shadow-xs'
                : 'text-[#5A6E63] hover:text-[#1B231F] hover:bg-[#EFECE3]'
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
                  ? 'bg-white border-[#152E22] shadow-xs'
                  : 'bg-[#FAF8F3] border-[#E5E2D9] hover:border-[#152E22]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#1B231F] group-hover:text-[#152E22] transition-colors flex items-center gap-2">
                  {!item.isRead && <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>}
                  {item.title}
                </span>
                <span className="text-[10px] font-mono text-[#8C9C92]">{item.createdAt}</span>
              </div>

              <p className="text-xs text-[#5A6E63] leading-relaxed">{item.message}</p>

              <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-[#152E22] border-t border-[#EAE7DF]">
                <span>View Service Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#152E22] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer with Explicit Dismiss Button */}
        <div className="p-4 bg-white border-t border-[#EAE7DF] flex items-center justify-between text-xs text-[#5A6E63] font-medium shrink-0">
          <span className="font-semibold text-[11px]">SOA Real-Time Alerts</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Close Drawer</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
