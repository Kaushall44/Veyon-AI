import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'table-row' | 'chat-msg';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  count = 1,
}) => {
  const items = Array.from({ length: count });

  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-3 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="w-16 h-3 bg-slate-200 rounded-full"></div>
              <div className="w-8 h-8 rounded-xl bg-slate-200"></div>
            </div>
            <div className="w-24 h-7 bg-slate-200 rounded-lg"></div>
            <div className="w-32 h-2 bg-slate-200 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className="space-y-3">
        {items.map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle flex items-center justify-between animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200"></div>
              <div className="space-y-1.5">
                <div className="w-40 h-3 bg-slate-200 rounded-full"></div>
                <div className="w-24 h-2 bg-slate-200 rounded-full"></div>
              </div>
            </div>
            <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chat-msg') {
    return (
      <div className="space-y-4">
        {items.map((_, i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0"></div>
            <div className="space-y-2 flex-1 max-w-md">
              <div className="h-12 bg-slate-200 rounded-2xl"></div>
              <div className="w-20 h-2 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className || 'h-4 w-full'}`} />
  );
};
