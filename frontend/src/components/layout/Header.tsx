import React, { useState, useEffect } from 'react';
import { Bell, Search, LogOut, Shield, Menu, Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NotificationDrawer } from './NotificationDrawer';
import { notificationsService, NotificationItem } from '../../services/api/notificationsService';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [liveToast, setLiveToast] = useState<NotificationItem | null>(null);

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationsService.getNotifications();
      if (typeof data?.unread_count === 'number') {
        setUnreadCount(data.unread_count);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Subscribe to real-time Server-Sent Events (SSE)
    const unsubscribe = notificationsService.subscribeToSSE((newNotif) => {
      setUnreadCount((prev) => prev + 1);
      setLiveToast(newNotif);

      // Auto dismiss live toast after 6 seconds
      setTimeout(() => {
        setLiveToast((current) => (current?.id === newNotif.id ? null : current));
      }, 6000);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-[#FAF9F5] border-b border-[#EAE7DF] px-3 sm:px-8 flex items-center justify-between shrink-0 shadow-xs relative z-30 overflow-visible">
      {/* Left: Mobile Drawer Trigger & Institutional Tagline */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-[#152E22] hover:bg-[#EFECE3] border border-[#E5E2D9] transition-all shrink-0 cursor-pointer"
            title="Open Mobile Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/veyon_logo.png"
            alt="Veyon"
            className="w-7 h-7 object-contain rounded-lg lg:hidden"
          />
          <div className="min-w-0">
            <span className="hidden sm:block text-[10px] font-mono font-bold tracking-widest text-[#5A6E63] uppercase truncate">
              VEYON • AGENTIC AI SERVICE DELIVERY
            </span>
            <span className="sm:hidden font-serif-title font-bold text-sm text-[#152E22] leading-tight block">
              VEYON
            </span>
            <p className="text-[10px] text-[#8C9C92] font-semibold hidden sm:block">
              Human-in-the-Loop Institutional Platform
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Multilingual Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications Bell */}
        <button
          onClick={() => {
            setIsNotifOpen(true);
            setUnreadCount(0);
          }}
          className="relative p-2 rounded-full border border-[#E2DFD5] bg-white text-[#152E22] hover:bg-[#F3F0E6] transition-all cursor-pointer shadow-xs shrink-0"
        >
          <Bell className="w-4 h-4 text-[#152E22]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2563EB] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Queue Token Badge */}
        <div className="bg-white border border-[#E2DFD5] rounded-2xl px-2.5 py-1 text-center shadow-xs hidden md:block shrink-0">
          <span className="text-[9px] font-mono text-[#8C9C92] font-bold block leading-none uppercase">TOKEN</span>
          <span className="text-xs font-mono font-black text-[#152E22]">A-014</span>
        </div>

        {/* User Profile Avatar Pill */}
        <div className="flex items-center gap-1 pl-1 sm:pl-2 border-l border-[#EAE7DF]">
          <button
            onClick={handleLogout}
            title="Log Out & Switch Persona"
            className="p-2 text-[#8C9C92] hover:text-[#B91C1C] hover:bg-[#FEE2E2] rounded-xl transition-all shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-Time Floating Approval Toast */}
      {liveToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#152E22] text-white border border-[#2D5A44] p-4 rounded-2xl shadow-2xl max-w-sm w-full animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#4ADE80] shrink-0" />
              <h4 className="font-bold text-xs text-white">{liveToast.title}</h4>
            </div>
            <button
              onClick={() => setLiveToast(null)}
              className="text-[#8C9C92] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-[#D1FAE5] mt-1.5 leading-relaxed font-sans">
            {liveToast.message}
          </p>
          <div className="mt-3 flex items-center justify-end">
            <button
              onClick={() => {
                setLiveToast(null);
                navigate(liveToast.link_path || '/requests');
              }}
              className="px-3 py-1 rounded-full bg-white text-[#152E22] font-bold text-[10px] hover:bg-[#FAF8F3] transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Notification Drawer Component */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onNavigate={(path) => navigate(path)}
      />
    </header>
  );
};
