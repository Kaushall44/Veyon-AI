import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  FileCheck2, 
  ShieldCheck, 
  Shield, 
  Database,
  ChevronRight,
  Activity,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  allowedRoles?: Role[];
}

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onCloseMobile }) => {
  const { user } = useAuth();
  const location = useLocation();
  const userRole = user?.role || 'Student';

  const allNavItems: NavItem[] = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      label: 'AI Assistant', 
      path: '/assistant', 
      icon: Bot, 
      badge: 'Copilot',
      allowedRoles: ['Student', 'Faculty', 'Lab_In_Charge', 'Admin', 'Super_Admin']
    },
    { 
      label: 'My Requests', 
      path: '/requests', 
      icon: FileCheck2 
    },
    { 
      label: userRole === 'Lab_In_Charge' ? 'Lab Approvals' : 'Approvals Desk', 
      path: '/approvals', 
      icon: ShieldCheck, 
      badge: '1 Pending',
      allowedRoles: ['Faculty', 'Lab_In_Charge', 'Admin', 'Super_Admin']
    },
    { 
      label: 'Admin Overview', 
      path: '/admin', 
      icon: Activity,
      allowedRoles: ['Admin', 'Super_Admin']
    },
    { 
      label: 'Audit Console', 
      path: '/audit', 
      icon: Shield,
      allowedRoles: ['Admin', 'Super_Admin']
    },
    { 
      label: 'Knowledge Base', 
      path: '/knowledge', 
      icon: Database,
      allowedRoles: ['Admin', 'Super_Admin']
    },
  ];

  const visibleNavItems = allNavItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(userRole);
  });

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 border-r border-slate-800/80 font-sans">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-white tracking-tight leading-tight">
              SOA <span className="text-indigo-400">Nexus</span>
            </h1>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
              AI Governance Hub
            </p>
          </div>
        </div>

        {onCloseMobile && (
          <button onClick={onCloseMobile} className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role Context Pill */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow-xs">
          <div className="min-w-0 space-y-0.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Active Mode</span>
            <span className="text-xs font-bold text-indigo-300 truncate block">{userRole}</span>
          </div>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Online
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Platform Services
        </div>
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-indigo-300 font-bold border border-slate-700/80">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-70" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Institution Footer */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
        <p className="font-semibold text-slate-200">SIH 2026 • SOA University</p>
        <p className="text-[10px] text-slate-500 font-mono">ID: SOAIDEATHON-S1</p>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 min-h-screen flex-col">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Slide-out Drawer Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={onCloseMobile}></div>
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* 3. Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-white px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {visibleNavItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl text-[10px] font-bold transition-all ${
                isActive ? 'text-indigo-400 bg-indigo-950/80' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};
