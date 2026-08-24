import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Clock, 
  Grid, 
  ShieldAlert, 
  FileText, 
  Bell, 
  ChevronRight, 
  X,
  UserCheck,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
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
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'AI Assistant', path: '/assistant', icon: Bot },
    { label: 'My Requests', path: '/requests', icon: Clock },
    { label: 'Services', path: '/services/lab-booking', icon: Grid },
    { label: 'Grievances', path: '/services/grievance', icon: ShieldAlert },
    { label: 'Documents', path: '/services/certificate', icon: FileText },
    { 
      label: userRole === 'Lab_In_Charge' ? 'Approvals' : 'Approvals Desk', 
      path: '/approvals', 
      icon: UserCheck, 
      allowedRoles: ['Faculty', 'Lab_In_Charge', 'Admin', 'Super_Admin']
    },
    { 
      label: 'Admin Console', 
      path: '/admin', 
      icon: ShieldAlert, 
      allowedRoles: ['Admin', 'Super_Admin']
    },
  ];

  const visibleNavItems = allNavItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(userRole);
  });

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#FAF9F5] text-[#1B231F] border-r border-[#EAE7DF] font-sans">
      {/* S1 Brand Header (Exact Match to Image 3) */}
      <div className="p-6 border-b border-[#EAE7DF] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif-title text-3xl font-bold tracking-tight text-[#152E22]">S1</span>
          <div className="space-y-0.5 border-l border-[#D9D5C7] pl-2.5">
            <span className="text-[10px] font-bold tracking-widest text-[#5A6E63] uppercase block leading-tight">
              SERVICE DIRECTORY
            </span>
          </div>
        </div>

        {onCloseMobile && (
          <button onClick={onCloseMobile} className="lg:hidden p-1.5 rounded-lg text-[#5A6E63] hover:bg-[#EFECE3]">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#EFECE3] text-[#152E22] shadow-xs'
                    : 'text-[#5A6E63] hover:text-[#1B231F] hover:bg-[#F3F0E6]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-30" />
            </NavLink>
          );
        })}
      </nav>

      {/* Queue Counter Status Pill (Exact Match to Image 3) */}
      <div className="px-5 py-3 border-t border-[#EAE7DF]">
        <div className="text-[11px] font-bold text-[#5A6E63] uppercase tracking-wider block mb-1">
          QUEUE STATUS
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#152E22]">
          <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
          <span>Counter open</span>
        </div>
      </div>

      {/* User Profile Card at Bottom (Exact Match to Image 3) */}
      <div className="p-4 border-t border-[#EAE7DF] bg-[#FAF8F3]">
        <div className="bg-white border border-[#E5E2D9] rounded-2xl p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#E5E2D9] text-[#152E22] font-bold text-xs flex items-center justify-center shrink-0">
              KR
            </div>
            <div className="min-w-0">
              <span className="font-bold text-xs text-[#1B231F] truncate block">
                {user?.name || 'Kaushal Raj Gupta'}
              </span>
              <span className="text-[10px] text-[#5A6E63] font-medium block truncate">
                2023-CSE-042
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 min-h-screen flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-out Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onCloseMobile}></div>
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Strip */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F5] border-t border-[#EAE7DF] px-2 py-2 flex items-center justify-around shadow-lg">
        {visibleNavItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold transition-all ${
                isActive ? 'text-[#152E22] bg-[#EFECE3]' : 'text-[#5A6E63] hover:text-[#1B231F]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[64px]">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};
