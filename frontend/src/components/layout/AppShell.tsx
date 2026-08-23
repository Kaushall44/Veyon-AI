import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DemoLauncherBar } from '../demo/DemoLauncherBar';
import { Toast, ToastMessage } from '../ui/Toast';

export const AppShell: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleShowToast = (title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type: 'INFO',
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Top Hackathon Judge Evaluation Bar */}
      <DemoLauncherBar onShowToast={handleShowToast} />

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Sidebar Navigation (Desktop Fixed & Mobile Slide-out Drawer) */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

          {/* Dynamic Page Scroll Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 lg:pb-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Floating Toast Notification Alerts Component */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
};
