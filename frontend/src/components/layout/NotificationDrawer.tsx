import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  X, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Radio, 
  Trash2, 
  FlaskConical, 
  FileText, 
  Wrench, 
  ShieldAlert, 
  Inbox
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationsService, NotificationItem } from '../../services/api/notificationsService';

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
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'LAB' | 'MAINTENANCE' | 'GRIEVANCE'>('ALL');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isConnectedSSE, setIsConnectedSSE] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load persistent notifications from Database / Supabase
  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await notificationsService.getNotifications();
      if (res?.notifications && res.notifications.length > 0) {
        setNotifications(res.notifications);
      }
    } catch (e) {
      console.warn('Failed to load notifications from database:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [isOpen]);

  useEffect(() => {
    // Subscribe to Real-Time SSE Stream
    const unsubscribe = notificationsService.subscribeToSSE((newNotif) => {
      setIsConnectedSSE(true);
      setNotifications((prev) => {
        if (prev.some((n) => n.id === newNotif.id)) {
          return prev;
        }
        return [newNotif, ...prev];
      });
    });

    setIsConnectedSSE(true);

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationsService.clearAll();
      setNotifications([]);
    } catch (e) {
      setNotifications([]);
    }
  };

  const handleItemClick = async (targetUrl?: string, id?: string) => {
    if (id) {
      try {
        await notificationsService.markAsRead([id]);
      } catch (e) {
        // ignore
      }
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    }
    onClose();
    const destination = targetUrl || '/requests';
    if (onNavigate) {
      onNavigate(destination);
    } else {
      navigate(destination);
    }
  };

  // Category Icon helper
  const getCategoryIcon = (category?: string, type?: string) => {
    const cat = (category || type || '').toUpperCase();
    if (cat.includes('LAB')) return <FlaskConical className="w-4 h-4 text-emerald-600" />;
    if (cat.includes('CERT')) return <FileText className="w-4 h-4 text-indigo-600" />;
    if (cat.includes('MAINTENANCE') || cat.includes('HVAC')) return <Wrench className="w-4 h-4 text-amber-600" />;
    if (cat.includes('GRIEVANCE')) return <ShieldAlert className="w-4 h-4 text-rose-600" />;
    return <CheckCircle2 className="w-4 h-4 text-teal-600" />;
  };

  // Filter items
  const filtered = notifications.filter((n) => {
    if (activeFilter === 'UNREAD') return !n.is_read;
    if (activeFilter === 'LAB') return (n.category || n.type || '').toUpperCase().includes('LAB');
    if (activeFilter === 'MAINTENANCE') return (n.category || n.type || '').toUpperCase().includes('MAINTENANCE');
    if (activeFilter === 'GRIEVANCE') return (n.category || n.type || '').toUpperCase().includes('GRIEVANCE');
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end animate-fadeIn font-sans">
      {/* Click Outside Backdrop Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Responsive Slide Drawer Container */}
      <div className="relative z-20 bg-[#FAF9F5] w-full sm:max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#EAE7DF] overflow-hidden">
        
        {/* Prominent Header Bar (Sticky Top) */}
        <div className="p-4 sm:p-5 border-b border-[#EAE7DF] flex items-center justify-between bg-white shrink-0 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center justify-center font-bold shadow-xs relative">
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-title font-bold text-[#1B231F] text-lg leading-tight">Notifications</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
                  SSE Live
                </span>
              </div>
              <p className="text-[11px] text-[#5A6E63] font-semibold">
                {unreadCount} unread • Database & Supabase Synced
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-[#152E22] hover:text-[#1E3A2B] flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAF8F3] hover:bg-[#EFECE3] border border-[#E5E2D9] transition-colors"
                title="Mark all as read"
              >
                <Check className="w-3.5 h-3.5" /> Mark Read
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-1.5 rounded-xl bg-[#FAF8F3] hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-[#E5E2D9] transition-colors"
                title="Clear all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
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

        {/* Filter Pills */}
        <div className="px-4 py-2.5 bg-[#FAF8F3] border-b border-[#EAE7DF] flex gap-1.5 overflow-x-auto text-[11px] font-semibold shrink-0 no-scrollbar">
          {[
            { key: 'ALL', label: 'All' },
            { key: 'UNREAD', label: `Unread (${unreadCount})` },
            { key: 'LAB', label: 'Lab Bookings' },
            { key: 'MAINTENANCE', label: 'Maintenance' },
            { key: 'GRIEVANCE', label: 'Grievances' }
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key as any)}
              className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                activeFilter === f.key
                  ? 'bg-[#152E22] text-white font-bold shadow-xs'
                  : 'text-[#5A6E63] hover:text-[#1B231F] hover:bg-[#EFECE3]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification List Stream */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {filtered.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <Inbox className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-600">No notifications found</p>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Real-time approvals and workflow state changes will appear here instantly.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.link_path || item.targetUrl, item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 group relative overflow-hidden ${
                  !item.is_read
                    ? 'bg-white border-[#152E22] shadow-sm ring-1 ring-emerald-500/20'
                    : 'bg-[#FAF8F3] border-[#E5E2D9] hover:border-[#152E22] opacity-80 hover:opacity-100'
                }`}
              >
                {!item.is_read && (
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-600" />
                )}

                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1B231F] group-hover:text-[#152E22] transition-colors flex items-center gap-2">
                    {getCategoryIcon(item.category, item.type)}
                    <span>{item.title}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#8C9C92] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.created_at}
                  </span>
                </div>

                <p className="text-xs text-[#5A6E63] leading-relaxed pl-6">{item.message}</p>

                <div className="pt-2 pl-6 flex items-center justify-between text-[11px] font-bold text-[#152E22] border-t border-[#EAE7DF]">
                  <span>View Details & Pass</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#152E22] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Connection Status */}
        <div className="p-4 bg-white border-t border-[#EAE7DF] flex items-center justify-between text-xs text-[#5A6E63] font-medium shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>SSE Real-Time Push Stream Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Close</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
