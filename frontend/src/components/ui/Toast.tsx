import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'SUCCESS' | 'WARNING' | 'INFO' | 'ERROR';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        onDismiss(toasts[0].id);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl border shadow-modal flex items-start justify-between gap-3 animate-fade-in ${
            toast.type === 'SUCCESS'
              ? 'bg-emerald-950 text-white border-emerald-500/40'
              : toast.type === 'WARNING'
              ? 'bg-amber-950 text-white border-amber-500/40'
              : toast.type === 'ERROR'
              ? 'bg-red-950 text-white border-red-500/40'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              {toast.type === 'SUCCESS' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'WARNING' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toast.type === 'ERROR' && <XCircle className="w-5 h-5 text-red-400" />}
              {toast.type === 'INFO' && <Info className="w-5 h-5 text-indigo-400" />}
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs">{toast.title}</h4>
              <p className="text-[11px] text-slate-300 leading-snug">{toast.message}</p>
            </div>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
