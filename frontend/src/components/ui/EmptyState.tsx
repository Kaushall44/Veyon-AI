import React from 'react';
import { Inbox, Search, CheckCircle2, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'There are no active items or service requests matching your criteria.',
  icon: Icon = Inbox,
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-card max-w-md mx-auto my-6 animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mx-auto shadow-xs">
        <Icon className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>

      {actionText && onAction && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 mx-auto"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
