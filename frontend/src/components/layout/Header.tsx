import React, { useState } from 'react';
import { Bell, Search, LogOut, Shield, Menu } from 'lucide-react';
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
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-subtle relative z-30">
      {/* Left: Mobile Drawer Trigger & Search Input */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all"
            title="Open Mobile Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search Input */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-48 md:w-72 text-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search policies, labs, tickets..."
            className="bg-transparent border-none outline-none w-full text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Multilingual Language Switcher Component */}
        <LanguageSwitcher />

        {/* Notifications Bell */}
        <button
          onClick={() => setIsNotifOpen(true)}
          className="relative p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Bell className="w-4 h-4 text-slate-700 animate-pulse" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-slate-200">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-200" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {user?.name ? user.name[0] : 'U'}
            </div>
          )}

          <div className="text-left hidden md:block">
            <span className="text-xs font-semibold text-slate-900 block leading-tight truncate max-w-[120px]">
              {user?.name || 'User'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium block flex items-center gap-1">
              <Shield className="w-3 h-3 text-indigo-600 inline" />
              <strong className="text-indigo-600 font-semibold">{user?.role || 'Guest'}</strong>
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out & Switch Demo Role"
            className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Flyout Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onNavigate={(path) => navigate(path)}
      />
    </header>
  );
};
