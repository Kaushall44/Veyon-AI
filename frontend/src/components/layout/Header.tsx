import React, { useState } from 'react';
import { Bell, Search, LogOut, Shield, Menu, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NotificationDrawer } from './NotificationDrawer';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-[#FAF9F5] border-b border-[#EAE7DF] px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-xs relative z-30">
      {/* Left: Mobile Drawer Trigger & Institutional Tagline */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-[#152E22] hover:bg-[#EFECE3] border border-[#E5E2D9] transition-all"
            title="Open Mobile Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#5A6E63] uppercase">
              AGENTIC AI FOR INSTITUTIONAL SERVICE DELIVERY
            </span>
          </div>
          <p className="text-[10px] text-[#8C9C92] font-semibold hidden sm:block">
            Ideathon 2026 • Problem Statement S1
          </p>
        </div>
      </div>

      {/* Right Controls (Exact Match to Image 3) */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Multilingual Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications Bell */}
        <button
          onClick={() => setIsNotifOpen(true)}
          className="relative p-2 rounded-full border border-[#E2DFD5] bg-white text-[#152E22] hover:bg-[#F3F0E6] transition-all cursor-pointer shadow-xs"
        >
          <Bell className="w-4 h-4 text-[#152E22]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2563EB] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Queue Token Badge (Exact Match to Image 3) */}
        <div className="bg-white border border-[#E2DFD5] rounded-2xl px-3 py-1 text-center shadow-xs hidden sm:block">
          <span className="text-[9px] font-mono text-[#8C9C92] font-bold block leading-none uppercase">TOKEN</span>
          <span className="text-xs font-mono font-black text-[#152E22]">A-014</span>
        </div>

        {/* User Profile Avatar Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#EAE7DF]">
          <button
            onClick={handleLogout}
            title="Log Out & Switch Persona"
            className="p-2 text-[#8C9C92] hover:text-[#B91C1C] hover:bg-[#FEE2E2] rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification Drawer Component */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onNavigate={(path) => navigate(path)}
      />
    </header>
  );
};
